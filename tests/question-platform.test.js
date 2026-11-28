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
test('shared runtime and legacy engine must not depend on a concrete subject bank',()=>{
  for(const file of ['public/js/engine.js','public/js/question-platform.js',
    'public/js/question-session.js']){
    const text=fs.readFileSync(path.join(root,file),'utf8');
    assert.doesNotMatch(text,/require\(['"]\.\/banks\/svenska['"]\)/,file);
    assert.doesNotMatch(text,/OrdjaktenSvenskaBank/,file);
  }
  const app=fs.readFileSync(path.join(root,'public/js/app.js'),'utf8');
  assert.match(app,/SvenskaCatalog\.fromSources\(/);
  assert.match(app,/words:bank,contexts,curation,contrasts,clues,surprises/);
  assert.match(app,/bankRegistry\.assess\(ref,answer\)/);
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

const missionSource=JSON.parse(fs.readFileSync(path.join(root,'public/data/missions.json'),'utf8'));
function makeFullRegistry(){
  const registry=Platform.createRegistry();
  registry.register(Svenska.fromLegacyExpressions(source,missionSource));
  return registry;
}
test('the Swedish bank exposes independently identified meaning, sentence, sequence and context questions',()=>{
  const registry=makeFullRegistry();
  const all=registry.listQuestionRefs('svenska');
  assert.equal(all.length,237);
  assert.equal(new Set(all.map(ref=>ref.id)).size,237);
  assert.equal(all.filter(ref=>ref.id.startsWith('meaning-')).length,73);
  assert.equal(all.filter(ref=>ref.id.startsWith('order-')).length,73);
  assert.equal(all.filter(ref=>ref.id.startsWith('sentence-')).length,91);
  assert.ok(all.every(ref=>ref.bankId==='svenska'&&ref.revision===1));
});
test('all 73 authored expression sentence and ordering questions retain their source facit',()=>{
  const registry=makeFullRegistry();
  const entries=new Map(source.expressions.map(entry=>[entry.id,entry]));
  for(const mission of missionSource.missions){
    const entry=entries.get(mission.id);
    const sref={bankId:'svenska',id:'sentence-'+mission.id,revision:1};
    const question=registry.resolve(sref);
    assert.deepEqual(question.responseSpec.options.map(row=>row.label),
      mission.sentences.map(row=>row.label));
    for(const [i,choice] of question.responseSpec.options.entries()){
      assert.equal(registry.assess(sref,choice.id).status,
        mission.sentences[i].correct?'correct':'incorrect',mission.id);
    }
    if(!mission.contextScenes){
      const legacy=Engine.makeExpressionQuestion(entry,'medium',()=>0.48,'sentence',missionSource);
      assert.deepEqual(legacy.options.map(row=>row.label).sort(),
        question.responseSpec.options.map(row=>row.label).sort());
    }
    const oref={bankId:'svenska',id:'order-'+mission.id,revision:1};
    const sequence=registry.resolve(oref);
    assert.deepEqual(sequence.responseSpec.options.map(row=>row.label),mission.order);
    const correct=sequence.assessmentSpec.correctOrder;
    assert.deepEqual(registry.assess(oref,correct),{status:'correct'});
    assert.deepEqual(registry.assess(oref,[correct[1],correct[0],correct[2]]),{status:'incorrect'});
    assert.deepEqual(registry.assess(oref,[correct[0],correct[0],correct[2]]),{status:'invalid'});
  }
});
test('18 special context scenes are distinct questions and preserve authored answer labels',()=>{
  const registry=makeFullRegistry();
  const entries=new Map(source.expressions.map(entry=>[entry.id,entry]));
  let total=0;
  for(const mission of missionSource.missions){
    for(const scene of mission.contextScenes||[]){
      total+=1;
      const ref={bankId:'svenska',id:'sentence-'+scene.id,revision:1};
      const q=registry.resolve(ref);
      const expectedLabels=scene.options.map(row=>'”'+scene.prompt+'” – '+row.label);
      assert.deepEqual(q.responseSpec.options.map(row=>row.label),expectedLabels);
      for(const [i,choice] of q.responseSpec.options.entries())
        assert.equal(registry.assess(ref,choice.id).status,
          scene.options[i].correct?'correct':'incorrect',scene.id);
      const legacy=Engine.makeExpressionQuestion(entries.get(mission.id),'medium',()=>.5,
        'sentence',missionSource,scene.id);
      assert.deepEqual(legacy.options.map(row=>row.label).sort(),expectedLabels.slice().sort());
    }
  }
  assert.equal(total,18);
});
test('contextual question IDs cannot cross a Swedish expression boundary',()=>{
  const altered=JSON.parse(JSON.stringify(missionSource));
  const affected=altered.missions.find(mission=>mission.contextScenes?.length);
  affected.contextScenes[0].id='ut-0001-unrelated';
  assert.throws(()=>Svenska.fromLegacyExpressions(source,altered),/Invalid Swedish contextual scene/);
});
test('ordering presentations and test mode never expose the expected order',()=>{
  const registry=makeFullRegistry();
  const ref={bankId:'svenska',id:'order-ut-0001',revision:1};
  const q=registry.resolve(ref);
  const shown=registry.present(ref,{seed:113});
  assert.equal(shown.responseSpec.kind,'ordering');
  assert.equal(shown.responseSpec.options.length,3);
  assert.equal(JSON.stringify(shown).includes('correctOrder'),false);
  assert.deepEqual(shown.responseSpec.options.map(row=>row.id).sort(),
    q.responseSpec.options.map(row=>row.id).sort());
  assert.deepEqual(registry.present(ref,{seed:113}),shown);
  const testSession=Sessions.create(registry,{mode:'test',refs:[ref],seed:113});
  const correct=q.assessmentSpec.correctOrder;
  assert.deepEqual(testSession.answer(correct),{accepted:true,feedback:null});
  assert.equal(JSON.stringify(testSession.snapshot()).includes('correct'),false);
  testSession.next();
  assert.equal(testSession.finish().correct,1);
  const training=Sessions.create(registry,{mode:'train',refs:[ref]});
  assert.deepEqual(training.answer(correct),{accepted:true,feedback:{status:'correct'}});
});
test('bad cross-source references are rejected before bank registration',()=>{
  const copy=JSON.parse(JSON.stringify(missionSource));
  copy.missions[0].id='ut-9999';
  assert.throws(()=>Svenska.fromLegacyExpressions(source,copy),/Unknown or duplicate Swedish mission/);
  const missing=JSON.parse(JSON.stringify(missionSource));
  missing.missions.pop();
  assert.throws(()=>Svenska.fromLegacyExpressions(source,missing),/Missing Swedish missions/);
});
