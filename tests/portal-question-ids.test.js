'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Data=require('../public/js/mission-portals-data');
const Portals=require('../public/js/mission-portals');

test('every authored adventure step has a unique stable question ID',()=>{
  const ids=new Set();
  for(const story of Data.STORIES){
    for(const [i,step] of story.stages.entries()){
      assert.equal(step.questionId,'portal-'+story.id+'-'+String(i+1).padStart(2,'0'));
      assert.ok(!ids.has(step.questionId),step.questionId);
      ids.add(step.questionId);
    }
  }
  assert.equal(ids.size,156);
  assert.deepEqual(Portals.catalog(Data).errors,[]);
});
test('duplicate question ID cannot enter the published portal catalog',()=>{
  const clone=structuredClone(Data.STORIES);
  clone[0].stages[1].questionId=clone[0].stages[0].questionId;
  assert.notDeepEqual(Portals.catalog({STORIES:clone}).errors,[]);
});
test('old step-index progress and collectible data remain compatible',()=>{
  const content=Portals.catalog(Data),id='detective';
  const stage=content.stories[id].stages[0];
  const progress=Portals.choose({},id,stage.answer,content);
  const next=Portals.next(progress,id,content);
  const saved=Portals.sanitize(next,content);
  assert.equal(saved[id].step,1);
  assert.equal(Portals.model(saved,id,content).current.stage.title,
    content.stories[id].stages[1].title);
  assert.equal(saved[id].rev,1);
});
