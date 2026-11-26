'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../public/js/spaced-memory');
const B=require('../public/js/reading-check');
const R=require('../public/js/recall');
const V=require('../public/js/aha-plan');
const J=require('../public/js/next-adventure');
const L=require('../public/js/learning-map');
const E=require('../public/js/engine');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const contexts=require('../public/data/word-contexts.json');
const surprises=require('../public/data/surprises.json');
const missions=require('../public/data/missions.json');
const NOW=1780000000000,DAY=M.DAY;
const deps={bank,expressions,contexts,surprises,missions,reading:B,random:()=>.37};
const catalog=L.catalog(bank,expressions,contexts),item=catalog.find(w=>w.id==='sv-0001'),id=item.id;
const phrase=catalog.find(w=>w.kind==='expression');
const observe=(raw,outcome,now,extras={})=>M.observe(raw,{outcome,now,...extras});
const recall=(raw,now,extras={})=>R.record(raw,catalog,id,{stage:raw[id]?.stage??1,matched:true,helped:false,...extras},now);
const plan=(p,now)=>V.plan(p,{...deps,now});
test('memory advances only after the full interval and stops at thirty days',()=>{
  let card=null,now=NOW;
  const days=[];
  for(let i=0;i<6;i++){
    card=observe(card,'direct',now);
    const due=M.dueAt(card);
    days.push((due-now)/DAY);
    assert.deepEqual(observe(card,'direct',due-1),card);
    assert.deepEqual(observe(card,'direct',now-1),card);
    now=due;
  }
  assert.deepEqual(days,[1,3,7,14,30,30]);
  assert.equal(card.step,4);
});
test('support resets a long interval; a successful supported practice cannot earn extra days',()=>{
  let card=observe(null,'direct',NOW);
  card=observe(card,'direct',NOW+DAY);
  assert.equal(card.step,1);
  card=observe(card,'supported',NOW+DAY+10);
  assert.equal(card.step,0);
  assert.equal(M.dueAt(card),NOW+2*DAY+10);
  card=observe(card,'direct',M.dueAt(card));
  assert.equal(card.step,0);
  card=observe(card,'direct',M.dueAt(card));
  assert.equal(card.step,1);
});
test('a preview preserves the earned interval but cannot establish another independent success',()=>{
  let card=observe(null,'direct',NOW);
  card=observe(card,'direct',NOW+DAY);
  const preview=observe(card,'previewed',M.dueAt(card));
  assert.equal(preview.step,card.step);
  assert.equal(preview.outcome,'previewed');
  const after=observe(preview,'direct',M.dueAt(preview));
  assert.equal(after.step,card.step);
  assert.equal(observe(after,'direct',M.dueAt(after)).step,2);
});
test('recent intervening exposure and repeated scene keys cannot advance transfer spacing',()=>{
  let card=observe(null,'direct',NOW,{requiresEvidence:true,evidence:'context:0'});
  const t=M.dueAt(card);
  const same=observe(card,'direct',t,{requiresEvidence:true,evidence:'context:0'});
  assert.equal(same.step,0);
  const recent=observe(card,'direct',t,{requiresEvidence:true,evidence:'context:1',lastExposureAt:t-1});
  assert.equal(recent.step,0);
  const next=observe(card,'direct',t,{requiresEvidence:true,evidence:'context:1'});
  assert.equal(next.step,1);
  assert.deepEqual(observe(next,'direct',M.dueAt(next),{requiresEvidence:true,evidence:'unknown'}),next);
});
test('recall uses long intervals in the actual queue and rejects early named-card attempts',()=>{
  let p=recall({},NOW);
  assert.equal(p[id].stage,2);
  assert.equal(R.dueAt(p[id]),NOW+DAY);
  p=recall(p,NOW+DAY);
  assert.equal(R.dueAt(p[id]),NOW+4*DAY);
  const early=R.plan(catalog,{recallProgress:p},NOW+2*DAY);
  assert.equal(early.ready.length,0);
  assert.equal(early.waiting[0].id,id);
  assert.equal(recall(p,NOW+2*DAY,{previewed:true}),p);
  const next=R.plan(catalog,{recallProgress:p},NOW+4*DAY);
  assert.equal(next.round[0].id,id);
  p=recall(p,NOW+4*DAY,{matched:false,helped:true});
  assert.equal(p[id].stage,0);
  assert.equal(p[id].memory.step,0);
  assert.equal(R.dueAt(p[id]),NOW+5*DAY);
});
test('recall preview does not remove earned interval or count as forgetting',()=>{
  let p=recall({},NOW);
  p=recall(p,NOW+DAY);
  const due=R.dueAt(p[id]);
  const preview=recall(p,due,{previewed:true,matched:false});
  assert.equal(preview[id].memory.step,1);
  assert.equal(preview[id].stage,p[id].stage);
  assert.equal(preview[id].direct,p[id].direct);
  assert.equal(preview[id].memory.outcome,'previewed');
  assert.equal(R.dueAt(preview[id]),due+3*DAY);
  const q=recall(preview,R.dueAt(preview[id]));
  assert.equal(q[id].memory.step,1);
});
test('legacy recall counters retain one-day baseline and never imply a long interval',()=>{
  const legacy={[id]:{direct:99,assisted:0,stage:2,lastAt:NOW,last:'direct'}};
  const clean=R.sanitize(legacy,catalog);
  assert.equal(clean[id].memory,undefined);
  assert.equal(R.dueAt(clean[id]),NOW+DAY);
  const p=recall(clean,NOW+DAY);
  assert.equal(p[id].memory.step,0);
  assert.deepEqual(R.sanitize(E.sanitizeHistory({recallProgress:p}).recallProgress,catalog),p);
});
test('Aha returns after recovery at longer intervals without claiming new unique evidence forever',()=>{
  const pid=phrase.id;
  let p=B.recordProgress({},pid,'expression','guided',NOW,'expression:challenge');
  let t=NOW+DAY;
  const dueDays=[];
  for(let i=0;i<5;i++){
    const row=plan(p,t).ready.find(row=>row.id===pid);
    assert.ok(row,'a formerly successful authored story must return');
    assert.notEqual(row.check.evidence,p[pid].transfer.lastEvidence);
    p=B.recordProgress(p,pid,row.check.source,'first',t,row.check.evidence);
    const card=p[pid].transfer,due=B.transferDueAt(card);
    dueDays.push((due-t)/DAY);
    assert.ok(!plan(p,due-1).ready.some(row=>row.id===pid));
    assert.ok(plan(p,due-1).waiting.some(row=>row.id===pid));
    t=due;
  }
  assert.deepEqual(dueDays,[1,3,7,14,30]);
  assert.equal(B.needsReview(p,pid),false);
  assert.equal(p[pid].transfer.quality,2);
  assert.equal(p[pid].transfer.proofs.length,2);
  assert.equal(plan(p,t).ready.find(row=>row.id===pid).reason,'review');
  p=B.recordProgress(p,pid,'expression','retry',t,'expression:challenge');
  assert.equal(p[pid].transfer.memory.step,0);
  assert.equal(B.needsReview(p,pid),true);
  assert.equal(plan(p,t+DAY).ready.find(row=>row.id===pid).reason,'need');
});
test('ordinary early Aha repetitions and unsupported recall do not create long-term proof',()=>{
  const pid=phrase.id;
  let p=B.recordProgress({},pid,'expression','first',NOW,'expression:challenge');
  p=B.recordProgress(p,pid,'expression','first',NOW+DAY,'expression:mission');
  const before=p[pid].transfer.memory;
  p=B.recordProgress(p,pid,'expression','first',NOW+2*DAY,'expression:challenge');
  assert.deepEqual(p[pid].transfer.memory,before);
  assert.equal(B.transferDueAt(p[pid].transfer),NOW+4*DAY);
  p=B.recordProgress(p,pid,'expression','first',NOW+4*DAY,'expression:mission');
  assert.equal(p[pid].transfer.memory.step,1);
  const recognition=B.recordProgress(p,pid,'meaning','first',NOW+4*DAY);
  assert.equal(recognition[pid].recognition.memory,undefined);
  assert.deepEqual(recognition[pid].transfer,p[pid].transfer);
});
test('old Aha observations may revisit but cannot fabricate longer intervals or source keys',()=>{
  const pid=phrase.id,legacy={[pid]:{transfer:{first:5,supported:1,streak:5,lastAt:NOW,
    quality:2,proofs:['expression:challenge','expression:mission'],lastEvidence:'expression:mission',lastQualifiedAt:NOW}}};
  const safe=B.sanitizeProgress(legacy);
  assert.equal(safe[pid].transfer.memory,undefined);
  assert.equal(plan(safe,NOW+DAY).ready[0].reason,'review');
  const row=plan(safe,NOW+DAY).ready[0];
  const next=B.recordProgress(safe,pid,'expression','first',NOW+DAY,row.check.evidence);
  assert.equal(next[pid].transfer.memory.step,0);
  const unkeyed=B.recordProgress({},pid,'expression','first',NOW);
  assert.equal(plan(unkeyed,NOW+DAY).ready.length,0);
  assert.equal(V.plan(next,{...deps,missions:{missions:[]},surprises:{challenges:[]},now:NOW+10*DAY}).ready.length,0);
});
test('sanitization bounds memory, strips extra text and keeps tracks distinct through storage',()=>{
  assert.equal(M.sanitize({step:99,lastAt:NOW,outcome:'direct'}),null);
  assert.equal(M.sanitize({step:2,lastAt:NOW,outcome:'supported'}),null);
  assert.equal(M.sanitize({step:0,lastAt:NOW+1,outcome:'direct'},{maxAt:NOW}),null);
  const p=recall({},NOW),t=B.recordProgress({},id,'context','first',NOW,'context:0');
  const stored=E.sanitizeHistory({recallProgress:p,readingProgress:t});
  assert.deepEqual(R.sanitize(stored.recallProgress,catalog),p);
  assert.deepEqual(B.sanitizeProgress(stored.readingProgress),B.sanitizeProgress(t));
  assert.equal(M.sanitize({...p[id].memory,typed:'private'}).typed,undefined);
  assert.equal(M.sanitize({step:1,lastAt:NOW,outcome:'direct',evidence:'not allowed'},{evidenceRequired:true}),null);
  assert.equal(R.sanitize({[id]:{...p[id],memory:{...p[id].memory,lastAt:NOW-1}}},catalog)[id].memory,undefined);
  assert.equal(E.sanitizeHistory(null).readingProgress[id],undefined);
  assert.equal(E.sanitizeHistory(null).recallProgress[id],undefined);
});
test('unified adventure treats a successful due Aha or previewed recall as review, not a new difficulty',()=>{
  const a={id:phrase.id,dueAt:NOW,reason:'review'},r={id,dueAt:NOW,card:{last:'assisted',memory:{outcome:'previewed'}}};
  const p=J.build({catalog:[item,phrase],history:{},knownIds:new Set(),focusTypes:()=>[],pairFor:()=>null,
    aha:{ready:[a]},recall:{ready:[r]},conceptContent:{groups:[],tasks:[]},now:NOW,random:()=>.37});
  assert.equal(p.steps.length,2);
  assert.ok(p.steps.every(s=>s.reason==='review'));
  assert.equal(J.build({catalog:[item,phrase],history:{},knownIds:new Set(),focusTypes:()=>[],pairFor:()=>null,
    aha:{ready:[],waiting:[a]},recall:{ready:[],waiting:[r]},conceptContent:{groups:[],tasks:[]},now:NOW,random:()=>.37}).steps.length,0);
});
