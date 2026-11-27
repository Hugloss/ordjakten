/* Feedback on practice recommendations. Small, local, objective-specific
 * episodes. Later observations are associations, never causal effects.
 * Do not duplicate the engines' spacing or assess free-form sentences. */
(function(root,factory){
  const missions=typeof module!=='undefined'&&module.exports?require('./missions'):root.OrdjaktenMissions;
  const api=factory(missions);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenFeedback=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Missions){
  'use strict';
  const DAY=86400000,WINDOW=60*DAY,LIMIT=4,MAX_TIME=4102444800000;
  const time=n=>Number.isSafeInteger(n)&&n>0&&n<=MAX_TIME;
  const stamp=value=>{
    let hash=2166136261;
    for(const char of JSON.stringify(value))hash=Math.imul(hash^char.charCodeAt(0),16777619);
    return (hash>>>0).toString(16).padStart(8,'0');
  };
  function catalog({words,contexts,surprises,missions,conceptContent,bridgeTasks,detectorTasks,contrasts}){
    const objectives=Object.create(null),methods=Object.create(null);
    const link=(key,mode,version,targets)=>{
      const valid=[...new Set(targets.filter(target=>Object.hasOwn(objectives,target)))];
      if(valid.length)methods[key]={key,mode,stamp:stamp(version),targets:valid};
    };
    for(const word of words){
      const id=word.id;
      const version=[word.id,word.name,word.definition,word.example];
      objectives['recall:'+id]={stamp:stamp(version),mode:'recall',id,evidence:['']};
      let scenes=[],alternatives=null;
      if(word.kind==='word'){
        const row=contexts?.wordContexts?.find(x=>x.id===id);
        const sources=(row?.readingDistractors||[]).map(sourceId=>contexts.wordContexts.find(other=>other.id===sourceId&&other.id!==id)).filter(Boolean);
        if(new Set(sources.map(source=>source.id)).size>=2){
          scenes=row.scenes.map((scene,index)=>['context:'+index,scene.text]);
          // A changed wrong story changes the task too. Do not compare a
          // pending practice episode with a different set of Aha alternatives.
          alternatives=sources.map(source=>[source.id,source.scenes.map(scene=>scene.text)]);
        }
      }else{
        const challenge=surprises?.challenges?.find(x=>x.id===id);
        const mission=missions?.missions?.find(x=>x.id===id);
        if(mission&&Object.hasOwn(mission,'contextScenes')){
          const reviewed=Missions.contextScenes(missions,id).filter(scene=>scene.kind==='meaning');
          scenes=reviewed.map(scene=>['expression:context:'+scene.id,scene.prompt]);
          // Asking for missing information is useful practice, but is not
          // evidence of identifying one intended meaning. A changed scene,
          // explanation or wrong answer also invalidates pending comparisons.
          alternatives=[mission.contextReading,reviewed];
        }else{
          const a=challenge?.options?.find(x=>x.correct)?.label,b=mission?.sentences?.find(x=>x.correct)?.label;
          if(a&&b&&a!==b)scenes=[['expression:challenge',a],['expression:mission',b]];
        }
      }
      if(scenes.length>=2)objectives['aha:'+id]={stamp:stamp(alternatives?[version,scenes,alternatives]:[version,scenes]),mode:'aha',id,evidence:scenes.map(s=>s[0])};
      const pair=contrasts?.pairs?.find(p=>[p.left,p.right].includes(id));
      link('workshop:'+id,'workshop',[version,pair||null],['recall:'+id,'aha:'+id]);
    }
    for(const task of conceptContent.tasks)
      objectives['concept:'+task.id]={stamp:task.stamp,mode:'concept',id:task.id,evidence:['']};
    for(const task of detectorTasks)
      link('detector:'+task.id,'detector',[task.stamp],['aha:'+task.target]);
    for(const task of bridgeTasks){
      // A group exercise may prepare the exact original question, but cannot
      // stand in for the result. Require the answer to actually be involved.
      const targets=conceptContent.tasks.filter(q=>q.groupId===task.groupId&&task.participants.includes(q.answer))
        .map(q=>'concept:'+q.id);
      link('bridge:'+task.id,'bridge',[task.stamp],targets);
    }
    return {objectives,methods};
  }
  function validMethod(content,key,method,version,objective){
    const m=content.methods[key];
    return !!m&&m.mode===method&&m.stamp===version&&m.targets.includes(objective);
  }
  function sanitize(raw,content,now=Date.now()){
    const out=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    for(const [key,spec] of Object.entries(content.objectives)){
      const row=raw[key];
      if(!row||row.stamp!==spec.stamp||!time(row.lastAt)||row.lastAt>now||
        !spec.evidence.includes(row.evidence)||!['direct','supported','previewed'].includes(row.last))continue;
      const streak=row.last==='supported'&&Number.isInteger(row.streak)?Math.min(3,Math.max(1,row.streak)):0;
      const trials=(Array.isArray(row.trials)?row.trials:[]).slice(-LIMIT).filter(t=>t&&
        validMethod(content,t.key,t.method,t.stamp,key)&&time(t.at)&&time(t.checkedAt)&&
        t.checkedAt>=t.at+DAY&&t.checkedAt<=t.at+WINDOW&&t.checkedAt<=row.lastAt&&
        ['direct','supported'].includes(t.outcome)).map(t=>({key:t.key,method:t.method,stamp:t.stamp,at:t.at,checkedAt:t.checkedAt,outcome:t.outcome}));
      const p=row.pending;
      const pending=p&&row.last==='supported'&&p.baselineAt===row.lastAt&&p.evidence===row.evidence&&
        time(p.at)&&p.at>=row.lastAt&&p.at<=now&&now-p.at<=WINDOW&&
        validMethod(content,p.key,p.method,p.stamp,key)?
        {key:p.key,method:p.method,stamp:p.stamp,at:p.at,baselineAt:p.baselineAt,evidence:p.evidence}:null;
      out[key]={stamp:spec.stamp,lastAt:row.lastAt,last:row.last,evidence:row.evidence,streak,trials,pending};
    }
    return out;
  }
  function seed(raw,content,history,now=Date.now()){
    const out=sanitize(raw,content,now);
    for(const [key,spec] of Object.entries(content.objectives)){
      if(out[key])continue;
      let card,outcome,evidence='';
      if(spec.mode==='aha'){
        card=history.readingProgress?.[spec.id]?.transfer;
        if(card?.memory?.outcome==='supported'&&card.memory.lastAt===card.lastAt&&card.memory.evidence===card.lastEvidence){
          outcome='supported';evidence=card.lastEvidence;
        }
      }else if(spec.mode==='recall'){
        card=history.recallProgress?.[spec.id];
        if(card?.memory?.outcome==='supported'&&card.memory.lastAt===card.lastAt)outcome='supported';
      }else{
        card=history.conceptProgress?.[spec.id];
        if(card?.stamp===spec.stamp&&card.last==='supported')outcome='supported';
      }
      // Old counters and previewed attempts cannot manufacture a baseline.
      if(outcome&&time(card.lastAt)&&card.lastAt<=now&&spec.evidence.includes(evidence))
        out[key]={stamp:spec.stamp,lastAt:card.lastAt,last:outcome,evidence,streak:1,trials:[],pending:null};
    }
    return out;
  }
  function observe(raw,content,{key,outcome,evidence='',now=Date.now()}){
    const spec=content.objectives[key];
    if(!spec||!time(now)||!spec.evidence.includes(evidence)||!['direct','supported','previewed'].includes(outcome))return raw;
    // Refuse out-of-order events without discarding future records if the
    // local clock goes backwards.
    if(time(raw?.[key]?.lastAt)&&raw[key].lastAt>=now)return raw;
    const out=sanitize(raw,content,now),prior=out[key];
    if(!prior&&outcome!=='supported')return raw;
    let trials=prior?.trials||[];
    let streak=outcome==='supported'?1:0;
    const different=spec.mode!=='aha'||prior?.evidence!==evidence;
    if(outcome==='supported'&&prior?.last==='supported'&&!prior.pending&&now-prior.lastAt>=DAY&&different)
      streak=Math.min(3,prior.streak+1);
    const p=prior?.pending;
    if(p&&outcome!=='previewed'&&now>=p.at+DAY&&now<=p.at+WINDOW&&different){
      trials=trials.concat({key:p.key,method:p.method,stamp:p.stamp,at:p.at,checkedAt:now,outcome}).slice(-LIMIT);
    }
    // An early, identical Aha example, preview, or expired check is not a
    // result of this trial. It ends the pending episode without a label.
    out[key]={stamp:spec.stamp,lastAt:now,last:outcome,evidence,streak,trials,pending:null};
    return out;
  }
  function methodRank(row,method){
    const results=row.trials.filter(t=>t.method===method);
    const direct=results.filter(t=>t.outcome==='direct').length;
    // Small within-objective preference only; not an estimated effect size.
    return direct>results.length-direct?0:results.length===0?1:2;
  }
  function adjust(candidates,raw,content,now=Date.now()){
    const progress=sanitize(raw,content,now);
    const byKey=new Map(candidates.map(row=>[row.key,row]));
    const replacements=new Map(),wait=new Set();
    // Collect pending holds first, so an alternative linked to two
    // objectives cannot bypass the other objective's observation window.
    const sources=Object.entries(progress).sort((a,b)=>Number(!!b[1].pending)-Number(!!a[1].pending)||
      a[1].lastAt-b[1].lastAt||a[0].localeCompare(b[0]));
    for(const [key,row] of sources){
      const source=byKey.get(key);
      if(row.pending){
        // Avoid scheduling more optional alternatives while a follow-up is
        // pending, even when the original engine is not yet ready. Never
        // block a different directly observed need or a deliberate manual visit.
        for(const c of candidates)if(['related','extend','discover'].includes(c.reason)&&
          content.methods[c.key]?.targets.includes(key))wait.add(c.key);
        if(source){
          if(now<row.pending.at+DAY)wait.add(key);
          else replacements.set(key,{...source,feedbackPriority:2,explanation:'Prova samma mål efter en paus, så ser vi hur det går nu.'});
        }
        continue;
      }
      if(!source)continue; // No new queue, no bypass of an engine's readiness.
      if(row.last!=='supported'||row.streak<2||source.reason!=='need')continue;
      const alternatives=candidates.filter(c=>{
        const m=content.methods[c.key];
        return m&&m.mode===c.mode&&m.targets.includes(key)&&!replacements.has(c.key)&&!wait.has(c.key)&&
          ['related','extend','discover'].includes(c.reason)&&source.words.some(id=>c.words.includes(id));
      }).sort((a,b)=>methodRank(row,a.mode)-methodRank(row,b.mode)||
        Number(b.reason==='related')-Number(a.reason==='related')||a.key.localeCompare(b.key));
      const choice=alternatives[0];
      if(!choice)continue;
      const m=content.methods[choice.key];
      replacements.set(choice.key,{...choice,reason:'need',feedbackPriority:1,
        explanation:'Det här har varit klurigt flera gånger. Prova ett annat sätt först; vi återkommer senare.',
        feedback:{objective:key,baselineAt:row.lastAt,method:m.mode,key:m.key,stamp:m.stamp}});
    }
    return candidates.filter(c=>!wait.has(c.key)).map(c=>replacements.get(c.key)||c);
  }
  function complete(raw,content,step,now=Date.now()){
    const f=step?.feedback;
    if(!f||step.key!==f.key||step.mode!==f.method||!time(now)||
      !validMethod(content,f.key,f.method,f.stamp,f.objective))return raw;
    const out=sanitize(raw,content,now),row=out[f.objective];
    if(!row||row.pending||row.last!=='supported'||row.streak<2||row.lastAt!==f.baselineAt||now<row.lastAt)return raw;
    out[f.objective]={...row,pending:{key:f.key,method:f.method,stamp:f.stamp,at:now,baselineAt:row.lastAt,evidence:row.evidence}};
    return out;
  }
  function summary(raw,content,now=Date.now()){
    const rows=Object.values(sanitize(raw,content,now)),trials=rows.flatMap(row=>row.trials);
    return {pending:rows.filter(row=>row.pending).length,checked:trials.length,
      direct:trials.filter(t=>t.outcome==='direct').length,supported:trials.filter(t=>t.outcome==='supported').length};
  }
  return {DAY,WINDOW,LIMIT,catalog,sanitize,seed,observe,adjust,complete,summary};
});
