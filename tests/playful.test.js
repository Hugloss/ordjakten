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

test('encouragement gives the same star for a right answer regardless of streak', () => {
  const right=P.encouragement('right',2,3);
  assert.equal(right.reward,'⭐ +1 stjärna!');
  assert.match(right.title,/rätt/);
  assert.deepEqual(right,P.encouragement('right',2,0));
  assert.deepEqual(right,P.encouragement('right',2,25));
  const wrong=P.encouragement('wrong',3,0);
  assert.equal(wrong.reward,'');
  assert.ok(wrong.message.length > 10);
  const timed=P.encouragement('unanswered',1,0);
  assert.equal(timed.reward,'');
});

test('legacy rounds retain factual achievements and full stars without a streak or mastery badge', () => {
  assert.equal(P.achievements({total:0}).length,0);
  assert.deepEqual(P.achievements({right:0,total:5}).map(x=>x.title),['Ordspanare']);
  assert.ok(P.achievements({right:4,total:5,bestStreak:3}).some(x=>x.title==='Stjärnletare'));
  const full=P.achievements({right:5,total:5,bestStreak:5});
  assert.deepEqual(full.map(x=>x.title),['Ordspanare','Stjärnletare','Alla stjärnor']);
  assert.deepEqual(full,P.achievements({right:5,total:5,bestStreak:0}));
});

test('a completed star row celebrates successful practice without changing first-attempt counts', () => {
  const partial=P.achievements({right:3,total:5,stars:4,practised:1});
  assert.equal(partial.find(x=>x.title==='Alla stjärnor'),undefined);
  assert.equal(partial.find(x=>x.title==='Övade vidare').text,'Du samlade 1 stjärna i fortsatt träning.');
  const recovered=P.achievements({right:3,total:5,stars:5,practised:2});
  assert.equal(recovered.find(x=>x.title==='Stjärnletare'),undefined);
  assert.equal(recovered.find(x=>x.title==='Övade vidare').text,'Du samlade 2 stjärnor i fortsatt träning.');
  assert.match(recovered.find(x=>x.title==='Alla stjärnor').text,/öva vidare/);
  const fourDirect=P.achievements({right:4,total:5,stars:5,practised:1});
  assert.equal(fourDirect.find(x=>x.title==='Stjärnletare').text,'Du svarade rätt direkt på 4 av 5 frågor!');
});

test('incomplete or invalid star counts cannot claim a completed collection', () => {
  for(const stars of [0,3,4,6,-1,NaN,Infinity,'5']){
    const earned=P.achievements({right:3,total:5,stars});
    assert.equal(earned.find(x=>x.title==='Alla stjärnor'),undefined);
  }
  assert.equal(P.achievements({right:0,total:5,stars:0,practised:1}).find(x=>x.title==='Övade vidare'),undefined);
  assert.equal(P.achievements({right:6,total:5,stars:6}).find(x=>x.title==='Stjärnletare'),undefined);
});

test('Stjärnletare reports actual question counts and keeps the 80 percent threshold at every round length', () => {
  for(const total of [5,10,15,20,25]){
    const threshold=total*.8;
    const badge=right=>P.achievements({right,total}).find(item=>item.title==='Stjärnletare');
    assert.equal(badge(threshold-1),undefined,`${threshold-1} of ${total} must not earn the badge`);
    for(const right of new Set([threshold,threshold+1,total])){
      assert.equal(badge(right)?.text,`Du svarade rätt direkt på ${right} av ${total} frågor!`);
    }
  }
  assert.equal(P.achievements({right:1,total:1}).find(item=>item.title==='Stjärnletare').text,
    'Du svarade rätt direkt på 1 av 1 fråga!');
});
