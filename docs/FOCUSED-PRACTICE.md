# Ordjakten 0.15 – 🎯 Träna det här!

## Vad är funktionen?

I **Min ordstig** kan barnet öppna ett ord eller uttryck, se vilka uppgiftstyper det tidigare provat, och trycka **🎯 Träna det här!** eller välja någon av övningarna med namn. Spelet rekommenderar ett moment med svaga resultat, annars ett ännu oprövat moment. En påbörjad övning består av **2–3 små uppgifter** och har ingen timer. Användaren behöver inte ändra övriga spelinställningar.

Exempel: Om barnet förstår *grumlig* som definition men missar vardagsfrågor väljer Ordjakten **Ord i vardagen**. En kort övning använder tre **olika, redan skrivna** berättelser (vatten i glas, sjö, skola) och förklarar varför ordet passar efter varje svar.

## Pedagogiska regler

- Frågor om ett visst begrepp använder enbart innehåll som redan finns i projektets granskade ordbank, 129 vardagsscener eller 25 uttrycksuppdrag. Vi genererar inte nya texter eller illustrationer automatiskt.
- När måltypen är **vardag** och tre berättelser finns blir det tre skilda situationer utan textrepetition inom omgången. Nästa besök börjar efter den senast visade scenen när sådan framstegsdata finns.
- När det inte finns tre varianter blandar vi i stället kompletterande redan skrivna uppgifter om *samma ord* (t.ex. välj rätt betydelse och välj rätt ord). Vi hittar aldrig på ett tredje exempel bara för att fylla en kvot.
- Uttryck tränas med betydelse, vald mening och rätt ordning. En ordningsfråga kan styras med tryck, **Ångra** och **Börja om**, aldrig enbart dragning.
- Lätt med godkänd bild använder bara den tidigare granskade emojin. De sju ord som inte har en säker emoji använder textuppgifter.
- Frågan och alternativen göms när barnet svarat. Då är betydelsen och den situationsanpassade *Aha*-förklaringen det viktigaste.
- Barnet kan sluta när som helst. De redan besvarade färdigheterna sparas (med anonyma innehålls-ID:n) för att kunna ge en bättre rekommendation senare.
- Även tre rätt i rad i en och samma övning **bevisar inte att ett ord behärskas på längre sikt**. En riktig repetitionskö håller därför kvar sitt tidsintervall och kan högst få ett utfall per kort övningsomgång.

## Åtskillnad från test och belöningar

Den här skärmen är **varken en vanlig poängsatt omgång eller Testa dig**. Den skriver därför **inte** till `history.results`, normal stjärnstatistik eller miniuppdragens badges. Den ändrar **inte** nivå, tema, timer eller valt spelläge och kan aldrig visa testfacit. Den uppdaterar bara den befintliga `skillProgress`-historiken och vid avslutad omgång **högst ett** `reviewProgress`-utfall och `mistakes`-post för det valda målmomentet. Därmed kan spelet föreslå riktade frågor senare utan att bokföra tre snabba svar som tre utspridda repetitionsbesök.

Inga nya storage-nycklar, barnprofiler, konton, externa tjänster eller bilder skapas. Export och radering från resultatsidan omfattar även de lokalt lagrade övningarna.

## Arkitektur

- `public/js/focus-practice.js` – ren Node-/webbläsarkompatibel planeringsmodul. `findItem`, `supported`, `recommended`, `create` och `results` saknar DOM, tillstånd och nätverkskoppling. Varje plan innehåller unika frågeinstanser, men samma redaktionella begrepps-ID, så adaptiv historik kan användas säkert.
- `public/js/app.js` – separat `focusPractice`-tillstånd, egen vy, navigering, konkreta Aha-förklaringar och uppdatering av lokala färdigheter. Existerande provspel och deras ID-baserade svarstabell behöver inte ändras för att ett ord ska kunna förekomma flera gånger i riktad träning.
- `public/css/focus-practice.css` – använder appens färgvariabler för mörkt/ljust/hög kontrast samt fokusringar och 320px-layout.
- `public/index.html` – länkar från `Min ordstig`, hemrekommendation, egen minivy.
- `public/sw.js` – uppdaterad offlinecache `ordjakten-static-v15`.

## QA

```sh
npm run check
python tests/browser_focus_practice.py
python tests/browser_learning_map.py
python tests/browser_review.py
python tests/browser_missions.py
python tests/browser_adventures.py
```

`tests/focus-practice.test.js` kontrollerar samtliga **146 begrepp och alla 360 stödda kombinationer av begrepp och uppgiftstyp**, inklusive beskrivningar, svarsalternativ och olika kontextscener. Webbläsartestet provar grumlig över tre scener (inklusive rätt och fel), händelser i rätt ordning, skärmbyte, testa-dig-integritet, synlig förklaring och mobil 320px.

**Kända begränsningar:** Ny träning jämför det aktuella utfallet med tidigare antal försök, men det är inte en kontrollerad pedagogisk effektmätning. Tre olika vardagsscener för samma målord kan fortfarande ge en igenkänningseffekt; en framtida förbättring är kontrasterande uppgifter med *ett annat målord*. Lokal lagring över en **faktisk sidomladdning** och offline/PWA måste fortsatt testas i en normal webbläsare på riktig origin före publicering. De automatiska webbläsartesterna injicerar HTML/JS i en isolerad sida och verifierar inte detta. De manuellt utformade distraktorerna behöver barnprovspelas pedagogiskt.
