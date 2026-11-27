'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../public/js/engine');
const D=require('../public/js/adaptive');
const B=require('../public/js/reading-check');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const contexts=require('../public/data/word-contexts.json');
const missions=require('../public/data/missions.json');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../public/data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;
const NOW=1780000000000;
const settings={mode:'train',difficulty:'medium',topic:'words',count:5,
  adaptivePractice:true,contextMix:true,expressionTask:'mix',practiceGoal:'mixed'};
const pool=E.getTopicPool(bank,curation,expressions,settings);
const contextIds=new Set(contexts.wordContexts.map(x=>x.id));
const target=pool.find(x=>contextIds.has(x.entry.id)).entry.id;
const other=pool.filter(x=>x.entry.id!==target).slice(0,5).map(x=>x.entry.id);
function generate(options={},memory={}){
  return E.generateRound(bank,curation,{...settings,...options},memory.mistakes||{},()=>.43,
    expressions,missions,memory.reviews||{},NOW,contexts,memory.progress||{},D,
    memory.readingProgress||{},memory.missionProgress||{});
}
function pools(memory={},options={}){
  return D.trainingPools(E.getTopicPool(bank,curation,expressions,{...settings,...options}),
    {...settings,...options},{contextIds,missionsAvailable:true,now:NOW,...memory});
}
function ids(items){return items.map(item=>item.entry.id);}

test('new goals migrate safely and do not override explicit review or test modes',()=>{
  assert.equal(E.sanitizeSettings({}).practiceGoal,'mixed');
  assert.equal(E.sanitizeSettings({practiceGoal:'invalid'}).practiceGoal,'mixed');
  assert.equal(E.sanitizeHistory({settings:{practiceGoal:'discover'}}).settings.practiceGoal,'discover');
  assert.equal(E.sanitizeSettings({practiceGoal:'focus',reviewOnly:true}).practiceGoal,'mixed');
  for(const override of [{mode:'test'},{difficulty:'exam'},{contextOnly:true},{reviewOnly:true}]){
    assert.equal(E.practiceGoalForRound({...settings,practiceGoal:'discover',...override}),'mixed');
  }
});

test('discovery excludes any locally recorded attempt, Aha observation, review or legacy mistake',()=>{
  const memory={
    progress:D.record({}, {id:other[0],kind:'word',taskType:'meaning'},'right',NOW),
    readingProgress:B.recordProgress({},target,'context','first',NOW),
    reviews:{[other[1]]:{streak:0,dueAt:NOW,attempts:0}},
    mistakes:{[other[2]]:2}
  };
  const result=pools(memory);
  const seen=new Set([target,...other.slice(0,3)]);
  assert.equal(result.discover.length,pool.length-seen.size);
  assert.ok(ids(result.discover).every(id=>!seen.has(id)));
  const round=generate({practiceGoal:'discover'},memory);
  assert.equal(round.length,5);
  assert.equal(new Set(round.map(q=>q.id)).size,5);
  assert.ok(round.every(q=>!seen.has(q.id)));
  const expression=expressions.expressions[0].id;
  const phrases=pools({missionProgress:{[expression]:['meaning']}},{topic:'expressions'});
  assert.ok(!ids(phrases.discover).includes(expression));
});

test('focus includes Aha support even after a correct answer, but does not break scheduled pauses',()=>{
  let progress=D.record({}, {id:target,kind:'word',taskType:'meaning'},'right',NOW);
  progress=D.record(progress,{id:other[0],kind:'word',taskType:'reverse'},'wrong',NOW);
  progress=D.record(progress,{id:other[1],kind:'word',taskType:'meaning'},'wrong',NOW);
  const readingProgress=B.recordProgress({},target,'context','guided',NOW);
  const reviews={[other[1]]:{streak:1,dueAt:NOW+3600000,attempts:2},
    [other[2]]:{streak:0,dueAt:NOW,attempts:1}};
  const memory={progress,readingProgress,reviews};
  assert.deepEqual(new Set(ids(pools(memory).focus)),new Set([target,other[0],other[2]]));
  const round=generate({practiceGoal:'focus'},memory);
  assert.equal(round.length,3,'short round instead of unrelated filler');
  assert.deepEqual(new Set(round.map(q=>q.id)),new Set([target,other[0],other[2]]));
  assert.equal(round.find(q=>q.id===target).taskType,'context');
  const noAdapt=generate({practiceGoal:'focus',adaptivePractice:false},memory);
  assert.deepEqual(new Set(noAdapt.map(q=>q.id)),new Set([target,other[0],other[2]]));
});

test('empty filtered goals are explicit rather than silently switching to mixed',()=>{
  assert.throws(()=>generate({practiceGoal:'focus'}),/Inget behöver/);
  let progress={};
  for(const item of pool)progress=D.record(progress,{id:item.entry.id,kind:'word'},'right',NOW);
  assert.throws(()=>generate({practiceGoal:'discover'},{progress}),/Inga oprövade/);
  const remaining=pool[0].entry.id;
  delete progress[remaining];
  assert.deepEqual(generate({practiceGoal:'discover'},{progress}).map(q=>q.id),[remaining]);
});

test('saved goals never bias test, exam, dedicated context or review rounds',()=>{
  const readingProgress=B.recordProgress({},target,'context','guided',NOW);
  const memory={readingProgress,reviews:{[target]:{streak:0,dueAt:NOW,attempts:1}}};
  for(const options of [{mode:'test'},{difficulty:'exam'},{contextOnly:true},{reviewOnly:true}]){
    const base=generate({...options,practiceGoal:'mixed'},memory);
    assert.deepEqual(generate({...options,practiceGoal:'focus'},memory),base);
    assert.deepEqual(generate({...options,practiceGoal:'discover'},memory),base);
  }
});

test('mixed-topic focus does not duplicate concepts or invent unavailable questions',()=>{
  const expression=expressions.expressions[0].id;
  let readingProgress=B.recordProgress({},target,'context','retry',NOW);
  readingProgress=B.recordProgress(readingProgress,expression,'expression','guided',NOW);
  const options={topic:'mixed',practiceGoal:'focus',count:25};
  const round=generate(options,{readingProgress});
  assert.equal(round.length,2);
  assert.deepEqual(new Set(round.map(q=>q.id)),new Set([target,expression]));
  assert.equal(round.find(q=>q.id===expression).taskType,'sentence');
});
