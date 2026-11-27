/* Frivilliga miniuppdrag för barn: inga dagliga lås, inga konton, inga nätanrop.
 * Samma spelmotor och facit används. Endast urvalet och uppmuntran ändras.
 */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenQuests=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const QUESTS=Object.freeze({
    scout:Object.freeze({emoji:'🔎',title:'Ordspanaren',task:'Upptäck 5 ord',subtitle:'Våga prova fem ord. Alla försök räknas!',goal:5,done:'Du har utforskat fem ord!'}),
    stories:Object.freeze({emoji:'💬',title:'Berättelsehjälten',task:'Lös 5 uttryck',subtitle:'Blanda tre sorters frågor i en omgång.',goal:5,done:'Du har provat tre sätt att förstå uttryck!'}),
    comeback:Object.freeze({emoji:'🌱',title:'Nytt försök',task:'Ge ett svårt ord en ny chans',subtitle:'Försök igen med något du tidigare missat.',goal:1,done:'Du gav ett svårt ord en ny chans och hittade rätt!'}),
  });
  const KEYS=Object.keys(QUESTS);
  const validAnswer=answer=>answer==='right'||answer==='wrong';
  function sanitizeCounts(source){
    const counts={scout:0,stories:0,comeback:0};
    if(!source||typeof source!=='object'||Array.isArray(source))return counts;
    for(const key of KEYS){
      const n=source[key];
      counts[key]=Number.isInteger(n)&&n>=0?Math.min(999,n):0;
    }
    return counts;
  }
  function reviewChoice(settings,mistakes,bank,curation,expressions,engine,reviews=null,now=Date.now()){
    const topics=[...new Set([settings.topic,'mixed','words','expressions'])];
    const levels=[...new Set([settings.difficulty==='exam'?'medium':settings.difficulty,'easy','medium','hard'])];
    for(const topic of topics){
      for(const difficulty of levels){
        const matching=engine.getTopicPool(bank,curation,expressions,{topic,difficulty})
          .filter(x=>reviews===null?Number(mistakes?.[x.entry.id])>0:
            !!reviews[x.entry.id]&&reviews[x.entry.id].streak<3&&reviews[x.entry.id].dueAt<=now);
        if(matching.length)return {topic,difficulty,available:matching.length};
      }
    }
    return null;
  }
  function makePlan(id,settings,mistakes,bank,curation,expressions,engine,reviews=null,now=Date.now()){
    if(!QUESTS[id])return null;
    const base={mode:'train',timerMode:'off',timerSeconds:180,count:5,reviewOnly:false};
    if(id==='scout')return {id,settings:{...base,topic:'words',difficulty:settings.difficulty==='exam'?'easy':settings.difficulty}};
    if(id==='stories')return {id,settings:{...base,topic:'expressions',difficulty:'medium',expressionTask:'mix'}};
    const choice=reviewChoice(settings,mistakes,bank,curation,expressions,engine,reviews,now);
    return choice?{id,settings:{...base,topic:choice.topic,difficulty:choice.difficulty,reviewOnly:true,expressionTask:'mix'},available:choice.available}:null;
  }
  function chooseSurprise(settings,mistakes,bank,curation,expressions,engine,random=Math.random,reviews=null,now=Date.now()){
    const choices=KEYS.filter(id=>makePlan(id,settings,mistakes,bank,curation,expressions,engine,reviews,now));
    const r=Number.isFinite(random())?Math.min(0.999999,Math.max(0,random())):0;
    return choices[Math.floor(r*choices.length)]||'scout';
  }
  function progress(id,questions,answers,priorMistakes={}){
    const list=Array.isArray(questions)?questions:[];
    const answered=list.filter(q=>validAnswer(answers?.[q.id]));
    let done=0,complete=false;
    if(id==='scout'){
      done=answered.filter(q=>q.kind!=='expression').length;
      complete=done>=5;
    }else if(id==='stories'){
      const phrases=answered.filter(q=>q.kind==='expression');
      const kinds=new Set(phrases.map(q=>q.taskType||'meaning'));
      done=phrases.length;
      complete=done>=5&&['meaning','sentence','order'].every(type=>kinds.has(type));
    }else if(id==='comeback'){
      done=answered.filter(q=>answers[q.id]==='right'&&Number(priorMistakes[q.id])>0).length;
      complete=done>=1;
    }
    return {done:Math.min(done,QUESTS[id]?.goal||0),goal:QUESTS[id]?.goal||0,complete};
  }
  function earn(counts,id,completed){
    const safe=sanitizeCounts(counts);
    if(completed&&Object.hasOwn(QUESTS,id))safe[id]=Math.min(999,safe[id]+1);
    return safe;
  }
  return {QUESTS,KEYS,sanitizeCounts,reviewChoice,makePlan,chooseSurprise,progress,earn};
});
