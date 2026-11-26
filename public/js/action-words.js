/* Authored semantic actions in ordinary untimed training. Recognition
 * examples, not extra scored questions or independent transfer evidence. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.OrdjaktenActionWords=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const DATA=[
  {
    "word": "sv-0025",
    "id": "stretch",
    "title": "Den töjbara bron",
    "prompt": "Välj något elastiskt att fästa mellan pinnarna.",
    "target": "Fäst föremålet mellan pinnarna",
    "why": "Gummibandet kan sträckas och återgå till sin form. Det är elastiskt.",
    "answer": "rubber",
    "options": [
      [
        "rubber",
        "➰",
        "Gummiband"
      ],
      [
        "stick",
        "🪵",
        "Stel träpinne"
      ],
      [
        "stone",
        "🪨",
        "Hård sten"
      ],
      [
        "paper",
        "📄",
        "Vanligt papper"
      ]
    ]
  },
  {
    "word": "sv-0003",
    "id": "window",
    "title": "Fönstret till hemligheten",
    "prompt": "En ledtråd ligger bakom fönstret. Välj ett genomskinligt material till rutan.",
    "target": "Sätt materialet i fönstret",
    "why": "Ljus passerar genom den klara glasskivan. Du kan se tecknet bakom den.",
    "answer": "glass",
    "options": [
      [
        "glass",
        "🪟",
        "Klar glasskiva"
      ],
      [
        "wood",
        "🪵",
        "Tät träskiva"
      ],
      [
        "cardboard",
        "📦",
        "Tät kartongskiva"
      ],
      [
        "metal",
        "🔩",
        "Tät stålplåt"
      ]
    ]
  },
  {
    "word": "sv-0068",
    "id": "magnet",
    "title": "Den försvunna järnringen",
    "prompt": "Järnringen ligger utom räckhåll. Välj ett magnetiskt föremål för att få tag i den.",
    "target": "För föremålet mot järnringen",
    "why": "Magneten drar till sig järnringen utan att först behöva röra vid den.",
    "answer": "magnet",
    "options": [
      [
        "magnet",
        "🧲",
        "Hästskomagnet"
      ],
      [
        "wood",
        "🪵",
        "Träbit"
      ],
      [
        "cloth",
        "🧣",
        "Tygbit"
      ],
      [
        "stone",
        "🪨",
        "Vanlig sten"
      ]
    ]
  },
  {
    "word": "sv-0012",
    "id": "nest",
    "title": "Det sköra ägget",
    "prompt": "Ett skört ägg behöver flyttas till boet. Hur gör du?",
    "target": "Flytta ägget till boet",
    "why": "Ett skört skal kan lätt gå sönder. En mjuk korg skyddar det när du bär det försiktigt.",
    "answer": "nest",
    "options": [
      [
        "nest",
        "🧺",
        "Bär i en mjuk, vadderad korg"
      ],
      [
        "throw",
        "🏐",
        "Kasta ägget"
      ],
      [
        "shake",
        "📦",
        "Skaka ägget i en hård låda"
      ],
      [
        "roll",
        "🛝",
        "Rulla ägget nedför en trappa"
      ]
    ]
  },
  {
    "word": "sv-0035",
    "id": "whirl",
    "title": "Lövens dans",
    "prompt": "Löven ska röra sig virvlande i luften. Vilken rörelse väljer du?",
    "target": "Ge löven en rörelse",
    "why": "När löven snurrar runt i luften rör de sig virvlande.",
    "answer": "spin",
    "options": [
      [
        "spin",
        "🌀",
        "Snurra runt i luften"
      ],
      [
        "still",
        "🍂",
        "Ligga stilla"
      ],
      [
        "straight",
        "➡️",
        "Flyga rakt fram"
      ],
      [
        "fall",
        "⬇️",
        "Falla rakt ner"
      ]
    ]
  },
  {
    "word": "sv-0018",
    "id": "light",
    "title": "Ljus i grottan",
    "prompt": "Det är mörkt i grottan. Hitta ett lysande föremål.",
    "target": "För föremålet in i grottan",
    "why": "Den tända ficklampan ger ifrån sig ljus.",
    "answer": "torch",
    "options": [
      [
        "torch",
        "🔦",
        "Tänd ficklampa"
      ],
      [
        "book",
        "📕",
        "Stängd bok"
      ],
      [
        "stone",
        "🪨",
        "Vanlig sten"
      ],
      [
        "teddy",
        "🧸",
        "Nalle"
      ]
    ]
  },
  {
    "word": "sv-0076",
    "id": "share",
    "title": "Frukt till vännerna",
    "prompt": "Du har en korg med frukt. Tre vänner har ingen. Hur kan du vara generös?",
    "target": "Visa vad du vill göra med frukten",
    "why": "Att gärna dela med sig, till exempel bjuda sina vänner på frukt, är att vara generös.",
    "answer": "share",
    "options": [
      [
        "share",
        "🍎",
        "Bjuda vännerna på frukt"
      ],
      [
        "hide",
        "🙈",
        "Gömma all frukt"
      ],
      [
        "keep",
        "🧺",
        "Behålla all frukt själv"
      ],
      [
        "trade",
        "💰",
        "Kräva att vännerna betalar för frukten"
      ]
    ]
  },
  {
    "word": "sv-0088",
    "id": "care",
    "title": "Den lilla fantasifiguren",
    "prompt": "En ömtålig fantasifigur ska lyftas ner från en hylla. Hur är du varsam?",
    "target": "Välj hur figuren ska lyftas",
    "why": "Att stödja hela figuren och lyfta lugnt är varsamt. Då minskar risken att den skadas.",
    "answer": "support",
    "options": [
      [
        "support",
        "🤲",
        "Stöd hela figuren och lyft lugnt"
      ],
      [
        "rush",
        "⚡",
        "Dra snabbt i figurens arm"
      ],
      [
        "push",
        "➡️",
        "Knuffa ner figuren"
      ],
      [
        "shake",
        "📦",
        "Skaka figuren ur en låda"
      ]
    ]
  }
,
  {
    "word": "sv-0027",
    "id": "wilt",
    "title": "Blomman som hänger",
    "prompt": "En vissnad blomma hänger ner och jorden är torr. Vad kan hjälpa den att återhämta sig?",
    "target": "Hjälp blomman i krukan",
    "why": "En vissnad växt har tappat sin spänst. Om den har vissnat av vattenbrist kan vatten och tid hjälpa den att återhämta sig, om den fortfarande lever.",
    "answer": "water",
    "options": [
      [
        "water",
        "💧",
        "Vattna den torra jorden och ge blomman tid"
      ],
      [
        "paper",
        "📄",
        "Lägga torrt papper på jorden"
      ],
      [
        "pull",
        "🍃",
        "Dra i bladen"
      ],
      [
        "hide",
        "📦",
        "Ställa blomman i en stängd låda"
      ]
    ]
  },
  {
    "word": "sv-0043",
    "id": "tangle",
    "title": "Garnets hemliga knut",
    "prompt": "Ett trassligt garnnystan har snott ihop sig i slingor och knutar. Hur får du fram en rakare tråd?",
    "target": "Hjälp till att reda ut garnet",
    "why": "När garnet är trassligt har trådarna snott ihop sig. Genom att försiktigt lossa slingorna och knutarna kan du reda ut det.",
    "answer": "loosen",
    "options": [
      [
        "loosen",
        "🧶",
        "Lossa slingorna och knutarna försiktigt"
      ],
      [
        "tighten",
        "🪢",
        "Dra hårt i båda ändarna"
      ],
      [
        "crush",
        "📦",
        "Trycka ihop nystanet i en liten låda"
      ],
      [
        "twist",
        "🌀",
        "Snurra ihop tråden ännu mer"
      ]
    ]
  }
];
 const byWord=new Map(DATA.map(row=>[row.word,row]));
 function eligible(settings,q){
   return !!q&&q.kind==='word'&&typeof q.picture==='boolean'&&
     (!q.taskType||q.taskType==='meaning')&&settings?.mode==='train'&&
     settings.timerMode==='off'&&settings.difficulty!=='exam'&&!settings.reviewOnly&&
     !settings.contextOnly&&byWord.has(q.id);
 }
 function adapt(settings,q,random=Math.random){
   if(!eligible(settings,q))return q;
   const row=byWord.get(q.id),options=row.options.map(([id,emoji,label])=>({id,emoji,label,correct:id===row.answer}));
   for(let i=options.length-1;i>0;i--){
     const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));
     [options[i],options[j]]=[options[j],options[i]];
   }
   // Keep the selected recognition skill; no context scene index is invented.
   return {...q,taskType:'action',options,stem:row.prompt,action:{id:row.id,title:row.title,prompt:row.prompt,target:row.target,why:row.why}};
 }
 function adaptRound(settings,questions,random=Math.random){return questions.map(q=>adapt(settings,q,random));}
 function validate(bank){
   const known=new Set((bank?.words||[]).map(row=>row.id)),seen=new Set(),errors=[];
   for(const row of DATA){
     if(!known.has(row.word)||seen.has(row.word)||seen.has(row.id)||!['title','prompt','target','why'].every(key=>typeof row[key]==='string'&&row[key].trim())||
       row.options.length!==4||new Set(row.options.map(o=>o[0])).size!==4||new Set(row.options.map(o=>o[2])).size!==4||
       row.options.filter(o=>o[0]===row.answer).length!==1||!row.options.every(o=>o.length===3&&o.every(v=>typeof v==='string'&&v.trim())))errors.push(row.word);
     seen.add(row.word);seen.add(row.id);
   }
   return errors;
 }
 // Optional, reversible experiments after a worked example. They are not
 // answers, do not measure dexterity, and never change a learning record.
 const EXPERIMENTS=Object.freeze({
   stretch:{label:'Dra i gummibandet',instruction:'Dra över bilden eller använd reglaget. Prova att sträcka bandet och låta det dra ihop sig igen.',low:'Bandet är avslappnat.',mid:'Bandet sträcks ut.',high:'Bandet är längre. Prova att låta det dra ihop sig igen.'},
   magnet:{label:'Flytta magneten',instruction:'Dra magneten närmare järnringen. Se när ringen följer med.',low:'Magneten är långt från ringen.',mid:'Magneten närmar sig ringen.',high:'Magneten drar till sig järnringen!'},
   whirl:{label:'Snurra löven',instruction:'Dra över bilden eller flytta reglaget för att snurra löven runt mitten.',low:'Löven vilar.',mid:'Löven rör sig runt mitten.',high:'Löven har virvlat ett helt varv!'},
   wilt:{label:'Låt tiden gå efter vattning',instruction:'Dra fram tiden i vår låtsasbild. En levande, törstig växt kan återhämta sig gradvis efter vattning.',low:'Bladen hänger. Jorden har fått vatten.',mid:'Blomman börjar räta på sig.',high:'I berättelsen har blomman återhämtat sig.'},
   tangle:{label:'Red ut garnet',instruction:'Dra försiktigt över bilden och följ hur slingorna försvinner.',low:'Garnet är trassligt.',mid:'Några slingor har lossnat.',high:'Tråden är utredd!'}
 });
 function experiment(id,value=100){
   if(!Object.hasOwn(EXPERIMENTS,id))return null;
   const n=Number.isFinite(value)?Math.max(0,Math.min(100,Math.round(value))):0;
   const f=n/100,meta=EXPERIMENTS[id];
   return {id,value:n,label:meta.label,instruction:meta.instruction,
     message:n===0?meta.low:n===100?meta.high:meta.mid,
     stretch:.38+.62*f,magnetX:80*f,ringX:-Math.max(0,(f-.6)/.4)*75,
     rotation:360*f,wiltAngle:38*(1-f),wiltOpacity:.55+.45*f,
     tangle:f<.34?0:f<.67?1:2};
 }
 function pointerValue(rect,x){
   if(!rect||!Number.isFinite(rect.left)||!Number.isFinite(rect.width)||rect.width<=0||!Number.isFinite(x))return null;
   return Math.round(100*Math.max(0,Math.min(1,(x-rect.left)/rect.width)));
 }
 return {DATA,eligible,adapt,adaptRound,validate,EXPERIMENTS,experiment,pointerValue};
});
