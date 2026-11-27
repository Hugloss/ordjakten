'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../public/js/engine');
const Q=require('../public/js/missions');
const B=require('../public/js/reading-check');
const F=require('../public/js/focus-practice');
const Aha=require('../public/js/aha-plan');
const D=require('../public/js/adaptive');
const Memory=require('../public/js/spaced-memory');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const authored=require('../public/data/missions.json');
const surprises=require('../public/data/surprises.json');
const contexts=require('../public/data/word-contexts.json');
const entry=expressions.expressions.find(row=>row.id==='ut-0074');
const NOW=1780000000000,DAY=86400000;
const scene=(suffix,kind,prompt,clue,definition,answer)=>({
  id:entry.id+'-'+suffix,kind,prompt,clue,definition,
  explanation:'Orden i den här situationen visar varför just det här svaret passar.',
  connection:'I en annan situation kan samma uttryck ha en annan betydelse.',
  rule:'Om det saknas ledtrådar kan du fråga vad personen menar.',
  options:[{label:answer,correct:true},
    {label:'Det här svaret hör till en annan situation.',correct:false,feedback:'Den tolkningen följer inte ledtråden i just den här situationen.'},
    {label:'Det här svaret gissar utan stöd i berättelsen.',correct:false,feedback:'Berättelsen ger inget stöd för just den tolkningen.'}]
});
const mission={...authored.missions.find(row=>row.id===entry.id),
  contextReading:'Läs hela situationen. Samma uttryck kan betyda olika saker. Ibland behöver du fråga.',
  contextScenes:[
    scene('follow','meaning','Alva ska gå till parken och säger: Häng med mig, så går vi tillsammans.','till parken','Här bjuder Alva med någon till parken.','Följ med Alva till parken.'),
    scene('understand','meaning','Alva förklarar spelreglerna och frågar: Hänger du med i det jag berättar?','spelreglerna','Här frågar Alva om någon förstår förklaringen.','Berätta om du förstår spelreglerna.'),
    scene('ask','clarify','Alva säger bara: Häng med. Det hörs inte vad de pratade om innan.','Häng med','Här saknas information för att veta vilken betydelse Alva menar.','Fråga Alva vad hon menar med uttrycket.')]
};
const data={missions:authored.missions.map(row=>row.id===entry.id?mission:row)};
const deps={bank,contexts,surprises,missions:data,reading:B,random:()=>.27};
const make=id=>E.makeExpressionQuestion(entry,'medium',()=>.27,'sentence',data,id);
const edited=change=>({missions:data.missions.map(row=>row.id===entry.id?change(structuredClone(row)):row)});

test('a sentence question uses the selected context meaning and its own teaching throughout',()=>{
  const original=JSON.stringify(mission);
  for(const authoredScene of mission.contextScenes){
    const q=make(authoredScene.id);
    assert.equal(q.id,entry.id);
    assert.equal(q.taskType,'sentence');
    assert.equal(q.everydayInstruction,true);
    assert.equal(q.contextSceneId,authoredScene.id);
    assert.equal(q.contextClarification,authoredScene.kind==='clarify');
    assert.equal(q.scene,authoredScene.prompt);
    assert.equal(q.definition,authoredScene.definition);
    assert.notEqual(q.definition,entry.definition);
    assert.equal(q.example,authoredScene.prompt);
    assert.equal(q.reveal[0].text,authoredScene.explanation);
    assert.equal(q.contextClue,authoredScene.clue);
    assert.equal(q.contextReading,mission.contextReading);
    assert.equal(q.options.filter(o=>o.correct).length,1);
    const short=B.formatSchoolAnswers(q.options);
    assert.equal(short.instruction,'”'+authoredScene.prompt+'”');
    assert.deepEqual(short.options.map(o=>o.displayLabel).sort(),authoredScene.options.map(o=>o.label).sort());
    for(const option of q.options){
      const selected=authoredScene.options.find(o=>'”'+authoredScene.prompt+'” – '+o.label===option.label);
      const feedback=Q.instructionFeedback(q,option.label,data);
      assert.equal(feedback.answer,authoredScene.options.find(o=>o.correct).label);
      assert.equal(feedback.clue,authoredScene.clue);
      assert.equal(feedback.explanation,authoredScene.explanation);
      assert.equal(feedback.connection,authoredScene.connection);
      assert.equal(feedback.rule,authoredScene.rule);
      assert.equal(feedback.correction,selected.correct?'':selected.feedback);
    }
  }
  assert.equal(JSON.stringify(mission),original);
  const canonical=E.makeExpressionQuestion(entry,'medium',()=>.27,'meaning',data);
  assert.equal(canonical.definition,entry.definition);
  assert.equal(canonical.contextSceneId,undefined);
  const exam=E.makeExpressionQuestion(entry,'exam',()=>.27,'sentence',data);
  assert.equal(exam.taskType,'meaning');
  assert.equal(exam.options.length,5);
});

test('focused sentence practice covers two meanings and one clarifying question exactly once',()=>{
  for(const random of [()=>.01,()=>.7,()=>.99]){
    const plan=F.create(entry.id,'sentence',bank,{},expressions,data,contexts,E,{},random);
    assert.equal(plan.chosen,'sentence');
    assert.equal(plan.questions.length,3);
    assert.ok(plan.questions.every(q=>q.id===entry.id&&q.taskType==='sentence'));
    assert.deepEqual(plan.questions.map(q=>q.contextSceneId).sort(),mission.contextScenes.map(s=>s.id).sort());
    assert.equal(new Set(plan.questions.map(q=>q.focusKey)).size,3);
    assert.equal(plan.questions.filter(q=>q.contextClarification).length,1);
    const asking=plan.questions.find(q=>q.contextClarification);
    const progress=D.record({},asking,'right',NOW);
    assert.equal(progress[entry.id].skills.sentence.right,1);
    assert.equal(progress[entry.id].skills.meaning,undefined,'asking is not a definition answer');
  }
});

test('Aha changes to a different resolved context and never preteaches its answer',()=>{
  for(const authoredScene of mission.contextScenes)for(const random of [()=>.01,()=>.99]){
    const q=make(authoredScene.id),check=B.makeCheck(q,{...deps,random});
    const target=Q.contextScene(data,entry.id,check.contextSceneId);
    assert.equal(target.kind,'meaning','an unresolved situation cannot establish transfer evidence');
    assert.notEqual(target.id,authoredScene.id);
    assert.notEqual(target.prompt,q.scene);
    assert.equal(check.evidence,'expression:context:'+target.id);
    assert.equal(check.definition,target.definition);
    assert.equal(check.contextReading,mission.contextReading);
    assert.equal(check.clue,target.clue);
    assert.ok(check.why.includes(target.explanation));
    assert.ok(check.why.includes(target.connection));
    assert.equal(check.options.length,3);
    assert.equal(check.options.filter(o=>o.correct).length,1);
    assert.ok(check.options.every(o=>o.label==='”'+target.prompt+'” – '+o.displayLabel));
  }
  const item={id:entry.id,name:entry.phrase,kind:'expression',definition:entry.definition};
  const standalone=Aha.option(item,{},deps);
  assert.equal(standalone.definition,mission.contextReading);
  assert.notEqual(standalone.definition,standalone.check.definition);
  const progress=B.recordProgress({},entry.id,'expression','guided',NOW,standalone.check.evidence);
  const next=Aha.option(item,progress,deps);
  assert.notEqual(next.check.evidence,standalone.check.evidence);
  assert.equal(next.dueAt,NOW+DAY);
});

test('context evidence survives storage and spacing without crossing expression identities',()=>{
  const first='expression:context:'+mission.contextScenes[0].id,second='expression:context:'+mission.contextScenes[1].id;
  let progress=B.recordProgress({},entry.id,'expression','guided',NOW,first);
  progress=B.recordProgress(progress,entry.id,'expression','first',NOW+DAY,second);
  assert.equal(progress[entry.id].transfer.quality,1);
  progress=B.recordProgress(progress,entry.id,'expression','first',NOW+2*DAY,second);
  assert.equal(progress[entry.id].transfer.quality,1,'repeating one scene is not different evidence');
  progress=B.recordProgress(progress,entry.id,'expression','first',NOW+3*DAY,first);
  assert.equal(progress[entry.id].transfer.quality,2);
  assert.equal(progress[entry.id].transfer.memory.evidence,first);
  assert.equal(JSON.stringify(B.sanitizeProgress(progress)),JSON.stringify(progress));
  const poisoned=structuredClone(progress);
  poisoned[entry.id].transfer.proofs=['expression:context:ut-0075-follow'];
  poisoned[entry.id].transfer.lastEvidence='expression:context:ut-0075-follow';
  poisoned[entry.id].transfer.memory.evidence='expression:context:ut-0075-follow';
  const safe=B.sanitizeProgress(poisoned)[entry.id].transfer;
  assert.equal(safe.quality,0);
  assert.equal(safe.lastEvidence,undefined);
  assert.equal(safe.memory,undefined);
  assert.equal(Memory.sanitize(poisoned[entry.id].transfer.memory,{evidenceRequired:true,expressionId:entry.id}),null);
  for(const bad of ['expression:context:ut-0074-'+ 'x'.repeat(40),'expression:context:ut-0075-follow','expression:context:../../file']){
    const recorded=B.recordProgress({},entry.id,'expression','first',NOW,bad)[entry.id].transfer;
    assert.equal(recorded.quality,undefined);
    assert.equal(recorded.memory,undefined);
  }
  const legacy=B.recordProgress({},entry.id,'expression','guided',NOW,'expression:challenge');
  assert.equal(B.sanitizeProgress(legacy)[entry.id].transfer.memory.evidence,'expression:challenge');
});

test('malformed or foreign contexts fail closed without reverting to another meaning',()=>{
  assert.deepEqual(E.validateExpressionContexts(mission),[]);
  const changes=[
    m=>{m.contextReading='';},m=>{m.contextScenes.pop();},m=>{m.contextScenes[2].kind='meaning';},
    m=>{m.contextScenes[0].id='ut-9999-follow';},m=>{m.contextScenes[1].id=m.contextScenes[0].id;},
    m=>{m.contextScenes[1].prompt=m.contextScenes[0].prompt;},m=>{m.contextScenes[0].clue='This text is absent';},
    m=>{m.contextScenes[0].definition='';},m=>{m.contextScenes[0].options[0].correct=false;},
    m=>{m.contextScenes[0].options[1].label=m.contextScenes[0].options[0].label;},
    m=>{delete m.contextScenes[0].options[1].feedback;},m=>{m.contextScenes={};}
  ];
  for(const change of changes){
    const invalid=edited(m=>{change(m);return m;});
    assert.ok(Q.validate(invalid,expressions).some(issue=>issue.includes(entry.id)));
    assert.deepEqual(Q.contextScenes(invalid,entry.id),[]);
    assert.throws(()=>E.makeExpressionQuestion(entry,'medium',()=>.2,'sentence',invalid));
    assert.equal(B.makeCheck({...make(mission.contextScenes[0].id)},{...deps,missions:invalid}),null);
  }
  assert.throws(()=>make('ut-9999-follow'));
  assert.equal(Q.instructionFeedback({...make(mission.contextScenes[0].id),contextSceneId:'ut-9999-follow'},null,data),null);
  assert.equal(Q.instructionFeedback({...make(mission.contextScenes[0].id),scene:'A different story'},null,data),null);
});

test('published context lessons contain two distinct meanings and one explicit request for clarification',()=>{
  const lessons=authored.missions.filter(row=>Object.hasOwn(row,'contextScenes'));
  assert.ok(lessons.length>0);
  for(const lesson of lessons){
    assert.deepEqual(E.validateExpressionContexts(lesson),[],lesson.id);
    assert.equal(new Set(lesson.contextScenes.filter(s=>s.kind==='meaning').map(s=>s.definition)).size,2);
    const expression=expressions.expressions.find(row=>row.id===lesson.id);
    const plan=F.create(lesson.id,'sentence',bank,{},expressions,authored,contexts,E,{},()=>.42);
    assert.equal(plan.questions.filter(q=>q.contextClarification).length,1);
    for(const q of plan.questions){
      const check=B.makeCheck(q,{bank,contexts,surprises,missions:authored,random:()=>.42});
      assert.equal(Q.contextScene(authored,expression.id,check.contextSceneId).kind,'meaning');
    }
  }
});
