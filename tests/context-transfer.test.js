'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('../public/js/contrast');
const H=require('../public/js/confusions');
const E=require('../public/js/engine');
const F=require('../public/js/focus-practice');
const bank=require('../public/data/ordbank.json');
const data=require('../public/data/contrasts.json');
const contexts=require('../public/data/word-contexts.json');
const expr=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const vm=require('node:vm');
const w={};vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../public/data/curation.js'),'utf8'),{window:w});
const curation=w.ORDJAKTEN_CURATION;
const options=(question,right)=>question.options.find(o=>o.correct===right);
const play=(state,questions,outcomes,at=1000)=>questions.reduce((card,q,i)=>H.record(card,q,options(q,outcomes[i]),data,at+i),state);

test('all 96 curated comparisons have immutable scene IDs, four answers per word and 3+ contexts per word',()=>{
 assert.equal(data.schema_version,2);
 assert.deepEqual(C.validate(data,bank),[]);
 assert.equal(data.pairs.length,12);
 assert.equal(data.pairs.reduce((n,p)=>n+p.scenes.length,0),96);
 for(const pair of data.pairs){
  assert.equal(pair.scenes.length,8);
  assert.equal(new Set(pair.scenes.map(s=>s.id)).size,8);
  for(const target of [pair.left,pair.right]){
   assert.equal(pair.scenes.filter(s=>s.target===target).length,4);
   assert.ok(new Set(pair.scenes.filter(s=>s.target===target).map(s=>s.context)).size>=3);
  }
  assert.deepEqual(pair.scenes.slice(0,4).map(s=>s.id),[1,2,3,4].map(n=>`${pair.id}-${String(n).padStart(2,'0')}`));
  for(const scene of pair.scenes){assert.ok(C.CONTEXTS[scene.context]); assert.ok(scene.text.length>35);}
 }
});
test('every four-question practice is balanced, varied, with exactly one defensible key per scene',()=>{
 for(const pair of data.pairs){
  for(const seed of [0,.1,.35,.55,.88,.999]){
   const q=C.create(pair.left,data,bank,()=>seed).questions;
   assert.equal(q.length,4);
   assert.equal(q.filter(x=>x.id===pair.left).length,2);
   assert.equal(q.filter(x=>x.id===pair.right).length,2);
   assert.ok(new Set(q.map(x=>x.contrastContext)).size>=3);
   assert.equal(new Set(q.map(x=>x.contrastSceneId)).size,4);
   for(const entry of q){
    assert.equal(entry.options.length,2);
    assert.equal(entry.options.filter(o=>o.correct).length,1);
    assert.equal(entry.contrastContextLabel,C.CONTEXTS[entry.contrastContext]);
    assert.equal(entry.options.find(o=>o.correct).id,entry.id);
    assert.equal(entry.taskType,'contrast');
   }
  }
 }
});
test('the second practice session uses four unseen stories for every pair',()=>{
 for(const pair of data.pairs){
  let state={};const a=C.create(pair.left,data,bank,()=>.42,state);
  state=play(state,a.questions,[true,true,false,true]);
  const b=C.create(pair.left,data,bank,()=>.42,state);
  assert.deepEqual(b.questions.filter(q=>a.questions.some(old=>old.contrastSceneId===q.contrastSceneId)).map(q=>q.contrastSceneId),[]);
  assert.equal(new Set([...a.questions,...b.questions].map(q=>q.contrastSceneId)).size,8);
 }
});
test('an error is recorded in its named setting and produces a gentle comparison suggestion',()=>{
 const pair=data.pairs[0];const q=C.create(pair.left,data,bank,()=>.4).questions;
 const miss=q.find(x=>x.id===pair.left);
 const state=H.record({},miss,options(miss,false),data,5000);
 const tip=H.recommendations(data,state,3)[0];
 assert.equal(tip.pair.id,pair.id);assert.equal(tip.needsPractice,true);
 assert.equal(tip.byContext[miss.contrastContext].wrong,1);
 assert.ok(tip.nextContexts.every(c=>pair.scenes.some(s=>s.context===c)));
 assert.equal(tip.contextsTried,1);
 assert.ok(!JSON.stringify(state).includes(miss.stem),'never store free text or story content');
});
test('repeated right-clicks on one memorized scenario do NOT prove transfer',()=>{
 const pair=data.pairs[0];const q=C.create(pair.left,data,bank,()=>.38).questions;
 let progress={};progress=H.record(progress,q[0],options(q[0],false),data,10);
 for(let i=0;i<4;i++) progress=H.record(progress,q[0],options(q[0],true),data,20+i);
 const insight=H.insight(pair,progress[pair.id]);
 assert.equal(insight.recovered,false);
 assert.equal(insight.needsPractice,true);
 assert.equal(insight.contextsWithCorrect,1);
 assert.equal(insight.transferred,false);
 // Now practice BOTH concepts in several environments.
 const diverse=C.create(pair.left,data,bank,()=>.39,progress).questions;
 for(let i=0;i<diverse.length;i++)progress=H.record(progress,diverse[i],options(diverse[i],true),data,100+i);
 assert.equal(H.insight(pair,progress[pair.id]).recovered,true);
 assert.equal(H.insight(pair,progress[pair.id]).needsPractice,false);
});
test('old 0.17 confusion data survives and forged environment IDs are discarded',()=>{
 const pair=data.pairs[0];
 const old={ [pair.id]:{attempts:2,right:0,wrong:2,lastAt:100,recent:[
  {target:pair.left,chosen:pair.right,at:50},{target:pair.right,chosen:pair.left,at:100}]}};
 const restored=H.sanitize(old,data);
 assert.deepEqual(restored[pair.id].recent,old[pair.id].recent);
 const tampered=structuredClone(old);
 tampered[pair.id].recent.push({target:pair.left,chosen:pair.right,at:200,sceneId:'js-01-99',context:'skola'});
 tampered[pair.id].recent.push({target:pair.left,chosen:pair.right,at:300,sceneId:pair.scenes[1].id,context:pair.scenes[1].context});
 assert.equal(H.sanitize(tampered,data)[pair.id].recent.length,2);
 const legitimate= C.create(pair.left,data,bank,()=>.4).questions[0];
 assert.equal(H.record({}, {...legitimate,contrastContext:'fake'},options(legitimate,false),data,500)?.[pair.id],undefined);
});
test('a local micropractice reuses saved context evidence and does not alter exam questions',()=>{
 const pair=data.pairs[0];const first=C.create(pair.left,data,bank,()=>.4);
 const state=play({},first.questions,[false,true,true,false]);
 const item=F.findItem(pair.left,bank,expr);
 const plan=F.create(item.id,'contrast',bank,curation,expr,missions,contexts,E,{},()=>.4,C,data,state);
 assert.equal(plan.chosen,'contrast');assert.equal(plan.questions.length,4);
 assert.deepEqual(plan.questions.filter(q=>first.questions.some(x=>x.contrastSceneId===q.contrastSceneId)),[]);
 const exam=E.generateRound(bank,curation,{...E.DEFAULT_STATE.settings,mode:'test',difficulty:'exam',count:10,topic:'words'}, {},()=>.4,expr);
 assert.ok(exam.every(q=>q.taskType!=='contrast'&&q.options.length===5));
});
test('cannot publish broken editorial domains, reused scene IDs or wrong answer balance',()=>{
 const bad=structuredClone(data);
 bad.pairs[0].scenes[0].context='klubben';
 assert.match(C.validate(bad,bank).join(' '),/Okänd miljö/);
 const copy=structuredClone(data);
 copy.pairs[0].scenes[7].id=copy.pairs[0].scenes[0].id;
 assert.match(C.validate(copy,bank).join(' '),/scen-ID/);
 const target=structuredClone(data);
 target.pairs[0].scenes[0].target=target.pairs[0].right;
 assert.match(C.validate(target,bank).join(' '),/facit fyra gånger/);
});
test('the planner continues to offer a weak natural setting instead of only repeating familiar successes',()=>{
 const pair=data.pairs[0];let history={};
 for(let round=0;round<2;round++){
  const questions=C.create(pair.left,data,bank,()=>.4,history).questions;
  for(const [index,q] of questions.entries()){
   const correct=q.contrastContext!=='natur';
   history=H.record(history,q,options(q,correct),data,1000+round*10+index);
  }
 }
 const insight=H.insight(pair,history[pair.id]);
 assert.equal(insight.byContext.natur.wrong,2);
 assert.equal(insight.nextContexts[0],'natur');
 const next=C.create(pair.left,data,bank,()=>.4,history).questions;
 assert.ok(next.some(q=>q.contrastContext==='natur'));
 assert.equal(next.filter(q=>q.id===pair.left).length,2);
 assert.equal(next.filter(q=>q.id===pair.right).length,2);
});
