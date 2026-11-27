/* Balance completed adventure stations, not ability, grades or minutes.
 * The rolling target is advisory: the existing engine controls readiness,
 * difficulty, overlap and feedback. Store only four anonymous category codes. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenBalance=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const WINDOW=20;
  const TARGET=Object.freeze({develop:40,review:30,discover:20,creative:10});
  const LABELS=Object.freeze({
    develop:'🎯 Utveckla ord',review:'🌱 Minnas igen',discover:'🔎 Upptäcka ord',creative:'🛠️ Skapa med ord'
  });
  const valid=value=>typeof value==='string'&&Object.hasOwn(TARGET,value);
  function kind(row){
    if(!row)return null;
    if(row.reason==='need'||row.reason==='related')return 'develop';
    if(row.reason==='review')return 'review';
    if(row.mode==='workshop')return 'creative';
    if(row.reason==='discover'||row.reason==='extend')return row.newWord===true?'discover':'develop';
    return null;
  }
  function sanitize(raw){
    return Array.isArray(raw)?raw.slice(-WINDOW).filter(valid):[];
  }
  function record(raw,row){
    const category=kind(row);
    if(!category)return raw;
    return sanitize(raw).concat(category).slice(-WINDOW);
  }
  function recordCompletion(raw,row,finished,seen){
    if(!finished||!kind(row)||seen.has(row))return raw;
    seen.add(row);
    return record(raw,row);
  }
  function summary(raw){
    const recent=sanitize(raw),counts={develop:0,review:0,discover:0,creative:0};
    for(const key of recent)counts[key]++;
    return {total:recent.length,counts};
  }
  // Feasible rows arrive sorted by the coordinator's existing priorities.
  // Recompute a shortfall after each provisional choice, including eviction
  // of the oldest category when the rolling window is full. No stored debt.
  function pick(ordered,raw,selected=[],{continuing=false}={}){
    if(!ordered.length)return null;
    const recent=sanitize(raw);
    let pool=ordered;
    // Preserve feasible feedback stations throughout the round. A pending
    // follow-up (2) precedes opening another alternative (1).
    const urgent=ordered.filter(row=>Number.isFinite(row.feedbackPriority)&&row.feedbackPriority>0);
    if(urgent.length)return urgent.reduce((best,row)=>row.feedbackPriority>best.feedbackPriority?row:best);
    if(!selected.length&&!continuing){
      // Preserve the familiar easy-word launch for a brand-new child.
      if(!recent.length)return ordered[0];
      // Reserve the first feasible station for observed need or a due
      // review when available. Balance may choose between those categories.
      const core=ordered.filter(row=>row.reason==='need'||row.reason==='review');
      if(core.length)pool=core;
    }
    const provisional=selected.map(kind).filter(valid);
    const past=recent.concat(provisional).slice(-(WINDOW-1));
    const {counts}=summary(past);
    const length=past.length+1;
    let best=null,score=-Infinity;
    for(const row of pool){
      const category=kind(row);
      if(!category)continue;
      // Integer arithmetic for exact tie handling. Base order breaks ties.
      const value=TARGET[category]*length-100*counts[category];
      if(value>score){best=row;score=value;}
    }
    return best||pool[0];
  }
  return {WINDOW,TARGET,LABELS,kind,sanitize,record,recordCompletion,summary,pick};
});
