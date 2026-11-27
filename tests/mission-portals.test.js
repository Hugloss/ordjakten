'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Data=require('../public/js/mission-portals-data');
const Portals=require('../public/js/mission-portals');
const Engine=require('../public/js/engine');
const content=Portals.catalog(Data);
const fresh=()=>Portals.sanitize(null,content);
const view=(raw,id=null)=>Portals.model(raw,id,content);
const clone=x=>JSON.parse(JSON.stringify(x));

test('thirty-two original adventures offer 96 distinct, complete clue steps',()=>{
  assert.deepEqual(content.errors,[]);
  assert.equal(content.ids.length,32);
  const titles=new Set(),stories=new Set();
  for(const id of content.ids){
    const row=content.stories[id];
    assert.equal(row.stages.length,3,id);
    assert.match(id,/^[a-z][a-z0-9-]*$/);
    assert.ok(!titles.has(row.title));titles.add(row.title);
    assert.ok(!stories.has(row.intro));stories.add(row.intro);
    assert.ok(row.ending.length>25);assert.ok(row.keepsake.name.length>=8);
    assert.ok(Object.isFrozen(row.stages));
    for(const [index,stage] of row.stages.entries()){
      assert.ok(stage.title&&stage.scene&&stage.why,id+':'+index);
      assert.equal(stage.clues.length,2);assert.equal(stage.choices.length,3);
      assert.equal(stage.wrong.length,3);
      assert.equal(new Set(stage.clues).size,2);
      assert.equal(new Set(stage.choices).size,3);
      assert.ok(Number.isInteger(stage.answer)&&stage.answer>=0&&stage.answer<=2);
      assert.equal(stage.wrong[stage.answer],null);
      assert.ok(Object.isFrozen(stage.clues));
      assert.ok(Object.isFrozen(stage.choices));
      assert.ok(Object.isFrozen(stage.wrong));
      assert.ok(stage.wrong.filter(Boolean).every(reason=>reason.length>=15));
    }
  }
  assert.equal(titles.size,32);
});

test('all adventures open immediately and hidden solutions are not included in early models',()=>{
  const state=fresh(),list=view(state);
  assert.equal(list.doneCount,0);assert.equal(list.entries.length,32);
  assert.ok(list.entries.every(item=>item.count===0&&!item.done&&item.keepsake===null));
  for(const id of content.ids){
    const m=view(state,id).current,original=content.stories[id];
    assert.equal(m.step,0);assert.equal(m.stage.choices.length,3);
    assert.equal(m.stage.feedback,null);assert.equal(m.stage.hint,false);
    assert.ok(!Object.hasOwn(m.stage,'answer'));
    assert.ok(!Object.hasOwn(m.stage,'wrongReasons'));
    assert.ok(!JSON.stringify(m).includes(original.stages[0].why));
    assert.ok(!JSON.stringify(m).includes(original.stages[1].scene));
    assert.ok(!JSON.stringify(m).includes(original.ending));
    assert.equal(Portals.choose(state,id,-1,content),state);
    assert.equal(Portals.choose(state,id,3,content),state);
    assert.equal(Portals.choose(state,id,'0',content),state);
  }
});

test('wrong choices give specific help, retries are optional, and completing one stage is idempotent',()=>{
  let state=fresh(),id='agents',task=content.stories[id].stages[0],before=clone(state);
  const wrong=(task.answer+1)%3;
  state=Portals.choose(state,id,wrong,content);
  let stage=view(state,id).current.stage;
  assert.equal(stage.solved,false);assert.deepEqual(stage.wrong,[wrong]);
  assert.equal(stage.feedback,task.wrong[wrong]);
  assert.equal(stage.choices.find(row=>row.index===wrong).tried,true);
  assert.equal(Portals.choose(state,id,wrong,content),state);
  const prior=clone(state);
  state=Portals.hint(state,id,content);
  assert.equal(view(state,id).current.stage.hint,true);
  assert.equal(Portals.hint(state,id,content),state);
  assert.equal(state[id].step,0);
  assert.equal(Portals.next(state,id,content),state,'cannot skip an unfinished stage');
  state=Portals.choose(state,id,task.answer,content);
  stage=view(state,id).current.stage;
  assert.equal(stage.solved,true);
  assert.equal(stage.feedback,task.why);
  assert.deepEqual(stage.choices,[]);
  assert.equal(Portals.choose(state,id,task.answer,content),state);
  state=Portals.next(state,id,content);
  assert.equal(state[id].step,1);
  assert.equal(view(state,id).current.stage.feedback,null);
  assert.equal(view(state,id).current.stage.hint,false);
  assert.deepEqual(view(state,id).current.stage.wrong,[]);
  assert.deepEqual(view(before).entries.map(x=>x.count),Array(32).fill(0));
  assert.notDeepEqual(state,prior);
});

test('all 96 stages can be completed, earning exactly one keepsake per adventure',()=>{
  let state=fresh();
  for(const id of content.ids){
    for(let step=0;step<3;step++){
      const task=content.stories[id].stages[step];
      state=Portals.choose(state,id,task.answer,content);
      assert.equal(view(state,id).current.step,step);
      assert.equal(view(state,id).current.stage.feedback,task.why);
      state=Portals.next(state,id,content);
      assert.equal(Portals.next(state,id,content),state,'duplicate advancement cannot farm progress');
    }
    const finished=view(state,id).current;
    assert.equal(finished.done,true);
    assert.equal(finished.count,3);
    assert.deepEqual(finished.keepsake,content.stories[id].keepsake);
    assert.equal(finished.stage,null);
    assert.equal(Portals.choose(state,id,0,content),state,'completed adventures are immutable');
    assert.deepEqual(Portals.sanitize(clone(state),content),state);
  }
  assert.equal(view(state).doneCount,32);
  assert.equal(view(state).entries.filter(row=>row.done&&row.keepsake).length,32);
});

test('malformed imported progress is rejected per story without erasing other discoveries',()=>{
  let state=Portals.choose(fresh(),'detective',content.stories.detective.stages[0].answer,content);
  state=Portals.next(state,'detective',content);
  const valid=clone(state.detective);
  const defects=[
    {rev:100,step:0,solved:false,wrong:[],hint:false},
    {rev:1,step:-1,solved:false,wrong:[],hint:false},
    {rev:1,step:4,solved:true,wrong:[],hint:false},
    {rev:1,step:0,solved:false,wrong:[0,0],hint:false},
    {rev:1,step:3,solved:false,wrong:[],hint:false},
    {rev:1,step:3,solved:true,wrong:[0],hint:false},
    {rev:1,step:0,solved:false,wrong:['1'],hint:false},
    {rev:1,step:0,solved:false,wrong:[],hint:'yes'},
    {rev:1,step:0,solved:false,wrong:[content.stories.agents.stages[0].answer],hint:false},
  ];
  for(const bad of defects){
    const clean=Portals.sanitize({...state,agents:bad,unknown:{...valid}},content);
    assert.deepEqual(clean.detective,valid);
    assert.ok(!Object.hasOwn(clean,'unknown'));
    assert.ok(!Object.hasOwn(clean,'agents'));
  }
  assert.deepEqual(Portals.sanitize({detective:'oops'},content),{});
  assert.deepEqual(Portals.sanitize(null,content),{});
});

test('the existing history lifecycle preserves only bounded portal progress',()=>{
  const inProgress=Portals.next(Portals.choose(fresh(),'space',0,content),'space',content);
  const before=Engine.sanitizeHistory({settings:{theme:'light'},results:[],discoveryPortals:inProgress});
  const restored=Portals.sanitize(clone(before.discoveryPortals),content);
  assert.deepEqual(restored,inProgress);
  assert.deepEqual(Portals.sanitize(Engine.sanitizeHistory(null).discoveryPortals,content),{});
  assert.ok(!JSON.stringify(restored).includes('scene'));
  assert.deepEqual(Object.keys(restored.space).sort(),['hint','rev','solved','step','wrong']);
});

test('discovery scripts are included before the app, offline, exportable and clearable',()=>{
  const root=path.resolve(__dirname,'../public');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
  for(const file of ['mission-portals-data.js','mission-portals.js','mission-portals-view.js'])
    assert.ok(html.includes('./js/'+file)&&sw.includes('./js/'+file));
  assert.ok(html.indexOf('./js/mission-portals-view.js')<html.indexOf('./js/app.js'));
  assert.ok(html.includes('id="quick-portals"')&&html.includes('id="view-portals"'));
  assert.ok(html.includes('./css/mission-portals.css')&&sw.includes('./css/mission-portals.css'));
  assert.ok(app.includes("data.discoveryPortals=history.discoveryPortals"));
  assert.ok(app.includes("history.discoveryPortals=Portals.sanitize(null,portalContent)"));
  assert.ok(app.includes("history.discoveryPortals=Portals.sanitize(history.discoveryPortals,portalContent)"));
});
