/* Finite, authored story chapters over the existing adventure worlds.
 * Cosmetic discovery only: no scores, locks on educational content, timers,
 * random prizes, streaks or loss. Every chapter ends with a resolution. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenStory=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DATA=Object.freeze({
  "forest": [
    [
      "Ett prassel vid stigen",
      "Något prasslar under ormbunkarna. En liten fågel har hittat en gammal stigskylt.",
      "Fågeln visar oss vägen in i skogen. På skylten finns ett litet löv.",
      "🍃",
      "Stiglövet"
    ],
    [
      "Svamparnas hemliga ring",
      "Små svampar står i en ring. I mitten finns en pytteliten karta.",
      "Kartan visar ett stort träd längre fram. Vi lägger den i vår upptäckarbok.",
      "🍄",
      "Svampkartan"
    ],
    [
      "Ugglans bibliotek",
      "En uggla ordnar böcker i ett ihåligt träd. Den vill visa sin favoritplats.",
      "Ugglan öppnar sin lilla boklucka och berättar om gläntan.",
      "🪶",
      "Ugglans bokmärke"
    ],
    [
      "Lyktor i gläntan",
      "I gläntan hänger lyktor mellan träden. Vi hittar en plats där alla berättelser får plats.",
      "Vi tänder den sista lyktan. Skogens stig är utforskad, och vi kan alltid komma tillbaka.",
      "🏮",
      "Gläntans lykta"
    ]
  ],
  "space": [
    [
      "Raketen är redo",
      "En liten robot har packat kartor, vatten och en kikare. Nu väntar uppskjutningen.",
      "Vi ser jorden bli mindre genom fönstret. Robotens första rymdmärke hamnar i boken.",
      "🚀",
      "Raketsigillet"
    ],
    [
      "Spår på månen",
      "På månens yta syns märkliga spår. En dammig liten sten glimmar bredvid dem.",
      "Vi undersöker spåren och hittar en månsten till vår samling.",
      "🌕",
      "Månstenen"
    ],
    [
      "Runt ringplaneten",
      "Isbitar och sten snurrar runt planeten. Vi letar efter en säker utsiktsplats.",
      "Från fönstret ser vi ringarna breda ut sig. Vi sparar en bild av dem.",
      "🪐",
      "Ringplanetens märke"
    ],
    [
      "Stjärnbasens fönster",
      "En stjärnbas lyser längre fram. Där finns ett stort fönster mot rymden.",
      "Vi landar vid basen och tittar på stjärnorna tillsammans. Rymdresan har fått ett fint slut.",
      "🔭",
      "Stjärnkikaren"
    ]
  ],
  "castle": [
    [
      "Den vänliga portvakten",
      "Portvakten hälsar välkommen. Bakom porten syns färgglada flaggor.",
      "Porten öppnas och vi får en liten flagga att minnas besöket med.",
      "🏳️",
      "Slottsflaggan"
    ],
    [
      "Nycklar med mönster",
      "I ett rum hänger nycklar i olika former. En av dem leder till en plats med en drake.",
      "Vi hittar nyckeln till nästa rum och lägger en kopia i upptäckarboken.",
      "🗝️",
      "Mönsternyckeln"
    ],
    [
      "Drakens sagor",
      "En vänlig drake sitter på en kudde och berättar historier för små riddare.",
      "Draken visar oss ett glänsande fjäll och vägen till skattkammaren.",
      "🐉",
      "Drakfjället"
    ],
    [
      "Skattkammarens bok",
      "Skattkammaren är full av böcker, kartor och stenar som glittrar.",
      "Vi hittar en vacker bok för våra egna ord. Slottets fyra platser är utforskade.",
      "💎",
      "Sagoskatten"
    ]
  ],
  "pirate": [
    [
      "Ombord med kaptenen",
      "En vänlig kapten vecklar ut en segelduk. På däcket ligger en kompass.",
      "Vi hissar seglet och sparar kompassen som minne från båten.",
      "🧭",
      "Sjökompassen"
    ],
    [
      "Kartan med krysset",
      "Skattkartan har en liten ö ritad vid kanten. Vågor och vind väntar.",
      "Vi ser var ön ligger och ritar in den på vår karta.",
      "🗺️",
      "Ökartan"
    ],
    [
      "Den hemliga stranden",
      "På en strand finns snäckor och en gammal flaska med ett meddelande.",
      "Meddelandet visar var den gamla skattkistan står. Vi tar med en snäcka.",
      "🐚",
      "Strandsnäckan"
    ],
    [
      "Kaptenens skattkista",
      "Kistan innehåller kaptenens samling av berättelser från havet.",
      "Vi läser en berättelse tillsammans och lägger ett minnesmärke i boken.",
      "⚓",
      "Kaptenens ankare"
    ]
  ],
  "ocean": [
    [
      "Snäckornas sång",
      "På stranden finns snäckor i många former. Vi lyssnar på havet.",
      "Vi hittar en vackert randig snäcka och tar en bild till upptäckarboken.",
      "🐚",
      "Randiga snäckan"
    ],
    [
      "Korallernas färger",
      "Små fiskar simmar mellan koraller i olika färger.",
      "Fiskarna visar en väg genom revet. Vi sparar en bild av en korall.",
      "🪸",
      "Korallbilden"
    ],
    [
      "Sköldpaddans vik",
      "En sköldpadda simmar lugnt mot en skyddad vik.",
      "Vi hittar en lugn plats att vila och titta på sköldpaddorna.",
      "🐢",
      "Sköldpaddsmärket"
    ],
    [
      "Delfinernas dans",
      "Delfiner hoppar över vågorna i en solig bukt.",
      "Vi ser deras lek från båten. Havets fyra platser finns nu i boken.",
      "🐬",
      "Delfinmärket"
    ]
  ],
  "dinosaurs": [
    [
      "Stora fotspår",
      "Vi hittar ett stort fotavtryck i leran. Vems fot kan ha lämnat det?",
      "Vi följer spåren och gör en teckning av ett avtryck.",
      "👣",
      "Spårteckningen"
    ],
    [
      "Ägget i dalen",
      "En forskare visar oss ett fossil som liknar ett ägg.",
      "Vi får en bild av fossilet och ser en stig som går runt berget.",
      "🥚",
      "Fossilägget"
    ],
    [
      "Utsikt över vulkanen",
      "Från en säker utkiksplats ser vi en gammal vulkan och en grön dal.",
      "Vi ritar bergets form och hittar stigen ner till dalen.",
      "🌋",
      "Bergsmärket"
    ],
    [
      "Dinosauriernas dal",
      "I fantasin vandrar stora dinosaurier bland träden.",
      "Vi öppnar vår upptäckarbok och ritar dalen med alla dess djur.",
      "🦕",
      "Dalmärket"
    ]
  ],
  "garden": [
    [
      "Det lilla fröet",
      "En trädgårdsmästare har en handfull frön. Vi väljer en plats i jorden.",
      "Ett frö får sin plats i gläntan. Vi sparar en liten fröpåse i boken.",
      "🌱",
      "Fröpåsen"
    ],
    [
      "Tulpanernas stig",
      "Tulpaner i många färger kantar stigen. En skylt visar vägen till ängen.",
      "Vi hittar en blomma som inspirerar en ny teckning.",
      "🌷",
      "Tulpanbilden"
    ],
    [
      "Fjärilar över ängen",
      "Fjärilar fladdrar mellan blommorna. Vi stannar för att se deras mönster.",
      "En fjäril landar på en blomma. Vi sparar ett fjärilsmärke.",
      "🦋",
      "Fjärilsmärket"
    ],
    [
      "Dammsagans slut",
      "Vid dammen speglas blommor och moln i vattnet.",
      "Vi sitter vid dammen och tittar på hela trädgården. Vår bok har fått en ny saga.",
      "🌸",
      "Dammblomman"
    ]
  ],
  "unicorn": [
    [
      "Det gnistrande spåret",
      "Ett glittrande spår går över kullarna. Vi följer det med vår ordkompis.",
      "Spåret leder till en bro och en liten lysande stjärna.",
      "✨",
      "Gnisterstjärnan"
    ],
    [
      "Regnbågsbron",
      "Bron skimrar i flera färger. På andra sidan syns en grön äng.",
      "Vi går över bron och sparar ett färgmärke i boken.",
      "🌈",
      "Bromärket"
    ],
    [
      "Hjärtgläntan",
      "I gläntan finns små hjärtformade stenar och vänliga fåglar.",
      "Vi hittar en sten att rita av och hälsar på en enhörning.",
      "💖",
      "Hjärtstenen"
    ],
    [
      "Enhörningarnas äng",
      "Enhörningarna leker bland blommorna. En plats finns ledig för oss.",
      "Vi vilar i gräset och ser på regnbågen. Dalen är nu utforskad.",
      "🦄",
      "Ängens märke"
    ]
  ],
  "animals": [
    [
      "Kattstugans gardin",
      "En katt tittar fram bakom en gardin. Den vill visa sin favoritkudde.",
      "Katten spinner medan vi ritar ett tassavtryck.",
      "🐱",
      "Kattens tass"
    ],
    [
      "Hundparkens boll",
      "En hund har en färgglad boll. Den visar vägen runt parken.",
      "Vi leker med hunden och sparar en bild av bollen.",
      "🎾",
      "Parkbollen"
    ],
    [
      "Kaninens morot",
      "En kanin nosar på en morot vid hagens grind.",
      "Vi tittar på hur kaninen hoppar och får en liten morotsbild.",
      "🥕",
      "Kaninmärket"
    ],
    [
      "Djurvännernas fest",
      "Alla djur har samlats på en stor filt med plats för fler.",
      "Vi säger hej till djurvännerna. Alla fyra besöken finns nu i boken.",
      "🐾",
      "Vänskapstassen"
    ]
  ],
  "rainbow": [
    [
      "Molnporten öppnas",
      "Mjuka moln bildar en port. Bakom den finns en låda med färgpennor.",
      "Vi hittar en penna som kan rita en egen molnbild.",
      "☁️",
      "Molnmärket"
    ],
    [
      "Färgverkstadens pensel",
      "På bordet finns färgskålar och stora penslar. Vi får välja en färg.",
      "Vi målar en del av regnbågen och sparar en liten penselbild.",
      "🎨",
      "Färgpaletten"
    ],
    [
      "Bubblor i vinden",
      "Såpbubblor flyger över stigen och glänser i solen.",
      "Vi tittar på färgerna i bubblorna och ritar deras former.",
      "🫧",
      "Bubbelmärket"
    ],
    [
      "Regnbågstornet",
      "Högst upp i tornet syns alla färger tillsammans.",
      "Vi ser ut över färglandet och avslutar vår vandring med en regnbågsbild.",
      "🌈",
      "Regnbågsmärket"
    ]
  ],
  "horses": [
    [
      "En morgon i stallet",
      "Hästarna gnäggar i stallet. Foderboden väntar på dagens arbete.",
      "Vi hjälper till med en höbal och sparar en stallbild.",
      "🌾",
      "Stallmärket"
    ],
    [
      "Ponnyn i hagen",
      "En ponny står vid staketet och viftar på svansen.",
      "Vi hälsar lugnt på ponnyn och hittar en liten hästbild.",
      "🐴",
      "Ponnymärket"
    ],
    [
      "Stigen genom skogen",
      "Ridstigen går förbi ett träd och en liten bäck. Vi tittar på kartan.",
      "Vi följer den trygga stigen tillbaka till gården.",
      "🏇",
      "Ridstigens märke"
    ],
    [
      "Gårdens rosetter",
      "På gården hänger rosetter i många färger. Alla får titta och välja sin favorit.",
      "Vi ritar en rosett i boken och säger hej då till hästarna.",
      "🏅",
      "Gårdsrosetten"
    ]
  ],
  "music": [
    [
      "En liten melodi",
      "På scenen ligger ett notblad. En musiker spelar den första tonen.",
      "Vi hittar en melodi som får plats i vår upptäckarbok.",
      "🎵",
      "Tonmärket"
    ],
    [
      "Replokalens rytm",
      "I replokalen finns trummor, gitarrer och en liten klocka.",
      "Vi hör en rytm och sparar en bild av ett instrument.",
      "🎸",
      "Gitarrmärket"
    ],
    [
      "Dansgolvets färger",
      "Lampor lyser över dansgolvet. Vi provar att hitta en rörelse till musiken.",
      "Vi dansar en liten stund och ritar en färgad lampa.",
      "💃",
      "Dansmärket"
    ],
    [
      "Den stora ordshowen",
      "Scenen är redo och alla musiker står tillsammans.",
      "Vi lyssnar på den sista melodin och applåderar. Musikresan är komplett.",
      "🎤",
      "Scenmärket"
    ]
  ]
});
  const validWorld=id=>typeof id==='string'&&Object.hasOwn(DATA,id);
  function sanitize(raw){
    const out={};
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    for(const id of Object.keys(DATA)){
      const n=raw[id];
      if(Number.isInteger(n)&&n>0)out[id]=Math.min(DATA[id].length,n);
    }
    return out;
  }
  function model(raw,world){
    const id=validWorld(world)?world:'forest',progress=sanitize(raw),count=progress[id]||0,total=DATA[id].length;
    const chapters=DATA[id].map(([title,intro,ending,emoji,keepsake],index)=>({
      id,index,title,intro,ending,emoji,keepsake,visited:index<count}));
    const chapter=count===total?{id,index:total,title:'Ett återbesök',intro:'Vi hälsar på igen.',ending:'Det var fint att komma tillbaka.',emoji:'',keepsake:'',visited:true}:chapters[count];
    return {id,count,total,complete:count===total,chapter,chapters,
      collected:Object.values(progress).reduce((sum,n)=>sum+n,0)};
  }
  function finish(raw,chapter,journey){
    if(!journey?.finished||!Array.isArray(journey.completed)||!journey.completed.length)return {progress:raw,earned:null};
    return completeChapter(raw,chapter);
  }
  function completeChapter(raw,chapter){
    const progress=sanitize(raw);
    if(!chapter||!validWorld(chapter.id)||!Number.isInteger(chapter.index))return {progress:raw,earned:null};
    const count=progress[chapter.id]||0;
    if(count!==chapter.index||count>=DATA[chapter.id].length)return {progress:raw,earned:null};
    const earned=model(progress,chapter.id).chapter;
    return {progress:{...progress,[chapter.id]:count+1},earned};
  }
  // Child chooses the opening activity, never the answer, locked content or
  // a way to bypass a protected followup. Choices come from real candidates.
  function allowedOpenings(rows,baseline){
    if(!rows.includes(baseline))return [];
    if(baseline.feedbackPriority>0)return [baseline];
    const core=['need','review'].includes(baseline.reason);
    return [baseline,...rows.filter(row=>row!==baseline&&
      (!core||['need','review'].includes(row.reason))&&!(row.feedbackPriority>0))];
  }
  function openings(rows,baseline){
    const allowed=allowedOpenings(rows,baseline);
    if(!allowed.length)return [];
    const alternative=allowed.find(row=>row.mode!==baseline.mode);
    return alternative?[baseline,alternative]:[baseline];
  }
  function prefer(rows,baseline,mode){
    return allowedOpenings(rows,baseline).find(row=>row.mode===mode)||baseline;
  }
  return {DATA,validWorld,sanitize,model,finish,completeChapter,openings,prefer};
});
