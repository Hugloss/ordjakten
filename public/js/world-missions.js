/* Narrative action quests: one authored word problem per story chapter.
 * No timer, score, independent-recall claim or change to learning history. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenWorldMissions=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DATA=Object.freeze({
  "forest": [
    [
      "sv-0010",
      "Fågeln vill känna igen ett prassligt ljud. Vad kan vi göra för att visa den ett sådant ljud?",
      [
        "Skrynkla torra löv i handen",
        "Lyssna på en motor som brummar",
        "Låta vatten droppa i en kopp"
      ],
      "Torra löv rasslar lätt när de rör sig. Fågeln känner igen ljudet och visar stigen."
    ],
    [
      "sv-0016",
      "Kartan ligger under en rund sten. Vilken sten ska vi lyfta försiktigt?",
      [
        "En sten formad som en boll",
        "En sten med tre hörn",
        "En sten som liknar en lång platta"
      ],
      "En bollformad sten är rund. Under den hittar vi kartan."
    ],
    [
      "sv-0024",
      "Ugglan har gömt en bok i en ihålig bit trä. Var letar vi?",
      [
        "I en träbit med ett tomt utrymme inuti",
        "På en massiv träskiva",
        "Mellan två släta stenar"
      ],
      "Ihålig betyder att det finns ett tomrum inuti. Där får en liten bok plats."
    ],
    [
      "sv-0018",
      "Vi behöver en lysande sak som kan hjälpa oss att läsa i gläntan. Vad väljer vi?",
      [
        "En tänd lykta",
        "En spegel i mörkret",
        "En slät grå sten"
      ],
      "En tänd lykta ger ifrån sig eget ljus. Nu kan vi läsa."
    ]
  ],
  "space": [
    [
      "sv-0014",
      "Roboten vill lägga det tunga föremålet längst ner i packningen. Vilket föremål menar den?",
      [
        "En låda full med sten",
        "Ett tomt papperskuvert",
        "En fjäder"
      ],
      "En låda full med sten väger mycket. Vi packar den längst ner."
    ],
    [
      "sv-0019",
      "Månstenen är knottrig. Vilken sten ska vi undersöka?",
      [
        "Stenen med många små upphöjningar",
        "Stenen med en helt slät yta",
        "Stenen med en enda djup grop"
      ],
      "Knottrig beskriver många små upphöjningar. Vi hittar rätt månsten."
    ],
    [
      "sv-0035",
      "Roboten visar en bild av virvlande damm. Vilken rörelse ska vi rita på kartan?",
      [
        "Damm som snurrar runt",
        "Damm som ligger alldeles stilla",
        "Damm som faller rakt ner"
      ],
      "Virvlande damm rör sig runt. Vi ritar en snurrande rörelse på kartan."
    ],
    [
      "sv-0003",
      "Stjärnbasen behöver ett genomskinligt fönster. Vilket material passar?",
      [
        "Klar glasruta",
        "Tjock träskiva",
        "Svart kartong"
      ],
      "Genomskinligt glas går att se igenom. Vi kan titta på stjärnorna."
    ]
  ],
  "castle": [
    [
      "sv-0022",
      "Portvakten ber oss hitta en randig flagga. Vilken flagga väljer vi?",
      [
        "En flagga med långa parallella ränder",
        "En flagga med små prickar",
        "En helt enfärgad flagga"
      ],
      "Randig betyder att den har ränder. Portvakten visar oss in."
    ],
    [
      "sv-0066",
      "Nyckeln har ett fyrkantigt huvud. Vilken form letar vi efter?",
      [
        "En form med fyra hörn",
        "En rund form utan hörn",
        "En form med tre hörn"
      ],
      "Fyrkantig betyder att formen har fyra hörn. Vi hittar nyckeln."
    ],
    [
      "sv-0015",
      "Draken vill sitta på något mjukt. Vad räcker vi fram?",
      [
        "En kudde som ger efter när man trycker på den",
        "En hård tegelsten",
        "En stel träbricka"
      ],
      "En kudde ger efter när man trycker på den. Draken kan sitta bekvämt."
    ],
    [
      "sv-0007",
      "I skattkammaren letar vi efter en glittrig sten. Vilken väljer vi?",
      [
        "En sten som glimmar när ljuset träffar den",
        "En matt sten utan blänk",
        "En svart gummibit"
      ],
      "Glittrigt betyder att något glimmar eller blänker i ljus. Stenen glittrar."
    ]
  ],
  "pirate": [
    [
      "sv-0036",
      "Kaptenen vill släta ut den skrynkliga segelduken. Vilken duk menar kaptenen?",
      [
        "Duken med många veck",
        "Duken med små färgprickar",
        "Duken som ligger helt slät"
      ],
      "Skrynklig beskriver veck och rynkor. Vi slätar ut duken."
    ],
    [
      "sv-0042",
      "På kartan finns en brant backe. Vilken bild ska vi markera?",
      [
        "En backe som lutar mycket uppåt",
        "En alldeles plan strand",
        "En stig som nästan inte lutar"
      ],
      "Brant betyder att marken lutar mycket. Vi markerar backen på kartan."
    ],
    [
      "sv-0088",
      "Flaskan är tunn och gammal. Kaptenen ber oss vara varsamma. Hur gör vi?",
      [
        "Lyfter den försiktigt med båda händerna",
        "Skakar den hårt",
        "Slänger den i en korg"
      ],
      "Varsam betyder att hantera något försiktigt så att det inte skadas. Meddelandet är kvar."
    ],
    [
      "sv-0043",
      "Ett snöre runt boken har blivit trassligt. Vad behöver vi reda ut?",
      [
        "Snöret som snott ihop sig i knutar",
        "Snöret som ligger rakt",
        "Snöret som är klippt i korta bitar"
      ],
      "Trassligt betyder att något har snott ihop sig. Vi reder ut knutarna."
    ]
  ],
  "ocean": [
    [
      "sv-0022",
      "Vi ska rita av en randig snäcka. Vilken väljer vi?",
      [
        "Snäckan med flera långa ränder",
        "Snäckan med små prickar",
        "Den helt enfärgade snäckan"
      ],
      "En randig snäcka har ränder. Vi ritar av mönstret."
    ],
    [
      "sv-0055",
      "Vilket djur är simmande just nu? Vi vill följa det med blicken.",
      [
        "En fisk som tar sig fram genom vattnet",
        "En fiskmås som flyger över havet",
        "En krabba som går längs stranden"
      ],
      "Simmande beskriver någon som tar sig fram genom vatten genom att simma."
    ],
    [
      "sv-0083",
      "Sköldpaddan söker en fridfull vik. Vilken plats passar bäst?",
      [
        "En lugn vik utan störande ljud",
        "En hamn med bullrande maskiner",
        "En strand där många ropar och springer"
      ],
      "Fridfull betyder lugn och utan störningar. Vi hittar en rofylld vik."
    ],
    [
      "sv-0048",
      "Ordkompisen vill rita en solig bukt. Vilken himmel väljer vi?",
      [
        "En himmel där solen skiner",
        "En himmel med tjock dimma",
        "En himmel med regn och mörka moln"
      ],
      "Solig betyder att solen skiner. Vi väljer en ljus himmel."
    ]
  ],
  "dinosaurs": [
    [
      "sv-0034",
      "Forskaren ber oss hitta det avlånga fotspåret. Vilket menar hon?",
      [
        "Ett spår som är mycket längre än brett",
        "Ett runt spår",
        "Ett spår med lika långa sidor"
      ],
      "Avlångt betyder betydligt längre än brett. Vi ritar av spåret."
    ],
    [
      "sv-0012",
      "Fossilägget är skört. Vad kan hända om vi tappar det?",
      [
        "Det kan lätt gå sönder",
        "Det kan sträcka ut sig och återgå till sin form",
        "Det kan bli magnetiskt"
      ],
      "Skört betyder att något lätt kan gå sönder. Vi låter forskaren hantera fossilet."
    ],
    [
      "sv-0065",
      "Vi ska rita en spetsig bergstopp. Vilken form väljer vi?",
      [
        "En topp som smalnar av till en spets",
        "En helt platt topp",
        "En rundad topp som liknar en boll"
      ],
      "Spetsig betyder att något har en smal eller vass spets. Vi ritar den formen."
    ],
    [
      "sv-0030",
      "I vår fantasibild ska dalen vara frodig. Hur ritar vi den?",
      [
        "Med många växter som växer kraftigt",
        "Med enbart bar sand",
        "Med nästan bara torra, vissna blad"
      ],
      "Frodig beskriver riklig och kraftig växtlighet. Vi fyller dalen med gröna växter."
    ]
  ],
  "garden": [
    [
      "sv-0026",
      "Trädgårdsmästaren vill plantera något som är doftande. Vilken växt väljer vi?",
      [
        "En blomma som sprider en tydlig doft",
        "En planta utan märkbar lukt",
        "En plastblomma som inte luktar"
      ],
      "Doftande betyder att något ger ifrån sig en lukt. Vi väljer den doftande blomman."
    ],
    [
      "sv-0027",
      "En av tulpanerna har vissnat. Vilken ser vi till först?",
      [
        "Tulpanen med slokande, torra blad",
        "Tulpanen med upprätt gröna blad",
        "Tulpanen som just öppnar sig"
      ],
      "En vissnad växt har tappat spänsten och hänger ofta ner."
    ],
    [
      "sv-0023",
      "Vi letar efter en prickig fjäril. Vilken ska vi rita?",
      [
        "Fjärilen med många små prickar på vingarna",
        "Fjärilen med långa ränder",
        "Fjärilen med enfärgade vingar"
      ],
      "Prickig betyder att något har små prickar. Vi ritar fjärilens mönster."
    ],
    [
      "sv-0037",
      "Dammens vatten är speglande. Vad kan vi se i det?",
      [
        "En bild av molnen ovanför",
        "Enbart en lampa som ger eget ljus",
        "Bara ett hål genom marken"
      ],
      "En speglande yta återger en bild genom att reflektera ljus. Vi ser molnens spegelbild."
    ]
  ],
  "unicorn": [
    [
      "sv-0007",
      "Vi följer ett glittrigt spår. Vilket av spåren passar beskrivningen?",
      [
        "Spåret som blänker i solljuset",
        "Spåret som bara är mörkt och matt",
        "Spåret som bara ger ifrån sig ett ljud"
      ],
      "Glittrig betyder att något glimmar eller blänker. Vi följer det skimrande spåret."
    ],
    [
      "sv-0067",
      "Vid bron ska vi välja en triangelformad skylt. Vilken form har den?",
      [
        "Tre sidor och tre hörn",
        "Fyra sidor och fyra hörn",
        "En rund kant utan hörn"
      ],
      "En triangel har tre hörn och tre sidor. Vi hittar rätt skylt."
    ],
    [
      "sv-0015",
      "Enhörningen vill ha något mjukt under sin bok. Vad väljer vi?",
      [
        "En filt som ger efter när man trycker på den",
        "En hård sten",
        "En platta av metall"
      ],
      "Mjukt material ger efter när man trycker på det. Vi lägger fram filten."
    ],
    [
      "sv-0084",
      "Vi vill rita en livlig äng. Hur ser bilden ut?",
      [
        "Djur som leker, springer och rör sig",
        "En tom äng där allt står still",
        "En äng där alla sover tyst"
      ],
      "Livlig betyder full av rörelse och energi. Vi ritar en äng full av lek."
    ]
  ],
  "animals": [
    [
      "sv-0017",
      "Katten är pälsig. Vilken bild visar det?",
      [
        "En katt som är täckt av päls",
        "En fisk med blanka fjäll",
        "En fågel täckt av fjädrar"
      ],
      "Pälsig betyder att något är täckt av päls. Vi ritar kattens päls."
    ],
    [
      "sv-0008",
      "Hunden vill leka med något studsande. Vilken sak väljer vi?",
      [
        "En boll som hoppar upp när den träffar marken",
        "En tygbit som blir liggande",
        "En bok som ligger still"
      ],
      "Studsande betyder att något hoppar upp efter att ha träffat ett underlag."
    ],
    [
      "sv-0006",
      "Kaninen knaprar på en knaprig morot. Hur känns den när man biter i den?",
      [
        "Spröd och knastrande",
        "Mjuk som mos",
        "Seg och elastisk"
      ],
      "Knaprig beskriver något som är sprött och knastrar när man biter."
    ],
    [
      "sv-0076",
      "Vi vill vara generösa på djurvännernas fest. Vad gör vi?",
      [
        "Delar gärna med oss av frukten",
        "Behåller all frukt för oss själva",
        "Gömmer undan frukten"
      ],
      "Generös betyder att gärna dela med sig. Vi bjuder djurvännerna."
    ]
  ],
  "rainbow": [
    [
      "sv-0002",
      "Vi ska rita ett fluffigt moln. Vilket moln passar bäst?",
      [
        "Ett mjukt, luftigt moln med bulliga kanter",
        "Ett tunt rakt streck",
        "En platt fyrkant"
      ],
      "Fluffig betyder mjuk och luftig, ofta lite luddig. Vi ritar det bulliga molnet."
    ],
    [
      "sv-0011",
      "Färg som ännu inte torkat helt har blivit klibbig. Hur märks det?",
      [
        "Den känns klistrig och fastnar lätt",
        "Den rinner som vatten",
        "Den är hård och torr som sten"
      ],
      "Klibbig betyder att något känns klistrigt och gärna fastnar."
    ],
    [
      "sv-0003",
      "Såpbubblan är genomskinlig. Vilken detalj ska vi rita?",
      [
        "Man kan se landskapet genom bubblan",
        "Bubblan döljer allt bakom sig",
        "Bubblan består av tjock svart kartong"
      ],
      "Genomskinlig betyder att man kan se igenom något. Vi visar landskapet bakom bubblan."
    ],
    [
      "sv-0039",
      "Tornets lampor är blinkande. Hur ritar vi en liten serie av dem?",
      [
        "Lamporna tänds och släcks flera gånger",
        "Lamporna lyser hela tiden",
        "Lamporna är släckta hela tiden"
      ],
      "Blinkande betyder att något tänds och släcks upprepade gånger. Vi ritar det."
    ]
  ],
  "horses": [
    [
      "sv-0014",
      "Vi har en tung höbal och några lätta saker. Vilket ska en vuxen hjälpa oss att flytta?",
      [
        "Den stora höbalen som väger mycket",
        "Ett tomt kuvert",
        "En liten fjäder"
      ],
      "Tung betyder att något väger mycket. Vi ber om hjälp med balen."
    ],
    [
      "sv-0072",
      "Ponnyn kommer inte fram direkt. Hur visar vi att vi är tålmodiga?",
      [
        "Väntar lugnt vid staketet",
        "Ropar otåligt hela tiden",
        "Springer fram för att skynda på den"
      ],
      "Tålmodig betyder att kunna vänta lugnt utan att ge upp. Vi väntar."
    ],
    [
      "sv-0005",
      "På ridstigen finns en hal fläck. Vilken fläck varnar vi den vuxna för?",
      [
        "En isig yta där fötterna lätt glider",
        "En sträv grusyta med gott grepp",
        "En torr stig med grovt underlag"
      ],
      "Hal beskriver en yta där det är lätt att glida. Vi väljer en trygg väg tillsammans."
    ],
    [
      "sv-0023",
      "Vi vill rita en prickig rosett. Vilket mönster ska den ha?",
      [
        "Små prickar över bandet",
        "Långa ränder över bandet",
        "Ett helt enfärgat band"
      ],
      "Prickig betyder att något har små prickar. Vi ritar rosetten med prickar."
    ]
  ],
  "music": [
    [
      "sv-0020",
      "Musikern ber oss spela en långsam melodi. Vad gör vi?",
      [
        "Spelar tonerna i låg fart",
        "Spelar alla toner så fort vi kan",
        "Spelar bara en högre ton"
      ],
      "Långsam betyder låg fart. Vi spelar i lugnt tempo."
    ],
    [
      "sv-0009",
      "I replokalen hörs ett surrande ljud. Vilket ljud beskriver det bäst?",
      [
        "Ett jämnt, långdraget brummande",
        "Ett enda kort klick",
        "Ett enstaka knallande ljud"
      ],
      "Ett surrande ljud fortsätter en stund, som ljudet från en fläkt. Ett enda klick tar slut direkt."
    ],
    [
      "sv-0039",
      "Dansgolvet ska ha blinkande lampor. Vilken belysning väljer vi i vår bild?",
      [
        "Lampor som tänds och släcks omväxlande",
        "Lampor som lyser oförändrat",
        "Lampor som aldrig tänds"
      ],
      "Blinkande lampor tänds och släcks upprepade gånger. Vi ritar ljusshowen."
    ],
    [
      "sv-0063",
      "Musikerna är glädjefyllda efter showen. Vilken reaktion passar?",
      [
        "De ler och skrattar av lycka",
        "De är rädda och vill gömma sig",
        "De gäspar och behöver sova"
      ],
      "Glädjefylld betyder full av glädje och lycka. Vi avslutar med glada musiker."
    ]
  ]
});
  function catalog(words,story,source=DATA){
    const byId=new Map(words.map(word=>[word.id,word])),tasks=Object.create(null),errors=[];
    for(const world of Object.keys(story.DATA)){
      const rows=source?.[world],chapters=story.DATA[world];
      if(!Array.isArray(rows)||rows.length!==chapters.length){errors.push(world);continue;}
      rows.forEach((row,index)=>{
        const key=world+':'+index;
        if(!Array.isArray(row)||row.length!==4){errors.push(key);return;}
        const [target,prompt,actions,why]=row,item=byId.get(target);
        if(item?.kind!=='word'||!item.name||!item.definition||typeof prompt!=='string'||!prompt.trim()||
          typeof why!=='string'||!why.trim()||!Array.isArray(actions)||actions.length!==3||
          !actions.every(action=>typeof action==='string'&&action.trim())||new Set(actions).size!==3){errors.push(key);return;}
        tasks[key]={key,world,index,target,word:item.name,definition:item.definition,prompt,why,
          options:actions.map((label,i)=>({id:String(i),label,correct:i===0}))};
      });
    }
    return {tasks,errors};
  }
  function start(content,model,index=model?.count,random=Math.random){
    if(!model||!Number.isInteger(index)||index<0||index>=model.total||index>model.count)return null;
    const task=content.tasks[model.id+':'+index],chapter=model.chapters[index];
    if(!task||!chapter)return null;
    const options=task.options.slice();
    for(let i=options.length-1;i>0;i--){
      const value=random(),j=Math.min(i,Math.max(0,Math.floor((Number.isFinite(value)?value:0)*(i+1))));
      [options[i],options[j]]=[options[j],options[i]];
    }
    return {task,chapter,options,stage:'question',attempts:0,outcome:null};
  }
  function answer(round,id){
    if(round?.stage!=='question')return round;
    const selected=round.options?.find(option=>option.id===id);
    if(!selected)return round;
    if(selected.correct)return {...round,stage:'explanation',outcome:round.attempts?'supported':'direct'};
    if(round.attempts===0)return {...round,attempts:1};
    return {...round,stage:'explanation',attempts:2,outcome:'guided'};
  }
  function explain(round){
    return round?.stage==='question'?{...round,stage:'explanation',outcome:'guided'}:round;
  }
  function complete(raw,round,story){
    if(round?.stage!=='explanation'||!['direct','supported','guided'].includes(round.outcome))
      return {progress:raw,round,earned:null};
    const {chapter,task}=round;
    if(!task||!chapter||task.world!==chapter.id||task.index!==chapter.index||task.key!==chapter.id+':'+chapter.index||
      !story.validWorld(chapter.id)||chapter.index<0||chapter.index>=story.DATA[chapter.id].length||
      chapter.index>(story.sanitize(raw)[chapter.id]||0))return {progress:raw,round,earned:null};
    const result=story.completeChapter(raw,chapter);
    return {...result,round:{...round,stage:'ending'}};
  }
  return {DATA,catalog,start,answer,explain,complete};
});
