/* A second, unscored learning step. Never invent a story at runtime:
 * use edited examples for expressions and word contexts, or definitions
 * already vetted for the original multiple-choice question. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenReading = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function choose(items, random) {
    if (!items.length) return null;
    return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
  }

  function shuffle(items, random) {
    const copy=items.slice();
    for(let i=copy.length-1;i>0;i--){
      const j=Math.min(i,Math.floor(random()*(i+1)));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  }
  function makeChallenge(prompt,right,distractors,source,random,why) {
    if(!right||typeof right!=='string')return null;
    const wrong=[];
    for(const item of distractors){
      if(typeof item==='string'&&item&&item!==right&&!wrong.includes(item))wrong.push(item);
    }
    if(!wrong.length)return null;
    const options=shuffle([{label:right,correct:true},
      ...shuffle(wrong,random).slice(0,2).map(label=>({label,correct:false}))],random);
    return {prompt,options,source,why:why||''};
  }
  function makeCheck(question,{bank,contexts,surprises,missions,random=Math.random}={}) {
    if(!question||!question.id||!question.definition)return null;
    const word=question.word;
    if(question.kind==='expression'){
      const challenge=surprises?.challenges?.find(x=>x.id===question.id);
      const right=challenge?.options?.find(x=>x.correct===true)?.label;
      const wrong=(challenge?.options||[]).filter(x=>x.correct===false).map(x=>x.label);
      const mission=missions?.missions?.find(x=>x.id===question.id);
      wrong.push(...(mission?.sentences||[]).filter(x=>x.correct===false).map(x=>x.label));
      return makeChallenge('Vilken NY situation visar uttrycket ”'+word+'”?',right,wrong,
        'expression',random,challenge?.explanation);
    }
    if(question.kind!=='word')return null;
    const scenes=contexts?.wordContexts||[];
    const record=scenes.find(x=>x.id===question.id);
    if(record){
      const fresh=record.scenes.filter((scene,i)=>
        i!==question.contextIndex&&scene.text!==question.stem);
      const target=choose(fresh,random);
      const ids=[...new Set([...record.distractors,...(record.readingDistractors||[])])];
      const records=shuffle(ids.map(id=>scenes.find(x=>x.id===id)).filter(x=>x?.scenes?.length),random);
      const wrong=records.map(x=>choose(x.scenes,random)?.text);
      const check=makeChallenge('Vilken ANNAN berättelse visar ordet ”'+word+'”?',
        target?.text,wrong,'context',random,target?.why);
      if(check)return check;
    }
    const words=bank?.words||[];
    const safe=[];
    const add=text=>{
      if(text&&text!==question.definition&&!safe.includes(text))safe.push(text);
    };
    for(const answer of question.options||[]){
      if(answer.correct)continue;
      const match=words.find(x=>x.word.toLocaleLowerCase('sv-SE')===
        String(answer.label).toLocaleLowerCase('sv-SE'));
      add(match?.definition||(question.picture?null:answer.label));
    }
    const own=words.find(x=>x.id===question.id);
    for(const entry of words){
      if(safe.length>=2)break;
      if(entry.id!==question.id&&entry.difficulty!==own?.difficulty)add(entry.definition);
    }
    return makeChallenge('Vilken förklaring hör till ordet ”'+word+'”?',
      question.definition,safe,'meaning',random);
  }
  function isCorrect(check,index) {
    return check?.options?.[index]?.correct === true;
  }
  // Two misses lead to a worked example, not an endless process of elimination.
  function nextStep(attempts,correct) {
    if(correct)return 'complete';
    return attempts>=2?'guided':'reread';
  }
  // Separate, local reading observations. A correct main answer does not
  // mean that a new example was understood. Only the Aha checkpoint updates
  // this record; it never creates grades, extra stars or user profiles.
  const ID=/^(?:sv|ut)-\d{4,}$/;
  const counter=value=>Number.isInteger(value)&&value>=0?Math.min(9999,value):0;
  function sanitizeProgress(raw) {
    const out=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    for(const [id,value] of Object.entries(raw).slice(0,500)){
      if(!ID.test(id)||!value||typeof value!=='object'||Array.isArray(value))continue;
      const entry=Object.create(null);
      for(const type of ['transfer','recognition']){
        const item=value[type];
        if(!item||typeof item!=='object'||Array.isArray(item))continue;
        const first=counter(item.first),supported=counter(item.supported);
        if(first+supported===0)continue;
        entry[type]={first,supported,streak:Math.min(counter(item.streak),first,99),
          lastAt:Number.isFinite(item.lastAt)&&item.lastAt>=0&&item.lastAt<=4102444800000?
            Math.floor(item.lastAt):0};
      }
      if(Object.keys(entry).length)out[id]=entry;
    }
    return out;
  }
  function recordProgress(raw,id,source,outcome,now=Date.now()) {
    if(!ID.test(id)||!['context','expression','meaning'].includes(source)||
      !['first','retry','guided'].includes(outcome))return raw;
    const type=source==='meaning'?'recognition':'transfer';
    const cards=sanitizeProgress(raw);
    const before=cards[id]?.[type]||{first:0,supported:0,streak:0,lastAt:0};
    const first=outcome==='first';
    return {...cards,[id]:{...cards[id],[type]:{
      first:Math.min(9999,before.first+(first?1:0)),
      supported:Math.min(9999,before.supported+(first?0:1)),
      streak:first?Math.min(99,before.streak+1):0,
      lastAt:Number.isFinite(now)&&now>=0&&now<=4102444800000?Math.floor(now):Date.now()
    }}};
  }
  function needsReview(raw,id,type='transfer') {
    const entry=raw?.[id]?.[type];
    return !!entry && entry.supported>0 && entry.streak<2;
  }
  return {makeCheck,isCorrect,nextStep,sanitizeProgress,recordProgress,needsReview};
});
