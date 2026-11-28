'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Assessment=require('../public/js/assessment-v1');
const Platform=require('../public/js/question-platform');
const Session=require('../public/js/question-session');

function makeQuestion({id='rubric-001',rubric=true}={}){
  return {
    ref:{bankId:'physics',id,revision:3},
    prompt:'Explain the wave-speed calculation',
    skillIds:['wave-speed'],
    reviewStatus:'reviewed',
    responseSpec:{kind:'reasoning'},
    assessmentSpec:{kind:'reasoning',
      policyId:'wave-speed-assessment',policyRevision:2,
      ...(rubric?{rubric:{id:'wave-speed-rubric',revision:2,criteria:[
        {id:'method',description:'Correct method'},
        {id:'units',description:'Correct units'}
      ]}}:{})
    }
  };
}
function registryFor(grader,question=makeQuestion()){
  const registry=Platform.createRegistry();
  registry.registerEvaluator('reasoning',{id:'reviewed-reasoning',revision:2,
    supportsRubric:true,validate(){},grade:grader});
  registry.register({
    describe:()=>({bankId:question.ref.bankId,revision:1}),
    listQuestionIds:()=>[question.ref.id],
    getQuestion:id=>id===question.ref.id?question:null
  });
  return registry;
}
test('ordinary deterministic evaluation keeps the old API and adds versioned evidence',()=>{
  const q=makeQuestion({rubric:false});
  q.responseSpec={kind:'numeric'};
  q.assessmentSpec={kind:'numeric-exact',expected:42,policyId:'numeric-check',policyRevision:1};
  const bank={describe:()=>({bankId:'physics',revision:1}),
    listQuestionIds:()=>[q.ref.id],getQuestion:()=>q};
  const registry=Platform.createRegistry();registry.register(bank);
  assert.deepEqual(registry.assess(q.ref,42),{status:'correct'});
  const detailed=registry.assessDetailed(q.ref,'42');
  assert.equal(detailed.schemaVersion,'learning-assessment.v1');
  assert.equal(detailed.outcome,'completed');
  assert.equal(detailed.evaluation.level,'correct');
  assert.deepEqual(detailed.evaluation.criteria,[]);
  assert.deepEqual(detailed.assessmentRef,
    {bankId:'physics',id:'numeric-check',revision:1});
  assert.equal(detailed.evaluator.source,'deterministic');
  assert.equal(JSON.stringify(detailed).includes('expected'),false);
  assert.equal(registry.assessDetailed(q.ref,'forty-two').outcome,'invalid');
});
test('multi-criteria rubric preserves a partial result and its independently named grades',()=>{
  const q=makeQuestion();
  const registry=registryFor(()=>({status:'partial',level:'limited',
    criteria:[{id:'units',level:'incorrect',reason:'Unit absent'},
      {id:'method',level:'correct'}]}),q);
  const result=registry.assessDetailed(q.ref,'worked answer');
  assert.equal(result.status,'partial');
  assert.equal(result.evaluation.level,'limited');
  assert.deepEqual(result.evaluation.criteria.map(x=>x.id),['method','units']);
  assert.deepEqual(result.evidence.skillIds,['wave-speed']);
  assert.equal(result.assessmentRef.revision,2);
  assert.deepEqual(result.rubricRef,{id:'wave-speed-rubric',revision:2});
  assert.equal(result.evaluator.source,'plugin');
});
test('rubric cannot silently accept missing, duplicated or invented criteria or failed essentials',()=>{
  const cases=[
    {status:'correct',criteria:[{id:'method',level:'correct'}]},
    {status:'correct',criteria:[{id:'method',level:'correct'},{id:'method',level:'correct'}]},
    {status:'correct',criteria:[{id:'method',level:'correct'},{id:'other',level:'correct'}]},
    {status:'correct',criteria:[{id:'method',level:'correct'},{id:'units',level:'incorrect'}]},
    {status:'partial',level:'excellent',criteria:[{id:'method',level:'correct'},{id:'units',level:'partial'}]},
    {status:'needs-review',level:'correct'},
    {status:'correct',level:'magic',criteria:[{id:'method',level:'correct'},{id:'units',level:'correct'}]}
  ];
  for(const raw of cases){
    const reg=registryFor(()=>raw);
    assert.throws(()=>reg.assessDetailed(makeQuestion().ref,'a'),/rubric|criterion|criteria|grade|Inconsistent|Unassessed|pass/i);
  }
  const wrongDefinition=makeQuestion();
  wrongDefinition.assessmentSpec.rubric.criteria[1].id='method';
  assert.throws(()=>registryFor(()=>({status:'correct'}),wrongDefinition),/duplicate rubric criterion/);
});
test('pending, ungraded and invalid are not wrong answers, and never become mastery',()=>{
  const choices=['needs-review','ungraded','incomplete','invalid'];
  for(const status of choices){
    const result=registryFor(()=>({status})).assessDetailed(makeQuestion().ref,'submitted');
    assert.equal(result.outcome,status);
    assert.equal(result.evaluation.level,null);
    assert.equal(Assessment.summarize([result]).byLevel.incorrect,0);
  }
  const ledger=Assessment.createEvidenceLedger();
  assert.equal(ledger.report().mastery.level,'unknown');
});
test('session summaries classify partial, reviewed and incorrect separately',()=>{
  const refs=['a','b','c','d'].map(id=>({bankId:'physics',id:'question-'+id,revision:1}));
  const registry=Platform.createRegistry();
  let n=0;
  registry.registerEvaluator('reasoning',{id:'rubric-check',revision:1,
    validate(){},grade:()=>({status:['correct','partial','incorrect','needs-review'][n++]})});
  registry.register({describe:()=>({bankId:'physics',revision:1}),
    listQuestionIds:()=>refs.map(x=>x.id),
    getQuestion:id=>({
      ref:refs.find(x=>x.id===id),prompt:'Why?',skillIds:['reasoning'],
      responseSpec:{kind:'reasoning'},assessmentSpec:{kind:'reasoning'}
    })
  });
  const exam=Session.create(registry,{mode:'test',refs,sessionId:'graded-session'});
  for(const ref of refs){
    assert.deepEqual(exam.answer('answer'),{accepted:true,feedback:null});
    assert.equal(JSON.stringify(exam.snapshot()).includes('partial'),false);
    exam.next();
  }
  const complete=exam.finish();
  assert.equal(complete.correct,1);
  assert.equal(complete.incorrect,1);
  assert.equal(complete.partial,1);
  assert.equal(complete.needsReview,1);
  assert.equal(complete.ungraded,0);
  assert.deepEqual(complete.outcomes.map(x=>x.status),
    ['correct','partial','incorrect','needs-review']);
  assert.equal(complete.assessments.length,4);
  assert.equal(complete.assessmentSummary.byOutcome['needs-review'],1);
  assert.equal(complete.assessmentSummary.mastery.level,'unknown');
  assert.equal(complete.evidence.length,4);
  assert.equal(complete.evidence[0].assistance,'unknown');
});
test('evidence ledger is duplicate-safe, privacy-minimal and does not invent proficiency',()=>{
  const q=makeQuestion({rubric:false});
  const registry=registryFor(()=>({status:'correct'}),q);
  const result=registry.assessDetailed(q.ref,'sensitive free-text response');
  const ledger=Assessment.createEvidenceLedger();
  const record={attemptId:'session:1',instanceId:'instance:1',
    mode:'test',assistance:'none',assessment:result};
  const entry=ledger.record(record);
  assert.equal(entry.evaluation.level,'correct');
  assert.equal(JSON.stringify(entry).includes('sensitive'),false);
  assert.equal(JSON.stringify(entry).includes('answer'),false);
  assert.throws(()=>ledger.record(record),/Duplicate/);
  entry.evaluation.level='incorrect';
  assert.equal(ledger.entries()[0].evaluation.level,'correct');
  assert.equal(ledger.report({bankId:'physics',skillId:'wave-speed'}).qualifiedIndependentAttempts,1);
  assert.equal(ledger.report().distinctReviewedQuestions,1);
  assert.equal(ledger.report().mastery.level,'unknown');
  assert.throws(()=>ledger.record({...record,attemptId:'session:2',assistance:'unknown-answer'}),/assistance/);
});
test('invalid and incomplete submissions cannot finish or pollute an examination',()=>{
  const q=makeQuestion({rubric:false});
  let state='incomplete';
  const registry=registryFor(()=>({status:state}),q);
  const exam=Session.create(registry,{mode:'test',refs:[q.ref]});
  assert.deepEqual(exam.answer('wait'),{accepted:false,feedback:null});
  assert.equal(exam.snapshot().answered,0);
  assert.throws(()=>exam.finish(),/unanswered/);
  state='correct';
  assert.deepEqual(exam.answer('answer'),{accepted:true,feedback:null});
  exam.next();
  assert.equal(exam.finish().assessmentSummary.byLevel.correct,1);
});
test('tampered evidence cannot forge a bank, rubric, reason or completion grade',()=>{
  const q=makeQuestion({rubric:false});
  const valid=registryFor(()=>({status:'correct'}),q).assessDetailed(q.ref,'a');
  const altered=patch=>Object.assign(JSON.parse(JSON.stringify(valid)),patch);
  assert.throws(()=>Assessment.validateResult(altered({
    assessmentRef:{...valid.assessmentRef,bankId:'svenska'}
  })),/provenance/);
  assert.throws(()=>Assessment.validateResult(altered({
    evaluation:{level:'correct',criteria:[{id:'extra',level:'correct'}]}
  })),/Rubric evidence/);
  assert.throws(()=>Assessment.validateResult(altered({
    rubricRef:{id:'rubric',revision:1}
  })),/Rubric evidence/);
  assert.throws(()=>Assessment.validateResult(altered({
    evaluation:{level:'correct',criteria:[],reason:'x'.repeat(501)}
  })),/explanation/);
  const ungraded=registryFor(()=>({status:'needs-review'}),q)
    .assessDetailed(q.ref,'a');
  ungraded.evaluation.criteria=[{id:'invented',level:'correct'}];
  assert.throws(()=>Assessment.validateResult(ungraded),/Rubric evidence/);
});
