# Långtidsminne – gemensamma repetitionsintervall

Aktiv återkallning (skrivövningar) och Aha-överföring använder nu en gemensam konservativ intervallmodell i `public/js/spaced-memory.js`. De två spåren har separata observationer och egna nivåer. Ett korrekt val i en berättelse är inte samma sak som att själv komma på ordet. Intervallen är redaktionellt valda regler, inte en statistiskt kalibrerad uppskattning av barnets minne.

| Tillstånd | Nästa intervall |
|---|---|
| Första självständiga svar / svar med stöd | 1 dygn |
| Självständigt svar efter hela föregående intervall | 3 dygn, sedan 7, 14, 30 |
| Ny svårighet (stöd, visat facit, misslyckad återkallning) | Tillbaka till 1 dygn |
| Förhandsvisad skrivövning från ett ordkort | Behåll intervallets längd, men inte en ny självständig träff |

Tidiga upprepningar kan inte förlänga intervallet. För Aha måste också berättelsens godkända evidens-ID skilja sig från det senast observerade och det senast använda vid intervallobservationen. Övning i förtid i vanliga träningspass får inte skapa ett längre intervall; en verklig svårighet återaktiverar kortare repetition. Minst ett dygn sedan senaste Aha-exponering gäller fortfarande. Befintlig Aha-evidens om två olika exempel behålls separat. Aha visar betydelsen före frågan; detta är alltså förmåga att tillämpa en läst betydelse, inte obeledd ordåterkallning. Efter att de begränsade redaktionella berättelserna har använts är det återbesök med andra befintliga exempel, inte påstått obegränsat nytt material.

Skrivövningens ledtrådsnivå är separat från repetitionsintervallet. Ett stavfel eller annat rimligt ord är inte bevis på missad ordförståelse, men övningen kan behöva mer stöd. En förhandsvisning bevarar intervallet och ledtrådsnivån; första självständiga svar efter förhandsvisning kan inte höja intervallet.

## Integration

Befintliga Aha- och skrivövningsplaner, ordkort och Mitt nästa äventyr använder samma förfallotid. Tidigare lyckade Aha-exempel återkommer när de är redo i stället för att försvinna ur kön. Endast faktiskt tillgängliga godkända exempel väljs. Redo stödbehov prioriteras framför vanliga återbesök. Ordparens redan befintliga minnesstig och övriga träningsmetoder behåller sina regler i denna iteration.

Min ordstig och startsidan visar antal redo/vilande återbesök för de två spåren samt ungefär när nästa väntande uppgift blir redo. Inga krav på dagliga spel, avdrag, poäng eller press. Inget påstående om att ett ord är permanent behärskat.

## Lagring och verifiering

Frivilliga fält `memory` i befintliga `recallProgress[id]` och `readingProgress[id].transfer`: steg, tid, utfall och för Aha ett redan tillåtet evidens-ID. Ingen fri text eller ny persondata. Gamla räknare ger högst den tidigare ett-dygnsbaslinjen tills ny observation görs. Ingen separat lagringsnyckel. Export/radering använder samma historik som tidigare. Nytt offline-script ingår i befintlig cache.

`npm run check` verifierar intervall, klockgränser, återaktivering, ledtrådar, gamla data, Aha-variation och gemensamt urval. Effekten på faktisk långtidsinlärning behöver följas upp med barnprovspelning; reglerna är inte vetenskapligt kalibrerade för en viss elev.
