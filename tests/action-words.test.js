'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const A=require('../public/js/action-words'),E=require('../public/js/engine'),D=require('../public/js/adaptive'),R=require('../public/js/review'),B=require('../public/js/reading-check'),P=require('../public/js/question-play');
const bank=require('../public/data/ordbank.json'),contexts=require('../public/data/word-contexts.json');
const settings={mode:'train',difficulty:'medium',timerMode:'off',adventure:'forest'};
const q=(id,picture=false)=>{const w=bank.words.find(w=>w.id===id);return {id,kind:'word',word:w.word,definition:w.definition,example:w.example,picture,options:[{label:w.definition,correct:true},{label:'Annan definition',correct:false}]};};
test('fifteen authored actions use existing words and exactly one keyed choice',()=>{
 assert.deepEqual(A.validate(bank),[]);assert.equal(A.DATA.length,15);
 for(const row of A.DATA){
   const original=q(row.word),out=A.adapt(settings,original,()=>.4);
   assert.equal(out.id,original.id);assert.equal(out.word,original.word);assert.equal(out.definition,original.definition);
   assert.equal(out.taskType,'action');assert.equal(out.options.length,4);
   assert.equal(out.options.filter(o=>o.correct).length,1);
   assert.equal(out.options.find(o=>o.correct).id,row.answer);
   assert.ok(out.action.prompt&&out.action.target&&out.action.why);assert.equal(original.options.length,2);
 }
});
test('recognition skill, review scheduling and separate Aha checks remain compatible',()=>{
 for(const row of A.DATA)for(const picture of [true,false]){
   const original=q(row.word,picture),adapted=A.adapt(settings,original,()=>.8);
   assert.equal(D.task(adapted),D.task(original));assert.equal(R.questionVariant(adapted),R.questionVariant(original));
   assert.equal(adapted.contextIndex,undefined);
   assert.deepEqual(D.record({},adapted,'right',1000),D.record({},original,'right',1000));
   assert.deepEqual(R.record({},adapted,'wrong',1000),R.record({},original,'wrong',1000));
   const check=B.makeCheck(adapted,{bank,contexts,random:()=>.4});
   assert.ok(check);assert.equal(check.options.length,3);assert.equal(check.options.filter(o=>o.correct).length,1);
   if(check.source==='meaning')assert.ok(check.options.every(o=>bank.words.some(w=>w.definition===o.label)));
 }
});
test('tests, timers, targeted context/review rounds and other adaptive variants remain unchanged',()=>{
 const original=q('sv-0025');
 for(const overrides of [{mode:'test'},{timerMode:'total'},{timerMode:'per'},{difficulty:'exam'},{reviewOnly:true},{contextOnly:true}])
   assert.equal(A.adapt({...settings,...overrides},original),original);
 for(const taskType of ['context','reverse','order','sentence','contrast']){
   const other={...original,taskType};assert.equal(A.adapt(settings,other),other);
 }
 const unknown=q('sv-0001');assert.equal(A.adapt(settings,unknown),unknown);
 assert.equal(A.adapt(settings,null),null);
});
test('round preserves IDs, count, order and ordinary first-answer scoring',()=>{
 const original=[q('sv-0025'),q('sv-0001'),q('sv-0018',true)],before=JSON.stringify(original);
 const round=A.adaptRound(settings,original,()=>.2);
 assert.deepEqual(round.map(r=>r.id),original.map(r=>r.id));assert.equal(round[1],original[1]);assert.equal(JSON.stringify(original),before);
 assert.equal(E.score(Object.fromEntries(round.map(r=>[r.id,'right'])),round.length).right,3);
});
test('strategy clues and presentation never identify an answer',()=>{
 for(const row of A.DATA){
   const a=A.adapt(settings,q(row.word),()=>.4),b={...a,options:a.options.map((o,i)=>({...o,correct:i===0}))};
   assert.deepEqual(P.plan(settings,a),P.plan(settings,b));assert.equal(P.plan(settings,a).enabled,true);
   assert.ok(!P.plan(settings,a).hint.includes(a.options.find(o=>o.correct).label));
 }
});

test('ten reversible experiments are bounded, deterministic and independent of knowledge outcomes',()=>{
 assert.equal(Object.keys(A.EXPERIMENTS).length,10);
 for(const id of Object.keys(A.EXPERIMENTS)){
   const low=A.experiment(id,0),mid=A.experiment(id,50),high=A.experiment(id,100);
   assert.equal(low.value,0);assert.equal(high.value,100);
   assert.equal(A.experiment(id,-10).value,0);assert.equal(A.experiment(id,150).value,100);
   assert.equal(A.experiment(id,NaN).value,0);
   assert.ok(low.label&&low.instruction&&low.message!==mid.message&&mid.message!==high.message);
   assert.deepEqual(A.experiment(id,50),mid);
 }
 assert.equal(A.experiment('unknown',50),null);
});
test('stretch, magnet, rotation, plant and yarn have distinct reversible visual responses',()=>{
 const a=A.experiment('stretch',0),b=A.experiment('stretch',100);
 assert.ok(a.stretch<b.stretch);
 assert.equal(A.experiment('magnet',50).ringX,0);
 assert.equal(A.experiment('magnet',100).ringX,-75);
 assert.equal(A.experiment('whirl',100).rotation,360);
 assert.equal(A.experiment('wilt',100).wiltAngle,0);
 assert.ok(A.experiment('wilt',0).wiltAngle>0);
 assert.deepEqual([0,50,100].map(n=>A.experiment('tangle',n).tangle),[0,1,2]);
});
test('pointer position maps to the accessible range with safe edge handling',()=>{
 const rect={left:100,width:200};
 assert.deepEqual([0,100,150,200,300,500].map(x=>A.pointerValue(rect,x)),[0,0,25,50,100,100]);
 assert.equal(A.pointerValue({left:0,width:0},10),null);
 assert.equal(A.pointerValue(rect,NaN),null);
 assert.equal(A.pointerValue(null,10),null);
});

test('zero displacement is canonical positive zero, including the real Node strict assertion',()=>{
 assert.equal(A.experiment('magnet',0).ringX,0);
 assert.equal(A.experiment('magnet',60).ringX,0);
 assert.equal(A.experiment('mirror',0).mirrorImageX,0);
});
test('mirrored motion stays symmetric and the ball hits the floor before rising again',()=>{
 for(let n=0;n<=100;n++){
   const a=A.experiment('mirror',n);
   assert.equal(a.mirrorX+a.mirrorImageX,0);
   assert.ok(a.bounceY>=0&&a.bounceY<=106);
 }
 assert.equal(A.experiment('bounce',0).bounceY,0);
 assert.equal(A.experiment('bounce',25).bounceY,106);
 assert.ok(A.experiment('bounce',42).bounceY<A.experiment('bounce',25).bounceY);
 assert.equal(A.experiment('bounce',60).bounceY,106);
 assert.ok(A.experiment('bounce',73).bounceY<106);
 assert.equal(A.experiment('bounce',100).bounceY,106);
});
test('slippery and rough surfaces diverge, pores fill, and paper stars attach in four stages',()=>{
 let lastIce=0,lastMat=0,lastWater=0;
 for(let n=0;n<=100;n++){
   const a=A.experiment('slide',n);
   assert.ok(a.iceX>=lastIce&&a.matX>=lastMat&&a.water>=lastWater);
   assert.equal(a.sticky,Math.floor(n/25));
   assert.ok(a.iceX<=194&&a.matX<=76&&a.water<=1);
   lastIce=a.iceX;lastMat=a.matX;lastWater=a.water;
 }
 const end=A.experiment('slide',100);
 assert.ok(end.iceX>end.matX);
 assert.equal(A.experiment('sponge',100).water,1);
 assert.deepEqual([0,25,50,75,100].map(n=>A.experiment('sticky',n).sticky),[0,1,2,3,4]);
});
