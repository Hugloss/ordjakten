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

## Adaptiva ledtrådar
Fyra ordpar (vatten/sikt, ojämna ytor, mönster och olika sorters undran) har nu tre nivåer. De övriga åtta ordparen fortsätter på första nivån tills ytterligare redaktionellt material finns. Totalt 80 scener: 48 grundscener, 16 på nivå 2 och 16 på nivå 3.

- Nivå 1: en ledtråd bland två citat. Nivå 2: en bäst passande ledtråd bland tre exakta citat. Nivå 3: en fråga om slutsatsen visas innan ordalternativen. Barnet kan tänka eller säga sin slutsats, sedan välja ett ord och två textbitar som tillsammans stödjer det. Båda textbitarna markeras efter återkoppling. Fri tanke eller muntligt svar bedöms inte automatiskt.
- Nivån gäller ordparet, inte barnets allmänna läsförmåga. Två självständiga träffar (ordval och ledtrådsval direkt utan extra stöd) i olika scener, för båda orden, i olika miljöer och med minst 24 timmar emellan höjer nivån ett steg. Upprepningar, förhandsvisade ordkort och gamla aggregerade observationer höjer inte nivån. När barnet behöver stöd i snabbpasset återgår ordparet ett steg och får en ny chans.
- En väntande kvalificerande observation gör att urvalet prioriterar det andra ordet och en annan miljö efter ett dygn. Om alla scener på aktuell nivå vilar hoppar snabbpasset till ett annat ordpar. Det används ingen dold nivåhöjning eller utfyllnad med låsta scener.
- `detectorLevels` är en liten separat del av befintlig lokal historik: nivå, senaste tidpunkt och en eventuell referens till en kvalificerande scen (ID, innehållskontrollkod, tid). Radering/export inkluderar nivån. Inga barns egna ord sparas, inga nya provpoäng. Föråldrade bevisreferenser ignoreras.
- Tre citat och tvåledtrådsuppgifter behöver barnprovspelas; tester kontrollerar bokstavliga citat, nivåregler, balans och urval, inte faktisk pedagogisk effekt.
