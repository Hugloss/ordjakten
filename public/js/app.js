/* Ordjakten UI: accessible, dependency-free, works on GitLab Pages and locally. */
(() => {
  'use strict';
  const E = window.OrdjaktenEngine;
  const P = window.OrdjaktenPlayful;
  const A = window.OrdjaktenAdventures;
  const M = window.OrdjaktenMap;
  const bank = window.ORDJAKTEN_WORDS;
  const curation = window.ORDJAKTEN_CURATION;
  const expressions = window.ORDJAKTEN_EXPRESSIONS;
  const comics = window.ORDJAKTEN_COMICS;
  const C = window.OrdjaktenComics;
  const S = window.OrdjaktenSurprises;
  const surprises = window.ORDJAKTEN_SURPRISES;
  const missions = window.ORDJAKTEN_MISSIONS;
  const contexts = window.ORDJAKTEN_CONTEXTS;
  const Q = window.OrdjaktenMissions;
  const J = window.OrdjaktenQuests;
  const R = window.OrdjaktenReview;
  const D = window.OrdjaktenAdaptive;
  const L = window.OrdjaktenLearningMap;
  const F = window.OrdjaktenFocus;
  const K = window.OrdjaktenContrast;
  const H = window.OrdjaktenConfusions;
  const T = window.OrdjaktenClues;
  const U = window.OrdjaktenRetention;
  const B = window.OrdjaktenReading;
  const Memory = window.OrdjaktenMemory;
  const AhaPlan = window.OrdjaktenAhaPlan;
  const Recall = window.OrdjaktenRecall;
  const Workshop = window.OrdjaktenWorkshop;
  const Detector = window.OrdjaktenDetector;
  const Concepts = window.OrdjaktenConcepts;
  const Bridges = window.OrdjaktenBridges;
  const Journey = window.OrdjaktenJourney;
  const Knowledge = window.OrdjaktenKnowledge;
  const Feedback = window.OrdjaktenFeedback;
  const Balance = window.OrdjaktenBalance;
  const Challenge = window.OrdjaktenChallenge;
  const Story = window.OrdjaktenStory;
  const contrasts = window.ORDJAKTEN_CONTRASTS;
  const clues = window.ORDJAKTEN_CLUES;
  const contrastHistoryData = T?.enrich(contrasts,clues);
  const STORAGE_KEY = 'ordjakten-v1';
  const $ = id => document.getElementById(id);
  if (!E || !P || !A || !M || !bank || !curation || !expressions || !comics || !C || !S || !surprises || !Q || !missions || !contexts || !J || !R || !D || !L || !F || !K || !H || !T || !U || !B || !Memory || !AhaPlan || !Recall || !Workshop || !Detector || !Concepts || !Bridges || !Journey || !Knowledge || !Feedback || !Balance || !Challenge || !Story || !contrasts || !clues || T.validate(clues,contrasts,bank).length || K.validate(contrasts,bank).length || E.validateContexts(contexts,bank,curation).length || Q.validate(missions,expressions).length || E.validateBank(bank).length || E.validateExpressions(expressions).length || C.validate(comics,expressions).length || S.validate(surprises,expressions).length) {
    const error = $('global-error');
    error.textContent = 'Kunde inte läsa in ordbanken. Försök ladda om sidan.';
    error.hidden = false;
    return;
  }

  const systemTheme = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const labels = {easy:'🌱 Lätt',medium:'🧩 Medel',hard:'🔥 Svårt',exam:'🎓 Högskoleprovsutmaning',expert:'Expert'};
  const topicLabels = {words:'Ord',expressions:'Uttryck',mixed:'Blandat'};
  let history = readHistory();
  let settings = {...history.settings};
  let game = null;
  let screen = 'home';
  let timerInterval = 0;
  let wordListLimit = 24;
  let learningLimit = 18;
  let learningFilter = 'discovered';
  let focusPractice = null;
  const learningCatalog = L.catalog(bank,expressions,contexts);
  const conceptCatalog=Concepts.catalog(learningCatalog);
  const bridgeCatalog=Bridges.catalog(learningCatalog,conceptCatalog);
  const detectorCatalog = Detector.catalog(learningCatalog,contrasts).concat(
    Detector.advancedCatalog(learningCatalog,contrasts,clues));
  const feedbackCatalog=Feedback.catalog({words:learningCatalog,contexts,surprises,missions,conceptContent:conceptCatalog,
    bridgeTasks:bridgeCatalog.tasks,detectorTasks:detectorCatalog,contrasts});
  let audioContext = null;
  let burstTimer = 0;
  let selectedBookDoor = null;
  const missionChoices=new Map();
  let orderSelection=[];
  let readingCheck = null;
  let ahaRound = null;
  let recallRound = null;
  let workshop = null;
  let detectorRound = null;
  let conceptMap=null;
  let journey=null,journeyStory=null,journeyKeepsake=null;
  const journeyUsage=Object.create(null),journeyWorkshopSeen=new Set();
  const recordedJourneySteps=new WeakSet(),journeyOutcomes=new WeakMap();
  const learningById=new Map(learningCatalog.map(item=>[item.id,item]));
  history.surprises=S.sanitizeCollection(history.surprises,expressions);
  history.missionProgress=Q.sanitizeProgress(history.missionProgress,expressions,history.surprises.mastered);
  history.questCounts=J.sanitizeCounts(history.questCounts);
  history.reviewProgress=R.sanitize(history.reviewProgress,history.mistakes);
  history.skillProgress=D.sanitize(history.skillProgress);
  history.readingProgress=B.sanitizeProgress(history.readingProgress);
  history.recallProgress=Recall.sanitize(history.recallProgress,learningCatalog);
  history.detectorProgress=Detector.sanitize(history.detectorProgress,detectorCatalog);
  history.detectorLevels=Detector.sanitizeLevels(history.detectorLevels,detectorCatalog);
  history.conceptProgress=Concepts.sanitize(history.conceptProgress,conceptCatalog.tasks);
  history.bridgeProgress=Concepts.sanitize(history.bridgeProgress,bridgeCatalog.tasks);
  history.confusionProgress=H.sanitize(history.confusionProgress,contrastHistoryData);
  history.clueProgress=T.sanitize(history.clueProgress,clues);
  history.retentionProgress=U.sanitize(history.retentionProgress,contrastHistoryData);
  history.feedbackProgress=Feedback.seed(history.feedbackProgress,feedbackCatalog,history);
  history.practiceBalance=Balance.sanitize(history.practiceBalance);
  history.adventureChallenge=Challenge.sanitize(history.adventureChallenge);
  history.storyProgress=Story.sanitize(history.storyProgress);
  const reducedMotion = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  // Optional Swedish speech assistance. Nothing is spoken automatically or sent
  // to our servers. Browser/OS voice availability can vary by device.
  const canReadAloud = typeof window.speechSynthesis !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance === 'function';
  const speechLabels = {
    'listen-story':'🔊 Lyssna på texten',
    'listen-explanation':'🔊 Lyssna på förklaringen'
  };
  let speakingButton = null;
  let currentUtterance = null;
  function resetSpeechButtons() {
    for (const [id,label] of Object.entries(speechLabels)) {
      const button = $(id);
      button.textContent=label;
      button.setAttribute('aria-pressed','false');
    }
  }
  function stopReadAloud() {
    if (canReadAloud) {
      try { window.speechSynthesis.cancel(); } catch { /* Speech API optional. */ }
    }
    currentUtterance=null;
    speakingButton=null;
    resetSpeechButtons();
  }
  function speakReadAloud(text,button) {
    if (!canReadAloud || !text || !text.trim()) return;
    if (speakingButton===button) { stopReadAloud(); return; }
    stopReadAloud();
    const utterance = new window.SpeechSynthesisUtterance(text.slice(0,1600));
    utterance.lang='sv-SE';
    utterance.rate=0.9;
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      const swedish = voices.find(voice=>voice.lang?.toLowerCase()==='sv-se') ||
        voices.find(voice=>voice.lang?.toLowerCase().startsWith('sv'));
      if (swedish) utterance.voice=swedish;
    } catch { /* The browser may not expose voices yet. */ }
    currentUtterance=utterance;
    speakingButton=button;
    button.textContent='⏹️ Stoppa uppläsning';
    button.setAttribute('aria-pressed','true');
    const onFinish=()=>{
      if(currentUtterance===utterance){
        currentUtterance=null;
        speakingButton=null;
        resetSpeechButtons();
      }
    };
    utterance.onend=onFinish;
    utterance.onerror=onFinish;
    try { window.speechSynthesis.speak(utterance); }
    catch { onFinish(); }
  }
  function storyReadAloudText() {
    const q=game?.questions?.[game.index];
    if(!q || game?.feedback) return '';
    if(q.kind==='expression') return q.scene || q.word || '';
    if(q.taskType==='context') return q.stem || '';
    if(q.taskType==='reverse') return q.stem || '';
    return q.word || '';
  }
  function explanationReadAloudText() {
    if(!game?.feedback || game.settings.mode!=='train') return '';
    const chunks=[$('explanation-word').textContent,
      $('explanation-definition').textContent,
      $('explanation-example').textContent];
    if(!$('context-aha').hidden)chunks.push($('context-reason').textContent);
    return chunks.filter(Boolean).join('. ');
  }


  function readHistory() {
    try { return E.sanitizeHistory(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')); }
    catch { return E.sanitizeHistory(null); }
  }
  function saveHistory() {
    history.settings = E.sanitizeSettings(settings);
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(history)); }
    catch { /* Private mode or storage quota: the game still works without persistence. */ }
  }
  // Only expression IDs are stored. No names, accounts, personal information or requests to servers.
  function changeDoor(phase,id){
    history.surprises=S.updateCollection(history.surprises,phase,id,expressions);
    saveHistory();updateBookCounters();
  }
  function updateBookCounters(){
    const state=S.sanitizeCollection(history.surprises,expressions);
    $('book-home-count').textContent=`· ${state.unlocked.length} av ${expressions.expressions.length} upptäckta`;
    const completed=Object.values(history.missionProgress).reduce((sum,types)=>sum+types.length,0);
    $('book-progress').textContent=`🔓 ${state.unlocked.length} hittade · 📖 ${state.opened.length} öppnade · ⭐ ${completed} av 75 uppdrag klarade`;
  }
  // The book gives three different ways to learn, independent of test points.
  // Children may change tasks at any time, and an unlocked door stays unlocked.
  function missionMode(id){
    return missionChoices.get(id)||Q.nextType(history.missionProgress,id,settings.expressionTask);
  }
  const missionLabels={meaning:'🧠 Förstå',sentence:'💬 Rätt mening',order:'🧩 Rätt ordning'};
  function makeBonus(target,id){
    target.replaceChildren();
    const data=S.getChallenge(surprises,id),task=Q.get(missions,id);
    if(!data||!task)return;
    const mode=missionMode(id),completed=history.missionProgress[id]||[];
    const wrap=element('section','bonus-question');wrap.dataset.expressionId=id;wrap.dataset.missionMode=mode;
    wrap.append(element('h4','','🎯 Välj ett litet uppdrag'));
    wrap.append(element('p','mission-progress',`⭐ ${completed.length} av 3 uppdrag klarade i den här luckan`));
    const menu=element('div','mission-mode-list');menu.setAttribute('role','group');menu.setAttribute('aria-label','Välj uppdrag för uttrycket');
    for(const type of Q.TYPES){
      const btn=element('button','mission-mode-choice');btn.type='button';btn.dataset.missionChoice=type;
      btn.setAttribute('aria-pressed',String(mode===type));
      btn.append(element('span','mission-mode-icon',type==='meaning'?'🧠':type==='sentence'?'💬':'🧩'),
        element('span','',type==='meaning'?'Förstå':type==='sentence'?'Rätt mening':'Ordna'),
        element('span','mission-check',completed.includes(type)?'⭐ Klarat':'Inte klart'));
      menu.append(btn);
    }
    wrap.append(menu);
    if(completed.length===3)wrap.append(element('p','mission-done','🏆 Alla tre uppdragen klara! Du kan spela dem igen när du vill.'));
    if(mode==='meaning'){
      wrap.append(element('p','mission-instructions','Läs den nya situationen. Vilken beskrivning passar uttrycket?'),element('p','bonus-prompt',data.prompt));
      const buttons=element('div','mission-buttons');
      data.options.forEach((opt,i)=>{const b=element('button','mission-choice',opt.label);b.type='button';b.dataset.missionAnswer=String(i);buttons.append(b);});
      wrap.append(buttons);
    }else if(mode==='sentence'){
      wrap.append(element('p','mission-instructions','Vilken av meningarna använder uttrycket på rätt sätt?'));
      const choices=E.shuffle(task.sentences.map((row,index)=>({row,index})));
      const buttons=element('div','mission-buttons');
      for(const choice of choices){const b=element('button','mission-choice',choice.row.label);b.type='button';b.dataset.missionSentence=String(choice.index);buttons.append(b);}
      wrap.append(buttons);
    }else{
      wrap.append(element('p','mission-instructions','Lägg de tre händelserna i ordning. Tryck på det som händer först, sedan nästa och sist på slutet.'));
      const available=element('div','mission-buttons');
      for(const row of E.shuffle(task.order.map((label,key)=>({label,key})))){
        const b=element('button','mission-choice',row.label);b.type='button';b.dataset.missionStep=String(row.key);b.setAttribute('aria-pressed','false');available.append(b);
      }
      const selected=element('div','mission-selected');selected.append(element('p','','Din ordning:'));
      const list=element('ol','');list.dataset.selectedSteps='';list.setAttribute('aria-live','polite');selected.append(list);
      const controls=element('div','mission-order-controls');
      const undo=element('button','','↶ Ångra');undo.type='button';undo.dataset.missionUndo='';undo.disabled=true;
      const reset=element('button','','🔄 Börja om');reset.type='button';reset.dataset.missionReset='';reset.disabled=true;
      controls.append(undo,reset);
      const check=element('button','primary-button full-button','✅ Kontrollera ordningen');check.type='button';check.dataset.missionCheck='';check.disabled=true;
      wrap.append(available,selected,controls,check);
      wrap._selected=[];
    }
    if(settings.missionHints){
      const hint=element('button','mission-hint-button','💡 Visa ledtråd');hint.type='button';hint.dataset.missionHint='';hint.setAttribute('aria-expanded','false');
      const hintText=element('p','mission-hint',mode==='meaning'?'Tänk på vad uttrycket betyder i en verklig vardagssituation.':task.hint);
      hintText.hidden=true;hintText.dataset.hintText='';wrap.append(hint,hintText);
    }
    const message=element('p','bonus-message');message.setAttribute('role','status');message.setAttribute('aria-live','polite');wrap.append(message);
    target.append(wrap);
  }
  function redrawMissionOrder(wrap){
    const selected=wrap._selected||[];
    const labels=Q.get(missions,wrap.dataset.expressionId).order;
    const list=wrap.querySelector('[data-selected-steps]');list.replaceChildren();
    selected.forEach(key=>list.append(element('li','',labels[key])));
    wrap.querySelectorAll('[data-mission-step]').forEach(b=>{
      const chosen=selected.includes(Number(b.dataset.missionStep));
      b.disabled=chosen;b.setAttribute('aria-pressed',String(chosen));
    });
    wrap.querySelector('[data-mission-check]').disabled=selected.length!==3;
    wrap.querySelector('[data-mission-undo]').disabled=selected.length===0;
    wrap.querySelector('[data-mission-reset]').disabled=selected.length===0;
  }
  function completeMission(wrap,explanation){
    const id=wrap.dataset.expressionId,type=wrap.dataset.missionMode;
    history.missionProgress=Q.complete(history.missionProgress,id,type,expressions);
    changeDoor('mastered',id);
    wrap.querySelector('.mission-progress').textContent=`⭐ ${history.missionProgress[id].length} av 3 uppdrag klara i den här luckan`;
    wrap.querySelectorAll('.mission-mode-choice').forEach(b=>{
      const done=history.missionProgress[id].includes(b.dataset.missionChoice);
      b.querySelector('.mission-check').textContent=done?'⭐ Klarat':'Inte klart';
    });
    wrap.querySelectorAll('[data-mission-answer],[data-mission-sentence],[data-mission-step],[data-mission-check],[data-mission-undo],[data-mission-reset]').forEach(b=>b.disabled=true);
    const msg=wrap.querySelector('.bonus-message');msg.dataset.outcome='right';
    msg.textContent='🎉 Du klarade uppdraget! '+explanation+' Detta påverkar inte poängen i ordtestet.';
    if(history.missionProgress[id].length<3){
      const next=element('button','secondary-button full-button','✨ Prova nästa uppdrag →');next.type='button';next.dataset.missionNext='';wrap.append(next);
    }else wrap.append(element('p','mission-done','🏆 Du har nu klarat alla tre typer av uppdrag för uttrycket!'));
    if(screen==='book')renderBookTiles();
  }
  function gradeBonus(event){
    const button=event.target.closest('button');
    if(!button)return;
    const wrap=button.closest('.bonus-question');
    if(!wrap||!wrap.contains(button))return;
    const id=wrap.dataset.expressionId,mode=wrap.dataset.missionMode,task=Q.get(missions,id),data=S.getChallenge(surprises,id);
    if(!task||!data)return;
    if(button.dataset.missionChoice){
      missionChoices.set(id,button.dataset.missionChoice);
      makeBonus(wrap.parentElement,id);
      return;
    }
    if(button.hasAttribute('data-mission-next')){
      missionChoices.set(id,Q.nextType(history.missionProgress,id,'mix'));
      makeBonus(wrap.parentElement,id);return;
    }
    if(button.hasAttribute('data-mission-hint')){
      const hint=wrap.querySelector('[data-hint-text]');hint.hidden=!hint.hidden;
      button.setAttribute('aria-expanded',String(!hint.hidden));
      button.textContent=hint.hidden?'💡 Visa ledtråd':'💡 Dölj ledtråd';return;
    }
    if(button.hasAttribute('data-mission-step')){
      const key=Number(button.dataset.missionStep);
      if(!wrap._selected.includes(key)&&wrap._selected.length<3){wrap._selected.push(key);redrawMissionOrder(wrap);}
      return;
    }
    if(button.hasAttribute('data-mission-undo')){wrap._selected.pop();redrawMissionOrder(wrap);return;}
    if(button.hasAttribute('data-mission-reset')){wrap._selected=[];redrawMissionOrder(wrap);wrap.querySelector('.bonus-message').textContent='';return;}
    const message=wrap.querySelector('.bonus-message');
    let right=null,explanation='';
    if(mode==='order'&&button.hasAttribute('data-mission-check')){
      if(wrap._selected.length!==3)return;
      right=Q.checkOrder(wrap._selected);
      explanation='Du såg hur händelserna hör ihop i tid.';
    }else if(mode==='sentence'&&button.hasAttribute('data-mission-sentence')){
      const index=Number(button.dataset.missionSentence);
      right=task.sentences[index]&&task.sentences[index].correct===true;
      explanation='Du kan använda uttrycket i en ny mening.';
    }else if(mode==='meaning'&&button.hasAttribute('data-mission-answer')){
      right=S.checkAnswer(surprises,id,Number(button.dataset.missionAnswer));
      explanation=data.explanation;
    }
    if(right===true){button.classList.add('is-right');completeMission(wrap,explanation);}
    else if(right===false){
      if(mode!=='order'){button.classList.add('is-wrong');button.disabled=true;}
      message.dataset.outcome='wrong';
      message.textContent=mode==='order'?'Inte riktigt än. Prova att ändra ordningen med Ångra eller Börja om.':'Inte riktigt. Fundera på vad uttrycket betyder och försök igen!';
    }
  }
  function renderBookTiles(){
    const box=$('book-grid');box.replaceChildren();
    const state=history.surprises;
    expressions.expressions.forEach((entry,i)=>{
      const unlocked=state.unlocked.includes(entry.id);
      const mastered=state.mastered.includes(entry.id);
      const opened=state.opened.includes(entry.id);
      const status=mastered?'mastered':opened?'opened':unlocked?'unlocked':'locked';
      const btn=element('button','book-tile');btn.type='button';btn.dataset.doorId=entry.id;
      btn.dataset.state=status;btn.disabled=!unlocked;
      btn.setAttribute('aria-pressed',String(selectedBookDoor===entry.id));
      btn.setAttribute('aria-label',`Lucka ${i+1}, ${unlocked?entry.phrase+', '+(mastered?'klar':opened?'öppnad':'upplåst'):'låst'}`);
      btn.append(element('span','book-tile-number','Lucka '+(i+1)),
        element('span','book-tile-symbol',mastered?'⭐':opened?'📖':unlocked?'🎁':'🔒'),
        element('span','book-tile-caption',unlocked?entry.phrase:'Hemligt uttryck'),
        element('span','mission-badge',unlocked?`${(history.missionProgress[entry.id]||[]).length}/3 uppdrag`:''));
      box.append(btn);
    });
  }
  function renderBookSelection(){
    const entry=expressions.expressions.find(x=>x.id===selectedBookDoor);
    if(!entry || !history.surprises.unlocked.includes(entry.id)){$('book-detail').hidden=true;return;}
    $('book-detail').hidden=false;
    $('book-phrase').textContent=entry.phrase;
    $('book-context').textContent=entry.scene;
    $('book-definition').textContent='💡 '+entry.definition;
    C.render($('book-comic'),entry,comics);
    makeBonus($('book-bonus'),entry.id);
  }
  function renderBook(){
    const unlocked=history.surprises.unlocked;
    $('book-empty').hidden=unlocked.length!==0;
    updateBookCounters();
    renderBookTiles();
    renderBookSelection();
  }
  function openBook(){show('book');}
  function updateTheme() {
    const actual = settings.theme === 'auto' ? (systemTheme && systemTheme.matches ? 'dark' : 'light') : settings.theme;
    document.documentElement.dataset.theme = actual;
    document.documentElement.dataset.contrast = settings.contrast ? 'high' : 'normal';
    document.querySelector('meta[name="theme-color"]').content = actual === 'dark' ? '#0b1220' : '#f3f7fc';
    document.querySelectorAll('[data-theme-choice]').forEach(btn => btn.setAttribute('aria-pressed',String(btn.dataset.themeChoice === settings.theme)));
    $('high-contrast').checked = settings.contrast;
  }
  if (systemTheme) {
    const listener=()=>{if(settings.theme==='auto')updateTheme();};
    if (systemTheme.addEventListener) systemTheme.addEventListener('change',listener);
    else if (systemTheme.addListener) systemTheme.addListener(listener);
  }
  function playSound(kind) {
    if(!settings.sound || !game || game.settings.mode !== 'train')return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if(!Audio)return;
    try {
      if(!audioContext)audioContext=new Audio();
      if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
      const notes=kind==='right'?[659,880]:[392,349];
      notes.forEach((frequency,i)=>{
        const start=audioContext.currentTime+i*.10;
        const tone=audioContext.createOscillator();
        const volume=audioContext.createGain();
        tone.type='sine';tone.frequency.value=frequency;
        volume.gain.setValueAtTime(.0001,start);
        volume.gain.exponentialRampToValueAtTime(.032,start+.013);
        volume.gain.exponentialRampToValueAtTime(.0001,start+.095);
        tone.connect(volume);volume.connect(audioContext.destination);
        tone.start(start);tone.stop(start+.11);
      });
    }catch { /* Sound is optional; no audio device should prevent play. */ }
  }
  function clearBurst() {
    if(burstTimer){clearTimeout(burstTimer);burstTimer=0;}
    $('star-burst').hidden=true;
  }
  function showBurst() {
    clearBurst();
    if(reducedMotion && reducedMotion.matches)return;
    const burst=$('star-burst');burst.hidden=false;
    burst.classList.remove('burst-on');void burst.offsetWidth;
    burst.classList.add('burst-on');
    burstTimer=setTimeout(()=>{burst.hidden=true;burstTimer=0;},900);
  }
  function updateCompanionSelection() {
    document.querySelectorAll('[data-companion]').forEach(button=>
      button.setAttribute('aria-pressed',String(button.dataset.companion===settings.companion)));
    $('play-sounds').checked=settings.sound;
    const buddy=P.companion(settings.companion);
    const face=document.querySelector('.hero-companion-emoji');
    if(face)face.textContent=buddy.emoji;
    const message=document.querySelector('.hero-companion-message');
    if(message)message.textContent=`Hej! Jag heter ${buddy.name}. Ska vi gå på ordjakt?`;
  }
  function createAdventureChoices(){
    const containers={upptack:$('adventure-grid-explore'),magi:$('adventure-grid-magic')};
    for(const [id,item] of Object.entries(A.WORLDS)){
      const grid=containers[item.group];
      if(!grid)continue;
      const button=element('button','adventure-choice');
      button.type='button';button.dataset.adventure=id;button.setAttribute('aria-pressed','false');
      button.setAttribute('aria-label',item.title+': '+item.description);
      const emoji=element('span','adventure-thumb',item.emoji);emoji.setAttribute('aria-hidden','true');
      const title=element('strong','',item.title);
      const teaser=element('small','',item.teaser);
      const chosen=element('span','adventure-selected','Vald ✓');
      button.append(emoji,title,teaser,chosen);
      grid.append(button);
    }
  }
  function updateAdventureSelection() {
    const choice=A.world(settings.adventure);
    document.documentElement.dataset.adventure=settings.adventure;
    document.querySelectorAll('button.adventure-choice[data-adventure]').forEach(button=>
      button.setAttribute('aria-pressed',String(button.dataset.adventure===settings.adventure)));
    $('adventure-intro').textContent=choice.emoji+' '+choice.description;
    M.render($('adventure-preview-map'),settings.adventure,10,0,{preview:true});
  }
  function renderTrail() {
    if(!game)return;
    const world=A.world(game.settings.adventure);
    const answered=Object.keys(game.answers).length;
    $('journey-icon').textContent=world.emoji;
    $('journey-name').textContent=world.title;
    $('journey-intro').textContent=world.intro;
    const trail=$('journey-stops');trail.replaceChildren();
    const stages=A.stages(game.settings.adventure,game.questions.length,answered);
    M.render($('journey-map'),game.settings.adventure,game.questions.length,answered);
    stages.forEach(stop=>{
      const li=element('li','journey-stop'+(stop.reached?' reached':''));
      const icon=element('span','stop-emoji',stop.emoji);icon.setAttribute('aria-hidden','true');
      const name=element('span','stop-name',stop.name);
      const unit=game.settings.topic==='expressions'?'uttryck':game.settings.topic==='mixed'?'frågor':'ord';
      const step=element('span','stop-step',`${stop.threshold} ${unit}`);
      li.append(icon,name,step);
      li.setAttribute('aria-label',`${stop.name}, efter ${stop.threshold} ord, ${stop.reached?'upptäckt':'inte upptäckt'}`);
      trail.append(li);
    });
    $('journey-progress').textContent=`${stages.filter(stop=>stop.reached).length} av 4 platser upptäckta · Kartan visar avklarade frågor`;
  }
  function renderMission() {
    if(!game)return;
    const training=game.settings.mode==='train';
    $('mission-bar').hidden=!training;
    $('quest-progress').hidden=!training||!game.questId;
    if(!training)return;
    const buddy=P.companion(game.settings.companion);
    $('play-companion-emoji').textContent=buddy.emoji;
    $('play-companion-name').textContent=`${buddy.name} är din ordkompis!`;
    $('play-companion-hint').textContent=game.streak>=3?'Wow, du har hittat flera ord i rad!':
      game.index===0 && !Object.keys(game.answers).length?'Välj ett svar så kör vi!':
      'Varje ord du upptäcker gör dig klokare!';
    $('play-stars').textContent=`⭐ ${game.stars} ${game.stars===1?'stjärna':'stjärnor'}`;
    if(game.questId){
      const quest=J.QUESTS[game.questId];
      const step=J.progress(game.questId,game.questions,game.answers,game.priorMistakes);
      $('quest-progress-icon').textContent=quest.emoji;
      $('quest-progress-title').textContent=quest.title+' – '+quest.task;
      $('quest-progress-caption').textContent=step.complete?quest.done:quest.subtitle;
      $('quest-progress-count').textContent=`${step.done} / ${step.goal}`;
      $('quest-progress-fill').style.width=(step.done/step.goal*100)+'%';
      $('quest-progress-bar').setAttribute('aria-valuemax',String(step.goal));
      $('quest-progress-bar').setAttribute('aria-valuenow',String(step.done));
    }
    $('play-streak').hidden=game.streak<2;
    $('play-streak').textContent=`🔥 ${game.streak} i rad`;
  }
  function scrollTop() {
    // Do not steal focus from the user's answer; scroll only after a screen transition.
    window.scrollTo({top:0,behavior:'instant'});
  }
  function show(name) {
    if(name!=='play') stopReadAloud();
    screen = name;
    for (const view of ['home','play','results','words','history','book','learning','focus','aha','recall','workshop','detector','concepts','journey']) $('view-'+view).hidden = view!==name;
    document.querySelectorAll('[data-nav]').forEach(btn=>{
      const chosen=btn.dataset.nav===(name==='play'||name==='results'?'home':name);
      if(chosen)btn.setAttribute('aria-current','page'); else btn.removeAttribute('aria-current');
    });
    if(name==='words')renderWordList();
    if(name==='book')renderBook();
    if(name==='history')renderHistory();
    if(name==='learning')renderLearning();
    scrollTop();
  }
  function setPressed(selector, key, value) {
    document.querySelectorAll(selector).forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset[key]===String(value))));
  }
  function setSettings(change) {
    settings = E.sanitizeSettings({...settings,...change});
    saveHistory();renderSetup();
  }
  function fillTimerPresets() {
    const sel=$('timer-preset');
    const items=settings.timerMode==='per'
      ? [[10,'10 sekunder'],[20,'20 sekunder'],[30,'30 sekunder'],[45,'45 sekunder'],[60,'1 minut'],[90,'1 minut 30 sekunder']]
      : [[60,'1 minut'],[180,'3 minuter'],[300,'5 minuter'],[600,'10 minuter'],[900,'15 minuter']];
    sel.replaceChildren();
    for (const [secs,label] of items) { const option=document.createElement('option');option.value=String(secs);option.textContent=label;sel.append(option); }
    const custom=document.createElement('option');custom.value='custom';custom.textContent='Egen tid';sel.append(custom);
    sel.value=items.some(item=>item[0]===settings.timerSeconds)?String(settings.timerSeconds):'custom';
    $('custom-timer').hidden=sel.value!=='custom';
    $('custom-min').value=String(Math.floor(settings.timerSeconds/60));
    $('custom-sec').value=String(settings.timerSeconds%60);
  }
  function renderReviewTrail(){
    const stats=R.summary(history.reviewProgress);
    $('review-due-count').textContent=String(stats.due);
    $('review-waiting-count').textContent=String(stats.waiting);
    $('review-mastered-count').textContent=String(stats.mastered);
    let note='Missade ord kommer tillbaka med en annan frågetyp.';
    if(stats.due)note=`${stats.due} ${stats.due===1?'ord eller uttryck väntar':'ord och uttryck väntar'} på en ny chans nu!`;
    else if(stats.waiting && stats.nextDue){
      const diff=Math.max(0,stats.nextDue-Date.now());
      const h=Math.ceil(diff/(60*60*1000));
      note=h<24?`Bra övat! Nästa repetition om ungefär ${h} ${h===1?'timme':'timmar'}.`:
        `Bra övat! Nästa repetition om ungefär ${Math.ceil(diff/(24*60*60*1000))} dagar.`;
    }else if(stats.mastered)note='🌟 Du har lärt dig alla dina tidigare svåra ord!';
    $('review-due-note').textContent=note;
    const focus=D.suggestions(history.skillProgress,2,history.readingProgress);
    const names=new Map([...bank.words.map(w=>[w.id,w.word]),...expressions.expressions.map(x=>[x.id,x.phrase])]);
    $('adaptive-focus-note').hidden=!focus.length;
    if(focus.length) $('adaptive-focus-note').textContent='🎯 Sånt vi kan öva vidare på: '+
      focus.map(item=>`${names.get(item.id)||'Ett ord'} – ${D.LABELS[item.skill].toLocaleLowerCase('sv-SE')}`).join(' · ');
  }
  function readyReviewCount(pool){return pool.filter(item=>R.ready(history.reviewProgress[item.entry.id])).length;}
  function priorReviewErrors(){
    const prior={...history.mistakes};
    for(const id of R.readyIds(history.reviewProgress))prior[id]=Math.max(prior[id]||0,1);
    return prior;
  }
  function renderQuestShelf(){
    const buddy=P.companion(settings.companion);
    $('quest-home-greeting').textContent=`${buddy.emoji} ${buddy.name} säger: Välj ett litet uppdrag, eller använd inställningarna längre ner!`;
    const available=J.makePlan('comeback',settings,history.mistakes,bank,curation,expressions,E,history.reviewProgress);
    for(const id of J.KEYS){
      const count=history.questCounts[id]||0;
      $('quest-count-'+id).textContent=count===1?'1 avklarat uppdrag':`${count} avklarade uppdrag`;
    }
    const totals=R.summary(history.reviewProgress);
    $('quest-review-help').textContent=available?`${totals.due} ${totals.due===1?'fråga':'frågor'} redo för en ny sorts övning`:
      totals.waiting?`${totals.waiting} ord kommer tillbaka lite senare`:'Spela först, så dyker svåra ord upp här';
    renderReviewTrail();
    document.querySelectorAll('[data-start-quest="comeback"]').forEach(button=>{
      button.disabled=!available;
      button.title=available?'Ge ett gammalt fel en ny chans':'Det finns ännu inga tidigare fel att öva på.';
    });
  }
  function startQuest(id){
    const plan=J.makePlan(id,settings,history.mistakes,bank,curation,expressions,E,history.reviewProgress);
    if(!plan){
      if(screen==='home')showSetupError('Det finns ännu inga gamla fel att öva på. Prova ett annat uppdrag!');
      return;
    }
    setSettings(plan.settings);
    startRound(id);
  }
  function getAhaPlan(random=()=>.37){
    return AhaPlan.plan(history.readingProgress,{bank,expressions,contexts,surprises,missions,reading:B,random});
  }
  function renderAhaPreview(){
    const plan=getAhaPlan();
    const ready=plan.ready.length,waiting=plan.waiting.length;
    const review=plan.ready.some(row=>row.reason==='review');
    const note=ready
      ? (review?'Prova hur du förstår orden i andra berättelser efter en paus.':
        ready===1?'En ny berättelse väntar på dig!':ready+' ord och uttryck har andra berättelser att prova.')+
        (waiting?' Några andra får vila till en annan dag.':'')
      : 'Bra övat! '+(waiting?Memory.note(Math.min(...plan.waiting.map(row=>row.dueAt))):'Dina nästa berättelser kommer en annan dag.');
    for(const location of ['home','learning']){
      $('aha-'+location).hidden=!ready&&!waiting;
      $('aha-'+location+'-note').textContent=note;
      const button=$('aha-'+location+'-start');
      button.hidden=!ready;
      button.textContent=ready?'🎭 Prova '+plan.round.length+
        (review?(plan.round.length===1?' berättelse igen →':' berättelser igen →'):
          (plan.round.length===1?' ny berättelse →':' nya berättelser →')):'';
    }
    return plan;
  }
  function ahaOption(item,random=()=>.37){
    return AhaPlan.option(item,history.readingProgress,{bank,contexts,surprises,missions,reading:B,random});
  }
  function wordProfile(item,types,now=Date.now()){
    return L.profile(item,{skillProgress:history.skillProgress,missionProgress:history.missionProgress,
      readingProgress:history.readingProgress,types,transfer:ahaOption(item),reading:B,now});
  }
  const JOURNEY_DONE={
    focus:['focus-done','🗺️ Se min ordstig'],aha:['aha-round-done','🗺️ Se min ordstig →'],
    recall:['recall-done','🗺️ Se min ordstig →'],workshop:['workshop-done','🗺️ Se min ordstig →'],
    detector:['detector-done','🗺️ Se min ordstig →'],concept:['concepts-done','🗺️ Till Begreppskartan →'],
    bridge:['bridges-done','🗺️ Till Begreppskartan →']
  };
  function observePracticeFeedback(key,outcome,now,evidence=''){
    history.feedbackProgress=Feedback.observe(history.feedbackProgress,feedbackCatalog,{key,outcome,now,evidence});
  }
  function noteJourneyOutcome(mode,data){
    const step=journey&&!journey.finished?journey.steps[journey.index]:null;
    if(step?.mode===mode)journeyOutcomes.set(step,Challenge.outcome(mode,data));
  }
  function completePracticeFeedback(step){
    const before=history.feedbackProgress,balance=history.practiceBalance;
    const after=Feedback.complete(before,feedbackCatalog,step);
    const nextBalance=Balance.recordCompletion(balance,step,journeyStepFinished(step.mode),recordedJourneySteps);
    if(nextBalance!==balance){
      history.adventureChallenge=Challenge.record(history.adventureChallenge,step,journeyOutcomes.get(step)||'neutral');
    }
    if(after!==before||nextBalance!==balance){
      history.feedbackProgress=after;history.practiceBalance=nextBalance;saveHistory();
    }
  }
  function finishJourneyStory(){
    if(!journeyStory||journeyKeepsake)return;
    const result=Story.finish(history.storyProgress,journeyStory,journey);
    if(result.earned){
      history.storyProgress=result.progress;journeyKeepsake=result.earned;saveHistory();
    }
  }
  function getKnowledgeProfile(now=Date.now()){
    return Knowledge.analyze({catalog:learningCatalog,history,detectorTasks:detectorCatalog,
      conceptContent:conceptCatalog,bridgeTasks:bridgeCatalog.tasks,contrasts:contrastHistoryData,
      reading:B,recall:Recall,confusions:H,now});
  }
  function getJourneyPlan(now=Date.now(),random=Math.random,knowledge=getKnowledgeProfile(now),options={}){
    const knownIds=new Set(learningCatalog.filter(item=>Recall.eligible(item,history)||
      history.recallProgress[item.id]).map(item=>item.id));
    const continuing=!!options.used?.length;
    return Journey.build({catalog:learningCatalog,history,knownIds,now,random,usage:journeyUsage,...options,
      workshopSeen:journeyWorkshopSeen,decorate:row=>Knowledge.decorate(knowledge,row),
      adjust:rows=>Feedback.adjust(rows,history.feedbackProgress,feedbackCatalog,now).map(row=>Challenge.tag(row,{
        byId:learningById,history,contrastLevel:id=>T.selectLevel(K.findPair(id,contrasts),clues,history.clueProgress)
      })),
      chooseNext:(rows,steps)=>{
        const baseline=Challenge.pick(rows,steps,{raw:history.adventureChallenge,now,continuing,
          balancePick:(pool,selected)=>Balance.pick(pool,history.practiceBalance,selected,{continuing}),category:Balance.kind});
        if(continuing||steps.length)return baseline;
        if(options.onOpenings)options.onOpenings(Story.openings(rows,baseline));
        return Story.prefer(rows,baseline,options.preferredMode);
      },
      focusTypes:item=>F.supported(F.findItem(item.id,bank,expressions),curation,contexts,missions,K,contrasts),
      pairFor:item=>K.findPair(item.id,contrasts),
      aha:AhaPlan.plan(history.readingProgress,{bank,expressions,contexts,surprises,missions,reading:B,now,random}),
      recall:Recall.plan(learningCatalog,history,now),
      detector:{...Detector.plan(detectorCatalog,history.detectorProgress,knownIds,now,random,null,history.detectorLevels),catalog:detectorCatalog},
      concept:Concepts.plan(conceptCatalog,history.conceptProgress,knownIds,now,random),
      bridge:{...Bridges.plan(bridgeCatalog,history.bridgeProgress,knownIds,now,random),catalog:bridgeCatalog.tasks},
      conceptContent:conceptCatalog});
  }
  function journeyStepFinished(mode){
    if(mode==='focus')return !!focusPractice?.finished;
    if(mode==='aha')return ahaRound?.stage==='finished';
    if(mode==='recall')return recallRound?.stage==='finished';
    if(mode==='workshop')return workshop?.stage==='finished';
    if(mode==='detector')return detectorRound?.stage==='finished';
    if(mode==='concept')return conceptMap?.round?.stage==='finished';
    if(mode==='bridge')return conceptMap?.bridgeRound?.stage==='finished';
    return false;
  }
  function resetJourneyControls(){
    for(const [id,label] of Object.values(JOURNEY_DONE))$(id).textContent=label;
    $('next-journey-banner').hidden=true;
  }
  function renderJourneyBanner(){
    const step=journey&&!journey.finished?journey.steps[journey.index]:null;
    if(!step){$('next-journey-banner').hidden=true;return;}
    const meta=Journey.MODES[step.mode];
    $('next-journey-banner').hidden=false;
    $('next-journey-progress').textContent='Äventyr · '+(journey.index+1)+' av '+journey.steps.length;
    $('next-journey-method').textContent=meta.icon+' '+meta.label;
    $('next-journey-story').textContent=journeyStory?A.world(journeyStory.id).emoji+' '+journeyStory.title:'';
    $('next-journey-story').hidden=!journeyStory;
    $('next-journey-story').title=journeyStory?.intro||'';
    const stops=$('next-journey-stations');stops.replaceChildren();
    for(const [i,station] of journey.steps.entries()){
      const status=i<journey.index?(journey.completed.includes(station.mode)?'done':'skipped'):i===journey.index?'current':'ahead';
      const marker=element('li','story-station',status==='done'?'✓':Journey.MODES[station.mode].icon);
      marker.dataset.state=status;
      const labels={done:'klar',skipped:'överhoppad',current:'nu',ahead:'senare'};
      marker.setAttribute('aria-label',Journey.MODES[station.mode].label+' – '+labels[status]);
      stops.append(marker);
    }
    $('next-journey-reason').textContent=step.explanation||Journey.REASONS[step.reason];
    const finished=journeyStepFinished(step.mode);
    if(finished){
      const marker=stops.children[journey.index];marker.textContent='✓';marker.dataset.state='done';
      marker.setAttribute('aria-label',meta.label+' – klar');
    }
    const pacing=finished?'':Challenge.note(step,history.adventureChallenge);
    $('next-journey-pacing').textContent=pacing;$('next-journey-pacing').hidden=!pacing;
    if(finished)completePracticeFeedback(step);
    $('next-journey-skip').hidden=finished;
    $(JOURNEY_DONE[step.mode][0]).textContent=journey.index+1===journey.steps.length?
      'Se hur äventyret gick →':'Nästa äventyrssteg →';
  }
  function startJourney(preferredMode=null){
    if((journey&&!journey.finished)||!['home','learning','journey','results'].includes(screen))return;
    const now=Date.now(),plan=getJourneyPlan(now,Math.random,getKnowledgeProfile(now),
      {preferredMode:typeof preferredMode==='string'?preferredMode:null});
    if(typeof preferredMode==='string'&&plan.steps[0]?.mode!==preferredMode){
      renderStoryOptions(screen);
      return;
    }
    if(!plan.steps.length){journey=null;journeyStory=null;journeyKeepsake=null;renderJourneySummary();return;}
    if(screen==='results')game=null;
    journey=Journey.start(plan.steps);
    const story=Story.model(history.storyProgress,settings.adventure);
    journeyStory=story.chapter;journeyKeepsake=null;
    launchJourneyStep();
  }
  function launchJourneyStep(){
    const step=journey?.steps[journey.index];
    if(!step||journey.finished){renderJourneySummary();return;}
    // Use the exact ready task instead of generating a different mini-round.
    const task=step.payload;
    let opened=true;
    if(step.mode==='focus')opened=startFocus(task.id,task.skill,{gentle:step.challenge?.short&&Challenge.pace(history.adventureChallenge)==='gentle'});
    else if(step.mode==='aha'){
      ahaRound={items:[task],index:0,attempts:0,stage:'read',completed:0,returnId:null};
      show('aha');renderAhaStep();
    }else if(step.mode==='recall'){
      recallRound={items:[task],index:0,stage:'answer',helped:false,previewed:false,returnId:null};
      show('recall');renderRecall();
    }else if(step.mode==='detector'){
      detectorRound={items:[task],index:0,stage:'read',returnId:null};
      show('detector');renderDetector();
    }else if(step.mode==='workshop'){
      const item=learningCatalog.find(row=>row.id===task.id);
      const plan=Workshop.plan(item,learningCatalog,contrasts,Math.random);
      if(!plan)opened=false;
      else{
        journeyWorkshopSeen.add(item.id);
        workshop={...plan,index:0,selected:[],stage:'task',returnId:null};
        show('workshop');renderWorkshop();
      }
    }else if(step.mode==='concept'||step.mode==='bridge'){
      conceptMap={wordId:null,returnId:null,filter:'all',bridgeKind:'all',
        exposed:new Set(),exposedWords:new Set(),round:null,bridgeRound:null};
      $('bridges-question').hidden=true;$('bridges-feedback').hidden=true;$('bridges-finished').hidden=true;
      show('concepts');
      const round={items:[task],index:0,stage:'question',attempts:0};
      if(step.mode==='concept'){conceptMap.round=round;renderConceptQuestion();}
      else{conceptMap.bridgeRound=round;renderBridgeTask();}
    }else opened=false;
    if(!opened){journey=Journey.advance(journey,'skipped',step.mode);launchJourneyStep();return;}
    renderJourneyBanner();
  }
  function renderJourneySummary(){
    resetJourneyControls();
    finishJourneyStory();
    const done=journey?.completed||[],skipped=journey?.skipped||[];
    $('next-journey-title').textContent=journeyKeepsake?'🎉 '+journeyKeepsake.title+' – klart!':done.length?'🌟 Bra äventyr!':'🌱 Utforska i din egen takt';
    $('next-journey-summary').textContent=journey?
      done.length+' av '+journey.steps.length+' stationer avslutade. '+(skipped.length?skipped.length+' hoppade du över. ':'')+
      'Varje övning hjälper dig att upptäcka ord.':
      'Det finns inga lämpliga stationer redo just nu. Du kan fortfarande utforska Min ordstig.';
    const list=$('next-journey-summary-list');list.replaceChildren();
    for(const step of journey?.steps||[]){
      const meta=Journey.MODES[step.mode];
      const status=done.includes(step.mode)?'Provat':'Hoppat över';
      list.append(element('li','journey-summary-item',meta.icon+' '+meta.label+' · '+status));
    }
    list.hidden=!journey?.steps.length;
    $('story-earned').hidden=!journeyKeepsake;
    $('story-earned-icon').textContent=journeyKeepsake?.emoji||'';
    $('story-earned-title').textContent=journeyKeepsake?.keepsake||'';
    $('story-earned-ending').textContent=journeyKeepsake?.ending||'';
    renderStoryOptions('journey');
    show('journey');$('next-journey-title').focus({preventScroll:true});
  }
  function advanceJourney(status,mode){
    if(!journey||journey.finished||journey.steps[journey.index]?.mode!==mode)return;
    const complete=journeyStepFinished(mode);
    if(status==='completed'&&!complete)return;
    if(complete)status='completed';
    const next=Journey.advance(journey,status,mode);
    if(next===journey)return;
    journeyUsage[mode]=Date.now();
    clearLearningExercise();resetJourneyControls();journey=next;
    // Re-evaluate ONLY the unused suffix. Consumed and skipped stations
    // reserve their words, methods and original budget even after a miss.
    if(!journey.finished&&status==='completed'){
      const now=Date.now(),remaining=getJourneyPlan(now,Math.random,getKnowledgeProfile(now),Journey.continuation(journey));
      journey=Journey.replan(journey,remaining.steps);
    }
    if(journey.finished)renderJourneySummary();else launchJourneyStep();
  }
  function doneLearningExercise(mode,normal){
    if(journey){advanceJourney('completed',mode);return;}
    if(screen===Journey.MODES[mode].screen&&journeyStepFinished(mode))normal();
  }
  function getConceptPlan(groupId=null,random=()=>.37){
    const known=new Set(learningCatalog.filter(item=>Recall.eligible(item,history)||
      history.recallProgress[item.id]).map(item=>item.id));
    return Concepts.plan(conceptCatalog,history.conceptProgress,known,Date.now(),random,groupId,conceptMap?.wordId,conceptMap?.filter||'all');
  }
  function exposeConceptGroup(id){
    if(!conceptMap)return;
    const group=conceptCatalog.groups.find(group=>group.id===id);
    if(group)group.words.forEach(word=>conceptMap.exposedWords.add(word.id));
    for(const groupId of Concepts.exposedGroups(conceptCatalog,id))conceptMap.exposed.add(groupId);
  }
  function openConceptMap(id=null){
    if(id&&!Concepts.forWord(conceptCatalog,id).length&&!bridgeCatalog.tasks.some(task=>task.participants.includes(id)))return;
    conceptMap={wordId:id,returnId:id,filter:'all',bridgeKind:'all',exposed:new Set(),exposedWords:new Set(),round:null,bridgeRound:null};
    // The word card already exposed a word and definition, so do not turn
    // a word-specific visit into independent semantic evidence.
    if(id){conceptMap.exposedWords.add(id);for(const group of Concepts.forWord(conceptCatalog,id))exposeConceptGroup(group.id);}
    show('concepts');renderConceptMap();
    $('concepts-title').focus({preventScroll:true});
  }
  function getBridgePlan(groupId=null,random=()=>.37){
    const known=new Set(learningCatalog.filter(item=>Recall.eligible(item,history)||history.recallProgress[item.id]).map(item=>item.id));
    return Bridges.plan(bridgeCatalog,history.bridgeProgress,known,Date.now(),random,
      {groupId,wordId:conceptMap?.wordId,type:conceptMap?.filter||'all',kind:conceptMap?.bridgeKind||'all'});
  }
  function renderBridgePreview(){
    const plan=getBridgePlan(),summary=Concepts.summary(bridgeCatalog.tasks,history.bridgeProgress);
    $('bridges-quick').disabled=!plan.round.length;
    $('bridges-quick').textContent=plan.round.length?'🌉 Prova '+plan.round.length+' ordbroar →':'Inga ordbroar redo just nu';
    $('bridges-note').textContent=plan.round.length?
      summary.seen+' av '+summary.total+' ordbroar provade. Sortera, jämför och koppla ihop ord.':
      plan.waiting?'Dina tidigare uppgifter får vila till en annan dag.':'Prova ett annat filter för att hitta ordbroar.';
    $('bridges-kind').value=conceptMap.bridgeKind;
  }
  function startBridgeRound(){
    if(!conceptMap||conceptMap.round||conceptMap.bridgeRound)return;
    for(const card of $('concepts-list').querySelectorAll('details[open]'))exposeConceptGroup(card.dataset.conceptGroup);
    const plan=getBridgePlan(null,Math.random);
    if(!plan.round.length){renderConceptMap();return;}
    conceptMap.bridgeRound={items:plan.round,index:0,stage:'question',attempts:0};
    renderBridgeTask();
  }
  function bridgeTask(){const round=conceptMap?.bridgeRound;return round?.items[round.index];}
  function renderBridgeTask(){
    const round=conceptMap.bridgeRound,task=bridgeTask();
    round.stage='question';round.attempts=0;round.helped=false;
    round.previewed=!!conceptMap.wordId||conceptMap.exposed.has(task.groupId)||
      task.participants.some(id=>conceptMap.exposedWords.has(id));
    round.selection=task.kind==='sort'?Object.create(null):task.kind==='order'?[]:null;
    round.cards=Concepts.shuffle(task.cards);
    round.choices=task.kind==='explain'?Concepts.shuffle(task.choices.map((label,index)=>({label,index}))):[];
    $('concepts-map').hidden=true;$('concepts-question').hidden=true;$('concepts-feedback').hidden=true;$('concepts-finished').hidden=true;
    $('bridges-question').hidden=false;$('bridges-feedback').hidden=true;$('bridges-finished').hidden=true;
    $('bridges-progress').textContent='Ordbro '+(round.index+1)+' av '+round.items.length;
    $('bridges-question-type').textContent=Bridges.TYPES[task.kind].icon+' '+Bridges.TYPES[task.kind].label;
    $('bridges-prompt').textContent=task.prompt;
    $('bridges-response').textContent='';$('bridges-help-text').hidden=true;
    $('bridges-help-text').textContent=task.hint;
    $('bridges-help').hidden=false;
    drawBridgeTask();
    $('bridges-prompt').focus({preventScroll:true});scrollTop();
  }
  function drawBridgeTask(){
    const round=conceptMap.bridgeRound,task=bridgeTask(),box=$('bridges-options');
    box.replaceChildren();
    if(task.kind==='sort'){
      for(const id of round.cards){
        const row=element('div','bridge-sort-row');
        const word=element('strong','',task.labels[id]);row.append(word);
        const choices=element('div','bridge-bin-choices');choices.setAttribute('role','group');
        choices.setAttribute('aria-label','Sortera '+task.labels[id]);
        task.bins.forEach((label,index)=>{
          const button=element('button','secondary-button',label);button.type='button';
          button.dataset.bridgeSort=id;button.dataset.bridgeBin=String(index);
          button.setAttribute('aria-pressed',String(round.selection[id]===index));
          choices.append(button);
        });
        row.append(choices);box.append(row);
      }
    }else if(task.kind==='order'){
      const slots=element('ol','bridge-slots');
      task.slots.forEach((label,index)=>{
        const li=element('li','bridge-slot');li.append(element('span','',label));
        const chosen=round.selection[index];
        const value=element('strong','',chosen?task.labels[chosen]:'Välj ordet som passar här');
        value.dataset.filled=String(!!chosen);li.append(value);slots.append(li);
      });
      box.append(slots);
      const choices=element('div','workshop-pieces');
      for(const id of round.cards){
        const button=element('button','secondary-button workshop-piece',task.labels[id]);button.type='button';
        button.dataset.bridgeOrder=id;button.disabled=round.selection.includes(id);choices.append(button);
      }
      box.append(choices);
      const undo=element('button','secondary-button','↶ Ångra senaste ord');undo.type='button';
      undo.dataset.bridgeUndo='true';undo.disabled=!round.selection.length;box.append(undo);
    }else{
      if(task.kind==='explain')box.append(element('p','workshop-reading',task.cards.map(id=>task.labels[id]).join(' · ')));
      const list=task.kind==='explain'?round.choices:round.cards.map(id=>({label:task.labels[id],index:id}));
      for(const option of list){
        const button=element('button','reading-option',option.label);button.type='button';
        button.dataset.bridgeChoice=String(option.index);
        button.setAttribute('aria-pressed',String(round.selection===option.index));box.append(button);
      }
    }
    $('bridges-check').disabled=Bridges.evaluate(task,round.selection)===null;
    const count=task.kind==='sort'?Object.keys(round.selection).length:task.kind==='order'?round.selection.length:round.selection===null?0:1;
    const total=['sort','order'].includes(task.kind)?task.cards.length:1;
    $('bridges-selection-count').textContent=count+' av '+total+' val gjorda';
  }
  function selectBridge(event){
    const round=conceptMap?.bridgeRound,task=bridgeTask();
    if(round?.stage!=='question'||!task)return;
    const button=event.target.closest('button');
    if(!button||button.disabled||!$('bridges-options').contains(button))return;
    const data=button.dataset;
    let selector;
    if(task.kind==='sort'&&task.cards.includes(data.bridgeSort)&&['0','1'].includes(data.bridgeBin)){
      round.selection[data.bridgeSort]=Number(data.bridgeBin);
      selector='[data-bridge-sort="'+data.bridgeSort+'"][data-bridge-bin="'+data.bridgeBin+'"]';
    }else if(task.kind==='order'&&task.cards.includes(data.bridgeOrder)&&!round.selection.includes(data.bridgeOrder)){
      round.selection.push(data.bridgeOrder);
      selector='[data-bridge-order]:not(:disabled)';
    }else if(task.kind==='order'&&data.bridgeUndo==='true'){
      const id=round.selection.pop();selector='[data-bridge-order="'+id+'"]';
    }else if(data.bridgeChoice!==undefined&&!['sort','order'].includes(task.kind)){
      const value=task.kind==='explain'?Number(data.bridgeChoice):data.bridgeChoice;
      if(Bridges.evaluate(task,value)===null)return;
      round.selection=value;selector='[data-bridge-choice="'+data.bridgeChoice+'"]';
    }else return;
    drawBridgeTask();
    ($('bridges-options').querySelector(selector)||$('bridges-check')).focus({preventScroll:true});
  }
  function exposeBridgeTask(task){
    task.participants.forEach(id=>conceptMap.exposedWords.add(id));
    conceptMap.exposed.add(task.groupId);
    for(const id of task.participants)for(const group of Concepts.forWord(conceptCatalog,id))conceptMap.exposed.add(group.id);
  }
  function bridgeHelp(){
    const round=conceptMap?.bridgeRound,task=bridgeTask();
    if(round?.stage!=='question')return;
    round.helped=true;$('bridges-help-text').hidden=false;$('bridges-help').hidden=true;
    exposeBridgeTask(task);$('bridges-help-text').focus({preventScroll:true});
  }
  function checkBridge(){
    const round=conceptMap?.bridgeRound,task=bridgeTask();
    if(round?.stage!=='question')return;
    const result=Bridges.result(task,round.selection,round.attempts,round.previewed);
    if(!result)return;
    round.attempts++;
    if(result.step==='retry'){
      $('bridges-response').textContent='Klurigt! Läs ledtråden och ändra dina val innan du försöker igen.';
      bridgeHelp();return;
    }
    finishBridge(round.helped&&result.outcome==='direct'?'supported':result.outcome,result.step==='complete');
  }
  function finishBridge(outcome,correct=false){
    const round=conceptMap?.bridgeRound,task=bridgeTask();
    if(round?.stage!=='question')return;
    round.stage='feedback';
    noteJourneyOutcome('bridge',{outcome});
    history.bridgeProgress=Concepts.record(history.bridgeProgress,bridgeCatalog.tasks,task.id,outcome,Date.now());
    saveHistory();exposeBridgeTask(task);
    $('bridges-question').hidden=true;$('bridges-feedback').hidden=false;
    $('bridges-feedback-title').textContent=correct?'🌟 Du byggde ordbroar!':'💡 Så hör orden ihop';
    const list=$('bridges-solution');list.replaceChildren();
    for(const line of Bridges.solutionLines(task))list.append(element('li','',line));
    $('bridges-why').textContent=task.why;
    $('bridges-next').textContent=round.index+1===round.items.length?'Klar med rundan →':'Nästa ordbro →';
    $('bridges-feedback-title').focus({preventScroll:true});scrollTop();
  }
  function advanceBridge(){
    const round=conceptMap?.bridgeRound;
    if(round?.stage!=='feedback')return;
    if(round.index+1<round.items.length){round.index++;renderBridgeTask();return;}
    round.stage='finished';$('bridges-feedback').hidden=true;$('bridges-finished').hidden=false;
    $('bridges-finished-title').focus({preventScroll:true});scrollTop();
    if(journey)renderJourneyBanner();
  }
  function renderConceptMap(){
    if(!conceptMap)return;
    for(const card of $('concepts-list').querySelectorAll('details[open]'))exposeConceptGroup(card.dataset.conceptGroup);
    conceptMap.round=null;conceptMap.bridgeRound=null;
    $('bridges-question').hidden=true;$('bridges-feedback').hidden=true;$('bridges-finished').hidden=true;
    $('concepts-map').hidden=false;$('concepts-question').hidden=true;
    $('concepts-feedback').hidden=true;$('concepts-finished').hidden=true;
    $('concepts-word-filter').hidden=!conceptMap.wordId;
    $('concepts-word-note').textContent=conceptMap.wordId?
      'Samband till '+learningCatalog.find(item=>item.id===conceptMap.wordId).name:'';
    const plan=getConceptPlan();renderBridgePreview();
    $('concepts-quick').disabled=!plan.round.length;
    $('concepts-quick').textContent=plan.round.length?'🧩 Prova '+plan.round.length+' samband →':'Inga nya frågor just nu';
    $('concepts-note').textContent=plan.round.length?'Korta uppgifter utan timer eller provpoäng.':
      plan.waiting?'Du kan fortfarande utforska orden. Tidigare uppgifter får vila till en annan dag.':
      'Prova att välja en annan typ av samband.';
    for(const button of $('concepts-filters').querySelectorAll('button')){
      button.setAttribute('aria-pressed',String(button.dataset.conceptType===conceptMap.filter));
    }
    const groups=conceptCatalog.groups.filter(group=>
      (!conceptMap.wordId||group.words.some(word=>word.id===conceptMap.wordId))&&
      (conceptMap.filter==='all'||group.type===conceptMap.filter));
    const list=$('concepts-list');list.replaceChildren();
    $('concepts-empty').hidden=groups.length>0;
    for(const group of groups){
      const type=Concepts.TYPES[group.type],progress=Concepts.summary(group.questions,history.conceptProgress);
      const card=element('details','concept-card');card.dataset.conceptGroup=group.id;
      const summary=element('summary','concept-card-summary');
      summary.append(element('span','concept-icon',type.icon),element('strong','',group.title),
        element('small','',progress.seen?progress.seen+' av '+progress.total+' frågor provade':type.label));
      card.append(summary);
      const body=element('div','concept-card-body');
      const list=element('ul','concept-word-list');
      for(const word of group.words){
        const row=element('li','concept-word');
        row.append(element('strong','',word.name),element('span','',word.definition));
        list.append(row);
      }
      body.append(list,element('p','concept-explanation',group.explanation));
      const button=element('button','secondary-button full-button',progress.ready?'Prova sambandet →':'Frågorna vilar till en annan dag');
      button.type='button';button.dataset.conceptPractice=group.id;button.disabled=!progress.ready;
      body.append(button,element('p','subtle-note','När du har läst sambandet räknas uppgiften som övning med stöd.'));
      card.append(body);
      const currentMap=conceptMap;
      card.addEventListener('toggle',()=>{
        if(card.open&&conceptMap===currentMap&&screen==='concepts')exposeConceptGroup(group.id);
      });
      $('concepts-list').append(card);
    }
  }
  function startConceptRound(groupId=null){
    if(!conceptMap||conceptMap.round||conceptMap.bridgeRound)return;
    // A targeted group or an opened explanation is intentionally previewed.
    if(groupId)exposeConceptGroup(groupId);
    for(const card of $('concepts-list').querySelectorAll('details[open]'))exposeConceptGroup(card.dataset.conceptGroup);
    const plan=getConceptPlan(groupId,Math.random);
    if(!plan.round.length){renderConceptMap();return;}
    conceptMap.round={items:plan.round,index:0,stage:'question',attempts:0};
    renderConceptQuestion();
  }
  function conceptTask(){return conceptMap?.round?.items[conceptMap.round.index];}
  function renderConceptQuestion(){
    const round=conceptMap.round,task=conceptTask();
    round.stage='question';round.attempts=0;
    // Capture the starting state: reading help after a miss must remain a
    // supported attempt, not be rewritten as an initially previewed attempt.
    round.previewed=conceptMap.exposed.has(task.groupId)||!!conceptMap.wordId;
    $('concepts-map').hidden=true;$('concepts-feedback').hidden=true;$('concepts-finished').hidden=true;
    $('concepts-question').hidden=false;
    $('concepts-progress').textContent='Samband '+(round.index+1)+' av '+round.items.length;
    $('concepts-question-type').textContent=Concepts.TYPES[task.type].icon+' '+Concepts.TYPES[task.type].label;
    $('concepts-prompt').textContent=task.prompt;
    $('concepts-response').textContent='';
    $('concepts-answer-help').hidden=true;
    drawConceptOptions();
    $('concepts-prompt').focus({preventScroll:true});scrollTop();
  }
  function drawConceptOptions(){
    const box=$('concepts-options');box.replaceChildren();
    for(const option of Concepts.shuffle(conceptTask().options)){
      const button=element('button','reading-option',option.label);
      button.type='button';button.dataset.conceptAnswer=option.id;box.append(button);
    }
  }
  function answerConcept(id){
    const round=conceptMap?.round,task=conceptTask();
    if(round?.stage!=='question')return;
    const result=Concepts.outcome(task,id,round.attempts,round.previewed);
    if(!result)return;
    round.attempts++;
    if(result.step==='retry'){
      $('concepts-response').textContent='Klurigt! Läs frågan igen och fundera på vad orden betyder.';
      $('concepts-answer-help').hidden=false;
      const group=conceptCatalog.groups.find(group=>group.id===task.groupId);
      $('concepts-answer-help').textContent=group.explanation;
      exposeConceptGroup(task.groupId);
      drawConceptOptions();$('concepts-prompt').focus({preventScroll:true});return;
    }
    finishConcept(result.outcome,result.step==='complete');
  }
  function finishConcept(outcome,correct=false){
    const round=conceptMap?.round,task=conceptTask();
    if(round?.stage!=='question')return;
    round.stage='feedback';
    const now=Date.now(),before=history.conceptProgress;
    noteJourneyOutcome('concept',{outcome});
    history.conceptProgress=Concepts.record(before,conceptCatalog.tasks,task.id,outcome,now);
    if(history.conceptProgress!==before)observePracticeFeedback('concept:'+task.id,outcome,now);
    saveHistory();
    $('concepts-question').hidden=true;$('concepts-feedback').hidden=false;
    $('concepts-feedback-title').textContent=correct?'🌟 Du hittade sambandet!':'💡 Så hör orden ihop';
    $('concepts-correct').textContent=task.options.find(option=>option.correct).label;
    $('concepts-why').textContent=task.why;
    $('concepts-explanation').textContent=conceptCatalog.groups.find(group=>group.id===task.groupId).explanation;
    exposeConceptGroup(task.groupId);
    $('concepts-next').textContent=round.index+1===round.items.length?'Klar med rundan →':'Nästa samband →';
    $('concepts-feedback-title').focus({preventScroll:true});scrollTop();
  }
  function advanceConcept(){
    const round=conceptMap?.round;
    if(round?.stage!=='feedback')return;
    if(round.index+1<round.items.length){round.index++;renderConceptQuestion();return;}
    round.stage='finished';
    $('concepts-feedback').hidden=true;$('concepts-finished').hidden=false;
    $('concepts-finished-title').focus({preventScroll:true});scrollTop();
    if(journey)renderJourneyBanner();
  }
  function leaveConceptMap(){
    if(journey){goNav('learning');return;}
    const id=conceptMap?.returnId;
    if(!id){goNav('learning');return;}
    const item=learningCatalog.find(row=>row.id===id);
    learningFilter='all';learningLimit=18;$('learning-kind').value='all';$('learning-search').value=item.name;
    goNav('learning');
    const button=$('learning-list').querySelector('[data-learning-open="'+id+'"]');
    if(button){button.click();button.focus({preventScroll:true});}
  }
  function getDetectorPlan(id=null,random=()=>.37){
    const known=new Set(learningCatalog.filter(item=>Recall.eligible(item,history)||
      history.recallProgress[item.id]).map(item=>item.id));
    return Detector.plan(detectorCatalog,history.detectorProgress,known,Date.now(),random,id,history.detectorLevels);
  }
  function renderDetectorPreview(){
    const plan=getDetectorPlan();
    for(const location of ['home','learning']){
      $('detector-'+location).hidden=!plan.ready&&!plan.waiting;
      $('detector-'+location+'-note').textContent=plan.round.length?
        'Läs en berättelse och leta efter ledtråden som avslöjar vilket ord som passar.':
        'Bra letat! Du kan prova fler ledtrådar en annan dag.';
      const button=$('detector-'+location+'-start');
      button.hidden=!plan.round.length;
      button.textContent='🔎 Prova '+plan.round.length+(plan.round.length===1?' berättelse →':' berättelser →');
    }
  }
  function startDetector(id=null){
    const plan=getDetectorPlan(id,Math.random);
    if(!plan.round.length){renderDetectorPreview();if(screen==='learning')renderLearning();return;}
    detectorRound={items:plan.round,index:0,stage:'read',returnId:id};
    show('detector');renderDetector();
  }
  function detectorTask(){return detectorRound?.items[detectorRound.index];}
  function renderDetector(){
    const round=detectorRound,task=detectorTask();
    round.stage='read';round.attempts=0;round.helped=false;round.word=null;round.selected=[];
    $('detector-level').textContent=Detector.LABELS[task.level||1];
    $('detector-think').hidden=task.level!==3;
    $('detector-think').textContent=task.level===3?task.question+' Tänk eller säg vad du tror innan du visar orden.':'';
    $('detector-clue-check').hidden=true;
    $('detector-progress').textContent='Berättelse '+(round.index+1)+' av '+round.items.length;
    $('detector-story').hidden=false;
    $('detector-story-title').textContent=task.title;
    $('detector-story-text').textContent=task.text;
    $('detector-read').hidden=false;
    $('detector-word-stage').hidden=true;
    $('detector-clue-stage').hidden=true;
    $('detector-feedback').hidden=true;
    $('detector-finished').hidden=true;
    $('detector-word-options').replaceChildren();
    $('detector-clue-options').replaceChildren();
    $('detector-clue-note').textContent='';
    $('detector-help-text').hidden=true;
    $('detector-story-title').focus({preventScroll:true});scrollTop();
  }
  function revealDetectorWord(){
    if(detectorRound?.stage!=='read')return;
    detectorRound.stage='word';$('detector-read').hidden=true;$('detector-word-stage').hidden=false;
    const box=$('detector-word-options');
    $('detector-word-title').textContent=detectorTask().question||'Vilket ord passar bäst?';
    for(const option of Detector.shuffle(detectorTask().words)){
      const button=element('button','reading-option',option.label);
      button.type='button';button.dataset.detectorWord=option.id;box.append(button);
    }
    $('detector-word-title').focus({preventScroll:true});
  }
  function answerDetectorWord(id){
    const round=detectorRound,task=detectorTask();
    if(round?.stage!=='word'||!task.words.some(option=>option.id===id))return;
    round.word=round.returnId?'previewed':id===task.target?'right':'helped';
    round.stage='clue';
    $('detector-word-stage').hidden=true;
    $('detector-clue-stage').hidden=false;
    $('detector-clue-title').textContent=task.required===2?'Vilka två textbitar stödjer slutsatsen ”'+task.word+'”?':
      'Var i texten märker du att ordet ”'+task.word+'” passar?';
    $('detector-clue-note').textContent=(id===task.target?'Du hittade ordet! ':'Vi letar efter '+task.word.toLocaleLowerCase('sv-SE')+' här. ')+
      (task.required===2?'Välj två ledtrådar som tillsammans stödjer slutsatsen.':'Välj den textbit som bäst hjälper dig att förstå ordet.');
    $('detector-help').hidden=false;
    $('detector-help-text').textContent=task.definition+(task.hint?' '+task.hint:'');
    $('detector-clue-check').hidden=task.required!==2;
    drawDetectorQuotes();
    $('detector-clue-title').focus({preventScroll:true});scrollTop();
  }
  function drawDetectorQuotes(){
    const box=$('detector-clue-options'),task=detectorTask();box.replaceChildren();
    detectorRound.selected=[];
    for(const quote of Detector.shuffle(task.quotes)){
      const button=element('button','reading-option','”'+quote.label+'”');
      button.type='button';button.dataset.detectorQuote=String(task.quotes.indexOf(quote));
      if(task.required===2)button.setAttribute('aria-pressed','false');
      box.append(button);
    }
    if(task.required===2)$('detector-clue-check').disabled=true;
  }
  function detectorHelp(){
    if(detectorRound?.stage!=='clue')return;
    detectorRound.helped=true;
    $('detector-help-text').hidden=false;
    $('detector-help').hidden=true;
    $('detector-help-text').focus({preventScroll:true});
  }
  function answerDetectorQuote(index){
    const round=detectorRound,task=detectorTask();
    if(round?.stage!=='clue'||!Number.isInteger(index)||!task.quotes[index])return;
    if(task.required===2){
      if(round.selected.includes(index))round.selected=round.selected.filter(value=>value!==index);
      else if(round.selected.length<2)round.selected.push(index);
      for(const button of $('detector-clue-options').querySelectorAll('button')){
        button.setAttribute('aria-pressed',String(round.selected.includes(Number(button.dataset.detectorQuote))));
      }
      $('detector-clue-check').disabled=round.selected.length!==2;
      return;
    }
    checkDetectorQuotes([index]);
  }
  function checkDetectorQuotes(selected=detectorRound?.selected){
    const round=detectorRound,task=detectorTask();
    if(round?.stage!=='clue')return;
    const step=Detector.evaluateQuotes(task,selected,round.attempts);
    if(!step)return;
    round.attempts++;
    if(step==='reread'){
      round.helped=true;
      $('detector-clue-note').textContent=task.required===2?'Läs igen och fundera på vilka två delar som hör ihop.':'Läs gärna berättelsen igen. Vilken del beskriver själva betydelsen?';
      detectorHelp();drawDetectorQuotes();return;
    }
    finishDetectorStory(step==='complete'&&!round.helped?'right':'supported');
  }
  function finishDetectorStory(clue){
    const round=detectorRound,task=detectorTask();
    if(round?.stage!=='clue')return;
    round.stage='feedback';
    const now=Date.now(),before=history.detectorProgress;
    noteJourneyOutcome('detector',{word:round.word,clue});
    const oldLevel=Detector.levelFor(detectorCatalog,history.detectorLevels,task.pairId);
    history.detectorProgress=Detector.record(before,detectorCatalog,task.id,{word:round.word,clue},now);
    if(history.detectorProgress!==before)history.detectorLevels=Detector.recordLevel(
      history.detectorLevels,detectorCatalog,history.detectorProgress,task.id,now);
    const newLevel=Detector.levelFor(detectorCatalog,history.detectorLevels,task.pairId);
    $('detector-level-note').textContent=newLevel>oldLevel?'Nästa gång får du en ny sorts ledtrådsuppgift!':
      newLevel<oldLevel?'Nästa gång börjar vi med lite tydligare ledtrådar.':'';
    $('detector-level-note').hidden=newLevel===oldLevel;
    saveHistory();
    $('detector-clue-stage').hidden=true;
    $('detector-feedback').hidden=false;
    $('detector-feedback-title').textContent=task.required===2?(clue==='right'?'🌟 Du hittade båda ledtrådarna!':'💡 Här är ledtrådarna vi letade efter'):
      (clue==='right'?'🌟 Du hittade ledtråden!':'💡 Här är ledtråden vi letade efter');
    $('detector-feedback-word').textContent=task.word+' – '+task.definition;
    const evidence=task.quotes.filter(quote=>quote.correct).map(quote=>quote.label);
    $('detector-evidence').textContent=evidence.map(quote=>'”'+quote+'”').join(' + ');
    // Highlight all literal evidence spans only after completing the task.
    const story=$('detector-story-text');story.replaceChildren();
    let offset=0;
    for(const quote of evidence.slice().sort((a,b)=>task.text.indexOf(a)-task.text.indexOf(b))){
      const start=task.text.indexOf(quote);
      story.append(document.createTextNode(task.text.slice(offset,start)),element('mark','detector-highlight',quote));
      offset=start+quote.length;
    }
    story.append(document.createTextNode(task.text.slice(offset)));
    $('detector-why').textContent=task.why;
    $('detector-next').textContent=round.index+1===round.items.length?'Klar med rundan →':'Nästa berättelse →';
    $('detector-feedback-title').focus({preventScroll:true});scrollTop();
  }
  function advanceDetector(){
    const round=detectorRound;
    if(round?.stage!=='feedback')return;
    if(round.index+1<round.items.length){round.index++;renderDetector();return;}
    round.stage='finished';
    $('detector-story').hidden=true;$('detector-feedback').hidden=true;
    $('detector-finished').hidden=false;$('detector-progress').textContent='Rundan är klar!';
    $('detector-finished-title').focus({preventScroll:true});scrollTop();
    if(journey)renderJourneyBanner();
  }
  function leaveDetector(){
    if(journey){goNav('learning');return;}
    const id=detectorRound?.returnId;
    if(!id){goNav('learning');return;}
    const item=learningCatalog.find(row=>row.id===id);
    learningFilter='all';learningLimit=18;$('learning-kind').value='all';$('learning-search').value=item.name;
    goNav('learning');
    const button=$('learning-list').querySelector('[data-learning-open="'+id+'"]');
    if(button){button.click();button.focus({preventScroll:true});}
  }
  function startWorkshop(id=null){
    const item=id?learningCatalog.find(row=>row.id===id):
      Workshop.pick(learningCatalog,contrasts,history,Recall.eligible,Math.random);
    const plan=Workshop.plan(item,learningCatalog,contrasts,Math.random);
    if(!plan)return;
    workshop={...plan,index:0,selected:[],stage:'task',returnId:id};
    show('workshop');renderWorkshop();
  }
  function workshopTask(){return workshop?.steps[workshop.index];}
  function renderWorkshop(){
    const step=workshopTask();
    workshop.stage='task';workshop.selected=[];
    $('workshop-progress').textContent='Uppgift '+(workshop.index+1)+' av '+workshop.steps.length;
    for(const type of ['build','repair','reflect'])$('workshop-'+type).hidden=step.type!==type;
    $('workshop-feedback').hidden=true;
    $('workshop-finished').hidden=true;
    $('workshop-reflection').value='';
    $('workshop-reflection-example').hidden=true;
    $('workshop-reflection-show').hidden=false;
    if(step.type==='build'){
      $('workshop-build-word').textContent=workshop.item.name;
      $('workshop-build-meaning').textContent=workshop.item.definition;
      $('workshop-build-example').hidden=true;
      $('workshop-build-example').textContent=step.original;
      $('workshop-build-show').hidden=false;
      drawWorkshopPieces();
    }else if(step.type==='repair'){
      $('workshop-repair-label').textContent='Båda berättelserna fick ordet ”'+step.given+'”. Vilken behöver ett annat ord?';
      const box=$('workshop-repair-choices');box.replaceChildren();
      step.scenes.forEach((scene,index)=>{
        const button=element('button','reading-option workshop-story');button.type='button';button.dataset.workshopScene=String(index);
        button.append(element('strong','',scene.title),element('span','',scene.text));
        box.append(button);
      });
    }else{
      $('workshop-reflect-word').textContent=workshop.item.name;
      $('workshop-reflect-meaning').textContent=workshop.item.definition;
      $('workshop-reflection-example').textContent=workshop.item.example;
    }
    $('workshop-'+step.type+'-title').focus({preventScroll:true});scrollTop();
  }
  function drawWorkshopPieces(){
    const step=workshopTask(),selected=workshop.selected;
    const result=Workshop.built(step,selected);
    if(!result)return;
    const box=$('workshop-pieces');box.replaceChildren();
    for(const piece of step.pieces){
      const button=element('button','secondary-button workshop-piece',piece.label);
      button.type='button';button.dataset.workshopPiece=String(piece.id);
      button.disabled=selected.includes(piece.id);
      box.append(button);
    }
    $('workshop-built').textContent=result.sentence||'Välj en del att börja med.';
    $('workshop-build-check').disabled=!result.complete;
    $('workshop-build-undo').disabled=!selected.length;
    $('workshop-build-reset').disabled=!selected.length;
  }
  function showWorkshopFeedback(title,paragraphs){
    if(!workshop||workshop.stage!=='task')return;
    workshop.stage='feedback';
    $('workshop-'+workshopTask().type).hidden=true;
    $('workshop-feedback-title').textContent=title;
    const box=$('workshop-feedback-body');box.replaceChildren();
    for(const value of paragraphs)box.append(element('p','',value));
    $('workshop-feedback').hidden=false;
    $('workshop-feedback-title').focus({preventScroll:true});scrollTop();
  }
  function checkWorkshopBuild(){
    if(workshop?.stage!=='task'||workshopTask()?.type!=='build')return;
    const step=workshopTask(),result=Workshop.built(step,workshop.selected);
    if(!result?.complete)return;
    showWorkshopFeedback(result.same?'🌟 Du byggde vår exempelmening!':'📖 Jämför med vår exempelmening',[
      'Din mening: '+result.sentence,'Vår exempelmening: '+step.original,
      result.same?'Fundera på varför ordet passar här.':'Din ordning kan också fungera. Läs båda meningarna och fundera på vad som låter bra.'
    ]);
  }
  function answerWorkshopRepair(index){
    if(workshop?.stage!=='task'||workshopTask()?.type!=='repair')return;
    const step=workshopTask(),selected=step.scenes[index];
    if(!selected)return;
    const fixed=step.scenes.find(scene=>scene.needsRepair);
    showWorkshopFeedback(selected.needsRepair?'🌟 Du hittade berättelsen!':'💡 Titta på skillnaden',[
      'Här behöver vi byta ord: '+fixed.title+'.',
      ...step.scenes.map(scene=>scene.title+' – '+scene.word+'. '+scene.why+' '+scene.difference)
    ]);
  }
  function advanceWorkshop(){
    if(!workshop||workshop.stage!=='feedback')return;
    if(workshop.index+1>=workshop.steps.length)return;
    workshop.index++;renderWorkshop();
  }
  function finishWorkshop(){
    if(workshop?.stage!=='task'||workshopTask()?.type!=='reflect')return;
    // Never inspect or persist the child's free sentence.
    $('workshop-reflection').value='';
    workshop.stage='finished';
    noteJourneyOutcome('workshop',{});
    $('workshop-reflect').hidden=true;
    $('workshop-finished').hidden=false;
    $('workshop-progress').textContent='Verkstaden är klar!';
    $('workshop-finished-title').focus({preventScroll:true});scrollTop();
    if(journey)renderJourneyBanner();
  }
  function leaveWorkshop(){
    if(journey){goNav('learning');return;}
    const id=workshop?.returnId;
    if(!id){goNav('learning');return;}
    const item=learningCatalog.find(row=>row.id===id);
    learningFilter='all';learningLimit=18;
    $('learning-kind').value='all';$('learning-search').value=item.name;
    goNav('learning');
    const button=$('learning-list').querySelector('[data-learning-open="'+id+'"]');
    if(button){button.click();button.focus({preventScroll:true});}
  }
  function getRecallPlan(){return Recall.plan(learningCatalog,history);}
  function renderRecallPreview(){
    const plan=getRecallPlan();
    for(const location of ['home','learning']){
      $('recall-'+location).hidden=!plan.ready.length&&!plan.waiting.length;
      $('recall-'+location+'-note').textContent=plan.ready.length?
        'Prova att skriva ord som du har mött tidigare. Du får hjälp när du vill.':
        'Bra övat! '+(plan.waiting.length?Memory.note(plan.waiting[0].dueAt):'Orden får vila.');
      const button=$('recall-'+location+'-start');
      button.hidden=!plan.round.length;
      button.textContent='🔤 Hitta '+plan.round.length+(plan.round.length===1?' ord eller uttryck själv →':' ord och uttryck själv →');
    }
  }
  function startRecall(id=null){
    const item=id?learningCatalog.find(row=>row.id===id):null;
    const card=item&&history.recallProgress[id];
    const question=Recall.task(item);
    // The named card exposes the answer. Treat a direct launch as practice,
    // not independent retrieval, and still respect the spacing interval.
    const items=id?(question&&Recall.dueAt(card)<=Date.now()?[{...question,stage:card?.stage??1}]:[]):getRecallPlan().round;
    if(!items.length){renderRecallPreview();if(screen==='learning')renderLearning();return;}
    recallRound={items,index:0,stage:'answer',helped:!!id,previewed:!!id,returnId:id};
    show('recall');renderRecall();
  }
  function renderRecall(){
    const round=recallRound,row=round.items[round.index];
    const prompt=Recall.prompt(row,row.stage);
    round.stage='answer';round.helped=round.previewed||row.stage===0;round.misses=0;
    $('recall-progress').textContent='Ord eller uttryck '+(round.index+1)+' av '+round.items.length;
    $('recall-definition').textContent=prompt.definition;
    $('recall-cloze').hidden=!prompt.cloze;
    $('recall-cloze').textContent=prompt.cloze;
    $('recall-letter-hint').textContent=prompt.letters;
    $('recall-letter-hint').hidden=!prompt.letters;
    $('recall-hint').hidden=!!prompt.letters;
    $('recall-hint').textContent=row.kind==='expression'?'💡 Visa första bokstäverna':'💡 Visa första bokstaven';
    $('recall-response').textContent='';
    $('recall-answer').value='';
    $('recall-form').hidden=false;
    $('recall-feedback').hidden=true;
    $('recall-finished').hidden=true;
    $('recall-prompt').focus({preventScroll:true});scrollTop();
  }
  function giveRecallHint(){
    const round=recallRound;
    if(!round||round.stage!=='answer')return;
    round.helped=true;
    $('recall-letter-hint').textContent=Recall.letters(round.items[round.index]);
    $('recall-letter-hint').hidden=false;
    $('recall-hint').hidden=true;
    $('recall-answer').focus({preventScroll:true});
  }
  function completeRecall(matched){
    const round=recallRound;
    if(!round||round.stage!=='answer')return;
    const row=round.items[round.index];
    const now=Date.now(),before=history.recallProgress;
    noteJourneyOutcome('recall',{stage:row.stage,matched,helped:round.helped,previewed:round.previewed,misses:round.misses});
    history.recallProgress=Recall.record(before,learningCatalog,row.id,
      {stage:row.stage,matched,helped:round.helped,previewed:round.previewed},now);
    if(history.recallProgress!==before){
      const outcome=history.recallProgress[row.id]?.memory?.outcome;
      if(outcome)observePracticeFeedback('recall:'+row.id,outcome,now);
    }
    round.stage='feedback';
    $('recall-answer').value='';
    saveHistory();
    $('recall-form').hidden=true;
    $('recall-feedback').hidden=false;
    $('recall-feedback-title').textContent=matched?'🌟 Du hittade rätt!':'📖 Här är svaret vi tänkte på';
    $('recall-solution').textContent=row.answer;
    const item=learningCatalog.find(item=>item.id===row.id);
    $('recall-explanation').textContent=item.definition;
    $('recall-example').textContent=item.example;
    $('recall-memory-note').textContent=Memory.note(Recall.dueAt(history.recallProgress[row.id]));
    $('recall-next').textContent=round.index+1===round.items.length?'Klar med rundan →':'Nästa ord →';
    $('recall-feedback-title').focus({preventScroll:true});scrollTop();
  }
  function submitRecall(){
    const round=recallRound;
    if(!round||round.stage!=='answer')return;
    const value=$('recall-answer').value;
    if(!Recall.normalize(value)){$('recall-response').textContent='Skriv ett ord, eller välj en ledtråd.';return;}
    if(Recall.match(round.items[round.index],value)){completeRecall(true);return;}
    // Another word could also fit, or spelling may be difficult. Never
    // label this as an incorrect meaning or save the attempted text.
    round.helped=true;round.misses++;
    $('recall-response').textContent='Inte samma ord som vi tänker på. Andra ord kan också passa. Prova igen, be om en ledtråd eller visa ordet.';
    if(round.misses>=2)giveRecallHint();
    $('recall-answer').focus({preventScroll:true});
  }
  function advanceRecall(){
    const round=recallRound;
    if(!round||round.stage!=='feedback')return;
    if(round.index+1<round.items.length){round.index++;renderRecall();return;}
    round.stage='finished';
    $('recall-progress').textContent='Rundan är klar!';
    $('recall-feedback').hidden=true;
    $('recall-finished').hidden=false;
    $('recall-finished-title').focus({preventScroll:true});scrollTop();
    if(journey)renderJourneyBanner();
  }
  function leaveRecall(){
    if(journey){goNav('learning');return;}
    const id=recallRound?.returnId;
    if(!id){goNav('learning');return;}
    learningFilter='all';learningLimit=18;$('learning-kind').value='all';
    $('learning-search').value=learningCatalog.find(item=>item.id===id).name;
    goNav('learning');
    const button=$('learning-list').querySelector('[data-learning-open="'+id+'"]');
    if(button){button.click();button.focus({preventScroll:true});}
  }
  function learningEntries(plan=getAhaPlan()){
    const ready=new Set(plan.ready.map(row=>row.id)),waiting=new Set(plan.waiting.map(row=>row.id));
    return L.entries(learningCatalog,history.skillProgress,history.reviewProgress,
      history.missionProgress,history.mistakes).map(item=>{
      const observed=history.readingProgress[item.id];
      const recall=history.recallProgress[item.id];
      const detector=Detector.summary(detectorCatalog,history.detectorProgress,item.id,Date.now(),history.detectorLevels);
      const related=Concepts.summary(conceptCatalog.tasks.filter(task=>task.answer===item.id),history.conceptProgress);
      const bridge=Concepts.summary(bridgeCatalog.tasks.filter(task=>task.cards.includes(item.id)),history.bridgeProgress);
      const hasAha=!!(observed?.recognition||observed?.transfer);
      if(!bridge.seen&&!related.seen&&!detector.seen&&!recall&&!hasAha&&!ready.has(item.id)&&!waiting.has(item.id))return item;
      // Aha is evidence of an encounter, not mastery of a skill.
      const steps=item.steps.map((step,index)=>index===0?{...step,done:true}:step);
      return {...item,seen:true,steps,done:steps.filter(step=>step.done).length,
        recognition:item.recognition||observed?.recognition?.first>0,
        application:item.application||observed?.transfer?.first>0,
        revisit:item.revisit||(observed?.transfer?.quality===2&&observed.transfer.proofs?.length===2),
        needsPractice:item.needsPractice||B.needsReview(history.readingProgress,item.id,'transfer')||
          B.needsReview(history.readingProgress,item.id,'recognition')||
          (recall?.last==='assisted'&&recall.memory?.outcome!=='previewed'&&Recall.dueAt(recall)<=Date.now())||detector.needsPractice||related.needsPractice||bridge.needsPractice,
        tip:ready.has(item.id)?'Prova en ny berättelse i din Aha-runda.':
          waiting.has(item.id)?'En ny berättelse väntar till en annan dag.':item.tip};
    });
  }
  function startAhaRound(id=null){
    const row=id?ahaOption(learningCatalog.find(item=>item.id===id),Math.random):null;
    const items=id?(row&&row.dueAt<=Date.now()?[row]:[]):getAhaPlan(Math.random).round;
    if(!items.length){renderAhaPreview();if(screen==='learning')renderLearning();return;}
    ahaRound={items,index:0,attempts:0,stage:'read',completed:0,returnId:id};
    show('aha');renderAhaStep();
  }
  function leaveAhaRound(){
    if(journey){goNav('learning');return;}
    const id=ahaRound?.returnId;
    if(!id){goNav('learning');return;}
    const item=learningCatalog.find(row=>row.id===id);
    learningFilter='all';learningLimit=18;
    $('learning-kind').value='all';$('learning-search').value=item.name;
    goNav('learning');
    const button=$('learning-list').querySelector('[data-learning-open="'+id+'"]');
    if(button){button.click();button.focus({preventScroll:true});}
  }
  function renderAhaStep(message=''){
    const row=ahaRound.items[ahaRound.index];
    ahaRound.stage='read';
    $('aha-round-progress').textContent='Berättelse '+(ahaRound.index+1)+' av '+ahaRound.items.length;
    $('aha-round-word').textContent=row.word;
    $('aha-round-definition').textContent=row.definition;
    $('aha-round-read-note').textContent=message||'Läs vad ordet eller uttrycket betyder.';
    $('aha-round-read').hidden=false;
    $('aha-round-question').hidden=true;
    $('aha-round-feedback').hidden=true;
    $('aha-round-finished').hidden=true;
    $('aha-round-word').focus({preventScroll:true});scrollTop();
  }
  function revealAhaQuestion(){
    if(!ahaRound||ahaRound.stage!=='read')return;
    ahaRound.stage='question';
    const {check}=ahaRound.items[ahaRound.index];
    $('aha-round-read').hidden=true;
    $('aha-round-question').hidden=false;
    const row=ahaRound.items[ahaRound.index];
    $('aha-round-prompt').textContent='Vilken berättelse passar '+(row.kind==='expression'?'uttrycket':'ordet')+' ”'+row.word+'”?';
    const options=$('aha-round-options');options.replaceChildren();
    check.options.forEach((option,index)=>{
      const button=element('button','reading-option',option.label);
      button.type='button';button.dataset.ahaOption=String(index);options.append(button);
    });
    $('aha-round-prompt').focus({preventScroll:true});scrollTop();
  }
  function answerAhaRound(index){
    if(!ahaRound||ahaRound.stage!=='question')return;
    const row=ahaRound.items[ahaRound.index];
    const result=AhaPlan.answer(row.check,index,ahaRound.attempts,B);
    if(!result)return;
    ahaRound.attempts=result.attempts;
    if(result.step==='reread'){
      row.check.options.push(row.check.options.shift());
      renderAhaStep('Det var klurigt! Läs betydelsen igen. Du får ett nytt försök.');
      return;
    }
    // Save completed checkpoints exactly once, without normal quiz scores.
    ahaRound.stage='feedback';ahaRound.completed++;
    noteJourneyOutcome('aha',{outcome:result.outcome});
    recordAhaWithFeedback(row.id,row.check.source,result.outcome,row.check.evidence);
    saveHistory();
    $('aha-round-question').hidden=true;
    $('aha-round-feedback').hidden=false;
    $('aha-round-feedback-title').textContent=result.step==='guided'?'📖 Vi lär oss tillsammans!':'🌟 Du hittade rätt berättelse!';
    $('aha-round-correct').textContent=row.check.options.find(option=>option.correct).label;
    $('aha-round-why').textContent=row.check.why||'Jämför berättelsen med betydelsen du läste.';
    $('aha-memory-note').textContent=Memory.note(B.transferDueAt(history.readingProgress[row.id]?.transfer));
    $('aha-round-next').textContent=ahaRound.index+1===ahaRound.items.length?'Klar med rundan →':'Nästa berättelse →';
    $('aha-round-feedback-title').focus({preventScroll:true});scrollTop();
  }
  function advanceAhaRound(){
    if(!ahaRound||ahaRound.stage!=='feedback')return;
    if(ahaRound.index+1<ahaRound.items.length){
      ahaRound.index++;ahaRound.attempts=0;renderAhaStep();return;
    }
    ahaRound.stage='finished';
    $('aha-round-feedback').hidden=true;
    $('aha-round-finished').hidden=false;
    $('aha-round-progress').textContent='Rundan är klar!';
    $('aha-round-summary').textContent=ahaRound.completed===1?'Du har provat en berättelse på nytt.':
      'Du har provat '+ahaRound.completed+' berättelser på nytt.';
    $('aha-round-finished-title').focus({preventScroll:true});scrollTop();
    if(journey)renderJourneyBanner();
  }
  // A gentle, optional compass: only observed wrong alternatives from the
  // two-answer comparison exercise can create these suggestions.
  function renderConfusionPreview(){
    const top=H.recommendations(contrastHistoryData,history.confusionProgress,3);
    const box=$('confusion-home'),list=$('confusion-list');
    box.hidden=top.length===0;
    list.replaceChildren();
    if(!top.length)return;
    const total=H.summary(contrastHistoryData,history.confusionProgress);
    $('confusion-summary').textContent=total.recurring
      ? `${total.recurring} ${total.recurring===1?'ordpar kan vara extra roligt att jämföra':'ordpar kan vara extra roliga att jämföra'} just nu.`
      : 'Här finns ett ordpar som är värt en ny upptäckt.';
    const names=new Map(bank.words.map(entry=>[entry.id,entry.word]));
    for(const insight of top){
      const pair=insight.pair;
      const card=element('article','confusion-card');
      card.append(element('h3','',`${names.get(pair.left)} eller ${names.get(pair.right)}?`));
      card.append(element('p','',insight.recurring
        ? 'De här två orden har varit kluriga flera gånger. Vill du se skillnaden i fyra berättelser?'
        : 'Det här ordparet kan du utforska igen i fyra korta berättelser.'));
      const area=insight.nextContexts?.[0];
      if(area)card.append(element('p','confusion-context-tip',`🌍 Nästa gång kan du jämföra i en annan miljö, till exempel ${K.CONTEXTS[area].toLocaleLowerCase('sv-SE')}.`));
      const button=element('button','secondary-button',`⚖️ Jämför orden →`);
      button.type='button';button.dataset.confusionPair=pair.id;
      card.append(button);list.append(card);
    }
  }
  function renderRetentionHome(){
    const state=U.summary(contrastHistoryData,history.retentionProgress);
    const container=$('retention-home');
    container.hidden=state.started===0;
    $('retention-started').textContent=String(state.started);
    $('retention-ready').textContent=String(state.ready);
    $('retention-later').textContent=String(state.waiting);
    const names=new Map(bank.words.map(entry=>[entry.id,entry.word]));
    const list=$('retention-home-list');list.replaceChildren();
    if(state.ready){
      $('retention-home-note').textContent='✨ Det finns nya berättelser att upptäcka. Spela när du har lust!';
    }else if(state.waiting){
      $('retention-home-note').textContent='🌱 Bra övat! Det finns inga återbesök som väntar just nu. '+
        U.note(state.waitingPairs[0].card);
    }else $('retention-home-note').textContent='Prova en jämförelse för att börja en ny minnesstig.';
    for(const row of state.readyPairs.slice(0,3)){
      const item=element('article','retention-item');
      item.append(element('h3','',`⚖️ ${names.get(row.pair.left)} eller ${names.get(row.pair.right)}?`),
        element('p','','Du har provat de här orden tidigare. Känner du igen dem i nya situationer?'));
      const button=element('button','secondary-button',`🎁 Prova ett återbesök →`);
      button.type='button';button.dataset.retentionPair=row.pair.id;item.append(button);list.append(item);
    }
  }
  function renderMemoryPreview(aha=getAhaPlan()){
    const recall=getRecallPlan(),now=Date.now();
    const rows=[
      ...aha.ready,...aha.waiting,
      ...recall.ready.filter(row=>row.card),...recall.waiting.filter(row=>row.card)
    ];
    const ready=rows.filter(row=>row.dueAt<=now).length;
    const waiting=rows.filter(row=>row.dueAt>now);
    const next=waiting.length?Math.min(...waiting.map(row=>row.dueAt)):0;
    for(const location of ['home','learning']){
      $('memory-'+location).hidden=!rows.length;
      $('memory-'+location+'-note').textContent=
        ready+' återbesök redo · '+waiting.length+' övningar vilar.'+(next?' '+Memory.note(next,now):'');
    }
  }
  function renderStoryOptions(location){
    const host=$('story-'+location);
    const story=Story.model(history.storyProgress,settings.adventure);
    const world=A.world(story.id),chapter=story.chapter;
    host.replaceChildren();
    const heading=element('div','story-heading');
    const icon=element('span','story-world-icon',world.emoji);icon.setAttribute('aria-hidden','true');
    const copy=element('div','story-heading-copy');
    copy.append(element('p','eyebrow',world.title+' · '+story.count+' av '+story.total+' platser'),
      element('h2','',story.complete?'Hela världen utforskad!':chapter.title));
    heading.append(icon,copy);host.append(heading);
    host.append(element('p','story-intro',story.complete?
      'Du har alla fyra minnesmärken här. Utforska världen igen eller välj en annan plats.':chapter.intro));
    const path=element('ol','story-world-path');path.setAttribute('aria-label','Platser i '+world.title);
    for(const item of story.chapters){
      const tile=element('li','story-place');tile.dataset.state=item.visited?'visited':item.index===story.count?'next':'ahead';
      const place=world.stops[item.index];
      const mark=element('span','story-place-icon',item.visited?item.emoji:place.emoji);mark.setAttribute('aria-hidden','true');
      tile.append(mark,element('strong','',place.name),element('small','',item.visited?'✓ '+item.keepsake:item.index===story.count?'Nästa plats':'En annan plats'));
      path.append(tile);
    }
    host.append(path);
    if(location==='home'||location==='learning'){
      const album=element('details','story-album');
      album.append(element('summary','','🎒 Din upptäckarbok · '+story.collected+' minnesmärken'));
      const collected=element('div','story-album-grid');
      for(const id of A.WORLD_IDS){
        const visited=Story.model(history.storyProgress,id).chapters.filter(chapter=>chapter.visited);
        if(!visited.length)continue;
        const card=element('section','story-album-world');
        card.append(element('strong','',A.world(id).emoji+' '+A.world(id).title));
        const marks=element('ul','story-album-marks');
        for(const chapter of visited)marks.append(element('li','',chapter.emoji+' '+chapter.keepsake));
        card.append(marks);collected.append(card);
      }
      if(!story.collected)collected.append(element('p','muted','Här får dina upptäckter plats när du har utforskat en berättelse.'));
      album.append(collected);host.append(album);
      return;
    }
    let openings=[];
    const now=Date.now();
    const plan=getJourneyPlan(now,()=>.37,getKnowledgeProfile(now),{onOpenings:rows=>{openings=rows;}});
    host.append(element('h3','story-choice-heading',plan.steps.length?'Välj nästa lilla uppdrag':'Vi tar en paus'));
    if(plan.steps.length){
      const choices=element('div','story-quest-options');
      for(const [i,row] of openings.entries()){
        const meta=Journey.MODES[row.mode],button=element('button','story-quest-option');
        button.type='button';button.dataset.storyMode=row.mode;
        button.append(element('span','story-quest-icon',meta.icon),element('strong','',meta.label+' →'),
          element('small','',i===0?'Spelets förslag · kort äventyr':'Börja på ett annat sätt'));
        choices.append(button);
      }
      host.append(choices);
    }else host.append(element('p','muted','Inga lämpliga stationer är redo just nu. Dina upptäckter finns kvar.'));
    const switcher=element('div','story-world-picker');
    const prompt=element('label','','Välj äventyrsvärld');prompt.htmlFor='story-world-'+location;
    const select=element('select','field');select.id=prompt.htmlFor;select.dataset.storyWorld=location;
    for(const id of A.WORLD_IDS){
      const w=A.world(id),option=element('option','',w.emoji+' '+w.title);
      option.value=id;option.selected=id===story.id;select.append(option);
    }
    switcher.append(prompt,select);host.append(switcher);
    const stop=element('button','secondary-button full-button','Klar för nu – till min ordstig');
    stop.type='button';stop.dataset.storyStop='true';
    host.append(stop,element('p','story-small','Dina upptäckter finns kvar. Du kan komma tillbaka när du vill.'));
  }
  function renderKnowledgePreview(knowledge=getKnowledgeProfile()){
    // A deterministic example preview, not a promise to repeat precisely
    // the same randomly selected questions. Never reveal an answer here.
    const preview=getJourneyPlan(knowledge.now,()=>.37,knowledge);
    renderStoryOptions('home');renderStoryOptions('learning');
    const first=preview.steps[0];
    const note=first?.explanation||Journey.REASONS[first?.reason]||
      'Du kan utforska fler ord i din egen takt.';
    $('knowledge-home-note').textContent=first?'Nästa idé: '+Journey.MODES[first.mode].label.toLocaleLowerCase('sv-SE')+'. '+note:note;
    const list=$('knowledge-next-list');list.replaceChildren();
    for(const step of preview.steps){
      const li=element('li','knowledge-suggestion');
      const meta=Journey.MODES[step.mode];
      li.append(element('strong','',meta.icon+' '+meta.label),
        element('p','',step.explanation||Journey.REASONS[step.reason]));
      list.append(li);
    }
    list.hidden=!preview.steps.length;
    $('knowledge-empty').hidden=!!preview.steps.length;
    renderBalancePreview();
    const progress=Feedback.summary(history.feedbackProgress,feedbackCatalog,knowledge.now);
    $('feedback-learning-summary').hidden=!progress.pending&&!progress.checked;
    $('feedback-learning-note').textContent=(progress.pending?'Vi väntar på '+progress.pending+(progress.pending===1?' återbesök. ':' återbesök. '):'')+
      (progress.checked?progress.checked+' uppföljningar efter annan övning: '+progress.direct+' svar direkt och '+progress.supported+' med stöd. ':'')+
      'Vi provar olika sätt att öva, inte ett betyg.';
  }
  function renderBalancePreview(){
    const mix=Balance.summary(history.practiceBalance);
    $('balance-learning-summary').hidden=!mix.total;
    $('balance-learning-note').textContent=mix.total===1?'Den senaste avslutade stationen i Mitt nästa äventyr.':
      'De senaste '+mix.total+' avslutade stationerna i Mitt nästa äventyr.';
    const list=$('balance-learning-list');list.replaceChildren();
    for(const [key,label] of Object.entries(Balance.LABELS)){
      const row=element('li','balance-mix-row');
      row.append(element('span','',label),element('strong','',String(mix.counts[key])));
      list.append(row);
    }
  }
  function renderWordKnowledge(item,knowledge){
    const notes=Knowledge.notes(knowledge,item.id);
    if(!notes.length)return null;
    const box=element('details','knowledge-word');
    box.append(element('summary','','Fler sätt du kan öva det här ordet'));
    const body=element('div','knowledge-word-body');
    for(const row of notes){
      const section=element('section','knowledge-observation');
      section.append(element('strong','',row.label),element('p','',row.text));
      if(row.dueAt)section.append(element('small','',Memory.note(row.dueAt,knowledge.now)));
      body.append(section);
    }
    box.append(body);return box;
  }
  function renderLearningPreview(){
    renderConfusionPreview();
    renderRetentionHome();
    const plan=renderAhaPreview();
    renderRecallPreview();renderDetectorPreview();renderMemoryPreview(plan);renderKnowledgePreview();
    const all=learningEntries(plan);
    const totals=L.summary(all);
    $('learning-home-seen').textContent=String(totals.discovered);
    $('learning-home-applied').textContent=String(totals.applied);
    // The ready personal Aha round remains the main recommendation. When
    // waiting, suggest an actually available weak ordinary skill instead.
    const candidates=plan.ready.length?[]:all.filter(item=>item.needsPractice).map(item=>{
      const types=F.supported(F.findItem(item.id,bank,expressions),curation,contexts,missions,K,contrasts);
      const next=wordProfile(item,types).next;
      if(next?.state!=='practice'||next.action.kind!=='focus')return null;
      const skill=history.skillProgress[item.id]?.skills?.[next.action.skill];
      return {item,next,wrong:skill?.wrong||0,lastAt:skill?.lastAt||0};
    }).filter(Boolean).sort((a,b)=>b.wrong-a.wrong||a.lastAt-b.lastAt||a.item.id.localeCompare(b.item.id));
    const suggested=candidates[0];
    $('learning-home-focus').hidden=!suggested;
    if(suggested){
      $('learning-home-focus-note').textContent='🎯 '+suggested.item.name+' – '+suggested.next.label.toLocaleLowerCase('sv-SE')+' kan få en ny chans.';
      $('learning-home-focus-start').dataset.focusId=suggested.item.id;
      $('learning-home-focus-start').dataset.focusSkill=suggested.next.action.skill;
    }
    $('learning-finale-message').textContent=totals.discovered
      ? `Du har upptäckt ${totals.discovered} ord och uttryck. ${totals.applied} har du redan provat på fler sätt. Fortsätt i din egen takt!`
      : 'Din ordstig börjar med första ordet du möter. Varje försök räknas!';
  }
  function renderLearning(){
    const plan=renderAhaPreview(),all=learningEntries(plan);
    const knowledge=getKnowledgeProfile();
    renderRecallPreview();renderDetectorPreview();renderMemoryPreview(plan);renderKnowledgePreview(knowledge);
    const totals=L.summary(all);
    $('learning-total-seen').textContent=String(totals.discovered);
    $('learning-total-meaning').textContent=String(totals.recognised);
    $('learning-total-applied').textContent=String(totals.applied);
    $('learning-total-repeat').textContent=String(totals.revisited);
    document.querySelectorAll('[data-learning-status]').forEach(button=>
      button.setAttribute('aria-pressed',String(button.dataset.learningStatus===learningFilter)));
    const matches=L.filter(all,{query:$('learning-search').value,kind:$('learning-kind').value,status:learningFilter});
    const list=$('learning-list');list.replaceChildren();
    const showing=matches.slice(0,learningLimit);
    for(const item of showing){
      const itemForFocus=F.findItem(item.id,bank,expressions);
      const types=F.supported(itemForFocus,curation,contexts,missions,K,contrasts);
      const profile=wordProfile(item,types);
      const next=profile.next;
      const recommended=next?.action.kind==='focus'?next.action.skill:F.recommended(itemForFocus,types,history.skillProgress);
      const mainIsAha=next?.action.kind==='aha';
      const card=element('article','learning-word-card');
      const button=element('button','learning-word-toggle');button.type='button';
      button.dataset.learningOpen=item.id;button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-controls','learning-detail-'+item.id);
      const heading=element('span','learning-word-heading');
      const title=element('strong','',item.name);const kind=element('span','learning-word-tag',item.kind==='expression'?'💬 Uttryck':'🔤 Ord');
      heading.append(title,kind);button.append(heading);
      button.append(element('span','learning-word-subtitle',item.seen?'Din stig växer för varje försök.':'Det här ordet väntar på att upptäckas.'));
      const pebbles=element('span','learning-word-pebbles');
      pebbles.setAttribute('aria-hidden','true');
      for(const facet of profile.facets){
        const pebble=element('span','learning-pebble',facet.icon);
        pebble.dataset.state=facet.state;pebble.dataset.done=String(['right','spaced'].includes(facet.state));pebbles.append(pebble);
      }
      const triedLabel=profile.tried===1?'1 sätt provat':profile.tried+' sätt provade';
      pebbles.append(element('span','learning-word-count',triedLabel+(history.recallProgress[item.id]?' · 🔤 Skrivövning':'')));button.append(pebbles);
      const detail=element('div','learning-word-detail');detail.id='learning-detail-'+item.id;detail.hidden=true;
      detail.append(element('p','learning-definition',item.definition),element('p','learning-example','Exempel: '+item.example));
      detail.append(element('h3','learning-profile-title','Fem sätt att förstå'));
      const track=element('ul','learning-steps learning-profile');track.setAttribute('aria-label','Olika sätt att öva ordförståelse');
      for(const facet of profile.facets){
        const row=element('li');row.dataset.facet=facet.id;row.dataset.state=facet.state;
        row.dataset.done=String(['right','spaced'].includes(facet.state));
        const icon=element('span','learning-stage-icon',facet.icon);icon.setAttribute('aria-hidden','true');
        const text=element('div','learning-profile-text');
        text.append(element('strong','learning-stage-label',facet.label),element('span','learning-stage-state',facet.status));
        if(facet.help&&facet.state!=='unavailable')text.append(element('p','learning-profile-help',facet.help));
        if(facet.id==='transfer'&&facet.state!=='unavailable'&&B.hasMaintenance(history.readingProgress[item.id]?.transfer))
          text.append(element('p','learning-profile-help',Memory.note(B.transferDueAt(history.readingProgress[item.id].transfer))));
        row.append(icon,text);
        const isMain=facet.action&&(mainIsAha?facet.action.kind==='aha':
          facet.action.kind==='focus'&&facet.action.skill===recommended);
        if(facet.action&&!isMain){
          const action=element('button','learning-focus-skill',facet.action.kind==='aha'?'Prova Aha →':'Öva →');
          action.type='button';action.setAttribute('aria-label','Öva '+facet.label);
          if(facet.action.kind==='aha')action.dataset.ahaWord=item.id;
          else{action.dataset.focusId=item.id;action.dataset.focusSkill=facet.action.skill;}
          row.append(action);
        }
        track.append(row);
      }
      detail.append(track);
      const personal=renderWordKnowledge(item,knowledge);if(personal)detail.append(personal);
      const recall=Recall.task(item);
      if(recall){
        const saved=history.recallProgress[item.id],waiting=Recall.dueAt(saved)>Date.now();
        const box=element('section','learning-focus recall-word-card');
        box.append(element('h4','','🔤 Hitta ordet själv'));
        const note=waiting?Memory.note(Recall.dueAt(saved)):
          saved?.memory?.outcome==='previewed'?'Du har läst ordet inför en tidigare skrivövning.':
          saved?.last==='direct'?'Du hittade ordet utan extra ledtrådar senast.':
          saved?'Du har provat med stöd.':'Prova att skriva ordet själv. Du kan alltid få hjälp.';
        box.append(element('p','learning-focus-note',note));
        if(!waiting){
          const button=element('button','secondary-button full-button','Prova att skriva ordet →');
          button.type='button';button.dataset.recallWord=item.id;box.append(button);
          box.append(element('p','learning-focus-note','Här har du redan sett ordet. Det räknas som övning med stöd.'));
        }
        detail.append(box);
      }
      const workshopButton=element('button','secondary-button full-button','🛠️ Öppna ordverkstaden →');
      workshopButton.type='button';workshopButton.dataset.workshopWord=item.id;
      detail.append(workshopButton);
      const relations=Concepts.forWord(conceptCatalog,item.id);
      if(relations.length||bridgeCatalog.tasks.some(task=>task.participants.includes(item.id))){
        const button=element('button','secondary-button full-button','🗺️ Öppna Begreppskartan och Ordbroar →');
        button.type='button';button.dataset.conceptWord=item.id;detail.append(button);
      }
      const detector=Detector.summary(detectorCatalog,history.detectorProgress,item.id,Date.now(),history.detectorLevels);
      if(detector.total){
        const box=element('section','learning-focus');
        box.append(element('h4','','🔎 Orddetektiven'));
        box.append(element('p','learning-focus-note',Detector.LABELS[detector.level]));
        box.append(element('p','learning-focus-note',detector.seen?
          detector.seen+' olika berättelser provade. I '+detector.clueRight+
            ' hittade du ledtråden utan extra hjälp.':
          'Leta efter textbiten som visar varför ordet passar.'));
        if(detector.ready){
          const action=element('button','secondary-button full-button','Leta efter ledtråden →');
          action.type='button';action.dataset.detectorTarget=item.id;box.append(action);
        }else box.append(element('p','learning-focus-note','Dina nästa ledtrådar kommer en annan dag.'));
        detail.append(box);
      }
      if(item.skills.length){const note=item.skills.map(x=>`${x.label}: ${x.right} rätt och ${x.wrong} fel`).join(' · ');
        detail.append(element('p','learning-evidence','Dina övningar: '+note));}
      const pair=K.findPair(item.id,contrasts);
      if(pair){
        const insight=H.insight(K.findPair(item.id,contrastHistoryData),history.confusionProgress?.[pair.id]);
        if(insight.contextsTried>0){
          const available=new Set(pair.scenes.map(scene=>scene.context)).size;
          const tried=Object.entries(insight.byContext).filter(([,record])=>record.seen>0)
            .map(([context])=>K.CONTEXTS[context].replace(/^\S+\s/,'').toLowerCase('sv-SE'));
          const next=insight.nextContexts[0];
          detail.append(element('p','learning-context-trail',
            `🌍 Du har jämfört orden i ${insight.contextsTried} av ${available} miljöer: ${tried.join(', ')}. `+
            (next?`Nästa plats att upptäcka: ${K.CONTEXTS[next]}.`:'Prova gärna en ny berättelse!')));
        }
        const memory=history.retentionProgress?.[pair.id];
        if(memory?.stage>0){
          const note=element('section','retention-learning');
          note.append(element('strong','',`🎁 Minnesstigen: ${U.STAGES[memory.stage]}`),
            element('p','',U.note(memory)));
          note.append(element('p','',`🌍 Du har övat i ${memory.verifiedContexts.length} av 4 vardagsmiljöer på avklarade återbesök. Nya berättelser väntar nästa gång.`));
          detail.append(note);
        }
        if(insight.needsPractice)detail.append(element('p','learning-word-tip',
          insight.recurring?'⚖️ De här två orden har varit kluriga att skilja åt. Prova en jämförelse i din egen takt!':
            '⚖️ Du kan jämföra det här ordet med ett liknande ord igen.'));
      }
      if(types.length){
        const focusBox=element('section','learning-focus');
        focusBox.append(element('h4','',next?'🎯 Nästa idé för dig':'🎯 Vill du träna just det här?'));
        const main=element('button','primary-button learning-focus-button',next?.action.kind==='aha'?
          '🎭 Prova en annan Aha-berättelse →':`🎯 Träna det här! · ${F.LABELS[recommended]}`);
        main.type='button';
        if(next?.action.kind==='aha')main.dataset.ahaWord=item.id;
        else{main.dataset.focusId=item.id;main.dataset.focusSkill=recommended;}
        focusBox.append(main);
        const represented=new Set(profile.facets.filter(facet=>facet.action?.kind==='focus').map(facet=>facet.action.skill));
        if(!mainIsAha)represented.add(recommended);
        const extras=types.filter(type=>!represented.has(type));
        if(extras.length){
          focusBox.append(element('p','learning-focus-note','Fler sätt att öva:'));
          const list=element('div','learning-focus-skills');
          for(const type of extras){
            const other=element('button','learning-focus-skill',F.LABELS[type]);
            other.type='button';other.dataset.focusId=item.id;other.dataset.focusSkill=type;
            list.append(other);
          }
          focusBox.append(list);
        }
        focusBox.append(element('p','learning-focus-note','Små övningar utan timer eller provpoäng.'));
        detail.insertBefore(focusBox,detail.querySelector('.learning-profile-title'));
      }
      detail.append(element('p','learning-evidence','Du kan öva på olika sätt och i vilken ordning du vill. Ett rätt svar är en upptäckt, inte ett betyg.'));
      card.append(button,detail);list.append(card);
    }
    $('learning-count').textContent=`Visar ${showing.length} av ${matches.length} ord och uttryck.`;
    $('learning-more').hidden=matches.length<=learningLimit;
    $('learning-empty').hidden=matches.length>0;
    $('learning-empty-text').textContent=learningFilter==='discovered'&&!$('learning-search').value.trim()&&!totals.discovered
      ? 'Spela en ordjakt, så dyker orden du mött upp här!'
      : 'Inga ord passar just det här valet. Prova en annan flik eller en ny sökning.';
  }
  // Separate guided-practice screen. One concept may appear more than once,
  // so it NEVER enters the ordinary quiz, which keys answers by concept ID.
  function startFocus(id,skill=null,{gentle=false}={}){
    let plan;
    try{plan=F.create(id,skill,bank,curation,expressions,missions,contexts,E,history.skillProgress,Math.random,K,contrasts,history.confusionProgress,T,clues,history.clueProgress);}
    catch(error){
      if(journey)return false;
      if(screen==='learning'){
        const note=$('learning-count');note.textContent='Det gick inte att starta övningen: '+error.message;
      }else showSetupError('Det gick inte att starta övningen: '+error.message);
      return;
    }
    if(gentle&&journey&&plan.item.kind==='word'&&['picture','meaning'].includes(plan.chosen))
      plan={...plan,questions:plan.questions.slice(0,1)};
    const prior=history.skillProgress?.[plan.item.id]?.skills?.[plan.chosen];
    const memoryPair=plan.chosen==='contrast'?plan.questions[0]?.contrastPair:null;
    const beforeMemory=memoryPair?history.retentionProgress[memoryPair]:null;
    focusPractice={...plan,index:0,answers:[],steps:[],answered:false,selected:[],finished:false,
      retentionBefore:beforeMemory?.stage||0,retentionDue:U.due(beforeMemory),
      before:{right:prior?.right||0,wrong:prior?.wrong||0,attempts:prior?.attempts||0}};
    $('focus-title').textContent=plan.pairLabel||plan.item.name;
    $('focus-buddy').textContent=P.companion(settings.companion).emoji;
    $('focus-description').textContent=plan.chosen==='contrast'
      ? `Fyra olika berättelser från flera platser – båda orden är rätt två gånger. ${plan.clueSupported?T.LABELS[plan.clueLevel]+' · ':''}Tänk på varför ett ord passar bättre än det andra.`
      : `${F.LABELS[plan.chosen]} · ${plan.questions.length} små uppgifter i din egen takt, utan tidspress.`;
    show('focus');
    renderFocusQuestion();
    $('focus-title').setAttribute('tabindex','-1');
    $('focus-title').focus({preventScroll:true});
    return true;
  }
  function updateFocusProgress(){
    const f=focusPractice;
    const done=f.answers.length;
    $('focus-progress').textContent=`Uppgift ${Math.min(f.index+1,f.questions.length)} av ${f.questions.length}`;
    const score=F.results(f.answers,f.questions.length);
    $('focus-right').textContent=`✅ ${score.right} rätt`;
    $('focus-wrong').textContent=`❌ ${score.wrong} fel`;
    const percent=Math.round(done/f.questions.length*100);
    $('focus-progress-fill').style.width=percent+'%';
    $('focus-progress-track').setAttribute('aria-valuenow',String(percent));
  }
  function drawFocusOrder(){
    const f=focusPractice,q=f.questions[f.index];
    const list=$('focus-order-selected');list.replaceChildren();
    f.selected.forEach(key=>list.append(element('li','',q.correctOrder[key])));
    $('focus-choices').querySelectorAll('[data-focus-step]').forEach(b=>{
      const used=f.selected.includes(Number(b.dataset.focusStep));
      b.disabled=used;b.setAttribute('aria-pressed',String(used));
    });
    $('focus-undo').disabled=f.selected.length===0;
    $('focus-reset').disabled=f.selected.length===0;
    $('focus-check-order').disabled=f.selected.length!==3;
  }
  function renderFocusQuestion(){
    const f=focusPractice;if(!f||f.finished)return;
    const q=f.questions[f.index];
    f.answered=false;f.selected=[];
    $('focus-question').hidden=false;
    $('focus-feedback').hidden=true;
    $('focus-finished').hidden=true;
    $('focus-task').textContent='🎯 '+F.LABELS[q.taskType].toLocaleUpperCase('sv-SE');
    $('focus-context-label').hidden=q.taskType!=='contrast';
    if(q.taskType==='contrast')$('focus-context-label').textContent=q.contrastContextLabel;
    $('focus-clue-level').hidden=q.taskType!=='contrast'||!f.clueSupported;
    if(q.taskType==='contrast'&&f.clueSupported)$('focus-clue-level').textContent=T.LABELS[q.contrastClueLevel||1];
    $('focus-stem').textContent=['context','contrast'].includes(q.taskType)?q.contextTitle:
      q.taskType==='reverse'?q.stem:q.taskType==='order'?'Vad händer först, sedan och sist?':q.word;
    const story=['context','contrast'].includes(q.taskType)?q.stem:
      q.kind==='expression'&&q.taskType==='meaning'?q.scene:'';
    $('focus-scene').hidden=!story;
    $('focus-scene').textContent=story;
    const choices=$('focus-choices');choices.replaceChildren();
    choices.dataset.layout=q.picture?'picture':q.taskType==='contrast'?'contrast':'text';
    $('focus-order').hidden=q.taskType!=='order';
    if(q.taskType==='order'){
      for(const step of q.steps){
        const b=element('button','focus-choice',step.label);b.type='button';
        b.dataset.focusStep=String(step.key);b.setAttribute('aria-pressed','false');choices.append(b);
      }
      drawFocusOrder();
    } else {
      q.options.forEach((option,index)=>{
        const b=element('button','focus-choice');b.type='button';b.dataset.focusChoice=String(index);
        if(q.picture){
          b.dataset.picture='true';
          const pic=element('span','focus-choice-emoji',option.emoji);pic.setAttribute('aria-hidden','true');b.append(pic);
        }
        b.append(element('span','',option.label));choices.append(b);
      });
    }
    updateFocusProgress();
    $('focus-stem').setAttribute('tabindex','-1');
    $('focus-stem').focus({preventScroll:true});
  }
  function answerFocus(optionIndex=null){
    const f=focusPractice;
    if(!f||f.answered||f.finished)return;
    const q=f.questions[f.index];
    const isOrder=q.taskType==='order';
    if(isOrder&&f.selected.length!==3)return;
    const option=isOrder?null:q.options[optionIndex];
    if(!isOrder&&!option)return;
    const right=isOrder?Q.checkOrder(f.selected):option.correct===true;
    const outcome=right?'right':'wrong';
    f.answered=true;f.answers.push(outcome);
    // Persist the actual skill observation as soon as the child answers.
    // The normal test result history and star/quest counters remain untouched.
    history.skillProgress=D.record(history.skillProgress,q,outcome);
    if(q.taskType==='contrast'){
      history.confusionProgress=H.record(history.confusionProgress,q,option,contrastHistoryData);
    }
    if(q.kind==='expression')history.surprises=S.updateCollection(history.surprises,'unlocked',q.id,expressions);
    saveHistory();
    $('focus-question').hidden=true;
    $('focus-feedback').hidden=false;
    $('focus-verdict').dataset.outcome=outcome;
    $('focus-verdict-icon').textContent=right?'✅':'❌';
    $('focus-verdict-title').textContent=right?'Bra jobbat!':'Vi lär oss tillsammans!';
    const solution=isOrder?q.correctOrder.join(' → '):q.options.find(o=>o.correct).label;
    $('focus-correct').textContent=right?'Du hittade rätt svar!':
      q.taskType==='contrast'?`Du valde ${option.label}. Här passar ${solution} bättre.`:`Rätt svar: ${solution}`;
    $('focus-explain-word').textContent=q.word;
    $('focus-definition').textContent=q.definition;
    $('focus-example').textContent='Exempel: '+q.example;
    const why=q.taskType==='contrast'?'⚖️ Aha! Därför passar ordet: '+q.contextWhy+(q.contrastClue?' Ledtråden: '+q.contrastClue:''):
      q.taskType==='context'?'💡 Varför passar ordet? '+q.contextWhy:
      q.kind==='expression'&&q.reveal?.length===2?
      `${q.reveal[0].title}: ${q.reveal[0].text} ${q.reveal[1].title}: ${q.reveal[1].text}`:'';
    $('focus-why').hidden=!why;
    $('focus-why').textContent=why;
    $('focus-next').textContent=f.index===f.questions.length-1?'🌟 Se vad jag övade':'Nästa uppgift →';
    updateFocusProgress();
    $('focus-verdict-title').setAttribute('tabindex','-1');
    $('focus-verdict-title').focus({preventScroll:true});
    if(typeof $('focus-feedback').scrollIntoView==='function')
      $('focus-feedback').scrollIntoView({behavior:'auto',block:'start'});
  }
  function finishFocus(){
    const f=focusPractice;if(!f||f.finished||f.answers.length!==f.questions.length)return;
    f.finished=true;
    noteJourneyOutcome('focus',{answers:f.answers});
    // At most ONE spaced-review observation per short session, using only the
    // selected target skill. Three stories in a row never count as three days.
    const first=f.questions[0];
    const targetOutcome=f.answers[0];
    if(f.chosen!=='contrast'){
      history.reviewProgress=R.record(history.reviewProgress,first,targetOutcome);
      history.mistakes=E.applyOutcome(history.mistakes,f.item.id,targetOutcome);
    }
    // A four-story contrast game is one sitting, not four spaced repetitions.
    // The hint level changes only after a FULL, balanced four-question session.
    if(f.chosen==='contrast'){
      history.retentionProgress=U.recordRound(history.retentionProgress,f.questions,f.answers,contrastHistoryData,clues);
      history.clueProgress=T.recordRound(history.clueProgress,f.questions,f.answers,contrasts,clues);
    }
    saveHistory();
    const score=F.results(f.answers,f.questions.length);
    $('focus-question').hidden=true;
    $('focus-feedback').hidden=true;
    $('focus-finished').hidden=false;
    $('focus-progress').textContent=`${f.questions.length} av ${f.questions.length} uppgifter`;
    $('focus-summary').textContent=f.chosen==='contrast'
      ? `Du jämförde ${f.pairLabel.toLocaleLowerCase('sv-SE')} i ${f.contexts.length} olika miljöer: ${score.right} rätt och ${score.wrong} fel. Alla försök hjälper dig att se skillnaderna!`
      : `Du provade ${f.questions.length} uppgifter om ${f.item.name.toLocaleLowerCase('sv-SE')}: ${score.right} rätt och ${score.wrong} fel. Varje försök hjälper dig vidare!`;
    const attempts=f.questions.map((q,i)=>({q,result:f.answers[i]})).filter(x=>x.q.taskType===f.chosen && (f.chosen!=='contrast'||x.q.id===f.item.id));
    const successes=attempts.filter(x=>x.result==='right').length;
    $('focus-skill-insight').textContent=f.chosen==='contrast'
      ? `⚖️ Du har provat båda orden i olika vardagsmiljöer. Läs gärna varför varje svar passar!`
      : f.before.attempts
      ? `🎯 ${F.LABELS[f.chosen]}: tidigare ${f.before.right} rätt av ${f.before.attempts} försök. Nu ${successes} rätt av ${attempts.length} nya uppgifter. Fortsätt gärna i en annan omgång!`
      : `🎯 ${F.LABELS[f.chosen]}: ditt första försök här! Du fick ${successes} rätt av ${attempts.length} uppgifter.`;
    const updated=L.detail(learningCatalog.find(x=>x.id===f.item.id),history.skillProgress,history.reviewProgress,history.missionProgress,history.mistakes);
    const comparison=f.chosen==='contrast'?H.insight(K.findPair(f.item.id,contrastHistoryData),
      history.confusionProgress?.[f.questions[0].contrastPair]):null;
    $('focus-next-hint').textContent=f.chosen==='contrast'
      ? comparison.recurring
        ? '⚖️ De här orden har varit kluriga att skilja åt. Prova gärna igen en annan gång – utan tidspress.'
        : comparison.recovered
          ? '🌟 Du har hittat skillnaden flera gånger på sistone. Upptäck gärna ett annat ordpar också!'
          : 'Det blir lättare när du jämför fler situationer en annan gång.'
      : updated.tip;
    if(f.chosen==='contrast'&&f.clueSupported){
      const next=T.selectLevel(K.findPair(f.item.id,contrasts),clues,history.clueProgress);
      const change=next>f.clueLevel?'✨ Nästa gång får du klura med lite färre ledtrådar.':
        next<f.clueLevel?'🌱 Nästa gång får du tydligare ledtrådar igen. Det är så man lär sig!':
        '🔎 Du kan prova fler berättelser på den här nivån en annan gång.';
      $('focus-next-hint').textContent+=' '+change;
    }
    if(f.chosen==='contrast'){
      const after=history.retentionProgress?.[f.questions[0].contrastPair];
      if(after?.stage>f.retentionBefore){
        $('focus-next-hint').textContent+=' 🎁 '+U.STAGES[after.stage]+'. '+U.note(after);
      }else if(f.retentionDue){
        $('focus-next-hint').textContent+=' 🌱 Du får en ny chans nästa gång. '+U.note(after);
      }else if(after?.stage>0){
        $('focus-next-hint').textContent+=' 🎁 '+U.note(after);
      }
    }
    const current=f.types.indexOf(f.chosen);
    $('focus-other-skill').hidden=!!journey||f.types.length<2;
    $('focus-other-skill').textContent=f.types.length>1?`✨ Prova ${F.LABELS[f.types[(current+1)%f.types.length]].toLowerCase()} →`:'Prova ett nytt sätt';
    $('focus-finished').scrollIntoView?.({behavior:'auto',block:'start'});
    if(journey)renderJourneyBanner();
  }
  function backToFocusWord(){
    if(journey){goNav('learning');return;}
    const id=focusPractice?.item.id;
    const item=focusPractice?.item;
    focusPractice=null;
    learningFilter='all';learningLimit=18;
    $('learning-search').value=item?.name||'';
    show('learning');
    if(id){
      const button=$('learning-list').querySelector(`[data-learning-open="${id}"]`);
      if(button){button.click();button.focus({preventScroll:true});}
    }
  }
  function renderSetup() {
    setPressed('[data-mode]','mode',settings.mode);
    setPressed('[data-topic]','topic',settings.topic);
    setPressed('[data-expression-task]','expressionTask',settings.expressionTask);
    $('context-mix').checked=settings.contextMix;
    $('adaptive-practice').checked=settings.adaptivePractice;
    $('adaptive-settings').hidden=settings.mode!=='train'||settings.difficulty==='exam';
    const skillSummary=D.summary(history.skillProgress);
    $('adaptive-home-summary').textContent=skillSummary.practised
      ? `Du har provat ${skillSummary.practised} övningsmoment på ${skillSummary.concepts} ord och uttryck. ${skillSummary.needsPractice} moment kan få en ny chans.`
      : 'Efter några omgångar varierar spelet efter vad som känns svårt. Inga personuppgifter samlas in.';
    $('context-settings').hidden=settings.topic==='expressions'||settings.difficulty==='easy'||settings.difficulty==='exam';
    $('mission-hints').checked=settings.missionHints;
    $('expression-task-settings').hidden=settings.topic==='words';
    $('context-help').textContent=`${contexts.wordContexts.length} ord har tre skrivna vardagssituationer. Bara ord med granskade berättelser får den här frågetypen.`;
    $('expression-task-help').textContent=settings.difficulty==='exam'?'Högskoleprovsutmaningen använder alltid betydelsefrågor med fem alternativ. Välj en annan nivå för de nya uppdragen.':'Blanda ger flera sorters frågor i samma omgång. I luckboken kan du alltid byta uppdrag.';
    setPressed('[data-level]','level',settings.difficulty);
    setPressed('[data-count]','count',settings.count);
    setPressed('[data-timer]','timer',settings.timerMode);
    updateTheme();updateCompanionSelection();updateAdventureSelection();updateBookCounters();renderQuestShelf();renderLearningPreview();
    $('timer-controls').hidden=settings.timerMode==='off';
    $('timer-help').textContent=settings.timerMode==='per'
      ? 'Om tiden tar slut markeras just den frågan som obesvarad.'
      : 'I Testa dig fortsätter tiden mellan alla frågor. I Träna pausas den när du läser förklaringen.';
    if(settings.timerMode!=='off')fillTimerPresets();
    $('review-only').checked=settings.reviewOnly;
    const pool=E.getTopicPool(bank,curation,expressions,settings);
    const nWords=pool.filter(item=>item.kind==='word').length;
    const nExpressions=pool.length-nWords;
    $('pool-info').textContent=(settings.topic==='words'?`${nWords} ord`:settings.topic==='expressions'?`${nExpressions} uttryck`:`${nWords} ord och ${nExpressions} uttryck`)+'. Ingen fråga upprepas under omgången.';
    $('topic-help').textContent=settings.topic==='expressions'
      ? '🎭 Små vardagsberättelser och en Aha-förklaring efter svaret. Alla 25 uttryck är skrivna för cirka 8–10 år.'
      : settings.topic==='mixed'
        ? '🎲 En blandning av enstaka ord och vardagsuttryck. Varje uttryck har en liten berättelse.'
        : '🔤 Enstaka ord, med möjlighet att öva i små vardagsberättelser på medel och svårt.';
    $('level-note').textContent=settings.topic==='expressions'
      ? 'Uttrycken har egen nivå (ungefär 8–10 år) och saknar bildalternativ. Expertläget har fem svar.'
      : settings.difficulty==='easy'
        ? 'Endast ordfrågor har granskade bilder. Uttryck har alltid text och en kort berättelse.'
        : settings.difficulty==='exam'
          ? 'Inspirerat av högskoleprovets ORD-del, inte ett officiellt prov. Fem textalternativ per fråga.'
          : 'Fyra textalternativ per fråga. Inga bilder på denna nivå.';
    const ready=readyReviewCount(pool);
    const waiting=pool.filter(item=>{const card=history.reviewProgress[item.entry.id];return card&&card.streak<3&&!R.ready(card);}).length;
    $('review-info').textContent=ready?`${ready} ${ready===1?'fråga är redo':'frågor är redo'} för en annan typ av repetition`:
      waiting?`${waiting} ${waiting===1?'fråga kommer':'frågor kommer'} tillbaka senare`:'Inga svåra frågor väntar just nu';
    $('review-only').disabled=ready===0;
    if(ready===0 && settings.reviewOnly){settings.reviewOnly=false;$('review-only').checked=false;saveHistory();}
  }
  function showSetupError(message){$('setup-error').hidden=false;$('setup-error').textContent=message;}
  function hideSetupError(){$('setup-error').hidden=true;}
  function currentTimerSeconds() {
    if(settings.timerMode==='off')return 0;
    if($('timer-preset').value!=='custom')return E.clampInteger($('timer-preset').value,5,3600,180);
    const m=Number($('custom-min').value),s=Number($('custom-sec').value);
    if(!Number.isInteger(m)||!Number.isInteger(s)||m<0||m>60||s<0||s>59)return 0;
    return m*60+s;
  }
  function startRound(questId=null, roundOptions={}) {
    hideSetupError();
    if(settings.timerMode!=='off') {
      const seconds=currentTimerSeconds();
      const max=settings.timerMode==='per'?600:3600;
      if(seconds<5||seconds>max) {showSetupError('Välj en tid mellan 5 sekunder och '+(max/60)+' minuter.');return;}
      settings.timerSeconds=seconds;
    }
    const limit=E.getTopicPool(bank,curation,expressions,settings).length;
    if(limit<settings.count && !settings.reviewOnly){showSetupError('Det finns inte tillräckligt många ord för den här omgången.');return;}
    // Berättelsehjälten promises all three expression tasks in five questions.
    // Its task mix must be guaranteed, not overridden by personalised practice.
    const roundSettings={...settings,contextOnly:roundOptions.contextOnly===true,
      adaptivePractice:questId==='stories'?false:settings.adaptivePractice};
    let questions;
    try {questions=E.generateRound(bank,curation,roundSettings,history.mistakes,Math.random,expressions,missions,history.reviewProgress,Date.now(),contexts,history.skillProgress,D,history.readingProgress);}
    catch(error){showSetupError(error.message);return;}
    if(!questions.length){showSetupError('Det finns inga tillgängliga frågor.');return;}
    saveHistory();
    game={settings:roundSettings,questions,index:0,answers:{},selected:{},finished:false,
      startedAt:Date.now(),deadline:0,remainingMs:settings.timerSeconds*1000,
      feedback:false,paused:false,streak:0,bestStreak:0,stars:0,
      readingMetrics:{offered:0,attempted:0,firstTry:0,completed:0,guided:0},
      questId:questId&&J.QUESTS[questId]?questId:null,priorMistakes:priorReviewErrors()};
    orderSelection=[];
    document.documentElement.dataset.adventure=game.settings.adventure;
    $('clock-stat').hidden=settings.timerMode==='off';
    $('view-play').querySelector('.score-grid').classList.toggle('has-timer',settings.timerMode!=='off');
    $('journey-details').open=false; // Reading must not start below an expanded map.
    $('play-tag').textContent=(settings.mode==='train'?'📚 Träna':'🏆 Testa dig')+' • '+topicLabels[settings.topic]+' • '+labels[settings.difficulty];
    $('progress-label').textContent=settings.topic==='words'?'ORD':'FRÅGA';
    show('play');
    renderQuestion();
    activateTimer();
  }
  function stopTimer() {if(timerInterval){clearInterval(timerInterval);timerInterval=0;}}
  function activateTimer() {
    stopTimer();
    if(!game || game.settings.timerMode==='off')return;
    game.deadline=Date.now()+(game.settings.timerMode==='total'?game.remainingMs:game.settings.timerSeconds*1000);
    updateClock();
    timerInterval=setInterval(updateClock,150);
  }
  function pauseTimerForFeedback() {
    if(!game || game.settings.mode!=='train'||game.settings.timerMode==='off')return;
    if(game.settings.timerMode==='total')game.remainingMs=Math.max(0,game.deadline-Date.now());
    game.deadline=0;stopTimer();updateClock();
  }
  function updateClock() {
    if(!game||game.finished||game.settings.timerMode==='off')return;
    const remaining=game.deadline?Math.max(0,game.deadline-Date.now()):(game.settings.timerMode==='total'?game.remainingMs:game.settings.timerSeconds*1000);
    $('stat-clock').textContent=E.formatTime(remaining);
    $('clock-stat').classList.toggle('urgent',remaining>0&&remaining<=10000);
    if(game.deadline&&remaining<=0){
      if(game.settings.timerMode==='total')finishRound(true);
      else submit(null);
    }
  }
  function updateScore() {
    if(!game)return;
    const n=game.questions.length,answers=game.answers;
    const score=E.score(answers,n);
    const done=Object.keys(answers).length;
    $('stat-progress').textContent=(Math.min(n,game.index+1))+' / '+n;
    const rightLabel=$('stat-right').parentElement.querySelector('span');
    const wrongLabel=$('stat-wrong').parentElement.querySelector('span');
    if(game.settings.mode==='train'){
      rightLabel.textContent='✅ RÄTT';wrongLabel.textContent='❌ FEL';
      $('stat-right').textContent=String(score.right);$('stat-wrong').textContent=String(score.wrong);
    }else{
      rightLabel.textContent='KLARA';wrongLabel.textContent='KVAR';
      $('stat-right').textContent=String(done);$('stat-wrong').textContent=String(n-done);
    }
    const percent=Math.round((done/n)*100);
    $('progress-fill').style.width=percent+'%';
    $('progress-track').setAttribute('aria-valuenow',String(percent));
    renderMission();renderTrail();
  }
  function renderOrderQuestion(q){
    const box=$('order-choices');box.replaceChildren();
    q.steps.forEach(step=>{
      const button=element('button','mission-choice',step.label);
      button.type='button';button.dataset.orderStep=String(step.key);
      button.setAttribute('aria-pressed','false');box.append(button);
    });
    drawMainOrderSelection(q);
  }
  function drawMainOrderSelection(q){
    const list=$('order-selection');list.replaceChildren();
    orderSelection.forEach(key=>list.append(element('li','',q.correctOrder[key])));
    $('order-choices').querySelectorAll('button[data-order-step]').forEach(b=>{
      const selected=orderSelection.includes(Number(b.dataset.orderStep));
      b.disabled=selected;b.setAttribute('aria-pressed',String(selected));
    });
    $('order-undo').disabled=orderSelection.length===0;
    $('order-reset').disabled=orderSelection.length===0;
    $('order-submit').disabled=orderSelection.length!==3;
    $('order-count').textContent=`${orderSelection.length} av 3 händelser valda`;
  }
  function renderQuestion() {
    if(!game||game.finished)return;
    stopReadAloud();
    clearBurst();
    const q=game.questions[game.index];
    $('adventure-milestone').hidden=true;
    $('question-area').hidden=false;
    $('feedback-area').hidden=true;
    readingCheck=null;
    $('reading-check').hidden=true;
    $('reading-launch').hidden=true;
    $('reading-reread').hidden=true;
    $('reading-why').hidden=true;
    $('feedback-area').dataset.readingPending='false';
    $('reading-response').textContent='';
    $('view-play').dataset.readingPhase='question';
    $('next').hidden=true;
    $('test-footnote').hidden=game.settings.mode!=='test';
    $('adaptive-feedback').hidden=true;
    $('question-word').textContent=q.taskType==='context'?q.contextTitle:q.taskType==='reverse'?q.stem:q.word;
    $('reading-story').classList.toggle('is-context',q.taskType==='context');
    if(q.taskType==='context')$('context-scene').querySelector('.context-scene-label').textContent='📖 BERÄTTELSEN · '+q.contextTitle;
    $('context-scene').hidden=q.taskType!=='context';
    if(q.taskType==='context')$('context-story').textContent=q.stem;
    $('explanation-label').textContent=q.kind==='expression'?'📖 STEG 1: LÄS VAD UTTRYCKET BETYDER':'📖 STEG 1: LÄS VAD ORDET BETYDER';
    $('expression-scene').hidden=q.kind!=='expression';
    if(q.kind==='expression')$('expression-story').textContent=q.scene;
    $('question-prompt').textContent=q.taskType==='context'?'🎭 VILKET ORD PASSAR I BERÄTTELSEN?':q.taskType==='reverse'?'🌱 VILKET ORD PASSAR TILL BETYDELSEN?':q.taskType==='sentence'?'💬 VILKEN MENING PASSAR?':q.taskType==='order'?'🧩 VAD HÄNDER FÖRST?':q.kind==='expression'?'🕵️ VAD BETYDER UTTRYCKET?':q.picture?'VILKEN BILD PASSAR BÄST?':'VAD BETYDER ORDET?';
    $('question-instruction').textContent=q.taskType==='context'?'Läs noga och välj ordet som beskriver situationen':q.taskType==='reverse'?'Läs betydelsen och hitta ordet som passar':q.taskType==='sentence'?'Välj meningen där uttrycket används rätt':q.taskType==='order'?'Tryck på händelserna i rätt ordning – först, sedan, sist':q.kind==='expression'?'Läs meningen och välj den bästa förklaringen':q.picture?'Välj rätt bild och ord':'Välj den bästa betydelsen';
    $('expression-story').parentElement.hidden=q.kind!=='expression'||q.taskType==='order'||(game.settings.reviewOnly&&q.taskType==='sentence');
    const storyVisible=!$('context-scene').hidden || !$('expression-story').parentElement.hidden;
    if(storyVisible)$('question-prompt').textContent='📖 STEG 1: LÄS BERÄTTELSEN';
    $('answer-step').querySelector('strong').textContent=storyVisible?'🎯 STEG 2: VÄLJ SVAR':'🎯 VÄLJ SVAR';
    $('reading-story').classList.toggle('is-story',storyVisible);
    // The story takes priority in Träna and Testa dig. Only Träna has
    // feedback and an extra unscored Aha check.
    $('story-reveal').hidden=!storyVisible;
    $('story-help').hidden=!storyVisible;
    $('reading-stage').textContent=storyVisible?'📖 1. Läs → 🎯 2. Välj → 💡 3. Förstå':'🎯 1. Välj → 💡 2. Förstå';
    $('answer-step').hidden=!$('story-reveal').hidden;
    const options=$('answer-options');options.className='answer-grid'+(q.picture?' picture-grid':'');options.replaceChildren();
    $('order-area').hidden=q.taskType!=='order'||!$('story-reveal').hidden;
    options.hidden=q.taskType==='order'||!$('story-reveal').hidden;
    if(q.taskType==='order'){orderSelection=[];renderOrderQuestion(q);}
    q.options.forEach((option,index)=>{
      const btn=document.createElement('button');btn.type='button';btn.className='answer-option'+(q.picture?' with-picture':'');btn.dataset.option=String(index);
      if(q.picture){const pic=document.createElement('span');pic.className='choice-emoji';pic.textContent=option.emoji;pic.setAttribute('aria-hidden','true');btn.append(pic);}
      else {const letter=document.createElement('span');letter.className='choice-letter';letter.setAttribute('aria-hidden','true');letter.textContent='ABCDE'[index];btn.append(letter);}
      const label=document.createElement('span');label.textContent=option.label;btn.append(label);btn.setAttribute('aria-label',option.label);options.append(btn);
    });
    updateScore();
    // Focus attention on the actual question, including the first one.
    if(typeof $('question-area').scrollIntoView==='function')
      $('question-area').scrollIntoView({behavior:'instant',block:'start'});
  }

  function showReadingCheck(check) {
    const section=$('reading-check');
    const launch=$('reading-launch');
    section.hidden=true;
    launch.hidden=!check;
    section.dataset.complete='false';
    $('reading-response').textContent='';
    $('reading-why').hidden=true;
    $('reading-reread').hidden=true;
    $('reading-launch-prompt').textContent='📖 Läs betydelsen och exemplet ovan. Sedan får du visa vad du förstått.';
    $('reading-start').textContent='🧠 Jag har läst – prova mig →';
    $('feedback-reading-stage').textContent='📖 Läs först – 🧠 prova sedan';
    $('reading-options').replaceChildren();
    if(!check)return;
    check.attempts=0;
    game.readingMetrics.offered++;
    $('reading-check-title').textContent=check.prompt;
    $('reading-instruction').textContent=check.source==='meaning'
      ? 'Vilken betydelse är rätt? Tänk på förklaringen du just läste.'
      : 'Vilket nytt exempel passar? Använd det du just läste.';
    renderReadingOptions(check);
  }
  function renderReadingOptions(check) {
    const box=$('reading-options');box.replaceChildren();
    check.options.forEach((answer,index)=>{
      const button=element('button','reading-option');button.type='button';
      button.dataset.readingOption=String(index);
      const letter=element('span','reading-letter','ABC'[index]);letter.setAttribute('aria-hidden','true');
      const label=element('span','',answer.label);button.append(letter,label);
      box.append(button);
    });
  }
  function revealReadingCheck() {
    if(!game||!game.feedback||!readingCheck)return;
    stopReadAloud();
    $('reading-launch').hidden=true;
    $('reading-check').hidden=false;
    $('reading-reread').hidden=false;
    $('feedback-area').dataset.readingStage='quiz';
    $('feedback-reading-stage').textContent='🧠 Steg 2: Visa vad du förstått';
    $('reading-check-title').setAttribute('tabindex','-1');
    $('reading-check-title').focus({preventScroll:true});
    if(typeof $('reading-check').scrollIntoView==='function')
      $('reading-check').scrollIntoView({behavior:'auto',block:'start'});
  }
  function recordAhaWithFeedback(id,source,outcome,evidence){
    const now=Date.now(),before=history.readingProgress;
    history.readingProgress=B.recordProgress(before,id,source,outcome,now,evidence);
    if(history.readingProgress!==before&&['context','expression'].includes(source)&&
      history.readingProgress[id]?.transfer?.lastAt===now)
      observePracticeFeedback('aha:'+id,outcome==='first'?'direct':'supported',now,evidence);
  }
  function saveAhaOutcome(outcome) {
    const q=game?.questions?.[game.index];
    if(!q||!readingCheck)return;
    recordAhaWithFeedback(q.id,readingCheck.source,outcome,readingCheck.evidence);
    saveHistory();
  }
  function answerReadingCheck(index) {
    if(!game||!game.feedback||!readingCheck||$('reading-check').dataset.complete==='true')return;
    const option=readingCheck.options[index];
    if(!option)return;
    const button=$('reading-options').querySelector('[data-reading-option="'+index+'"]');
    readingCheck.attempts++;
    if(readingCheck.attempts===1)game.readingMetrics.attempted++;
    const nextStep=B.nextStep(readingCheck.attempts,B.isCorrect(readingCheck,index));
    if(nextStep==='complete'){
      if(readingCheck.attempts===1)game.readingMetrics.firstTry++;
      saveAhaOutcome(readingCheck.attempts===1?'first':'retry');
      game.readingMetrics.completed++;
      $('reading-check').dataset.complete='true';
      $('feedback-area').dataset.readingPending='false';
      $('feedback-area').dataset.readingStage='done';
      $('feedback-reading-stage').textContent='✅ Du har provat det du läste';
      button.dataset.correct='true';
      $('reading-options').querySelectorAll('button').forEach(item=>item.disabled=true);
      $('reading-response').textContent=readingCheck.source==='meaning'
        ? '🌟 Du hittade rätt betydelse!':'🌟 Du hittade rätt i den nya berättelsen!';
      $('reading-why').textContent=readingCheck.why ? 'Därför passar det: '+readingCheck.why :
        'Det här exemplet passar med betydelsen du läste.';
      $('reading-why').hidden=false;
      $('reading-reread').hidden=true;
      const q=game.questions[game.index];
      if(game.answers[q.id]==='right')showBurst();
      $('next').hidden=false;
    }else if(nextStep==='reread'){
      // Never leave one fewer answer on screen: that rewards elimination.
      $('feedback-area').dataset.readingStage='reread';
      $('feedback-reading-stage').textContent='📖 Ta en ny titt på förklaringen';
      $('reading-check').hidden=true;
      $('reading-launch').hidden=false;
      $('reading-launch-prompt').textContent='Det var klurigt! Läs förklaringen och exemplet igen. Du får ett nytt försök utan minuspoäng.';
      $('reading-start').textContent='🔎 Jag har läst igen – prova →';
      readingCheck.options.push(readingCheck.options.shift());
      renderReadingOptions(readingCheck);
      $('explanation-word').focus({preventScroll:true});
      if(typeof $('explanation-word').scrollIntoView==='function')
        $('explanation-word').scrollIntoView({behavior:'auto',block:'start'});
    }else{
      // After two errors, teach rather than trap the child in more guesses.
      game.readingMetrics.guided++;
      saveAhaOutcome('guided');
      $('reading-check').dataset.complete='true';
      $('feedback-area').dataset.readingPending='false';
      $('feedback-area').dataset.readingStage='done';
      $('feedback-reading-stage').textContent='📖 Du fick hjälp med förklaringen';
      $('reading-options').querySelectorAll('button').forEach(item=>item.disabled=true);
      const correct=readingCheck.options.find(item=>item.correct);
      $('reading-response').textContent='Det här var svårt. Ingen fara – vi övar mer på det senare.';
      $('reading-why').textContent=(readingCheck.source==='meaning'?'Rätt betydelse: ':'Rätt exempel: ')+correct.label+'. '+
        (readingCheck.why||'Jämför med betydelsen ovan.');
      $('reading-why').hidden=false;
      $('reading-reread').hidden=true;
      $('next').hidden=false;
    }
  }
  function submit(index) {
    if(!game||game.finished||game.feedback)return;
    stopReadAloud();
    // Check actual wall-clock time even if the interval callback was delayed.
    if(index!==null && game.deadline && Date.now()>=game.deadline){
      if(game.settings.timerMode==='total'){finishRound(true);return;}
      index=null;
    }
    const q=game.questions[game.index];
    if(game.answers[q.id])return;
    const isOrder=q.taskType==='order';
    const option=(index===null||isOrder)?null:q.options[index];
    if(index!==null&&!isOrder&&!option)return;
    if(isOrder&&index!==null&&orderSelection.length!==3)return;
    const outcome=index===null?'unanswered':isOrder?(Q.checkOrder(orderSelection)?'right':'wrong'):(option.correct?'right':'wrong');
    game.answers[q.id]=outcome;
    game.selected[q.id]=isOrder&&index!==null?orderSelection.map(key=>q.correctOrder[key]).join(' → '):option?option.label:null;
    game.streak=outcome==='right'?game.streak+1:0;
    game.bestStreak=Math.max(game.bestStreak,game.streak);
    if(outcome==='right')game.stars++;
    updateScore();
    if(game.settings.mode==='train'){
      game.feedback=true;
      pauseTimerForFeedback();
      const status=$('feedback-status');status.dataset.outcome=outcome;
      $('feedback-emoji').textContent=outcome==='right'?'✅':outcome==='wrong'?'❌':'⏳';
      const cheer=P.encouragement(outcome,game.index,game.streak);
      $('feedback-title').textContent=q.kind==='expression'&&outcome==='wrong'?'Inte riktigt – vi lär oss!':cheer.title;
      $('feedback-companion').textContent=P.companion(game.settings.companion).emoji;
      $('feedback-message').textContent=cheer.message;
      const skill=D.task(q);
      const personalised=game.settings.adaptivePractice&&game.settings.difficulty!=='exam';
      $('adaptive-feedback').hidden=!personalised||outcome==='unanswered';
      if(personalised&&outcome!=='unanswered'){
        $('adaptive-feedback-title').textContent='🧠 '+D.LABELS[skill];
        $('adaptive-feedback-text').textContent=outcome==='wrong'
          ? 'Den här sortens fråga kan komma tillbaka i en ny övning. Det är så man lär sig!'
          : 'Du klarade den här uppgiften! Fortsätt så får du prova ordet på fler sätt.';
      }
      $('feedback-reward').hidden=!cheer.reward;
      $('feedback-reward').textContent=cheer.reward;
      const reached=A.newlyReached(game.settings.adventure,game.questions.length,game.index,game.index+1);
      $('adventure-milestone').hidden=reached.length===0;
      if(reached.length){const stop=reached[reached.length-1];$('milestone-emoji').textContent=stop.emoji;$('milestone-text').textContent=stop.message;}
      if(outcome==='right')playSound('right');
      // Keep visual rewards out of the reading step until the Aha check is done.
      else if(outcome==='wrong')playSound('wrong');
      const correct=q.taskType==='order'?q.correctOrder.join(' → '):q.options.find(item=>item.correct).label;
      $('feedback-correct').textContent=outcome==='right'?'Bra jobbat!':q.taskType==='order'?'Rätt ordning: '+correct:'Rätt svar: '+correct;
      $('explanation-word').textContent=q.word;
      $('explanation-definition').textContent=q.definition;
      $('explanation-example').textContent='Exempel: '+q.example;
      $('context-aha').hidden=q.taskType!=='context';
      if(q.taskType==='context')$('context-reason').textContent=q.contextWhy;
      $('expression-reveal').hidden=q.kind!=='expression';
      $('expression-comic').replaceChildren();
      $('expression-bonus').replaceChildren();
      $('expression-surprise-body').hidden=true;
      $('expression-open').hidden=false;
      $('expression-open').setAttribute('aria-expanded','false');
      $('expression-open').textContent='🎁 Öppna luckan';
      if(q.kind==='expression' && outcome!=='unanswered')changeDoor('unlocked',q.id);
      $('question-area').hidden=true;
      $('feedback-area').hidden=false;
      // The reading checkpoint is for learning, never an extra scored test.
      readingCheck=B.makeCheck(q,{bank,contexts,surprises,missions,readingProgress:history.readingProgress});
      showReadingCheck(readingCheck);
      $('feedback-area').dataset.readingStage='explain';
      $('view-play').dataset.readingPhase='explain';
      $('feedback-area').dataset.readingPending=readingCheck?'true':'false';
      $('next').hidden=!!readingCheck;
      $('next').textContent=game.index===game.questions.length-1?'🏆 Visa mitt resultat':q.kind==='expression'?'Nästa uttryck →':'Nästa ord →';
      $('test-footnote').hidden=true;
      // Move focus to explanation for screen-reader users, without hiding it behind answers.
      $('explanation-word').setAttribute('tabindex','-1');$('explanation-word').focus({preventScroll:true});
      // Place the explanation in view on a small screen after hiding the question.
      if(typeof $('feedback-area').scrollIntoView==='function')
        $('feedback-area').scrollIntoView({behavior:'auto',block:'start'});
    } else advance();
  }
  function advance() {
    if(!game||game.finished)return;
    if(game.index>=game.questions.length-1){finishRound(false);return;}
    game.index++;
    game.feedback=false;
    renderQuestion();
    if(game.settings.timerMode==='per' || (game.settings.timerMode==='total' && game.settings.mode==='train')) activateTimer();
  }
  function finishRound(timeExpired) {
    if(!game||game.finished)return;
    stopReadAloud();
    game.finished=true;stopTimer();clearBurst();
    const result=E.score(game.answers,game.questions.length);
    // Test-mode doors unlock only AFTER the test has finished, never during it.
    // An unanswered, never-seen question does not unlock its story.
    if(game.settings.mode==='test'){
      for(const q of game.questions){
        if(q.kind==='expression' && ['right','wrong'].includes(game.answers[q.id]))
          history.surprises=S.updateCollection(history.surprises,'unlocked',q.id,expressions);
      }
    }
    // The miniquest badge is independent of the normal right/wrong score.
    // Its progress is checked BEFORE we modify the old mistake list.
    const questStep=game.questId?J.progress(game.questId,game.questions,game.answers,game.priorMistakes):null;
    if(game.questId)history.questCounts=J.earn(history.questCounts,game.questId,questStep.complete);
    // Unanswered questions are not counted as wrong, including those never displayed.
    game.questions.forEach(q=>{
      if(!game.answers[q.id])return;
      const outcome=game.answers[q.id];
      history.reviewProgress=R.record(history.reviewProgress,q,outcome);
      history.skillProgress=D.record(history.skillProgress,q,outcome);
      // Regular quizzes never contain two-choice contrast tasks. Only the
      // opt-in practice flow records which alternative was selected.
      history.mistakes=E.applyOutcome(history.mistakes,q.id,outcome);
    });
    history.results.push({finishedAt:Date.now(),mode:game.settings.mode,level:game.settings.difficulty,topic:game.settings.topic,adventure:game.settings.adventure,
      ...result,total:game.questions.length,bestStreak:game.bestStreak});
    history.results=history.results.slice(-50);
    saveHistory();
    $('adaptive-results').hidden=game.settings.mode!=='train'||!game.settings.adaptivePractice;
    if(!$('adaptive-results').hidden){
      const skills=D.summary(history.skillProgress);
      $('adaptive-results-message').textContent=`Du har provat ${skills.practised} övningsmoment på ${skills.concepts} ord och uttryck. ${skills.needsPractice} moment kan behöva en ny chans. I nästa omgång får du både variation och hjälp med det som varit svårt.`;
    }
    const reading=game.readingMetrics;
    $('results-reading').hidden=game.settings.mode!=='train'||!reading||reading.attempted===0;
    if(!$('results-reading').hidden){
      $('results-reading-detail').textContent='Du klarade '+reading.firstTry+' av '+reading.attempted+
        ' Aha-frågor direkt. '+reading.guided+' behövde extra förklaring och '+
        reading.completed+' löstes efter eget svar. Aha-frågorna är övning, inte extra provpoäng.';
    }
    $('result-right').textContent=String(result.right);
    $('result-wrong').textContent=String(result.wrong);
    $('result-empty').textContent=String(result.unanswered);
    $('results-percent').textContent=result.percent+' %';
    $('results-descriptor').textContent=labels[game.settings.difficulty]+' · '+game.questions.length+' frågor · '+topicLabels[game.settings.topic]+' · '+(game.settings.mode==='train'?'Träna':'Testa dig')+(timeExpired?' · Tiden tog slut':'');
    renderRewards(result);
    renderQuestFinale(questStep);
    renderFinale();
    renderStoryOptions('results');
    renderReview(result);
    const review=R.summary(history.reviewProgress);
    $('review-result-message').textContent=result.wrong?
      'Det du missade är nu redo att övas på igen. Nästa gång får du tänka på ett annat sätt!':
      game.settings.reviewOnly&&result.right?'Bra jobbat med repetitionen! Vissa ord får vila innan nästa försök.':'Du har utforskat nya ord! Fortsätt när du vill.';
    renderLearningPreview();
    $('review-result-counts').textContent=`🌱 ${review.due} att öva nu · ⏳ ${review.waiting} senare · 🌟 ${review.mastered} inlärda`;
    show('results');
  }
  function renderQuestFinale(step){
    $('quest-finale').hidden=!game.questId;
    if(game.questId){
      const quest=J.QUESTS[game.questId];
      $('quest-finale-emoji').textContent=step.complete?'🌟':quest.emoji;
      $('quest-finale-title').textContent=step.complete?'Uppdraget är klart!':`Du provade ${quest.title}!`;
      $('quest-finale-text').textContent=step.complete?quest.done:
        game.questId==='comeback'?'Du har övat på svåra ord. Fortsätt när du vill – även ett försök hjälper!':
          'Du har börjat ditt uppdrag. Prova gärna igen när du vill!';
      const count=history.questCounts[game.questId]||0;
      $('quest-finale-count').textContent=step.complete?`${count} ${count===1?'gång':'gånger'} har du klarat det här uppdraget. Uppdraget ger ingen extra provpoäng.`:'Inga extra poäng dras bort när ett miniuppdrag inte blir klart.';
    }
    const review=J.makePlan('comeback',settings,history.mistakes,bank,curation,expressions,E,history.reviewProgress);
    document.querySelectorAll('#quest-result-buttons [data-start-quest="comeback"]').forEach(button=>{button.disabled=!review;button.title=review?'':'Du har inga tidigare fel att repetera.';});
    $('next-steps-note').textContent=review?'Vill du öva på ett svårt ord igen eller utforska något nytt?':'Du kan välja nya ord eller uttryck. Repetitionsuppdraget öppnas när det finns ett ord du missat.';
  }
  function renderFinale() {
    if(!game)return;
    const world=A.world(game.settings.adventure);
    $('finale-emoji').textContent=world.emoji;
    $('finale-title').textContent=world.title;
    const completed=Object.keys(game.answers).length;
    $('finale-text').textContent=completed===game.questions.length?world.ending:'Äventyret tog slut innan du hann fram. Du kan fortsätta utforska i en ny omgång!';
    const visited=A.stages(game.settings.adventure,game.questions.length,completed).filter(x=>x.reached).length;
    $('finale-stops').textContent=`${visited} av 4 platser utforskade`;
  }
  function renderRewards(result) {
    const buddy=P.companion(game.settings.companion);
    $('results-companion').textContent=buddy.emoji;
    $('results-cheer').textContent=result.right===result.total
      ?`${buddy.name} säger: Vilken fantastisk ordjakt!`
      :result.right>0?`${buddy.name} säger: Du lärde dig massor av ord!`
      :`${buddy.name} säger: Modigt att prova! Vi lär oss tillsammans.`;
    // Stars are earned on correct answers, regardless of training or test mode.
    $('rewards-stars').textContent=`⭐ ${result.right} ${result.right===1?'stjärna':'stjärnor'} hittade`;
    const box=$('rewards-badges');box.replaceChildren();
    const badges=P.achievements({...result,total:game.questions.length,bestStreak:game.bestStreak});
    badges.forEach(badge=>{
      const card=element('div','reward-badge');
      const pic=element('span','reward-icon',badge.icon);pic.setAttribute('aria-hidden','true');
      const copy=element('div');
      copy.append(element('strong','',badge.title),element('small','',badge.text));
      card.append(pic,copy);box.append(card);
    });
    $('results-rewards').hidden=false;
  }
  function renderReview(result) {
    const list=$('review-list');list.replaceChildren();
    const showAll=game.settings.mode==='test';
    const entries=game.questions.filter(q=>showAll||game.answers[q.id]!=='right');
    $('review-title').textContent=showAll?'📖 Facit och förklaringar':'📖 Ord att öva vidare på';
    if(!entries.length){const div=document.createElement('p');div.className='muted';div.textContent='🌟 Full pott! Inga fel att repetera denna gång.';list.append(div);return;}
    for(const q of entries){
      const outcome=game.answers[q.id]||'unanswered';
      const el=document.createElement('article');el.className='review-card';
      const pill=document.createElement('span');pill.className='review-pill '+outcome;pill.textContent=outcome==='right'?'✅ Rätt':outcome==='wrong'?'❌ Fel':'⏳ Obesvarad';
      const title=document.createElement('h3');title.textContent=q.word;
      el.append(pill,title);
      if(q.taskType==='context'){
        el.append(element('p','context-scene-review',q.contextTitle+': '+q.stem));
      }
      if(q.kind==='expression'){
        const scene=element('p','expression-scene-mini',q.scene);
        el.append(scene);
      }
      if(outcome==='wrong'){
        const chosen=document.createElement('p');chosen.textContent='Ditt svar: '+game.selected[q.id];el.append(chosen);
      }
      const def=document.createElement('p');def.textContent='Betydelse: '+q.definition;
      const example=document.createElement('p');example.textContent='Exempel: '+q.example;
      el.append(def,example);
      if(q.taskType==='context')el.append(element('p','context-review-why','💡 Därför passar ordet: '+q.contextWhy));
      if(q.taskType==='order')el.append(element('p','mission-done','Rätt ordning: '+q.correctOrder.join(' → ')));
      if(q.taskType==='sentence')el.append(element('p','mission-done','Rätt mening: '+q.options.find(o=>o.correct).label));
      if(q.kind==='expression'){
        const comicToggle=element('details','comic-review');
        const summary=element('summary','','🎁 Öppna luckan – serie och miniuppdrag');
        const comic=element('div','comic-strip');
        C.render(comic,q,comics);
        const bonus=element('div','review-bonus');makeBonus(bonus,q.id);
        comicToggle.append(summary,comic,bonus);
        comicToggle.addEventListener('toggle',()=>{
          if(comicToggle.open){changeDoor('opened',q.id);}
        });
        el.append(comicToggle);
      }
      list.append(el);
    }
  }
  function leaveGame() {
    if(game&&!game.finished && !window.confirm('Vill du avsluta den här ordjakten? Omgångens resultat sparas inte.'))return false;
    stopTimer();clearBurst();game=null;show('home');renderSetup();return true;
  }
  function clearLearningExercise(){
    if(screen==='focus')focusPractice=null;
    if(screen==='aha'){ahaRound=null;$('aha-round-options').replaceChildren();}
    if(screen==='recall'){recallRound=null;$('recall-answer').value='';}
    if(screen==='workshop'){workshop=null;$('workshop-reflection').value='';$('workshop-feedback-body').replaceChildren();}
    if(screen==='detector'){detectorRound=null;$('detector-word-options').replaceChildren();$('detector-clue-options').replaceChildren();}
    if(screen==='concepts'){conceptMap=null;$('concepts-list').replaceChildren();$('concepts-options').replaceChildren();$('bridges-options').replaceChildren();}
  }
  function goNav(name){
    clearLearningExercise();
    if(journey){journey=null;resetJourneyControls();}
    journeyStory=null;journeyKeepsake=null;
    if(screen==='play'&&!leaveGame())return;
    if(screen==='results'){game=null;}
    if(name==='home')renderSetup();
    show(name);
  }
  function element(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function renderWordList() {
    const query=$('word-search').value.trim().toLocaleLowerCase('sv-SE');
    const filter=$('word-filter').value;
    const type=$('word-type-filter').value;
    const matches=text=>!query || text.toLocaleLowerCase('sv-SE').includes(query);
    const words=type==='expressions'?[]:bank.words.filter(w=>(filter==='all'||w.difficulty===filter)&&
      matches(w.word+' '+w.definition+' '+w.example)).map(entry=>({kind:'word',entry}));
    const phrases=type==='words'||filter!=='all'?[]:expressions.expressions.filter(e=>
      matches(e.phrase+' '+e.scene+' '+e.definition+' '+e.example)).map(entry=>({kind:'expression',entry}));
    const entries=words.concat(phrases);
    const list=$('word-list');list.replaceChildren();
    for(const item of entries.slice(0,wordListLimit)){
      const entry=item.entry;
      const card=element('article','word-item');const row=element('div','word-title');
      const h=element('h2','',item.kind==='expression'?entry.phrase:entry.word);
      const badge=element('span','difficulty-badge',item.kind==='expression'?'💬 Uttryck':labels[entry.difficulty]);
      row.append(h,badge);card.append(row);
      if(item.kind==='expression')card.append(element('p','expression-scene-mini',entry.scene));
      card.append(element('p','',entry.definition),element('p','word-sample',entry.example));
      list.append(card);
    }
    $('word-count').textContent=`Visar ${Math.min(entries.length,wordListLimit)} av ${entries.length} ord och uttryck.`;
    $('more-words').hidden=entries.length<=wordListLimit;
  }
  function renderHistory() {
    const list=$('history-list');list.replaceChildren();
    if(history.results.length===0){list.append(element('p','muted','Inga resultat sparade ännu. Spela en omgång så visas den här!'));return;}
    history.results.slice().reverse().forEach(result=>{
      const row=element('div','history-item');const left=element('div');
      const title=element('div','',labels[result.level]||'Ordjakten');title.style.fontWeight='800';
      const adventure=result.adventure?' · '+A.world(result.adventure).short:'';
      const meta=element('small','',new Date(result.finishedAt).toLocaleDateString('sv-SE')+' · '+(result.mode==='test'?'Testa dig':'Träna')+' · '+result.total+' frågor · '+(topicLabels[result.topic]||'Ord')+adventure);
      const rate=element('strong','',Math.round(result.total?result.right/result.total*100:0)+' %');
      const detail=element('small','',`⭐ ${result.right} · ${result.right} rätt · ${result.wrong} fel · ${result.unanswered} obesvarade`);
      left.append(title,meta);const right=element('div');right.style.textAlign='right';right.append(rate,element('br'),detail);row.append(left,right);list.append(row);
    });
  }
  function exportHistory() {
    const data={app:'Ordjakten',exportedAt:new Date().toISOString(),results:history.results,mistakes:history.mistakes,surprises:history.surprises,missionProgress:history.missionProgress,questCounts:history.questCounts,reviewProgress:history.reviewProgress,skillProgress:history.skillProgress,readingProgress:history.readingProgress,recallProgress:history.recallProgress,detectorProgress:history.detectorProgress,detectorLevels:history.detectorLevels,conceptProgress:history.conceptProgress,bridgeProgress:history.bridgeProgress,feedbackProgress:history.feedbackProgress,practiceBalance:history.practiceBalance,adventureChallenge:history.adventureChallenge,storyProgress:history.storyProgress,confusionProgress:history.confusionProgress,clueProgress:history.clueProgress,retentionProgress:history.retentionProgress};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ordjakten-resultat.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>goNav(btn.dataset.nav)));
  $('brand').addEventListener('click',e=>{e.preventDefault();goNav('home');});
  $('view-home').addEventListener('click',event=>{
    const button=event.target.closest('button.adventure-choice[data-adventure]');
    if(button&&$('view-home').contains(button))setSettings({adventure:button.dataset.adventure});
  });
  document.querySelectorAll('[data-companion]').forEach(btn=>btn.addEventListener('click',()=>setSettings({companion:btn.dataset.companion})));
  $('play-sounds').addEventListener('change',e=>setSettings({sound:e.target.checked}));
  document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>setSettings({mode:btn.dataset.mode})));
  document.querySelectorAll('[data-topic]').forEach(btn=>btn.addEventListener('click',()=>setSettings({topic:btn.dataset.topic,reviewOnly:false})));
  document.querySelectorAll('[data-expression-task]').forEach(btn=>btn.addEventListener('click',()=>setSettings({expressionTask:btn.dataset.expressionTask})));
  $('mission-hints').addEventListener('change',e=>setSettings({missionHints:e.target.checked}));
  $('context-mix').addEventListener('change',e=>setSettings({contextMix:e.target.checked}));
  $('adaptive-practice').addEventListener('change',e=>setSettings({adaptivePractice:e.target.checked})); 
  document.querySelectorAll('[data-level]').forEach(btn=>btn.addEventListener('click',()=>setSettings({difficulty:btn.dataset.level,reviewOnly:false})));
  document.querySelectorAll('[data-count]').forEach(btn=>btn.addEventListener('click',()=>setSettings({count:Number(btn.dataset.count)})));
  document.querySelectorAll('[data-timer]').forEach(btn=>btn.addEventListener('click',()=>{
    const timerMode=btn.dataset.timer;
    const seconds=timerMode==='per'?30:timerMode==='total'?180:settings.timerSeconds;
    setSettings({timerMode,timerSeconds:seconds});
  }));
  $('timer-preset').addEventListener('change',()=>{
    const value=$('timer-preset').value;
    if(value==='custom') {$('custom-timer').hidden=false;return;}
    setSettings({timerSeconds:Number(value)});
  });
  for (const input of ['custom-min','custom-sec']) $(input).addEventListener('input',()=>{
    const seconds=currentTimerSeconds();
    if(seconds>0 && seconds<=(settings.timerMode==='per'?600:3600)){
      settings.timerSeconds=seconds; saveHistory();
    }
  });
  document.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.addEventListener('click',()=>setSettings({theme:btn.dataset.themeChoice})));
  $('high-contrast').addEventListener('change',e=>setSettings({contrast:e.target.checked}));
  $('review-only').addEventListener('change',e=>setSettings({reviewOnly:e.target.checked}));
  $('setup-form').addEventListener('submit',event=>{event.preventDefault();startRound();});
  for(const location of ['home','learning'])$('next-journey-'+location+'-start').addEventListener('click',startJourney);
  $('next-journey-skip').addEventListener('click',()=>{if(journey&&!journey.finished)advanceJourney('skipped',journey.steps[journey.index].mode);});
  $('next-journey-stop').addEventListener('click',()=>goNav('learning'));
  $('next-journey-back').addEventListener('click',()=>goNav('learning'));
  for(const location of ['results','journey']){
    $('story-'+location).addEventListener('click',event=>{
      if(screen!==location)return;
      if(event.target.closest('button[data-story-stop]')){goNav('learning');return;}
      const button=event.target.closest('button[data-story-mode]');
      if(button&&$('story-'+location).contains(button))startJourney(button.dataset.storyMode);
    });
    $('story-'+location).addEventListener('change',event=>{
      const select=event.target.closest('select[data-story-world]');
      if(!select||screen!==location||!Story.validWorld(select.value))return;
      setSettings({adventure:select.value});renderStoryOptions(location);
      $('story-world-'+location)?.focus({preventScroll:true});
    });
  }
  for(const location of ['home','learning'])$('concepts-'+location+'-open').addEventListener('click',()=>openConceptMap());
  $('concepts-back').addEventListener('click',leaveConceptMap);
  $('concepts-clear-filter').addEventListener('click',()=>{
    if(!conceptMap||conceptMap.round||conceptMap.bridgeRound)return;
    conceptMap.wordId=null;conceptMap.filter='all';renderConceptMap();
  });
  $('concepts-filters').addEventListener('click',event=>{
    const button=event.target.closest('button[data-concept-type]');
    if(!button||!conceptMap||conceptMap.round||conceptMap.bridgeRound)return;
    const type=button.dataset.conceptType;
    if(type!=='all'&&!Object.hasOwn(Concepts.TYPES,type))return;
    conceptMap.filter=type;renderConceptMap();
  });
  $('bridges-kind').addEventListener('change',()=>{
    if(!conceptMap||conceptMap.round||conceptMap.bridgeRound)return;
    const kind=$('bridges-kind').value;
    conceptMap.bridgeKind=Object.hasOwn(Bridges.TYPES,kind)?kind:'all';renderBridgePreview();
  });
  $('bridges-quick').addEventListener('click',startBridgeRound);
  $('bridges-options').addEventListener('click',selectBridge);
  $('bridges-help').addEventListener('click',bridgeHelp);
  $('bridges-check').addEventListener('click',checkBridge);
  $('bridges-reveal').addEventListener('click',()=>{
    if(bridgeTask())finishBridge(conceptMap.bridgeRound.previewed?'previewed':'supported');
  });
  $('bridges-next').addEventListener('click',advanceBridge);
  $('bridges-done').addEventListener('click',()=>doneLearningExercise('bridge',()=>{renderConceptMap();$('concepts-title').focus({preventScroll:true});scrollTop();}));
  $('concepts-quick').addEventListener('click',()=>startConceptRound());
  $('concepts-list').addEventListener('click',event=>{
    const button=event.target.closest('button[data-concept-practice]');
    if(button&&!button.disabled)startConceptRound(button.dataset.conceptPractice);
  });
  $('concepts-options').addEventListener('click',event=>{
    const button=event.target.closest('button[data-concept-answer]');
    if(button&&$('concepts-options').contains(button))answerConcept(button.dataset.conceptAnswer);
  });
  $('concepts-reveal').addEventListener('click',()=>{
    const task=conceptTask();
    if(task)finishConcept(conceptMap.round.previewed?'previewed':'supported');
  });
  $('concepts-next').addEventListener('click',advanceConcept);
  $('concepts-done').addEventListener('click',()=>doneLearningExercise('concept',()=>{renderConceptMap();$('concepts-title').focus({preventScroll:true});scrollTop();}));
  for(const location of ['home','learning'])$('detector-'+location+'-start').addEventListener('click',()=>startDetector());
  $('detector-read').addEventListener('click',revealDetectorWord);
  $('detector-word-options').addEventListener('click',event=>{
    const button=event.target.closest('button[data-detector-word]');
    if(button&&$('detector-word-options').contains(button))answerDetectorWord(button.dataset.detectorWord);
  });
  $('detector-clue-options').addEventListener('click',event=>{
    const button=event.target.closest('button[data-detector-quote]');
    if(button&&$('detector-clue-options').contains(button))answerDetectorQuote(Number(button.dataset.detectorQuote));
  });
  $('detector-clue-check').addEventListener('click',()=>checkDetectorQuotes());
  $('detector-help').addEventListener('click',detectorHelp);
  $('detector-reveal').addEventListener('click',()=>finishDetectorStory('supported'));
  $('detector-next').addEventListener('click',advanceDetector);
  $('detector-back').addEventListener('click',leaveDetector);
  $('detector-done').addEventListener('click',()=>doneLearningExercise('detector',leaveDetector));
  for(const location of ['home','learning'])$('workshop-'+location+'-start').addEventListener('click',()=>startWorkshop());
  $('workshop-pieces').addEventListener('click',event=>{
    const button=event.target.closest('button[data-workshop-piece]');
    if(!button||button.disabled||workshop?.stage!=='task'||workshopTask()?.type!=='build')return;
    const id=Number(button.dataset.workshopPiece);
    if(workshop.selected.includes(id)||!workshopTask().pieces.some(piece=>piece.id===id))return;
    workshop.selected.push(id);drawWorkshopPieces();
    const next=$('workshop-pieces').querySelector('button:not(:disabled)')||$('workshop-build-check');
    next.focus({preventScroll:true});
  });
  $('workshop-build-undo').addEventListener('click',()=>{
    if(workshop?.stage==='task'&&workshopTask()?.type==='build'){workshop.selected.pop();drawWorkshopPieces();}
  });
  $('workshop-build-reset').addEventListener('click',()=>{
    if(workshop?.stage==='task'&&workshopTask()?.type==='build'){workshop.selected=[];drawWorkshopPieces();}
  });
  $('workshop-build-check').addEventListener('click',checkWorkshopBuild);
  $('workshop-build-show').addEventListener('click',()=>{
    if(workshop?.stage!=='task'||workshopTask()?.type!=='build')return;
    $('workshop-build-example').hidden=false;$('workshop-build-show').hidden=true;
  });
  $('workshop-repair-choices').addEventListener('click',event=>{
    const button=event.target.closest('button[data-workshop-scene]');
    if(button&&$('workshop-repair-choices').contains(button))answerWorkshopRepair(Number(button.dataset.workshopScene));
  });
  $('workshop-reflection-show').addEventListener('click',()=>{
    if(workshop?.stage!=='task'||workshopTask()?.type!=='reflect')return;
    $('workshop-reflection-example').hidden=false;$('workshop-reflection-show').hidden=true;
  });
  $('workshop-reflection-done').addEventListener('click',finishWorkshop);
  $('workshop-next').addEventListener('click',advanceWorkshop);
  $('workshop-back').addEventListener('click',leaveWorkshop);
  $('workshop-done').addEventListener('click',()=>doneLearningExercise('workshop',leaveWorkshop));
  for(const location of ['home','learning'])$('recall-'+location+'-start').addEventListener('click',()=>startRecall());
  $('recall-form').addEventListener('submit',event=>{event.preventDefault();submitRecall();});
  $('recall-hint').addEventListener('click',giveRecallHint);
  $('recall-reveal').addEventListener('click',()=>completeRecall(false));
  $('recall-next').addEventListener('click',advanceRecall);
  $('recall-back').addEventListener('click',leaveRecall);
  $('recall-done').addEventListener('click',()=>doneLearningExercise('recall',leaveRecall));
  for(const location of ['home','learning'])$('aha-'+location+'-start').addEventListener('click',()=>startAhaRound());
  $('aha-round-back').addEventListener('click',leaveAhaRound);
  $('aha-round-done').addEventListener('click',()=>doneLearningExercise('aha',leaveAhaRound));
  $('aha-round-reveal').addEventListener('click',revealAhaQuestion);
  $('aha-round-next').addEventListener('click',advanceAhaRound);
  $('aha-round-options').addEventListener('click',event=>{
    const button=event.target.closest('button[data-aha-option]');
    if(button&&$('aha-round-options').contains(button))answerAhaRound(Number(button.dataset.ahaOption));
  });
  window.addEventListener('focus',()=>{
    if(screen==='home'||screen==='learning'){const plan=renderAhaPreview();renderRecallPreview();renderDetectorPreview();renderMemoryPreview(plan);renderKnowledgePreview();}
  });
  $('open-learning-home').addEventListener('click',()=>goNav('learning'));
  $('open-learning-results').addEventListener('click',()=>goNav('learning'));
  $('learning-back').addEventListener('click',()=>goNav('home'));
  $('learning-search').addEventListener('input',()=>{learningLimit=18;renderLearning();});
  $('learning-kind').addEventListener('change',()=>{learningLimit=18;renderLearning();});
  document.querySelectorAll('[data-learning-status]').forEach(button=>button.addEventListener('click',()=>{
    learningFilter=button.dataset.learningStatus;learningLimit=18;renderLearning();
  }));
  $('learning-more').addEventListener('click',()=>{learningLimit=Math.min(learningLimit+18,learningCatalog.length);renderLearning();});
  $('learning-list').addEventListener('click',event=>{
    const conceptButton=event.target.closest('button[data-concept-word]');
    if(conceptButton&&$('learning-list').contains(conceptButton)){openConceptMap(conceptButton.dataset.conceptWord);return;}
    const detectiveButton=event.target.closest('button[data-detector-target]');
    if(detectiveButton&&$('learning-list').contains(detectiveButton)){startDetector(detectiveButton.dataset.detectorTarget);return;}
    const workshopButton=event.target.closest('button[data-workshop-word]');
    if(workshopButton&&$('learning-list').contains(workshopButton)){startWorkshop(workshopButton.dataset.workshopWord);return;}
    const recallButton=event.target.closest('button[data-recall-word]');
    if(recallButton&&$('learning-list').contains(recallButton)){startRecall(recallButton.dataset.recallWord);return;}
    const ahaButton=event.target.closest('button[data-aha-word]');
    if(ahaButton&&$('learning-list').contains(ahaButton)){startAhaRound(ahaButton.dataset.ahaWord);return;}
    const focusButton=event.target.closest('button[data-focus-id]');
    if(focusButton&&$('learning-list').contains(focusButton)){
      startFocus(focusButton.dataset.focusId,focusButton.dataset.focusSkill);return;
    }
    const button=event.target.closest('button[data-learning-open]');
    if(!button||!$('learning-list').contains(button))return;
    const details=button.parentElement.querySelector('.learning-word-detail');
    details.hidden=!details.hidden;button.setAttribute('aria-expanded',String(!details.hidden));
  });
  $('learning-home-focus-start').addEventListener('click',event=>{
    startFocus(event.currentTarget.dataset.focusId,event.currentTarget.dataset.focusSkill);
  });
  $('focus-back').addEventListener('click',backToFocusWord);
  $('focus-done').addEventListener('click',()=>doneLearningExercise('focus',backToFocusWord));
  $('focus-other-skill').addEventListener('click',()=>{
    if(journey||!focusPractice||!focusPractice.finished)return;
    const f=focusPractice;
    startFocus(f.item.id,f.types[(f.types.indexOf(f.chosen)+1)%f.types.length]);
  });
  $('focus-next').addEventListener('click',()=>{
    if(!focusPractice||!focusPractice.answered)return;
    if(focusPractice.index===focusPractice.questions.length-1)finishFocus();
    else{focusPractice.index++;renderFocusQuestion();}
  });
  $('focus-choices').addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button||!focusPractice||focusPractice.answered)return;
    if(button.hasAttribute('data-focus-choice'))answerFocus(Number(button.dataset.focusChoice));
    if(button.hasAttribute('data-focus-step')){
      const index=Number(button.dataset.focusStep);
      if(!focusPractice.selected.includes(index)&&focusPractice.selected.length<3){
        focusPractice.selected.push(index);drawFocusOrder();
      }
    }
  });
  $('focus-undo').addEventListener('click',()=>{
    if(focusPractice&&!focusPractice.answered&&focusPractice.selected.length){focusPractice.selected.pop();drawFocusOrder();}
  });
  $('focus-reset').addEventListener('click',()=>{
    if(focusPractice&&!focusPractice.answered){focusPractice.selected=[];drawFocusOrder();}
  });
  $('focus-check-order').addEventListener('click',()=>answerFocus());
  $('open-book-home').addEventListener('click',openBook);
  $('results-book').addEventListener('click',openBook);
  $('book-go-home').addEventListener('click',()=>{renderSetup();show('home');});
  $('book-start-expressions').addEventListener('click',()=>{
    setSettings({mode:'train',topic:'expressions',difficulty:'medium',count:5,timerMode:'off',reviewOnly:false});startRound();
  });
  $('book-grid').addEventListener('click',event=>{
    const button=event.target.closest('button[data-door-id]');
    if(!button || button.disabled)return;
    selectedBookDoor=button.dataset.doorId;
    changeDoor('opened',selectedBookDoor);
    renderBook();
    $('book-phrase').setAttribute('tabindex','-1');$('book-phrase').focus({preventScroll:true});
    $('book-detail').scrollIntoView({behavior:'auto',block:'start'});
  });
  for(const id of ['expression-bonus','book-bonus','review-list'])$(id).addEventListener('click',gradeBonus);
  $('expression-open').addEventListener('click',()=>{
    if(!game||!game.feedback||game.settings.mode!=='train')return;
    const q=game.questions[game.index];if(q.kind!=='expression')return;
    const body=$('expression-surprise-body');
    if(body.hidden){
      changeDoor('opened',q.id);
      if(!$('expression-comic').children.length){C.render($('expression-comic'),q,comics);makeBonus($('expression-bonus'),q.id);}
      body.hidden=false;
      $('expression-open').setAttribute('aria-expanded','true');
      $('expression-open').textContent='📖 Stäng luckan';
    }else{
      body.hidden=true;
      $('expression-open').setAttribute('aria-expanded','false');
      $('expression-open').textContent='🎁 Öppna luckan igen';
    }
  });
  for(const id of ['quest-home-buttons','quest-result-buttons'])$(id).addEventListener('click',event=>{
    const button=event.target.closest('button[data-start-quest]');
    if(button&&!button.disabled&&$(id).contains(button))startQuest(button.dataset.startQuest);
  });
  $('quest-surprise').addEventListener('click',()=>{
    const id=J.chooseSurprise(settings,history.mistakes,bank,curation,expressions,E,Math.random,history.reviewProgress);
    startQuest(id);
  });
  $('quick-start').addEventListener('click',()=>{ 
    setSettings({mode:'train',topic:'words',difficulty:'easy',count:10,timerMode:'off',reviewOnly:false});
    startRound();
  });
  $('retention-home-list').addEventListener('click',event=>{
    const button=event.target.closest('button[data-retention-pair]');
    if(!button||!$('retention-home-list').contains(button))return;
    const pair=contrasts.pairs.find(item=>item.id===button.dataset.retentionPair);
    if(pair&&U.due(history.retentionProgress?.[pair.id]))startFocus(pair.left,'contrast');
  });
  $('confusion-list').addEventListener('click',event=>{
    const button=event.target.closest('button[data-confusion-pair]');
    if(!button||!$('confusion-list').contains(button))return;
    const pair=contrasts.pairs.find(item=>item.id===button.dataset.confusionPair);
    if(pair)startFocus(pair.left,'contrast');
  });
  $('quick-contrast').addEventListener('click',()=>{
    const pair=K.choose(contrasts,history.skillProgress,Math.random,
      {starterOnly:true,confusions:history.confusionProgress,confusionLib:H});
    if(pair)startFocus(pair.left,'contrast');
  });
  $('quick-contexts').addEventListener('click',()=>{
    setSettings({mode:'train',topic:'words',difficulty:'medium',count:5,timerMode:'off',reviewOnly:false,contextMix:true});
    startRound(null,{contextOnly:true});
  });
  $('quick-expressions').addEventListener('click',()=>{
    setSettings({mode:'train',topic:'expressions',difficulty:'medium',count:5,timerMode:'off',reviewOnly:false});
    startRound();
  });
  $('exam-preset').addEventListener('click',()=>{
    setSettings({mode:'test',topic:'words',difficulty:'exam',count:10,timerMode:'total',timerSeconds:180,reviewOnly:false});
    $('start').focus();
  });
  $('leave').addEventListener('click',leaveGame);
  $('order-choices').addEventListener('click',event=>{
    const btn=event.target.closest('button[data-order-step]');
    if(!btn||!game||game.finished||game.feedback||game.questions[game.index].taskType!=='order')return;
    const key=Number(btn.dataset.orderStep);
    if(!orderSelection.includes(key)&&orderSelection.length<3){orderSelection.push(key);drawMainOrderSelection(game.questions[game.index]);}
  });
  $('order-undo').addEventListener('click',()=>{if(!game||game.feedback||game.finished)return;orderSelection.pop();drawMainOrderSelection(game.questions[game.index]);});
  $('order-reset').addEventListener('click',()=>{if(!game||game.feedback||game.finished)return;orderSelection=[];drawMainOrderSelection(game.questions[game.index]);});
  $('order-submit').addEventListener('click',()=>{if(orderSelection.length===3)submit(-2);});
  $('answer-options').addEventListener('click',event=>{
    const target=event.target.closest('button[data-option]');
    if(target && $('answer-options').contains(target))submit(Number(target.dataset.option));
  });
  $('reading-start').addEventListener('click',revealReadingCheck);
  $('reading-reread').addEventListener('click',()=>{
    if(!game||!game.feedback||!readingCheck||$('reading-check').dataset.complete==='true')return;
    $('reading-check').hidden=true;
    $('reading-launch').hidden=false;
    $('feedback-area').dataset.readingStage='reread';
    $('feedback-reading-stage').textContent='📖 Läs gärna en gång till';
    $('reading-launch-prompt').textContent='Läs igen i din egen takt. När du vill kan du gå tillbaka till Aha-frågan.';
    $('reading-start').textContent='🧠 Tillbaka till Aha-frågan →';
    $('explanation-word').focus({preventScroll:true});
    if(typeof $('explanation-word').scrollIntoView==='function')
      $('explanation-word').scrollIntoView({behavior:'auto',block:'start'});
  });
  $('listen-story').hidden=!canReadAloud;
  $('listen-explanation').hidden=!canReadAloud;
  $('listen-story').addEventListener('click',()=>{
    speakReadAloud(storyReadAloudText(),$('listen-story'));
  });
  $('listen-explanation').addEventListener('click',()=>{
    speakReadAloud(explanationReadAloudText(),$('listen-explanation'));
  });
  window.addEventListener('pagehide',stopReadAloud);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stopReadAloud();
  });
  $('story-reveal').addEventListener('click',()=>{
    if(!game||game.finished||game.feedback)return;
    $('story-reveal').hidden=true;
    $('story-help').hidden=true;
    $('reading-stage').textContent='🎯 Steg 2: Välj svar';
    $('view-play').dataset.readingPhase='choices';
    $('answer-step').hidden=false;
    const q=game.questions[game.index];
    $('answer-options').hidden=q.taskType==='order';
    $('order-area').hidden=q.taskType!=='order';
    const first=$('answer-options').querySelector('button')||$('order-area').querySelector('button');
    if(first)first.focus({preventScroll:true});
    // Keep the story visible while choosing, rather than scrolling past it.
    if(typeof $('reading-story').scrollIntoView==='function')
      $('reading-story').scrollIntoView({behavior:'auto',block:'start'});
  });
  $('reading-options').addEventListener('click',event=>{
    const button=event.target.closest('button[data-reading-option]');
    if(button && !button.disabled && $('reading-options').contains(button))
      answerReadingCheck(Number(button.dataset.readingOption));
  });
  $('next').addEventListener('click',()=>{
    if(game&&game.feedback&&(!readingCheck||$('reading-check').dataset.complete==='true'))advance();
  });
  $('play-again').addEventListener('click',()=>{
    if(settings.reviewOnly){const pool=E.getTopicPool(bank,curation,expressions,settings);if(!readyReviewCount(pool))settings.reviewOnly=false;}
    startRound();
  });
  $('change-settings').addEventListener('click',()=>{game=null;renderSetup();show('home');});
  $('word-search').addEventListener('input',()=>{wordListLimit=24;renderWordList();});
  $('word-filter').addEventListener('change',()=>{wordListLimit=24;renderWordList();});
  $('word-type-filter').addEventListener('change',()=>{wordListLimit=24;renderWordList();});
  $('more-words').addEventListener('click',()=>{wordListLimit+=24;renderWordList();});
  $('export-history').addEventListener('click',exportHistory);
  $('clear-history').addEventListener('click',()=>{
    if(!window.confirm('Vill du radera sparade resultat, repetitionsplan, öppnade luckor och uppdragsstjärnor? Detta går inte att ångra.'))return;
    for(const key of Object.keys(journeyUsage))delete journeyUsage[key];journeyWorkshopSeen.clear();
    history.results=[];history.mistakes={};history.surprises={unlocked:[],opened:[],mastered:[]};history.missionProgress={};history.questCounts=J.sanitizeCounts(null);history.reviewProgress=R.sanitize(null);history.skillProgress=D.sanitize(null);history.readingProgress=B.sanitizeProgress(null);history.recallProgress=Recall.sanitize(null,learningCatalog);history.detectorProgress=Detector.sanitize(null,detectorCatalog);history.detectorLevels=Detector.sanitizeLevels(null,detectorCatalog);history.conceptProgress=Concepts.sanitize(null,conceptCatalog.tasks);history.bridgeProgress=Concepts.sanitize(null,bridgeCatalog.tasks);history.feedbackProgress=Feedback.sanitize(null,feedbackCatalog);history.practiceBalance=Balance.sanitize(null);history.adventureChallenge=Challenge.sanitize(null);history.storyProgress=Story.sanitize(null);history.confusionProgress=H.sanitize(null,contrastHistoryData);history.clueProgress=T.sanitize(null,clues);history.retentionProgress=U.sanitize(null,contrastHistoryData);selectedBookDoor=null;missionChoices.clear();settings.reviewOnly=false;saveHistory();renderHistory();updateBookCounters();renderQuestShelf();renderLearningPreview();
  });
  createAdventureChoices();renderSetup();show('home');
  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();
