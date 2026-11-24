/* Ordjakten 0.19 – Ledtrådstrappan.
 * Curated, balanced inference scenes for selected child-friendly word pairs.
 * A four-question SESSION moves a child one gentle step up only after
 * three correct responses INCLUDING both words. One difficult session can
 * move a step down, without removing discoveries, stars or past results.
 * No inference about a child's ability is made from ordinary tests.
 */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenClues=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LABELS=Object.freeze({1:'🌱 Tydliga ledtrådar',2:'🔎 Läs mellan raderna',3:'🧠 Dra egna slutsatser'});
  const CONTEXTS=new Set(['hem','skola','natur','fritid']);
  const MAX=999;
  function find(pairId,bank){return bank?.pairs?.find(item=>item.id===pairId)||null;}
  function getScenes(pairId,level,bank){return find(pairId,bank)?.levels?.find(tier=>tier.level===level)?.scenes||[];}
  function enrich(contrasts,bank){
    return {pairs:(contrasts?.pairs||[]).map(pair=>({
      ...pair,scenes:[...pair.scenes,...(find(pair.id,bank)?.levels||[]).flatMap(item=>item.scenes)]
    }))};
  }
  function validate(data,contrasts,words){
    const problems=[];
    const validPairs=new Map((contrasts?.pairs||[]).map(pair=>[pair.id,pair]));
    const vocab=new Map((words?.words||[]).map(word=>[word.id,word.word.toLocaleLowerCase('sv-SE')]));
    if(!Array.isArray(data?.pairs)||!data.pairs.length)return ['Saknar ledtrådsberättelser.'];
    const seenPairs=new Set(),seenIds=new Set();
    for(const entry of data.pairs){
      const pair=validPairs.get(entry?.id);
      if(!pair||seenPairs.has(entry.id)){problems.push('Dubblerat eller okänt ordpar: '+entry?.id);continue;}
      seenPairs.add(entry.id);
      if(!Array.isArray(entry.levels)||entry.levels.length!==2||
        entry.levels.map(x=>x.level).sort().join(',')!=='2,3'){
        problems.push('Båda svårighetsstegen måste finnas för '+entry.id);continue;
      }
      for(const tier of entry.levels){
        if(!Array.isArray(tier.scenes)||tier.scenes.length!==8){problems.push('Åtta berättelser behövs för '+entry.id+' nivå '+tier.level);continue;}
        const counts={[pair.left]:0,[pair.right]:0};
        const contexts={[pair.left]:new Set(),[pair.right]:new Set()},texts=new Set();
        for(const scene of tier.scenes){
          if(!scene||!Object.hasOwn(counts,scene.target)){problems.push('Okänt facit: '+entry.id);continue;}
          counts[scene.target]++;
          if(!new RegExp('^ld-'+entry.id.slice(3)+'-'+tier.level+'-\\d{2}$').test(scene.id)||seenIds.has(scene.id))
            problems.push('Duplicerat scen-ID: '+scene.id);
          seenIds.add(scene.id);
          if(!CONTEXTS.has(scene.context))problems.push('Okänd miljö: '+scene.id);
          else contexts[scene.target].add(scene.context);
          if(['title','text','why','clue'].some(key=>typeof scene[key]!=='string'||scene[key].trim().length<(key==='title'?3:18)))
            problems.push('Saknar begriplig text: '+scene.id);
          const normalized=String(scene.text||'').trim().toLocaleLowerCase('sv-SE');
          if(texts.has(normalized))problems.push('Dubblerad berättelse: '+scene.id);
          texts.add(normalized);
          if([vocab.get(pair.left),vocab.get(pair.right)].some(word=>word&&normalized.includes(word)))
            problems.push('Facit står i frågan: '+scene.id);
        }
        if(counts[pair.left]!==4||counts[pair.right]!==4)problems.push('Facit ska vara 4 + 4 för '+entry.id+' nivå '+tier.level);
        if(contexts[pair.left].size<3||contexts[pair.right].size<3)problems.push('Båda orden behöver minst tre miljöer: '+entry.id);
      }
    }
    return problems;
  }
  function sanitize(raw,bank){
    const result=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return result;
    for(const entry of bank?.pairs||[]){
      const value=raw[entry.id];if(!value||typeof value!=='object'||Array.isArray(value))continue;
      const stage=Number.isInteger(value.level)&&value.level>=1&&value.level<=3?value.level:1;
      const visits=Number.isInteger(value.visits)&&value.visits>=0?Math.min(MAX,value.visits):0;
      const reached=Number.isInteger(value.reached)&&value.reached>=1&&value.reached<=3?Math.max(stage,value.reached):stage;
      const lastScore=Number.isInteger(value.lastScore)&&value.lastScore>=0&&value.lastScore<=4?value.lastScore:null;
      result[entry.id]={level:stage,visits,reached,lastScore};
    }
    return result;
  }
  function selectLevel(pair,bank,progress={}){
    return find(pair?.id,bank)?(sanitize(progress,bank)[pair.id]?.level||1):1;
  }
  function eligibleScene(scene,pair,level,contrasts,bank){
    if(!scene||!pair)return false;
    const scenes=level===1?pair.scenes:getScenes(pair.id,level,bank);
    return scenes.some(s=>s.id===scene.contrastSceneId&&s.target===scene.id&&
      s.text===scene.stem&&s.context===scene.contrastContext&&
      (scene.contrastClueLevel||1)===level);
  }
  function recordRound(raw,questions,answers,contrasts,bank){
    if(!Array.isArray(questions)||questions.length!==4||!Array.isArray(answers)||answers.length!==4||
      answers.some(outcome=>!['right','wrong'].includes(outcome)))return raw;
    const pair=(contrasts?.pairs||[]).find(p=>p.id===questions[0]?.contrastPair);
    if(!pair||!find(pair.id,bank))return raw;
    const level=questions[0].contrastClueLevel||1;
    if(![1,2,3].includes(level))return raw;
    const ids=new Set(),contexts=new Set(),counts={[pair.left]:0,[pair.right]:0};
    for(const q of questions){
      if(q.taskType!=='contrast'||q.contrastPair!==pair.id||!eligibleScene(q,pair,level,contrasts,bank)||
        !Array.isArray(q.options)||q.options.length!==2||
        !q.options.some(o=>o.id===q.id&&o.correct===true)||
        !q.options.some(o=>o.id!==q.id&&o.correct===false)||
        new Set(q.options.map(o=>o.id)).size!==2||
        q.options.some(o=>![pair.left,pair.right].includes(o.id)||o.correct!==(o.id===q.id))||
        ids.has(q.contrastSceneId))return raw;
      ids.add(q.contrastSceneId);contexts.add(q.contrastContext);counts[q.id]++;
    }
    if(counts[pair.left]!==2||counts[pair.right]!==2||contexts.size<3)return raw;
    const output=sanitize(raw,bank),before=output[pair.id]||{level:1,visits:0,reached:1,lastScore:null};
    // Never use a stale or forged round to move past the current stage.
    if(before.level!==level)return raw;
    const total=answers.filter(v=>v==='right').length;
    const both=[pair.left,pair.right].every(id=>questions.some((q,i)=>q.id===id&&answers[i]==='right'));
    const next=total>=3&&both?Math.min(3,level+1):total<=1?Math.max(1,level-1):level;
    output[pair.id]={level:next,reached:Math.max(before.reached,next),visits:Math.min(MAX,before.visits+1),lastScore:total};
    return output;
  }
  return {LABELS,find,getScenes,enrich,validate,sanitize,selectLevel,recordRound};
});
