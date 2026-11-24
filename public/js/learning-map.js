/* Ordjakten 0.14: an honest, read-only learning trail for each word or phrase.
 * Derives milestones from existing anonymous local practice observations.
 * The trail is motivational feedback, never a proficiency test or diagnosis.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenLearningMap = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const validId = /^(?:sv|ut)-\d{4,}$/;
  const ids = data => Array.isArray(data) ? data : [];
  const positive = value => Number.isInteger(value) && value > 0 ? value : 0;
  const names = {picture:'bild', meaning:'betydelse', reverse:'hitta ord', context:'vardag', sentence:'meningar', order:'ordning',contrast:'skillnaden mellan ord'};

  function catalog(bank, expressions, contexts) {
    const contextIds = new Set(ids(contexts?.wordContexts).map(x=>x.id));
    const items = [];
    for (const word of ids(bank?.words)) {
      if (!validId.test(word.id) || !word.word) continue;
      items.push({id:word.id,name:word.word,kind:'word',difficulty:word.difficulty||'medium',
        definition:word.definition||'',example:word.example||'',hasContext:contextIds.has(word.id)});
    }
    for (const expression of ids(expressions?.expressions)) {
      if (!validId.test(expression.id) || !expression.phrase) continue;
      items.push({id:expression.id,name:expression.phrase,kind:'expression',difficulty:'expression',
        definition:expression.definition||'',example:expression.example||'',hasContext:true});
    }
    return items;
  }
  function detail(item, skillProgress = {}, reviewProgress = {}, missionProgress = {}, mistakes = {}, now = Date.now()) {
    const skills = skillProgress?.[item.id]?.skills || {};
    const count = key => positive(skills[key]?.right);
    const attempts = Object.values(skills).reduce((sum,x)=>sum + positive(x?.attempts),0);
    const missions = item.kind==='expression' && Array.isArray(missionProgress?.[item.id])
      ? new Set(missionProgress[item.id]) : new Set();
    const review = reviewProgress?.[item.id];
    const seen = attempts>0 || positive(review?.attempts)>0 || positive(review?.streak)>0 || positive(mistakes?.[item.id])>0 || missions.size>0;
    const recognition = count('picture')>0 || count('meaning')>0 || missions.has('meaning');
    const application = item.kind==='expression'
      ? count('sentence')>0 || count('order')>0 || missions.has('sentence') || missions.has('order')
      : count('context')>0 || count('reverse')>0 || count('contrast')>0;
    const typesWithCorrect = Object.values(skills).filter(x=>positive(x?.right)>0).length;
    const rightTotal = Object.values(skills).reduce((sum,x)=>sum+positive(x?.right),0);
    const revisit = positive(review?.streak)>=2 || (rightTotal>=3 && typesWithCorrect>=2) ||
      (rightTotal>=2 && positive(review?.attempts)>=3) || missions.size===3;
    // The label must reflect WHAT was actually solved. A successful reverse
    // question is not evidence that a contextual scene was solved as well.
    const step3Label = item.kind==='expression' ? 'Prövat uttrycket på fler sätt'
      : count('context')>0 ? 'Provat i vardagen'
      : count('reverse')>0 ? 'Hittat ordet'
      : count('contrast')>0 ? 'Skilt på två ord'
      : item.hasContext ? 'Ord i vardagen' : 'Hitta rätt ord';
    const step3Info = item.kind==='expression' ? 'Välj rätt mening eller ordna en berättelse.'
      : count('contrast')>0 && count('context')===0 && count('reverse')===0 ? 'Jämför två ord i olika situationer.'
      : item.hasContext && count('context')===0 ? 'Känn igen ordet i en ny berättelse.'
      : 'Välj ordet efter att ha läst betydelsen.';
    const steps = [
      {icon:'🔎',label:'Upptäckt',help:'Du har mött ordet i en uppgift.',done:seen},
      {icon:'🧠',label:count('picture')>0 && count('meaning')===0 && !missions.has('meaning') ? 'Hittat bilden' : 'Hittat betydelsen',
        help:'Du har fått rätt på en bild eller betydelse.',done:recognition},
      {icon:'🎭',label:step3Label,help:step3Info,done:application},
      {icon:'⭐',label:'Klarat flera gånger',help:'Du har lyckats vid flera försök. Fortsätt gärna öva!',done:revisit}
    ];
    const difficult = Object.entries(skills).filter(([skill,entry])=>Object.hasOwn(names,skill) && positive(entry?.wrong)>0 && positive(entry?.streak)<2);
    const due = review && positive(review?.streak)<3 && Number.isFinite(review.dueAt) && review.dueAt <= now;
    let tip;
    if (difficult.length) {
      const [skill] = difficult.sort((a,b)=>positive(b[1].wrong)-positive(a[1].wrong))[0];
      tip=`Nästa idé: ge ${names[skill]} en ny chans.`;
    } else if (due) tip='En ny repetitionsfråga är redo för dig!';
    else if (!seen) tip='Möt ordet i en ordjakt för att upptäcka din första plats.';
    else if (!recognition) tip='Prova att hitta rätt bild eller betydelse.';
    else if (!application) tip=step3Info;
    else if (!revisit) tip='Härligt! Träffa gärna ordet igen i en annan omgång.';
    else tip='Du har övat på flera sätt. Välj gärna en ny utmaning!';
    return { ...item, steps, done:steps.filter(x=>x.done).length,
      seen,recognition,application,revisit,needsPractice:difficult.length>0 || !!due,tip,
      skills: Object.entries(skills).filter(([key,entry])=>Object.hasOwn(names,key)&&positive(entry?.attempts)>0)
        .map(([key,entry])=>({label:names[key],right:positive(entry.right),wrong:positive(entry.wrong)}))};
  }
  function entries(catalogItems, progress, reviews, missions, mistakes, now = Date.now()) {
    return catalogItems.map(item=>detail(item,progress,reviews,missions,mistakes,now));
  }
  function summary(all) {
    return {
      total:all.length,
      discovered:all.filter(x=>x.seen).length,
      recognised:all.filter(x=>x.recognition).length,
      applied:all.filter(x=>x.application).length,
      revisited:all.filter(x=>x.revisit).length,
      focus:all.filter(x=>x.seen&&x.needsPractice).length
    };
  }
  function filter(all, {query='',kind='all',status='discovered'} = {}) {
    const q=String(query).trim().toLocaleLowerCase('sv-SE').slice(0,100);
    return all.filter(item=>(!q || [item.name,item.definition,item.example].join(' ').toLocaleLowerCase('sv-SE').includes(q)) &&
      (kind==='all'||(kind==='words'&&item.kind==='word')||(kind==='expressions'&&item.kind==='expression')) &&
      (status==='all'||(status==='discovered'&&item.seen)||(status==='practice'&&item.seen&&item.needsPractice)||
        (status==='many'&&item.application)||(status==='revisited'&&item.revisit)))
      .sort((a,b)=>Number(b.seen)-Number(a.seen) || Number(b.needsPractice)-Number(a.needsPractice) ||
        b.done-a.done || a.name.localeCompare(b.name,'sv'));
  }
  return {catalog,detail,entries,summary,filter};
});
