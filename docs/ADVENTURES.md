# Äventyrsvärldarna i Ordjakten 0.5

Alla tolv är **berättelse- och utseendeteman** ovanpå samma spelmotor och samma 121 ord. Det är inga separata ämnesnivåer. Barn väljer själva vad som känns roligt; vi etiketterar aldrig en värld som särskilt för flickor eller pojkar.

| Värld | Kategori | Fyra platser |
| --- | --- | --- |
| 🌲 Mystiska skogen | Upptäck & utforska | Skogsbrynet → Svampstigen → Uggleträdet → Hemliga gläntan |
| 🚀 Rymdäventyret | Upptäck & utforska | Uppskjutning → Månen → Ringplaneten → Stjärnbasen |
| 🏰 Drakslottet | Upptäck & utforska | Slottsporten → Nyckelrummet → Draksalen → Skattkammaren |
| 🏴‍☠️ Piratjakten | Upptäck & utforska | Piratbåten → Skattkartan → Hemliga ön → Skattkistan |
| 🐬 Havets hemligheter | Upptäck & utforska | Snäckstranden → Korallrevet → Sköldpaddsviken → Delfinbukten |
| 🦕 Dinosaurielandet | Upptäck & utforska | Fotspåren → Dinosaurieägget → Vulkandalen → Dinosauriernas dal |
| 🌸 Sagoträdgården | Magi, djur & musik | Frögläntan → Tulpanstigen → Fjärilsängen → Älvdammen |
| 🦄 Enhörningsdalen | Magi, djur & musik | Gnisterstigen → Regnbågsbron → Hjärtgläntan → Enhörningsängen |
| 🐰 Djurvännernas by | Magi, djur & musik | Kattstugan → Hundparken → Kaninhagen → Vänskapsplatsen |
| 🌈 Regnbågslandet | Magi, djur & musik | Molnporten → Färgverkstaden → Bubbelstigen → Regnbågstornet |
| 🐴 Hästgården | Magi, djur & musik | Foderboden → Ponnyhagen → Ridstigen → Rosettplatsen |
| 🎤 Musikscenen | Magi, djur & musik | Första tonen → Replokalen → Dansgolvet → Stora scenen |

## Pedagogiska och tekniska regler

1. Kartan består av fyra steg vid avrundning uppåt av 25 %, 50 %, 75 % och 100 % av antalet frågor. **Upptäckt plats** kräver bara att barnet har svarat, oavsett rätt eller fel.
2. **Stjärnor ges endast för rätt svar.** De två räknarna är separata och följer verkliga svar.
3. **Träna** visar en kort milstolpe och sedan en tydlig ordförklaring; frågan försvinner när barnet svarat.
4. **Testa dig** avslöjar inte rätt/fel eller förklaring innan testet är klart. Kartan är en neutral framstegsmätare.
5. Om total tid löper ut före sista frågan säger resultatet att äventyret avbröts, och obesvarade frågor räknas inte som fel.
6. Alla världar fungerar med mörkt/ljust/auto/hög kontrast och valfri ordkompis, svårighet och timer.
7. Urvalet av frågor, facit och tidgränser får **aldrig** bero på vald värld. Tema är presentation, inte en belöning eller köp-funktion.
8. Kortens emoji visar bara världens motiv. Den används **aldrig** som illustration till det ord barnet ska gissa. Det är ordbankens kuraterade bilder som används på lätt nivå.

## Arkitektur

- `public/js/adventures.js` är kanonisk källa för världen, kategori, intro, slutscen och kartans fyra platser.
- `public/css/adventures.css` definierar särskiljande accentfärger för varje värld. Temafärger hålls åtskilda från semantisk grön/röd svarsfärg.
- `public/js/app.js` bygger alla tolv valkort direkt från världsdatan, så att UI och innehåll inte kan glida isär.
- `public/js/engine.js` validerar och sparar världs-ID. Testerna kontrollerar att dess ID-lista är identisk med världsdatan.
- `tests/adventures.test.js` testar alla världs-ID, unik ordning, kartgränser och gammal resultathistorik.
- `tests/browser_adventures.py` testar 12 världar i Chromium, mobilbredd, ljus/mörk tema, feedback och provsekretess.

## Nästa steg

Låt barn 8–10 år välja fritt mellan världarna och notera vilka som lockar. Granska alla illustrerade frågor separat, och kontrollera att kartans framsteg inte förväxlas med stjärnpoäng.

## Nytt i 0.5 – riktiga äventyrskartor utan bildfiler

- Alla tolv teman har nu en egen ritad SVG-miljö: skogsträd, planeter, slott, piratö, koraller, vulkan, blommor, regnbåge, djurby, hästgård och musikscen.
- En slingrande väg och en liten stjärnmarkör visar var barnet befinner sig. Stjärnmarkören på kartan betyder **position** och får inte förväxlas med poängbelöningar.
- Delmålen markeras på kartan efter 25, 50, 75 och 100 procent av **besvarade frågor**, oavsett om de var rätt eller fel.
- Namn och trösklar finns alltid i en vanlig HTML-lista under kartan. Det gör mobil och skärmläsare oberoende av SVG-figurernas storlek.
- Startsidan visar en liten förhandskarta när man väljer värld.
- Kartan uppdaterar bara markörer och färdväg vid nya svar; den skapas inte om i onödan.
- Varje värld ritas med SVG i koden och fungerar helt offline. Inga externa filer, upphovsrättsberoenden eller bildgenerering behövs.
- Äventyrsfärger är skilda från appens mörkt/ljust/auto och semantiska rätt/fel. `prefers-reduced-motion` och hög kontrast respekteras.

### Arkitektur för SVG

`public/js/adventure-map.js` är en **ren presentationsmodul**. Den anropar `adventures.js` för platser och låsningsgränser, men den är aldrig en källa till frågorna eller deras facit. `public/css/adventures.css` definierar teman med CSS-variabler och kan lätt få nya världar. `tests/maps.test.js` säkerställer samtliga 12 vektorvärldar och korrekt progress.
