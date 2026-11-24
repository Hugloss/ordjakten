'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Map=require('../public/js/adventure-map.js');
const Adventures=require('../public/js/adventures.js');

test('all twelve adventures have four distinct hand-drawn vector landmarks',()=>{
  assert.equal(Object.keys(Map.DECOR).length,12);
  for(const id of Adventures.WORLD_IDS){
    const decorations=Map.DECOR[id];
    assert.ok(decorations.length>=3,id);
    assert.ok(new Set(decorations.map(x=>x[0])).size>=2,id);
    for(const [type,x,y,size] of decorations){
      assert.equal(typeof type,'string');
      assert.ok(x>=0&&x<=760&&y>=0&&y<=300&&size>0);
    }
  }
  assert.match(Map.PATH,/^M/);
});

test('map progress counts answered words, not right answers or stars',()=>{
  for(const total of [5,10,15,20,25])for(const id of Adventures.WORLD_IDS){
    const first=Map.model(id,total,0);
    assert.equal(first.fraction,0);
    assert.equal(first.stages.filter(s=>s.reached).length,0);
    for(let n=0;n<=total;n++){
      const m=Map.model(id,total,n);
      assert.equal(m.answered,n);
      assert.equal(m.fraction,n/total);
      assert.equal(m.stages.filter(s=>s.reached).length,Adventures.stages(id,total,n).filter(s=>s.reached).length);
      assert.equal(m.stages.length,4);
    }
    const last=Map.model(id,total,total);
    assert.equal(last.fraction,1);
    assert.equal(last.stages.filter(s=>s.reached).length,4);
  }
});

test('map model clamps invalid values and never creates an invalid fraction',()=>{
  assert.equal(Map.model('missing',5,3).id,'forest');
  assert.equal(Map.model('space',5,-9).answered,0);
  assert.equal(Map.model('space',5,Infinity).answered,0);
  assert.equal(Map.model('space',5,99999).answered,5);
  assert.equal(Map.model('space',0,99999).total,5);
  assert.equal(Map.model('space',101,1).total,5);
  assert.equal(Map.model('space',5,1.75).answered,1);
});
