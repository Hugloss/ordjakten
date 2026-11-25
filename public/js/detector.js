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
        const task={id:scene.id,pairId:pair.id,starter:pair.starter===true,target:target.id,
          word:target.name,definition:target.definition,title:scene.title,text:scene.text,why:scene.why,
          words:[left,right].map(item=>({id:item.id,label:item.name})),
          quotes:[{label:evidence,correct:true},{label:neutral,correct:false}],
          stamp:stamp([scene.id,scene.target,scene.text,evidence,neutral])};
        tasks.push(task);seen.add(scene.id);
      }
    }
    return tasks;
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
  function plan(tasks,raw={},knownIds=new Set(),now=Date.now(),random=Math.random,target=null){
    const progress=sanitize(raw,tasks);
    const knownPairs=new Set(tasks.filter(task=>knownIds.has(task.target)||progress[task.id]).map(task=>task.pairId));
    const rows=tasks.filter(task=>target?task.target===target:task.starter||knownPairs.has(task.pairId))
      .map(task=>({task,card:progress[task.id],dueAt:progress[task.id]?progress[task.id].lastAt+DAY:0,draw:random()}));
    const ready=rows.filter(row=>row.dueAt<=now);
    const rank=row=>needs(row.card)?0:!row.card?1:2;
    ready.sort((a,b)=>rank(a)-rank(b)||a.dueAt-b.dueAt||
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
    const correct=task.quotes.find(quote=>quote.label===selected).correct;
    return correct?'complete':attempts===0?'reread':'guided';
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
  function summary(tasks,progress,target,now=Date.now()){
    const rows=tasks.filter(task=>task.target===target);
    const clean=sanitize(progress,rows);
    const cards=rows.map(task=>clean[task.id]).filter(Boolean);
    return {total:rows.length,seen:cards.length,wordRight:cards.filter(card=>card.wordRight>0).length,
      clueRight:cards.filter(card=>card.clueRight>0).length,
      needsPractice:cards.some(card=>needs(card)&&card.lastAt+DAY<=now),
      ready:rows.some(task=>!clean[task.id]||clean[task.id].lastAt+DAY<=now)};
  }
  return {DAY,LIMIT,ANNOTATIONS,catalog,sanitize,plan,shuffle,clueStep,record,summary};
});
