# Ordjakten 0.12 – kvalitetssäkring

## Automatiska kontroller

- `npm run check` kör innehållsvalidering och Node-testsviten.
- `tests/contexts.test.js` säkerställer 43 ord med tre unika scener vardera (129), att facit inte finns i scenen, fyra entydigt märkta textalternativ, synkroniserad JS/JSON, bakåtkompatibel repetition och 5-frågors snabbstart.
- Tidigare tester ska passera utan ändrade facit eller resultat.

## Chromium

- `python tests/browser_contexts.py`: snabbstart med fem rätt, Aha-ruta efter svar, mobil 320 px, ljust tema med hög kontrast, fyra textalternativ, fem expertalternativ samt dolt facit i Testa dig.
- `python tests/browser_smoke.py`: äldre frågor, timers, testlägets facitspärr, mobil.
- `python tests/browser_expressions.py`: de äldre uttryckens självständiga spelflöde.
- `python tests/browser_review.py`: repetition och uttryck.

## Kända begränsningar

- Tekniska testresultat garanterar inte att alla distraktorer är språkligt eller pedagogiskt optimala. Provspela med barn och granska manuellt.
- De 43 korten har fått tre scener var. Övriga ord fortsätter med de gamla uppgiftstyperna; inga berättelser hittas på automatiskt.
- Gammal `localStorage`-data migreras utan extra uppgifter. Första riktiga sidomladdningen och offline-PWA bör dessutom provas i vanlig webbläsare före publicering.
- Inget har distribuerats till GitHub eller GitLab.
