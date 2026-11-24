# QA – Ordjakten 0.14

## Testomfattning

- `npm run check`: innehållsvalidering + **102 automatiska Node-tester** (tidigare 88 + 14 nya om kartan).
- `python tests/browser_learning_map.py`: helt ny historik, alla 146 begrepp, sökning, öppningsbar stegvis stig, efter-test-vyn, mobil/mörkt/ljust/hög kontrast, avslutat prov utan facitläckage.
- `python tests/browser_storage_rehydration.py`: simulerad minneslagring (INTE en riktig localStorage-omladdning); kontroll av att gammal sparad historik kan läsas och rensas och att kartans siffror följer med.
- Regressioner: `browser_smoke.py`, `browser_adaptive.py`, `browser_review.py` körda och godkända separat.

## Pedagogiskt säkerställda regler

- Bara ett **rätt svar på en faktisk uppgift** kan ge en ny grön del av stigen (med undantag för Upptäckt, som visar ett försök oavsett resultat).
- Bildalternativ blir inte automatiskt en markering för textförståelse.
- Omvänd ordfråga är **inte** samma sak som en vardagsberättelse, även om de båda tränar ett ord från fler håll.
- Ordkort utan egna vardagsscener kan använda en omvänd ordfråga.
- Uttrycksluckans tre varierade uppdrag kan bidra med samma redan sparade evidens, men ingen extra provpoäng.
- Ingen markör säger att ett barn måste eller borde kunna något. Alla ord kan ses i valfritt tempo och tidigare fel sänker inte en redan uppnådd upptäckt.

## Måste kontrolleras före publicering

- Lokal lagring efter **verklig sidomladdning** och PWA/offline efter installation i en vanlig webbläsare (säkra origins nekas i automatiserad sandbox).
- Svensk skärmläsare och tangentbordsnavigering på verklig telefon/dator.
- Fem till tio barn i målgruppen som får läsa, spela, söka och öppna ordstig utan förklaringar av en vuxen.
- Pedagogiska och språkliga granskningar av frågor och alla fyra svar i den redaktionella banken.

Ingen publicering på GitHub eller GitLab genomförd.
