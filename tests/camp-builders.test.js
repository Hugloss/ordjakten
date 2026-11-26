'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const B=require('../public/js/camp-builders');
const bank=require('../public/data/ordbank.json');
test('three construction games have twelve valid authored steps and distinct visual pieces',()=>{
  const words=new Set(bank.words.map(w=>w.id));
  assert.deepEqual(Object.keys(B.GAMES),['world','paint','robot']);
  for(const [game,g] of Object.entries(B.GAMES)){
    assert.equal(g.tasks.length,4);
    assert.equal(g.slots.length,g.base.length);
    assert.equal(new Set(g.tasks.map(t=>t.slot)).size,4);
    const pieces=g.tasks.flatMap(t=>t.options);
    assert.equal(new Set(pieces.map(p=>p.id)).size,12);
    for(const t of g.tasks){
      assert.ok(t.slot>=0&&t.slot<g.slots.length);
      assert.ok(t.words.length&&t.words.every(id=>words.has(id)));
      assert.equal(t.options.length,3);
      assert.ok(t.options.some(p=>p.id===t.answer));
      assert.ok(t.prompt&&t.hint&&t.why);
      assert.ok(t.options.every(p=>p.emoji||['circle','square','triangle','long'].includes(p.shape)));
      assert.ok(t.options.every(p=>['solid','dots','stripes'].includes(p.pattern)));
    }
  }
});
test('village requires both the appropriate object and location, without overwriting earlier work',()=>{
  const s=B.start('world'),original=JSON.stringify(s);
  const selected=B.choose(s,'bridge');
  assert.equal(B.place(selected,0).stage,'play');
  assert.deepEqual(B.place(selected,0).board,s.board);
  assert.equal(B.place(B.choose(s,'rock'),4).stage,'play');
  const bridge=B.place(selected,4);
  assert.equal(bridge.board[4],'bridge');
  assert.equal(bridge.stage,'solved');
  const house=B.place(B.choose(B.next(bridge),'house'),1);
  assert.equal(house.board[1],'house');
  assert.equal(house.board[4],'bridge');
  assert.equal(JSON.stringify(s),original);
});
test('painting and robot parts are real reversible previews until explicitly committed',()=>{
  for(const game of ['paint','robot']){
    const s=B.start(game),t=B.GAMES[game].tasks[0],wrong=t.options.find(p=>p.id!==t.answer);
    const preview=B.choose(s,wrong.id);
    assert.equal(B.model(preview).cells[t.slot].piece.id,wrong.id);
    assert.equal(B.model(preview).cells[t.slot].preview,true);
    assert.equal(preview.board[t.slot],null);
    assert.equal(B.confirm(preview).stage,'play');
    const revised=B.choose(preview,t.answer);
    const done=B.confirm(revised);
    assert.equal(done.stage,'solved');
    assert.equal(done.board[t.slot],t.answer);
    assert.equal(B.model(done).cells[t.slot].preview,false);
    assert.equal(B.place(revised,t.slot),revised);
  }
});
test('all twelve steps produce a cumulative finished board and do not auto-advance',()=>{
  for(const [game,g] of Object.entries(B.GAMES)){
    let state=B.start(game),filled=0;
    for(const t of g.tasks){
      assert.equal(B.next(state),state);
      state=B.choose(state,t.answer);
      state=g.kind==='place'?B.place(state,t.slot):B.confirm(state);
      assert.equal(state.stage,'solved');
      assert.equal(state.board.filter(Boolean).length,++filled);
      assert.ok(B.model(state).feedback);
      state=B.next(state);
    }
    assert.equal(state.stage,'finished');
    assert.equal(B.model(state).cells.filter(c=>c.piece).length,4);
    assert.equal(B.next(state),state);
    assert.equal(B.help(state),state);
  }
});
test('help completes the exact current step, keeps previous construction and has no score',()=>{
  let s=B.start('robot');
  s=B.help(s);assert.equal(s.helped,true);assert.equal(s.board[0],'round-head');
  s=B.help(B.next(s));assert.equal(s.board[0],'round-head');assert.equal(s.board[1],'square-body');
  assert.ok(!('score' in s));
});
test('finished builds allow voluntary free play and reject incompatible paint/robot parts',()=>{
  for(const [game,g] of Object.entries(B.GAMES)){
    let s=B.start(game);
    for(const t of g.tasks)s=B.next(B.help(s));
    const finished=JSON.stringify(s),free=B.free(s),t=g.tasks[0],alternate=t.options.find(p=>p.id!==t.answer);
    assert.equal(free.stage,'free');
    assert.equal(B.model(free).options.length,12);
    const selected=B.choose(free,alternate.id);
    const changed=B.place(selected,t.slot);
    assert.equal(changed.board[t.slot],alternate.id);
    if(g.kind==='preview'){
      assert.deepEqual(B.place(selected,g.tasks[1].slot).board,free.board);
    }else assert.equal(B.place(selected,0).board[0],alternate.id);
    assert.equal(JSON.stringify(s),finished);
    assert.equal(B.next(changed),changed);
  }
});
test('invalid, out-of-order and missing actions fail closed',()=>{
  assert.equal(B.start('__proto__'),null);assert.equal(B.start('missing'),null);
  assert.equal(B.model(null),null);assert.equal(B.choose(null,'x'),null);
  assert.equal(B.place(null,0),null);assert.equal(B.confirm(null),null);assert.equal(B.help(null),null);
  const s=B.start('world');
  assert.equal(B.choose(s,'unknown'),s);assert.equal(B.place(s,4),s);
  assert.equal(B.confirm(s),s);assert.equal(B.free(s),s);
  assert.equal(B.place(B.choose(s,'bridge'),99).stage,'play');
});
