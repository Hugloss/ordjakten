/* Mitt nästa äventyr: coordinate existing practice engines without inventing
 * a mastery score or bypassing their individual schedules. No stored plan. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenJourney=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DAY=86400000,LIMIT=3,BUDGET=8;
  const MODES=Object.freeze({
    focus:{icon:'🎯',label:'Träna ett ord',screen:'focus'},
    aha:{icon:'🎭',label:'En ny berättelse',screen:'aha'},
    recall:{icon:'🔤',label:'Hitta ordet själv',screen:'recall'},
    workshop:{icon:'🛠️',label:'Lek med meningar',screen:'workshop'},
    detector:{icon:'🔎',label:'Leta efter ledtrådar',screen:'detector'},
    concept:{icon:'🗺️',label:'Upptäck ett ordsamband',screen:'concepts'},
    bridge:{icon:'🌉',label:'Bygg en ordbro',screen:'concepts'}
  });
  const order=['focus','aha','recall','detector','concept','bridge','workshop'];
  const REASONS=Object.freeze({
    need:'En ny chans att öva något som varit klurigt.',
    review:'Ett återbesök som är redo.',
    extend:'Prova ett nytt sätt med ord du har mött.',
    discover:'Upptäck något nytt i din egen takt.'
  });
  const RANK={need:0,review:1,extend:2,discover:3};
  const ID=/^(?:sv|ut)-\d{4,}$/;
  const ts=n=>Number.isFinite(n)&&n>=0?n:0;
  const unique=items=>[...new Set(items.filter(id=>typeof id==='string'&&ID.test(id)))];
  const available=plan=>plan?.available||plan?.round||[];
  const weak=card=>!!card&&card.wrong>0&&card.streak<2;
  const supported=card=>card?.last==='supported';
  function select(candidates,{usage={},limit=LIMIT,budget=BUDGET,random=Math.random}={}){
    const rows=candidates.filter(row=>Object.hasOwn(MODES,row?.mode)&&Object.hasOwn(RANK,row.reason)&&
      typeof row.key==='string'&&row.key&&Number.isInteger(row.cost)&&row.cost>=1&&row.cost<=BUDGET&&
      Array.isArray(row.words)&&row.words.length&&row.words.every(id=>typeof id==='string'&&ID.test(id))&&
      new Set(row.words).size===row.words.length)
      .map(row=>({row,draw:random()}));
    rows.sort((a,b)=>{
      const A=a.row,B=b.row;
      return RANK[A.reason]-RANK[B.reason]||
        ts(usage[A.mode])-ts(usage[B.mode])||
        (A.reason==='need'||A.reason==='review'?ts(A.dueAt)-ts(B.dueAt):0)||
        // Start a new child with a familiar ordinary word question.
        (A.reason==='discover'?order.indexOf(A.mode)-order.indexOf(B.mode)||ts(A.discoveryTier)-ts(B.discoveryTier):0)||
        a.draw-b.draw||order.indexOf(A.mode)-order.indexOf(B.mode)||A.key.localeCompare(B.key);
    });
    const steps=[],words=new Set(),methods=new Set(),keys=new Set();
    let remaining=Math.min(BUDGET,Math.max(0,Number.isInteger(budget)?budget:BUDGET));
    const cap=Math.min(LIMIT,Math.max(0,Number.isInteger(limit)?limit:LIMIT));
    for(const {row} of rows){
      if(steps.length>=cap)break;
      if(row.cost>remaining||methods.has(row.mode)||keys.has(row.key)||row.words.some(id=>words.has(id)))continue;
      steps.push(row);methods.add(row.mode);keys.add(row.key);row.words.forEach(id=>words.add(id));remaining-=row.cost;
    }
    return {steps,maxTasks:steps.reduce((n,row)=>n+row.cost,0)};
  }
  function build({catalog,history={},focusTypes,pairFor,knownIds=new Set(),aha,recall,detector,concept,bridge,
    conceptContent,workshopSeen=new Set(),now=Date.now(),random=Math.random,usage={}}){
    const byId=new Map(catalog.map(item=>[item.id,item]));
    const candidates=[],known=new Set([...knownIds].filter(id=>byId.has(id)));
    const encountered=new Set(known);
    for(const item of catalog){
      const id=item.id;
      if(history.skillProgress?.[id]||history.readingProgress?.[id]||history.reviewProgress?.[id]||
        history.mistakes?.[id]||history.missionProgress?.[id]||history.recallProgress?.[id])encountered.add(id);
    }
    for(const task of detector?.catalog||[])if(history.detectorProgress?.[task.id])encountered.add(task.target);
    for(const task of conceptContent?.tasks||[])if(history.conceptProgress?.[task.id])encountered.add(task.answer);
    for(const task of bridge?.catalog||[])if(history.bridgeProgress?.[task.id])task.cards.forEach(id=>encountered.add(id));
    // Only use validated, due rows from the method's own planner.
    const add=(mode,key,words,reason,cost,payload,dueAt=0,discoveryTier=0)=>{
      const ids=unique(words);
      if(!ids.length||ids.some(id=>!byId.has(id)))return;
      if(dueAt>now)return;
      candidates.push({mode,key,words:ids,reason,cost,payload,dueAt:ts(dueAt),discoveryTier});
    };
    for(const row of aha?.ready||[])add('aha','aha:'+row.id,[row.id],row.reason==='review'?'review':'need',1,row,row.dueAt);
    for(const row of recall?.ready||[]){
      add('recall','recall:'+row.id,[row.id],row.card?.last==='assisted'&&row.card.memory?.outcome!=='previewed'?'need':row.card?'review':'extend',1,row,row.dueAt);
    }
    const groups=new Map((conceptContent?.groups||[]).map(group=>[group.id,group]));
    for(const task of available(detector)){
      const card=history.detectorProgress?.[task.id];
      const ids=task.words.map(word=>word.id);
      const proof=history.detectorLevels?.[task.pairId]?.proof;
      const previous=proof&&detector?.catalog?.find(row=>row.id===proof.id&&row.stamp===proof.stamp);
      const qualifies=previous&&proof.at+DAY<=now&&previous.target!==task.target&&previous.context!==task.context&&previous.level===task.level;
      const reason=card&&(card.word==='helped'||card.clue==='supported')?'need':card||qualifies?'review':
        ids.some(id=>known.has(id))||task.level>1?'extend':'discover';
      add('detector','detector:'+task.id,ids,reason,1,task,card?.lastAt?card.lastAt+DAY:qualifies?proof.at+DAY:0);
    }
    for(const [mode,plan,progress] of [['concept',concept,history.conceptProgress],['bridge',bridge,history.bridgeProgress]]){
      for(const task of available(plan)){
        const card=progress?.[task.id],group=groups.get(task.groupId);
        if(!group)continue;
        const ids=mode==='bridge'?task.participants:
          [...group.words.map(word=>word.id),...task.options.map(option=>option.id)];
        const reason=supported(card)?'need':card?'review':ids.some(id=>known.has(id))?'extend':'discover';
        add(mode,mode+':'+task.id,ids,reason,1,task,card?.lastAt?card.lastAt+DAY:0);
      }
    }
    // Ordinary skill review is not a second Aha or recall queue. A review
    // card still waiting blocks automatic focused practice on that concept;
    // contrast's own retention schedule is checked independently.
    for(const item of catalog){
      const id=item.id,types=focusTypes(item)||[],skills=history.skillProgress?.[id]?.skills||{};
      const review=history.reviewProgress?.[id],pair=pairFor(item);
      const memory=pair&&history.retentionProgress?.[pair.id];
      const waiting=review&&review.streak<3&&review.dueAt>now;
      const contrastWaiting=memory?.stage>0&&memory.dueAt>now;
      const allowed=types.filter(type=>type==='contrast'?!contrastWaiting:!waiting);
      const due=review&&review.streak<3&&Number.isFinite(review.dueAt)&&review.dueAt<=now;
      const contrastDue=memory?.stage>0&&Number.isFinite(memory.dueAt)&&memory.dueAt<=now;
      const weakTypes=allowed.filter(type=>weak(skills[type])).sort((a,b)=>
        (skills[b].wrong-skills[a].wrong)||ts(skills[a].lastAt)-ts(skills[b].lastAt)||a.localeCompare(b));
      let skill=weakTypes[0],reason=skill?'need':null,dueAt=skill?ts(skills[skill].lastAt):0;
      const recognition=history.readingProgress?.[id]?.recognition;
      if(!skill&&recognition?.supported>0&&recognition.streak<2&&ts(recognition.lastAt)+DAY<=now&&allowed.includes('meaning')){
        skill='meaning';reason='need';dueAt=ts(recognition.lastAt)+DAY;
      }
      if(!skill&&due){
        skill=[review.lastVariant,'meaning','picture','reverse'].find(type=>type!=='contrast'&&allowed.includes(type));
        if(skill){reason='review';dueAt=review.dueAt;}
      }
      if(!skill&&contrastDue&&allowed.includes('contrast')){skill='contrast';reason='review';dueAt=memory.dueAt;}
      if(!skill&&known.has(id)){
        skill=['meaning','context','sentence','reverse','contrast','picture','order'].find(type=>
          allowed.includes(type)&&!skills[type]?.attempts);
        if(skill)reason='extend';
      }
      if(!skill&&!encountered.has(id)&&item.kind==='word'&&['easy','medium'].includes(item.difficulty)){
        skill=(item.difficulty==='easy'?['picture','meaning']:['meaning','reverse']).find(type=>allowed.includes(type));
        if(skill)reason='discover';
      }
      if(skill)add('focus','focus:'+id+':'+skill,skill==='contrast'&&pair?[pair.left,pair.right]:[id],
        reason,skill==='contrast'?4:3,{id,skill},dueAt,item.difficulty==='easy'?0:1);
      // Workshop is ungraded creative practice; never manufacture a need
      // from its absence of progress. Offer once per concept per page visit.
      if(known.has(id)&&!workshopSeen.has(id)&&item.example&&item.definition)
        add('workshop','workshop:'+id,pair?[pair.left,pair.right]:[id],'extend',3,{id});
    }
    return select(candidates,{usage,random});
  }
  // Pure transitions prevent duplicate Done clicks and distinguish a skip
  // from finishing an exercise. Individual engines retain their observations.
  function start(steps){
    if(!Array.isArray(steps)||!steps.length||steps.length>LIMIT)return null;
    return {steps:steps.slice(),index:0,completed:[],skipped:[],finished:false};
  }
  function advance(state,status,mode){
    if(!state||state.finished||!['completed','skipped'].includes(status)||
      state.steps[state.index]?.mode!==mode)return state;
    const step=state.steps[state.index],index=state.index+1;
    return {...state,index,finished:index===state.steps.length,[status]:state[status].concat(step.mode)};
  }
  return {DAY,LIMIT,BUDGET,MODES,REASONS,select,build,start,advance};
});
