# Ordjakten 0.13 – verifiering

## Automatiska tester

- `npm run check` validerar samtliga 121 ord, 25 uttryck, 129 vardagsscener och innehållet för bildserier.
- Testsuite utökad med `tests/adaptive.test.js`: separata färdigheter, svaghet per frågetyp, begränsad prioritering, scenrotation, vänteperiod, blandade omgångar, avstängd anpassning, testläge, högskoleprovsformat och kompatibilitet med äldre historik.
- Filkontrakt och service worker uppdaterade till cacheversion v13.

## Chromium – kontrollerade flöden

- `tests/browser_adaptive.py`: inställningar, femfrågors Träna på mobil, återkoppling efter svar, inaktivering av funktionen, Testa dig utan avslöjande.
- `tests/browser_smoke.py`: test, fem svar, timer och mobil/tema.
- `tests/browser_contexts.py`: vardagsscener och Aha-rutan.
- `tests/browser_review.py`: tidigare repetitionslogik och fördröjd repetition.
- `tests/browser_expressions.py`, `tests/browser_missions.py`, `tests/browser_quests.py`, `tests/browser_surprises.py`: uttrycksfrågor, blandade uppdrag, luckor och miniuppdrag.
- `tests/browser_adventures.py`, `tests/browser_maps.py`, `tests/browser_playful.py`: äventyr och kartor, belöningar och mobilgränssnitt.

## Avsiktliga begränsningar

- Inga nya eller genererade bilder, inget API, ingen publicering.
- Lokal HTTP-server fungerar, men Chromium i testmiljön ger `ERR_BLOCKED_BY_ADMINISTRATOR` för localhost. Automatisk end-to-end-testning **över sidomladdning med localStorage** och offline-PWA behöver göras i en vanlig webbläsare före lansering.
- Tester av frågelogik bekräftar **inte pedagogisk kvalitet**. Distraktorer, svårighetsgrad och belöningsnivåer behöver granskas och provspelas med barn.
- Färdighetsresultaten är enkla signaler för variation, inte en vetenskaplig uppskattning av kunskapsnivå.
