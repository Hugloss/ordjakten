'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../public/js/engine');
const Stars=require('../public/js/star-collection');
const D=require('../public/js/adaptive');
const R=require('../public/js/review');
const F=require('../public/js/focus-practice');
const B=require('../public/js/reading-check');
const S=require('../public/js/surprises');
const Q=require('../public/js/missions');
const J=require('../public/js/quests');
const ActionWords=require('../public/js/action-words');
const QuestionPlay=require('../public/js/question-play');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const surprises=require('../public/data/surprises.json');
const app=fs.readFileSync(path.resolve(__dirname,'../public/js/app.js'),'utf8');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../public/data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;
const clone=value=>JSON.parse(JSON.stringify(value));
const NOW=Date.now();

function production(start,end){
  const from=app.indexOf(start),to=app.indexOf(end,from);
  assert.ok(from>=0&&to>from,'production function must be present: '+start);
  return app.slice(from,to);
}
function node(){
  const children=new Map();
  return {hidden:false,textContent:'',dataset:{},style:{},children:[],open:false,
    classList:{toggle(){},add(){},remove(){}},setAttribute(){},focus(){},scrollIntoView(){},
    querySelector(selector){if(!children.has(selector))children.set(selector,node());return children.get(selector);},
    querySelectorAll(){return [this.querySelector('button0'),this.querySelector('button1'),this.querySelector('button2')];}};
}
function harness(overrides={}){
  const nodes=new Map(),saved=[],shown=[];
  const $=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
  const context=vm.createContext({E,Stars,D,R,F,B,S,Q,J,ActionWords,QuestionPlay,bank,contexts,expressions,missions,surprises,curation,
    $,game:null,history:E.sanitizeHistory(null),settings:E.sanitizeSettings({timerMode:'off'}),
    document:{documentElement:{dataset:{}}},orderSelection:[],guidedActive:false,
    labels:{medium:'Medel'},topicLabels:{mixed:'Blandat',words:'Ord'},goalLabels:{mixed:'Blanda'},
    saveHistory(){saved.push(clone(context.history));},show(value){shown.push(value);},
    stopReadAloud(){},stopTimer(){},clearBurst(){},clearQuestionPlay(){},
    hideSetupError(){},showSetupError(message){throw new Error(message);},
    renderSetup(){},renderQuestion(){},activateTimer(){},priorReviewErrors:()=>({}),
    renderRewards(){},renderQuestFinale(){},renderFinale(){},renderMysteryFinale(){},renderStoryOptions(){},renderReview(){},renderLearningPreview(){},
    renderMysteryDiscovery(){},renderMission(){},showBurst(){},renderReadingOptions(){},renderStoryTrail(){},
    observePracticeFeedback(){},canReadAloud:false,updateScore(){},advance(){},
    ...overrides});
  vm.runInContext(production('  function awardGameStar(','  function startStarRecovery('),context);
  vm.runInContext(production('  function recordRoundOutcomes(','  function renderQuestFinale('),context);
  return {context,$,saved,shown};
}
function wordQuestion(id='sv-0001',index=0){
  return E.makeContextQuestion(bank.words.find(row=>row.id===id),bank,contexts,()=>.37,index);
}
function gameFor(questions,roundId,extra={}){
  return {settings:E.sanitizeSettings({mode:'train',difficulty:'medium',topic:'mixed',adaptivePractice:false,timerMode:'off'}),
    questions,index:0,answers:{},selected:{},finished:false,feedback:false,deadline:0,streak:0,bestStreak:0,stars:0,
    starRoundId:roundId,starRecovery:false,questId:null,
    readingMetrics:{offered:0,attempted:0,firstTry:0,completed:0,guided:0},...extra};
}

test('the ordinary history JSON boundary retains awarded stars and pending recovery IDs',()=>{
  const questions=[wordQuestion(),wordQuestion('sv-0003')];
  const started=Stars.begin(Stars.sanitize(),questions);
  let collection=Stars.award(started.collection,started.roundId,questions[0].id,'answer').collection;
  collection=Stars.finish(collection,started.roundId).collection;
  const before=E.sanitizeHistory({results:[{finishedAt:NOW,mode:'train',total:2,right:1,wrong:1,unanswered:0}],starCollection:collection});
  const reloaded=E.sanitizeHistory(JSON.parse(JSON.stringify(before)));
  assert.deepEqual(Stars.sanitize(reloaded.starCollection,reloaded.results),collection);
  assert.deepEqual(Stars.summarize(reloaded.starCollection).remaining,['sv-0003']);
  assert.equal(reloaded.results[0].right,1);
});

test('recovery starts only the pending corpus questions in an untimed round with the same collection ledger',()=>{
  const original=[wordQuestion(),wordQuestion('sv-0003'),E.makeExpressionQuestion(expressions.expressions.find(row=>row.id==='ut-0074'),'medium',()=>.3,'sentence',missions)];
  const started=Stars.begin(Stars.sanitize(),original);
  let collection=Stars.award(started.collection,started.roundId,original[0].id,'answer').collection;
  collection=Stars.finish(collection,started.roundId).collection;
  const settings=E.sanitizeSettings({mode:'test',timerMode:'per',timerSeconds:9,difficulty:'exam',count:25});
  const {context,$}=harness({settings,currentTimerSeconds(){throw new Error('Recovery must never read a timer preset');}});
  context.history.starCollection=collection;
  vm.runInContext(production('  function startRound(','  function stopTimer()'),context);
  vm.runInContext('startRound(null,{starRecovery:true})',context);
  const {game}=context;
  assert.deepEqual(clone(game.questions.map(q=>q.id)),['sv-0003','ut-0074']);
  assert.equal(game.starRecovery,true);assert.equal(game.starRoundId,started.roundId);
  assert.equal(context.history.starCollection.serial,started.roundId,'recovery must not create a new collection row');
  assert.equal(game.settings.mode,'train');assert.equal(game.settings.timerMode,'off');assert.equal(game.settings.count,2);
  assert.equal(context.settings.timerMode,'per','the optional timer preference itself need not change');
  assert.equal($('clock-stat').hidden,true);
  const [word,expression]=game.questions;
  assert.equal(word.taskType,'context');
  assert.ok(contexts.wordContexts.find(row=>row.id===word.id).scenes.some(scene=>scene.text===word.stem));
  assert.equal(expression.taskType,'sentence');
  assert.ok(missions.missions.find(row=>row.id===expression.id).contextScenes.some(scene=>scene.prompt===expression.scene));
  for(const question of game.questions)assert.equal(question.options.filter(option=>option.correct).length,1);
  assert.deepEqual(clone(vm.runInContext('makeStarRecoveryQuestions(["sv-0001","sv-0001"])',context)),[]);
  assert.throws(()=>vm.runInContext('makeStarRecoveryQuestions(["sv-9999"])',context),/finns inte kvar/);
});

function ahaHarness(){
  const question=wordQuestion();
  const started=Stars.begin(Stars.sanitize(),[question]);
  const game=gameFor([question],started.roundId,{answers:{[question.id]:'wrong'},feedback:true});
  const check=B.makeCheck(question,{bank,contexts,surprises,missions,random:()=>.37});
  check.attempts=0;
  const result=harness({game,readingCheck:check});
  result.context.history.starCollection=started.collection;
  result.$('reading-check').dataset.complete='false';
  vm.runInContext(production('  function recordAhaWithFeedback(','  function submit('),result.context);
  return {...result,question};
}

test('the actual Aha success fills one missing star while preserving the original answer and separate learning evidence',()=>{
  const {context,$,question,saved}=ahaHarness();
  const firstAnswers=clone(context.game.answers);
  const firstScore=E.score(firstAnswers,1);
  const correct=context.readingCheck.options.findIndex(option=>option.correct);
  vm.runInContext('answerReadingCheck('+correct+')',context);
  assert.equal(Stars.summarize(context.history.starCollection).practised,1);
  assert.equal(context.history.starCollection.total,1);
  assert.deepEqual(clone(context.game.answers),firstAnswers);
  assert.deepEqual(E.score(context.game.answers,1),firstScore);
  assert.equal(context.history.results.length,0);
  assert.deepEqual(Object.keys(context.history.skillProgress),[],'Aha must not fabricate a main skill observation');
  assert.equal(context.history.readingProgress[question.id].transfer.first,1);
  assert.match($('feedback-reward').textContent,/övade|ny chans/);
  assert.equal(saved.at(-1).starCollection.total,1,'the earned star is persisted before the round ends');
  const savedCount=saved.length;
  vm.runInContext('answerReadingCheck('+correct+')',context);
  assert.equal(context.history.starCollection.total,1);assert.equal(saved.length,savedCount);
});

test('rereading and guided Aha feedback preserve pending stars until the child chooses a correct answer',()=>{
  for(const secondOutcome of ['right','wrong']){
    const {context,question}=ahaHarness();
    let wrong=context.readingCheck.options.findIndex(option=>!option.correct);
    vm.runInContext('answerReadingCheck('+wrong+')',context);
    assert.equal(context.history.starCollection.total,0);
    const second=context.readingCheck.options.findIndex(option=>option.correct===(secondOutcome==='right'));
    vm.runInContext('answerReadingCheck('+second+')',context);
    const solved=secondOutcome==='right';
    assert.equal(context.history.starCollection.total,solved?1:0);
    assert.equal(context.history.readingProgress[question.id].transfer.supported,1);
    assert.deepEqual(Stars.summarize(context.history.starCollection).remaining,solved?[]:[question.id]);
    assert.equal(context.game.answers[question.id],'wrong');
    assert.equal(context.game.readingMetrics.guided,solved?0:1);
  }
});

test('finishing recovery records each real attempt once without appending or rewriting the original scored round',()=>{
  const firstQuestion=wordQuestion();
  const started=Stars.begin(Stars.sanitize(),[firstQuestion]);
  const history=E.sanitizeHistory({results:[{finishedAt:NOW-5000,mode:'train',level:'medium',topic:'words',total:1,right:0,wrong:1,unanswered:0}],
    mistakes:{[firstQuestion.id]:1},starCollection:Stars.finish(started.collection,started.roundId).collection});
  history.skillProgress=D.record({},firstQuestion,'wrong',NOW-5000);
  history.reviewProgress=R.record({},firstQuestion,'wrong',NOW-5000);
  const original=clone(history.results);
  const retry=wordQuestion(firstQuestion.id,1);
  const game=gameFor([retry],started.roundId,{starRecovery:true,answers:{[retry.id]:'right'}});
  const {context}=harness({history,game});
  vm.runInContext('awardGameStar("'+retry.id+'","practice")',context);
  vm.runInContext('finishRound(false)',context);
  assert.deepEqual(clone(context.history.results),original);
  assert.equal(context.history.skillProgress[retry.id].skills.context.attempts,2);
  assert.equal(context.history.skillProgress[retry.id].skills.context.right,1);
  assert.equal(context.history.reviewProgress[retry.id].attempts,2);
  assert.equal(context.history.reviewProgress[retry.id].streak,1);
  assert.equal(context.history.mistakes[retry.id],undefined);
  assert.equal(Stars.summarize(context.history.starCollection).complete,true);
  const completed=clone(context.history);
  vm.runInContext('finishRound(false)',context);
  assert.deepEqual(clone(context.history),completed,'a repeated finish event must not add another D/R observation');
});

test('Testa dig reveals no correctness through stars before finish and settles its correct answers exactly once',()=>{
  const questions=[wordQuestion(),wordQuestion('sv-0003')];
  const started=Stars.begin(Stars.sanitize(),questions);
  const game=gameFor(questions,started.roundId);
  game.settings.mode='test';
  const {context,$,saved}=harness({game});
  context.history.starCollection=started.collection;
  $('story-reveal').hidden=true;
  // This isolated scoring test extracts submit() without its composition layer;
  // grading is stubbed here, while the bank's real grading is tested separately.
  context.gradeBankWord=(question,option)=>option.correct?'right':'wrong';
  vm.runInContext(production('  function submit(','  function advance()'),context);
  vm.runInContext('submit('+questions[0].options.findIndex(option=>option.correct)+')',context);
  assert.equal(context.history.starCollection.total,0);assert.equal(context.game.stars,0);
  assert.equal(saved.length,0,'a test answer must not persist a correctness signal through the collection');
  context.game.index=1;
  vm.runInContext('submit('+questions[1].options.findIndex(option=>!option.correct)+')',context);
  assert.equal(context.history.starCollection.total,0);assert.equal(context.history.results.length,0);
  assert.deepEqual(Object.keys(context.history.skillProgress),[]);
  vm.runInContext('finishRound(false)',context);
  assert.equal(context.history.starCollection.total,1);
  assert.equal(context.history.results.length,1);
  assert.equal(context.history.results[0].right,1);assert.equal(context.history.results[0].wrong,1);
  assert.equal(context.history.skillProgress[questions[0].id].skills.context.attempts,1);
  assert.equal(context.history.skillProgress[questions[1].id].skills.context.attempts,1);
  const completed=clone(context.history);
  vm.runInContext('finishRound(false)',context);
  assert.deepEqual(clone(context.history),completed);
});
