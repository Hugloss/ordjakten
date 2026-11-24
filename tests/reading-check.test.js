'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const B=require('../public/js/reading-check');
const E=require('../public/js/engine');
const root=path.resolve(__dirname,'../public');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const surprises=require('../public/data/surprises.json');
const missionBank=require('../public/data/missions.json');
const browser={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/reading-check.js'),'utf8'),browser);
const words=new Map(bank.words.map(w=>[w.id,w]));
const run=q=>B.makeCheck(q,{bank,contexts,surprises,missions:missionBank,random:()=>.22});

test('reading checks exist for all 121 words, 25 expressions, and both shuffled positions',()=>{
  for(const w of bank.words){
    const q={...w,kind:'word',options:[],picture:false};
    const check=run(q);
    assert.ok(check,`No check for ${w.word}`);
    assert.equal(check.options.length,3);
    assert.equal(check.options.filter(o=>o.correct).length,1);
    assert.notEqual(check.options[0].label,check.options[1].label);
  }
  for(const expr of expressions.expressions){
    const q=E.makeExpressionQuestion(expr,'medium',()=>.66,'meaning',missionBank);
    const check=run(q);
    assert.equal(check.source,'expression');
    assert.equal(check.options.length,3);
    assert.equal(check.options.filter(o=>o.correct).length,1);
    const flipped=B.makeCheck(q,{bank,contexts,surprises,missions:missionBank,random:()=>.87});
    assert.notEqual(check.options.findIndex(o=>o.correct),flipped.options.findIndex(o=>o.correct));
  }
});
test('every authored word context tests a different story than the current one',()=>{
  for(const record of contexts.wordContexts){
    for(let i=0;i<3;i++){
      const q=E.makeContextQuestion(words.get(record.id),bank,contexts,()=>.31,i);
      const check=run(q);
      // Some curated records have no safe authored *wrong* scene. In that
      // case, do not invent one: fall back to the validated definition.
      const hasSafeOther=[...record.distractors,...(record.readingDistractors||[])].some(id=>contexts.wordContexts.some(c=>c.id===id));
      if(hasSafeOther){
        assert.equal(check.source,'context');
        assert.equal(check.options.length,3);
        assert.ok(!check.options.some(o=>o.label===q.stem),`Repeated story: ${q.word}`);
        assert.ok(record.scenes.some(s=>s.text===check.options.find(o=>o.correct).label));
      } else {
        assert.equal(check.source,'meaning');
        assert.equal(check.options.length,3);
      }
    }
  }
});
test('reading step is not an extra graded question and does not change the original question',()=>{
  const q=E.makeExpressionQuestion(expressions.expressions[0],'medium',()=>.27,'sentence',missionBank);
  const original=JSON.stringify(q);
  const check=run(q);
  assert.equal(B.isCorrect(check,check.options.findIndex(o=>o.correct)),true);
  assert.equal(B.isCorrect(check,check.options.findIndex(o=>!o.correct)),false);
  assert.equal(JSON.stringify(q),original);
});
test('reading helper handles invalid input without crashing',()=>{
  assert.equal(B.makeCheck(null,{bank,contexts,surprises}),null);
  assert.equal(B.isCorrect(null,0),false);
  assert.equal(B.isCorrect(run({...bank.words[0],kind:'word'}),111),false);
});

test('transfer questions are distinct from the original and offer three answers',()=>{
  for(const record of contexts.wordContexts){
    const word=words.get(record.id);
    for(let i=0;i<record.scenes.length;i++){
      const question=E.makeContextQuestion(word,bank,contexts,()=>.63,i);
      const check=B.makeCheck(question,{bank,contexts,surprises,missions:missionBank,random:()=>.81});
      assert.equal(check.options.length,3);
      assert.equal(new Set(check.options.map(x=>x.label)).size,3);
      assert.equal(check.options.filter(x=>x.correct).length,1);
      assert.ok(!check.options.some(x=>x.label===question.stem));
    }
  }
});
test('all expressions have three edited transfer choices',()=>{
  for(const expression of expressions.expressions){
    const question=E.makeExpressionQuestion(expression,'medium',()=>.64,'sentence',missionBank);
    const check=run(question);
    assert.equal(check.source,'expression');
    assert.equal(check.options.length,3);
    assert.notEqual(check.options.find(x=>x.correct).label,question.scene);
  }
});

test('after one incorrect Aha response the learner rereads; after two misses gets an example',()=>{
  assert.equal(B.nextStep(1,false),'reread');
  assert.equal(B.nextStep(2,false),'guided');
  assert.equal(B.nextStep(3,false),'guided');
  assert.equal(B.nextStep(1,true),'complete');
  assert.equal(B.nextStep(2,true),'complete');
});
