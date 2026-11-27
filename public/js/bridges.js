/* Ordbroar: bounded editorial tasks linked to the concept map. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenBridges=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LIMIT=3,DAY=86400000;
  const TYPES=Object.freeze({sort:{icon:'🧺',label:'Sortera ord'},odd:{icon:'🔎',label:'Hitta ordet som inte passar'},
    order:{icon:'🧩',label:'Ord i rätt följd'},bridge:{icon:'🌉',label:'Bygg en ordbro'},explain:{icon:'💬',label:'Förklara skillnaden'}});
  const DATA=Object.freeze([
  {
    "id": "ob-01",
    "groupId": "bk-11",
    "kind": "sort",
    "prompt": "Sortera efter vad orden beskriver.",
    "bins": [
      "Väder",
      "Form"
    ],
    "cards": [
      "sv-0046",
      "sv-0049",
      "sv-0051",
      "sv-0016",
      "sv-0034",
      "sv-0067"
    ],
    "solution": [
      0,
      0,
      0,
      1,
      1,
      1
    ],
    "hint": "Tänk på himlen eller formen på en sak.",
    "why": "Regnig, molnig och åskig handlar om väder. Rund, avlång och triangelformad beskriver form."
  },
  {
    "id": "ob-02",
    "groupId": "bk-13",
    "kind": "sort",
    "prompt": "Sortera orden efter deras betydelse.",
    "bins": [
      "Rörelser",
      "Känslor"
    ],
    "cards": [
      "sv-0054",
      "sv-0055",
      "sv-0057",
      "sv-0060",
      "sv-0061",
      "sv-0095"
    ],
    "solution": [
      0,
      0,
      0,
      1,
      1,
      1
    ],
    "hint": "En rörelse är något kroppen gör. En känsla beskriver hur någon känner sig.",
    "why": "Flygande, simmande och springande beskriver rörelser; förvånad, skrämd och lättad beskriver känslor."
  },
  {
    "id": "ob-03",
    "groupId": "bk-16",
    "kind": "sort",
    "prompt": "Sortera efter vilken egenskap orden beskriver.",
    "bins": [
      "Ljus",
      "Ljud"
    ],
    "cards": [
      "sv-0007",
      "sv-0018",
      "sv-0037",
      "sv-0009",
      "sv-0010",
      "sv-0045"
    ],
    "solution": [
      0,
      0,
      0,
      1,
      1,
      1
    ],
    "hint": "Kan du se det, eller handlar ordet främst om något du hör?",
    "why": "Glittrig, lysande och speglande beskriver ljus eller ljusets återgivning. Surrande, prasslig och dånande beskriver ljud."
  },
  {
    "id": "ob-04",
    "groupId": "bk-17",
    "kind": "sort",
    "prompt": "Vilka ord beskriver temperatur? Vilka uttryck handlar om något annat?",
    "bins": [
      "Temperatur",
      "Bildligt om lugn eller hopp"
    ],
    "cards": [
      "sv-0052",
      "sv-0053",
      "sv-0070",
      "ut-0003",
      "ut-0004",
      "ut-0018"
    ],
    "solution": [
      0,
      0,
      0,
      1,
      1,
      1
    ],
    "hint": "I ett bildligt uttryck behöver inte varje ord betyda precis vad det brukar.",
    "why": "Iskall, het och frusen beskriver temperatur eller hur kyla känns. Uttrycken handlar om lugn eller hopp."
  },
  {
    "id": "ob-05",
    "groupId": "bk-11",
    "kind": "odd",
    "prompt": "Tre ord beskriver väder. Vilket ord beskriver i stället formen på en sak?",
    "cards": [
      "sv-0046",
      "sv-0047",
      "sv-0048",
      "sv-0034"
    ],
    "answer": "sv-0034",
    "hint": "Tänk på väder på himlen och hur en sak kan se ut.",
    "why": "Avlång beskriver form. Regnig, snöig och solig beskriver väder."
  },
  {
    "id": "ob-06",
    "groupId": "bk-12",
    "kind": "odd",
    "prompt": "Tre ord beskriver form. Vilket ord beskriver i stället temperatur?",
    "cards": [
      "sv-0016",
      "sv-0066",
      "sv-0067",
      "sv-0052"
    ],
    "answer": "sv-0052",
    "hint": "Tänk på hörn och form, inte hur kallt något är.",
    "why": "Iskall handlar om temperatur. Rund, fyrkantig och triangelformad handlar om form."
  },
  {
    "id": "ob-07",
    "groupId": "bk-14",
    "kind": "odd",
    "prompt": "Tre ord beskriver känslor. Vilket ord beskriver i stället hur en yta känns?",
    "cards": [
      "sv-0060",
      "sv-0086",
      "sv-0095",
      "sv-0001"
    ],
    "answer": "sv-0001",
    "hint": "Skilj känslor från egenskaper hos ytor.",
    "why": "Skrovlig betyder att en yta är sträv och ojämn. Förvånad, förargad och lättad beskriver känslor."
  },
  {
    "id": "ob-08",
    "groupId": "bk-06",
    "kind": "odd",
    "prompt": "Tre uttryck handlar om att börja, fortsätta eller ta itu med något. Vilket handlar i stället om att sluta försöka?",
    "cards": [
      "ut-0011",
      "ut-0014",
      "ut-0017",
      "ut-0015"
    ],
    "answer": "ut-0015",
    "hint": "Tänk på skillnaden mellan att försöka och att ge upp.",
    "why": "Kasta in handduken betyder att ge upp. Sätta fart, få blodad tand och ta tjuren vid hornen handlar om att börja, vilja fortsätta eller ta itu med något."
  },
  {
    "id": "ob-09",
    "groupId": "bk-14",
    "kind": "order",
    "prompt": "Vilket ord passar i varje steg i berättelsen, från början till slut?",
    "cards": [
      "sv-0060",
      "sv-0061",
      "sv-0095"
    ],
    "slots": [
      "Nora hör ett oväntat ljud och reagerar med förvåning.",
      "Hon tror att något farligt har hänt och blir rädd.",
      "Hon märker att det bara var katten. Oron försvinner."
    ],
    "hint": "Först kommer överraskningen, sedan rädslan, sist försvinner oron.",
    "why": "Förvånad beskriver reaktionen på det oväntade. Skrämd beskriver rädslan. Lättad beskriver när oron försvinner."
  },
  {
    "id": "ob-10",
    "groupId": "bk-18",
    "kind": "order",
    "prompt": "Välj uttrycken i den ordning de passar i tävlingen.",
    "cards": [
      "ut-0004",
      "ut-0018",
      "ut-0006"
    ],
    "slots": [
      "Innan start hoppas du att din vän lyckas.",
      "Under en stressig stund tänker du lugnt och klokt.",
      "Efter loppet passar du din väns väska."
    ],
    "hint": "Tänk på skillnaden mellan att hoppas, behålla lugnet och passa något.",
    "why": "Hålla tummarna handlar om hopp. Hålla huvudet kallt handlar om lugnt tänkande. Hålla ett öga på handlar om uppsikt."
  },
  {
    "id": "ob-11",
    "groupId": "bk-13",
    "kind": "order",
    "prompt": "Ordna rörelseorden så de passar i berättelsens tre steg.",
    "cards": [
      "sv-0057",
      "sv-0008",
      "sv-0055"
    ],
    "slots": [
      "Flickan tar snabba löpsteg över gräset till badplatsen.",
      "Hon släpper en boll som träffar marken och far upp igen.",
      "Sedan tar hon sig fram i vattnet med armtag och bensparkar."
    ],
    "hint": "Läs varje steg; orden beskriver olika rörelser.",
    "why": "Löpstegen visar springande. Bollen är studsande när den träffar marken och far tillbaka upp. Sedan simmar flickan genom att ta armtag och sparka med benen."
  },
  {
    "id": "ob-12",
    "groupId": "bk-15",
    "kind": "order",
    "prompt": "Följ vad som händer med sikten i de tre situationerna.",
    "cards": [
      "sv-0003",
      "sv-0044",
      "sv-0050"
    ],
    "slots": [
      "Du ser rakt igenom det rena glaset.",
      "Du rör ner lera i vattnet och sikten försämras.",
      "Ute över sjön ligger dimma i luften."
    ],
    "hint": "Är det glaset, vätskan eller luften du beskriver?",
    "why": "Genomskinlig beskriver något du ser igenom. Grumlig beskriver en oklar vätska. Dimmig beskriver luft med dimma."
  },
  {
    "id": "ob-13",
    "groupId": "bk-12",
    "kind": "bridge",
    "prompt": "Rund och fyrkantig beskriver olika former. Vilket tredje ord hör ihop med båda genom att också beskriva form?",
    "cards": [
      "sv-0067",
      "sv-0052",
      "sv-0026"
    ],
    "answer": "sv-0067",
    "hint": "Leta efter ett ord som beskriver hur en sak är formad.",
    "why": "Triangelformad beskriver form, precis som rund och fyrkantig.",
    "anchors": [
      "sv-0016",
      "sv-0066"
    ]
  },
  {
    "id": "ob-14",
    "groupId": "bk-02",
    "kind": "bridge",
    "prompt": "Vilket ord binder ihop skör och varsam: det beskriver något som lätt skadas och därför behöver hanteras försiktigt?",
    "cards": [
      "sv-0093",
      "sv-0007",
      "sv-0080"
    ],
    "answer": "sv-0093",
    "hint": "Vad behöver du vara rädd om?",
    "why": "Ömtålig ligger nära skör. Något ömtåligt behöver ofta hanteras varsamt.",
    "anchors": [
      "sv-0012",
      "sv-0088"
    ]
  },
  {
    "id": "ob-15",
    "groupId": "bk-03",
    "kind": "bridge",
    "prompt": "Vilket uttryck kan knyta ihop ha is i magen och ett stressigt ögonblick: att tänka lugnt och klokt?",
    "cards": [
      "ut-0018",
      "ut-0011",
      "ut-0020"
    ],
    "answer": "ut-0018",
    "hint": "Tänk på hur du kan agera när du är stressad.",
    "why": "Hålla huvudet kallt och ha is i magen handlar om att behålla lugnet, med lite olika betoning.",
    "anchors": [
      "ut-0003"
    ]
  },
  {
    "id": "ob-16",
    "groupId": "bk-16",
    "kind": "bridge",
    "prompt": "Glittrig och lysande har med ljus att göra. Vilket ord binder ihop dem genom att handla om att en yta återger en bild med hjälp av ljus?",
    "cards": [
      "sv-0037",
      "sv-0001",
      "sv-0045"
    ],
    "answer": "sv-0037",
    "hint": "Tänk på något du kan se din spegelbild i.",
    "why": "Speglande handlar om återkastat ljus som ger en bild, inte om att själv lysa.",
    "anchors": [
      "sv-0007",
      "sv-0018"
    ]
  },
  {
    "id": "ob-17",
    "groupId": "bk-07",
    "kind": "explain",
    "prompt": "Vilken förklaring passar orden varsam och försiktig?",
    "cards": [
      "sv-0088",
      "sv-0094"
    ],
    "choices": [
      "Båda kan handla om att undvika skador. Varsam beskriver särskilt hur du hanterar något.",
      "Varsam beskriver en sak som lätt går sönder. Försiktig beskriver en sak med vassa kanter.",
      "Orden betyder alltid att någon är rädd och inte vågar prova något nytt."
    ],
    "answer": 0,
    "hint": "En person kan vara både varsam och försiktig.",
    "why": "Du är varsam när du sätter ner ett glas mjukt så att det inte får en stöt. Du är försiktig när du går långsamt på ett halt golv för att inte ramla. Orden kan passa samtidigt."
  },
  {
    "id": "ob-18",
    "groupId": "bk-08",
    "kind": "explain",
    "prompt": "Varför kan något vara både ovanligt och tillfälligt?",
    "cards": [
      "sv-0092",
      "sv-0109"
    ],
    "choices": [
      "Det kan inträffa sällan och samtidigt bara vara en kort tid.",
      "Orden beskriver alltid två helt motsatta egenskaper.",
      "Båda betyder bara att något varar en begränsad tid."
    ],
    "answer": 0,
    "hint": "Tänk på hur ofta något händer jämfört med hur länge det varar.",
    "why": "Om biblioteket nästan aldrig stänger under sina vanliga öppettider är en sådan stängning ovanlig. Om det öppnar igen i morgon är stängningen också tillfällig. Det ena ordet handlar om hur ofta, det andra om hur länge."
  },
  {
    "id": "ob-19",
    "groupId": "bk-16",
    "kind": "explain",
    "prompt": "Varför kan en discokula vara glittrig utan att vara en egen ljuskälla?",
    "cards": [
      "sv-0007",
      "sv-0018"
    ],
    "choices": [
      "Den kan kasta tillbaka ljus från en lampa utan att själv skapa ljus.",
      "En glittrig sak måste själv ge ifrån sig ljus, medan en lysande sak bara återkastar ljus.",
      "En glittrig sak återger alltid en tydlig spegelbild."
    ],
    "answer": 0,
    "hint": "Fundera på varifrån ljuset kommer.",
    "why": "Glittrig betonar att något glimmar i ljus. Lysande kan beskriva något som självt ger ifrån sig ljus."
  },
  {
    "id": "ob-20",
    "groupId": "bk-10",
    "kind": "explain",
    "prompt": "Vad är skillnaden mellan förvånad och häpnadsväckande?",
    "cards": [
      "sv-0060",
      "sv-0105"
    ],
    "choices": [
      "Förvånad beskriver personens reaktion; häpnadsväckande beskriver något som väcker stark förundran.",
      "Förvånad beskriver det som väcker förundran; häpnadsväckande beskriver personens reaktion.",
      "Båda beskriver alltid en persons egen reaktion."
    ],
    "answer": 0,
    "hint": "Skilj den som reagerar från det som får personen att reagera.",
    "why": "En person blir förvånad. En häpnadsväckande händelse väcker stark förundran."
  }
]);
  const text=x=>typeof x==='string'&&x.trim().length>0;
  const distinct=items=>new Set(items).size===items.length;
  function stamp(value){
    let hash=2166136261;
    for(const char of JSON.stringify(value))hash=Math.imul(hash^char.charCodeAt(0),16777619);
    return (hash>>>0).toString(16).padStart(8,'0');
  }
  function catalog(words,relations,data=DATA){
    const byId=new Map(words.map(w=>[w.id,w])),byGroup=new Map(relations.groups.map(g=>[g.id,g]));
    const tasks=[],errors=[],ids=new Set(),prompts=new Set();
    if(!Array.isArray(data))return {tasks,errors:['Saknar Ordbroar.']};
    for(const row of data){
      const group=byGroup.get(row?.groupId),prompt=text(row?.prompt)?row.prompt.trim().toLocaleLowerCase('sv-SE'):'';
      if(!row||!/^ob-\d{2}$/.test(row.id)||ids.has(row.id)||!Object.hasOwn(TYPES,row.kind)||
        !group||!prompt||prompts.has(prompt)||!text(row.hint)||!text(row.why)||
        !Array.isArray(row.cards)||!distinct(row.cards)||row.cards.some(id=>!byId.has(id))||
        (row.anchors!==undefined&&(!Array.isArray(row.anchors)||!distinct(row.anchors)||row.anchors.some(id=>!byId.has(id))))||
        !group.words.some(word=>row.cards.includes(word.id))){
        errors.push('Ogiltig ordbro: '+row?.id);continue;
      }
      let valid=false;
      if(row.kind==='sort')valid=row.cards.length>=4&&row.cards.length<=6&&Array.isArray(row.bins)&&row.bins.length===2&&
        row.bins.every(text)&&distinct(row.bins)&&Array.isArray(row.solution)&&row.solution.length===row.cards.length&&
        row.solution.every(n=>n===0||n===1)&&row.solution.includes(0)&&row.solution.includes(1);
      if(row.kind==='order')valid=row.cards.length===3&&Array.isArray(row.slots)&&row.slots.length===3&&row.slots.every(text)&&distinct(row.slots);
      if(row.kind==='odd'||row.kind==='bridge')valid=row.cards.length===(row.kind==='odd'?4:3)&&row.cards.includes(row.answer);
      if(row.kind==='explain')valid=row.cards.length===2&&Array.isArray(row.choices)&&row.choices.length===3&&
        row.choices.every(text)&&distinct(row.choices)&&Number.isInteger(row.answer)&&row.answer>=0&&row.answer<3;
      if(!valid){errors.push('Ogiltigt facit: '+row.id);continue;}
      ids.add(row.id);prompts.add(prompt);
      const participants=[...new Set([...(row.anchors||[]),...row.cards])];
      tasks.push({...row,starter:group.starter,type:group.type,groupTitle:group.title,participants,
        everyday:group.everyday!==false&&participants.every(id=>byId.get(id).everyday!==false),
        labels:Object.fromEntries(row.cards.map(id=>[id,byId.get(id).name])),
        stamp:stamp([row,group.explanation,participants.map(id=>[id,byId.get(id).name,byId.get(id).definition])])});
    }
    return {tasks,errors};
  }
  function evaluate(task,selection){
    if(!task)return null;
    if(task.kind==='sort'){
      if(!selection||typeof selection!=='object'||Array.isArray(selection)||
        Object.keys(selection).length!==task.cards.length||task.cards.some(id=>!Object.hasOwn(selection,id)||![0,1].includes(selection[id])))return null;
      return task.cards.every((id,i)=>selection[id]===task.solution[i]);
    }
    if(task.kind==='order'){
      if(!Array.isArray(selection)||selection.length!==task.cards.length||!distinct(selection)||selection.some(id=>!task.cards.includes(id)))return null;
      return task.cards.every((id,i)=>selection[i]===id);
    }
    if(task.kind==='explain'){
      if(!Number.isInteger(selection)||selection<0||selection>=task.choices.length)return null;
    }else if(!task.cards.includes(selection))return null;
    return selection===task.answer;
  }
  function result(task,selection,attempts,previewed=false){
    if(!Number.isInteger(attempts)||attempts<0||attempts>=2)return null;
    const correct=evaluate(task,selection);
    if(correct===null)return null;
    if(!correct&&attempts===0)return {step:'retry',outcome:null};
    return {step:correct?'complete':'guided',outcome:previewed?'previewed':correct&&attempts===0?'direct':'supported'};
  }
  function plan(content,progress={},known=new Set(),now=Date.now(),random=Math.random,{type='all',wordId=null,groupId=null,kind='all'}={}){
    const cardFor=task=>{
      const card=progress?.[task.id];
      return card?.stamp===task.stamp&&Number.isSafeInteger(card.lastAt)&&card.lastAt>0&&
        card.lastAt<=4102444800000&&Number.isInteger(card.attempts)&&card.attempts>0&&
        ['direct','supported','previewed'].includes(card.last)?card:null;
    };
    const rows=content.tasks.filter(task=>(wordId||groupId||task.everyday!==false)&&
      (type==='all'||task.type===type)&&(kind==='all'||task.kind===kind)&&
      (!groupId||task.groupId===groupId)&&(!wordId||task.participants.includes(wordId))&&
      (wordId||groupId||type!=='all'||kind!=='all'||task.starter||task.participants.some(id=>known.has(id))||cardFor(task)))
      .map(task=>{const card=cardFor(task);return {task,card,dueAt:card?card.lastAt+DAY:0,draw:random()};});
    const ready=rows.filter(row=>row.dueAt<=now);
    const rank=row=>row.card?.last==='supported'?0:!row.card?1:row.card.last==='previewed'?2:3;
    ready.sort((a,b)=>rank(a)-rank(b)||a.dueAt-b.dueAt||
      Number(b.task.participants.some(id=>known.has(id)))-Number(a.task.participants.some(id=>known.has(id)))||
      a.draw-b.draw||a.task.id.localeCompare(b.task.id));
    const round=[],seen=new Set(),kinds=new Set(),words=new Set(),limit=groupId?1:LIMIT;
    function take(items,diverse=false){
      for(const row of items){
        if(round.length>=limit)break;
        const task=row.task;
        if(seen.has(task.groupId)||task.participants.some(id=>words.has(id))||(diverse&&kinds.has(task.kind)))continue;
        round.push(task);seen.add(task.groupId);kinds.add(task.kind);task.participants.forEach(id=>words.add(id));
      }
    }
    take(ready.filter(row=>row.card?.last==='supported'));take(ready,true);take(ready);
    return {round,available:ready.map(row=>row.task),ready:ready.length,waiting:rows.length-ready.length};
  }
  function solutionLines(task){
    if(task.kind==='sort')return task.bins.map((bin,index)=>bin+': '+task.cards.filter((_,i)=>task.solution[i]===index).map(id=>task.labels[id]).join(', '));
    if(task.kind==='order')return task.slots.map((slot,i)=>task.labels[task.cards[i]]+' – '+slot);
    if(task.kind==='explain')return [task.choices[task.answer]];
    return [task.labels[task.answer]];
  }
  return {LIMIT,DAY,TYPES,DATA,catalog,evaluate,result,plan,solutionLines};
});
