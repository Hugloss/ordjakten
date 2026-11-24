'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../public/js/engine');
const B=require('../public/js/reading-check');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const surprises=require('../public/data/surprises.json');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;

// Regression guard for the child playtest: ordinary word questions previously
// had no `kind` and silently skipped the unscored read-and-apply checkpoint.
test('ordinary easy, medium, hard and exam questions carry a kind and an Aha check',()=>{
  for(const level of ['easy','medium','hard','exam']){
    for(const entry of E.getPool(bank,curation,level)){
      const question=E.makeQuestion(entry,bank,curation,level,()=>.42);
      assert.equal(question.kind,'word',`${level}: ${entry.word}`);
      const check=B.makeCheck(question,{bank,contexts,surprises,missions,random:()=>.36});
      assert.ok(check,`${level}: ${entry.word} missing learning check`);
      assert.equal(check.options.length,3);
      assert.equal(check.options.filter(o=>o.correct).length,1);
    }
  }
});
test('standard training round has no silent Aha gaps',()=>{
  for(const level of ['easy','medium','hard']){
    const round=E.generateRound(bank,curation,{mode:'train',difficulty:level,topic:'words',count:10,contextMix:false}, {},()=>.23,
      expressions,missions,null,Date.now(),contexts);
    assert.equal(round.length,10);
    assert.ok(round.every(q=>q.kind==='word'));
    assert.ok(round.every(q=>B.makeCheck(q,{bank,contexts,surprises,missions})));
  }
});
