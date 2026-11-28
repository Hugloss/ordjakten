/* Stateless-content gameplay policies: independent of bank contents and rewards. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenQuestionSession=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
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
      grade:null
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
    function answer(response){
      if(finished||index>=rounds.length)throw new Error('Round has finished');
      const row=rounds[index];
      if(row.grade!==null)throw new Error('Question was already answered');
      const grade=registry.assess(row.ref,response);
      if(grade.status==='invalid')return {accepted:false,feedback:null};
      row.grade=grade;
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
      const correct=outcomes.filter(x=>x.status==='correct').length;
      return {mode,answered:outcomes.length,correct,incorrect:outcomes.length-correct,outcomes};
    }
    function snapshot(){
      return {mode,index,total:rounds.length,answered:rounds.filter(row=>row.grade!==null).length,
        finished,refs:rounds.map(row=>({...row.ref}))};
    }
    return {current,answer,next,finish,snapshot};
  }
  return {create};
});
