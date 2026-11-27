'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const L=require('../public/js/learning-map.js');
const D=require('../public/js/adaptive.js');
const R=require('../public/js/review.js');
const base=path.resolve(__dirname,'../public');
function load(file,key) {
  const window={};vm.runInNewContext(fs.readFileSync(path.join(base,file),'utf8'),{window});
  return window[key];
}
const bank=load('data/wordbank.js','ORDJAKTEN_WORDS');
const expressions=load('data/expressions.js','ORDJAKTEN_EXPRESSIONS');
const contexts=load('data/word-contexts.js','ORDJAKTEN_CONTEXTS');
const catalog=L.catalog(bank,expressions,contexts);
const grumlig=catalog.find(x=>x.name==='Grumlig');
const NOW=1795513200000;
const card=(item,progress={},review={},missions={},mistakes={})=>L.detail(item,progress,review,missions,mistakes,NOW);
const q=(item,type)=>({id:item.id,kind:item.kind,taskType:type,picture:type==='picture'});

test('map contains 121 real words and 41 expressions, not guessed or generated entries',()=>{
  assert.equal(catalog.length,162);
  assert.equal(new Set(catalog.map(x=>x.id)).size,162);
  assert.equal(catalog.filter(x=>x.kind==='word').length,121);
  assert.equal(catalog.filter(x=>x.kind==='expression').length,41);
  assert.equal(grumlig.hasContext,true);
  assert.ok(catalog.every(x=>x.definition&&x.example));
});
test('blank history does not pretend a child has mastered any word',()=>{
  const zero=L.entries(catalog);
  assert.deepEqual(L.summary(zero),{total:162,discovered:0,recognised:0,applied:0,revisited:0,focus:0});
  assert.equal(L.filter(zero).length,0);
  assert.equal(L.filter(zero,{status:'all'}).length,162);
  assert.deepEqual(card(grumlig).steps.map(x=>x.done),[false,false,false,false]);
});
test('a definition success and a context mistake are independent and never imply mastery',()=>{
  let progress=D.record({},q(grumlig,'meaning'),'right',NOW-300);
  progress=D.record(progress,{...q(grumlig,'context'),contextIndex:0},'wrong',NOW-200);
  const result=card(grumlig,progress);
  assert.deepEqual(result.steps.map(x=>x.done),[true,true,false,false]);
  assert.equal(result.needsPractice,true);
  assert.match(result.tip,/vardag/);
  assert.equal(result.done,2);
});
test('a new correct context adds only its own path marker, not a perfect-score claim',()=>{
  let progress=D.record({},q(grumlig,'meaning'),'right',NOW-300);
  progress=D.record(progress,{...q(grumlig,'context'),contextIndex:0},'right',NOW-200);
  const result=card(grumlig,progress);
  assert.deepEqual(result.steps.map(x=>x.done),[true,true,true,false]);
  assert.match(result.tip,/igen/);
  assert.equal(result.skills.length,2);
});
test('a later mistake does not erase a previously earned revisit marker',()=>{
  let progress={};
  progress=D.record(progress,q(grumlig,'meaning'),'wrong',NOW-9000);
  progress=D.record(progress,q(grumlig,'meaning'),'right',NOW-6000);
  progress=D.record(progress,q(grumlig,'meaning'),'right',NOW-3000);
  const reviews={[grumlig.id]:{streak:2,dueAt:0,attempts:3,lastVariant:'meaning'}};
  assert.equal(card(grumlig,progress,reviews).revisit,true);
  progress=D.record(progress,q(grumlig,'meaning'),'wrong',NOW);
  reviews[grumlig.id]={streak:0,dueAt:NOW,attempts:4,lastVariant:'meaning'};
  assert.equal(card(grumlig,progress,reviews).revisit,true);
  assert.equal(card(grumlig,progress,reviews).needsPractice,true);
});
test('context marker can arrive before meaning without unlocking unknown milestones',()=>{
  const progress=D.record({}, {...q(grumlig,'context'),contextIndex:1},'right',NOW);
  const result=card(grumlig,progress);
  assert.deepEqual(result.steps.map(x=>x.done),[true,false,true,false]);
  assert.equal(result.done,2);
});
test('reverse-only success never gets a misleading contextual-story badge',()=>{
  const progress=D.record({},q(grumlig,'reverse'),'right',NOW);
  const result=card(grumlig,progress);
  assert.equal(result.application,true);
  assert.equal(result.steps[2].label,'Hittat ordet');
  assert.equal(result.steps[2].done,true);
});
test('words without authored context use reverse questions for application',()=>{
  const word=catalog.find(x=>x.kind==='word'&&!x.hasContext);
  const progress=D.record({},q(word,'reverse'),'right',NOW);
  const result=card(word,progress);
  assert.equal(result.application,true);
  assert.match(result.steps[2].label,/Hittat ordet/);
  assert.equal(result.recognition,false);
});
test('an image match is labelled image, not a claim to know the textual definition',()=>{
  const word=catalog.find(x=>x.kind==='word'&&x.difficulty==='easy');
  const progress=D.record({},q(word,'picture'),'right',NOW);
  const result=card(word,progress);
  assert.equal(result.steps[1].label,'Hittat bilden');
  assert.equal(result.revisit,false);
});
test('revisiting requires several observations, or real spaced review successes',()=>{
  let progress=D.record({},q(grumlig,'meaning'),'right',NOW-300);
  progress=D.record(progress,q(grumlig,'meaning'),'right',NOW-200);
  assert.equal(card(grumlig,progress).revisit,false,'Two same-format guesses are insufficient');
  progress=D.record(progress,{...q(grumlig,'context'),contextIndex:2},'right',NOW-100);
  assert.equal(card(grumlig,progress).revisit,true);
  const reviews={[grumlig.id]:{streak:2,dueAt:NOW+100,attempts:3,lastVariant:'context'}};
  assert.equal(card(grumlig,{},reviews).revisit,true,'Spaced reviews count even without 0.13 skills');
});
test('legacy mistakes show a discovered word but fabricate no correct answers',()=>{
  const result=card(grumlig,{}, {}, {}, {[grumlig.id]:2});
  assert.deepEqual(result.steps.map(x=>x.done),[true,false,false,false]);
});
test('expression missions count as observations without changing quiz results',()=>{
  const expression=catalog.find(x=>x.kind==='expression');
  const m={[expression.id]:['sentence']};
  const result=card(expression,{}, {},m);
  assert.deepEqual(result.steps.map(x=>x.done),[true,false,true,false]);
  const completed=card(expression,{}, {},{[expression.id]:['meaning','sentence','order']});
  assert.deepEqual(completed.steps.map(x=>x.done),[true,true,true,true]);
});
test('filters and search are predictable and capped by the UI, not a server call',()=>{
  const progress=D.record({},q(grumlig,'meaning'),'wrong',NOW-200);
  const all=L.entries(catalog,progress);
  assert.deepEqual(L.filter(all,{query:'GRUMLIG',status:'all'}).map(x=>x.name),['Grumlig']);
  assert.equal(L.filter(all,{status:'practice'}).length,1);
  assert.equal(L.filter(all,{kind:'expressions',status:'all'}).length,41);
  assert.equal(L.filter(all,{kind:'words',status:'all'}).length,121);
  assert.equal(L.filter(all,{status:'discovered'}).length,1);
});
test('unanswered questions do not yield fake learning milestones',()=>{
  const skipped=D.record({},q(grumlig,'meaning'),'unanswered',NOW);
  assert.equal(card(grumlig,skipped).done,0);
});
