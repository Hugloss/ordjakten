'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const J=require('../public/js/next-adventure'),L=require('../public/js/learning-map'),F=require('../public/js/focus-practice'),
  A=require('../public/js/adaptive'),E=require('../public/js/engine'),B=require('../public/js/reading-check'),
  Aha=require('../public/js/aha-plan'),Recall=require('../public/js/recall'),Detector=require('../public/js/detector'),
  Concepts=require('../public/js/concepts'),Bridges=require('../public/js/bridges'),K=require('../public/js/contrast');
const bank=require('../public/data/ordbank.json'),expressions=require('../public/data/expressions.json'),
  contexts=require('../public/data/word-contexts.json'),missions=require('../public/data/missions.json'),
  surprises=require('../public/data/surprises.json'),contrasts=require('../public/data/contrasts.json'),
  clues=require('../public/data/clue-ladder.json');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;
const catalog=L.catalog(bank,expressions,contexts),conceptContent=Concepts.catalog(catalog),bridgeContent=Bridges.catalog(catalog,conceptContent),
  detectorContent=Detector.catalog(catalog,contrasts).concat(Detector.advancedCatalog(catalog,contrasts,clues));
const NOW=1780000000000,DAY=J.DAY,random=()=>.37;
const find=id=>catalog.find(item=>item.id===id);
const types=item=>F.supported(F.findItem(item.id,bank,expressions),curation,contexts,missions,K,contrasts);
const pairFor=item=>K.findPair(item.id,contrasts);
function input(history={},now=NOW,extra={}){
  const knownIds=new Set(catalog.filter(item=>Recall.eligible(item,history)||history.recallProgress?.[item.id]).map(item=>item.id));
  return {catalog,history,knownIds,now,random,focusTypes:types,pairFor,conceptContent,
    aha:Aha.plan(history.readingProgress,{bank,expressions,contexts,missions,surprises,reading:B,now,random}),
    recall:Recall.plan(catalog,history,now),
    detector:{...Detector.plan(detectorContent,history.detectorProgress,knownIds,now,random,null,history.detectorLevels),catalog:detectorContent},
    concept:Concepts.plan(conceptContent,history.conceptProgress,knownIds,now,random),
    bridge:{...Bridges.plan(bridgeContent,history.bridgeProgress,knownIds,now,random),catalog:bridgeContent.tasks},...extra};
}
const noOther={aha:{ready:[]},recall:{ready:[]},detector:{round:[]},concept:{round:[]},bridge:{round:[]}};
const a='sv-0001';
test('actual vocabulary starts with a playable easy word and up to three disjoint stations',()=>{
  const plan=J.build(input());
  assert.ok(plan.steps.length>0&&plan.steps.length<=3);
  assert.equal(plan.steps[0].mode,'focus');
  assert.equal(plan.steps[0].reason,'discover');
  const f=plan.steps[0].payload;
  assert.equal(find(f.id).difficulty,'easy');
  assert.ok(types(find(f.id)).includes(f.skill));
  assert.ok(plan.maxTasks<=8);
  assert.equal(new Set(plan.steps.map(s=>s.mode)).size,plan.steps.length);
  const words=plan.steps.flatMap(s=>s.words);
  assert.equal(new Set(words).size,words.length);
});
test('all seven methods can be selected from real authored content',()=>{
  const word=find('sv-0044'),phrase=catalog.find(item=>item.kind==='expression');
  const history={skillProgress:A.record({}, {id:word.id,kind:'word',taskType:'meaning'},'right',NOW-DAY),
    readingProgress:B.recordProgress({},phrase.id,'expression','guided',NOW-DAY,'expression:challenge')};
  const weak=A.record({}, {id:a,kind:'word',taskType:'meaning'},'wrong',NOW-DAY);
  assert.equal(J.build(input({skillProgress:weak},NOW,{...noOther,catalog:[find(a)],knownIds:new Set()})).steps[0].mode,'focus');
  const data=input(history);
  const ah=J.build({...data,...noOther,aha:data.aha,focusTypes:()=>[],knownIds:new Set()});
  assert.equal(ah.steps[0].mode,'aha');
  assert.equal(ah.steps[0].payload.id,phrase.id);
  assert.equal(J.build({...data,...noOther,recall:data.recall,focusTypes:()=>[],workshopSeen:new Set(catalog.map(w=>w.id))}).steps[0].mode,'recall');
  assert.equal(J.build({...data,...noOther,focusTypes:()=>[]}).steps[0].mode,'workshop');
  for(const mode of ['detector','concept','bridge']){
    const clean=input(),p=J.build({...clean,...noOther,[mode]:clean[mode],focusTypes:()=>[]});
    assert.equal(p.steps.length,1);
    assert.equal(p.steps[0].mode,mode);
    assert.ok(clean[mode].available.some(task=>task.id===p.steps[0].payload.id));
  }
});
test('specialised planners retain waiting intervals and history remains immutable',()=>{
  const phrase=catalog.find(item=>item.kind==='expression'),recallTask=find('sv-0002'),
    det=detectorContent.find(t=>t.level===1&&t.starter),ct=conceptContent.tasks.find(t=>t.starter),br=bridgeContent.tasks.find(t=>t.starter);
  const history={reviewProgress:{[a]:{streak:1,dueAt:NOW+1,lastVariant:'meaning'}},
    skillProgress:A.record({}, {id:a,kind:'word',taskType:'meaning'},'wrong',NOW-DAY),
    readingProgress:B.recordProgress({},phrase.id,'expression','guided',NOW,'expression:challenge'),
    recallProgress:Recall.record({},catalog,recallTask.id,{stage:1,matched:false,helped:true},NOW),
    detectorProgress:Detector.record({},detectorContent,det.id,{word:'helped',clue:'supported'},NOW),
    conceptProgress:Concepts.record({},conceptContent.tasks,ct.id,'supported',NOW),
    bridgeProgress:Concepts.record({},bridgeContent.tasks,br.id,'supported',NOW)};
  const before=JSON.stringify(history),data=input(history,NOW);
  assert.ok(!data.aha.ready.some(row=>row.id===phrase.id));
  assert.ok(!data.recall.ready.some(row=>row.id===recallTask.id));
  for(const [mode,t] of [['detector',det],['concept',ct],['bridge',br]])assert.ok(!data[mode].available.some(row=>row.id===t.id));
  assert.equal(J.build({...data,...noOther,catalog:[find(a)],knownIds:new Set()}).steps.length,0);
  assert.equal(J.build({...input(history,NOW+1),...noOther,catalog:[find(a)],knownIds:new Set()}).steps[0].payload.skill,'meaning');
  const after=input(history,NOW+DAY);
  assert.ok(after.aha.ready.some(row=>row.id===phrase.id));
  assert.ok(after.recall.ready.some(row=>row.id===recallTask.id));
  for(const [mode,t] of [['detector',det],['concept',ct],['bridge',br]])assert.ok(after[mode].available.some(row=>row.id===t.id));
  assert.equal(JSON.stringify(history),before);
});
