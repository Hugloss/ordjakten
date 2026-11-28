# Learning Engine (portable public core)

This package is staged inside the existing **public** Ordjakten repository.
It has **no dependency on any Ordjakten bank, question, game, or domain module**.
The intended future `Hugloss/learning-engine` repository has not yet been
created. This package is `private: true` / `UNLICENSED` until an explicit
open-source license and publishing decision is made.

## Public vs private boundary

| Area | Visibility | Owner |
|---|---|---|
| Learning Engine core | Public | Neutral assessment, evidence and decision-port contracts |
| Learning policy | Private SERVER | Actual proficiency calibration, grade rules, difficulty strategy, ranking and next-question selection |
| Subject knowledge banks | Private SERVER | Question text, correct answers, explanation, taxonomy and image rights |
| App UI | May be public | Safe authorized question display and feedback |

**Private GitHub repositories alone do not keep browser-delivered content
secret.** Ordjakten's historic sources and browser files are already public.
Moving a file later does not undo earlier Git exposure. A protected bank must
be served through an authenticated application backend. The backend stores
answers and private algorithms, verifies attempts, authorizes each selected
question, rate-limits enumeration, and returns only permissible content. No
private token, complete bank, oracle or proprietary selection weight may enter
a browser JS bundle or service-worker cache. A sufficiently determined actor
may still collect delivered questions over time; scraping cannot be prevented
absolutely.

## What Learning Engine owns

`Assessment`: `learning-assessment.v1`, rubric and policy revisions, string
levels `incorrect/limited/partial/correct/excellent`, non-graded outcomes,
audit-ready assessments and a local privacy-minimal evidence ledger.

`Decisions.evidenceView({entries,focus})`: a **descriptive** summary of
evidence by `{bankId,skillId}`: completed/invalid/ungraded counts, assistance,
graded levels, difficulty band, activity kind, reviewed independent attempts,
**qualified-only grade distribution**, distinct questions, last independent
observation day and distinct observation days, plus criterion gaps.
A second success on the same question does not count as new question variety.
Assisted answers, drafts, unfinished work and missing observations are never
quietly promoted to independent proficiency. No mastery level is inferred.

The ledger optionally records strings `difficultyBand` and `activityKind`
and an integer UTC `observedDay` index. A level label such as
`foundational` is **bank-defined**, not globally calibrated. The ledger
does not save answer text, full images, personal identifiers or credentials.

`Decisions.createCoordinator(privatePolicyPort)` is a boundary; it doesn't
contain any proprietary policy. `privatePolicyPort` supplies
`{id,revision,async recommend(request)}`. The public coordinator validates
policy identity, snapshot identity, focus, action, bank scope and opaque target.

Supported intent strings: `practice_similar`, `practice_prerequisite`,
`spaced_review`, `continue`, `increase_difficulty`, `manual_review`,
`hold`. The private policy can suggest targeted practice after several
genuine failures, alternative formulations for a criterion gap, time-separated
reviews, or higher difficulty after independent varied success. Those rules
are **not implemented in this public repository**.

Without a policy, when it fails, or while an exam is unfinished, the result is
a safe `hold` with **no target**. Wrong/stale policy results are rejected,
not interpreted as valid recommendations. A client-provided snapshot ID is
a correlation key, **not an authorization proof**; the server must verify
the trusted evidence store and issue short-lived, single-use question
instances.

## Running checks and extraction

```sh
node scripts/sync-learning-engine.js --check
node --test learning-engine/tests/*.test.js
```

`learning-engine/src/assessment-v1.js` is the **canonical editable source**.
`public/js/assessment-v1.js` is its generated compatibility mirror; to
regenerate it run `node scripts/sync-learning-engine.js`.
Root `npm run check` runs these tests and mirror verification in its
existing CI job (no extra browser-job needed).

To extract later: create a separate public repo, copy this self-contained
package with history/attribution and choose a license; update Ordjakten to
consume a pinned engine release. Put policy implementations and bank sources
only in separately permissioned PRIVATE repositories and deploy through
private backend services. This PR neither creates those repos nor makes
existing published question material private.

## Public question projection for a private backend

`PublicQuestion.toPublicQuestion(presentation,{sessionId,media})` creates a
strict allowlisted response that strips answer keys, hidden rubrics, private
skill graphs, candidate weights and internal question metadata. The v1 public
protocol supports single-choice, ordering and numeric interactions, with
optional **static images only**. It rejects unsafe image paths and unknown
answer-bearing fields. This reduces accidental data disclosure but cannot
prevent a misleading prompt, answer embedded in a displayed explanation or
content scraping. The backend must still review every visible field before
sending it and must never serve private bank data in a static offline bundle.

## Server-enforced anti-scraping and leak boundary

See [protected question delivery threat model](../docs/LEARNING-QUESTION-LEAK-THREAT-MODEL.md).
The **server-only** `ProtectedDelivery.createProtectedDelivery(...)` API accepts up
to 100 questions per authenticated session but reveals **at most one** private
question at a time. A 30-second default server-side interval plus per-account
rolling hourly/daily reveal quotas and session limits prevent trivial bulk
retrieval by clicking through a hundred questions in seconds. Exam answers
stay withheld until completion. Authenticated, expiring static-image routes
must be provided by the application backend.

A separate durable, account-transactional store and trusted identity provider
are required in production. The provided in-memory store is **test-only** and
explicitly refused in normal mode. This package does not host a working
protected API or make existing public Ordjakten questions private. A bot can
still harvest material over time or by using multiple accounts; rate limiting,
identity assurance and abuse controls at the edge are needed as well.
