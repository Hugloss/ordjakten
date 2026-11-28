'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../public/js/engine');
const Stars=require('../public/js/star-collection');
const Treasure=require('../public/js/treasure-hunt');
const Data=require('../public/js/treasure-hunt-data');
const A=require('../public/js/adventures');
const P=require('../public/js/playful');
const Story=require('../public/js/story-quests');
const Missions=require('../public/js/world-missions');
const L=require('../public/js/learning-map');
const D=require('../public/js/adaptive');
const R=require('../public/js/review');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const contexts=require('../public/data/word-contexts.json');
const QuestionPlatform=require('../public/js/question-platform');
const questions=require('../scripts/export-question-catalog').open('svenska').questions;
const byQuestion=new Map(questions.map(q=>[q.ref.id,q]));
const provider={
  describe:()=>({bankId:'svenska',revision:1}),
  listQuestionIds:()=>[...byQuestion.keys()],
  getQuestion:id=>byQuestion.get(id)||null
};
const questionRegistry=QuestionPlatform.createRegistry();
questionRegistry.register(provider);
function assessSwedishChoice(id,label){
  const ref={bankId:'svenska',id,revision:1};
  const question=questionRegistry.resolve(ref);
  const choice=question.responseSpec.options.find(o=>o.label===label);
  assert.ok(choice,'Unregistered treasure answer: '+id+' -> '+label);
  return questionRegistry.assess(ref,choice.id).status;
}
const app=fs.readFileSync(path.resolve(__dirname,'../public/js/app.js'),'utf8');
const clone=value=>JSON.parse(JSON.stringify(value));
const words=L.catalog(bank,expressions,contexts);
const treasureContent=Treasure.catalog(Data,A,Story,Missions.catalog(words,Story));
assert.deepEqual(treasureContent.errors,[]);

function production(){
  const from=app.indexOf('  function treasureModel(');
  const to=app.indexOf('  function missionButton(',from);
  assert.ok(from>=0&&to>from,'production treasure controller must be present');
  return app.slice(from,to);
}
function initialHistory(){
  const now=Date.now(),question=E.makeContextQuestion(bank.words.find(row=>row.id==='sv-0007'),bank,contexts,()=>.37,0);
  const history=E.sanitizeHistory({
    settings:{adventure:'forest',mode:'test',timerMode:'per',timerSeconds:9},
    results:[{finishedAt:now-10000,mode:'train',level:'easy',topic:'words',adventure:'forest',total:5,right:3,wrong:2,unanswered:0}],
    mistakes:{'sv-0007':1},
    reviewProgress:R.record({},question,'wrong',now-5000),
    skillProgress:D.record({},question,'wrong',now-5000),
    storyProgress:{forest:1}
  });
  const started=Stars.begin(Stars.sanitize(null,history.results),[{id:'sv-0007'},{id:'sv-0016'}]);
  history.starCollection=Stars.award(started.collection,started.roundId,'sv-0007','answer').collection;
  history.treasureHunt=Treasure.sanitize(null,treasureContent);
  return history;
}
function unrelated(history){
  const {starCollection,treasureHunt,...rest}=clone(history);
  return rest;
}
function reload(history){
  const clean=E.sanitizeHistory(clone(history));
  clean.treasureHunt=Treasure.sanitize(clean.treasureHunt,treasureContent);
  clean.starCollection=Stars.sanitize(clean.starCollection,clean.results);
  return clean;
}
function harness({history=initialHistory(),screen='treasure'}={}){
  const nodes=new Map(),saved=[],rendered=[],spoken=[],focus=[];
  const $=id=>{
    if(!nodes.has(id))nodes.set(id,{id,focus(){focus.push(id);},contains(button){return button.host===id;}});
    return nodes.get(id);
  };
  const context=vm.createContext({E,Stars,Treasure,A,P,treasureContent,history,assessSwedishChoice,
    settings:{...history.settings},screen,treasureWorld:'forest',treasureStarReward:null,canReadAloud:true,$,
    TreasureView:{render(host,model,options){rendered.push({host:host.id,model:clone(model),options:clone(options)});}},
    saveHistory(){saved.push(clone(context.history));},
    stopReadAloud(){},
    speakReadAloud(text,button){spoken.push({text,button});},
    goNav(name){context.screen=name;},
    setSettings(patch){context.settings={...context.settings,...patch};context.history.settings={...context.settings};}
  });
  vm.runInContext(production(),context);
  const click=(dataset,extra={})=>{
    const button={dataset,host:'treasure-content',disabled:false,...extra};
    context.handleTreasureClick({target:{closest:()=>button}});
  };
  const model=()=>context.treasureModel();
  const visit=index=>click({treasurePlace:String(index)});
  const answer=correct=>{
    const active=model().visit,option=active.options.find(row=>row.correct===correct);
    click({treasureSerial:String(active.serial),treasureAnswer:option.id});
  };
  const finish=()=>click({treasureSerial:String(model().visit.serial),treasureFinish:''});
  const back=()=>click({treasureSerial:String(model().visit.serial),treasureBack:''});
  return {context,$,saved,rendered,spoken,focus,click,model,visit,answer,finish,back};
}

test('the production controller grants a word star on a wrong destination without a finder point',()=>{
  const h=harness(),before=clone(h.context.history),firstClue=h.model().clue.index;
  const elsewhere=h.model().places.find(place=>place.index!==firstClue).index;
  h.visit(elsewhere);
  assert.equal(h.model().phase,'question');
  assert.equal(h.model().visit.matched,false);
  h.answer(true);
  assert.equal(h.model().phase,'explanation');
  assert.equal(h.model().visit.outcome,'direct');
  assert.equal(h.context.history.starCollection.total,before.starCollection.total+1);
  assert.deepEqual(h.context.history.starCollection.activities,['treasure:forest:'+elsewhere]);
  assert.equal(h.saved.at(-1).starCollection.total,before.starCollection.total+1,'the star is persisted before ending the visit');
  assert.equal(h.model().finderTotal,0);
  assert.deepEqual(h.context.history.starCollection.active,before.starCollection.active,'the ordinary unfinished row stays intact');
  h.finish();
  assert.equal(h.model().visit.reward.kind,'small');
  assert.equal(h.model().visit.reward.finderAdded,0);
  assert.equal(h.model().visit.reward.newItem,true);
  assert.equal(h.model().count,0);
  assert.equal(h.model().clue.index,firstClue);
  assert.equal(h.model().smallFinds.length,1);
  assert.deepEqual(unrelated(h.context.history),unrelated(before),'scored, adaptive, review and story history stay unchanged');
});

test('finding the clue destination earns its treasure after guided help without fabricating a word star',()=>{
  const h=harness(),before=clone(h.context.history),target=h.model().clue.index;
  h.visit(target);
  const serial=h.model().visit.serial;
  h.click({treasureSerial:String(serial),treasureExplain:''});
  assert.equal(h.model().visit.outcome,'guided');
  assert.deepEqual(h.context.history.starCollection,before.starCollection);
  h.finish();
  assert.equal(h.model().visit.reward.kind,'treasure');
  assert.equal(h.model().visit.reward.finderAdded,1);
  assert.equal(h.model().count,1);
  assert.equal(h.model().finderTotal,1);
  assert.deepEqual(clone(h.context.history.treasureHunt.worlds.forest.found),[target]);
  assert.deepEqual(h.context.history.starCollection,before.starCollection);
  assert.deepEqual(unrelated(h.context.history),unrelated(before));
  const savedCount=h.saved.length,settled=clone(h.context.history);
  h.finish();
  h.context.answerTreasureQuestion(serial,'0');
  assert.equal(h.saved.length,savedCount);
  assert.deepEqual(clone(h.context.history),settled,'finishing or answering a completed visit is inert');
});

test('supported answers and every resumable phase survive history JSON without duplicate rewards',()=>{
  let h=harness();
  const before=clone(h.context.history),target=h.model().clue.index;
  h.visit(target);h.answer(false);
  assert.equal(h.model().visit.attempts,1);
  assert.equal(h.model().phase,'question');
  const questionState=clone(h.context.history.treasureHunt),optionOrder=clone(h.model().visit.options.map(option=>option.id));
  h=harness({history:reload(h.saved.at(-1)),screen:'home'});
  h.context.openTreasureHunt();
  assert.equal(h.context.screen,'treasure');
  assert.deepEqual(clone(h.context.history.treasureHunt),questionState);
  assert.deepEqual(clone(h.model().visit.options.map(option=>option.id)),optionOrder);
  h.answer(true);
  assert.equal(h.model().visit.outcome,'supported');
  assert.equal(h.context.history.starCollection.total,before.starCollection.total+1);
  assert.equal(h.model().count,0,'finding points wait until the explanation has been completed');
  const explanation=clone(h.context.history);
  h=harness({history:reload(h.saved.at(-1)),screen:'home'});
  h.context.openTreasureHunt();
  assert.equal(h.model().phase,'explanation');
  assert.equal(h.model().visit.outcome,'supported');
  assert.deepEqual(clone(h.context.history),explanation);
  const firstSerial=h.model().visit.serial;
  h.context.answerTreasureQuestion(firstSerial,'0');
  assert.equal(h.saved.length,0,'replayed correct answer after reload must not award or save again');
  h.finish();
  const rewardState=clone(h.context.history);
  h=harness({history:reload(h.saved.at(-1)),screen:'home'});
  h.context.openTreasureHunt();
  assert.equal(h.model().phase,'reward');
  assert.equal(h.model().finderTotal,1);
  assert.deepEqual(clone(h.context.history),rewardState);
  h.finish();
  assert.equal(h.saved.length,0,'replaying the finish event after reload is also inert');
  h.back();h.visit(target);
  const nextSerial=h.model().visit.serial,unfinished=clone(h.context.history),savedCount=h.saved.length;
  assert.ok(nextSerial>firstSerial);
  for(const action of ['answerTreasureQuestion','explainTreasureQuestion','finishTreasureVisit','backToTreasureMap'])
    h.context[action](firstSerial,'0');
  assert.deepEqual(clone(h.context.history),unfinished,'old visit callbacks cannot alter the new visit');
  assert.equal(h.saved.length,savedCount);
  h.answer(true);h.finish();
  assert.equal(h.context.history.starCollection.total,before.starCollection.total+1,'revisiting the same word task gives no extra star');
  assert.equal(h.model().finderTotal,1,'an old destination does not solve the next clue');
  assert.deepEqual(h.context.history.starCollection.active,before.starCollection.active);
  assert.deepEqual(unrelated(h.context.history),unrelated(before));
});

test('read-aloud uses the currently visible clue or task and reveals explanation text only afterwards',()=>{
  const h=harness(),map=h.model(),target=map.clue.index;
  let text=h.context.treasureReadAloudText('clue');
  assert.ok(text.includes(map.clue.text));
  for(const place of map.places){
    assert.ok(text.includes(place.name+'. '+place.description));
    assert.ok(!text.includes(place.task.why),'a map clue must not read a future task solution');
  }
  assert.ok(!text.includes(map.clue.hint),'optional help is read only after requesting it');
  assert.ok(!text.includes('Leta efter båda:'),'split clue support is read only when visible');
  assert.ok(!text.includes(map.clue.why),'the destination explanation must not be read before choosing');
  assert.equal(h.context.treasureReadAloudText('task'),'');
  assert.equal(h.context.treasureReadAloudText('explanation'),'');
  h.click({treasureHint:''});
  assert.ok(h.context.treasureReadAloudText('clue').includes(map.clue.hint));
  assert.ok(h.context.treasureReadAloudText('clue').includes('Leta efter båda: '+map.clue.lookFor.join('. ')));
  h.visit(target);
  const visit=h.model().visit;
  text=h.context.treasureReadAloudText('task');
  assert.ok(text.startsWith(visit.task.prompt));
  for(const [index,option] of visit.options.entries())assert.ok(text.includes('Alternativ '+'ABC'[index]+': '+option.label));
  assert.ok(!text.includes(visit.task.why));
  assert.ok(!text.includes(visit.task.definition));
  assert.equal(h.context.treasureReadAloudText('clue'),'');
  assert.equal(h.context.treasureReadAloudText('explanation'),'');
  h.click({treasureListen:'task',treasureSerial:String(visit.serial)});
  assert.equal(h.spoken.at(-1).text,text);
  const spokenCount=h.spoken.length;
  h.click({treasureListen:'task',treasureSerial:String(visit.serial-1)});
  assert.equal(h.spoken.length,spokenCount,'a stale listen button cannot speak the next visit');
  h.answer(false);
  text=h.context.treasureReadAloudText('task');
  assert.ok(text.includes(visit.task.word+' – '+visit.task.definition),'the first wrong answer makes its visible help available to listen to');
  assert.ok(!text.includes(visit.task.why),'the final explanation is still hidden');
  h.answer(true);
  text=h.context.treasureReadAloudText('explanation');
  for(const part of [visit.task.word,visit.task.definition,visit.task.why])assert.ok(text.includes(part));
  assert.equal(h.context.treasureReadAloudText('task'),'');
  h.context.screen='home';
  assert.equal(h.context.treasureReadAloudText('explanation'),'');
});

test('a wrong-place comparison can be read aloud without naming the hidden destination',()=>{
  const h=harness(),clue=h.model().clue,target=h.model().places[clue.index];
  assert.equal(h.context.treasureReadAloudText('arrival'),'');
  h.visit(0);
  const place=h.model().places[0],serial=h.model().visit.serial;
  const text=h.context.treasureReadAloudText('arrival');
  assert.ok(text.includes(clue.text));
  for(const part of clue.lookFor)assert.ok(text.includes(part));
  assert.ok(text.includes(place.name));assert.ok(text.includes(place.description));
  assert.ok(!text.includes(target.name));assert.ok(!text.includes(clue.why));
  h.click({treasureListen:'arrival',treasureSerial:String(serial)});
  assert.equal(h.spoken.at(-1).text,text);
  h.context.screen='home';
  assert.equal(h.context.treasureReadAloudText('arrival'),'');
});

test('completed-map progress and world choices preserve word stars and the ordinary row',()=>{
  const h=harness(),before=clone(h.context.history);
  for(const index of [0,2])h.context.history.starCollection=Stars.awardActivity(h.context.history.starCollection,'treasure:forest:'+index).collection;
  h.context.renderTreasureHunt();
  let forest=h.rendered.at(-1).options.worlds.find(world=>world.id==='forest');
  assert.equal(forest.count,0,'word stars alone cannot complete a map');assert.equal(forest.starCount,2);
  for(const index of Treasure.ORDER){
    h.visit(index);h.click({treasureExplain:'',treasureSerial:String(h.model().visit.serial)});h.finish();h.back();
  }
  forest=h.rendered.at(-1).options.worlds.find(world=>world.id==='forest');
  assert.equal(forest.count,4);assert.equal(forest.total,4);assert.equal(forest.starCount,2);
  assert.equal(h.rendered.at(-1).options.worlds.filter(world=>world.count===world.total).length,1);
  const settled=clone(h.context.history.treasureHunt),stars=clone(h.context.history.starCollection);
  h.click({treasureWorldChoice:'space'});
  assert.equal(h.model().id,'space');assert.equal(h.context.settings.adventure,'space');
  assert.deepEqual(clone(h.context.history.treasureHunt),settled);
  assert.deepEqual(clone(h.context.history.starCollection),stars);
  assert.deepEqual(clone(h.context.history.starCollection.active),before.starCollection.active);
  h.visit(2);const pending=clone(h.context.history.treasureHunt);
  h.click({treasureWorldChoice:'forest'});
  assert.equal(h.model().id,'space','a stale book choice must not replace a pending visit');
  assert.deepEqual(clone(h.context.history.treasureHunt),pending);
});

test('extra mystery answers and read-aloud flow through real app handler without affecting scores',()=>{
  const h=harness();
  assert.equal(h.context.treasureReadAloudText('transfer'),'');
  assert.equal(h.context.treasureReadAloudText('transferExplanation'),'');
  h.visit(h.model().clue.index);h.answer(true);h.finish();h.back();
  for(let i=0;i<2;i++)h.click({treasureMysteryReveal:''});
  h.click({treasureMysteryGuess:String(Data.MYSTERIES.forest.target)});
  assert.equal(h.model().mystery.transfer,null);
  h.click({treasureMysteryProof:String(Data.MYSTERIES.forest.target)});
  assert.equal(h.model().mystery.proof.done,true);
  const before=clone(h.context.history),task=Data.TRANSFERS.forest;
  const speech=h.context.treasureReadAloudText('transfer');
  assert.ok(speech.includes(task.title));
  for(const clue of task.clues)assert.ok(speech.includes(clue));
  assert.ok(!speech.includes(task.why),'read-aloud cannot reveal the right answer early');
  assert.equal(h.context.treasureReadAloudText('transferExplanation'),'');
  h.click({treasureListen:'transfer'});
  assert.equal(h.spoken.at(-1).text,speech);
  const wrong=(task.target+1)%3;
  h.click({treasureMysteryTransfer:String(wrong)});
  assert.deepEqual(clone(h.model().mystery.transfer.wrong),[wrong]);
  assert.equal(h.model().mystery.transfer.feedback,task.wrong[wrong]);
  const count=h.saved.length;h.click({treasureMysteryTransfer:String(wrong)});
  assert.equal(h.saved.length,count,'no extra saves from repeated guesses');
  h.click({treasureMysteryTransfer:String(task.target)});
  assert.equal(h.model().mystery.transfer.done,true);
  assert.equal(h.focus.at(-1),'treasure-transfer-title');
  assert.ok(!h.context.treasureReadAloudText('transfer').includes(task.why),
    'listening to the case cannot read its collapsed explanation');
  assert.equal(h.context.treasureReadAloudText('transferExplanation'),task.why,
    'the deliberately requested explanation can be read aloud');
  assert.equal(h.model().finderTotal,Treasure.model(before.treasureHunt,'forest',treasureContent).finderTotal);
  assert.deepEqual(clone(h.context.history.starCollection),before.starCollection);
  assert.deepEqual(unrelated(h.context.history),unrelated(before));
  assert.deepEqual(clone(reload(h.saved.at(-1)).treasureHunt),clone(h.context.history.treasureHunt));
});

test('a delayed cancel after an answer preserves the find until it is collected',()=>{
  const h=harness();h.visit(h.model().clue.index);
  const serial=h.model().visit.serial;h.answer(true);
  const answered=clone(h.context.history),saved=h.saved.length;
  h.click({treasureBack:'',treasureSerial:String(serial)});
  assert.equal(h.model().phase,'explanation');assert.equal(h.saved.length,saved);
  assert.deepEqual(clone(h.context.history),answered);
  h.finish();h.back();
  assert.equal(h.model().phase,'map');assert.equal(h.model().count,1);
  assert.equal(h.model().collection.length,1);
});

test('disabled, unrelated and hidden-view clicks do not move the map or grant rewards',()=>{
  const h=harness(),before=clone(h.context.history),target=String(h.model().clue.index);
  h.click({treasurePlace:target},{disabled:true});
  h.click({treasurePlace:target},{host:'another-panel'});
  h.context.screen='home';h.click({treasurePlace:target});
  assert.equal(h.saved.length,0);
  assert.deepEqual(clone(h.context.history),before);
  h.context.screen='treasure';h.visit(Number(target));
  const active=clone(h.context.history),savedCount=h.saved.length;
  h.visit((Number(target)+1)%4);
  h.finish();
  assert.equal(h.saved.length,savedCount);
  assert.deepEqual(clone(h.context.history),active,'place switching and finishing are blocked until the current question is resolved');
});
