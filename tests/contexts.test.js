'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const E=require('../public/js/engine');
const R=require('../public/js/review');
const root=path.resolve(__dirname,'../public');
const bank=require('../public/data/ordbank.json');
const contexts=require('../public/data/word-contexts.json');
const context={window:{}};
for(const script of ['data/curation.js','data/word-contexts.js'])
  vm.runInNewContext(fs.readFileSync(path.join(root,script),'utf8'),context);
const curation=context.window.ORDJAKTEN_CURATION;
const NOW=1800000000000;
const WORDS=new Map(bank.words.map(w=>[w.id,w]));
const round=(settings,cards={})=>E.generateRound(bank,curation,settings,{},()=>.44,null,null,cards,NOW,contexts);
test('363 authored situations cover all 121 existing words and browser data matches JSON',()=>{
  assert.deepEqual(E.validateContexts(contexts,bank,curation),[]);
  assert.deepEqual(new Set(contexts.wordContexts.map(row=>row.id)),new Set(WORDS.keys()));
  assert.equal(contexts.wordContexts.reduce((n,r)=>n+r.scenes.length,0),363);
  assert.equal(JSON.stringify(context.window.ORDJAKTEN_CONTEXTS),JSON.stringify(contexts));
  for(const r of contexts.wordContexts){
    assert.ok(WORDS.has(r.id));
    assert.equal(r.scenes.length,3);
    assert.equal(new Set(r.scenes.map(s=>s.text)).size,3);
  }
});
test('all 363 real-world questions have four unique text answers and no answer leakage',()=>{
  for(const record of contexts.wordContexts)for(let i=0;i<3;i++){
    const q=E.makeContextQuestion(WORDS.get(record.id),bank,contexts,()=>.37,i);
    assert.equal(q.kind,'word');assert.equal(q.taskType,'context');
    assert.equal(q.contextIndex,i);
    assert.equal(q.picture,false);
    assert.equal(q.options.length,4);
    assert.equal(q.options.filter(o=>o.correct).length,1);
    assert.equal(q.options.find(o=>o.correct).label,q.word);
    assert.equal(new Set(q.options.map(o=>o.label)).size,4);
    assert.ok(!q.stem.toLocaleLowerCase('sv-SE').includes(q.word.toLocaleLowerCase('sv-SE')),q.id);
    assert.ok(!record.scenes[i].title.toLocaleLowerCase('sv-SE').includes(q.word.toLocaleLowerCase('sv-SE')),q.id);
    assert.ok(q.contextWhy.length>15);
  }
});
test('bad or duplicate contexts fail editorial validation rather than being used silently',()=>{
  const malformed=structuredClone(contexts);
  malformed.wordContexts[0].distractors[0]=malformed.wordContexts[0].id;
  malformed.wordContexts[1].scenes[0].text='Det här är ett tydligt exempel på ' + WORDS.get(malformed.wordContexts[1].id).word + ' i den lilla berättelsen.';
  malformed.wordContexts[2].scenes[1]=malformed.wordContexts[2].scenes[0];
  const errors=E.validateContexts(malformed,bank,curation);
  assert.ok(errors.some(x=>x.includes('alternativ')));
  assert.ok(errors.some(x=>x.includes('avslöjas')));
  assert.ok(errors.some(x=>x.includes('Duplicerad')));
});
test('Aha curation rejects missing, duplicate, self, unknown and synonymous scene sources',()=>{
  const row=contexts.wordContexts.find(record=>record.id==='sv-0012'); // skör / ömtålig
  for(const readingDistractors of [undefined,[],row.readingDistractors.slice(0,1),
    [row.readingDistractors[0],row.readingDistractors[0]],
    [row.id,row.readingDistractors[0]],['sv-9999',row.readingDistractors[0]],
    ['sv-0093',row.readingDistractors[0]]]){
    const malformed={...contexts,wordContexts:contexts.wordContexts.map(record=>record.id===row.id?{...record,readingDistractors}:record)};
    assert.ok(E.validateContexts(malformed,bank,curation).some(error=>error.includes('Aha-alternativ')&&error.includes(row.id)));
  }
  const missingSource={...contexts,wordContexts:contexts.wordContexts.filter(record=>record.id!==row.readingDistractors[0])};
  assert.ok(E.validateContexts(missingSource,bank,curation).some(error=>error.includes('Aha-alternativ')&&error.includes(row.id)));
});
test('quick start can pick 5 distinct medium words exclusively as contextual tasks',()=>{
  const settings={topic:'words',difficulty:'medium',mode:'train',count:5,contextOnly:true};
  const qs=round(settings);
  assert.equal(qs.length,5);
  assert.equal(new Set(qs.map(q=>q.id)).size,5);
  assert.ok(qs.every(q=>q.taskType==='context'&&q.picture===false));
});
test('mixed word rounds can include contexts, yet easy remains pictures and exam remains five text alternatives',()=>{
  const normal={topic:'words',difficulty:'medium',mode:'train',count:25,contextMix:true};
  const qs=round(normal);
  assert.ok(qs.some(q=>q.taskType==='context'));
  assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);
  assert.ok(qs.every(q=>q.options.filter(o=>o.correct).length===1));
  const off=round({...normal,contextMix:false});
  assert.ok(off.every(q=>q.taskType!=='context'));
  const easy=round({...normal,difficulty:'easy'});
  assert.ok(easy.every(q=>q.picture===true));
  const exam=round({...normal,difficulty:'exam',mode:'test'});
  assert.ok(exam.every(q=>q.options.length===5&&q.taskType!=='context'));
});
test('one missed grumlig returns through different everyday stories and a reverse question',()=>{
  const id='sv-0044';
  const settings={topic:'words',difficulty:'medium',mode:'train',count:5,reviewOnly:true};
  let cards=R.sanitize({[id]:{streak:0,dueAt:NOW,lastVariant:'meaning',attempts:1}}, {}, NOW);
  const first=round(settings,cards);
  assert.equal(first.length,1);
  assert.equal(first[0].taskType,'context');
  assert.equal(first[0].contextIndex,1);
  cards=R.record(cards,first[0],'right',NOW);
  assert.equal(cards[id].lastVariant,'context');
  assert.equal(cards[id].streak,1);
  assert.throws(()=>round(settings,cards),/inga felaktiga/); // not yet ready
  const due1=cards[id].dueAt;
  const next=E.generateRound(bank,curation,settings,{},()=>.44,null,null,cards,due1,contexts);
  assert.equal(next[0].taskType,'reverse');
  cards=R.record(cards,next[0],'right',due1);
  assert.equal(cards[id].streak,2);
  const due2=cards[id].dueAt;
  const third=E.generateRound(bank,curation,settings,{},()=>.44,null,null,cards,due2,contexts);
  assert.equal(third[0].taskType,'context');
  assert.notEqual(third[0].stem,first[0].stem);
  cards=R.record(cards,third[0],'right',due2);
  assert.equal(cards[id].streak,3);
  assert.equal(R.summary(cards,due2).mastered,1);
});
test('old results and settings survive; context flag is harmless in test/exam levels',()=>{
  const old=E.sanitizeHistory({settings:{difficulty:'easy'},results:[{finishedAt:NOW,total:5,right:3,wrong:2}]});
  assert.equal(old.settings.contextMix,true);
  assert.equal(old.results[0].right,3);
  const bad=E.sanitizeSettings({...old.settings,contextMix:'yes'});
  assert.equal(bad.contextMix,true);
  assert.equal(R.questionVariant({kind:'word',taskType:'context'}),'context');
});
