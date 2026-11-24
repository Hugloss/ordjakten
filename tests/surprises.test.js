'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const S=require('../public/js/surprises.js');
const E=require('../public/js/engine.js');
const base=path.resolve(__dirname,'../public');
const data=JSON.parse(fs.readFileSync(path.join(base,'data/surprises.json'),'utf8'));
const expressions=JSON.parse(fs.readFileSync(path.join(base,'data/expressions.json'),'utf8'));

test('all 25 expression doors contain an authored two-choice transfer task',()=>{
  assert.equal(data.challenges.length,25);
  assert.deepEqual(S.validate(data,expressions),[]);
  for(const challenge of data.challenges){
    const expr=expressions.expressions.find(x=>x.id===challenge.id);
    assert.ok(expr,challenge.id);
    assert.ok(challenge.prompt.toLowerCase().includes(expr.phrase.toLowerCase()));
    const index=challenge.options.findIndex(x=>x.correct);
    assert.equal(S.checkAnswer(data,challenge.id,index),true);
    assert.equal(S.checkAnswer(data,challenge.id,1-index),false);
    assert.equal(S.checkAnswer(data,challenge.id,7),null);
    // Bonus is a new setting, not just the original answer or original scene.
    assert.notEqual(challenge.options[index].label,expr.scene);
    assert.notEqual(challenge.options[index].label,expr.example);
    assert.notEqual(challenge.options[index].label,expr.definition);
  }
});
test('a broken or duplicated door is rejected before the UI can open it',()=>{
  const missing=JSON.parse(JSON.stringify(data));missing.challenges.pop();
  assert.ok(S.validate(missing,expressions).some(x=>x.includes('saknas')));
  const invalid=JSON.parse(JSON.stringify(data));invalid.challenges[0].options[1].correct=true;
  assert.ok(S.validate(invalid,expressions).some(x=>x.includes('två olika val')));
  const duplicate=JSON.parse(JSON.stringify(data));duplicate.challenges[1].id=duplicate.challenges[0].id;
  assert.ok(S.validate(duplicate,expressions).some(x=>x.includes('upprepat')));
});
test('browser data and canonical JSON are identical',()=>{
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(base,'data/surprises.js'),'utf8'),context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.ORDJAKTEN_SURPRISES)),data);
});
test('doors must be discovered, then opened, then understood (without changing quiz scores)',()=>{
  let c=S.sanitizeCollection(null,expressions);
  assert.deepEqual(c,{unlocked:[],opened:[],mastered:[]});
  assert.deepEqual(S.updateCollection(c,'opened','ut-0001',expressions),c);
  assert.deepEqual(S.updateCollection(c,'mastered','ut-0001',expressions),c);
  c=S.updateCollection(c,'unlocked','ut-0001',expressions);
  c=S.updateCollection(c,'opened','ut-0001',expressions);
  c=S.updateCollection(c,'mastered','ut-0001',expressions);
  assert.deepEqual(c,{unlocked:['ut-0001'],opened:['ut-0001'],mastered:['ut-0001']});
  assert.deepEqual(S.updateCollection(c,'mastered','ut-0001',expressions),c,'no duplicated progress');
  const h=E.sanitizeHistory({settings:{mode:'test'},surprises:c,results:[{finishedAt:1000,right:2,wrong:1,total:5}]});
  assert.deepEqual(S.sanitizeCollection(h.surprises,expressions),c);
  assert.equal(h.results[0].right,2);
  assert.equal(h.results[0].wrong,1);
});
test('invalid and unknown IDs are discarded; old histories start empty',()=>{
  const old=E.sanitizeHistory({mistakes:{'sv-0001':1}});
  assert.deepEqual(S.sanitizeCollection(old.surprises,expressions),{unlocked:[],opened:[],mastered:[]});
  const cleaned=S.sanitizeCollection({unlocked:['ut-0002','ut-9999','ut-0002','evil'],opened:['ut-0002','ut-0003'],mastered:['ut-0003']},expressions);
  assert.deepEqual(cleaned,{unlocked:['ut-0002'],opened:['ut-0002'],mastered:[]});
  assert.deepEqual(S.updateCollection(cleaned,'unlocked','ut-9999',expressions),cleaned);
});
