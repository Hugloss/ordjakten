'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const L=require('../public/js/learning-map');
const B=require('../public/js/reading-check');
const V=require('../public/js/aha-plan');
const D=require('../public/js/adaptive');
const F=require('../public/js/focus-practice');
const E=require('../public/js/engine');
const K=require('../public/js/contrast');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const contexts=require('../public/data/word-contexts.json');
const missions=require('../public/data/missions.json');
const surprises=require('../public/data/surprises.json');
const contrasts=require('../public/data/contrasts.json');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;
const catalog=L.catalog(bank,expressions,contexts);
const NOW=1780000000000,DAY=V.DAY;
const deps={bank,contexts,missions,surprises,reading:B,random:()=>.37};
const types=item=>F.supported(F.findItem(item.id,bank,expressions),curation,contexts,missions,K,contrasts);
const profile=(item,skills={},reading={},now=NOW,missionProgress={})=>L.profile(item,{
  types:types(item),skillProgress:skills,missionProgress,readingProgress:reading,
  transfer:V.option(item,reading,deps),reading:B,now});
const facet=(p,id)=>p.facets.find(row=>row.id===id);
const q=(item,type)=>({id:item.id,kind:item.kind,taskType:type,picture:type==='picture'});
const word=catalog.find(item=>item.name==='Grumlig');
const easy=catalog.find(item=>types(item).includes('picture'));
const phrase=catalog.find(item=>item.kind==='expression');
test('all 188 concepts have five honest dimensions and playable actions, no fictional exercises',()=>{
  let authored=0;
  for(const item of catalog){
    const p=profile(item);
    assert.equal(p.facets.length,5);
    assert.equal(p.tried,0);
    assert.equal(p.seen,false);
    assert.equal(p.next.id,'meaning');
    for(const row of p.facets){
      if(row.state==='unavailable')assert.equal(row.action,null);
      if(row.action?.kind==='aha'){
        authored++;
        const choice=V.option(item,{},deps);
        assert.ok(choice.check.evidence);
        assert.equal(choice.check.options.filter(x=>x.correct).length,1);
      }
      if(row.action?.kind==='focus'){
        const drill=F.create(item.id,row.action.skill,bank,curation,expressions,missions,contexts,E,{},()=>.37,K,contrasts);
        assert.equal(drill.chosen,row.action.skill);
        assert.equal(drill.questions[0].taskType,row.action.skill);
        if(row.id==='meaning')assert.equal(drill.questions[0].picture,false);
      }
    }
  }
  assert.ok(authored>=expressions.expressions.length);
});
test('a picture match, reverse choice, definition, and story are independent signals',()=>{
  const image=D.record({},q(easy,'picture'),'right',NOW);
  assert.equal(facet(profile(easy,image),'recognition').state,'right');
  assert.equal(facet(profile(easy,image),'meaning').state,'new');
  const reverse=D.record({},q(word,'reverse'),'right',NOW);
  assert.equal(facet(profile(word,reverse),'recognition').state,'right');
  assert.equal(facet(profile(word,reverse),'story').state,'new');
  let p=D.record({},q(word,'meaning'),'right',NOW);
  p=D.record(p,q(word,'context'),'wrong',NOW);
  const result=profile(word,p);
  assert.equal(facet(result,'meaning').state,'right');
  assert.equal(facet(result,'story').state,'practice');
  assert.equal(result.next.id,'story');
  assert.equal(result.next.action.skill,'context');
  assert.equal(facet(result,'transfer').state,'new');
});
test('ordering alone and comparison cannot pretend to demonstrate new-example understanding',()=>{
  const ordering=D.record({},q(phrase,'order'),'right',NOW);
  const p=profile(phrase,ordering);
  assert.equal(facet(p,'story').state,'new');
  assert.equal(facet(p,'transfer').state,'new');
  assert.equal(facet(p,'recognition').state,'unavailable');
  assert.equal(facet(p,'contrast').state,'unavailable');
  const pairWord=catalog.find(item=>types(item).includes('contrast'));
  const compared=D.record({},q(pairWord,'contrast'),'right',NOW);
  assert.equal(facet(profile(pairWord,compared),'contrast').state,'right');
  assert.notEqual(facet(profile(pairWord,compared),'transfer').state,'right');
  assert.notEqual(facet(profile(pairWord,compared),'story').state,'right');
});
test('a standalone Aha can start before any failure but cannot skip the interval',()=>{
  const first=V.option(phrase,{},deps);
  assert.equal(first.dueAt,0);
  let p=B.recordProgress({},phrase.id,'expression','first',NOW,first.check.evidence);
  const waiting=profile(phrase,{},p,NOW);
  assert.equal(facet(waiting,'transfer').state,'waiting');
  assert.equal(facet(waiting,'transfer').action,null);
  assert.equal(facet(waiting,'story').state,'right');
  assert.equal(facet(profile(phrase,{},p,NOW+DAY-1),'transfer').action,null);
  const second=V.option(phrase,p,deps);
  assert.notEqual(second.check.evidence,first.check.evidence);
  assert.equal(facet(profile(phrase,{},p,NOW+DAY),'transfer').action.kind,'aha');
  p=B.recordProgress(p,phrase.id,'expression','first',NOW+DAY,second.check.evidence);
  assert.equal(facet(profile(phrase,{},p,NOW+DAY),'transfer').state,'spaced');
  assert.equal(V.plan(p,{...deps,expressions,now:NOW+2*DAY}).round.length,0);
});
test('a supported Aha is not a direct success, and renewed difficulty reopens the specific need',()=>{
  let p=B.recordProgress({},phrase.id,'expression','guided',NOW,'expression:challenge');
  assert.equal(facet(profile(phrase,{},p,NOW),'story').state,'supported');
  assert.equal(facet(profile(phrase,{},p,NOW),'transfer').state,'waiting');
  assert.equal(profile(phrase,{},p,NOW).needsPractice,true);
  const ready=profile(phrase,{},p,NOW+DAY);
  assert.equal(ready.next.id,'transfer');
  p=B.recordProgress(p,phrase.id,'expression','first',NOW+DAY,'expression:mission');
  p=B.recordProgress(p,phrase.id,'expression','first',NOW+2*DAY,'expression:challenge');
  assert.equal(facet(profile(phrase,{},p,NOW+2*DAY),'transfer').state,'spaced');
  p=B.recordProgress(p,phrase.id,'expression','retry',NOW+3*DAY,'expression:mission');
  assert.equal(facet(profile(phrase,{},p,NOW+4*DAY),'transfer').state,'practice');
});
test('legacy repeated answers never invent distinct spaced examples',()=>{
  let p=B.recordProgress({},phrase.id,'expression','guided',NOW);
  p=B.recordProgress(p,phrase.id,'expression','first',NOW+DAY);
  p=B.recordProgress(p,phrase.id,'expression','first',NOW+2*DAY);
  assert.notEqual(facet(profile(phrase,{},p,NOW+3*DAY),'transfer').state,'spaced');
  p=B.recordProgress(p,phrase.id,'expression','first',NOW+3*DAY,'expression:challenge');
  assert.equal(p[phrase.id].transfer.legacyMastered,true);
  assert.notEqual(facet(profile(phrase,{},p,NOW+4*DAY),'transfer').state,'spaced');
});
test('unproved authored scene is preferred over an already credited scene when both are new for this visit',()=>{
  const row=contexts.wordContexts.find(x=>x.id===word.id);
  assert.ok(row);
  let p=B.recordProgress({},word.id,'context','guided',NOW,'context:2');
  p=B.recordProgress(p,word.id,'context','first',NOW+DAY,'context:0');
  p=B.recordProgress(p,word.id,'context','first',NOW+DAY+100,'context:1');
  assert.equal(p[word.id].transfer.quality,1);
  for(const random of [()=>.01,()=>.99]){
    const choice=V.option(word,p,{...deps,random});
    assert.equal(choice.check.evidence,'context:2');
  }
});
test('the meaning gap takes priority over story gaps; no action is offered for absent authored material',()=>{
  let p=D.record({},q(word,'context'),'wrong',NOW);
  p=D.record(p,q(word,'meaning'),'wrong',NOW);
  assert.equal(profile(word,p).next.id,'meaning');
  const noStory=catalog.find(item=>item.kind==='word'&&!item.hasContext);
  assert.equal(V.option(noStory,{},deps),null);
  const unavailable=facet(profile(noStory),'transfer');
  assert.equal(unavailable.state,'unavailable');
  assert.equal(unavailable.action,null);
  const stale=B.recordProgress({},noStory.id,'context','guided',NOW,'context:0');
  assert.equal(facet(profile(noStory,{},stale,NOW+DAY),'transfer').state,'unavailable');
});
