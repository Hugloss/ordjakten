/* Conservative shared interval ladder. These are scheduling rules, not a
 * calibrated estimate of a child's ability or probability of remembering.
 * Each caller keeps its own skill, outcome and content evidence. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenMemory=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DAY=86400000,MAX_TIME=4102444800000;
  const DAYS=Object.freeze([1,3,7,14,30]);
  const EVIDENCE=/^(?:context:[012]|expression:(?:challenge|mission))$/;
  const validTime=value=>Number.isSafeInteger(value)&&value>0&&value<=MAX_TIME;
  function sanitize(value,{maxAt=MAX_TIME,evidenceRequired=false}={}){
    if(!value||typeof value!=='object'||Array.isArray(value)||
      !Number.isInteger(value.step)||value.step<0||value.step>=DAYS.length||
      !validTime(value.lastAt)||value.lastAt>maxAt||
      !['direct','supported','previewed'].includes(value.outcome)||
      (value.outcome==='supported'&&value.step!==0))return null;
    const evidence=typeof value.evidence==='string'&&EVIDENCE.test(value.evidence)?value.evidence:'';
    if(evidenceRequired&&!evidence)return null;
    return {step:value.step,lastAt:value.lastAt,outcome:value.outcome,...(evidence?{evidence}:{})};
  }
  function dueAt(value){
    const card=sanitize(value);
    return card?Math.min(MAX_TIME,card.lastAt+DAYS[card.step]*DAY):0;
  }
  function observe(raw,{outcome,now=Date.now(),lastExposureAt=0,evidence='',different=true,requiresEvidence=false}={}){
    const prior=sanitize(raw,{evidenceRequired:requiresEvidence});
    if(!validTime(now)||!['direct','supported','previewed'].includes(outcome)||
      (requiresEvidence&&!(typeof evidence==='string'&&EVIDENCE.test(evidence)))||
      (prior&&now<prior.lastAt))return prior;
    const event=(step)=>({step,lastAt:now,outcome,...(requiresEvidence?{evidence}:{})});
    // A real supported attempt reopens short review even in ordinary practice.
    if(outcome==='supported')return event(0);
    // Voluntary preview does not claim forgetting or a successful independent
    // answer. Preserve the existing interval, measured from this exposure.
    if(outcome==='previewed')return event(prior?.step||0);
    if(!prior)return event(0);
    // Early repetitions cannot earn a new step or postpone a long interval.
    if(now<dueAt(prior)||now<=prior.lastAt)return prior;
    const last=Math.max(prior.lastAt,validTime(lastExposureAt)?lastExposureAt:0);
    const spaced=now-last>=DAYS[prior.step]*DAY;
    const varied=!requiresEvidence||(different&&prior.evidence!==evidence);
    const advance=prior.outcome==='direct'&&spaced&&varied;
    return event(advance?Math.min(DAYS.length-1,prior.step+1):prior.step);
  }
  function note(due,now=Date.now()){
    if(!validTime(due))return '';
    const left=due-now;
    if(left<=0)return 'Ett återbesök är redo.';
    if(left<DAY)return 'Nästa återbesök väntar senare.';
    const days=Math.ceil(left/DAY);
    return 'Nästa återbesök om ungefär '+days+(days===1?' dag.':' dagar.');
  }
  return {DAY,DAYS,sanitize,dueAt,observe,note};
});
