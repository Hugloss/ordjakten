'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const F=require('../public/js/practice-feedback'),J=require('../public/js/next-adventure'),E=require('../public/js/engine');
const L=require('../public/js/learning-map'),C=require('../public/js/concepts'),B=require('../public/js/bridges'),D=require('../public/js/detector');
const bank=require('../public/data/ordbank.json'),expressions=require('../public/data/expressions.json'),
  contexts=require('../public/data/word-contexts.json'),surprises=require('../public/data/surprises.json'),
  missions=require('../public/data/missions.json'),contrasts=require('../public/data/contrasts.json'),clues=require('../public/data/clue-ladder.json');
const words=L.catalog(bank,expressions,contexts),conceptContent=C.catalog(words),
  bridgeTasks=B.catalog(words,conceptContent).tasks,
  detectorTasks=D.catalog(words,contrasts).concat(D.advancedCatalog(words,contrasts,clues));
const input={words,contexts,surprises,missions,conceptContent,bridgeTasks,detectorTasks,contrasts};
const content=F.catalog(input);
const NOW=1780000000000,DAY=F.DAY,random=()=>.37;
const id='sv-0044',other='sv-0003',aha='aha:'+id,recall='recall:'+id;
const detector=detectorTasks.find(t=>t.target===id&&t.level===1);
const method='detector:'+detector.id,workshop='workshop:'+id;
const concept=conceptContent.tasks.find(t=>t.id==='bk-11-1'),conceptKey='concept:'+concept.id;
const bridge=bridgeTasks.find(t=>t.groupId===concept.groupId&&t.participants.includes(concept.answer)),bridgeKey='bridge:'+bridge.id;
const candidate=(key,mode,words,reason='need',payload={},cost=1)=>({key,mode,words,reason,payload,cost,dueAt:NOW});
const source=candidate(aha,'aha',[id]);
const det=candidate(method,'detector',detector.words.map(w=>w.id),'related',detector);
const work=candidate(workshop,'workshop',[id,other],'extend',{id},3);
const alternatives=[source,det,work];
const observe=(raw,key,outcome,now,evidence='')=>F.observe(raw,content,{key,outcome,now,evidence});
const twice=(key=aha)=>observe(observe({},key,'supported',NOW,key===aha?'context:0':''),key,'supported',NOW+DAY,key===aha?'context:1':'');
const choose=(rows,raw,now)=>J.select(F.adjust(rows,raw,content,now),{random}).steps;
const start=(raw,step,now)=>F.complete(raw,content,step,now);
test('real catalogue scopes exact followup targets and versioned alternative methods',()=>{
  assert.equal(Object.values(content.objectives).filter(x=>x.mode==='recall').length,174);
  assert.equal(Object.values(content.objectives).filter(x=>x.mode==='aha').length,96);
  assert.equal(Object.values(content.objectives).filter(x=>x.mode==='concept').length,36);
  assert.ok(content.methods[method].targets.includes(aha));
  assert.ok(!content.methods[method].targets.includes(recall));
  assert.ok(content.methods[workshop].targets.includes(recall));
  assert.ok(content.methods[bridgeKey].targets.includes(conceptKey));
  for(const m of Object.values(content.methods))assert.ok(m.targets.every(k=>Object.hasOwn(content.objectives,k)));
  const changed=F.catalog({...input,words:words.map(w=>w.id===id?{...w,definition:w.definition+' Ändrad.'}:w)});
  assert.notEqual(changed.objectives[aha].stamp,content.objectives[aha].stamp);
  assert.notEqual(changed.objectives[recall].stamp,content.objectives[recall].stamp);
  assert.notEqual(changed.methods[workshop].stamp,content.methods[workshop].stamp);
});
test('two supported observations must be spaced; repeated identical Aha scenes do not qualify',()=>{
  let p=observe({},aha,'supported',NOW,'context:0');
  assert.equal(p[aha].streak,1);
  assert.equal(choose(alternatives,p,NOW)[0].key,aha);
  assert.equal(observe(p,aha,'supported',NOW,'context:0'),p);
  assert.equal(observe(p,aha,'direct',NOW-1,'context:1'),p);
  p=observe(p,aha,'supported',NOW+100,'context:1');
  assert.equal(p[aha].streak,1);
  p=observe(p,aha,'supported',NOW+DAY+100,'context:1');
  assert.equal(p[aha].streak,1);
  p=observe(p,aha,'supported',NOW+2*DAY+100,'context:2');
  assert.equal(p[aha].streak,2);
  assert.equal(choose(alternatives,p,NOW+2*DAY+100)[0].mode,'detector');
});
test('only actually available alternatives can be chosen; direct unrelated needs remain intact',()=>{
  const p=twice(),now=NOW+DAY;
  const picked=choose(alternatives,p,now)[0];
  assert.equal(picked.mode,'detector');
  assert.equal(picked.reason,'need');
  assert.equal(picked.feedback.objective,aha);
  assert.equal(picked.feedback.baselineAt,now);
  assert.equal(choose([source],p,now)[0].key,aha);
  assert.equal(choose([det,work],p,now)[0].feedback,undefined,'source must also be ready');
  const unrelated=candidate('recall:sv-0010','recall',['sv-0010']);
  const plan=choose([...alternatives,unrelated],p,now);
  assert.ok(plan.some(s=>s.key===unrelated.key));
  assert.ok(!plan.some(s=>s.key===aha),'intervention and original target do not overlap in one round');
  assert.equal(p[aha].pending,null,'planning is not an intervention');
});
test('completed alternative creates exactly one pending trial; skip and stale completion do not',()=>{
  const p=twice(),now=NOW+DAY;
  const step=choose(alternatives,p,now)[0];
  assert.equal(start(p,source,now+10),p);
  assert.equal(start(p,{...step,feedback:{...step.feedback,baselineAt:NOW}},now+10),p);
  assert.equal(start(p,{...step,feedback:{...step.feedback,stamp:'bad'}},now+10),p);
  const trial=start(p,step,now+10);
  assert.equal(trial[aha].pending.method,'detector');
  assert.equal(trial[aha].pending.baselineAt,now);
  assert.equal(start(trial,step,now+11),trial);
  assert.equal(p[aha].pending,null);
});
test('pending followup respects a full day and existing readiness; do not insert extra optional alternatives',()=>{
  const p=twice(),now=NOW+DAY,step=choose(alternatives,p,now)[0];
  const pending=start(p,step,now);
  assert.equal(choose(alternatives,pending,now+DAY-1).length,0);
  assert.equal(choose([det,work],pending,now+DAY).length,0);
  assert.equal(choose(alternatives,pending,now+DAY)[0].key,aha);
  assert.equal(choose(alternatives,pending,now+DAY)[0].feedbackPriority,2);
  const unrelated=candidate('recall:sv-0010','recall',['sv-0010']);
  assert.equal(choose([unrelated,det],pending,now+DAY-1)[0].key,unrelated.key);
  assert.equal(choose([source,{...det,reason:'need'}],pending,now+1)[0].key,det.key,'other observed needs remain available');
});
test('same-day, identical, previewed or expired followups end without a labelled result',()=>{
  const p=twice(),now=NOW+DAY,step=choose(alternatives,p,now)[0],pending=start(p,step,now);
  for(const [outcome,at,evidence] of [
    ['direct',now+DAY-1,'context:2'],
    ['direct',now+DAY,'context:1'],
    ['previewed',now+DAY,'context:2'],
    ['direct',now+F.WINDOW+1,'context:2']
  ]){
    const next=observe(pending,aha,outcome,at,evidence);
    assert.equal(next[aha].trials.length,0);
    assert.equal(next[aha].pending,null);
  }
  assert.equal(F.summary(pending,content,now+F.WINDOW+1).pending,0);
  assert.equal(observe(pending,'aha:sv-9999','direct',now+DAY,'context:2'),pending);
  assert.equal(observe(pending,aha,'direct',now+DAY,'expression:mission'),pending);
});
test('a comparable delayed direct response is an observation, not a new skill or causal score',()=>{
  const p=twice(),now=NOW+DAY,pending=start(p,choose(alternatives,p,now)[0],now);
  const result=observe(pending,aha,'direct',now+DAY,'context:2');
  assert.equal(result[aha].streak,0);
  assert.equal(result[aha].pending,null);
  assert.equal(result[aha].trials[0].outcome,'direct');
  assert.deepEqual(F.summary(result,content,now+DAY),{pending:0,checked:1,direct:1,supported:0});
  assert.equal(result[recall],undefined);
  assert.equal(choose(alternatives,result,now+DAY)[0].key,aha);
  assert.equal(observe(result,aha,'direct',now+DAY,'context:2'),result);
});
test('continued support rotates towards an untried method after another spaced support observation',()=>{
  const p=twice(),now=NOW+DAY,pending=start(p,choose(alternatives,p,now)[0],now);
  let q=observe(pending,aha,'supported',now+DAY,'context:2');
  assert.equal(q[aha].streak,1);
  assert.equal(choose(alternatives,q,now+DAY)[0].key,aha);
  q=observe(q,aha,'supported',now+2*DAY,'context:0');
  assert.equal(q[aha].streak,2);
  const next=choose(alternatives,q,now+2*DAY)[0];
  assert.equal(next.mode,'workshop');
  assert.equal(next.feedback.objective,aha);
  assert.equal(q[aha].trials[0].outcome,'supported');
});
test('a previously successful comparable followup can favor the same method within the same goal',()=>{
  const p=twice(),now=NOW+DAY,pending=start(p,choose(alternatives,p,now)[0],now);
  let q=observe(pending,aha,'direct',now+DAY,'context:2');
  q=observe(q,aha,'supported',now+2*DAY,'context:0');
  q=observe(q,aha,'supported',now+3*DAY,'context:1');
  assert.equal(choose(alternatives,q,now+3*DAY)[0].mode,'detector');
  const unrelated=candidate('workshop:sv-0010','workshop',['sv-0010'],'extend');
  assert.equal(choose([unrelated],q,now+3*DAY)[0].feedback,undefined);
});
test('recall and concept targets follow up their original exercise rather than evaluating free text or other group members',()=>{
  const now=NOW+DAY;
  const p=twice(recall),r=candidate(recall,'recall',[id]);
  const w=choose([r,work,det],p,now)[0];
  assert.equal(w.key,workshop);
  assert.equal(w.feedback.objective,recall);
  const pending=start(p,w,now);
  const first=observe(pending,aha,'direct',now+DAY,'context:2');
  assert.equal(first,pending);
  const next=observe(pending,recall,'direct',now+DAY);
  assert.equal(next[recall].trials[0].outcome,'direct');
  const group=conceptContent.groups.find(g=>g.id===concept.groupId);
  const c=candidate(conceptKey,'concept',group.words.map(w=>w.id));
  const b=candidate(bridgeKey,'bridge',bridge.participants,'related');
  const cp=twice(conceptKey),step=choose([c,b],cp,now)[0];
  assert.equal(step.key,bridgeKey);
  const trial=start(cp,step,now);
  const otherKey='concept:'+group.questions.find(q=>q.id!==concept.id).id;
  assert.equal(observe(trial,otherKey,'direct',now+DAY),trial);
  assert.equal(observe(trial,conceptKey,'supported',now+DAY)[conceptKey].trials[0].outcome,'supported');
});
test('legacy counters do not invent repeated support; migration uses only explicit supported outcomes',()=>{
  const history={recallProgress:{[id]:{assisted:20,lastAt:NOW,last:'assisted',stage:0}},
    readingProgress:{[id]:{transfer:{supported:8,lastAt:NOW,lastEvidence:'context:0'}}}};
  assert.deepEqual(Object.keys(F.seed({},content,history,NOW)),[]);
  history.recallProgress[id].memory={outcome:'supported',step:0,lastAt:NOW};
  history.readingProgress[id].transfer.memory={outcome:'supported',lastAt:NOW,evidence:'context:0',step:0};
  const p=F.seed({},content,history,NOW);
  assert.equal(p[recall].streak,1);
  assert.equal(p[aha].streak,1);
  assert.deepEqual(F.seed(p,content,history,NOW),p);
  assert.equal(F.summary(p,content,NOW).checked,0);
});
test('ledger is bounded, validated against content versions, exportable and reset with normal history',()=>{
  const p=twice(),now=NOW+DAY,pending=start(p,choose(alternatives,p,now)[0],now);
  let q=observe(pending,aha,'direct',now+DAY,'context:2');
  const row=q[aha],original=row.trials[0];
  const corrupted={[aha]:{...row,typed:'do not retain',streak:999,
    trials:Array.from({length:10},()=>({...original,typed:'private'}))},unknown:row};
  const safe=F.sanitize(corrupted,content,now+DAY);
  assert.deepEqual(Object.keys(safe),[aha]);
  assert.equal(safe[aha].trials.length,F.LIMIT);
  assert.equal(safe[aha].streak,0);
  assert.equal(JSON.stringify(safe).includes('private'),false);
  assert.equal(JSON.stringify(safe).includes('do not retain'),false);
  assert.deepEqual(F.sanitize(E.sanitizeHistory({feedbackProgress:safe}).feedbackProgress,content,now+DAY),safe);
  assert.equal(Object.keys(F.sanitize(E.sanitizeHistory(null).feedbackProgress,content,now+DAY)).length,0);
  const changed={...content,objectives:{...content.objectives,[aha]:{...content.objectives[aha],stamp:'changed'}}};
  assert.equal(F.sanitize(safe,changed,now+DAY)[aha],undefined);
  const stale={...content,methods:{...content.methods,[method]:{...content.methods[method],stamp:'changed'}}};
  assert.equal(F.sanitize(pending,stale,now+DAY)[aha].pending,null);
  assert.equal(F.sanitize(safe,stale,now+DAY)[aha].trials.length,0);
});
test('journey coordinator can choose an alternative without modifying the source history or filling extra stations',()=>{
  const progress=twice(),now=NOW+DAY;
  const history={readingProgress:{[id]:{transfer:{supported:2}}},feedbackProgress:progress};
  const before=JSON.stringify(history);
  const p=J.build({catalog:words,history,knownIds:new Set([id]),focusTypes:()=>[],pairFor:()=>contrasts.pairs[0],
    aha:{ready:[{id,dueAt:now,reason:'need'}]},detector:{available:[detector]},
    conceptContent,now,random,adjust:rows=>F.adjust(rows,progress,content,now)});
  assert.equal(p.steps[0].mode,'detector');
  assert.equal(p.steps[0].feedback.objective,aha);
  assert.equal(p.steps.length,1);
  assert.equal(JSON.stringify(history),before);
});
