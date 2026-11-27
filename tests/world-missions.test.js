'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../public/js/world-missions'),S=require('../public/js/story-quests'),
  Camp=require('../public/js/adventure-camp'),A=require('../public/js/adventures'),
  E=require('../public/js/engine'),L=require('../public/js/learning-map');
const bank=require('../public/data/ordbank.json'),expressions=require('../public/data/expressions.json');
const words=L.catalog(bank,expressions,{});
const content=M.catalog(words,S),random=()=>.37;
const start=(p={},world='forest',index=0)=>M.start(content,S.model(p,world),index,random);
const choose=round=>M.answer(round,round.options.find(o=>o.correct).id);
test('every world chapter has a valid authored narrative action using a real wordbank word',()=>{
  assert.deepEqual(content.errors,[]);
  assert.equal(Object.keys(content.tasks).length,48);
  assert.equal(new Set(Object.values(content.tasks).map(task=>task.target)).size,41);
  for(const world of A.WORLD_IDS){
    for(let i=0;i<4;i++){
      const task=content.tasks[world+':'+i];
      assert.equal(task.world,world);
      assert.equal(task.index,i);
      assert.ok(words.some(w=>w.id===task.target&&w.name===task.word&&w.definition===task.definition));
      assert.ok(task.prompt&&task.why);
      assert.equal(task.options.length,3);
      assert.equal(task.options.filter(o=>o.correct).length,1);
      assert.equal(new Set(task.options.map(o=>o.label)).size,3);
    }
  }
});
test('shuffled options retain the correct action and neither planning nor retry changes chapter progress',()=>{
  const before={},round=start(before);
  assert.equal(round.stage,'question');
  assert.equal(round.chapter.title,'Ett prassel vid stigen');
  assert.deepEqual(round.options.map(o=>o.id).sort(),['0','1','2']);
  assert.equal(round.options.filter(o=>o.correct).length,1);
  assert.equal(M.answer(round,'invalid'),round);
  const wrong=round.options.find(o=>!o.correct),retry=M.answer(round,wrong.id);
  assert.equal(retry.stage,'question');assert.equal(retry.attempts,1);
  assert.equal(round.attempts,0);
  assert.equal(retry.options,round.options);
  assert.equal(M.complete(before,retry,S).progress,before);
  assert.deepEqual(before,{});
});
test('correct action reaches an explanation, then an explicit ending with one cosmetic discovery',()=>{
  const before={},round=start(before),explained=choose(round);
  assert.equal(explained.stage,'explanation');
  assert.equal(explained.outcome,'direct');
  assert.equal(M.answer(explained,'0'),explained);
  assert.equal(M.explain(explained),explained);
  const result=M.complete(before,explained,S);
  assert.equal(result.round.stage,'ending');
  assert.deepEqual(result.progress,{forest:1});
  assert.equal(result.earned.keepsake,'Stiglövet');
  assert.deepEqual(before,{});
  const again=M.complete(result.progress,result.round,S);
  assert.equal(again.progress,result.progress);
  assert.equal(again.earned,null);
});
test('support and a worked example both resolve the story without pretending to be independent success',()=>{
  const round=start(),wrong=round.options.find(o=>!o.correct);
  const retry=M.answer(round,wrong.id);
  assert.equal(choose(retry).outcome,'supported');
  const guided=M.answer(retry,wrong.id);
  assert.equal(guided.outcome,'guided');
  assert.equal(guided.stage,'explanation');
  const revealed=M.explain(round);
  assert.equal(revealed.outcome,'guided');
  for(const task of [choose(retry),guided,revealed]){
    const result=M.complete({},task,S);
    assert.deepEqual(result.progress,{forest:1});
    assert.equal(result.round.stage,'ending');
  }
});
test('unfinished, invalid, future and stale missions cannot grant an extra mark',()=>{
  const before={forest:1},round=start(before,'forest',1);
  assert.equal(start(before,'forest',2),null);
  assert.equal(start(before,'forest',-1),null);
  assert.equal(start(before,'forest',1.5),null);
  assert.equal(start(before,'forest',4),null);
  assert.equal(M.complete(before,round,S).earned,null);
  assert.equal(M.complete(before,null,S).earned,null);
  const ready=choose(round);
  assert.equal(M.complete({},ready,S).earned,null);
  assert.equal(M.complete(before,{...ready,task:{...ready.task,world:'space'}},S).earned,null);
  const result=M.complete(before,ready,S);
  assert.equal(result.earned.keepsake,'Svampkartan');
  assert.equal(M.complete(result.progress,ready,S).earned,null);
});
test('all four chapters can finish and then replay without duplicate rewards or more chapters',()=>{
  let p={};
  for(let index=0;index<4;index++){
    const round=start(p,'space',index);
    const result=M.complete(p,choose(round),S);
    assert.equal(result.earned.index,index);
    p=result.progress;
  }
  assert.deepEqual(p,{space:4});
  const model=S.model(p,'space');
  assert.equal(model.complete,true);
  assert.equal(M.start(content,model),null);
  for(let i=0;i<4;i++){
    const replay=M.complete(p,choose(start(p,'space',i)),S);
    assert.equal(replay.earned,null);assert.equal(replay.progress,p);
    assert.equal(replay.round.stage,'ending');
  }
});
test('chapter discovery is shared with ordinary adaptive adventures and camp inventory, without a new score',()=>{
  const history=E.sanitizeHistory({storyProgress:{forest:1},results:[],skillProgress:{}});
  const before=JSON.stringify(history);
  const result=M.complete(history.storyProgress,choose(start(history.storyProgress,'forest',1)),S);
  assert.equal(JSON.stringify(history),before);
  const stored=E.sanitizeHistory({...history,storyProgress:result.progress});
  assert.deepEqual(stored.results,history.results);
  assert.deepEqual(stored.skillProgress,history.skillProgress);
  assert.equal(S.finish(stored.storyProgress,S.model(stored.storyProgress,'forest').chapters[1],
    {finished:true,completed:['focus']}).earned,null);
  const inventory=Camp.inventory(stored.storyProgress,S,A);
  assert.ok(inventory.some(i=>i.id==='mark-forest-1'));
  assert.equal(Camp.place(Camp.sanitize(null,inventory),'mark-forest-1',1,inventory).slots[1],'mark-forest-1');
});
test('malformed authored content fails closed instead of displaying an unkeyed or missing exercise',()=>{
  const bad={...M.DATA,forest:M.DATA.forest.map(row=>row.slice())};
  bad.forest[0]=['missing','A question',['one','two','three'],'why'];
  bad.forest[1]=[bad.forest[1][0],'Prompt',['same','same','other'],'why'];
  const invalid=M.catalog(words,S,bad);
  assert.deepEqual(invalid.errors,['forest:0','forest:1']);
  assert.equal(M.start(invalid,S.model({},'forest')),null);
  assert.equal(Object.keys(invalid.tasks).length,46);
});
