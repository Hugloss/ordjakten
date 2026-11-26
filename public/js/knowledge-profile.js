/* Derived pedagogical observations, not diagnoses or mastery scores.
 * No persistent profile: use the original method-specific evidence. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenKnowledge=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DAY=86400000;
  const count=n=>Number.isInteger(n)&&n>0?n:0;
  const time=n=>Number.isSafeInteger(n)&&n>=0&&n<=4102444800000?n:0;
  const weak=card=>count(card?.wrong)>0&&count(card?.streak)<2;
  const right=card=>count(card?.right)>0;
  const ready=(due,now)=>time(due)<=now;
  const observation=(task,raw)=>{const c=raw?.[task.id];return c?.stamp===task.stamp&&count(c.attempts)&&time(c.lastAt)?c:null;};
  function relationFacts(tasks,raw){
    const rows=tasks.map(task=>({task,card:observation(task,raw)})).filter(row=>row.card&&['direct','supported','previewed'].includes(row.card.last));
    return {total:tasks.length,seen:rows.length,direct:rows.filter(x=>count(x.card.direct)).length,
      supported:rows.filter(x=>x.card.last==='supported').length,previewed:rows.filter(x=>x.card.last==='previewed').length,rows};
  }
  function analyze({catalog,history={},detectorTasks=[],conceptContent={groups:[],tasks:[]},bridgeTasks=[],
    contrasts={pairs:[]},reading,recall,confusions,now=Date.now()}){
    const words=Object.create(null),groups=Object.create(null),pairs=Object.create(null);
    const recallRows=recall.sanitize(history.recallProgress,catalog);
    const readingRows=reading.sanitizeProgress(history.readingProgress);
    for(const pair of contrasts.pairs||[]){
      const insight=confusions.insight(pair,history.confusionProgress?.[pair.id]);
      const memory=history.retentionProgress?.[pair.id];
      pairs[pair.id]={id:pair.id,words:[pair.left,pair.right],seen:insight.attempts>0,
        support:insight.needsPractice,recurring:insight.recurring,
        ready:!(memory?.stage>0&&memory.dueAt>now)};
    }
    for(const group of conceptContent.groups){
      const relation=relationFacts(group.questions,history.conceptProgress);
      const bridge=relationFacts(bridgeTasks.filter(task=>task.groupId===group.id),history.bridgeProgress);
      groups[group.id]={id:group.id,words:group.words.map(word=>word.id),title:group.title,relation,bridge};
    }
    for(const item of catalog){
      const id=item.id,skills=history.skillProgress?.[id]?.skills||{};
      const read=readingRows[id]||{},missions=Array.isArray(history.missionProgress?.[id])?history.missionProgress[id]:[];
      const saved=recallRows[id],review=history.reviewProgress?.[id];
      const meaning=right(skills.meaning)||count(read.recognition?.first)>0||missions.includes('meaning');
      const recognition=right(skills.picture)||right(skills.reverse);
      const ordinaryStory=skills[item.kind==='expression'?'sentence':'context'];
      const storyRight=right(ordinaryStory)||count(read.transfer?.first)>0||missions.includes('sentence');
      const storyWeak=weak(ordinaryStory),transferWeak=reading.needsReview(readingRows,id,'transfer')||read.transfer?.memory?.outcome==='supported';
      const ordinaryReady=!(review&&review.streak<3&&review.dueAt>now);
      const transferReady=ready(reading.transferDueAt(read.transfer),now);
      const recallDue=recall.dueAt(saved);
      // Historic assisted counters mixed named previews and genuine help.
      // They show an encounter, not necessarily a failed independent recall.
      const recallOutcome=saved?.memory?.outcome||(saved?.last==='direct'?'direct':saved?'legacy':'new');
      const scenes=detectorTasks.filter(task=>task.target===id);
      const observations=scenes.map(task=>({task,card:observation(task,history.detectorProgress)}))
        .filter(row=>row.card&&['right','helped','previewed'].includes(row.card.word)&&['right','supported'].includes(row.card.clue));
      const detector={total:scenes.length,seen:observations.length,
        wordRight:observations.filter(x=>count(x.card.wordRight)>0).length,
        clueRight:observations.filter(x=>count(x.card.clueRight)>0).length,
        wordSupport:observations.filter(x=>x.card.word==='helped').length,
        clueSupport:observations.filter(x=>x.card.clue==='supported').length};
      words[id]={id,meaning,recognition,storyRight,storyWeak,transferWeak,
        storyReady:storyWeak&&ordinaryReady||transferWeak&&transferReady,
        meaningWeak:weak(skills.meaning)||reading.needsReview(readingRows,id,'recognition'),
        recall:{outcome:recallOutcome,direct:count(saved?.direct),dueAt:recallDue,
          ready:recallDue<=now,seen:!!saved,eligible:recall.eligible(item,history),
          interval:saved?.memory?.step??null},
        transfer:{seen:!!read.transfer,first:count(read.transfer?.first),dueAt:reading.transferDueAt(read.transfer),
          ready:transferReady,interval:read.transfer?.memory?.step??null},
        detector,relations:Object.values(groups).filter(group=>group.words.includes(id)),
        pair:Object.values(pairs).find(pair=>pair.words.includes(id))||null,
        // Only recorded encounters and explicit history are used; no free
        // sentence is saved or evaluated in Ordverkstaden.
        known:recall.eligible(item,history)||!!saved,
        hasExample:!!item.example};
    }
    return {words,groups,pairs,now};
  }
  function guidance(profile,candidate){
    if(!profile||!candidate)return null;
    const task=candidate.payload,word=profile.words[task?.target||task?.id],mode=candidate.mode;
    const group=profile.groups[task?.groupId];
    const direct=(text,weight=2)=>({text,weight,related:false});
    const related=text=>({text,weight:1,related:true});
    if(mode==='recall'&&word){
      if(word.recall.outcome==='supported'&&word.recall.direct>0)
        return direct('Du har hittat ordet förut och fick stöd senast. Prova igen med lagom hjälp.');
      if(word.recall.outcome==='supported'&&(word.recognition||word.meaning))
        return direct('Du har hittat rätt tidigare, men skrivövningen behövde stöd. Prova att komma på ordet igen.');
      if(word.recall.outcome==='supported')return direct('Du fick stöd i skrivövningen senast. Prova igen i din egen takt.');
      if(word.recall.outcome==='previewed')return direct('Du har sett ordet inför en skrivövning. Prova utan att se själva ordet först.',0);
      if(word.recall.seen)return direct('Ett återbesök i skrivövningen är redo efter en paus.',0);
      if(word.meaning||word.recognition)return direct('Du har hittat rätt förut. Prova nu att själv komma på ordet.',1);
    }
    if(mode==='aha'&&word){
      if(candidate.reason==='need')return direct(word.transfer.first?
        'Du har hittat rätt i en Aha-berättelse förut och kan få träna ett annat exempel.':
        'En tidigare Aha-berättelse behövde stöd. Läs betydelsen och prova ett annat exempel.');
      if(candidate.reason==='review')return direct('En Aha-berättelse är redo för ett återbesök efter en paus.',0);
    }
    if(mode==='detector'&&word){
      if(candidate.reason==='need'){
        if(word.detector.clueSupport&&word.detector.wordRight)return direct('Du har hittat rätt ord i en berättelse. Prova att också hitta textens ledtråd.');
        if(word.detector.clueSupport)return direct('En tidigare ledtrådsuppgift behövde stöd. Leta efter ledtråden igen.');
        if(word.detector.wordSupport)return direct('Ett tidigare ordval var klurigt. Läs berättelsen och jämför orden.');
      }
      if(word.meaning&&word.storyReady&&candidate.reason!=='review')
        return related('Du har hittat rätt betydelse, men en berättelse var klurig. Prova att leta efter ledtrådar.');
    }
    if(mode==='concept'&&group){
      if(candidate.reason==='need')return direct('En tidigare sambandsfråga behövde stöd. Prova att jämföra orden igen.');
      // Only an explicitly linked relation containing BOTH confused words.
      const pair=Object.values(profile.pairs).find(p=>p.support&&p.ready&&p.words.every(id=>group.words.includes(id)));
      if(pair&&candidate.reason!=='review')return related('Två ord har varit kluriga att skilja åt. Utforska sambandet mellan dem.');
    }
    if(mode==='bridge'&&group){
      if(candidate.reason==='need')return direct('En tidigare ordbro behövde stöd. Prova att sortera eller koppla ihop orden igen.');
      // Group-level signal only. No claim that every member is misunderstood.
      if(group.relation.rows.some(x=>x.card.last==='supported'&&x.card.lastAt+DAY<=profile.now)&&candidate.reason!=='review')
        return related('Ett ordsamband har varit klurigt. Prova samma grupp på ett annat sätt.');
    }
    if(mode==='workshop'&&word?.known&&word.storyReady&&word.hasExample)
      return related('En berättelse har varit klurig. Prova att bygga och använda ordet i meningar utan provpoäng.');
    if(mode==='focus'&&word){
      if(candidate.reason==='need'){
        if(task.skill==='meaning')return direct('En betydelseövning har varit klurig. Läs förklaringen och öva ordet igen.');
        if(task.skill==='contrast')return direct('En jämförelse har varit klurig. Prova att skilja orden åt i flera situationer.');
        if(['context','sentence'].includes(task.skill))return direct('En berättelse eller mening har varit klurig. Prova fler exempel.');
        return direct('En tidigare ordövning behövde en ny chans.');
      }
      if(candidate.reason==='review')return direct('En tidigare ordövning är redo för repetition.',0);
    }
    return null;
  }
  function decorate(profile,candidate){
    const hint=guidance(profile,candidate);
    if(!hint)return candidate;
    return {...candidate,reason:hint.related&&['discover','extend'].includes(candidate.reason)?'related':candidate.reason,
      profileWeight:hint.weight,explanation:hint.text};
  }
  // Concise word-card facts. Related exercises remain group/task evidence,
  // never a claim about a particular member's spelling or meaning.
  function notes(profile,id){
    const word=profile?.words?.[id];
    if(!word)return [];
    const rows=[];
    if(word.recall.seen){
      const label=word.recall.outcome==='direct'?'Hittat ordet utan extra ledtråd':
        word.recall.outcome==='previewed'?'Provat efter att ha sett ordet':
        word.recall.outcome==='supported'?'Provat med stöd':'Tidigare skrivövning med stöd eller förhandsvisning';
      rows.push({kind:'recall',label:'🔤 Skrivövning',text:label+'.',dueAt:word.recall.dueAt});
    }else if(word.known)rows.push({kind:'recall',label:'🔤 Skrivövning',text:'Ännu inte provad. Ett nytt sätt att öva, inte ett tecken på en svårighet.'});
    if(word.detector.total){
      const d=word.detector;
      rows.push({kind:'detector',label:'🔎 Textledtrådar',text:d.seen?
        d.seen+' berättelser provade. '+d.wordRight+' med rätt ordval utan förhandsvisning och '+d.clueRight+' med rätt ledtråd utan extra hjälp.':
        'Finns att prova. Inga observationer ännu.'});
    }
    for(const group of word.relations){
      const r=group.relation,b=group.bridge;
      if(!r.seen&&!b.seen)continue;
      rows.push({kind:'relation',label:'🗺️ '+group.title,text:
        r.seen+' sambandsfrågor och '+b.seen+' ordbroar provade i den här gruppen. Det säger inte hur varje enskilt ord behärskas.'});
    }
    if(word.storyReady&&word.known&&word.hasExample)rows.push({kind:'workshop',label:'🛠️ Ordverkstaden',
      text:'Prova gärna att bygga en mening. Dina egna meningar bedöms inte.'});
    return rows;
  }
  return {analyze,guidance,decorate,notes};
});
