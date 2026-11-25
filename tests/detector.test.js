'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const D=require('../public/js/detector');
const L=require('../public/js/learning-map');
const E=require('../public/js/engine');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const contrasts=require('../public/data/contrasts.json');
const words=L.catalog(bank,expressions,{});
const tasks=D.catalog(words,contrasts);
const NOW=1780000000000,DAY=D.DAY,random=()=>.37;
const first=tasks.find(task=>task.id==='js-01-01');
const done={word:'right',clue:'right'};
test('48 annotated scenes cover 24 words in 12 pairs, two per word; every excerpt is literal and unique',()=>{
  assert.equal(tasks.length,48);
  assert.equal(tasks.length,Object.keys(D.ANNOTATIONS).length);
  assert.equal(new Set(tasks.map(task=>task.target)).size,24);
  assert.equal(new Set(tasks.map(task=>task.pairId)).size,12);
  for(const task of tasks){
    const pair=contrasts.pairs.find(pair=>pair.id===task.pairId);
    const scene=pair.scenes.find(scene=>scene.id===task.id);
    assert.equal(task.target,scene.target);
    assert.equal(task.text,scene.text);
    assert.equal(task.why,scene.why);
    assert.equal(tasks.filter(row=>row.target===task.target).length,2);
    assert.equal(task.words.length,2);
    assert.equal(task.quotes.length,2);
    assert.equal(task.quotes.filter(quote=>quote.correct).length,1);
    for(const quote of task.quotes){
      assert.ok(task.text.includes(quote.label));
      assert.equal(task.text.split(quote.label).length,2);
    }
    assert.ok(!task.quotes[0].label.includes(task.quotes[1].label));
    assert.ok(!task.quotes[1].label.includes(task.quotes[0].label));
  }
});
test('missing, overlapping and duplicate excerpts are excluded rather than guessed',()=>{
  assert.equal(D.catalog(words,contrasts,{'js-01-01':['never exists','i sjön']}).length,0);
  assert.equal(D.catalog(words,contrasts,{'js-01-01':['Det gick knappt','gick knappt']}).length,0);
  const changed=JSON.parse(JSON.stringify(contrasts));
  changed.pairs[0].scenes[0].text+=' '+D.ANNOTATIONS['js-01-01'][1];
  assert.equal(D.catalog(words,changed,{'js-01-01':D.ANNOTATIONS['js-01-01']}).length,0);
});
test('quick round is short and avoids priming the other word of the same pair',()=>{
  const plan=D.plan(tasks,{},new Set(),NOW,random);
  assert.equal(plan.round.length,3);
  assert.equal(new Set(plan.round.map(task=>task.pairId)).size,3);
  assert.ok(plan.round.every(task=>task.starter));
  const expert=tasks.find(task=>!task.starter);
  assert.equal(D.plan(tasks,{},new Set(),NOW,random,expert.target).round[0].target,expert.target);
  assert.ok(D.plan(tasks,{},new Set([expert.target]),NOW,random).round.some(task=>task.pairId===expert.pairId));
  assert.equal(D.plan(tasks,{},new Set(),NOW,random,'ut-0001').round.length,0);
});
test('separate word and evidence observations distinguish preview, support and direct answers',()=>{
  let p=D.record({},tasks,first.id,{word:'helped',clue:'right'},NOW);
  assert.equal(p[first.id].wordRight,0);
  assert.equal(p[first.id].clueRight,1);
  assert.equal(D.summary(tasks,p,first.target,NOW).needsPractice,false);
  assert.equal(D.summary(tasks,p,first.target,NOW+DAY).needsPractice,true);
  p=D.record(p,tasks,first.id,{word:'previewed',clue:'supported'},NOW+DAY);
  assert.equal(p[first.id].wordRight,0);
  assert.equal(p[first.id].clueRight,1);
  p=D.record(p,tasks,first.id,done,NOW+2*DAY);
  assert.equal(p[first.id].attempts,3);
  assert.equal(p[first.id].wordRight,1);
  assert.equal(p[first.id].clueRight,2);
  const summary=D.summary(tasks,p,first.target,NOW+3*DAY);
  assert.equal(summary.seen,1,'Same scene repeatedly answered is one discovery');
  assert.equal(summary.clueRight,1);
  assert.equal(summary.needsPractice,false);
});
test('return intervals apply per authored scene and supported scenes receive priority',()=>{
  const p=D.record({},tasks,first.id,{word:'right',clue:'supported'},NOW);
  assert.equal(D.record(p,tasks,first.id,done,NOW+DAY-1),p);
  const waiting=D.plan(tasks,p,new Set(),NOW+DAY-1,random,first.target);
  assert.equal(waiting.waiting,1);
  assert.notEqual(waiting.round[0].id,first.id);
  const due=D.plan(tasks,p,new Set(),NOW+DAY,random,first.target);
  assert.equal(due.round[0].id,first.id);
  const other=tasks.find(task=>task.target===first.target&&task.id!==first.id);
  const both=D.record(p,tasks,other.id,done,NOW);
  assert.equal(D.plan(tasks,both,new Set(),NOW,random,first.target).round.length,0);
  assert.equal(D.summary(tasks,both,first.target,NOW).ready,false);
});
test('first miss allows rereading, second miss is guided, and invalid choices never count',()=>{
  const right=first.quotes.find(quote=>quote.correct).label;
  const wrong=first.quotes.find(quote=>!quote.correct).label;
  assert.equal(D.clueStep(first,right,0),'complete');
  assert.equal(D.clueStep(first,wrong,0),'reread');
  assert.equal(D.clueStep(first,wrong,1),'guided');
  assert.equal(D.clueStep(first,right,1),'complete');
  assert.equal(D.clueStep(first,'invalid',0),null);
  assert.equal(D.clueStep(first,right,2),null);
});
test('local history bounds counts, rejects unknown IDs and removes stale content and extra text',()=>{
  const raw=D.record({},tasks,first.id,done,NOW);
  const poison={[first.id]:{...raw[first.id],attempts:100000,wordRight:100000,childText:'not saved'},
    'unknown':{...raw[first.id]}};
  const safe=D.sanitize(poison,tasks);
  assert.deepEqual(Object.keys(safe),[first.id]);
  assert.equal(safe[first.id].attempts,9999);
  assert.equal(safe[first.id].wordRight,9999);
  assert.equal(Object.hasOwn(safe[first.id],'childText'),false);
  assert.deepEqual(D.sanitize(E.sanitizeHistory({detectorProgress:safe}).detectorProgress,tasks),safe);
  assert.deepEqual(Object.keys(D.sanitize(E.sanitizeHistory(null).detectorProgress,tasks)),[]);
  const changed=JSON.parse(JSON.stringify(contrasts));
  changed.pairs[0].scenes[0].text='En dag. '+changed.pairs[0].scenes[0].text;
  const next=D.catalog(words,changed);
  assert.notEqual(next.find(task=>task.id===first.id).stamp,first.stamp);
  assert.equal(D.sanitize(raw,next)[first.id],undefined);
  assert.equal(D.summary(next,raw,first.target,NOW).seen,0);
});
test('detector changes only its own observations, not scores, normal skills or Aha evidence',()=>{
  const history=E.sanitizeHistory({results:[{finishedAt:NOW,right:5,total:5}]});
  const before=JSON.stringify(history);
  const p=D.record(history.detectorProgress,tasks,first.id,done,NOW);
  assert.equal(JSON.stringify(history),before);
  assert.equal(p[first.id].clueRight,1);
  assert.equal(E.score({[first.target]:'right'},1).right,1);
  const profile=L.profile(words.find(word=>word.id===first.target),{types:['context','contrast','meaning']});
  assert.equal(profile.facets.find(row=>row.id==='contrast').state,'new');
});

test('quote length is not a reliable shortcut to the intended answer',()=>{
  let longer=0,shorter=0;
  for(const task of tasks){
    const [right,other]=task.quotes.map(quote=>quote.label.length);
    assert.ok(Math.max(right,other)/Math.min(right,other)<=1.8,task.id);
    if(right>other)longer++;
    if(right<other)shorter++;
  }
  assert.ok(longer>=tasks.length*.3);
  assert.ok(shorter>=tasks.length*.3);
});
