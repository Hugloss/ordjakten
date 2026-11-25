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
