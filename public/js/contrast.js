/* Ordjakten 0.18–0.19: balanced, editorially written comparisons across environments.
 * No generated stories or AI: every scenario and explanation is in contrasts.json.
 * The planner prefers unseen situations and revisits contexts with demonstrated
 * difficulties; four questions always contain two instances of EACH answer.
 */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenContrast=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ID=/^sv-\d{4,}$/;
  const CONTEXTS=Object.freeze({hem:'🏡 Hemma',skola:'🏫 I skolan',natur:'🌿 I naturen',fritid:'⚽ På fritiden'});
  const shuffle=(items,random=Math.random)=>{
    const result=items.slice();
    for(let i=result.length-1;i>0;i--){const draw=random();const j=Math.min(i,Math.max(0,Math.floor(draw*(i+1))));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  };
  function findPair(id,contrasts){return contrasts?.pairs?.find(pair=>pair.left===id||pair.right===id)||null;}
  function validate(contrasts,bank){
    const problems=[];
    if(!Array.isArray(contrasts?.pairs)||!contrasts.pairs.length)return ['Saknar granskade ordpar.'];
    const words=new Map((bank?.words||[]).map(w=>[w.id,w]));
    const usedPairs=new Set(),pairIds=new Set(),usedWords=new Set();
    for(const pair of contrasts.pairs){
      if(!pair||typeof pair!=='object'){problems.push('Trasigt ordpar.');continue;}
      const pairKey=[pair.left,pair.right].sort().join('|');
      if(!/^js-\d{2,}$/.test(pair.id||'')||pairIds.has(pair.id))problems.push('Dubblerat eller felaktigt par-ID: '+pair.id);
      pairIds.add(pair.id);
      if(!ID.test(pair.left||'')||!ID.test(pair.right||'')||pair.left===pair.right||
        !words.has(pair.left)||!words.has(pair.right)||usedPairs.has(pairKey))problems.push('Felaktiga eller dubblerade ord: '+pair.id);
      usedPairs.add(pairKey);
      for(const id of [pair.left,pair.right]){
        if(usedWords.has(id))problems.push('Ordet används i flera par utan stöd för det: '+id);
        usedWords.add(id);
      }
      if(typeof pair.title!=='string'||pair.title.trim().length<4)problems.push('Saknar rubrik: '+pair.id);
      if(typeof pair.starter!=='boolean')problems.push('Saknar rekommenderad åldersgrupp: '+pair.id);
      if(!Array.isArray(pair.scenes)||pair.scenes.length!==8){problems.push('Behöver åtta situationer: '+pair.id);continue;}
      const counts={[pair.left]:0,[pair.right]:0},seen=new Set(),ids=new Set();
      const domains={[pair.left]:new Set(),[pair.right]:new Set()};
      for(const scene of pair.scenes){
        if(!scene||!Object.hasOwn(counts,scene.target)){problems.push('Okänt facit: '+pair.id);continue;}
        counts[scene.target]++;
        if(!/^js-\d{2,}-\d{2,}$/.test(scene.id||'')||!scene.id.startsWith(pair.id+'-')||ids.has(scene.id))
          problems.push('Dubblerat eller ogiltigt scen-ID: '+pair.id);
        ids.add(scene.id);
        if(!Object.hasOwn(CONTEXTS,scene.context))problems.push('Okänd miljö: '+pair.id);
        else domains[scene.target].add(scene.context);
        if(['title','text','why','difference'].some(key=>typeof scene[key]!=='string'||scene[key].trim().length<(key==='title'?3:18)))
          problems.push('Ofullständig scen: '+pair.id);
        const normalized=String(scene.text||'').toLocaleLowerCase('sv-SE').trim();
        if(seen.has(normalized))problems.push('Dubblerad scen: '+pair.id);
        seen.add(normalized);
        for(const id of [pair.left,pair.right]){
          const word=words.get(id)?.word?.toLocaleLowerCase('sv-SE');
          if(word&&normalized.includes(word))problems.push('Facit syns i scenen: '+pair.id);
        }
      }
      if(counts[pair.left]!==4||counts[pair.right]!==4)problems.push('Varje ord måste vara facit fyra gånger: '+pair.id);
      if([...Object.values(domains)].some(domains=>domains.size<3))problems.push('Varje ord behöver minst tre miljöer: '+pair.id);
    }
    return problems;
  }
  function combinations(items){
    const out=[];
    for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)out.push([items[i],items[j]]);
    return out;
  }
  function planScenes(pair,history={},random=Math.random){
    // Only answers to our approved scene IDs are trusted for adaptation.
    const valid=new Map(pair.scenes.map(scene=>[scene.id,scene]));
    const recent=Array.isArray(history?.recent)?history.recent.slice(-12).filter(event=>{
      const scene=valid.get(event?.sceneId);
      return scene&&scene.target===event.target&&scene.context===event.context&&
        [pair.left,pair.right].includes(event.chosen);
    }):[];
    const lastFour=new Set(recent.slice(-4).map(event=>event.sceneId));
    const left=pair.scenes.filter(s=>s.target===pair.left),right=pair.scenes.filter(s=>s.target===pair.right);
    const candidates=[];
    for(const a of combinations(left))for(const b of combinations(right)){
      const scenes=[...a,...b];
      const domains=new Set(scenes.map(scene=>scene.context));
      if(domains.size<3)continue;
      const seenByTarget=new Set(recent.map(e=>e.target+':'+e.context));
      let score=domains.size*2.5;
      for(const scene of scenes){
        const sceneEvents=recent.filter(event=>event.sceneId===scene.id);
        const contextEvents=recent.filter(event=>event.target===scene.target&&event.context===scene.context);
        const wrong=contextEvents.filter(event=>event.chosen!==event.target).length;
        const right=contextEvents.length-wrong;
        // Novel scenes and novel contexts are preferred over memorized answers.
        score+=sceneEvents.length? -2.8*Math.min(2,sceneEvents.length):4;
        if(lastFour.has(scene.id))score-=4;
        if(!seenByTarget.has(scene.target+':'+scene.context))score+=1.8;
        if(wrong>right)score+=Math.min(3.5,(wrong-right)*2.7);
      }
      // Reward the same concept being tested in two DIFFERENT environments.
      for(const side of [a,b])if(side[0].context!==side[1].context)score+=1.2;
      candidates.push({scenes,score});
    }
    if(!candidates.length)throw new Error('Saknar balanserade vardagssituationer i olika miljöer.');
    // A new, balanced four-story set beats any scoring preference when it
    // exists. Never repeat a just-played story merely to improve a context score.
    const fresh=candidates.filter(item=>item.scenes.every(scene=>!lastFour.has(scene.id)));
    const available=fresh.length?fresh:candidates;
    const max=Math.max(...available.map(item=>item.score));
    const best=available.filter(item=>Math.abs(item.score-max)<1e-8);
    const index=Math.min(best.length-1,Math.max(0,Math.floor(random()*best.length)));
    return shuffle(best[index].scenes,random);
  }
  function create(id,contrasts,bank,random=Math.random,progress={},clues=null,clueData=null,clueProgress={}){
    const pair=findPair(id,contrasts);
    if(!pair)throw new Error('Det finns inget skrivet ordpar för detta ord.');
    const words=new Map(bank?.words?.map(w=>[w.id,w])||[]);
    const left=words.get(pair.left),right=words.get(pair.right);
    if(!left||!right)throw new Error('Ordbanken saknar ett av orden.');
    const history=progress?.[pair.id]||progress||{};
    const tier=clues?.selectLevel(pair,clueData,clueProgress)||1;
    const curated=tier>1?clues.getScenes(pair.id,tier,clueData):[];
    const source=curated.length?{...pair,scenes:curated}:pair;
    const currentTier=curated.length?tier:1;
    const scenes=planScenes(source,history,random);
    const questions=scenes.map(scene=>{
      const target=words.get(scene.target),other=words.get(scene.target===pair.left?pair.right:pair.left);
      return {
        id:target.id,kind:'word',taskType:'contrast',word:target.word,
        definition:target.definition,example:target.example,picture:false,
        contextTitle:scene.title,stem:scene.text,
        contextWhy:scene.why+' Skillnaden mot '+other.word.toLocaleLowerCase('sv-SE')+': '+(scene.difference||pair.scenes.find(s=>s.target===scene.target)?.difference||other.definition),
        contrastClue:scene.clue||'',contrastClueLevel:currentTier,
        contrastPair:pair.id,contrastOther:other.word,
        contrastSceneId:scene.id,contrastContext:scene.context,contrastContextLabel:CONTEXTS[scene.context],
        focusKey:scene.id,
        options:shuffle([{id:pair.left,label:left.word,correct:scene.target===pair.left},
          {id:pair.right,label:right.word,correct:scene.target===pair.right}],random)
      };
    });
    return {pair,questions,label:`${left.word} eller ${right.word}`,
      clueLevel:currentTier,clueSupported:!!clues?.find(pair.id,clueData),
      contexts:[...new Set(questions.map(q=>q.contrastContext))]};
  }
  function choose(contrasts,progress={},random=Math.random,{starterOnly=false,confusions=null,confusionLib=null}={}){
    const pairs=(contrasts?.pairs||[]).filter(pair=>!starterOnly||pair.starter);
    if(!pairs.length)return null;
    const suggested=confusionLib?.recommendations(contrasts,confusions||{},1,{starterOnly})||[];
    if(suggested.length&&suggested[0].recurring)return suggested[0].pair;
    const scores=pairs.map(pair=>{
      const left=progress[pair.left]?.skills?.contrast;
      const right=progress[pair.right]?.skills?.contrast;
      return {pair,attempts:(left?.attempts||0)+(right?.attempts||0),seen:Math.max(left?.lastAt||0,right?.lastAt||0)};
    });
    const attempts=Math.min(...scores.map(s=>s.attempts));
    const candidates=scores.filter(s=>s.attempts===attempts);
    const oldest=Math.min(...candidates.map(s=>s.seen));
    const matching=candidates.filter(s=>s.seen===oldest);
    return matching[Math.min(matching.length-1,Math.max(0,Math.floor(random()*matching.length)))].pair;
  }
  return {CONTEXTS,validate,findPair,planScenes,create,choose,shuffle};
});
