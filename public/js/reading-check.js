/* A second, unscored learning step. Never invent a story at runtime:
 * use edited examples for expressions and word contexts, or definitions
 * already vetted for the original multiple-choice question. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenReading = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function choose(items, random) {
    if (!items.length) return null;
    return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
  }
  function finish(prompt, right, wrong, source, random) {
    if (!right || !wrong || right === wrong) return null;
    const options = random() < 0.5 ?
      [{label:right,correct:true},{label:wrong,correct:false}] :
      [{label:wrong,correct:false},{label:right,correct:true}];
    return {prompt, options, source};
  }
  function makeCheck(question, {bank, contexts, surprises, random=Math.random}={}) {
    if (!question || !question.id || !question.definition) return null;
    const word = question.word;
    if (question.kind === 'expression') {
      // These 25 transfer examples were written and reviewed separately
      // from the original question's story and definition.
      const challenge = surprises?.challenges?.find(item => item.id === question.id);
      const right = challenge?.options?.find(item => item.correct === true)?.label;
      const wrong = challenge?.options?.find(item => item.correct === false)?.label;
      return finish(`Vilken NY situation visar uttrycket ”${word}”?`,right,wrong,'expression',random);
    }
    if (question.kind !== 'word') return null;
    const scenes = contexts?.wordContexts || [];
    const record = scenes.find(item => item.id === question.id);
    if (record) {
      const fresh = record.scenes.filter((scene,index) =>
        index !== question.contextIndex && scene.text !== question.stem);
      const right = choose(fresh, random)?.text;
      const distractors = record.distractors.map(id=>scenes.find(item=>item.id===id))
        .filter(item=>item && item.scenes && item.scenes.length);
      const wrongRecord = choose(distractors, random);
      const wrong = wrongRecord && choose(wrongRecord.scenes, random)?.text;
      const check = finish(`Vilken ANNAN berättelse visar ordet ”${word}”?`,right,wrong,'context',random);
      if (check) return check;
    }
    // Older words without authored scenes still get a short reading check.
    // Prefer an already curated distractor definition; reverse and picture
    // questions use the definition of a vetted alternative word instead.
    const words=bank?.words || [];
    let wrong;
    if (!question.picture && question.taskType !== 'reverse' && question.taskType !== 'context') {
      wrong=question.options?.find(item=>item.correct===false &&
        item.label !== question.definition)?.label;
    }
    if(!wrong) {
      const otherWords=new Set((question.options||[]).filter(item=>!item.correct)
        .map(item=>String(item.label).toLocaleLowerCase('sv-SE')));
      wrong=words.find(item=>item.id!==question.id &&
        otherWords.has(item.word.toLocaleLowerCase('sv-SE')))?.definition;
    }
    if(!wrong)wrong=words.find(item=>item.id!==question.id &&
      item.definition !== question.definition &&
      item.difficulty !== words.find(w=>w.id===question.id)?.difficulty)?.definition;
    return finish(`Vilken förklaring hör till ordet ”${word}”?`,question.definition,wrong,'meaning',random);
  }
  function isCorrect(check,index) {
    return check?.options?.[index]?.correct === true;
  }
  return {makeCheck,isCorrect};
});
