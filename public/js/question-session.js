/* Stateless-content gameplay policies: independent of bank contents and rewards. */
(function(root,factory){
  const assessment=typeof module!=='undefined'&&module.exports?
    require('./assessment-v1'):root.LearningAssessmentV1;
  const api=factory(assessment);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenQuestionSession=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Assessment){
  'use strict';
  if(!Assessment)throw new Error('Learning Assessment v1 must be loaded before sessions');
  function create(registry,{mode,refs,seed=0,sessionId='local-session'}={}){
    if(!registry||typeof registry.present!=='function'||typeof registry.assess!=='function')
      throw new Error('Question registry is required');
    if(!['train','test'].includes(mode))throw new Error('Unsupported game mode');
    if(!Array.isArray(refs)||refs.length===0||refs.length>100)throw new Error('Invalid round size');
    if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295)throw new Error('Invalid round seed');
    if(typeof sessionId!=='string'||!sessionId||sessionId.length>128)throw new Error('Invalid session ID');
    const rounds=refs.map((ref,index)=>({
      ref:{...ref},
      visible:registry.present(ref,{seed:(seed+index)>>>0,instanceId:sessionId+':'+index}),
      grade:null,assessment:null,assistance:'unknown'
    }));
    let index=0;
    let finished=false;
    function current(){
      if(finished||index>=rounds.length)return null;
      const row=rounds[index];
      return {index,total:rounds.length,answered:row.grade!==null,question:{
        ...row.visible,ref:{...row.visible.ref},skillIds:[...row.visible.skillIds],
        responseSpec:{...row.visible.responseSpec,...(row.visible.responseSpec.options?
          {options:row.visible.responseSpec.options.map(o=>({...o}))}:{})}
      }};
    }
    function answer(response,{assistance='unknown'}={}){
      if(finished||index>=rounds.length)throw new Error('Round has finished');
      const row=rounds[index];
      if(row.grade!==null)throw new Error('Question was already answered');
      if(!['unknown','none','hint','retry','revealed'].includes(assistance))
        throw new Error('Invalid assistance observation');
      const detailed=typeof registry.assessDetailed==='function'?
        registry.assessDetailed(row.ref,response):null;
      const grade=detailed?{status:detailed.status}:registry.assess(row.ref,response);
      if(['invalid','incomplete'].includes(grade.status))return {accepted:false,feedback:null};
      row.grade=grade;
      row.assessment=detailed;
      row.assistance=assistance;
      return {accepted:true,feedback:mode==='train'?{...grade}:null};
    }
    function next(){
      if(finished||index>=rounds.length)throw new Error('Round has finished');
      if(rounds[index].grade===null)throw new Error('Answer the question before continuing');
      index+=1;
      return current();
    }
    function finish(){
      if(finished)throw new Error('Round already finished');
      if(rounds.some(row=>row.grade===null))throw new Error('Cannot finish an unanswered round');
      finished=true;
      const outcomes=rounds.map(row=>({ref:{...row.ref},status:row.grade.status}));
      const count=status=>outcomes.filter(row=>row.status===status).length;
      const assessments=rounds.map(row=>row.assessment?
        JSON.parse(JSON.stringify(row.assessment)):null);
      const complete=assessments.filter(Boolean);
      const evidence=rounds.filter(row=>row.assessment).map((row,index)=>({
        attemptId:row.visible.instanceId,instanceId:row.visible.instanceId,
        mode,assistance:row.assistance,assessment:JSON.parse(JSON.stringify(row.assessment))
      }));
      return {mode,answered:outcomes.length,correct:count('correct'),
        incorrect:count('incorrect'),partial:count('partial'),
        ungraded:count('ungraded'),needsReview:count('needs-review'),
        outcomes,assessments,
        assessmentSummary:Assessment.summarize(complete),evidence};
    }
    function snapshot(){
      return {mode,index,total:rounds.length,answered:rounds.filter(row=>row.grade!==null).length,
        finished,refs:rounds.map(row=>({...row.ref}))};
    }
    return {current,answer,next,finish,snapshot};
  }
  return {create};
});
