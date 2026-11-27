/* Ordjakten: offline, optional discovery-book and transfer-learning helpers. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenSurprises=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const phases=['unlocked','opened','mastered'];
  function ids(expressions){
    return new Set(expressions&&Array.isArray(expressions.expressions)
      ? expressions.expressions.map(x=>x.id) : []);
  }
  function validate(data,expressions){
    const errors=[];
    if(!data||!Array.isArray(data.challenges)||!expressions||!Array.isArray(expressions.expressions))return ['Ogiltiga bonusuppdrag'];
    const valid=ids(expressions),seen=new Set();
    for(const item of data.challenges){
      if(!item||!valid.has(item.id)||seen.has(item.id)){errors.push('Ogiltigt eller upprepat miniuppdrags-ID: '+(item&&item.id));continue;}
      seen.add(item.id);
      if(expressions.expressions.find(e=>e.id===item.id)?.category==='school-instruction'){
        const labels=Array.isArray(item.options)?item.options.map(o=>o?.label):[];
        const first=labels[0],prefix=typeof first==='string'&&first.includes('” – ')?first.split('” – ')[0]+'” – ':'';
        if(!prefix||!labels.every(label=>typeof label==='string'&&label.startsWith(prefix))||
          typeof item.ahaDistractor!=='string'||!item.ahaDistractor.startsWith(prefix)||
          item.ahaDistractor.slice(prefix.length).trim().length<8||labels.includes(item.ahaDistractor))
          errors.push('Skolans Aha saknar ett tredje svar till samma uppgift: '+item.id);
      }
      if(typeof item.prompt!=='string'||item.prompt.trim().length<25)errors.push('Saknar fråga: '+item.id);
      if(typeof item.explanation!=='string'||item.explanation.trim().length<30)errors.push('Saknar återkoppling: '+item.id);
      if(!Array.isArray(item.options)||item.options.length!==2||
        item.options.filter(x=>x&&x.correct===true).length!==1||
        item.options.some(x=>!x||typeof x.label!=='string'||x.label.trim().length<15)||
        new Set(item.options.map(x=>x&&x.label)).size!==2)
        errors.push('Miniuppdrag måste ha två olika val och ett rätt: '+item.id);
    }
    for(const id of valid)if(!seen.has(id))errors.push('Miniuppdrag saknas: '+id);
    return errors;
  }
  function sanitizeCollection(value,expressions){
    const available=ids(expressions);
    const src=value&&typeof value==='object'?value:{};
    const out={unlocked:[],opened:[],mastered:[]};
    for(const phase of phases){
      if(!Array.isArray(src[phase]))continue;
      out[phase]=[...new Set(src[phase].filter(id=>typeof id==='string'&&available.has(id)))].slice(0,available.size);
    }
    const unlocked=new Set(out.unlocked),opened=new Set(out.opened);
    out.opened=out.opened.filter(id=>unlocked.has(id));
    out.mastered=out.mastered.filter(id=>opened.has(id)&&unlocked.has(id));
    return out;
  }
  function updateCollection(value,event,id,expressions){
    const current=sanitizeCollection(value,expressions);
    if(!ids(expressions).has(id)||!phases.includes(event))return current;
    if(event==='unlocked' || (event==='opened'&&current.unlocked.includes(id)) ||
      (event==='mastered'&&current.opened.includes(id))){
      if(!current[event].includes(id))current[event].push(id);
    }
    return current;
  }
  function getChallenge(data,id){
    return data&&Array.isArray(data.challenges)?data.challenges.find(x=>x.id===id)||null:null;
  }
  function checkAnswer(data,id,index){
    const challenge=getChallenge(data,id);
    if(!challenge||!Number.isInteger(index)||index<0||index>=challenge.options.length)return null;
    return challenge.options[index].correct===true;
  }
  return {validate,sanitizeCollection,updateCollection,getChallenge,checkAnswer};
});
