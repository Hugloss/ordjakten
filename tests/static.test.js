'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../public');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
test('static site has all assets and Swedish content',()=>{
  const html=read('index.html');
  assert.match(html,/<html lang="sv"/);
  for(const file of ['css/style.css','css/playful.css','css/adventures.css','css/expressions.css','css/comics.css','css/surprises.css','css/missions.css','css/quests.css','css/review.css','css/contexts.css','css/adaptive.css','css/learning-map.css','css/focus-practice.css','css/contrast.css','css/confusions.css','css/clue-ladder.css','css/retention.css','js/adaptive.js','js/learning-map.js','js/focus-practice.js','js/contrast.js','js/confusions.js','js/clue-ladder.js','js/retention.js','js/app.js','js/engine.js','js/playful.js','js/adventures.js','js/adventure-map.js','js/comics.js','js/surprises.js','js/missions.js','js/quests.js','js/review.js','data/comics.js','data/surprises.js','data/missions.js','data/word-contexts.js','data/word-contexts.json','data/contrasts.js','data/contrasts.json','data/clue-ladder.js','data/clue-ladder.json','data/wordbank.js','data/curation.js','data/expressions.js','sw.js','manifest.webmanifest'])assert.ok(fs.statSync(path.join(root,file)).size>0);
});
test('each JavaScript-accessed UI ID exists once in HTML',()=>{
  const html=read('index.html');const js=read('js/app.js');
  const used=[...js.matchAll(/\$\('([a-zA-Z][\w-]+)'\)/g)].map(m=>m[1]);
  const ids=[...html.matchAll(/\bid="([a-zA-Z][\w-]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,'Duplicate UI IDs');
  for(const id of new Set(used))assert.ok(ids.includes(id),`Missing UI ID ${id}`);
});
test('PWA assets use relative URLs suitable for project subpaths',()=>{
  const manifest=JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.start_url,'./');
  assert.equal(manifest.scope,'./');
  assert.match(read('sw.js'),/\.\/index\.html/);
  assert.match(read('sw.js'),/\.\/css\/playful\.css/);
  assert.match(read('sw.js'),/\.\/css\/adventures\.css/);
  assert.match(read('sw.js'),/\.\/css\/expressions\.css/);
  assert.match(read('sw.js'),/\.\/css\/comics\.css/);
  assert.match(read('sw.js'),/\.\/css\/surprises\.css/);
  assert.match(read('sw.js'),/\.\/css\/missions\.css/);
  assert.match(read('sw.js'),/\.\/css\/quests\.css/);
  assert.match(read('sw.js'),/\.\/css\/review\.css/);
  assert.match(read('sw.js'),/\.\/css\/contexts\.css/);
  assert.match(read('sw.js'),/\.\/css\/adaptive\.css/);
  assert.match(read('sw.js'),/\.\/css\/learning-map\.css/);
  assert.match(read('sw.js'),/\.\/css\/focus-practice\.css/);
  assert.match(read('sw.js'),/\.\/css\/contrast\.css/);
  assert.match(read('sw.js'),/\.\/css\/confusions\.css/);
  assert.match(read('sw.js'),/\.\/css\/clue-ladder\.css/);
  assert.match(read('sw.js'),/\.\/css\/retention\.css/);
  assert.match(read('sw.js'),/\.\/js\/clue-ladder\.js/);
  assert.match(read('sw.js'),/\.\/js\/retention\.js/);
  assert.match(read('sw.js'),/\.\/data\/clue-ladder\.js/);
  assert.match(read('sw.js'),/\.\/js\/contrast\.js/);
  assert.match(read('sw.js'),/\.\/js\/confusions\.js/);
  assert.match(read('sw.js'),/\.\/data\/contrasts\.js/);
  assert.match(read('sw.js'),/\.\/js\/learning-map\.js/);
  assert.match(read('sw.js'),/\.\/js\/focus-practice\.js/);
  assert.match(read('sw.js'),/\.\/js\/adaptive\.js/);
  assert.match(read('sw.js'),/\.\/data\/word-contexts\.js/);
  assert.match(read('sw.js'),/\.\/js\/quests\.js/);
  assert.match(read('sw.js'),/\.\/js\/review\.js/);
  assert.match(read('sw.js'),/\.\/js\/missions\.js/);
  assert.match(read('sw.js'),/\.\/data\/missions\.js/);
  assert.match(read('sw.js'),/\.\/js\/surprises\.js/);
  assert.match(read('sw.js'),/\.\/data\/surprises\.js/);
  assert.match(read('sw.js'),/\.\/js\/comics\.js/);
  assert.match(read('sw.js'),/\.\/data\/comics\.js/);
  assert.match(read('sw.js'),/\.\/data\/expressions\.js/);
  assert.match(read('sw.js'),/\.\/js\/playful\.js/);
  assert.match(read('sw.js'),/\.\/js\/adventures\.js/);
  assert.match(read('sw.js'),/\.\/js\/adventure-map\.js/);
});

test('personal Aha round loads before the app and is available offline',()=>{
  const html=read('index.html'),app=read('js/app.js');
  assert.ok(read('js/aha-plan.js').length>0);
  assert.ok(html.indexOf('./js/aha-plan.js')>=0);
  assert.ok(html.indexOf('./js/aha-plan.js')<html.indexOf('./js/app.js'));
  assert.match(read('sw.js'),/\.\/js\/aha-plan\.js/);
  for(const location of ['home','learning']){
    for(const suffix of ['','-start','-note'])assert.ok(html.includes('id="aha-'+location+suffix+'"'));
  }
  const reset=app.slice(app.indexOf("$('clear-history').addEventListener"));
  assert.match(reset,/history\.readingProgress=B\.sanitizeProgress\(null\)/);
});

test('typed retrieval is wired before the app, available offline and included in reset/export',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  assert.ok(read('js/recall.js').length>0);
  assert.ok(html.indexOf('./js/recall.js')>=0&&html.indexOf('./js/recall.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/recall.js'"));
  for(const location of ['home','learning']){
    for(const suffix of ['', '-start','-note'])assert.ok(html.includes('id="recall-'+location+suffix+'"'));
  }
  assert.match(app,/history\.recallProgress=Recall\.sanitize\(null,learningCatalog\)/);
  assert.match(app,/recallProgress:history\.recallProgress/);
  assert.match(html,/<input id="recall-answer"[^>]*autocomplete="off"/);
});

test('workshop is offline and free text never joins a quiz or stored history',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  assert.ok(html.indexOf('./js/workshop.js')>=0&&html.indexOf('./js/workshop.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/workshop.js'"));
  assert.match(html,/<textarea id="workshop-reflection"[^>]*autocomplete="off"/);
  assert.ok(!app.includes("workshop-reflection').value.trim"));
  const block=app.slice(app.indexOf('  function startWorkshop('),app.indexOf('  function getRecallPlan('));
  assert.ok(!block.includes('saveHistory('));
  assert.ok(!block.includes('history.results'));
  assert.ok(block.includes("$('workshop-reflection').value=''"));
});

test('detector loads before the app, is available offline and resets/exports only local observations',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  assert.ok(html.indexOf('./js/detector.js')>=0&&html.indexOf('./js/detector.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/detector.js'"));
  assert.match(app,/history\.detectorProgress=Detector\.sanitize\(null,detectorCatalog\)/);
  assert.match(app,/detectorProgress:history\.detectorProgress/);
  const flow=app.slice(app.indexOf('  function startDetector('),app.indexOf('  function startWorkshop('));
  assert.ok(!flow.includes('history.results'));
  assert.ok(!flow.includes('history.skillProgress='));
  assert.ok(!flow.includes('history.readingProgress='));
});

test('adaptive detector controls and local level history are wired without scored-test changes',()=>{
  const html=read('index.html'),app=read('js/app.js');
  for(const id of ['detector-level','detector-think','detector-clue-check','detector-level-note'])assert.ok(html.includes('id="'+id+'"'));
  assert.match(app,/Detector\.advancedCatalog\(learningCatalog,contrasts,clues\)/);
  assert.match(app,/history\.detectorLevels=Detector\.sanitizeLevels\(null,detectorCatalog\)/);
  assert.match(app,/detectorLevels:history\.detectorLevels/);
  assert.match(app,/Detector\.evaluateQuotes\(task,selected,round\.attempts\)/);
});

test('concept map works offline and stores only separate relation observations',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  assert.ok(html.indexOf('./js/concepts.js')>=0&&html.indexOf('./js/concepts.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/concepts.js'"));
  assert.match(app,/history\.conceptProgress=Concepts\.sanitize\(null,conceptCatalog\.tasks\)/);
  assert.match(app,/conceptProgress:history\.conceptProgress/);
  const flow=app.slice(app.indexOf('  function getConceptPlan('),app.indexOf('  function getDetectorPlan('));
  assert.ok(!flow.includes('history.results'));
  assert.ok(!flow.includes('history.skillProgress='));
  assert.ok(!flow.includes('history.readingProgress='));
  assert.ok(flow.includes('round.previewed=conceptMap.exposed.has(task.groupId)'));
  assert.ok(flow.includes('exposeConceptGroup(task.groupId)'));
  assert.ok(flow.includes('Concepts.outcome(task,id,round.attempts,round.previewed)'));
});

test('word bridges load offline and keep exercise history separate from quizzes',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  assert.ok(html.indexOf('./js/bridges.js')>=0&&html.indexOf('./js/bridges.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/bridges.js'"));
  assert.match(app,/history\.bridgeProgress=Concepts\.sanitize\(null,bridgeCatalog\.tasks\)/);
  assert.match(app,/bridgeProgress:history\.bridgeProgress/);
  const flow=app.slice(app.indexOf('  function getBridgePlan('),app.indexOf('  function renderConceptMap('));
  assert.ok(!flow.includes('history.results'));
  assert.ok(!flow.includes('history.skillProgress='));
  assert.ok(flow.includes('Bridges.evaluate(task,round.selection)===null'));
  assert.ok(flow.includes('round.helped&&result.outcome'));
  assert.ok(flow.includes('conceptMap.exposedWords.has(id)'));
});

test('unified next adventure is available offline with distinct DOM IDs and no new persisted score',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  assert.ok(html.indexOf('./js/next-adventure.js')>=0&&html.indexOf('./js/next-adventure.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/next-adventure.js'"));
  assert.ok(html.includes('id="journey-progress"'));
  assert.ok(html.includes('id="next-journey-progress"'));
  for(const location of ['home','learning'])assert.ok(html.includes('id="next-journey-'+location+'-start"'));
  const flow=app.slice(app.indexOf('  function getJourneyPlan('),app.indexOf('  function getConceptPlan('));
  assert.ok(flow.includes('AhaPlan.plan(')&&flow.includes('Recall.plan(')&&flow.includes('Detector.plan(')&&flow.includes('Concepts.plan(')&&flow.includes('Bridges.plan('));
  assert.ok(flow.includes('Journey.advance(')&&flow.includes('journeyStepFinished(mode)'));
  assert.ok(!flow.includes('saveHistory(')&&!flow.includes('history.results')&&!flow.includes('settings='));
  assert.ok(app.includes('if(journey){journey=null;resetJourneyControls();}'));
  for(const mode of ['focus','aha','recall','workshop','detector','concept','bridge'])assert.ok(app.includes("doneLearningExercise('"+mode+"'"));
});

test('shared memory loads offline before both learning engines and is displayed without separate storage',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  const script=html.indexOf('./js/spaced-memory.js');
  assert.ok(script>=0&&script<html.indexOf('./js/reading-check.js')&&script<html.indexOf('./js/recall.js'));
  assert.ok(worker.includes("'./js/spaced-memory.js'"));
  assert.ok(html.includes('id="memory-learning-note"'));
  assert.ok(html.includes('id="aha-memory-note"')&&html.includes('id="recall-memory-note"'));
  assert.ok(app.includes('B.transferDueAt(')&&app.includes('Recall.dueAt('));
  assert.ok(!app.includes('history.memoryProgress='));
});

test('personal knowledge recommendations are derived, offline and never persisted as a global ability score',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  assert.ok(html.indexOf('./js/knowledge-profile.js')>=0&&html.indexOf('./js/knowledge-profile.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/knowledge-profile.js'"));
  assert.ok(html.includes('id="knowledge-home-note"')&&html.includes('id="knowledge-next-list"'));
  assert.ok(app.includes('decorate:row=>Knowledge.decorate(knowledge,row)'));
  assert.ok(app.includes('step.explanation||Journey.REASONS[step.reason]'));
  assert.ok(app.includes('Knowledge.notes(knowledge,item.id)'));
  assert.ok(!app.includes('history.knowledgeProgress')&&!app.includes('history.knowledgeProfile'));
});

test('practice feedback uses explicit completed tasks, real observations and the existing offline storage lifecycle',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js');
  assert.ok(html.indexOf('./js/practice-feedback.js')>=0&&html.indexOf('./js/practice-feedback.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/practice-feedback.js'"));
  assert.ok(app.includes('adjust:rows=>Feedback.adjust(rows,history.feedbackProgress,feedbackCatalog,now)'));
  assert.ok(app.includes('if(finished)completePracticeFeedback(step)'));
  assert.ok(app.includes("observePracticeFeedback('recall:'+row.id,outcome,now)"));
  assert.ok(app.includes("observePracticeFeedback('concept:'+task.id,outcome,now)"));
  assert.ok(app.includes("observePracticeFeedback('aha:'+id,outcome==='first'?'direct':'supported',now,evidence)"));
  assert.ok(app.includes('feedbackProgress:history.feedbackProgress'));
  assert.ok(app.includes('history.feedbackProgress=Feedback.sanitize(null,feedbackCatalog)'));
  assert.ok(html.includes('id="feedback-learning-summary"'));
});

test('practice balance is local, completion-only and uses the existing feasible journey picker',()=>{
  const html=read('index.html'),app=read('js/app.js'),worker=read('sw.js'),engine=read('js/engine.js');
  assert.ok(html.indexOf('./js/practice-balance.js')>=0&&html.indexOf('./js/practice-balance.js')<html.indexOf('./js/app.js'));
  assert.ok(worker.includes("'./js/practice-balance.js'"));
  assert.ok(app.includes('chooseNext:(rows,steps)=>Balance.pick(rows,history.practiceBalance,steps)'));
  assert.ok(app.includes('Balance.recordCompletion(balance,step,journeyStepFinished(step.mode),recordedJourneySteps)'));
  assert.ok(app.includes('if(finished)completePracticeFeedback(step)'));
  assert.ok(app.includes('practiceBalance:history.practiceBalance'));
  assert.ok(app.includes('history.practiceBalance=Balance.sanitize(null)'));
  assert.ok(engine.includes('practiceBalance'));
  assert.ok(html.includes('id="balance-learning-summary"'));
});
