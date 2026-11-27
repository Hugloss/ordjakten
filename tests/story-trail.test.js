'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../public/js/engine'),D=require('../public/js/adaptive');
const B=require('../public/js/reading-check'),L=require('../public/js/learning-map');
const F=require('../public/js/focus-practice');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const surprises=require('../public/data/surprises.json');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../public/data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;
const NOW=1780000000000;
const record=contexts.wordContexts.find(r=>E.getPool(bank,curation,'medium').some(w=>w.id===r.id)&&
  [...r.distractors,...(r.readingDistractors||[])].some(id=>contexts.wordContexts.some(c=>c.id===id)));
const id=record.id,word=bank.words.find(w=>w.id===id);
const add=(memory,index,lane,outcome,time=NOW)=>D.recordContext(memory,contexts,id,index,
  record.scenes[index].text,lane,outcome,time);
const info=memory=>D.contextSummary(record,memory);
const memory=progress=>({catalog:contexts,progress});
const settings={mode:'train',difficulty:'medium',topic:'words',count:5,adaptivePractice:true,
  contextMix:true,expressionTask:'mix',practiceGoal:'focus'};
function round(progress,options={},reviews={}){
  return E.generateRound(bank,curation,{...settings,...options},{},()=>.43,expressions,missions,
    reviews,NOW,contexts,{},D,{}, {},progress);
}

test('every authored word has three distinct versioned story identities',()=>{
  const keys=contexts.wordContexts.flatMap(r=>r.scenes.map(s=>r.id+':'+D.sceneKey(s)));
  assert.equal(keys.length,contexts.wordContexts.length*3);
  assert.equal(new Set(keys).size,keys.length);
  assert.ok(keys.every(key=>/^sv-\d{4,}:scene-[0-9a-f]{16}$/.test(key)));
});

test('story preference cannot override Aha novelty or previously credited evidence',()=>{
  const question=E.makeContextQuestion(word,bank,contexts,()=>.3,0);
  const readingProgress=B.recordProgress({},id,'context','first',NOW,'context:1');
  let offered;
  const check=B.makeCheck(question,{bank,contexts,surprises,missions,readingProgress,random:()=>.2,
    selectScene:(_record,available)=>{offered=available;return 1;}});
  assert.deepEqual(offered,[2]);
  assert.equal(check.sceneIndex,2);
  assert.equal(check.evidence,'context:2');
  assert.equal(check.options.find(option=>option.correct).label,record.scenes[2].text);
});

test('shared Aha recording updates the story trail without awarding main-answer credit',()=>{
  const app=fs.readFileSync(path.resolve(__dirname,'../public/js/app.js'),'utf8');
  const fn=app.slice(app.indexOf('  function recordAhaWithFeedback('),app.indexOf('  function saveAhaOutcome('));
  const history={readingProgress:{},contextProgress:{}};
  const scope={history,contexts,B,D,Date:{now:()=>NOW},observePracticeFeedback:()=>{}};
  vm.runInNewContext(fn+'\nrecordAhaWithFeedback('+JSON.stringify(id)+',"context","first","context:2");',scope);
  assert.equal(info(history.contextProgress).tried,1);
  assert.equal(info(history.contextProgress).mainTried,0);
  assert.equal(info(history.contextProgress).correct,0);
  assert.equal(info(history.contextProgress).scenes[2].lastAha,'first');
  const before=JSON.stringify(history.contextProgress);
  vm.runInNewContext('recordAhaWithFeedback('+JSON.stringify(id)+',"context","guided","context:1",{recordStory:false});',scope);
  assert.equal(JSON.stringify(history.contextProgress),before,'exam feedback does not update detailed stories');
});

test('repeated success on one story never becomes coverage of several stories',()=>{
  let progress=add({},0,'main','right');
  progress=add(progress,0,'main','right',NOW+1);
  progress=add(progress,0,'main','right',NOW+2);
  assert.equal(info(progress).tried,1);
  assert.equal(info(progress).correct,1);
  assert.equal(progress[id][D.sceneKey(record.scenes[0])].mainRight,3);
  assert.equal(D.contextPriority(id,memory(progress)),1);
  assert.equal(D.contextOrder(record,progress,{random:()=>.2})[2],0);
  assert.deepEqual(new Set(D.contextOrder(record,progress,{random:()=>.2}).slice(0,2)),new Set([1,2]));
});

test('Aha and main observations are independent, even for the same scene',()=>{
  let progress=add({},0,'aha','first');
  progress=add(progress,1,'aha','guided',NOW+1);
  assert.equal(info(progress).tried,2);
  assert.equal(info(progress).mainTried,0);
  assert.equal(info(progress).correct,0);
  assert.equal(info(progress).needs,1);
  assert.equal(D.contextPriority(id,memory(progress)),3);
  assert.equal(D.contextOrder(record,progress,{random:()=>.2})[0],2);
  progress=add(progress,1,'main','right',NOW+2);
  assert.equal(info(progress).needs,0);
  assert.equal(info(progress).correct,1);
  progress=add(progress,1,'aha','retry',NOW+3);
  assert.equal(info(progress).needs,1,'a later supported Aha remains a useful signal');
  assert.equal(info(progress).correct,1,'Aha does not rewrite the main verdict');
  progress=add(progress,1,'main','wrong',NOW+4);
  assert.equal(info(progress).correct,0);
  assert.equal(info(progress).needs,1);
});

test('changed stories lose detail evidence; reordering preserves it, legacy is not guessed',()=>{
  const progress=add({},0,'main','right');
  const copy=structuredClone(contexts);
  const edited=copy.wordContexts.find(r=>r.id===id);
  edited.scenes.reverse();
  let clean=D.sanitizeContextProgress(progress,copy);
  assert.equal(D.contextSummary(edited,clean).scenes[2].lastMain,'right');
  edited.scenes[2].text+=' En ny detalj.';
  clean=D.sanitizeContextProgress(progress,copy);
  assert.equal(D.contextSummary(edited,clean).tried,0);
  assert.deepEqual(Object.keys(D.sanitizeContextProgress({[id]:{lastScene:0}},contexts)),[]);
  assert.equal(E.sanitizeHistory({contextProgress:progress}).contextProgress,progress);
  assert.deepEqual(E.sanitizeHistory({}).contextProgress,{});
});

test('invalid source identity and malformed counts cannot create false scene evidence',()=>{
  const progress=add({},0,'main','right');
  assert.equal(D.recordContext(progress,contexts,id,1,record.scenes[0].text,'main','right'),progress);
  assert.equal(D.recordContext(progress,contexts,id,0,record.scenes[0].text,'main','unanswered'),progress);
  const key=D.sceneKey(record.scenes[0]);
  const corrupt={...progress,unknown:{'scene-bad':{mainRight:10,lastMain:'right'}},
    [id]:{[key]:{mainRight:0,lastMain:'right',mainWrong:-1,ahaFirst:0,lastAha:'first'},
      'scene-ffffffffffffffff':{mainRight:999,lastMain:'right'}}};
  assert.equal(info(D.sanitizeContextProgress(corrupt,contexts)).tried,0);
});

test('focus selects a genuinely new story after earlier context success and Aha support',()=>{
  let progress=add({},0,'main','right');
  progress=add(progress,1,'aha','guided',NOW+1);
  const qs=round(progress);
  assert.equal(qs.length,1);
  assert.equal(qs[0].id,id);
  assert.equal(qs[0].taskType,'context');
  assert.equal(qs[0].contextIndex,2);
  assert.throws(()=>round(progress,{}, {[id]:{streak:1,dueAt:NOW+3600000}}),/Inget behöver/);
  const fresh=round(progress,{practiceGoal:'discover'});
  assert.ok(fresh.every(q=>q.id!==id));
  const after=add(add(progress,1,'main','right',NOW+2),2,'main','right',NOW+3);
  assert.equal(info(after).correct,3);
  assert.equal(D.contextPriority(id,memory(after)),0);
  assert.throws(()=>round(after),/Inget behöver/);
});

test('test, exam and disabled adaptive mixed training ignore detailed scene history',()=>{
  const progress=add({},0,'main','wrong');
  for(const options of [{mode:'test'},{difficulty:'exam'},{adaptivePractice:false,practiceGoal:'mixed'}]){
    assert.deepEqual(round(progress,options),round({},options));
  }
});

test('Aha selects a different authored scene and exposes exact identity only for a context check',()=>{
  const question=E.makeContextQuestion(word,bank,contexts,()=>.3,0);
  const progress=add(add({},0,'main','right'),1,'aha','first');
  const check=B.makeCheck(question,{bank,contexts,surprises,missions,random:()=>.2,
    selectScene:(r,available)=>D.contextOrder(r,progress,{purpose:'aha',
      exclude:r.scenes.map((_,i)=>i).filter(i=>!available.includes(i)),random:()=>.2})[0]});
  assert.equal(check.source,'context');
  assert.equal(check.sceneIndex,2);
  assert.equal(check.options.find(o=>o.correct).label,record.scenes[2].text);
  assert.ok(check.options.every(o=>o.label!==question.stem));
  const phrase=E.makeExpressionQuestion(expressions.expressions[0],'medium',()=>.3,'meaning',missions);
  assert.equal(B.makeCheck(phrase,{bank,contexts,surprises,missions}).sceneIndex,undefined);
});

test('focused story practice uses all three curated scenes, new ones first',()=>{
  const progress=add({},0,'main','right');
  const plan=F.create(id,'context',bank,curation,expressions,missions,contexts,E,{},()=>.3,
    null,null,{},null,null,{},r=>D.contextOrder(r,progress,{random:()=>.2}));
  assert.equal(plan.questions.length,3);
  assert.deepEqual(new Set(plan.questions.map(q=>q.contextIndex)),new Set([0,1,2]));
  assert.notEqual(plan.questions[0].contextIndex,0);
  assert.equal(plan.questions[2].contextIndex,0);
});

test('learning trail recognizes a completed scene even after abandoning a round, not Aha mastery',()=>{
  const item=L.catalog(bank,expressions,contexts).find(w=>w.id===id);
  const supported=add({},0,'aha','guided');
  const a=L.detail(item,{}, {}, {}, {},NOW,info(supported));
  assert.equal(a.seen,true);
  assert.equal(a.application,false);
  assert.equal(a.needsPractice,true);
  assert.equal(a.revisit,false);
  const independent=add(supported,1,'main','right',NOW+1);
  const b=L.detail(item,{}, {}, {}, {},NOW,info(independent));
  assert.equal(b.application,true);
  assert.equal(b.revisit,false);
});
