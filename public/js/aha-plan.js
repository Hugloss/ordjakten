/* A short transfer-only Aha round. Derive the queue from existing reading
 * observations; no second scheduler or persistent state. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenAhaPlan=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DAY=86400000;
  const LIMIT=5;
  function plan(raw,{bank,expressions,contexts,surprises,missions,reading,now=Date.now(),random=Math.random}){
    const progress=reading.sanitizeProgress(raw);
    const ready=[],waiting=[];
    const catalog=[
      ...(bank?.words||[]).map(entry=>({id:entry.id,word:entry.word,definition:entry.definition,kind:'word'})),
      ...(expressions?.expressions||[]).map(entry=>({id:entry.id,word:entry.phrase,definition:entry.definition,kind:'expression'}))
    ];
    const seen=new Set();
    for(const item of catalog){
      if(seen.has(item.id)||!reading.needsReview(progress,item.id,'transfer'))continue;
      seen.add(item.id);
      const card=progress[item.id].transfer;
      const check=reading.makeCheck({...item,options:[]},
        {bank,contexts,surprises,missions,readingProgress:progress,random});
      if(!check || check.source!==(item.kind==='word'?'context':'expression') ||
        !check.evidence || check.evidence===card.lastEvidence ||
        check.options.length<2 || check.options.filter(x=>x.correct).length!==1)continue;
      // Rest after the latest encounter, even after a same-day normal quiz.
      // The existing evidence rules still decide when the need is resolved.
      const last=Math.max(card.lastAt||0,card.lastQualifiedAt||0);
      const dueAt=last?last+DAY:0;
      (dueAt<=now?ready:waiting).push({...item,check,dueAt});
    }
    const order=(a,b)=>a.dueAt-b.dueAt||a.id.localeCompare(b.id);
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
  return {DAY,LIMIT,plan,answer};
});
