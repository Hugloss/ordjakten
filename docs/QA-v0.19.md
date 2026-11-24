# QA – Ordjakten 0.19

## Vad som utvecklats

64 nya handskrivna berättelser för fyra ordpar, nivå 2–3 med fyra nya miljöer per ord; tidigare 96 jämförelser är intakta. Tre nivåer väljs i frivillig **Hitta skillnaden**, inte i vanliga test eller högskoleprovsutmaningen. Berättelse, svar, förklaring och ledtråd visas enligt samma mörka/ljusa tillgängliga mobilflöde som tidigare.

## Testresultat

- **147 automatiska tester godkända** med `npm run check` (inklusive nio nya testfall för ledtrådstrappan).
- **Webbläsartest `browser_clue_ladder.py` godkänt**, med nivåbyte 1 → 2 → 3 → 2, simulerad återläsning, radering av historik, 320 px mobil och provlägets isolering.
- Tidigare webbläsartester godkända: `browser_smoke.py`, `browser_context_transfer.py`, `browser_contrast.py`, `browser_confusions.py`, `browser_focus_practice.py`, `browser_adaptive.py`, `browser_adventures.py`, `browser_learning_map.py` och `browser_storage_rehydration.py` (simulering av lagring).
- Den lokala servern svarar korrekt med index, JavaScript, JSON, CSS och service worker på en separat testport. Testwebbläsaren kunde däremot inte navigera till testadressen (säkerhetsblockering).

## Automatiska testfall

- Alla nivåer är balanserade och minst tre miljöer förekommer i varje fyrfrågorsomgång.
- Nivåval 1 → 2 → 3 efter bra resultat, samt 3 → 2 efter ett svårt resultat. Mellanresultat (2/4) behåller nivån.
- Hela sessionen krävs för uppflyttning; ofullständig, duplicerad, förfalskad eller gammal session avvisas.
- Vid en upprepad nivå får barnet andra berättelser när de finns tillgängliga.
- Den ordspecifika förväxlingshistoriken känner igen godkända nya scener, men vanliga testfrågor kan inte skapa observationer om förväxling.
- Äldre lokala framsteg importeras utan att man uppfinner en nivå eller raderar provpoäng.
- Ingen ny testpoäng, stjärna eller repetitionsdag läggs till av Ledtrådstrappan.
- JS-mirrorscript, PWA-cache och alla nya filvägar kontrolleras tillsammans med tidigare ordbank.

## Webbläsartest

`python tests/browser_clue_ladder.py` kontrollerar tre riktiga sessioner om fyra frågor, facit efter svar, Aha-rutor, mobil i mörkt tema samt 320 px i ljust högkontrastläge. `browser_contrast.py`, `browser_confusions.py`, `browser_focus_practice.py`, `browser_adaptive.py`, `browser_context_transfer.py` och `browser_adventures.py` är regressionstester.

## Ärliga begränsningar

Lagring över en faktisk HTTP(S)-sidomladdning och offlineläge är fortfarande manuella QA-punkter eftersom den här Chromium-miljön blockerar även lokala eller avlyssnade test-URL:er (`ERR_BLOCKED_BY_ADMINISTRATOR`). Nya sceners språkliga entydighet kan inte bevisas enbart med koden; provspela med målgruppen innan lansering.
