/* Retrieval practice: type the bank's target, then ask for progressively
 * more support. Exact matches are not a semantic/spelling assessment.
 * Store only bounded outcome counters, stage and timestamp; never input. */
(function(root,factory){
  const memory=typeof module!=='undefined'&&module.exports?require('./spaced-memory'):root.OrdjaktenMemory;
  const api=factory(memory);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenRecall=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Memory){
  'use strict';
  const DAY=86400000,LIMIT=3;
  const ID=/^(?:sv|ut)-\d{4,}$/;
  const integer=(value,max)=>Number.isInteger(value)&&value>=0?Math.min(value,max):0;
  const time=value=>Number.isSafeInteger(value)&&value>=0&&value<=4102444800000?value:0;
  const normalize=value=>typeof value==='string'&&value.length<=200?value.normalize('NFC')
    .trim().replace(/[.!?]+$/u,'').trim().replace(/\s+/gu,' ').toLocaleLowerCase('sv-SE'):'';
  function mask(text,target){
    if(typeof text!=='string'||!target)return {text:'',count:0};
    const escaped=target.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g,'\\$&');
    const pattern=new RegExp('(?<![\\p{L}\\p{M}\\p{N}])'+escaped+'(?![\\p{L}\\p{M}\\p{N}])','giu');
    let count=0;
    const masked=text.normalize('NFC').replace(pattern,()=>{count++;return '…';});
    return {text:masked,count};
  }
  function task(item){
    if(!item||!ID.test(item.id)||!['word','expression'].includes(item.kind)||
      typeof item.name!=='string'||!normalize(item.name)||!item.definition)return null;
    const answer=item.name.normalize('NFC');
    const def=mask(item.definition,answer);
    const example=mask(item.example,answer);
    return {id:item.id,kind:item.kind,answer,definition:def.text,
      cloze:example.count===1?example.text:'',definitionMasked:def.count>0};
  }
  function sanitize(raw,catalog){
    const out=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    const allowed=new Set(catalog.map(item=>item.id));
    for(const [id,card] of Object.entries(raw).slice(0,500)){
      if(!ID.test(id)||!allowed.has(id)||!card||typeof card!=='object'||Array.isArray(card))continue;
      const direct=integer(card.direct,9999),assisted=integer(card.assisted,9999);
      if(!direct&&!assisted)continue;
      const lastAt=time(card.lastAt);
      out[id]={direct,assisted,stage:integer(card.stage,2),lastAt,
        last:card.last==='direct'&&direct?'direct':'assisted'};
      const memory=Memory.sanitize(card.memory,{maxAt:lastAt});
      if(memory&&!memory.evidence&&memory.lastAt===lastAt&&((memory.outcome==='direct'&&out[id].last==='direct')||
        (memory.outcome!=='direct'&&out[id].last==='assisted')))out[id].memory=memory;
    }
    return out;
  }
  function eligible(item,history){
    const id=item.id,skills=history.skillProgress?.[id]?.skills||{};
    const missions=history.missionProgress?.[id]||[];
    const aha=history.readingProgress?.[id]||{};
    return ['meaning','reverse','context','sentence'].some(key=>integer(skills[key]?.right,9999)>0)||
      (Array.isArray(missions)&&(missions.includes('meaning')||missions.includes('sentence')))||
      integer(aha.recognition?.first,9999)>0||integer(aha.transfer?.first,9999)>0;
  }
  function dueAt(card){return Math.max(card?.lastAt?Math.min(4102444800000,card.lastAt+DAY):0,Memory.dueAt(card?.memory));}
  function plan(catalog,history={},now=Date.now()){
    const progress=sanitize(history.recallProgress,catalog);
    const ready=[],waiting=[],seen=new Set();
    for(const item of catalog){
      if(item.everyday===false||seen.has(item.id))continue;
      seen.add(item.id);
      const card=progress[item.id];
      if(!card&&!eligible(item,history))continue;
      const question=task(item);
      if(!question)continue;
      const row={...question,stage:card?.stage??1,dueAt:dueAt(card),card};
      (row.dueAt<=now?ready:waiting).push(row);
    }
    // Unsolved/assisted and untried concepts before independent repeats;
    // oldest due time prevents starvation within each group.
    const rank=row=>row.card?.last==='assisted'&&row.card.memory?.outcome!=='previewed'?0:row.card?2:1;
    ready.sort((a,b)=>rank(a)-rank(b)||a.dueAt-b.dueAt||a.id.localeCompare(b.id));
    waiting.sort((a,b)=>a.dueAt-b.dueAt||a.id.localeCompare(b.id));
    return {ready,waiting,round:ready.slice(0,LIMIT)};
  }
  function prompt(question,stage){
    const level=integer(stage,2);
    return {definition:question.definition,
      cloze:level<2?question.cloze:'',
      letters:level===0?letters(question):''};
  }
  function letters(question){
    return question.answer.split(/\s+/u).map(word=>Array.from(word)[0]+'…').join(' ');
  }
  function match(question,value){
    const typed=normalize(value);
    return !!typed&&typed===normalize(question.answer);
  }
  function record(raw,catalog,id,{stage,matched,helped,previewed=false},now=Date.now()){
    const item=catalog.find(item=>item.id===id);
    if(!task(item)||!Number.isInteger(stage)||stage<0||stage>2||
      typeof matched!=='boolean'||typeof helped!=='boolean'||typeof previewed!=='boolean')return raw;
    const progress=sanitize(raw,catalog),previous=progress[id];
    const at=time(now);
    if(!at||previous&&at<dueAt(previous)||stage!==(previous?.stage??1))return raw;
    const direct=matched&&!helped&&!previewed&&stage>0;
    // A previewed word card is intentional practice, not a cold recall
    // observation. It must neither promote nor demote an established stage.
    const next=previewed?(previous?.stage??1):matched&&!helped?
      Math.min(2,stage+1):stage===0&&matched?1:0;
    const memory=Memory.observe(previous?.memory,{outcome:previewed?'previewed':direct?'direct':'supported',now:at,lastExposureAt:previous?.lastAt});
    progress[id]={direct:Math.min(9999,(previous?.direct||0)+Number(direct)),
      assisted:Math.min(9999,(previous?.assisted||0)+Number(!direct)),
      stage:next,lastAt:at,last:direct?'direct':'assisted',memory};
    return progress;
  }
  return {DAY,LIMIT,normalize,mask,task,sanitize,eligible,dueAt,plan,prompt,letters,match,record};
});
