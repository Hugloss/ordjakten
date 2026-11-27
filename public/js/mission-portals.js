/* The Upptäckarklubben model is deliberately independent of timed quizzes.
 * Only bounded step indexes and optional help state are persisted locally.
 * A solved stage shows its authored reason before "continue" is allowed. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenPortals=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const line=value=>typeof value==='string'&&value.trim()===value&&value.length>=8&&value.length<=260;
  const choice=value=>Number.isInteger(value)&&value>=0&&value<3;
  const fresh=()=>({rev:1,step:0,solved:false,wrong:[],hint:false});
  function catalog(data){
    const stories={},ids=[],errors=[];
    if(!Array.isArray(data?.STORIES)||data.STORIES.length!==12)
      return {stories,ids,errors:['story-count']};
    for(const row of data.STORIES){
      const id=row?.id,stages=row?.stages;
      if(!/^[a-z][a-z0-9-]*$/.test(id||'')||Object.hasOwn(stories,id)||
        !line(row.title)||!line(row.intro)||!line(row.ending)||
        !line(row.keepsake?.name)||!row.keepsake?.emoji||!row.emoji||
        !Array.isArray(stages)||stages.length!==3){
        errors.push(id||'missing-id');continue;
      }
      let valid=true;
      for(const step of stages){
        if(!line(step.title)||!line(step.scene)||!line(step.why)||!Array.isArray(step.clues)||
          step.clues.length!==2||step.clues.some(value=>!line(value))||
          new Set(step.clues).size!==2||!Array.isArray(step.choices)||
          step.choices.length!==3||step.choices.some(value=>!line(value))||
          new Set(step.choices).size!==3||!choice(step.answer)||
          !Array.isArray(step.wrong)||step.wrong.length!==3||
          step.wrong.some((feedback,index)=>index===step.answer?
            feedback!==null:!line(feedback))){
          valid=false;break;
        }
      }
      if(!valid){errors.push(id+':stages');continue;}
      stories[id]=row;ids.push(id);
    }
    if(ids.length!==12)errors.push('incomplete-catalog');
    return {stories,ids,errors};
  }
  function sanitize(raw,content){
    const clean={};
    if(!object(raw))return clean;
    for(const id of content?.ids||[]){
      const source=raw[id],story=content.stories[id];
      if(!object(source)||source.rev!==1||!Number.isInteger(source.step)||
        source.step<0||source.step>3||typeof source.solved!=='boolean'||
        typeof source.hint!=='boolean'||!Array.isArray(source.wrong)||
        source.wrong.length>2||!source.wrong.every(choice))continue;
      const idx=source.step,answer=idx===3?null:story.stages[idx].answer;
      const wrong=source.wrong;
      if(new Set(wrong).size!==wrong.length||wrong.includes(answer)||
        (idx===3&&(!source.solved||source.hint||wrong.length)))continue;
      clean[id]={rev:1,step:idx,solved:source.solved,wrong:[...wrong],hint:source.hint};
    }
    return clean;
  }
  function model(raw,id,content){
    const state=sanitize(raw,content),entries=content.ids.map(key=>{
      const row=content.stories[key],progress=state[key]||fresh();
      return {id:key,emoji:row.emoji,title:row.title,intro:row.intro,
        count:Math.min(3,progress.step+(progress.solved&&progress.step<3?1:0)),
        total:3,done:progress.step===3,keepsake:progress.step===3?{...row.keepsake}:null};
    });
    if(!content.stories[id])return {entries,current:null,doneCount:entries.filter(x=>x.done).length};
    const row=content.stories[id],progress=state[id]||fresh(),done=progress.step===3;
    const stage=done?null:row.stages[progress.step],solved=!done&&progress.solved;
    const current={id,title:row.title,emoji:row.emoji,intro:row.intro,
      step:progress.step,count:done?3:progress.step+(solved?1:0),total:3,done,
      ending:done?row.ending:null,keepsake:done?{...row.keepsake}:null,
      stage:done?null:{
        title:stage.title,scene:stage.scene,clues:[...stage.clues],
        choices:solved?[]:stage.choices.map((label,index)=>({index,label,tried:progress.wrong.includes(index)})),
        wrong:[...progress.wrong],solved,
        feedback:solved?stage.why:progress.wrong.length?
          stage.wrong[progress.wrong.at(-1)]:null,
        hint:progress.hint&&!solved}};
    return {entries,current,doneCount:entries.filter(x=>x.done).length};
  }
  function choose(raw,id,index,content){
    const state=sanitize(raw,content);
    if(!content.stories[id]||!choice(index))return raw;
    const progress=state[id]||fresh();
    if(progress.step===3||progress.solved||progress.wrong.includes(index))return raw;
    const answer=content.stories[id].stages[progress.step].answer;
    return {...state,[id]:{...progress,solved:index===answer,
      wrong:index===answer?progress.wrong:[...progress.wrong,index]}};
  }
  function hint(raw,id,content){
    const state=sanitize(raw,content),progress=state[id]||fresh();
    if(!content.stories[id]||progress.step===3||progress.solved||progress.hint)return raw;
    return {...state,[id]:{...progress,hint:true}};
  }
  function next(raw,id,content){
    const state=sanitize(raw,content),progress=state[id]||fresh();
    if(!content.stories[id]||progress.step>=3||!progress.solved)return raw;
    const step=progress.step+1;
    return {...state,[id]:{rev:1,step,solved:step===3,wrong:[],hint:false}};
  }
  return {catalog,sanitize,model,choose,hint,next};
});
