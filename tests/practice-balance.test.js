'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const B=require('../public/js/practice-balance');
const J=require('../public/js/next-adventure');
const E=require('../public/js/engine');
const random=()=>.37,NOW=1780000000000;
const id=n=>'sv-'+String(n).padStart(4,'0');
const row=(mode,reason,n,cost=1,newWord=false,extra={})=>({
  key:mode+':'+n,mode,reason,words:[id(n)],cost,newWord,dueAt:NOW,...extra});
const sample=[
  row('focus','need',1,3),row('aha','need',2),row('recall','review',3),
  row('detector','review',4),row('concept','discover',5,1,true),
  row('bridge','extend',6,1,true),row('workshop','extend',7,3)
];
const select=(rows,history,extra={})=>J.select(rows,{
  random,chooseNext:(ready,steps)=>B.pick(ready,history,steps),...extra});
test('four mutually exclusive categories use the reason and actual target',()=>{
  assert.deepEqual(B.TARGET,{develop:40,review:30,discover:20,creative:10});
  assert.deepEqual(sample.map(B.kind),['develop','develop','review','review','discover','discover','creative']);
  assert.equal(B.kind(row('workshop','need',1,3)),'develop');
  assert.equal(B.kind(row('focus','related',1,3,true)),'develop');
  assert.equal(B.kind(row('concept','extend',1,1,false)),'develop');
  assert.equal(B.kind(row('detector','discover',1,1,false)),'develop');
  assert.equal(B.kind(null),null);
});
test('rolling history is bounded, strips arbitrary data and survives storage',()=>{
  const raw=Array(30).fill('develop').concat(['review','invalid',{name:'private'},'creative']);
  const clean=B.sanitize(raw);
  assert.equal(clean.length,18);
  assert.deepEqual(clean.slice(-2),['review','creative']);
  assert.equal(JSON.stringify(clean).includes('private'),false);
  assert.deepEqual(E.sanitizeHistory({practiceBalance:raw}).practiceBalance,clean);
  assert.deepEqual(E.sanitizeHistory(null).practiceBalance,[]);
  assert.deepEqual(E.sanitizeHistory({practiceBalance:{bad:true}}).practiceBalance,[]);
  assert.deepEqual(B.sanitize(null),[]);
  const rolled=B.record(Array(20).fill('review'),sample[4]);
  assert.equal(rolled.length,20);
  assert.equal(rolled.at(-1),'discover');
  assert.equal(B.summary(rolled).counts.review,19);
});
test('only completed stations enter the mix; the same station object counts once',()=>{
  const seen=new WeakSet(),before=[],station=sample[0];
  assert.equal(B.recordCompletion(before,station,false,seen),before);
  const first=B.recordCompletion(before,station,true,seen);
  assert.deepEqual(first,['develop']);
  assert.deepEqual(before,[]);
  assert.equal(B.recordCompletion(first,station,true,seen),first);
  assert.equal(B.recordCompletion(first,sample[6],false,seen),first);
  assert.deepEqual(B.recordCompletion(first,{...station},true,seen),['develop','develop']);
  assert.equal(B.recordCompletion(first,null,true,seen),first);
});
test('empty balance history retains the old first choice, then reserves a feasible core station',()=>{
  const fresh=[row('focus','discover',1,3,true),row('detector','discover',2,1,true)];
  assert.equal(select(fresh,[]).steps[0].mode,'focus');
  assert.equal(select(sample,[]).steps[0],J.select(sample,{random}).steps[0]);
  const p=select(sample,Array(20).fill('develop'));
  assert.equal(p.steps[0].reason,'review');
  assert.ok(p.steps.slice(1).some(s=>['discover','creative'].includes(B.kind(s))));
});
test('pending feedback and alternative interventions take precedence in every feasible slot',()=>{
  const followup=row('aha','review',1,1,false,{feedbackPriority:2});
  const alternative=row('workshop','need',2,3,false,{feedbackPriority:1});
  const p=select([sample[4],followup,alternative,sample[3]],Array(20).fill('develop'));
  assert.equal(p.steps[0],followup);
  assert.equal(p.steps[1],alternative);
  assert.equal(B.kind(alternative),'develop');
});
test('balance is computed only from feasible candidates and cannot bypass budget or overlap',()=>{
  const first=row('focus','need',1,4);
  const overlap=row('workshop','extend',1,3);
  const sameMethod=row('focus','discover',2,3,true);
  const expensive=row('aha','review',3,8);
  const p=select([first,overlap,sameMethod,expensive],Array(20).fill('develop'),{budget:4});
  assert.deepEqual(p.steps,[first]);
  assert.equal(p.maxTasks,4);
  assert.equal(select([],[]).steps.length,0);
  const safe=J.select([first,sameMethod],{random,chooseNext:()=>sample[6]});
  assert.deepEqual(safe.steps,[first]);
});
test('missing categories never block the round or create stored debt',()=>{
  const history=Array(20).fill('develop');
  const p=select(sample.slice(0,2),history);
  assert.equal(p.steps.length,2);
  assert.ok(p.steps.every(s=>B.kind(s)==='develop'));
  assert.deepEqual(history,Array(20).fill('develop'));
  assert.equal(select([sample[6]],Array(20).fill('review')).steps[0],sample[6]);
});
test('shortfall accounts for eviction and provisional selections',()=>{
  const history=['creative',...Array(8).fill('develop'),...Array(6).fill('review'),...Array(4).fill('discover'),'creative'];
  assert.equal(history.length,20);
  assert.equal(B.kind(B.pick([sample[6],sample[4]],history,[])),'creative');
  const past=Array(19).fill('develop');
  assert.equal(B.kind(B.pick([sample[2],sample[4]],past,[sample[2]])),'review');
  assert.equal(B.summary(past).counts.develop,19);
});
test('600 synthetic completed stations approach the desired mix when all categories are feasible',()=>{
  let history=[],totals={develop:0,review:0,discover:0,creative:0};
  for(let round=0;round<200;round++){
    const p=select(sample,history);
    assert.equal(p.steps.length,3);
    assert.ok(p.maxTasks<=8);
    assert.equal(new Set(p.steps.map(s=>s.mode)).size,3);
    const words=p.steps.flatMap(s=>s.words);
    assert.equal(new Set(words).size,words.length);
    for(const s of p.steps){totals[B.kind(s)]++;history=B.record(history,s);}
  }
  assert.deepEqual(B.summary(history).counts,{develop:8,review:6,discover:4,creative:2});
  for(const [key,target] of Object.entries(B.TARGET))assert.ok(Math.abs(totals[key]/6-target)<3,key);
});
test('actual target novelty excludes unseen distractors and anchors',()=>{
  const [a,b,c,d]=[1,2,3,4].map(id);
  const catalog=[a,b,c,d].map(id=>({id,kind:'word',difficulty:'easy',name:id,definition:'Betydelse',example:'Exempel'}));
  const concept={id:'bk-01-1',groupId:'bk-01',answer:a,options:[{id:a},{id:b},{id:c}]};
  const bridge={id:'ob-01',groupId:'bk-01',cards:[a,d],participants:[a,b,d]};
  const group={id:'bk-01',words:[{id:a},{id:b}]};
  const detector={id:'js-01-01',pairId:'js-01',target:a,words:[{id:a},{id:b}],level:1};
  const input={catalog,history:{},knownIds:new Set([a]),focusTypes:()=>[],pairFor:()=>null,now:NOW,random,
    workshopSeen:new Set([a]),conceptContent:{groups:[group],tasks:[concept]}};
  const cp=J.build({...input,concept:{available:[concept]}});
  assert.equal(cp.steps[0].newWord,false);
  assert.equal(B.kind(cp.steps[0]),'develop');
  assert.equal(J.build({...input,detector:{available:[detector]}}).steps[0].newWord,false);
  const bp=J.build({...input,bridge:{available:[bridge]}});
  assert.equal(bp.steps[0].newWord,true);
  assert.equal(B.kind(bp.steps[0]),'discover');
  const known=J.build({...input,knownIds:new Set([a,d]),workshopSeen:new Set([a,d]),bridge:{available:[bridge]}});
  assert.equal(known.steps[0].newWord,false);
});
test('integrated builder honors review waiting and retains the old selection when no hook is supplied',()=>{
  const [a,b,c]=[1,2,3].map(id);
  const catalog=[a,b,c].map(id=>({id,kind:'word',difficulty:'easy',name:id,definition:'Betydelse',example:'Exempel'}));
  const input={catalog,history:{skillProgress:{[a]:{skills:{meaning:{wrong:1,streak:0,lastAt:NOW-1}}},
    [b]:{skills:{meaning:{wrong:1,streak:0,lastAt:NOW-1}}}},reviewProgress:{[b]:{streak:1,dueAt:NOW+1}}},
    knownIds:new Set(),focusTypes:()=>['meaning'],pairFor:()=>null,now:NOW,random,conceptContent:{groups:[],tasks:[]}};
  const p=J.build({...input,chooseNext:(rows,steps)=>B.pick(rows,Array(20).fill('develop'),steps)});
  assert.equal(p.steps[0].payload.id,a);
  assert.ok(!p.steps.some(s=>s.words.includes(b)));
  assert.equal(p.steps.length,1);
  assert.equal(J.build(input).steps[0].payload.id,a);
});
