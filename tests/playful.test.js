const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../public/js/playful.js');
const E = require('../public/js/engine.js');

test('companion selection supports exactly three friendly characters', () => {
  assert.deepEqual(Object.keys(P.COMPANIONS), ['fox', 'owl', 'dragon']);
  assert.equal(P.companion('owl').name, 'Ulla');
  assert.equal(P.companion('invalid').name, 'Roffe');
});

test('new preferences validate safely and retain older results', () => {
  const pref=E.sanitizeSettings({companion:'dragon',sound:true});
  assert.equal(pref.companion,'dragon');
  assert.equal(pref.sound,true);
  const fallback=E.sanitizeSettings({companion:'bad',sound:'true'});
  assert.equal(fallback.companion,'fox');
  assert.equal(fallback.sound,false);
  const old=E.sanitizeHistory({settings:{difficulty:'easy'},results:[{finishedAt:1,total:5,right:3,wrong:2,unanswered:0}],mistakes:{}});
  assert.equal(old.results[0].bestStreak,0);
  assert.equal(old.settings.companion,'fox');
  assert.equal(old.settings.sound,false);
});

test('stage markers never skip or exceed the total count', () => {
  for (const total of [5,10,15,20,25]) {
    const stages=P.milestones(total);
    assert.equal(stages.at(-1),total);
    assert.equal(new Set(stages).size,stages.length);
    assert.ok(stages.every(n=>Number.isInteger(n)&&n>=1&&n<=total));
  }
  assert.deepEqual(P.milestones(0),[]);
});

test('encouragement supports right, wrong and timed out without revealing future answers', () => {
  const right=P.encouragement('right',2,3);
  assert.match(right.reward,/3 rätt i rad/);
  assert.match(right.title,/rätt/);
  const wrong=P.encouragement('wrong',3,0);
  assert.equal(wrong.reward,'');
  assert.ok(wrong.message.length > 10);
  const timed=P.encouragement('unanswered',1,0);
  assert.equal(timed.reward,'');
});

test('achievement thresholds reward effort and mastery without penalizing mistakes', () => {
  assert.equal(P.achievements({total:0}).length,0);
  assert.deepEqual(P.achievements({right:0,total:5}).map(x=>x.title),['Ordspanare']);
  assert.ok(P.achievements({right:4,total:5,bestStreak:3}).some(x=>x.title==='Stjärnletare'));
  const titles=P.achievements({right:5,total:5,bestStreak:5}).map(x=>x.title);
  assert.ok(titles.includes('Ordmästare'));
  assert.ok(titles.includes('Tre i rad'));
});
