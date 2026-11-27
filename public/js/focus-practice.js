/* Ordjakten 0.16 – focused, locally generated practice for ONE concept.
 * The plan never invents scenarios: it uses the curated bank, authored scenes
 * and authored expression missions. A short plan may contain only two tasks.
 * Session scores are separate from regular tests, stars and quest badges.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenFocus = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const TYPES = ['picture','meaning','reverse','context','sentence','order','contrast'];
  const LABELS = {
    picture:'Hitta bilden',meaning:'Förstå betydelsen',reverse:'Hitta rätt ord',
    context:'Ord i vardagen',sentence:'Välj meningen som visar betydelsen',order:'Ordna berättelsen',contrast:'Hitta skillnaden'
  };
  const shuffle=(items,random=Math.random)=>{
    const output=items.slice();
    for(let i=output.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[output[i],output[j]]=[output[j],output[i]];}
    return output;
  };
  function findItem(id, bank, expressions) {
    if (!/^(?:sv|ut)-\d{4,}$/.test(String(id))) return null;
    const word=bank?.words?.find(entry=>entry.id===id);
    if (word) return {id,name:word.word,kind:'word',entry:word};
    const expression=expressions?.expressions?.find(entry=>entry.id===id);
    return expression ? {id,name:expression.phrase,kind:'expression',entry:expression} : null;
  }
  function supported(item,curation,contexts,missions,contrastLib=null,contrasts=null,confusionProgress={}) {
    if (!item) return [];
    if(item.kind==='expression') {
      const mission=missions?.missions?.find(entry=>entry.id===item.id);
      return mission ? ['meaning','sentence','order'] : ['meaning'];
    }
    const image=!!item.entry.illustration&&Array.isArray(curation?.easy?.[item.id])&&curation.easy[item.id].length===3;
    const hasContext=!!contexts?.wordContexts?.find(entry=>entry.id===item.id&&entry.scenes?.length===3);
    return [...(image?['picture']:[]),'meaning','reverse',...(hasContext?['context']:[]),...(contrastLib?.findPair(item.id,contrasts)?['contrast']:[])];
  }
  function recommended(item,types,progress) {
    if(!types?.length) return null;
    const entries=progress?.[item.id]?.skills||{};
    const weak=types.filter(type=>entries[type]?.wrong>0&&entries[type]?.streak<2)
      .sort((a,b)=>(entries[b].wrong-entries[a].wrong)||((entries[a].lastAt||0)-(entries[b].lastAt||0)));
    if(weak.length)return weak[0];
    // A previously discovered word benefits from applying it in context.
    const untried=types.filter(type=>!entries[type]?.attempts);
    if(untried.length)return untried.includes('context')&&types.some(type=>entries[type]?.attempts) ? 'context':untried[0];
    return types.slice().sort((a,b)=>(entries[a]?.lastAt||0)-(entries[b]?.lastAt||0))[0];
  }
  function create(id,requested,bank,curation,expressions,missions,contexts,engine,progress={},random=Math.random,contrastLib=null,contrasts=null,confusionProgress={},clues=null,clueData=null,clueProgress={}) {
    const item=findItem(id,bank,expressions);
    if(!item)throw new Error('Det ordet finns inte i ordbanken.');
    const pair=contrastLib?.findPair(item.id,contrasts);
    const everyday=engine.isEveryday(item.entry,curation);
    const ordinaryPair=!pair||[pair.left,pair.right].every(wordId=>
      engine.isEveryday(bank.words.find(word=>word.id===wordId),curation));
    // Keep the next-skill recommendation within the ordinary selection.
    // A named contrast remains available when deliberately requested.
    const types=supported(item,curation,contexts,missions,contrastLib,contrasts)
      .filter(type=>type!=='contrast'||requested==='contrast'||!everyday||ordinaryPair);
    if(!types.length)throw new Error('Det finns ingen färdig övning för ordet.');
    const chosen=types.includes(requested)?requested:recommended(item,types,progress);
    if(chosen==='contrast') {
      if(!contrastLib)throw new Error('Saknar övningen Hitta skillnaden.');
      const comparison=contrastLib.create(id,contrasts,bank,random,confusionProgress,clues,clueData,clueProgress);
      return {item,chosen,questions:comparison.questions,types,pairLabel:comparison.label,contexts:comparison.contexts,
        clueLevel:comparison.clueLevel,clueSupported:comparison.clueSupported};
    }
    const questions=[];
    // Words without an approved illustration are intentionally
    // part of the medium TEXT pool, not the emoji-only pool.
    const difficulty=item.kind==='word' ?
      item.entry.difficulty==='expert'?'exam':
        item.entry.difficulty==='easy'&&!Array.isArray(curation.easy?.[id])?'medium':item.entry.difficulty : 'medium';
    const make=(type,sceneIndex=null)=>{
      let q;
      if(item.kind==='expression')q=engine.makeExpressionQuestion(item.entry,'medium',random,type,missions);
      else if(type==='context')q=engine.makeContextQuestion(item.entry,bank,contexts,random,sceneIndex);
      else if(type==='reverse')q=engine.makeReverseQuestion(item.entry,bank,curation,difficulty,random);
      else if(type==='picture')q=engine.makeQuestion(item.entry,bank,curation,'easy',random);
      else q=engine.makeQuestion(item.entry,bank,curation,difficulty==='easy'?'medium':difficulty,random);
      return {...q,kind:item.kind,taskType:type==='picture'?'picture':type,
        focusKey:`${id}:${type}:${sceneIndex===null?'one':sceneIndex}`};
    };
    if(chosen==='context'){
      const scenes=contexts.wordContexts.find(x=>x.id===id).scenes;
      const last=progress?.[id]?.lastScene;
      const start=Number.isInteger(last)&&last>=0&&last<scenes.length ? (last+1)%scenes.length : Math.floor(random()*scenes.length);
      for(let i=0;i<scenes.length;i++)questions.push(make('context',(start+i)%scenes.length));
    }else{
      questions.push(make(chosen));
      const alternatives=item.kind==='expression' ? ['meaning','sentence','order'] :
        types.includes('context') ? ['context','reverse','picture','meaning'] : ['reverse','picture','meaning'];
      for(const type of alternatives){
        if(questions.length>=3)break;
        if(type===chosen||!types.includes(type))continue;
        if(type==='context'){
          const last=progress?.[id]?.lastScene;
          const first=Number.isInteger(last)&&last>=0&&last<3?(last+1)%3:Math.floor(random()*3);
          questions.push(make(type,first));
        } else questions.push(make(type));
      }
    }
    if(new Set(questions.map(q=>q.focusKey)).size!==questions.length)throw new Error('Dubblerad övning.');
    return {item,chosen,questions,types};
  }
  function results(answers,total) {
    const right=answers.filter(value=>value==='right').length;
    const wrong=answers.filter(value=>value==='wrong').length;
    return {right,wrong,completed:answers.length,total,percent:total?Math.round(100*right/total):0};
  }
  return {TYPES,LABELS,findItem,supported,recommended,create,results,shuffle};
});
