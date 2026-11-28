/* Swedish owns authored words/expressions; the adapter never copies source files. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenSvenskaBank=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const BANK_ID='svenska';
  const ID=/^ut-\d{4,}$/;
  const copy=value=>JSON.parse(JSON.stringify(value));
  function optionId(label){
    let hash=2166136261;
    for(const ch of label.normalize('NFC'))hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
    return 'choice-'+hash.toString(16).padStart(8,'0');
  }
  function mappedChoices(rows,{context=null}={}){
    if(!Array.isArray(rows)||rows.length<2||rows.length>12||
      rows.some(row=>!row||typeof row.label!=='string'||!row.label.trim()||
        typeof row.correct!=='boolean')||rows.filter(row=>row.correct).length!==1)
      throw new Error('Invalid authored Swedish choices');
    const labels=rows.map(row=>context===null?row.label:'”'+context+'” – '+row.label);
    const options=labels.map(label=>({id:optionId(label),label}));
    if(new Set(options.map(row=>row.id)).size!==options.length)
      throw new Error('Duplicate authored Swedish choices');
    return {options,correctOptionId:options[rows.findIndex(row=>row.correct)].id};
  }
  function questionFromEntry(entry){
    if(!entry||!ID.test(entry.id)||typeof entry.phrase!=='string'||!entry.phrase.trim()||
      typeof entry.scene!=='string'||!entry.scene.trim()||
      !Array.isArray(entry.options)||entry.options.length!==5)
      throw new Error('Invalid Swedish expression: '+entry?.id);
    const {options,correctOptionId}=mappedChoices(entry.options);
    return {
      ref:{bankId:BANK_ID,id:'meaning-'+entry.id,revision:1},
      skillIds:['expression-in-context'],locale:'sv-SE',
      prompt:'Vad betyder uttrycket ”'+entry.phrase+'” i den här situationen?',
      stimulus:entry.scene,
      responseSpec:{kind:'single-choice',options},
      assessmentSpec:{kind:'single-choice',correctOptionId},
      explanation:Array.isArray(entry.reveal)?entry.reveal.map(x=>({title:x.title,text:x.text})):[],
      provenance:{legacyConceptId:entry.id,source:'public/data/expressions.json'},
      reviewStatus:entry.review_status||'draft'
    };
  }
  function questionFromSentence(entry,mission,scene=null){
    if(!entry||!ID.test(entry.id)||!mission||mission.id!==entry.id)
      throw new Error('Invalid Swedish sentence source: '+entry?.id);
    const contextual=scene!==null;
    if(contextual&&(!/^[a-z][a-z0-9-]{1,80}$/.test(scene.id||'')||
      !scene.id.startsWith(mission.id+'-')||
      typeof scene.prompt!=='string'||!scene.prompt.trim()))
      throw new Error('Invalid Swedish contextual scene: '+entry.id);
    const authored=contextual?scene.options:mission.sentences;
    if(!Array.isArray(authored)||authored.length!==3)
      throw new Error('Swedish sentence requires three alternatives: '+entry.id);
    const {options,correctOptionId}=mappedChoices(authored,
      contextual?{context:scene.prompt}:{});
    const id='sentence-'+(contextual?scene.id:entry.id);
    return {
      ref:{bankId:BANK_ID,id,revision:1},
      skillIds:['expression-in-sentence'],locale:'sv-SE',
      prompt:contextual?'Vad menas i just den här situationen?':
        'Vilken mening använder uttrycket ”'+entry.phrase+'” rätt?',
      stimulus:contextual?scene.prompt:mission.prompt||entry.scene,
      responseSpec:{kind:'single-choice',options},
      assessmentSpec:{kind:'single-choice',correctOptionId},
      explanation:contextual?[{text:scene.explanation},{text:scene.connection}]:
        [{text:mission.hint||entry.definition}],
      provenance:{legacyConceptId:entry.id,source:'public/data/missions.json',
        ...(contextual?{contextSceneId:scene.id}:{})},
      reviewStatus:entry.review_status||'draft'
    };
  }
  function questionFromOrder(entry,mission){
    if(!entry||!ID.test(entry.id)||!mission||mission.id!==entry.id||
      !Array.isArray(mission.order)||mission.order.length!==3||
      mission.order.some(label=>typeof label!=='string'||!label.trim()))
      throw new Error('Invalid Swedish ordering source: '+entry?.id);
    const options=mission.order.map(label=>({id:optionId(label),label}));
    if(new Set(options.map(row=>row.id)).size!==options.length)
      throw new Error('Duplicate Swedish ordering steps: '+entry.id);
    return {
      ref:{bankId:BANK_ID,id:'order-'+entry.id,revision:1},
      skillIds:['expression-sequence'],locale:'sv-SE',
      prompt:'I vilken ordning händer sakerna i uttrycket ”'+entry.phrase+'”?',
      stimulus:mission.prompt||entry.scene,
      responseSpec:{kind:'ordering',options},
      assessmentSpec:{kind:'ordering',correctOrder:options.map(row=>row.id)},
      explanation:[{text:mission.orderExplanation||mission.hint||entry.definition}],
      provenance:{legacyConceptId:entry.id,source:'public/data/missions.json'},
      reviewStatus:entry.review_status||'draft'
    };
  }
  function fromLegacyExpressions(source,missions=null){
    if(!source||!Array.isArray(source.expressions))
      throw new Error('Missing Swedish expression source');
    const questions=new Map();
    const entries=new Map();
    function add(question){
      if(questions.has(question.ref.id))
        throw new Error('Duplicate Swedish question: '+question.ref.id);
      questions.set(question.ref.id,copy(question));
    }
    for(const entry of source.expressions){
      if(entries.has(entry.id))throw new Error('Duplicate Swedish expression: '+entry.id);
      entries.set(entry.id,entry);
      add(questionFromEntry(entry));
    }
    if(missions!==null){
      if(!missions||!Array.isArray(missions.missions))
        throw new Error('Missing Swedish mission source');
      const seen=new Set();
      for(const mission of missions.missions){
        if(!mission||!ID.test(mission.id)||seen.has(mission.id)||!entries.has(mission.id))
          throw new Error('Unknown or duplicate Swedish mission: '+mission?.id);
        seen.add(mission.id);
        const entry=entries.get(mission.id);
        add(questionFromSentence(entry,mission));
        add(questionFromOrder(entry,mission));
        if(mission.contextScenes!==undefined){
          if(!Array.isArray(mission.contextScenes)||mission.contextScenes.length!==3)
            throw new Error('Invalid authored context collection: '+mission.id);
          for(const scene of mission.contextScenes)
            add(questionFromSentence(entry,mission,scene));
        }
      }
      if(seen.size!==entries.size)
        throw new Error('Missing Swedish missions for authored expressions');
    }
    const ids=[...questions.keys()];
    return Object.freeze({
      describe:()=>({bankId:BANK_ID,revision:1,
        source:'public/data/expressions.json',
        ...(missions!==null?{additionalSource:'public/data/missions.json'}:{})}),
      listQuestionIds:()=>[...ids],
      getQuestion:id=>questions.has(id)?copy(questions.get(id)):null
    });
  }
  return {BANK_ID,optionId,questionFromEntry,questionFromSentence,questionFromOrder,
    fromLegacyExpressions};
});
