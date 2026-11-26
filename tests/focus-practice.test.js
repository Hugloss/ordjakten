'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const E=require('../public/js/engine.js');
const F=require('../public/js/focus-practice.js');
const D=require('../public/js/adaptive.js');
const R=require('../public/js/review.js');
const root=path.join(__dirname,'../public');
function load(file,key){const window={};vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),{window});return window[key];}
const bank=load('data/wordbank.js','ORDJAKTEN_WORDS');
const curation=load('data/curation.js','ORDJAKTEN_CURATION');
const expressions=load('data/expressions.js','ORDJAKTEN_EXPRESSIONS');
const missions=load('data/missions.js','ORDJAKTEN_MISSIONS');
const contexts=load('data/word-contexts.js','ORDJAKTEN_CONTEXTS');
const word=bank.words.find(x=>x.word.toLocaleLowerCase('sv-SE')==='grumlig');
const expr=expressions.expressions.find(x=>x.phrase==='För en gångs skull');
const make=(id,skill,progress={},random=()=>.34)=>F.create(id,skill,bank,curation,expressions,missions,contexts,E,progress,random);

test('focused drills never use a fabricated concept or unsupported skill',()=>{
  for(const id of ['sv-0000','ut-0000','x','__proto__','sv-999999'])assert.equal(F.findItem(id,bank,expressions),null);
  assert.throws(()=>make('unknown','meaning'),/finns inte/);
  assert.equal(F.findItem(word.id,bank,expressions).name,'Grumlig');
  assert.equal(F.findItem(expr.id,bank,expressions).name,'För en gångs skull');
});
test('all 152 concepts have short, playable drills for every supported skill',()=>{
  let count=0;
  for(const id of [...bank.words.map(x=>x.id),...expressions.expressions.map(x=>x.id)]){
    const item=F.findItem(id,bank,expressions);
    const options=F.supported(item,curation,contexts,missions);
    assert.ok(options.length>=2);
    for(const skill of options){
      const plan=make(id,skill);
      assert.equal(plan.item.id,id);assert.equal(plan.chosen,skill);
      assert.ok(plan.questions.length>=2&&plan.questions.length<=3);
      assert.equal(plan.questions[0].taskType,skill);
      assert.equal(new Set(plan.questions.map(q=>q.focusKey)).size,plan.questions.length);
      for(const q of plan.questions){
        assert.equal(q.id,id,'Skill observations must use the original concept ID');
        if(q.taskType==='order'){
          assert.equal(q.steps.length,3);assert.equal(q.correctOrder.length,3);
          assert.equal(new Set(q.steps.map(s=>s.key)).size,3);
        }else{
          assert.ok([3,4,5].includes(q.options.length));
          assert.equal(q.options.filter(o=>o.correct).length,1);
          assert.equal(new Set(q.options.map(o=>o.label)).size,q.options.length);
        }
        if(q.picture) assert.ok(q.options.every(option=>option.emoji),'A picture choice must contain a curated emoji');
        count++;
      }
    }
  }
  assert.ok(count>750,`Expected hundreds of playable steps, got ${count}`);
});
test('grumlig context drill contains three distinct AUTHORED scenes',()=>{
  const plan=make(word.id,'context');
  const authored=contexts.wordContexts.find(x=>x.id===word.id).scenes;
  assert.equal(plan.questions.length,3);
  assert.deepEqual(plan.questions.map(q=>q.taskType),['context','context','context']);
  assert.equal(new Set(plan.questions.map(q=>q.contextIndex)).size,3);
  assert.equal(new Set(plan.questions.map(q=>q.stem)).size,3);
  for(const q of plan.questions){
    assert.equal(q.stem,authored[q.contextIndex].text);
    assert.equal(q.contextWhy,authored[q.contextIndex].why);
  }
});
test('on the next visit, a context drill starts at a NEW story',()=>{
  const progress={[word.id]:{lastScene:2,skills:{context:{attempts:1,wrong:1,streak:0,lastAt:55}}}};
  const plan=make(word.id,'context',progress,()=>.85);
  assert.deepEqual(plan.questions.map(q=>q.contextIndex),[0,1,2]);
});
test('a targeted drill on a word with contexts transfers to another task too',()=>{
  const reverse=make(word.id,'reverse');
  assert.equal(reverse.questions[0].taskType,'reverse');
  assert.ok(reverse.questions.some(q=>q.taskType==='context'));
  assert.ok(reverse.questions.some(q=>q.taskType==='meaning'));
});
test('an expression drill contains meaning, sentence and ordering, with no generated scenes',()=>{
  const plan=make(expr.id,'sentence');
  assert.deepEqual(plan.questions.map(q=>q.taskType),['sentence','meaning','order']);
  assert.equal(plan.questions[0].options.find(o=>o.correct).label,
    missions.missions.find(x=>x.id===expr.id).sentences.find(x=>x.correct).label);
  assert.deepEqual(plan.questions[2].correctOrder,missions.missions.find(x=>x.id===expr.id).order);
});
test('a curated easy word retains image cards, including fallback to text for 7 unsupported icons',()=>{
  const image=bank.words.find(x=>x.difficulty==='easy'&&curation.easy[x.id]);
  const words=F.supported(F.findItem(image.id,bank,expressions),curation,contexts,missions);
  assert.ok(words.includes('picture'));
  assert.equal(make(image.id,'picture').questions[0].picture,true);
  const without=bank.words.find(x=>x.difficulty==='easy'&&!curation.easy[x.id]);
  assert.ok(without);
  const textSkills=F.supported(F.findItem(without.id,bank,expressions),curation,contexts,missions);
  assert.ok(textSkills.includes('meaning')&&!textSkills.includes('picture'));
  assert.equal(make(without.id,'meaning').questions[0].picture,false);
});
test('an older word with no contexts still has a short two-question drill',()=>{
  const old=bank.words.find(x=>!contexts.wordContexts.some(scene=>scene.id===x.id)&&x.difficulty==='medium');
  const plan=make(old.id,'meaning');
  assert.deepEqual(plan.questions.map(q=>q.taskType),['meaning','reverse']);
});
test('recommended chooses the weak skill even when definition is right',()=>{
  let progress=D.record({}, {id:word.id,kind:'word',taskType:'meaning'},'right',100);
  progress=D.record(progress, {id:word.id,kind:'word',taskType:'context',contextIndex:0},'wrong',200);
  const item=F.findItem(word.id,bank,expressions);
  const types=F.supported(item,curation,contexts,missions);
  assert.equal(F.recommended(item,types,progress),'context');
  assert.equal(make(word.id,null,progress).chosen,'context');
});
test('targeted practice results never conflate unanswered and wrong',()=>{
  assert.deepEqual(F.results([],3),{right:0,wrong:0,completed:0,total:3,percent:0});
  assert.deepEqual(F.results(['right','wrong'],3),{right:1,wrong:1,completed:2,total:3,percent:33});
});
test('spaced review only advances at most once and never before due',()=>{
  const q=make(word.id,'context').questions[0];
  const NOW=1_795_600_000_000;
  let cards=R.record({},q,'wrong',NOW);
  assert.equal(cards[word.id].streak,0);
  cards=R.record(cards,q,'right',NOW+1000);
  assert.equal(cards[word.id].streak,1);
  const later=R.record(cards,q,'right',NOW+2000);
  assert.equal(later[word.id].streak,1,'Repeated same-session responses cannot speed the timer');
});
