/* Swedish authored clue/treasure questions. Game progress stays in the game modules. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenSvenskaAdventures=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const assert=(condition,message)=>{if(!condition)throw new Error(message)};
  const good=value=>typeof value==='string'&&value.trim().length>0;
  function fromSources(portals,treasure){
    assert(Array.isArray(portals?.STORIES)&&treasure?.DATA&&treasure?.MYSTERIES&&
      treasure?.TRANSFERS,'Missing authored adventure sources');
    const questions=new Map(),counts={portals:0,places:0,mysteries:0,proofs:0,transfers:0};
    function question({id,kind,skill,prompt,stimulus,labels,correctIndex,why,source,storyId,legacyStepIndex}){
      assert(good(id)&&!questions.has(id)&&good(prompt)&&good(stimulus)&&good(why)&&
        Array.isArray(labels)&&labels.length>=2&&labels.length<=12&&
        labels.every(good)&&new Set(labels).size===labels.length&&
        Number.isInteger(correctIndex)&&correctIndex>=0&&correctIndex<labels.length,
        'Invalid authored adventure question: '+id);
      // Here each response ID is tied to its authored label, not the display order.
      const options=labels.map(label=>{
        let hash=2166136261;
        for(const char of label.normalize('NFC'))
          hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
        return {id:'choice-'+hash.toString(16).padStart(8,'0'),label};
      });
      assert(new Set(options.map(x=>x.id)).size===labels.length,'Choice hash collision: '+id);
      questions.set(id,{
        ref:{bankId:'svenska',id,revision:1},locale:'sv-SE',
        skillIds:[skill],prompt,stimulus,
        responseSpec:{kind:'single-choice',options},
        assessmentSpec:{kind:'single-choice',correctOptionId:options[correctIndex].id},
        explanation:[{text:why}],reviewStatus:'draft',
        provenance:{source,...(storyId?{storyId}:{}),
          ...(legacyStepIndex!==undefined?{legacyStepIndex}:{})}
      });
      counts[kind]++;
    }
    for(const story of portals.STORIES){
      assert(good(story.id)&&Array.isArray(story.stages)&&story.stages.length===3,'Invalid authored portal');
      story.stages.forEach((stage,i)=>{
        assert(stage.questionId==='portal-'+story.id+'-'+String(i+1).padStart(2,'0'),
          'Missing stable portal ID: '+story.id+':'+i);
        question({id:stage.questionId,kind:'portals',skill:'reading-two-clues',
          prompt:stage.title,stimulus:stage.scene+'\n'+stage.clues.join('\n'),
          labels:stage.choices,correctIndex:stage.answer,why:stage.why,
          source:'public/js/mission-portals-data.js',storyId:story.id,legacyStepIndex:i});
      });
    }
    const worlds=Object.keys(treasure.DATA);
    for(const world of worlds){
      const places=treasure.DATA[world];
      assert(Array.isArray(places)&&places.length===4,'Treasure world missing places: '+world);
      const options=places.map(p=>p.description);
      places.forEach((place,index)=>{
        assert(place.questionId==='treasure-place-'+world+'-'+String(index+1).padStart(2,'0'),
          'Missing stable treasure-place ID: '+world+':'+index);
        question({id:place.questionId,kind:'places',skill:'read-map-clues',
          prompt:place.clue,stimulus:place.clue+'\n'+place.lookFor.join('\n'),
          labels:options,correctIndex:index,why:place.why,
          source:'public/js/treasure-hunt-data.js',storyId:world,legacyStepIndex:index});
      });
      const mystery=treasure.MYSTERIES[world];
      assert(mystery?.questionId==='treasure-mystery-'+world,'Missing treasure mystery ID: '+world);
      question({id:mystery.questionId,kind:'mysteries',skill:'solve-mystery',
        prompt:mystery.title,stimulus:mystery.intro+'\n'+mystery.clues.join('\n'),
        labels:options,correctIndex:mystery.target,why:mystery.why,
        source:'public/js/treasure-hunt-data.js',storyId:world});
      // The proof exercise has a distinct assessment: select a pair of features.
      const proofTargets=[mystery.target,...places.map((_,i)=>i).filter(i=>i!==mystery.target).slice(0,2)];
      question({id:'treasure-proof-'+world,kind:'proofs',skill:'justify-two-clues',
        prompt:'Vilka två spår visar den rätta platsen?',stimulus:mystery.clues.join('\n'),
        labels:proofTargets.map(i=>places[i].lookFor.join(' och ')),correctIndex:0,
        why:mystery.why,source:'public/js/treasure-hunt-data.js',storyId:world});
      const transfer=treasure.TRANSFERS[world];
      assert(transfer?.questionId==='treasure-transfer-'+world,'Missing treasure transfer ID: '+world);
      question({id:transfer.questionId,kind:'transfers',skill:'transfer-clue-reasoning',
        prompt:transfer.title,stimulus:transfer.intro+'\n'+transfer.clues.join('\n'),
        labels:transfer.choices,correctIndex:transfer.target,why:transfer.why,
        source:'public/js/treasure-hunt-data.js',storyId:world});
    }
    const ids=[...questions.keys()];
    const frozen=new Map([...questions].map(([id,q])=>[id,clone(q)]));
    return Object.freeze({
      describe:()=>({bankId:'svenska',revision:1,source:'authored-adventures'}),
      listQuestionIds:()=>[...ids],
      getQuestion:id=>frozen.has(id)?clone(frozen.get(id)):null,
      counts:()=>({...counts})
    });
  }
  return {fromSources};
});
