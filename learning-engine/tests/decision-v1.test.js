'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Assessment:A,Decisions:D}=require('../index');
const focus={bankId:'physics',skillId:'wave-speed'};
function assessment(status='correct',id='q-1',reviewStatus='reviewed'){
 return A.fromEvaluator({
  ref:{bankId:'physics',id,revision:1},responseSpec:{kind:'numeric'},
  assessmentSpec:{kind:'numeric-exact',expected:42},
  skillIds:['wave-speed'],reviewStatus},{status},{id:'fixture',revision:1});
}
function ledger(){return A.createEvidenceLedger();}
function add(store,id,status='correct',options={}){
 return store.record({attemptId:'attempt:'+id,instanceId:'instance:'+id,
  mode:'test',assistance:'none',difficultyBand:'foundational',
  activityKind:'numeric',observedDay:20000,assessment:assessment(status),
  ...options});
}
function policy(action='practice_similar',reasonCode='needs_reinforcement',target=true,overrides={}){
 return {id:'private-policy',revision:4,async recommend(request){
  return {
   schemaVersion:D.DECISION_VERSION,
   policyRef:{id:'private-policy',revision:4},
   snapshotId:request.snapshotId,focus:request.focus,action,reasonCode,
   ...(target?{target:{bankId:'physics',id:'next-1',revision:1}}:{}),...overrides
  };
 }};
}
test('evidence is descriptive, scoped and has no automatic mastery',()=>{
 const store=ledger();
 add(store,'one','correct',{rawAnswer:'private learner answer'});
 const row=D.evidenceView({entries:store.entries(),focus});
 assert.equal(row.qualifiedIndependentAttempts,1);
 assert.equal(row.distinctQualifiedQuestions,1);
 assert.equal(row.distinctSuccessfulQuestions,1);
 assert.equal(row.distinctObservationDays,1);
 assert.equal(row.byDifficulty.foundational,1);
 assert.equal(row.byActivity.numeric,1);
 assert.equal(row.mastery.level,'unknown');
 assert.equal(JSON.stringify(row).includes('private learner answer'),false);
 assert.equal(JSON.stringify(row).includes('attempt:'),false);
});
test('repeated same item never creates false variety',()=>{
 const store=ledger();
 add(store,'one');add(store,'two');
 add(store,'three','correct',{assessment:assessment('correct','q-2'),observedDay:20001});
 const v=D.evidenceView({entries:store.entries(),focus});
 assert.equal(v.qualifiedIndependentAttempts,3);
 assert.equal(v.distinctQualifiedQuestions,2);
 assert.equal(v.distinctObservationDays,2);
});
test('assisted and unreviewed answers are not independent demonstrations',()=>{
 const store=ledger();
 add(store,'assisted','correct',{assistance:'hint'});
 add(store,'unknown','correct',{assistance:'unknown'});
 add(store,'draft','correct',{assessment:assessment('correct','q-draft','draft')});
 add(store,'wrong','incorrect',{assessment:assessment('incorrect','q-wrong')});
 const v=D.evidenceView({entries:store.entries(),focus});
 assert.equal(v.qualifiedIndependentAttempts,1);
 assert.equal(v.distinctSuccessfulQuestions,0);
 assert.equal(v.unreviewedObservations,1);
 assert.equal(v.byAssistance.hint,1);
 assert.equal(v.byLevel.incorrect,1);
});
test('ungraded and pending are neither failures nor evidence of mastery',()=>{
 const store=ledger();add(store,'pending','needs-review',{assessment:assessment('needs-review')});
 add(store,'ungraded','ungraded',{assessment:assessment('ungraded')});
 const view=D.evidenceView({entries:store.entries(),focus});
 assert.equal(view.qualifiedIndependentAttempts,0);
 assert.equal(view.byLevel.incorrect,0);
 assert.equal(view.byOutcome.ungraded,1);
 assert.equal(view.byOutcome['needs-review'],1);
});
test('private policy supplies next question, public engine does not choose it',async()=>{
 const store=ledger();add(store,'one');
 let observed;
 const implementation=policy();
 const delegate=implementation.recommend;
 implementation.recommend=async req=>{observed=req;return delegate(req)};
 const decision=await D.createCoordinator(implementation).recommend({
  entries:store.entries(),focus,snapshotId:'snapshot-1'});
 assert.equal(decision.action,'practice_similar');
 assert.equal(decision.target.id,'next-1');
 assert.equal(observed.evidence.distinctQualifiedQuestions,1);
 assert.equal(observed.evidence.mastery.level,'unknown');
});
test('private policy alone may decide to increase difficulty',async()=>{
 const result=await D.createCoordinator(policy('increase_difficulty',
  'ready_for_challenge')).recommend({entries:[],focus,snapshotId:'snap-2'});
 assert.equal(result.action,'increase_difficulty');
 assert.equal(result.policyRef.revision,4);
});
test('no policy yields a hold, never a guessed next question',async()=>{
 const outcome=await D.createCoordinator().recommend({entries:[],focus,snapshotId:'snap-3'});
 assert.equal(outcome.reasonCode,'policy_unavailable');
 assert.equal('target' in outcome,false);
});
test('unfinished examination never calls private policy',async()=>{
 let called=0;
 const port=policy();
 port.recommend=async()=>{called++;return null};
 for(const sessionStatus of ['in-progress','aborted']){
  const decision=await D.createCoordinator(port).recommend({
   entries:[],focus,snapshotId:'snap-4',sessionStatus});
  assert.equal(decision.reasonCode,'session_not_complete');
  assert.equal('target' in decision,false);
 }
 assert.equal(called,0);
});
test('private policy failure is a safe abstention without exposing error strings',async()=>{
 const port={id:'private-policy',revision:4,
  async recommend(){throw new Error('private database secret')}};
 const result=await D.createCoordinator(port).recommend({
  entries:[],focus,snapshotId:'snap-5'});
 assert.equal(result.reasonCode,'policy_unavailable');
 assert.equal(JSON.stringify(result).includes('secret'),false);
});
test('bad policy revision, stale snapshot, invalid reason and answer leaks are rejected',async()=>{
 const invalid=[
  {snapshotId:'older'},
  {policyRef:{id:'another-policy',revision:4}},
  {reasonCode:'insufficient_evidence'},
  {correctAnswer:'hidden-key'},
  {target:{bankId:'medicine',id:'not-admitted',revision:1}}
 ];
 for(const override of invalid){
  await assert.rejects(()=>D.createCoordinator(policy('increase_difficulty',
   'ready_for_challenge',true,override)).recommend({
    entries:[],focus,snapshotId:'snap-6'}));
 }
});
test('hold and manual-review decisions cannot choose a question',async()=>{
 await assert.rejects(()=>D.createCoordinator(policy('hold',
  'insufficient_evidence')).recommend({entries:[],focus,snapshotId:'snap-7'}));
 await assert.rejects(()=>D.createCoordinator(policy('manual_review',
  'needs_review')).recommend({entries:[],focus,snapshotId:'snap-7'}));
});
test('cross-bank target is allowed only by explicit server scope',async()=>{
 const p=policy('practice_prerequisite','prerequisite_needed',true,
  {target:{bankId:'math',id:'fraction-1',revision:1}});
 const coordinator=D.createCoordinator(p);
 await assert.rejects(()=>coordinator.recommend({entries:[],focus,
  snapshotId:'snap-8'}),/outside admitted/);
 const result=await coordinator.recommend({entries:[],focus,snapshotId:'snap-8',
  allowedBankIds:['physics','math']});
 assert.equal(result.target.bankId,'math');
});
test('tampered observations and duplicate attempts do not inflate learning evidence',()=>{
 const store=ledger();add(store,'once');
 assert.throws(()=>D.evidenceView({entries:[...store.entries(),...store.entries()],focus}),
  /Duplicate attempt/);
 const bad=store.entries();bad[0].evaluation.level='invented';
 assert.throws(()=>D.evidenceView({entries:bad,focus}),/Invalid graded/);
 const wrong=store.entries();wrong[0].difficultyBand='some secret!';
 assert.throws(()=>D.evidenceView({entries:wrong,focus}),/difficulty/);
});
