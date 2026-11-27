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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
            "Nedanför fiskarna växer koraller."
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
      ]
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
      ]
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
      ]
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
      ]
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
            "En liten stjärna finns på glaset."
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
      ]
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
      ]
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
      ]
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
            "Efter bron finns ett stort träd."
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
          "scene": "Läraren lämnar tre meningar.",
          "clues": [
            "Meddelandet handlar om samarbete.",
            "Det nämner att man hjälper en vän."
          ],
          "choices": [
            "Vi väntar på vår tur.",
            "Jag hjälper min vän men vill göra allt ensam.",
            "Vi samarbetar och hjälper en vän tillsammans."
          ],
          "answer": 2,
          "wrong": [
            "Att vänta på sin tur kan vara bra, men här nämns ingen vän.",
            "En vän får hjälp, men texten beskriver inte samarbete.",
            null
          ],
          "why": "Den sista meningen handlar både om samarbete och att hjälpa en vän."
        }
      ]
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
      ]
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
          "scene": "Iris behöver ett kort till nästa teckning.",
          "clues": [
            "Kortet beskriver ett ljus.",
            "Det nämner att ljuset blinkar."
          ],
          "choices": [
            "En lykta lyser hela natten utan att ändras.",
            "En liten lampa blinkar med sitt ljus.",
            "En dörr öppnas och stängs i vinden."
          ],
          "answer": 1,
          "wrong": [
            "Det är ett ljus, men det blinkar inte.",
            null,
            "Något ändras, men texten handlar inte om ljus."
          ],
          "why": "Lampan lyser och blinkar. Båda delarna står i beskrivningen."
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
      ]
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
            "Bär, glasyr, tallrik.",
            "Glasyr, tallrik, bär.",
            "Tallrik, bär, glasyr."
          ],
          "answer": 1,
          "wrong": [
            "Glasyren kommer efter bäret, inte först.",
            null,
            "Bäret är inte sist och glasyren är inte först."
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
      ]
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
            "En klar sjö ligger nedanför berget."
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
            "En liten fyr står på ön.",
            "Runt ön syns blått hav."
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
            "Ett torg har en fontän.",
            "Bredvid fontänen växer ett stort träd."
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
      ]
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
            "Under bron finns en blå båge."
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
      ]
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
            "Bollarna ska vara lila."
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
            "Där finns en hylla med böcker.",
            "En liten lykta lyser bredvid hyllan."
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
          "scene": "En älva beskriver vägen till nästa lykta.",
          "clues": [
            "Vägen går förbi en blomma.",
            "Blomman är lila och växer vid en bäck."
          ],
          "choices": [
            "Gul blomma vid bäck.",
            "Lila blomma vid bäck längs vägen.",
            "Lila blomma på en äng utan bäck."
          ],
          "answer": 1,
          "wrong": [
            "Bäcken finns, men blomman är gul.",
            null,
            "Blomman är lila, men det finns ingen bäck."
          ],
          "why": "Vägen passerar en lila blomma vid bäcken."
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
