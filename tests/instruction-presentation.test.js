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
    assert.equal($('focus-scene').textContent,Q.get(missions,entry.id).prompt,entry.id);
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
    const source=mode==='meaning'?S.getChallenge(surprises,entry.id).options:Q.get(missions,entry.id).sentences;
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
