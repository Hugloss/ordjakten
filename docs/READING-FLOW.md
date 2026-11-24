# Läs först – förstå sedan

## Problemet från barnets provspelning

Berättelsen och förklaringen var för små jämfört med svaren. Barnet tryckte
på Nästa utan att uppfatta vad det skulle läsa.

## Två steg i Träna

1. Läs berättelsen. Stor text visas före svaren; ett tydligt knapptryck
   öppnar dem efter läsningen.
2. Besvara ordfrågan. Den ursprungliga frågan poängsätts som vanligt.
3. Läs förklaringen och exemplet, som får en egen stor yta utan
   konkurrerande belöningar.
4. Öppna Aha-frågan när du är redo. Välj vilken NY berättelse eller
   definition som passar. Tre redaktionellt skrivna alternativ visas.
5. Om det blir fel: läs igen, prova på nytt utan minuspoäng. Nästa ord
   visas först när Aha-frågan är klar.

Det går inte att bevisa läsning med en knapp eller ett rätt kryss:
uppföljningen ska i stället prova om barnet kan använda ordet i en ny
situation. Efter omgången visas hur många Aha-frågor som klarades direkt,
åtskilt från ordjaktens ursprungliga poäng.

**Testa dig** har ingen lässpärr mitt i provet och visar aldrig facit
innan provet är klart.

## Innehållskvalitet

Nya ordscener hämtas från den kuraterade vardagsbanken. Vissa ord fick
särskilda läsdistraktorer (fältet readingDistractors i
public/data/word-contexts.json) som aldrig ändrar vanliga frågors
svarsalternativ. Uttryck hämtar nya exempel från surprises.json och
missions.json. Ord utan skrivna berättelser använder befintliga
orddefinitioner. Inga nya berättelser eller bilder genereras under spel.

## Nästa barnprovspelning

Låt barnet prova fem frågor utan att tala om vad det ska klicka på.
Observera om barnet läser berättelsen, märker förklaringen efter svaret
och kan berätta med egna ord vad ordet betyder efteråt. Prova både korta
ord, ett långt uttryck och en vardagssituation, gärna även på mobil.
Ett rätt Aha-svar är inte automatiskt ett bevis på djup förståelse.

Kör kontrollen med:

    npm run check
    python tests/browser_reading_flow.py
    python tests/browser_reading_summary.py

Testwebbläsaren injicerar resurser i about:blank. Verifiera
localStorage över verklig omladdning och offline separat före lansering.
