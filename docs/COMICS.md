# Bildserier med färdiga illustrationer – Ordjakten 0.8

## Pedagogisk avsikt

Ord som **skrovlig** kan fungera med en bild, men många uttryck som **för en gångs skull** behöver en liten berättelse. Varje uttryck får därför en begriplig mini-serie i tre rutor:

1. Vad brukar hända? (Bakgrund)
2. Vad hände den här gången? (Förändring)
3. Vad betyder uttrycket? (Aha-förklaringen)

Bilderna ska **stödja**, inte gissa eller avgöra facit. De kan aldrig ersätta ordens definition. Alla rutor har full svensk förklaring. Om inget lämpligt färdigt piktogram finns ska serien använda text utan en missvisande bild.

## Bildkällor och upphovsrätt

Illustrationerna kommer från färdiga glyfbilder i **Noto Color Emoji** från **Google**:

- Upstream: https://github.com/googlefonts/noto-emoji
- Fontlicens: **SIL Open Font License 1.1** (Noto Emoji fonts).
- Originalbilder/verktyg i upstream kan ha separat Apache 2.0-licens; dessa kopior är rasteriserade färg-glyfer från en installerad Noto Emoji-font.
- Full lokal copyright- och licensinformation: `public/assets/story-icons/NOTO-EMOJI-LICENSE-AND-COPYRIGHT.txt`.
- **Inga fontfiler distribueras**, bara 128x128 PNG-rasteriseringar av redan befintliga bilder.
- Ingen bildgenerering, externa API:er, skript från CDN eller begäran till externa webbplatser behövs vid spelning.
- 73 separata symboler kan återanvändas i samtliga 25 serier, med en liten total filstorlek.

Licensinformationen finns även från webbappens sidfot.

## Data och implementation

- `public/data/comics.json` är den läsbara källan med ikonval och en kort Aha-mening per uttrycks-ID.
- `public/data/comics.js` är samma data för statisk inläsning; båda valideras mot varandra.
- `public/js/comics.js` bygger tre tillgängliga HTML-bildrutor med DOM-noder och `textContent`, inte HTML-injektion.
- `public/css/comics.css` håller mobilrutor staplade och datorrutor bredvid varandra.
- `public/assets/story-icons/*.png` innehåller redan färdig emoji-konst från Noto.
- `public/sw.js` lägger bildfilerna i offline-cachen.

`C.validate(comics, expressions)` ska godkänna hela serie-banken och samtliga bildfiler måste finnas. Om en fråga får `kind !== "expression"` används **inga** serier.

## Lärandeläge och provläge

**Träna:** Visa rätt/fel och den vanliga betydelsen direkt efter ett svar. Bildserien finns bakom en frivillig **🎁 Öppna luckan**-knapp. Den vanliga frågan döljs. En felaktig gissning är en chans att lära sig uttrycket.

**Testa dig:** Visa inga bilder/ledtrådar från serien under frågorna. Efter provet kan användaren öppna serien och ett extra miniuppdrag i en `<details>`-ruta för respektive uttryck eller i **Min luckbok**. Se `SURPRISES.md`.

**Tillgänglighet:** Bildfilerna är dekorativa (`alt=""`) eftersom caption i HTML alltid innehåller hela betydelsen. Om ikoner misslyckas använder vi motsvarande Unicode-emoji som fallback. Mörkt och ljust tema, touch och reducerad rörelse fungerar som tidigare.

## Redaktionskvalitet och nästa steg

Varje serie bör språkgranskas av vuxen och helst testas med barn 8–10 år. En symbol som 🚗 betyder bara bil, inte automatiskt att pappa kunde skjutsa. Därför får bilden **alltid sällskap av en tydlig text**. Undvik misstolkningar eller att illustrera uttrycken alltför bokstavligt. Inga fria GIF-filer eller slumpmässigt skrapade serier från webben ska tas in utan dokumenterad licens, kvalitet och källa.

För att regenerera ikonpaketet från en redan installerad Noto-font kan en utvecklare använda `python scripts/build-comics-assets.py` om Pillow finns installerat. Inget sådant steg krävs under körning eller publicering.
