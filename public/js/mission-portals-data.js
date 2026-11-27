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
            "Rummet med ljudböcker har en klocka ovanför dörren.",
            "Rummet med ljudböcker har en stjärna ovanför.",
            "Rummet med målningar har en klocka ovanför."
          ],
          "answer": 0,
          "wrong": [
            null,
            "Böckerna passar, men klockan saknas.",
            "Klockan finns, men böckerna handlar inte om ljud."
          ],
          "why": "Både ljudböcker och en klocka finns vid rummet."
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
        "name": "Fossilmärket"
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
            "Fyndet ligger framme där alla kan röra det.",
            "Fyndet ligger skyddat i en låda utan glas.",
            "Fyndet ligger i en skyddad glasmonter."
          ],
          "answer": 2,
          "wrong": [
            "Det är synligt, men inte skyddat.",
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
            "Grönt, blått, rött.",
            "Rött, grönt, blått.",
            "Rött, blått, grönt."
          ],
          "answer": 2,
          "wrong": [
            "Rött kommer sist, inte före blått.",
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
            "En stark smäll från en dörr.",
            "Ett svagt pling från en klocka.",
            "En svag viskning i vinden."
          ],
          "answer": 1,
          "wrong": [
            "Det är ett starkt ljud, inte ett svagt pling.",
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
        "name": "Djungelboken"
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
            "Två vänner vinkar åt varandra.",
            "En vän bär alla böcker själv.",
            "Två vänner bär böckerna tillsammans."
          ],
          "answer": 2,
          "wrong": [
            "Två vänner syns, men de bär inga böcker.",
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
