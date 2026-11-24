'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'../public');
const C=require('../public/js/contrast');
const E=require('../public/js/engine');
const F=require('../public/js/focus-practice');
const D=require('../public/js/adaptive');
const L=require('../public/js/learning-map');
const load=(p,k)=>{const w={};vm.runInNewContext(fs.readFileSync(path.join(root,p),'utf8'),{window:w});return w[k];};
const bank=JSON.parse(fs.readFileSync(path.join(root,'data/ordbank.json')));
const data=JSON.parse(fs.readFileSync(path.join(root,'data/contrasts.json')));
const curation=load('data/curation.js','ORDJAKTEN_CURATION');
const expressions=JSON.parse(fs.readFileSync(path.join(root,'data/expressions.json')));
const missions=JSON.parse(fs.readFileSync(path.join(root,'data/missions.json')));
const contexts=JSON.parse(fs.readFileSync(path.join(root,'data/word-contexts.json')));
const make=(id,skill='contrast',progress={},rand=()=>.17)=>F.create(id,skill,bank,curation,expressions,missions,contexts,E,progress,rand,C,data);

test('all authored pairs validate and JS export exactly matches JSON',()=>{
 assert.deepEqual(C.validate(data,bank),[]);
 const js=load('data/contrasts.js','ORDJAKTEN_CONTRASTS');
 assert.deepEqual(JSON.parse(JSON.stringify(js)),data);
 assert.equal(data.pairs.length,12);
 assert.equal(data.pairs.reduce((s,p)=>s+p.scenes.length,0),96);
});
test('each of the 12 pairs produces four balanced, distinct playable stories across environments',()=>{
 for(const pair of data.pairs){
   const plan=C.create(pair.left,data,bank,()=>.26);
   assert.equal(plan.questions.length,4);
   assert.equal(C.findPair(pair.right,data).id,pair.id);
   assert.deepEqual(Object.fromEntries([pair.left,pair.right].map(id=>[id,plan.questions.filter(q=>q.id===id).length])),
      {[pair.left]:2,[pair.right]:2});
   assert.equal(new Set(plan.questions.map(q=>q.stem)).size,4);
   assert.ok(new Set(plan.questions.map(q=>q.contrastContext)).size>=3);
   assert.equal(new Set(plan.questions.map(q=>q.focusKey)).size,4);
   for(const q of plan.questions){
     assert.equal(q.taskType,'contrast');assert.equal(q.kind,'word');
     assert.equal(q.options.length,2);
     assert.equal(q.options.filter(x=>x.correct).length,1);
     assert.equal(new Set(q.options.map(x=>x.label)).size,2);
     assert.ok(q.contextWhy.length>50);
     assert.ok(!q.stem.toLowerCase().includes(q.word.toLowerCase()),'Question leaked the correct word');
     assert.ok(q.options.find(o=>o.correct).label===q.word);
   }
 }
});
test('broken pairs are refused instead of silently trusting bad learning material',()=>{
 const broken=structuredClone(data);broken.pairs[0].scenes[2].target=broken.pairs[0].right;
 assert.match(C.validate(broken,bank).join(';'),/fyra gånger/);
 const leak=structuredClone(data);leak.pairs[0].scenes[0].text+=' Grumlig.';
 assert.match(C.validate(leak,bank).join(';'),/Facit syns/);
 const duplicate=structuredClone(data);duplicate.pairs.push(structuredClone(duplicate.pairs[0]));
 assert.match(C.validate(duplicate,bank).join(';'),/Dubblerat|dubblerade/);
 const missing=structuredClone(data);missing.pairs[0].scenes[0].difference='';
 assert.match(C.validate(missing,bank).join(';'),/Ofullständig/);
});
test('compare is opt-in and available through both word trails, with a balanced four-step plan',()=>{
 for(const pair of data.pairs){
   const left=F.findItem(pair.left,bank,expressions);
   const right=F.findItem(pair.right,bank,expressions);
   assert.ok(F.supported(left,curation,contexts,missions,C,data).includes('contrast'));
   assert.ok(F.supported(right,curation,contexts,missions,C,data).includes('contrast'));
   const plan=make(right.id);
   assert.equal(plan.chosen,'contrast');
   assert.equal(plan.questions.length,4);
   assert.match(plan.pairLabel,/( eller )/);
 }
 assert.ok(!F.supported(F.findItem('sv-0011',bank,expressions),curation,contexts,missions,C,data).includes('contrast'));
 assert.ok(!F.supported(F.findItem('ut-0001',bank,expressions),curation,contexts,missions,C,data).includes('contrast'));
});
test('comparison outcomes are stored as one independent skill and do not claim correct contexts',()=>{
 const left='sv-0044';const q=make(left).questions.find(x=>x.id===left);
 let state=D.record({},q,'wrong',100);
 assert.equal(state[left].skills.contrast.wrong,1);
 assert.ok(!state[left].skills.context);
 state=D.record(state,q,'right',101);
 assert.equal(state[left].skills.contrast.right,1);
 assert.equal(state[left].skills.contrast.streak,1);
 const catalog=L.catalog(bank,expressions,contexts).find(x=>x.id===left);
 const detail=L.detail(catalog,state,{}, {}, {},102);
 assert.equal(detail.application,true);
 assert.match(detail.steps[2].label,/Skilt på två ord/);
 assert.ok(!detail.steps[1].done,'Answering a comparison does not prove recall of a definition');
 assert.ok(detail.skills.some(x=>x.label==='skillnaden mellan ord'));
});
test('recommendation prioritizes a missed comparison, not other fully mastered skills',()=>{
 const id='sv-0044';
 let state=D.record({},make(id,'context').questions[0],'right',100);
 state=D.record(state,make(id,'contrast').questions.find(q=>q.id===id),'wrong',200);
 const item=F.findItem(id,bank,expressions);
 const types=F.supported(item,curation,contexts,missions,C,data);
 assert.equal(F.recommended(item,types,state),'contrast');
 assert.equal(make(id,null,state).chosen,'contrast');
});
test('quickstart is age-appropriate and prioritizes unseen pairs; later chooses a less-practised pair',()=>{
 assert.equal(data.pairs.filter(pair=>pair.starter).length,10);
 for(let i=0;i<100;i++){
   const pair=C.choose(data,{},()=>i/100,{starterOnly:true});
   assert.equal(pair.starter,true);
 }
 assert.equal(C.choose(data,{},()=>.99).id,'js-12');
 const pair=data.pairs[0];const second=data.pairs[1];
 const cards={};
 for(const other of data.pairs.slice(1)){
   cards[other.left]={skills:{contrast:{attempts:2,lastAt:100}}};
   cards[other.right]={skills:{contrast:{attempts:2,lastAt:100}}};
 }
 assert.equal(C.choose(data,cards,()=>.2).id,pair.id);
 cards[pair.left]={skills:{contrast:{attempts:10,lastAt:200}}};
 cards[pair.right]={skills:{contrast:{attempts:10,lastAt:200}}};
 assert.equal(C.choose(data,cards,()=>0).id,second.id);
});
test('ordinary practice and exam rounds do not introduce comparisons or change their options',()=>{
 const defaults=E.sanitizeSettings({...E.DEFAULT_STATE.settings,mode:'test',difficulty:'exam',topic:'words',count:10});
 const round=E.generateRound(bank,curation,defaults,{},()=>.41,expressions);
 assert.equal(round.length,10);
 assert.ok(round.every(q=>q.taskType!=='contrast'&&q.options.length===5));
 const regular=E.generateRound(bank,curation,{...defaults,difficulty:'medium',count:5}, {},()=>.41,expressions);
 assert.ok(regular.every(q=>q.taskType!=='contrast'));
});

test('comparison history survives sanitization without changing the original data format',()=>{
 const q=make('sv-0044').questions.find(q=>q.id==='sv-0044');
 const previous=D.record({},q,'right',150);
 const serialized=JSON.parse(JSON.stringify(previous));
 const restored=D.sanitize(serialized);
 assert.equal(restored['sv-0044'].skills.contrast.attempts,1);
 assert.equal(restored['sv-0044'].skills.contrast.right,1);
 assert.equal(restored['sv-0044'].skills.contrast.lastAt,150);
 assert.deepEqual(Object.keys(restored['sv-0044'].skills),['contrast']);
});

test('curation rejects reused concepts until the planner supports multiple partners',()=>{
 const duplicate=structuredClone(data);
 duplicate.pairs[1].left=duplicate.pairs[0].left;
 assert.match(C.validate(duplicate,bank).join(';'),/flera par/);
});
