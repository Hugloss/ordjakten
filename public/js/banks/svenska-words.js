/* Canonical word-question projection from the authored Swedish word/context sources.
 * No question text is copied into files owned by game modes. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenSvenskaWords=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const idPattern=/^sv-\d{4,}$/;
  const scenePattern=/^context-sv-\d{4,}-\d{2}$/;
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
  function fromSources(words,contexts,curation){
    assert(Array.isArray(words?.words)&&Array.isArray(contexts?.wordContexts),'Missing Swedish word sources');
    const wordMap=new Map();
    const questions=new Map();
    const counts={meaning:0,reverse:0,context:0,picture:0};
    for(const word of words.words){
      assert(word&&idPattern.test(word.id)&&!wordMap.has(word.id)&&
        typeof word.word==='string'&&typeof word.definition==='string','Invalid word in Swedish bank');
      wordMap.set(word.id,word);
    }
    const records=new Map();
    for(const row of contexts.wordContexts){
      assert(row&&wordMap.has(row.id)&&!records.has(row.id)&&
        Array.isArray(row.distractors)&&row.distractors.length===4&&
        Array.isArray(row.scenes)&&row.scenes.length===3,'Invalid authored word context: '+row?.id);
      records.set(row.id,row);
    }
    assert(records.size===wordMap.size,'Missing authored word contexts');
    function add(id,kind,skill,source,conceptId,prompt,stimulus,choices,correctId,why,sceneId=null){
      assert(!questions.has(id)&&Array.isArray(choices)&&choices.length>=2&&
        choices.every(o=>o&&typeof o.label==='string'&&o.label.trim()&&typeof o.id==='string')&&
        new Set(choices.map(x=>x.id)).size===choices.length&&
        choices.some(x=>x.id===correctId),'Invalid Swedish question: '+id);
      questions.set(id,{
        ref:{bankId:'svenska',id,revision:1},locale:'sv-SE',
        skillIds:[skill],prompt,stimulus,
        responseSpec:{kind:'single-choice',options:choices},
        assessmentSpec:{kind:'single-choice',correctOptionId:correctId},
        explanation:[{text:why}],
        reviewStatus:wordMap.get(conceptId).review_status||'draft',
        provenance:{source,legacyConceptId:conceptId,...(sceneId?{sceneId}:{})}
      });
      counts[kind]++;
    }
    for(const word of words.words){
      const row=records.get(word.id);
      const candidates=[word.id,...row.distractors];
      assert(new Set(candidates).size===5&&candidates.every(x=>wordMap.has(x)),
        'Invalid Swedish word distractor references: '+word.id);
      const wordOptions=candidates.map(id=>({id:'word-'+id,label:wordMap.get(id).word}));
      const meaningOptions=candidates.map(id=>({id:'definition-'+id,label:wordMap.get(id).definition}));
      const toUnique=options=>new Set(options.map(o=>o.label)).size===options.length;
      assert(toUnique(wordOptions)&&toUnique(meaningOptions),'Ambiguous candidate labels: '+word.id);
      add('word-meaning-'+word.id,'meaning','word-meaning',
        'public/data/ordbank.json',word.id,'Vad betyder ordet ”'+word.word+'”?',word.example,
        meaningOptions,'definition-'+word.id,word.teaching?.explanation||word.definition);
      add('word-reverse-'+word.id,'reverse','word-recall',
        'public/data/ordbank.json',word.id,'Vilket ord passar betydelsen?',word.definition,
        wordOptions,'word-'+word.id,word.teaching?.explanation||word.example);
      row.scenes.forEach((scene,index)=>{
        assert(scene&&scenePattern.test(scene.id)&&
          scene.id==='context-'+word.id+'-'+String(index+1).padStart(2,'0')&&
          typeof scene.text==='string'&&scene.text.trim()&&
          typeof scene.why==='string'&&scene.why.trim(),'Missing stable authored scene ID: '+word.id);
        add(scene.id,'context','word-context','public/data/word-contexts.json',word.id,
          'Vilket ord passar i berättelsen?',scene.text,wordOptions,
          'word-'+word.id,scene.why,scene.id);
      });
      const pict=curation?.easy?.[word.id];
      if(pict){
        assert(word.illustration&&Array.isArray(pict)&&pict.length===3,'Invalid curated picture choices: '+word.id);
        const pictures=[{id:'picture-'+word.id,label:word.illustration.label,emoji:word.illustration.value},
          ...pict.map(([emoji,label])=>({id:'picture-'+emoji.codePointAt(0).toString(16)+'-'+label.length,label,emoji}))];
        assert(new Set(pictures.map(x=>x.id)).size===4&&toUnique(pictures),
          'Duplicate curated pictures: '+word.id);
        add('word-picture-'+word.id,'picture','word-picture','public/data/curation.js',
          word.id,'Vilken bild passar till ordet ”'+word.word+'”?',word.word,
          pictures,'picture-'+word.id,word.teaching?.explanation||word.definition);
      }
    }
    const ids=[...questions.keys()];
    const snapshots=new Map([...questions].map(([id,q])=>[id,clone(q)]));
    return Object.freeze({
      describe:()=>({bankId:'svenska',revision:1,source:'public/data/ordbank.json'}),
      listQuestionIds:()=>[...ids],
      getQuestion:id=>snapshots.has(id)?clone(snapshots.get(id)):null,
      counts:()=>({...counts})
    });
  }
  return {fromSources};
});
