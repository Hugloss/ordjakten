'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'../public');
const T=require('../public/js/clue-ladder');
const C=require('../public/js/contrast');
const H=require('../public/js/confusions');
const E=require('../public/js/engine');
const F=require('../public/js/focus-practice');
const bank=require('../public/data/ordbank.json');
const contrasts=require('../public/data/contrasts.json');
const clues=require('../public/data/clue-ladder.json');
const expressions=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const contexts=require('../public/data/word-contexts.json');
function getJS(name){const win={};vm.runInNewContext(fs.readFileSync(path.join(root,name),'utf8'),{window:win});return win.ORDJAKTEN_CLUES;}
const enriched=T.enrich(contrasts,clues);
const pair=contrasts.pairs[0];
const compare=(progress={},history={})=>C.create(pair.left,contrasts,bank,()=>.37,history,T,clues,progress);
const mark=(round,rights)=>rights.map((v)=>v?'right':'wrong');
const allRight=round=>round.questions.map(()=> 'right');
function saveAnswers(history,round,values){
  let next=history;
  round.questions.forEach((q,i)=>{const selected=q.options.find(o=>o.correct===(values[i]==='right'));next=H.record(next,q,selected,enriched,1000+i);});
  return next;
}

test('64 hand-written deeper clues cover four word pairs with checked balance and unspoiled questions',()=>{
  assert.deepEqual(T.validate(clues,contrasts,bank),[]);
  assert.deepEqual(JSON.parse(JSON.stringify(getJS('data/clue-ladder.js'))),clues);
  assert.equal(clues.pairs.length,4);
  assert.equal(clues.pairs.reduce((n,p)=>n+p.levels.reduce((m,l)=>m+l.scenes.length,0),0),64);
  for(const p of clues.pairs)for(const tier of p.levels){
    assert.equal(tier.scenes.length,8);
    for(const target of [C.findPair(p.id,contrasts)?.left, C.findPair(p.id,contrasts)?.right].filter(Boolean)){
      assert.equal(tier.scenes.filter(scene=>scene.target===target).length,4);
      assert.equal(new Set(tier.scenes.filter(scene=>scene.target===target).map(s=>s.context)).size,4);
    }
  }
});

test('level one advances to inference after a full balanced session, not after repeated clicks',()=>{
  const round=compare();
  assert.equal(round.clueLevel,1);
  assert.equal(round.questions.filter(q=>q.contrastClueLevel===1).length,4);
  const data=T.recordRound({},round.questions,allRight(round),contrasts,clues);
  assert.equal(data[pair.id].level,2);
  assert.equal(data[pair.id].reached,2);
  assert.equal(data[pair.id].visits,1);
  assert.equal(T.recordRound(data,round.questions,allRight(round),contrasts,clues),data,'a stale step cannot count twice');
  assert.equal(compare(data).clueLevel,2);
});

test('stages two and three are different authored stories and both words remain equally likely',()=>{
  let state={};
  const level1=compare();state=T.recordRound(state,level1.questions,allRight(level1),contrasts,clues);
  const level2=compare(state);
  assert.equal(level2.clueLevel,2);
  assert.ok(level2.questions.every(q=>q.contrastClue.length>18));
  assert.ok(level2.questions.every(q=>q.contextWhy.includes('Skillnaden mot')));
  assert.equal(level2.questions.filter(q=>q.id===pair.left).length,2);
  assert.equal(level2.questions.filter(q=>q.id===pair.right).length,2);
  assert.ok(new Set(level2.questions.map(q=>q.contrastContext)).size>=3);
  assert.equal(level2.questions.some(q=>level1.questions.some(old=>old.stem===q.stem)),false);
  state=T.recordRound(state,level2.questions,allRight(level2),contrasts,clues);
  assert.equal(state[pair.id].level,3);
  const level3=compare(state);
  assert.equal(level3.clueLevel,3);
  assert.equal(level3.questions.filter(q=>q.id===pair.left).length,2);
  assert.equal(level3.questions.filter(q=>q.id===pair.right).length,2);
  assert.ok(new Set(level3.questions.map(q=>q.contrastContext)).size>=3);
  assert.equal(level3.questions.some(q=>level2.questions.some(old=>old.stem===q.stem)),false);
});

test('a hard session allows returning to clearer clues without losing the level reached',()=>{
  let state={};
  let round=compare();state=T.recordRound(state,round.questions,allRight(round),contrasts,clues);
  round=compare(state);state=T.recordRound(state,round.questions,allRight(round),contrasts,clues);
  assert.equal(state[pair.id].level,3);
  const level3=compare(state);
  state=T.recordRound(state,level3.questions,['wrong','wrong','wrong','right'],contrasts,clues);
  assert.equal(state[pair.id].level,2);
  assert.equal(state[pair.id].reached,3);
  assert.equal(state[pair.id].lastScore,1);
  assert.equal(compare(state).clueLevel,2);
  const next=compare(state);state=T.recordRound(state,next.questions,['right','wrong','right','wrong'],contrasts,clues);
  assert.equal(state[pair.id].level,2,'two correct should repeat the same level');
});

test('second visit at same clue tier uses different stories, while confusion history recognizes deeper scenes',()=>{
  let state={},observations={};
  let round=compare();state=T.recordRound(state,round.questions,allRight(round),contrasts,clues);
  const first=compare(state);
  observations=saveAnswers(observations,first,['right','wrong','wrong','right']);
  const second=C.create(pair.left,contrasts,bank,()=>.28,observations,T,clues,state);
  assert.equal(second.clueLevel,2);
  assert.equal(new Set(first.questions.map(q=>q.contrastSceneId)).size,4);
  assert.equal(new Set(second.questions.map(q=>q.contrastSceneId)).size,4);
  assert.equal(first.questions.some(a=>second.questions.some(b=>b.contrastSceneId===a.contrastSceneId)),false);
  const card=H.sanitize(observations,enriched)[pair.id];
  assert.equal(card.recent.length,4);
  assert.ok(card.recent.every(x=>x.sceneId.startsWith('ld-')));
  assert.ok(H.insight(enriched.pairs[0],card).needsPractice);
});

test('edited or forged rounds cannot advance the step or manufacture known facts',()=>{
  const round=compare();
  const wrongScene=structuredClone(round.questions);wrongScene[0].stem='En helt annan berättelse';
  assert.deepEqual(T.recordRound({},wrongScene,allRight(round),contrasts,clues),{});
  const duplicated=structuredClone(round.questions);duplicated[0]=duplicated[1];
  assert.deepEqual(T.recordRound({},duplicated,allRight(round),contrasts,clues),{});
  assert.deepEqual(T.recordRound({},round.questions,['right','right'],contrasts,clues),{});
  assert.deepEqual(T.recordRound({},round.questions,allRight(round),contrasts,clues)[pair.id].level,2);
  const bad=structuredClone(clues);bad.pairs[0].levels[0].scenes[0].text+=' Grumlig!';
  assert.match(T.validate(bad,contrasts,bank).join(' '),/Facit står/);
  const unbalanced=structuredClone(clues);unbalanced.pairs[0].levels[0].scenes[0].target=pair.right;
  assert.match(T.validate(unbalanced,contrasts,bank).join(' '),/4 \+ 4/);
});

test('old local history retains all previous fields and supports new stage state after reload sanitizer',()=>{
  const original=E.sanitizeHistory({settings:{theme:'dark'},results:[{finishedAt:100,total:5,right:3,wrong:2}],confusionProgress:{foo:'ignored'}});
  assert.deepEqual(original.clueProgress,{});
  const round=compare();
  const next=T.recordRound({},round.questions,allRight(round),contrasts,clues);
  const copy=E.sanitizeHistory({...original,clueProgress:JSON.parse(JSON.stringify(next))});
  assert.equal(T.sanitize(copy.clueProgress,clues)[pair.id].level,2);
  assert.equal(copy.results.length,1);
  assert.equal(copy.settings.theme,'dark');
  const injected={...copy.clueProgress,xx:{level:3,visits:99},'js-01':{level:99,visits:1e9,reached:0,lastScore:9}};
  const cleaned=T.sanitize(injected,clues);
  assert.equal(cleaned['js-01'].level,1);
  assert.equal(cleaned['js-01'].visits,999);
  assert.equal(cleaned['js-01'].lastScore,null);
  assert.ok(!Object.hasOwn(cleaned,'xx'));
});

test('other eight pairs and all ordinary / exam questions remain unchanged',()=>{
  for(const p of contrasts.pairs.filter(p=>!T.find(p.id,clues))){
    const plan=C.create(p.left,contrasts,bank,()=>.3,{},T,clues,{});
    assert.equal(plan.clueLevel,1);
    assert.equal(plan.clueSupported,false);
  }
  const curation=(()=>{const win={};vm.runInNewContext(fs.readFileSync(path.join(root,'data/curation.js'),'utf8'),{window:win});return win.ORDJAKTEN_CURATION;})();
  const medium=E.generateRound(bank,curation,{...E.DEFAULT_STATE.settings,mode:'train',topic:'words',difficulty:'medium',count:5},{},()=>.31,expressions);
  const exam=E.generateRound(bank,curation,{...E.DEFAULT_STATE.settings,mode:'test',topic:'words',difficulty:'exam',count:10},{},()=>.32,expressions);
  assert.ok(medium.every(q=>q.taskType!=='contrast'&&q.options.length===4));
  assert.ok(exam.every(q=>q.taskType!=='contrast'&&q.options.length===5));
});

test('focused practice continues to offer the same pair with an appropriate selected level',()=>{
  const window={};vm.runInNewContext(fs.readFileSync(path.join(root,'data/curation.js'),'utf8'),{window});
  const curation=window.ORDJAKTEN_CURATION;
  let state={};let round=compare();state=T.recordRound(state,round.questions,allRight(round),contrasts,clues);
  const focused=F.create(pair.left,'contrast',bank,curation,expressions,missions,contexts,E,{},()=>.22,C,contrasts,{},T,clues,state);
  assert.equal(focused.clueLevel,2);
  assert.equal(focused.clueSupported,true);
  assert.equal(focused.questions.length,4);
  assert.ok(focused.questions.every(q=>q.taskType==='contrast'&&q.contrastClueLevel===2));
});
