'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('../public/js/contrast');
const H=require('../public/js/confusions');
const E=require('../public/js/engine');
const bank=JSON.parse(fs.readFileSync(path.join(__dirname,'../public/data/ordbank.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../public/data/contrasts.json'),'utf8'));
const pair=data.pairs[0];
const questions=C.create(pair.left,data,bank,()=>.35).questions;
const target=id=>questions.find(q=>q.id===id);
const choose=(q,right)=>q.options.find(opt=>opt.correct===right);
const add=(progress,q,right,at)=>H.record(progress,q,choose(q,right),data,at);

test('records selected distractor ID and direction, not free-form answer text',()=>{
  let state=add({},target(pair.left),false,1000);
  state=add(state,target(pair.right),true,1001);
  assert.deepEqual(Object.keys(state),[pair.id]);
  assert.equal(state[pair.id].wrong,1);
  assert.equal(state[pair.id].right,1);
  assert.deepEqual(state[pair.id].recent.map(e=>[e.target,e.chosen]),[
    [pair.left,pair.right],[pair.right,pair.right]]);
  assert.deepEqual(H.insight(pair,state[pair.id]).directions,{leftToRight:1,rightToLeft:0});
  assert.doesNotMatch(JSON.stringify(state),/Grumlig|Genomskinlig|definition|situation/i);
});

test('repeated confusion gets priority, and varied correct contexts reduce it',()=>{
  let state={};
  state=add(state,target(pair.left),false,1000);
  state=add(state,target(pair.left),false,1001);
  assert.equal(H.insight(pair,state[pair.id]).recurring,true);
  assert.equal(H.recommendations(data,state,2)[0].pair.id,pair.id);
  assert.equal(C.choose(data,{},()=>.99,{starterOnly:true,confusions:state,confusionLib:H}).id,pair.id);
  // Vary BOTH the correct word and the environment, not one memorized scene.
  for(const [i,q] of questions.slice(0,3).entries())state=add(state,q,true,1010+i);
  const insight=H.insight(pair,state[pair.id]);
  assert.equal(insight.recovered,true);
  assert.equal(insight.needsPractice,false);
  assert.equal(H.recommendations(data,state,1).length,0);
  assert.equal(H.summary(data,state).recovered,1);
});

test('a single mistake can lead to a gentle suggestion without claiming recurring confusion',()=>{
  const state=add({},target(pair.right),false,1000);
  const info=H.insight(pair,state[pair.id]);
  assert.equal(info.recurring,false);
  assert.equal(info.needsPractice,true);
  assert.equal(H.summary(data,state).recurring,0);
  assert.equal(H.summary(data,state).practice,1);
});

test('does not record ordinary questions, invalid choices, or forged pair identifiers',()=>{
  const good=target(pair.left);
  assert.equal(H.record({}, {...good,taskType:'meaning'},choose(good,false),data,1000)?.[pair.id],undefined);
  assert.equal(H.record({}, {...good,contrastPair:'js-99'},choose(good,false),data,1000)?.[pair.id],undefined);
  assert.equal(H.record({}, good, {id:'sv-9999'},data,1000)?.[pair.id],undefined);
  assert.equal(H.record({}, good, {id:pair.left},data,NaN)?.[pair.id],undefined);
  assert.equal(H.record({}, good, {id:pair.left},data,1000)?.[pair.id],undefined);
});

test('history migration keeps valid progress, rejects forged IDs, and limits events',()=>{
  let state={};
  for(let i=0;i<30;i++)state=add(state,target(pair.left),i%3===0,1000+i);
  assert.equal(state[pair.id].attempts,30);
  assert.equal(state[pair.id].recent.length,12);
  const old=E.sanitizeHistory({confusionProgress:state});
  assert.deepEqual(H.sanitize(old.confusionProgress,data)[pair.id],state[pair.id]);
  const corrupt=structuredClone(state);
  corrupt['js-unknown']={right:999,recent:[{target:pair.left,chosen:pair.right,at:1}]};
  corrupt[pair.id].recent.push({target:'sv-9999',chosen:pair.left,at:1});
  corrupt[pair.id].recent.push({target:pair.left,chosen:pair.right,at:-50});
  const cleaned=H.sanitize(corrupt,data);
  assert.equal(Object.keys(cleaned).length,1);
  assert.equal(cleaned[pair.id].recent.length,12);
  assert.equal(H.sanitize(null,data)[pair.id],undefined);
});

test('ordinary exam never produces comparisons or confusion evidence',()=>{
  const q={taskType:'meaning',id:pair.left,contrastPair:pair.id,
    options:[{id:pair.left,correct:true},{id:pair.right,correct:false}]};
  const state=H.record({},q,q.options[1],data,1000);
  assert.equal(H.summary(data,state).tried,0);
  const cfg=E.sanitizeSettings({...E.DEFAULT_STATE.settings,difficulty:'exam',mode:'test'});
  assert.equal(cfg.mode,'test');
});
