/* A short transfer-only Aha round. Recover supported examples and revisit
 * previously successful authored examples using their own memory interval. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenAhaPlan=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DAY=86400000;
  const LIMIT=5;
  // A voluntary per-word Aha is also available before a difficulty has been
  // observed. It uses exactly the same spacing and authored-source rules.
  function option(item,progress,{bank,contexts,surprises,missions,reading,random=Math.random}){
    if(!item||!item.id||!item.definition)return null;
    const card=progress?.[item.id]?.transfer;
    const check=reading.makeCheck({...item,word:item.word||item.name,options:[]},
      {bank,contexts,surprises,missions,readingProgress:progress,random});
    if(!check||check.source!==(item.kind==='word'?'context':'expression')||
      !check.evidence||check.evidence===card?.lastEvidence||
      check.options.length<2||check.options.filter(x=>x.correct).length!==1)return null;
    const dueAt=reading.transferDueAt(card);
    return {...item,word:item.word||item.name,check,dueAt,
      ...(check.contextReading?{definition:check.contextReading}:{}),
      reason:reading.needsReview(progress,item.id,'transfer')||card?.memory?.outcome==='supported'?'need':card?'review':'extend'};
  }
  function plan(raw,{bank,expressions,contexts,surprises,missions,reading,curation={},now=Date.now(),random=Math.random}){
    const progress=reading.sanitizeProgress(raw);
    const ready=[],waiting=[];
    const catalog=[
      ...(bank?.words||[]).map(entry=>({id:entry.id,word:entry.word,definition:entry.definition,kind:'word'})),
      ...(expressions?.expressions||[]).map(entry=>({id:entry.id,word:entry.phrase,definition:entry.definition,kind:'expression'}))
    ];
    const seen=new Set();
    const extension=new Set([...(curation.extensionWords||[]),...(curation.extensionExpressions||[]),
      ...(bank?.words||[]).filter(entry=>entry.difficulty==='expert').map(entry=>entry.id)]);
    for(const item of catalog){
      if(extension.has(item.id)||seen.has(item.id)||(!reading.needsReview(progress,item.id,'transfer')&&
        !reading.hasMaintenance(progress[item.id]?.transfer)))continue;
      seen.add(item.id);
      const row=option(item,progress,{bank,contexts,surprises,missions,reading,random});
      if(row)(row.dueAt<=now?ready:waiting).push(row);
    }
    const order=(a,b)=>Number(b.reason==='need')-Number(a.reason==='need')||a.dueAt-b.dueAt||a.id.localeCompare(b.id);
    ready.sort(order);waiting.sort(order);
    return {ready,waiting,round:ready.slice(0,LIMIT)};
  }
  function answer(check,index,attempts,reading){
    if(!Number.isInteger(index)||!check?.options?.[index]||
      !Number.isInteger(attempts)||attempts<0||attempts>=2)return null;
    const count=attempts+1;
    const step=reading.nextStep(count,reading.isCorrect(check,index));
    return {attempts:count,step,outcome:step==='complete'?(count===1?'first':'retry'):
      step==='guided'?'guided':null};
  }
  return {DAY,LIMIT,plan,answer,option};
});
