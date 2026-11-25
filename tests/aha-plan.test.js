'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const B=require('../public/js/reading-check');
const V=require('../public/js/aha-plan');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const contexts=require('../public/data/word-contexts.json');
const surprises=require('../public/data/surprises.json');
const missions=require('../public/data/missions.json');
const NOW=1780000000000,DAY=V.DAY;
const deps={bank,expressions,contexts,surprises,missions,reading:B,random:()=>.37};
const plan=(p,now=NOW+DAY)=>V.plan(p,{...deps,now});
const phrase=expressions.expressions[0].id;
const help=(p,id,at=NOW)=>B.recordProgress(p,id,id.startsWith('ut-')?'expression':'context','guided',at,
  id.startsWith('ut-')?'expression:challenge':'context:0');
test('Aha round is optional, bounded, and never pads with new or recognition-only words',()=>{
  assert.equal(plan({}).round.length,0);
  let p=B.recordProgress({},phrase,'meaning','guided',NOW);
  assert.equal(plan(p).ready.length,0);
  for(const item of expressions.expressions.slice(0,8))p=help(p,item.id);
  const queue=plan(p);
  assert.equal(queue.ready.length,8);
  assert.equal(queue.round.length,5);
  assert.equal(new Set(queue.round.map(x=>x.id)).size,5);
  assert.ok(queue.round.every(x=>x.check.source==='expression'));
  assert.equal(plan(help({},phrase)).round.length,1);
});
test('waiting intervals, boundary, and legacy cards',()=>{
  const p=help({},phrase);
  assert.equal(plan(p,NOW+DAY-1).round.length,0);
  assert.equal(plan(p,NOW+DAY-1).waiting.length,1);
  assert.equal(plan(p,NOW+DAY).round.length,1);
  assert.equal(plan(B.recordProgress({},phrase,'expression','guided',NOW)).round.length,1);
  let later=B.recordProgress(p,phrase,'expression','first',NOW+DAY,'expression:mission');
  later=B.recordProgress(later,phrase,'expression','first',NOW+DAY+1,'expression:challenge');
  assert.equal(plan(later,NOW+2*DAY).waiting.length,1);
});
test('authored situations rotate evidence; unavailable and stale content is excluded',()=>{
  let p={};
  for(const row of contexts.wordContexts)p=help(p,row.id);
  for(const row of expressions.expressions)p=help(p,row.id);
  p=help(p,'sv-9999');
  const queue=plan(p);
  const safe=contexts.wordContexts.filter(row=>contexts.wordContexts.some(other=>
    [...(row.distractors||[]),...(row.readingDistractors||[])].includes(other.id)));
  assert.equal(queue.ready.length,safe.length+expressions.expressions.length);
  assert.ok(queue.ready.every(x=>x.check.options.filter(o=>o.correct).length===1));
  assert.ok(queue.ready.every(x=>x.check.evidence!==p[x.id].transfer.lastEvidence));
  assert.ok(!queue.ready.some(x=>x.id==='sv-9999'));
  const stale=help({},safe[0].id);
  assert.equal(V.plan(stale,{...deps,contexts:{wordContexts:[]},now:NOW+DAY}).ready.length,0);
});
test('oldest first; demonstrated understanding removes the word, new help reopens it',()=>{
  const second=expressions.expressions[1].id;
  let p=help(help({},phrase,NOW),second,NOW-1000);
  assert.equal(plan(p).round[0].id,second);
  let item=plan(p).ready.find(x=>x.id===phrase);
  p=B.recordProgress(p,phrase,item.check.source,'first',NOW+DAY,item.check.evidence);
  assert.equal(plan(p,NOW+DAY).waiting.length,1);
  item=plan(p,NOW+2*DAY).ready.find(x=>x.id===phrase);
  p=B.recordProgress(p,phrase,item.check.source,'first',NOW+2*DAY,item.check.evidence);
  assert.equal(B.needsReview(p,phrase),false);
  assert.ok(!plan(p,NOW+3*DAY).ready.some(x=>x.id===phrase));
  p=help(p,phrase,NOW+3*DAY);
  assert.ok(plan(p,NOW+4*DAY).ready.some(x=>x.id===phrase));
});
test('retry and worked-example outcomes never count as independent first answers',()=>{
  const {check}=plan(help({},phrase)).round[0];
  const wrong=check.options.findIndex(x=>!x.correct),right=check.options.findIndex(x=>x.correct);
  assert.equal(V.answer(check,wrong,0,B).step,'reread');
  assert.equal(V.answer(check,wrong,0,B).outcome,null);
  assert.equal(V.answer(check,right,0,B).outcome,'first');
  assert.equal(V.answer(check,right,1,B).outcome,'retry');
  assert.equal(V.answer(check,wrong,1,B).outcome,'guided');
  assert.equal(V.answer(check,99,0,B),null);
  assert.equal(V.answer(check,right,2,B),null);
});
