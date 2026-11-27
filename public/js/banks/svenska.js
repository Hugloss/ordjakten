/* The Swedish bank owns its legacy language content; no copy is maintained here. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenSvenskaBank=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const BANK_ID='svenska';
  const ID=/^ut-\d{4,}$/;
  function optionId(label){
    let hash=2166136261;
    for(const ch of label.normalize('NFC'))hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
    return 'choice-'+hash.toString(16).padStart(8,'0');
  }
  function questionFromEntry(entry){
    if(!entry||!ID.test(entry.id)||typeof entry.phrase!=='string'||!entry.phrase.trim()||
      typeof entry.scene!=='string'||!entry.scene.trim()||
      !Array.isArray(entry.options)||entry.options.length!==5||
      entry.options.some(o=>!o||typeof o.label!=='string'||!o.label.trim()||typeof o.correct!=='boolean')||
      entry.options.filter(o=>o.correct).length!==1)
      throw new Error('Invalid Swedish expression: '+entry?.id);
    const options=entry.options.map(o=>({id:optionId(o.label),label:o.label}));
    if(new Set(options.map(o=>o.id)).size!==options.length)
      throw new Error('Duplicate Swedish expression alternatives: '+entry.id);
    const correctIndex=entry.options.findIndex(o=>o.correct);
    return {
      ref:{bankId:BANK_ID,id:'meaning-'+entry.id,revision:1},
      skillIds:['expression-in-context'],locale:'sv-SE',
      prompt:'Vad betyder uttrycket ”'+entry.phrase+'” i den här situationen?',
      stimulus:entry.scene,
      responseSpec:{kind:'single-choice',options},
      assessmentSpec:{kind:'single-choice',correctOptionId:options[correctIndex].id},
      explanation:Array.isArray(entry.reveal)?entry.reveal.map(x=>({title:x.title,text:x.text})):[],
      provenance:{legacyConceptId:entry.id,source:'public/data/expressions.json'},
      reviewStatus:entry.review_status||'draft'
    };
  }
  function fromLegacyExpressions(source){
    if(!source||!Array.isArray(source.expressions))throw new Error('Missing Swedish expression source');
    const questions=new Map();
    for(const entry of source.expressions){
      const question=questionFromEntry(entry);
      if(questions.has(question.ref.id))throw new Error('Duplicate Swedish question: '+question.ref.id);
      // Snapshot the authored source so later mutable UI state cannot alter a registered bank.
      questions.set(question.ref.id,JSON.parse(JSON.stringify(question)));
    }
    const ids=[...questions.keys()];
    return Object.freeze({
      describe:()=>({bankId:BANK_ID,revision:1,source:'public/data/expressions.json'}),
      listQuestionIds:()=>[...ids],
      getQuestion:id=>questions.has(id)?JSON.parse(JSON.stringify(questions.get(id))):null
    });
  }
  return {BANK_ID,questionFromEntry,fromLegacyExpressions};
});
