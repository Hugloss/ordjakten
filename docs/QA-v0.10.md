# Kvalitetskontroll – Ordjakten 0.10.0

## Genomfört

- `npm run check`: 57 godkända Node-tester och innehållsvalidering (121 ord + 25 uttryck; 25 serier och 75 uttrycksuppdrag).
- `python tests/browser_quests.py`: tre kompletta miniuppdrag, med ett fel följt av korrekt repetition; läsbar mobilvy, ljust tema/hög kontrast, provlägesspärr, nollställning av uppdragsräknarna.
- `python tests/browser_smoke.py`: vanligt testläge, högskoleprovsupplägg, timer som går ut, mobil/tema, dold fråga efter svar.
- `python tests/browser_playful.py`: ordkompisar, uppmuntran, tre rätt i rad, stjärnor, testläge.
- `python tests/browser_missions.py`: ordningsfrågor/ångra/börja om, facitspärr och 3/3-uppdrag i luckboken.
- `python tests/browser_adventures.py`: kompletta femordsomgångar i alla tolv världar.
- `python tests/browser_expressions.py`: uttryck, blandade frågor, hockeyberättelse och mobil.
- `python tests/browser_surprises.py`: 25 luckor, miniuppdrag, resultat och mobillägen.
- `python tests/browser_comics.py`: 25 seriestrippar, redan bundlade PNG-symboler, mobil och dator.
- Manuellt Chromium-test: mörkt tema, slumpat miniuppdrag och läsbar framstegsmätare.
- Lokal HTTP-server besvarar `GET /` med HTTP 200.

## Begränsningar

Testmiljön blockerar Chromiums navigering direkt till `localhost` och även till simulerade externa adresser. Därför testades webbläsarflödena via Playwrights inmatning av lokala HTML-/CSS-/JS-filer, utan nätverk. **Kvar att verifiera före publicering:** lokalStorage över verklig omladdning i Chromium samt service worker och offline-cache i ett normalt HTTPS-/localhost-fönster. Kod och migration för lokal lagring har däremot automatiska tester. Alla bilder och deras rättighetsdokumentation kommer från tidigare versioner.

Varken GitHub, GitLab eller någon annan webbplats har fått projektet uppladdat.
