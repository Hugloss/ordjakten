'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const data=require('../public/data/vardagskunskap');
const bank=require('../public/js/banks/vardagskunskap');
const Platform=require('../public/js/question-platform');
const Session=require('../public/js/question-session');
const Svenska=require('../public/js/banks/svenska');
const root=path.join(__dirname,'..');
const manifest=require('../content/banks/vardagskunskap/manifest.json');
const provider=()=>bank.fromAuthored(data);
const registry=()=>{
  const r=Platform.createRegistry();r.register(provider());return r;
};
test('Everyday knowledge has one canonical source and 10 balanced topics with 60 original questions',()=>{
  assert.equal(manifest.primarySource,'public/data/vardagskunskap.js');
  assert.equal(manifest.bankId,'vardagskunskap');
  assert.equal(data.topics.length,10);
  assert.equal(data.questions.length,60);
  assert.deepEqual(data.topics.map(t=>t.id),manifest.topics);
  assert.equal(new Set(data.questions.map(q=>q.id)).size,60);
  for(const topic of data.topics){
    const rows=data.questions.filter(q=>q.topicId===topic.id);
    assert.equal(rows.length,6,topic.id);
    assert.deepEqual(rows.map(q=>q.level),[1,1,2,2,3,3],topic.id);
  }
  for(const p of manifest.sourceFiles)assert.ok(fs.existsSync(path.join(root,p)));
});
test('all 60 scenarios have one stable correct answer and distinct alternatives',()=>{
  const r=registry();
  assert.equal(r.bankInfo()[0].count,60);
  for(const q of data.questions){
    const ref={bankId:'vardagskunskap',id:q.id,revision:q.revision};
    const question=r.resolve(ref);
    const expected=q.choices[q.correctIndex];
    assert.equal(question.responseSpec.options.find(o=>o.id===question.assessmentSpec.correctOptionId).label,expected,q.id);
    assert.equal(question.explanation[0].text,q.explanation,q.id);
    assert.equal(question.stimulus,q.stimulus,q.id);
    assert.deepEqual(question.skillIds,[q.topicId,q.skill],q.id);
    assert.equal(question.reviewStatus,'draft');
    for(let i=0;i<q.choices.length;i++){
      assert.equal(r.assess(ref,question.responseSpec.options[i].id).status,
        i===q.correctIndex?'correct':'incorrect',q.id+':'+i);
    }
    assert.deepEqual(r.assess(ref,'invalid'),{status:'invalid'});
    const visible=r.present(ref,{seed:42});
    assert.equal(visible.responseSpec.options.length,4);
    assert.equal(visible.stimulus,q.stimulus);
    assert.equal(JSON.stringify(visible).includes('correctOptionId'),false);
    assert.equal(JSON.stringify(visible).includes(q.explanation),false);
  }
});
test('a second subject bank coexists with Swedish and preserves independent scopes',()=>{
  const r=registry();
  const source=JSON.parse(fs.readFileSync(path.join(root,'public/data/expressions.json'),'utf8'));
  r.register(Svenska.fromLegacyExpressions(source));
  assert.deepEqual(r.bankInfo().map(b=>b.bankId),['vardagskunskap','svenska']);
  assert.equal(r.listQuestionRefs('vardagskunskap').length,60);
  assert.equal(r.listQuestionRefs('svenska').length,73);
  assert.throws(()=>r.resolve({bankId:'svenska',id:'vk-0001',revision:1}),/Unknown question/);
  assert.throws(()=>r.resolve({bankId:'vardagskunskap',id:'vk-0001',revision:2}),/revision mismatch/);
});
test('same question can be trained and tested; test feedback stays withheld until completion',()=>{
  const r=registry(), ref={bankId:'vardagskunskap',id:'vk-0001',revision:1};
  const question=r.resolve(ref),correct=question.assessmentSpec.correctOptionId;
  const train=Session.create(r,{mode:'train',refs:[ref],seed:8});
  assert.equal(train.answer(correct).feedback.status,'correct');
  train.next();
  assert.equal(train.finish().correct,1);
  const testSession=Session.create(r,{mode:'test',refs:[ref],seed:8});
  assert.equal(JSON.stringify(testSession.current()).includes('correctOptionId'),false);
  assert.deepEqual(testSession.answer(correct),{accepted:true,feedback:null});
  assert.equal(JSON.stringify(testSession.snapshot()).includes('"correct"'),false);
  testSession.next();
  assert.equal(testSession.finish().correct,1);
});
test('question IDs and answer IDs do not depend on order of authored choices',()=>{
  const altered=JSON.parse(JSON.stringify(data));
  altered.questions[0].choices.reverse();
  altered.questions[0].correctIndex=3;
  const first=provider().getQuestion('vk-0001');
  const changed=bank.fromAuthored(altered).getQuestion('vk-0001');
  assert.equal(first.ref.id,changed.ref.id);
  assert.equal(first.assessmentSpec.correctOptionId,changed.assessmentSpec.correctOptionId);
  assert.deepEqual(first.responseSpec.options.map(x=>x.id).sort(),
    changed.responseSpec.options.map(x=>x.id).sort());
});
test('bad topics, duplicate IDs and a second correct-looking answer are rejected before gameplay',()=>{
  const bad=JSON.parse(JSON.stringify(data));bad.questions[1].id='vk-0001';
  assert.throws(()=>bank.fromAuthored(bad),/Invalid everyday question/);
  bad.questions[1].id='vk-0002';bad.questions[1].topicId='not-a-topic';
  assert.throws(()=>bank.fromAuthored(bad),/Invalid everyday question/);
  bad.questions[1].topicId='manniskokroppen';bad.questions[1].choices[2]=bad.questions[1].choices[0];
  assert.throws(()=>bank.fromAuthored(bad),/Invalid everyday question/);
  const authored=JSON.parse(JSON.stringify(data));
  const before=provider().getQuestion('vk-0001').prompt;
  authored.questions[0].prompt='Modified externally';
  assert.equal(provider().getQuestion('vk-0001').prompt,before);
});
