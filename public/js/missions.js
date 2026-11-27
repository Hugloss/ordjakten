/* Three learning paths for each expression; all data remains local. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenMissions=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TYPES=Object.freeze(['meaning','sentence','order']);
  function get(data,id){return data&&Array.isArray(data.missions)?data.missions.find(m=>m.id===id)||null:null;}
  function validate(data,expressions){
    if(!data||!Array.isArray(data.missions)||!expressions||!Array.isArray(expressions.expressions))return ['Uppdragsbanken saknas.'];
    const issues=[],available=new Set(expressions.expressions.map(e=>e.id)),seen=new Set();
    for(const m of data.missions){
      if(!m||!available.has(m.id)||seen.has(m.id)){issues.push('Felaktigt eller dubblerat ID: '+(m&&m.id));continue;}
      seen.add(m.id);
      if(expressions.expressions.find(e=>e.id===m.id)?.category==='school-instruction'&&
        (typeof m.prompt!=='string'||m.prompt.trim().length<25))issues.push('Skoluppgift saknar instruktion: '+m.id);
      if(!Array.isArray(m.sentences)||m.sentences.length!==3||
        m.sentences.filter(s=>s&&s.correct===true).length!==1||
        m.sentences.some(s=>!s||typeof s.label!=='string'||s.label.trim().length<25)||
        new Set(m.sentences.map(s=>s&&s.label)).size!==3)issues.push('Tre unika meningar med exakt ett rätt svar krävs: '+m.id);
      if(!Array.isArray(m.order)||m.order.length!==3||
        m.order.some(s=>typeof s!=='string'||s.trim().length<20)||
        new Set(m.order).size!==3)issues.push('Tre olika händelser krävs: '+m.id);
      if(typeof m.hint!=='string'||m.hint.trim().length<25)issues.push('Ledtråd saknas: '+m.id);
    }
    for(const id of available)if(!seen.has(id))issues.push('Uppdrag saknas: '+id);
    return issues;
  }
  function sanitizeProgress(value,expressions,legacyMastered=[]){
    const valid=new Set(expressions&&Array.isArray(expressions.expressions)?expressions.expressions.map(x=>x.id):[]);
    const source=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    const out={};
    for(const [id,types] of Object.entries(source)){
      if(valid.has(id)&&Array.isArray(types)){
        const cleaned=TYPES.filter(t=>types.includes(t));
        if(cleaned.length)out[id]=cleaned;
      }
    }
    // Older Ordjakten 0.8 users who completed the single meaning mini-task keep that progress.
    for(const id of legacyMastered||[]){
      if(valid.has(id)){
        if(!out[id])out[id]=[];
        if(!out[id].includes('meaning'))out[id].unshift('meaning');
      }
    }
    return out;
  }
  function complete(progress,id,type,expressions){
    const cleaned=sanitizeProgress(progress,expressions);
    if(!get({missions:expressions.expressions},id)||!TYPES.includes(type))return cleaned;
    const types=cleaned[id]||[];
    if(!types.includes(type))cleaned[id]=TYPES.filter(t=>types.includes(t)||t===type);
    return cleaned;
  }
  function nextType(progress,id,choice='mix'){
    if(TYPES.includes(choice))return choice;
    const completed=progress&&Array.isArray(progress[id])?progress[id]:[];
    const suffix=Number(String(id).split('-')[1]);
    const offset=Number.isInteger(suffix)&&suffix>0?(suffix-1)%TYPES.length:0;
    for(let i=0;i<TYPES.length;i++){
      const candidate=TYPES[(offset+i)%TYPES.length];
      if(!completed.includes(candidate))return candidate;
    }
    return TYPES[offset]; // Full collection: all three are replayable.
  }
  function checkOrder(sequence){
    return Array.isArray(sequence)&&sequence.length===3&&
      sequence.every(Number.isInteger)&&new Set(sequence).size===3&&
      sequence.every((value,index)=>value===index);
  }
  return {TYPES,get,validate,sanitizeProgress,complete,nextType,checkOrder};
});
