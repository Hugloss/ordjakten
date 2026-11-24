'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../public/js/engine');
const root=path.resolve(__dirname,'../public');
const bank=JSON.parse(fs.readFileSync(path.join(root,'data/ordbank.json'),'utf8'));
const expressions=JSON.parse(fs.readFileSync(path.join(root,'data/expressions.json'),'utf8'));
const ctx={window:{}};
for(const source of ['data/curation.js','data/expressions.js'])
  vm.runInNewContext(fs.readFileSync(path.join(root,source),'utf8'),ctx);
const curation=ctx.window.ORDJAKTEN_CURATION;
const encoded=JSON.parse(JSON.stringify(ctx.window.ORDJAKTEN_EXPRESSIONS));

test('25 separate expressions, canonical JSON and browser data are identical',()=>{
  assert.equal(expressions.expressions.length,25);
  assert.deepEqual(E.validateExpressions(expressions),[]);
  assert.deepEqual(encoded,expressions);
  assert.equal(bank.words.length,121);
  assert.ok(!bank.words.some(word=>word.word==='För en gångs skull'));
});
test('the hockey example explains an exception, not one literal occurrence',()=>{
  const entry=expressions.expressions.find(x=>x.phrase==='För en gångs skull');
  assert.ok(entry.scene.includes('skjutsa barnen till hockeyn'));
  assert.match(entry.definition,/inte brukar/);
  assert.match(entry.reveal[0].text,/oftast/);
  assert.match(entry.reveal[1].text,/den här gången|Nu kunde/);
  const question=E.makeExpressionQuestion(entry,'easy',()=>.82);
  assert.equal(question.kind,'expression');
  assert.equal(question.picture,false);
  assert.equal(question.options.length,4);
  assert.deepEqual(question.options.filter(o=>o.correct).map(o=>o.label),[entry.definition]);
});
test('expression data validation catches missing cues, duplicate options and keys',()=>{
  const data=JSON.parse(JSON.stringify(expressions));
  data.expressions[0].options[0].correct=false;
  assert.ok(E.validateExpressions(data).some(x=>x.includes('fem unika svar')));
  data.expressions[0].options[0].correct=true;
  data.expressions[0].options[1].label=data.expressions[0].options[0].label;
  assert.ok(E.validateExpressions(data).length>0);
  data.expressions[0].options[1].label='Separat svar';
  data.expressions[0].reveal.pop();
  assert.ok(E.validateExpressions(data).some(x=>x.includes('förklaringsrutor')));
});
test('all 25 expressions support 5–25 questions, including exam with 5 choices',()=>{
  for(const level of ['easy','medium','hard','exam']){
    for(const count of [5,10,15,20,25]){
      const settings={topic:'expressions',difficulty:level,count};
      const round=E.generateRound(bank,curation,settings,{},Math.random,expressions);
      assert.equal(round.length,count);
      assert.equal(new Set(round.map(q=>q.id)).size,count);
      assert.ok(round.every(q=>q.options.length===(level==='exam'?5:4)));
      assert.ok(round.every(q=>q.options.filter(o=>o.correct).length===1));
      assert.ok(round.every(q=>q.kind==='expression'&&q.scene&&!q.picture&&q.reveal.length===2));
    }
  }
});
test('mixed rounds keep both kinds and do not repeat or corrupt choices',()=>{
  for(const difficulty of ['easy','medium','hard','exam'])for(const count of [5,10,15,20,25]){
    const round=E.generateRound(bank,curation,{topic:'mixed',difficulty,count},{},Math.random,expressions);
    assert.equal(round.length,count);
    assert.equal(new Set(round.map(q=>q.id)).size,count);
    assert.equal(round.filter(q=>q.kind==='expression').length,Math.ceil(count/2));
    assert.equal(round.filter(q=>q.kind!=='expression').length,Math.floor(count/2));
    assert.ok(round.every(q=>q.options.filter(o=>o.correct).length===1));
  }
});
test('mistakes in phrases persist and can be selected for later review',()=>{
  const id='ut-0001';
  const mistakes=E.applyOutcome({},id,'wrong');
  const history=E.sanitizeHistory({settings:{topic:'expressions'},mistakes});
  assert.equal(history.mistakes[id],1);
  assert.equal(history.settings.topic,'expressions');
  const round=E.generateRound(bank,curation,{topic:'expressions',difficulty:'easy',count:25,reviewOnly:true},
    history.mistakes,Math.random,expressions);
  assert.equal(round.length,1);
  assert.equal(round[0].id,id);
  assert.equal(E.applyOutcome(mistakes,id,'right')[id],undefined);
});
test('older local settings without a topic still select ordinary words',()=>{
  const old=E.sanitizeHistory({settings:{difficulty:'medium',count:10},results:[
    {finishedAt:123456789,mode:'test',level:'medium',right:2,wrong:3,total:5}
  ]});
  assert.equal(old.settings.topic,'words');
  assert.equal(old.results[0].topic,'words');
  assert.equal(E.sanitizeSettings({topic:'untrusted'}).topic,'words');
});
