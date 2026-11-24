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
  return {makeCheck,isCorrect};
});
