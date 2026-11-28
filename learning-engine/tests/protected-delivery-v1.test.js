'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {ProtectedDelivery:Delivery,PublicQuestion:Public}=require('../index');
function fixture(overrides={}){
 let serverTime=1000000,graded=0,revealed=0,plans=0;
 const displayed=new Map();
 const bank={
  async plan({bankId,requestedCount}){
   plans+=1;
   return Array.from({length:requestedCount},(_,n)=>({
    bankId,id:'question-'+(n+1),revision:1
   }));
  },
  async present({ref,instanceId}){
   revealed+=1;
   return {
    instanceId,ref,
    prompt:'Select the best matching answer.',
    responseSpec:{kind:'single-choice',options:[
      {id:'option-a',label:'Left',correct:false,weight:0.25},
      {id:'option-b',label:'Right',correct:true,weight:0.75}
    ]},
    assessmentSpec:{correctOptionId:'option-b'},
    secretKey:'PRIVATE_KEY'
   };
  },
  async grade({answer}){
   graded+=1;
   return {status:answer==='option-b'?'correct':'incorrect',
     secret:'DO_NOT_SHARE_PRIVATE_RUBRIC'};
  }
 };
 const authenticate=async(context)=>{
  if(context?.token==='alice')return {tenantId:'school',subjectId:'alice'};
  if(context?.token==='bob')return {tenantId:'school',subjectId:'bob'};
  throw new Error('secret auth stack trace');
 };
 const clock=()=>serverTime;
 const settings={
  maxQuestionsPerSession:100,
  minRevealIntervalMs:30000,
  maxRevealsPerHour:60,
  maxRevealsPerDay:120,
  maxSessionsPerDay:2,
  sessionTtlMs:6*60*60*1000,
  maxInvalidSubmissions:4,
  ...overrides.limits
 };
 const gate=Delivery.createProtectedDelivery({
  authenticate,bank,store:Delivery.createInMemoryStore(),
  now:clock,limits:settings,allowInMemoryForTests:true
 });
 const forAlice=()=>({context:{token:'alice'}});
 const create=(count=100,mode='train',context={token:'alice'})=>gate.createSession({
  context,bankId:'physics',requestedCount:count,mode});
 const issue=async(sessionId,context={token:'alice'})=>{
  const result=await gate.nextQuestion({context,sessionId});
  if(result.status==='question')
   displayed.set(result.question.instanceId,result.question);
  return result;
 };
 const answer=(sessionId,instanceId,response='option-b',context={token:'alice'})=>{
  const label=response==='option-b'?'Right':
    response==='option-a'?'Left':null;
  const visible=displayed.get(instanceId);
  const selected=label&&visible?.responseSpec.options.find(x=>x.label===label);
  return gate.submitAnswer({context,sessionId,instanceId,
    response:selected?selected.id:response});
 };
 return {gate,bank,create,issue,answer,forAlice,
  advance:ms=>{serverTime+=ms},
  time:()=>serverTime,
  counts:()=>({graded,revealed,plans})};
}
const errorCode=code=>err=>err&&err.code===code;
test('one-question delivery: requesting 100 never discloses the plan or 100 questions',async()=>{
 const f=fixture();
 const started=await f.create(100);
 assert.equal(started.status,'started');
 assert.equal(started.progress.requested,100);
 assert.equal(JSON.stringify(started).includes('question-'),false);
 const first=await f.issue(started.sessionId);
 assert.equal(first.status,'question');
 assert.equal(first.progress.issued,1);
 assert.equal(first.progress.answered,0);
 const text=JSON.stringify(first);
 assert.equal(text.includes('question-1'),false); // hidden private ref
 assert.equal(text.includes('option-a'),false);
 assert.equal(text.includes('option-b'),false);
 assert.equal(first.question.responseSpec.options.every(x=>
   /^choice-[a-f0-9]{32}$/.test(x.id)),true);
 for(const secret of ['"ref"','assessmentSpec','correctOptionId',
    '"correct":true','weight','PRIVATE_KEY','DO_NOT_SHARE_PRIVATE_RUBRIC'])
  assert.equal(text.includes(secret),false,secret);
 const repeated=await f.issue(started.sessionId);
 assert.equal(repeated.resumed,true);
 assert.equal(repeated.question.instanceId,first.question.instanceId);
 assert.equal(f.counts().revealed,1);
 assert.deepEqual(Object.keys(first.question).sort(),
  ['schemaVersion','sessionId','instanceId','prompt','responseSpec','media'].sort());
});
test('server timer blocks high-speed scraping even when user selects 100',async()=>{
 const f=fixture();
 const s=await f.create(100);
 const first=await f.issue(s.sessionId);
 await f.answer(s.sessionId,first.question.instanceId);
 await assert.rejects(f.issue(s.sessionId),err=>
   err.code==='cooldown'&&err.retryAfterMs===30000);
 const many=await Promise.allSettled(Array.from({length:100},()=>f.issue(s.sessionId)));
 assert.equal(many.filter(x=>x.status==='fulfilled').length,0);
 assert.equal(f.counts().revealed,1);
 f.advance(29999);
 await assert.rejects(f.issue(s.sessionId),errorCode('cooldown'));
 f.advance(1);
 const next=await f.issue(s.sessionId);
 assert.equal(next.progress.issued,2);
 assert.equal(f.counts().revealed,2);
});
test('caller-supplied timestamps cannot bypass the server clock',async()=>{
 const f=fixture();
 const s=await f.create(2);
 const q=await f.issue(s.sessionId);
 await f.answer(s.sessionId,q.question.instanceId);
 await assert.rejects(f.gate.nextQuestion({context:{token:'alice'},
  sessionId:s.sessionId,now:999999999999,elapsedMs:100000}),
  errorCode('cooldown'));
});
test('parallel next calls do not issue many questions or duplicate quota usage',async()=>{
 const f=fixture();
 const s=await f.create(4);
 const responses=await Promise.all(Array.from({length:20},()=>f.issue(s.sessionId)));
 assert.equal(responses.every(x=>x.question.instanceId===
   responses[0].question.instanceId),true);
 assert.equal(f.counts().revealed,1);
 assert.equal((await f.gate.summary({context:{token:'alice'},
  sessionId:s.sessionId})).progress.issued,1);
});
test('authentication and session ownership are mandatory on every operation',async()=>{
 const f=fixture();
 await assert.rejects(f.gate.createSession({context:{token:'fake'},
   bankId:'physics',requestedCount:1}),errorCode('unauthorized'));
 const s=await f.create(2);
 await assert.rejects(f.issue(s.sessionId,{token:'bob'}),errorCode('session_not_found'));
 await assert.rejects(f.answer(s.sessionId,'invalid', 'option-b',
  {token:'bob'}),errorCode('session_not_found'));
 await assert.rejects(f.gate.summary({context:{token:'bob'},
  sessionId:s.sessionId}),errorCode('session_not_found'));
 await assert.rejects(f.issue('A'.repeat(43)),errorCode('session_not_found'));
});
test('only one active session and a daily start cap stop session farming',async()=>{
 const f=fixture({limits:{maxSessionsPerDay:1}});
 const s=await f.create(1);
 await assert.rejects(f.create(1),errorCode('session_quota'));
 const q=await f.issue(s.sessionId);
 await f.answer(s.sessionId,q.question.instanceId);
 await assert.rejects(f.create(1),errorCode('session_quota'));
 const f2=fixture();
 await f2.create(1);
 await assert.rejects(f2.create(1),errorCode('active_session_exists'));
});
test('session limit rejects 101 questions and invalid counts, but allows 100',async()=>{
 const f=fixture();
 for(const count of [0,101,-1,2.5,'100',NaN,Infinity]){
  await assert.rejects(f.create(count),errorCode('invalid_session_request'));
 }
 const s=await f.create(100);
 assert.equal(s.progress.requested,100);
});
test('hourly and daily budgets are enforced across question issuances',async()=>{
 const f=fixture({limits:{
  maxRevealsPerHour:2,maxRevealsPerDay:2,
  minRevealIntervalMs:10000,sessionTtlMs:2*60*60*1000
 }});
 const s=await f.create(3);
 for(let i=0;i<2;i++){
  const q=await f.issue(s.sessionId);
  await f.answer(s.sessionId,q.question.instanceId);
  f.advance(10000);
 }
 await assert.rejects(f.issue(s.sessionId),errorCode('hourly_quota'));
 f.advance(60*60*1000);
 await assert.rejects(f.issue(s.sessionId),errorCode('daily_quota'));
 assert.equal(f.counts().revealed,2);
});
test('answers are single-use and instance-bound, with no raw responses returned',async()=>{
 const f=fixture();
 const s=await f.create(2);
 const q=await f.issue(s.sessionId);
 await assert.rejects(f.answer(s.sessionId,'invalid','option-b'),
  errorCode('question_not_active'));
 const grade=await f.answer(s.sessionId,q.question.instanceId,'option-b');
 assert.equal(grade.status,'recorded');
 assert.equal(grade.feedback.status,'correct');
 assert.equal(JSON.stringify(grade).includes('DO_NOT_SHARE'),false);
 assert.equal((await f.answer(s.sessionId,q.question.instanceId)).status,
   'already_recorded');
 assert.equal(f.counts().graded,1);
});
test('exam mode hides feedback until all questions are completed',async()=>{
 const f=fixture();
 const s=await f.create(2,'test');
 const q1=await f.issue(s.sessionId);
 const grade1=await f.answer(s.sessionId,q1.question.instanceId,'option-b');
 assert.equal('feedback' in grade1,false);
 const incomplete=await f.gate.summary({context:{token:'alice'},
  sessionId:s.sessionId});
 assert.equal('results' in incomplete,false);
 f.advance(30000);
 const q2=await f.issue(s.sessionId);
 const grade2=await f.answer(s.sessionId,q2.question.instanceId,'option-a');
 assert.equal('feedback' in grade2,false);
 const end=await f.gate.summary({context:{token:'alice'},sessionId:s.sessionId});
 assert.deepEqual(end.results,{
  correct:1,incorrect:1,partial:0,'needs-review':0,ungraded:0});
 assert.equal(end.status,'completed');
 assert.equal('question' in end,false);
 assert.equal((await f.issue(s.sessionId)).status,'completed');
});
test('invalid submissions are bounded and never unlock another question',async()=>{
 const f=fixture({limits:{maxInvalidSubmissions:2}});
 const s=await f.create(2);
 const q=await f.issue(s.sessionId);
 const one=await f.answer(s.sessionId,q.question.instanceId,{'object':'malformed'});
 assert.equal(one.status,'invalid_answer');
 const two=await f.answer(s.sessionId,q.question.instanceId,
  'x'.repeat(9999));
 assert.equal(two.status,'invalid_answer');
 assert.equal(two.remainingSubmissions,0);
 await assert.rejects(f.answer(s.sessionId,q.question.instanceId,'option-b'),
  errorCode('invalid_answer_limit'));
 const still=await f.issue(s.sessionId);
 assert.equal(still.question.instanceId,q.question.instanceId);
 assert.equal(f.counts().graded,0);
});
test('private bank errors fail closed and never leak internal details',async()=>{
 const f=fixture();
 const original=f.bank.present;
 f.bank.present=async()=>{throw Error('db password is 123')};
 const s=await f.create(2);
 await assert.rejects(f.issue(s.sessionId),err=>
  err.code==='private_bank_unavailable'&&!err.message.includes('password'));
 assert.equal((await f.gate.summary({context:{token:'alice'},
  sessionId:s.sessionId})).progress.issued,0);
 f.bank.present=original;
 const q=await f.issue(s.sessionId);
 assert.equal(q.progress.issued,1);
 const grade=f.bank.grade;
 f.bank.grade=async()=>{throw Error('proprietary rubric secret')};
 await assert.rejects(f.answer(s.sessionId,q.question.instanceId),
  err=>err.code==='private_grading_unavailable'&&
    !err.message.includes('secret'));
 f.bank.grade=grade;
 assert.equal((await f.answer(s.sessionId,q.question.instanceId)).status,'recorded');
});
test('bank plan mismatch and duplicate refs reject before session creation',async()=>{
 const f=fixture();
 const old=f.bank.plan;
 f.bank.plan=async()=>[{bankId:'private',id:'q-one',revision:1}];
 await assert.rejects(f.create(1),errorCode('private_bank_unavailable'));
 f.bank.plan=async()=>Array(2).fill({bankId:'physics',id:'q-one',revision:1});
 await assert.rejects(f.create(2),errorCode('private_bank_unavailable'));
 f.bank.plan=old;
 const s=await f.create(2);
 assert.equal(s.progress.requested,2);
});
test('private media must be an authorized expiring asset path',()=>{
 const p={
  instanceId:'opaque-instance',ref:{bankId:'radiology',id:'scan-1',revision:1},
  prompt:'What structure?',responseSpec:{kind:'numeric'}
 };
 assert.throws(()=>Public.toProtectedQuestion(p,{sessionId:'s',
  media:[{id:'img-1',type:'image',url:'https://cdn.example.org/secret.jpg',
   alt:'Example'}]}),/authorized expiring/);
 const q=Public.toProtectedQuestion(p,{sessionId:'s',
  media:[{id:'img-1',type:'image',url:'/api/learning/media/'+
   'A'.repeat(40),alt:'Example'}]});
 assert.equal(q.media.length,1);
 assert.equal('ref' in q,false);
 assert.equal(q.schemaVersion,'learning-protected-question.v1');
});
test('reverse time changes fail closed; request timestamps cannot rewind quotas',async()=>{
 const f=fixture();
 const s=await f.create(2);
 const q=await f.issue(s.sessionId);
 await f.answer(s.sessionId,q.question.instanceId);
 f.advance(-100);
 await assert.rejects(f.issue(s.sessionId),errorCode('clock_regressed'));
 f.advance(100);
 await assert.rejects(f.issue(s.sessionId),errorCode('cooldown'));
});
test('test memory adapter cannot silently be used for production',()=>{
 assert.throws(()=>Delivery.createProtectedDelivery({
  authenticate:async()=>({tenantId:'org',subjectId:'user'}),
  bank:{plan:async()=>[],present:async()=>{},grade:async()=>({status:'correct'})},
  store:Delivery.createInMemoryStore()
 }),errorCode('non_durable_store'));
});
test('the API does not expose bulk questions, private plans or a client clock control',()=>{
 const exposed=Object.keys(Delivery.createProtectedDelivery({
  authenticate:async()=>({tenantId:'org',subjectId:'user'}),
  bank:{plan:async()=>[],present:async()=>{},grade:async()=>({status:'correct'})},
  store:Delivery.createInMemoryStore(),allowInMemoryForTests:true
 }));
 assert.deepEqual(exposed,['createSession','nextQuestion','submitAnswer','summary']);
});

test('global cooldown follows the same account across completed sessions',async()=>{
 const f=fixture();
 const first=await f.create(1);
 const q=await f.issue(first.sessionId);
 await f.answer(first.sessionId,q.question.instanceId);
 const second=await f.create(1);
 await assert.rejects(f.issue(second.sessionId),errorCode('cooldown'));
 f.advance(30000);
 const later=await f.issue(second.sessionId);
 assert.equal(later.progress.issued,1);
 assert.equal(f.counts().revealed,2);
});
test('the security interval cannot be weakened to 1 second by configuration',()=>{
 assert.throws(()=>fixture({limits:{minRevealIntervalMs:1000}}),
  errorCode('invalid_limits'));
});
test('an expired active session cannot be resumed by guessing its ID',async()=>{
 const f=fixture({limits:{sessionTtlMs:60000}});
 const s=await f.create(2);
 await f.issue(s.sessionId);
 f.advance(60000);
 await assert.rejects(f.issue(s.sessionId),errorCode('session_not_found'));
});
test('a second principal has its own quota, making external anti-sybil protection mandatory',async()=>{
 const f=fixture();
 const alice=await f.create(1);
 const bob=await f.create(1,'train',{token:'bob'});
 const q1=await f.issue(alice.sessionId);
 const q2=await f.issue(bob.sessionId,{token:'bob'});
 assert.notEqual(q1.question.instanceId,q2.question.instanceId);
 assert.equal(f.counts().revealed,2);
});

test('client choice IDs are per-instance, opaque, and translated only for private grading',async()=>{
 const f=fixture();
 const s=await f.create(2);
 const a=await f.issue(s.sessionId);
 const firstOptions=a.question.responseSpec.options.map(o=>o.id);
 assert.equal(firstOptions.some(x=>x==='option-a'||x==='option-b'),false);
 await f.answer(s.sessionId,a.question.instanceId,'option-b');
 f.advance(30000);
 const b=await f.issue(s.sessionId);
 const nextOptions=b.question.responseSpec.options.map(o=>o.id);
 assert.equal(nextOptions.some(id=>firstOptions.includes(id)),false);
 assert.equal((await f.answer(s.sessionId,b.question.instanceId,'option-a'))
   .feedback.status,'incorrect');
 assert.deepEqual((await f.gate.summary({context:{token:'alice'},
   sessionId:s.sessionId})).results,{
    correct:1,incorrect:1,partial:0,'needs-review':0,ungraded:0
   });
});
test('client cannot send the private canonical ID directly to infer the answer',async()=>{
 const f=fixture();
 const s=await f.create(1);
 const q=await f.issue(s.sessionId);
 const result=await f.gate.submitAnswer({context:{token:'alice'},
   sessionId:s.sessionId,instanceId:q.question.instanceId,response:'option-b'});
 assert.equal(result.status,'invalid_answer');
 assert.equal(f.counts().graded,0);
 assert.equal((await f.answer(s.sessionId,q.question.instanceId))
   .feedback.status,'correct');
});

test('ordering questions use opaque choices and are graded in the original semantic order',async()=>{
 let serverTime=1000000,gradedAnswer;
 const bank={
  async plan(){return [{bankId:'logic',id:'order-1',revision:1}]},
  async present(){return {
   prompt:'Sort three steps into order',
   responseSpec:{kind:'ordering',options:[
    {id:'step-one',label:'First'},
    {id:'step-two',label:'Second'},
    {id:'step-three',label:'Third'}
   ]},correctOrder:['step-one','step-two','step-three']
  }},
  async grade({answer}){
   gradedAnswer=answer;
   return {status:JSON.stringify(answer)===
    JSON.stringify(['step-one','step-two','step-three'])?'correct':'incorrect'};
  }
 };
 const gate=Delivery.createProtectedDelivery({
  authenticate:async()=>({tenantId:'synthetic',subjectId:'learner'}),
  bank,store:Delivery.createInMemoryStore(),now:()=>serverTime,
  allowInMemoryForTests:true
 });
 const s=await gate.createSession({context:{},bankId:'logic',requestedCount:1});
 const issued=await gate.nextQuestion({context:{},sessionId:s.sessionId});
 assert.equal(issued.question.responseSpec.options.every(x=>
  x.id.startsWith('choice-')),true);
 const ordered=['First','Second','Third'].map(label=>
  issued.question.responseSpec.options.find(x=>x.label===label).id);
 const recorded=await gate.submitAnswer({context:{},sessionId:s.sessionId,
  instanceId:issued.question.instanceId,response:ordered});
 assert.equal(recorded.feedback.status,'correct');
 assert.deepEqual(gradedAnswer,['step-one','step-two','step-three']);
});
test('numeric answers remain numeric and protected images never expose source asset IDs',async()=>{
 let received;
 const bank={
  async plan(){return [{bankId:'math',id:'problem-1',revision:1}]},
  async present(){return {
   prompt:'What is six times seven?',responseSpec:{kind:'numeric'},
   media:[{id:'private-asset-src',type:'image',
    url:'/api/learning/media/'+'Q'.repeat(40),alt:'Simple diagram'}]
  }},
  async grade({answer}){received=answer;return {status:answer===42?'correct':'incorrect'}}
 };
 const gate=Delivery.createProtectedDelivery({
  authenticate:async()=>({tenantId:'synthetic',subjectId:'learner'}),
  bank,store:Delivery.createInMemoryStore(),allowInMemoryForTests:true
 });
 const s=await gate.createSession({context:{},bankId:'math',requestedCount:1});
 const issued=await gate.nextQuestion({context:{},sessionId:s.sessionId});
 assert.equal(issued.question.media[0].id,'image-1');
 assert.equal(JSON.stringify(issued).includes('private-asset-src'),false);
 const res=await gate.submitAnswer({context:{},sessionId:s.sessionId,
  instanceId:issued.question.instanceId,response:42});
 assert.equal(res.feedback.status,'correct');
 assert.equal(received,42);
});
