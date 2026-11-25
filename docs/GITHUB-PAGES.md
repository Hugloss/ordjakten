# GitHub Pages – Ordjakten

## One-time repository setup

In **Hugloss/ordjakten → Settings → Pages → Build and deployment**, set **Source = GitHub Actions**. The GitHub connector cannot change this repository setting. This is a one-time manual action.

Merge the PR adding `.github/workflows/deploy-pages.yml` into `main`. The workflow:
1. Runs `npm run check` (content validation, Node tests and Pages/offline asset check).
2. Publishes **only `public/`**, with `public/index.html` at the website root.
3. Makes the app available at **https://hugloss.github.io/ordjakten/** after successful deployment.

Future changes to the app deploy automatically after merge. Documentation-only changes do not trigger a deploy. It does not deploy PR branches or expose any secrets.

## Check a deployment

Open **Actions → Publish Ordjakten to GitHub Pages** and verify the latest deployment finished successfully. Open the site URL and check:

- Quick start begins a game, and stories and answers are readable.
- Träna shows the explanation and an Aha question after answering.
- Testa dig does **not** reveal the answer during the round.
- Switch theme and refresh: preferences remain if supported by the browser.
- Complete a round and refresh: local result history remains.
- On HTTPS, wait for the service worker to be installed, reload, then disconnect and try the page offline. Reconnect when finished.
- Check the browser console for failed CSS, JS, image or manifest requests.

The automated `npm run check:pages` test validates relative paths, all linked assets, the service-worker precache and the PWA manifest under the `/ordjakten/` prefix. It does **not** prove that GitHub Pages was enabled or that a real browser can load the public domain.

## Free GitHub Actions minutes

The repo is public and uses a standard Ubuntu runner. PRs run one short check; pushes to `main` run one deployment job that includes that check. Browser/Playwright tests are intentionally excluded from hosted CI. There is no npm install or build step.
