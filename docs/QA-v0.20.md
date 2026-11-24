# QA – Ordjakten 0.20

## Körda kontroller

- `npm run check`: innehållsvalidering samt Node-baserade tester för alla
  tidigare funktioner plus minnesstegen. **155 automatiska tester godkända.**
- `python tests/browser_retention.py`: riktiga knapptryck i Chromium via lokal
  HTML/JS-injektion. Simulerar klockan dag 10/11/14; testar första besöket,
  frivilligt vänteläge, nya berättelser, avancerade ledtrådar och tryggt
  återbesök efter en svår omgång, samt simulerad återläsning och radering.
- `python tests/browser_clue_ladder.py`: gammal nivåprogression 1→2→3→2.
- `python tests/browser_adventures.py`: tolv kompletta äventyr med belöningar och karta.
- `python tests/browser_context_transfer.py`: två ord lika ofta som facit,
  tre miljöer, scenrotation och inget facit i provläge.

## Ytterligare manuella kontroller före publicering

1. Starta via `npm start` på en egen dator, spela ett ordpar och **ladda om sidan**.
   Kontrollera att Minnesstigen behåller datum, antal och det ursprungliga
   provresultatet. Ändra inte datum på datorn under riktiga tester.
2. Kontrollera att minnesförslaget visas dagen efter; tidigare än så ska ingen
   ny nivå gå att låsa upp.
3. Kontrollera att radering av historik även raderar den nya minnesstigen.
4. Installera som PWA över HTTPS och testa offline med samtliga lokala resurser.
5. Be minst ett par barn i åldern 8–10 år läsa förklaringarna och upptäcka
   om några ordpar kan förstås på flera sätt.

## Dokumenterad begränsning

Den här isolerade körmiljön kan ladda lokalsidan via `curl`, men Chromiums
navigering till `http://127.0.0.1` blockeras av administratörspolicy.
Injicerade webbläsartester verifierar **inte** verklig origin-persistens
eller service-worker-cache. De manuella kontrollerna ovan är därför öppna.
