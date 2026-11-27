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
    'Du löste den här uppgiften!',
    'Bra tänkt! Läs gärna varför svaret passar.',
    'Fullträff! Fortsätt i din egen takt.',
    'Du hittade ett svar som passar!'
  ]);
  const TRY_AGAIN = Object.freeze([
    'Bra att du provade. Nu tittar vi på förklaringen.',
    'Det var klurigt. Ta den tid du behöver för att läsa.',
    'Leta efter ledtråden i förklaringen. Du kan prova igen.',
    'Stjärnorna du har samlat finns kvar. Vi tar ett steg i taget.'
  ]);

  function companion(id) { return COMPANIONS[id] || COMPANIONS.fox; }
  function encouragement(outcome, questionIndex) {
    if (outcome === 'right') {
      return {title:'Du hittade rätt!', message:GOOD[questionIndex % GOOD.length],
        reward:'⭐ +1 stjärna!'};
    }
    if (outcome === 'unanswered') return {title:'Tiden tog slut',message:'Nu får du se vad ordet betyder.',reward:''};
    return {title:'Ett nytt ord upptäckt!',message:TRY_AGAIN[questionIndex % TRY_AGAIN.length],reward:''};
  }
  function milestones(total) {
    if (!Number.isInteger(total) || total < 1 || total > 100) return [];
    return [...new Set([1,Math.ceil(total/4),Math.ceil(total/2),Math.ceil(total*3/4),total])].sort((a,b)=>a-b);
  }
  function achievements({right=0,total=0,stars=right,practised=0}={}) {
    if (!Number.isInteger(total) || total <= 0) return [];
    const validCount=value=>Number.isInteger(value)&&value>=0&&value<=total;
    const direct=validCount(right)?right:0;
    const collected=validCount(stars)?stars:direct;
    const recovered=validCount(practised)&&practised<=collected?practised:0;
    const earned=[{icon:'🎒',title:'Ordspanare',text:'Du gav dig ut på en ordjakt!'}];
    if(direct/total>=.8)earned.push({icon:'🌟',title:'Stjärnletare',text:`Du svarade rätt direkt på ${direct} av ${total} ${total===1?'fråga':'frågor'}!`});
    if(recovered>0)earned.push({icon:'🌱',title:'Övade vidare',text:`Du samlade ${recovered} ${recovered===1?'stjärna':'stjärnor'} i fortsatt träning.`});
    if(collected===total)earned.push({icon:'✨',title:'Alla stjärnor',text:
      recovered>0?'Alla stjärnor är tända! Du fyllde raden genom att öva vidare.':'Alla stjärnor är tända! Du fyllde hela raden.'});
    return earned;
  }
  return {COMPANIONS,companion,encouragement,milestones,achievements};
});
