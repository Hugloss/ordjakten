'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Treasure=require('../public/js/treasure-hunt');
const Data=require('../public/js/treasure-hunt-data');
const A=require('../public/js/adventures');
const Story=require('../public/js/story-quests');
const Missions=require('../public/js/world-missions');
const Learning=require('../public/js/learning-map');
const Stars=require('../public/js/star-collection');
const bank=require('../public/data/ordbank.json'),expressions=require('../public/data/expressions.json');
const words=Learning.catalog(bank,expressions,{}),missions=Missions.catalog(words,Story);
const catalog=Treasure.catalog(Data,A,Story,missions);
const clone=value=>JSON.parse(JSON.stringify(value));
const fresh=()=>Treasure.sanitize(null,catalog);
const reload=value=>Treasure.sanitize(clone(value),catalog);
const view=(state,world='forest')=>Treasure.model(state,world,catalog);
const visit=(state,index,world='forest',random=()=>.37)=>Treasure.visit(state,world,index,catalog,random);
const choose=(state,correct=true)=>Treasure.answer(state,state.serial,
  view(state,state.active.world).visit.options.find(option=>option.correct===correct).id,catalog);
const finish=state=>Treasure.finish(state,state.serial,catalog);
const back=state=>Treasure.back(state,state.serial,catalog);

test('all twelve maps reuse four real authored word tasks and independent special treasures',()=>{
  assert.deepEqual(catalog.errors,[]);
  assert.deepEqual(Object.keys(catalog.worlds),A.WORLD_IDS);
  for(const id of A.WORLD_IDS){
    const model=view(fresh(),id);
    assert.equal(model.phase,'map');assert.equal(model.count,0);assert.equal(model.total,4);
    assert.equal(model.clue.index,2,'the first clue is not the first map option');
    assert.equal(model.places.length,4);
    assert.ok(model.places.every(place=>!place.visited&&!place.found));
    for(const place of model.places){
      assert.deepEqual(place.task,missions.tasks[id+':'+place.index]);
      assert.equal(place.treasure.name,Story.DATA[id][place.index][4]);
      assert.equal(place.description,Data.DATA[id][place.index].description);
    }
  }
});

test('a wrong destination offers its own task and one common find without a finder point',()=>{
  let state=visit(fresh(),0),model=view(state);
  assert.equal(model.visit.matched,false);
  assert.equal(model.visit.task.key,'forest:0');
  assert.equal(model.visit.activityKey,'treasure:forest:0');
  assert.equal(model.clue.index,2);
  state=finish(choose(state));model=view(state);
  assert.equal(model.phase,'reward');assert.equal(model.visit.reward.kind,'small');
  assert.equal(model.visit.reward.name,Data.SMALL_FINDS.forest.name);
  assert.equal(model.visit.reward.newItem,true);assert.equal(model.visit.reward.finderAdded,0);
  assert.equal(model.count,0);assert.equal(model.finderTotal,0);assert.equal(model.clue.index,2);
  assert.equal(model.smallFinds.length,1);
  assert.equal(model.places[0].visited,true);assert.equal(model.places[0].found,false);
  state=finish(choose(visit(back(reload(state)),0)));model=view(state);
  assert.equal(model.visit.reward.newItem,false);
  assert.equal(model.smallFinds.length,1);assert.equal(model.finderTotal,0);
});

test('trying the clue again reaches its special treasure and exactly one finder point',()=>{
  let state=finish(choose(visit(fresh(),0)));
  state=visit(back(state),2);
  assert.equal(view(state).visit.matched,true);
  assert.equal(view(state).visit.task.key,'forest:2');
  assert.equal(Treasure.finish(state,state.serial,catalog),state,'unfinished tasks cannot settle a visit');
  state=finish(choose(state));
  let model=view(state);
  assert.equal(model.count,1);assert.equal(model.finderTotal,1);
  assert.deepEqual(model.collection,[{index:2,place:A.world('forest').stops[2].name,
    emoji:Story.DATA.forest[2][3],name:Story.DATA.forest[2][4]}]);
  assert.equal(model.visit.reward.kind,'treasure');assert.equal(model.visit.reward.finderAdded,1);
  assert.equal(model.clue.index,2,'the finished visit explains the original clue before going back');
  assert.equal(Treasure.finish(state,state.serial,catalog),state,'duplicate completion gives nothing extra');
  state=reload(state);assert.equal(view(state).count,1);
  assert.equal(Treasure.finish(state,state.serial,catalog),state);
  model=view(back(state));assert.equal(model.clue.index,0);
});

test('language help is distinct from finding a place and only an own correct answer can earn its word star',()=>{
  for(const outcome of ['direct','supported','guided','explicit']){
    let state=visit(fresh(),2),collection=Stars.sanitize();
    if(outcome==='supported'||outcome==='guided')state=choose(state,false);
    if(outcome==='explicit')state=Treasure.explain(state,state.serial,catalog);
    else state=choose(state,outcome!=='guided');
    const model=view(state),own=['direct','supported'].includes(model.visit.outcome);
    assert.equal(model.phase,'explanation');assert.equal(model.visit.outcome,outcome==='explicit'?'guided':outcome);
    if(own)collection=Stars.awardActivity(collection,model.visit.activityKey).collection;
    assert.equal(collection.total,own?1:0);
    state=finish(reload(state));
    assert.equal(view(state).finderTotal,1,'finding the place is not revoked when the word task needs support');
    assert.equal(view(state).visit.reward.kind,'treasure');
  }
});

test('reload preserves the selected place, shuffled options and the first wrong answer',()=>{
  let state=visit(fresh(),2),model=view(state);
  const options=model.visit.options.map(option=>option.id);
  state=choose(state,false);
  assert.equal(view(state).phase,'question');assert.equal(view(state).visit.attempts,1);
  const snapshot=clone(state);state=reload(state);
  assert.deepEqual(state,snapshot);assert.deepEqual(view(state).visit.options.map(option=>option.id),options);
  state=choose(state);
  assert.equal(view(state).visit.outcome,'supported');
  assert.deepEqual(reload(state),state);
  assert.equal(Treasure.visit(state,'space',0,catalog),state,'a pending visit cannot be silently replaced');
  assert.equal(back(state),state,'a delayed cancel must not discard an answered visit and its promised treasure');
  const collected=back(finish(state));
  assert.equal(view(collected).phase,'map');assert.equal(view(collected).count,1);
  assert.equal(view(collected).clue.index,0);
});

test('leaving an unanswered visit returns to the same clue without creating a reward',()=>{
  const state=choose(visit(fresh(),2),false),canceled=back(state);
  assert.equal(view(canceled).phase,'map');assert.equal(view(canceled).count,0);
  assert.equal(view(canceled).clue.index,2);
  assert.equal(view(canceled).collection.length,0);
  assert.equal(view(canceled).smallFinds.length,0);
});

test('all four clues can be found without time pressure and replay cannot farm rewards',()=>{
  let state=fresh();
  for(const world of A.WORLD_IDS){
    for(const index of Treasure.ORDER){
      state=visit(state,index,world);
      state=Treasure.explain(state,state.serial,catalog);
      state=finish(state);
      assert.equal(view(state,world).visit.reward.finderAdded,1);
      state=back(reload(state));
    }
    const model=view(state,world);
    assert.equal(model.count,4);assert.equal(model.complete,true);assert.equal(model.clue,null);
    assert.equal(model.collection.length,4);
    for(let index=0;index<4;index++){
      state=finish(choose(visit(state,index,world)));
      const replay=view(state,world);
      assert.equal(replay.visit.matched,false);assert.equal(replay.visit.reward.kind,'revisit');
      assert.equal(replay.visit.reward.newItem,false);assert.equal(replay.visit.reward.finderAdded,0);
      assert.equal(replay.count,4);state=back(state);
    }
  }
  assert.equal(view(state).finderTotal,48);
  assert.deepEqual(reload(state),state);
});

test('a second clue hint does not reduce the available finder reward',()=>{
  let state=Treasure.hint(fresh(),'forest',catalog);
  assert.equal(view(state).clue.hintShown,true);
  assert.equal(Treasure.hint(state,'forest',catalog),state);
  state=finish(choose(visit(reload(state),2)));
  assert.equal(view(state).visit.reward.finderAdded,1);
  assert.equal(Treasure.hint(state,'forest',catalog),state,'stale map hints cannot pre-open a later clue during a visit');
  const next=view(back(state));assert.equal(next.clue.index,0);assert.equal(next.clue.hintShown,false);
});

test('malformed or stale visits fail closed and never create finder progress',()=>{
  const start=visit(fresh(),2),active=start.active;
  for(const bad of [
    {...active,world:'unknown'}, {...active,place:4}, {...active,clue:0},
    {...active,serial:start.serial+1}, {...active,optionOrder:['0','0','1']},
    {...active,optionOrder:['0','1','secret']}, {...active,optionOrder:['0','1']},
    {...active,attempts:2}, {...active,outcome:'direct'},
    {...active,stage:'explanation',outcome:'direct',selected:'1'},
    {...active,stage:'reward',outcome:'direct',selected:'0',reward:{kind:'treasure',finderAdded:1,newItem:true}}
  ]){
    const raw={...start,active:bad},clean=Treasure.sanitize(raw,catalog);
    assert.equal(clean.active,null);assert.equal(view(clean).finderTotal,0);
    assert.equal(Treasure.finish(raw,start.serial,catalog),raw);
  }
  for(const index of [-1,4,1.2,'2'])assert.equal(visit(start,index),start);
  const newer=visit(back(start),0);
  for(const method of ['answer','explain','finish','back']){
    const result=method==='answer'?Treasure.answer(newer,start.serial,'0',catalog):Treasure[method](newer,start.serial,catalog);
    assert.equal(result,newer,method);
  }
  const dirty={version:1,serial:0,worlds:{unknown:{found:[0,1,2,3]},forest:{found:[0,3],visited:[0,3,99],smallFinds:[1,3],hints:[2,2,-1]}}};
  const clean=Treasure.sanitize(dirty,catalog);
  assert.deepEqual(clean.worlds,{forest:{found:[],visited:[0,3],smallFinds:[3],hints:[2]}});
  assert.equal(view(clean).finderTotal,0);
});

test('transition methods preserve caller state and invalid catalog entries cannot open tasks',()=>{
  let state=fresh();
  for(const transition of [s=>Treasure.hint(s,'forest',catalog),s=>visit(s,2),s=>choose(s,false),
    s=>choose(s),s=>finish(s),s=>back(s)]){
    const before=JSON.stringify(state),next=transition(state);
    assert.equal(JSON.stringify(state),before);state=next;
  }
  const broken=clone(Data);broken.DATA.forest[0].description='';
  const invalid=Treasure.catalog(broken,A,Story,missions);
  assert.ok(invalid.errors.includes('forest:0'));assert.equal(invalid.worlds.forest,undefined);
  assert.equal(Treasure.visit(state,'forest',0,invalid),state);
  const duplicate=clone(Data);duplicate.DATA.space[1].clue=duplicate.DATA.space[0].clue;
  assert.ok(Treasure.catalog(duplicate,A,Story,missions).errors.includes('space:duplicates'));
  const missingHelp=clone(Data);missingHelp.DATA.forest[0].lookFor=['bara en sak'];
  const incomplete=Treasure.catalog(missingHelp,A,Story,missions);
  assert.ok(incomplete.errors.includes('forest:0'));assert.equal(incomplete.worlds.forest,undefined);
});

test('letter reveals only finds, persists, and never rewards a wrong destination',()=>{
 let state=fresh();assert.equal(view(state).letter.fragments.length,0);
 state=finish(choose(visit(state,0)));assert.equal(view(state).letter.fragments.length,0);
 assert.equal(view(state).finderTotal,0);
 state=finish(choose(visit(back(state),2)));assert.deepEqual(view(state).letter.fragments,Data.LETTER_FRAGMENTS.forest.slice(0,1));
 state=reload(state);assert.equal(view(state).letter.fragments.length,1);
 for(const idx of Treasure.ORDER.slice(1))state=finish(choose(visit(back(state),idx)));
 assert.deepEqual(view(state).letter.fragments,Data.LETTER_FRAGMENTS.forest);
 assert.equal(view(state).finderTotal,4);
 assert.deepEqual(view(reload(state)).letter,view(state).letter);
});

test('mysteries require three clues, explain wrong places, save progress and never add finder points',()=>{
  let state=fresh(),first=view(state);
  assert.equal(first.mystery.available,false);
  assert.equal(Treasure.mysteryReveal(state,'forest',catalog),state);
  assert.equal(Treasure.mysteryGuess(state,'forest',2,catalog),state);
  state=finish(choose(visit(state,2)));
  assert.equal(view(state).count,1);
  state=back(state);
  let mystery=view(state).mystery;
  assert.equal(mystery.available,true);assert.equal(mystery.revealed,1);
  assert.equal(mystery.clues.length,1);
  assert.equal(Treasure.mysteryGuess(state,'forest',2,catalog),state);
  state=Treasure.mysteryReveal(state,'forest',catalog);
  state=Treasure.mysteryReveal(state,'forest',catalog);
  mystery=view(state).mystery;
  assert.equal(mystery.clues.length,3);
  assert.equal(Treasure.mysteryReveal(state,'forest',catalog),state);
  state=Treasure.mysteryGuess(state,'forest',0,catalog);
  assert.equal(view(state).mystery.solved,false);
  assert.match(view(state).mystery.feedback,/skylt/);
  assert.equal(Treasure.mysteryGuess(state,'forest',0,catalog),state);
  state=reload(state);
  assert.deepEqual(view(state).mystery.attempted,[0]);
  state=Treasure.mysteryGuess(state,'forest',2,catalog);
  assert.equal(view(state).mystery.solved,true);
  assert.match(view(state).mystery.feedback,/trädet|träd/);
  assert.equal(view(state).finderTotal,1);
  assert.equal(Treasure.mysteryGuess(state,'forest',1,catalog),state);
  assert.deepEqual(view(reload(state)).mystery,view(state).mystery);
});

test('mystery answers cannot be changed while an ordinary visit is active',()=>{
  let state=finish(choose(visit(fresh(),2)));
  assert.equal(Treasure.mysteryReveal(state,'forest',catalog),state);
  assert.equal(Treasure.mysteryGuess(state,'forest',0,catalog),state);
  state=back(state);
  state=Treasure.mysteryReveal(state,'forest',catalog);
  state=visit(state,1);
  assert.equal(Treasure.mysteryReveal(state,'forest',catalog),state);
  assert.equal(Treasure.mysteryGuess(state,'forest',0,catalog),state);
});
