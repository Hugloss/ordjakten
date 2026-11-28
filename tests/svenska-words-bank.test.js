'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const Platform=require('../public/js/question-platform');
const SwedishWords=require('../public/js/banks/svenska-words');
const root=path.join(__dirname,'..');
const words=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'public/data/curation.js'),'utf8'),sandbox);
const curation=sandbox.window.ORDJAKTEN_CURATION;
const expectedPictures=Object.keys(curation.easy).length;

test('all 363 authored word scenes have immutable identity and preserve original concepts',()=>{
  const ids=new Set();
  for(const r of contexts.wordContexts)for(const [index,scene] of r.scenes.entries()){
    assert.equal(scene.id,'context-'+r.id+'-'+String(index+1).padStart(2,'0'));
    assert.ok(!ids.has(scene.id),scene.id);
    ids.add(scene.id);
  }
  assert.equal(ids.size,363);
});
test('Swedish word adapter exposes every contextual, meaning, reverse and curated picture question',()=>{
  const adapter=SwedishWords.fromSources(words,contexts,curation);
  const counts=adapter.counts();
  assert.deepEqual(counts,{meaning:121,reverse:121,context:363,picture:expectedPictures});
  const reg=Platform.createRegistry();reg.register(adapter);
  assert.equal(reg.listQuestionRefs('svenska').length,605+expectedPictures);
  for(const r of contexts.wordContexts){
    const id='context-'+r.id+'-01';
    const q=reg.resolve({bankId:'svenska',id,revision:1});
    assert.equal(q.provenance.legacyConceptId,r.id);
    assert.equal(q.stimulus,r.scenes[0].text);
    assert.equal(q.explanation[0].text,r.scenes[0].why);
    const correct=q.assessmentSpec.correctOptionId;
    assert.deepEqual(reg.assess(q.ref,correct),{status:'correct'});
    const wrong=q.responseSpec.options.find(o=>o.id!==correct);
    assert.deepEqual(reg.assess(q.ref,wrong.id),{status:'incorrect'});
    assert.equal(JSON.stringify(reg.present(q.ref,{seed:7})).includes('correctOptionId'),false);
  }
});
test('word bank adapter fails closed on missing and duplicated authored questions',()=>{
  const wrong=structuredClone(contexts);
  wrong.wordContexts[0].scenes[0].id='context-sv-0001-03';
  assert.throws(()=>SwedishWords.fromSources(words,wrong,curation),/stable authored scene ID/);
  const duplicate=structuredClone(contexts);
  duplicate.wordContexts.push(duplicate.wordContexts[0]);
  assert.throws(()=>SwedishWords.fromSources(words,duplicate,curation),/Invalid authored word context/);
});
