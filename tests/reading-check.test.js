'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const B=require('../public/js/reading-check');
const E=require('../public/js/engine');
const root=path.resolve(__dirname,'../public');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const surprises=require('../public/data/surprises.json');
const missionBank=require('../public/data/missions.json');
const browser={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/reading-check.js'),'utf8'),browser);
const words=new Map(bank.words.map(w=>[w.id,w]));
const run=q=>B.makeCheck(q,{bank,contexts,surprises,missions:missionBank,random:()=>.22});

test('reading checks exist for all 121 words, 73 expressions and school instructions, and both shuffled positions',()=>{
  for(const w of bank.words){
    const q={...w,kind:'word',options:[],picture:false};
    const check=run(q);
    assert.ok(check,`No check for ${w.word}`);
    assert.equal(check.options.length,3);
    assert.equal(check.options.filter(o=>o.correct).length,1);
    assert.notEqual(check.options[0].label,check.options[1].label);
  }
  for(const expr of expressions.expressions){
    const q=E.makeExpressionQuestion(expr,'medium',()=>.66,'meaning',missionBank);
    const check=run(q);
    assert.equal(check.source,'expression');
    assert.equal(check.options.length,3);
    assert.equal(check.options.filter(o=>o.correct).length,1);
    const flipped=B.makeCheck(q,{bank,contexts,surprises,missions:missionBank,random:()=>.87});
    assert.notEqual(check.options.findIndex(o=>o.correct),flipped.options.findIndex(o=>o.correct));
  }
});
test('every authored word context tests a different story than the current one',()=>{
  for(const record of contexts.wordContexts){
    for(let i=0;i<3;i++){
      const q=E.makeContextQuestion(words.get(record.id),bank,contexts,()=>.31,i);
      const check=run(q);
      assert.equal(check.source,'context');
      assert.equal(check.options.length,3);
      assert.ok(!check.options.some(o=>o.label===q.stem),`Repeated story: ${q.word}`);
      assert.ok(record.scenes.some(s=>s.text===check.options.find(o=>o.correct).label));
    }
  }
});
test('Aha alternatives come only from the separate editorial allowlist for every word',()=>{
  for(const record of contexts.wordContexts){
    const allowed=new Set(contexts.wordContexts.filter(row=>record.readingDistractors.includes(row.id)).flatMap(row=>row.scenes.map(scene=>scene.text)));
    for(const value of [0,.21,.49,.78,.999]){
      const question=E.makeContextQuestion(words.get(record.id),bank,contexts,()=>value,0);
      const check=B.makeCheck(question,{bank,contexts,random:()=>value});
      assert.equal(check.source,'context',record.id);
      assert.equal(check.options.filter(o=>!o.correct).length,2);
      for(const option of check.options.filter(o=>!o.correct))assert.ok(allowed.has(option.label),record.id);
    }
  }
});
test('missing or incomplete Aha curation falls back to meaning instead of borrowing main-question distractors',()=>{
  const record=contexts.wordContexts[0];
  const question=E.makeContextQuestion(words.get(record.id),bank,contexts,()=>.31,0);
  for(const readingDistractors of [undefined,[],record.readingDistractors.slice(0,1),[record.id,'sv-9999']]){
    const incomplete={...contexts,wordContexts:contexts.wordContexts.map(row=>row.id===record.id?{...row,readingDistractors}:row)};
    const check=B.makeCheck(question,{bank,contexts:incomplete,random:()=>.31});
    assert.equal(check.source,'meaning');
    assert.equal(check.options.length,3);
    assert.equal(check.options.filter(o=>o.correct).length,1);
  }
});
test('reading step is not an extra graded question and does not change the original question',()=>{
  const q=E.makeExpressionQuestion(expressions.expressions[0],'medium',()=>.27,'sentence',missionBank);
  const original=JSON.stringify(q);
  const check=run(q);
  assert.equal(B.isCorrect(check,check.options.findIndex(o=>o.correct)),true);
  assert.equal(B.isCorrect(check,check.options.findIndex(o=>!o.correct)),false);
  assert.equal(JSON.stringify(q),original);
});
test('reading helper handles invalid input without crashing',()=>{
  assert.equal(B.makeCheck(null,{bank,contexts,surprises}),null);
  assert.equal(B.isCorrect(null,0),false);
  assert.equal(B.isCorrect(run({...bank.words[0],kind:'word'}),111),false);
});

test('transfer questions are distinct from the original and offer three answers',()=>{
  for(const record of contexts.wordContexts){
    const word=words.get(record.id);
    for(let i=0;i<record.scenes.length;i++){
      const question=E.makeContextQuestion(word,bank,contexts,()=>.63,i);
      const check=B.makeCheck(question,{bank,contexts,surprises,missions:missionBank,random:()=>.81});
      assert.equal(check.options.length,3);
      assert.equal(new Set(check.options.map(x=>x.label)).size,3);
      assert.equal(check.options.filter(x=>x.correct).length,1);
      assert.ok(!check.options.some(x=>x.label===question.stem));
    }
  }
});
test('all expressions have three edited transfer choices',()=>{
  for(const expression of expressions.expressions){
    const question=E.makeExpressionQuestion(expression,'medium',()=>.64,'sentence',missionBank);
    const check=run(question);
    assert.equal(check.source,'expression');
    assert.equal(check.options.length,3);
    assert.notEqual(check.options.find(x=>x.correct).label,question.scene);
  }
});

test('after one incorrect Aha response the learner rereads; after two misses gets an example',()=>{
  assert.equal(B.nextStep(1,false),'reread');
  assert.equal(B.nextStep(2,false),'guided');
  assert.equal(B.nextStep(3,false),'guided');
  assert.equal(B.nextStep(1,true),'complete');
  assert.equal(B.nextStep(2,true),'complete');
});

test('school presentation extracts only a shared instruction and preserves every raw answer and field',()=>{
  const instruction='”Ge två exempel på frukter.”';
  const options=Object.freeze([
    Object.freeze({id:'first',label:instruction+' – Ett äpple och en banan.',correct:true,evidence:'authored'}),
    Object.freeze({id:'second',label:instruction+' – Frukten är rund.',correct:false}),
    Object.freeze({id:'third',label:instruction+' – Ett äpple.',correct:false})
  ]);
  const before=JSON.stringify(options);
  const formatted=B.formatSchoolAnswers(options);
  assert.equal(formatted.instruction,instruction);
  assert.notEqual(formatted.options,options);
  assert.deepEqual(formatted.options.map(option=>option.displayLabel),[
    'Ett äpple och en banan.','Frukten är rund.','Ett äpple.'
  ]);
  formatted.options.forEach((option,index)=>{
    const {displayLabel,...raw}=option;
    assert.notEqual(option,options[index]);
    assert.deepEqual(raw,options[index]);
    assert.equal(B.isCorrect({options:formatted.options},index),options[index].correct);
  });
  assert.equal(JSON.stringify(options),before);
  assert.deepEqual(B.formatSchoolAnswers(options,false),{instruction:'',options});
  assert.equal(B.formatSchoolAnswers(options,false).options,options);
  assert.equal(typeof browser.OrdjaktenReading.formatSchoolAnswers,'function');
});
test('school presentation does not guess at mismatched, missing or empty instruction boundaries',()=>{
  const pair=labels=>labels.map((label,i)=>({label,correct:i===0}));
  for(const options of [
    pair(['”Beskriv katten.” – Den är grå.','”Beskriv hunden.” – Den är brun.']),
    pair(['”Beskriv katten.” – Den är grå.','”Beskriv katten. ” – Den är brun.']),
    pair(['”Beskriv katten.” – Den är grå.','Den är brun.']),
    pair(['”Beskriv katten.” - Den är grå.','”Beskriv katten.” - Den är brun.']),
    pair(['” – Ett svar','” – Ett annat svar']),
    pair(['”” – Ett svar','”” – Ett annat svar']),
    pair(['”Beskriv katten.” – ','”Beskriv katten.” – Den är grå.']),
    [{label:'”Beskriv katten.” – Den är grå.',correct:true},null],
    [{label:123,correct:true}],[],null,undefined
  ]){
    const before=JSON.stringify(options);
    const formatted=B.formatSchoolAnswers(options);
    assert.equal(formatted.instruction,'');
    assert.equal(formatted.options,options);
    assert.equal(JSON.stringify(options),before);
  }
});
test('all school Aha tasks show the instruction once while retaining novelty, evidence and scoring',()=>{
  const schools=expressions.expressions.filter(entry=>entry.category==='school-instruction');
  assert.equal(schools.length,14);
  for(const entry of schools)for(const taskType of ['meaning','sentence']){
    const question=E.makeExpressionQuestion(entry,'medium',()=>.66,taskType,missionBank);
    const original=JSON.stringify(question);
    const check=run(question);
    const formatted=B.formatSchoolAnswers(check.options);
    assert.equal(check.schoolInstruction,true,entry.id);
    assert.ok(formatted.instruction,entry.id);
    assert.equal(check.prompt.split(formatted.instruction).length-1,1,entry.id);
    assert.equal(check.prompt.endsWith(formatted.instruction),true);
    assert.ok(check.options.every(option=>option.displayLabel&&option.label===formatted.instruction+' – '+option.displayLabel));
    assert.equal(check.source,'expression');
    const right=check.options.find(option=>option.correct).label;
    const challenge=surprises.challenges.find(row=>row.id===entry.id);
    const mission=missionBank.missions.find(row=>row.id===entry.id);
    const expected=challenge.options.some(option=>option.correct&&option.label===right)?
      'expression:challenge':'expression:mission';
    assert.equal(check.evidence,expected,entry.id);
    assert.ok([...challenge.options,...mission.sentences].some(option=>option.correct&&option.label===right));
    assert.ok(!question.options.some(option=>option.label===right));
    assert.notEqual(right,question.scene);
    assert.notEqual(right,question.stem);
    check.options.forEach((option,index)=>assert.equal(B.isCorrect(check,index),option.correct));
    const formattedMain={...question,options:B.formatSchoolAnswers(question.options).options};
    assert.deepEqual(run(formattedMain),check);
    assert.equal(JSON.stringify(question),original);
  }
});
