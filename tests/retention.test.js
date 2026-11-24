'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../public/js/engine');
const U=require('../public/js/retention');
const C=require('../public/js/contrast');
const T=require('../public/js/clue-ladder');
const bank=require('../public/data/ordbank.json');
const contrasts=require('../public/data/contrasts.json');
const clues=require('../public/data/clue-ladder.json');
const data=T.enrich(contrasts,clues);
const DAY=U.DAY;
const allRight=round=>round.questions.map(()=> 'right');
function round(pair,level=1){
 const raw=contrasts.pairs.find(x=>x.id===pair.id);
 const scenes=level===1?raw.scenes:T.getScenes(pair.id,level,clues);
 const candidates=C.planScenes({...raw,scenes}, {},()=>.37);
 const words=new Map(bank.words.map(w=>[w.id,w]));
 return {questions:candidates.map(s=>({
   id:s.target,kind:'word',taskType:'contrast',word:words.get(s.target).word,
   stem:s.text,contrastPair:pair.id,contrastSceneId:s.id,contrastContext:s.context,
   contrastClueLevel:level,options:[pair.left,pair.right].map(id=>({id,label:words.get(id).word,correct:id===s.target}))
 }))};
}
const pair=contrasts.pairs[0];

test('first balanced comparison schedules a gentle next-day return; early repeats cannot advance',()=>{
 const q=round(pair);
 const first=U.recordRound({},q.questions,allRight(q),data,clues,10*DAY);
 assert.equal(first[pair.id].stage,1);assert.equal(first[pair.id].dueAt,11*DAY);
 assert.equal(U.due(first[pair.id],10*DAY),false);
 assert.equal(U.due(first[pair.id],11*DAY),true);
 const early=U.recordRound(first,q.questions,allRight(q),data,clues,10*DAY+5000);
 assert.deepEqual(early,first);
 assert.equal(U.summary(data,first,11*DAY).ready,1);
 assert.equal(U.summary(data,first,10*DAY).waiting,1);
});

test('spaced level-2 and level-3 successes in different scenes strengthen memory across days',()=>{
 let state=U.recordRound({},round(pair,1).questions,allRight(round(pair,1)),data,clues,10*DAY);
 const second=round(pair,2);
 state=U.recordRound(state,second.questions,allRight(second),data,clues,11*DAY);
 assert.equal(state[pair.id].stage,2);assert.equal(state[pair.id].dueAt,14*DAY);
 assert.equal(state[pair.id].lastLevel,2);
 const third=round(pair,3);
 state=U.recordRound(state,third.questions,allRight(third),data,clues,14*DAY);
 assert.equal(state[pair.id].stage,3);assert.equal(state[pair.id].dueAt,21*DAY);
 assert.equal(U.summary(data,state,14*DAY).later,1);
 assert.equal(new Set(state[pair.id].verifiedContexts).size,4);
 assert.equal(U.note(state[pair.id],14*DAY).includes('dagar'),true);
 assert.equal(U.summary(data,state,21*DAY).readyPairs[0].pair.id,pair.id);
});

test('difficult review keeps achievements, reschedules kindly, never grants a fake stage',()=>{
 const first=round(pair);
 const t=50*DAY;
 let state=U.recordRound({},first.questions,allRight(first),data,clues,t);
 const failed=round(pair,2),outcomes=['wrong','wrong','right','right'];
 state=U.recordRound(state,failed.questions,outcomes,data,clues,t+DAY);
 assert.equal(state[pair.id].stage,1);
 assert.equal(state[pair.id].lastScore,2);
 assert.equal(state[pair.id].dueAt,t+2*DAY);
 assert.equal(U.summary(data,state,t+DAY).ready,0);
 const pass=U.recordRound(state,round(pair,1).questions,allRight(round(pair,1)),data,clues,t+2*DAY);
 assert.equal(pass[pair.id].stage,1,'Clear hints alone cannot claim a higher-level inference skill');
});

test('repeating the same stories does not count as transfer even after a day',()=>{
 const a=round(contrasts.pairs[6],1);
 let state=U.recordRound({},a.questions,allRight(a),data,clues,2*DAY);
 const attempts=U.recordRound(state,a.questions,allRight(a),data,clues,3*DAY);
 assert.equal(attempts[contrasts.pairs[6].id].stage,1);
 assert.equal(attempts[contrasts.pairs[6].id].lastScore,4);
 assert.equal(attempts[contrasts.pairs[6].id].dueAt,4*DAY);
});

test('new curated story IDs allow honest return for ordinary comparison pairs',()=>{
 const p=contrasts.pairs[6];
 const a=round(p),seen=new Set(a.questions.map(q=>q.contrastSceneId));
 let state=U.recordRound({},a.questions,allRight(a),data,clues,2*DAY);
 const second=C.create(p.left,contrasts,bank,()=>.37,{});
 // Another balanced four scene set can always be built from the remaining four.
 const b={questions:round(p).questions};
 const alternatives=p.scenes.filter(s=>!seen.has(s.id));
 assert.equal(alternatives.length,4);
 b.questions=alternatives.map(s=>({
   id:s.target,taskType:'contrast',stem:s.text,contrastPair:p.id,
   contrastSceneId:s.id,contrastContext:s.context,contrastClueLevel:1,
   options:[p.left,p.right].map(id=>({id,label:id,correct:id===s.target}))
 }));
 assert.equal(U.validRound(b.questions,allRight(b),data)?.score,4);
 state=U.recordRound(state,b.questions,allRight(b),data,clues,3*DAY);
 assert.equal(state[p.id].stage,2);
 assert.equal(second.questions.length,4);
});

test('forged scenes, unbalanced pairs, wrong answers, tests cannot create spaced evidence',()=>{
 const q=round(pair),good=allRight(q);
 const fake=structuredClone(q.questions);fake[0].stem='A different story';
 assert.equal(U.recordRound({},fake,good,data,clues,10*DAY)['js-01'],undefined);
 const duplicate=structuredClone(q.questions);duplicate[0]=duplicate[1];
 assert.equal(U.recordRound({},duplicate,good,data,clues,10*DAY)['js-01'],undefined);
 const testQuestion=structuredClone(q.questions);testQuestion.forEach(x=>{x.taskType='meaning'});
 assert.equal(U.recordRound({},testQuestion,good,data,clues,10*DAY)['js-01'],undefined);
 const allWrong=U.recordRound({},q.questions,q.questions.map(()=>'wrong'),data,clues,10*DAY);
 assert.equal(allWrong[pair.id].stage,0);
 assert.equal(allWrong[pair.id].dueAt,null);
});

test('legacy history retains scores and stage data survives sanitizers; reset removes it',()=>{
 const raw=E.sanitizeHistory({results:[{finishedAt:5000,right:4,total:5}],
  settings:{theme:'dark'},mistakes:{'sv-0044':2}});
 assert.deepEqual(raw.retentionProgress,{});
 const q=round(pair);
 const progress=U.recordRound({},q.questions,allRight(q),data,clues,10*DAY);
 const state=E.sanitizeHistory({...raw,retentionProgress:JSON.parse(JSON.stringify(progress))});
 assert.equal(state.results[0].right,4);
 assert.equal(U.sanitize(state.retentionProgress,data)[pair.id].stage,1);
 assert.equal(state.mistakes['sv-0044'],2);
 assert.equal(Object.keys(U.sanitize(null,data)).length,0);
 const contaminated={...progress,evil:{stage:3},'js-02':{stage:3,dueAt:-1,lastAt:4}};
 assert.equal(U.sanitize(contaminated,data).evil,undefined);
 assert.equal(U.sanitize(contaminated,data)['js-02'],undefined);
});

test('does not reward accelerated same-day sessions and no daily login is required',()=>{
 const p=contrasts.pairs[5];const q=round(p);
 const start=U.recordRound({},q.questions,allRight(q),data,clues,20*DAY);
 const next=U.recordRound(start,q.questions,allRight(q),data,clues,20*DAY+DAY/2);
 assert.deepEqual(next,start);
 assert.equal(U.summary(data,start,20*DAY+10*DAY).ready,1,'Late returns remain possible');
 assert.equal(U.requiredLevel(p,3,clues),1);
 assert.equal(U.requiredLevel(pair,3,clues),3);
});
