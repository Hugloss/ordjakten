/* Compose subject-owned Swedish content into one searchable, stable-ID bank.
 * A source has one editorial owner; the composite never copies authored files. */
(function(root,factory){
  const legacy=typeof module!=='undefined'&&module.exports?require('./svenska'):root.OrdjaktenSvenskaBank;
  const words=typeof module!=='undefined'&&module.exports?require('./svenska-words'):root.OrdjaktenSvenskaWords;
  const exercises=typeof module!=='undefined'&&module.exports?require('./svenska-exercises'):root.OrdjaktenSvenskaExercises;
  const adventures=typeof module!=='undefined'&&module.exports?require('./svenska-adventures'):root.OrdjaktenSvenskaAdventures;
  const api=factory(legacy,words,exercises,adventures);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenSvenskaCatalog=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Legacy,Words,Exercises,Adventures){
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value));
  function fromSources({expressions,missions,words,contexts,curation,contrasts,clues,
    surprises,portals,treasure,worldMissions,actionWords}){
    const providers=[
      Legacy.fromLegacyExpressions(expressions,missions),
      Words.fromSources(words,contexts,curation),
      Exercises.fromSources({words,contrasts,clues,surprises,worldMissions,actionWords}),
      Adventures.fromSources(portals,treasure)
    ];
    const records=new Map(),groups={};
    for(const provider of providers){
      const id=provider.describe().bankId;
      if(id!=='svenska')throw new Error('Cross-bank provider rejected: '+id);
      if(provider.counts)Object.assign(groups,provider.counts());
      for(const questionId of provider.listQuestionIds()){
        if(records.has(questionId))throw new Error('Duplicate Swedish question ID: '+questionId);
        const question=provider.getQuestion(questionId);
        if(question?.ref?.id!==questionId||question.ref.bankId!=='svenska')
          throw new Error('Cross-bank reference rejected: '+questionId);
        records.set(questionId,question);
      }
    }
    const ids=[...records.keys()];
    return Object.freeze({
      describe:()=>({bankId:'svenska',revision:1,source:'federated-authored-swedish-sources'}),
      listQuestionIds:()=>[...ids],
      getQuestion:id=>records.has(id)?clone(records.get(id)):null,
      counts:()=>({...groups,expressions:providers[0].listQuestionIds().length,total:ids.length})
    });
  }
  return {fromSources};
});
