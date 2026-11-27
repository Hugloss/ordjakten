'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../public/js/engine'),B=require('../public/js/reading-check'),S=require('../public/js/surprises');
const bank=require('../public/data/ordbank.json'),contexts=require('../public/data/word-contexts.json'),expressions=require('../public/data/expressions.json'),surprises=require('../public/data/surprises.json'),missions=require('../public/data/missions.json');
const lessons=bank.words.filter(w=>w.teaching);
test('fourteen enriched words have a concrete explanation, familiar example, counterexample and open prompt',()=>{
 assert.equal(lessons.length,14);
 assert.deepEqual(E.validateBank(bank),[]);
 for(const w of lessons){
   const lesson=E.wordTeaching(bank,w.id);
   assert.deepEqual(lesson,w.teaching);
   assert.equal(new Set(Object.values(lesson)).size,4);
   assert.ok(lesson.ownPrompt.includes('?'));
 }
 const missing=bank.words.find(w=>!w.teaching);
 assert.equal(E.wordTeaching(bank,missing.id),null);
 const malformed={...bank,words:bank.words.map(w=>w.id===lessons[0].id?{...w,teaching:{...w.teaching,nonExample:''}}:w)};
 assert.ok(E.validateBank(malformed).some(x=>x.includes('Ofullständig ordförklaring')));
});
test('new everyday scenes teach actual meaning and transfer without inventing examples',()=>{
 assert.equal(contexts.wordContexts.length,55);
 for(const w of lessons){
   const row=contexts.wordContexts.find(r=>r.id===w.id);
   assert.ok(row);
   for(let i=0;i<3;i++){
     const q=E.makeContextQuestion(w,bank,contexts,()=>.37,i);
     const before=JSON.stringify(q);
     const right=q.options.find(o=>o.correct),wrong=q.options.find(o=>!o.correct);
     assert.equal(E.wordFeedback(bank,q,right.label).correction,'');
     const feedback=E.wordFeedback(bank,q,wrong.label);
     assert.ok(feedback.correction.includes(wrong.label.toLocaleLowerCase('sv-SE')));
     assert.equal(feedback.nonExample,w.teaching.nonExample);
     const check=B.makeCheck(q,{bank,contexts,surprises,missions,random:()=>.37});
     assert.equal(check.source,'context');assert.equal(check.options.length,3);
     assert.ok(!check.options.some(o=>o.label===q.stem));
     assert.equal(JSON.stringify(q),before);
   }
 }
});
test('tvetydig uses genuine ambiguity rather than banka/bänka spelling confusion',()=>{
 const row=contexts.wordContexts.find(r=>r.id==='sv-0098');
 assert.match(row.scenes[0].text,/ny mus/);
 assert.match(row.scenes[0].why,/datormus/);
 assert.match(row.scenes[1].why,/kungakrona/);
 assert.ok(!row.scenes.some(s=>s.text.includes('banken')));
});
test('a school distractor from another task fails validation',()=>{
 const target=surprises.challenges.find(x=>x.ahaDistractor);
 const broken={...surprises,challenges:surprises.challenges.map(c=>c.id===target.id?{...c,ahaDistractor:'”En annan uppgift.” – Ett svar som inte hör ihop.'}:c)};
 assert.ok(S.validate(broken,expressions).some(x=>x.includes('samma uppgift')));
});
