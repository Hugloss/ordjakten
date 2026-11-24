# Publicera när ni är redo (inget publiceras av ZIP-filen)

## Lokalt

`npm start` och öppna `http://127.0.0.1:4173`. Kör `npm run check` före publicering.

## GitLab Pages

1. Skapa ett nytt GitLab-projekt, exempelvis `ordjakten`.
2. Lägg in *hela* projektets innehåll i repots rot.
3. Konfigurationen `.gitlab-ci.yml` kör kvalitetskontroller och publicerar **public/** på standardgrenen.
4. Följ jobben under Build → Pipelines. Öppna sedan Deploy → Pages för den faktiska länken.
5. Välj om projektet ska vara offentligt eller privat och gå igenom Pages åtkomstinställningar innan du delar länken.

GitLab dokumenterar Pages under https://docs.gitlab.com/user/project/pages/ och det moderna nyckelordet `pages: true` under https://docs.gitlab.com/ci/yaml/ . En Pages-webbplats kan vara offentlig även om projektet är privat, beroende på Pages-inställningarna.

## GitHub (alternativ)

Inkluderat `.github/workflows/check.yml` kör **bara tester**, ingen publicering. På GitHub Pages skulle `public/` behöva kopieras eller byggas till publiceringsplatsen genom ett separat arbetsflöde; det har vi avsiktligt inte aktiverat.

## Valfri domän

Appen har relativa länkar och en PWA-manifest med `./` för att även fungera under projektvägar som `/ordjakten/`. Registrering av service worker fungerar först på HTTPS eller localhost.

## Versionsbyte

Om du ändrar appens statiska filer och vill att offline-besökare ska få en ny sammanhållen uppsättning filer, öka `CACHE_NAME` i `public/sw.js` (t.ex. `ordjakten-static-v2`). Testa alltid online och offline efter uppdateringar.

## Kostnad

Ingen databas, inga betal-API:er, inga specialservrar eller krav på betalplan behövs för själva statiska appen. Vilka begränsningar som gäller på en host kan ändras med tiden.
