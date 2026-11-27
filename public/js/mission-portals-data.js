/* Original clue-led adventures. All clues and explanations are locally authored.
 * Party themes are inspiration, not copied commercial games. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenPortalsData=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const STORIES=[
    {
      "id": "detective",
      "emoji": "🔎",
      "title": "Fallet med den försvunna tårtspaden",
      "intro": "Tårtan är klar, men spaden är borta. Detektivbyrån behöver din hjälp!",
      "ending": "Tårtspaden låg tryggt bland kalasbesticken. Nu kan alla dela på tårtan!",
      "keepsake": {
        "emoji": "🕵️",
        "name": "Detektivmärket"
      },
      "stages": [
        {
          "title": "Spåren i köket",
          "scene": "En lapp berättar var du ska börja leta.",
          "clues": [
            "Här finns saker till tårtan.",
            "Det finns en blå låda."
          ],
          "choices": [
            "Vid diskhon finns en blå låda med diskborstar.",
            "På bänken står en blå låda med kalasbestick.",
            "På bordet finns tårtljus, men ingen blå låda."
          ],
          "answer": 1,
          "wrong": [
            "Lådan är blå, men sakerna är inte till tårtan.",
            null,
            "Kalasföremålen finns, men den blå lådan saknas."
          ],
          "why": "Lådan på bänken är blå och innehåller kalasbestick."
        },
        {
          "title": "Vittnets meddelande",
          "scene": "På lådan sitter en lapp. Vilken mening hjälper dig vidare?",
          "clues": [
            "Meddelandet nämner skedar.",
            "Det berättar var du ska leta."
          ],
          "choices": [
            "En sked kan blänka i solen.",
            "Leta på hyllan med skedar.",
            "Leta vid fönstret efter en låda."
          ],
          "answer": 1,
          "wrong": [
            "Här nämns en sked, men ingen plats.",
            null,
            "Här finns en plats, men inget om skedar."
          ],
          "why": "Lappen nämner både skedar och hyllan där de står."
        },
        {
          "title": "Den sista lådan",
          "scene": "Du hittar tre lådor vid hyllan. Vilken ska öppnas?",
          "clues": [
            "På lådan står det Kalas.",
            "Ett tårtfat står bredvid."
          ],
          "choices": [
            "Kalaslådan står bredvid ett tårtfat.",
            "Kalaslådan står bredvid en kopp.",
            "En låda märkt Vardag står vid tårtfatet."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Texten stämmer, men tårtfatet saknas.",
            "Tårtfatet finns, men lådans text är fel."
          ],
          "why": "Kalaslådan har rätt text och står bredvid tårtfatet."
        }
      ],
      "group": "mystery"
    },
    {
      "id": "agents",
      "emoji": "🕶️",
      "title": "Agenternas hemliga ljussignal",
      "intro": "Stadens vänliga ljusrobot har tappat sin kod. Agentgruppen måste hitta den!",
      "ending": "Koden fungerar! Roboten lyser igen och blinkar ett stort tack.",
      "keepsake": {
        "emoji": "📡",
        "name": "Agentbrickan"
      },
      "stages": [
        {
          "title": "Första signalen",
          "scene": "Tre skärmar blinkar. Vilken visar det rätta tecknet?",
          "clues": [
            "Det syns en stjärna.",
            "Under stjärnan står siffran 7."
          ],
          "choices": [
            "En stjärna lyser över siffran 7.",
            "En stjärna lyser över siffran 4.",
            "Siffran 7 syns under en måne."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Stjärnan stämmer, men siffran är fel.",
            "Siffran stämmer, men symbolen är fel."
          ],
          "why": "Skärmen visar en stjärna och siffran 7."
        },
        {
          "title": "De tre dörrarna",
          "scene": "Agenten får en lapp som beskriver rätt dörr.",
          "clues": [
            "Dörren är grön.",
            "Den har ett runt fönster."
          ],
          "choices": [
            "En grön dörr har ett fyrkantigt fönster.",
            "En blå dörr har ett runt fönster.",
            "En grön dörr har ett runt fönster."
          ],
          "answer": 2,
          "wrong": [
            "Färgen är rätt, men fönstret är fyrkantigt.",
            "Fönstret är runt, men dörren är blå.",
            null
          ],
          "why": "Den gröna dörren har det runda fönstret."
        },
        {
          "title": "Starta roboten",
          "scene": "Tre knappar sitter på robotens rygg. Vilken behövs?",
          "clues": [
            "På knappen står det START.",
            "Knappen har formen av en triangel."
          ],
          "choices": [
            "En rund knapp är märkt START.",
            "En trekantig knapp är märkt START.",
            "En trekantig knapp är märkt PAUS."
          ],
          "answer": 1,
          "wrong": [
            "Texten stämmer, men formen är rund.",
            null,
            "Formen stämmer, men texten är PAUS."
          ],
          "why": "Både START och triangelformen finns på samma knapp."
        }
      ],
      "group": "mystery"
    },
    {
      "id": "escape",
      "emoji": "🔐",
      "title": "Gåtrummets hemliga dörr",
      "intro": "I ett frivilligt gåtrum öppnar du dörrar med kluriga ledtrådar. Ingen klocka räknar ned.",
      "ending": "Alla dörrar är öppna! En skylt säger: Du löste gåtorna genom att tänka.",
      "keepsake": {
        "emoji": "🗝️",
        "name": "Gåtnyckeln"
      },
      "stages": [
        {
          "title": "Hyllans lådor",
          "scene": "En lapp berättar var den första nyckeln finns.",
          "clues": [
            "Lådan är gul.",
            "Ett moln finns på locket."
          ],
          "choices": [
            "En gul låda har en sol på locket.",
            "En blå låda har ett moln på locket.",
            "En gul låda har ett moln på locket."
          ],
          "answer": 2,
          "wrong": [
            "Färgen stämmer, men bilden är en sol.",
            "Molnet finns, men lådan är blå.",
            null
          ],
          "why": "Rätt låda är gul med ett moln på locket."
        },
        {
          "title": "Orden på väggen",
          "scene": "En skylt beskriver ett föremål med två egenskaper.",
          "clues": [
            "Det går att öppna.",
            "Det har sidor av papper."
          ],
          "choices": [
            "En bok med papperssidor.",
            "En dörr av trä.",
            "Ett löst pappersark."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Dörren kan öppnas, men har inte sidor av papper.",
            "Papperet stämmer, men arket behöver inte öppnas."
          ],
          "why": "En bok kan öppnas och har sidor av papper."
        },
        {
          "title": "Det sista låset",
          "scene": "Välj den sifferkod som stämmer med båda spåren.",
          "clues": [
            "Första siffran är 3.",
            "Sista siffran är 8."
          ],
          "choices": [
            "Koden är 3–4–6.",
            "Koden är 5–4–8.",
            "Koden är 3–4–8."
          ],
          "answer": 2,
          "wrong": [
            "Första siffran stämmer, men sista är inte 8.",
            "Sista siffran stämmer, men första är inte 3.",
            null
          ],
          "why": "Koden börjar med 3 och slutar med 8."
        }
      ],
      "group": "mystery"
    },
    {
      "id": "pirates",
      "emoji": "🏴‍☠️",
      "title": "Piraternas stjärnkarta",
      "intro": "Kapten Mira har en karta till en hemlig vänskapsskatt. Följ med på upptäcktsfärd!",
      "ending": "Kistan innehåller vänskapsarmband åt hela besättningen. Alla får vara med.",
      "keepsake": {
        "emoji": "🧭",
        "name": "Sjökompassen"
      },
      "stages": [
        {
          "title": "Rätt ö på kartan",
          "scene": "Tre öar syns på kartan. Var ska ni gå i land?",
          "clues": [
            "Där växer två palmer.",
            "En liten brygga ligger intill."
          ],
          "choices": [
            "En ö har två palmer och en brygga.",
            "En ö har två palmer men ingen brygga.",
            "En ö har en brygga men bara en palm."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Palmerna stämmer, men bryggan saknas.",
            "Bryggan stämmer, men det är bara en palm."
          ],
          "why": "Ön har både två palmer och en liten brygga."
        },
        {
          "title": "Kaptenens lapp",
          "scene": "Kaptenen har skrivit hur ni ska gå.",
          "clues": [
            "Gå först mot den höga stenen.",
            "Sväng sedan vänster vid stenen."
          ],
          "choices": [
            "Gå mot stenen och sväng höger.",
            "Gå mot den höga stenen och sväng vänster.",
            "Gå mot trädet och sväng vänster."
          ],
          "answer": 1,
          "wrong": [
            "Stenen stämmer, men svängen är åt fel håll.",
            null,
            "Svängen stämmer, men första platsen är fel."
          ],
          "why": "Ni går till stenen och svänger vänster."
        },
        {
          "title": "Skattkistan",
          "scene": "Tre kistor ligger vid stranden. Vilken är rätt?",
          "clues": [
            "På locket finns ett hjärta.",
            "Kistan har ett handtag av rep."
          ],
          "choices": [
            "En kista med hjärta har metallhandtag.",
            "En kista med stjärna har rephandtag.",
            "En kista med hjärta har rephandtag."
          ],
          "answer": 2,
          "wrong": [
            "Hjärtat finns där, men handtaget är av metall.",
            "Repet finns, men bilden är en stjärna.",
            null
          ],
          "why": "Samma kista har både ett hjärta och ett rephandtag."
        }
      ],
      "group": "explore"
    },
    {
      "id": "magic",
      "emoji": "🪄",
      "title": "Trollskolans försvunna skratt",
      "intro": "Nomi har en skrattklocka som har tystnat. Hjälp lärlingen att hitta ett ord och en trollstav!",
      "ending": "Nomi säger rätt ord och klockan klingar. Hela trollskolan skrattar tillsammans.",
      "keepsake": {
        "emoji": "🔔",
        "name": "Skrattklockan"
      },
      "stages": [
        {
          "title": "Bibliotekets dörr",
          "scene": "Tre dörrar leder till olika rum. Vilken behöver Nomi?",
          "clues": [
            "Här finns böcker om ljud.",
            "Ovanför dörren hänger en klocka."
          ],
          "choices": [
            "Rummet med böcker om ljud har en klocka ovanför dörren.",
            "Rummet med böcker om ljud har en stjärna ovanför.",
            "Rummet med målningar har en klocka ovanför."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Böckerna passar, men klockan saknas.",
            "Klockan finns, men böckerna handlar inte om ljud."
          ],
          "why": "Rummet har böcker om ljud och en klocka ovanför dörren. Båda spåren stämmer."
        },
        {
          "title": "Det magiska ordet",
          "scene": "Boken beskriver ordet Nomi ska säga.",
          "clues": [
            "Ordet beskriver glädje.",
            "Det handlar om något som hörs."
          ],
          "choices": [
            "Le visar glädje i ansiktet.",
            "Skratta visar glädje och hörs ofta.",
            "Viska är att tala med låg röst."
          ],
          "answer": 1,
          "wrong": [
            "Le visar glädje, men behöver inte höras.",
            null,
            "Viska hörs, men beskriver inte glädje."
          ],
          "why": "Skratta beskriver glädje och ett ljud."
        },
        {
          "title": "Rätt trollstav",
          "scene": "Tre stavar ligger i en låda. Vilken hör till klockan?",
          "clues": [
            "Staven har en måne på spetsen.",
            "Ett blått band sitter runt skaftet."
          ],
          "choices": [
            "Månstaven har ett rött band.",
            "Solstaven har ett blått band.",
            "Månstaven har ett blått band."
          ],
          "answer": 2,
          "wrong": [
            "Månen stämmer, men bandet är rött.",
            "Bandet stämmer, men spetsen har en sol.",
            null
          ],
          "why": "Rätt trollstav har månen och det blå bandet."
        }
      ],
      "group": "fantasy"
    },
    {
      "id": "dinosaurs",
      "emoji": "🦕",
      "title": "Dinosauriernas äggmysterium",
      "intro": "Forskarna har hittat spår efter ett märkligt äggformat föremål. Hjälp dem att undersöka fyndet!",
      "ending": "Fyndet är en hård sten som liknar ett ägg. Forskarna skyddar den och berättar vad spåren visade.",
      "keepsake": {
        "emoji": "🥚",
        "name": "Fyndmärket"
      },
      "stages": [
        {
          "title": "Spår i leran",
          "scene": "Forskarna söker rätt plats att undersöka.",
          "clues": [
            "Här finns stora fotspår i lera.",
            "Små blad ligger bredvid spåren."
          ],
          "choices": [
            "Här finns stora spår i lera och små blad.",
            "Här finns stora spår men inga blad.",
            "Här ligger blad men inga fotspår."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Fotspåren finns, men inga blad.",
            "Bladen finns, men inga fotspår."
          ],
          "why": "I leran finns både fotspår och små blad."
        },
        {
          "title": "Det märkliga fyndet",
          "scene": "Forskaren beskriver föremålet i sin anteckningsbok.",
          "clues": [
            "Det är hårt som sten.",
            "Det har ungefär samma form som ett ägg."
          ],
          "choices": [
            "Ett mjukt, äggformat föremål.",
            "En hård sten med äggform.",
            "En hård sten med fyrkantig form."
          ],
          "answer": 1,
          "wrong": [
            "Formen stämmer, men föremålet är mjukt.",
            null,
            "Stenen är hård, men formen stämmer inte."
          ],
          "why": "En hård sten som liknar ett ägg passar båda spåren."
        },
        {
          "title": "Skydda fyndet",
          "scene": "Forskarna vill visa fyndet utan att skada det.",
          "clues": [
            "Det ska ligga stilla och skyddat.",
            "Besökare ska kunna se det genom glas."
          ],
          "choices": [
            "Fyndet står bakom glas, men ligger löst och kan falla.",
            "Fyndet ligger skyddat i en låda utan glas.",
            "Fyndet ligger i en skyddad glasmonter."
          ],
          "answer": 2,
          "wrong": [
            "Besökarna kan se fyndet genom glas, men det ligger inte säkert.",
            "Det är skyddat, men syns inte genom glas.",
            null
          ],
          "why": "En skyddad glasmonter låter besökarna se fyndet."
        }
      ],
      "group": "explore"
    },
    {
      "id": "lab",
      "emoji": "🧪",
      "title": "Professor Pärlans bubbelgåta",
      "intro": "Fantasiprofessorns målade bubblor har bytt plats. Hjälp till att ordna teckningarna!",
      "ending": "Alla bubbelbilder är tillbaka på rätt plats. Professorn tackar med en regnbåge av färger.",
      "keepsake": {
        "emoji": "🫧",
        "name": "Bubbelmärket"
      },
      "stages": [
        {
          "title": "Den prickiga bubblan",
          "scene": "På en bild syns den bubbla professorn letar efter.",
          "clues": [
            "Bubblan är gul.",
            "Den har tre blå prickar."
          ],
          "choices": [
            "En gul bubbla har tre blå prickar.",
            "En gul bubbla har två blå prickar.",
            "En grön bubbla har tre blå prickar."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Färgen stämmer, men antalet prickar är fel.",
            "Prickarna stämmer, men färgen är grön."
          ],
          "why": "Den gula bubblan har precis tre blå prickar."
        },
        {
          "title": "Hyllan i labbet",
          "scene": "En lapp beskriver nästa hylla.",
          "clues": [
            "Hyllan har två lådor.",
            "På den övre lådan finns en måne."
          ],
          "choices": [
            "Två lådor med en sol överst.",
            "Två lådor med en måne överst.",
            "Tre lådor med en måne överst."
          ],
          "answer": 1,
          "wrong": [
            "Antalet stämmer, men bilden är en sol.",
            null,
            "Månen finns där, men hyllan har tre lådor."
          ],
          "why": "Hyllan har två lådor och en måne på den övre."
        },
        {
          "title": "Färgernas ordning",
          "scene": "Tre skyltar visar färger i olika ordning.",
          "clues": [
            "Rött ska stå före blått.",
            "Blått ska stå före grönt."
          ],
          "choices": [
            "Blått, rött, grönt.",
            "Rött, grönt, blått.",
            "Rött, blått, grönt."
          ],
          "answer": 2,
          "wrong": [
            "Blått står före grönt, men rött kommer efter blått.",
            "Grönt kommer före blått, så andra spåret stämmer inte.",
            null
          ],
          "why": "Ordningen rött, blått, grönt följer båda ledtrådarna."
        }
      ],
      "group": "creative"
    },
    {
      "id": "ghost",
      "emoji": "👻",
      "title": "Det vänliga spökets klocka",
      "intro": "Ett snällt spöke saknar ljudet från sin lilla klocka. Hjälp till att hitta rätt del!",
      "ending": "Klockan klingar igen. Spöket blir glatt och bjuder in till en vänlig dans.",
      "keepsake": {
        "emoji": "🕯️",
        "name": "Spökvännens ljus"
      },
      "stages": [
        {
          "title": "Fönstret i huset",
          "scene": "En lapp berättar var första spåret finns.",
          "clues": [
            "Fönstret har blå gardiner.",
            "En lykta står på fönsterbrädan."
          ],
          "choices": [
            "Blå gardiner och en lykta i fönstret.",
            "Blå gardiner men ingen lykta.",
            "En lykta men gula gardiner."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Färgen stämmer, men lyktan saknas.",
            "Lyktan stämmer, men gardinerna är gula."
          ],
          "why": "Fönstret har både blå gardiner och en lykta."
        },
        {
          "title": "Det märkliga ljudet",
          "scene": "Spöket beskriver ett ljud som hörs i huset.",
          "clues": [
            "Ljudet är svagt.",
            "Det låter som en liten klocka."
          ],
          "choices": [
            "Ett högt dång från en klocka.",
            "Ett svagt pling från en klocka.",
            "En svag viskning i vinden."
          ],
          "answer": 1,
          "wrong": [
            "Ljudet kommer från en klocka, men det är högt och inte svagt.",
            null,
            "Viskningen är svag, men låter inte som en klocka."
          ],
          "why": "Ett svagt pling passar båda spåren."
        },
        {
          "title": "Den lilla lådan",
          "scene": "Klockans saknade del ligger i en låda.",
          "clues": [
            "Lådan är rund.",
            "En vit stjärna finns på locket."
          ],
          "choices": [
            "Rund låda med ett blått hjärta.",
            "Fyrkantig låda med en vit stjärna.",
            "Rund låda med en vit stjärna."
          ],
          "answer": 2,
          "wrong": [
            "Formen stämmer, men bilden är ett hjärta.",
            "Stjärnan stämmer, men lådan är fyrkantig.",
            null
          ],
          "why": "Lådan är rund och har en vit stjärna på locket."
        }
      ],
      "group": "fantasy"
    },
    {
      "id": "space",
      "emoji": "🚀",
      "title": "Rymdstationens vänliga signal",
      "intro": "En robot vill säga hej till en vän på månen. Hjälp den att skicka rätt meddelande!",
      "ending": "Signalen kommer fram och robotens vän svarar: Hej, jag hör dig!",
      "keepsake": {
        "emoji": "🌟",
        "name": "Signalstjärnan"
      },
      "stages": [
        {
          "title": "Hitta antennen",
          "scene": "Roboten letar efter rätt antenn.",
          "clues": [
            "Antennen står på taket.",
            "En liten blå flagga finns bredvid."
          ],
          "choices": [
            "Antennen står på taket med en blå flagga.",
            "Antennen står på taket utan flagga.",
            "Antennen står inomhus bredvid en blå flagga."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Antennen är på taket, men flaggan saknas.",
            "Flaggan är blå, men antennen står inomhus."
          ],
          "why": "Både taket och den blå flaggan stämmer med ledtrådarna."
        },
        {
          "title": "Säg hej till en vän",
          "scene": "Roboten vill skriva något vänligt.",
          "clues": [
            "Meddelandet börjar med en hälsning.",
            "Det innehåller också en fråga."
          ],
          "choices": [
            "Hej! Jag tänker på dig.",
            "Hej! Hur mår du?",
            "Kan du skicka en bild?"
          ],
          "answer": 1,
          "wrong": [
            "Det börjar med hej, men ingen fråga följer.",
            null,
            "Här finns en fråga, men ingen hälsning."
          ],
          "why": "Hej! Hur mår du? är både en hälsning och en fråga."
        },
        {
          "title": "Skicka meddelandet",
          "scene": "På robotens panel finns tre knappar.",
          "clues": [
            "På knappen står SKICKA.",
            "En stjärna finns bredvid ordet."
          ],
          "choices": [
            "SKICKA med en måne.",
            "SPARA med en stjärna.",
            "SKICKA med en stjärna."
          ],
          "answer": 2,
          "wrong": [
            "Ordet stämmer, men symbolen är en måne.",
            "Stjärnan stämmer, men det står SPARA.",
            null
          ],
          "why": "Knappen är märkt SKICKA och har en stjärna."
        }
      ],
      "group": "explore"
    },
    {
      "id": "jungle",
      "emoji": "🌿",
      "title": "Djungelns gömda bibliotek",
      "intro": "En papegoja har berättat om ett läshus bland träden. Följ ledtrådarna dit!",
      "ending": "Du hittar läshuset bakom träden. Där väntar sagor för alla skogens vänner.",
      "keepsake": {
        "emoji": "📗",
        "name": "Djungelns sagobok"
      },
      "stages": [
        {
          "title": "Fågelns teckning",
          "scene": "Papegojan visar var stigen börjar.",
          "clues": [
            "Här växer ett stort träd.",
            "Bredvid trädet står en träskylt."
          ],
          "choices": [
            "Stort träd med en träskylt.",
            "Stort träd utan skylt.",
            "Liten buske med en träskylt."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Trädet finns, men skylten saknas.",
            "Skylten finns, men inget stort träd."
          ],
          "why": "Stigen börjar vid det stora trädet med skylten."
        },
        {
          "title": "Över bäcken",
          "scene": "En lapp beskriver vägen till läshuset.",
          "clues": [
            "Vägen leder över en bäck.",
            "Det finns ett räcke att hålla i."
          ],
          "choices": [
            "Stenar över bäcken utan räcke.",
            "En gångbro över bäcken med räcke.",
            "En trappa med räcke, utan bäck."
          ],
          "answer": 1,
          "wrong": [
            "Vägen går över bäcken, men räcket saknas.",
            null,
            "Räcket finns, men vägen går inte över bäcken."
          ],
          "why": "Gångbron har räcke och leder över bäcken."
        },
        {
          "title": "Läshuset",
          "scene": "Tre små hus ligger nära stigen.",
          "clues": [
            "På huset finns en bild av en bok.",
            "En lampa hänger vid dörren."
          ],
          "choices": [
            "Bokbild men ingen lampa.",
            "Lampa men en bild av en sol.",
            "Bokbild och en lampa vid dörren."
          ],
          "answer": 2,
          "wrong": [
            "Bokbilden stämmer, men lampan saknas.",
            "Lampan stämmer, men bilden är en sol.",
            null
          ],
          "why": "Huset med bokbilden och lampan är läshuset."
        }
      ],
      "group": "explore"
    },
    {
      "id": "heroes",
      "emoji": "🦸",
      "title": "Superhjältarnas hjälpuppdrag",
      "intro": "Superhjältar behöver inte slåss. I dag ska de lyssna och hjälpa till!",
      "ending": "Alla hjälper varandra. Dagens viktigaste superkraft var att samarbeta.",
      "keepsake": {
        "emoji": "💛",
        "name": "Hjältemärket"
      },
      "stages": [
        {
          "title": "Vem behöver hjälp?",
          "scene": "Du ser tre meddelanden. Vilken vän vill få hjälp att hitta hem?",
          "clues": [
            "Vännen ber om hjälp.",
            "Det handlar om att hitta hem."
          ],
          "choices": [
            "Kan någon hjälpa mig att hitta hem?",
            "Kan någon hjälpa mig med läxan?",
            "Jag hittade hem helt själv."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Vännen ber om hjälp, men inte med vägen hem.",
            "Det handlar om hemmet, men ingen ber om hjälp."
          ],
          "why": "Vännen ber om hjälp med att hitta hem."
        },
        {
          "title": "En trygg väg",
          "scene": "På kartan finns tre vägar till biblioteket.",
          "clues": [
            "Vägen har ett övergångsställe.",
            "Den leder till biblioteket."
          ],
          "choices": [
            "Övergångsställe på vägen till parken.",
            "Väg till biblioteket med övergångsställe.",
            "Väg till biblioteket utan övergångsställe."
          ],
          "answer": 1,
          "wrong": [
            "Övergångsstället finns, men vägen går till parken.",
            null,
            "Biblioteket är rätt mål, men övergångsstället saknas."
          ],
          "why": "Vägen leder till biblioteket via ett övergångsställe."
        },
        {
          "title": "Samarbeta",
          "scene": "Vännen behöver få med sig sina böcker.",
          "clues": [
            "Två vänner hjälper till.",
            "De bär böcker tillsammans."
          ],
          "choices": [
            "Två vänner hjälper varandra att bära en väska.",
            "En vän bär alla böcker själv.",
            "Två vänner bär böckerna tillsammans."
          ],
          "answer": 2,
          "wrong": [
            "Två vänner hjälper till, men de bär inte böckerna.",
            "Böckerna bärs, men bara av en person.",
            null
          ],
          "why": "Två vänner bär böckerna tillsammans."
        }
      ],
      "group": "fantasy"
    },
    {
      "id": "pyramid",
      "emoji": "🏺",
      "title": "Pyramidens stjärnhemlighet",
      "intro": "På museet finns en lekutställning om det gamla Egypten. Lös gåtorna utan att röra de äkta föremålen.",
      "ending": "På utställningens sista vägg syns en stjärnhimmel. Du löste gåtorna och skyddade museets fynd.",
      "keepsake": {
        "emoji": "✨",
        "name": "Stjärnnyckeln"
      },
      "stages": [
        {
          "title": "Museets karta",
          "scene": "Guiden söker en karta med två särskilda detaljer.",
          "clues": [
            "Kartan visar en pyramid.",
            "En blå stjärna finns bredvid."
          ],
          "choices": [
            "Pyramid med en blå stjärna.",
            "Pyramid med en röd stjärna.",
            "Hus med en blå stjärna."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Pyramiden stämmer, men stjärnan är röd.",
            "Stjärnan är blå, men kartan visar ett hus."
          ],
          "why": "Kartan visar en pyramid och en blå stjärna."
        },
        {
          "title": "Bilderna på väggen",
          "scene": "Tre skyltar har olika bilder.",
          "clues": [
            "Bilden visar en sol.",
            "Tre streck finns under bilden."
          ],
          "choices": [
            "Sol med två streck.",
            "Sol med tre streck.",
            "Måne med tre streck."
          ],
          "answer": 1,
          "wrong": [
            "Solen stämmer, men det är bara två streck.",
            null,
            "Tre streck stämmer, men bilden är en måne."
          ],
          "why": "Skylten visar en sol med tre streck."
        },
        {
          "title": "Den sista montern",
          "scene": "Du hittar tre montrar. Vilken söker guiden?",
          "clues": [
            "Montern är av glas.",
            "En text bredvid handlar om stjärnor."
          ],
          "choices": [
            "Glasmonter med text om blommor.",
            "Trämonter med text om stjärnor.",
            "Glasmonter med text om stjärnor."
          ],
          "answer": 2,
          "wrong": [
            "Glaset stämmer, men texten handlar om blommor.",
            "Texten stämmer, men montern är av trä.",
            null
          ],
          "why": "Det finns både glas och en text om stjärnor."
        }
      ],
      "group": "explore"
    },
    {
      "id": "hotel",
      "emoji": "🏨",
      "title": "Hotell Månskens hemliga paket",
      "intro": "På sagohotellet har ett välkomstpaket kommit på villovägar. Hjälp receptionisten hitta rätt.",
      "ending": "Paketet kommer fram till rätt rum. Receptionisten tackar för att du jämförde alla ledtrådar.",
      "keepsake": {
        "emoji": "🛎️",
        "name": "Hotellklockan"
      },
      "stages": [
        {
          "title": "En skylt i lobbyn",
          "scene": "Receptionisten söker en plats där första ledtråden ligger.",
          "clues": [
            "Där finns en klocka på disken.",
            "Ovanför hänger en skylt med en måne."
          ],
          "choices": [
            "En disk med klocka under en månskylt.",
            "En disk med klocka under en solskylt.",
            "En månskylt över ett bord utan klocka."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Klockan finns, men skylten visar en sol.",
            "Månskylten finns, men klockan saknas."
          ],
          "why": "Både klockan och månskylten finns vid samma disk."
        },
        {
          "title": "Paketets etikett",
          "scene": "Du hittar tre paket. Vilket hör till rätt rum?",
          "clues": [
            "På paketet står rum 12.",
            "En grön stjärna finns bredvid numret."
          ],
          "choices": [
            "Rum 12 med en blå stjärna.",
            "Rum 12 med en grön stjärna.",
            "Rum 14 med en grön stjärna."
          ],
          "answer": 1,
          "wrong": [
            "Rumsnumret stämmer, men stjärnan är blå.",
            null,
            "Stjärnan är grön, men numret är 14."
          ],
          "why": "Etiketten visar både rum 12 och en grön stjärna."
        },
        {
          "title": "Rätt plats för paketet",
          "scene": "Tre hyllor står i korridoren. Var ska paketet lämnas?",
          "clues": [
            "Hyllan står vid ett runt fönster.",
            "En blomma står på hyllan."
          ],
          "choices": [
            "Runt fönster, men ingen blomma på hyllan.",
            "Blomma på hyllan, men fönstret är fyrkantigt.",
            "Runt fönster och en blomma på hyllan."
          ],
          "answer": 2,
          "wrong": [
            "Fönstret är runt, men blomman saknas.",
            "Blomman finns, men fönstret är fyrkantigt.",
            null
          ],
          "why": "Hyllan står vid det runda fönstret och har en blomma."
        }
      ],
      "group": "mystery"
    },
    {
      "id": "underwater",
      "emoji": "🐠",
      "title": "Ubåtens borttappade sjökarta",
      "intro": "Ubåten Blåbubbla utforskar en sagohavsvik. Hjälp besättningen hitta vägen på kartan.",
      "ending": "Kartan är tillbaka i styrhytten. Nu kan besättningen fortsätta titta på havets djur på håll.",
      "keepsake": {
        "emoji": "🫧",
        "name": "Havsbubblan"
      },
      "stages": [
        {
          "title": "En boj i viken",
          "scene": "Sjökartan visar var ubåten ska börja leta.",
          "clues": [
            "En gul boj flyter i vattnet.",
            "Bakom bojen syns en hög klippa."
          ],
          "choices": [
            "Gul boj framför en hög klippa.",
            "Gul boj framför en sandstrand.",
            "Röd boj framför en hög klippa."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Bojen är gul, men klippan saknas.",
            "Klippan finns, men bojen är röd."
          ],
          "why": "En gul boj flyter framför den höga klippan."
        },
        {
          "title": "Anteckningen om fiskarna",
          "scene": "Tre teckningar visar olika platser under vattnet.",
          "clues": [
            "Flera små fiskar simmar tillsammans.",
            "Här växer koraller under vattnet."
          ],
          "choices": [
            "Flera fiskar nära en stor sten utan koraller.",
            "Flera små fiskar ovanför koraller.",
            "Koraller utan fiskar under en båt."
          ],
          "answer": 1,
          "wrong": [
            "Fiskarna simmar tillsammans, men koraller saknas.",
            null,
            "Korallerna finns, men inga små fiskar simmar där."
          ],
          "why": "Fiskarna simmar tillsammans ovanför korallerna."
        },
        {
          "title": "Tillbaka till ubåten",
          "scene": "En bild visar vilken markering som leder hem.",
          "clues": [
            "Markeringen är formad som en pil.",
            "Pilen pekar mot en blå cirkel."
          ],
          "choices": [
            "Pil mot en grön cirkel.",
            "Blå cirkel med en rak linje.",
            "Pil som pekar mot en blå cirkel."
          ],
          "answer": 2,
          "wrong": [
            "Det är en pil, men cirkeln är grön.",
            "Cirkeln är blå, men där finns ingen pil.",
            null
          ],
          "why": "Pilen pekar mot den blå cirkeln på kartan."
        }
      ],
      "group": "explore"
    },
    {
      "id": "animal-park",
      "emoji": "🐸",
      "title": "Djurparkens försvunna spårbok",
      "intro": "Djurskötaren saknar sin anteckningsbok. Du får följa skyltarna utan att störa djuren.",
      "ending": "Anteckningsboken låg vid rätt informationsskylt. Djurskötaren kan fortsätta ta hand om djuren.",
      "keepsake": {
        "emoji": "🐾",
        "name": "Djurskötarmärket"
      },
      "stages": [
        {
          "title": "Den lilla dammen",
          "scene": "En lapp beskriver var skötaren senast stod.",
          "clues": [
            "Här finns en liten damm.",
            "En stor näckros syns på vattnet."
          ],
          "choices": [
            "Liten damm med en stor näckros.",
            "Liten damm utan näckros.",
            "Stor näckros i ett fat utan damm."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Dammen finns, men näckrosen saknas.",
            "Näckrosen finns, men ingen damm."
          ],
          "why": "Den stora näckrosen flyter i den lilla dammen."
        },
        {
          "title": "Skyltarna vid stigen",
          "scene": "Vilken skylt kan visa var djuren får vila i fred?",
          "clues": [
            "Skylten handlar om grodor.",
            "Där står orden Vila här."
          ],
          "choices": [
            "Grodor – Matplats.",
            "Grodor – Vila här.",
            "Fåglar – Vila här."
          ],
          "answer": 1,
          "wrong": [
            "Grodorna nämns, men skylten gäller matplatsen.",
            null,
            "Det står Vila här, men skylten gäller fåglar."
          ],
          "why": "Skylten berättar både om grodor och deras viloplats."
        },
        {
          "title": "Hitta spårboken",
          "scene": "Tre hyllor står i skötarens arbetsrum.",
          "clues": [
            "På hyllan ligger en grön anteckningsbok.",
            "Bredvid står en kikare."
          ],
          "choices": [
            "Grön anteckningsbok, men ingen kikare.",
            "Kikare bredvid en blå anteckningsbok.",
            "Grön anteckningsbok bredvid en kikare."
          ],
          "answer": 2,
          "wrong": [
            "Boken är grön, men kikaren saknas.",
            "Kikaren finns, men boken är blå.",
            null
          ],
          "why": "Den gröna boken ligger bredvid kikaren."
        }
      ],
      "group": "explore"
    },
    {
      "id": "magic-exam",
      "emoji": "📜",
      "title": "Ordmagins vänliga examensprov",
      "intro": "I sagoskolan är det dags att visa vad man lärt sig om ord, bilder och ledtrådar.",
      "ending": "Du har klarat sagoskolans prov på ditt eget sätt. Läraren ger dig en bokmärkesmedalj.",
      "keepsake": {
        "emoji": "🎓",
        "name": "Ordmagiintyget"
      },
      "stages": [
        {
          "title": "Hitta klassrummet",
          "scene": "Skolans magiska schema beskriver ett rum.",
          "clues": [
            "På dörren finns en bokbild.",
            "Ett lila band hänger på handtaget."
          ],
          "choices": [
            "Bokbild på dörren med lila band.",
            "Bokbild på dörren med gult band.",
            "Lila band på dörren med månbild."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Bokbilden finns, men bandet är gult.",
            "Bandet är lila, men bilden visar en måne."
          ],
          "why": "Både bokbilden och det lila bandet visar rätt rum."
        },
        {
          "title": "Ordet i sagan",
          "scene": "Läraren säger: Välj ordet för något som lyser och visar vägen.",
          "clues": [
            "Ordet beskriver något som lyser.",
            "Det hjälper någon att hitta rätt."
          ],
          "choices": [
            "En stjärna kan lysa långt borta.",
            "En lykta kan lysa och visa vägen.",
            "En karta visar vägen utan att lysa."
          ],
          "answer": 1,
          "wrong": [
            "Stjärnan lyser, men beskrivs inte som vägvisare här.",
            null,
            "Kartan visar vägen, men lyser inte av sig själv."
          ],
          "why": "Lyktan ger ljus och hjälper någon att hitta rätt."
        },
        {
          "title": "Det sista bokmärket",
          "scene": "Tre bokmärken ligger på bordet.",
          "clues": [
            "Det finns en sol på bokmärket.",
            "Under solen står ordet KLAR."
          ],
          "choices": [
            "Sol och ordet START.",
            "Måne och ordet KLAR.",
            "Sol och ordet KLAR."
          ],
          "answer": 2,
          "wrong": [
            "Solen stämmer, men ordet är START.",
            "Ordet KLAR stämmer, men bilden visar en måne.",
            null
          ],
          "why": "Bokmärket har både en sol och ordet KLAR."
        }
      ],
      "group": "fantasy"
    },
    {
      "id": "spy-school",
      "emoji": "🕵️",
      "title": "Kodskolans första agentuppdrag",
      "intro": "I Kodskolan tränar unga agenter på att läsa hemliga meddelanden och samarbeta.",
      "ending": "Du får din agentbok med plats för fler egna gåtor. Uppdraget är löst utan stress.",
      "keepsake": {
        "emoji": "📨",
        "name": "Kodkuvertet"
      },
      "stages": [
        {
          "title": "Rätt agentkort",
          "scene": "Tre kort ligger på bordet.",
          "clues": [
            "På kortet finns en triangel.",
            "Nedanför står numret 5."
          ],
          "choices": [
            "Triangel med siffran 5.",
            "Triangel med siffran 9.",
            "Cirkel med siffran 5."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Triangeln finns, men numret är 9.",
            "Numret är 5, men formen är en cirkel."
          ],
          "why": "Kortet har en triangel och siffran 5."
        },
        {
          "title": "Hemliga alfabetet",
          "scene": "Agentchefen visar tre kort med ord.",
          "clues": [
            "Ordet börjar med bokstaven S.",
            "Ordet slutar med bokstaven K."
          ],
          "choices": [
            "SOL börjar med S men slutar på L.",
            "SÖK börjar med S och slutar med K.",
            "TAK slutar på K men börjar med T."
          ],
          "answer": 1,
          "wrong": [
            "Ordet börjar på S, men slutar på L.",
            null,
            "Ordet slutar på K, men börjar på T."
          ],
          "why": "Ordet SÖK börjar med S och slutar med K."
        },
        {
          "title": "Meddelandets gömställe",
          "scene": "En lapp beskriver vilket skåp som innehåller svaret.",
          "clues": [
            "Skåpet är grönt.",
            "En vit stjärna sitter på dörren."
          ],
          "choices": [
            "Grönt skåp med en måne.",
            "Blått skåp med en vit stjärna.",
            "Grönt skåp med en vit stjärna."
          ],
          "answer": 2,
          "wrong": [
            "Färgen stämmer, men bilden är en måne.",
            "Stjärnan stämmer, men skåpet är blått.",
            null
          ],
          "why": "Det gröna skåpet har en vit stjärna."
        }
      ],
      "group": "mystery"
    },
    {
      "id": "space-exit",
      "emoji": "🛰️",
      "title": "Rymdbasens hemliga utgång",
      "intro": "En stjärnkarta har gömts i rymdbasens gångar. Hitta vägen till observationsrummet.",
      "ending": "Du hittar kartan i observationsrummet. Nu kan ni titta på stjärnorna tillsammans.",
      "keepsake": {
        "emoji": "🔭",
        "name": "Stjärnkikaren"
      },
      "stages": [
        {
          "title": "Korridorens karta",
          "scene": "En bild visar vilken korridor som leder till nästa rum.",
          "clues": [
            "På väggen finns en röd pil.",
            "Under pilen sitter en rund lampa."
          ],
          "choices": [
            "Röd pil med rund lampa under.",
            "Röd pil med fyrkantig lampa.",
            "Blå pil med rund lampa under."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Pilen är röd, men lampan är fyrkantig.",
            "Lampan är rund, men pilen är blå."
          ],
          "why": "Den röda pilen har en rund lampa under sig."
        },
        {
          "title": "Låset utan nedräkning",
          "scene": "Ett vänligt sifferlås visar olika koder.",
          "clues": [
            "Första siffran är 2.",
            "Sista siffran är 6."
          ],
          "choices": [
            "Koden 2–4–8.",
            "Koden 2–4–6.",
            "Koden 8–4–6."
          ],
          "answer": 1,
          "wrong": [
            "Den börjar med 2, men slutar med 8.",
            null,
            "Den slutar med 6, men börjar med 8."
          ],
          "why": "Koden 2–4–6 börjar och slutar rätt."
        },
        {
          "title": "Observationsrummet",
          "scene": "Tre dörrar har olika märken.",
          "clues": [
            "Dörren har ett fönster.",
            "En liten stjärna finns på dörren."
          ],
          "choices": [
            "Fönster med måne på glaset.",
            "Stjärna på en dörr utan fönster.",
            "Fönster med en stjärna på glaset."
          ],
          "answer": 2,
          "wrong": [
            "Fönstret finns, men bilden visar en måne.",
            "Stjärnan finns, men dörren saknar fönster.",
            null
          ],
          "why": "Stjärnan sitter på glaset i dörrens fönster."
        }
      ],
      "group": "explore"
    },
    {
      "id": "friendly-house",
      "emoji": "🏚️",
      "title": "Prasselhusets försvunna inbjudan",
      "intro": "I ett gammalt sagohus planerar vänliga spöken ett kalas. Någon har lagt inbjudan på fel plats.",
      "ending": "Inbjudan hittas vid rätt fönster. De vänliga spökena kan ordna sitt festliga tebjudning.",
      "keepsake": {
        "emoji": "✉️",
        "name": "Spökinbjudan"
      },
      "stages": [
        {
          "title": "Trappans tecken",
          "scene": "En lapp berättar var du ska börja.",
          "clues": [
            "Trappan har ett rött räcke.",
            "Längst ned står en lykta."
          ],
          "choices": [
            "Rött räcke och lykta vid trappan.",
            "Rött räcke men ingen lykta.",
            "Lykta vid trappan med blått räcke."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Räcket är rött, men lyktan saknas.",
            "Lyktan finns, men räcket är blått."
          ],
          "why": "Trappan har ett rött räcke och en lykta."
        },
        {
          "title": "Ett snällt ljud",
          "scene": "En vän berättar vilket ljud som hördes från rummet.",
          "clues": [
            "Ljudet var svagt.",
            "Det kom från en liten bjällra."
          ],
          "choices": [
            "Svag vind som susar genom en springa.",
            "Ett svagt pling från en bjällra.",
            "Ett högt pling från en bjällra."
          ],
          "answer": 1,
          "wrong": [
            "Ljudet är svagt, men kommer inte från bjällran.",
            null,
            "Bjällran hörs, men ljudet är högt."
          ],
          "why": "Den lilla bjällran ger ifrån sig ett svagt pling."
        },
        {
          "title": "Inbjudans plats",
          "scene": "Tre fönster vetter mot trädgården.",
          "clues": [
            "Fönstret har gröna gardiner.",
            "Ett kuvert ligger på fönsterbrädan."
          ],
          "choices": [
            "Gröna gardiner utan kuvert.",
            "Kuvert vid ett fönster med gula gardiner.",
            "Gröna gardiner och ett kuvert på fönsterbrädan."
          ],
          "answer": 2,
          "wrong": [
            "Gardinerna är gröna, men kuvertet saknas.",
            "Kuvertet finns, men gardinerna är gula.",
            null
          ],
          "why": "Inbjudan ligger i fönstret med gröna gardiner."
        }
      ],
      "group": "fantasy"
    },
    {
      "id": "crystal-case",
      "emoji": "💎",
      "title": "Museets försvunna glaskristall",
      "intro": "En glittrande glaskristall har flyttats från sin plats på museet. Hjälp guiden att hitta den utan att röra samlingen.",
      "ending": "Guiden hittar kristallen tryggt i rätt vitrinskåp. Nu kan alla besökare se den igen.",
      "keepsake": {
        "emoji": "🔷",
        "name": "Kristallmärket"
      },
      "stages": [
        {
          "title": "Monterns etikett",
          "scene": "Guiden läser en gammal etikett.",
          "clues": [
            "På etiketten finns en diamantform.",
            "Bredvid står ordet GLAS."
          ],
          "choices": [
            "Diamantform bredvid ordet GLAS.",
            "Diamantform bredvid ordet STEN.",
            "Hjärtform bredvid ordet GLAS."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Formen stämmer, men ordet är STEN.",
            "Ordet GLAS finns, men bilden visar ett hjärta."
          ],
          "why": "Etiketten har diamantformen och ordet GLAS."
        },
        {
          "title": "Vaktmästarens lapp",
          "scene": "En lapp beskriver vart kristallen flyttades.",
          "clues": [
            "Skåpet står vid en pelare.",
            "Skåpet har ett blått lås."
          ],
          "choices": [
            "Skåp vid pelare med rött lås.",
            "Skåp vid pelare med blått lås.",
            "Skåp vid fönster med blått lås."
          ],
          "answer": 1,
          "wrong": [
            "Pelaren finns, men låset är rött.",
            null,
            "Låset är blått, men skåpet står vid ett fönster."
          ],
          "why": "Skåpet med blått lås står vid pelaren."
        },
        {
          "title": "Rätt glaslåda",
          "scene": "Tre små glaslådor står på hyllan.",
          "clues": [
            "Lådan har en stjärna på locket.",
            "Under lådan ligger en grön duk."
          ],
          "choices": [
            "Stjärna på lock med blå duk.",
            "Grön duk under låda med cirkel på locket.",
            "Stjärna på locket och grön duk under."
          ],
          "answer": 2,
          "wrong": [
            "Stjärnan stämmer, men duken är blå.",
            "Duken är grön, men locket har en cirkel.",
            null
          ],
          "why": "Glaslådan har en stjärna på locket och en grön duk."
        }
      ],
      "group": "mystery"
    },
    {
      "id": "ninja",
      "emoji": "🥷",
      "title": "Ninjaklubbens kartutmaning",
      "intro": "Ninjaklubben tränar hjärnan med banor på papper. Visa att du kan läsa två spår på samma gång.",
      "ending": "Du har löst kartorna med eftertanke. Ninjaklubben ger dig ett bokmärke för kloka val.",
      "keepsake": {
        "emoji": "🎗️",
        "name": "Ninjabokmärket"
      },
      "stages": [
        {
          "title": "Den hemliga stigen",
          "scene": "En tecknad bana visar tre olika vägar.",
          "clues": [
            "Vägen går förbi en bro.",
            "På vägen finns också ett stort träd."
          ],
          "choices": [
            "Bro följd av ett stort träd.",
            "Bro följd av en liten sten.",
            "Stort träd efter ett hus utan bro."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Bron finns, men trädet saknas.",
            "Trädet finns, men vägen går inte över en bro."
          ],
          "why": "Vägen går över bron och fortsätter till trädet."
        },
        {
          "title": "Balansmärket",
          "scene": "Tre kort visar ninjaklubbens symboler.",
          "clues": [
            "Märket är fyrkantigt.",
            "Inuti finns två små prickar."
          ],
          "choices": [
            "Fyrkant med en prick.",
            "Fyrkant med två prickar.",
            "Cirkel med två prickar."
          ],
          "answer": 1,
          "wrong": [
            "Märket är fyrkantigt, men har bara en prick.",
            null,
            "Det är två prickar, men formen är rund."
          ],
          "why": "Det fyrkantiga märket har två prickar."
        },
        {
          "title": "Sista meddelandet",
          "scene": "Ninjaläraren berättar hur klassen kan arbeta tillsammans.",
          "clues": [
            "Två personer hjälps åt.",
            "De bär böcker tillsammans."
          ],
          "choices": [
            "Två vänner hjälps åt att bära en låda.",
            "En vän bär böcker själv.",
            "Två vänner bär böcker tillsammans."
          ],
          "answer": 2,
          "wrong": [
            "De hjälps åt, men de bär en låda och inte böcker.",
            "Böckerna bärs, men bara en person hjälper till.",
            null
          ],
          "why": "Båda vännerna hjälps åt att bära böckerna tillsammans."
        }
      ],
      "group": "creative"
    },
    {
      "id": "circus",
      "emoji": "🎪",
      "title": "Cirkusens försvunna finalbiljett",
      "intro": "På den vänliga cirkusen behöver artisterna hitta biljetten som berättar vilket nummer som kommer sist.",
      "ending": "Cirkusen hittar biljetten och alla kan njuta av finalnumret med ringar och färgglada band.",
      "keepsake": {
        "emoji": "🎟️",
        "name": "Finalbiljetten"
      },
      "stages": [
        {
          "title": "Rätt cirkustält",
          "scene": "En teckning visar tältet där biljetten senast sågs.",
          "clues": [
            "Tältet har röda ränder.",
            "En stor stjärna sitter över ingången."
          ],
          "choices": [
            "Rödrandigt tält med stjärna över dörren.",
            "Rödrandigt tält med en måne över dörren.",
            "Blårandigt tält med stjärna över dörren."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Ränderna stämmer, men bilden är en måne.",
            "Stjärnan finns, men ränderna är blå."
          ],
          "why": "Tältet har röda ränder och en stjärna över ingången."
        },
        {
          "title": "Artisternas ordning",
          "scene": "Tre lappar beskriver när olika nummer ska visas.",
          "clues": [
            "Jongleringen kommer först.",
            "Ringkastningen kommer sist."
          ],
          "choices": [
            "Jonglering, ringkastning, musik.",
            "Jonglering, musik, ringkastning.",
            "Musik, jonglering, ringkastning."
          ],
          "answer": 1,
          "wrong": [
            "Jongleringen är först, men ringkastningen är inte sist.",
            null,
            "Ringkastningen är sist, men jongleringen är inte först."
          ],
          "why": "Jongleringen ligger först och ringkastningen sist."
        },
        {
          "title": "Hitta finalbiljetten",
          "scene": "Tre biljetter ligger i en ask.",
          "clues": [
            "På biljetten står det FINAL.",
            "Den har ett gult band i hörnet."
          ],
          "choices": [
            "FINAL med grönt band.",
            "START med gult band.",
            "FINAL med gult band."
          ],
          "answer": 2,
          "wrong": [
            "Ordet FINAL stämmer, men bandet är grönt.",
            "Bandet är gult, men ordet är START.",
            null
          ],
          "why": "Biljetten har ordet FINAL och ett gult band."
        }
      ],
      "group": "creative"
    },
    {
      "id": "neon",
      "emoji": "🌈",
      "title": "Ljusverkstadens färghemlighet",
      "intro": "Konstnären Iris har ritat ett sagorum med lysande färger. Hjälp henne hitta teckningarna till utställningen.",
      "ending": "Alla bilder är på rätt plats. Ljusverkstadens fantasigalleri är redo för en färgglad öppning.",
      "keepsake": {
        "emoji": "🎨",
        "name": "Färgspiralen"
      },
      "stages": [
        {
          "title": "Den lysande skylten",
          "scene": "Iris söker en bild som hör till utställningens början.",
          "clues": [
            "På bilden finns en grön våg.",
            "Tre gula prickar ligger ovanför vågen."
          ],
          "choices": [
            "Grön våg med tre gula prickar ovanför.",
            "Grön våg med två gula prickar ovanför.",
            "Blå våg med tre gula prickar ovanför."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Vågen är grön, men prickarna är bara två.",
            "Prickarna stämmer, men vågen är blå."
          ],
          "why": "Både den gröna vågen och de tre gula prickarna finns där."
        },
        {
          "title": "Måla med ord",
          "scene": "Iris ska märka upp tre teckningar. Vilken lapp passar bilden?",
          "clues": [
            "På bilden syns en lampa.",
            "Under bilden står ordet BLINKAR."
          ],
          "choices": [
            "En lampa med texten STILLA.",
            "En lampa med texten BLINKAR.",
            "En måne med texten BLINKAR."
          ],
          "answer": 1,
          "wrong": [
            "Lampan finns, men på lappen står STILLA.",
            null,
            "Ordet BLINKAR stämmer, men bilden visar en måne."
          ],
          "why": "Teckningen visar en lampa och under den står ordet BLINKAR."
        },
        {
          "title": "Galleriets sista tavla",
          "scene": "Tre tavlor väntar på väggen.",
          "clues": [
            "Tavlan har en svart ram.",
            "Mitt på bilden finns en gul stjärna."
          ],
          "choices": [
            "Svart ram med ett gult hjärta.",
            "Vit ram med en gul stjärna.",
            "Svart ram med en gul stjärna."
          ],
          "answer": 2,
          "wrong": [
            "Ramen är svart, men bilden visar ett hjärta.",
            "Stjärnan är gul, men ramen är vit.",
            null
          ],
          "why": "Tavlan har svart ram och en gul stjärna på samma bild."
        }
      ],
      "group": "creative"
    },
    {
      "id": "baking",
      "emoji": "🧁",
      "title": "Bakverkstadens hemliga recept",
      "intro": "Tre vänner ska dekorera fantasibakelser till kalaset. Receptkortet har hamnat bland andra lappar.",
      "ending": "Vännerna hittar receptet och dekorerar sina låtsasbakelser. Alla får visa sin egen idé.",
      "keepsake": {
        "emoji": "🍰",
        "name": "Receptstjärnan"
      },
      "stages": [
        {
          "title": "Hitta receptkortet",
          "scene": "På bordet finns tre kort med olika bilder.",
          "clues": [
            "På kortet finns en jordgubbe.",
            "Under bilden står ordet KAKA."
          ],
          "choices": [
            "Jordgubbe och ordet KAKA.",
            "Jordgubbe och ordet BRÖD.",
            "Körsbär och ordet KAKA."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Jordgubben finns, men ordet är BRÖD.",
            "Ordet KAKA finns, men bilden visar ett körsbär."
          ],
          "why": "Rätt kort har en jordgubbe och ordet KAKA."
        },
        {
          "title": "Vilken ordning?",
          "scene": "Vännerna ska dekorera en bild av en bakelse.",
          "clues": [
            "Först målar de glasyren.",
            "Sist ritar de ett bär ovanpå."
          ],
          "choices": [
            "Glasyr, bär, tallrik.",
            "Glasyr, tallrik, bär.",
            "Tallrik, glasyr, bär."
          ],
          "answer": 1,
          "wrong": [
            "Glasyren kommer först, men bäret hamnar inte sist.",
            null,
            "Bäret är sist, men glasyren kommer inte först."
          ],
          "why": "Glasyren ritas först och bäret sist, precis som på kortet."
        },
        {
          "title": "Kalasets fat",
          "scene": "Tre fat står på bordet. Vilket är till de färdiga bilderna?",
          "clues": [
            "Fatet är blått.",
            "På kanten finns fyra små stjärnor."
          ],
          "choices": [
            "Blått fat med tre stjärnor.",
            "Grönt fat med fyra stjärnor.",
            "Blått fat med fyra stjärnor."
          ],
          "answer": 2,
          "wrong": [
            "Fatet är blått, men stjärnorna är tre.",
            "Stjärnorna är fyra, men fatet är grönt.",
            null
          ],
          "why": "Fatet är blått och har fyra små stjärnor på kanten."
        }
      ],
      "group": "creative"
    },
    {
      "id": "world-postcards",
      "emoji": "🌍",
      "title": "Vykortens resa runt jorden",
      "intro": "En resande berättare har blandat ihop sina vykort. Följ deras spår genom fjäll, öar och städer i fantasin.",
      "ending": "Vykorten ligger i rätt ordning i albumet. Nu kan du hitta på ett eget vykort till någon du tycker om.",
      "keepsake": {
        "emoji": "🗺️",
        "name": "Vykortspasset"
      },
      "stages": [
        {
          "title": "Vykortet från bergen",
          "scene": "På en lapp finns två detaljer från resan.",
          "clues": [
            "Här finns snö på en hög bergstopp.",
            "På platsen finns också en klar sjö."
          ],
          "choices": [
            "Snöigt berg med en klar sjö nedanför.",
            "Snöigt berg ovanför en grön äng utan sjö.",
            "Klar sjö nedanför en låg sandkulle."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Berget har snö, men ingen sjö ligger nedanför.",
            "Sjön finns, men inte den snöiga bergstoppen."
          ],
          "why": "Bergstoppen har snö och nedanför ligger en klar sjö."
        },
        {
          "title": "Vykortet från ön",
          "scene": "Nästa kort visar en plats vid havet.",
          "clues": [
            "Här finns en liten fyr.",
            "Platsen är en ö omgiven av hav."
          ],
          "choices": [
            "Fyr på en kulle långt från vatten.",
            "En liten fyr på en ö omgiven av hav.",
            "En ö i havet med ett träd, men utan fyr."
          ],
          "answer": 1,
          "wrong": [
            "Fyren finns, men platsen ligger inte i havet.",
            null,
            "Ön ligger i havet, men fyren saknas."
          ],
          "why": "Den lilla fyren står på ön som omges av hav."
        },
        {
          "title": "Berättarens sista kort",
          "scene": "På sista kortet finns en stad från sagan.",
          "clues": [
            "På torget finns en fontän.",
            "Där finns också ett stort träd."
          ],
          "choices": [
            "Fontän på torg utan något träd.",
            "Stort träd bredvid ett torg utan fontän.",
            "Fontän på torg med ett stort träd bredvid."
          ],
          "answer": 2,
          "wrong": [
            "Torget har fontän, men inget träd står bredvid.",
            "Trädet finns, men torget saknar fontän.",
            null
          ],
          "why": "På torget finns både fontänen och det stora trädet."
        }
      ],
      "group": "explore"
    },
    {
      "id": "blocks",
      "emoji": "🧱",
      "title": "Blockbyggarnas fantasistad",
      "intro": "I Byggarnas värld bygger vännerna ett bibliotek av färgade klossar. Hjälp dem läsa byggplanen.",
      "ending": "Biblioteket är färdigt av klossar! Alla kan gå in i sagan och hitta på nya berättelser.",
      "keepsake": {
        "emoji": "🏗️",
        "name": "Byggmästarmärket"
      },
      "stages": [
        {
          "title": "Husets första klossar",
          "scene": "Byggplanen visar en trygg start.",
          "clues": [
            "Nedersta raden består av blå klossar.",
            "Ovanpå står en grön kloss."
          ],
          "choices": [
            "Blå klossar underst och grön kloss ovanpå.",
            "Blå klossar underst och röd kloss ovanpå.",
            "Röda klossar underst och grön kloss ovanpå."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Nedersta raden stämmer, men översta klossen är röd.",
            "Klossen ovanpå är grön, men den blå raden saknas."
          ],
          "why": "Blå klossar bildar basen och en grön kloss står ovanpå."
        },
        {
          "title": "Bron till läshuset",
          "scene": "Vännerna ritar tre broar mellan två klosstorn.",
          "clues": [
            "Bron går från ett torn till ett annat.",
            "På bilden syns en blå båge."
          ],
          "choices": [
            "En bro mellan torn utan blå båge.",
            "En bro mellan två torn med blå båge under.",
            "En blå båge står vid ett enda torn."
          ],
          "answer": 1,
          "wrong": [
            "Bron förbinder tornen, men den blå bågen saknas.",
            null,
            "Bågen är blå, men någon bro mellan två torn finns inte."
          ],
          "why": "Bron går mellan två torn och har en blå båge under sig."
        },
        {
          "title": "Bibliotekets tak",
          "scene": "Sista ritningen visar hur taket ska se ut.",
          "clues": [
            "Taket är format som en triangel.",
            "På taket finns en liten gul flagga."
          ],
          "choices": [
            "Triangeltak med grön flagga.",
            "Platt tak med gul flagga.",
            "Triangeltak med gul flagga."
          ],
          "answer": 2,
          "wrong": [
            "Taket har rätt form, men flaggan är grön.",
            "Flaggan är gul, men taket är platt.",
            null
          ],
          "why": "Taket har triangelform och en gul flagga."
        }
      ],
      "group": "creative"
    },
    {
      "id": "creature-friends",
      "emoji": "🐾",
      "title": "Varelsevännernas upptäcktsstig",
      "intro": "I fantasilandet finns vänliga små varelser med olika vanor. Lär känna dem genom att läsa spåren.",
      "ending": "Du har lärt känna tre varelsevänner. De tackar för att du lyssnade och förstod vad de behövde.",
      "keepsake": {
        "emoji": "💚",
        "name": "Vänskapsmärket"
      },
      "stages": [
        {
          "title": "Den blyga lövvännen",
          "scene": "Ett kort berättar hur den lilla lövvännen trivs.",
          "clues": [
            "Varelsen vill sitta i skuggan.",
            "Den tycker om en mjuk filt."
          ],
          "choices": [
            "Skuggig hörna med mjuk filt.",
            "Skuggig hörna med hårt stengolv.",
            "Solig plats med mjuk filt."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Skuggan stämmer, men den mjuka filten saknas.",
            "Filten är mjuk, men platsen är inte skuggig."
          ],
          "why": "Lövvännen får både skugga och en mjuk filt."
        },
        {
          "title": "Den glada molnvännen",
          "scene": "Nästa vän har lämnat en tecknad önskelapp.",
          "clues": [
            "Vännen vill leka med bollar.",
            "Leksakerna ska vara lila."
          ],
          "choices": [
            "Röda bollar på ett lekbord.",
            "Lila bollar på ett lekbord.",
            "Lila kuber på ett lekbord."
          ],
          "answer": 1,
          "wrong": [
            "Det är bollar, men färgen är inte lila.",
            null,
            "Färgen är lila, men formerna är kuber."
          ],
          "why": "Bollarna är både runda och lila, som vännen önskar."
        },
        {
          "title": "Den nyfikna bokvännen",
          "scene": "Den sista varelsen vill hitta sin läsplats.",
          "clues": [
            "Här finns en hylla med böcker.",
            "En liten lykta lyser nära läsplatsen."
          ],
          "choices": [
            "Bokhylla utan lykta.",
            "Lykta bredvid en låda utan böcker.",
            "Bokhylla med en liten lykta bredvid."
          ],
          "answer": 2,
          "wrong": [
            "Böckerna finns, men ingen lykta står där.",
            "Lyktan finns, men det saknas böcker.",
            null
          ],
          "why": "Bokhyllan står bredvid den lilla lyktan."
        }
      ],
      "group": "fantasy"
    },
    {
      "id": "gold-rush",
      "emoji": "🏜️",
      "title": "Guldglittrets gömda karta",
      "intro": "På en sagomarknad finns guldfärgade pappersstjärnor gömda i en lek. Hjälp upptäckarna hitta rätt karta.",
      "ending": "Upptäckarna hittar lådan med glittrande pappersstjärnor. Alla får dela på upptäckarglädjen.",
      "keepsake": {
        "emoji": "⭐",
        "name": "Guldglitterstjärnan"
      },
      "stages": [
        {
          "title": "Kartan vid floden",
          "scene": "Du ser tre tecknade platser vid en sagoflod.",
          "clues": [
            "En bro går över floden.",
            "På ena sidan står en stor kaktus."
          ],
          "choices": [
            "Bro över flod med stor kaktus bredvid.",
            "Bro över flod utan någon kaktus.",
            "Stor kaktus vid en flod utan bro."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Bron finns, men kaktusen saknas.",
            "Kaktusen finns, men ingen bro går över floden."
          ],
          "why": "Bron går över floden och en kaktus står bredvid."
        },
        {
          "title": "Guldvaskarens lapp",
          "scene": "En vuxen visar en teckning av låtsasguld.",
          "clues": [
            "På pappret finns tre gula stjärnor.",
            "En blå cirkel är ritad runt dem."
          ],
          "choices": [
            "Tre gula stjärnor med röd cirkel.",
            "Tre gula stjärnor med blå cirkel.",
            "Två gula stjärnor med blå cirkel."
          ],
          "answer": 1,
          "wrong": [
            "Stjärnorna är tre, men cirkeln är röd.",
            null,
            "Cirkeln är blå, men stjärnorna är bara två."
          ],
          "why": "Tre gula stjärnor finns inuti den blå cirkeln."
        },
        {
          "title": "Lådan på marknaden",
          "scene": "Tre små lådor står på en hylla i lekboden.",
          "clues": [
            "På lådan står det GLITTER.",
            "På locket finns ett grönt hjärta."
          ],
          "choices": [
            "GLITTER med blått hjärta.",
            "PAPPER med grönt hjärta.",
            "GLITTER med grönt hjärta."
          ],
          "answer": 2,
          "wrong": [
            "Texten stämmer, men hjärtat är blått.",
            "Hjärtat är grönt, men texten är PAPPER.",
            null
          ],
          "why": "På rätt låda står GLITTER och locket har ett grönt hjärta."
        }
      ],
      "group": "explore"
    },
    {
      "id": "slime-art",
      "emoji": "🫙",
      "title": "Slemskissernas färgverkstad",
      "intro": "Konstnärerna har målat fantasibilder av mjuka slembollar. Hjälp dem ordna bilderna utan att blanda riktiga kemikalier.",
      "ending": "Alla slembilder är sorterade. Nu kan konstnärerna visa sin fantasifulla samling.",
      "keepsake": {
        "emoji": "🖍️",
        "name": "Slemskissmärket"
      },
      "stages": [
        {
          "title": "Den randiga slembilden",
          "scene": "En av teckningarna ska hänga först.",
          "clues": [
            "Slembollen på bilden är grön.",
            "Den har två rosa ränder."
          ],
          "choices": [
            "Grön slemboll med två rosa ränder.",
            "Grön slemboll med tre rosa ränder.",
            "Blå slemboll med två rosa ränder."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Färgen är grön, men ränderna är tre.",
            "Ränderna stämmer, men slembollen är blå."
          ],
          "why": "Den gröna slembollen har två rosa ränder."
        },
        {
          "title": "Konstnärens färgord",
          "scene": "På nästa lapp står hur den målade slembollen ser ut.",
          "clues": [
            "Färgen ska vara lila.",
            "Den ska ha prickar, inte ränder."
          ],
          "choices": [
            "Lila boll med gula ränder.",
            "Lila boll med gula prickar.",
            "Röd boll med gula prickar."
          ],
          "answer": 1,
          "wrong": [
            "Bollen är lila, men den har ränder.",
            null,
            "Prickarna stämmer, men bollen är röd."
          ],
          "why": "Den lila bollen har prickar, så båda spåren stämmer."
        },
        {
          "title": "Rätt utställningsbord",
          "scene": "Tre bord har dekorerats för slembilderna.",
          "clues": [
            "Bordet har en gul duk.",
            "Tre bilder står på bordet."
          ],
          "choices": [
            "Gul duk med två bilder.",
            "Blå duk med tre bilder.",
            "Gul duk med tre bilder."
          ],
          "answer": 2,
          "wrong": [
            "Duken är gul, men det finns bara två bilder.",
            "Bilderna är tre, men duken är blå.",
            null
          ],
          "why": "Bordet har gul duk och tre bilder."
        }
      ],
      "group": "creative"
    },
    {
      "id": "game-show",
      "emoji": "🎤",
      "title": "Frågefestens hemliga studio",
      "intro": "I frågestudion ska alla hjälpas åt att ordna en vänlig frågefest. Ingen tävlar om att vara snabbast.",
      "ending": "Studion är redo! Alla får ställa frågor och lyssna på varandras svar.",
      "keepsake": {
        "emoji": "📺",
        "name": "Studiobrickan"
      },
      "stages": [
        {
          "title": "Studions skylt",
          "scene": "Tre skyltar sitter ovanför olika dörrar.",
          "clues": [
            "På skylten finns en mikrofon.",
            "Där står ordet FRÅGA."
          ],
          "choices": [
            "Mikrofon och ordet FRÅGA.",
            "Mikrofon och ordet PAUS.",
            "Stjärna och ordet FRÅGA."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Mikrofonen finns, men ordet är PAUS.",
            "Ordet FRÅGA stämmer, men bilden är en stjärna."
          ],
          "why": "Skylten visar mikrofonen och ordet FRÅGA."
        },
        {
          "title": "Den vänliga frågan",
          "scene": "Programledaren vill välja en bra fråga till alla.",
          "clues": [
            "Meningen börjar med Varför.",
            "Den slutar med ett frågetecken."
          ],
          "choices": [
            "Varför vi läser böcker.",
            "Varför lyser stjärnor?",
            "Hur hittar man hem?"
          ],
          "answer": 1,
          "wrong": [
            "Ordet Varför finns, men meningen har inget frågetecken.",
            null,
            "Meningen är en fråga, men börjar inte med Varför."
          ],
          "why": "Varför lyser stjärnor? börjar rätt och har frågetecken."
        },
        {
          "title": "Finalens bakgrund",
          "scene": "Tre tecknade bakgrunder finns i studion.",
          "clues": [
            "En regnbåge syns på bilden.",
            "Två vita moln finns under regnbågen."
          ],
          "choices": [
            "Regnbåge med tre vita moln.",
            "Två vita moln under en sol.",
            "Regnbåge med två vita moln under."
          ],
          "answer": 2,
          "wrong": [
            "Regnbågen finns, men molnen är tre.",
            "Molnen är två, men bilden har en sol.",
            null
          ],
          "why": "Regnbågen har två vita moln under sig."
        }
      ],
      "group": "creative"
    },
    {
      "id": "knights",
      "emoji": "🛡️",
      "title": "Riddarskolans fredsflagga",
      "intro": "Riddaren Lo ska ordna en vänskapsfest med en snäll drake. Först måste festflaggan hittas.",
      "ending": "Fredsflaggan hissas vid slottet. Riddaren Lo och draken firar att alla är välkomna.",
      "keepsake": {
        "emoji": "🏰",
        "name": "Riddarens fredsmärke"
      },
      "stages": [
        {
          "title": "Slottets första ledtråd",
          "scene": "En skrivare har ritat tre torn på en karta.",
          "clues": [
            "Tornet har ett rött tak.",
            "Bredvid tornet växer ett stort träd."
          ],
          "choices": [
            "Torn med rött tak och stort träd.",
            "Torn med rött tak utan träd.",
            "Torn med blått tak och stort träd."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Taket är rött, men trädet saknas.",
            "Trädet finns, men taket är blått."
          ],
          "why": "Det röda taket och det stora trädet finns vid samma torn."
        },
        {
          "title": "Drakens brev",
          "scene": "Den vänliga draken har skickat ett brev.",
          "clues": [
            "Brevet bjuder in till en fest.",
            "Det nämner att alla får vara med."
          ],
          "choices": [
            "Det blir fest bara för riddare.",
            "Vi firar tillsammans och alla är välkomna!",
            "Alla får komma till skolan i morgon."
          ],
          "answer": 1,
          "wrong": [
            "Brevet handlar om fest, men inte alla är inbjudna.",
            null,
            "Alla nämns, men ingen fest finns i brevet."
          ],
          "why": "Brevet berättar om både fest och att alla är välkomna."
        },
        {
          "title": "Hitta fredsflaggan",
          "scene": "På borggården ligger tre flaggor.",
          "clues": [
            "Flaggan är vit.",
            "Ett blått hjärta finns i mitten."
          ],
          "choices": [
            "Vit flagga med grön stjärna.",
            "Blå flagga med ett blått hjärta.",
            "Vit flagga med ett blått hjärta."
          ],
          "answer": 2,
          "wrong": [
            "Flaggan är vit, men bilden är en grön stjärna.",
            "Hjärtat är blått, men flaggan är inte vit.",
            null
          ],
          "why": "Den vita flaggan har ett blått hjärta."
        }
      ],
      "group": "fantasy"
    },
    {
      "id": "fairy-forest",
      "emoji": "🧚",
      "title": "Älvskogens borttappade lyktor",
      "intro": "De små älvorna ska lysa upp vägen till sagofesten. Några tecknade lyktor har hamnat på fel plats.",
      "ending": "Alla sagolyktor hänger på sina platser och älvorna kan börja sin vänskapsfest.",
      "keepsake": {
        "emoji": "🏮",
        "name": "Älvornas sagolykta"
      },
      "stages": [
        {
          "title": "Spåret bland bladen",
          "scene": "En liten karta visar den första lyktan.",
          "clues": [
            "Lyktan hänger i ett stort träd.",
            "På grenen finns tre blå löv."
          ],
          "choices": [
            "Lykta i stort träd med tre blå löv.",
            "Lykta i stort träd med två blå löv.",
            "Tre blå löv på en buske utan lykta."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Trädet och lyktan finns, men löven är två.",
            "Löven är tre, men det finns ingen lykta i ett träd."
          ],
          "why": "Lyktan hänger i det stora trädet med tre blå löv."
        },
        {
          "title": "Den viskande stigen",
          "scene": "En älva beskriver stigen till nästa lykta.",
          "clues": [
            "Stigen går längs en bäck.",
            "Vid stigen växer en lila blomma."
          ],
          "choices": [
            "En stig längs en bäck med gul blomma.",
            "En stig längs en bäck med lila blomma.",
            "En stig över en torr äng med lila blomma."
          ],
          "answer": 1,
          "wrong": [
            "Stigen följer bäcken, men blomman är gul.",
            null,
            "Blomman är lila, men stigen går inte längs en bäck."
          ],
          "why": "Stigen följer bäcken och där växer en lila blomma."
        },
        {
          "title": "Festens sista lykta",
          "scene": "Tre lyktor väntar på att få hängas upp.",
          "clues": [
            "Lyktan är rund.",
            "En liten måne finns på utsidan."
          ],
          "choices": [
            "Rund lykta med en stjärna.",
            "Fyrkantig lykta med en måne.",
            "Rund lykta med en måne."
          ],
          "answer": 2,
          "wrong": [
            "Lyktan är rund, men har en stjärna.",
            "Månen finns, men lyktan är fyrkantig.",
            null
          ],
          "why": "Den runda lyktan har en måne på utsidan."
        }
      ],
      "group": "fantasy"
    },
    {
      "id": "rail-ticket",
      "group": "mystery",
      "emoji": "🚉",
      "title": "Biljettens hemliga resa",
      "intro": "På sagostationen har ett tåg fått fel biljett. Hjälp konduktören att hitta rätt innan nästa resa börjar.",
      "ending": "Biljetten hittas vid rätt bänk. Nu vet resenärerna vart deras sagotåg ska åka.",
      "keepsake": {
        "emoji": "🎫",
        "name": "Tågdetektivens biljett"
      },
      "stages": [
        {
          "title": "Rätt avgång",
          "scene": "Konduktören läser två saker på reselappen.",
          "clues": [
            "Tåget ska åka till Snöbyn.",
            "Det avgår från spår 2."
          ],
          "choices": [
            "Spår 2 till Skogsvik.",
            "Spår 2 till Snöbyn.",
            "Spår 3 till Snöbyn."
          ],
          "answer": 1,
          "wrong": [
            "Spåret är rätt, men tåget går till Skogsvik.",
            null,
            "Tåget går till Snöbyn, men från spår 3."
          ],
          "why": "Tåget mot Snöbyn avgår från spår 2. Båda uppgifterna stämmer."
        },
        {
          "title": "Ett brev från resenären",
          "scene": "En resenär beskriver sitt borttappade kuvert.",
          "clues": [
            "På kuvertet står ordet VÄLKOMMEN.",
            "En bild av ett tåg finns bredvid texten."
          ],
          "choices": [
            "VÄLKOMMEN med en bild av en buss.",
            "HEJ med en bild av ett tåg.",
            "VÄLKOMMEN med en bild av ett tåg."
          ],
          "answer": 2,
          "wrong": [
            "Ordet stämmer, men bilden visar en buss.",
            "Tågbilden stämmer, men ordet är HEJ.",
            null
          ],
          "why": "Kuvertet har ordet VÄLKOMMEN och en tågbild."
        },
        {
          "title": "Hitta biljetten",
          "scene": "Tre bänkar står i stationshuset.",
          "clues": [
            "Bänken är grön.",
            "Bredvid bänken står en papperskorg."
          ],
          "choices": [
            "Grön bänk med en papperskorg bredvid.",
            "Grön bänk utan papperskorg.",
            "Blå bänk med en papperskorg bredvid."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Bänken är grön, men papperskorgen saknas.",
            "Papperskorgen finns, men bänken är blå."
          ],
          "why": "Biljetten ligger vid den gröna bänken med papperskorg."
        }
      ]
    },
    {
      "id": "lighthouse",
      "group": "mystery",
      "emoji": "🗼",
      "title": "Fyrvaktarens hemliga ljuskod",
      "intro": "Fyrvaktaren Isa har ritat en kod till havets sagokarta. Hjälp henne att ordna signalerna.",
      "ending": "Isa hittar sin kodbok och kan berätta om fyrens ljussignaler för alla besökare.",
      "keepsake": {
        "emoji": "💡",
        "name": "Fyrens ljusmärke"
      },
      "stages": [
        {
          "title": "Hitta rätt fyr",
          "scene": "På en karta finns tre små fyrar.",
          "clues": [
            "Fyren står på en klippa.",
            "Bredvid finns en liten brygga."
          ],
          "choices": [
            "Fyr på klippa utan brygga.",
            "Fyr på klippa med en liten brygga.",
            "Fyr på sandstrand med en liten brygga."
          ],
          "answer": 1,
          "wrong": [
            "Fyren står på klippan, men bryggan saknas.",
            null,
            "Bryggan finns, men fyren står inte på en klippa."
          ],
          "why": "Rätt fyr står på klippan och har en brygga bredvid."
        },
        {
          "title": "Ljusets mönster",
          "scene": "På ett papper beskriver Isa sin tecknade ljussignal.",
          "clues": [
            "Först syns en kort blinkning.",
            "Sedan kommer två långa blinkningar."
          ],
          "choices": [
            "Kort, lång, lång.",
            "Lång, lång, kort.",
            "Kort, kort, lång."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Här är de långa blinkningarna först.",
            "Här börjar det kort, men sedan kommer inte två långa blinkningar."
          ],
          "why": "Mönstret börjar med en kort blinkning och slutar med två långa."
        },
        {
          "title": "Kodbokens hylla",
          "scene": "I fyrens lilla läshörna finns tre böcker.",
          "clues": [
            "Boken har ett blått omslag.",
            "En fyr är ritad på framsidan."
          ],
          "choices": [
            "Blå bok med en fisk på framsidan.",
            "Röd bok med en fyr på framsidan.",
            "Blå bok med en fyr på framsidan."
          ],
          "answer": 2,
          "wrong": [
            "Omslaget är blått, men bilden visar en fisk.",
            "Fyren finns, men boken är röd.",
            null
          ],
          "why": "Kodboken är blå och har en fyr på framsidan."
        }
      ]
    },
    {
      "id": "theater-props",
      "group": "mystery",
      "emoji": "🎭",
      "title": "Teaterns försvunna papperskrona",
      "intro": "Barnteatern ska spela en saga. En krona av papper har försvunnit bland alla fina saker bakom scenen.",
      "ending": "Kronan hittas i rätt rekvisitalåda. Nu kan föreställningen börja, och alla får hjälpa till.",
      "keepsake": {
        "emoji": "👑",
        "name": "Teaterkronan"
      },
      "stages": [
        {
          "title": "Manusets första rad",
          "scene": "En lapp beskriver vem som ska ha kronan.",
          "clues": [
            "Personen spelar en drottning.",
            "Drottningen kommer in efter draken."
          ],
          "choices": [
            "Drottningen kommer in före draken.",
            "Drottningen kommer in efter draken.",
            "En riddare kommer in efter draken."
          ],
          "answer": 1,
          "wrong": [
            "Rollen stämmer, men ordningen är fel.",
            null,
            "Ordningen stämmer, men det är en riddare och inte drottningen."
          ],
          "why": "Texten berättar att drottningen kommer in efter draken."
        },
        {
          "title": "Hitta rätt hylla",
          "scene": "Det finns tre hyllor med teatersaker.",
          "clues": [
            "Hyllan har en skylt med ordet SAGOR.",
            "På hyllan ligger en röd mantel."
          ],
          "choices": [
            "SAGOR med blå mantel.",
            "DRÄKTER med röd mantel.",
            "SAGOR med röd mantel."
          ],
          "answer": 2,
          "wrong": [
            "Skyltens ord stämmer, men manteln är blå.",
            "Manteln är röd, men skylten säger DRÄKTER.",
            null
          ],
          "why": "Den röda manteln ligger på hyllan märkt SAGOR."
        },
        {
          "title": "Kronans låda",
          "scene": "Tre lådor står på hyllan.",
          "clues": [
            "Lådan har ett lock med stjärnor.",
            "Där står ordet KRONA."
          ],
          "choices": [
            "Stjärnlock och texten KRONA.",
            "Stjärnlock och texten MASK.",
            "Hjärtlock och texten KRONA."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Stjärnorna finns, men ordet är MASK.",
            "Ordet KRONA stämmer, men locket har hjärtan."
          ],
          "why": "Kronans låda har stjärnor på locket och texten KRONA."
        }
      ]
    },
    {
      "id": "night-library",
      "group": "mystery",
      "emoji": "📚",
      "title": "Bibliotekets hemliga lånekort",
      "intro": "Ett bokmärke med en ledtråd har hamnat på fel hylla. Biblioteksvännen Mio vill hitta det.",
      "ending": "Mio hittar bokmärket och lägger tillbaka det i rätt bok. Bibliotekets hemlighet är löst.",
      "keepsake": {
        "emoji": "🔖",
        "name": "Bokspanarens märke"
      },
      "stages": [
        {
          "title": "Den rätta bokhyllan",
          "scene": "Mio hittar ett meddelande om en hylla.",
          "clues": [
            "På hyllan står sagoböcker.",
            "En grön skylt sitter ovanför."
          ],
          "choices": [
            "Sagoböcker under en grön skylt.",
            "Sagoböcker under en röd skylt.",
            "Faktaböcker under en grön skylt."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Böckerna är sagor, men skylten är röd.",
            "Skylten är grön, men böckerna handlar om fakta."
          ],
          "why": "Sagböckerna står under den gröna skylten."
        },
        {
          "title": "Bokens beskrivning",
          "scene": "En liten lapp beskriver en bestämd bok.",
          "clues": [
            "Boken handlar om ett vänligt djur.",
            "Djuret hjälper någon att hitta hem."
          ],
          "choices": [
            "En vänlig räv dansar på en äng.",
            "En vänlig räv hjälper en kanin hitta hem.",
            "En busig räv gömmer en kanins mössa."
          ],
          "answer": 1,
          "wrong": [
            "Räven är vänlig, men hjälper ingen att hitta hem.",
            null,
            "Här finns en räv, men den hjälper inte någon att hitta hem."
          ],
          "why": "Den vänliga räven hjälper kaninen att hitta hem. Båda spåren passar."
        },
        {
          "title": "Bokmärket i berättelsen",
          "scene": "Tre bokmärken ligger mellan bokens sidor.",
          "clues": [
            "Bokmärket är gult.",
            "På det står ordet TILLSAMMANS."
          ],
          "choices": [
            "Gult märke med ordet ENSAM.",
            "Blått märke med ordet TILLSAMMANS.",
            "Gult märke med ordet TILLSAMMANS."
          ],
          "answer": 2,
          "wrong": [
            "Färgen stämmer, men ordet är ENSAM.",
            "Ordet stämmer, men bokmärket är blått.",
            null
          ],
          "why": "Bokmärket är gult och har ordet TILLSAMMANS."
        }
      ]
    },
    {
      "id": "market-map",
      "group": "mystery",
      "emoji": "🎡",
      "title": "Sagomarknadens försvunna vägbeskrivning",
      "intro": "Marknadsnissen har tappat sin karta mellan stånden. Du får hjälpa till att hitta hans lilla arbetsbord.",
      "ending": "Kartan hittas och nissen kan hjälpa alla gäster att hitta på sagomarknaden.",
      "keepsake": {
        "emoji": "🧺",
        "name": "Marknadens kartmärke"
      },
      "stages": [
        {
          "title": "Hitta fruktståndet",
          "scene": "En lapp berättar var nissen stannade först.",
          "clues": [
            "Här säljs äpplen.",
            "Ovanför står en skylt med ett hjärta."
          ],
          "choices": [
            "Äpplen under en skylt med hjärta.",
            "Äpplen under en skylt med stjärna.",
            "Päron under en skylt med hjärta."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Äpplena stämmer, men skyltens bild är en stjärna.",
            "Hjärtat finns, men där säljs päron."
          ],
          "why": "Äpplena ligger under skylten med hjärtat."
        },
        {
          "title": "Läs vägen rätt",
          "scene": "På marken finns tre skyltar med vägord.",
          "clues": [
            "Vägen går först mot bron.",
            "Efter bron ska man gå till vänster."
          ],
          "choices": [
            "Gå mot bron och sedan höger.",
            "Gå mot bron och sedan vänster.",
            "Gå mot trädet och sedan vänster."
          ],
          "answer": 1,
          "wrong": [
            "Bron stämmer, men man ska gå vänster.",
            null,
            "Svängen stämmer, men vägen går först mot bron."
          ],
          "why": "Först kommer bron och sedan svänger vägen vänster."
        },
        {
          "title": "Hitta kartbordet",
          "scene": "Tre små bord står vid slutet av marknaden.",
          "clues": [
            "Bordet har en blå duk.",
            "En liten kompass ligger på bordet."
          ],
          "choices": [
            "Blå duk utan kompass.",
            "Grön duk med kompass.",
            "Blå duk med kompass."
          ],
          "answer": 2,
          "wrong": [
            "Duken är blå, men kompassen saknas.",
            "Kompassen finns, men duken är grön.",
            null
          ],
          "why": "Kartbordet har blå duk och en kompass ovanpå."
        }
      ]
    },
    {
      "id": "dragon-orchestra",
      "group": "fantasy",
      "emoji": "🐲",
      "title": "Drakungens borttappade melodi",
      "intro": "Den lilla draken Flim vill spela en sång för sina vänner men minns inte hur den börjar.",
      "ending": "Flim hittar melodin och spelar en lugn sång. Vännerna lyssnar och klappar i händerna.",
      "keepsake": {
        "emoji": "🎶",
        "name": "Drakmelodins märke"
      },
      "stages": [
        {
          "title": "Hitta notboken",
          "scene": "Tre böcker ligger på drakens bord.",
          "clues": [
            "Boken har en grön pärm.",
            "En liten flöjt finns på framsidan."
          ],
          "choices": [
            "Grön pärm med trumma.",
            "Grön pärm med flöjt.",
            "Blå pärm med flöjt."
          ],
          "answer": 1,
          "wrong": [
            "Färgen stämmer, men bilden visar en trumma.",
            null,
            "Flöjten finns, men pärmen är blå."
          ],
          "why": "Notboken har grön pärm och en flöjt på framsidan."
        },
        {
          "title": "Sången för en trött vän",
          "scene": "Flim vill välja en sång som hjälper en vän att vila.",
          "clues": [
            "Sången ska låta lugn.",
            "Texten handlar om att vila."
          ],
          "choices": [
            "Snabb sång om att vila.",
            "Lugn sång om en vild tävling.",
            "Lugn sång om att sova gott."
          ],
          "answer": 2,
          "wrong": [
            "Sången handlar om vila, men den är snabb.",
            "Sången är lugn, men texten handlar inte om vila.",
            null
          ],
          "why": "Den lugna sången om sömn passar båda spåren."
        },
        {
          "title": "Spela i rätt ordning",
          "scene": "Tre kort visar hur melodin ska börja.",
          "clues": [
            "Första tonen är låg.",
            "Sista tonen är hög."
          ],
          "choices": [
            "Låg, mellan, hög.",
            "Hög, mellan, låg.",
            "Låg, mellan, låg."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Sista tonen är låg i stället för hög.",
            "Första tonen är låg, men sista är också låg."
          ],
          "why": "Melodin börjar lågt och slutar högt."
        }
      ]
    },
    {
      "id": "cloud-castle",
      "group": "fantasy",
      "emoji": "☁️",
      "title": "Molnslottets borttappade nyckel",
      "intro": "På ett slott ovanför molnen har en snäll molnvakt tappat nyckeln till sagosalen.",
      "ending": "Nyckeln passar sagosalens dörr. Molnvakten öppnar så att alla kan lyssna på berättelser.",
      "keepsake": {
        "emoji": "🗝️",
        "name": "Molnslottets nyckel"
      },
      "stages": [
        {
          "title": "Trappan i molnet",
          "scene": "En skylt visar vilken trappa som leder till salen.",
          "clues": [
            "Trappan går uppåt.",
            "Överst sitter en rund lykta."
          ],
          "choices": [
            "Trappa uppåt med rund lykta.",
            "Trappa uppåt med fyrkantig lykta.",
            "Trappa nedåt med rund lykta."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Trappan går uppåt, men lyktan är fyrkantig.",
            "Lyktan är rund, men trappan går nedåt."
          ],
          "why": "Trappan går upp till den runda lyktan."
        },
        {
          "title": "Vaktens gåta",
          "scene": "Vakten beskriver något som finns i sagosalen.",
          "clues": [
            "Föremålet kan öppnas.",
            "Inuti finns skrivna berättelser."
          ],
          "choices": [
            "En öppen kartong med tomma blad.",
            "En bok med sagor på sidorna.",
            "En tavla med en saga målad på."
          ],
          "answer": 1,
          "wrong": [
            "Kartongen kan öppnas, men innehåller inga berättelser.",
            null,
            "Sagan finns, men en tavla öppnas inte som en bok."
          ],
          "why": "Boken kan öppnas och rymmer skrivna sagor."
        },
        {
          "title": "Den rätta nyckeln",
          "scene": "Tre nycklar ligger i en skål.",
          "clues": [
            "Nyckeln är av silverfärgad metall.",
            "Ett hjärta syns på handtaget."
          ],
          "choices": [
            "Silvernyckel med stjärna.",
            "Guldnyckel med hjärta.",
            "Silvernyckel med hjärta."
          ],
          "answer": 2,
          "wrong": [
            "Metallen är rätt färg, men bilden är en stjärna.",
            "Hjärtat finns, men nyckeln är guldfärgad.",
            null
          ],
          "why": "Nyckeln är silverfärgad och har ett hjärta på handtaget."
        }
      ]
    },
    {
      "id": "moon-fairy",
      "group": "fantasy",
      "emoji": "🌙",
      "title": "Månälvans hemliga stjärnbrev",
      "intro": "Månälvan Lumi vill skicka en varm hälsning till en vän som känner sig ensam.",
      "ending": "Lumi skickar sitt vänliga brev. Hennes vän känner att någon tänker på henne.",
      "keepsake": {
        "emoji": "✉️",
        "name": "Månälvans stjärnbrev"
      },
      "stages": [
        {
          "title": "Hitta brevpappret",
          "scene": "Lumi letar efter rätt ark i sagolådan.",
          "clues": [
            "Papperet är ljusblått.",
            "En gul måne finns i hörnet."
          ],
          "choices": [
            "Ljusblått papper med gul måne.",
            "Ljusblått papper med gul sol.",
            "Vitt papper med gul måne."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Färgen stämmer, men bilden visar solen.",
            "Månen stämmer, men papperet är vitt."
          ],
          "why": "Brevpapperet är ljusblått med en gul måne."
        },
        {
          "title": "Den vänliga hälsningen",
          "scene": "Lumi vill skriva en mening som visar omtanke.",
          "clues": [
            "Meddelandet frågar hur vännen mår.",
            "Det erbjuder vänligt sällskap."
          ],
          "choices": [
            "Hur mår du? Jag har mycket att göra.",
            "Hur mår du? Vill du vara med mig en stund?",
            "Kom och lek med mig i morgon!"
          ],
          "answer": 1,
          "wrong": [
            "Meddelandet frågar hur vännen mår, men erbjuder inget sällskap.",
            null,
            "Här erbjuds lek, men ingen frågar hur vännen mår."
          ],
          "why": "Lumi frågar hur vännen mår och bjuder in till sällskap."
        },
        {
          "title": "Hitta kuvertet",
          "scene": "Tre kuvert ligger vid fönstret.",
          "clues": [
            "Kuvertet har en blå stjärna.",
            "På baksidan står ordet VÄN."
          ],
          "choices": [
            "Blå stjärna med ordet HEJ.",
            "Grön stjärna med ordet VÄN.",
            "Blå stjärna med ordet VÄN."
          ],
          "answer": 2,
          "wrong": [
            "Stjärnan är blå, men ordet är HEJ.",
            "Ordet VÄN stämmer, men stjärnan är grön.",
            null
          ],
          "why": "Kuvertet har både en blå stjärna och ordet VÄN."
        }
      ]
    },
    {
      "id": "mermaid-letter",
      "group": "fantasy",
      "emoji": "🧜",
      "title": "Sjöjungfruns vänskapspärla",
      "intro": "Sjöjungfrun Nilla har tappat en pärla från sitt vänskapsarmband. Havsvännerna hjälper henne leta.",
      "ending": "Pärlan hittas i en mjuk tygpåse. Nilla lagar sitt armband och tackar sina havsvänner.",
      "keepsake": {
        "emoji": "🐚",
        "name": "Vänskapssnäckan"
      },
      "stages": [
        {
          "title": "Bädden bland snäckorna",
          "scene": "En lapp beskriver var Nilla lade sitt armband.",
          "clues": [
            "Där finns tre snäckor.",
            "Bredvid ligger en mjuk blå filt."
          ],
          "choices": [
            "Tre snäckor med blå filt.",
            "Tre snäckor med röd filt.",
            "En snäcka med blå filt."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Snäckorna är tre, men filten är röd.",
            "Filten är blå, men snäckorna är inte tre."
          ],
          "why": "Tre snäckor ligger bredvid den blå filten."
        },
        {
          "title": "En vän som hjälper",
          "scene": "Havsvännerna skriver kort om hur de letar tillsammans.",
          "clues": [
            "Två vänner hjälper varandra.",
            "De letar efter samma pärla."
          ],
          "choices": [
            "Två vänner hjälper varandra bära en väska.",
            "Två vänner letar tillsammans efter pärlan.",
            "En vän letar ensam efter pärlan."
          ],
          "answer": 1,
          "wrong": [
            "Två vänner hjälper till, men de letar inte efter pärlan.",
            null,
            "Pärlan eftersöks, men bara en vän letar."
          ],
          "why": "Två vänner letar tillsammans efter samma pärla."
        },
        {
          "title": "Hitta den mjuka påsen",
          "scene": "Tre små påsar ligger på en hylla.",
          "clues": [
            "Påsen är grön.",
            "Den har en vit stjärna på framsidan."
          ],
          "choices": [
            "Grön påse med vit måne.",
            "Blå påse med vit stjärna.",
            "Grön påse med vit stjärna."
          ],
          "answer": 2,
          "wrong": [
            "Påsen är grön, men bilden är en måne.",
            "Stjärnan är vit, men påsen är blå.",
            null
          ],
          "why": "Den gröna påsen har en vit stjärna."
        }
      ]
    },
    {
      "id": "tiny-giants",
      "group": "fantasy",
      "emoji": "🪨",
      "title": "Jättarnas lilla vänskapsgåta",
      "intro": "De stora men vänliga jättarna vill hitta en försvunnen liten kruka till sin pytteträdgård.",
      "ending": "Krukan hittas vid rätt stig. Jättarna lär sig att även små saker kan vara viktiga.",
      "keepsake": {
        "emoji": "🌱",
        "name": "Jättarnas frömärke"
      },
      "stages": [
        {
          "title": "Det lilla fotavtrycket",
          "scene": "En jättes teckning visar var den lilla stigen börjar.",
          "clues": [
            "Där finns ett litet fotavtryck.",
            "Bredvid växer en stor blomma."
          ],
          "choices": [
            "Litet fotavtryck vid stor blomma.",
            "Litet fotavtryck vid stor sten.",
            "Stor blomma vid ett hjulspår."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Fotavtrycket finns, men blomman saknas.",
            "Blomman finns, men det är ett hjulspår och inte en fot."
          ],
          "why": "Stigen börjar vid fotavtrycket och den stora blomman."
        },
        {
          "title": "Vems kruka är det?",
          "scene": "Tre vänner beskriver sina odlingskrukor.",
          "clues": [
            "Krukan är mycket liten.",
            "Där växer en solros."
          ],
          "choices": [
            "Liten kruka med en ros.",
            "Liten kruka med en solros.",
            "Stor kruka med en solros."
          ],
          "answer": 1,
          "wrong": [
            "Krukan är liten, men blomman är en ros.",
            null,
            "Solrosen finns, men krukan är stor."
          ],
          "why": "Den lilla krukan innehåller en solros."
        },
        {
          "title": "Plantera på rätt plats",
          "scene": "Jättarna vill placera krukan där blomman kan växa.",
          "clues": [
            "Platsen får ljus under dagen.",
            "Någon kan ge vatten när jorden blir torr."
          ],
          "choices": [
            "Ljus plats där ingen kan vattna.",
            "Mörk plats där någon vattnar vid behov.",
            "Ljus plats där någon vattnar vid behov."
          ],
          "answer": 2,
          "wrong": [
            "Ljuset finns, men ingen kan vattna när jorden torkar.",
            "Någon kan vattna, men platsen är mörk.",
            null
          ],
          "why": "Platsen får ljus och vatten när jorden behöver det."
        }
      ]
    },
    {
      "id": "weather-station",
      "group": "explore",
      "emoji": "🌦️",
      "title": "Väderstationens borttappade skylt",
      "intro": "På den lilla väderstationen har skyltarna blandats ihop. Hjälp meteorologen Ella läsa vad de betyder.",
      "ending": "Skyltarna sitter på rätt plats igen. Ella kan nu förklara vädret med tydliga ord.",
      "keepsake": {
        "emoji": "🌤️",
        "name": "Väderspanarens märke"
      },
      "stages": [
        {
          "title": "Vilken dag var det?",
          "scene": "Ella letar efter en bild av en viss väderdag.",
          "clues": [
            "På bilden faller regn.",
            "Träden böjer sig i vinden."
          ],
          "choices": [
            "Regn och stilla träd.",
            "Regn och träd som böjs av vinden.",
            "Blåst som böjer träd, men inget regn."
          ],
          "answer": 1,
          "wrong": [
            "Regnet finns där, men träden står helt stilla.",
            null,
            "Träden böjs av vinden, men det regnar inte."
          ],
          "why": "Bilden visar både regn och träd som böjs av vinden."
        },
        {
          "title": "Väderorden",
          "scene": "Ella skriver en kort rapport som passar de två spåren.",
          "clues": [
            "Vädret är kallt.",
            "Något vitt faller från molnen."
          ],
          "choices": [
            "Det är kallt och snö faller.",
            "Det är kallt men himlen är klar.",
            "Det är varmt och snö faller i fantasin."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Det är kallt, men inget faller från molnen.",
            "Snön nämns, men texten säger att det är varmt."
          ],
          "why": "Rapporten beskriver kyla och snö som faller."
        },
        {
          "title": "Rätt symbolskylt",
          "scene": "Tre skyltar står på stationens bord.",
          "clues": [
            "Skylten visar ett moln.",
            "Under molnet finns två blå droppar."
          ],
          "choices": [
            "Moln med två gula stjärnor.",
            "Sol med två blå droppar.",
            "Moln med två blå droppar."
          ],
          "answer": 2,
          "wrong": [
            "Molnet stämmer, men bilden visar stjärnor.",
            "Dropparna stämmer, men symbolen är en sol.",
            null
          ],
          "why": "Skylten visar ett moln med två blå droppar."
        }
      ]
    },
    {
      "id": "polar-post",
      "group": "explore",
      "emoji": "❄️",
      "title": "Snöexpeditionens försvunna vykort",
      "intro": "Två vänner är på en fantasiexpedition bland snö och is. Ett vykort har hamnat på fel plats.",
      "ending": "Vykortet hittas i det varma lästältet. Vännerna kan berätta om sitt snöäventyr.",
      "keepsake": {
        "emoji": "✉️",
        "name": "Snöexpeditionens vykort"
      },
      "stages": [
        {
          "title": "Kartans första markering",
          "scene": "En tecknad karta visar var vännerna gick.",
          "clues": [
            "Stigen leder till ett litet tält.",
            "Utanför tältet står en blå flagga."
          ],
          "choices": [
            "Litet tält med blå flagga utanför.",
            "Litet tält med grön flagga utanför.",
            "Blå flagga vid en stor stuga."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Tältet finns, men flaggan är grön.",
            "Flaggan är blå, men där finns en stuga och inte ett tält."
          ],
          "why": "Det lilla tältet har en blå flagga utanför."
        },
        {
          "title": "Vad betyder skydd?",
          "scene": "Vännerna söker en plats där de kan läsa sitt vykort.",
          "clues": [
            "Platsen skyddar mot vinden.",
            "Där finns ett bord att lägga vykortet på."
          ],
          "choices": [
            "Ett tält med väggar men inget bord.",
            "En skyddad stuga med ett bord.",
            "Ett öppet bord ute i blåsten."
          ],
          "answer": 1,
          "wrong": [
            "Tältet ger vindskydd, men saknar bord.",
            null,
            "Bordet finns, men står ute i vinden."
          ],
          "why": "Stugan skyddar mot vinden och har ett bord."
        },
        {
          "title": "Vykortets framsida",
          "scene": "Tre vykort ligger på bordet.",
          "clues": [
            "På kortet finns en tecknad snögubbe.",
            "Bredvid snögubben står en liten lykta."
          ],
          "choices": [
            "Snögubbe med en stjärna bredvid.",
            "Lykta bredvid en tecknad björn.",
            "Snögubbe med en lykta bredvid."
          ],
          "answer": 2,
          "wrong": [
            "Snögubben finns, men lyktan saknas.",
            "Lyktan finns, men bilden visar en björn.",
            null
          ],
          "why": "Vykortet visar en snögubbe med en lykta."
        }
      ]
    },
    {
      "id": "mountain-trail",
      "group": "explore",
      "emoji": "⛰️",
      "title": "Bergsstigens hemliga riktning",
      "intro": "Vandraren Noa vill hitta ett läshus längs en trygg tecknad bergsstig. Hjälp till att läsa kartan.",
      "ending": "Noa hittar läshuset och får vila med en varm filt och en spännande bok.",
      "keepsake": {
        "emoji": "🧭",
        "name": "Bergsstigens kompass"
      },
      "stages": [
        {
          "title": "Stigarnas skillnad",
          "scene": "Två ord på kartan visar rätt stig.",
          "clues": [
            "Stigen går förbi ett stort vattenfall.",
            "En träbro finns längre fram."
          ],
          "choices": [
            "Vattenfall och träbro på stigen.",
            "Vattenfall men ingen bro.",
            "Träbro på en stig utan vattenfall."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Vattenfallet finns, men träbron saknas.",
            "Träbron finns, men inget vattenfall."
          ],
          "why": "Både vattenfallet och träbron ligger vid samma stig."
        },
        {
          "title": "Läs riktningsorden",
          "scene": "En vän har skrivit hur Noa ska svänga.",
          "clues": [
            "Först går Noa mot det stora trädet.",
            "Sedan svänger Noa åt höger."
          ],
          "choices": [
            "Mot trädet, sedan vänster.",
            "Mot trädet, sedan höger.",
            "Mot stenen, sedan höger."
          ],
          "answer": 1,
          "wrong": [
            "Trädet är rätt, men svängen går vänster.",
            null,
            "Svängen går höger, men första platsen är stenen."
          ],
          "why": "Noa går först mot trädet och svänger sedan höger."
        },
        {
          "title": "Ett tryggt läshus",
          "scene": "Tre stugor syns på kartan.",
          "clues": [
            "Huset har ett rött tak.",
            "En stor bok är målad på dörren."
          ],
          "choices": [
            "Rött tak med en blomma på dörren.",
            "Blått tak med en bok på dörren.",
            "Rött tak med en bok på dörren."
          ],
          "answer": 2,
          "wrong": [
            "Taket är rött, men bilden visar en blomma.",
            "Boken finns, men taket är blått.",
            null
          ],
          "why": "Läshuset har rött tak och en bok på dörren."
        }
      ]
    },
    {
      "id": "volcano-island",
      "group": "explore",
      "emoji": "🌋",
      "title": "Vulkanöns märkliga sten",
      "intro": "På ett museum finns en sagokarta över en vulkanö. Geologen Nova vill hitta ett gammalt stenprov.",
      "ending": "Stenen ligger i en trygg glasmonter. Nova visar hur forskare kan jämföra bergarter.",
      "keepsake": {
        "emoji": "🪨",
        "name": "Stenforskarens fynd"
      },
      "stages": [
        {
          "title": "Kartans gamla utsiktspunkt",
          "scene": "Museets karta visar en plats att studera på avstånd.",
          "clues": [
            "En vulkan syns på bilden.",
            "En liten sjö ligger nedanför berget."
          ],
          "choices": [
            "Vulkan med sjö nedanför.",
            "Vulkan med en stor skog men ingen sjö.",
            "Sjö nedanför en vanlig kulle."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Vulkanen syns, men sjön saknas.",
            "Sjön finns, men bilden visar inte en vulkan."
          ],
          "why": "På kartan syns en vulkan med en sjö nedanför."
        },
        {
          "title": "Forskaren beskriver stenen",
          "scene": "Nova har skrivit ner två detaljer.",
          "clues": [
            "Stenen är mörk.",
            "Den har små hål i ytan."
          ],
          "choices": [
            "Mörk sten med slät yta.",
            "Mörk sten med små hål.",
            "Ljus sten med små hål."
          ],
          "answer": 1,
          "wrong": [
            "Färgen stämmer, men ytan är slät.",
            null,
            "Hålen finns, men stenen är ljus."
          ],
          "why": "Stenen är mörk och har små hål i ytan."
        },
        {
          "title": "Stenen på museet",
          "scene": "Tre montrar står i utställningen.",
          "clues": [
            "På montern står det STENAR.",
            "På glaset finns en bild av en vulkan."
          ],
          "choices": [
            "STENAR med en bild av en måne.",
            "FOSSIL med en bild av en vulkan.",
            "STENAR med en bild av en vulkan."
          ],
          "answer": 2,
          "wrong": [
            "Texten är STENAR, men bilden visar en måne.",
            "Vulkanen finns, men texten är FOSSIL.",
            null
          ],
          "why": "Montern är märkt STENAR och har vulkanbilden."
        }
      ]
    },
    {
      "id": "star-observatory",
      "group": "explore",
      "emoji": "🔭",
      "title": "Stjärnskådarens kvällskarta",
      "intro": "På observatoriets lekhörna finns kartor över stjärnhimlen. En liten teckning är försvunnen.",
      "ending": "Stjärnteckningen hittas i kartlådan. Stjärnskådarna kan fortsätta titta på natthimlen.",
      "keepsake": {
        "emoji": "🌠",
        "name": "Stjärnkartans märke"
      },
      "stages": [
        {
          "title": "Läs stjärnfiguren",
          "scene": "Tre teckningar ligger på bordet.",
          "clues": [
            "Fyra stjärnor bildar en fyrkant.",
            "En extra stjärna finns ovanför fyrkanten."
          ],
          "choices": [
            "Fyra stjärnor i fyrkant med en ovanför.",
            "Fyra stjärnor i fyrkant utan extra stjärna.",
            "En stjärna ovanför en triangel."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Fyrkanten finns, men stjärnan ovanför saknas.",
            "Stjärnan ovanför finns, men figuren är en triangel."
          ],
          "why": "En stjärna finns ovanför fyrkanten av fyra stjärnor."
        },
        {
          "title": "Titta genom fönstret",
          "scene": "En bild beskriver var någon stod och tittade.",
          "clues": [
            "Platsen har ett stort fönster.",
            "Bredvid fönstret står en kikare."
          ],
          "choices": [
            "Stort fönster utan kikare.",
            "Stort fönster med kikare bredvid.",
            "Kikare bredvid en stängd dörr utan fönster."
          ],
          "answer": 1,
          "wrong": [
            "Fönstret finns, men kikaren saknas.",
            null,
            "Kikaren finns, men inget stort fönster."
          ],
          "why": "Det stora fönstret står bredvid kikaren."
        },
        {
          "title": "Kartan i rätt låda",
          "scene": "Tre kartlådor är märkta med bilder.",
          "clues": [
            "På lådan finns en måne.",
            "Under månen står ordet NATT."
          ],
          "choices": [
            "Måne med ordet DAG.",
            "Sol med ordet NATT.",
            "Måne med ordet NATT."
          ],
          "answer": 2,
          "wrong": [
            "Bilden visar månen, men ordet är DAG.",
            "Ordet NATT stämmer, men bilden visar solen.",
            null
          ],
          "why": "Rätt låda har månen och ordet NATT."
        }
      ]
    },
    {
      "id": "robot-workshop",
      "group": "creative",
      "emoji": "🤖",
      "title": "Robotverkstadens vänliga uppfinning",
      "intro": "Uppfinnaren Kim bygger en liten hjälprobot av fantasidelar. Hjälp Kim läsa ritningen.",
      "ending": "Hjälproboten är färdig på ritningen. Den kan nu dela ut böcker till alla i lekhörnan.",
      "keepsake": {
        "emoji": "⚙️",
        "name": "Uppfinnarens kugghjul"
      },
      "stages": [
        {
          "title": "Hitta ritningen",
          "scene": "Tre papper ligger på verkstadsbordet.",
          "clues": [
            "Bilden visar en robot.",
            "Robotens huvud är fyrkantigt."
          ],
          "choices": [
            "Robot med fyrkantigt huvud.",
            "Robot med runt huvud.",
            "Fyrkantigt huvud på en kattfigur."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Det är en robot, men huvudet är runt.",
            "Huvudet är fyrkantigt, men figuren är en katt."
          ],
          "why": "Ritningen visar en robot med fyrkantigt huvud."
        },
        {
          "title": "Vad ska roboten göra?",
          "scene": "Kim vill skapa en robot som hjälper till i biblioteket.",
          "clues": [
            "Roboten ska bära böcker.",
            "Den ska lämna böckerna på en hylla."
          ],
          "choices": [
            "Roboten bär böcker till ett bord.",
            "Roboten bär böcker till en hylla.",
            "Roboten ställer leksaker på en hylla."
          ],
          "answer": 1,
          "wrong": [
            "Böckerna bärs, men läggs på bordet.",
            null,
            "Hyllan används, men roboten bär leksaker i stället för böcker."
          ],
          "why": "Roboten bär böckerna och lämnar dem på hyllan."
        },
        {
          "title": "Startknappens symbol",
          "scene": "Det finns tre knappar på den ritade roboten.",
          "clues": [
            "På knappen står HJÄLP.",
            "Bredvid texten finns ett grönt hjärta."
          ],
          "choices": [
            "HJÄLP med röd stjärna.",
            "START med grönt hjärta.",
            "HJÄLP med grönt hjärta."
          ],
          "answer": 2,
          "wrong": [
            "Ordet är HJÄLP, men bilden visar en röd stjärna.",
            "Hjärtat är grönt, men det står START.",
            null
          ],
          "why": "På knappen står HJÄLP bredvid ett grönt hjärta."
        }
      ]
    },
    {
      "id": "comic-studio",
      "group": "creative",
      "emoji": "🗯️",
      "title": "Seriestudions försvunna pratbubbla",
      "intro": "En tecknare ska göra en rolig serie om två vänner. En pratbubbla har hamnat på fel sida.",
      "ending": "Serien får rätt pratbubbla och går att läsa från början till slut. Tecknaren visar den stolt.",
      "keepsake": {
        "emoji": "✏️",
        "name": "Serietecknarens penna"
      },
      "stages": [
        {
          "title": "Vem pratar?",
          "scene": "Tre rutor visar vem som säger hej.",
          "clues": [
            "En kanin säger något.",
            "I bubblan står ordet HEJ."
          ],
          "choices": [
            "Kanin med pratbubblan HEJ.",
            "Kanin med pratbubblan OJ.",
            "Räv med pratbubblan HEJ."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Kaninen pratar, men säger OJ.",
            "HEJ står där, men det är räven som pratar."
          ],
          "why": "Kaninen säger HEJ i pratbubblan."
        },
        {
          "title": "Berättelsens ordning",
          "scene": "Tecknaren vill att händelserna ska gå att förstå.",
          "clues": [
            "Först hittar vännen ett brev.",
            "Sedan läser vännen brevet."
          ],
          "choices": [
            "Vännen läser brevet innan det hittas.",
            "Vännen hittar brevet och läser det sedan.",
            "Vännen hittar ett brev och lägger det i en låda utan att läsa."
          ],
          "answer": 1,
          "wrong": [
            "Vännen läser brevet, men händelserna kommer i fel ordning.",
            null,
            "Brevet hittas, men det blir aldrig läst."
          ],
          "why": "Vännen hittar först brevet och läser det sedan."
        },
        {
          "title": "Den sista pratbubblan",
          "scene": "En vän vill tacka den som hjälpte.",
          "clues": [
            "Bubblan innehåller ordet TACK.",
            "Meningen förklarar vad vännen tackar för."
          ],
          "choices": [
            "TACK!",
            "Du hjälpte mig med boken!",
            "TACK för att du hjälpte mig med boken!"
          ],
          "answer": 2,
          "wrong": [
            "TACK finns, men man får inte veta vad tacket gäller.",
            "Hjälpen beskrivs, men ordet TACK saknas.",
            null
          ],
          "why": "TACK står där, och meningen berättar varför vännen tackar."
        }
      ]
    },
    {
      "id": "music-festival",
      "group": "creative",
      "emoji": "🎷",
      "title": "Musikfestens hemliga program",
      "intro": "På en vänlig musikfest har programbladet tappats bort. Hjälp arrangörerna ordna spelningen.",
      "ending": "Musikfestens program är klart. Alla kan lyssna, sjunga och spela tillsammans.",
      "keepsake": {
        "emoji": "🎼",
        "name": "Festmusikens notblad"
      },
      "stages": [
        {
          "title": "Hitta musikscenen",
          "scene": "Tre scener har olika skyltar.",
          "clues": [
            "Scenen har en bild av en gitarr.",
            "På skylten står MUSIK."
          ],
          "choices": [
            "Gitarr och ordet MUSIK.",
            "Gitarr och ordet DANS.",
            "Trumma och ordet MUSIK."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Gitarren finns, men det står DANS.",
            "Ordet MUSIK stämmer, men bilden visar en trumma."
          ],
          "why": "Skylten visar gitarren och ordet MUSIK."
        },
        {
          "title": "Ordning på låtarna",
          "scene": "En lapp beskriver vad som ska spelas först och sist.",
          "clues": [
            "Första låten är lugn.",
            "Sista låten är snabb."
          ],
          "choices": [
            "Snabb sång, lugn sång.",
            "Lugn sång, snabb sång.",
            "Lugn sång, lugn sång."
          ],
          "answer": 1,
          "wrong": [
            "Det börjar snabbt och slutar lugnt i stället.",
            null,
            "Den första är lugn, men den sista är inte snabb."
          ],
          "why": "Programmet börjar lugnt och slutar med snabb musik."
        },
        {
          "title": "Vänliga applåder",
          "scene": "Arrangören vill hitta en lapp som passar efter spelningen.",
          "clues": [
            "Lappen innehåller ett tack.",
            "Den berömmer att musikerna spelade tillsammans."
          ],
          "choices": [
            "Tack för att du kom!",
            "Ni spelade fint tillsammans!",
            "Tack för att ni spelade tillsammans!"
          ],
          "answer": 2,
          "wrong": [
            "Det finns ett tack, men inget om att spela tillsammans.",
            "Samarbetet beröms, men ordet tack saknas.",
            null
          ],
          "why": "Lappen tackar musikerna för att de spelade tillsammans."
        }
      ]
    },
    {
      "id": "puppet-theater",
      "group": "creative",
      "emoji": "🪆",
      "title": "Dockteaterns försvunna skugga",
      "intro": "På dockteatern ska tre figurer spela en saga. En av skuggfigurerna är borta.",
      "ending": "Skuggfiguren hittas i rätt låda. Dockteatern kan nu spela sin berättelse.",
      "keepsake": {
        "emoji": "🎭",
        "name": "Skuggteatermärket"
      },
      "stages": [
        {
          "title": "Skuggans form",
          "scene": "Tecknaren beskriver figuren som saknas.",
          "clues": [
            "Figuren har långa öron.",
            "Den håller en liten blomma."
          ],
          "choices": [
            "Kanin med långa öron och blomma.",
            "Kanin med långa öron utan blomma.",
            "Kortörad figur med en blomma."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Öronen är långa, men blomman saknas.",
            "Blomman finns, men öronen är korta."
          ],
          "why": "Kaninfiguren har långa öron och en blomma."
        },
        {
          "title": "Var står lampan?",
          "scene": "Dockorna ska bli skuggor på en vit duk.",
          "clues": [
            "En lampa lyser mot duken.",
            "Figuren står mellan lampan och duken."
          ],
          "choices": [
            "Lampa mot duk, men figuren står bakom lampan.",
            "Lampa mot duk och figur mellan lampan och duken.",
            "Figur mellan en släckt lampa och duk."
          ],
          "answer": 1,
          "wrong": [
            "Lampan lyser mot duken, men figuren står på fel sida.",
            null,
            "Figuren står rätt, men lampan är släckt och lyser inte."
          ],
          "why": "Lampan lyser och figuren står mellan ljuset och duken."
        },
        {
          "title": "Ordna scenen",
          "scene": "Sagan har tre delar som måste komma i ordning.",
          "clues": [
            "Först hittar dockan en nyckel.",
            "Sist öppnar dockan en dörr."
          ],
          "choices": [
            "Dörren öppnas och nyckeln hittas efteråt.",
            "Nyckeln hittas och läggs undan utan att dörren öppnas.",
            "Nyckeln hittas och därefter öppnas dörren."
          ],
          "answer": 2,
          "wrong": [
            "Dörren öppnas, men nyckeln hittas inte först.",
            "Nyckeln hittas, men dörren öppnas aldrig.",
            null
          ],
          "why": "Först hittar dockan nyckeln och sedan öppnar den dörren."
        }
      ]
    },
    {
      "id": "photo-club",
      "group": "creative",
      "emoji": "📸",
      "title": "Fotoklubbens försvunna bildtext",
      "intro": "Fotoklubben gör en utställning av fantasifoton. En bildtext har hamnat vid fel foto.",
      "ending": "Fotot och bildtexten sitter tillsammans igen. Utställningen går att förstå utan att se varje bild.",
      "keepsake": {
        "emoji": "🖼️",
        "name": "Fotoklubbens bildram"
      },
      "stages": [
        {
          "title": "Hitta rätt motiv",
          "scene": "Fotografen beskriver ett foto med två detaljer.",
          "clues": [
            "På fotot syns en cykel.",
            "Bredvid cykeln står en blomkruka."
          ],
          "choices": [
            "Cykel med blomkruka bredvid.",
            "Cykel bredvid en papperskorg.",
            "Blomkruka bredvid en sparkcykel."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Cykeln syns, men blomkrukan saknas.",
            "Blomkrukan finns, men fordonet är en sparkcykel."
          ],
          "why": "Fotot visar både cykeln och blomkrukan."
        },
        {
          "title": "Vilken bildtext passar?",
          "scene": "En bild ska visa hur en vän hjälper en annan.",
          "clues": [
            "Texten handlar om att ge hjälp.",
            "Den berättar vem som blir hjälpt."
          ],
          "choices": [
            "Någon hjälper till i dag.",
            "Sara hjälper Leo att bära böcker.",
            "Sara och Leo går förbi skolan."
          ],
          "answer": 1,
          "wrong": [
            "Hjälp nämns, men inte vem som får hjälpen.",
            null,
            "Båda vännerna nämns, men ingen hjälp beskrivs."
          ],
          "why": "Bildtexten berättar att Sara hjälper Leo och vad hjälpen gäller."
        },
        {
          "title": "Utställningens sista ram",
          "scene": "Tre ramar står på ett bord.",
          "clues": [
            "Ramen är gjord av trä.",
            "En gul stjärna sitter överst."
          ],
          "choices": [
            "Träram med röd stjärna.",
            "Metallram med gul stjärna.",
            "Träram med gul stjärna."
          ],
          "answer": 2,
          "wrong": [
            "Ramen är av trä, men stjärnan är röd.",
            "Stjärnan är gul, men ramen är av metall.",
            null
          ],
          "why": "Träramen har en gul stjärna överst."
        }
      ]
    }
  ];
  for(const story of STORIES){
    for(const step of story.stages){
      Object.freeze(step.clues);Object.freeze(step.choices);Object.freeze(step.wrong);Object.freeze(step);
    }
    Object.freeze(story.stages);Object.freeze(story.keepsake);Object.freeze(story);
  }
  return {STORIES:Object.freeze(STORIES)};
});
