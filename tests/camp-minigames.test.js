'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Mini=require('../public/js/camp-minigames');
const bank=require('../public/data/ordbank.json');
test('three games contain four authored levels each, using actual unique wordbank IDs and valid answers',()=>{
  const words=new Set(bank.words.map(w=>w.id));
  assert.deepEqual(Object.keys(Mini.GAMES),['dragon','lab','treasure']);
  for(const [game,levels] of Object.entries(Mini.LEVELS)){
    assert.equal(levels.length,4);
    for(const level of levels){
      assert.ok(level.words.every(id=>words.has(id)));
      assert.equal(level.words.length,game==='lab'?2:1);
      assert.equal(new Set(level.options.map(o=>o.id)).size,level.options.length);
      assert.equal(new Set(level.answers).size,game==='lab'?2:1);
      assert.ok(level.answers.every(id=>level.options.some(o=>o.id===id)));
      assert.equal(level.options.length,game==='dragon'?3:game==='lab'?4:9);
      assert.ok(level.prompt&&level.hint&&level.why&&level.result);
    }
  }
});
test('dragon accepts only the matching picnic item and offers an unlimited gentle retry',()=>{
  const s=Mini.start('dragon'),original=JSON.stringify(s);
  let wrong=Mini.choose(s,'soup');
  assert.equal(wrong.stage,'play');assert.ok(wrong.feedback);
  for(let i=0;i<100;i++)wrong=Mini.choose(wrong,'yogurt');
  assert.deepEqual(wrong.selected,[]);
  const done=Mini.choose(wrong,'crispbread');
  assert.equal(done.stage,'solved');assert.deepEqual(done.selected,['crispbread']);
  assert.equal(done.helped,false);assert.equal(JSON.stringify(s),original);
});
test('lab requires two distinct objects, supports deselection and accepts correct pair in either order',()=>{
  const s=Mini.start('lab'),one=Mini.choose(s,'feather');
  assert.equal(Mini.mix(one),one);
  const pair=Mini.choose(one,'stone');
  assert.equal(Mini.model(pair).canMix,true);
  assert.deepEqual(Mini.choose(pair,'gem').selected,['feather','stone']);
  const hint=Mini.mix(pair);
  assert.equal(hint.stage,'play');assert.ok(hint.feedback);
  const fixed=Mini.choose(Mini.choose(hint,'stone'),'gem');
  assert.equal(Mini.mix(fixed).stage,'solved');
  assert.equal(Mini.mix(Mini.choose(Mini.choose(s,'gem'),'feather')).stage,'solved');
});
test('all four treasure maps have a single target in the stated direction from the landmark',()=>{
  const directions=[['tent',-3],['tree',1],['moon',3],['lamp',-1]];
  for(const [i,level] of Mini.LEVELS.treasure.entries()){
    const [landmark,offset]=directions[i],anchor=level.options.findIndex(x=>x.id===landmark);
    const target=level.options.findIndex(x=>x.id===level.answers[0]);
    assert.equal(target,anchor+offset);
    if(Math.abs(offset)===1)assert.equal(Math.floor(target/3),Math.floor(anchor/3));
    else assert.equal(target%3,anchor%3);
  }
});
test('each of the twelve levels supports a correct solution, explicit advance and finite ending',()=>{
  for(const game of Object.keys(Mini.GAMES)){
    let state=Mini.start(game);
    for(const level of Mini.LEVELS[game]){
      assert.equal(Mini.next(state),state);
      for(const id of level.answers)state=Mini.choose(state,id);
      if(game==='lab')state=Mini.mix(state);
      assert.equal(state.stage,'solved');assert.ok(Mini.model(state).feedback);
      assert.equal(Mini.choose(state,level.answers[0]),state);
      state=Mini.next(state);
    }
    assert.equal(state.stage,'finished');
    assert.equal(Mini.next(state),state);
    assert.equal(Mini.help(state),state);
    assert.equal(Mini.model(state).total,4);
  }
});
test('help is always optional and leads to an explained solution without a score or penalty',()=>{
  for(const game of Object.keys(Mini.GAMES)){
    const s=Mini.start(game),assisted=Mini.help(s);
    assert.equal(assisted.stage,'solved');assert.equal(assisted.helped,true);
    assert.deepEqual(assisted.selected,Mini.LEVELS[game][0].answers);
    assert.ok(Mini.model(assisted).feedback);
    assert.equal(Mini.next(assisted).helped,false);
    assert.ok(!('score' in assisted));
  }
});
test('invalid actions, unknown games and missing state fail safely',()=>{
  assert.equal(Mini.start('__proto__'),null);
  assert.equal(Mini.start('missing'),null);
  assert.equal(Mini.model(null),null);
  assert.equal(Mini.choose(null,'x'),null);
  assert.equal(Mini.mix(null),null);
  assert.equal(Mini.help(null),null);
  assert.equal(Mini.next(null),null);
  const s=Mini.start('treasure');
  assert.equal(Mini.choose(s,'invalid'),s);
  assert.equal(Mini.mix(s),s);
});
