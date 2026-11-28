/* Versioned, domain-neutral assessment and privacy-minimal evidence contracts. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.LearningAssessmentV1=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA_VERSION='learning-assessment.v1';
  const EVIDENCE_VERSION='learning-evidence.v1';
  const LEVELS=Object.freeze(['incorrect','limited','partial','correct','excellent']);
  const STATUS_OUTCOME=Object.freeze({
    incorrect:'completed',partial:'completed',correct:'completed',
    invalid:'invalid',incomplete:'incomplete',ungraded:'ungraded',
    'needs-review':'needs-review'
  });
  const ID=/^[a-z][a-z0-9-]{1,95}$/;
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  const validId=value=>typeof value==='string'&&ID.test(value);
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  const copy=value=>JSON.parse(JSON.stringify(value));

  function validateDefinition(question){
    assert(object(question)&&object(question.ref)&&object(question.assessmentSpec),
      'Missing assessment definition');
    const spec=question.assessmentSpec;
    if(spec.policyId!==undefined)assert(validId(spec.policyId),'Invalid assessment policy ID');
    if(spec.policyRevision!==undefined)
      assert(Number.isSafeInteger(spec.policyRevision)&&spec.policyRevision>=1,
        'Invalid assessment policy revision');
    if(spec.rubric===undefined)return;
    const rubric=spec.rubric;
    assert(object(rubric)&&validId(rubric.id)&&
      Number.isSafeInteger(rubric.revision)&&rubric.revision>=1&&
      Array.isArray(rubric.criteria)&&rubric.criteria.length>0&&rubric.criteria.length<=32,
      'Invalid assessment rubric');
    const ids=new Set();
    for(const criterion of rubric.criteria){
      assert(object(criterion)&&validId(criterion.id)&&
        typeof criterion.description==='string'&&criterion.description.trim()&&
        (criterion.required===undefined||typeof criterion.required==='boolean')&&
        !ids.has(criterion.id),'Invalid or duplicate rubric criterion');
      ids.add(criterion.id);
    }
  }
  function levelFor(status,proposed){
    if(STATUS_OUTCOME[status]!=='completed'){
      assert(proposed===undefined||proposed===null,'Unassessed result cannot carry a grade');
      return null;
    }
    const level=proposed===undefined?status:proposed;
    assert(LEVELS.includes(level),'Invalid string assessment grade');
    assert((status==='correct'&&['correct','excellent'].includes(level))||
      (status==='partial'&&['limited','partial'].includes(level))||
      (status==='incorrect'&&level==='incorrect'),'Inconsistent assessment status and grade');
    return level;
  }
  function normalizedCriteria(question,raw,level){
    const rubric=question.assessmentSpec.rubric;
    const supplied=raw.criteria===undefined?[]:raw.criteria;
    assert(Array.isArray(supplied),'Invalid assessment criteria');
    if(!rubric||level===null){
      assert(supplied.length===0,'Unexpected criteria for ungraded or non-rubric answer');
      return [];
    }
    const expected=rubric.criteria;
    assert(supplied.length===expected.length,'Incomplete rubric assessment');
    const rows=new Map();
    for(const row of supplied){
      assert(object(row)&&validId(row.id)&&LEVELS.includes(row.level)&&
        !rows.has(row.id),'Invalid or duplicate rubric result');
      if(row.reason!==undefined)
        assert(typeof row.reason==='string'&&row.reason.trim()&&row.reason.length<=500,
          'Invalid rubric reason');
      rows.set(row.id,row);
    }
    assert(expected.every(row=>rows.has(row.id)),'Rubric result contains unknown criteria');
    const criteria=expected.map(row=>{
      const grade=rows.get(row.id);
      return {id:row.id,level:grade.level,
        ...(grade.reason===undefined?{}:{reason:grade.reason})};
    });
    if(level==='correct'||level==='excellent'){
      assert(expected.every(row=>row.required===false||
        LEVELS.indexOf(rows.get(row.id).level)>=LEVELS.indexOf('correct')),
        'Cannot pass a failed required criterion');
    }
    return criteria;
  }
  function validateResult(result){
    assert(object(result)&&result.schemaVersion===SCHEMA_VERSION&&
      object(result.questionRef)&&validId(result.questionRef.bankId)&&
      validId(result.questionRef.id)&&Number.isSafeInteger(result.questionRef.revision)&&
      result.questionRef.revision>0,'Invalid assessment result reference');
    assert(Object.hasOwn(STATUS_OUTCOME,result.status)&&
      result.outcome===STATUS_OUTCOME[result.status]&&
      object(result.evaluation),'Invalid assessment outcome');
    const checkedLevel=levelFor(result.status,result.evaluation.level);
    assert(result.evaluation.level===checkedLevel,
      'Missing or inconsistent assessment grade field');
    const criteria=result.evaluation.criteria;
    assert(Array.isArray(criteria)&&criteria.every(row=>object(row)&&validId(row.id)&&
      LEVELS.includes(row.level))&&
      new Set(criteria.map(row=>row.id)).size===criteria.length,
      'Invalid or duplicate assessment evidence criteria');
    assert((result.outcome==='completed'||criteria.length===0)&&
      ((result.outcome==='completed'&&Boolean(result.rubricRef))===
        (result.outcome==='completed'&&criteria.length>0)),
      'Rubric evidence missing or present for an unassessed result');
    if(result.rubricRef!==undefined)
      assert(object(result.rubricRef)&&validId(result.rubricRef.id)&&
        Number.isSafeInteger(result.rubricRef.revision)&&result.rubricRef.revision>0,
        'Invalid rubric revision reference');
    if(result.evaluation.reason!==undefined)
      assert(typeof result.evaluation.reason==='string'&&
        result.evaluation.reason.trim()&&result.evaluation.reason.length<=500,
        'Invalid assessment explanation');
    assert(object(result.assessmentRef)&&validId(result.assessmentRef.bankId)&&
      validId(result.assessmentRef.id)&&
      Number.isSafeInteger(result.assessmentRef.revision)&&
      result.assessmentRef.revision>0&&
      result.assessmentRef.bankId===result.questionRef.bankId&&
      object(result.evaluator)&&
      validId(result.evaluator.id)&&Number.isSafeInteger(result.evaluator.revision)&&
      result.evaluator.revision>0&&
      ['deterministic','plugin'].includes(result.evaluator.source)&&
      object(result.evidence)&&Array.isArray(result.evidence.skillIds)&&
      result.evidence.skillIds.length>0&&result.evidence.skillIds.every(validId)&&
      typeof result.evidence.reviewStatus==='string'&&
      result.evidence.reviewStatus.length>0&&result.evidence.reviewStatus.length<=64,
      'Incomplete assessment provenance');
    return result;
  }
  function fromEvaluator(question,raw,evaluator){
    validateDefinition(question);
    assert(object(raw)&&Object.hasOwn(STATUS_OUTCOME,raw.status),'Invalid evaluator outcome');
    const level=levelFor(raw.status,raw.level);
    if(raw.reason!==undefined)
      assert(typeof raw.reason==='string'&&raw.reason.trim()&&raw.reason.length<=500,
        'Invalid evaluation reason');
    const criteria=normalizedCriteria(question,raw,level);
    const spec=question.assessmentSpec;
    const metadata=evaluator||{};
    const result={
      schemaVersion:SCHEMA_VERSION,
      status:raw.status,
      outcome:STATUS_OUTCOME[raw.status],
      questionRef:{...question.ref},
      assessmentRef:{
        bankId:question.ref.bankId,
        id:spec.policyId||question.ref.id,
        revision:spec.policyRevision||question.ref.revision
      },
      ...(spec.rubric?{rubricRef:{id:spec.rubric.id,
        revision:spec.rubric.revision}}:{}),
      evaluator:{
        id:metadata.id||question.responseSpec.kind,
        revision:metadata.revision||1,
        source:metadata.source||'plugin'
      },
      evaluation:{level,criteria,...(raw.reason===undefined?{}:{reason:raw.reason})},
      evidence:{skillIds:[...question.skillIds],reviewStatus:question.reviewStatus||'unspecified'}
    };
    return validateResult(result);
  }
  function summarize(results){
    assert(Array.isArray(results),'Invalid assessment summary');
    const byOutcome=Object.fromEntries([...new Set(Object.values(STATUS_OUTCOME))].map(x=>[x,0]));
    const byLevel=Object.fromEntries(LEVELS.map(x=>[x,0]));
    for(const row of results){
      validateResult(row);
      byOutcome[row.outcome]+=1;
      if(row.evaluation.level!==null)byLevel[row.evaluation.level]+=1;
    }
    return {
      total:results.length,byOutcome,byLevel,
      mastery:{level:'unknown',confidence:'insufficient',
        reason:'Requires a separately qualified bank-specific mastery policy'}
    };
  }
  function createEvidenceLedger(){
    const attempts=new Map();
    function record({attemptId,instanceId,mode,assistance='unknown',assessment}){
      assert(typeof attemptId==='string'&&attemptId.length>0&&attemptId.length<=160&&
        typeof instanceId==='string'&&instanceId.length>0&&instanceId.length<=160&&
        validId(mode),'Invalid evidence identity or mode');
      assert(['unknown','none','hint','retry','revealed'].includes(assistance),
        'Invalid assistance observation');
      assert(!attempts.has(attemptId),'Duplicate attempt evidence');
      validateResult(assessment);
      const row={
        schemaVersion:EVIDENCE_VERSION,attemptId,instanceId,mode,assistance,
        questionRef:{...assessment.questionRef},
        assessmentRef:{...assessment.assessmentRef},
        ...(assessment.rubricRef?{rubricRef:{...assessment.rubricRef}}:{}),
        evaluator:{...assessment.evaluator},
        outcome:assessment.outcome,
        evaluation:{
          level:assessment.evaluation.level,
          criteria:assessment.evaluation.criteria.map(x=>({id:x.id,level:x.level}))
        },
        skillIds:[...assessment.evidence.skillIds],
        reviewStatus:assessment.evidence.reviewStatus
      };
      attempts.set(attemptId,copy(row));
      return copy(row);
    }
    function entries(){return [...attempts.values()].map(copy);}
    function report({bankId=null,skillId=null}={}){
      const selected=entries().filter(row=>
        (bankId===null||row.questionRef.bankId===bankId)&&
        (skillId===null||row.skillIds.includes(skillId)));
      const byOutcome=Object.fromEntries([...new Set(Object.values(STATUS_OUTCOME))].map(x=>[x,0]));
      const byLevel=Object.fromEntries(LEVELS.map(x=>[x,0]));
      const distinct=new Set();
      let independent=0;
      for(const row of selected){
        byOutcome[row.outcome]+=1;
        if(row.evaluation.level!==null)byLevel[row.evaluation.level]+=1;
        if(row.outcome==='completed'&&row.assistance==='none'&&
          ['reviewed','published'].includes(row.reviewStatus)){
          independent+=1;
          distinct.add(row.questionRef.bankId+'/'+row.questionRef.id);
        }
      }
      return {total:selected.length,byOutcome,byLevel,
        qualifiedIndependentAttempts:independent,distinctReviewedQuestions:distinct.size,
        mastery:{level:'unknown',confidence:'insufficient',
          reason:'Evidence alone does not establish mastery; a bank policy is required'}};
    }
    return {record,entries,report};
  }
  return {SCHEMA_VERSION,EVIDENCE_VERSION,LEVELS,validateDefinition,
    validateResult,fromEvaluator,summarize,createEvidenceLedger};
});