/* Public learning core: safe evidence summaries and a private policy decision port. */
'use strict';
const EVIDENCE_VERSION='learning-evidence.v1';
const DECISION_VERSION='learning-decision.v1';
const OUTCOMES=['completed','incomplete','invalid','ungraded','needs-review'];
const LEVELS=['incorrect','limited','partial','correct','excellent'];
const ASSISTANCE=['none','hint','retry','revealed','unknown'];
const REASONS=Object.freeze({
 practice_similar:['needs_reinforcement','assistance_observed','unseen_skill'],
 practice_prerequisite:['prerequisite_needed'],
 increase_difficulty:['ready_for_challenge'],
 spaced_review:['review_due'],
 continue:['continue_sequence'],
 hold:['insufficient_evidence','policy_unavailable','session_not_complete',
  'no_eligible_question','safety_hold'],
 manual_review:['needs_review']
});
const TOKEN=/^[a-z][a-z0-9-]{1,95}$/;
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const isToken=x=>typeof x==='string'&&TOKEN.test(x);
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const copy=x=>JSON.parse(JSON.stringify(x));
const onlyKeys=(o,keys)=>isObject(o)&&Object.keys(o).every(k=>keys.includes(k));
const counters=keys=>Object.fromEntries(keys.map(k=>[k,0]));

function validateRef(ref){
 assert(onlyKeys(ref,['bankId','id','revision'])&&isToken(ref.bankId)&&
  isToken(ref.id)&&Number.isSafeInteger(ref.revision)&&ref.revision>=1,
  'Invalid bank-scoped question reference');
 return ref;
}
function validateFocus(focus){
 assert(onlyKeys(focus,['bankId','skillId'])&&isToken(focus.bankId)&&
  isToken(focus.skillId),'Invalid learning focus');
 return focus;
}
function validateEvidence(row){
 assert(isObject(row)&&row.schemaVersion===EVIDENCE_VERSION&&
  typeof row.attemptId==='string'&&row.attemptId.length>0&&
  row.attemptId.length<=160&&typeof row.instanceId==='string'&&
  row.instanceId.length>0&&row.instanceId.length<=160&&
  isToken(row.mode)&&ASSISTANCE.includes(row.assistance)&&
  Array.isArray(row.skillIds)&&row.skillIds.length>0&&
  row.skillIds.every(isToken)&&typeof row.reviewStatus==='string'&&
  row.reviewStatus.length>0&&row.reviewStatus.length<=64&&
  OUTCOMES.includes(row.outcome)&&isObject(row.evaluation)&&
  Array.isArray(row.evaluation.criteria)&&
  row.evaluation.criteria.every(c=>isObject(c)&&isToken(c.id)&&
    LEVELS.includes(c.level)),'Invalid learning evidence');
 validateRef(row.questionRef);
 assert(onlyKeys(row.assessmentRef,['bankId','id','revision'])&&
  isToken(row.assessmentRef.bankId)&&isToken(row.assessmentRef.id)&&
  Number.isSafeInteger(row.assessmentRef.revision)&&row.assessmentRef.revision>=1&&
  row.assessmentRef.bankId===row.questionRef.bankId,
  'Invalid evidence assessment provenance');
 assert(onlyKeys(row.evaluator,['id','revision','source'])&&
  isToken(row.evaluator.id)&&Number.isSafeInteger(row.evaluator.revision)&&
  row.evaluator.revision>=1&&['deterministic','plugin'].includes(row.evaluator.source),
  'Invalid evidence evaluator provenance');
 if(row.rubricRef!==undefined)
  assert(onlyKeys(row.rubricRef,['id','revision'])&&isToken(row.rubricRef.id)&&
   Number.isSafeInteger(row.rubricRef.revision)&&row.rubricRef.revision>=1,
   'Invalid evidence rubric provenance');
 assert((row.evaluation.criteria.length===0||row.rubricRef!==undefined)&&
  (row.outcome==='completed'||row.evaluation.criteria.length===0),
  'Invalid evidence rubric criteria');
 assert(row.outcome==='completed'?
  LEVELS.includes(row.evaluation.level):row.evaluation.level===null,
  'Invalid graded or ungraded evidence');
 if(row.difficultyBand!==undefined)
  assert(isToken(row.difficultyBand)&&row.difficultyBand.length<=64,
   'Invalid evidence difficulty band');
 if(row.activityKind!==undefined)
  assert(isToken(row.activityKind)&&row.activityKind.length<=64,
   'Invalid evidence activity kind');
 if(row.observedDay!==undefined)
  assert(Number.isSafeInteger(row.observedDay)&&row.observedDay>=0&&
   row.observedDay<=200000,'Invalid evidence day');
 return row;
}
// Aggregate observations without inventing mastery or proprietary selection.
function evidenceView({entries,focus}){
 validateFocus(focus);
 assert(Array.isArray(entries)&&entries.length<=20000,'Invalid evidence population');
 const seen=new Set(),qualified=new Set(),successes=new Set(),days=new Set();
 const byOutcome=counters(OUTCOMES),byLevel=counters(LEVELS),
  qualifiedByLevel=counters(LEVELS),byAssistance=counters(ASSISTANCE);
 const byDifficulty=Object.create(null),byActivity=Object.create(null),
  criterionNeeds=Object.create(null);
 let observed=0,independent=0,unreviewed=0,knownDay=0,latestIndependentDay=null;
 for(const row of entries){
  validateEvidence(row);
  assert(!seen.has(row.attemptId),'Duplicate attempt evidence');
  seen.add(row.attemptId);
  if(row.questionRef.bankId!==focus.bankId||!row.skillIds.includes(focus.skillId))continue;
  observed+=1;
  byOutcome[row.outcome]+=1;
  byAssistance[row.assistance]+=1;
  if(row.evaluation.level!==null)byLevel[row.evaluation.level]+=1;
  if(row.difficultyBand!==undefined)
   byDifficulty[row.difficultyBand]=(byDifficulty[row.difficultyBand]||0)+1;
  if(row.activityKind!==undefined)
   byActivity[row.activityKind]=(byActivity[row.activityKind]||0)+1;
  const reviewed=['reviewed','published'].includes(row.reviewStatus);
  if(!reviewed)unreviewed+=1;
  if(!reviewed||row.assistance!=='none'||row.outcome!=='completed')continue;
  independent+=1;
  qualifiedByLevel[row.evaluation.level]+=1;
  const ref=row.questionRef;
  const key=ref.bankId+'/'+ref.id+'/'+ref.revision;
  qualified.add(key);
  if(['correct','excellent'].includes(row.evaluation.level))successes.add(key);
  if(row.observedDay!==undefined){
   days.add(row.observedDay);knownDay+=1;
   latestIndependentDay=latestIndependentDay===null?
     row.observedDay:Math.max(latestIndependentDay,row.observedDay);
  }
  for(const criterion of row.evaluation.criteria)
   if(!['correct','excellent'].includes(criterion.level))
    criterionNeeds[criterion.id]=(criterionNeeds[criterion.id]||0)+1;
 }
 return {
  schemaVersion:'learning-evidence-view.v1',focus:copy(focus),
  observedAttempts:observed,byOutcome,byLevel,qualifiedByLevel,byAssistance,
  byDifficulty:{...byDifficulty},byActivity:{...byActivity},
  unreviewedObservations:unreviewed,
  qualifiedIndependentAttempts:independent,
  distinctQualifiedQuestions:qualified.size,
  distinctSuccessfulQuestions:successes.size,
  knownObservationDays:knownDay,distinctObservationDays:days.size,
  latestIndependentDay,
  criterionNeeds:{...criterionNeeds},
  mastery:{level:'unknown',confidence:'insufficient',
   reason:'Requires an independently qualified bank-specific policy'}
 };
}
function validateDecision(row,expected){
 assert(onlyKeys(row,['schemaVersion','policyRef','snapshotId','focus',
  'action','reasonCode','target'])&&row.schemaVersion===DECISION_VERSION,
  'Invalid private policy decision envelope');
 assert(onlyKeys(row.policyRef,['id','revision'])&&isToken(row.policyRef.id)&&
  Number.isSafeInteger(row.policyRef.revision)&&row.policyRef.revision>=1,
  'Invalid decision policy reference');
 assert(row.snapshotId===expected.snapshotId&&
  row.policyRef.id===expected.policyRef.id&&
  row.policyRef.revision===expected.policyRef.revision,
  'Stale or mismatched private policy decision');
 validateFocus(row.focus);
 assert(row.focus.bankId===expected.focus.bankId&&
  row.focus.skillId===expected.focus.skillId,'Decision focus mismatch');
 assert(Object.hasOwn(REASONS,row.action)&&
  REASONS[row.action].includes(row.reasonCode),'Invalid decision action or reason');
 if(['hold','manual_review'].includes(row.action)){
  assert(row.target===undefined,'Non-selecting decision cannot contain a target');
 }else{
  validateRef(row.target);
  assert(expected.allowedBankIds.includes(row.target.bankId),
   'Decision selected a question outside admitted banks');
 }
 return copy(row);
}
function hold(reasonCode,snapshotId,focus){
 return {schemaVersion:DECISION_VERSION,
  policyRef:{id:'public-fallback',revision:1},snapshotId,
  focus:copy(focus),action:'hold',reasonCode};
}
function createCoordinator(policyPort=null){
 if(policyPort!==null)
  assert(isObject(policyPort)&&isToken(policyPort.id)&&
   Number.isSafeInteger(policyPort.revision)&&policyPort.revision>=1&&
   typeof policyPort.recommend==='function','Invalid private policy port');
 async function recommend({entries,focus,snapshotId,sessionStatus='completed',
  allowedBankIds=null}){
  validateFocus(focus);
  assert(typeof snapshotId==='string'&&snapshotId.length>0&&
   snapshotId.length<=128,'Invalid snapshot identity');
  assert(['completed','in-progress','aborted'].includes(sessionStatus),
   'Invalid session state');
  const banks=allowedBankIds===null?[focus.bankId]:allowedBankIds;
  assert(Array.isArray(banks)&&banks.length>0&&banks.length<=20&&
   banks.every(isToken)&&new Set(banks).size===banks.length&&
   banks.includes(focus.bankId),'Invalid allowed-bank scope');
  // Never invoke a private policy before an examination is finished.
  if(sessionStatus!=='completed')return hold('session_not_complete',snapshotId,focus);
  const view=evidenceView({entries,focus});
  if(!policyPort)return hold('policy_unavailable',snapshotId,focus);
  let decision;
  try{
   decision=await policyPort.recommend({
    schemaVersion:'learning-recommendation-request.v1',
    snapshotId,focus:copy(focus),evidence:view,allowedBankIds:[...banks]
   });
  }catch(_){
   // Never expose implementation details of a private policy to a client.
   return hold('policy_unavailable',snapshotId,focus);
  }
  return validateDecision(decision,{
   snapshotId,focus,allowedBankIds:banks,
   policyRef:{id:policyPort.id,revision:policyPort.revision}
  });
 }
 return Object.freeze({recommend});
}
module.exports={DECISION_VERSION,LEVELS,OUTCOMES,REASONS,
 validateRef,validateDecision,evidenceView,createCoordinator};
