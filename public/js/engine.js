/* Ordjakten: browser + Node-compatible, dependency-free quiz engine. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VALID_LEVELS = ['easy', 'medium', 'hard', 'exam'];
  const VALID_COUNTS = [5, 10, 15, 20, 25];
  // Keep world IDs aligned with js/adventures.js (verified by tests).
  const VALID_ADVENTURES = ["forest", "space", "castle", "pirate", "ocean", "dinosaurs", "garden", "unicorn", "animals", "rainbow", "horses", "music"];
  const nearPair = (a, b) => [a, b].sort().join('|');
  const DEFAULT_STATE = Object.freeze({version: 1, settings: {
    theme: 'dark', contrast: false, mode: 'train', difficulty: 'easy', topic: 'words', count: 10,
    companion:'fox', adventure:'forest', sound:false,
    timerMode: 'off', timerSeconds: 180, timerScope: 'total', reviewOnly: false,
    expressionTask:'mix', missionHints:true, contextMix:true, adaptivePractice:true, practiceGoal:'mixed'
  }, results: [], mistakes: {}, surprises:{unlocked:[],opened:[],mastered:[]}, missionProgress:{},questCounts:{scout:0,stories:0,comeback:0},reviewProgress:{},skillProgress:{},readingProgress:{},contextProgress:{},recallProgress:{},detectorProgress:{},detectorLevels:{},conceptProgress:{},bridgeProgress:{},feedbackProgress:{},practiceBalance:[],adventureChallenge:[],storyProgress:{},campLayout:null,campStories:[],retentionProgress:{}});

  function shuffle(input, random = Math.random) {
    const result = input.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function clampInteger(value, min, max, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(min, Math.min(max, Math.floor(parsed))) : fallback;
  }
  const TEACHING_FIELDS=['explanation','familiar','nonExample','ownPrompt'];
  function validTeaching(value){
    return !!value&&typeof value==='object'&&!Array.isArray(value)&&
      TEACHING_FIELDS.every(key=>typeof value[key]==='string'&&value[key].trim().length>=15)&&
      new Set(TEACHING_FIELDS.map(key=>value[key].trim())).size===TEACHING_FIELDS.length;
  }
  function wordTeaching(bank,id){
    const lesson=bank?.words?.find(w=>w.id===id)?.teaching;
    return validTeaching(lesson)?Object.fromEntries(TEACHING_FIELDS.map(key=>[key,lesson[key]])):null;
  }
  // Only identify an alternative when its label is an unambiguous bank word
  // or definition. Do not infer a wrong-answer meaning from pictures or actions.
  function wordFeedback(bank,question,selectedLabel){
    if(question?.kind!=='word')return null;
    const lesson=wordTeaching(bank,question.id);
    if(!lesson)return null;
    const selected=question.options?.find(o=>o.label===selectedLabel&&o.correct===false);
    let correction='';
    if(selected&&!question.picture&&!question.action){
      const byWord=['context','reverse','contrast'].includes(question.taskType);
      const matches=bank.words.filter(w=>w.id!==question.id&&(byWord?w.word:w.definition)===selected.label);
      if(matches.length===1){
        const other=matches[0];
        correction='Det valda svaret handlar om '+other.word.toLocaleLowerCase('sv-SE')+'. Det betyder: '+other.definition+' Här passar '+question.word.toLocaleLowerCase('sv-SE')+' bättre.';
      }
    }
    return {...lesson,correction};
  }
  function validateBank(bank) {
    const errors = [];
    if (!bank || !Array.isArray(bank.words)) return ['Ordbanken saknar en lista med ord.'];
    const ids = new Set(); const words = new Set();
    for (const entry of bank.words) {
      if (!entry || typeof entry !== 'object') { errors.push('Felaktig post.'); continue; }
      if (!/^sv-\d{4,}$/.test(entry.id || '')) errors.push('Ogiltigt ID: ' + entry.id);
      if (ids.has(entry.id)) errors.push('Dubblerat ID: ' + entry.id);
      ids.add(entry.id);
      if (!entry.word || !entry.definition || !entry.example) errors.push('Saknar innehåll: ' + entry.id);
      if(Object.hasOwn(entry,'teaching')&&!validTeaching(entry.teaching))errors.push('Ofullständig ordförklaring: '+entry.id);
      if (words.has(String(entry.word).toLocaleLowerCase('sv-SE'))) errors.push('Dubblerat ord: ' + entry.word);
      words.add(String(entry.word).toLocaleLowerCase('sv-SE'));
      if (!['easy','medium','hard','expert'].includes(entry.difficulty)) errors.push('Ogiltig nivå: '+entry.id);
    }
    return errors;
  }
  // Uttryck are authored separately from single words: context, four plausible
  // distractors and the two-part explanation are editorial content, not inferred.
  function validateExpressions(bank) {
    const errors=[];
    if(!bank || !Array.isArray(bank.expressions))return ['Uttrycksbanken saknar uttryck.'];
    const ids=new Set(), phrases=new Set();
    for(const entry of bank.expressions){
      if(!entry || typeof entry!=='object'){errors.push('Felaktigt uttryck.');continue;}
      if(!/^ut-\d{4,}$/.test(entry.id||'') || ids.has(entry.id))errors.push('Felaktigt eller dubblerat uttrycks-ID: '+entry.id);
      ids.add(entry.id);
      const name=String(entry.phrase||'').toLocaleLowerCase('sv-SE').trim();
      if(!name || phrases.has(name))errors.push('Saknat eller dubblerat uttryck: '+entry.id);
      phrases.add(name);
      for(const key of ['scene','definition','example']){
        if(typeof entry[key]!=='string'||!entry[key].trim())errors.push('Saknar '+key+': '+entry.id);
      }
      if(entry.category==='school-instruction'&&(typeof entry.schoolRule!=='string'||entry.schoolRule.trim().length<20))
        errors.push('Skoluppgift saknar arbetsregel: '+entry.id);
      if(!Array.isArray(entry.reveal)||entry.reveal.length!==2 ||
        entry.reveal.some(panel=>!panel||!panel.title||!panel.text))errors.push('Saknar två förklaringsrutor: '+entry.id);
      if(!Array.isArray(entry.options)||entry.options.length!==5 ||
        entry.options.filter(option=>option && option.correct===true).length!==1 ||
        entry.options.some(option=>!option||typeof option.label!=='string'||!option.label.trim()) ||
        new Set(entry.options.map(option=>option&&option.label)).size!==5)
        errors.push('Uttrycket måste ha fem unika svar, varav ett rätt: '+entry.id);
    }
    return errors;
  }
  // Contexts are authored mini-scenarios. Never infer a picture or a meaning
  // from a word's spelling: a reviewer must approve each story and distractor.
  function validateContexts(contexts, bank, curation) {
    const errors=[];
    if(!contexts || !Array.isArray(contexts.wordContexts))return ['Saknar vardagssituationer.'];
    const words=new Map((bank?.words || []).map(word=>[word.id,word]));
    const contextIds=new Set(contexts.wordContexts.map(record=>record?.id));
    const seen=new Set();
    const blocked=new Set((curation?.nearSynonyms||[]).map(pair=>nearPair(...pair)));
    for(const record of contexts.wordContexts){
      if(!record||typeof record!=='object'||!words.has(record.id)||seen.has(record.id)){
        errors.push('Ogiltigt eller dubblerat kontext-ID: '+record?.id);continue;
      }
      seen.add(record.id);
      if(!Array.isArray(record.distractors)||record.distractors.length!==4||
        new Set(record.distractors).size!==4||record.distractors.some(id=>!words.has(id)||id===record.id||blocked.has(nearPair(id,record.id))))
        errors.push('Ogiltiga eller närliggande svarsalternativ: '+record.id);
      // Choosing a word for a story and choosing a story for a word are
      // different editorial decisions. An object can be both round and fragile.
      if(!Array.isArray(record.readingDistractors)||record.readingDistractors.length<2||
        new Set(record.readingDistractors).size!==record.readingDistractors.length||
        record.readingDistractors.some(id=>!words.has(id)||!contextIds.has(id)||id===record.id||blocked.has(nearPair(id,record.id))))
        errors.push('Kräver minst två granskade Aha-alternativ med egna berättelser: '+record.id);
      if(!Array.isArray(record.scenes)||record.scenes.length!==3){errors.push('Kräver tre berättelser: '+record.id);continue;}
      const normalized=new Set();
      for(const scene of record.scenes){
        if(!scene||typeof scene.title!=='string'||scene.title.trim().length<3||
          typeof scene.text!=='string'||scene.text.trim().length<25||
          typeof scene.why!=='string'||scene.why.trim().length<15){
          errors.push('Ofullständig berättelse: '+record.id);continue;
        }
        const stem=scene.text.toLocaleLowerCase('sv-SE');
        const token=words.get(record.id).word.toLocaleLowerCase('sv-SE');
        if(stem.includes(token)||scene.title.toLocaleLowerCase('sv-SE').includes(token))errors.push('Ordet avslöjas i berättelsen: '+record.id);
        if(normalized.has(stem))errors.push('Duplicerad berättelse: '+record.id);
        normalized.add(stem);
      }
    }
    return errors;
  }
  function getContextRecord(contexts,id){
    return contexts?.wordContexts?.find(item=>item.id===id)||null;
  }
  function isEveryday(entry,curation){
    return !!entry&&entry.difficulty!=='expert'&&
      !(curation?.extensionWords||[]).includes(entry.id)&&
      !(curation?.extensionExpressions||[]).includes(entry.id);
  }
  function validateSelection(curation,bank,expressions,contexts){
    const errors=[],words=new Map((bank?.words||[]).map(w=>[w.id,w])),
      phrases=new Map((expressions?.expressions||[]).map(e=>[e.id,e]));
    for(const [key,source] of [['extensionWords',words],['extensionExpressions',phrases],['hardWords',words]]){
      const ids=curation?.[key];
      if(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.some(id=>!source.has(id)))
        errors.push('Ogiltigt redaktionellt ordurval: '+key);
    }
    for(const id of curation?.hardWords||[])
      if(!isEveryday(words.get(id),curation))errors.push('Fördjupningsord i vardagsutmaningen: '+id);
    for(const entry of phrases.values())
      if(entry.category==='school-instruction'&&!isEveryday(entry,curation))errors.push('Skolord saknas i vardagsurvalet: '+entry.id);
    for(const row of contexts?.wordContexts||[])
      if(isEveryday(words.get(row.id),curation)&&(row.distractors||[]).some(id=>!isEveryday(words.get(id),curation)))
        errors.push('Fördjupningsord som felalternativ i vardagsfråga: '+row.id);
    return errors;
  }
  function getTopicPool(bank,curation,expressions,settings){
    const topic=['words','expressions','mixed'].includes(settings.topic)?settings.topic:'words';
    const words=topic==='expressions'?[]:getPool(bank,curation,settings.difficulty)
      .map(entry=>({kind:'word',entry}));
    const phrases=topic==='words'?[]:(expressions && Array.isArray(expressions.expressions)?expressions.expressions:[])
      .filter(entry=>(settings.difficulty==='exam'||isEveryday(entry,curation))&&
        (topic!=='expressions'||settings.schoolOnly!==true||entry.category==='school-instruction'))
      .map(entry=>({kind:'expression',entry}));
    return words.concat(phrases);
  }
  // Three independently authored ways to practise an expression.
  // Exam keeps five traditional definition alternatives for consistency.
  function makeExpressionQuestion(entry,difficulty,random=Math.random,taskType='meaning',missions=null){
    const base={id:entry.id,kind:'expression',word:entry.phrase,definition:entry.definition,
      example:entry.example,scene:entry.scene,reveal:entry.reveal,picture:false,...(entry.animal?{animal:entry.animal}:{}),
      ...(entry.category==='school-instruction'?{schoolInstruction:true,schoolRule:entry.schoolRule}:{})};
    const type=difficulty==='exam'?'meaning':taskType;
    const mission=missions&&Array.isArray(missions.missions)?missions.missions.find(x=>x.id===entry.id):null;
    if(type==='sentence'){
      if(!mission)throw new Error('Saknar skrivna meningsalternativ: '+entry.id);
      return {...base,taskType:type,
        ...(base.schoolInstruction&&mission.prompt?{scene:mission.prompt}:{}),
        options:shuffle(mission.sentences.map(s=>({label:s.label,correct:s.correct})),random)};
    }
    if(type==='order'){
      if(!mission)throw new Error('Saknar skrivna händelser: '+entry.id);
      return {...base,taskType:type,options:[],steps:shuffle(mission.order.map((label,key)=>({label,key})),random),correctOrder:mission.order.slice()};
    }
    const correct=entry.options.filter(option=>option.correct===true);
    const incorrect=shuffle(entry.options.filter(option=>option.correct!==true),random);
    if(correct.length!==1||incorrect.length!==4)throw new Error('Uttryck med ogiltiga svar: '+entry.id);
    const options=shuffle(correct.concat(incorrect.slice(0,difficulty==='exam'?4:3)).map(option=>({label:option.label,correct:option.correct})),random);
    return {...base,taskType:'meaning',options};
  }
  function getPool(bank, curation, difficulty) {
    if (!VALID_LEVELS.includes(difficulty)) throw new Error('Okänd svårighetsgrad');
    if(difficulty==='exam')return bank.words.filter(w=>
      ['hard','expert'].includes(w.difficulty)||!isEveryday(w,curation));
    const everyday=bank.words.filter(w=>isEveryday(w,curation));
    if (difficulty === 'easy') {
      return everyday.filter(w => w.difficulty === 'easy' && w.illustration &&
        curation.easy[w.id] && curation.easy[w.id].length === 3);
    }
    // Easy words with ambiguous emojis are still playable as TEXT questions.
    // That preserves all 121 historical words without showing misleading icons.
    if (difficulty === 'medium') {
      return everyday.filter(w => w.difficulty === 'medium' ||
        (w.difficulty === 'easy' && !curation.easy[w.id]));
    }
    return everyday.filter(w=>w.difficulty==='hard'||(curation.hardWords||[]).includes(w.id));
  }
  function makeQuestion(entry, bank, curation, difficulty, random = Math.random) {
    if (difficulty === 'easy') {
      const distractions = curation.easy[entry.id];
      if (!entry.illustration || !Array.isArray(distractions) || distractions.length !== 3) {
        throw new Error('Saknar granskade bildalternativ: ' + entry.id);
      }
      const options = [{label: entry.illustration.label, emoji: entry.illustration.value, correct: true}]
        .concat(distractions.map(pair => ({emoji: pair[0], label: pair[1], correct: false})));
      if (new Set(options.map(o => o.emoji)).size !== 4) throw new Error('Dubblerad emoji: '+entry.id);
      return {kind:'word',id: entry.id, word: entry.word, definition: entry.definition, example: entry.example,
        options: shuffle(options, random), picture: true};
    }
    const all = getPool(bank, curation, difficulty);
    const blocked = new Set((curation.nearSynonyms || []).map(pair => nearPair(pair[0], pair[1])));
    const isValid = candidate => candidate.id !== entry.id && !blocked.has(nearPair(entry.id,candidate.id))
      && candidate.definition !== entry.definition;
    const groups = curation.groups[difficulty === 'exam' ? 'hard' : difficulty] || [];
    const relatedIds = new Set(groups.filter(g => g.includes(entry.id)).flat());
    const related = shuffle(all.filter(w => relatedIds.has(w.id) && isValid(w)),random);
    const extras = shuffle(all.filter(w => !relatedIds.has(w.id) && isValid(w)),random);
    const numberWrong = difficulty === 'exam' ? 4 : 3;
    const others = related.concat(extras).slice(0, numberWrong);
    if (others.length < numberWrong) throw new Error('För få svarsalternativ för '+entry.word);
    const options = [{label:entry.definition,correct:true}].concat(others.map(w => ({label:w.definition,correct:false})));
    if (new Set(options.map(o => o.label)).size !== options.length) throw new Error('Dubblerade svar för '+entry.word);
    return {kind:'word',id: entry.id,word: entry.word,definition:entry.definition,example:entry.example,
      options:shuffle(options,random),picture:false};
  }
  // A review can retrieve the meaning in the opposite direction: read the
  // definition and choose the word. This works for every historical word,
  // including words that do not have a trustworthy picture.
  function makeReverseQuestion(entry, bank, curation, difficulty, random = Math.random) {
    const pool = getPool(bank,curation,difficulty);
    const blocked = new Set((curation.nearSynonyms || []).map(pair => nearPair(pair[0], pair[1])));
    const valid = candidate => candidate.id !== entry.id &&
      !blocked.has(nearPair(candidate.id,entry.id)) && candidate.word !== entry.word;
    const groups = curation.groups[difficulty === 'exam' ? 'hard' : difficulty] || [];
    const relatedIds = new Set(groups.filter(group=>group.includes(entry.id)).flat());
    const related = shuffle(pool.filter(w=>relatedIds.has(w.id)&&valid(w)),random);
    const others = shuffle(pool.filter(w=>!relatedIds.has(w.id)&&valid(w)),random);
    const choices = related.concat(others).slice(0,difficulty==='exam'?4:3);
    if(choices.length < (difficulty==='exam'?4:3))throw new Error('För få ord till omvänd fråga: '+entry.word);
    const options = shuffle([{label:entry.word,correct:true},...choices.map(w=>({label:w.word,correct:false}))],random);
    if(new Set(options.map(option=>option.label.toLocaleLowerCase('sv-SE'))).size !== options.length)
      throw new Error('Dubblerade ord i omvänd fråga: '+entry.word);
    return {kind:'word',id:entry.id,word:entry.word,definition:entry.definition,example:entry.example,
      stem:curation.reviewClues?.[entry.id] || entry.definition,taskType:'reverse',picture:false,options};
  }
  // The question is about applying the concept, not matching a memorized
  // definition. Every scene is manually paired with plausible alternatives.
  function makeContextQuestion(entry, bank, contexts, random = Math.random, sceneIndex = null) {
    const record=getContextRecord(contexts,entry.id);
    if(!record)throw new Error('Ingen granskad vardagssituation för '+entry.word);
    const words=new Map(bank.words.map(word=>[word.id,word]));
    const index=sceneIndex===null?Math.floor(random()*record.scenes.length):
      ((Math.floor(sceneIndex)%record.scenes.length)+record.scenes.length)%record.scenes.length;
    const scene=record.scenes[index];
    const choices=shuffle(record.distractors,random).slice(0,3);
    const options=shuffle([{label:entry.word,correct:true},...choices.map(id=>({label:words.get(id).word,correct:false}))],random);
    return {kind:'word',id:entry.id,word:entry.word,definition:entry.definition,example:entry.example,
      taskType:'context',picture:false,options,stem:scene.text,contextTitle:scene.title,
      contextWhy:scene.why,contextIndex:index};
  }
  function nextReviewTask(lastVariant,kind,difficulty,hasContexts=false) {
    if(kind==='word') {
      if(hasContexts)return lastVariant==='context'?'reverse':'context';
      return lastVariant==='reverse'?'meaning':'reverse';
    }
    if(difficulty==='exam')return 'meaning'; // preserve five answers in exam mode
    return ({meaning:'sentence',sentence:'order',order:'meaning'})[lastVariant] || 'sentence';
  }
  function practiceGoalForRound(settings) {
    return settings.mode==='train' && settings.difficulty!=='exam' && !settings.reviewOnly &&
      !settings.contextOnly && !settings.schoolOnly && ['discover','focus'].includes(settings.practiceGoal)?settings.practiceGoal:'mixed';
  }
  function generateRound(bank, curation, settings, mistakes = {}, random = Math.random, expressions = null, missions = null, reviewProgress = null, now = Date.now(), contexts = null, skillProgress = null, adaptive = null, readingProgress = null, missionProgress = null, contextProgress = null, seenIds = null) {
    const topic=['words','expressions','mixed'].includes(settings.topic)?settings.topic:'words';
    const pool=getTopicPool(bank,curation,expressions,settings);
    const schoolDrill=topic==='expressions'&&settings.schoolOnly===true&&settings.mode==='train'&&settings.difficulty!=='exam'&&!settings.reviewOnly&&!!missions;
    const count=VALID_COUNTS.includes(settings.count)?settings.count:10;
    let candidates=settings.contextOnly&&!settings.reviewOnly&&settings.topic==='words'&&
      settings.mode==='train'&&settings.difficulty!=='exam'?
      pool.filter(item=>item.kind==='word'&&getContextRecord(contexts,item.entry.id)):
      settings.reviewOnly?pool.filter(item=>reviewProgress===null?
      (mistakes[item.entry.id]||0)>0 : !!reviewProgress[item.entry.id]&&
      reviewProgress[item.entry.id].streak<3&&reviewProgress[item.entry.id].dueAt<=now):pool;
    if(settings.contextOnly&&!settings.reviewOnly&&candidates.length<count)
      throw new Error('För få skrivna vardagssituationer på denna nivå. Välj färre frågor.');
    if(settings.reviewOnly && candidates.length===0)throw new Error('Det finns inga felaktiga ord eller uttryck att repetera.');
    const contextIds = new Set((contexts?.wordContexts || []).map(row=>row.id));
    const goal=practiceGoalForRound(settings);
    const contextMemory=contextProgress&&settings.mode==='train'&&settings.difficulty!=='exam'?
      {catalog:contexts,progress:contextProgress}:null;
    if(goal!=='mixed'){
      if(!adaptive?.trainingPools)throw new Error('Träningsmålet kunde inte laddas. Ladda om sidan.');
      candidates=adaptive.trainingPools(candidates,settings,{progress:skillProgress,reviews:reviewProgress,
        mistakes,readingProgress,missionProgress,contextIds,missionsAvailable:!!missions,now,contextMemory,seenIds})[goal];
      if(!candidates.length)throw new Error(goal==='discover'?
        'Inga oprövade ord eller uttryck på den här nivån. Välj Blanda eller en annan nivå.':
        'Inget behöver en ny chans just nu. Välj Blanda eller Upptäck nytt.');
    }
    const wanted=Math.min(count,candidates.length);
    let chosen;
    // Adaptation is opt-in and TRAINING ONLY. Tests, exam, and dedicated scene
    // drills preserve their original unbiased question generation.
    const adapt = adaptive && settings.adaptivePractice === true && settings.mode === 'train' &&
      settings.difficulty !== 'exam' && !settings.contextOnly && !settings.reviewOnly && !schoolDrill;
    if(adapt) chosen=adaptive.pickItems(candidates,wanted,skillProgress,reviewProgress,{...settings,practiceGoal:goal},contextIds,!!missions,now,random,readingProgress,contextMemory);
    else if(topic==='mixed'){
      const words=shuffle(candidates.filter(x=>x.kind==='word'),random);
      const phrases=shuffle(candidates.filter(x=>x.kind==='expression'),random);
      const phraseCount=Math.min(Math.ceil(wanted/2),phrases.length);
      const wordCount=Math.min(wanted-phraseCount,words.length);
      const extra=Math.min(wanted-phraseCount-wordCount,Math.max(0,phrases.length-phraseCount));
      chosen=shuffle(words.slice(0,wordCount).concat(phrases.slice(0,phraseCount+extra)),random);
    }else chosen=shuffle(candidates,random).slice(0,wanted);
    const mixTypes=shuffle(['meaning','sentence','order'],random);
    let expressionIndex=0;
    return chosen.map(item=>{
      if(item.kind!=='expression') {
        const hasContext=!!getContextRecord(contexts,item.entry.id)&&settings.difficulty!=='exam';
        const variant=adapt ? adaptive.choiceType(item,settings,skillProgress,
          adaptive.availableTypes(item,settings,hasContext,!!missions),random,readingProgress,contextMemory) :
          settings.contextOnly&&hasContext?'context':
          settings.reviewOnly&&settings.mode!=='test'?nextReviewTask(
          reviewProgress?.[item.entry.id]?.lastVariant || 'meaning','word',settings.difficulty,hasContext):
          settings.contextMix&&settings.difficulty!=='easy'&&settings.difficulty!=='exam'&&hasContext&&random()<0.55
            ?'context':'meaning';
        if(variant==='reverse')return makeReverseQuestion(item.entry,bank,curation,settings.difficulty,random);
        if(variant==='context'){
          // Cards get different authored scenes on successive review visits.
          const prior=settings.reviewOnly?reviewProgress?.[item.entry.id]:null;
          const rotateScene=adaptive && settings.adaptivePractice===true && settings.mode==='train' && (adapt||settings.contextOnly);
          const knownStories=contextMemory&&Object.keys(contextProgress[item.entry.id]||{}).length>0;
          const sceneIndex=rotateScene&&knownStories&&adaptive.contextOrder?
            adaptive.contextOrder(getContextRecord(contexts,item.entry.id),contextProgress,
              {previous:skillProgress?.[item.entry.id]?.lastScene,random})[0]:
            rotateScene?adaptive.nextScene(skillProgress,item.entry.id,random):prior?prior.attempts: null;
          return makeContextQuestion(item.entry,bank,contexts,random,sceneIndex);
        }
        return makeQuestion(item.entry,bank,curation,settings.difficulty,random);
      }
      const task=schoolDrill?'sentence':adapt?adaptive.choiceType(item,settings,skillProgress,
        adaptive.availableTypes(item,settings,false,!!missions),random,readingProgress):
        settings.reviewOnly&&settings.mode!=='test'&&missions ? nextReviewTask(
        reviewProgress?.[item.entry.id]?.lastVariant || 'meaning','expression',settings.difficulty):
        settings.difficulty==='exam'?'meaning':settings.expressionTask==='mix'&&missions
        ?mixTypes[(expressionIndex++)%mixTypes.length]:(settings.expressionTask||'meaning');
      return makeExpressionQuestion(item.entry,settings.difficulty,random,task,missions);
    });
  }
  function score(answers, questionCount) {
    const values = Object.values(answers || {});
    const right = values.filter(answer => answer === 'right').length;
    const wrong = values.filter(answer => answer === 'wrong').length;
    const unanswered = Math.max(0,questionCount-right-wrong);
    return {right,wrong,unanswered,percent:questionCount?Math.round((right/questionCount)*100):0};
  }
  function formatTime(ms) {
    const seconds = Math.max(0,Math.ceil(ms/1000));
    return Math.floor(seconds/60).toString().padStart(2,'0') + ':' + (seconds%60).toString().padStart(2,'0');
  }
  function sanitizeSettings(settings) {
    const obj = settings && typeof settings === 'object' ? settings : {};
    return {
      theme: ['dark','light','auto'].includes(obj.theme)?obj.theme:'dark',
      contrast: obj.contrast === true,
      companion:['fox','owl','dragon'].includes(obj.companion)?obj.companion:'fox',
      adventure:VALID_ADVENTURES.includes(obj.adventure)?obj.adventure:'forest',
      sound:obj.sound===true,
      mode: ['train','test'].includes(obj.mode)?obj.mode:'train',
      topic: ['words','expressions','mixed'].includes(obj.topic)?obj.topic:'words',
      difficulty: VALID_LEVELS.includes(obj.difficulty)?obj.difficulty:'easy',
      count: VALID_COUNTS.includes(obj.count)?obj.count:10,
      timerMode: ['off','total','per'].includes(obj.timerMode)?obj.timerMode:'off',
      timerSeconds: clampInteger(obj.timerSeconds,5,3600,180),
      timerScope: obj.timerScope === 'per'?'per':'total',
      reviewOnly:obj.reviewOnly===true,
      expressionTask:['mix','meaning','sentence','order'].includes(obj.expressionTask)?obj.expressionTask:'mix',
      missionHints:obj.missionHints!==false,
      contextMix:obj.contextMix!==false,
      adaptivePractice:obj.adaptivePractice!==false,
      practiceGoal:obj.reviewOnly!==true&&['mixed','discover','focus'].includes(obj.practiceGoal)?obj.practiceGoal:'mixed'
    };
  }
  const CAMP_STORY_LIMIT=24;
  function campStoryKey(row){return [row.scene,row.hero,row.prop,row.plot].join(':');}
  function sanitizeCampStories(raw,storyProgress){
    if(!Array.isArray(raw))return [];
    const seen=new Set(),stories=[];
    // Bound work on corrupt or hostile stored data; normal saves hold at most 24.
    for(const row of raw.slice(0,256)){
      if(!row||typeof row!=='object'||Array.isArray(row)||
        !['glade','space','coast','garden'].includes(row.scene)||
        !['fox','owl','dragon'].includes(row.hero)||
        !['mystery','friend','show'].includes(row.plot)||typeof row.prop!=='string')continue;
      const mark=/^mark-(forest|space|castle|pirate|ocean|dinosaurs|garden|unicorn|animals|rainbow|horses|music)-([0-3])$/.exec(row.prop);
      if(!/^free-(book|tent|lantern|flower|blanket|telescope)$/.test(row.prop)&&
        !(mark&&Number.isInteger(storyProgress?.[mark[1]])&&storyProgress[mark[1]]>Number(mark[2])))continue;
      const clean={scene:row.scene,hero:row.hero,prop:row.prop,plot:row.plot},key=campStoryKey(clean);
      if(seen.has(key))continue;
      seen.add(key);stories.push(clean);
      if(stories.length===CAMP_STORY_LIMIT)break;
    }
    return stories;
  }
  function sanitizeHistory(history) {
    if (!history || typeof history !== 'object') return { ...DEFAULT_STATE,settings:{...DEFAULT_STATE.settings},results:[],mistakes:{},surprises:{unlocked:[],opened:[],mastered:[]},missionProgress:{},questCounts:{scout:0,stories:0,comeback:0},reviewProgress:{},skillProgress:{},readingProgress:{},contextProgress:{},recallProgress:{},detectorProgress:{},detectorLevels:{},conceptProgress:{},bridgeProgress:{},feedbackProgress:{},practiceBalance:[],adventureChallenge:[],storyProgress:{},campLayout:null,campStories:[],confusionProgress:{},clueProgress:{},retentionProgress:{}};
    const rawResults = Array.isArray(history.results)?history.results:[];
    const results = rawResults.filter(x => x && typeof x==='object' && Number.isFinite(x.finishedAt))
      .slice(-50).map(x => ({finishedAt:x.finishedAt,level:String(x.level||''),mode:String(x.mode||''),
      right:clampInteger(x.right,0,25,0),wrong:clampInteger(x.wrong,0,25,0),
      unanswered:clampInteger(x.unanswered,0,25,0),total:clampInteger(x.total,0,25,0),
      bestStreak:clampInteger(x.bestStreak,0,25,0),
      topic:['words','expressions','mixed'].includes(x.topic)?x.topic:'words',
      adventure:VALID_ADVENTURES.includes(x.adventure)?x.adventure:null}));
    const mistakes = {};
    const source = history.mistakes && typeof history.mistakes==='object'?history.mistakes:{};
    Object.keys(source).filter(k=>/^(?:sv|ut)-\d{4,}$/.test(k)).slice(0,500).forEach(k=>{
      const n=clampInteger(source[k],0,9999,0);if(n>0)mistakes[k]=n;
    });
    const surprises={unlocked:[],opened:[],mastered:[]};
    const sourceSurprises=history.surprises&&typeof history.surprises==='object'?history.surprises:{};
    for(const phase of ['unlocked','opened','mastered']){
      const input=Array.isArray(sourceSurprises[phase])?sourceSurprises[phase]:[];
      surprises[phase]=[...new Set(input.filter(id=>typeof id==='string'&&/^ut-\d{4,}$/.test(id)))].slice(0,50);
    }
    const missionProgress={};
    if(history.missionProgress&&typeof history.missionProgress==='object'&&!Array.isArray(history.missionProgress)){
      for(const [id,types] of Object.entries(history.missionProgress)){
        if(!/^ut-\d{4,}$/.test(id)||!Array.isArray(types))continue;
        const cleaned=['meaning','sentence','order'].filter(type=>types.includes(type));
        if(cleaned.length)missionProgress[id]=cleaned;
      }
    }
    const questCounts={scout:0,stories:0,comeback:0};
    const rawCounts=history.questCounts&&typeof history.questCounts==='object'&&!Array.isArray(history.questCounts)?history.questCounts:{};
    for(const key of Object.keys(questCounts)){
      const n=rawCounts[key];
      questCounts[key]=Number.isInteger(n)&&n>=0?Math.min(999,n):0;
    }
    // A separately validated local queue keeps the review schedule across reloads.
    const reviewProgress={};
    if(history.reviewProgress&&typeof history.reviewProgress==='object'&&!Array.isArray(history.reviewProgress)){
      for(const [id,card] of Object.entries(history.reviewProgress).slice(0,500)){
        if(/^(?:sv|ut)-\d{4,}$/.test(id)&&card&&typeof card==='object'&&!Array.isArray(card))reviewProgress[id]=card;
      }
    }
    // Skill observations are sanitized by the dedicated adaptive module at app startup.
    const confusionProgress=history.confusionProgress&&typeof history.confusionProgress==='object'&&!Array.isArray(history.confusionProgress)?history.confusionProgress:{};
    const clueProgress=history.clueProgress&&typeof history.clueProgress==='object'&&!Array.isArray(history.clueProgress)?history.clueProgress:{};
    // Separate, strictly validated by retention.js once curated scene IDs are available.
    const retentionProgress=history.retentionProgress&&typeof history.retentionProgress==='object'&&!Array.isArray(history.retentionProgress)?history.retentionProgress:{};
    const readingProgress=history.readingProgress&&typeof history.readingProgress==='object'&&!Array.isArray(history.readingProgress)?history.readingProgress:{};
    const contextProgress=history.contextProgress&&typeof history.contextProgress==='object'&&!Array.isArray(history.contextProgress)?history.contextProgress:{};
    const storyProgress={};
    for(const id of ['forest','space','castle','pirate','ocean','dinosaurs','garden','unicorn','animals','rainbow','horses','music']){
      const n=history.storyProgress?.[id];if(Number.isInteger(n)&&n>0)storyProgress[id]=Math.min(4,n);
    }
    let campLayout=null;
    if(history.campLayout&&typeof history.campLayout==='object'&&!Array.isArray(history.campLayout)){
      const value=history.campLayout,used=new Set();
      const source=Array.isArray(value.slots)?value.slots:['free-tent',null,'free-lantern',null,'free-book',null];
      const slots=Array.from({length:6},(_,i)=>{
        const id=source[i];
        if(typeof id!=='string'||used.has(id))return null;
        const match=/^mark-(forest|space|castle|pirate|ocean|dinosaurs|garden|unicorn|animals|rainbow|horses|music)-([0-3])$/.exec(id);
        const owned=/^free-(book|tent|lantern|flower|blanket|telescope)$/.test(id)||
          !!(match&&(storyProgress[match[1]]||0)>Number(match[2]));
        if(!owned)return null;
        used.add(id);return id;
      });
      campLayout={scene:['glade','space','coast','garden'].includes(value.scene)?value.scene:'glade',slots};
    }
    const adventureChallenge=Array.isArray(history.adventureChallenge)?history.adventureChallenge.slice(-8).filter(row=>row&&
      ['focus','aha','recall','workshop','detector','concept','bridge'].includes(row.mode)&&['direct','supported','neutral'].includes(row.outcome)&&
      [1,2,3].includes(row.demand)&&Number.isSafeInteger(row.at)&&row.at>0&&row.at<=4102444800000)
      .map(({mode,outcome,demand,at})=>({mode,outcome,demand,at})):[];
    const practiceBalance=Array.isArray(history.practiceBalance)?history.practiceBalance.slice(-20).filter(value=>['develop','review','discover','creative'].includes(value)):[];
    const feedbackProgress=history.feedbackProgress&&typeof history.feedbackProgress==='object'&&!Array.isArray(history.feedbackProgress)?history.feedbackProgress:{};
    const bridgeProgress=history.bridgeProgress&&typeof history.bridgeProgress==='object'&&!Array.isArray(history.bridgeProgress)?history.bridgeProgress:{};
    const conceptProgress=history.conceptProgress&&typeof history.conceptProgress==='object'&&!Array.isArray(history.conceptProgress)?history.conceptProgress:{};
    const detectorLevels=history.detectorLevels&&typeof history.detectorLevels==='object'&&!Array.isArray(history.detectorLevels)?history.detectorLevels:{};
    const detectorProgress=history.detectorProgress&&typeof history.detectorProgress==='object'&&!Array.isArray(history.detectorProgress)?history.detectorProgress:{};
    const recallProgress=history.recallProgress&&typeof history.recallProgress==='object'&&!Array.isArray(history.recallProgress)?history.recallProgress:{};
    const skillProgress=history.skillProgress&&typeof history.skillProgress==='object'&&!Array.isArray(history.skillProgress)?history.skillProgress:{};
    return {version:1,settings:sanitizeSettings(history.settings),results,mistakes,surprises,missionProgress,questCounts,reviewProgress,skillProgress,readingProgress,contextProgress,recallProgress,detectorProgress,detectorLevels,conceptProgress,bridgeProgress,feedbackProgress,practiceBalance,adventureChallenge,storyProgress,campLayout,campStories:sanitizeCampStories(history.campStories,storyProgress),confusionProgress,clueProgress,retentionProgress};
  }
  function applyOutcome(mistakes,id,outcome) {
    const updated={...mistakes};
    if (outcome==='wrong') updated[id]=Math.min(9999,(updated[id]||0)+1);
    if (outcome==='right'&&updated[id]) {updated[id]-=1;if(updated[id]===0)delete updated[id];}
    return updated;
  }
  return {VALID_COUNTS,VALID_ADVENTURES,DEFAULT_STATE,shuffle,clampInteger,validateBank,wordTeaching,wordFeedback,validateExpressions,validateContexts,validateSelection,isEveryday,getPool,getTopicPool,makeQuestion,makeReverseQuestion,makeContextQuestion,nextReviewTask,makeExpressionQuestion,
    practiceGoalForRound,generateRound,score,formatTime,sanitizeSettings,sanitizeHistory,applyOutcome,CAMP_STORY_LIMIT,campStoryKey,sanitizeCampStories};
});
