# QA – Ordjakten v0.15

## Slutförda kontroller

- `npm run check`: 113/113 godkända Node-tester, inklusive 11 nya enhetstester för 0.15 (testantalet kan ändras när nya tester tillkommer).
- `python tests/browser_focus_practice.py`: grönt – riktade vardagsfrågor, tre olika redan skrivna scener, fel/rätt, ordstig tillbaka, hemrekommendation, separerade provresultat, uttryckets ordningsuppgift med ångra/nollställ, 320px bildstöd och tema.
- Äldre browser-regressioner gröna: `browser_learning_map.py`, `browser_adaptive.py`, `browser_review.py`, `browser_missions.py`, `browser_quests.py`, `browser_surprises.py`, `browser_adventures.py` (alla 12 världar), `browser_expressions.py`, `browser_playful.py`.
- Äldre, långa `browser_contexts.py` och `browser_smoke.py` fastnade i testmiljön, så de är **inte markerade som godkända** i denna version. Motsvarande nya funktioner täcks av `browser_focus_practice.py` och övriga ovanstående kontroller.

## Manuellt före publicering

1. Kör projektet lokalt i vanlig Chrome/Firefox på en riktig HTTP-origin, spela en riktad övning, ladda om sidan och bekräfta att ordstigen bevarat färdighetsstegen och att rekommendationen är korrekt.
2. Prova att gå från **Testa dig** till Min ordstig och tillbaka, och kontrollera att facit aldrig visas innan testet har avslutats.
3. Prova offline efter att sidan cachats, i mörkt och ljust tema. Se särskilt till att nya `focus-practice.js` och CSS laddas när en gammal PWA-cache uppdateras.
4. Prova med barn 8–10 år: om de förstår *varför* ordet passar, inte bara lär sig att klicka på samma ord tre gånger.
5. Granska stavning, distraktorer, skärmläsare, hög kontrast och långa uttryck.
6. Testa att exportera och radera historiken. Raderade data ska inte återskapas av gammal minnescache.

**Dataskydd:** inga nya användaruppgifter, externa API:er eller trackers tillkommer. Ordjakten är fortfarande opublicerat.
