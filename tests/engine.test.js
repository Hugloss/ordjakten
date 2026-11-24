'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../public/js/engine');
const root=path.resolve(__dirname,'../public');
const bank=JSON.parse(fs.readFileSync(path.join(root,'data/ordbank.json'),'utf8'));
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data/curation.js'),'utf8'),ctx);
const curation=ctx.window.ORDJAKTEN_CURATION;

test('all historical words have unique IDs and complete content',()=>{
  assert.equal(bank.words.length,121);
  assert.deepEqual(E.validateBank(bank),[]);
  assert.equal(new Set(bank.words.map(w=>w.word.toLowerCase())).size,121);
});
test('image-only mode excludes ambiguous illustrations',()=>{
  const pool=E.getPool(bank,curation,'easy');
  assert.ok(pool.length>=25);
  for(const word of ['Skrovlig','Bucklig','Grumlig'])assert.ok(!pool.some(x=>x.word===word));
  for(const entry of pool){const question=E.makeQuestion(entry,bank,curation,'easy',()=>.5);assert.equal(question.options.length,4);assert.equal(question.options.filter(x=>x.correct).length,1);assert.ok(question.options.every(x=>x.emoji&&x.label));}
});
test('25 distinct questions are supported at all requested levels',()=>{
  for(const difficulty of ['easy','medium','hard'])for(const count of [5,10,15,20,25]){
    const round=E.generateRound(bank,curation,{difficulty,count});
    assert.equal(round.length,count,`${difficulty}: ${count}`);
    assert.equal(new Set(round.map(q=>q.id)).size,count);
    assert.ok(round.every(q=>q.options.length===4));
  }
});
test('exam mode uses five answers and 10-question preset is possible',()=>{
  const round=E.generateRound(bank,curation,{difficulty:'exam',count:10});
  assert.equal(round.length,10);assert.ok(round.every(q=>q.options.length===5));
  assert.ok(round.every(q=>q.options.filter(o=>o.correct).length===1));
});
test('question option ordering varies without corrupting correctness',()=>{
  const q=bank.words.find(w=>w.word==='Tålmodig');
  const a=E.makeQuestion(q,bank,curation,'medium',()=>0.01);
  const b=E.makeQuestion(q,bank,curation,'medium',()=>0.99);
  assert.equal(a.options.filter(x=>x.correct)[0].label,q.definition);
  assert.equal(b.options.filter(x=>x.correct)[0].label,q.definition);
  assert.notDeepEqual(a.options.map(o=>o.label),b.options.map(o=>o.label));
});
test('review-only rounds never invent or duplicate questions',()=>{
  const mistakes={'sv-0001':1,'sv-0003':2};
  const round=E.generateRound(bank,curation,{difficulty:'medium',count:25,reviewOnly:true},mistakes);
  assert.equal(round.length,2);assert.deepEqual(new Set(round.map(q=>q.id)),new Set(Object.keys(mistakes)));
  assert.throws(()=>E.generateRound(bank,curation,{difficulty:'medium',count:5,reviewOnly:true},{}));
});
test('score distinguishes wrong from unanswered',()=>{
  assert.deepEqual(E.score({a:'right',b:'wrong',c:'unanswered'},5),{right:1,wrong:1,unanswered:3,percent:20});
  assert.deepEqual(E.score({},5),{right:0,wrong:0,unanswered:5,percent:0});
  assert.deepEqual(E.score({a:'right',b:'right'},2),{right:2,wrong:0,unanswered:0,percent:100});
});
test('timer formats at boundaries without NaN',()=>{
  assert.equal(E.formatTime(180000),'03:00');
  assert.equal(E.formatTime(250),'00:01');
  assert.equal(E.formatTime(0),'00:00');
  assert.equal(E.formatTime(-1000),'00:00');
});
test('settings and user history are validated and bounded',()=>{
  const s=E.sanitizeSettings({difficulty:'invalid',count:100,theme:'neon',timerSeconds:100000});
  assert.equal(s.count,10);assert.equal(s.theme,'dark');assert.equal(s.timerSeconds,3600);
  assert.equal(E.sanitizeHistory(null).results.length,0);
  assert.equal(E.sanitizeHistory({mistakes:{'sv-0021':7,evil:42}}).mistakes['sv-0021'],7);
  assert.equal(E.sanitizeHistory({mistakes:{'sv-0021':7,evil:42}}).mistakes.evil,undefined);
});
test('mistake tracking increments and is cleared by correct review',()=>{
  let mistakes={};
  mistakes=E.applyOutcome(mistakes,'sv-0001','wrong');
  mistakes=E.applyOutcome(mistakes,'sv-0001','wrong');
  assert.equal(mistakes['sv-0001'],2);
  mistakes=E.applyOutcome(mistakes,'sv-0001','right');
  assert.equal(mistakes['sv-0001'],1);
  mistakes=E.applyOutcome(mistakes,'sv-0001','right');
  assert.equal(mistakes['sv-0001'],undefined);
});
test('all 121 historical words are usable in at least one text/picture level',()=>{
  const ids=new Set();
  for(const level of ['easy','medium','hard','exam'])for(const w of E.getPool(bank,curation,level))ids.add(w.id);
  assert.equal(ids.size,121);
});
