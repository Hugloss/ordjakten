# 🎁 Ordjakten 0.20.0 – Minns du fortfarande?

Ny **Minnesstig** gör det möjligt att se om barnet förstår ett ordpar i
*nya situationer också efter att tid har gått*. Spela en frivillig jämförelse,
kom tillbaka tidigast nästa dag och prova andra berättelser. Efter ett par
lyckade återbesök föreslås ett längre intervall. De tidigare upptäckterna
finns kvar även om ett återbesök är svårt.

Det räcker inte att klicka rätt på samma fyra meningar: **båda orden** måste
kännas igen i minst **tre miljöer**, och nya minnessteg kräver **andra scener**
än vid föregående besök. Testläget och provpoängen påverkas inte.
Allting sparas i webbläsaren utan konto; det behövs inga nya eller genererade
bilder. Den nya funktionen fungerar i de tolv kuraterade jämförelseparen,
varav fyra också får allt svårare ledtrådar.

[Regler och pedagogiska begränsningar](docs/MINNESSTIGEN-v0.20.md) ·
[Testplan](docs/QA-v0.20.md)

Starta lokalt med `npm start` och testa med `npm run check` (**155 automatiska tester**).
Chromium-flödet körs med `python tests/browser_retention.py`.
Inga ändringar har publicerats till GitHub eller GitLab.

# 🔎 Ordjakten 0.19.0

## Nytt i 0.19 – 🌱🔎🧠 Ledtrådstrappan

Nu kan **Hitta skillnaden** gradvis variera hur tydliga ledtrådarna är. För fyra noggrant skrivna ordpar får barnet träna tre nivåer: **Tydliga ledtrådar**, **Läs mellan raderna** och **Dra egna slutsatser**. Vi har lagt till **64 nya berättelser** med varierade miljöer från hemmet, skolan, naturen och fritiden; de tidigare **96 jämförelsesituationerna** är oförändrade.

- Varje övning har fortfarande **fyra frågor, två rätt per ord och minst tre miljöer**. Barnet får alltid Aha-förklaringen *efter* sitt svar, inklusive varför skillnaden spelar roll och vilken detalj som gav ledtråden.
- Ett resultat med minst tre rätt, där **båda orden** besvarats rätt, låser upp *lite mindre uppenbara ledtrådar nästa gång*. Vid ett svårt pass (högst ett rätt) får barnet tydligare ledtrådar nästa gång. Två rätt behåller nivån.
- Nivån är en **övningsinställning, inte ett betyg eller bevis på att ett ord är inlärt**. Även om barnet återgår till lättare berättelser finns tidigare upptäckter kvar.
- Äldre ordpar, alla vanliga prov, timern, äventyrskartor och belöningar fungerar som tidigare. Den här anpassningen sker **bara i frivilliga jämförelseövningar**, inte i Testa dig eller högskoleprovsutmaningen.
- Resultatet lagras lokalt i `clueProgress`, kan exporteras och raderas med övrig historik. Inget konto eller online-API krävs.

Se [docs/CLUE-LADDER.md](docs/CLUE-LADDER.md) och [docs/QA-v0.19.md](docs/QA-v0.19.md). Frågorna är pedagogiska utkast som behöver språkgranskas och provas med barn innan bred publicering.


**Hitta orden, samla stjärnor och upptäck hur mycket du kan!**

Ordjakten är en fristående svensk ordträningsapp. Projektet bygger vidare på den smarta repetitionen med 129 skrivna vardagssituationer för 43 ord och har tre frivilliga miniuppdrag för extra spelglädje, tolv äventyr med ritade SVG-kartor, **25 vardagsuttryck med riktiga tre-rutors bildserier av färdiga fria illustrationer** och ett lekfullt upplägg för 8–10-åringar, men kan även utvecklas till ett ordförståelsetest för ungdomar och vuxna. Projektet är **lokalt och opublicerat**: ingen GitHub-/GitLab-repository, server eller tjänst har skapats av detta arkiv.

## Nytt i 0.18 – 🌍 Samma ord i olika miljöer

Jämförelseövningarna har utökats till **96 handskrivna situationer för 12 ordpar** (48 nya) från hemmet, skolan, naturen och fritiden. Varje omgång har fortfarande fyra frågor med **två rätta svar per ord**, men väljer minst tre olika miljöer. En andra omgång med samma ordpar prioriterar andra berättelser, och särskilda förväxlingar i en miljö kan få förtur senare.

Spelet minns vilka **godkända scener och miljöer** barnet har försökt, inte någon personlig profil. Flera korrekta svar i samma gamla scen är inte tillräckligt för att klassa en förväxling som löst. Jämförelseövningarnas svar påverkar inte de vanliga provresultaten. Källan till berättelserna är enbart `public/data/contrasts.json` och inga nya bilder eller externa tjänster behövs.

**Tester:** `npm run check` (138 godkända) och `python tests/browser_context_transfer.py` (Chromium). Se [docs/CONTEXT-TRANSFER.md](docs/CONTEXT-TRANSFER.md) och [docs/QA-v0.18.md](docs/QA-v0.18.md). Inga konton eller repository har skapats.

## Nytt i 0.17 – ⚖️ Förväxlingskompassen

Ordjakten kan nu se **vilket av två jämförbara ord barnet valde när det blev fel** i övningen *Hitta skillnaden*. Förväxlingar ger vänliga förslag på startsidan, och upprepade förväxlingar får förtur vid nästa jämförelse. Efter flera korrekta svar minskar förturen. Detta fungerar för de 12 granskade ordparen och använder inga fria eller automatiskt genererade frågor.

På startsidan finns **Ord att jämföra**, med direktknapp för en ny kort övning. Ingen poäng i Testa dig, högskoleprovet, stjärnjakter eller den schemalagda repetitionen påverkas. Förväxlingshistoriken använder endast lokala begrepps-ID:n, begränsade räknare och maximalt tolv senaste jämförelsesvar per par. **Alla äldre framsteg och den befintliga ordbanken bevaras.**

Se [docs/CONFUSIONS.md](docs/CONFUSIONS.md) och [docs/QA-v0.17.md](docs/QA-v0.17.md). Inga nya bilder, konton eller nätverkstjänster behövs. Den pedagogiska kvalitetsgranskningen och en verklig omladdning med localStorage återstår innan publicering.

## Börja spela lokalt

Krav: **en webbläsare och Node.js 20+** för den medföljande utvecklingsservern. Det behövs inga npm-beroenden.

```sh
npm start
```

Öppna `http://127.0.0.1:4173` i en webbläsare.

Alternativt kan du använda Python 3:

```sh
python3 -m http.server 8000 --directory public
```

Öppna `http://127.0.0.1:8000`.

Testa koden:

```sh
npm run check     # kontrollerar ordbank och kör Node-testerna
python tests/browser_confusions.py # förväxlingskompass och riktad jämförelseträning
python tests/browser_context_transfer.py # anpassade miljöer, nya scener, mobil, provskydd
python tests/browser_smoke.py    # valfritt: Playwright + Chromium
python tests/browser_playful.py  # valfritt: barnupplevelse och utmärkelser
python tests/browser_adventures.py # valfritt: tolv världar, karta, facitspärr
python tests/browser_expressions.py  # valfritt: uttryck, blandat, aha-förklaring och facitspärr
python tests/browser_comics.py # valfritt: seriestrippar, 25 uttryck, befintliga PNG-bilder, mobil+dator
python tests/browser_surprises.py # valfritt: 25 luckor, miniuppdrag, mörkt/ljust tema, provläge
python tests/browser_missions.py # valfritt: tre uppdrag, ordningsfrågor, 3/3, facitspärr
python tests/browser_quests.py   # valfritt: miniuppdrag, repetitionsfrågor, mobil och provläge
python tests/browser_review.py   # valfritt: omvända ordfrågor, varierade uttryck, uppskjuten repetition och provsekretess
python tests/browser_contexts.py # valfritt: vardagsscener, snabbstart, mobil, tema och provsekretess
python tests/browser_adaptive.py # valfritt: smart variation, mobil, på/av och testläge
python tests/browser_learning_map.py # valfritt: Min ordstig, sök, mobil, provläge och tema
python tests/browser_focus_practice.py # valfritt: Träna det här, 3 scener, uttryck, testskydd, mobil
python tests/browser_contrast.py # valfritt: Hitta skillnaden, fyra scener, mobil, separat poäng
python tests/browser_storage_rehydration.py # valfritt: simulering av historikens laddning/radering
```

För att provköra i en riktig webbläsare (valfritt) behöver du Python Playwright + Chromium; se `tests/browser_smoke.py`.

## Nytt i 0.16 – ⚖️ Hitta skillnaden

Barnets nästa utmaning är att skilja två liknande ord åt **i varierade situationer**, i stället för att få målordet som rätt svar tre gånger i rad.

- **12 handskrivna ordpar med 48 egna scener:** exempelvis *grumlig / genomskinlig*, *skrovlig / bucklig*, *randig / prickig* och *nyfiken / misstänksam*. Varje ord är rätt i **två av fyra frågor**. Inga frågor genereras av AI eller kombineras godtyckligt.
- **Ett nytt snabbval:** ⚖️ *Hitta skillnaden* startar ett kort, barnvänligt par. Svårare ordpar finns via *Min ordstig* för äldre barn.
- **Kan väljas direkt i ordstigen:** om ett ord har ett skrivet jämförelsepar kan barnet öva den skillnaden därifrån. Om ett jämförelsemoment missas kan det rekommenderas som nästa träningsidé.
- **Förklarar varför även det andra ordet inte passar:** efter varje svar försvinner frågan och en Aha-ruta visar vilket begrepp som passar bäst och varför det andra är mindre träffande.
- **Trygg pedagogik:** båda svaren används lika ofta, frågor slumpas, och högst ett ord valideras som rätt i varje situation. Vi använder riktade redaktionella scener, inte missvisande bilder. *Testa dig*, högskoleprovsformatet och vanliga poäng påverkas inte.
- **Separat lokal färdighetshistorik:** jämförelser kan tränas igen, men fyra svar samma dag räknas **inte** som fyra utspridda repetitionstillfällen. Tidigare lokala data fungerar utan migrering.
- **Inga extra beroenden eller onlinetjänster.** JSON-filen `public/data/contrasts.json` är enda redaktionella sanningskällan. Kör `npm run sync:contrasts` efter redigering.

Se [docs/CONTRASTS.md](docs/CONTRASTS.md) och [docs/QA-v0.16.md](docs/QA-v0.16.md). Innehållet är ett pedagogiskt utkast som behöver provspelas med barn före större lansering.

## Nytt i 0.15 – 🎯 Träna det här!

I **Min ordstig** finns nu en knapp för att starta en kort, målinriktad övning med just det ord och den frågetyp barnet behöver träna. Barnet kan även själv välja övningstyp. Spelet använder **2–3 befintliga och granskade frågor**, som vid *grumlig* kan vara tre olika vardagsberättelser. Efter varje svar visas en Aha-förklaring; efter omgången visas hur det gått på färdigheten, utan betyg eller extra provpoäng.

Inga bildgenereringar, konton, bibliotek eller serverändringar behövs. Den nya övningen är separerad från Testa dig, timern, stjärnor och uppdrag. Se [docs/FOCUSED-PRACTICE.md](docs/FOCUSED-PRACTICE.md) och [docs/QA-v0.15.md](docs/QA-v0.15.md).

## Nytt i 0.14 – 🗺️ Min ordstig

Nu kan barnet se sin **egen upptäcktsstig för vart och ett av de 121 orden och 25 uttrycken**. Varje stig har fyra små, oberoende markörer: 🔎 *Upptäckt*, 🧠 *Hittat bild eller betydelse*, 🎭 *Provat på fler sätt* och ⭐ *Klarat flera gånger*.

- **Översikt på startsidan** med antal upptäckta ord och begrepp tränade på fler sätt.
- **Knapp på resultatsidan** som leder till en ny, sökbar karta med egna ordkort.
- **Visa alla, mina upptäckter, öva igen eller fler sätt**; sök även på definitioner och filtrera ord/uttryck.
- **Tryck på ett ord:** få en visuell 4-stegs-stig, en begriplig beskrivning av vad som är provat, exempelmening och tips om nästa steg.
- **Ärlig återkoppling:** ett fel räknas som att ha *upptäckt* ett ord men ger inga andra gröna markörer. Ett rätt på en omvänd ordfråga blir inte en markör för vardagsberättelser. Stegen är **inte betyg eller en fastställd förmågebedömning**.
- **Inga extra data eller bilder:** allt beräknas från samma lokala övningshistorik som fanns i 0.13. Existerande ordbank, anpassning, repetition, provläge och samtliga äventyr fortsätter fungera. Offlinecachen är uppdaterad.

Se [docs/LEARNING-MAP.md](docs/LEARNING-MAP.md) och [docs/QA-v0.14.md](docs/QA-v0.14.md) för regler, tester och kvarvarande manuella kontroller.

## Nytt i 0.13 – 🧠 träna på just det som är svårt

Spelet minns nu **hur ett begrepp fungerade i olika uppgiftstyper**. Exempelvis kan barnet få rätt på betydelsen av *grumlig* men misslyckas med ett exempel från en sjö. Då är det främst **vardagssituationer**, inte betydelsefrågor, som ska prioriteras nästa gång. Barnet får ändå upptäcka andra begrepp under samma omgång.

- **Frivilligt:** ”Variera efter vad jag behöver öva”, standard på i Träna och lätt att stänga av.
- **Lagom blandning:** högst ungefär halva en omgång prioriteras som svår, om det finns gott om nytt/annat material; resten är upptäckande.
- **Nya situationer:** kontextfrågor roterar mellan tre redaktionellt godkända berättelser för de 43 ord som har sådana.
- **Tydliga framsteg:** tips på startsidan och en liten text efter svar beskriver vilket moment som övats. Barnets poäng och rätt/fel-resultat ändras inte.
- **Rättvis provsituation:** Testa dig har inte anpassat urval, inga avslöjanden under omgången. Högskoleprovsutmaningen har fortsatt fem svar. Gamla miniuppdrag behåller sina garanterade uppgiftstyper.
- **Integritet:** enbart anonyma begrepps-ID:n och begränsade räknare lagras lokalt på enheten; inget konto, ingen databas och ingen nättjänst. Tidigare sparad information fungerar fortfarande.

Läs [docs/ADAPTIVE.md](docs/ADAPTIVE.md) och [docs/QA-v0.13.md](docs/QA-v0.13.md) för regler, testresultat och kända begränsningar.

## Nytt i 0.12 – 🎭 Ord i vardagen

Ordjakten har en tredje variant för *vanliga svenska ord*: **läs en liten vardagssituation och välj vilket ord som passar**. Det är samma begrepp i olika sammanhang, inte en ny bild som kan ge fel associationer.

- **129 manuellt skrivna vardagssituationer**, tre unika berättelser vardera för **43 olika ord** i den befintliga banken. Alla 121 ord och de 25 uttrycken är kvar.
- **⚡ Snabbstart: ”5 ord i vardagen”** ger fem olika ord på medelnivå direkt, utan timer. Scenerna har fyra svar och innehåller ingen avslöjande stavning av ordet.
- **Blanda in vardagssituationer**, en enkel inställning för vanliga ord på *Medel* och *Svårt*. Bara de 43 särskilt kuraterade orden får dessa frågor; övriga får gamla välfungerande frågetyper. *Lätt* behåller bilderna, och **Högskoleprovsutmaningen** behåller fem textalternativ.
- **Efter svaret** försvinner frågan i Träna. Barnet får först betydelsen och sedan **”Aha! Varför passar ordet?”**, med en förklaring som hänvisar till just den händelse barnet läste. I Testa dig visas detta **först efter avslutat prov**.
- **Smart repetition** ger ett missat ord med granskad vardagsberättelse en ny scen, sedan en omvänd fråga och därefter en annan scen. Ord utan nya scener fortsätter använda 0.11-motorn oförändrat. Intervallen, lokala framsteg och poäng är intakta.
- **En enda redaktionell JSON-källa**: `public/data/word-contexts.json`. Kör `npm run sync:contexts` efter ändringar. JS-exporten valideras mot originalet, och innehållskontroller varnar för dubbla berättelser, svarsläckage och närliggande svarsalternativ som tidigare markerats som synonymer.
- **Ingen bildgenerering eller externa API:er** har lagts till. Samma offline-vänliga statiska webbapp och tidigare sparade inställningar används.

**Exempel för grumlig:** I ett glas med jord, vid en sjö efter oväder och i klassrummet när kritpulver blandas med vatten. Barnet ska välja *grumlig* som beskriver alla tre situationerna vid olika tillfällen. Texten, inte en missvisande bild av en hink, visar begreppet.

Se [docs/CONTEXTS.md](docs/CONTEXTS.md) och [docs/QA-v0.12.md](docs/QA-v0.12.md). **Alla svarsalternativ är fortsatt pedagogiska utkast som behöver provspelas**, inte ett färdiggranskat läromedel.

## Nytt i 0.11 – 🧠 smart repetition som varierar frågorna

Ordjakten minns vilka ord och uttryck som varit svåra **lokalt i webbläsaren**. När en sådan fråga är redo att tränas igen ändras frågetypen så att barnet inte bara upprepar samma svar:

- **Enstaka ord:** ord → betydelse (eller bild på Lätt) blir **betydelse → välj rätt ord**. Nästa repetition kan växla tillbaka. Alla 121 historiska ord har denna möjlighet, även de utan tillförlitlig emoji.
- **Uttryck:** *förstå uttrycket → välj rätt mening → sätt händelser i ordning*. Alla 25 uttryck har redaktionellt skrivna alternativ till de tre uppgifterna. I repetition döljs den gamla berättelsen när en ny meningssituation används. Högskoleprovsläget behåller fem klassiska alternativ.
- **Återkom med mellanrum:** ett fel kan tränas igen efter rundan. Efter ett rätt återbesök väntar spelet ungefär en timme, efter nästa rätt ungefär ett dygn. Tre lyckade, åtskilda återbesök ger status **inlärt**. Ett nytt fel öppnar repetition igen. Barnet behöver inte spela varje dag.
- **Din repetitionsstig** visar hur många frågor som är redo nu, väntar och redan är inlärda. Om inget är redo finns alltid nya ord, vanliga test och andra äventyr.
- **Provpoäng påverkas inte:** Testa dig visar fortfarande facit först efter avslut. Repetitionskö och uppdragsmärken hålls separata från det historiska resultatet.
- **Tidigare lokala resultat bevaras:** gamla fellistor flyttas automatiskt till repetitionskön. Ingen inloggning, databas eller server krävs.

Läs [docs/REPETITION.md](docs/REPETITION.md) för exakta tidsintervall, datakontrakt, pedagogisk motivering och hur äldre sparade resultat migreras.

## Nytt i 0.10 – 🧭 små miniuppdrag och ett tydligt nästa steg

För barn omkring 8–10 år finns nu **tre frivilliga miniuppdrag direkt på startsidan**: **🔎 Upptäck 5 ord**, **💬 Lös fem kluriga uttryck** och **🌱 Ge ett gammalt svårt ord en ny chans**. Det finns också **🎲 Överraska mig**, som väljer ett tillgängligt uppdrag. Alla miniuppdrag använder **Träna utan timer**; om man vill använda en klocka eller spela ett vanligt prov finns alla inställningarna kvar nedanför.

Ordspanaren belönar att barnet provar fem ord, oavsett hur många det kunde från början. Berättelsehjälten belönar att barnet testar samtliga tre uttrycksuppgiftstyper under fem frågor. Repetitionsuppdraget kräver att barnet **svarar rätt på något som det tidigare missat**, och öppnas när ett sådant fel finns. Samma facit och rätt/fel-räkning används i alla lägen.

Miniuppdragets framsteg visas i en egen ruta i **Träna**, inte i **Testa dig**. Efter varje omgång kan barnet direkt välja **fem ord, fem uttryck eller repetera gamla fel**. Klarade miniuppdrag sparas endast som tre enkla räknare lokalt; inget inloggningskrav, inga datumkrav och inga extra provpoäng. Alla tolv äventyr och 121 ord + 25 uttryck finns kvar, och inga nya bilder har skapats.

Se [docs/QUESTS.md](docs/QUESTS.md) för tillgänglighetsregler, kontroller och bakåtkompatibel lagring.

## Nytt i 0.9 – 🎲 tre sorters uppdrag och mer variation

För uttryck kan barnet nu välja på startsidan mellan **Blanda uppdragen**, **Förstå uttrycket**, **Välj rätt mening** och **Sätt händelserna i rätt ordning**. Blanda växlar mellan de tre typerna, så spelet känns annorlunda mellan frågorna. Med ordningsfrågor väljer barnet tre händelser i turordning, kan **Ångra** eller **Börja om** innan det svarar och får den riktiga ordningen i facit. **Testa dig** avslöjar ingenting förrän testet är klart; **Träna** visar betydelsen direkt. Högskoleprovsutmaningen behåller fem klassiska definitioner.

Luckboken har nu **tre uppdrag per uttryck (25 × 3 = 75)**, varav 50 är nya, redaktionellt skrivna frågor. Progressen visas som exempelvis **2/3 i luckan** och **27 av 75** för hela boken. Barnet kan byta variant när som helst, öppna en frivillig ledtråd, spela om gamla uppdrag och samla stjärnor utan att miniuppdragen påverkar resultatet i ordtestet. Framsteg från 0.8 behålls och räknas som redan klarade betydelseuppdrag. Inga nya bilder används.

Se **[docs/MISSIONS.md](docs/MISSIONS.md)** för datamodell, äldre framsteg, timerregler, tillgänglighet och innehållskvalitet. De nya inställningarna visas endast för Uttryck och Blandat, så ett barn som bara vill spela vanliga ord fortfarande får en enkel startsida.

## Nytt i 0.8 – 🎁 25 berättelseluckor som en liten upptäcktsbok

Barnet kan nu samla **25 olika luckor**, en för varje uttryck. Luckan låses upp när ett uttryck har besvarats i Träna, eller först **efter testets slut** i Testa dig. På startsidan finns **”Min luckbok”** med 25 numrerade dörrar och tre framsteg: hittade, öppnade och förstådda.

En öppnad lucka visar tre **befintliga Noto Emoji-illustrationer** i serie och en frivillig tvåvalsfråga där uttrycket används i en **helt annan vardagssituation**. Detta är en extra övning, **inte en del av huvudtestets rätt/fel eller timer**. Fel svar går att försöka igen; en klarad utmaning ger luckan en ⭐. Inga dagliga lås eller datumkrav finns – det ska kännas som en julkalender men gå att spela när man vill.

**Träna:** fråga → rätt/fel → läs betydelsen → valfritt öppna luckan → nästa ord. **Testa dig:** inga luckor/facit under pågående prov; efteråt öppnar man dem i genomgången eller i luckboken. Luckorna sparas lokalt utan konto och följer med i historikexport och vid radering. Äldre sparad historik fungerar fortfarande.

Inga nya bilder skapades eller köptes. De **73 ursprungliga, licensierade PNG-illustrationerna** återanvänds från 0.7. Hela webbsidan är fortfarande statisk, och inget har publicerats.

Se [docs/SURPRISES.md](docs/SURPRISES.md) för implementation, rättelser, innehållskvalitet och säkerhet.

## Nytt i 0.7 – tre serierutor utan genererade bilder

Vid ett uttryck i **Träna** får barnet först rätt/fel och en vanlig förklaring. Sedan visas en **liten seriestripp i tre steg**:

1. **Så brukar det vara:** Pappa kan oftast inte skjutsa till hockeyn. 🏒⏳
2. **Men den här gången:** Nu kan pappa skjutsa! 🚗🏒
3. **Aha!** Det händer något ovanligt, som ett undantag. ✨👍

Serierutorna finns för **alla 25 befintliga uttryck**. De bygger på **73 befintliga Noto Color Emoji-symboler** i PNG-format. Dessa är hämtade från den redan skapade, öppet licensierade emoji-illustrationen i Noto-fonten – **inga nya illustrationer, AI-bilder, bildgenereringstjänster eller nätanrop under spelandet**. PNG-filerna ligger i `public/assets/story-icons/` och visas bara som stöd för den begripliga förklaringstexten. Om en bildfil inte kan visas används den vanliga Unicode-ikonen som reserv.

**Bildkällan:** [Noto Emoji](https://github.com/googlefonts/noto-emoji) av Google. Färggrafiken i denna kopia är rasteriserade, befintliga glyphbilder från Noto Color Emoji-fonten (SIL Open Font License 1.1). Full copyright-/licensinformation medföljer i `public/assets/story-icons/NOTO-EMOJI-LICENSE-AND-COPYRIGHT.txt`. Appen innehåller inga fontfiler. För att återskapa bildpaketet från *en separat lokalt installerad* Noto-font finns ett frivilligt kurateringsskript i `scripts/build-comics-assets.py` som kräver Pillow; detta behövs **inte** för att använda appen.

**Testa dig:** serierutorna visas aldrig under provet. När omgången är klar finns de i en hopfällbar förklaringsruta under varje uttryck i facit. **Alla 121 ord och 25 uttryck är oförändrade**, liksom poängen och alla tolv äventyr.

Se `docs/COMICS.md` för designregler, licens och tillgänglighet.

## Från 0.6 – uttryck och små berättelseluckor

Du kan nu välja **🔤 Ord**, **💬 Uttryck** eller **🎲 Blandat** på startsidan. Den särskilda snabbstartsknappen **Prova 5 kluriga uttryck** startar direkt.

**Exempel:** ”För en gångs skull kunde min pappa skjutsa barnen till hockeyn.” Frågan gäller vad uttrycket *för en gångs skull* betyder i meningen. I **Träna** försvinner svarsalternativen efter valet och ersätts av en stor, tydlig förklaring och en Aha-förklaring (som sedan utvecklats till tre små bildrutor):

**Så brukar det vara** → Pappa kan oftast inte skjutsa. **Men den här gången** → Nu kunde han det! Samma uttryck visas också i en ny exempelmening.

Uttrycken är en egen bank med **25 handskrivna vardagsuttryck**, utöver de **121 bevarade orden**. Varje uttryck har en egen situation, fem manuellt skrivna svarsalternativ (fyra används för normala nivåer) och två korta förklaringsrutor. I **Testa dig** döljs rätt/fel och Aha-förklaring fram till slutresultatet. Felaktiga uttryck kan repeteras och sparas lokalt.

Frågorna på uttrycksnivån riktar sig tills vidare till cirka **8–10 år** oavsett valt svårighetsläge; i Blandat styr valt läge de vanliga orden. Detta är tydligt beskrivet på startsidan. Uttryck får inte missvisande emoji-bilder. På små skärmar är äventyrskartan nu **hopfällbar**, så att frågan kommer tidigare på skärmen.

Se `docs/EXPRESSIONS.md` för den pedagogiska modellen, exempel, datakontrakt och granskningsbehov.

## Tolv äventyr att utforska (från 0.4)

- **Sex tidigare världar:** 🌲 Mystiska skogen, 🚀 Rymdäventyret, 🏰 Drakslottet, 🏴‍☠️ Piratjakten, 🐬 Havets hemligheter och 🦕 Dinosaurielandet.
- **Sex nya världar:** 🌸 Sagoträdgården, 🦄 Enhörningsdalen, 🐰 Djurvännernas by, 🌈 Regnbågslandet, 🐴 Hästgården och 🎤 Musikscenen. Alla kan välja alla teman.
- **Fyra upptäckbara platser** på en liten karta visar hur långt man hunnit. Det går att utforska samma ord i olika världar.
- Korta **uppmuntringar vid platserna** visas i Träna. Förklaringen är fortfarande huvudmomentet och får egen yta efter svar.
- **Testa dig läcker inga svar eller rätt/fel-resultat:** kartan visar bara genomförda frågor. Facit och belöningar kommer efter testet.
- Världar, ordkompisar, svårighet, timer och ljus/mörk/högkontrast är oberoende val.
- Valt äventyr sparas lokalt tillsammans med inställningar och framtida resultat; gammal historik fortsätter fungera.
- Inga externa bilder, tyngre ramverk, nätanrop eller betalningar. **Fortfarande ingen publicering.**

Se `docs/ADVENTURES.md` för världsdesign, regler och gränsen mellan utmaning och belöning.

## Från 0.2: lekfullt för 8–10 år

- **⚡ Snabbstart:** ett tryck startar tio lätta ord i Träna, utan timer.
- **🦊🦉🐉 Tre ordkompisar:** Roffe, Ulla eller Dino väljs utan konto eller barnprofil. Valet sparas lokalt.
- **⭐ Stjärnor och sviter:** ett korrekt svar ger en stjärna; tre rätt i rad ger extra uppmuntran. Den vanliga rätt/fel-räkningen förblir oförändrad.
- **🗺️ Etapper:** små avklarade steg gör frågornas progression synlig; etapper är **inte** samma sak som stjärnor.
- **📖 Tydlig läsupplevelse:** frågan försvinner när barnet svarar i Träna. Förklaringen visas i ett tydligt fält och flyttas fram på små skärmar.
- **🏅 Märken efter omgången:** Ordspanare, Tre i rad, Stjärnletare och Ordmästare baserat på faktiska resultat. Alla omgångar ger ett deltagarmärke.
- **🔊 Valfria ljudeffekter:** små syntetiska toner utan ljudfiler, avstängda från början. Ljud spelas endast när man tränar, inte under provet.
- **🧩 Testa dig är fortsatt ett provläge:** inga facit, stjärnpoäng eller sviter syns medan provet pågår.
- **♿ Tillgänglighet:** stora tryckytor, lättlästa mörka och ljusa teman, hög kontrast, stöd för minskad rörelse och god tangentbordsnavigering.

Detta är lekfull presentation, inte en poängshop: inga köp, belöningsannonser, konton eller spårning.

## Funktioner i denna version

| Funktion | Implementerat |
| --- | --- |
| Startsida med två spellägen | ✅ |
| 📚 **Träna**: rätt/fel och stor förklaring direkt efter svar | ✅ |
| 🏆 **Testa dig**: facit först när testet är klart | ✅ |
| Svårighetsgrader **Lätt / Medel / Svårt** | ✅ |
| 🎓 **Högskoleprovsutmaning**: fem alternativ och snabbval 10 ord/3 min | ✅ |
| 5, 10, 15, 20 eller 25 frågor | ✅ |
| Tidsgräns avstängd, totaltid eller per fråga; även egen tid | ✅ |
| Rätt, fel och obesvarade särredovisas | ✅ |
| Ordförklaringar och exempelmeningar | ✅ |
| 25 vardagsuttryck med små berättelser, Aha-förklaringar och 3 bilderutor | ✅ |
| Välj Ord, Uttryck eller Blandat, plus snabbstart för uttryck | ✅ |
| Blandade frågor utan dubletter inom omgången | ✅ |
| Mörkt, ljust, automatiskt tema och hög kontrast | ✅ |
| Lokal resultathistorik, repetition av fel och export | ✅ |
| Sökbar ordbank med 121 ord och 25 vardagsuttryck | ✅ |
| Offline efter första onlinebesöket (service worker på HTTPS/localhost) | ✅ |
| GitLab Pages-konfiguration, GitHub-testworkflow | ✅ förberett, **inte publicerat** |

**Inga användarkonton, inga API-nycklar, ingen spårning och ingen serverdatabas.**

## Spellogik

- **Träna:** Efter svaret döljs frågan och alternativen; spelaren ser rätt/fel, definition och en exempelmening. Vid total-timer pausas tiden medan man läser förklaringen.
- **Testa dig:** Nästa fråga visas direkt efter svaret. Inga facit eller rätt/fel-tal visas under provet. En total-timer fortsätter hela tiden.
- **Tidsgräns per fråga:** Om tiden tar slut registreras frågan som obesvarad. Träna visar förklaringen; Testa dig går vidare.
- **Total-timer:** Om tiden tar slut avslutas rundan automatiskt. Kvarvarande frågor räknas som obesvarade, **inte fel**.
- **Repetition:** Ett fel läggs i den lokala repetitionskön. ”Smart repetition” ger en annan frågetyp och väljer bara frågor som är redo enligt den enkla återbesöksplanen. Felräknaren från äldre versioner behålls för bakåtkompatibilitet, men den nya kön bestämmer när frågor kan repeteras. Inga dubbletter i en omgång.
- **Ingen timer:** Spela i egen takt.

## Våra historiska ord

`public/data/ordbank.json` är den **kanoniska** ordbanken med **121 unika ord** från tidigare spel, med ID, svårighetsgrad, betydelse, exempel, källa och granskningsstatus.

`public/data/expressions.json` innehåller 25 **separata uttryck**. Varje uttryck har en liten berättelse, fem noggrant skrivna svarsalternativ och två berättelsescener som serien kompletterar med en tredje Aha-ruta. `public/data/expressions.js` är motsvarande webbläsarfil. Se `docs/EXPRESSIONS.md`.

`public/data/wordbank.js` är samma data som en direkt inläsbar JavaScript-fil för den byggfria webbappen. Båda filerna jämförs exakt i `npm run validate`. Vid uppdateringar måste båda ändras tillsammans – se `docs/CONTENT.md`.

| Spelnivå | Frågepool | Bildstöd |
| --- | ---: | --- |
| Lätt | 40 ord med särskilt kuraterade emoji-alternativ | Ja |
| Medel | 55 ord: 48 ursprungliga + 7 utan pålitliga emojis | Nej |
| Svårt | 25 ord | Nej |
| Högskoleprovsutmaning | 26 ord: de 25 svåra + efemär | Nej, 5 alternativ |

Nivåerna överlappar avsiktligt i högskoleprovsutmaningen; **unionen av alla nivåer innehåller samtliga 121 historiska ord**. De sju orden utan lämpliga emoji-bilder är: *Studsande, Skör, Tung, Mjuk, Ihålig, Porös, Spetsig*.

**Redaktionell reservation:** Materialet är en fungerande första version, men fortfarande ett redaktionellt utkast. Appen skapar textalternativ genom att välja definitioner från liknande begreppskategorier med vissa synonymspärrar. Automatiska tester verifierar form och entydigt facit i koden, **inte att varje distraktor är pedagogiskt och semantiskt perfekt**. Granska svaren med användare innan en större offentlig lansering. Emojis ser också olika ut i olika system. Se `docs/CONTENT.md`.

## Projektstruktur

```
ordjakten/
├── public/                    # Allt som GitLab Pages kan publicera
│   ├── index.html             # Semantisk startsida, spel, resultat, ordbank
│   ├── css/style.css          # Teman, layout, tillgänglighet
│   ├── css/playful.css        # Ordkompisar, stjärnjakten och barnvänlig design
│   ├── css/adventures.css     # Tolv äventyrsskal, även ljus/mörk tema
│   ├── css/expressions.css    # Berättelsefrågor, aha-rutor och kompakt karta
│   ├── js/app.js              # UI, flöden, timer, lokal lagring
│   ├── js/engine.js           # Ren logik (även körbar i Node-test)
│   ├── js/review.js           # Schemalagd repetition, helt lokalt
│   ├── js/playful.js          # Testbara uppmuntringar, etapper och märken
│   ├── js/adventures.js       # Världar, berättelser och fyra kartplatser
│   ├── data/ordbank.json      # Kanonisk ordlista (121 ord)
│   ├── data/wordbank.js       # Synkroniserad browser-export
│   ├── data/curation.js       # Bildgranskning och distraktorkategorier
│   ├── data/expressions.json   # 25 redaktionellt skrivna uttryck
│   ├── data/expressions.js     # Browser-export av uttrycksbanken
│   ├── sw.js                  # Offline cache, versionshanterad
│   ├── manifest.webmanifest  # Installationsmetadata
│   └── icons/icon.svg
├── scripts/serve.js           # Lokal server utan externa paket
├── scripts/check-content.js  # Validering av data och fråga
├── tests/                    # Node-tester + valfri browser smoke
├── docs/                     # Spec, ordlista, backlog och publiceringsguide
├── .gitlab-ci.yml            # Förberedd GitLab Pages CI
├── .github/workflows/        # Testkörning – ingen publicering
└── package.json
```

## Spara och publicera senare

Du behöver **inte** publicera något nu. När ni skapat ett konto och ett repository kan ni lägga in hela projektet. `.gitlab-ci.yml` är redan anpassad för GitLab Pages, med `public/` som statiska webbplatsfiler. Läs `docs/DEPLOY.md` först. Inget går ut på nätet automatiskt när man bara laddar ned eller testar ZIP-filen lokalt.

## Privat information och begränsningar

- Poäng, svåra ord och inställningar sparas endast i webbläsarens `localStorage` på aktuell enhet.
- Om man raderar webbläsardata försvinner historiken. Exportera resultat från **Resultat** om du vill behålla dem.
- Ingen synkronisering mellan enheter finns och inget barnkonto skapas.
- En statisk sida kan inte garantera att någon faktiskt har *läst* förklaringen; upplägget gör den framträdande, utan störande kryssruta.
- Den högskoleprovsinspirerade nivån är **inte** ett officiellt högskoleprov och innehåller inga kopierade officiella uppgifter.

Se även `docs/PRODUCT.md`, `docs/CONTENT.md`, `docs/ROADMAP.md` och `docs/DEPLOY.md`.

## Nästa kvalitetssteg

Prova gärna med ett barn i målgruppen 8–10 år: förstår barnet skillnaden mellan avklarade etapper och intjänade stjärnor, kan det läsa förklaringen efter ett fel, och känns ljud/animationer lagom? Bildalternativ och ordförklaringar är fortfarande redaktionella utkast. Se `docs/PLAYFUL.md`.

### Äventyrskartor (0.5)

Kartan ritas direkt av JavaScript/SVG – inga bildfiler eller nätverk behövs. De 12 äventyren har olika illustrationer, en slingrande väg och fyra delmål. Kartan visar antal besvarade frågor, **inte** antal rätt. Samma ordval, poäng, belöningar och timer fungerar oavsett värld. Se `docs/ADVENTURES.md`.

Skärmbilder finns i `docs/previews/`: `alla-12-kartor.png`, `enhorning-karta-mobil.png` och `ny-karta-valj-varld-mobil.png`.

Valfria webbläsartester (om Chromium och Python Playwright finns installerade):

```sh
python tests/browser_maps.py
python tests/browser_adventures.py
python tests/browser_smoke.py
```

För att skapa nya kartskärmbilder lokalt krävs även Pillow: `python tests/make_map_previews.py`.
