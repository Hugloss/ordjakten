'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Camp=require('../public/js/adventure-camp'),Story=require('../public/js/story-quests'),
  A=require('../public/js/adventures'),E=require('../public/js/engine'),L=require('../public/js/learning-map');
const bank=require('../public/data/ordbank.json'),expressions=require('../public/data/expressions.json');
const words=L.catalog(bank,expressions,{});
const items=progress=>Camp.inventory(progress,Story,A);
test('camp is playable immediately with six free items, four free scenes and six slots',()=>{
  const inventory=items({});
  assert.equal(inventory.length,6);
  assert.equal(Object.keys(Camp.SCENES).length,4);
  const state=Camp.sanitize(null,inventory);
  assert.equal(state.scene,'glade');
  assert.deepEqual(state.slots,['free-tent',null,'free-lantern',null,'free-book',null]);
  assert.equal(new Set(inventory.map(i=>i.id)).size,6);
  assert.equal(Camp.SLOTS.length,6);
});
test('inventory derives all 48 possible keepsakes from actual completed chapters, never from layout',()=>{
  const p={forest:2,space:1};
  const inventory=items(p);
  assert.equal(inventory.length,9);
  assert.equal(inventory.find(i=>i.id==='mark-forest-0').name,'Stiglövet');
  assert.equal(inventory.find(i=>i.id==='mark-forest-1').name,'Svampkartan');
  assert.ok(!inventory.some(i=>i.id==='mark-forest-2'));
  assert.ok(!inventory.some(i=>i.id==='mark-space-1'));
  const full=items(Object.fromEntries(A.WORLD_IDS.map(id=>[id,4])));
  assert.equal(full.length,54);
  assert.equal(new Set(full.map(i=>i.id)).size,54);
  assert.deepEqual(p,{forest:2,space:1});
});
test('placing an earned object, moving and swapping preserve unique ownership without mutation',()=>{
  const inventory=items({forest:1});
  const before=Camp.sanitize(null,inventory);
  const first=Camp.place(before,'mark-forest-0',0,inventory);
  assert.equal(first.slots[0],'mark-forest-0');
  assert.equal(before.slots[0],'free-tent');
  const moved=Camp.place(first,'free-book',0,inventory);
  assert.equal(moved.slots[0],'free-book');
  assert.equal(moved.slots[4],'mark-forest-0');
  assert.equal(Camp.place(moved,'free-book',0,inventory),moved);
  assert.equal(inventory.length,7);
  const placed=Camp.place(moved,'free-tent',1,inventory);
  assert.equal(placed.slots[1],'free-tent');
  const filled=placed.slots.filter(Boolean);
  assert.equal(new Set(filled).size,filled.length);
});
test('removing objects puts them back in the available collection and cannot affect story progress',()=>{
  const p={space:1},inventory=items(p),before=Camp.sanitize(null,inventory);
  const state=Camp.place(before,'mark-space-0',1,inventory);
  const removed=Camp.remove(state,1,inventory);
  assert.equal(removed.slots[1],null);
  assert.equal(state.slots[1],'mark-space-0');
  assert.ok(inventory.some(item=>item.id==='mark-space-0'));
  assert.deepEqual(p,{space:1});
  assert.equal(Camp.remove(removed,1,inventory),removed);
  assert.equal(Camp.remove(state,-1,inventory),state);
});
test('invalid, unearned and duplicate objects are rejected in both history loading and the actual editor',()=>{
  const p={forest:1},inventory=items(p);
  const raw={scene:'fake',slots:['free-book','free-book','mark-forest-0','mark-forest-1','unknown','mark-space-0','free-flower'],typed:'secret'};
  const clean=Camp.sanitize(raw,inventory);
  assert.deepEqual(clean,{scene:'glade',slots:['free-book',null,'mark-forest-0',null,null,null]});
  assert.deepEqual(E.sanitizeHistory({storyProgress:p,campLayout:raw}).campLayout,clean);
  assert.equal(Camp.place(clean,'mark-forest-1',1,inventory),clean);
  assert.equal(Camp.place(clean,'free-book',6,inventory),clean);
  assert.equal(Camp.place(clean,'free-book',1.2,inventory),clean);
  assert.deepEqual(Camp.sanitize(clean,items({})).slots,['free-book',null,null,null,null,null]);
  assert.equal(E.sanitizeHistory(null).campLayout,null);
  assert.equal(E.sanitizeHistory({campLayout:[]}).campLayout,null);
});
test('changing the scene is free, independent of collected marks and preserves arrangements',()=>{
  const inventory=items({}),state=Camp.sanitize(null,inventory);
  const next=Camp.changeScene(state,'space',inventory);
  assert.equal(next.scene,'space');
  assert.deepEqual(next.slots,state.slots);
  assert.equal(Camp.changeScene(next,'space',inventory),next);
  assert.equal(Camp.changeScene(next,'__proto__',inventory),next);
  assert.equal(Camp.changeScene(next,{},inventory),next);
  assert.equal(state.scene,'glade');
});
test('creative prompts use only placed objects and include meaningful prompts for an empty scene',()=>{
  const inventory=items({forest:1});
  const state=Camp.sanitize({scene:'coast',slots:['mark-forest-0',null,null,null,null,null]},inventory);
  assert.match(Camp.prompt(state,inventory,0),/Stiglövet/);
  assert.match(Camp.prompt(state,inventory,1),/saga/);
  assert.match(Camp.prompt(state,inventory,2),/Varför|varför/);
  assert.match(Camp.prompt(state,inventory,3),/Var finns/);
  const empty={scene:'glade',slots:Array(6).fill(null)};
  assert.ok(Camp.prompt(empty,inventory,0).length>0);
  assert.ok(!Camp.prompt(empty,inventory,0).includes('Stiglövet'));
  assert.equal(Camp.prompt(state,inventory,-1),Camp.prompt(state,inventory,0));
});
test('three companions have varied, finite friendly dialogue without scores or timers',()=>{
  for(const id of ['fox','owl','dragon']){
    const lines=[0,1,2].map(index=>Camp.dialogue(id,index));
    assert.equal(new Set(lines).size,3);
    assert.ok(lines.every(line=>line.length>0));
    assert.equal(Camp.dialogue(id,3),lines[0]);
  }
  assert.equal(Camp.dialogue('unknown'),Camp.dialogue('fox'));
});
test('world map exposes all worlds from the beginning and distinguishes completed worlds and next chapter',()=>{
  const p={space:4,forest:1};
  const map=Camp.worlds(p,'space',Story,A);
  assert.deepEqual(map.map(w=>w.id),A.WORLD_IDS);
  const space=map.find(w=>w.id==='space'),forest=map.find(w=>w.id==='forest');
  assert.equal(space.complete,true);
  assert.equal(space.current,true);
  assert.equal(space.chapter,'Ett återbesök');
  assert.equal(forest.count,1);
  assert.equal(forest.chapter,'Svamparnas hemliga ring');
  assert.equal(map.filter(w=>w.current).length,1);
  assert.equal(map.find(w=>w.id==='castle').count,0);
  assert.deepEqual(p,{space:4,forest:1});
});
test('six authored mysteries use real distinct wordbank choices and have one keyed answer and explanation',()=>{
  const tasks=Camp.riddles(words);
  assert.equal(tasks.length,6);
  const all=new Set(tasks.map(t=>t.id));
  assert.equal(all.size,tasks.length);
  for(const task of tasks){
    assert.equal(task.options.length,3);
    assert.equal(task.options.filter(o=>o.correct).length,1);
    assert.ok(task.options.every(o=>words.some(w=>w.id===o.id&&w.name===o.label)));
    assert.ok(task.story&&task.hint&&task.why);
    const shuffled=Camp.shuffleOptions(task,()=>.37);
    assert.equal(shuffled.length,3);
    assert.deepEqual(shuffled.map(o=>o.id).sort(),task.options.map(o=>o.id).sort());
  }
});
test('malformed riddles fail closed and response progression supports retry without awarding knowledge',()=>{
  const task=Camp.riddles(words)[0],right=task.options.find(o=>o.correct),wrong=task.options.find(o=>!o.correct);
  assert.equal(Camp.answer(task,right.id,0),'solved');
  assert.equal(Camp.answer(task,wrong.id,0),'hint');
  assert.equal(Camp.answer(task,wrong.id,1),'explain');
  assert.equal(Camp.answer(task,right.id,1),'solved');
  assert.equal(Camp.answer(task,right.id,2),null);
  assert.equal(Camp.answer(task,'unknown',0),null);
  assert.equal(Camp.answer(null,right.id,0),null);
  assert.equal(Camp.riddles(words,null).length,0);
  const invalid={...Camp.RIDDLES[0],words:['sv-0001','sv-0001','unknown']};
  assert.equal(Camp.riddles(words,[invalid]).length,0);
  assert.equal(Camp.riddles(words,[Camp.RIDDLES[0],Camp.RIDDLES[0]]).length,1);
});
