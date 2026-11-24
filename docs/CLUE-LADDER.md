# Ordjakten 0.19 – Ledtrådstrappan

## Pedagogiskt syfte

Målet är att barnet ska förstå **varför ett begrepp passar i en ny situation** och inte bara känna igen ett tydligt ord i en upprepad mening. Därför får ett urval jämförelseövningar tre nivåer:

1. **🌱 Tydliga ledtrådar:** de åtta ursprungliga berättelserna för ordparet, till exempel vatten där sikten hindras av lera.
2. **🔎 Läs mellan raderna:** åtta nya redaktionellt skrivna situationer där man behöver koppla några detaljer till begreppet.
3. **🧠 Dra egna slutsatser:** åtta ytterligare situationer där barnet drar en slutsats av exempelvis en förändring före och efter en händelse.

Varje nivå har fyra berättelser per ord (åtta totalt) och täcker fyra miljöer för vart och ett av orden: hemma, skolan, naturen och fritiden. **Övningen innehåller alltid fyra frågor**: två där det ena ordet är rätt, två där det andra är rätt, och minst tre miljöer. En ny omgång på samma nivå försöker undvika de senast visade scenerna.

### Första urvalet: 4 par, 64 nya scener

- *Grumlig* / *genomskinlig* – hur sikten förändras i vatten.
- *Skrovlig* / *bucklig* – sträva ytor jämfört med intryckningar.
- *Randig* / *prickig* – sammanhängande band jämfört med små enskilda fläckar.
- *Nyfiken* / *misstänksam* – önskan att förstå jämfört med en anledning att tvivla.

**De åtta andra ordparen ligger kvar på den ursprungliga jämförelsen.** De får inte automatiskt påhittade berättelser eller falska svårighetsgrader. Vi kan utöka den kuraterade banken efter språkgranskning och barnprovspelning.

## Anpassning – inspekterbara regler

- Första gången startar jämförelseövningen på nivå 1.
- Efter **minst tre rätt av fyra och ett rätt för vart och ett av orden** flyttas nästa session upp ett steg, högst till nivå 3.
- Efter **högst ett rätt av fyra** flyttas nästa session ned ett steg, lägst till nivå 1.
- Vid två rätt av fyra stannar nivån där den var.
- Nivån ändras **en gång efter en hel, balanserad session**. Upprepade klick eller ett ofullständigt pass flyttar inte nivån. Passet ger inga extra stjärnor, testpoäng eller repetitionsdagar.
- Efter svaret visas betydelse, förklaring av skillnaden och en enkel **ledtråd att uppmärksamma**. Den extra ledtråden syns **aldrig före svaret**.

Det här är en enkel pedagogisk övningsregel, inte en vetenskapligt validerad förmågeskattning. Ett bra resultat på en sittning betyder inte att barnet behärskar ordet på längre sikt. Barn ska känna att de får lagom stöd, inte att de får betyg.

## Data, API och versionshantering

- Redaktionell källa: `public/data/clue-ladder.json`. Här ligger bara *nya* nivå 2–3-scener; nivå 1 kommer fortsatt från `public/data/contrasts.json`.
- Webbläsarkopia: `public/data/clue-ladder.js`, genereras med `npm run sync:clues`.
- Validering och nivåbeslut: `public/js/clue-ladder.js`.
- Jämförelseplanering: `public/js/contrast.js` väljer nivåspecifika scener men bevarar befintligt utfallsformat.
- Sparad, lokal data: `clueProgress` per ordpar med `{level, visits, reached, lastScore}`. Avgränsade heltal och godkända par-ID:n; inga namn, fria svar eller berättelsetexter sparas. Äldre `ordjakten-v1`-data läses utan att man behöver rensa dem.
- `confusionProgress` lagrar fortfarande de **senaste tolv** granskade observationerna med scen-ID och miljö. Den nya kodvägen accepterar bara scen-ID:n från de kuraterade källorna; inga förfalskade textfrågor räknas.
- Export av resultat inkluderar `clueProgress`; knappen **Radera sparade resultat** raderar det också.
- Den befintliga service workern har bytt cacheversion och omfattar de nya statiska filerna.

## Utvecklar- och kvalitetskontroller

```bash
npm run sync:clues
npm run check
python tests/browser_clue_ladder.py
python tests/browser_context_transfer.py
python tests/browser_smoke.py
```

`npm run check` ska kontrollera att JSON och JS stämmer överens, att facit inte står i frågan, att varje scen har rimlig förklaring, att resultatet är jämnt balanserat samt att inga dubblett-ID:n finns. Browser-testet spelar nivårörelsen **1 → 2 → 3 → 2** med verkliga klick och kontrollerar hög kontrast på 320 px mobil.

### Kvar före publicering

Den begränsade Chromium-miljön blockerar navigering till både localhost och testdomäner, så **riktig sidomladdning med localStorage och offlinecache har inte verifierats**. Dessa behöver provas manuellt på en riktig webbplatsorigin. Automatiska testresultat ersätter inte heller språkgranskning eller en provspelning med 8–10-åringar.
