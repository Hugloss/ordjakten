'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Platform=require('../public/js/question-platform');
const Svenska=require('../public/js/banks/svenska');
const Sessions=require('../public/js/question-session');
const Engine=require('../public/js/engine');
const root=path.join(__dirname,'..');
const source=JSON.parse(fs.readFileSync(path.join(root,'public/data/expressions.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'content/banks/svenska/manifest.json'),'utf8'));
const ref={bankId:'svenska',id:'meaning-ut-0001',revision:1};
function makeRegistry(){
  const registry=Platform.createRegistry();
  registry.register(Svenska.fromLegacyExpressions(source));
  return registry;
}

test('the Swedish bank owns its 73 questions without copied question files',()=>{
  assert.equal(manifest.bankId,'svenska');
  assert.equal(manifest.primarySource,'public/data/expressions.json');
  for(const filename of manifest.sourceFiles)assert.ok(fs.existsSync(path.join(root,filename)),filename);
  const registry=makeRegistry();
  assert.deepEqual(registry.bankInfo().map(x=>({id:x.bankId,count:x.count})),[{id:'svenska',count:73}]);
  assert.equal(registry.listQuestionRefs('svenska').length,73);
  assert.throws(()=>registry.listQuestionRefs('matematik'),/Unknown knowledge bank/);
  assert.throws(()=>registry.resolve({bankId:'matematik',id:ref.id,revision:1}),/Unknown knowledge bank/);
});
test('all Swedish expression options and answer meanings match the original source',()=>{
  const registry=makeRegistry();
  for(const entry of source.expressions){
    const question=registry.resolve({bankId:'svenska',id:'meaning-'+entry.id,revision:1});
    const options=question.responseSpec.options;
    assert.deepEqual(options.map(o=>o.label),entry.options.map(o=>o.label));
    assert.equal(question.provenance.legacyConceptId,entry.id);
    assert.equal(question.stimulus,entry.scene);
    for(const [index,option] of options.entries()){
      const grade=registry.assess(question.ref,option.id);
      assert.equal(grade.status,entry.options[index].correct?'correct':'incorrect',entry.id);
    }
  }
});
test('presentations have stable IDs, deterministic order and no exposed facit',()=>{
  const registry=makeRegistry();
  const a=registry.present(ref,{seed:74});
  const b=registry.present(ref,{seed:74});
  assert.deepEqual(a,b);
  assert.equal(a.ref.bankId,'svenska');
  assert.equal(a.responseSpec.options.length,5);
  assert.equal(JSON.stringify(a).includes('correctOptionId'),false);
  assert.equal(JSON.stringify(a).includes('"correct":'),false);
  const ids=registry.resolve(ref).responseSpec.options.map(x=>x.id).sort();
  assert.deepEqual(a.responseSpec.options.map(x=>x.id).sort(),ids);
  assert.throws(()=>registry.resolve({...ref,revision:2}),/revision mismatch/);
  assert.deepEqual(registry.assess(ref,'unknown'),{status:'invalid'});
});
test('question and option identities survive a reordering of original alternatives',()=>{
  const first=source.expressions[0];
  const reversed={...first,options:[...first.options].reverse()};
  const a=Svenska.questionFromEntry(first);
  const b=Svenska.questionFromEntry(reversed);
  assert.equal(a.ref.id,b.ref.id);
  assert.deepEqual(a.responseSpec.options.map(x=>x.id).sort(),b.responseSpec.options.map(x=>x.id).sort());
  assert.equal(a.assessmentSpec.correctOptionId,b.assessmentSpec.correctOptionId);
});
test('source mutations cannot change an already registered Swedish provider',()=>{
  const copied=JSON.parse(JSON.stringify(source));
  const provider=Svenska.fromLegacyExpressions(copied);
  const registry=Platform.createRegistry();
  registry.register(provider);
  const before=registry.resolve(ref).responseSpec.options[0].label;
  copied.expressions[0].options[0].label='changed';
  assert.equal(registry.resolve(ref).responseSpec.options[0].label,before);
});
test('two subject banks are independent even if they reuse a local question ID',()=>{
  const registry=makeRegistry();
  const mathRef={bankId:'matematik',id:'meaning-ut-0001',revision:1};
  registry.register({
    describe:()=>({bankId:'matematik',revision:1}),
    listQuestionIds:()=>['meaning-ut-0001'],
    getQuestion:id=>id===mathRef.id?{
      ref:mathRef,skillIds:['multiplication'],prompt:'6 × 7 = ?',
      responseSpec:{kind:'numeric'},assessmentSpec:{kind:'numeric-exact',expected:42}
    }:null
  });
  assert.deepEqual(registry.assess(mathRef,42),{status:'correct'});
  assert.deepEqual(registry.assess(mathRef,'42'),{status:'correct'});
  assert.deepEqual(registry.assess(mathRef,'41'),{status:'incorrect'});
  assert.deepEqual(registry.assess(mathRef,'tjugotvå'),{status:'invalid'});
  assert.equal(registry.resolve(ref).prompt.includes('För en gångs skull'),true);
  assert.equal(registry.bankInfo().length,2);
  assert.throws(()=>registry.register(Svenska.fromLegacyExpressions(source)),/already registered/);
});
test('train feedback is immediate; test feedback is withheld until finish',()=>{
  const registry=makeRegistry();
  const correct=registry.resolve(ref).assessmentSpec.correctOptionId;
  const training=Sessions.create(registry,{mode:'train',refs:[ref],sessionId:'training'});
  assert.equal(training.current().question.ref.id,ref.id);
  assert.deepEqual(training.answer(correct),{accepted:true,feedback:{status:'correct'}});
  assert.equal(training.snapshot().answered,1);
  training.next();
  assert.equal(training.finish().correct,1);
  const exam=Sessions.create(registry,{mode:'test',refs:[ref],sessionId:'exam'});
  assert.equal(JSON.stringify(exam.current()).includes('correctOptionId'),false);
  assert.deepEqual(exam.answer(correct),{accepted:true,feedback:null});
  assert.throws(()=>exam.answer(correct),/already answered/);
  const preview=exam.snapshot();
  assert.equal(JSON.stringify(preview).includes('"status":"correct"'),false);
  exam.next();
  assert.deepEqual(exam.finish().outcomes,[{ref,status:'correct'}]);
});
test('invalid answers and incomplete rounds never turn into learning or rewards',()=>{
  const registry=makeRegistry();
  const session=Sessions.create(registry,{mode:'test',refs:[ref]});
  assert.deepEqual(session.answer('bogus'),{accepted:false,feedback:null});
  assert.equal(session.snapshot().answered,0);
  assert.throws(()=>session.next(),/Answer the question/);
  assert.throws(()=>session.finish(),/unanswered/);
  assert.equal('reward' in session.snapshot(),false);
  assert.equal('mastery' in session.snapshot(),false);
});
test('legacy engine meaning questions still keep the original facit and counts',()=>{
  for(const entry of source.expressions){
    const quiz=Engine.makeExpressionQuestion(entry,'exam',()=>0.72,'meaning');
    assert.equal(quiz.options.length,5);
    assert.deepEqual(quiz.options.map(x=>x.label).sort(),entry.options.map(x=>x.label).sort());
    assert.deepEqual(quiz.options.filter(x=>x.correct).map(x=>x.label),
      entry.options.filter(x=>x.correct).map(x=>x.label));
    const training=Engine.makeExpressionQuestion(entry,'medium',()=>0.72,'meaning');
    assert.equal(training.options.length,4);
    assert.deepEqual(training.options.filter(x=>x.correct).map(x=>x.label),
      entry.options.filter(x=>x.correct).map(x=>x.label));
  }
});
