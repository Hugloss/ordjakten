/* A bank-neutral, dependency-free runtime. Banks own data and taxonomies. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenQuestionPlatform=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
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
    const evaluators=new Map([['single-choice',choiceEvaluator()],['numeric',numericEvaluator()]]);
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
      const response=question.responseSpec.kind==='single-choice'?
        {kind:'single-choice',options:seededOrder(question.responseSpec.options,seed,question.ref)}:
        {kind:question.responseSpec.kind};
      return {
        instanceId:instanceId||question.ref.bankId+'/'+question.ref.id+'/'+question.ref.revision+'/'+seed,
        ref:{...question.ref},skillIds:[...question.skillIds],
        prompt:question.prompt,stimulus:question.stimulus||null,responseSpec:response
      };
    }
    function assess(ref,response){
      const question=resolve(ref);
      const evaluator=evaluators.get(question.responseSpec.kind);
      const result=evaluator.grade(question,response);
      assert(obj(result)&&['correct','incorrect','partial','invalid','ungraded','needs-review'].includes(result.status),
        'Invalid assessor outcome');
      return {status:result.status};
    }
    return {register,registerEvaluator,bankInfo,listQuestionRefs,resolve,present,assess};
  }
  return {createRegistry};
});
