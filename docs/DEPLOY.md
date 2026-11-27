# Publicera Ordjakten

## Lokalt

`npm start` och öppna `http://127.0.0.1:4173`. Kör `npm run check` före publicering.

## GitHub Pages

Det befintliga arbetsflödet `.github/workflows/deploy-pages.yml` kör
`npm run check` och publicerar **endast `public/`** från `main`.
Appadressen är **https://hugloss.github.io/ordjakten/** efter en lyckad
publicering. PR-grenar publiceras inte.

- Om Pages inte redan är aktiverat: välj **Settings → Pages → Build and
  deployment → Source → GitHub Actions** en gång i repot.
- Relevanta appändringar på `main` startar kontroller och publicering
  automatiskt. Rena dokumentationsändringar startar ingen publicering.
- För en manuell körning: öppna **Actions → Publish Ordjakten to GitHub
  Pages → Run workflow** och välj `main`.
- Kontrollera att både testerna och steget **Deploy** lyckas innan länken
  delas. En godkänd PR-kontroll bevisar inte att publiceringen har lyckats.

Följ kontrollerna i [GitHub Pages-guiden](GITHUB-PAGES.md) och
[planen för första provspelningen](FIRST-PUBLISH.md).

## GitLab Pages som alternativ

1. Skapa ett nytt GitLab-projekt, exempelvis `ordjakten`.
2. Lägg in *hela* projektets innehåll i repots rot.
3. Konfigurationen `.gitlab-ci.yml` kör kvalitetskontroller och publicerar **public/** på standardgrenen.
4. Följ jobben under Build → Pipelines. Öppna sedan Deploy → Pages för den faktiska länken.
5. Välj om projektet ska vara offentligt eller privat och gå igenom Pages åtkomstinställningar innan du delar länken.

GitLab dokumenterar Pages under https://docs.gitlab.com/user/project/pages/ och det moderna nyckelordet `pages: true` under https://docs.gitlab.com/ci/yaml/ . En Pages-webbplats kan vara offentlig även om projektet är privat, beroende på Pages-inställningarna.

## Valfri domän

Appen har relativa länkar och en PWA-manifest med `./` för att även fungera under projektvägar som `/ordjakten/`. Registrering av service worker fungerar först på HTTPS eller localhost.

## Versionsbyte

Om du ändrar appens statiska filer och vill att offline-besökare ska få en ny sammanhållen uppsättning filer, öka `CACHE_NAME` i `public/sw.js` (t.ex. `ordjakten-static-v2`). Testa alltid online och offline efter uppdateringar.

Den precachade utgåvan används först för sina kända filer och skrivs
inte över av enstaka hämtningar. En ny cache installeras som en hel
uppsättning innan den tas i bruk. En redan öppen sida kan behöva laddas
om efter att den nya service workern installerats. Höj därför alltid
cacheversionen tillsammans med ändringar i `public/`.

## Kostnad

Ingen databas, inga betal-API:er, inga specialservrar eller krav på betalplan behövs för själva statiska appen. Vilka begränsningar som gäller på en host kan ändras med tiden.
