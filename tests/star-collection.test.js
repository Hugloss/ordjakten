'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Stars=require('../public/js/star-collection.js');
const E=require('../public/js/engine.js');
const questions=[{id:'sv-0001'},{id:'sv-0002'},{id:'ut-0001'}];
const reload=value=>Stars.sanitize(JSON.parse(JSON.stringify(value)));

test('stars persist immediately and each question can earn only its one star',()=>{
  const started=Stars.begin(Stars.sanitize(),questions);
  let collection=started.collection;
  let result=Stars.award(collection,started.roundId,'sv-0001','answer');
  assert.equal(result.added,1);collection=reload(result.collection);
  assert.equal(collection.total,1);
  for(const via of ['answer','practice']){
    result=Stars.award(collection,started.roundId,'sv-0001',via);
    assert.equal(result.added,0);assert.equal(result.collection.total,1);
  }
  assert.deepEqual(Stars.summarize(collection),{roundId:1,earned:1,total:3,direct:1,practised:0,
    remaining:['sv-0002','ut-0001'],remainingCount:2,complete:false,finished:false});
});

test('practice can fill pending stars before and after the first round finishes without rewriting its score',()=>{
  const answers={'sv-0001':'right','sv-0002':'wrong','ut-0001':'wrong'};
  const original=E.score(answers,3);
  const started=Stars.begin(Stars.sanitize(),questions);
  let collection=Stars.award(started.collection,started.roundId,'sv-0001','answer').collection;
  collection=Stars.award(collection,started.roundId,'sv-0002','practice').collection;
  const finished=Stars.finish(collection,started.roundId);
  assert.deepEqual(finished.round.remaining,['ut-0001']);
  collection=reload(finished.collection);
  assert.equal(Stars.award(collection,started.roundId,'ut-0001','answer').added,0);
  collection=Stars.award(collection,started.roundId,'ut-0001','practice').collection;
  assert.deepEqual(Stars.summarize(collection),{roundId:1,earned:3,total:3,direct:1,practised:2,
    remaining:[],remainingCount:0,complete:true,finished:true});
  assert.deepEqual(E.score(answers,3),original);
  assert.equal(Stars.award(collection,started.roundId,'ut-0001','practice').added,0);
});

test('wrong answers and displayed solutions never award a star or remove previously collected stars',()=>{
  const started=Stars.begin({version:1,total:12,serial:0,active:null},questions);
  for(const outcome of ['wrong','unanswered','guided','reread','complete',null,false]){
    const result=Stars.award(started.collection,started.roundId,'sv-0001','practice',outcome);
    assert.equal(result.added,0);assert.equal(result.collection.total,12);
    assert.deepEqual(Stars.summarize(result.collection).remaining,questions.map(q=>q.id));
  }
});

test('starting a new round preserves stars but rejects all callbacks from the previous ledger',()=>{
  const first=Stars.begin(Stars.sanitize(),questions);
  const earned=Stars.award(first.collection,first.roundId,'sv-0001','answer').collection;
  const next=Stars.begin(reload(Stars.finish(earned,first.roundId).collection),questions);
  assert.equal(next.roundId,2);assert.equal(next.collection.total,1);
  for(const via of ['answer','practice']){
    const stale=Stars.award(next.collection,first.roundId,'sv-0002',via);
    assert.equal(stale.added,0);assert.equal(stale.collection.total,1);
  }
  assert.equal(Stars.summarize(next.collection,first.roundId),null);
  assert.equal(Stars.finish(next.collection,first.roundId).round,null);
  assert.equal(Stars.award(next.collection,next.roundId,'sv-0001','answer').added,1,
    'a genuine new round remains an ordinary opportunity to earn a star');
});

test('legacy stars migrate once and a lifetime collection survives the 50-result history limit',()=>{
  const rows=Array.from({length:50},(_,i)=>({finishedAt:i+1,mode:i%2?'train':'test',total:5,right:4,wrong:1,unanswered:0}));
  let collection=Stars.sanitize(undefined,rows);
  assert.equal(collection.total,200);
  collection=Stars.sanitize(collection,rows.concat(rows));
  assert.equal(collection.total,200,'an existing collection must never be reimported');
  for(let i=0;i<60;i++){
    const started=Stars.begin(collection,[questions[0]]);
    collection=Stars.award(started.collection,started.roundId,questions[0].id,'answer').collection;
    collection=Stars.finish(collection,started.roundId).collection;
  }
  assert.equal(Stars.sanitize(reload(collection),rows.slice(-1)).total,260);
  assert.equal(Stars.sanitize({},rows).total,0,'malformed saved data cannot trigger another migration');
  assert.equal(Stars.sanitize('broken',rows).total,0);
  const invalid=[{mode:'train',total:5,right:7},{mode:'test',total:5,right:-1},
    {mode:'test',total:5,right:4,wrong:2,unanswered:0},{mode:'other',total:5,right:5},
    {mode:'train',total:5,right:2.5}];
  assert.equal(Stars.sanitize(undefined,invalid).total,0);
});

test('invalid and oversized ledgers fail closed while a valid saved star total remains intact',()=>{
  const started=Stars.begin({version:1,total:200,serial:0,active:null},questions);
  const active=started.collection.active;
  for(const broken of [
    {...active,ids:['../secret']},
    {...active,ids:Array.from({length:26},(_,i)=>'sv-'+String(i).padStart(4,'0'))},
    {...active,ids:['sv-0001','sv-0001']},
    {...active,earned:[{id:'sv-9999',via:'answer'}]},
    {...active,earned:[{id:'sv-0001',via:'guided'}]},
    {...active,earned:[{id:'sv-0001',via:'answer'},{id:'sv-0001',via:'practice'}]},
    {...active,serial:99},
    {...active,finished:'false'}
  ]){
    const clean=Stars.sanitize({...started.collection,active:broken});
    assert.equal(clean.total,200);assert.equal(clean.active,null);
    assert.equal(Stars.award(clean,1,'sv-0001','answer').added,0);
  }
  for(const badQuestions of [[],[{}],[questions[0],questions[0]],Array(26).fill(questions[0])])
    assert.equal(Stars.begin(started.collection,badQuestions).roundId,null);
  assert.equal(Stars.award(started.collection,1,'sv-9999','answer').added,0);
  assert.equal(Stars.award(started.collection,1,'sv-0001','speed').added,0);
  assert.equal(Stars.sanitize({version:1,total:NaN,serial:0}).total,0);
  assert.equal(Stars.sanitize({version:1,total:5.5,serial:0}).total,0);
});

test('named milestones are deterministic, persist, and have no clock or consecutive-answer requirement',()=>{
  assert.deepEqual(Stars.MILESTONES.map(row=>row.at),[5,15,30,50,75,100]);
  for(const milestone of Stars.MILESTONES){
    const before={version:1,total:milestone.at-1,serial:0,active:null};
    const slow=Stars.begin({...before,elapsed:999999999,streak:0},[questions[0]]);
    const fast=Stars.begin({...before,elapsed:1,streak:99},[questions[0]]);
    const a=Stars.award(slow.collection,slow.roundId,questions[0].id,'practice');
    const b=Stars.award(fast.collection,fast.roundId,questions[0].id,'practice');
    assert.deepEqual(a,b);
    assert.equal(a.milestones.length,1);assert.equal(a.milestones[0].id,milestone.id);
    assert.equal(Stars.view(reload(a.collection)).milestones.find(row=>row.id===milestone.id).earned,true);
    assert.equal(Stars.award(a.collection,slow.roundId,questions[0].id,'practice').milestones.length,0);
  }
  const zero=Stars.view(Stars.sanitize());
  assert.equal(zero.next.remaining,5);assert.equal(zero.next.progress,0);assert.equal(zero.next.goal,5);
  const six=Stars.view({version:1,total:6,serial:0,active:null});
  assert.equal(six.completed,1);assert.equal(six.next.remaining,9);assert.equal(six.next.progress,1);assert.equal(six.next.goal,10);
  const done=Stars.view({version:1,total:150,serial:0,active:null});
  assert.equal(done.next,null);assert.equal(done.completed,6);assert.equal(done.total,150);
});

test('model operations do not mutate their callers or expose mutable milestone definitions',()=>{
  const collection=Stars.sanitize();
  const snapshot=JSON.stringify(collection);
  const started=Stars.begin(collection,questions);
  assert.equal(JSON.stringify(collection),snapshot);
  const original=JSON.stringify(started.collection);
  const earned=Stars.award(started.collection,started.roundId,'sv-0001','answer');
  assert.equal(JSON.stringify(started.collection),original);
  const display=Stars.view(earned.collection);display.milestones[0].title='Changed';
  assert.notEqual(Stars.view(earned.collection).milestones[0].title,'Changed');
});
