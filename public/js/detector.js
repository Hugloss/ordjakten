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
    "Det gick knappt att se ner under ytan",
    "i sjön"
  ],
  "js-01-02": [
    "kunde se små stenar på botten",
    "Nora"
  ],
  "js-01-03": [
    "Nu såg han inte sin hand på andra sidan",
    "Oskar"
  ],
  "js-01-04": [
    "gick det lätt att se fiskarna genom det klara vattnet",
    "familjen"
  ],
  "js-02-01": [
    "massor av små, sträva ojämnheter",
    "Under utflykten"
  ],
  "js-02-02": [
    "Metallen trycktes in på tre ställen och fick tydliga gropar",
    "Under cykelturen"
  ],
  "js-02-03": [
    "ytan hade små hårda korn",
    "Hemma i verktygslådan"
  ],
  "js-02-04": [
    "fick flera tydliga intryckningar",
    "Hemma"
  ],
  "js-03-01": [
    "långa blå linjer från axeln ner till kanten",
    "Hemma"
  ],
  "js-03-02": [
    "små röda runda fläckar, åtskilda från varandra",
    "Vid frukosten"
  ],
  "js-03-05": [
    "långa mörka band som löpte tvärs över de ljusa vingarna",
    "Naturgruppen"
  ],
  "js-03-06": [
    "många små vita rundlar",
    "I skogen"
  ],
  "js-04-01": [
    "steg en tunn vit sky från den nykokta tekoppen",
    "Hemma i köket"
  ],
  "js-04-02": [
    "vattenytan fylldes av små bubblor",
    "I hemmets diskbalja"
  ],
  "js-04-03": [
    "en vit sky som sakta steg",
    "hemma"
  ],
  "js-04-08": [
    "täcktes borsten av massor av små bubblor",
    "När Lea skrubbade cykeln"
  ],
  "js-05-02": [
    "hängde bladen slaka och blomman hade tappat spänsten",
    "Efter två veckor"
  ],
  "js-05-05": [
    "kraftiga stjälkar och mängder av friska gröna blad",
    "i klassrummet"
  ],
  "js-05-04": [
    "bladen kändes helt slappa",
    "I vardagsrummet"
  ],
  "js-06-02": [
    "En stark ljusstråle lyste upp stigen",
    "På campingturen"
  ],
  "js-06-03": [
    "gnistrade små blanka paljetter",
    "På dansfesten"
  ],
  "js-06-05": [
    "kastade tillbaka ljus",
    "på affischen"
  ],
  "js-07-01": [
    "snott sig runt varandra så att hon fick lösa flera knutar",
    "Inför bussresan"
  ],
  "js-07-02": [
    "full av små veck och rynkor",
    "Hemma"
  ],
  "js-07-03": [
    "ett virrvarr av öglor och knutar",
    "Hemma"
  ],
  "js-07-08": [
    "full av små veck",
    "i jackfickan"
  ],
  "js-08-01": [
    "ville lära sig hur roboten fungerade",
    "Sam"
  ],
  "js-08-02": [
    "undrade om någon försökt ta sig in",
    "Efter konserten"
  ],
  "js-08-03": [
    "ville Nora veta varför planeter rör sig",
    "Hemma i soffan"
  ],
  "js-08-04": [
    "undrade om någon hade tagit den",
    "Efter idrotten i skolan"
  ],
  "js-09-01": [
    "Inga röster eller ljud störde lugnet",
    "På morgonen"
  ],
  "js-09-02": [
    "sprang, skrattade och lekte samtidigt",
    "på hela skolgården"
  ],
  "js-09-07": [
    "Bara en svag vind hördes i träden",
    "Efter vandringen"
  ],
  "js-09-06": [
    "sjöng barnen, dansade och pratade glatt i mun på varandra",
    "I vardagsrummet"
  ],
  "js-10-01": [
    "bara en enda med den här färgen",
    "Fiskaren"
  ],
  "js-10-02": [
    "bara skulle finnas under veckan",
    "På cykelutflykten"
  ],
  "js-10-03": [
    "aldrig tidigare sett just en sådan ljusblixt",
    "Astronomen"
  ],
  "js-10-06": [
    "På måndag skulle den lämnas tillbaka",
    "Familjen"
  ],
  "js-11-01": [
    "missade inte en enda rörelse",
    "Elsa"
  ],
  "js-11-02": [
    "förstod inte vilken han skulle välja",
    "Under vandringen"
  ],
  "js-11-07": [
    "följde Dana noga tränarens tecken",
    "På planen"
  ],
  "js-11-08": [
    "Kim förstod inte vilken väg som var rätt",
    "På skogsstigen"
  ],
  "js-12-01": [
    "mätte Ella presentpappret noga, vek jämna kanter",
    "Hemma"
  ],
  "js-12-02": [
    "gick hem utan att kontrollera att ytterdörren var låst",
    "på skolan"
  ],
  "js-12-03": [
    "kontrollerade delarna en extra gång",
    "På modellbyggarklubben"
  ],
  "js-12-04": [
    "struntade i att dra åt skruvarna trots att det ingick i säkerhetskontrollen",
    "på cykelklubben"
  ],
  "js-05-07": [
    "full av täta grönsaker och höga friska solrosor",
    "odlingslotten"
  ],
  "js-06-08": [
    "skickade ut sitt eget gröngula sken",
    "I skymningen"
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
