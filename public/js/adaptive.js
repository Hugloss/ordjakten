/* Ordjakten 0.13: small, deterministic and inspectable skill-by-skill practice.
 * No AI, accounts, network requests, names or answer texts. Each stored entry
 * has only an anonymous content ID, a task type and bounded counters.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenAdaptive = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const ID = /^(?:sv|ut)-\d{4,}$/;
  const SKILLS = ['picture','meaning','reverse','context','sentence','order','contrast'];
  const LABELS = Object.freeze({picture:'Hitta rätt bild',meaning:'Förstå betydelsen',reverse:'Hitta rätt ord',context:'Ord i vardagen',sentence:'Välj rätt mening',order:'Ordna berättelsen',contrast:'Hitta skillnaden'});
  const limit = (value, max) => Number.isInteger(value) && value >= 0 ? Math.min(value,max) : 0;
  const nowValue = now => Number.isFinite(now) && now >= 0 ? Math.floor(now) : Date.now();
  const blankSkill = () => ({right:0,wrong:0,streak:0,attempts:0,lastAt:0});
  const blankCard = () => ({skills:Object.create(null),lastScene:-1});
  function sanitize(raw) {
    const output = Object.create(null);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return output;
    for (const [id,entry] of Object.entries(raw).slice(0,500)) {
      if (!ID.test(id) || !entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const card = blankCard();
      card.lastScene = Number.isInteger(entry.lastScene) && entry.lastScene >= 0 && entry.lastScene <= 2 ? entry.lastScene : -1;
      if (entry.skills && typeof entry.skills === 'object' && !Array.isArray(entry.skills)) {
        for (const skill of SKILLS) {
          const item = entry.skills[skill];
          if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
          const right = limit(item.right,9999),wrong = limit(item.wrong,9999);
          card.skills[skill] = {
            right, wrong, streak:Math.min(limit(item.streak,99),right),
            attempts:Math.max(limit(item.attempts,9999),Math.min(9999,right+wrong)),
            lastAt:Number.isFinite(item.lastAt) && item.lastAt >= 0 && item.lastAt <= 4102444800000 ? Math.floor(item.lastAt) : 0
          };
        }
      }
      if (Object.keys(card.skills).length || card.lastScene !== -1) output[id]=card;
    }
    return output;
  }
  function task(question) {
    if (question?.kind === 'expression') return ['sentence','order'].includes(question.taskType) ? question.taskType : 'meaning';
    if (question?.taskType === 'contrast') return 'contrast';
    if (question?.taskType === 'context') return 'context';
    if (question?.taskType === 'reverse') return 'reverse';
    return question?.picture ? 'picture' : 'meaning';
  }
  function record(progress, question, outcome, now = Date.now()) {
    if (!question || !ID.test(question.id) || !['right','wrong'].includes(outcome)) return progress;
    const current = progress && progress[question.id];
    const card = current ? {skills:{...current.skills},lastScene:current.lastScene} : blankCard();
    const type = task(question), previous = current?.skills?.[type] || blankSkill();
    const correct = outcome === 'right';
    card.skills[type] = {
      right:Math.min(9999,previous.right+(correct?1:0)),
      wrong:Math.min(9999,previous.wrong+(correct?0:1)),
      attempts:Math.min(9999,previous.attempts+1),
      streak:correct?Math.min(99,previous.streak+1):0,
      lastAt:nowValue(now)
    };
    if(type==='context' && Number.isInteger(question.contextIndex) && question.contextIndex>=0 && question.contextIndex<=2)card.lastScene=question.contextIndex;
    return {...progress,[question.id]:card};
  }
  // Context evidence is deliberately distinct from aggregate skill counters:
  // two correct clicks on one story do not cover two situations. The key is
  // an authored-content fingerprint, not a saved story or a child identifier.
  function sceneKey(scene) {
    const text=JSON.stringify([scene.title,scene.text,scene.why]);
    let a=2166136261,b=2246822519;
    for(let i=0;i<text.length;i++){
      const unit=text.charCodeAt(i);
      a=Math.imul(a^unit,16777619);
      b=Math.imul(b^unit,3266489917);
    }
    return 'scene-'+(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');
  }
  const sceneTime=value=>Number.isFinite(value)&&value>=0&&value<=4102444800000?Math.floor(value):0;
  function sanitizeContextProgress(raw,contexts) {
    const out=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    for(const record of contexts?.wordContexts||[]){
      const stored=raw[record.id];
      if(!stored||typeof stored!=='object'||Array.isArray(stored))continue;
      const clean=Object.create(null);
      for(const scene of record.scenes){
        const key=sceneKey(scene),value=stored[key];
        if(!value||typeof value!=='object'||Array.isArray(value))continue;
        const mainRight=limit(value.mainRight,9999),mainWrong=limit(value.mainWrong,9999);
        const ahaFirst=limit(value.ahaFirst,9999),ahaSupported=limit(value.ahaSupported,9999);
        const lastMain=value.lastMain==='right'&&mainRight?'right':value.lastMain==='wrong'&&mainWrong?'wrong':null;
        const lastAha=value.lastAha==='first'&&ahaFirst?'first':
          ['retry','guided'].includes(value.lastAha)&&ahaSupported?value.lastAha:null;
        if(!lastMain&&!lastAha)continue;
        clean[key]={mainRight,mainWrong,lastMain,lastMainAt:lastMain?sceneTime(value.lastMainAt):0,
          ahaFirst,ahaSupported,lastAha,lastAhaAt:lastAha?sceneTime(value.lastAhaAt):0};
      }
      if(Object.keys(clean).length)out[record.id]=clean;
    }
    return out;
  }
  function recordContext(raw,contexts,id,index,text,lane,outcome,now=Date.now()) {
    const record=contexts?.wordContexts?.find(item=>item.id===id);
    const scene=Number.isInteger(index)&&record?.scenes[index];
    if(!scene||scene.text!==text||
      !(lane==='main'&&['right','wrong'].includes(outcome)||lane==='aha'&&['first','retry','guided'].includes(outcome)))return raw;
    const cards=sanitizeContextProgress(raw,contexts),key=sceneKey(scene);
    const before=cards[id]?.[key]||{mainRight:0,mainWrong:0,lastMain:null,lastMainAt:0,
      ahaFirst:0,ahaSupported:0,lastAha:null,lastAhaAt:0};
    const updated={...before};
    const at=sceneTime(now);
    if(lane==='main'){
      const count=outcome==='right'?'mainRight':'mainWrong';
      updated[count]=Math.min(9999,before[count]+1);
      updated.lastMain=outcome;updated.lastMainAt=at;
    }else{
      const count=outcome==='first'?'ahaFirst':'ahaSupported';
      updated[count]=Math.min(9999,before[count]+1);
      updated.lastAha=outcome;updated.lastAhaAt=at;
    }
    return {...cards,[id]:{...cards[id],[key]:updated}};
  }
  function sceneNeedsPractice(scene){
    return scene.lastMain==='wrong'||
      (['retry','guided'].includes(scene.lastAha)&&(scene.lastMain!=='right'||scene.ahaAt>=scene.mainAt));
  }
  function contextSummary(record,progress) {
    const scenes=(record?.scenes||[]).map((scene,index)=>{
      const item=progress?.[record.id]?.[sceneKey(scene)];
      return {index,title:scene.title,lastMain:item?.lastMain||null,lastAha:item?.lastAha||null,
        mainAt:item?.lastMainAt||0,ahaAt:item?.lastAhaAt||0};
    });
    const tried=scenes.filter(scene=>scene.lastMain||scene.lastAha).length;
    const correct=scenes.filter(scene=>scene.lastMain==='right').length;
    const needs=scenes.filter(sceneNeedsPractice).length;
    return {scenes,total:scenes.length,tried,correct,needs,
      mainTried:scenes.filter(scene=>scene.lastMain).length};
  }
  function contextPriority(id,memory) {
    const record=memory?.catalog?.wordContexts?.find(item=>item.id===id);
    const info=contextSummary(record,memory?.progress);
    if(!info.tried)return 0;
    return info.needs?3:info.correct<info.total?1:0;
  }
  function contextOrder(record,progress,{purpose='main',exclude=[],previous=-1,random=Math.random}={}) {
    const info=contextSummary(record,progress);
    const candidates=info.scenes.filter(scene=>!exclude.includes(scene.index));
    const rank=scene=>{
      if(!scene.lastMain&&!scene.lastAha)return 0;
      if(purpose==='aha'){
        if(!scene.lastAha)return 1;
        return scene.lastAha==='first'?3:2;
      }
      if(!scene.lastMain)return 1;
      return sceneNeedsPractice(scene)?2:3;
    };
    // First seek entirely new stories. For equally useful scenes, avoid the
    // most recent main story and use the least recently observed evidence.
    return shuffle(candidates,random).sort((a,b)=>rank(a)-rank(b)||
      Number(a.index===previous)-Number(b.index===previous)||
      Math.max(a.mainAt,a.ahaAt)-Math.max(b.mainAt,b.ahaAt)).map(scene=>scene.index);
  }
  function availableTypes(item, settings, hasContext, hasMissions) {
    if (item.kind === 'expression') {
      if(settings.difficulty==='exam'||settings.expressionTask!=='mix') return [settings.difficulty==='exam'?'meaning':settings.expressionTask||'meaning'];
      return hasMissions?['meaning','sentence','order']:['meaning'];
    }
    if (settings.difficulty==='easy') return ['picture'];
    return hasContext && settings.contextMix!==false ? ['meaning','reverse','context'] : ['meaning','reverse'];
  }
  function needsPractice(entry) {return !!entry && entry.wrong > 0 && entry.streak < 2;}
  function skillPriority(entry) {
    if(needsPractice(entry))return 100 + Math.min(entry.wrong,20);
    if(!entry || !entry.attempts)return 30;
    if(entry.streak===0)return 16;
    if(entry.streak===1)return 9;
    return Math.max(1,5-Math.min(entry.streak,4));
  }
  function choiceType(item,settings,progress,types,random=Math.random,readingProgress=null,contextMemory=null) {
    if(types.length===1)return types[0];
    const id=item.entry.id;
    // A child may recognise the right main answer yet need help applying its
    // meaning. Prefer a NEW context/sentence on later visits, not the same key.
    if(readingNeeds(readingProgress,id,'transfer')){
      if(item.kind==='word'&&types.includes('context'))return 'context';
      if(item.kind==='expression'&&types.includes('sentence')){
        // Rotate the PRIMARY task too: a sentence-choice question has already
        // shown the mission sentence. After the authored surprise example,
        // switch to meaning so the next Aha can show the other authored scene.
        const last=readingProgress?.[id]?.transfer?.lastEvidence;
        return last==='expression:challenge'&&types.includes('meaning')?
          'meaning':'sentence';
      }
    }
    if(readingNeeds(readingProgress,id,'recognition')&&types.includes('reverse'))return 'reverse';
    const record = progress?.[id];
    const skills=record?.skills || {};
    const contextNeed=types.includes('context')?contextPriority(id,contextMemory):0;
    if(contextNeed>=3||(contextNeed&& !types.some(type=>needsPractice(skills[type]))))return 'context';
    if(!types.some(type=>skills[type]?.attempts)){
      const sample=random();
      if(item.kind==='expression')return sample<.6?'meaning':sample<.85?'sentence':'order';
      return sample<.8?'meaning':types.includes('context')&&sample<.95?'context':'reverse';
    }
    // A skill that was missed stays a priority even when other skills succeed.
    // Equal priorities prefer the least-recently-seen skill for variety.
    return types.slice().sort((a,b)=>skillPriority(skills[b])-skillPriority(skills[a]) ||
      (skills[a]?.lastAt||0)-(skills[b]?.lastAt||0) || a.localeCompare(b))[0];
  }
  function nextScene(progress,id,random=Math.random) {
    const last=progress?.[id]?.lastScene;
    if(!Number.isInteger(last)||last<0||last>2)return Math.floor(random()*3);
    // Never show the identical story on the next visit; cycle all three.
    return (last+1)%3;
  }
  function readingNeeds(progress,id,type) {
    const item=progress?.[id]?.[type];
    return !!item&&item.supported>0 &&
      (type==='transfer'&&Number.isInteger(item.quality)?item.quality<2:item.streak<2);
  }
  function focusScore(item,progress,reviews,settings,contextIds,missionsAvailable,now,readingProgress=null,contextMemory=null) {
    const id=item.entry.id;
    const types=availableTypes(item,settings,contextIds.has(id),missionsAvailable);
    const skills=progress?.[id]?.skills || {};
    const card=reviews?.[id];
    if(card && card.streak < 3 && card.dueAt > now)return 0; // Respect the existing waiting interval.
    const weak=types.filter(type=>needsPractice(skills[type]));
    const due=card && card.streak<3 && card.dueAt<=now;
    const readingWeak=readingNeeds(readingProgress,id,'transfer')||readingNeeds(readingProgress,id,'recognition');
    const storyNeed=types.includes('context')?contextPriority(id,contextMemory):0;
    return due || weak.length || readingWeak || storyNeed ?
      1 + Math.max(0,...weak.map(type=>skills[type].wrong)) + (readingWeak?2:0) + storyNeed : 0;
  }
  // Explicit practice goals filter only the current level/topic, without changing
  // scores, creating extra history or claiming that a child knows a word.
  function trainingPools(pool,settings,{progress=null,reviews=null,mistakes={},readingProgress=null,
    missionProgress=null,contextIds=new Set(),missionsAvailable=false,now=Date.now(),contextMemory=null}={}) {
    const discover=[],focus=[];
    for(const item of pool){
      const id=item.entry.id,skills=progress?.[id]?.skills||{},review=reviews?.[id],reading=readingProgress?.[id];
      const seen=Object.values(skills).some(value=>value?.attempts>0) || !!review ||
        Number(mistakes?.[id])>0 || (Array.isArray(missionProgress?.[id])&&missionProgress[id].length>0) ||
        ['transfer','recognition'].some(type=>reading?.[type]?.first>0||reading?.[type]?.supported>0);
      if(!seen&&!Object.keys(contextMemory?.progress?.[id]||{}).length)discover.push(item);
      const waiting=review&&review.streak<3&&review.dueAt>now;
      if(!waiting&&(focusScore(item,progress,reviews,settings,contextIds,missionsAvailable,now,readingProgress,contextMemory)>0||
        (!review&&Number(mistakes?.[id])>0)))focus.push(item);
    }
    return {mixed:pool,discover,focus};
  }
  function pickPool(pool,count,progress,reviews,settings,contextIds,missionsAvailable,now,random,readingProgress=null,contextMemory=null) {
    if(count<=0)return [];
    const scored=pool.map((item,index)=>({item,index,focus:focusScore(item,progress,reviews,settings,contextIds,missionsAvailable,now,readingProgress,contextMemory)}));
    // Mixed training reserves half for exploration. Explicit focus training
    // already uses a filtered pool, so all requested slots may target weak skills.
    const focused=shuffle(scored.filter(x=>x.focus>0),random)
      .sort((a,b)=>b.focus-a.focus).slice(0,settings.practiceGoal==='focus'?count:Math.ceil(count/2));
    const taken=new Set(focused.map(x=>x.index));
    const isWaiting = id => {const card=reviews?.[id];return !!card && card.streak<3 && card.dueAt>now;};
    // Reserve at least the other half for exploration, when enough fresh material
    // exists. Waiting recall cards are a last resort, never a preferred choice.
    const fresh=shuffle(scored.filter(x=>!taken.has(x.index) && x.focus===0 && !isWaiting(x.item.entry.id)),random);
    const otherWeak=shuffle(scored.filter(x=>!taken.has(x.index) && x.focus>0),random);
    const waiting=shuffle(scored.filter(x=>!taken.has(x.index) && x.focus===0 && isWaiting(x.item.entry.id)),random);
    const rest=fresh.concat(otherWeak,waiting).slice(0,count-focused.length);
    return shuffle(focused.concat(rest).map(x=>x.item),random);
  }
  function shuffle(items,random) {
    const arr=items.slice();
    for(let i=arr.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[arr[i],arr[j]]=[arr[j],arr[i]];}
    return arr;
  }
  function pickItems(candidates,count,progress,reviews,settings,contextIds,missionsAvailable,now=Date.now(),random=Math.random,readingProgress=null,contextMemory=null) {
    const wanted=Math.min(Math.max(0,count),candidates.length);
    if(settings.topic!=='mixed')return pickPool(candidates,wanted,progress,reviews,settings,contextIds,missionsAvailable,now,random,readingProgress,contextMemory);
    const words=candidates.filter(item=>item.kind==='word'),expressions=candidates.filter(item=>item.kind==='expression');
    const phraseCount=Math.min(Math.ceil(wanted/2),expressions.length);
    const wordCount=Math.min(wanted-phraseCount,words.length);
    const selected=pickPool(words,wordCount,progress,reviews,settings,contextIds,missionsAvailable,now,random,readingProgress,contextMemory)
      .concat(pickPool(expressions,phraseCount,progress,reviews,settings,contextIds,missionsAvailable,now,random,readingProgress,contextMemory));
    const chosen=new Set(selected.map(item=>item.entry.id));
    return shuffle(selected.concat(pickPool(candidates.filter(item=>!chosen.has(item.entry.id)),wanted-selected.length,
      progress,reviews,settings,contextIds,missionsAvailable,now,random,readingProgress,contextMemory)),random);
  }
  function summary(progress) {
    const result={concepts:0,practised:0,needsPractice:0,comfortable:0};
    for(const card of Object.values(progress||{})){
      const skills=Object.values(card?.skills||{});
      if(!skills.length)continue;
      result.concepts++;
      for(const item of skills){if(item.attempts){result.practised++;if(needsPractice(item))result.needsPractice++;if(item.streak>=2)result.comfortable++;}}
    }
    return result;
  }
  function suggestions(progress, max=3, readingProgress=null) {
    const found=[];
    for (const [id,card] of Object.entries(progress||{})) {
      if (!ID.test(id))continue;
      for (const [skill,entry] of Object.entries(card?.skills||{})) {
        if(SKILLS.includes(skill)&&needsPractice(entry))found.push({id,skill,wrong:entry.wrong,lastAt:entry.lastAt});
      }
    }
    // Do not lose a missed Aha checkpoint just because the main answer was
    // right. Report the available *kind of practice*, not a misleading grade.
    for(const [id,card] of Object.entries(readingProgress||{})){
      if(!ID.test(id))continue;
      if(readingNeeds(readingProgress,id,'transfer')){
        const skill=id.startsWith('ut-')?'sentence':'context';
        if(!found.some(item=>item.id===id&&item.skill===skill))
          found.push({id,skill,wrong:1,lastAt:card.transfer?.lastAt||0});
      }
      if(readingNeeds(readingProgress,id,'recognition')&&
        !found.some(item=>item.id===id&&item.skill==='reverse'))
          found.push({id,skill:'reverse',wrong:1,lastAt:card.recognition?.lastAt||0});
    }
    return found.sort((a,b)=>b.wrong-a.wrong || b.lastAt-a.lastAt || a.id.localeCompare(b.id)).slice(0,Math.max(0,Math.min(5,max)));
  }
  return {SKILLS,LABELS,sanitize,record,task,availableTypes,choiceType,nextScene,pickItems,trainingPools,summary,needsPractice,suggestions,
    sceneKey,sanitizeContextProgress,recordContext,contextSummary,contextPriority,contextOrder};
});
