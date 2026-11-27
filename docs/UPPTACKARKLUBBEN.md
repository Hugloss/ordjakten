# Upptäckarklubben – egna berättelser att utforska

**Mål:** Barn omkring 6–10 år ska få känna sig som upptäckare, inte som
deltagare i ett prov. Vi utgår från lekfulla kalasidéer, men äventyren
i Ordjakten är nya, originalskrivna svenska berättelser och bygger inte
på köpta manus, trycksaker eller skyddade figurer.

## Tolv öppna portaler

| Tema | Äventyr | Fynd |
| --- | --- | --- |
| Detektiv | Fallet med den försvunna tårtspaden | Detektivmärket |
| Hemliga agenter | Agenternas hemliga ljussignal | Agentbrickan |
| Gåtrum | Gåtrummets hemliga dörr | Gåtnyckeln |
| Pirater | Piraternas stjärnkarta | Sjökompassen |
| Trollskola | Trollskolans försvunna skratt | Skrattklockan |
| Dinosaurier | Dinosauriernas äggmysterium | Fyndmärket |
| Fantasiprofessor | Professor Pärlans bubbelgåta | Bubbelmärket |
| Vänligt spöke | Det vänliga spökets klocka | Spökvännens ljus |
| Rymdäventyr | Rymdstationens vänliga signal | Signalstjärnan |
| Djungelexpedition | Djungelns gömda bibliotek | Djungelns sagobok |
| Superhjältar | Superhjältarnas hjälpuppdrag | Hjältemärket |
| Egyptens historia | Pyramidens stjärnhemlighet | Stjärnnyckeln |

Alla världar är valbara från början. Varje berättelse har tre
sammanhängande steg: orientering, en ny situation och en avslutande
upptäckt. Barnet får en kort scen, **två synliga ledtrådar** och tre
svarsalternativ. Ett alternativ stämmer med båda spåren, de andra
beskriver olika felaktiga val. Ett fel ger konkret, respektfull
återkoppling; det går att välja igen utan förlust av poäng, skatter
eller tid.

När barnet väljer rätt förklarar spelet **varför** ledtrådarna passar.
Barnet får möjlighet att formulera en egen motivering, men behöver
inte skriva eller spela in något. Därefter fortsätter berättelsen.
Efter tredje steget sparas ett unikt fynd i Upptäckarklubbens översikt.
Inga bonuspoäng delas ut för hastighet eller antal försök.

## Innehållskvalitet

Texterna ska kunna högläsas och vara begripliga utan att först se
en bild. Använd korta, naturliga meningar och svenska vardagsord.
Specialord kan förekomma när scenen förklarar sammanhanget, till
exempel `antenn`, `monter` och `fossil`. Inga alternativ får bara
skilja sig genom en osynlig färgkod eller okända symboler.

Ledtrådarna i en scen ska beskriva **två självständiga egenskaper**.
Varje felalternativ ska avsiktligt passa **ett** spår och motsäga det
andra – inte missa båda eller av misstag passa båda.
Förklaringen efter ett fel ska visa vilken egenskap som passar och
vilken som inte passar. Inget facit eller kommande scen finns i
webbläsarmodellen innan barnet når den delen. Rubrikerna ska skapa
nyfikenhet men inte avslöja svaret.

För att passa yngre barn är gåtrummet frivilligt och utan inlåsning.
Spöket är en vän, superhjältarna samarbetar i stället för att slåss,
och professoruppdraget arbetar med ritade fantasibubblor i stället
för verkliga kemiska experiment. Egyptenberättelsen utspelar sig
i en respektfull museiutställning; historiska föremål lämnas i fred.

## Lagring och arkitektur

Kanoniskt innehåll finns **bara** i
`public/js/mission-portals-data.js`: 12 berättelser, 36 uppdrag.
`mission-portals.js` validerar innehåll och all sparad progression,
`mission-portals-view.js` bygger tillgängliga knappar och lästexter,
`mission-portals.css` hanterar mobil, tema och högkontrast.

Den enda nya lagringen är `history.discoveryPortals` under befintlig
`ordjakten-v1` i webbläsaren. En post kan bara innehålla ett känt
äventyrs-ID, versionsnummer, steg 0–3, klarmarkering, högst två
felval och frivillig hjälpruta. Inga namn, fri text, röster eller
personliga uppgifter lagras. Import med ogiltigt steg återställer
bara det berörda äventyret. Fynd och steg följer med när resultat
exporteras och raderas när användaren rensar all historik.

Upptäckarklubben ändrar **inte** befintliga skattkartor, ordstjärnor,
provresultat, repetitionsplaner eller adaptiv bedömning. Allt är
tillgängligt offline via samma service worker.

## Kontroll och barnprovspelning

- `npm run check` kör innehållsvalidering och Node-tester för
  samtliga 36 uppdrag, äldre historik, olovliga steg, dubbla klick,
  felval, hjälp och unika fynd.
- Valfri webbläsarprovning:
  `python tests/browser_mission_portals.py`
  med Playwright och Chromium installerat.
- Barnprovspelning: låt barnet välja ett tema fritt. Se om det läser
  båda ledtrådarna, kan peka ut ett svar som bara passar ett spår,
  hittar hjälpen och vågar prova igen. Fråga efter avslutat steg
  *”Varför passar de två spåren tillsammans?”*
- Prova i ljus/mörk/högkontrast, på en smal mobil, med tangentbord
  och med frivillig svensk uppläsning.
- Anteckna bara generella användbarhetsfynd, inte namn eller
  inspelningar. Automatiska tester bevisar inte att barn förstår.

## Nästa möjlighet

Om verkliga provspelningar visar att barnen vill fördjupa sig kan varje
tema få fler kapitel, enkla kartanimationer och samarbetsuppdrag för
två barn. Behåll frivillighet och språklig förståelse som mål snarare
än fart, topplistor eller poängavdrag.
