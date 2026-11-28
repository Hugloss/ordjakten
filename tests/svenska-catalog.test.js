'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const Registry=require('../public/js/question-platform');
const Catalog=require('../public/js/banks/svenska-catalog');
const Words=require('../public/data/ordbank.json');
const Contexts=require('../public/data/word-contexts.json');
const Contrasts=require('../public/data/contrasts.json');
const Clues=require('../public/data/clue-ladder.json');
const Surprises=require('../public/data/surprises.json');
const Expressions=require('../public/data/expressions.json');
const Missions=require('../public/data/missions.json');
const Portals=require('../public/js/mission-portals-data');
const Treasure=require('../public/js/treasure-hunt-data');
const WorldMissions=require('../public/js/world-missions');
const ActionWords=require('../public/js/action-words');
const sample={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'public/data/curation.js'),'utf8'),sample);
const Curation=sample.window.ORDJAKTEN_CURATION;
const sources={words:Words,contexts:Contexts,curation:Curation,contrasts:Contrasts,clues:Clues,
  surprises:Surprises,expressions:Expressions,missions:Missions,portals:Portals,
  treasure:Treasure,worldMissions:WorldMissions,actionWords:ActionWords};
function create(){const registry=Registry.createRegistry();const bank=Catalog.fromSources(sources);registry.register(bank);return {bank,registry};}
test('one bank-scoped Swedish registry resolves all authored assessment sources without duplicates',()=>{
  const {bank,registry}=create();
  const counts=bank.counts(),pictures=Object.keys(Curation.easy).length;
  assert.deepEqual(counts,{
    meaning:121,reverse:121,context:363,picture:pictures,
    contrast:96,clue:64,bonus:73,action:23,worldMission:48,
    portals:156,places:48,mysteries:12,proofs:12,transfers:12,
    expressions:237,total:1384+pictures
  });
  assert.equal(registry.listQuestionRefs('svenska').length,counts.total);
  assert.equal(new Set(registry.listQuestionRefs('svenska').map(x=>x.id)).size,counts.total);
});
test('every portal answer is resolvable and has the same facit as its canonical story',()=>{
  const {registry}=create();
  for(const story of Portals.STORIES)for(const stage of story.stages){
    const ref={bankId:'svenska',id:stage.questionId,revision:1};
    const q=registry.resolve(ref);
    assert.equal(q.responseSpec.options.length,3);
    assert.deepEqual(q.responseSpec.options.map(o=>o.label),stage.choices);
    for(const [index,choice] of q.responseSpec.options.entries())
      assert.equal(registry.assess(ref,choice.id).status,index===stage.answer?'correct':'incorrect',stage.questionId);
    assert.equal(q.provenance.storyId,story.id);
  }
});
test('each map location, mystery, proof and transfer resolves without affecting collected rewards',()=>{
  const {registry}=create();
  for(const world of Object.keys(Treasure.DATA)){
    const places=Treasure.DATA[world];
    for(const [i,place] of places.entries()){
      const ref={bankId:'svenska',id:place.questionId,revision:1};
      const q=registry.resolve(ref);
      assert.equal(q.responseSpec.options.length,4);
      assert.equal(q.responseSpec.options[i].id,q.assessmentSpec.correctOptionId);
      assert.equal(q.stimulus.includes(place.clue),true);
    }
    for(const [id,correctIndex] of [[Treasure.MYSTERIES[world].questionId,Treasure.MYSTERIES[world].target],
      [Treasure.TRANSFERS[world].questionId,Treasure.TRANSFERS[world].target]]){
      const q=registry.resolve({bankId:'svenska',id,revision:1});
      assert.equal(q.responseSpec.options[correctIndex].id,q.assessmentSpec.correctOptionId);
    }
    assert.equal(registry.resolve({bankId:'svenska',id:'treasure-proof-'+world,revision:1}).responseSpec.options.length,3);
  }
});
test('each contrast, ladder, bonus, action and world mission has an authored answer',()=>{
  const {registry}=create();
  for(const pair of Contrasts.pairs)for(const scene of pair.scenes){
    const q=registry.resolve({bankId:'svenska',id:'contrast-'+scene.id,revision:1});
    assert.equal(q.assessmentSpec.correctOptionId,'word-'+scene.target);
  }
  for(const pair of Clues.pairs)for(const level of pair.levels)for(const scene of level.scenes){
    const q=registry.resolve({bankId:'svenska',id:'clue-'+scene.id,revision:1});
    assert.equal(q.assessmentSpec.correctOptionId,'word-'+scene.target);
  }
  for(const challenge of Surprises.challenges){
    const q=registry.resolve({bankId:'svenska',id:'bonus-'+challenge.id,revision:1});
    assert.equal(q.responseSpec.options.length,challenge.options.length);
  }
  for(const action of ActionWords.DATA){
    const q=registry.resolve({bankId:'svenska',id:'action-'+action.id,revision:1});
    assert.equal(q.assessmentSpec.correctOptionId,'action-'+action.answer);
  }
  for(const [world,rows] of Object.entries(WorldMissions.DATA))for(const row of rows){
    const q=registry.resolve({bankId:'svenska',id:row[4],revision:1});
    assert.equal(q.provenance.legacyConceptId,row[0]);
    assert.equal(q.assessmentSpec.correctOptionId,'mission-option-0');
  }
});
