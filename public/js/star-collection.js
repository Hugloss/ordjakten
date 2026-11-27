/* A lasting collection of the same stars used in ordinary word rounds.
 * One star per question, also after practice. No clock, streak, spending or loss.
 * The bounded active ledger prevents duplicate and stale answer callbacks.
 */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenStars=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LIMIT=25;
  const MAX=Number.MAX_SAFE_INTEGER;
  const ID=/^(?:sv|ut)-\d{4,}$/;
  // These finite task IDs belong to the authored treasure maps. Their stars
  // join the collection without replacing a child's unfinished ordinary row.
  const ACTIVITY_IDS=Object.freeze(['forest','space','castle','pirate','ocean','dinosaurs',
    'garden','unicorn','animals','rainbow','horses','music'].flatMap(world=>
      [0,1,2,3].map(index=>'treasure:'+world+':'+index)));
  const activities=new Set(ACTIVITY_IDS);
  const MILESTONES=Object.freeze([
    {id:'spark',at:5,icon:'✨',title:'Första gnistan',description:'En liten stjärna lyser i din samling.'},
    {id:'flower',at:15,icon:'🌼',title:'Stjärnblomman',description:'En blomma av stjärnor har slagit ut.'},
    {id:'compass',at:30,icon:'🧭',title:'Stjärnkompassen',description:'Din kompass pekar mot fler ord att upptäcka.'},
    {id:'lantern',at:50,icon:'🏮',title:'Stjärnlyktan',description:'En lykta lyser upp din ordstig.'},
    {id:'wings',at:75,icon:'🦋',title:'Stjärnvingarna',description:'En fjäril med stjärnvingar landar i samlingen.'},
    {id:'castle',at:100,icon:'🏰',title:'Stjärnslottet',description:'Slottets fönster glittrar av dina stjärnor.'}
  ].map(Object.freeze));
  const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const count=value=>Number.isSafeInteger(value)&&value>=0;
  const validId=id=>typeof id==='string'&&id.length<=32&&ID.test(id);
  const empty=()=>({version:1,total:0,serial:0,active:null});

  function legacyTotal(results){
    if(!Array.isArray(results))return 0;
    let total=0;
    // This is a one-time recovery of stars visible in existing result history.
    // Once a collection exists it never depends on that rolling history again.
    for(const row of results.slice(-50)){
      if(!object(row)||!['train','test'].includes(row.mode)||
        !Number.isInteger(row.total)||row.total<1||row.total>LIMIT||
        !Number.isInteger(row.right)||row.right<0||row.right>row.total)continue;
      if(row.wrong!==undefined&&(!Number.isInteger(row.wrong)||row.wrong<0||row.wrong>row.total))continue;
      if(row.unanswered!==undefined&&(!Number.isInteger(row.unanswered)||row.unanswered<0||row.unanswered>row.total))continue;
      if(row.wrong!==undefined&&row.unanswered!==undefined&&row.right+row.wrong+row.unanswered!==row.total)continue;
      total+=row.right;
    }
    return total;
  }

  function sanitize(raw,legacyResults=[]){
    // Malformed saved data must not trigger repeated legacy imports.
    if(raw===undefined||raw===null)return {...empty(),total:legacyTotal(legacyResults)};
    if(!object(raw))return empty();
    const total=count(raw.total)?raw.total:0;
    const serial=count(raw.serial)?raw.serial:0;
    const clean={version:1,total,serial,active:null};
    const earnedActivities=raw.version===1&&Array.isArray(raw.activities)?
      [...new Set(raw.activities.filter(id=>typeof id==='string'&&activities.has(id)))]:[];
    if(earnedActivities.length&&earnedActivities.length<=total)clean.activities=earnedActivities;
    const active=raw.active;
    if(raw.version!==1||!object(active)||!count(raw.total)||!count(raw.serial)||
      serial===0||active.serial!==serial||typeof active.finished!=='boolean'||
      !Array.isArray(active.ids)||active.ids.length<1||active.ids.length>LIMIT||
      active.ids.some(id=>!validId(id))||new Set(active.ids).size!==active.ids.length||
      !Array.isArray(active.earned)||active.earned.length>active.ids.length||
      active.earned.length+(clean.activities?.length||0)>total)return clean;
    const ids=new Set(active.ids),seen=new Set();
    const earned=[];
    for(const row of active.earned){
      if(!object(row)||!ids.has(row.id)||seen.has(row.id)||!['answer','practice'].includes(row.via))return clean;
      seen.add(row.id);earned.push({id:row.id,via:row.via});
    }
    clean.active={serial,ids:[...active.ids],earned,finished:active.finished};
    return clean;
  }

  function begin(raw,questions){
    const collection=sanitize(raw);
    if(!Array.isArray(questions)||questions.length<1||questions.length>LIMIT||collection.serial===MAX)
      return {collection,roundId:null};
    const ids=questions.map(question=>question?.id);
    if(ids.some(id=>!validId(id))||new Set(ids).size!==ids.length)return {collection,roundId:null};
    const serial=collection.serial+1;
    return {collection:{...collection,serial,active:{serial,ids,earned:[],finished:false}},roundId:serial};
  }

  function summarize(raw,roundId){
    const collection=sanitize(raw),active=collection.active;
    if(!active||(roundId!==undefined&&roundId!==active.serial))return null;
    const earned=new Set(active.earned.map(row=>row.id));
    const remaining=active.ids.filter(id=>!earned.has(id));
    const direct=active.earned.filter(row=>row.via==='answer').length;
    return {roundId:active.serial,earned:earned.size,total:active.ids.length,direct,
      practised:earned.size-direct,remaining,remainingCount:remaining.length,
      complete:remaining.length===0,finished:active.finished};
  }

  function award(raw,roundId,id,via,outcome='right'){
    const collection=sanitize(raw),active=collection.active;
    if(!active||roundId!==active.serial||!active.ids.includes(id)||outcome!=='right'||
      !['answer','practice'].includes(via)||(via==='answer'&&active.finished)||
      active.earned.some(row=>row.id===id)||collection.total===MAX)
      return {collection,added:0,milestones:[]};
    const total=collection.total+1;
    return {collection:{...collection,total,active:{...active,earned:[...active.earned,{id,via}]}},added:1,
      milestones:MILESTONES.filter(row=>row.at>collection.total&&row.at<=total).map(row=>({...row,earned:true}))};
  }

  function finish(raw,roundId){
    const collection=sanitize(raw),active=collection.active;
    if(!active||roundId!==active.serial)return {collection,round:null};
    // A finished first attempt may still be completed through explicit practice.
    const updated={...collection,active:{...active,finished:true}};
    return {collection:updated,round:summarize(updated,roundId)};
  }

  function awardActivity(raw,key,outcome='right'){
    const collection=sanitize(raw),earned=collection.activities||[];
    if(!activities.has(key)||outcome!=='right'||earned.includes(key)||collection.total===MAX)
      return {collection,added:0,milestones:[]};
    const total=collection.total+1;
    return {collection:{...collection,total,activities:[...earned,key]},added:1,
      milestones:MILESTONES.filter(row=>row.at>collection.total&&row.at<=total).map(row=>({...row,earned:true}))};
  }

  function view(raw){
    const collection=sanitize(raw);
    const milestones=MILESTONES.map(row=>({...row,earned:collection.total>=row.at}));
    const next=milestones.find(row=>!row.earned);
    const previous=milestones.filter(row=>row.earned).at(-1)?.at||0;
    return {total:collection.total,milestones,
      next:next?{...next,remaining:next.at-collection.total,progress:collection.total-previous,goal:next.at-previous}:null,
      completed:milestones.filter(row=>row.earned).length,goalCount:milestones.length};
  }
  return {LIMIT,MILESTONES,ACTIVITY_IDS,sanitize,begin,award,awardActivity,finish,summarize,view};
});
