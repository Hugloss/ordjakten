'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const E=require('../public/js/engine');
const J=require('../public/js/quests');
const root=path.resolve(__dirname,'../public');
const bank=JSON.parse(fs.readFileSync(path.join(root,'data/ordbank.json'),'utf8'));
const expressions=JSON.parse(fs.readFileSync(path.join(root,'data/expressions.json'),'utf8'));
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data/curation.js'),'utf8'),ctx);
const curation=ctx.window.ORDJAKTEN_CURATION;
const base=E.sanitizeSettings({topic:'words',difficulty:'easy',count:25,mode:'test',timerMode:'total'});
const make=(id,mistakes={},settings=base)=>J.makePlan(id,settings,mistakes,bank,curation,expressions,E);

test('miniquests use the real engine and never silently change answer keys',()=>{
  const scout=make('scout');
  assert.equal(scout.settings.mode,'train');assert.equal(scout.settings.timerMode,'off');
  assert.equal(scout.settings.topic,'words');assert.equal(scout.settings.count,5);
  const first=E.generateRound(bank,curation,{...base,...scout.settings},{},()=>0.43,expressions);
  assert.equal(first.length,5);assert.equal(first.every(q=>q.options.filter(x=>x.correct).length===1),true);
  const story=make('stories');
  assert.equal(story.settings.topic,'expressions');assert.equal(story.settings.expressionTask,'mix');
  const second=E.generateRound(bank,curation,{...base,...story.settings},{},()=>0.43,expressions,JSON.parse(fs.readFileSync(path.join(root,'data/missions.json'),'utf8')));
  assert.equal(new Set(second.map(q=>q.taskType)).size,3);
});

test('word explorer earns badge for trying five words regardless of mistakes',()=>{
  const questions=Array.from({length:5},(_,i)=>({id:'sv-'+(i+1),kind:'word'}));
  const answers=Object.fromEntries(questions.map((q,i)=>[q.id,i%2?'right':'wrong']));
  assert.deepEqual(J.progress('scout',questions,answers),{done:5,goal:5,complete:true});
  assert.deepEqual(J.progress('scout',questions.slice(0,3),answers),{done:3,goal:5,complete:false});
});

test('stories require all three different kinds of task, not five copies of meaning',()=>{
  const questions=['meaning','sentence','order','meaning','sentence'].map((taskType,i)=>({id:`ut-${i}`,kind:'expression',taskType}));
  const answers=Object.fromEntries(questions.map(q=>[q.id,'wrong']));
  assert.equal(J.progress('stories',questions,answers).complete,true);
  assert.equal(J.progress('stories',questions,{'ut-0':'wrong','ut-1':'right','ut-2':'wrong'}).complete,false);
  const copies=questions.map(q=>({...q,taskType:'meaning'}));
  assert.equal(J.progress('stories',copies,answers).complete,false);
});

test('retry mission only counts correctly revisited earlier errors',()=>{
  const questions=[{id:'sv-0011'},{id:'sv-0012'}];
  assert.deepEqual(J.progress('comeback',questions,{'sv-0011':'wrong','sv-0012':'right'},{'sv-0011':3}),{done:0,goal:1,complete:false});
  assert.deepEqual(J.progress('comeback',questions,{'sv-0011':'right','sv-0012':'wrong'},{'sv-0011':3}),{done:1,goal:1,complete:true});
});

test('repetition searches other levels/topics, and is unavailable with no past mistakes',()=>{
  assert.equal(make('comeback'),null);
  const possible=E.getTopicPool(bank,curation,expressions,{topic:'expressions',difficulty:'medium'});
  const id=possible[0].entry.id;
  const plan=make('comeback',{[id]:1});
  assert.equal(plan.settings.reviewOnly,true);
  assert.ok(['mixed','expressions'].includes(plan.settings.topic));
  const pool=E.generateRound(bank,curation,{...base,...plan.settings},{[id]:1},()=>0.51,expressions);
  assert.equal(pool.length,1);
  assert.equal(pool[0].id,id);
  assert.equal(J.chooseSurprise(base,{},bank,curation,expressions,E,()=>0.99),'stories');
});

test('older stored results and book progress survive quest progress migration',()=>{
  const old=E.sanitizeHistory({mistakes:{'sv-0001':2},missionProgress:{'ut-0001':['meaning']},results:[{finishedAt:1770000000000,right:1,wrong:1,unanswered:0,total:2}]});
  assert.deepEqual(old.questCounts,{scout:0,stories:0,comeback:0});
  assert.equal(old.mistakes['sv-0001'],2);
  assert.equal(old.results.length,1);
  const after=E.sanitizeHistory({...old,questCounts:{scout:1,stories:99999,comeback:-2,evil:5000}});
  assert.deepEqual(after.questCounts,{scout:1,stories:999,comeback:0});
  assert.deepEqual(J.earn(after.questCounts,'scout',true),{scout:2,stories:999,comeback:0});
  assert.deepEqual(J.earn(after.questCounts,'comeback',false),after.questCounts);
  assert.equal(J.earn(after.questCounts,'evil',true).evil,undefined);
});

test('automatic retry missions keep extension-only mistakes available for explicit practice',()=>{
  const settings={...base,difficulty:'exam',topic:'mixed'};
  const extensionMistakes=Object.fromEntries([...curation.extensionWords,...curation.extensionExpressions].map(id=>[id,2]));
  const before=JSON.stringify(extensionMistakes);
  assert.equal(make('comeback',extensionMistakes,settings),null);
  const reviews=Object.fromEntries(Object.keys(extensionMistakes).map(id=>[id,{streak:0,dueAt:1}]));
  assert.equal(J.makePlan('comeback',settings,extensionMistakes,bank,curation,expressions,E,reviews,100),null);
  const core=E.getPool(bank,curation,'medium')[0].id;
  const mixed={...extensionMistakes,[core]:1};
  const plan=make('comeback',mixed,settings);
  assert.ok(plan);
  assert.notEqual(plan.settings.difficulty,'exam');
  const questions=E.generateRound(bank,curation,{...settings,...plan.settings},mixed,()=>0.51,expressions);
  assert.deepEqual(questions.map(question=>question.id),[core]);
  assert.equal(JSON.stringify(extensionMistakes),before);
  const explicit=E.getTopicPool(bank,curation,expressions,settings);
  for(const id of Object.keys(extensionMistakes))assert.ok(explicit.some(item=>item.entry.id===id));
});
