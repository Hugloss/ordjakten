'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../public/js/concepts');
const L=require('../public/js/learning-map');
const E=require('../public/js/engine');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const words=L.catalog(bank,expressions,{});
const content=C.catalog(words),tasks=content.tasks;
const NOW=1780000000000,DAY=C.DAY,random=()=>.37;
const first=tasks.find(task=>task.id==='bk-01-1');
test('18 explicitly authored groups cover all five types with 36 questions and real concept IDs',()=>{
  assert.deepEqual(content.errors,[]);
  assert.equal(content.groups.length,18);
  assert.equal(tasks.length,36);
  assert.equal(new Set(tasks.map(t=>t.id)).size,36);
  assert.equal(new Set(content.groups.flatMap(g=>g.words.map(w=>w.id))).size,49);
  for(const type of Object.keys(C.TYPES))assert.ok(content.groups.some(g=>g.type===type));
  for(const group of content.groups){
    assert.ok(group.explanation.length>10);
    assert.equal(group.questions.length,2);
    assert.equal(new Set(group.questions.map(q=>q.answer)).size,2);
    for(const task of group.questions){
      assert.ok(group.words.some(w=>w.id===task.answer));
      assert.equal(task.options.length,3);
      assert.equal(new Set(task.options.map(o=>o.id)).size,3);
      assert.equal(task.options.filter(o=>o.correct).length,1);
      assert.ok(task.options.every(o=>words.some(w=>w.id===o.id&&w.name===o.label)));
      assert.ok(task.why.length>10);
      assert.ok(task.stamp);
    }
  }
});
test('unknown words, duplicate answers, malformed groups and repeated prompts fail closed',()=>{
  const copy=()=>JSON.parse(JSON.stringify(C.GROUPS[0]));
  const invalid=copy();invalid.words[0]='sv-9999';
  assert.equal(C.catalog(words,[invalid]).groups.length,0);
  const duplicate=copy();duplicate.questions[0].options[2]=duplicate.questions[0].options[1];
  assert.equal(C.catalog(words,[duplicate]).tasks.length,0);
  const repeated=copy();repeated.questions[1].prompt=repeated.questions[0].prompt;
  assert.equal(C.catalog(words,[repeated]).tasks.length,0);
  const answer=copy();answer.questions[0].answer='sv-0014';
  assert.equal(C.catalog(words,[answer]).tasks.length,0);
  assert.equal(C.catalog(words,{}).tasks.length,0);
  assert.ok(C.catalog(words,[copy(),copy()]).errors.length);
});
test('starter quick rounds are short, varied and never contain two questions from one group',()=>{
  const round=C.plan(content,{},new Set(),NOW,random).round;
  assert.equal(round.length,3);
  assert.equal(new Set(round.map(q=>q.groupId)).size,3);
  assert.equal(new Set(round.map(q=>q.type)).size,3);
  assert.ok(round.every(q=>q.starter));
  assert.ok(!round.some(q=>q.groupId==='bk-09'||q.groupId==='bk-10'));
});
test('map filtering restricts both browsing and question selection, including explicit harder groups',()=>{
  const p=C.plan(content,{},new Set(),NOW,random,null,null,'nuance');
  assert.equal(p.round.length,3);
  assert.ok(p.round.every(q=>q.type==='nuance'));
  const groups=C.forWord(content,'sv-0050');
  assert.equal(groups.length,2);
  const word=C.plan(content,{},new Set(),NOW,random,null,'sv-0050');
  assert.equal(word.round.length,2);
  assert.ok(word.round.every(q=>groups.some(g=>g.id===q.groupId)));
  assert.equal(C.plan(content,{},new Set(),NOW,random,'bk-09').round[0].groupId,'bk-09');
  assert.equal(C.plan(content,{},new Set(),NOW,random,'bk-09','sv-0050').round.length,0);
  assert.equal(C.plan(content,{},new Set(),NOW,random,null,'sv-0050','similar').round.length,0);
  assert.equal(C.forWord(content,'sv-9999').length,0);
});
test('due support receives priority and different questions can be tried while one rests',()=>{
  let p=C.record({},tasks,first.id,'supported',NOW);
  const waiting=C.plan(content,p,new Set(),NOW+DAY-1,random,'bk-01');
  assert.equal(waiting.waiting,1);
  assert.equal(waiting.ready,1);
  assert.equal(waiting.round.length,1);
  assert.ok(waiting.round[0].id!==first.id);
  assert.equal(C.record(p,tasks,first.id,'direct',NOW+DAY-1),p);
  assert.equal(C.summary(tasks.filter(t=>t.groupId==='bk-01'),p,NOW+DAY-1).needsPractice,false);
  assert.equal(C.plan(content,p,new Set(),NOW+DAY,random).round[0].id,first.id);
  const other=tasks.find(t=>t.groupId==='bk-01'&&t.id!==first.id);
  p=C.record(p,tasks,other.id,'previewed',NOW+DAY);
  p=C.record(p,tasks,first.id,'direct',NOW+DAY);
  const summary=C.summary(tasks.filter(t=>t.groupId==='bk-01'),p,NOW+DAY);
  assert.equal(summary.ready,false);
  assert.equal(summary.seen,2);
  assert.equal(summary.direct,1);
  assert.equal(C.plan(content,p,new Set(),NOW+DAY,random,'bk-01').round.length,0);
});
test('observations distinguish first attempts, explanation previews, retries and invalid choices',()=>{
  const wrong=first.options.find(o=>!o.correct).id;
  assert.deepEqual(C.outcome(first,wrong,0),{step:'retry',outcome:null});
  assert.deepEqual(C.outcome(first,wrong,1),{step:'guided',outcome:'supported'});
  assert.deepEqual(C.outcome(first,first.answer,1),{step:'complete',outcome:'supported'});
  assert.deepEqual(C.outcome(first,first.answer,0),{step:'complete',outcome:'direct'});
  assert.deepEqual(C.outcome(first,first.answer,0,true),{step:'complete',outcome:'previewed'});
  assert.deepEqual(C.outcome(first,wrong,1,true),{step:'guided',outcome:'previewed'});
  assert.equal(C.outcome(first,'unknown',0),null);
  assert.equal(C.outcome(first,first.answer,2),null);
  let p=C.record({},tasks,first.id,'previewed',NOW);
  assert.equal(p[first.id].direct,0);
  p=C.record(p,tasks,first.id,'direct',NOW+DAY);
  assert.equal(p[first.id].direct,1);
  const report=C.summary([first],p,NOW+2*DAY);
  assert.equal(report.seen,1);
  assert.equal(report.direct,1);
});
test('old unknown content and private text are not accepted as relation history',()=>{
  const p=C.record({},tasks,first.id,'direct',NOW);
  const poisoned={[first.id]:{...p[first.id],attempts:100000,direct:100000,typed:'child text'},
    unknown:{...p[first.id]}};
  const safe=C.sanitize(poisoned,tasks);
  assert.deepEqual(Object.keys(safe),[first.id]);
  assert.equal(safe[first.id].attempts,9999);
  assert.equal(safe[first.id].direct,9999);
  assert.equal(Object.hasOwn(safe[first.id],'typed'),false);
  assert.deepEqual(C.sanitize(E.sanitizeHistory({conceptProgress:safe}).conceptProgress,tasks),safe);
  assert.deepEqual(Object.keys(C.sanitize(E.sanitizeHistory(null).conceptProgress,tasks)),[]);
  const changed=JSON.parse(JSON.stringify(C.GROUPS));changed[0].explanation+=' Ny förklaring.';
  assert.equal(C.sanitize(p,C.catalog(words,changed).tasks)[first.id],undefined);
  assert.equal(C.record(p,tasks,'bad','direct',NOW+DAY),p);
});
test('relation practice never adds quiz points or marks other word dimensions as understood',()=>{
  const history=E.sanitizeHistory({results:[{finishedAt:NOW,right:5,total:5}]});
  const before=JSON.stringify(history);
  const p=C.record(history.conceptProgress,tasks,first.id,'direct',NOW);
  assert.equal(JSON.stringify(history),before);
  assert.equal(p[first.id].direct,1);
  const profile=L.profile(words.find(w=>w.id===first.answer),{types:['meaning','reverse']});
  assert.equal(profile.facets.find(row=>row.id==='meaning').state,'new');
  assert.equal(E.score({[first.answer]:'right'},1).right,1);
});
