/* Separate Swedish word reasoning, mini-games and curated quiz projections.
 * Sources are original authored files; this is a read-only question catalog. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenSvenskaExercises=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x));
  const valid=x=>typeof x==='string'&&x.trim().length>0;
  const assert=(condition,message)=>{if(!condition)throw new Error(message)};
  function fromSources({words,contrasts,clues,surprises,actionWords,worldMissions}){
    assert(Array.isArray(words?.words)&&Array.isArray(contrasts?.pairs)&&
      Array.isArray(clues?.pairs)&&Array.isArray(surprises?.challenges)&&
      Array.isArray(actionWords?.DATA)&&worldMissions?.DATA,'Missing authored Swedish exercise sources');
    const wordMap=new Map(words.words.map(w=>[w.id,w]));
    assert(wordMap.size===words.words.length,'Duplicate word concepts');
    const questions=new Map(),counts={contrast:0,clue:0,bonus:0,action:0,worldMission:0};
    function add({id,kind,skill,prompt,stimulus,options,correctId,why,source,legacyConceptId,sceneId}){
      assert(!questions.has(id)&&valid(id)&&valid(prompt)&&valid(stimulus)&&valid(why)&&
        Array.isArray(options)&&options.length>=2&&options.length<=12&&
        options.every(row=>valid(row.id)&&valid(row.label))&&
        new Set(options.map(row=>row.id)).size===options.length&&
        options.some(row=>row.id===correctId),'Invalid or duplicate authored exercise: '+id);
      questions.set(id,{
        ref:{bankId:'svenska',id,revision:1},locale:'sv-SE',
        skillIds:[skill],prompt,stimulus,
        responseSpec:{kind:'single-choice',options},
        assessmentSpec:{kind:'single-choice',correctOptionId:correctId},
        explanation:[{text:why}],reviewStatus:'draft',
        provenance:{source,...(legacyConceptId?{legacyConceptId}:{}),
          ...(sceneId?{sceneId}:{})}
      });
      counts[kind]++;
    }
    const paired=(pair,scene,id,kind,skill,source)=>{
      assert(wordMap.has(pair.left)&&wordMap.has(pair.right)&&
        [pair.left,pair.right].includes(scene.target),'Unknown paired word: '+id);
      add({id,kind,skill,source,sceneId:scene.id,legacyConceptId:scene.target,
        prompt:'Vilket ord beskriver situationen?',stimulus:scene.text,
        options:[pair.left,pair.right].map(wid=>({id:'word-'+wid,label:wordMap.get(wid).word})),
        correctId:'word-'+scene.target,why:scene.why});
    };
    const pairs=new Map();
    for(const pair of contrasts.pairs){
      assert(pair&&!pairs.has(pair.id),'Duplicate contrast pair: '+pair?.id);
      pairs.set(pair.id,pair);
      for(const scene of pair.scenes||[])
        paired(pair,scene,'contrast-'+scene.id,'contrast','compare-words','public/data/contrasts.json');
    }
    for(const item of clues.pairs){
      const pair=pairs.get(item.id);
      assert(pair,'Unknown ladder pair: '+item.id);
      for(const level of item.levels||[])for(const scene of level.scenes||[])
        paired(pair,scene,'clue-'+scene.id,'clue','infer-word','public/data/clue-ladder.json');
    }
    for(const challenge of surprises.challenges){
      assert(Array.isArray(challenge.options)&&challenge.options.length>=2&&
        challenge.options.filter(row=>row.correct).length===1,'Invalid surprise choices: '+challenge?.id);
      const options=challenge.options.map((choice,i)=>({id:'bonus-option-'+String(i+1),label:choice.label}));
      const correct=challenge.options.findIndex(row=>row.correct);
      add({id:'bonus-'+challenge.id,kind:'bonus',skill:'expression-transfer',
        prompt:challenge.prompt,stimulus:challenge.prompt,options,
        correctId:options[correct].id,why:challenge.explanation,
        source:'public/data/surprises.json',legacyConceptId:challenge.id});
    }
    for(const row of actionWords.DATA){
      assert(wordMap.has(row.word)&&Array.isArray(row.options),'Unknown word action: '+row.id);
      const options=row.options.map(([id,,label])=>({id:'action-'+id,label}));
      add({id:'action-'+row.id,kind:'action',skill:'word-action',
        prompt:row.prompt,stimulus:row.target,options,
        correctId:'action-'+row.answer,why:row.why,
        source:'public/js/action-words.js',legacyConceptId:row.word});
    }
    for(const [world,rows] of Object.entries(worldMissions.DATA)){
      assert(Array.isArray(rows)&&rows.length===4,'Invalid world mission list: '+world);
      for(const [index,row] of rows.entries()){
        const [wordId,prompt,labels,why,id]=row;
        assert(row.length===5&&id==='world-mission-'+world+'-'+String(index+1).padStart(2,'0')&&
          wordMap.has(wordId)&&Array.isArray(labels)&&labels.length===3,
          'Unversioned world mission: '+world+':'+index);
        const options=labels.map((label,i)=>({id:'mission-option-'+String(i),label}));
        add({id,kind:'worldMission',skill:'word-in-scene',prompt,stimulus:prompt,options,
          correctId:options[0].id,why,source:'public/js/world-missions.js',legacyConceptId:wordId});
      }
    }
    const ids=[...questions.keys()];
    const frozen=new Map([...questions].map(([id,q])=>[id,clone(q)]));
    return Object.freeze({
      describe:()=>({bankId:'svenska',revision:1,source:'authored-exercises'}),
      listQuestionIds:()=>[...ids],
      getQuestion:id=>frozen.has(id)?clone(frozen.get(id)):null,
      counts:()=>({...counts})
    });
  }
  return {fromSources};
});
