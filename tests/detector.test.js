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

// The introductory catalogue and its storage remain backward compatible.
const ladder=require('../public/data/clue-ladder.json');
const extended=tasks.concat(D.advancedCatalog(words,contrasts,ladder));
const advanced=extended.filter(t=>t.level>1);
const pair='js-01';
const firstA=extended.find(t=>t.id==='js-01-01');
const otherA=extended.find(t=>t.id==='js-01-03');
const opposite=extended.find(t=>t.pairId===pair&&t.level===1&&t.target!==firstA.target&&t.context!==firstA.context);
const sameContext=extended.find(t=>t.pairId===pair&&t.level===1&&t.target!==firstA.target&&t.context===firstA.context);
function observation(state,task,answer,at){
  const p=D.record(state.progress,extended,task.id,answer,at);
  return {progress:p,levels:p===state.progress?state.levels:D.recordLevel(state.levels,extended,p,task.id,at)};
}
const empty=()=>({progress:{},levels:{}});
test('32 new source-backed scenes extend four pairs with two choices of scene per word per tier',()=>{
  assert.equal(extended.length,80);
  assert.equal(advanced.filter(t=>t.level===2).length,16);
  assert.equal(advanced.filter(t=>t.level===3).length,16);
  assert.equal(new Set(extended.map(t=>t.id)).size,80);
  for(const task of advanced){
    const source=ladder.pairs.find(p=>p.id===task.pairId).levels.find(l=>l.level===task.level).scenes.find(s=>s.id===task.id);
    assert.equal(task.text,source.text);
    assert.equal(task.target,source.target);
    assert.equal(task.why,source.why);
    assert.equal(task.context,source.context);
    assert.equal(task.quotes.length,3);
    assert.equal(task.quotes.filter(q=>q.correct).length,task.level===3?2:1);
    assert.ok(task.question);
    const spans=task.quotes.map(q=>{
      assert.equal(task.text.split(q.label).length,2);
      return [task.text.indexOf(q.label),task.text.indexOf(q.label)+q.label.length];
    });
    for(let i=0;i<spans.length;i++)for(let j=i+1;j<spans.length;j++)
      assert.ok(spans[i][1]<=spans[j][0]||spans[j][1]<=spans[i][0]);
  }
  for(const p of ladder.pairs){
    assert.equal(D.maxLevel(extended,p.id),3);
    for(const tier of [2,3]){
      const rows=advanced.filter(t=>t.pairId===p.id&&t.level===tier);
      assert.equal(rows.length,4);
      assert.equal(new Set(rows.map(t=>t.target)).size,2);
      for(const id of new Set(rows.map(t=>t.target)))assert.equal(rows.filter(t=>t.target===id).length,2);
    }
  }
  for(const p of contrasts.pairs.filter(p=>!ladder.pairs.some(l=>l.id===p.id)))assert.equal(D.maxLevel(extended,p.id),1);
});
test('advanced quotes do not systematically reward choosing the longest excerpts',()=>{
  const mid=advanced.filter(t=>t.level===2);
  const difficult=advanced.filter(t=>t.level===3);
  assert.ok(mid.filter(t=>t.quotes[0].label.length>Math.max(...t.quotes.slice(1).map(q=>q.label.length))).length<=mid.length*.65);
  assert.ok(difficult.filter(t=>t.quotes[2].label.length>=Math.min(...t.quotes.slice(0,2).map(q=>q.label.length))).length>=difficult.length*.5);
});
test('advanced tasks are locked until spaced independent answers in both words and contexts',()=>{
  assert.ok(opposite&&sameContext&&otherA);
  let s=observation(empty(),firstA,done,NOW);
  assert.equal(s.levels[pair].level,1);
  assert.equal(s.levels[pair].proof.id,firstA.id);
  s=observation(s,opposite,done,NOW+DAY-1);
  assert.equal(s.levels[pair].level,1);
  assert.equal(s.levels[pair].proof.id,firstA.id);
  s=observation(s,otherA,done,NOW+DAY);
  assert.equal(s.levels[pair].level,1,'same word is not enough');
  s=observation(s,sameContext,done,NOW+DAY+1);
  assert.equal(s.levels[pair].level,1,'same environment is not enough');
  s=observation(s,opposite,done,NOW+2*DAY);
  assert.equal(s.levels[pair].level,2);
  assert.equal(s.levels[pair].proof,null);
  assert.equal(D.levelFor(extended,s.levels,pair),2);
});
test('preview, repeated scene, unsupported pair and stale event cannot advance a tier',()=>{
  let s=observation(empty(),firstA,done,NOW);
  s=observation(s,firstA,done,NOW+DAY);
  assert.equal(s.levels[pair].level,1);
  s=observation(s,opposite,{word:'previewed',clue:'right'},NOW+DAY+1);
  assert.equal(s.levels[pair].level,1);
  const non=extended.find(t=>D.maxLevel(extended,t.pairId)===1);
  s=observation(s,non,done,NOW+2*DAY);
  assert.equal(s.levels[non.pairId],undefined);
  const old=s.levels;
  assert.equal(D.recordLevel(old,extended,s.progress,firstA.id,NOW+DAY),old);
});
test('level two advances only with current-level evidence; harder mistakes restore support',()=>{
  let s=observation(empty(),firstA,done,NOW);
  s=observation(s,opposite,done,NOW+DAY);
  const m=advanced.find(t=>t.level===2&&t.pairId===pair);
  const n=advanced.find(t=>t.level===2&&t.pairId===pair&&t.target!==m.target&&t.context!==m.context);
  s=observation(s,m,done,NOW+2*DAY);
  s=observation(s,firstA,done,NOW+3*DAY);
  assert.equal(s.levels[pair].proof.id,m.id,'outdated tier does not replace proof');
  s=observation(s,n,done,NOW+3*DAY+1);
  assert.equal(s.levels[pair].level,3);
  const h=advanced.find(t=>t.level===3&&t.pairId===pair);
  const k=advanced.find(t=>t.level===3&&t.pairId===pair&&t.id!==h.id);
  s=observation(s,h,{word:'previewed',clue:'supported'},NOW+4*DAY);
  assert.equal(s.levels[pair].level,3);
  s=observation(s,k,{word:'right',clue:'supported'},NOW+4*DAY+1);
  assert.equal(s.levels[pair].level,2);
  assert.equal(s.levels[pair].proof,null);
  const p=observation(s,m,{word:'helped',clue:'right'},NOW+5*DAY);
  assert.equal(p.levels[pair].level,1);
});
test('planner chooses a different word and environment for pending evidence and respects locked levels',()=>{
  assert.ok(D.plan(extended,{},new Set(),NOW,random).round.every(t=>t.level===1));
  let s=observation(empty(),firstA,done,NOW);
  const next=D.plan(extended,s.progress,new Set(),NOW+DAY,random,null,s.levels).round[0];
  assert.equal(next.pairId,pair);
  assert.notEqual(next.target,firstA.target);
  assert.notEqual(next.context,firstA.context);
  s=observation(s,opposite,done,NOW+DAY);
  const m=D.plan(extended,s.progress,new Set(),NOW+DAY,random,firstA.target,s.levels);
  assert.equal(m.round[0].level,2);
  assert.equal(D.summary(extended,s.progress,firstA.target,NOW+DAY,s.levels).level,2);
  const rows=advanced.filter(t=>t.level===2&&t.target===firstA.target);
  let p=s.progress;
  for(const task of rows)p=D.record(p,extended,task.id,done,NOW+DAY);
  assert.equal(D.plan(extended,p,new Set(),NOW+DAY,random,firstA.target,s.levels).round.length,0,'do not fall back to easier waiting content');
  assert.equal(D.summary(extended,p,firstA.target,NOW+DAY,s.levels).ready,false);
});
test('hard tasks require exactly both distinct evidence fragments, not a single lucky click',()=>{
  const h=advanced.find(t=>t.level===3);
  const m=advanced.find(t=>t.level===2);
  assert.equal(D.evaluateQuotes(h,[0],0),null);
  assert.equal(D.evaluateQuotes(h,[0,0],0),null);
  assert.equal(D.evaluateQuotes(h,[0,3],0),null);
  assert.equal(D.evaluateQuotes(h,[0,1,2],0),null);
  assert.equal(D.evaluateQuotes(h,[0,2],0),'reread');
  assert.equal(D.evaluateQuotes(h,[1,2],1),'guided');
  assert.equal(D.evaluateQuotes(h,[1,0],0),'complete');
  assert.equal(D.evaluateQuotes(h,[0,1],2),null);
  assert.equal(D.clueStep(h,h.quotes[0].label,0),null);
  assert.equal(D.evaluateQuotes(m,[0],0),'complete');
  assert.equal(D.evaluateQuotes(m,[2],0),'reread');
});
test('level state roundtrips locally, rejects foreign proofs, and cannot invent missing tiers',()=>{
  let s=observation(empty(),firstA,done,NOW);
  const clean=D.sanitizeLevels({...s.levels,unknown:{level:3,lastAt:NOW}},extended);
  assert.deepEqual(Object.keys(clean),[pair]);
  assert.deepEqual(D.sanitizeLevels(E.sanitizeHistory({detectorLevels:clean}).detectorLevels,extended),clean);
  const bad={...clean,[pair]:{...clean[pair],proof:{...clean[pair].proof,stamp:'changed'}}};
  assert.equal(D.sanitizeLevels(bad,extended)[pair].proof,null);
  assert.deepEqual(Object.keys(D.sanitizeLevels(clean,tasks)),[]);
  assert.deepEqual(Object.keys(D.sanitizeLevels(E.sanitizeHistory(null).detectorLevels,extended)),[]);
  assert.equal(D.sanitizeLevels({[pair]:{level:99,lastAt:NOW}},extended)[pair].level,1);
});
