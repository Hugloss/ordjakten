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
      "Fågeln vill höra hur något prassligt låter. Vad kan vi göra?",
      [
        "Skrynkla torra löv i handen",
        "Lyssna på en motor som brummar",
        "Låta vatten droppa i en kopp"
      ],
      "Torra löv rasslar lätt när de rör sig. Fågeln känner igen ljudet och visar stigen.",
      "world-mission-forest-01"
    ],
    [
      "sv-0016",
      "Kartan ligger under en rund sten. Vilken sten ska vi lyfta försiktigt?",
      [
        "En sten formad som en boll",
        "En sten med tre hörn",
        "En sten som liknar en lång platta"
      ],
      "En bollformad sten är rund. Under den hittar vi kartan.",
      "world-mission-forest-02"
    ],
    [
      "sv-0024",
      "Ugglan har gömt en bok i en ihålig bit trä. Var letar vi?",
      [
        "I en träbit med ett tomt utrymme inuti",
        "På en träskiva utan hålrum",
        "Mellan två släta stenar"
      ],
      "Ihålig betyder att det finns ett tomrum inuti. Där får en liten bok plats.",
      "world-mission-forest-03"
    ],
    [
      "sv-0018",
      "Vi behöver en lysande sak som kan hjälpa oss att läsa i gläntan. Vad väljer vi?",
      [
        "En tänd lykta",
        "En spegel i mörkret",
        "En slät grå sten"
      ],
      "Den tända lyktan ger ifrån sig ljus som lyser på boksidan. Då kan vi se bokstäverna. Spegeln behöver ljus från något annat för att kunna skicka ljus vidare.",
      "world-mission-forest-04"
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
      "En låda full med sten väger mycket. Vi packar den längst ner.",
      "world-mission-space-01"
    ],
    [
      "sv-0019",
      "Månstenen är knottrig. Vilken sten ska vi undersöka?",
      [
        "Stenen med många små upphöjningar",
        "Stenen med en helt slät yta",
        "Stenen med en enda djup grop"
      ],
      "Knottrig beskriver många små upphöjningar. Vi hittar rätt månsten.",
      "world-mission-space-02"
    ],
    [
      "sv-0035",
      "Roboten visar en bild av virvlande damm. Vilken rörelse ska vi rita på kartan?",
      [
        "Damm som snurrar runt",
        "Damm som ligger alldeles stilla",
        "Damm som faller rakt ner"
      ],
      "Virvlande damm rör sig runt. Vi ritar en snurrande rörelse på kartan.",
      "world-mission-space-03"
    ],
    [
      "sv-0003",
      "Stjärnbasen behöver ett genomskinligt fönster. Vilket material passar?",
      [
        "Klar glasruta",
        "Tjock träskiva",
        "Svart kartong"
      ],
      "Genomskinligt glas går att se igenom. Vi kan titta på stjärnorna.",
      "world-mission-space-04"
    ]
  ],
  "castle": [
    [
      "sv-0022",
      "Portvakten ber oss hitta en randig flagga. Vilken flagga väljer vi?",
      [
        "En flagga med långa ränder bredvid varandra",
        "En flagga med enbart små prickar",
        "En helt enfärgad flagga"
      ],
      "Flaggans färgade fält ligger som långa band bredvid varandra. Banden är ränder, så flaggan är randig. Den prickiga flaggan har små punkter i stället.",
      "world-mission-castle-01"
    ],
    [
      "sv-0066",
      "Nyckeln har ett fyrkantigt huvud. Vilken form letar vi efter?",
      [
        "En form med fyra raka sidor och fyra hörn",
        "En rund form utan hörn",
        "En form med tre hörn"
      ],
      "En fyrkantig form har fyra raka sidor och fyra hörn. Sidorna behöver inte vara lika långa. Vi hittar nyckeln.",
      "world-mission-castle-02"
    ],
    [
      "sv-0015",
      "Draken vill sitta på något mjukt. Vad räcker vi fram?",
      [
        "En kudde som ger efter när man trycker på den",
        "En hård tegelsten",
        "En stel träbricka"
      ],
      "En kudde ger efter när man trycker på den. Draken kan sitta bekvämt.",
      "world-mission-castle-03"
    ],
    [
      "sv-0007",
      "I skattkammaren letar vi efter en glittrig sten. Vilken väljer vi?",
      [
        "En sten som glimmar när ljuset träffar den",
        "En matt sten utan blänk",
        "En svart gummibit"
      ],
      "När ljuset träffar stenens blanka ytor syns små ljuspunkter. Därför ser stenen glittrig ut. Den behöver ljus från något annat för att glittra.",
      "world-mission-castle-04"
    ]
  ],
  "pirate": [
    [
      "sv-0036",
      "Kaptenen vill släta ut den skrynkliga segelduken. Vilken duk menar kaptenen?",
      [
        "Duken med många veck",
        "Den helt släta duken med färgprickar",
        "Duken som ligger helt slät"
      ],
      "Skrynklig beskriver veck och rynkor. Vi slätar ut duken.",
      "world-mission-pirate-01"
    ],
    [
      "sv-0042",
      "På kartan finns en brant backe. Vilken bild ska vi markera?",
      [
        "En backe som lutar mycket uppåt",
        "En alldeles plan strand",
        "En stig som nästan inte lutar"
      ],
      "Brant betyder att marken lutar mycket. Vi markerar backen på kartan.",
      "world-mission-pirate-02"
    ],
    [
      "sv-0088",
      "Flaskan är tunn och gammal. Kaptenen ber oss vara varsamma. Hur gör vi?",
      [
        "Lyfter den försiktigt med båda händerna",
        "Skakar den hårt",
        "Slänger den i en korg"
      ],
      "Med båda händerna får vi ett stadigt grepp om flaskan. Vi lyfter lugnt så att det tunna glaset inte slår emot något. Så hanterar vi flaskan varsamt.",
      "world-mission-pirate-03"
    ],
    [
      "sv-0043",
      "Ett snöre runt boken har blivit trassligt. Vad behöver vi reda ut?",
      [
        "Snöret som snott ihop sig i knutar",
        "Snöret som ligger rakt",
        "Snöret som är klippt i korta bitar"
      ],
      "Trassligt betyder att något har snott ihop sig. Vi reder ut knutarna.",
      "world-mission-pirate-04"
    ]
  ],
  "ocean": [
    [
      "sv-0022",
      "Vi ska rita av en randig snäcka. Vilken väljer vi?",
      [
        "Snäckan med flera långa ränder",
        "Snäckan med enbart små prickar",
        "Den helt enfärgade snäckan"
      ],
      "En randig snäcka har ränder. Vi ritar av mönstret.",
      "world-mission-ocean-01"
    ],
    [
      "sv-0055",
      "Vi vill följa ett simmande djur med blicken. Vilket djur passar?",
      [
        "En fisk som tar sig fram i vattnet genom att röra kroppen och fenorna",
        "En fiskmås som flyger över havet",
        "En krabba som går längs stranden"
      ],
      "Fisken tar sig fram i vattnet genom att röra kroppen och fenorna. Det är en simmande fisk.",
      "world-mission-ocean-02"
    ],
    [
      "sv-0083",
      "Sköldpaddan söker en fridfull vik. Vilken plats passar bäst?",
      [
        "En lugn vik utan störande ljud",
        "En hamn med bullrande maskiner",
        "En strand där många ropar och springer"
      ],
      "Fridfull betyder lugn och utan störningar. Vi hittar en rofylld vik.",
      "world-mission-ocean-03"
    ],
    [
      "sv-0048",
      "Ordkompisen vill rita en solig bukt. Vilken himmel väljer vi?",
      [
        "En himmel där solen skiner",
        "En himmel där tjocka moln helt skymmer solen",
        "En mörk natthimmel efter att solen gått ner"
      ],
      "Solig betyder att solen skiner på platsen. Det kan vara soligt även en kall dag.",
      "world-mission-ocean-04"
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
      "Avlångt betyder betydligt längre än brett. Vi ritar av spåret.",
      "world-mission-dinosaurs-01"
    ],
    [
      "sv-0012",
      "Fossilägget är skört. Vad kan hända om vi tappar det?",
      [
        "Det kan lätt gå sönder",
        "Det kan sträcka ut sig och återgå till sin form",
        "Det kan bli magnetiskt"
      ],
      "Skört betyder att något lätt kan gå sönder. Vi låter forskaren hantera fossilet.",
      "world-mission-dinosaurs-02"
    ],
    [
      "sv-0065",
      "Vi ska rita en spetsig bergstopp. Vilken form väljer vi?",
      [
        "En topp som smalnar av till en spets",
        "En helt platt topp",
        "En rundad topp som liknar en boll"
      ],
      "Spetsig beskriver en form som smalnar av till en spets. En spetsig form behöver inte vara vass och kunna skära. Vi ritar bergstoppens form.",
      "world-mission-dinosaurs-03"
    ],
    [
      "sv-0030",
      "I vår fantasibild ska dalen vara frodig. Hur ritar vi den?",
      [
        "Med många växter som växer kraftigt",
        "Med enbart bar sand",
        "Med nästan bara torra, vissna blad"
      ],
      "Frodig beskriver riklig och kraftig växtlighet. Vi fyller dalen med gröna växter.",
      "world-mission-dinosaurs-04"
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
      "Blomman ger ifrån sig en lukt som vi kan känna med näsan. Det är lukten som gör att vi beskriver blomman som doftande. De andra valen beskrivs utan märkbar lukt.",
      "world-mission-garden-01"
    ],
    [
      "sv-0027",
      "En av tulpanerna har vissnat. Vilken ser vi till först?",
      [
        "Tulpanen med slokande, torra blad",
        "Tulpanen med upprätt gröna blad",
        "Tulpanen med spänstiga blad och en blomma som står upprätt"
      ],
      "En vissnad växt har tappat spänsten och hänger ofta ner.",
      "world-mission-garden-02"
    ],
    [
      "sv-0023",
      "Vi letar efter en prickig fjäril. Vilken ska vi rita?",
      [
        "Fjärilen med många små prickar på vingarna",
        "Fjärilen med enbart långa ränder",
        "Fjärilen med enfärgade vingar"
      ],
      "Prickig betyder att något har små prickar. Vi ritar fjärilens mönster.",
      "world-mission-garden-03"
    ],
    [
      "sv-0037",
      "Vad visar att dammens vattenyta är speglande?",
      [
        "Vi ser en bild av molnen i vattenytan",
        "Vattnet känns varmt när vi känner med fingret",
        "Vattnet plaskar när vi rör vid det"
      ],
      "En speglande yta återger en bild genom att reflektera ljus. Vi ser molnens spegelbild.",
      "world-mission-garden-04"
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
      "Glittrig betyder att något glimmar eller blänker. Vi följer det skimrande spåret.",
      "world-mission-unicorn-01"
    ],
    [
      "sv-0067",
      "Vid bron ska vi välja en triangelformad skylt. Vilken form har den?",
      [
        "Tre sidor och tre hörn",
        "Fyra sidor och fyra hörn",
        "En rund kant utan hörn"
      ],
      "En triangel har tre hörn och tre sidor. Vi hittar rätt skylt.",
      "world-mission-unicorn-02"
    ],
    [
      "sv-0015",
      "Enhörningen vill ha något mjukt under sin bok. Vad väljer vi?",
      [
        "En filt som ger efter när man trycker på den",
        "En hård sten",
        "En stel platta av metall"
      ],
      "Mjukt material ger efter när man trycker på det. Vi lägger fram filten.",
      "world-mission-unicorn-03"
    ],
    [
      "sv-0084",
      "Vi vill rita en livlig äng. Hur ser bilden ut?",
      [
        "Djur som leker, springer och rör sig",
        "En tom äng där allt står still",
        "En äng där alla sover tyst"
      ],
      "Livlig betyder full av rörelse och energi. Vi ritar en äng full av lek.",
      "world-mission-unicorn-04"
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
      "Pälsig betyder att något är täckt av päls. Vi ritar kattens päls.",
      "world-mission-animals-01"
    ],
    [
      "sv-0008",
      "Hunden vill leka med något studsande. Vilken sak väljer vi?",
      [
        "En boll som hoppar upp när den träffar marken",
        "En tygbit som blir liggande",
        "En bok som ligger still"
      ],
      "Bollen träffar marken och far tillbaka upp. Då studsar den. En boll kan också studsa tillbaka från en vägg.",
      "world-mission-animals-02"
    ],
    [
      "sv-0006",
      "Kaninen knaprar på en knaprig morot. Hur känns den när man biter i den?",
      [
        "Spröd och knastrande",
        "Mjuk som mos",
        "Seg och elastisk"
      ],
      "Knaprig beskriver något som är sprött och knastrar när man biter.",
      "world-mission-animals-03"
    ],
    [
      "sv-0076",
      "Vi vill vara generösa på djurvännernas fest. Vad gör vi?",
      [
        "Delar gärna med oss av frukten",
        "Behåller all frukt för oss själva",
        "Gömmer undan frukten"
      ],
      "Generös betyder att gärna dela med sig. Vi bjuder djurvännerna.",
      "world-mission-animals-04"
    ]
  ],
  "rainbow": [
    [
      "sv-0002",
      "Vi ska rita ett moln som ser fluffigt ut. Vilken bild passar bäst?",
      [
        "Ett moln ritat med mjuka, bulliga kanter",
        "Ett tunt rakt streck",
        "En platt fyrkant"
      ],
      "De mjuka, bulliga kanterna får molnet i bilden att se mjukt och luftigt ut. Det är därför vi beskriver det som fluffigt.",
      "world-mission-rainbow-01"
    ],
    [
      "sv-0011",
      "Färg som ännu inte torkat helt har blivit klibbig. Hur märks det?",
      [
        "Den känns klistrig och fastnar lätt",
        "Den rinner som vatten",
        "Den är hård och torr som sten"
      ],
      "Klibbig betyder att något känns klistrigt och gärna fastnar.",
      "world-mission-rainbow-02"
    ],
    [
      "sv-0003",
      "Såpbubblan är genomskinlig. Vilken detalj ska vi rita?",
      [
        "Man kan se landskapet genom bubblan",
        "Bubblan döljer allt bakom sig",
        "Bubblan består av tjock svart kartong"
      ],
      "Genomskinlig betyder att man kan se igenom något. Vi visar landskapet bakom bubblan.",
      "world-mission-rainbow-03"
    ],
    [
      "sv-0039",
      "Tornets lampor är blinkande. Hur ritar vi en liten serie av dem?",
      [
        "Lamporna tänds och släcks flera gånger",
        "Lamporna lyser hela tiden",
        "Lamporna är släckta hela tiden"
      ],
      "Blinkande betyder att något tänds och släcks upprepade gånger. Vi ritar det.",
      "world-mission-rainbow-04"
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
      "Tung betyder att något väger mycket. Vi ber om hjälp med balen.",
      "world-mission-horses-01"
    ],
    [
      "sv-0072",
      "Ponnyn kommer inte fram direkt. Hur visar vi att vi är tålmodiga?",
      [
        "Väntar lugnt vid staketet",
        "Ropar otåligt hela tiden",
        "Springer fram för att skynda på den"
      ],
      "Vi ger ponnyn tid och väntar lugnt. Då är vi tålmodiga.",
      "world-mission-horses-02"
    ],
    [
      "sv-0005",
      "På ridstigen finns en hal fläck. Vilken fläck varnar vi den vuxna för?",
      [
        "En isig yta där fötterna lätt glider",
        "En sträv grusyta med gott grepp",
        "En torr stig med grovt underlag"
      ],
      "Hal beskriver en yta där det är lätt att glida. Vi väljer en trygg väg tillsammans.",
      "world-mission-horses-03"
    ],
    [
      "sv-0023",
      "Vi vill rita en prickig rosett. Vilket mönster ska den ha?",
      [
        "Små prickar över bandet",
        "Långa ränder över bandet",
        "Ett helt enfärgat band"
      ],
      "Prickig betyder att något har små prickar. Vi ritar rosetten med prickar.",
      "world-mission-horses-04"
    ]
  ],
  "music": [
    [
      "sv-0020",
      "Vi spelar en snabb melodi. Musikern ber oss göra den långsam. Vad ändrar vi?",
      [
        "Låter det gå längre tid mellan tonerna",
        "Spelar lika snabbt men starkare",
        "Spelar lika snabbt men svagare"
      ],
      "När det går längre tid mellan tonerna tar melodin längre tid att spela. Tempot blir långsammare. Att spela starkare eller svagare ändrar hur starkt det låter, inte hur snabbt vi spelar.",
      "world-mission-music-01"
    ],
    [
      "sv-0009",
      "I replokalen hörs ett surrande ljud. Vilket ljud beskriver det bäst?",
      [
        "Ett jämnt, långdraget brummande",
        "Ett enda kort klick",
        "Ett enstaka knallande ljud"
      ],
      "Ett surrande ljud fortsätter en stund, som ljudet från en fläkt. Ett enda klick tar slut direkt.",
      "world-mission-music-02"
    ],
    [
      "sv-0039",
      "Dansgolvet ska ha blinkande lampor. Vilken belysning väljer vi i vår bild?",
      [
        "Lampor som tänds och släcks omväxlande",
        "Lampor som lyser oförändrat",
        "Lampor som aldrig tänds"
      ],
      "Blinkande lampor tänds och släcks upprepade gånger. Vi ritar ljusshowen.",
      "world-mission-music-03"
    ],
    [
      "sv-0085",
      "Musikern är förtjust i den sista melodin. Vad betyder det?",
      [
        "Hon tycker väldigt mycket om melodin och vill spela den igen",
        "Hon tycker inte alls om melodin",
        "Hon har ännu inte hört melodin och vet inte vad hon tycker"
      ],
      "Förtjust betyder att tycka väldigt mycket om något. Musikern tycker så mycket om melodin att hon gärna spelar den igen.",
      "world-mission-music-04"
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
        if(!Array.isArray(row)||row.length!==5){errors.push(key);return;}
        const [target,prompt,actions,why,questionId]=row,item=byId.get(target);
        if(questionId!=='world-mission-'+world+'-'+String(index+1).padStart(2,'0')){
          errors.push(key);return;
        }
        if(item?.kind!=='word'||!item.name||!item.definition||typeof prompt!=='string'||!prompt.trim()||
          typeof why!=='string'||!why.trim()||!Array.isArray(actions)||actions.length!==3||
          !actions.every(action=>typeof action==='string'&&action.trim())||new Set(actions).size!==3){errors.push(key);return;}
        tasks[key]={key,questionId,world,index,target,word:item.name,definition:item.definition,prompt,why,
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
