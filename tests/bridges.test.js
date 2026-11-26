'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const B=require('../public/js/bridges');
const C=require('../public/js/concepts');
const L=require('../public/js/learning-map');
const E=require('../public/js/engine');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const words=L.catalog(bank,expressions,{});
const relations=C.catalog(words),content=B.catalog(words,relations),tasks=content.tasks;
const NOW=1780000000000,DAY=B.DAY,random=()=>.37;
const find=id=>tasks.find(t=>t.id===id);
const correct=t=>t.kind==='sort'?Object.fromEntries(t.cards.map((id,i)=>[id,t.solution[i]])):t.kind==='order'?t.cards.slice():t.answer;
test('20 authored tasks cover five modes, use existing words, and have valid answers',()=>{
  assert.deepEqual(content.errors,[]);
  assert.equal(tasks.length,20);
  for(const kind of Object.keys(B.TYPES))assert.equal(tasks.filter(t=>t.kind===kind).length,4);
  for(const task of tasks){
    assert.equal(B.evaluate(task,correct(task)),true);
    assert.ok(task.participants.every(id=>words.some(w=>w.id===id)));
    assert.ok(task.participants.every(id=>task.cards.includes(id)||task.anchors?.includes(id)));
    assert.ok(relations.groups.some(g=>g.id===task.groupId));
    assert.ok(B.solutionLines(task).every(line=>typeof line==='string'&&line.length>0));
    assert.ok(task.stamp);
  }
});
test('malformed content cannot create unplayable tasks or fabricated answers',()=>{
  const copy=()=>JSON.parse(JSON.stringify(B.DATA[0]));
  const missing=copy();missing.cards[0]='unknown';
  assert.equal(B.catalog(words,relations,[missing]).tasks.length,0);
  const dup=copy();dup.cards[0]=dup.cards[1];
  assert.equal(B.catalog(words,relations,[dup]).tasks.length,0);
  const badBin=copy();badBin.solution[0]=2;
  assert.equal(B.catalog(words,relations,[badBin]).tasks.length,0);
  const emptyBin=copy();emptyBin.solution=emptyBin.solution.map(()=>0);
  assert.equal(B.catalog(words,relations,[emptyBin]).tasks.length,0);
  const noGroup=copy();noGroup.groupId='unknown';
  assert.equal(B.catalog(words,relations,[noGroup]).tasks.length,0);
  const invalidAnchor=copy();invalidAnchor.anchors=['sv-9999'];
  assert.equal(B.catalog(words,relations,[invalidAnchor]).tasks.length,0);
  assert.equal(B.catalog(words,relations,{}).tasks.length,0);
});
test('sorting requires all real words, valid bins, and no extra entries',()=>{
  const t=find('ob-01'),solution=correct(t),first=t.cards[0];
  const partial={...solution};delete partial[first];
  assert.equal(B.evaluate(t,partial),null);
  assert.equal(B.evaluate(t,{...solution,unknown:0}),null);
  assert.equal(B.evaluate(t,{...solution,[first]:2}),null);
  assert.equal(B.evaluate(t,{...solution,[first]:'0'}),null);
  assert.equal(B.evaluate(t,{...solution,[first]:1-solution[first]}),false);
  assert.equal(B.evaluate(t,solution),true);
});
test('ordering checks the specific authored story, with no repeated or missing word',()=>{
  const t=find('ob-09'),solution=correct(t);
  assert.equal(B.evaluate(t,solution.slice(0,2)),null);
  assert.equal(B.evaluate(t,[solution[0],solution[0],solution[2]]),null);
  assert.equal(B.evaluate(t,[...solution,'x']),null);
  assert.equal(B.evaluate(t,[solution[1],solution[0],solution[2]]),false);
  assert.equal(B.evaluate(t,solution),true);
  assert.equal(B.solutionLines(t).length,3);
});
test('single-choice and explanatory tasks validate inputs and distinguish retries from previews',()=>{
  for(const t of tasks.filter(t=>['odd','bridge','explain'].includes(t.kind))){
    const wrong=t.kind==='explain'?(t.answer+1)%3:t.cards.find(id=>id!==t.answer);
    assert.equal(B.evaluate(t,'unknown'),null);
    assert.equal(B.evaluate(t,wrong),false);
    assert.deepEqual(B.result(t,wrong,0),{step:'retry',outcome:null});
    assert.deepEqual(B.result(t,wrong,1),{step:'guided',outcome:'supported'});
    assert.deepEqual(B.result(t,t.answer,1),{step:'complete',outcome:'supported'});
    assert.deepEqual(B.result(t,t.answer,0),{step:'complete',outcome:'direct'});
    assert.deepEqual(B.result(t,t.answer,0,true),{step:'complete',outcome:'previewed'});
    assert.equal(B.result(t,t.answer,2),null);
  }
});
test('quick rounds are short, diverse, age-appropriate and avoid overlapping concepts',()=>{
  const p=B.plan(content,{},new Set(),NOW,random);
  assert.equal(p.round.length,3);
  assert.equal(new Set(p.round.map(t=>t.kind)).size,3);
  assert.equal(new Set(p.round.map(t=>t.groupId)).size,3);
  assert.ok(p.round.every(t=>t.starter));
  const shown=p.round.flatMap(t=>t.participants);
  assert.equal(shown.length,new Set(shown).size);
  const only={tasks:[find('ob-01'),find('ob-05')]};
  assert.equal(B.plan(only,{},new Set(),NOW,random).round.length,1,'no filler from overlapping tasks');
});
test('word, relation and mode filters intersect; prompt anchors count but unrelated group members do not',()=>{
  const p=B.plan(content,{},new Set(),NOW,random,{kind:'order'});
  assert.ok(p.round.every(t=>t.kind==='order'));
  assert.ok(p.round.length>0);
  const q=B.plan(content,{},new Set(),NOW,random,{wordId:'sv-0016',kind:'bridge'});
  assert.equal(q.round[0].id,'ob-13');
  assert.equal(B.plan(content,{},new Set(),NOW,random,{wordId:'sv-0065',kind:'bridge'}).round.length,0);
  assert.equal(B.plan(content,{},new Set(),NOW,random,{type:'category',kind:'explain'}).round.length,0);
  assert.ok(B.plan(content,{},new Set(),NOW,random,{type:'category',kind:'sort'}).round.every(t=>t.type==='category'&&t.kind==='sort'));
  assert.equal(B.plan(content,{},new Set(),NOW,random,{groupId:'bk-10'}).round[0].id,'ob-20');
});
test('previous support receives priority and each task rests for a day',()=>{
  const t=find('ob-01');
  let progress=C.record({},tasks,t.id,'supported',NOW);
  assert.equal(B.plan(content,progress,new Set(),NOW+DAY-1,random).round.some(t=>t.id==='ob-01'),false);
  assert.equal(B.plan(content,progress,new Set(),NOW+DAY,random).round[0].id,t.id);
  assert.equal(C.record(progress,tasks,t.id,'direct',NOW+DAY-1),progress);
  const stale={[t.id]:{...progress[t.id],stamp:'old'}};
  assert.equal(B.plan({tasks:[t]},stale,new Set(),NOW,random).round[0].id,t.id);
});
test('separate bounded history survives reload and rejects stale content and arbitrary text',()=>{
  const t=find('ob-13');
  const p=C.record({},tasks,t.id,'previewed',NOW);
  assert.equal(p[t.id].direct,0);
  const q=C.record(p,tasks,t.id,'direct',NOW+DAY);
  assert.equal(q[t.id].direct,1);
  const poison={[t.id]:{...q[t.id],attempts:999999,direct:999999,typed:'do not retain'},unknown:q[t.id]};
  const safe=C.sanitize(poison,tasks);
  assert.deepEqual(Object.keys(safe),[t.id]);
  assert.equal(safe[t.id].direct,9999);
  assert.equal(Object.hasOwn(safe[t.id],'typed'),false);
  assert.deepEqual(C.sanitize(E.sanitizeHistory({bridgeProgress:safe}).bridgeProgress,tasks),safe);
  assert.deepEqual(Object.keys(C.sanitize(E.sanitizeHistory(null).bridgeProgress,tasks)),[]);
  const edited=JSON.parse(JSON.stringify(B.DATA));edited.find(t=>t.id==='ob-13').why+=' Ändring.';
  assert.equal(C.sanitize(q,B.catalog(words,relations,edited).tasks)[t.id],undefined);
});
test('bridge attempts never update quiz or ordinary skill evidence',()=>{
  const history=E.sanitizeHistory({results:[{finishedAt:NOW,right:5,total:5}]});
  const before=JSON.stringify(history);
  const p=C.record(history.bridgeProgress,tasks,'ob-01','direct',NOW);
  assert.equal(JSON.stringify(history),before);
  assert.equal(p['ob-01'].direct,1);
  assert.equal(E.score({'sv-0046':'right'},1).right,1);
  const profile=L.profile(words.find(w=>w.id==='sv-0046'),{types:['meaning','reverse']});
  assert.equal(profile.facets.find(row=>row.id==='meaning').state,'new');
});
