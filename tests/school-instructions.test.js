'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../public/js/engine'),M=require('../public/js/missions'),B=require('../public/js/reading-check'),D=require('../public/js/adaptive'),P=require('../public/js/question-play');
const bank=require('../public/data/ordbank.json'),expressions=require('../public/data/expressions.json'),
  missions=require('../public/data/missions.json'),surprises=require('../public/data/surprises.json'),contexts=require('../public/data/word-contexts.json');
const school=expressions.expressions.filter(e=>e.category==='school-instruction');
const settings={...E.DEFAULT_STATE.settings,topic:'expressions',mode:'train',difficulty:'medium',count:5,schoolOnly:true,adaptivePractice:true};
const curation={};
test('fourteen core school instructions have definitions, worked answers, ordered steps and distinct Aha contexts',()=>{
 assert.deepEqual(school.map(e=>e.phrase),['Jämför','Beskriv','Förklara','Sammanfatta','Motivera','Argumentera','Resonera','Ge exempel','Redogör för','Dra en slutsats','Tolka','Beräkna','Uppskatta','Undersök']);
 assert.deepEqual(E.validateExpressions(expressions),[]);
 assert.deepEqual(M.validate(missions,expressions),[]);
 for(const entry of school){
   const mission=M.get(missions,entry.id);
   const q=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions);
   assert.equal(q.schoolInstruction,true);assert.equal(q.scene,mission.prompt);
   assert.equal(q.options.length,3);assert.equal(q.options.filter(o=>o.correct).length,1);
   assert.ok(q.options.every(o=>o.label.includes('” – ')));
   assert.equal(D.task(q),'sentence');
   const check=B.makeCheck(q,{bank,contexts,surprises,missions,random:()=>.42});
   assert.equal(check.source,'expression');assert.ok(check.prompt.includes('följer instruktionen'));
   assert.equal(check.options.length,3);
   const right=check.options.find(o=>o.correct).label;
   assert.equal(right,surprises.challenges.find(c=>c.id===entry.id).options.find(o=>o.correct).label);
   assert.ok(!q.options.some(o=>o.label===right));
   const order=E.makeExpressionQuestion(entry,'medium',()=>.42,'order',missions);
   assert.deepEqual(order.correctOrder,mission.order);assert.equal(order.schoolInstruction,true);
   const exam=E.makeExpressionQuestion(entry,'exam',()=>.42,'sentence',missions);
   assert.equal(exam.taskType,'meaning');assert.equal(exam.options.length,5);
   assert.equal(exam.options.filter(o=>o.correct).length,1);
 }
});
test('school-only rounds contain only school instructions and ask practical answers even with adaptive practice enabled',()=>{
 assert.equal(E.getTopicPool(bank,curation,expressions,settings).length,14);
 for(const count of [5,10]){
   const round=E.generateRound(bank,curation,{...settings,count}, {},()=>.42,expressions,missions,{},1000,contexts,{},D,{});
   assert.equal(round.length,count);
   assert.equal(new Set(round.map(q=>q.id)).size,count);
   assert.ok(round.every(q=>q.schoolInstruction&&q.taskType==='sentence'&&q.options.length===3));
 }
 const regular=E.getTopicPool(bank,curation,expressions,{...settings,schoolOnly:false});
 assert.equal(regular.length,67);
 assert.equal(Object.hasOwn(E.sanitizeSettings(settings),'schoolOnly'),false);
});
test('the original expression and review flows still work without the school-only filter',()=>{
 const entry=expressions.expressions[0];
 const q=E.makeExpressionQuestion(entry,'medium',()=>.42,'meaning',missions);
 assert.equal(q.schoolInstruction,undefined);assert.equal(q.scene,entry.scene);
 assert.equal(q.options.length,4);
 const check=B.makeCheck(q,{bank,contexts,surprises,missions,random:()=>.42});
 assert.ok(check.prompt.includes('Vilken NY situation'));
 const review=E.generateRound(bank,curation,{...settings,schoolOnly:false,reviewOnly:true}, {[entry.id]:1},()=>.42,expressions,missions);
 assert.equal(review.length,1);assert.equal(review[0].id,entry.id);
});
test('school instructions require a mission prompt and receive an answer-neutral hint',()=>{
 const entry=school[0],q=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions);
 const bad={...missions,missions:missions.missions.map(m=>m.id===entry.id?{...m,prompt:''}:m)};
 assert.ok(M.validate(bad,expressions).some(x=>x.includes('Skoluppgift saknar instruktion')));
 const a=P.plan(settings,q);
 const b=P.plan(settings,{...q,options:q.options.map((o,i)=>({...o,correct:i===0}))});
 assert.deepEqual(a,b);assert.ok(a.hint.includes('uppgiftsordet'));
 assert.equal(P.plan({...settings,mode:'test'},q).egg,false);
});

test('school explanations teach a real example and connect it to everyday life',()=>{
 for(const entry of school){
   const task=M.get(missions,entry.id);
   const q=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions);
   const good=q.options.find(o=>o.correct);
   const lesson=M.schoolFeedback(q,good.label,missions);
   assert.equal(lesson.explanation,task.explanation);
   assert.equal(lesson.connection,task.connection);
   assert.equal(lesson.rule,entry.schoolRule);
   assert.ok(lesson.explanation.length>=30&&lesson.connection.length>=30);
   assert.equal(lesson.correction,'');
   assert.ok(lesson.answer.length>0);
   assert.ok(!lesson.answer.includes('” – '));
   for(const o of q.options.filter(o=>!o.correct)){
     const miss=M.schoolFeedback(q,o.label,missions);
     assert.equal(miss.correction,task.sentences.find(s=>s.label===o.label).feedback);
     assert.ok(miss.correction.length>=15);
     assert.equal(miss.explanation,lesson.explanation);
   }
   const meaning=E.makeExpressionQuestion(entry,'medium',()=>.42,'meaning',missions);
   assert.equal(M.schoolFeedback(meaning,null,missions).explanation,entry.reveal[0].text);
   assert.equal(M.schoolFeedback(meaning,null,missions).connection,entry.reveal[1].text);
   const check=B.makeCheck(q,{bank,contexts,surprises,missions,random:()=>.42});
   assert.equal(check.why,surprises.challenges.find(c=>c.id===entry.id).explanation);
 }
 assert.equal(M.schoolFeedback(E.makeExpressionQuestion(expressions.expressions[0],'medium'),null,missions),null);
});
test('ice explanation teaches heat transfer and connects to the snowman',()=>{
 const entry=school.find(e=>e.phrase==='Förklara');
 assert.match(entry.example,/värme från luften/);
 assert.match(entry.reveal[1].text,/snögubbe/);
 const q=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions);
 const lesson=M.schoolFeedback(q,q.options.find(o=>o.correct).label,missions);
 assert.match(lesson.explanation,/vattenånga/);
 assert.match(lesson.connection,/vattenpöl/);
});
test('content checks reject missing concrete explanations and choice-specific feedback',()=>{
 const id=school[0].id;
 const invalid={...missions,missions:missions.missions.map(m=>m.id===id?{...m,explanation:'',connection:'',sentences:m.sentences.map(s=>({...s,feedback:''}))}:m)};
 const errors=M.validate(invalid,expressions);
 assert.ok(errors.some(s=>s.includes('konkret explanation')));
 assert.ok(errors.some(s=>s.includes('konkret connection')));
 assert.ok(errors.some(s=>s.includes('svarsspecifik')));
 const invalidExpressions={...expressions,expressions:expressions.expressions.map(e=>e.id===id?{...e,schoolRule:''}:e)};
 assert.ok(E.validateExpressions(invalidExpressions).some(s=>s.includes('arbetsregel')));
});

test('school Aha choices belong to one new task, including standalone repetitions',()=>{
 const deps={bank,contexts,surprises,missions,random:()=>.42};
 for(const entry of school){
   const q=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions);
   const check=B.makeCheck(q,deps);
   const prefix=check.options[0].label.split('” – ')[0];
   assert.equal(check.options.length,3);
   assert.ok(check.options.every(o=>o.label.split('” – ')[0]===prefix));
   assert.ok(check.options.every(o=>!q.options.some(p=>p.label===o.label)));
   // The per-word Aha planner supplies only the catalogue item, not the quiz flag.
   const bare={id:entry.id,kind:'expression',word:entry.phrase,definition:entry.definition,options:[]};
   for(const random of [()=>.01,()=>.99]){
     const later=B.makeCheck(bare,{...deps,random});
     assert.equal(later.options.length,3);
     assert.ok(later.prompt.includes('följer instruktionen'));
     assert.equal(new Set(later.options.map(o=>o.label.split('” – ')[0])).size,1);
     assert.equal(later.options.filter(o=>o.correct).length,1);
   }
 }
});
