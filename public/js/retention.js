/* Ordjakten 0.20 – frivilliga återbesök som testar minne över tid.
 * Allt beräknas i webbläsaren. Vi lagrar bara ordpars-ID:n, scen-ID:n och
 * tidpunkter; aldrig barns namn, svarstext eller personuppgifter.
 * Ett kort spelpass är EN observation – fyra frågor blir aldrig fyra dagar.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenRetention = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const DAY = 24 * 60 * 60 * 1000;
  const MAX_TIME = 4102444800000;
  const STAGES = Object.freeze([
    '🌱 Inte återbesökt än',
    '🔎 Provat båda orden',
    '🧠 Kom ihåg nästa gång',
    '🌟 Kom ihåg efter flera dagar'
  ]);
  const GOALS = Object.freeze([
    'Prova båda orden i några olika miljöer.',
    'Kom tillbaka en annan dag och läs nya berättelser.',
    'Försök igen efter några dagar, med ännu färre ledtrådar.',
    'Fortsätt ibland med nya berättelser för att hålla orden levande.'
  ]);
  const isTime = value => Number.isSafeInteger(value) && value >= 0 && value <= MAX_TIME;
  const asCount = (value,max) => Number.isSafeInteger(value) && value>=0?Math.min(value,max):0;
  function sanitize(raw, contrasts) {
    const output=Object.create(null);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return output;
    for (const pair of contrasts?.pairs || []) {
      const src=raw[pair.id];
      if(!src || typeof src !== 'object' || Array.isArray(src))continue;
      const stage=Number.isInteger(src.stage)&&src.stage>=0&&src.stage<=3?src.stage:0;
      const lastAt=isTime(src.lastAt)?src.lastAt:0;
      const dueAt=stage>0&&isTime(src.dueAt)&&src.dueAt>=lastAt?src.dueAt:null;
      if(stage>0&&dueAt===null)continue;
      const validScenes=new Set((pair.scenes||[]).map(scene=>scene.id));
      const lastScenes=[...new Set((Array.isArray(src.lastScenes)?src.lastScenes:[])
        .filter(id=>typeof id==='string'&&validScenes.has(id)))].slice(0,4);
      const contexts=['hem','skola','natur','fritid'];
      const verifiedContexts=[...new Set((Array.isArray(src.verifiedContexts)?src.verifiedContexts:[])
        .filter(x=>contexts.includes(x)))];
      const lastScore=src.lastScore===null?null:
        Number.isInteger(src.lastScore)&&src.lastScore>=0&&src.lastScore<=4?src.lastScore:null;
      output[pair.id]={stage,visits:asCount(src.visits,999),lastAt,dueAt,
        lastScore,lastLevel:[1,2,3].includes(src.lastLevel)?src.lastLevel:1,
        lastScenes,verifiedContexts};
    }
    return output;
  }
  function matchingScene(pair,q) {
    const scene=pair.scenes?.find(s=>s.id===q?.contrastSceneId);
    if(!scene||scene.target!==q.id||scene.context!==q.contrastContext||scene.text!==q.stem)return null;
    const prefix='ld-'+pair.id.slice(3)+'-';
    const expected=scene.id.startsWith(prefix)?Number(scene.id.slice(prefix.length).split('-')[0]):1;
    return (q.contrastClueLevel||1)===expected?scene:null;
  }
  function validRound(questions,answers,contrasts) {
    if(!Array.isArray(questions)||questions.length!==4||!Array.isArray(answers)||answers.length!==4||
      answers.some(value=>!['right','wrong'].includes(value)))return null;
    const pair=contrasts?.pairs?.find(p=>p.id===questions[0]?.contrastPair);
    if(!pair)return null;
    const seen=new Set(),contexts=new Set(),count={[pair.left]:0,[pair.right]:0};
    const tier=questions[0].contrastClueLevel||1;
    if(![1,2,3].includes(tier))return null;
    for(const q of questions){
      if(q?.taskType!=='contrast'||q.contrastPair!==pair.id||q.contrastClueLevel!==tier||
        !Object.hasOwn(count,q.id)||!matchingScene(pair,q)||seen.has(q.contrastSceneId)||
        !Array.isArray(q.options)||q.options.length!==2||new Set(q.options.map(opt=>opt.id)).size!==2||
        q.options.some(opt=>!Object.hasOwn(count,opt.id)||opt.correct!==(opt.id===q.id)))return null;
      seen.add(q.contrastSceneId);contexts.add(q.contrastContext);count[q.id]++;
    }
    if(count[pair.left]!==2||count[pair.right]!==2||contexts.size<3)return null;
    return {pair,level:tier,sceneIds:[...seen],contexts:[...contexts],score:answers.filter(v=>v==='right').length,
      both:[pair.left,pair.right].every(id=>questions.some((q,i)=>q.id===id&&answers[i]==='right'))};
  }
  function requiredLevel(pair,nextStage,curated) {
    // Bara de fyra genomarbetade paren har en trestegs ledtrådstrappa.
    const supported=!!curated?.pairs?.some(entry=>entry.id===pair.id);
    return !supported?1:nextStage===1?1:nextStage===2?2:3;
  }
  function recordRound(raw,questions,answers,contrasts,curated=null,now=Date.now()) {
    const round=validRound(questions,answers,contrasts);
    if(!round||!isTime(now))return raw;
    const cards=sanitize(raw,contrasts);
    const prior=cards[round.pair.id];
    if(prior&&now<=prior.lastAt)return raw;
    // Repetition i förtid ger gärna mer träning, men aldrig extra dagars framsteg.
    if(prior?.stage>0&&now<prior.dueAt)return raw;
    const stage=prior?.stage||0;
    const fresh=!prior?.lastScenes.length||round.sceneIds.every(id=>!prior.lastScenes.includes(id));
    const pass=round.score>=3&&round.both&&fresh&&
      round.level>=requiredLevel(round.pair,Math.min(3,stage+1),curated);
    const nextStage=pass?Math.min(3,stage+1):stage;
    // Ett nytt avklarat steg: 1 dag, 3 dagar, därefter 7/14 dagar.
    // Om ett återbesök går tungt: behåll upptäckterna och prova en annan dag.
    const delay=pass?(stage===0?DAY:stage===1?3*DAY:stage===2?7*DAY:14*DAY):DAY;
    const dueAt=nextStage>0?Math.min(MAX_TIME,now+delay):null;
    const contexts=pass?[...new Set([...(prior?.verifiedContexts||[]),...round.contexts])]:
      (prior?.verifiedContexts||[]);
    cards[round.pair.id]={stage:nextStage,visits:Math.min(999,(prior?.visits||0)+1),
      lastAt:now,dueAt,lastScore:round.score,lastLevel:round.level,
      lastScenes:round.sceneIds,verifiedContexts:contexts};
    return cards;
  }
  function due(card,now=Date.now()) {
    return !!card&&card.stage>0&&isTime(card.dueAt)&&isTime(now)&&now>=card.dueAt;
  }
  function summary(contrasts,cards={},now=Date.now()) {
    const current=sanitize(cards,contrasts);
    const rows=(contrasts?.pairs||[]).map(pair=>({pair,card:current[pair.id]}))
      .filter(row=>row.card?.stage>0);
    const ready=rows.filter(row=>due(row.card,now))
      .sort((a,b)=>a.card.dueAt-b.card.dueAt||a.pair.id.localeCompare(b.pair.id));
    const waiting=rows.filter(row=>!due(row.card,now))
      .sort((a,b)=>a.card.dueAt-b.card.dueAt||a.pair.id.localeCompare(b.pair.id));
    return {started:rows.length,ready:ready.length,waiting:waiting.length,
      returning:rows.filter(x=>x.card.stage>=2).length,
      later:rows.filter(x=>x.card.stage>=3).length,
      nextDue:waiting[0]?.card.dueAt??null,readyPairs:ready,waitingPairs:waiting};
  }
  function note(card,now=Date.now()) {
    if(!card||!card.stage)return 'Prova de här två orden i flera miljöer och se vad du upptäcker.';
    if(due(card,now))return '🎁 En ny omgång väntar! Prova andra berättelser och se vad du minns.';
    const remaining=Math.max(0,card.dueAt-now);
    const day=Math.ceil(remaining/DAY);
    return remaining<DAY? '⏳ Ett nytt återbesök väntar senare. Du får gärna öva ändå.':
      `⏳ Nästa föreslagna återbesök om ungefär ${day} ${day===1?'dag':'dagar'}. Du måste inte spela då.`;
  }
  return {DAY,STAGES,GOALS,sanitize,validRound,requiredLevel,recordRound,due,summary,note};
});
