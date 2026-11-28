/* Protected question delivery v1.
 * Server-only, storage-transaction backed, no authored questions or private
 * selection/grading algorithms. Never import this module from browser bundles.
 */
'use strict';
const {randomBytes}=require('node:crypto');
const {toProtectedQuestion}=require('./public-question-v1');
const ID=/^[a-z][a-z0-9-]{1,95}$/;
const HOUR=60*60*1000, DAY=24*HOUR;
const defaults=Object.freeze({
  maxQuestionsPerSession:100,
  minRevealIntervalMs:30000,
  maxRevealsPerHour:60,
  maxRevealsPerDay:120,
  maxSessionsPerDay:2,
  sessionTtlMs:6*HOUR,
  maxInvalidSubmissions:4,
  maxAnswerBytes:2048
});
const validToken=value=>typeof value==='string'&&ID.test(value);
const isObj=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const clone=value=>structuredClone(value);
function reject(code,retryAfterMs=0){
  const error=new Error('Protected question delivery rejected: '+code);
  error.code=code;
  if(retryAfterMs>0)error.retryAfterMs=Math.ceil(retryAfterMs);
  return error;
}
function assert(ok,code){if(!ok)throw reject(code);}
function safeClock(now){
  const value=now();
  assert(Number.isSafeInteger(value)&&value>=0&&value<=4102444800000,'clock_unavailable');
  return value;
}
function validateLimits(overrides){
  assert(isObj(overrides),'invalid_limits');
  const values={...defaults,...overrides};
  assert(Object.keys(overrides).every(k=>Object.hasOwn(defaults,k)),'invalid_limits');
  const ranges={
    maxQuestionsPerSession:[1,100],minRevealIntervalMs:[10000,300000],
    maxRevealsPerHour:[1,1000],maxRevealsPerDay:[1,3000],
    maxSessionsPerDay:[1,24],sessionTtlMs:[60000,7*DAY],
    maxInvalidSubmissions:[1,10],maxAnswerBytes:[32,8192]
  };
  for(const [key,[minimum,maximum]] of Object.entries(ranges))
    assert(Number.isSafeInteger(values[key])&&values[key]>=minimum&&
      values[key]<=maximum,'invalid_limits');
  assert(values.maxRevealsPerDay>=values.maxRevealsPerHour,'invalid_limits');
  return Object.freeze(values);
}
function validateIdentity(value){
  assert(isObj(value)&&typeof value.tenantId==='string'&&
    typeof value.subjectId==='string'&&
    value.tenantId.length>0&&value.tenantId.length<=128&&
    value.subjectId.length>0&&value.subjectId.length<=128&&
    !/[\x00-\x1f\x7f]/.test(value.tenantId)&&
    !/[\x00-\x1f\x7f]/.test(value.subjectId),'unauthorized');
  // Do not persist or expose any other claim from an auth provider.
  return {tenantId:value.tenantId,subjectId:value.subjectId};
}
function identityKey(identity){
  return identity.tenantId+'\x00'+identity.subjectId;
}
function initialState(){
  return {lastClockAt:null,lastRevealAt:null,starts:[],reveals:[],sessions:[]};
}
function cleanState(state,now){
  assert(isObj(state)&&Array.isArray(state.starts)&&Array.isArray(state.reveals)&&
    Array.isArray(state.sessions),'storage_unavailable');
  if(state.lastClockAt!==null&&now<state.lastClockAt)
    throw reject('clock_regressed');
  state.lastClockAt=now;
  state.starts=state.starts.filter(t=>Number.isSafeInteger(t)&&t>now-DAY);
  state.reveals=state.reveals.filter(t=>Number.isSafeInteger(t)&&t>now-DAY);
  state.sessions=state.sessions.filter(s=>s.expiresAt>now);
}
function safeProgress(session){
  return {requested:session.refs.length,issued:session.issued,
    answered:session.answered};
}
function elapsedGate(state,now,settings){
  if(state.lastRevealAt!==null){
    const wait=state.lastRevealAt+settings.minRevealIntervalMs-now;
    if(wait>0)throw reject('cooldown',wait);
  }
  const hourly=state.reveals.filter(t=>t>now-HOUR);
  if(hourly.length>=settings.maxRevealsPerHour)
    throw reject('hourly_quota',hourly[0]+HOUR-now);
  if(state.reveals.length>=settings.maxRevealsPerDay)
    throw reject('daily_quota',state.reveals[0]+DAY-now);
}
function validateRef(ref,bankId){
  assert(isObj(ref)&&validToken(ref.bankId)&&validToken(ref.id)&&
    Number.isSafeInteger(ref.revision)&&ref.revision>=1&&
    ref.bankId===bankId,'invalid_private_plan');
  return {bankId:ref.bankId,id:ref.id,revision:ref.revision};
}
function validatePlan(rows,count,bankId){
  assert(Array.isArray(rows)&&rows.length===count,'invalid_private_plan');
  const refs=rows.map(row=>validateRef(row,bankId));
  const unique=new Set(refs.map(row=>row.bankId+'/'+row.id+'/'+row.revision));
  assert(unique.size===refs.length,'duplicate_private_question');
  return refs;
}
function validateAnswer(answer,spec,maxBytes){
  const kind=spec.kind;
  assert(kind==='single-choice'||kind==='numeric'||kind==='ordering',
    'invalid_answer');
  const allowed=kind==='numeric'?null:spec.options.map(x=>x.id);
  if(kind==='single-choice'){
    assert(typeof answer==='string'&&allowed.includes(answer),
      'invalid_answer');
  }else if(kind==='numeric'){
    assert((typeof answer==='number'&&Number.isFinite(answer))||
      (typeof answer==='string'&&answer.length<=100&&
       /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(answer.trim())&&
       Number.isFinite(Number(answer.trim()))),'invalid_answer');
  }else{
    assert(Array.isArray(answer)&&answer.length===allowed.length&&
      new Set(answer).size===allowed.length&&
      answer.every(id=>typeof id==='string'&&allowed.includes(id)),
      'invalid_answer');
  }
  let size;
  try{size=Buffer.byteLength(JSON.stringify(answer),'utf8')}
  catch(_){throw reject('invalid_answer')}
  assert(size<=maxBytes,'answer_too_large');
  return answer;
}
function createInMemoryStore(){
  const data=new Map(),locks=new Map();
  return {
    developmentOnly:true,
    async transact(key,run){
      assert(typeof key==='string'&&key.length>0,'storage_unavailable');
      const preceding=locks.get(key)||Promise.resolve();
      let release;
      const gate=new Promise(resolve=>{release=resolve});
      locks.set(key,gate);
      await preceding;
      try{
        const copyOfState=clone(data.get(key)||initialState());
        const result=await run(copyOfState);
        data.set(key,copyOfState);
        return clone(result);
      }finally{
        release();
        if(locks.get(key)===gate)locks.delete(key);
      }
    }
  };
}
// Store must implement *atomic cross-worker* account-scoped transactions.
// In-memory adapter is explicitly test-only and rejected by default.
function createProtectedDelivery({
  authenticate,bank,store,now=Date.now,limits={},
  allowInMemoryForTests=false
}={}){
  assert(typeof authenticate==='function','missing_authentication');
  assert(isObj(bank)&&typeof bank.plan==='function'&&
    typeof bank.present==='function'&&typeof bank.grade==='function',
    'missing_private_bank_ports');
  assert(isObj(store)&&typeof store.transact==='function',
    'missing_transaction_store');
  assert(allowInMemoryForTests===true||store.developmentOnly!==true,
    'non_durable_store');
  assert(typeof now==='function','clock_unavailable');
  const settings=validateLimits(limits);
  async function owner(context){
    let verified;
    try{verified=await authenticate(context)}
    catch(_){throw reject('unauthorized')}
    const identity=validateIdentity(verified);
    return {identity,key:identityKey(identity)};
  }
  async function transact(context,callback){
    const {identity,key}=await owner(context);
    const currentTime=safeClock(now);
    try{
      return await store.transact(key,async state=>{
        cleanState(state,currentTime);
        return callback(state,currentTime,identity);
      });
    }catch(error){
      if(error&&typeof error.code==='string')throw error;
      // Never echo a database, authentication or private bank exception.
      throw reject('service_unavailable');
    }
  }
  function findSession(state,sessionId,nowMs){
    assert(typeof sessionId==='string'&&sessionId.length===43&&
      /^[A-Za-z0-9_-]+$/.test(sessionId),'session_not_found');
    const row=state.sessions.find(s=>s.id===sessionId);
    assert(row&&row.expiresAt>nowMs,'session_not_found');
    return row;
  }
  async function createSession({context,bankId,requestedCount,mode='train'}={}){
    assert(validToken(bankId)&&Number.isSafeInteger(requestedCount)&&
      requestedCount>=1&&requestedCount<=settings.maxQuestionsPerSession,
      'invalid_session_request');
    assert(['train','test'].includes(mode),'invalid_session_request');
    return transact(context,async(state,at,identity)=>{
      if(state.starts.length>=settings.maxSessionsPerDay)
        throw reject('session_quota',state.starts[0]+DAY-at);
      if(state.sessions.some(s=>s.phase==='active'))
        throw reject('active_session_exists');
      let refs;
      try{
        refs=validatePlan(await bank.plan({
          identity,bankId,requestedCount,mode
        }),requestedCount,bankId);
      }catch(error){
        if(error&&error.code==='unauthorized')throw error;
        throw reject('private_bank_unavailable');
      }
      const session={
        id:randomBytes(32).toString('base64url'),
        refs,mode,phase:'active',
        createdAt:at,expiresAt:at+settings.sessionTtlMs,
        current:null,issued:0,answered:0,counts:{
          correct:0,incorrect:0,partial:0,'needs-review':0,ungraded:0
        }
      };
      state.sessions.push(session);
      state.starts.push(at);
      // No question, private refs, facit or detailed plan is returned.
      return {status:'started',sessionId:session.id,
        mode,progress:safeProgress(session)};
    });
  }
  async function nextQuestion({context,sessionId}={}){
    return transact(context,async(state,at,identity)=>{
      const session=findSession(state,sessionId,at);
      if(session.phase==='completed')
        return {status:'completed',progress:safeProgress(session)};
      if(session.current&&!session.current.answered)
        return {status:'question',question:clone(session.current.packet),
          progress:safeProgress(session),resumed:true};
      assert(session.issued<session.refs.length,'invalid_session_state');
      elapsedGate(state,at,settings);
      const ref=session.refs[session.issued];
      const instanceId=randomBytes(24).toString('base64url');
      let presentation;
      try{
        presentation=await bank.present({identity,ref,instanceId,
          sessionId:session.id});
      }catch(_){throw reject('private_bank_unavailable')}
      assert(isObj(presentation)&&isObj(presentation.responseSpec),
        'private_bank_unavailable');
      // Intentionally discard arbitrary bank metadata. A private bank must
      // issue opaque, authenticated expiring URLs for protected static images.
      let packet;
      try{
        packet=toProtectedQuestion({
          ...presentation,instanceId,ref
        },{sessionId:session.id,media:presentation.media||[]});
      }catch(_){throw reject('unsafe_public_projection')}
      session.current={ref,instanceId,packet,issuedAt:at,answered:false,
        invalidSubmissions:0};
      session.issued+=1;
      state.lastRevealAt=at;
      state.reveals.push(at);
      return {status:'question',question:clone(packet),
        progress:safeProgress(session),resumed:false};
    });
  }
  async function submitAnswer({context,sessionId,instanceId,response}={}){
    return transact(context,async(state,at,identity)=>{
      const session=findSession(state,sessionId,at);
      assert(session.phase==='active'&&session.current,'question_not_active');
      const item=session.current;
      assert(typeof instanceId==='string'&&instanceId===item.instanceId,
        'question_not_active');
      if(item.answered)return {status:'already_recorded',
        progress:safeProgress(session)};
      assert(item.invalidSubmissions<settings.maxInvalidSubmissions,
        'invalid_answer_limit');
      let answer;
      try{
        answer=validateAnswer(response,item.packet.responseSpec,
          settings.maxAnswerBytes);
      }catch(error){
        // Validation errors are not a chance to enumerate correct answers.
        item.invalidSubmissions+=1;
        return {status:'invalid_answer',remainingSubmissions:
          Math.max(0,settings.maxInvalidSubmissions-item.invalidSubmissions),
          progress:safeProgress(session)};
      }
      let graded;
      try{
        graded=await bank.grade({
          identity,ref:item.ref,instanceId:item.instanceId,answer,
          mode:session.mode
        });
      }catch(_){throw reject('private_grading_unavailable')}
      assert(isObj(graded)&&[
        'correct','incorrect','partial','needs-review','ungraded','invalid'
      ].includes(graded.status),'private_grading_unavailable');
      if(graded.status==='invalid'){
        item.invalidSubmissions+=1;
        return {status:'invalid_answer',remainingSubmissions:
          Math.max(0,settings.maxInvalidSubmissions-item.invalidSubmissions),
          progress:safeProgress(session)};
      }
      item.answered=true;
      item.packet=null; // Discard previously exposed content from active store.
      item.grade=graded.status; // No raw answer or private explanation stored.
      session.answered+=1;
      session.counts[graded.status]+=1;
      if(session.answered===session.refs.length)session.phase='completed';
      return {
        status:'recorded',
        progress:safeProgress(session),
        // Exam secrecy: no grading feedback before session completion.
        ...(session.mode==='train'?{feedback:{status:graded.status}}:{})
      };
    });
  }
  async function summary({context,sessionId}={}){
    return transact(context,async(state,at)=>{
      const session=findSession(state,sessionId,at);
      return {status:session.phase,progress:safeProgress(session),
        ...(session.phase==='completed'?{results:{...session.counts}}:{})};
    });
  }
  return Object.freeze({createSession,nextQuestion,submitAnswer,summary});
}
module.exports={defaults,createInMemoryStore,createProtectedDelivery};
