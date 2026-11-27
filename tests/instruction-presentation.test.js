'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../public/js/engine');
const B=require('../public/js/reading-check');
const Q=require('../public/js/missions');
const S=require('../public/js/surprises');
const F=require('../public/js/focus-practice');
const expressions=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const surprises=require('../public/data/surprises.json');
const app=fs.readFileSync(path.resolve(__dirname,'../public/js/app.js'),'utf8');

function appFunction(start,end){
  const from=app.indexOf(start),to=app.indexOf(end,from);
  assert.ok(from>=0&&to>from,'production renderer must be present');
  return app.slice(from,to);
}
function element(tag,className='',textContent=''){
  return {tag,className,textContent,children:[],attributes:{},dataset:{},hidden:false,
    append(...children){this.children.push(...children);},
    replaceChildren(...children){this.children=children;},
    setAttribute(name,value){this.attributes[name]=value;},
    focus(){}};
}
function descendants(root,className){
  return [root,...root.children.flatMap(child=>descendants(child))]
    .filter(node=>!className||node.className.split(' ').includes(className));
}
const everyday=()=>expressions.expressions.filter(entry=>entry.category==='everyday-instruction');

test('focused everyday practice shows the shared scene before shortened answer choices',()=>{
  assert.equal(everyday().length,6);
  for(const entry of everyday()){
    const question=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions);
    const nodes=new Map();
    const $=id=>{if(!nodes.has(id))nodes.set(id,element('div'));return nodes.get(id);};
    const context=vm.createContext({$,element,B,F,
      focusPractice:{index:0,questions:[question],finished:false},
      updateFocusProgress(){}});
    vm.runInContext(appFunction('  function renderFocusQuestion(){','  function answerFocus('),context);
    vm.runInContext('renderFocusQuestion()',context);
    assert.equal($('focus-scene').hidden,false,entry.id);
    assert.equal($('focus-scene').textContent,question.scene,entry.id);
    assert.match($('focus-task').textContent,/DEN HÄR SITUATIONEN/);
    const expected=B.formatSchoolAnswers(question.options).options.map(option=>option.displayLabel);
    const shown=$('focus-choices').children.map(button=>button.children.at(-1).textContent);
    assert.deepEqual(shown,expected,entry.id);
    assert.ok(shown.every(text=>text&&!text.includes('” – ')),entry.id);
  }
});

test('book tasks keep the everyday situation visible while showing each answer only once',()=>{
  assert.equal(everyday().length,6);
  for(const entry of everyday())for(const mode of ['meaning','sentence']){
    const target=element('div');
    const context=vm.createContext({element,E,B,Q,S,expressions,missions,surprises,
      history:{missionProgress:{}},settings:{missionHints:false},missionMode:()=>mode,target,id:entry.id});
    vm.runInContext(appFunction('  function makeBonus(target,id){','  function redrawMissionOrder('),context);
    vm.runInContext('makeBonus(target,id)',context);
    const question=descendants(target,'bonus-question')[0]._contextQuestion;
    const source=mode==='meaning'?S.getChallenge(surprises,entry.id).options:question?.options||Q.get(missions,entry.id).sentences;
    const formatted=B.formatSchoolAnswers(source);
    assert.ok(formatted.instruction,entry.id);
    const scene=descendants(target,mode==='meaning'?'bonus-prompt':'mission-instructions')[0].textContent;
    if(mode==='meaning'){
      assert.ok(scene.includes(formatted.instruction),entry.id);
      assert.equal(scene.split(formatted.instruction).length-1,1,entry.id);
    }else assert.equal(scene,formatted.instruction.replace(/^[“”]|[“”]$/g,'').trim(),entry.id);
    const shown=descendants(target,'mission-choice').map(button=>button.textContent).sort();
    const expected=formatted.options.map(option=>option.displayLabel).sort();
    assert.deepEqual(shown,expected,entry.id);
    assert.ok(shown.every(text=>text&&!text.includes('” – ')),entry.id);
  }
});

const contextual=()=>missions.missions.filter(task=>task.contextScenes);

test('context feedback uses the chosen scene and teaches the clue without inventing a meaning for unclear cases',()=>{
  assert.equal(contextual().length,6);
  for(const task of contextual())for(const scene of task.contextScenes){
    const entry=expressions.expressions.find(row=>row.id===task.id);
    const question=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions,scene.id);
    const nodes=new Map();
    const $=id=>{if(!nodes.has(id))nodes.set(id,element('div'));return nodes.get(id);};
    const practice={index:0,questions:[question],finished:false,answers:[],selected:[]};
    const context=vm.createContext({$,Q,S,E,expressions,missions,bank:{words:[]},
      focusPractice:practice,history:{skillProgress:{},surprises:{}},
      D:{record:()=>({})},saveHistory(){},renderWordTeaching(){},updateFocusProgress(){}});
    vm.runInContext(appFunction('  function answerFocus(','  function finishFocus(){'),context);
    const index=question.options.findIndex(option=>!option.correct);
    vm.runInContext('answerFocus('+index+')',context);
    assert.equal($('focus-definition').textContent,scene.definition,scene.id);
    assert.equal($('focus-example').hidden,true,scene.id);
    assert.equal($('focus-correct').textContent,'Rätt svar: '+scene.options.find(option=>option.correct).label,scene.id);
    assert.ok($('focus-why').textContent.includes('Ledtråden i berättelsen: ”'+scene.clue+'”.'),scene.id);
    assert.ok($('focus-why').textContent.includes(scene.explanation),scene.id);
    assert.ok($('focus-why').textContent.includes(scene.rule),scene.id);
    assert.equal($('focus-explain-label').textContent.includes('BEHÖVER VI FRÅGA'),scene.kind==='clarify',scene.id);
  }
});

test('both Aha reading steps introduce possible meanings without revealing the selected answer or its clue',()=>{
  assert.equal(contextual().length,6);
  for(const task of contextual()){
    const entry=expressions.expressions.find(row=>row.id===task.id);
    const check=B.makeCheck({id:entry.id,kind:'expression',word:entry.phrase,definition:entry.definition,options:[]},
      {missions,surprises,bank:{words:[]},contexts:{wordContexts:[]},random:()=>.42});
    assert.ok(check.contextReading,entry.id);
    const nodes=new Map();
    const $=id=>{if(!nodes.has(id))nodes.set(id,element('div'));return nodes.get(id);};
    const context=vm.createContext({$,ahaRound:{items:[{word:entry.phrase,definition:entry.definition,check}],index:0},
      scrollTop(){},game:{readingMetrics:{offered:0}},mysteryForRound:()=>null,renderReadingOptions(){},check});
    vm.runInContext(appFunction('  function renderAhaStep(','  function revealAhaQuestion(){'),context);
    vm.runInContext('renderAhaStep()',context);
    assert.equal($('aha-round-definition').textContent,task.contextReading,entry.id);
    assert.ok(!$('aha-round-definition').textContent.includes(check.definition),entry.id);
    assert.ok(!$('aha-round-definition').textContent.includes(check.clue),entry.id);
    vm.runInContext('renderAhaStep("Läs hela situationen igen.")',context);
    assert.equal($('aha-round-read-note').textContent,'Läs hela situationen igen.');
    vm.runInContext(appFunction('  function showReadingCheck(check) {','  function renderReadingOptions('),context);
    vm.runInContext('showReadingCheck(check)',context);
    assert.ok($('reading-launch-prompt').textContent.startsWith(task.contextReading),entry.id);
    assert.ok(!$('reading-launch-prompt').textContent.includes(check.clue),entry.id);
    assert.match($('reading-instruction').textContent,/nya situationen/);
  }
});

test('word collection presents both meanings and the clarification example as separate situations',()=>{
  assert.equal(contextual().length,6);
  for(const task of contextual()){
    const card=element('article');
    const context=vm.createContext({element,card,task});
    vm.runInContext(appFunction('  function renderExpressionContexts(','  function renderWordList() {'),context);
    vm.runInContext('renderExpressionContexts(card,task)',context);
    assert.equal(card.children[0].textContent,task.contextReading,task.id);
    const details=card.children[1];
    assert.equal(details.tag,'details');
    assert.match(details.children[0].textContent,/Samma uttryck/);
    const scenes=descendants(details,'word-teaching-part');
    assert.equal(scenes.length,3);
    task.contextScenes.forEach((scene,index)=>{
      const text=descendants(scenes[index]).map(node=>node.textContent).join('\n');
      assert.ok(text.includes(scene.prompt)&&text.includes(scene.definition)&&text.includes(scene.clue),scene.id);
      assert.equal(text.includes('När vi behöver fråga'),scene.kind==='clarify',scene.id);
    });
  }
});

test('book grading follows its displayed context question rather than the old mission answer position',()=>{
  for(const task of contextual())for(const scene of task.contextScenes){
    const entry=expressions.expressions.find(row=>row.id===task.id);
    const question=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions,scene.id);
    const oldCorrect=task.sentences.findIndex(option=>option.correct),newCorrect=(oldCorrect+1)%3;
    const right=question.options.find(option=>option.correct),wrong=question.options.filter(option=>!option.correct);
    question.options=[...wrong];question.options.splice(newCorrect,0,right);
    const message=element('p'),result={};
    const wrap={dataset:{expressionId:entry.id,missionMode:'sentence'},_contextQuestion:question,
      contains:()=>true,querySelector:()=>message};
    const button={dataset:{missionSentence:String(newCorrect)},classList:{add(){}},
      hasAttribute:name=>name==='data-mission-sentence',closest:()=>wrap};
    const event={target:{closest:()=>button}};
    const context=vm.createContext({Q,S,missions,surprises,event,
      completeMission(actual,explanation){result.wrap=actual;result.explanation=explanation;}});
    vm.runInContext(appFunction('  function gradeBonus(event){','  function renderBookTiles(){'),context);
    vm.runInContext('gradeBonus(event)',context);
    assert.equal(result.wrap,wrap,scene.id);
    assert.ok(result.explanation.includes(scene.clue)&&result.explanation.includes(scene.explanation),scene.id);
  }
});
