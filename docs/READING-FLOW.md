# Läs först – förstå sedan

## Problemet från barnets provspelning

Berättelsen och förklaringen var för små jämfört med svaren. Barnet tryckte
på Nästa utan att uppfatta vad det skulle läsa.

## Två steg i Träna

1. Läs berättelsen. Stor text visas före svaren; ett tydligt knapptryck
   öppnar dem efter läsningen.
2. Besvara ordfrågan. Den ursprungliga frågan poängsätts som vanligt.
3. Läs förklaringen och exemplet, som får en egen stor yta utan
   konkurrerande belöningar.
4. Öppna Aha-frågan när du är redo. Välj vilken NY berättelse eller
   definition som passar. Tre redaktionellt skrivna alternativ visas.
5. Om det blir fel: läs igen, prova på nytt utan minuspoäng. Nästa ord
   visas först när Aha-frågan är klar.

Det går inte att bevisa läsning med en knapp eller ett rätt kryss:
uppföljningen ska i stället prova om barnet kan använda ordet i en ny
situation. Efter omgången visas hur många Aha-frågor som klarades direkt,
åtskilt från ordjaktens ursprungliga poäng.

**Testa dig** har ingen lässpärr mitt i provet och visar aldrig facit
innan provet är klart.

## Innehållskvalitet

Nya ordscener hämtas från den kuraterade vardagsbanken. Vissa ord fick
särskilda läsdistraktorer (fältet readingDistractors i
public/data/word-contexts.json) som aldrig ändrar vanliga frågors
svarsalternativ. Uttryck hämtar nya exempel från surprises.json och
missions.json. Ord utan skrivna berättelser använder befintliga
orddefinitioner. Inga nya berättelser eller bilder genereras under spel.

## Nästa barnprovspelning

Låt barnet prova fem frågor utan att tala om vad det ska klicka på.
Observera om barnet läser berättelsen, märker förklaringen efter svaret
och kan berätta med egna ord vad ordet betyder efteråt. Prova både korta
ord, ett långt uttryck och en vardagssituation, gärna även på mobil.
Ett rätt Aha-svar är inte automatiskt ett bevis på djup förståelse.

Kör kontrollen med:

    npm run check
    python tests/browser_reading_flow.py
    python tests/browser_reading_summary.py

Testwebbläsaren injicerar resurser i about:blank. Verifiera
localStorage över verklig omladdning och offline separat före lansering.


## Barnprovspelning: förtydligad läsning
- Kartan börjar ihopvikt så berättelsen syns först, även på mobil.
- Barnet får ett eget lässteg och får först därefter se svaren.
- Efter svaret döljs frågan och definitionen visas stort med exempel.
- Aha-frågan visas först efter lässteget. Förklaringen döljs under Aha-frågan, men går att öppna igen frivilligt.
- Vid första Aha-felet återkommer förklaringen och svaren flyttas om.
- Vid andra felet får barnet det rätta exemplet förklarat och går vidare utan att fastna. Det registreras som handledd förståelse, **inte** som rätt direkt.
- Testläget får samma visuella berättelseprioritet men aldrig facit mitt i omgången.
- Inga extra provpoäng, minustal eller stjärnor ges för Aha-frågorna. Inget tidsstyrt lästvång används.

Rätt svar på Aha-frågan bevisar inte att barnet läste. Nästa barnprovspelning bör kontrollera att barnet själv kan beskriva ett nytt exempel.

## Lekfulla ordfrågor
I otidtagna ordjakter (utom högskoleprovsnivån och ordningsuppgifter) får frågans svarsalternativ ett litet draghandtag och en illustrerad port. Fyra egenritade SVG-miljöer (skog, rymd, hav och slott) används i de tolv världarna med egna namn och symboler. Bilderna är dekorativa, inte nya facitbilder. Läsgaten och frågetextens storlek ändras inte. Port och ägg visas först när svarsalternativen är synliga.

Barnet kan fortfarande trycka på ett svar eller använda tangentbordet. För drag används pointer capture på handtaget (mus, penna eller pekskärm); resten av kortet är en vanlig knapp och sidan kan scrollas som tidigare. Endast ett drag som avslutas inom porten för aktuell fråga anropar ordinarie submit. Avbrutet drag, utanförsläpp, dold sida eller byte av fråga rensas utan svar. Ingen extra poäng eller separat bedömning.

I Träna finns ett frivilligt illustrerat ledtrådsägg. Det öppnas vid tryck och ger en strategi för frågetypen (läs sammanhang, jämför bilder, läs hela uttrycket etc.), inte ordspecifika ledtrådar eller facit. Strategin är oberoende av rätt svar och påverkar därför inte den befintliga kunskapsregistreringen. I Testa dig visas ingen ledtråd eller rätt/fel-feedback. Tidtagna omgångar och högskoleprovsnivån använder den vanliga kompakta frågevyn. Aha-läsgaten och poängsättningen är oförändrade.

Frivillig webbläsarharness laddar nu produktionssidans script i faktisk ordning, inklusive tidigare saknade camp-moduler. Camp-testets omladdning ersätts med en ny sida seedad med sparad historik; about:blank-shimmen kan inte verifiera riktig origin-persistens. `tests/browser_question_play.py` täcker läsgate, ägg, drag, tryck och testläge; måste köras i riktig Chromium. Ingen ny CI-jobbtyp eller nya paket. Barnprovspelning och visuell kontroll återstår.

## Sammanhängande mysterier i den vanliga ordjakten
Otidtagna omgångar i Träna och Testa dig (utom högskoleprovsnivån) använder ett av tolv redaktionellt skrivna mysterier. En karta, ett lås, en lykta och en kista bildar en berättelse i fyra delar. För korta repetitionsrundor används ett mindre antal delar som fortfarande slutar med kistan. Varje världs berättelse har en egen inledning, platsbeskrivningar och ett slut. De tidigare SVG-bakgrunderna har kompletterats med fyra egenritade föremål, som ersätter porten som visuellt mål för svarkortet.

Berättelsen går framåt efter avklarade frågor, aldrig efter antal rätt. Barnet kan läsa uppdragets berättelse, trycka på svaret som förut eller dra från kortets handtag till föremålet. Svar, frågegenerator, facit och bedömning ändras inte. Ordningsuppgifter behåller sina kontroller men ingår i samma berättelse. Efter varje träningsfrågas befintliga Aha-gate (även när barnet fick stöd) visas ett nytt spår. I Testa dig kommer inga facitreaktioner eller ledtrådar under omgången; endast den neutrala berättelseutvecklingen syns. Slutet visas på resultatsidan före omgångens kunskapsresultat. Inga extra klick krävs för berättelsens framsteg. Resultatsiffrorna kan öppnas i en valfri detaljvy under mysteriet; läget Träna/Testa dig och slutresultatet är fortfarande tydliga. Tidtagna omgångar och högskoleprovsnivån har kvar kompakt layout. Ingen ny persistens, inga förlorade belöningar, ingen slumpmässig utdelning eller automatisk ny runda.

Draghanteringen avvisar även en eventuell pekarklickhändelse från ett avbrutet drag, men vanlig tryckning och tangentbord fungerar som tidigare. Logiktester täcker samtliga tolv världar, rundlängder 1–25, gränser mellan kapitel och identiska berättelser för båda spellägen oavsett resultat. Det frivilliga Chromium-testet omfattar också avbrutet drag, Aha-gate, neutral berättelse i prov och slutskärm. Visuell kontroll på verkliga enheter och barnprovspelning återstår.

## Reaktiva föremål och illustrerade upptäckter
Varje mysteriedel har en exakt lokal andel av genomförda frågor. Kartans gröna väg ritas fram, nyckeln vrider sig, låsets dörr öppnas när delen är färdig, lyktan får en allt starkare glöd och kistans lock öppnas. I kistan syns ett av tio egenritade fynd som passar världens berättelse (bland annat stjärnfrö, pärla, ägg, sagobok och regnbåge). Alla tolv världars avslut väljer ett bestämt fynd. Frågans dragmål, upptäcktsbilden efter Aha och slutbilden delar samma SVG-konst, med unika lokala ID:n på kopiorna. Nästa fråga i samma del visar det tillstånd som upptäckten just nådde. I provläget uppdateras endast den neutrala bilden när nästa fråga visas; ingen reaktion beror på ett svarsfacit.

Ledtrådsägget visar nu en av fyra illustrerade fantasikompisar beroende på miljö: Lövkompisen, Stjärnkompisen, Bubbelkompisen eller Sagokompis-draken. Samma tankestrategi som tidigare visas vid frivilligt tryck i träning. Inga nya frågor, poäng, kunskapsobservationer, lagringsfält eller belöningskrav. Animationer är korta och kosmetiska; den slutliga bilden och texten finns direkt även vid reducerad rörelse. Nästa-knappen väntar inte på någon animation. Inga nya paket eller CI-jobb.

Logiktester kontrollerar exakta bildtillstånd för alla rundlängder 1–25 i samtliga tolv världar, kontinuitet mellan upptäckt och nästa fråga, slutbilder och äggvarianter. Frivilligt webbläsartest kontrollerar bildval och unika SVG-ID:n; riktig visuell granskning och barnprovspelning återstår.

## Hemlig bild, kristallkula och meddelanden
Mysteriet har en liten illustrerad bild som är täckt av lika många bildbitar som omgången har frågor. Varje genomförd fråga avtäcker exakt en bit. Alla delar täcker tillsammans hela SVG-landskapet, även vid en kort repetitionsrunda eller ett udda antal frågor. Ordningen är förutbestämd (mitten först, sedan utåt). Frågevyn visar tidigare genomförda frågor, träningsupptäckten visar den nya biten först efter Aha och slutbilden är komplett. I Testa dig syns den nya biten på nästa fråga oberoende av facit. Bilden återanvänder endast landskapet, inte den hemliga kistans innehåll.

På varannan valfråga i träning är tankeledtråden en illustrerad kristallkula i stället för ett ägg. Ett tryck visar samma typ av tankestrategi som tidigare. Öppning är frivillig; prov får aldrig ledtråd. Frågetexten visas som brev eller pergamentrulle utan extra läsgate, och alla svarkort i en fråga delar samma löv-, fjärils-, kristall- eller rullstil. Stilen styrs enbart av positionen i omgången och ändrar aldrig fråga, svar, text, poäng, ledtrådsinnehåll eller kunskapsobservationer. Vanliga tryck, tangentbord och drag fungerar som tidigare. Ingen ny lagring, inga nätanrop eller nya CI-jobb. Bilderna är lokala vektorer och effekter respekterar reducerad rörelse. Visuell kontroll och barnprovspelning återstår.

## Ord som blir handlingar
Åtta ord får redaktionellt skrivna handlingar i ordinarie träning: elastisk, genomskinlig, magnetisk, skör, virvlande, lysande, generös och varsam. När generatorn redan har valt ett av dessa ord som bild- eller betydelsefråga i en otidtagad träningsomgång ersätts alternativen av fyra konkreta föremål eller handlingar. Dra kortet till det illustrerade målet eller tryck som tidigare. Efter första svaret visas det ordinarie facit och en kort illustrerad genomgång av den rätta handlingen. Även vid fel visas den rätta handlingen uttryckligen som ett exempel. Aha-gaten och mysteriet är oförändrade.

Ordval, ordning, antal frågor, bild-/betydelseklassificering och poängberäkning bevaras. Handlingarna räknas som igenkänning genom konkreta exempel, inte som självständiga transferbevis. Andra adaptiva frågetyper, riktade kontextövningar/repetitioner, tidtagna omgångar och Testa dig är oförändrade. Aha-fallbacken blandar inte handlingsalternativ med definitioner. Inga nya lagringsfält eller CI-jobb, inga krav på drag eller animation. Åtta lokala SVG-scener visar neutrala mål och rätta exempel. Gemensamt tryck/drag-gränssnitt, inte fullständiga fysiksimuleringar. Logiktester verifierar ord, svar, igenkänningsklass, Aha och isolering. Ett frivilligt Chromium-test täcker ett reproducerbart elastiskt uppdrag. Visuell kontroll och barnprovspelning återstår.

## Prova ordets betydelse direkt
Två ytterligare uppdrag (vissnad och trasslig) utökar ordhandlingarna till tio. Efter ett besvarat träningsuppdrag kan barnet frivilligt experimentera med fem illustrationer: sträcka gummibandet och låta det dra ihop sig, flytta magneten så järnringen följer med, vrida löven runt mitten, visa hur en levande växt som vissnat av vattenbrist kan återhämta sig över tid, och reda ut garnets slingor i tre steg. Detta är förenklade bilder, inte naturvetenskapliga simuleringar. Växtens återhämtning är ett möjligt berättelseförlopp, inte en garanti för alla vissnade växter.

Illustrationen reagerar på horisontellt drag med pekare, samtidigt som vertikal scroll förblir möjlig. Samma tillstånd kan styras med ett namngivet range-reglage (tangentbord, pekskärm), Börja om och Prova ett steg. Den rätta förklaringen visas först, oberoende av om det tidigare svaret var rätt. Experimentet kan hoppas över, repeteras eller ändras utan begränsning under aktuell feedbackvy. Ingen ny fråga, poäng, historikpost, spärr för Aha eller krav på fysisk precision. Rörelsen är direkt styrd av barnet och ingen kontinuerlig animation körs i bakgrunden. Tillståndet rensas när frågan lämnas; prov och tidtagning är oförändrade. Logiktester täcker alla tio handlingar, begränsade reglagevärden, reversibla visuella modeller och pekarkoordinater. Frivilligt webbläsartest täcker reglage, knapp, tangentbord och drag. Riktig webbläsarverifiering och barnprovspelning återstår.
