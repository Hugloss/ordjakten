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

## Fem material- och rörelseexperiment
Ordhandlingarna har nu 15 ord och 10 direkt styrbara experiment. Speglande visar symmetrisk rörelse på båda sidor om en spegellinje; studsande visar bollens fall och avtagande studsar när barnet drar tiden framåt; hal jämför två klossar som får samma knuff på is och sträv matta; porös visar vatten i en svamps öppna porer; klibbig låter fyra pappersstjärnor fästa på ett limkort. Bilderna är förenklade exempel, inte mätningar eller fysikmodeller med kalibrerade värden. Alla experiment kan dras bakåt och framåt, styras med tangentbord eller hoppas över. De visar rätt exempel först efter svaret, utan nya krav, extra bedömning eller historikposter. Inga nya CI-jobb. Magnetens nolläge normaliseras till positiv noll: Node:s strikta jämförelse hade upptäckt negativ noll i föregående körning. Nya tester kontrollerar symmetri, studsarnas kontakt med golvet, begränsade glidsträckor, vattenfyllnad och fyra fäststeg. Webbläsartesterna är utökade men behöver köras på verkliga enheter.

## Magiska material och rörelser
Åtta nya ordhandlingar med direkt styrbara illustrationer utökar innehållet till 23 handlingar och 18 experiment: glittrig (flytta ljuset över kristallen), skummande (bilda bubblor), dallrande (följ geléns fram- och återgående rörelse), skrovlig (förstoringsglas längs en ojämn kontur), frodig (växtlighet över tid), grumlig (lerpartiklar i vatten), ihålig (genomskärning av öppet rör och kula som passerar) och flygande (fjäril längs blomsterstig). Samma frivilliga drag, reglage och stegknappar i återkopplingen; inga nya obligatoriska moment eller extra poäng. Illustrationerna är förenklade modeller, inte kalibrerade simuleringar. Bildrenderingen kopierar nu endast aktuell SVG-scen till respektive värd i stället för hela mallen. Frågeurval, Aha, provläge och historikstruktur bevaras. Logiktester täcker alla 23 uppdrag, 18 experiment och gränsvärden; webbläsarregressionen utökas med alla åtta nya scener. Ingen ny CI-jobbtyp eller externt paket. Visuell kontroll i webbläsare och barnprovspelning återstår.

## Samverkande ord och djuruttryck
Fyra befintliga handlingar fördjupas med ett relaterat ord: magnetisk + hal, genomskinlig + lysande, skör + mjuk samt vissnad + frodig. Det primära ordet ger fortfarande exakt en bedömd fråga; relaterade ord visas och förklaras i sammanhanget, inte som separat kunskapsbevis. Fönstret och den mjuka korgen har nya direktstyrbara exempel (23 handlingar och 20 experiment totalt). Alla bilder är förenklade och växtens återhämtning förutsätter levande växter och lämpliga förhållanden.
Sex nya uttryck (ut-0026–0031) i den ordinarie uttrycksbanken: skogens konung, djurens konung, öknens skepp, havets enhörning, människans bästa vän och naturens ingenjör. Alla har fem alternativ för prov, berättelse, mening, ordningsuppdrag, Aha och luckbok. Egna SVG-djur visas först efter svaret och i upplåsta serier. Konung betyder kung; namnen är bildliga omskrivningar, inte vetenskapliga artnamn. Älgens smeknamn är vanligt i nutida svenska, historiskt har även björnen kallats skogens konung. Naturens ingenjör kan även beskriva andra arter; bäverfrågan avgränsas till dammbygge. Narvalens långa utskott är en tand. Inga nya historikfält eller CI-jobb. Källor för redaktionell faktakontroll: Naturhistoriska riksmuseet (lejon, hunden, bäver), Göteborgs stad Slottsskogen (älg), Svenska Akademiens ordböcker (konung och skepp), NE (metafor), Chalmers 18 augusti 2026 (narval), Vallentuna kommun 24 oktober 2025 (bävern som naturens ingenjör).

## Redaktionell prioritering: vardagsspråk först
Ordjakten prioriterar etablerade svenska uttryck som barn i åldern 8–10 år sannolikt möter hemma, i skolan, i böcker och i samtal. Ett uttryck måste vara språkligt användbart i flera olika sammanhang och kunna förklaras med en konkret, åldersanpassad situation. En populärvetenskaplig metafor i enstaka texter räcker inte. Sällsynta smeknamn, specialistkunskaper och konstruerade talesätt hör inte hemma i ordinarie prov.
Havets enhörning (ut-0029) och naturens ingenjör (ut-0031) har därför tagits bort ur frågeurvalet, uttrycksluckor och repetition. ID:n är reserverade och återanvänds inte. De två tidigare illustrationsgrupperna är också borttagna. Skogens konung, djurens konung, människans bästa vän och öknens skepp behålls som etablerade bildliga namn; öknens skepp har lägre vardagsrelevans än de nya idiomen och bör omprövas vid fortsatt innehållsgranskning.
Tolv vardagsuttryck med nya ID:n ut-0032–0043: ha fjärilar i magen, tyst som en mus, hungrig som en varg, stark som en oxe, envis som en åsna, listig som en räv, nattuggla, bokmal, arbetsmyra, pigg som en mört, ana ugglor i mossen och köpa grisen i säcken. Alla har fem svarsalternativ, två förklaringsrutor, en serie, nya situationer, meningar och ordningsuppdrag. Totalt 41 uttryck, 123 frågevarianter och 41 berättelseluckor. Inga anspråk på uppmätt frekvens eller garanterad exponering för varje barn: urvalet är en redaktionell prioritering av praktisk nytta. Vid framtida innehållsurval ska vanligt och återanvändbart gå före ovanligt och kuriosa.

## Fler användbara vardagsuttryck (ut-0044–0055)
Tolv nya uttryck: tappa tråden, ha koll på läget, ta sig vatten över huvudet, slå två flugor i en smäll, ha något på hjärtat, ge en hjälpande hand, få kalla fötter, trivas som fisken i vattnet, sätta myror i huvudet, ha huvudet i molnen, gå på nerverna och tur i oturen. Urvalet prioriterar vardagliga samtal, skolsituationer, fritidsaktiviteter och barnets möjlighet att använda uttrycket själv. Det är en redaktionell bedömning av språklig nytta, inte en uppmätt frekvenslista. Varje nytt uttryck har en egen vardagssituation, fem betydelsealternativ för provläget, två förklaringsrutor, exempel, illustrerad serie med befintliga lokala ikoner, nytt Aha-sammanhang, meningsval och ordningsuppgift. Samma spelmekanik, repetitionsmodell och provregler som tidigare. Inga nya beroenden eller CI-jobb. Totalt 121 ord + 53 uttryck = 174 begrepp, 159 ordinarie uttrycksfrågevarianter, 53 berättelseluckor. Innehållskontrollen omfattade varje uttryck i alla tre frågetyper och provläge med fem alternativ samt kontroll av identiska JSON- och webbläsarversioner. Pensionerade ID:n ut-0029 och ut-0031 återanvänds inte. Fullständig CI och visuell kontroll följs upp separat.

## Skolans uppgiftsord – förstå vad läraren ber dig att göra (ut-0056–0069)
Fjorton konkreta instruktioner: jämför, beskriv, förklara, sammanfatta, motivera, argumentera, resonera, ge exempel, redogör för, dra en slutsats, tolka, beräkna, uppskatta och undersök. Varje instruktion innehåller en betydelsefråga, en verklighetstrogen skoluppgift med tre modellerade elevsvar (ett som uppfyller instruktionen), tre arbetssteg i ordning, en separat Aha-uppgift, förklaringsrutor och en illustrerad lucka. Vardagsuttryck, liknelser och skolord har samma befintliga ID-format, repetitionsmodell och bedömningsflöde. Skolorden är markerade med category=school-instruction, inte omdefinierade idiom. Välj ”Skolans uppgifter · 5 frågor” för en otidtagad träningsrunda med fem olika skoluppdrag (praktiska svar, inte bara betydelsefrågor). Skolfiltret är lokalt för rundan och följer med Spela igen, utan nytt sparat inställningsfält. Vanliga rundor kan också innehålla skolord. Träning visar ett konkret exempelsvar och en instruktion efter svaret, medan prov behåller sin fördröjda återkoppling. Ett alternativ får poäng i den skrivna uppgiften, men verkliga skolfrågor kan ha flera likvärdiga korrekta svar; uppgifterna tränar tolkning och igenkänning av en bra svarstyp, inte självständig uppsatsskrivning eller betygskriterier. Förtydliganden: beskriv visar hur, förklara visar varför/hur ett samband fungerar, motivera ger skäl för ett val, argumentera ger argument för en åsikt, resonera utvecklar samband och följder. Ingen extra obligatorisk spelmekanik, inget nytt CI-jobb eller paket. Totalt 121 tidigare ord + 53 vardagsuttryck + 14 skolord = 188 begrepp; 67 uttrycks-/instruktionsposter och 201 ordinarie frågevarianter.

## Barnnära återkoppling på skoluppgifter
Återkoppling ska förklara själva saken, inte bara tala om att svaret är rätt. Alla 14 uppgiftsord har nu kortare definitioner, en konkret förklaring i små steg, en vardagskoppling och en arbetsregel. Exempel: kall is tar upp värme från varmare luft och smälter, precis som en snögubbe kan smälta när det blir varmt. Den praktiska handduksuppgiften förklarar vad avdunstning betyder och kopplar till en vattenpöl som torkar. De 28 felaktiga praktiska svaren har egna förklaringar som visar vad svaret saknar. Även de 14 Aha-uppgifterna får konkreta, ämnesnära förklaringar. Förklaringar används i ordinarie träning, fokusträning, luckbokens meningsuppgifter och facit. Rätt/fel och poängregler ändras inte; förklaring visas efter svaret eller först i facit i provläge. Ljudläsning inkluderar den nya återkopplingen. Inga nya obligatoriska moment, kunskapsposter, externa paket eller CI-jobb.
