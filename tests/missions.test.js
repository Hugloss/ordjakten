'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const Q=require('../public/js/missions.js');
const E=require('../public/js/engine.js');
const base=path.resolve(__dirname,'../public');
const missions=JSON.parse(fs.readFileSync(path.join(base,'data/missions.json'),'utf8'));
const expressions=JSON.parse(fs.readFileSync(path.join(base,'data/expressions.json'),'utf8'));
const bank=JSON.parse(fs.readFileSync(path.join(base,'data/ordbank.json'),'utf8'));
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(base,'data/curation.js'),'utf8'),sandbox);
const curation=sandbox.window.ORDJAKTEN_CURATION;
test('31 hand-authored missions with three unique sentences and three orderable events',()=>{
  assert.deepEqual(Q.validate(missions,expressions),[]);
  assert.equal(missions.missions.length,31);
  assert.equal(Q.TYPES.length,3);
  const target=Q.get(missions,'ut-0001');
  assert.match(target.sentences[0].label,/för en gångs skull/i);
  assert.match(target.order[0],/träningen/i);
  assert.equal(Q.get(missions,'ut-9999'),null);
});
test('browser mission data stays identical to canonical JSON',()=>{
  const sandbox={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(base,'data/missions.js'),'utf8'),sandbox);
  assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.ORDJAKTEN_MISSIONS)),missions);
});
test('all 31 expressions can be asked in all three modes with valid keys',()=>{
  for(const e of expressions.expressions){
    const questionMeaning=E.makeExpressionQuestion(e,'medium',()=>.42,'meaning',missions);
    assert.equal(questionMeaning.options.length,4);
    assert.equal(questionMeaning.options.filter(o=>o.correct).length,1);
    const sentence=E.makeExpressionQuestion(e,'medium',()=>.42,'sentence',missions);
    assert.equal(sentence.options.length,3);
    assert.equal(sentence.options.filter(o=>o.correct).length,1);
    assert.ok(sentence.options.every(o=>o.label.length>20));
    const order=E.makeExpressionQuestion(e,'medium',()=>.42,'order',missions);
    assert.equal(order.options.length,0);
    assert.equal(order.steps.length,3);
    assert.deepEqual(order.steps.map(x=>x.key).sort(),[0,1,2]);
    assert.deepEqual(order.correctOrder,Q.get(missions,e.id).order);
    const exam=E.makeExpressionQuestion(e,'exam',()=>.42,'order',missions);
    assert.equal(exam.taskType,'meaning','exam never shows an order task');
    assert.equal(exam.options.length,5,'exam preserves 5 answer choices');
  }
});
test('mixed expression rounds are balanced and do not duplicate expressions',()=>{
  const settings=E.sanitizeSettings({topic:'expressions',difficulty:'medium',count:25,expressionTask:'mix'});
  const round=E.generateRound(bank,curation,settings,{},Math.random,expressions,missions);
  assert.equal(round.length,25);
  assert.equal(new Set(round.map(x=>x.id)).size,25);
  assert.equal(round.filter(x=>x.taskType==='meaning').length>=8,true);
  assert.equal(round.filter(x=>x.taskType==='sentence').length>=8,true);
  assert.equal(round.filter(x=>x.taskType==='order').length>=8,true);
  assert.equal(round.slice(0,3).every((q,i,a)=>i===0||q.taskType!==a[i-1].taskType),true);
});
test('explicit task types work with five, ten and twenty-five questions',()=>{
  for(const type of Q.TYPES){
    for(const count of [5,10,25]){
      const settings=E.sanitizeSettings({topic:'expressions',difficulty:'easy',count,expressionTask:type});
      const round=E.generateRound(bank,curation,settings,{},()=>.61,expressions,missions);
      assert.equal(round.length,count);
      assert.ok(round.every(q=>q.taskType===type));
    }
  }
});
test('answering an order task requires all three unique steps in correct order',()=>{
  assert.equal(Q.checkOrder([0,1,2]),true);
  for(const other of [[2,0,1],[0,2,1],[0,1],[0,1,1],[-1,1,2],['0',1,2],[],null])
    assert.equal(Q.checkOrder(other),false);
  assert.deepEqual(E.score({'ut-0001':'right','ut-0002':'wrong'},5),{right:1,wrong:1,unanswered:3,percent:20});
});
test('per-expression mode completion is idempotent, preserves historic meaning progress and does not affect game scores',()=>{
  const old=E.sanitizeHistory({results:[{finishedAt:1000,right:2,wrong:1,total:5}],surprises:{unlocked:['ut-0001'],opened:['ut-0001'],mastered:['ut-0001']}});
  let progress=Q.sanitizeProgress(old.missionProgress,expressions,old.surprises.mastered);
  assert.deepEqual(progress['ut-0001'],['meaning']);
  assert.equal(Q.nextType(progress,'ut-0001','meaning'),'meaning');
  assert.notEqual(Q.nextType(progress,'ut-0001','mix'),'meaning');
  progress=Q.complete(progress,'ut-0001','sentence',expressions);
  progress=Q.complete(progress,'ut-0001','order',expressions);
  progress=Q.complete(progress,'ut-0001','order',expressions);
  assert.deepEqual(progress['ut-0001'],['meaning','sentence','order']);
  assert.equal(Q.nextType(progress,'ut-0001','mix')!==null,true);
  const roundTrip=E.sanitizeHistory({...old,missionProgress:progress});
  assert.deepEqual(roundTrip.missionProgress['ut-0001'],progress['ut-0001']);
  assert.equal(roundTrip.results[0].right,2);
  assert.equal(roundTrip.results[0].wrong,1);
  assert.deepEqual(Q.complete(progress,'ut-9999','sentence',expressions),progress);
});
test('malformed mission content and persisted progress are sanitized',()=>{
  const bad=JSON.parse(JSON.stringify(missions));bad.missions[0].sentences[1].correct=true;
  assert.ok(Q.validate(bad,expressions).length>0);
  const missing=JSON.parse(JSON.stringify(missions));missing.missions.pop();
  assert.ok(Q.validate(missing,expressions).some(x=>x.includes('saknas')));
  const history=E.sanitizeHistory({missionProgress:{'ut-0001':['meaning','evil','sentence','meaning'],'ut-9999':['order'],'__proto__':['meaning']},settings:{expressionTask:'banana',missionHints:false}});
  assert.deepEqual(history.missionProgress['ut-0001'],['meaning','sentence']);
  assert.equal(history.settings.expressionTask,'mix');
  assert.equal(history.settings.missionHints,false);
  assert.deepEqual(Q.sanitizeProgress(history.missionProgress,expressions)['ut-0001'],['meaning','sentence']);
});
