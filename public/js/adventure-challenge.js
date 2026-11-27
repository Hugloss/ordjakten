/* Adaptive challenge pacing. Short-lived, local station outcomes are not a
 * reading level, a diagnosis, or a new claim of mastery. Never unlock a tier
 * or shorten a method's own waiting interval. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenChallenge=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DAY=86400000,WINDOW=8,FRESH=7*DAY,MAX_TIME=4102444800000;
  const MODES=['focus','aha','recall','workshop','detector','concept','bridge'];
  const OUTCOMES=['direct','supported','neutral'];
  const validTime=at=>Number.isSafeInteger(at)&&at>0&&at<=MAX_TIME;
  function sanitize(raw){
    return Array.isArray(raw)?raw.slice(-WINDOW).filter(row=>row&&MODES.includes(row.mode)&&
      OUTCOMES.includes(row.outcome)&&[1,2,3].includes(row.demand)&&validTime(row.at))
      .map(({mode,outcome,demand,at})=>({mode,outcome,demand,at})):[];
  }
  function recent(raw,now=Date.now()){
    return sanitize(raw).filter(row=>row.at<=now&&now-row.at<=FRESH);
  }
  function record(raw,row,outcome,now=Date.now()){
    if(!MODES.includes(row?.mode)||!OUTCOMES.includes(outcome)||!validTime(now))return raw;
    const demand=row.challenge?.demand;
    if(![1,2,3].includes(demand))return raw;
    const past=sanitize(raw);
    if(past.at(-1)?.at>now)return raw;
    return past.concat({mode:row.mode,outcome,demand,at:now}).slice(-WINDOW);
  }
  function outcome(mode,data={}){
    if(mode==='workshop')return 'neutral';
    if(mode==='focus'){
      const answers=data.answers;
      if(!Array.isArray(answers)||!answers.length||answers.some(a=>!['right','wrong'].includes(a)))return 'neutral';
      return answers.includes('wrong')?'supported':'direct';
    }
    if(data.previewed)return 'neutral';
    if(mode==='recall'){
      if(typeof data.matched!=='boolean')return 'neutral';
      // A correct answer with the initially provided first-letter support is
      // useful practice but neither unassisted success nor a new struggle.
      if(data.matched&&data.stage===0&&!data.misses)return 'neutral';
      return data.matched&&!data.helped&&data.stage>0?'direct':'supported';
    }
    if(mode==='detector'){
      if(data.word==='previewed'||!['right','helped'].includes(data.word)||!['right','supported'].includes(data.clue))return 'neutral';
      return data.word==='right'&&data.clue==='right'?'direct':'supported';
    }
    if(mode==='aha')return data.outcome==='first'?'direct':['retry','guided'].includes(data.outcome)?'supported':'neutral';
    if(['concept','bridge'].includes(mode))return ['direct','supported'].includes(data.outcome)?data.outcome:'neutral';
    return 'neutral';
  }
  function pace(raw,now=Date.now(),projected=[]){
    const rows=recent(raw,now);
    const measured=rows.filter(row=>row.outcome!=='neutral');
    const load=rows.map(row=>row.demand).concat(projected.map(row=>row.challenge?.demand||2));
    const last=measured.at(-1),last3=measured.slice(-3);
    if(load.length>=2&&load.slice(-2).every(n=>n===3))return 'gentle';
    // A new struggle is enough to offer a calmer next step. A successful
    // neutral/creative break clears this immediate pacing preference.
    if(rows.at(-1)?.outcome==='supported'||(last3.filter(row=>row.outcome==='supported').length>=2&&
      rows.at(-1)?.outcome!=='neutral'&&last?.outcome!=='direct'))return 'gentle';
    if(last3.length===3&&last3.every(row=>row.outcome==='direct')&&
      new Set(last3.map(row=>row.mode)).size>=2&&load.at(-1)!==3)return 'stretch';
    return 'steady';
  }
  function tag(row,{byId,history={},contrastLevel=()=>1}={}){
    const task=row.payload||{},item=byId?.get(task.id||task.target||task.answer);
    const skills=history.skillProgress?.[task.id]?.skills||{};
    let demand=2,concrete=false,stable=false,short=false;
    if(row.mode==='focus'){
      const skill=task.skill,ordinary=['picture','meaning'].includes(skill)&&item?.kind==='word';
      concrete=ordinary&&(skill==='picture'||item.difficulty==='easy'||item.difficulty==='medium'&&skills.meaning?.right>0);
      if(concrete){demand=1;short=true;}
      else if(['contrast','context','sentence','order'].includes(skill)){
        demand=skill==='contrast'&&contrastLevel(task.id)<2?2:3;
        if(skill==='contrast')stable=contrastLevel(task.id)>=2;
        if(['context','sentence'].includes(skill)){
          const memory=history.readingProgress?.[task.id]?.transfer?.memory;
          stable=memory?.outcome==='direct'&&memory.step>=1;
        }
      }else if(['hard','exam','expert'].includes(item?.difficulty))demand=3;
    }else if(row.mode==='recall'){
      demand=task.stage===0?1:task.stage===2||!task.cloze?3:2;
      const memory=task.card?.memory;
      stable=task.stage===2&&memory?.outcome==='direct'&&memory.step>=1;
    }else if(row.mode==='detector'){
      demand=(task.level||1)>=2?3:2;
      // The original detector planner is the authority for the unlocked tier.
      stable=demand===3&&history.detectorLevels?.[task.pairId]?.level===task.level;
    }else if(row.mode==='bridge'){
      demand=['order','explain'].includes(task.kind)?3:2;
    }else if(row.mode==='concept'){
      const prior=history.conceptProgress?.[task.id];
      if(prior?.stamp===task.stamp&&prior.last==='direct'&&task.type==='category')demand=1;
    }
    return {...row,challenge:{demand,concrete,stable,short}};
  }
  // The balance picker still decides normal categories. Only ready feasible
  // rows are supplied; protected interventions and the first core station
  // cannot be displaced by optional pacing. No synthetic fallback.
  function pick(rows,selected,{raw=[],now=Date.now(),continuing=false,balancePick,category}={}){
    if(!rows.length)return null;
    const baseline=balancePick(rows,selected);
    if(!baseline||!rows.includes(baseline))return rows[0];
    if(baseline.feedbackPriority>0)return baseline;
    const phase=pace(raw,now,selected);
    const first=!continuing&&!selected.length;
    const core=first&&['need','review'].includes(baseline.reason);
    const pool=core?rows.filter(row=>['need','review'].includes(row.reason)&&category(row)===category(baseline)):rows;
    if(phase==='gentle'){
      // Prefer a known concrete task or actual built-in scaffold. Do not
      // force an unrelated easy task at the expense of a protected review.
      const gentle=pool.filter(row=>row.challenge?.demand===1);
      if(gentle.length)return balancePick(gentle,selected)||baseline;
    }
    if(phase==='stretch'&&!selected.some(row=>row.challenge?.demand===3)){
      const advanced=pool.filter(row=>row.challenge?.demand===3&&row.challenge.stable&&
        row.reason!=='need'&&category(row)===category(baseline));
      if(advanced.length)return balancePick(advanced,selected)||baseline;
    }
    if(baseline.newWord&&baseline.challenge?.demand>1&&baseline.reason!=='need'&&baseline.reason!=='review'){
      const concrete=pool.filter(row=>row.newWord&&row.challenge?.concrete&&category(row)===category(baseline));
      if(concrete.length)return balancePick(concrete,selected)||baseline;
    }
    return baseline;
  }
  function note(row,raw,now=Date.now()){
    const phase=pace(raw,now),demand=row?.challenge?.demand;
    if(phase==='gentle'&&demand===1)return '🌱 En lite lugnare övning. Du får ta den i din egen takt.';
    if(phase==='stretch'&&demand===3&&row.challenge.stable)return '✨ En ny kluring med ord som du har övat tidigare.';
    return '';
  }
  return {DAY,WINDOW,FRESH,sanitize,recent,record,outcome,pace,tag,pick,note};
});
