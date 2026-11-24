'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const E=require('../public/js/engine');
const R=require('../public/js/review');
const D=require('../public/js/adaptive');
const base=path.resolve(__dirname,'../public');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(base,'data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;
const NOW=1800000000000;
const settings={mode:'train',difficulty:'medium',topic:'words',count:10,contextMix:true,adaptivePractice:true};
const round=(overrides={},progress={},reviews={},random=()=>.42)=>E.generateRound(bank,curation,{...settings,...overrides},{},random,expressions,missions,reviews,NOW,contexts,progress,D);
const q=(taskType='meaning',id='sv-0044')=>({id,kind:'word',taskType,picture:false});
function gotWrong(type,id='sv-0044'){
  return D.record(D.sanitize(null),q(type,id),'wrong',NOW-1000);
}
test('old data and settings work, and adaptive practice can be switched off',()=>{
  const old=E.sanitizeHistory({settings:{mode:'train'},results:[{finishedAt:NOW,right:3,wrong:2,total:5}],mistakes:{'sv-0044':2}});
  assert.equal(old.settings.adaptivePractice,true);
  assert.deepEqual(D.sanitize(old.skillProgress),D.sanitize(null));
  assert.equal(old.results[0].right,3);
  assert.equal(old.mistakes['sv-0044'],2);
  assert.equal(E.sanitizeSettings({...old.settings,adaptivePractice:false}).adaptivePractice,false);
  assert.equal(E.sanitizeSettings({adaptivePractice:'not boolean'}).adaptivePractice,true);
});
test('correct definition and wrong context are separate observations',()=>{
  let progress=D.record({},q('meaning'),'right',NOW-2000);
  progress=D.record(progress,{...q('context'),contextIndex:0},'wrong',NOW-1000);
  assert.equal(progress['sv-0044'].skills.meaning.streak,1);
  assert.equal(progress['sv-0044'].skills.context.streak,0);
  assert.equal(progress['sv-0044'].skills.context.wrong,1);
  const summary=D.summary(progress);
  assert.equal(summary.concepts,1);assert.equal(summary.practised,2);assert.equal(summary.needsPractice,1);
  assert.equal(D.choiceType({kind:'word',entry:{id:'sv-0044'}},settings,progress,['meaning','reverse','context'],()=>.2),'context');
});
test('new and familiar words vary question type without inventing contexts',()=>{
  const item={kind:'word',entry:{id:'sv-0044'}};
  assert.equal(D.choiceType(item,settings,{},['meaning','reverse','context'],()=>.12),'meaning');
  assert.equal(D.choiceType(item,settings,{},['meaning','reverse','context'],()=>.9),'context');
  assert.equal(D.choiceType(item,settings,{},['meaning','reverse','context'],()=>.97),'reverse');
  assert.ok(['meaning','reverse'].includes(D.choiceType(item,settings,{},['meaning','reverse'],()=>.78)));
  assert.deepEqual(D.availableTypes(item,{difficulty:'easy'},true,true),['picture']);
  assert.deepEqual(D.availableTypes(item,{difficulty:'medium',contextMix:false},true,true),['meaning','reverse']);
});
test('expressions distinguish meaning, sentence and order, respecting forced mode',()=>{
  const item={kind:'expression',entry:{id:'ut-0001'}};
  const options=D.availableTypes(item,{difficulty:'medium',expressionTask:'mix'},false,true);
  assert.deepEqual(options,['meaning','sentence','order']);
  let progress=D.record({}, {id:'ut-0001',kind:'expression',taskType:'meaning'},'right',NOW-100);
  progress=D.record(progress, {id:'ut-0001',kind:'expression',taskType:'sentence'},'wrong',NOW);
  assert.equal(D.choiceType(item,{difficulty:'medium',expressionTask:'mix'},progress,options),'sentence');
  assert.deepEqual(D.availableTypes(item,{difficulty:'medium',expressionTask:'meaning'},false,true),['meaning']);
  assert.deepEqual(D.availableTypes(item,{difficulty:'exam',expressionTask:'mix'},false,true),['meaning']);
});
test('wrong context returns with a DIFFERENT one of three authored scenes',()=>{
  const item={...q('context'),contextIndex:0};
  let progress=D.record({},item,'wrong',NOW);
  assert.equal(D.nextScene(progress,item.id,()=>0),1);
  const replay=E.makeContextQuestion(bank.words.find(w=>w.id===item.id),bank,contexts,()=>.23,D.nextScene(progress,item.id));
  assert.equal(replay.contextIndex,1);
  progress=D.record(progress,replay,'right',NOW+60_000);
  assert.equal(D.nextScene(progress,item.id),2);
  const third=E.makeContextQuestion(bank.words.find(w=>w.id===item.id),bank,contexts,()=>.12,D.nextScene(progress,item.id));
  assert.notEqual(third.stem,replay.stem);
});
test('adaptive practice prioritises previously missed words but retains new concepts',()=>{
  const progress=gotWrong('context');
  const questions=round({count:10},progress);
  assert.equal(questions.length,10);
  assert.equal(new Set(questions.map(item=>item.id)).size,10);
  assert.ok(questions.some(question=>question.id==='sv-0044'),'Grumlig should have priority');
  assert.equal(questions.find(question=>question.id==='sv-0044').taskType,'context');
  assert.ok(questions.filter(question=>question.id!=='sv-0044').length>=5,'Keep exploring other words');
});
test('cooldown from spaced review is honoured when prioritising',()=>{
  const progress=gotWrong('context');
  const basePool=E.getTopicPool(bank,curation,expressions,settings);
  const cool={'sv-0044':{streak:1,dueAt:NOW+3_600_000,lastVariant:'context',attempts:1}};
  const without=D.pickItems(basePool,10,progress,{},settings,new Set(contexts.wordContexts.map(x=>x.id)),true,NOW,()=>.43);
  const waiting=D.pickItems(basePool,10,progress,cool,settings,new Set(contexts.wordContexts.map(x=>x.id)),true,NOW,()=>.43);
  assert.ok(without.some(x=>x.entry.id==='sv-0044'));
  // The waiting card is not *forced* into a session. It can still appear by normal exploration.
  assert.ok(waiting.length===10);
  assert.ok(!waiting.some(x=>x.entry.id==='sv-0044'),'A waiting word should not reappear when other words are available');
});
test('test and exam rounds do not use history to choose questions or vary test formats',()=>{
  const progress=gotWrong('context');
  const a=round({mode:'test',count:10},progress,{},()=>.47);
  const b=round({mode:'test',count:10},D.sanitize(null),{},()=>.47);
  assert.deepEqual(a,b,'Stored learning data must not influence a scored test');
  const exam=round({mode:'test',difficulty:'exam',count:10},progress);
  assert.ok(exam.every(question=>question.options.length===5 && !question.picture && question.taskType!=='context'));
});
test('easy mode keeps trustworthy pictures and optional context setting remains respected',()=>{
  const easy=round({difficulty:'easy',count:25},gotWrong('context'));
  assert.ok(easy.every(item=>item.picture&&item.options.length===4));
  const noContexts=round({count:25,contextMix:false},gotWrong('context'));
  assert.ok(noContexts.every(item=>item.taskType!=='context'));
});
test('adaptive mixed rounds preserve both content types and all have valid keys',()=>{
  const questions=round({topic:'mixed',count:20},D.record({}, {id:'ut-0001',kind:'expression',taskType:'sentence'},'wrong',NOW));
  assert.equal(questions.length,20);
  assert.equal(new Set(questions.map(q=>q.id)).size,20);
  assert.equal(questions.filter(q=>q.kind==='expression').length,10);
  assert.ok(questions.every(q=>q.taskType==='order'&&q.steps?.length===3||q.options?.filter(o=>o.correct).length===1));
});
test('unanswered is never a new failure or skill observation',()=>{
  const start=gotWrong('context');
  assert.equal(D.record(start,q('reverse'),'unanswered',NOW),start);
  assert.equal(Object.keys(start['sv-0044'].skills).length,1);
});
test('sanitizer discards malformed entries and caps counters and dates',()=>{
  const raw={evil:{skills:{meaning:{right:2}}},'sv-0044':{lastScene:99,skills:{meaning:{right:999999,wrong:-1,attempts:Infinity,streak:100,lastAt:Infinity},evil:{right:7}}},'sv-0005':null};
  const safe=D.sanitize(raw);
  assert.deepEqual(Object.keys(safe),['sv-0044']);
  assert.equal(safe['sv-0044'].skills.meaning.right,9999);
  assert.equal(safe['sv-0044'].skills.meaning.streak,99);
  assert.equal(safe['sv-0044'].skills.meaning.lastAt,0);
  assert.equal(safe['sv-0044'].lastScene,-1);
});

test('learning tips show the weakest skill, never user data or an unsupported diagnosis',()=>{
  let progress=D.record({},q('meaning'),'right',NOW-3000);
  progress=D.record(progress,{...q('context'),contextIndex:1},'wrong',NOW-2000);
  progress=D.record(progress,{id:'ut-0001',kind:'expression',taskType:'sentence'},'wrong',NOW-1000);
  const tips=D.suggestions(progress);
  assert.equal(tips.length,2);
  assert.deepEqual(new Set(tips.map(tip=>tip.skill)),new Set(['context','sentence']));
  assert.equal(tips[0].id,'ut-0001');
  assert.equal(D.suggestions({},3).length,0);
});

test('five contextual quick-start questions rotate curated stories on later sessions',()=>{
  const config={...settings,count:5,contextOnly:true};
  const first=E.generateRound(bank,curation,config,{},()=>.35,expressions,missions,{},NOW,contexts,{},D);
  const chosen=first[0];
  assert.equal(chosen.taskType,'context');
  let progress=D.record({},chosen,'right',NOW);
  const card=progress[chosen.id];
  assert.equal(card.lastScene,chosen.contextIndex);
  const second=E.generateRound(bank,curation,config,{},()=>.35,expressions,missions,{},NOW+1000,contexts,progress,D);
  const same=second.find(q=>q.id===chosen.id);
  if(same)assert.notEqual(same.contextIndex,chosen.contextIndex);
  // The independent selector can always choose another story for the same word.
  assert.equal(D.nextScene(progress,chosen.id),(chosen.contextIndex+1)%3);
});
test('roughly half of a training round stays exploratory when there are enough new words',()=>{
  const candidates=E.getTopicPool(bank,curation,expressions,settings).slice(0,12);
  let progress={};
  for(const row of candidates.slice(0,6)) progress=D.record(progress,q('meaning',row.entry.id),'wrong',NOW);
  const chosen=D.pickItems(candidates,6,progress,{},settings,new Set(),true,NOW,()=>.44);
  const focused=chosen.filter(row=>progress[row.entry.id]?.skills?.meaning?.wrong).length;
  assert.equal(chosen.length,6);
  assert.equal(focused,3);
  assert.equal(new Set(chosen.map(row=>row.entry.id)).size,6);
});
test('two successful contextual answers stop prioritising that weak skill alone',()=>{
  let progress=gotWrong('context');
  assert.equal(D.suggestions(progress).length,1);
  progress=D.record(progress,{...q('context'),contextIndex:1},'right',NOW+100);
  assert.equal(D.suggestions(progress).length,1,'one correct answer is not enough to remove a hard spot');
  progress=D.record(progress,{...q('context'),contextIndex:2},'right',NOW+200);
  assert.equal(D.suggestions(progress).length,0);
  assert.equal(progress['sv-0044'].skills.context.streak,2);
});
