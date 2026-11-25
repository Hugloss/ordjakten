'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const B=require('../public/js/reading-check');
const D=require('../public/js/adaptive');
const E=require('../public/js/engine');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const surprises=require('../public/data/surprises.json');
const missions=require('../public/data/missions.json');
const DAY=86400000;
const NOW=1780000000000;
const check=(q,progress={},random=()=>.27)=>B.makeCheck(q,{bank,contexts,surprises,missions,readingProgress:progress,random});

test('every authored word context offers a novel Aha scene when another is available',()=>{
  for(const row of contexts.wordContexts){
    const word=bank.words.find(w=>w.id===row.id);
    const q=E.makeContextQuestion(word,bank,contexts,()=>.29,0);
    const first=check(q);
    // Seven curated words lack two safe, authored counterexamples. Keep the
    // validated meaning check rather than generating ambiguous distractors.
    const safe=contexts.wordContexts.some(other=>
      [...(row.distractors||[]),...(row.readingDistractors||[])].includes(other.id));
    if(!safe){
      assert.equal(first.source,'meaning',word.word);
      assert.equal(first.options.filter(o=>o.correct).length,1);
      continue;
    }
    assert.equal(first.source,'context',word.word);
    assert.match(first.evidence,/^context:[012]$/);
    assert.equal(first.options.length,3);
    const correct=first.options.find(o=>o.correct);
    assert.ok(row.scenes.some(s=>s.text===correct.label));
    const progress=B.recordProgress({},word.id,first.source,'guided',NOW,first.evidence);
    const second=check(q,progress);
    assert.notEqual(second.evidence,first.evidence,word.word);
    assert.notEqual(second.options.find(o=>o.correct).label,correct.label,word.word);
    assert.equal(second.options.filter(o=>o.correct).length,1);
  }
});
test('all expressions alternate between authored surprise and mission examples',()=>{
  for(const expr of expressions.expressions){
    const q=E.makeExpressionQuestion(expr,'medium',()=>.7,'meaning',missions);
    const first=check(q);
    assert.equal(first.source,'expression',expr.phrase);
    assert.equal(first.options.length,3,expr.phrase);
    const progress=B.recordProgress({},expr.id,'expression','retry',NOW,first.evidence);
    const second=check(q,progress);
    assert.ok(['expression:challenge','expression:mission'].includes(first.evidence));
    assert.ok(['expression:challenge','expression:mission'].includes(second.evidence));
    assert.notEqual(first.evidence,second.evidence,expr.phrase);
    assert.notEqual(first.options.find(o=>o.correct).label,second.options.find(o=>o.correct).label);
  }
});
test('repeating one Aha example twice on the same day cannot count as independent mastery',()=>{
  const id='sv-0001',firstKey='context:1',secondKey='context:2';
  let progress=B.recordProgress({},id,'context','guided',NOW,firstKey);
  assert.equal(B.needsReview(progress,id),true);
  progress=B.recordProgress(progress,id,'context','first',NOW+DAY/10,secondKey);
  progress=B.recordProgress(progress,id,'context','first',NOW+DAY/5,secondKey);
  assert.equal(progress[id].transfer.first,2);
  assert.equal(progress[id].transfer.quality,0);
  assert.equal(B.needsReview(progress,id),true);
  progress=B.recordProgress(progress,id,'context','first',NOW+2*DAY,firstKey);
  assert.equal(progress[id].transfer.quality,1);
  assert.equal(B.needsReview(progress,id),true);
  progress=B.recordProgress(progress,id,'context','first',NOW+3*DAY,secondKey);
  assert.equal(progress[id].transfer.quality,2);
  assert.equal(B.needsReview(progress,id),false);
  assert.equal(D.choiceType({kind:'word',entry:{id}},{
    difficulty:'medium',expressionTask:'mix'}, {}, ['meaning','reverse','context'],
    ()=>.2,progress),'meaning','Mastered evidence must no longer force context');
  assert.equal(E.score({[id]:'right'},1).right,1,'No extra graded question');
});
test('two independently correct DIFFERENT examples on different days graduate after help',()=>{
  const id='ut-0001';let p=B.recordProgress({},id,'expression','retry',NOW,'expression:challenge');
  p=B.recordProgress(p,id,'expression','first',NOW+DAY,'expression:mission');
  assert.equal(p[id].transfer.quality,1);
  p=B.recordProgress(p,id,'expression','first',NOW+2*DAY,'expression:challenge');
  assert.equal(p[id].transfer.quality,2);
  assert.equal(B.needsReview(p,id),false);
  p=B.recordProgress(p,id,'expression','guided',NOW+3*DAY,'expression:mission');
  assert.equal(p[id].transfer.quality,0);
  assert.equal(B.needsReview(p,id),true);
});
test('legacy progress, independent recognition and malicious IDs are handled safely',()=>{
  const id='sv-0001';
  let legacy=B.recordProgress({},id,'context','guided',NOW);
  legacy=B.recordProgress(legacy,id,'context','first',NOW+DAY);
  legacy=B.recordProgress(legacy,id,'context','first',NOW+2*DAY);
  assert.equal(B.needsReview(legacy,id),false,'Older progress does not get reset');
  const recognised=B.recordProgress({},id,'meaning','guided',NOW);
  assert.equal(B.needsReview(recognised,id,'recognition'),true);
  assert.equal(recognised[id].recognition.quality,undefined);
  const p=B.recordProgress({},id,'context','guided',NOW,'context:0');
  const poisoned={...p,[id]:{...p[id],transfer:{
    ...p[id].transfer,lastEvidence:'<script>alert(1)</script>',
    quality:999,proofs:['context:1','../../data','context:2','context:1'],
    lastQualifiedAt:Infinity
  }}};
  const safe=B.sanitizeProgress(poisoned);
  assert.equal(safe[id].transfer.lastEvidence,undefined);
  assert.equal(safe[id].transfer.quality,undefined);
  assert.equal(B.recordProgress(p,id,'meaning','first',NOW,'context:0')[id].recognition.quality,undefined);
});
