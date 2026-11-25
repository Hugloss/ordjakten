# Orddetektiven – hitta textens ledtråd

Frivilligt minipass med högst tre berättelser från olika granskade ordpar. Läs hela berättelsen innan ordalternativen visas. Välj ordet och därefter den textbit som bäst förklarar betydelsen. Samma berättelse är synlig hela tiden. Två alternativ är exakta, icke överlappande citat ur texten: en bärande ledtråd och en mindre relevant detalj. Ingen generering av berättelser eller automatisk tolkning av fri text.

48 handvalda ledtrådspar i befintliga kontrastscener (två per ord, 24 ord, tolv ordpar). De nya urvalen behöver fortfarande barnprovspelning och redaktionell återkoppling. Om en text ändras så att citaten inte längre finns exakt och entydigt hoppas scenen över. Ändrat innehåll gör gamla scenobservationer inaktuella. Start från Min ordstig/startsidan eller ett ordkort. Svårare ordpar ingår i snabbstart när något ord i paret tidigare mötts, annars bara startpar.

## Separata observationer

- Ordval och ledtrådsval är olika signaler. Ett direktstartat ordkort visar redan målordet; ordvalet märks därför som förhandsvisat, inte självständigt rätt.
- Definition kan visas som stöd. Vid första miss får barnet läsa igen; vid andra miss eller eget val visas ledtråden. Endast direkt ledtrådsval utan extra stöd räknas som sådant, även om ordvalet behövde hjälp. Det betyder inte att barnet självständigt förstod hela berättelsen.
- Förklaringen och textmarkeringen visas först efter avslutad uppgift. Inga provpoäng, stjärnor, vanliga färdighetsobservationer eller Aha-bevis förändras.
- Minst ett dygn mellan observationer av samma scen. Prioritera tidigare stödda scener, därefter oprövade och sedan återbesök. Min ordstig visar distinkta scener som provats; upprepning av samma scen ökar inte antalet olika upptäckter.

Lokal `detectorProgress`: endast scen-ID, innehållskontrollkod, begränsade räknare, senaste utfall och tidsstämpel. Ingen egen text eller externa anrop. Avbrutna uppgifter sparas inte. Export och radering inkluderar historiken; gammal historik fungerar oförändrad.

## Kontroll
`npm run check` inkluderar testfallen för citat, urval, väntetid, stöd, dataformat och poängisolering. Frivilligt `python tests/browser_detector.py` använder befintlig about:blank-harness. Citatens längder är balanserade och testas så att rätt svar inte konsekvent är längre. Verifiera ändå att visuella mönster inte ger en genväg, och att citaten är begripliga för målgruppen.
