# Protected question delivery v1: leak prevention and scraping limits

**Scope:** executable, public, server-only gate in
`learning-engine/src/protected-delivery-v1.js` with synthetic tests.
**NOT DEPLOYED:** No protected backend, identity provider, persistent
transaction store, private question bank, private grading service, protected
image endpoint or public-to-private migration is deployed by this PR.

## Threat model and the critical limitation

Ordjakten is a public static GitHub Pages/PWA app. Authored questions,
explanations and answer keys already committed under `public/data` and
`public/js` are **already downloadable**, including through previous Git
history. A browser timer, JavaScript obfuscation, a private mirror of the same
repository or removal from a future release cannot undo that exposure.
Protected banks must **never** be bundled into public scripts, a browser-side
offline cache, or a client-visible Git history. We keep the existing public
children's game working; only **new, intentionally protected** banks are
eligible for this server-driven path.

Even a well-authenticated human can record every question legitimately shown
to them; IP bans, CAPTCHAs and pacing cannot guarantee an unscriptable system.
The objective is to **limit bulk harvesting** and prevent the trivial
`100 questions => 100 answers immediately` attack, not promise impossibility.

## Behavioral contract

A verified user may request between **1 and 100** questions. Creating a
session returns only `sessionId`, `mode` and progress counters, **never**
the list of questions, a question bank, answer keys or private metadata.
`nextQuestion` releases at most **one** question; refreshing before answering
returns the same active instance rather than another question. After answering,
an additional question can be issued only after a **server-enforced 30-second
minimum interval** (configurable by the server operator, minimum allowed 10s).
A learner selecting 100 questions therefore needs at least 99 inter-question
gaps, about **49 minutes 30 seconds**, even if they answer instantly. Other
quotas may extend that further.

Default guardrails (configurable **on the trusted server**, never by the
browser):

| Server-side limit | Default |
|---|---:|
| Requested questions per session | 100 |
| Minimum interval between NEW question releases, per account | 30s |
| Maximum released questions per rolling hour, per account | 60 |
| Maximum released questions per rolling 24h, per account | 120 |
| Maximum sessions started per rolling 24h, per account | 2 |
| Concurrent active sessions per account | 1 |
| Maximum invalid submissions per instance | 4 |
| Session TTL | 6h |

`nextQuestion` rejects early calls with `cooldown` and
`retryAfterMs` so the app can show a **visible, accessible countdown**.
That countdown is purely UX; the browser's clock cannot influence server
release eligibility. On an invalid answer, the server retains the same
question until corrected or the invalid-submission limit is reached.

`submitAnswer` validates against **the issued option IDs** and invokes a
private grader for the server-owned question reference. A request cannot choose
another ref or provide its own correct answer. Correct answers and private
rubrics are never returned by the delivery endpoint. Training responses
return only the descriptive status; while a test is in progress, **no
grade** is returned. On completion, the summary contains only aggregate
status counts. No raw user answer is stored by the engine.

`PublicQuestion.toProtectedQuestion` strips even stable bank/question
references from client payloads; only opaque session/instance IDs are exposed.
It supports text, choices, numbers and **static images only**. Private images
require opaque, authorized short-lived URLs of the form
`/api/learning/media/<opaque-token>`. Issuing and verifying those media
tokens is a **backend responsibility**, not implemented by this package.

## Production integration requirements (NOT supplied by a static PWA)

```text
Browser
  POST /api/learning/sessions           -> {sessionId, progress}    no questions
  POST /api/learning/sessions/:id/next   -> ONE protected question or cooldown
  POST /api/learning/sessions/:id/answer -> record opaque instance answer
  GET  /api/learning/sessions/:id       -> progress; final summary
  GET  /api/learning/media/:token       -> authorized static asset, never bank dump
                       |
               Authenticated backend
                |  trusted identityPort
                |  TRANSACTIONAL persistent account store
                |  SERVER clock + cooldown + hourly/daily quotas
                |  PRIVATE bank plan/present ports
                |  PRIVATE bank assessment + recommendation policies
                +-- rate limits at API gateway / CDN / signup
```

Every endpoint must reauthenticate, authorize the subject and bank, and
use server-derived tenant/user IDs. Enforce HTTP cache-control `no-store`
on protected questions, answers, summaries and images; prevent proxy/browser
or service-worker caching of private content. Enable CSRF protections for
cookie-based auth, strict CORS/origin policy, TLS, minimal request logging,
body-size limits, abuse monitoring, and authenticated image access.

**Transactions are mandatory:** `store.transact(ownerKey,fn)` must serialize
all session creation, question issuance, invalid attempt tracking, grading,
and quota updates **across every process/server instance**. Back it with a
real transaction/lock solution such as PostgreSQL row locks or Redis Lua
scripts. `createInMemoryStore()` is test-only and is rejected unless
`allowInMemoryForTests:true` is explicitly supplied. Server restarts,
multiple workers and separate devices must not reset production quota state.

Server clocks must be consistent across workers; the runtime fails closed on
a detected clock reversal. Authentication should limit cheaply created
accounts, and external per-IP / per-network / per-tenant limits should help
resist multi-account harvesting. Do not use IP address as a personal identity
or as the only quota key. Consider school exceptions, screen-reader timing,
accessible feedback and support recovery before selecting production limits.

**Policy privacy:** The public delivery layer contains protective quota
defaults, not proprietary grading/mastery or question-selection algorithms.
A private bank owns plans, correctness, pedagogy, and licenses. A subject may
get a `correct` status without receiving the answer key. Even with a private
backend, the user can record the question text and any images displayed to
them. Preventing automated **mass** exposure requires trustworthy identities,
account budgets, operational monitoring, and realistic threat acceptance.

## Leak CI and verification

Root `npm run check` includes `scripts/audit-learning-leaks.js`.
This examines `public/` and fails on new private-coded paths, private bank
markers, exposed credentials, symlinks and imports of private policy modules
in the HTML/service worker. It **does not** treat the old authored public
question catalog as secret; this preexisting exposure is explicitly reported.
It cannot prove that every prompt or image is free of sensitive information;
content/code review and licensing checks are still required.

`learning-engine/tests/protected-delivery-v1.test.js` uses a synthetic bank,
fake server clock and test-only transactional in-memory store to test 100
question selection, 30s pacing, invalid early requests, replay, concurrent
calls, cross-user authorization, hourly/daily quota, session farming, invalid
answers, exam secrecy, protected media and errors. It contains **no real
proprietary questions**.

To ship the secure version: create/deploy the server and private bank first,
verify the real durable store across instances, run integration/abuse tests,
then point the intended *protected* app at that backend. Keep the existing
static public Ordjakten as a separate public/offline mode until a deliberate
content migration with clear licensing and compatibility decisions is made.

**Regression coverage:** tests also verify that the same account cannot reset
its cooldown by finishing one session and starting another. A separate
principal legitimately has a separate budget, which is why identity assurance
and external multi-account abuse detection are mandatory for production.

## HTTP integration and publication allowlist

The package now includes a strict **Node HTTP handler**
(`learning-engine/src/http-adapter-v1.js`) for the protected endpoints. It
requires an Authorization Bearer credential on every call, applies an optional
exact HTTPS Origin allowlist, denies bulk/list routes, rejects oversized or
unrecognized JSON requests, masks private exceptions, and sends
`Cache-Control: private, no-store`, `Vary: Authorization` and
`X-Content-Type-Options: nosniff`. Server timer denials map to
**HTTP 429** with `Retry-After`. Real authentication, durable persistence,
private content/grading and authorized media retrieval must be wired by the
deployment. Tests use an isolated Node server, synthetic questions, and an
explicit test-only store.

Each protected question also receives new random **option IDs**, so the
public response does not leak stable authored answer-choice identifiers.
Private grading receives original IDs only after server-side mapping.
Presented ordering questions are randomized but translated to their original
semantic order for grading; numeric values are preserved.

The public CI audit also requires
[`content/public-bank-allowlist.json`](../content/public-bank-allowlist.json),
which enumerates the **already intentionally public** `public/data/` files,
`public/js/banks/` adapters and top-level `public/js/` scripts. New
filenames cause CI to fail until the inventory is deliberately reviewed and
updated. This is an explicit change-review checkpoint, **not proof** that
revised files or prose contain no proprietary material. The old public
question material and past Git history remain accessible regardless.

**Remaining production blockers:** A durable globally transactional quota
store, verified identities, user signup/tenant/IP abuse controls, authorized
short-lived media tokens, HTTPS/CSRF/CORS deployment, data retention policies,
and private bank/policy services. Without them, this PR provides testable
server-side machinery but does **not** secure the current GitHub Pages
deployment.
