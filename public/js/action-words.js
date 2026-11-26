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
    "prompt": "Vi har en lysande ficklampa och en ledtråd bakom fönstret. Välj ett genomskinligt material till rutan.",
    "target": "Sätt materialet i fönstret",
    "why": "Ljus från ficklampan passerar genom den klara glasskivan. Du kan se tecknet bakom den.",
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
    "prompt": "En järnring ligger på hal is. Välj ett magnetiskt föremål för att dra ringen närmare utan att först röra den.",
    "target": "För föremålet mot järnringen",
    "why": "Magneten drar till sig järnringen. Den hala isen gör det lättare för ringen att glida.",
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
    "prompt": "Ett skört ägg behöver flyttas till boet. Vilket sätt skyddar ägget med något mjukt?",
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
    "prompt": "Den tidigare frodiga trädgården har vissnat av vattenbrist. Växterna lever fortfarande. Vad kan hjälpa dem att återhämta sig?",
    "target": "Hjälp blomman i krukan",
    "why": "En vissnad växt har tappat sin spänst. Om den har vissnat av vattenbrist kan vatten och tid hjälpa den att återhämta sig, om den fortfarande lever. Med goda växtförhållanden kan trädgården åter bli frodig.",
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
,
  {
    "word": "sv-0037",
    "id": "mirror",
    "title": "Spegelns hemlighet",
    "prompt": "En liten stjärna står framför en vägg. Välj något speglande så att vi kan se en bild av stjärnan.",
    "target": "Välj material till väggen",
    "why": "En spegel reflekterar ljus och kan återge en bild av föremålet framför den.",
    "answer": "mirror",
    "options": [
      [
        "mirror",
        "🪞",
        "Blank spegel"
      ],
      [
        "paper",
        "📄",
        "Matt papper"
      ],
      [
        "cloth",
        "🧣",
        "Matt tyg"
      ],
      [
        "wood",
        "🪵",
        "Obehandlad träskiva"
      ]
    ]
  },
  {
    "word": "sv-0008",
    "id": "bounce",
    "title": "Den studsande stjärnbollen",
    "prompt": "Vi ska få en leksak att vara studsande när den släpps på ett hårt golv. Vad passar bäst?",
    "target": "Välj en leksak att släppa",
    "why": "En studsboll hoppar upp igen efter att den träffat golvet. Det är en studsande rörelse.",
    "answer": "ball",
    "options": [
      [
        "ball",
        "🏀",
        "Studsboll av gummi"
      ],
      [
        "pillow",
        "🛏️",
        "Mjuk kudde"
      ],
      [
        "cloth",
        "🧣",
        "Tygbit"
      ],
      [
        "clay",
        "🟤",
        "Mjuk modellera"
      ]
    ]
  },
  {
    "word": "sv-0005",
    "id": "slide",
    "title": "Isbanans gåta",
    "prompt": "En liten figur på en träkloss ska glida. Vilken yta är halast?",
    "target": "Välj en bana för klossen",
    "why": "Slät is kan vara hal. På den glider klossen i detta exempel längre än på en sträv matta.",
    "answer": "ice",
    "options": [
      [
        "ice",
        "🧊",
        "Slät is"
      ],
      [
        "mat",
        "🧶",
        "Sträv gummimatta"
      ],
      [
        "sand",
        "🏖️",
        "Grov sand"
      ],
      [
        "gravel",
        "🪨",
        "Grovt grus"
      ]
    ]
  },
  {
    "word": "sv-0040",
    "id": "sponge",
    "title": "Den törstiga svampen",
    "prompt": "En vattenpöl behöver torkas upp. Välj en porös sak som har små hål och kan suga upp vatten.",
    "target": "Välj föremål till vattenpölen",
    "why": "En porös tvättsvamp har många små håligheter. Vatten kan komma in i svampens öppna porer.",
    "answer": "sponge",
    "options": [
      [
        "sponge",
        "🧽",
        "Tvättsvamp med öppna porer"
      ],
      [
        "glass",
        "🪟",
        "Massiv glasskiva"
      ],
      [
        "metal",
        "🔩",
        "Massiv stålplåt"
      ],
      [
        "plastic",
        "🧱",
        "Tät plastkloss"
      ]
    ]
  },
  {
    "word": "sv-0011",
    "id": "sticky",
    "title": "Stjärnorna som fastnar",
    "prompt": "Små pappersstjärnor ska fästas på ett kort. Vilken klibbig yta passar bäst?",
    "target": "Välj yta för pappersstjärnorna",
    "why": "Den klibbiga limytan gör att pappersstjärnorna kan fastna.",
    "answer": "glue",
    "options": [
      [
        "glue",
        "🧴",
        "Kort med vått pyssellim"
      ],
      [
        "dry",
        "📄",
        "Torrt papper utan lim"
      ],
      [
        "glass",
        "🪟",
        "Torr glasskiva"
      ],
      [
        "wood",
        "🪵",
        "Torr träskiva"
      ]
    ]
  }
,
  {
    "word": "sv-0007",
    "id": "glitter",
    "title": "Kristallens hemliga sken",
    "prompt": "Vi vill ha ett glittrigt föremål i ljusstrålen. Vad passar bäst?",
    "target": "Välj föremål till ljusstrålen",
    "why": "Kristallens blanka ytor reflekterar ljus i olika riktningar och kan ge glittrande ljuspunkter.",
    "answer": "crystal",
    "options": [
      [
        "crystal",
        "💎",
        "Slipad kristall"
      ],
      [
        "wood",
        "🪵",
        "Matt träbit"
      ],
      [
        "cloth",
        "🧣",
        "Matt tygbit"
      ],
      [
        "clay",
        "🟤",
        "Matt lerklump"
      ]
    ]
  },
  {
    "word": "sv-0029",
    "id": "foam",
    "title": "Bubbelgrytan",
    "prompt": "En låtsasgryta ska innehålla skummande vatten. Vilken blandning kan ge mycket skum när vi rör om?",
    "target": "Välj blandning till grytan",
    "why": "Tvålvatten kan bilda många små luftbubblor när det rörs om. Många bubblor tillsammans bildar skum.",
    "answer": "soap",
    "options": [
      [
        "soap",
        "🫧",
        "Vatten med lite tvål"
      ],
      [
        "sand",
        "🏖️",
        "Vatten med sand"
      ],
      [
        "stone",
        "🪨",
        "Torra stenar"
      ],
      [
        "paper",
        "📄",
        "Torrt papper"
      ]
    ]
  },
  {
    "word": "sv-0038",
    "id": "wobble",
    "title": "Det dallrande bordet",
    "prompt": "Vi stöter försiktigt till ett bord. Vilket mjukt föremål kan dallra fram och tillbaka?",
    "target": "Välj föremål till bordet",
    "why": "Mjuk gelé kan gunga och skaka fram och tillbaka när underlaget rör sig. Den dallrar.",
    "answer": "jelly",
    "options": [
      [
        "jelly",
        "🍮",
        "Mjuk gelé"
      ],
      [
        "brick",
        "🧱",
        "Stel tegelsten"
      ],
      [
        "wood",
        "🪵",
        "Stel träkloss"
      ],
      [
        "metal",
        "🔩",
        "Stel metallskruv"
      ]
    ]
  },
  {
    "word": "sv-0001",
    "id": "rough",
    "title": "Stenens hemliga yta",
    "prompt": "Du letar efter en skrovlig yta till en stenmur. Vilken av sakerna passar bäst?",
    "target": "Undersök stenytan",
    "why": "En grov, obehandlad sten har ojämnheter och små upphöjningar. Den kan kännas skrovlig.",
    "answer": "rock",
    "options": [
      [
        "rock",
        "🪨",
        "Grov, ojämn sten"
      ],
      [
        "glass",
        "🪟",
        "Slätt fönsterglas"
      ],
      [
        "polished",
        "🔮",
        "Slät, polerad kula"
      ],
      [
        "ice",
        "🧊",
        "Slät isyta"
      ]
    ]
  },
  {
    "word": "sv-0030",
    "id": "lush",
    "title": "Trädgårdens gömda kraft",
    "prompt": "Vi ska hitta en frodig plats där den lilla fågeln kan söka skydd bland växterna. Vart ska den flyga?",
    "target": "Välj en plats åt fågeln",
    "why": "En trädgård med riklig, kraftig växtlighet är frodig.",
    "answer": "garden",
    "options": [
      [
        "garden",
        "🌳",
        "Trädgård med täta gröna buskar och många växter"
      ],
      [
        "sand",
        "🏜️",
        "Öppen sandplan utan växter"
      ],
      [
        "stones",
        "🪨",
        "Kal stenig plats"
      ],
      [
        "bare",
        "🪴",
        "Tom kruka med torr jord"
      ]
    ]
  },
  {
    "word": "sv-0044",
    "id": "cloudy",
    "title": "Det försvunna bottentecknet",
    "prompt": "Ett tecken ligger i botten av ett glas. Vilken vätska är grumlig så att tecknet blir svårare att se?",
    "target": "Välj vätska till glaset",
    "why": "Små lerpartiklar kan sväva i vatten och göra det grumligt. Då syns tecknet bakom vätskan sämre.",
    "answer": "clay",
    "options": [
      [
        "clay",
        "🌫️",
        "Vatten med fin lera i"
      ],
      [
        "water",
        "💧",
        "Klart rent vatten"
      ],
      [
        "clear",
        "🫙",
        "Klar sockerlösning"
      ],
      [
        "oil",
        "🟡",
        "Klar genomskinlig matolja"
      ]
    ]
  },
  {
    "word": "sv-0024",
    "id": "hollow",
    "title": "Röret med den hemliga kulan",
    "prompt": "En kula ska rulla genom ett föremål. Vilket är ihåligt med en öppning genom hela föremålet?",
    "target": "Välj ett föremål som kulan kan passera genom",
    "why": "Ett tomt rör har ett hålrum inuti. Det är ihåligt. Om båda ändarna är öppna kan kulan passera.",
    "answer": "tube",
    "options": [
      [
        "tube",
        "🧻",
        "Tomt öppet papprör"
      ],
      [
        "solid",
        "🪵",
        "Massiv träcylinder"
      ],
      [
        "stone",
        "🪨",
        "Massiv sten"
      ],
      [
        "brick",
        "🧱",
        "Massiv kloss utan hål"
      ]
    ]
  },
  {
    "word": "sv-0054",
    "id": "flight",
    "title": "Fjärilens blomsterstig",
    "prompt": "En liten kompis ska ta sig genom luften från blomma till blomma. Vilken är flygande?",
    "target": "Hjälp den till nästa blomma",
    "why": "En fjäril kan röra sig genom luften med sina vingar. När den gör det är den flygande.",
    "answer": "butterfly",
    "options": [
      [
        "butterfly",
        "🦋",
        "Fjäril som flyger"
      ],
      [
        "snail",
        "🐌",
        "Snigel som kryper"
      ],
      [
        "fish",
        "🐟",
        "Fisk som simmar"
      ],
      [
        "rabbit",
        "🐇",
        "Kanin som går på marken"
      ]
    ]
  }
];
 const byWord=new Map(DATA.map(row=>[row.word,row]));
 const COMBINATIONS=Object.freeze({
  "magnet": {
    "id": "sv-0005",
    "word": "Hal",
    "explanation": "En hal yta är lätt att glida på. Magneten drar järnringen, medan den hala isen gör det lättare för ringen att glida."
  },
  "window": {
    "id": "sv-0018",
    "word": "Lysande",
    "explanation": "En tänd ficklampa är lysande. Det genomskinliga glaset släpper igenom ljus så att tecknet bakom blir synligt."
  },
  "nest": {
    "id": "sv-0015",
    "word": "Mjuk",
    "explanation": "En mjuk kudde ger efter när ägget läggs ner. Den kan skydda det sköra skalet mot stötar."
  },
  "wilt": {
    "id": "sv-0030",
    "word": "Frodig",
    "explanation": "Vissna, levande växter som fått för lite vatten kan ibland återhämta sig. Med tid och goda växtförhållanden kan en hel trädgård bli frodig."
  }
});
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
   return {...q,taskType:'action',options,stem:row.prompt,action:{id:row.id,title:row.title,prompt:row.prompt,target:row.target,why:row.why,related:COMBINATIONS[row.id]||null}};
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
   for(const [id,other] of Object.entries(COMBINATIONS)){
     const row=DATA.find(x=>x.id===id),word=bank.words.find(x=>x.id===other.id);
     if(!row||!word||row.word===other.id||word.word!==other.word||!other.explanation)errors.push('Ogiltigt ordpar '+id);
   }
   return errors;
 }
 // Optional, reversible experiments after a worked example. They are not
 // answers, do not measure dexterity, and never change a learning record.
 const EXPERIMENTS=Object.freeze({
   window:{label:'Lys genom fönstret',instruction:'Dra för att tända ficklampan. Se hur ljuset passerar genom det genomskinliga glaset i vår bild.',low:'Ficklampan är släckt.',mid:'Ficklampan lyser genom glaset.',high:'Den lysande ficklampan avslöjar tecknet genom glaset.'},
   nest:{label:'Lägg ägget på den mjuka kudden',instruction:'Dra över bilden för att sänka ägget långsamt. Kudden ger efter lite i vår förenklade illustration.',low:'Ägget hålls ovanför kudden.',mid:'Ägget sänks försiktigt.',high:'Det sköra ägget vilar mjukt i korgen.'},
   stretch:{label:'Dra i gummibandet',instruction:'Dra över bilden eller använd reglaget. Prova att sträcka bandet och låta det dra ihop sig igen.',low:'Bandet är avslappnat.',mid:'Bandet sträcks ut.',high:'Bandet är längre. Prova att låta det dra ihop sig igen.'},
   magnet:{label:'Flytta magneten',instruction:'Dra magneten närmare järnringen. Se när ringen glider över den hala isen.',low:'Magneten är långt från ringen.',mid:'Magneten närmar sig ringen.',high:'Magneten har dragit järnringen över den hala isen!'},
   whirl:{label:'Snurra löven',instruction:'Dra över bilden eller flytta reglaget för att snurra löven runt mitten.',low:'Löven vilar.',mid:'Löven rör sig runt mitten.',high:'Löven har virvlat ett helt varv!'},
   wilt:{label:'Låt tiden gå efter vattning',instruction:'Dra fram tiden i vår låtsasbild. En levande, törstig växt kan återhämta sig gradvis efter vattning.',low:'Bladen hänger. Jorden har fått vatten.',mid:'Blomman börjar räta på sig.',high:'I berättelsen har trädgården återhämtat sig och blivit frodig.'},
   tangle:{label:'Red ut garnet',instruction:'Dra försiktigt över bilden och följ hur slingorna försvinner.',low:'Garnet är trassligt.',mid:'Några slingor har lossnat.',high:'Tråden är utredd!'},
   mirror:{label:'Flytta stjärnan framför spegeln',instruction:'Dra över bilden eller flytta reglaget. Följ hur stjärnans spegelbild rör sig på andra sidan spegellinjen.',low:'Stjärnan och spegelbilden är långt från spegellinjen.',mid:'Spegelbilden följer stjärnans rörelse.',high:'Båda är nära spegellinjen.'},
   bounce:{label:'Följ bollens studs',instruction:'Flytta reglaget framåt och bakåt i tiden. Se hur gummibollen faller, träffar golvet och studsar upp igen.',low:'Bollen är högt upp före fallet.',mid:'Bollen faller eller studsar upp igen.',high:'De allt mindre studsarna har stannat.'},
   slide:{label:'Jämför två ytor',instruction:'Dra fram tiden efter att två likadana klossar fått en lika stor knuff. Se hur långt de glider på is och sträv matta.',low:'Klossarna börjar på samma plats.',mid:'Klossen på isen glider längre.',high:'Klossen på den hala isen har glidit längst.'},
   sponge:{label:'Följ vattnet in i svampen',instruction:'Dra över bilden eller använd reglaget. De öppna håligheterna i svampen fylls med vatten i vår förenklade bild.',low:'Svampen är torr. Håligheterna är tomma.',mid:'Vatten kommer in i några av porerna.',high:'Svampen har tagit upp vatten.'},
   sticky:{label:'Fäst pappersstjärnorna',instruction:'Dra över bilden för att föra stjärnorna till den klibbiga limytan. Se hur de fastnar på kortet.',low:'Stjärnorna ligger bredvid kortet.',mid:'Några stjärnor har fastnat på limytan.',high:'Alla stjärnorna sitter på kortet.'},
   glitter:{"label":"Flytta ljuset över kristallen","instruction":"Dra över bilden. Se hur kristallen glimmar på olika ställen när ljuset flyttas.","low":"Ljuset träffar den vänstra delen.","mid":"Ljuset träffar andra blanka ytor.","high":"Ljuset glimmar på kristallens högra sida."},
   foam:{"label":"Rör om i bubbelgrytan","instruction":"Dra fram tiden i den illustrerade grytan. Luft blandas in i tvålvattnet.","low":"Tvålvattnet har inga synliga skumbubblor.","mid":"Många nya bubblor bildas.","high":"Nu syns ett lager skum."},
   wobble:{"label":"Följ geléns dallring","instruction":"Dra tiden framåt eller bakåt. Gelén böjer sig åt båda hållen och kommer sedan till ro.","low":"Gelén står stilla före stöten.","mid":"Gelén gungar fram och tillbaka.","high":"Gelén står stilla igen."},
   rough:{"label":"Undersök den skrovliga stenen","instruction":"Dra förstoringsglaset längs ytan. Följ den blå linjens ojämna kontur.","low":"Undersök stenens vänstra kant.","mid":"Stenen har små ojämnheter.","high":"Hela den skrovliga kanten har undersökts."},
   lush:{"label":"Låt trädgården växa","instruction":"Dra fram tiden i vår låtsasträdgård. Här har växterna ljus, vatten och plats att växa.","low":"Några små plantor syns.","mid":"Blad och grenar växer.","high":"Trädgården har riklig, kraftig växtlighet."},
   cloudy:{"label":"Blanda lerpartiklar i vattnet","instruction":"Dra reglaget. Fler små partiklar gör att tecknet syns allt sämre. Dra tillbaka för att jämföra.","low":"Vattnet är klart.","mid":"Vattnet blir grumligare.","high":"Vattnet är grumligt och tecknet svårt att se."},
   hollow:{"label":"Titta in i röret","instruction":"Dra över bilden. Först visas en genomskärning av röret, sedan rullar kulan genom det tomma utrymmet.","low":"Rörets vägg täcker hålrummet i bilden.","mid":"Hålrummet blir synligt.","high":"Kulan har passerat genom röret."},
   flight:{"label":"Flyg mellan blommorna","instruction":"Dra fjärilen längs blomsterstigen. Reglaget och tangentbordet följer samma stig.","low":"Fjärilen är vid den första blomman.","mid":"Fjärilen flyger genom luften.","high":"Fjärilen har nått den sista blomman."}
 });
 function experiment(id,value=100){
   if(!Object.hasOwn(EXPERIMENTS,id))return null;
   const n=Number.isFinite(value)?Math.max(0,Math.min(100,Math.round(value))):0;
   const f=n/100,meta=EXPERIMENTS[id];
   // Piecewise, diminishing bounces (illustrative time, not calibrated physics).
   let bounceY=106;
   if(f<.25)bounceY=106*(f/.25)**2;
   else for(const [start,end,height] of [[.25,.6,62],[.6,.85,25],[.85,1,9]]){
     if(f>=start&&f<=end){const t=(f-start)/(end-start);bounceY=106-height*4*t*(1-t);break;}
   }
   const wobble=n===0||n===100?0:Math.sin(f*6*Math.PI)*18*(1-f);
   return {id,value:n,label:meta.label,instruction:meta.instruction,
     message:n===0?meta.low:n===100?meta.high:meta.mid,
     stretch:.38+.62*f,magnetX:80*f,ringX:f<=.6?0:-Math.min(75,(f-.6)/.4*75),
     rotation:360*f,wiltAngle:38*(1-f),wiltOpacity:.55+.45*f,
     tangle:f<.34?0:f<.67?1:2,
     mirrorX:68*f,mirrorImageX:-68*f||0,bounceY,
     iceX:194*(1-(1-f)**2),matX:76*(1-(1-Math.min(1,2*f))**2),
     water:f,sticky:Math.floor(f*4),beamPower:f,eggY:32*f,pillowScale:1-.18*Math.max(0,(f-.7)/.3),
     lightX:194*f,glitter:Math.min(4,Math.floor(f*5)),foam:Math.floor(f*12),
     wobble,scanX:184*f,growth:.25+.75*f,cloud:.88*f,particles:Math.floor(f*16),
     cutaway:Math.min(1,f*2),marbleX:236*Math.max(0,2*f-1),
     flightX:200*f,flightY:n===0||n===100?0:-78*Math.sin(Math.PI*f)-22*Math.sin(2*Math.PI*f)};
 }
 function pointerValue(rect,x){
   if(!rect||!Number.isFinite(rect.left)||!Number.isFinite(rect.width)||rect.width<=0||!Number.isFinite(x))return null;
   return Math.round(100*Math.max(0,Math.min(1,(x-rect.left)/rect.width)));
 }
 return {DATA,COMBINATIONS,eligible,adapt,adaptRound,validate,EXPERIMENTS,experiment,pointerValue};
});
