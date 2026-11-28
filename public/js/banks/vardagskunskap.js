/* A domain-owned, bank-scoped adapter. No UI, story or scoring dependencies. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenVardagsBank=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const BANK_ID='vardagskunskap';
  const ID=/^vk-[0-9]{4,}$/;
  const TOKEN=/^[a-z][a-z0-9-]{1,95}$/;
  const copy=value=>JSON.parse(JSON.stringify(value));
  const goodText=x=>typeof x==='string'&&x.trim().length>0;
  function assert(ok,message){if(!ok)throw new Error(message);}
  function optionId(label){
    let hash=2166136261;
    for(const char of label.normalize('NFC'))hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
    return 'choice-'+hash.toString(16).padStart(8,'0');
  }
  function fromAuthored(source){
    assert(source&&source.bankId===BANK_ID&&source.version===1&&
      source.language==='sv-SE'&&Array.isArray(source.topics)&&
      Array.isArray(source.questions),'Invalid everyday knowledge source');
    const topics=new Map();
    for(const topic of source.topics){
      assert(topic&&TOKEN.test(topic.id)&&goodText(topic.name)&&goodText(topic.description)&&
        !topics.has(topic.id),'Invalid or duplicate everyday topic');
      topics.set(topic.id,copy(topic));
    }
    assert(topics.size>0,'Everyday knowledge bank has no topics');
    const questions=new Map();
    const idsByTopic=new Map([...topics.keys()].map(id=>[id,[]]));
    for(const entry of source.questions){
      assert(entry&&ID.test(entry.id)&&!questions.has(entry.id)&&
        topics.has(entry.topicId)&&Number.isInteger(entry.level)&&entry.level>=1&&entry.level<=3&&
        entry.revision>=1&&Number.isSafeInteger(entry.revision)&&
        goodText(entry.stimulus)&&goodText(entry.prompt)&&goodText(entry.explanation)&&
        TOKEN.test(entry.skill)&&['draft','reviewed','published'].includes(entry.reviewStatus)&&
        Array.isArray(entry.choices)&&entry.choices.length===4&&
        entry.choices.every(goodText)&&
        new Set(entry.choices.map(x=>x.normalize('NFC').trim().toLocaleLowerCase('sv-SE'))).size===4&&
        Number.isInteger(entry.correctIndex)&&entry.correctIndex>=0&&entry.correctIndex<4,
        'Invalid everyday question: '+entry?.id);
      const options=entry.choices.map(label=>({id:optionId(label),label}));
      assert(new Set(options.map(o=>o.id)).size===4,'Duplicate option IDs: '+entry.id);
      const question={
        ref:{bankId:BANK_ID,id:entry.id,revision:entry.revision},
        locale:'sv-SE',
        skillIds:[entry.topicId,entry.skill],
        prompt:entry.prompt,stimulus:entry.stimulus,
        responseSpec:{kind:'single-choice',options},
        assessmentSpec:{kind:'single-choice',correctOptionId:options[entry.correctIndex].id},
        explanation:[{text:entry.explanation}],
        topicId:entry.topicId,difficulty:entry.level,
        reviewStatus:entry.reviewStatus,
        provenance:{source:'public/data/vardagskunskap.js',authoredId:entry.id}
      };
      questions.set(entry.id,question);
      idsByTopic.get(entry.topicId).push(entry.id);
    }
    assert(questions.size>0&&[...idsByTopic.values()].every(ids=>ids.length>0),
      'Everyday themes must contain questions');
    const ids=[...questions.keys()];
    return Object.freeze({
      describe:()=>({bankId:BANK_ID,revision:1,source:'public/data/vardagskunskap.js'}),
      listQuestionIds:()=>[...ids],
      listTopics:()=>copy([...topics.values()]),
      listTopicQuestionIds:topicId=>{
        assert(topics.has(topicId),'Unknown everyday topic: '+topicId);
        return [...idsByTopic.get(topicId)];
      },
      getQuestion:id=>questions.has(id)?copy(questions.get(id)):null
    });
  }
  return {BANK_ID,fromAuthored,optionId};
});
