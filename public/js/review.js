/* Ordjakten 0.11: small, private, local-only spaced-repetition queue.
 * Stores IDs, timestamps and task types, never children's names or answer texts.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenReview = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const ID = /^(?:sv|ut)-\d{4,}$/;
  const TYPES = ['picture', 'meaning', 'reverse', 'context', 'sentence', 'order'];
  const DAY = 24 * 60 * 60 * 1000;
  const WAIT = [0, 60 * 60 * 1000, DAY]; // first / second successful recall
  const clamp = (n, min, max, fallback) => Number.isInteger(n) ? Math.max(min, Math.min(max, n)) : fallback;
  const safeNow = now => Number.isFinite(now) && now >= 0 ? Math.floor(now) : Date.now();
  function sanitize(value, legacyMistakes = {}, now = Date.now()) {
    const clean = Object.create(null);
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    for (const [id, entry] of Object.entries(source).slice(0, 500)) {
      if (!ID.test(id) || !entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const streak = clamp(entry.streak, 0, 3, 0);
      const dueAt = streak === 3 ? 0 : clamp(entry.dueAt, 0, 4102444800000, safeNow(now));
      const lastVariant = TYPES.includes(entry.lastVariant) ? entry.lastVariant : 'meaning';
      clean[id] = {streak, dueAt, lastVariant, attempts:clamp(entry.attempts, 0, 9999, 0)};
    }
    // Migrate all legacy errors only once, without overriding scheduled/mastered cards.
    const old = legacyMistakes && typeof legacyMistakes === 'object' ? legacyMistakes : {};
    for (const [id, amount] of Object.entries(old).slice(0, 500)) {
      if (ID.test(id) && Number(amount) > 0 && !Object.hasOwn(clean, id))
        clean[id] = {streak:0, dueAt:safeNow(now), lastVariant:'meaning', attempts:0};
    }
    return clean;
  }
  function ready(card, now = Date.now()) {
    return !!card && card.streak < 3 && Number.isFinite(card.dueAt) && card.dueAt <= safeNow(now);
  }
  function summary(cards, now = Date.now()) {
    let due = 0, waiting = 0, mastered = 0, nextDue = null;
    for (const card of Object.values(cards || {})) {
      if (!card || typeof card !== 'object') continue;
      if (card.streak >= 3) mastered++;
      else if (ready(card, now)) due++;
      else if (Number.isFinite(card.dueAt)) {
        waiting++;
        nextDue = nextDue === null ? card.dueAt : Math.min(nextDue,card.dueAt);
      }
    }
    return {due,waiting,mastered,nextDue};
  }
  function questionVariant(question) {
    if (question.kind === 'expression') return ['meaning','sentence','order'].includes(question.taskType) ? question.taskType : 'meaning';
    return ['reverse','context'].includes(question.taskType) ? question.taskType : question.picture ? 'picture' : 'meaning';
  }
  function record(cards, question, outcome, now = Date.now()) {
    if (!question || !ID.test(question.id) || !['right','wrong'].includes(outcome)) return cards;
    const current = cards && cards[question.id];
    const n = safeNow(now);
    const lastVariant = questionVariant(question);
    const attempts = Math.min(9999, (current?.attempts || 0) + 1);
    let card;
    if (outcome === 'wrong') card = {streak:0,dueAt:n,lastVariant,attempts};
    else if (!current) return cards; // No cards needed for words never missed.
    else if (current.streak >= 3) card = {...current,lastVariant,attempts};
    else if (current.dueAt > n) card = {...current,lastVariant,attempts}; // Do not accelerate by replaying early.
    else {
      const streak = Math.min(3,current.streak+1);
      card = {streak,dueAt:streak === 3 ? 0 : n+WAIT[streak],lastVariant,attempts};
    }
    return {...cards,[question.id]:card};
  }
  function readyIds(cards, now = Date.now()) {
    return Object.keys(cards || {}).filter(id => ID.test(id) && ready(cards[id],now));
  }
  return {sanitize,ready,readyIds,summary,record,questionVariant,WAIT};
});
