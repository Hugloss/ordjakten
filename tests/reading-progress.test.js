'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const B=require('../public/js/reading-check');
const D=require('../public/js/adaptive');
const E=require('../public/js/engine');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const missions=require('../public/data/missions.json');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../public/data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;
const NOW=1780000000000;

test('Aha support is tracked separately from original question points',()=>{
  let p=B.recordProgress({},'sv-0044','context','guided',NOW);
  assert.equal(B.needsReview(p,'sv-0044'),true);
  assert.equal(p['sv-0044'].transfer.supported,1);
  p=B.recordProgress(p,'sv-0044','context','first',NOW+86400000);
  assert.equal(B.needsReview(p,'sv-0044'),true);
  p=B.recordProgress(p,'sv-0044','context','first',NOW+2*86400000);
  assert.equal(B.needsReview(p,'sv-0044'),false);
  assert.equal(p['sv-0044'].transfer.first,2);
  assert.equal(p['sv-0044'].transfer.supported,1);
  assert.equal(p['sv-0044'].transfer.streak,2);
  assert.equal(E.score({'sv-0044':'right'},1).right,1);
});

test('Aha transfers and meaning recognition have independent outcomes',()=>{
  let p=B.recordProgress({},'sv-0044','meaning','guided',NOW);
  p=B.recordProgress(p,'sv-0044','context','first',NOW+1000);
  assert.equal(B.needsReview(p,'sv-0044','recognition'),true);
  assert.equal(B.needsReview(p,'sv-0044','transfer'),false);
  assert.equal(D.choiceType({kind:'word',entry:{id:'sv-0044'}},
    {difficulty:'medium',expressionTask:'mix'}, {}, ['meaning','reverse','context'],()=>.1,p),'reverse');
});

test('when main answer was right but Aha needed help, next adaptive practice prefers a new context',()=>{
  const id='sv-0044';
  const reading=B.recordProgress({},id,'context','guided',NOW);
  const settings={mode:'train',difficulty:'medium',topic:'words',count:10,contextMix:true,adaptivePractice:true};
  const all=E.getTopicPool(bank,curation,expressions,settings);
  const chosen=D.pickItems(all,10,{}, {},settings,new Set(contexts.wordContexts.map(r=>r.id)),true,NOW,()=>.43,reading);
  assert.ok(chosen.some(item=>item.entry.id===id));
  const questions=E.generateRound(bank,curation,settings,{},()=>.43,expressions,missions,{},NOW,contexts,{},D,reading);
  assert.equal(questions.find(q=>q.id===id)?.taskType,'context');
  const independent=E.generateRound(bank,curation,{...settings,mode:'test'}, {},()=>.43,expressions,missions,{},NOW,contexts,{},D,reading);
  const noHistory=E.generateRound(bank,curation,{...settings,mode:'test'}, {},()=>.43,expressions,missions,{},NOW,contexts,{},D,{});
  assert.deepEqual(independent,noHistory,'Testa dig must not use Aha history');
});

test('Aha history validates IDs, counts and malformed stored data',()=>{
  const valid=B.recordProgress({},'ut-0001','expression','retry',NOW);
  const polluted={...valid,'../secret':{transfer:{supported:5}},'sv-0044':{transfer:{first:1e9,supported:9999999,streak:9999,lastAt:-1}}};
  const sanitized=B.sanitizeProgress(polluted);
  assert.equal(sanitized['../secret'],undefined);
  assert.equal(sanitized['sv-0044'].transfer.supported,9999);
  assert.equal(sanitized['sv-0044'].transfer.streak,99);
  assert.equal(sanitized['sv-0044'].transfer.lastAt,0);
  assert.equal(B.needsReview(valid,'ut-0001','transfer'),true);
  assert.equal(E.sanitizeHistory({readingProgress:valid}).readingProgress['ut-0001'].transfer.supported,1);
  assert.equal(B.recordProgress(valid,'sv-0044','unknown','first'),valid);
});

test('short stories and definition checks are not mislabeled as an independent new context',()=>{
  const word=bank.words.find(w=>!contexts.wordContexts.some(c=>c.id===w.id));
  const check=B.makeCheck({...word,kind:'word',options:[],picture:false},{bank,contexts,surprises:{},missions,random:()=>.25});
  assert.equal(check.source,'meaning');
});
