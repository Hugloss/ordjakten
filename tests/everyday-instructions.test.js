'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../public/js/engine');
const Q=require('../public/js/missions');
const B=require('../public/js/reading-check');
const S=require('../public/js/surprises');
const L=require('../public/js/learning-map');
const Aha=require('../public/js/aha-plan');
const F=require('../public/js/focus-practice');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const surprises=require('../public/data/surprises.json');
const contexts=require('../public/data/word-contexts.json');
const everyday=expressions.expressions.filter(entry=>entry.category==='everyday-instruction');
const dependencies={bank,contexts,surprises,missions,reading:B,random:()=>.42};
const replace=(data,key,id,change)=>({...data,[key]:data[key].map(row=>row.id===id?change(row):row)});
const sceneOf=options=>B.formatSchoolAnswers(options).instruction.replace(/^[“”]|[“”]$/g,'').trim();

test('six everyday instructions have complete authored content and remain separate from school tasks',()=>{
  assert.deepEqual(everyday.map(entry=>[entry.id,entry.phrase]),[
    ['ut-0070','Hoppa i overallen'],['ut-0071','Hoppa ner från pallen'],
    ['ut-0072','Släng på dig jackan'],['ut-0073','Slå dig ner'],
    ['ut-0074','Häng med'],['ut-0075','Hoppa över']
  ]);
  assert.deepEqual(E.validateExpressions(expressions),[]);
  assert.deepEqual(Q.validate(missions,expressions),[]);
  assert.deepEqual(S.validate(surprises,expressions),[]);
  for(const entry of everyday){
    const task=Q.get(missions,entry.id);
    for(const type of ['meaning','sentence','order']){
      const q=E.makeExpressionQuestion(entry,'medium',()=>.42,type,missions);
      assert.equal(q.everydayInstruction,true,entry.id);
      assert.equal(q.schoolInstruction,undefined);
      assert.equal(q.instructionRule,entry.instructionRule);
      assert.equal(q.taskType,type);
      if(type==='sentence'){
        assert.equal(q.scene,task.prompt);
        assert.equal(sceneOf(q.options),q.scene,'all answers refer to the visible situation');
        const displayed=B.formatSchoolAnswers(q.options).options;
        assert.ok(displayed.every(option=>option.displayLabel&&!option.displayLabel.includes(q.scene)));
        assert.equal(displayed.filter(option=>option.correct).length,1);
      }
      if(type==='order')assert.deepEqual(q.correctOrder,task.order);
    }
    const exam=E.makeExpressionQuestion(entry,'exam',()=>.42,'sentence',missions);
    assert.equal(exam.taskType,'meaning');
    assert.equal(exam.everydayInstruction,true);
    assert.equal(exam.options.length,5);
    assert.equal(exam.options.filter(option=>option.correct).length,1);
    const focus=F.create(entry.id,'sentence',bank,{},expressions,missions,contexts,E,{},()=>.42);
    assert.ok(focus.questions.every(question=>question.everydayInstruction&&!question.schoolInstruction));
    const focusedSentence=focus.questions.find(question=>question.taskType==='sentence');
    assert.equal(focusedSentence.scene,task.prompt);
    assert.equal(sceneOf(focusedSentence.options),task.prompt);
  }
});

test('instruction feedback explains the displayed main, sentence or order situation',()=>{
  for(const entry of everyday){
    const task=Q.get(missions,entry.id);
    const q=E.makeExpressionQuestion(entry,'medium',()=>.73,'sentence',missions);
    const answer=q.options.find(option=>option.correct);
    const feedback=Q.instructionFeedback(q,answer.label,missions);
    assert.equal(feedback.explanation,task.explanation);
    assert.equal(feedback.connection,task.connection);
    assert.equal(feedback.rule,entry.instructionRule);
    assert.equal(feedback.correction,'');
    assert.equal(feedback.answer,B.formatSchoolAnswers(q.options).options.find(option=>option.correct).displayLabel);
    assert.equal(Q.schoolFeedback(q,answer.label,missions),null,'everyday tasks do not become school tasks');
    for(const option of q.options.filter(option=>!option.correct)){
      assert.equal(Q.instructionFeedback(q,option.label,missions).correction,
        task.sentences.find(sentence=>sentence.label===option.label).feedback);
    }
    const meaning=E.makeExpressionQuestion(entry,'medium',()=>.42,'meaning',missions);
    assert.equal(Q.instructionFeedback(meaning,null,missions).explanation,entry.reveal[0].text);
    assert.equal(Q.instructionFeedback(meaning,null,missions).connection,entry.reveal[1].text);
    const order=E.makeExpressionQuestion(entry,'medium',()=>.42,'order',missions);
    const ordered=Q.instructionFeedback(order,null,missions);
    assert.equal(ordered.explanation,task.orderExplanation);
    assert.equal(ordered.connection,'');
    assert.equal(ordered.answer,task.order.join(' → '));
  }
  const school=expressions.expressions.find(entry=>entry.category==='school-instruction');
  const q=E.makeExpressionQuestion(school,'medium',()=>.42,'sentence',missions);
  assert.deepEqual(Q.instructionFeedback(q,null,missions),Q.schoolFeedback(q,null,missions));
  assert.equal(Q.instructionFeedback(E.makeExpressionQuestion(expressions.expressions[0],'medium'),null,missions),null);
});

test('everyday Aha shows one new situation and three answers without school wording or altered evidence',()=>{
  for(const entry of everyday)for(const type of ['meaning','sentence','order'])for(const value of [.01,.99]){
    const q=E.makeExpressionQuestion(entry,'medium',()=>.42,type,missions);
    const before=JSON.stringify(q);
    const check=B.makeCheck(q,{...dependencies,random:()=>value});
    assert.ok(check,entry.id+' '+type);
    assert.equal(check.everydayInstruction,true);
    assert.equal(check.schoolInstruction,undefined);
    assert.match(check.prompt,/i den här nya situationen/);
    assert.doesNotMatch(check.prompt.split('\n')[0],/följer instruktionen|läraren/i);
    assert.equal(check.options.length,3);
    assert.equal(check.options.filter(option=>option.correct).length,1);
    const formatted=B.formatSchoolAnswers(check.options);
    assert.ok(formatted.instruction);
    assert.equal(check.prompt.split(formatted.instruction).length-1,1);
    assert.ok(check.options.every(option=>option.label===formatted.instruction+' – '+option.displayLabel));
    assert.notEqual(sceneOf(check.options),q.scene);
    assert.ok(check.options.every(option=>!q.options.some(shown=>shown.label===option.label)));
    const challenge=S.getChallenge(surprises,entry.id),task=Q.get(missions,entry.id);
    const right=check.options.find(option=>option.correct).label;
    const fromChallenge=challenge.options.some(option=>option.correct&&option.label===right);
    assert.equal(check.evidence,fromChallenge?'expression:challenge':'expression:mission');
    assert.equal(check.why,fromChallenge?challenge.explanation:task.explanation);
    check.options.forEach((option,index)=>assert.equal(B.isCorrect(check,index),option.correct));
    assert.equal(JSON.stringify(q),before);
  }
});

test('standalone Aha and per-word learning cards preserve everyday meaning without a quiz flag',()=>{
  const catalog=L.catalog(bank,expressions,contexts);
  let progress={};
  const now=1780000000000;
  for(const entry of everyday){
    const item=catalog.find(row=>row.id===entry.id);
    const option=Aha.option(item,{},dependencies);
    assert.ok(option,entry.id);
    assert.equal(option.check.everydayInstruction,true);
    assert.equal(option.check.schoolInstruction,undefined);
    assert.match(option.check.prompt,/nya situationen/);
    progress=B.recordProgress(progress,entry.id,'expression','guided',now,'expression:challenge');
  }
  const plan=Aha.plan(progress,{...dependencies,expressions,now});
  const planned=plan.ready.concat(plan.waiting);
  for(const entry of everyday){
    const item=planned.find(row=>row.id===entry.id);
    assert.ok(item,entry.id);
    assert.equal(item.check.everydayInstruction,true);
    assert.equal(item.check.schoolInstruction,undefined);
    assert.equal(item.check.evidence,'expression:mission','the already seen Aha scene is not repeated');
  }
});

test('validators reject missing explanations, mismatched scenes and lost standalone-Aha categories',()=>{
  const entry=everyday[0],id=entry.id;
  const invalidExpressions=replace(expressions,'expressions',id,row=>({...row,instructionRule:''}));
  assert.ok(E.validateExpressions(invalidExpressions).some(message=>message.includes('sammanhanget')&&message.includes(id)));
  for(const field of ['prompt','explanation','connection','orderExplanation']){
    const invalid=replace(missions,'missions',id,row=>({...row,[field]:''}));
    assert.ok(Q.validate(invalid,expressions).some(message=>message.includes(id)),field);
  }
  const noCorrection=replace(missions,'missions',id,row=>({...row,sentences:row.sentences.map(answer=>({...answer,feedback:''}))}));
  assert.ok(Q.validate(noCorrection,expressions).some(message=>message.includes('svarsspecifik')&&message.includes(id)));
  const differentScene=replace(missions,'missions',id,row=>({...row,prompt:'Det här är en annan situation än den som svaren handlar om.'}));
  assert.ok(Q.validate(differentScene,expressions).some(message=>message.includes('samma synliga situation')&&message.includes(id)));
  const wrongOption=replace(missions,'missions',id,row=>({...row,sentences:row.sentences.map((answer,index)=>index===1?{...answer,label:'”En helt annan situation än de andra.” – Ett annat svar. '}:answer)}));
  assert.ok(Q.validate(wrongOption,expressions).some(message=>message.includes('samma synliga situation')&&message.includes(id)));
  const noCategory=replace(surprises,'challenges',id,row=>({...row,category:undefined}));
  assert.ok(S.validate(noCategory,expressions).some(message=>message.includes('kategori')&&message.includes(id)));
  const wrongAha=replace(surprises,'challenges',id,row=>({...row,ahaDistractor:'”En helt annan situation.” – Ett svar som hör till fel uppgift.'}));
  assert.ok(S.validate(wrongAha,expressions).some(message=>message.includes('tredje svar')&&message.includes(id)));
});

test('Aha never fills missing answers from another situation or repeats the scene already shown',()=>{
  const entry=everyday[0],id=entry.id;
  const sentence=E.makeExpressionQuestion(entry,'medium',()=>.42,'sentence',missions);
  const incomplete=replace(surprises,'challenges',id,row=>({...row,ahaDistractor:'”En helt annan situation.” – Ett svar som hör till fel uppgift.'}));
  assert.equal(B.makeCheck(sentence,{...dependencies,surprises:incomplete}),null);
  const challenge=S.getChallenge(surprises,id);
  const sameScene={...sentence,scene:sceneOf(challenge.options)};
  assert.equal(B.makeCheck(sameScene,dependencies),null,'the mission answers and challenge scene have both already been shown');
});
