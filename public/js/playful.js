/* Optional, dependency-free presentation rules for younger word explorers.
 * Pure functions keep the playful layer testable without a browser.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenPlayful = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const COMPANIONS = Object.freeze({
    fox: Object.freeze({emoji:'🦊',name:'Roffe',role:'Räven'}),
    owl: Object.freeze({emoji:'🦉',name:'Ulla',role:'Ugglan'}),
    dragon: Object.freeze({emoji:'🐉',name:'Dino',role:'Draken'})
  });
  const GOOD = Object.freeze([
    'Du hittade rätt! Vilken ordspanare!',
    'Snyggt! Ett nytt ord i ryggsäcken!',
    'Du har koll på orden!',
    'Fullträff! Fortsätt utforska!',
    'Yes! Du löste ordgåtan!'
  ]);
  const TRY_AGAIN = Object.freeze([
    'Bra försök! Nu har du lärt dig ett nytt ord.',
    'Klurigt ord! Läs förklaringen så kan du det nästa gång.',
    'Det gör inget. Även ordspanare lär sig nya saker!',
    'Nu vet du något som du inte visste förut!'
  ]);

  function companion(id) { return COMPANIONS[id] || COMPANIONS.fox; }
  function encouragement(outcome, questionIndex, streak) {
    if (outcome === 'right') {
      return {title:'Du hittade rätt!', message:GOOD[questionIndex % GOOD.length],
        reward:streak >= 3 ? `⭐ En stjärna! 🔥 ${streak} rätt i rad!` : '⭐ +1 stjärna!'};
    }
    if (outcome === 'unanswered') return {title:'Tiden tog slut',message:'Nu får du se vad ordet betyder.',reward:''};
    return {title:'Ett nytt ord upptäckt!',message:TRY_AGAIN[questionIndex % TRY_AGAIN.length],reward:''};
  }
  function milestones(total) {
    if (!Number.isInteger(total) || total < 1 || total > 100) return [];
    return [...new Set([1,Math.ceil(total/4),Math.ceil(total/2),Math.ceil(total*3/4),total])].sort((a,b)=>a-b);
  }
  function achievements({right=0,total=0,bestStreak=0}={}) {
    if (!Number.isInteger(total) || total <= 0) return [];
    const earned=[{icon:'🎒',title:'Ordspanare',text:'Du gav dig ut på en ordjakt!'}];
    if(bestStreak>=3)earned.push({icon:'🔥',title:'Tre i rad',text:'Du lyckades med minst tre rätt i följd!'});
    if(right/total>=.8)earned.push({icon:'🌟',title:'Stjärnletare',text:'Minst åtta av tio ord fick rätt svar!'});
    if(right===total)earned.push({icon:'👑',title:'Ordmästare',text:'Alla ord fick rätt svar!'});
    return earned;
  }
  return {COMPANIONS,companion,encouragement,milestones,achievements};
});
