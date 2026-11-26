/* Orddetektiven: explicitly selected, literal excerpts of existing authored
 * contrast stories. No generated distractors or claims about reading ability.
 * The first word choice and the later evidence choice are different signals. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenDetector=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DAY=86400000,LIMIT=3;
  const ANNOTATIONS=Object.freeze({
  "js-01-01": [
    "knappt att se",
    "runt i sjön"
  ],
  "js-01-02": [
    "kunde se små stenar",
    "långt under ytan"
  ],
  "js-01-03": [
    "såg han inte",
    "på andra sidan"
  ],
  "js-01-06": [
    "såg linjerna på väggen genom det",
    "Laborationsassistenten höll upp ett provrör"
  ],
  "js-02-01": [
    "små, sträva ojämnheter",
    "över den gamla stenmuren"
  ],
  "js-02-02": [
    "fick tydliga gropar",
    "Under cykelturen"
  ],
  "js-02-03": [
    "små hårda korn",
    "Hemma i verktygslådan"
  ],
  "js-02-04": [
    "tydliga intryckningar",
    "mellan två väskor"
  ],
  "js-03-01": [
    "långa blå linjer",
    "Hemma provade Nora"
  ],
  "js-03-02": [
    "runda fläckar",
    "Vid frukosten"
  ],
  "js-03-05": [
    "långa mörka band",
    "Naturgruppen såg en fjäril"
  ],
  "js-03-06": [
    "små vita rundlar",
    "I skogen hittade barnen"
  ],
  "js-04-01": [
    "en tunn vit sky",
    "Hemma i köket"
  ],
  "js-04-02": [
    "små bubblor",
    "I hemmets diskbalja"
  ],
  "js-04-03": [
    "en vit sky som sakta steg",
    "Över soppgrytan hemma"
  ],
  "js-04-08": [
    "massor av små bubblor",
    "När Lea skrubbade cykeln"
  ],
  "js-05-02": [
    "hängde bladen slaka",
    "Efter två veckor"
  ],
  "js-05-04": [
    "helt slappa",
    "I vardagsrummet"
  ],
  "js-05-05": [
    "friska gröna blad",
    "i klassrummet"
  ],
  "js-05-07": [
    "full av täta grönsaker",
    "Efter en regnig sommar"
  ],
  "js-06-02": [
    "lyste upp stigen",
    "På campingturen"
  ],
  "js-06-03": [
    "gnistrade",
    "På dansfesten"
  ],
  "js-06-05": [
    "kastade tillbaka ljus",
    "på affischen"
  ],
  "js-06-08": [
    "skickade ut sitt eget gröngula sken",
    "I skymningen såg barnen en liten insekt"
  ],
  "js-07-01": [
    "lösa flera knutar",
    "Inför bussresan"
  ],
  "js-07-02": [
    "små veck och rynkor",
    "rullade Max ut en papperslapp"
  ],
  "js-07-05": [
    "reda ut knutarna",
    "Efter blåsten"
  ],
  "js-07-08": [
    "små veck",
    "i jackfickan"
  ],
  "js-08-02": [
    "undrade om någon försökt ta sig in",
    "Efter konserten såg vakten"
  ],
  "js-08-03": [
    "ville Nora veta",
    "Hemma i soffan"
  ],
  "js-08-04": [
    "undrade om någon hade tagit den",
    "Efter idrotten i skolan"
  ],
  "js-08-05": [
    "för att få veta hur astronauter kan hoppa där",
    "När klassen pratade om månen"
  ],
  "js-09-01": [
    "helt stilla",
    "På morgonen"
  ],
  "js-09-02": [
    "sprang, skrattade och lekte",
    "på hela skolgården"
  ],
  "js-09-06": [
    "sjöng barnen, dansade",
    "I vardagsrummet"
  ],
  "js-09-07": [
    "Bara en svag vind",
    "Efter vandringen"
  ],
  "js-10-01": [
    "bara en enda",
    "Fiskaren hade sett"
  ],
  "js-10-02": [
    "bara skulle finnas under veckan",
    "På cykelutflykten fick familjen"
  ],
  "js-10-03": [
    "aldrig tidigare sett",
    "Astronomen hade tittat på himlen"
  ],
  "js-10-06": [
    "lämnas tillbaka",
    "en extra stol"
  ],
  "js-11-01": [
    "missade inte en enda rörelse",
    "varje fågel som landade"
  ],
  "js-11-02": [
    "Max förstod inte",
    "Under vandringen"
  ],
  "js-11-07": [
    "följde Dana noga",
    "när signalen kom"
  ],
  "js-11-08": [
    "Kim förstod inte",
    "På skogsstigen"
  ],
  "js-12-02": [
    "utan att kontrollera",
    "Den ansvarige på skolan"
  ],
  "js-12-03": [
    "kontrollerade delarna en extra gång",
    "På modellbyggarklubben följde David"
  ],
  "js-12-04": [
    "struntade i att dra åt skruvarna",
    "Mekanikern på cykelklubben"
  ],
  "js-12-05": [
    "kontrollerade fakta, rättade stavningen",
    "innan arbetet lämnades in"
  ]
});
  // Explicit excerpt annotations, not automatically generated distractors.
  const MEDIUM=Object.freeze({
  "ld-01-2-01": [
    "knappt se botten",
    "När familjen bakade",
    "hamna i vattenkannan"
  ],
  "ld-01-2-02": [
    "läsa texten på etiketten",
    "Nora fyllde glaset",
    "vatten ur kranen"
  ],
  "ld-01-2-03": [
    "syntes inte längre",
    "Efter bildlektionen",
    "sköljts i samma skål"
  ],
  "ld-01-2-08": [
    "se de blå bottenlinjerna",
    "På simträningen",
    "även i bassängens djupa del"
  ],
  "ld-02-2-01": [
    "fast i många små ojämnheter",
    "När Elin drog en tygtrasa",
    "över det obehandlade träet"
  ],
  "ld-02-2-02": [
    "tre tydliga intryckningar",
    "Metallådan föll",
    "från köksbänken"
  ],
  "ld-02-2-03": [
    "strävade mot fingertopparna",
    "I slöjden fick eleverna",
    "drog handen över den"
  ],
  "ld-02-2-08": [
    "flera intryckta gropar",
    "Under fotbollsmatchen",
    "tappade Oskar sin metallflaska"
  ],
  "ld-03-2-03": [
    "långa, parallella",
    "På bokens framsida",
    "hade eleverna målat"
  ],
  "ld-03-2-07": [
    "smala lodräta fält",
    "På matchen",
    "bar domaren en tröja"
  ],
  "ld-03-2-04": [
    "små blå cirklar",
    "Barnen slog in paket",
    "på vit bakgrund"
  ],
  "ld-03-2-08": [
    "runda färgfläckar",
    "Till uppvisningen",
    "hade Nora en kjol"
  ],
  "ld-08-2-01": [
    "ville Leo veta",
    "När pappa bakade",
    "degen blev större"
  ],
  "ld-08-2-02": [
    "om någon dolde något",
    "När familjen kom hem",
    "stod kakburken öppen"
  ],
  "ld-08-2-05": [
    "lära sig mer",
    "Under skogspromenaden",
    "under stenarna"
  ],
  "ld-08-2-04": [
    "ändrat det i smyg",
    "När klassen kom tillbaka",
    "resultat på tavlan"
  ]
});
  const HARD=Object.freeze({
  "ld-01-3-01": {
    "quotes": [
      "se mönstret",
      "gick det inte längre",
      "på bordet genom vattenkannan"
    ],
    "question": "Hur är vattnet efter att mjölet blandats i?"
  },
  "ld-01-3-02": {
    "quotes": [
      "syntes inte kökskaklet",
      "se kaklet igen",
      "bakom karaffen"
    ],
    "question": "Hur är vattnet efter rengöringen?"
  },
  "ld-01-3-03": {
    "quotes": [
      "syntes måttstrecken",
      "försvann strecken ur sikte",
      "Före försöket"
    ],
    "question": "Hur är vattnet efter att provröret skakats?"
  },
  "ld-01-3-08": {
    "quotes": [
      "inte se",
      "följa med blicken igen",
      "de målade linjerna på bassängbotten"
    ],
    "question": "Hur är vattnet efter rengöringen?"
  },
  "ld-02-3-01": {
    "quotes": [
      "fastnade trasan",
      "gled den lätt",
      "när den drogs över träbänken"
    ],
    "question": "Hur kändes träytan före slipningen?"
  },
  "ld-02-3-02": {
    "quotes": [
      "helt plant",
      "runda fördjupningar",
      "Locket på metallådan"
    ],
    "question": "Hur ser metallådans lock ut efter flytten?"
  },
  "ld-02-3-03": {
    "quotes": [
      "rev lite mot fingertopparna",
      "nästan som glas",
      "Eleverna strök med handen över två brädor"
    ],
    "question": "Hur kändes den första brädan?"
  },
  "ld-02-3-06": {
    "quotes": [
      "var plan innan stormen",
      "tryckt in metallen",
      "Efteråt kunde Tilda se"
    ],
    "question": "Hur är skyltens yta efter stormen?"
  },
  "ld-03-3-01": {
    "quotes": [
      "bytte färg på garnet",
      "långa fält",
      "På den färdiga filten"
    ],
    "question": "Hur ser mönstret på filten ut?"
  },
  "ld-03-3-02": {
    "quotes": [
      "en rund kork i färg",
      "tryckte den på flera skilda ställen",
      "När de dekorerade bordsunderlägget"
    ],
    "question": "Vilket mönster fick bordsunderlägget?"
  },
  "ld-03-3-03": {
    "quotes": [
      "från överkant till nederkant",
      "sida vid sida",
      "Eleverna drog var sitt"
    ],
    "question": "Hur ser mönstret på affischen ut?"
  },
  "ld-03-3-04": {
    "quotes": [
      "rund stämpel på många platser",
      "ingen sammanhängande linje",
      "På bildlektionen tryckte klassen"
    ],
    "question": "Hur ser mönstret ut?"
  },
  "ld-08-3-01": {
    "quotes": [
      "ingen använt tidigare",
      "frågade vad som hände",
      "Hemma stod en apparat"
    ],
    "question": "Vilket ord beskriver Kims intresse för apparaten?"
  },
  "ld-08-3-02": {
    "quotes": [
      "stod den på glänt",
      "började kontrollera om någon varit inne",
      "När de kom hem"
    ],
    "question": "Vilket ord passar Lovas sätt att tänka?"
  },
  "ld-08-3-03": {
    "quotes": [
      "något ingen i gruppen väntat sig",
      "göra om försöket för att förstå varför",
      "På NO-lektionen"
    ],
    "question": "Vad beskriver Sofias sätt att tänka?"
  },
  "ld-08-3-08": {
    "quotes": [
      "förpackningen såg öppnad ut",
      "började räkna bitarna",
      "innan han köpte det"
    ],
    "question": "Vad beskriver Måns inställning till säljarens uppgift?"
  }
});
  const LABELS=Object.freeze({1:'🌱 Hitta ledtråden',2:'🔎 Leta bland tre ledtrådar',3:'🧠 Dra en slutsats'});
  const count=n=>Number.isInteger(n)&&n>=0?Math.min(n,9999):0;
  const time=n=>Number.isSafeInteger(n)&&n>=0&&n<=4102444800000?n:0;
  // A changed source/annotation invalidates old fine-grained observations.
  function stamp(parts){
    let hash=2166136261;
    for(const char of parts.join('\u0000')){hash=Math.imul(hash^char.charCodeAt(0),16777619);}
    return (hash>>>0).toString(16).padStart(8,'0');
  }
  function span(text,quote){
    const start=text.indexOf(quote);
    if(!quote||start<0||text.indexOf(quote,start+quote.length)>=0)return null;
    return {start,end:start+quote.length};
  }
  function catalog(words,contrasts,annotations=ANNOTATIONS){
    const byId=new Map(words.map(word=>[word.id,word]));
    const tasks=[],seen=new Set();
    for(const pair of contrasts?.pairs||[]){
      const left=byId.get(pair.left),right=byId.get(pair.right);
      if(!left||!right||left.id===right.id)continue;
      for(const scene of pair.scenes||[]){
        if(seen.has(scene.id)||!Object.hasOwn(annotations,scene.id)||
          ![left.id,right.id].includes(scene.target)||typeof scene.text!=='string')continue;
        const quotes=annotations[scene.id];
        if(!Array.isArray(quotes)||quotes.length!==2||quotes.some(q=>typeof q!=='string'||!q.trim()))continue;
        const [evidence,neutral]=quotes,first=span(scene.text,evidence),second=span(scene.text,neutral);
        if(!first||!second||first.start<second.end&&second.start<first.end)continue;
        const target=byId.get(scene.target);
        const task={id:scene.id,pairId:pair.id,starter:pair.starter===true,target:target.id,level:1,context:scene.context,required:1,
          word:target.name,definition:target.definition,title:scene.title,text:scene.text,why:scene.why,
          words:[left,right].map(item=>({id:item.id,label:item.name})),
          quotes:[{label:evidence,correct:true},{label:neutral,correct:false}],
          stamp:stamp([scene.id,scene.target,scene.text,evidence,neutral])};
        tasks.push(task);seen.add(scene.id);
      }
    }
    return tasks;
  }
  function advancedCatalog(words,contrasts,clues){
    const byId=new Map(words.map(word=>[word.id,word]));
    const pairs=new Map((contrasts?.pairs||[]).map(pair=>[pair.id,pair]));
    const tasks=[],seen=new Set();
    for(const entry of clues?.pairs||[]){
      const pair=pairs.get(entry.id),left=byId.get(pair?.left),right=byId.get(pair?.right);
      if(!left||!right||left.id===right.id)continue;
      for(const tier of entry.levels||[]){
        if(![2,3].includes(tier.level))continue;
        for(const scene of tier.scenes||[]){
          if(seen.has(scene.id)||typeof scene.text!=='string'||![left.id,right.id].includes(scene.target))continue;
          const annotation=tier.level===2?MEDIUM[scene.id]:HARD[scene.id];
          if(!annotation)continue;
          const quotes=tier.level===2?annotation:annotation.quotes;
          if(!Array.isArray(quotes)||quotes.length!==3||quotes.some(q=>typeof q!=='string'||!q.trim()))continue;
          const spans=quotes.map(quote=>span(scene.text,quote));
          if(spans.some(s=>!s)||spans.some((a,i)=>spans.slice(i+1).some(b=>a.start<b.end&&b.start<a.end)))continue;
          const target=byId.get(scene.target),required=tier.level===3?2:1;
          const question=tier.level===3?annotation.question:'Vilket ord passar bäst?';
          if(!question)continue;
          tasks.push({id:scene.id,pairId:pair.id,starter:pair.starter===true,target:target.id,
            level:tier.level,context:scene.context,required,question,word:target.name,definition:target.definition,
            title:scene.title,text:scene.text,why:scene.why,hint:scene.clue,
            words:[left,right].map(item=>({id:item.id,label:item.name})),
            quotes:quotes.map((label,i)=>({label,correct:i<required})),
            stamp:stamp([scene.id,scene.target,scene.text,scene.why,scene.clue,question,...quotes])});
          seen.add(scene.id);
        }
      }
    }
    return tasks;
  }
  // Two distinct, unassisted observations at the current level must include
  // both words, different environments and at least a day between them.
  // Old aggregate counters and previewed words cannot advance a level.
  function maxLevel(tasks,pairId){
    const rows=tasks.filter(task=>task.pairId===pairId);
    let max=1;
    for(const level of [2,3]){
      const tier=rows.filter(task=>task.level===level);
      if(new Set(tier.map(task=>task.target)).size!==2||new Set(tier.map(task=>task.context)).size<2||
        !tier.every(task=>tier.some(other=>other.target!==task.target&&other.context!==task.context)))break;
      max=level;
    }
    return max;
  }
  function sanitizeLevels(raw,tasks){
    const out=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    const pairs=new Set(tasks.map(task=>task.pairId));
    for(const pairId of pairs){
      const max=maxLevel(tasks,pairId),card=raw[pairId];
      if(max===1||!card||typeof card!=='object'||Array.isArray(card)||!time(card.lastAt))continue;
      const level=Number.isInteger(card.level)&&card.level>=1&&card.level<=max?card.level:1;
      const proof=card.proof;
      const task=proof&&tasks.find(row=>row.id===proof.id&&row.pairId===pairId&&
        row.level===level&&row.stamp===proof.stamp);
      const valid=level<max&&task&&time(proof.at)&&proof.at<=card.lastAt;
      out[pairId]={level,lastAt:card.lastAt,proof:valid?{id:task.id,stamp:task.stamp,at:proof.at}:null};
    }
    return out;
  }
  function levelFor(tasks,levels,pairId){
    return sanitizeLevels(levels,tasks)[pairId]?.level||1;
  }
  function recordLevel(raw,tasks,progress,id,now=Date.now()){
    const task=tasks.find(row=>row.id===id),at=time(now);
    if(!task||!at||maxLevel(tasks,task.pairId)===1)return raw;
    const card=sanitize(progress,[task])[id];
    if(!card||card.lastAt!==at||card.word==='previewed')return raw;
    const out=sanitizeLevels(raw,tasks),pairId=task.pairId,max=maxLevel(tasks,pairId);
    const before=out[pairId]||{level:1,lastAt:0,proof:null};
    if(before.level!==task.level||at<=before.lastAt)return raw;
    let level=before.level,proof=before.proof;
    if(card.word!=='right'||card.clue!=='right'){
      level=Math.max(1,level-1);proof=null;
    }else if(level<max){
      const previous=proof&&tasks.find(row=>row.id===proof.id);
      if(previous&&at>=proof.at+DAY&&previous.target!==task.target&&previous.context!==task.context){
        level++;proof=null;
      }else if(!previous)proof={id:task.id,stamp:task.stamp,at};
    }
    out[pairId]={level,lastAt:at,proof};
    return out;
  }
  function sanitize(raw,tasks){
    const result=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return result;
    for(const task of tasks){
      const card=raw[task.id];
      if(!card||typeof card!=='object'||Array.isArray(card)||card.stamp!==task.stamp)continue;
      const attempts=count(card.attempts),lastAt=time(card.lastAt);
      if(!attempts||!lastAt||!['right','helped','previewed'].includes(card.word)||
        !['right','supported'].includes(card.clue))continue;
      result[task.id]={stamp:task.stamp,attempts,lastAt,word:card.word,clue:card.clue,
        wordRight:Math.min(attempts,Math.max(Number(card.word==='right'),count(card.wordRight))),
        clueRight:Math.min(attempts,Math.max(Number(card.clue==='right'),count(card.clueRight)))};
    }
    return result;
  }
  function needs(card){return !!card&&(card.word==='helped'||card.clue==='supported');}
  function plan(tasks,raw={},knownIds=new Set(),now=Date.now(),random=Math.random,target=null,levels={}){
    const progress=sanitize(raw,tasks);
    const knownPairs=new Set(tasks.filter(task=>knownIds.has(task.target)||progress[task.id]).map(task=>task.pairId));
    const tiers=sanitizeLevels(levels,tasks);
    const rows=tasks.filter(task=>(target?task.target===target:task.starter||knownPairs.has(task.pairId))&&
      (task.level||1)===(tiers[task.pairId]?.level||1))
      .map(task=>({task,card:progress[task.id],dueAt:progress[task.id]?progress[task.id].lastAt+DAY:0,draw:random()}));
    const ready=rows.filter(row=>row.dueAt<=now);
    const rank=row=>needs(row.card)?0:!row.card?1:2;
    const completesProof=row=>{
      const proof=tiers[row.task.pairId]?.proof;
      const previous=proof&&tasks.find(task=>task.id===proof.id);
      return !!(previous&&now>=proof.at+DAY&&previous.target!==row.task.target&&previous.context!==row.task.context);
    };
    ready.sort((a,b)=>Number(completesProof(b))-Number(completesProof(a))||
      rank(a)-rank(b)||Number((b.task.level||1)>1)-Number((a.task.level||1)>1)||a.dueAt-b.dueAt||
      Number(knownPairs.has(b.task.pairId))-Number(knownPairs.has(a.task.pairId))||a.draw-b.draw||a.task.id.localeCompare(b.task.id));
    const chosen=[],pairs=new Set();
    for(const row of ready){
      // A quick round never primes the other word of the same comparison.
      if(pairs.has(row.task.pairId))continue;
      chosen.push(row.task);pairs.add(row.task.pairId);
      if(chosen.length===(target?1:LIMIT))break;
    }
    return {round:chosen,ready:ready.length,waiting:rows.length-ready.length};
  }
  function shuffle(items,random=Math.random){
    const copy=items.slice();
    for(let i=copy.length-1;i>0;i--){
      const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  }
  function clueStep(task,selected,attempts){
    if(!Number.isInteger(attempts)||attempts<0||attempts>=2||
      !task.quotes.some(quote=>quote.label===selected))return null;
    if((task.required||1)!==1)return null;
    return evaluateQuotes(task,[task.quotes.findIndex(quote=>quote.label===selected)],attempts);
  }
  function evaluateQuotes(task,selected,attempts){
    const required=task?.required||1;
    if(!task||!Number.isInteger(attempts)||attempts<0||attempts>=2||
      !Array.isArray(selected)||selected.length!==required||new Set(selected).size!==required||
      selected.some(index=>!Number.isInteger(index)||!task.quotes[index]))return null;
    return selected.every(index=>task.quotes[index].correct)?'complete':attempts===0?'reread':'guided';
  }
  function record(raw,tasks,id,{word,clue},now=Date.now()){
    const task=tasks.find(task=>task.id===id),at=time(now);
    if(!task||!at||!['right','helped','previewed'].includes(word)||
      !['right','supported'].includes(clue))return raw;
    const out=sanitize(raw,tasks),prior=out[id];
    if(prior&&at<prior.lastAt+DAY)return raw;
    out[id]={stamp:task.stamp,attempts:Math.min(9999,(prior?.attempts||0)+1),lastAt:at,word,clue,
      wordRight:Math.min(9999,(prior?.wordRight||0)+Number(word==='right')),
      clueRight:Math.min(9999,(prior?.clueRight||0)+Number(clue==='right'))};
    return out;
  }
  function summary(tasks,progress,target,now=Date.now(),levels={}){
    const rows=tasks.filter(task=>task.target===target);
    const clean=sanitize(progress,rows);
    const cards=rows.map(task=>clean[task.id]).filter(Boolean);
    const level=rows.length?levelFor(tasks,levels,rows[0].pairId):1;
    const active=rows.filter(task=>(task.level||1)===level);
    return {total:rows.length,seen:cards.length,wordRight:cards.filter(card=>card.wordRight>0).length,
      clueRight:cards.filter(card=>card.clueRight>0).length,
      level,maxLevel:rows.length?maxLevel(tasks,rows[0].pairId):1,
      needsPractice:active.some(task=>needs(clean[task.id])&&clean[task.id].lastAt+DAY<=now),
      ready:active.some(task=>!clean[task.id]||clean[task.id].lastAt+DAY<=now)};
  }
  return {DAY,LIMIT,ANNOTATIONS,MEDIUM,HARD,LABELS,catalog,advancedCatalog,maxLevel,sanitizeLevels,levelFor,recordLevel,sanitize,plan,shuffle,clueStep,evaluateQuotes,record,summary};
});
