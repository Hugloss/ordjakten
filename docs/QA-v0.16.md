# Ordjakten 0.16 — QA-protokoll

## Automatiska kontroller

- `npm run check`: canonical ord- och uttrycksbank, 129 vardagsberättelser, 12 jämförelsepar/48 scener, bildtillgångar och 123 Node-tester.
- `python tests/browser_contrast.py`: klickflöde i Chromium med fyra svar, båda orden som facit, rätt/fel, Aha-feedback, återgång till ordstigen, inga provresultat och mobil i mörkt/ljust tema.
- `python tests/browser_smoke.py`: existerande normalträning, Testa dig, 5 alternativ på högskoleprov, timer och mobiltema.
- `python tests/browser_focus_practice.py`: riktad träning och uttryck, provlägets facitspärr, 320 px.
- `python tests/browser_adaptive.py`: adaptiv träning och avstängningsfunktion.

Ett särskilt test återläser även jämförelsehistorik med en **simulerad localStorage**. Det visar att datamodellen kan återställas, inte att permanent lagring fungerar över riktig sidomladdning.

`tests/browser_smoke.py` laddar dokument, CSS och JS i Chromium utan en riktig webbserver, så dessa tester verifierar **inte** nätverkscaching, service workers eller en verklig `localStorage`-omladdning. Klickflöden är testade på ett riktigt DOM.

## Kvar före publicering

- Kör vanlig lokal server (`npm start`), besvara frågor, ladda om sidan och kontrollera att historik/temaval återkommer. Browser-sandbox kan blockera localhost-navigering.
- Kör en normal och en tidsbegränsad testomgång med en verklig browser-origin, inklusive att provfacit inte läcker.
- Kontrollera offline-läget efter första laddning via utvecklarverktygens Network > Offline; endast pre-cache av statiska resurser är skriven.
- Testa 320 px/390 px, skärmläsare, enbart tangentbord samt mörkt/ljust tema med hög kontrast.
- Språkgranska de 48 situationerna och provspela med 8–10-åringar. Kontrollera att båda alternativen inte kan försvaras samtidigt i en given situation.

Inga konton, externa databaser, överföring av resultat eller nya AI-genererade bilder ingår. Publicering har inte gjorts.
