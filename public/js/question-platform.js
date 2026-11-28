/* A bank-neutral, dependency-free runtime. Banks own data and taxonomies. */
(function(root,factory){
  const assessment=typeof module!=='undefined'&&module.exports?
    require('./assessment-v1'):root.LearningAssessmentV1;
  const api=factory(assessment);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenQuestionPlatform=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Assessment){
  'use strict';
  if(!Assessment)throw new Error('Learning Assessment v1 must be loaded before the question platform');
  const ID=/^[a-z][a-z0-9-]{1,95}$/;
  const obj=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  const validId=value=>typeof value==='string'&&ID.test(value);
  const validText=value=>typeof value==='string'&&value.trim().length>0;
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};

  function choiceEvaluator(){
    return {
      validate(question){
        const options=question.responseSpec.options;
        assert(Array.isArray(options)&&options.length>=2&&options.length<=12,'single-choice needs 2–12 options');
        const ids=new Set();
        for(const option of options){
          assert(obj(option)&&validId(option.id)&&validText(option.label),'Invalid choice');
          assert(!ids.has(option.id),'Duplicate choice ID');
          ids.add(option.id);
        }
        assert(question.assessmentSpec.kind==='single-choice'&&
          ids.has(question.assessmentSpec.correctOptionId),'Invalid choice answer');
      },
      grade(question,response){
        const ids=question.responseSpec.options.map(x=>x.id);
        if(typeof response!=='string'||!ids.includes(response))return {status:'invalid'};
        return {status:response===question.assessmentSpec.correctOptionId?'correct':'incorrect'};
      }
    };
  }
  function orderingEvaluator(){
    return {
      validate(question){
        const options=question.responseSpec.options;
        assert(Array.isArray(options)&&options.length>=2&&options.length<=12,
          'ordering needs 2–12 options');
        const ids=new Set();
        for(const option of options){
          assert(obj(option)&&validId(option.id)&&validText(option.label),'Invalid ordering option');
          assert(!ids.has(option.id),'Duplicate ordering option ID');
          ids.add(option.id);
        }
        const expected=question.assessmentSpec.correctOrder;
        assert(question.assessmentSpec.kind==='ordering'&&Array.isArray(expected)&&
          expected.length===options.length&&new Set(expected).size===ids.size&&
          expected.every(id=>ids.has(id)),'Invalid ordering answer');
      },
      grade(question,response){
        const expected=question.assessmentSpec.correctOrder;
        const ids=new Set(question.responseSpec.options.map(row=>row.id));
        if(!Array.isArray(response)||response.length!==expected.length||
          new Set(response).size!==expected.length||response.some(id=>!ids.has(id)))
          return {status:'invalid'};
        return {status:response.every((id,index)=>id===expected[index])?'correct':'incorrect'};
      }
    };
  }
  function numericEvaluator(){
    return {
      validate(question){
        const check=question.assessmentSpec;
        assert(check.kind==='numeric-exact'&&Number.isFinite(check.expected),'Invalid numeric assessment');
        assert(check.tolerance===undefined||
          (Number.isFinite(check.tolerance)&&check.tolerance>=0),'Invalid numeric tolerance');
      },
      grade(question,response){
        let number=response;
        if(typeof response==='string'){
          const text=response.trim();
          if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text))return {status:'invalid'};
          number=Number(text);
        }
        if(typeof number!=='number'||!Number.isFinite(number))return {status:'invalid'};
        const target=question.assessmentSpec;
        return {status:Math.abs(number-target.expected)<=(target.tolerance||0)?'correct':'incorrect'};
      }
    };
  }
  function createRegistry(){
    const banks=new Map();
    const evaluators=new Map([['single-choice',choiceEvaluator()],['numeric',numericEvaluator()],
      ['ordering',orderingEvaluator()]]);
    function registerEvaluator(kind,evaluator){
      assert(validId(kind)&&obj(evaluator)&&typeof evaluator.validate==='function'&&
        typeof evaluator.grade==='function','Invalid evaluator');
      assert(!evaluators.has(kind),'Evaluator already registered: '+kind);
      evaluators.set(kind,evaluator);
    }
    function validateQuestion(question,expectedBank,expectedId){
      assert(obj(question)&&obj(question.ref),'Question missing reference');
      const ref=question.ref;
      assert(validId(ref.bankId)&&validId(ref.id)&&Number.isSafeInteger(ref.revision)&&
        ref.revision>=1,'Invalid question reference');
      if(expectedBank!==undefined)assert(ref.bankId===expectedBank&&ref.id===expectedId,
        'Question escaped its bank: '+expectedBank+'/'+expectedId);
      assert(validText(question.prompt)&&Array.isArray(question.skillIds)&&question.skillIds.length>0&&
        question.skillIds.every(validId),'Invalid question text or skills');
      assert(obj(question.responseSpec)&&obj(question.assessmentSpec),'Missing response/assessment specification');
      const evaluator=evaluators.get(question.responseSpec.kind);
      assert(evaluator,'Unsupported response kind: '+question.responseSpec.kind);
      Assessment.validateDefinition(question);
      if(question.assessmentSpec.rubric&&evaluator.supportsRubric!==true)
        throw new Error('Evaluator does not support authored rubric: '+question.responseSpec.kind);
      evaluator.validate(question);
      return question;
    }
    function register(bank){
      assert(bank&&typeof bank.describe==='function'&&typeof bank.listQuestionIds==='function'&&
        typeof bank.getQuestion==='function','Invalid bank adapter');
      const info=bank.describe();
      assert(obj(info)&&validId(info.bankId)&&Number.isSafeInteger(info.revision)&&
        info.revision>=1,'Invalid bank description');
      assert(!banks.has(info.bankId),'Bank already registered: '+info.bankId);
      const ids=bank.listQuestionIds();
      assert(Array.isArray(ids)&&ids.every(validId)&&new Set(ids).size===ids.length,
        'Invalid or duplicated question IDs in '+info.bankId);
      for(const id of ids)validateQuestion(bank.getQuestion(id),info.bankId,id);
      banks.set(info.bankId,{bank,info:{...info},ids:[...ids]});
      return {...info};
    }
    function bankInfo(){
      return [...banks.values()].map(row=>({...row.info,count:row.ids.length}));
    }
    function listQuestionRefs(bankId){
      assert(validId(bankId)&&banks.has(bankId),'Unknown knowledge bank: '+bankId);
      const row=banks.get(bankId);
      return row.ids.map(id=>{
        const question=validateQuestion(row.bank.getQuestion(id),bankId,id);
        return {...question.ref};
      });
    }
    function resolve(ref){
      assert(obj(ref)&&validId(ref.bankId)&&validId(ref.id)&&
        Number.isSafeInteger(ref.revision)&&ref.revision>=1,'Invalid content reference');
      const row=banks.get(ref.bankId);
      assert(row,'Unknown knowledge bank: '+ref.bankId);
      const question=row.bank.getQuestion(ref.id);
      assert(question,'Unknown question: '+ref.bankId+'/'+ref.id);
      validateQuestion(question,ref.bankId,ref.id);
      assert(question.ref.revision===ref.revision,'Question revision mismatch: '+ref.bankId+'/'+ref.id);
      return question;
    }
    function seededOrder(options,seed,ref){
      assert(Number.isSafeInteger(seed)&&seed>=0&&seed<=4294967295,'Invalid random seed');
      const list=options.map(option=>({id:option.id,label:option.label}));
      let hash=2166136261;
      const key=ref.bankId+'/'+ref.id+'/'+ref.revision+'/'+seed;
      for(const char of key)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
      for(let i=list.length-1;i>0;i--){
        hash^=hash<<13;hash^=hash>>>17;hash^=hash<<5;hash>>>=0;
        const j=hash%(i+1);
        [list[i],list[j]]=[list[j],list[i]];
      }
      return list;
    }
    function present(ref,{seed=0,instanceId=null}={}){
      const question=resolve(ref);
      const kind=question.responseSpec.kind;
      const response=kind==='single-choice'||kind==='ordering'?
        {kind,options:seededOrder(question.responseSpec.options,seed,question.ref)}:
        {kind};
      return {
        instanceId:instanceId||question.ref.bankId+'/'+question.ref.id+'/'+question.ref.revision+'/'+seed,
        ref:{...question.ref},skillIds:[...question.skillIds],
        prompt:question.prompt,stimulus:question.stimulus||null,responseSpec:response
      };
    }
    function assessDetailed(ref,response){
      const question=resolve(ref);
      const evaluator=evaluators.get(question.responseSpec.kind);
      const raw=evaluator.grade(question,response);
      const kind=question.responseSpec.kind;
      const builtin=['single-choice','numeric','ordering'].includes(kind);
      return Assessment.fromEvaluator(question,raw,{
        id:evaluator.id||kind,revision:evaluator.revision||1,
        source:builtin?'deterministic':'plugin'
      });
    }
    function assess(ref,response){return {status:assessDetailed(ref,response).status};}
    return {register,registerEvaluator,bankInfo,listQuestionRefs,resolve,present,
      assess,assessDetailed};
  }
  return {createRegistry};
});
