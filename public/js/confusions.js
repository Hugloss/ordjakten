/* Ordjakten 0.18: observations from approved two-word comparisons only.
 * Keeps exactly which word was selected and WHICH curated environment was
 * shown. Older v0.17 records without a scene ID are retained as legacy data.
 * Repeating the same correct scene is not evidence of transfer across contexts.
 */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenConfusions=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MAX_EVENTS=12,MAX_COUNT=9999;
  const CONTEXTS=['hem','skola','natur','fritid'];
  const validTime=t=>Number.isSafeInteger(t)&&t>=0&&t<=4102444800000;
  const count=x=>Number.isInteger(x)&&x>=0?Math.min(x,MAX_COUNT):0;
  const pairs=data=>new Map((data?.pairs||[]).filter(p=>p&&/^js-\d{2,}$/.test(p.id)).map(p=>[p.id,p]));
  const validEvent=(e,pair)=>e&&typeof e==='object'&&!Array.isArray(e)&&
    [pair.left,pair.right].includes(e.target)&&[pair.left,pair.right].includes(e.chosen)&&validTime(e.at)&&
    // Historic records lack scene identifiers; never guess a context for them.
    (e.sceneId===undefined&&e.context===undefined||
      pair.scenes?.some(s=>s.id===e.sceneId&&s.target===e.target&&s.context===e.context));
  const copyEvent=e=>e.sceneId===undefined?{target:e.target,chosen:e.chosen,at:e.at}:
    {target:e.target,chosen:e.chosen,at:e.at,sceneId:e.sceneId,context:e.context};
  function sanitize(raw,contrasts){
    const out=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    for(const [id,pair] of pairs(contrasts)){
      const item=raw[id];
      if(!item||typeof item!=='object'||Array.isArray(item))continue;
      const recent=Array.isArray(item.recent)?item.recent.filter(e=>validEvent(e,pair)).slice(-MAX_EVENTS).map(copyEvent):[];
      if(!recent.length)continue;
      const right=count(item.right),wrong=count(item.wrong);
      out[id]={attempts:Math.max(count(item.attempts),Math.min(MAX_COUNT,right+wrong),recent.length),right,wrong,
        lastAt:validTime(item.lastAt)?item.lastAt:recent[recent.length-1].at,recent};
    }
    return out;
  }
  function record(raw,question,selected,contrasts,at=Date.now()){
    const pair=pairs(contrasts).get(question?.contrastPair);
    const scene=pair?.scenes?.find(s=>s.id===question?.contrastSceneId);
    if(question?.taskType!=='contrast'||!pair||!scene||!validTime(at)||
      scene.target!==question.id||scene.context!==question.contrastContext||scene.text!==question.stem||
      !selected||![pair.left,pair.right].includes(selected.id)||
      !Array.isArray(question.options)||question.options.length!==2||
      !question.options.some(o=>o.id===selected.id&&o.correct===(o.id===question.id)&&selected.correct===o.correct))return raw;
    const output=sanitize(raw,contrasts),prior=output[pair.id]||{attempts:0,right:0,wrong:0,lastAt:0,recent:[]};
    const right=selected.id===question.id;
    output[pair.id]={attempts:Math.min(MAX_COUNT,prior.attempts+1),right:Math.min(MAX_COUNT,prior.right+(right?1:0)),
      wrong:Math.min(MAX_COUNT,prior.wrong+(right?0:1)),lastAt:at,
      recent:[...prior.recent,{target:question.id,chosen:selected.id,at,sceneId:scene.id,context:scene.context}].slice(-MAX_EVENTS)};
    return output;
  }
  function contextProfile(pair,card){
    const events=(card?.recent||[]).filter(e=>validEvent(e,pair)&&CONTEXTS.includes(e.context));
    const byContext=Object.create(null);
    for(const context of CONTEXTS)byContext[context]={right:0,wrong:0,seen:0,targets:new Set(),sceneIds:new Set()};
    for(const e of events){
      const item=byContext[e.context];item.seen++;
      if(e.target===e.chosen){item.right++;item.targets.add(e.target);}
      else item.wrong++;
      item.sceneIds.add(e.sceneId);
    }
    const available=CONTEXTS.filter(context=>pair.scenes?.some(scene=>scene.context===context));
    const nextContexts=available.sort((a,b)=>{
      const A=byContext[a],B=byContext[b];
      // First revisit misses not followed by an equal amount of correct evidence;
      // then discover environments never seen. Do not suggest 'mastery'.
      const sa=Math.max(0,A.wrong-A.right)*3+(A.seen===0?2:0)-A.seen*.1;
      const sb=Math.max(0,B.wrong-B.right)*3+(B.seen===0?2:0)-B.seen*.1;
      return sb-sa||CONTEXTS.indexOf(a)-CONTEXTS.indexOf(b);
    });
    const crossContexts=CONTEXTS.filter(key=>byContext[key].right>0).length;
    return {byContext:Object.fromEntries(CONTEXTS.map(key=>[key,{right:byContext[key].right,wrong:byContext[key].wrong,
      seen:byContext[key].seen,targets:[...byContext[key].targets],scenes:byContext[key].sceneIds.size}])),
      contextsTried:CONTEXTS.filter(key=>byContext[key].seen>0).length,
      contextsWithCorrect:crossContexts,nextContexts};
  }
  function insight(pair,card){
    const events=(card?.recent||[]).filter(e=>validEvent(e,pair)).slice(-8);
    const errors=events.filter(e=>e.chosen!==e.target);
    const directions={leftToRight:errors.filter(e=>e.target===pair.left).length,
      rightToLeft:errors.filter(e=>e.target===pair.right).length};
    const final3=events.slice(-3),finalRights=final3.filter(e=>e.target===e.chosen).length;
    const hasContextEvidence=final3.some(e=>e.sceneId);
    // A repeated click on the same known story is insufficient evidence of
    // transfer; require at least two environments, two words and two scenes.
    const transferred=final3.length===3&&finalRights===3&&
      new Set(final3.map(e=>e.sceneId)).size>=2&&
      new Set(final3.map(e=>e.context)).size>=2&&
      new Set(final3.map(e=>e.target)).size===2;
    const recovered=events.length>=3&&finalRights===3&&(!hasContextEvidence||transferred);
    const priority=recovered?0:errors.length?Math.max(2,errors.length*2-finalRights*2):0;
    const profile=contextProfile(pair,card);
    return {pairId:pair.id,attempts:count(card?.attempts),right:count(card?.right),wrong:count(card?.wrong),
      recentWrong:errors.length,priority,needsPractice:priority>=2,recurring:errors.length>=2&&priority>=2,
      directions,recovered,transferred,lastAt:card?.lastAt||0,...profile};
  }
  function recommendations(contrasts,progress={},limit=3,{starterOnly=false}={}){
    const output=[];
    for(const pair of contrasts?.pairs||[]){
      if(starterOnly&&!pair.starter)continue;
      const item=insight(pair,progress?.[pair.id]);
      if(item.needsPractice)output.push({...item,pair});
    }
    return output.sort((a,b)=>Number(b.recurring)-Number(a.recurring)||b.priority-a.priority||a.lastAt-b.lastAt||a.pair.id.localeCompare(b.pair.id))
      .slice(0,Math.min(12,Math.max(0,limit)));
  }
  function summary(contrasts,progress={}){
    const all=(contrasts?.pairs||[]).map(pair=>insight(pair,progress?.[pair.id]));
    return {tried:all.filter(x=>x.attempts>0).length,practice:all.filter(x=>x.needsPractice).length,
      recurring:all.filter(x=>x.recurring).length,recovered:all.filter(x=>x.recovered).length};
  }
  return {sanitize,record,contextProfile,insight,recommendations,summary};
});
