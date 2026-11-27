/* A second, unscored learning step. Never invent a story at runtime:
 * use edited examples for expressions and word contexts, or definitions
 * already vetted for the original multiple-choice question. */
(function (root, factory) {
  const memory=typeof module!=='undefined'&&module.exports?require('./spaced-memory'):root.OrdjaktenMemory;
  const api = factory(memory);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenReading = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Memory) {
  'use strict';
  function choose(items, random) {
    if (!items.length) return null;
    return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
  }

  function shuffle(items, random) {
    const copy=items.slice();
    for(let i=copy.length-1;i>0;i--){
      const j=Math.min(i,Math.floor(random()*(i+1)));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  }
  function makeChallenge(prompt,right,distractors,source,random,why,evidence='') {
    if(!right||typeof right!=='string')return null;
    const wrong=[];
    for(const item of distractors){
      if(typeof item==='string'&&item&&item!==right&&!wrong.includes(item))wrong.push(item);
    }
    if(!wrong.length)return null;
    const options=shuffle([{label:right,correct:true},
      ...shuffle(wrong,random).slice(0,2).map(label=>({label,correct:false}))],random);
    return {prompt,options,source,why:why||'',evidence};
  }
  // Presentation only: raw labels remain the identity used by novelty checks,
  // corrections and authored evidence. Never shorten mismatched instructions.
  function formatSchoolAnswers(options,enabled=true) {
    const unchanged={instruction:'',options};
    if(!enabled||!Array.isArray(options)||!options.length)return unchanged;
    const separator='” – ';
    const parts=[];
    for(const option of options){
      if(typeof option?.label!=='string')return unchanged;
      const at=option.label.indexOf(separator);
      if(at<1||!option.label.slice(0,at).replace(/[“”]/gu,'').trim())return unchanged;
      const instruction=option.label.slice(0,at+1);
      const displayLabel=option.label.slice(at+separator.length);
      if(!displayLabel.trim()||parts.length&&instruction!==parts[0].instruction)return unchanged;
      parts.push({instruction,displayLabel});
    }
    return {instruction:parts[0].instruction,
      options:options.map((option,index)=>({...option,displayLabel:parts[index].displayLabel}))};
  }
  function makeCheck(question,{bank,contexts,surprises,missions,readingProgress=null,random=Math.random,selectScene=null}={}) {
    if(!question||!question.id||!question.definition)return null;
    const word=question.word;
    const transfer=readingProgress?.[question.id]?.transfer;
    const lastEvidence=transfer?.lastEvidence;
    const proofs=new Set(Array.isArray(transfer?.proofs)&&transfer.quality<2?transfer.proofs:[]);
    if(question.kind==='expression'){
      const challenge=surprises?.challenges?.find(x=>x.id===question.id);
      const mission=missions?.missions?.find(x=>x.id===question.id);
      const school=question.schoolInstruction===true||typeof challenge?.ahaDistractor==='string';
      const candidates=[];
      const surpriseRight=challenge?.options?.find(x=>x.correct===true)?.label;
      const sentenceRight=mission?.sentences?.find(x=>x.correct===true)?.label;
      if(surpriseRight)candidates.push({label:surpriseRight,key:'expression:challenge',why:challenge?.explanation});
      if(sentenceRight && sentenceRight!==surpriseRight)
        candidates.push({label:sentenceRight,key:'expression:mission',why:school?(mission?.explanation||challenge?.explanation):(mission?.hint||challenge?.explanation)});
      // Aha must not repeat the correct sentence already present among the
      // main question's answer choices. Prefer a genuinely NEW authored scene.
      const shown=new Set((question.options||[]).map(option=>option.label));
      const novelHere=candidates.filter(c=>
        !shown.has(c.label)&&c.label!==question.scene&&c.label!==question.stem);
      // School answers must answer one shared task. Never reuse the task
      // that was already shown merely to fill a missing alternative.
      const eligible=school?novelHere:novelHere.length?novelHere:candidates;
      const fresh=eligible.filter(c=>c.key!==lastEvidence);
      const unproved=fresh.filter(c=>!proofs.has(c.key));
      const picked=choose(unproved.length?unproved:fresh.length?fresh:eligible,random);
      if(!picked)return null;
      const challengeWrong=(challenge?.options||[]).filter(x=>x.correct===false).map(x=>x.label);
      const missionWrong=(mission?.sentences||[]).filter(x=>x.correct===false).map(x=>x.label);
      let wrong=challengeWrong.concat(missionWrong);
      if(school){
        wrong=picked.key==='expression:challenge'?challengeWrong.concat(challenge?.ahaDistractor||[]):missionWrong;
        const prefix=picked.label.split('” – ')[0]+'” – ';
        wrong=[...new Set(wrong)].filter(label=>typeof label==='string'&&label.startsWith(prefix)&&label!==picked.label&&!shown.has(label));
        if(wrong.length!==2)return null; // no invented or cross-task alternatives
      }
      const prompt=school?'Vilket svar följer instruktionen ”'+word+'”?':'Vilken NY situation visar uttrycket ”'+word+'”?';
      const check=makeChallenge(prompt,picked.label,wrong,
        'expression',random,picked.why,picked.key);
      if(!school||!check)return check;
      const formatted=formatSchoolAnswers(check.options);
      return {...check,prompt:formatted.instruction?check.prompt+'\n'+formatted.instruction:check.prompt,
        options:formatted.options,schoolInstruction:true};
    }
    if(question.kind!=='word')return null;
    const scenes=contexts?.wordContexts||[];
    const record=scenes.find(x=>x.id===question.id);
    if(record){
      const fresh=record.scenes.map((scene,index)=>({scene,index})).filter(({scene,index})=>
        index!==question.contextIndex&&scene.text!==question.stem);
      // If a child needed help before, use another AUTHORED scene whenever
      // possible. Store only its index, never the text or the child's answer.
      const unused=fresh.filter(({index})=>'context:'+index!==lastEvidence);
      const unproved=unused.filter(({index})=>!proofs.has('context:'+index));
      const eligible=unproved.length?unproved:unused.length?unused:fresh;
      const preferred=typeof selectScene==='function'?selectScene(record,eligible.map(item=>item.index)):null;
      const target=eligible.find(item=>item.index===preferred)||choose(eligible,random);
      // Only use the separately reviewed Aha allowlist. A wrong word for
      // this scene need not supply a wrong scene for this word.
      const ids=[...new Set(record.readingDistractors||[])].filter(id=>id!==record.id);
      const records=shuffle(ids.map(id=>scenes.find(x=>x.id===id)).filter(x=>x?.scenes?.length),random);
      const wrong=records.map(x=>choose(x.scenes,random)?.text);
      const check=makeChallenge('Vilken ANNAN berättelse visar ordet ”'+word+'”?',
        target?.scene.text,wrong,'context',random,target?.scene.why,
        target?'context:'+target.index:'');
      if(check?.options.length===3)return {...check,sceneIndex:target.index};
    }
    const words=bank?.words||[];
    const safe=[];
    const add=text=>{
      if(text&&text!==question.definition&&!safe.includes(text))safe.push(text);
    };
    for(const answer of question.options||[]){
      if(answer.correct)continue;
      const match=words.find(x=>x.word.toLocaleLowerCase('sv-SE')===
        String(answer.label).toLocaleLowerCase('sv-SE'));
      add(match?.definition||(question.picture||question.action?null:answer.label));
    }
    const own=words.find(x=>x.id===question.id);
    for(const entry of words){
      if(safe.length>=2)break;
      if(entry.id!==question.id&&entry.difficulty!==own?.difficulty)add(entry.definition);
    }
    return makeChallenge('Vilken förklaring hör till ordet ”'+word+'”?',
      question.definition,safe,'meaning',random);
  }
  function isCorrect(check,index) {
    return check?.options?.[index]?.correct === true;
  }
  // Two misses lead to a worked example, not an endless process of elimination.
  function nextStep(attempts,correct) {
    if(correct)return 'complete';
    return attempts>=2?'guided':'reread';
  }
  // Separate, local reading observations. A correct main answer does not
  // mean that a new example was understood. Only the Aha checkpoint updates
  // this record; it never creates grades, extra stars or user profiles.
  const ID=/^(?:sv|ut)-\d{4,}$/;
  const counter=value=>Number.isInteger(value)&&value>=0?Math.min(9999,value):0;
  const DAY_MS=24*60*60*1000;
  const VALID_EVIDENCE={
    word:/^context:[012]$/,
    expression:/^expression:(?:challenge|mission)$/
  };
  const evidenceValid=(id,key)=>typeof key==='string' &&
    (id.startsWith('sv-')?VALID_EVIDENCE.word:VALID_EVIDENCE.expression).test(key);
  const at=value=>Number.isFinite(value)&&value>=0&&value<=4102444800000?Math.floor(value):0;
  function sanitizeProgress(raw) {
    const out=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    for(const [id,value] of Object.entries(raw).slice(0,500)){
      if(!ID.test(id)||!value||typeof value!=='object'||Array.isArray(value))continue;
      const entry=Object.create(null);
      for(const type of ['transfer','recognition']){
        const item=value[type];
        if(!item||typeof item!=='object'||Array.isArray(item))continue;
        const first=counter(item.first),supported=counter(item.supported);
        if(first+supported===0)continue;
        const card={first,supported,streak:Math.min(counter(item.streak),first,99),
          lastAt:at(item.lastAt)};
        // Old records have no "quality" field. Keep their existing mastery
        // behavior rather than discarding a child's earlier achievements.
        if(type==='transfer' && Number.isInteger(item.quality) &&
           item.quality>=0 && item.quality<=2){
          const keys=Array.isArray(item.proofs)?item.proofs.filter(key=>evidenceValid(id,key)):[];
          const proofs=[...new Set(keys)].slice(-2);
          card.quality=Math.min(item.quality,Math.max(proofs.length,
            // Legacy mastered cards may predate the evidence keys.
            item.legacyMastered===true?2:0));
          card.proofs=proofs;
          if(evidenceValid(id,item.lastEvidence))card.lastEvidence=item.lastEvidence;
          card.lastQualifiedAt=at(item.lastQualifiedAt);
          if(item.legacyMastered===true)card.legacyMastered=true;
        }
        if(type==='transfer'){
          const memory=Memory.sanitize(item.memory,{maxAt:card.lastAt,evidenceRequired:true});
          if(memory&&memory.outcome!=='previewed'&&evidenceValid(id,memory.evidence)&&
            (memory.outcome==='direct'?first>0:supported>0))card.memory=memory;
        }
        entry[type]=card;
      }
      if(Object.keys(entry).length)out[id]=entry;
    }
    return out;
  }
  function recordProgress(raw,id,source,outcome,now=Date.now(),evidence='') {
    if(!ID.test(id)||!['context','expression','meaning'].includes(source)||
      !['first','retry','guided'].includes(outcome))return raw;
    const type=source==='meaning'?'recognition':'transfer';
    const cards=sanitizeProgress(raw);
    const before=cards[id]?.[type]||{first:0,supported:0,streak:0,lastAt:0};
    const first=outcome==='first';
    const timestamp=at(now)||Date.now();
    if(timestamp<before.lastAt)return raw;
    const card={
      first:Math.min(9999,before.first+(first?1:0)),
      supported:Math.min(9999,before.supported+(first?0:1)),
      streak:first?Math.min(99,before.streak+1):0,
      lastAt:timestamp
    };
    if(type==='transfer' && evidenceValid(id,evidence)){
      const legacyMastered=before.legacyMastered===true ||
        (before.quality===undefined && before.supported>0 && before.streak>=2);
      let proofs=Array.isArray(before.proofs)?[...before.proofs]:[];
      let quality=before.quality??(legacyMastered?2:0);
      let lastQualifiedAt=before.lastQualifiedAt||0;
      if(!first){
        // Assisted or retried answers are useful learning, not independent
        // proof of transfer. A new struggle reopens the review cycle.
        proofs=[];quality=0;lastQualifiedAt=0;
      }else if(!legacyMastered && quality<2){
        const previous=lastQualifiedAt||before.lastAt||0;
        const spaced=timestamp>=previous+DAY_MS;
        const novel=!proofs.includes(evidence) && before.lastEvidence!==evidence;
        if(spaced && novel){
          proofs.push(evidence);
          quality=Math.min(2,proofs.length);
          lastQualifiedAt=timestamp;
        }
      }
      card.quality=quality;
      card.proofs=proofs.slice(-2);
      card.lastEvidence=evidence;
      card.lastQualifiedAt=lastQualifiedAt;
      if(legacyMastered && first)card.legacyMastered=true;
      const memory=Memory.observe(before.memory,{outcome:first?'direct':'supported',now:timestamp,
        lastExposureAt:before.lastAt,evidence,different:before.lastEvidence!==evidence,requiresEvidence:true});
      if(memory)card.memory=memory;
    }else if(type==='transfer'&&before.memory){
      // An unkeyed legacy/fallback success cannot establish new evidence.
      // A supported answer still invalidates the earned interval.
      card.memory=first?before.memory:Memory.observe(before.memory,{outcome:'supported',now:timestamp,
        evidence:before.memory.evidence,requiresEvidence:true});
    }
    return {...cards,[id]:{...cards[id],[type]:card}};
  }
  function needsReview(raw,id,type='transfer') {
    const entry=raw?.[id]?.[type];
    return !!entry && entry.supported>0 &&
      (type==='transfer' && Number.isInteger(entry.quality)?
        entry.quality<2:entry.streak<2);
  }
  function transferDueAt(card){
    const last=Math.max(card?.lastAt||0,card?.lastQualifiedAt||0);
    return Math.max(last?Math.min(4102444800000,last+DAY_MS):0,Memory.dueAt(card?.memory));
  }
  function hasMaintenance(card){
    // Old keyed observations can revisit on a one-day baseline, but cannot
    // inherit a longer interval from aggregate counters or legacy mastery.
    return !!card&&(!!card.memory||(card.first>0&&card.lastAt>0&&typeof card.lastEvidence==='string'));
  }
  return {formatSchoolAnswers,makeCheck,isCorrect,nextStep,sanitizeProgress,recordProgress,needsReview,transferDueAt,hasMaintenance};
});
