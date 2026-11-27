'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Living=require('../public/js/camp-living'),Theatre=require('../public/js/camp-theatre'),
  Camp=require('../public/js/adventure-camp'),Playful=require('../public/js/playful'),E=require('../public/js/engine');
const model=(s,scene='glade',id='fox')=>Living.model(s,scene,Playful.companion(id));
const items=Camp.STARTER.concat([{id:'mark-forest-0',name:'Stiglövet',emoji:'🍃'}]);
const row={scene:'glade',hero:'owl',prop:'free-lantern',plot:'mystery'};
test('every scenery offers six immediately accessible touch objects and the chosen companion',()=>{
  for(const scene of Object.keys(Camp.SCENES))for(const id of Object.keys(Playful.COMPANIONS)){
    const m=model(Living.start(),scene,id);
    assert.deepEqual(m.objects.map(o=>o.id),Living.IDS);
    assert.equal(m.objects[5].emoji,Playful.companion(id).emoji);
    assert.deepEqual(m.notes,[]);
    assert.ok(m.scenery.sky&&m.scenery.edge);
  }
});
test('lantern and egg toggle independently with visible states and meaningful labels',()=>{
  const start=Living.start(),lit=Living.react(start,'lantern'),egg=Living.react(lit,'egg');
  assert.equal(model(lit).objects[1].pressed,true);
  assert.equal(model(egg).objects[2].emoji,'🦕');
  assert.equal(model(egg).objects[1].pressed,true);
  const dark=Living.react(egg,'lantern'),closed=Living.react(dark,'egg');
  assert.equal(model(closed).objects[1].pressed,false);
  assert.equal(model(closed).objects[2].pressed,false);
  assert.deepEqual(start,Living.start());
});
test('all six actions give immediate feedback and bounded, replayable state',()=>{
  let s=Living.start();
  for(const id of Living.IDS){
    const one=Living.react(s,id),two=Living.react(one,id);
    assert.notEqual(model(one).message,model(two).message);
    assert.equal(two.phases[id],0);
    assert.equal(one.last,id);
    assert.equal(model(one).notes.length,id==='music'?3:0);
    s=two;
  }
  assert.equal(Living.react(s,'__proto__'),s);
  assert.deepEqual(s.phases,Living.start().phases);
});
test('music alternates finite ascending and descending notes and never plays on other actions',()=>{
  const up=Living.react(Living.start(),'music'),down=Living.react(up,'music');
  assert.deepEqual(model(up).notes,[523.25,659.25,783.99]);
  assert.deepEqual(model(down).notes,[783.99,659.25,523.25]);
  assert.deepEqual(model(Living.react(down,'rocket')).notes,[]);
});
test('favourite stories restore the exact panels even after the camp layout changes',()=>{
  let s=Theatre.start({scene:'garden',slots:['mark-forest-0']},items,'fox');
  assert.equal(Theatre.record(s),null);
  s=Theatre.choose(Theatre.choose(Theatre.choose(s,'dragon'),'mark-forest-0'),'friend');
  const saved=Theatre.record(s),again=Theatre.restore(saved,items);
  assert.deepEqual(Theatre.model(again).panels,Theatre.model(s).panels);
  assert.deepEqual(Theatre.record(again),saved);
  assert.equal(Theatre.restore(saved,Camp.STARTER),null);
  assert.equal(Theatre.restore({...saved,plot:'bad'},items),null);
});
test('history reload accepts only owned story choices, removes duplicates and strips unknown fields',()=>{
  const earned={...row,prop:'mark-forest-0'},unearned={...row,prop:'mark-forest-1'};
  const raw=[{...row,freeText:'do not store'},row,earned,unearned,{...row,hero:'__proto__'},{...row,scene:'bad'},{...row,plot:'bad'},null];
  const clean=E.sanitizeHistory({storyProgress:{forest:1},campStories:raw,results:[]});
  assert.deepEqual(clean.campStories,[row,earned]);
  assert.deepEqual(E.sanitizeHistory(JSON.parse(JSON.stringify(clean))).campStories,[row,earned]);
  assert.deepEqual(E.sanitizeHistory(null).campStories,[]);
  assert.deepEqual(E.sanitizeHistory({campStories:raw}).campStories,[row]);
  assert.deepEqual(clean.results,[]);
});
test('book has 24 slots, preserves existing favourites at capacity and permits explicit removal',()=>{
  const rows=[];
  for(const scene of Object.keys(Camp.SCENES))for(const hero of Object.keys(Playful.COMPANIONS))
    for(const prop of Camp.STARTER)rows.push({scene,hero,prop:prop.id,plot:'show'});
  const full=E.sanitizeCampStories(rows,{});
  assert.equal(full.length,24);
  assert.deepEqual(E.sanitizeCampStories([...full,rows[24]],{}),full);
  assert.deepEqual(E.sanitizeCampStories([...full.slice(1),rows[24]],{}),rows.slice(1,25));
  assert.equal(new Set(full.map(E.campStoryKey)).size,24);
});
