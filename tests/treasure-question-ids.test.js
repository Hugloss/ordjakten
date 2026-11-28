'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Treasure=require('../public/js/treasure-hunt-data');
const WorldMissions=require('../public/js/world-missions');
const A=require('../public/js/adventures');
test('48 world missions and 48 treasure clues plus 24 mystery tasks carry stable IDs',()=>{
  const ids=new Set();
  const add=id=>{assert.ok(/^[-a-z0-9]+$/.test(id),id);assert.ok(!ids.has(id),id);ids.add(id)};
  for(const world of A.WORLD_IDS){
    for(const [index,task] of WorldMissions.DATA[world].entries()){
      assert.equal(task[4],'world-mission-'+world+'-'+String(index+1).padStart(2,'0'));
      add(task[4]);
    }
    for(const [index,place] of Treasure.DATA[world].entries()){
      assert.equal(place.questionId,'treasure-place-'+world+'-'+String(index+1).padStart(2,'0'));
      add(place.questionId);
    }
    assert.equal(Treasure.MYSTERIES[world].questionId,'treasure-mystery-'+world);
    assert.equal(Treasure.MYSTERIES[world].proofQuestionId,'treasure-proof-'+world);
    assert.equal(Treasure.TRANSFERS[world].questionId,'treasure-transfer-'+world);
    add(Treasure.MYSTERIES[world].questionId);
    add(Treasure.TRANSFERS[world].questionId);
  }
  assert.equal(ids.size,120);
});
