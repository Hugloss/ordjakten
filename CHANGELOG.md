# Ordjakten – ändringslogg

## Skattkartan – hitta platsen med ledtrådar

- En valbar skattkarta har fyra klickbara platser i var och en av de tolv befintliga världarna. 48 skrivna ledtrådar kopplas till konkreta platsbeskrivningar; varje plats använder sin befintliga orduppgift.
- Rätt plats ger ledtrådens skatt och en sakletarpoäng efter besöket. En annan plats har också en uppgift och ett enkelt litet fynd, men ger ingen sakletarpoäng. Barnet kan läsa samma ledtråd igen och hitta vidare.
- Ett eget rätt svar på ordfrågan ger en ordstjärna, oavsett platsvalet. Varje plats kan ge en ordstjärna och varje ledtråd en sakletarpoäng. Hjälp med ordfrågan påverkar inte ett korrekt platsval.
- Fynd, ledtråd och pågående besök sparas lokalt. Vanliga stjärnrader och provresultat bevaras. Kartan har inget tidskrav, inga minuspoäng och inga belöningar för upprepade klick.
- Tydliga knappar, platsnamn och beskrivningar fungerar med tangentbord och på smala läsytor. Frivillig uppläsning finns för ledtråd, uppgift och förklaring. Offlinecache v73. Se [spelreglerna](docs/PLAYFUL.md).

## Efter provspelning – tydligare stjärnsamling

- Historiken visar första svarens rätt, fel och obesvarade. Den gamla stjärnsiffran tas bort eftersom fler stjärnor kan samlas genom fortsatt träning. En kort text förklarar skillnaden.
- Samlingsmärken visas i en kolumn på läsytor upp till 380 CSS-pixlar, så att långa namn får plats även med stor förstoring. Offlinecache v72.
- Det publicerade spelet har provats från fel huvudsvar via Aha och guidad hjälp till omladdning och fortsatt träning. En rad med 3 rätt från början kunde fyllas till 5 stjärnor medan ursprungsresultatet låg kvar. Se [kontrollerna](docs/PLAYFUL.md).

## Stjärnor som finns kvar och nya chanser i egen takt

- Stjärnor sparas direkt och visas på startsidan, i rundan och efteråt. Sex fasta samlingsmärken blir synliga vid 5, 15, 30, 50, 75 och 100 stjärnor.
- Varje fråga i stjärnraden kan ge en stjärna: genom huvudsvaret eller ett eget rätt svar efter förklaringen. Visat facit, svarstid och rätt i rad ger inga extra stjärnor.
- Kvarvarande stjärnor går att samla i en frivillig ny övning utan timer, även efter omladdning. Den använder samma ord i skrivna situationer och bevarar den ursprungliga resultathistoriken.
- Uppmuntran och märken beskriver det barnet faktiskt har gjort. En full stjärnrad firas även när den fyllts genom flera försök.
- Tidigare sparade korrekta svar förs över en gång. Samlingen är sedan oberoende av gränsen på 50 sparade resultat. Dubbelklick och gamla rundors svar kan inte ge dubbla stjärnor. Offlinecache v71.

## Sammanhanget avgör betydelsen

- Sex befintliga uttryck får 18 skrivna situationer: Häng med, Hoppa över, Hoppa ner från pallen, Vända blad, Tappa tråden och Få kalla fötter. Varje uttryck får två tydliga betydelser och en situation där en konkret fråga behövs.
- Den befintliga meningsövningen använder situationens egen betydelse och återkoppling. Riktad träning visar alla tre situationerna; förklaringen pekar ut ledtråden i berättelsen och varför den hjälper.
- Aha för dessa uttryck börjar med en neutral beskrivning av de möjliga betydelserna. En ny, tydlig situation används som förståelsekontroll. Att fråga i en oklar situation räknas inte som bevis för en bestämd betydelse i Aha.
- Ordsamlingen visar olika betydelser tillsammans. Äldre serier visas uttryckligen som en annan berättelse så att bild och förklaring hör ihop.
- Nya scen-ID:n hålls isär i återbesök och uppföljning. Befintliga ord, uttryck och tidigare sparade övningar bevaras. Offlinecache v70.

## Efter livekontroll – kortare och tydligare läsflöde

- Fristående Aha säger **Välj svar**, även när alternativen är handlingar i samma berättelse. Vardagsuttryckens lässteg påminner om att samma uttryck kan betyda något annat i en annan situation.
- Fokusövningens rättelse visar det korta svaret. Uppgiftens förklaring, motexempel och hjälp att fråga visas som separata stycken; ett extra exempel från grundberättelsen upprepas inte ovanför dem.
- Offlinecache v69. Ändringarna följer den visuella kontrollen av PR #15 på den publicerade sidan.

## Vardagsuttryck och läsbara teman

- Sex uttryck som barn kan höra i vardagen: Hoppa i overallen, Hoppa ner från pallen, Släng på dig jackan, Slå dig ner, Häng med och Hoppa över. Varje uttryck har skrivna situationer, förklaringar, motexempel, serie och tre uppgiftsvarianter.
- Betydelsen kopplas till den aktuella situationen. ”Hoppa ner” kan också betyda ett riktigt hopp; barnet får hjälp att fråga när avsikten är oklar. Gemensam scen visas en gång före korta svar i träning, fokus, Aha och luckbok.
- Återkopplingen följer den uppgift som besvarades. Definitionerna fungerar även när personer och platser ändras. Sex nya berättelseluckor ger 73 luckor och 219 uppgiftsvarianter; vardagsurvalet blir 101 ord och 65 uttryck.
- Världstonade textytor får en ogenomskinlig bakgrund. Låsta kontroller behåller läsbar text, och högkontrastläget får företräde även i de ljusa världstemana. Dekorativa världsfärger behålls.
- Nya regressioner kontrollerar de gemensamma scenerna, uppgiftsspecifika förklaringarna och textkontrasten i temana. Offlinecache v68. Se [innehåll och kontroller](docs/EVERYDAY-INSTRUCTIONS.md).

## Efter publicering – läsbarhet, uppläsningshjälp och offlinefiler

- Låsta Aha-svar behåller full kontrast så att barnet kan läsa det rätta exemplet. Draggreppet på kristallkort följer valt färgtema; långa förklaringsrubriker och resultatetiketter kan radbrytas inom sitt kort.
- Om uppläsningen misslyckas får barnet ett kort hjälpmeddelande vid den använda knappen. Avsiktliga stopp är tysta, och gamla ljudhändelser kan inte påverka ett nytt försök.
- Offlinecache v67 behåller en sammanhållen precachad utgåva. Startsidan kan hittas även med sökparametrar i adressen. Okända filer ersätts inte med startsidans HTML.
- Läsbarheten har granskats i ljust tema vid 337 CSS-pixlar med webbläsarförstoring. Det är inte ett test av pekskärm, verklig svensk röst eller flygplansläge; se [kontroller och kvarvarande provspelning](docs/FIRST-PUBLISH.md).

## Efter publicering – korrekt resultattext

- Stjärnletare beskriver antalet rätt av de frågor som faktiskt spelades, även i femfrågorsomgångar. Samma gräns för märket gäller som tidigare.
- Aha-hjälpen efter två fel lägger inte till en extra punkt efter ett exempel som redan avslutas med skiljetecken. Offlinecache v66.
- Träna, Testa dig, skolans frågeflöde och sparad historik har kontrollerats på den publicerade HTTPS-sidan. Se [genomförda kontroller och återstående provspelning](docs/FIRST-PUBLISH.md).

## Första publiceringen – kortare start och tydligare läsflöde

- Snabbstarten spelar fem lätta ord utan timer. Tomma träningsmål är inaktiverade; ett sparat mål som blivit tomt återgår uttryckligen till Blanda.
- Rättelsen och den aktuella förklaringen visas direkt. Fler exempel, motexempel och egna tankefrågor kan öppnas frivilligt; fullständigt innehåll finns kvar i facit och ordsamlingen.
- Aha-frågan och de visade svaren kan läsas upp neutralt med webbläsarens talstöd. Uppläsning följer synligt innehåll och stoppas vid svar och byte av steg.
- Handlingsbilder och experiment döljs under Aha-steget och återkommer vid omläsning. Offlinecache v65.
- Publiceringsinstruktionerna beskriver det aktiva GitHub Pages-flödet. Se [första provspelningen](docs/FIRST-PUBLISH.md).

## Pågående – tydligare förklaringar efter PR #10

- 18 befintliga ord får tydligare undervisning, vardagsscener eller säkrare felalternativ. Överlappande ord hålls isär i frågor som annars kan få flera försvarbara svar.
- 12 vardagsuttryck får konkreta betydelsekopplingar och mer precisa motexempel. Alla 14 skolord får en egen förklaring till ordningsuppgiftens arbetssteg.
- Återkopplingen i skolans ordningsfrågor följer nu den aktuella arbetsgången i träning, fokus, facit och bonus, med samma skrivna förklaring som hjälp efter fel.
- 25 jämförelsescener och 22 befintliga speluppdrag förtydligar vilken egenskap frågan gäller och varför svaret passar. Begreppskartan och Ordbroar förklarar överlapp utan falska motsatser.
- Samma vardagsurval och antal ord. Offlinecache v64. Se [granskningen och kvarvarande kontroller](docs/CLEARER-EXPLANATIONS.md).

## Berättelsespåret (nästa uppdatering)

- Sparar vilka redaktionellt skrivna vardagsberättelser som faktiskt prövats. Ordfrågor och Aha efter förklaring visas separat.
- Nya och ännu inte lösta situationer får förtur i smart träning och fokuserade vardagsövningar. Min ordstig visar varje berättelse utan att utlova behärskning.

## Träningsmål (nästa uppdatering)

- Tre frivilliga träningsmål: Blanda, Upptäck nytt, Ge ord en ny chans. Tillgängliga frågor visas innan start; kortare omgångar fylls inte med fel sorts frågor.
- Aha-stöd kan ge en ny chans även efter ett rätt huvudsvar. Repetitionspauser respekteras och provlägen/presets är oförändrade.
- Rensning av lokal historik rensar nu även Aha-observationer.

## Pågående – post-review efter PR #9

- Vardagsurval med 101 ord och 59 uttryck, inklusive 14 skolord. 20 ord och 8 uttryck finns kvar som frivillig fördjupning. Inga nya ord eller ändrade begrepps-ID:n.
- Automatiska omgångar, återbesök och träningsförslag följer urvalet även med äldre resultat. Ordlista och riktad fördjupning bevarar tillgången till hela innehållet.
- Tio osäkra emojifrågor blir textfrågor. Mer precisa spelalternativ för bland annat saftig, speglande, solig, skrynklig och spetsig; enklare hjälpspråk och naturligare ordförklaringar.
- Skoluppgifter får tydligare facit och vardagligare sammanhang. Den gemensamma instruktionen visas en gång före kortare svarsknappar i huvudfråga, fokus, bonus och Aha.
- Nya regressionstester för urvalet, gamla resultat och skolfrågornas presentation. Offlinecache v61. Visuell webbläsargranskning och barnprovspelning återstår.
- Läs [granskning, urval och begränsningar](docs/POST-REVIEW-EVERYDAY.md).

## Pågående – pedagogisk genomgång av hela ordbanken

- Alla 121 befintliga ord får konkret förklaring, vardagsexempel, motexempel och frivillig fråga för eget språk; 107 nya fördjupningar.
- 66 ord får tre egna vardagssituationer vardera: 198 nya scener, totalt 363. Inga nya ord läggs till.
- Aha använder en separat, granskad lista med felberättelser för varje ord. Huvudfrågans distraktorer återanvänds inte automatiskt i motsatt riktning.
- Betydelser och exempel rättas, bland annat orädd, betänksam, magnetisk och ångande. Fler överlappande ordpar spärras i genererade alternativ.
- Innehållskontrollen kräver fullständig täckning. Den befintliga snabba testsviten utökas med Aha-gränsfall, och ett lokalt Chromium-test provar undervisningen i träning, facit och ordbank.
- Offlinecache v60. Läs [genomgången](docs/WORD-UNDERSTANDING.md) och [planen för barnprovspelning](docs/CHILD-PLAYTESTING.md).

## 0.20.0 – Minnesstigen: nya sammanhang över tid

- Frivilliga återbesök efter 1, 3 och 7 dagar – och därefter återkommande 14-dagarsförslag. Ingen daglig inloggningsbelöning eller tidsstress.
- För varje kvalificerat återbesök krävs minst 3/4 rätt, rätt på båda jämförda orden, minst tre miljöer och nya scen-ID:n från föregående pass.
- Fyra svårighetsgranskade par kombinerar minnesstegen med Ledtrådstrappans nivåer 1→2→3; alla tolv ordpar stöds av återbesöken.
- Ny startsidessektion **🎁 Minns du fortfarande?**, koppling till **Min ordstig** samt vänligt resultat efter riktad träning.
- Separat lokal `retentionProgress`; kompatibilitet med äldre historik, export och radering. Testa dig, stjärnor, timer, repetition och äventyr förblir fristående.
- Ny modul + tester + Chromium-flöde; nya resurser i offline-cache v20. Inga nya bilder, servrar, konton eller publicering.
- Se `docs/MINNESSTIGEN-v0.20.md` och `docs/QA-v0.20.md`.

## 0.18.0 – Begrip samma ord i olika sammanhang

- 48 nya handskrivna jämförelsesituationer, sammanlagt 96 för tolv ordpar. Hem, skola, natur och fritid med explicita miljö-ID:n.
- Balanserat fyrfrågorsurval väljer helst nya scener och väger in vilka kontexter barnet har missat. Första två omgångarna kan täcka alla åtta scener utan upprepning.
- Förväxlingshistorik lagrar scen-ID/miljö (max tolv händelser per par); äldre resultat utan miljö är bakåtkompatibla. Varierade rätt i olika miljöer krävs för att minska träningsförslag.
- Miljöetiketter och tydligare Aha-resultat i mobilen. Testa dig, högskoleprovet, stjärnor och repetitionsintervall oförändrade.
- 138 automatiska tester och Chromium-flöden inklusive 320 px högkontrast och provsekretess. Offlinecache v18. Allt fortfarande lokalt, opublicerat.

## 0.17.0 – Förväxlingskompassen

- Förväxlingsövningar lagrar nu det valda begrepps-ID:t (inte bara rätt/fel) och kan skilja riktningen på en förväxling.
- Startsidan visar vänliga träningsförslag för två närliggande begrepp, med direktknapp till samma fyra godkända berättelser.
- Flera fel ger förtur vid nästa barnvänliga jämförelse. Flera korrekta svar tar bort förturen utan att påstå att ordet är inlärt.
- Svar i Testa dig, stjärnjakten och vanliga repetitionstester ger inte förväxlingsstatistik.
- Lokal historik är fortsatt bakåtkompatibel; ny sektion med högst tolv senaste events per godkänt ordpar följer med vid export/radering.
- Tester för datavalidering, återhämtning, poängisolering, mobiltema och webbläsarflödet.


## 0.16.0 – Hitta skillnaden mellan ord

- Ny frivillig jämförelseövning med 12 redaktionellt skrivna ordpar (48 scener) med jämnt fördelat facit, så barnet inte alltid kan välja ett och samma ord.
- Enkel snabbstart för 8–10-åringar och ett val per tillgängligt ord i *Min ordstig*. Svårare par kräver ett medvetet val i ordstigen.
- Efter svaret försvinner frågan och Aha-förklaringen visar även skillnaden mot det andra ordet.
- Jämförelsen registreras som en separat färdighet per ord, utan att förändra provpoäng, vanliga repetitionsintervall, timer eller stjärnbelöningar.
- Canonical JSON + synk till browser-JS, innehållsvalidering, 8 nya automatiska tester och eget Chromium-flöde. Offlinecache v16. Inga nya bilder eller konton.
- Ingen publicering på GitHub eller GitLab.

## 0.15.0 – Träna det här direkt från ordstigen

- Riktad mikroövning per begrepp och uppgiftstyp, med automatisk rekommendation av svag eller oprövad färdighet och möjlighet att välja själv.
- Tre olika redaktionella vardagsscener för ord med tillräckligt material; annars 2–3 varierade befintliga frågor. Ord med osäkra emojis får text, aldrig missvisande bilder.
- Frågan försvinner efter svar och Aha-förklaring, korrekt lösning och tillhörande exempel får fokus. Separat slutkort visar just den färdighetens utfall jämfört med tidigare antal försök.
- Fristående träningsvy som inte ändrar Testa dig, timer, stjärnor, ordkompisar, vanliga resultat eller andra inställningar. En fokuserad omgång räknas högst som ett spaced-review-tillfälle; anonym färdighetshistorik uppdateras.
- Offlinecache och statiska resurser uppdaterade, tester och pedagogisk QA-dokumentation. **Ingen publicering.**

## 0.14.0 – Min ordstig för 146 ord och uttryck

- Ny visuell och sökbar **ordstig** per begrepp: Upptäckt → Betydelse/bild → Fler sätt → Klarat flera gånger.
- Oberoende, evidensstyrda markörer; fel betyder ett försök, inte en uppnådd färdighet. Håller isär kontextfrågor och omvända ordval.
- Översikt på startsidan, ingång efter resultatet och egen mobilanpassad sida med filter, detaljer, nästa träningsidé och status.
- Samma redan sparade anonyma lokala resultat; ingen ny localStorage-schemaändring, extra poäng, AI-tjänst eller bildgenerering.
- 14 nya automatiska tester och riktad webbläsarkontroll; offlinecache v14; QA-dokument och manuella kontroller.

## 0.13.0 – smart variation efter vad barnet kan

- Se resultat **per uppgiftstyp och begrepp**: bild, betydelse, omvänt ordval, vardagsscen, rätt mening och händelser i ordning.
- Vanliga träningsomgångar prioriterar tidigare svåra färdigheter men behåller minst ungefär halva omgången för annan variation när material finns.
- Tre redaktionellt skrivna vardagsscener växlas automatiskt efter besvarade frågor, så det inte räcker att memorera en mening.
- På/av för anpassad träning, kort återkoppling efter frågor och tips på startsidan om vad som kan övas vidare.
- Tidigare repetitionsschema, Berättelsehjältens tre uppgifter, Testa dig och femsvarsformatet är oförändrade.
- Ny lokal, anonymiserad färdighetshistorik; tidigare sparade resultat migreras utan förlust. Export och radering inkluderar nu även detta fält.
- Inga nya bilder, API:er eller externa beroenden. Allt fortfarande opublicerat.
- Nytt innehållstest och webbläsarprovning. Se `docs/ADAPTIVE.md`.

## 0.12.0 – Ord i vardagen och variationsrik repetition

- 43 redaktionellt skrivna ordkort med tre separata vardagssituationer vardera (129 scener); hela den tidigare banken bevaras.
- Snabbstart för fem scenbaserade frågor, plus frivillig blandning av berättelser i medel- och svårighetsläget.
- Tillhörande Aha-förklaring för varje situation, endast efter svar i Träna eller efter provslut i Testa dig.
- Smart repetitionskö växlar nu mellan *ny situation → omvänt ordval → annan situation* för ord med scenbank.
- JSON är enda redaktionella källa; JS-genererad export, synkverktyg, innehållsvalidering, nya tester och uppdaterad offline-cache.
- Inga nya eller genererade bilder och ingen publicering.

## 0.11.0 – Smart repetition och varierade återbesök

- Repetitionskö för tidigare fel, sparad lokalt och bakåtkompatibel med v0.10.
- Enstaka ord kan nu återkomma i omvänd riktning: läs definitionen och välj ordet.
- Uttryck roterar mellan betydelse, ny mening och händelsernas ordning.
- Gradvis återbesök: direkt efter fel, en timme efter första rätt, ett dygn efter nästa rätt, sedan inlärt.
- Startsidan visar redo / kommer senare / inlärda; testpoängen ändras aldrig retroaktivt.
- Ingen upprepning av målord i samma omgång; inga nya bilder, konton eller nätanrop.
- 8 nya Node-tester, webbläsartest för repetition och uppdaterade äldre browser-tester.
- Ny version av offlinecachen och dokumentation `docs/REPETITION.md`.

## 0.10.0 – Frivilliga miniuppdrag och spelglädje

- Tre miniuppdrag på startsidan: Ordspanaren (5 ord), Berättelsehjälten (5 uttryck med varierade uppgiftstyper) och Nytt försök (rätt svar på ett tidigare fel).
- En knapp för slumpat miniuppdrag väljer bara mellan de som är möjliga att spela.
- Miniuppdragen är utan timer, utan dagliga krav och frikopplade från provpoängen.
- En egen framstegsmätare i träningsläget och resultatkort efter avslutat uppdrag.
- Tydliga val för vad barnet kan göra efter avslutad omgång.
- Bakåtkompatibla, lokalt sparade uppdragsräknare; kan exporteras och raderas.
- Sex nya automatiska tester, särskild webbläsarprovning samt uppdaterad offline-förteckning.
- Inga nya illustrationer, inga konton, inga externa bibliotek och ingen publicering.

## 0.9.0 – Tre uttrycksövningar

- Förstå, Välj rätt mening och Ordna händelser; blanda valfritt.
- Tre miniuppdrag per berättelselucka (75 uppdrag i boken).

## Tidigare versioner

- 0.8.0: 25 frivilliga berättelseluckor.
- 0.7.0: Färdiga illustrationer i tre serierutor.
- 0.6.0: 25 vardagsuttryck utöver 121 ord.
- 0.5.0: 12 illustrerade äventyrskartor.
- 0.4.0: 12 äventyrsvärldar.
- 0.2.0: Ordkompisar, stjärnor och barnvänlig design.
- 0.1.0: Fristående ordspel med Träna och Testa dig.
