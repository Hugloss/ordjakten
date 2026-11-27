# 🔎 Ordjakten

**Hitta orden. Förstå världen.** Ett lekfullt svenskt ordspel för barn,
med möjlighet att senare utveckla träningen för äldre elever och högskoleprovet.

## Kom igång

Krav: **Node.js 20 eller senare** för den lokala webbservern. Inga npm-paket
behöver installeras.

```sh
npm start
```

Öppna sedan <http://localhost:4173>.

Kör innehållskontroller och samtliga Node-tester:

```sh
npm run check
```

## Vad finns i spelet?

- **Träna** med omedelbar återkoppling och **Testa dig** med dolt facit.
- Lätt, medel, svårt och frivillig **Fördjupning**.
- 121 ord med konkreta förklaringar, vardagsexempel, motexempel och egna tankefrågor.
- 59 uttryck, 14 skolord, 363 vardagsscener, 96 jämförelsescener och
  64 djupare berättelser för fyra jämförelsepar.
- Sex befintliga uttryck har dessutom 18 situationer där sammanhanget
  avgör betydelsen eller visar att barnet behöver fråga vad personen menar.
- Tolv valbara äventyrsvärldar med egna SVG-kartor och tre ordkompisar.
- **Upptäckarklubben**: nya originalskrivna äventyr inspirerade av
  mysterier, spioner, gåtor, djur, musik och andra fantasiteman.
  Varje äventyr har tre korta uppdrag med två ledtrådar, hjälp vid fel
  och ett eget fynd. Utan timer eller poängavdrag.
  Se [spelregler och barnprovspelning](docs/UPPTACKARKLUBBEN.md).
- **Skattkartan**: läs en ledtråd, välj en plats och lös dess orduppgift.
  48 skrivna ledtrådar ger separata sakletarfynd och ordstjärnor i egen takt.
  Två korta hållpunkter hjälper barnet att jämföra platser. Skattboken samlar
  kartmärken och visar vilka skatter och ordstjärnor som finns kvar.
- **Tolv mysterier** med ledtrådsbevis, frivillig muntlig förklaring och
  ett nytt vardagsfall där barnet måste kontrollera två detaljer samtidigt.
- Sparad stjärnsamling med sex samlingsmärken, en synlig stjärnrad och
  frivilliga nya chanser utan timer för de stjärnor som återstår.
- Uttrycksberättelser, 73 luckor, tre typer av miniuppdrag och serieillustrationer.
- Anpassad träning, Min ordstig, Ledtrådstrappan, Förväxlingskompassen
  och frivilliga återbesök över tid.
- Val av frågeantal och timer; mörkt, ljust och automatiskt tema.
- Lokal resultathistorik utan konto eller backend.

Vanliga omgångar och automatiska träningsförslag utgår från **101 ord och
65 uttryck**, inklusive alla 14 skolord. Urvalet prioriterar användbara ord
om saker, egenskaper, väder, känslor och samspel i barnets vardag. Ytterligare
20 ord och 8 uttryck finns kvar i frivillig fördjupning och går att hitta
i ordsamlingen. Urvalet är en redaktionell prioritering, ingen mätning av
ordfrekvens. Inga ord eller tidigare framsteg har tagits bort.

## Projektstruktur

- `public/` – hela statiska webbappen, databank och lokala bildresurser.
- `scripts/` – utvecklingsserver och innehållsvalidering.
- `tests/` – automatiska Node-tester och valfria Python/Chromium-tester.
- `docs/` – pedagogik, arkitektur, innehåll och testplaner.
- `.github/workflows/check.yml` – CI för kvalitetskontroller vid PR.
- `.github/workflows/deploy-pages.yml` – kontroller och publicering till GitHub Pages från `main`.

## Spela och publicera

Publiceringsadressen är [Ordjakten på GitHub Pages](https://hugloss.github.io/ordjakten/).
Arbetsflödet publicerar `public/` när relevanta ändringar når `main` och
kontrollerna passerar. Se [publiceringsguiden](docs/GITHUB-PAGES.md) för
statuskontroll och [första provspelningen](docs/FIRST-PUBLISH.md) för vad
som ska kontrolleras i webbläsare och med barn.

## Barnens integritet och innehåll

Spelresultat och repetitionsframsteg lagras lokalt i webbläsaren, inte på
en server. Inga användarkonton behövs. Inga personuppgifter ska läggas i
frågebanken. Allt material bör språkgranskas och provspelas med barn före
bredare lansering.

De färdiga serieillustrationerna kommer från öppet licensierade Noto Emoji.
Tillhörande licens finns i
`public/assets/story-icons/NOTO-EMOJI-LICENSE-AND-COPYRIGHT.txt`.
Det finns ännu ingen vald generell licens för den övriga projektkoden.

## Läsvänligt träningsflöde (för barn 8–10 år)

I **Träna** visas berättelsen med stor läsbar text före svaren. När en
berättelse finns får barnet först trycka **Jag har läst – visa svaren**.
Efter varje svar visas förklaringen tydligt och barnet får en kort
**Aha-fråga** med tre alternativ innan nästa ord går att öppna.
Snabbstarten börjar med fem lätta ord utan timer. Fler exempel, motexempel
och egna tankefrågor öppnas frivilligt under förklaringen. När webbläsaren
har talstöd går även Aha-frågan och dess svarsalternativ att lyssna på.
Frågan bygger på skrivna vardagsberättelser eller på granskade definitioner;
den ger **inga ytterligare provpoäng**. Ett eget rätt Aha-svar kan tända
ordets saknade stjärna om huvudfrågan blev fel. Varje fråga ger högst en
stjärna i samma rad, och ett visat facit ger ingen stjärna. Separata
observationer av Aha-svar används för att välja frivilliga återbesök.

Stjärnorna sparas när de delas ut. Efter en runda eller omladdning går det
att ge radens återstående ord en ny chans med skrivna vardagssituationer.
Den övningen har ingen timer och ändrar inte tidigare resultat. En ny vanlig
omgång börjar en ny rad; alla samlade stjärnor finns kvar. Se
[stjärnor och lekfull återkoppling](docs/PLAYFUL.md).

I **Testa dig** och fördjupningsprovet finns ingen förklaringsfråga
under själva provet: facit och förklaringar visas först efteråt.
Kontrollen kan ge mer aktiv läsning, men den garanterar inte att barnet har
förstått texten. Låt gärna barnet berätta innebörden med egna ord.

## Kvalitetsstatus

`npm run check` kontrollerar hela ordbanken, dess genererade webbläsarfiler
och den snabba Node-sviten. Alla 121 ord ska ha en fullständig förklaring,
tre vardagsscener och särskilt valda Aha-alternativ. Webbläsartester och
scenariotester ligger under `tests/`.
Verifiera särskilt localStorage över sidomladdning och offline-läge
i en vanlig webbläsare före publicering.

Innehållsgenomgången och dess kvarvarande granskningsbehov beskrivs i
[Förstå orden](docs/WORD-UNDERSTANDING.md). Den efterföljande granskningen av
ordurval, entydiga speluppgifter och skolfrågor finns i
[Post-review: vardagsord och tydliga frågor](docs/POST-REVIEW-EVERYDAY.md).
Nästa genomgång behandlar [tydligare frågor och förklaringar](docs/CLEARER-EXPLANATIONS.md),
med särskilt fokus på överlappande betydelser och återkoppling till rätt uppgift.
[Uttryck i vardagen och läsbara teman](docs/EVERYDAY-INSTRUCTIONS.md) beskriver
vardagsuttrycken, läsbarheten och hur samma uttryck övas med olika betydelser.

Fortsatt utveckling: se [färdplan](docs/ROADMAP.md),
[produktbeslut](docs/PRODUCT.md) och
[fullständig historik och äldre instruktioner](docs/README-HISTORY.md).

## Utvecklingsprinciper

Frågorna ska ha entydiga rätta svar och färdiga, granskade berättelser.
Färdigheter, spelbelöningar och provresultat hålls åtskilda.
Ingen AI-generering av nya frågor används i barnens aktiva spelsession.
