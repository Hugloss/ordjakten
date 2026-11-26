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
 return {DATA,eligible,adapt,adaptRound,validate};
});
