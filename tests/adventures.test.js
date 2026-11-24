'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const A=require('../public/js/adventures.js');
const E=require('../public/js/engine.js');

test('adventure worlds have exactly four distinct, positive story checkpoints',()=>{
  assert.equal(Object.keys(A.WORLDS).length,12);
  assert.deepEqual(Object.keys(A.WORLDS),E.VALID_ADVENTURES);
  assert.ok(['pirate','ocean','dinosaurs','garden','unicorn','animals','rainbow','horses','music'].every(id=>A.isWorld(id)));
  assert.equal(A.isWorld('unknown'),false);
  for(const id of Object.keys(A.WORLDS)){
    const w=A.world(id);
    assert.ok(w.title.length>4&&w.intro.length>5&&w.ending.length>5);
    assert.ok(['upptack','magi'].includes(w.group));
    assert.ok(w.teaser&&w.description);
    assert.equal(w.stops.length,4);
    assert.equal(new Set(w.stops.map(stop=>stop.name)).size,4);
    assert.ok(w.stops.every(stop=>stop.emoji&&stop.message));
  }
  assert.equal(A.world('invalid'),A.WORLDS.forest);
  assert.equal(Object.values(A.WORLDS).filter(w=>w.group==='upptack').length,6);
  assert.equal(Object.values(A.WORLDS).filter(w=>w.group==='magi').length,6);
});

test('story stages are bounded, monotonic, and finish exactly at requested counts',()=>{
  for(const n of [5,10,15,20,25]){
    for(const id of Object.keys(A.WORLDS)){
      const empty=A.stages(id,n,0);
      const finished=A.stages(id,n,n);
      assert.equal(empty.length,4);
      assert.ok(empty.every(stop=>!stop.reached));
      assert.ok(finished.every(stop=>stop.reached));
      assert.equal(finished.at(-1).threshold,n);
      assert.ok(empty.every((stop,i)=>i===0||stop.threshold>empty[i-1].threshold));
      for(let i=1;i<=n;i++){
        const newly=A.newlyReached(id,n,i-1,i);
        assert.ok(newly.length<=1,'Milestone must appear only at a genuine boundary');
        assert.equal(A.stages(id,n,i).filter(s=>s.reached).length,
          A.stages(id,n,i-1).filter(s=>s.reached).length+newly.length);
      }
    }
  }
  assert.deepEqual(A.stages('forest',0,0),[]);
});

test('adventure preference round trips and old user history migrates without score changes',()=>{
  for(const id of Object.keys(A.WORLDS)){
    const options=E.sanitizeSettings({adventure:id,count:25});
    assert.equal(options.adventure,id);
    assert.equal(options.count,25);
  }
  assert.equal(E.sanitizeSettings({adventure:'oops'}).adventure,'forest');
  const old=E.sanitizeHistory({settings:{difficulty:'medium'},results:[{finishedAt:100,right:3,wrong:2,unanswered:0,total:5}],mistakes:{'sv-0001':2}});
  assert.equal(old.settings.adventure,'forest');
  assert.equal(old.results[0].adventure,null);
  assert.equal(old.results[0].right,3);
  assert.equal(old.mistakes['sv-0001'],2);
  const newer=E.sanitizeHistory({settings:{adventure:'space'},results:[{finishedAt:200,right:5,total:5,adventure:'space'}]});
  assert.equal(newer.results[0].adventure,'space');
  for(const id of A.WORLD_IDS){
    const history=E.sanitizeHistory({settings:{adventure:id},results:[{finishedAt:300,right:1,total:5,adventure:id}]});
    assert.equal(history.settings.adventure,id);
    assert.equal(history.results[0].adventure,id);
  }
});


test('adventure themes never change chosen words, answer choices or score',()=>{
  const fs=require('node:fs');
  const vm=require('node:vm');
  const path=require('node:path');
  const data=require('../public/data/ordbank.json');
  const ctx={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/data/curation.js'),'utf8'),ctx);
  const curated=ctx.window.ORDJAKTEN_CURATION;
  for(const difficulty of ['easy','medium','hard','exam']){
    const baseline=E.generateRound(data,curated,{difficulty,count:10,adventure:'forest'}, {},()=>.375);
    for(const adventure of A.WORLD_IDS){
      const actual=E.generateRound(data,curated,{difficulty,count:10,adventure}, {},()=>.375);
      assert.deepEqual(actual,baseline,`${adventure} must not affect ${difficulty}`);
    }
    const answers=Object.fromEntries(baseline.slice(0,3).map(q=>[q.id,'right']));
    assert.deepEqual(E.score(answers,baseline.length),{right:3,wrong:0,unanswered:7,percent:30});
  }
});
