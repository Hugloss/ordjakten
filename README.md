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

## Vad finns i version 0.20?

- **Träna** med omedelbar återkoppling och **Testa dig** med dolt facit.
- Lätt, medel, svårt och högskoleprovsinspirerade ordfrågor.
- 121 ord, 25 vardagsuttryck, 129 vardagsscener, 96 jämförelsescener och
  64 djupare berättelser för fyra jämförelsepar.
- Tolv valbara äventyrsvärldar med egna SVG-kartor och tre ordkompisar.
- Uttrycksberättelser, 25 luckor, tre typer av miniuppdrag och serieillustrationer.
- Anpassad träning, Min ordstig, Ledtrådstrappan, Förväxlingskompassen
  och frivilliga återbesök över tid.
- Val av frågeantal och timer; mörkt, ljust och automatiskt tema.
- Lokal resultathistorik utan konto eller backend.

## Projektstruktur

- `public/` – hela statiska webbappen, databank och lokala bildresurser.
- `scripts/` – utvecklingsserver och innehållsvalidering.
- `tests/` – automatiska Node-tester och valfria Python/Chromium-tester.
- `docs/` – pedagogik, arkitektur, innehåll och testplaner.
- `.github/workflows/check.yml` – CI för kvalitetskontroller vid PR.

Appen kan senare publiceras via GitHub Pages eller GitLab Pages, men
**denna första PR publicerar ingen webbplats**.

## Barnens integritet och innehåll

Spelresultat och repetitionsframsteg lagras lokalt i webbläsaren, inte på
en server. Inga användarkonton behövs. Inga personuppgifter ska läggas i
frågebanken. Allt material bör språkgranskas och provspelas med barn före
bredare lansering.

De färdiga serieillustrationerna kommer från öppet licensierade Noto Emoji.
Tillhörande licens finns i
`public/assets/story-icons/NOTO-EMOJI-LICENSE-AND-COPYRIGHT.txt`.
Det finns ännu ingen vald generell licens för den övriga projektkoden.

## Kvalitetsstatus

`npm run check` passerar **155 automatiska tester** i den importerade
v0.20-kodbasen. Webbläsartester och scenariotester ligger under `tests/`.
Verifiera särskilt localStorage över sidomladdning och offline-läge
i en vanlig webbläsare före publicering.

Fortsatt utveckling: se [färdplan](docs/ROADMAP.md),
[produktbeslut](docs/PRODUCT.md) och
[fullständig historik och äldre instruktioner](docs/README-HISTORY.md).

## Utvecklingsprinciper

Frågorna ska ha entydiga rätta svar och färdiga, granskade berättelser.
Färdigheter, spelbelöningar och provresultat hålls åtskilda.
Ingen AI-generering av nya frågor används i barnens aktiva spelsession.
