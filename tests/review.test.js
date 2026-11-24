'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const E=require('../public/js/engine');
const R=require('../public/js/review');
const J=require('../public/js/quests');
const base=path.resolve(__dirname,'../public');
const bank=JSON.parse(fs.readFileSync(path.join(base,'data/ordbank.json'),'utf8'));
const expressions=JSON.parse(fs.readFileSync(path.join(base,'data/expressions.json'),'utf8'));
const missions=JSON.parse(fs.readFileSync(path.join(base,'data/missions.json'),'utf8'));
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(base,'data/curation.js'),'utf8'),ctx);
const curation=ctx.window.ORDJAKTEN_CURATION;
const NOW=1800000000000;

const question={id:'sv-0044',word:'Grumlig',picture:false,kind:'word',taskType:'meaning'};
test('legacy mistakes move into review queue without touching saved test results',()=>{
  const old=E.sanitizeHistory({mistakes:{'sv-0044':2,'ut-0001':1},results:[{finishedAt:NOW-10000,mode:'test',level:'medium',right:3,wrong:2,total:5}]});
  const migrated=R.sanitize(old.reviewProgress,old.mistakes,NOW);
  assert.deepEqual(Object.keys(migrated).sort(),['sv-0044','ut-0001']);
  assert.equal(migrated['sv-0044'].dueAt,NOW);
  assert.equal(old.results[0].right,3);
  assert.equal(old.mistakes['sv-0044'],2);
  const saved=E.sanitizeHistory({...old,reviewProgress:migrated});
  assert.deepEqual(R.sanitize(saved.reviewProgress,saved.mistakes,NOW),migrated);
});
test('one wrong answer schedules review, correct recalls progressively delay, then mastery',()=>{
  let cards=R.sanitize(null);
  cards=R.record(cards,question,'wrong',NOW);
  assert.deepEqual(R.summary(cards,NOW),{due:1,waiting:0,mastered:0,nextDue:null});
  cards=R.record(cards,{...question,taskType:'reverse'},'right',NOW);
  assert.equal(cards['sv-0044'].streak,1);
  assert.equal(cards['sv-0044'].dueAt,NOW+60*60*1000);
  assert.deepEqual(R.summary(cards,NOW),{due:0,waiting:1,mastered:0,nextDue:NOW+60*60*1000});
  const early=R.record(cards,question,'right',NOW+1000);
  assert.equal(early['sv-0044'].streak,1);
  assert.equal(early['sv-0044'].dueAt,NOW+60*60*1000);
  cards=R.record(cards,question,'right',NOW+60*60*1000);
  assert.equal(cards['sv-0044'].streak,2);
  assert.equal(cards['sv-0044'].dueAt,NOW+60*60*1000+24*60*60*1000);
  cards=R.record(cards,question,'right',cards['sv-0044'].dueAt);
  assert.equal(cards['sv-0044'].streak,3);
  assert.deepEqual(R.summary(cards,NOW+99*24*60*60*1000),{due:0,waiting:0,mastered:1,nextDue:null});
  cards=R.record(cards,question,'wrong',NOW+99*24*60*60*1000);
  assert.equal(cards['sv-0044'].streak,0);
  assert.equal(R.summary(cards,NOW+99*24*60*60*1000).due,1);
});
test('unanswered questions never add a review, and correct normal answers do not add errors',()=>{
  const cards=R.sanitize(null);
  assert.equal(R.record(cards,question,'unanswered',NOW),cards);
  assert.equal(R.record(cards,question,'right',NOW),cards);
  assert.deepEqual(R.summary(cards,NOW),{due:0,waiting:0,mastered:0,nextDue:null});
});
test('malformed persistent queue is bounded and cannot import arbitrary keys or invalid timestamps',()=>{
  const malformed={'sv-0001':{streak:400,dueAt:-5,lastVariant:'script',attempts:-99},'evil':{streak:0,dueAt:1},
    'ut-0002':{streak:1,dueAt:Infinity,lastVariant:'sentence',attempts:1},'sv-0003':null};
  const cards=R.sanitize(malformed,{'sv-0004':4,'something':2},NOW);
  assert.equal(cards['sv-0001'].streak,3);
  assert.equal(cards['sv-0001'].dueAt,0);
  assert.equal(cards['sv-0001'].lastVariant,'meaning');
  assert.equal(cards['ut-0002'].dueAt,NOW);
  assert.equal(cards['sv-0004'].dueAt,NOW);
  assert.equal(Object.hasOwn(cards,'evil'),false);
});
test('all 121 words can reverse a question with exactly one correct, no pictures',()=>{
  const levels=['easy','medium','hard','exam'];
  const covered=new Set();
  for(const level of levels){
    for(const entry of E.getPool(bank,curation,level)){
      const q=E.makeReverseQuestion(entry,bank,curation,level,()=>.41);
      assert.equal(q.stem,curation.reviewClues?.[entry.id]||entry.definition);
      assert.ok(!q.stem.toLocaleLowerCase('sv-SE').includes(entry.word.toLocaleLowerCase('sv-SE')),`Answer leaked in reverse stem: ${entry.id}`);
      assert.equal(q.options.filter(option=>option.correct).length,1);
      assert.equal(q.options.find(option=>option.correct).label,entry.word);
      assert.equal(q.options.length,level==='exam'?5:4);
      assert.equal(new Set(q.options.map(option=>option.label)).size,q.options.length);
      assert.equal(q.picture,false);
      covered.add(entry.id);
    }
  }
  assert.equal(covered.size,121);
});
test('review reverses word questions; next review switches back to meaning/picture',()=>{
  const entry=E.getPool(bank,curation,'medium').find(x=>x.id==='sv-0044');
  const cards=R.sanitize({'sv-0044':{streak:0,dueAt:NOW,lastVariant:'meaning',attempts:1}}, {}, NOW);
  const settings={topic:'words',difficulty:'medium',count:5,reviewOnly:true,mode:'train'};
  let round=E.generateRound(bank,curation,settings,{},()=>.42,expressions,missions,cards,NOW);
  assert.equal(round.length,1);
  assert.equal(round[0].id,entry.id);
  assert.equal(round[0].taskType,'reverse');
  const repeat=R.record(cards,round[0],'wrong',NOW);
  round=E.generateRound(bank,curation,settings,{},()=>.41,expressions,missions,repeat,NOW);
  assert.equal(round[0].taskType,undefined);
});
test('review expressions cycle through other authored tasks; exam stays five choices',()=>{
  const id='ut-0001';
  let cards=R.sanitize({[id]:{streak:0,dueAt:NOW,lastVariant:'meaning',attempts:1}}, {}, NOW);
  const settings={topic:'expressions',difficulty:'medium',count:10,reviewOnly:true,mode:'train',expressionTask:'meaning'};
  const seen=[];
  for(let i=0;i<3;i++){
    const [q]=E.generateRound(bank,curation,settings,{},()=>.42,expressions,missions,cards,NOW);
    seen.push(q.taskType);
    if(q.taskType==='sentence')assert.equal(q.options.filter(x=>x.correct).length,1);
    if(q.taskType==='order')assert.equal(q.steps.length,3);
    cards=R.record(cards,q,'wrong',NOW);
  }
  assert.deepEqual(seen,['sentence','order','meaning']);
  const exam=E.generateRound(bank,curation,{...settings,difficulty:'exam',mode:'test'}, {},()=>.4,expressions,missions,cards,NOW);
  assert.equal(exam[0].taskType,'meaning');
  assert.equal(exam[0].options.length,5);
});
test('review round only selects ready cards and does not duplicate a target',()=>{
  const settings={topic:'mixed',difficulty:'medium',count:25,reviewOnly:true,mode:'train'};
  const cards=R.sanitize({
    'sv-0044':{streak:0,dueAt:NOW,lastVariant:'meaning',attempts:1},
    'ut-0001':{streak:1,dueAt:NOW,lastVariant:'sentence',attempts:2},
    'ut-0002':{streak:1,dueAt:NOW+100000,lastVariant:'order',attempts:2},
    'sv-0001':{streak:3,dueAt:0,lastVariant:'reverse',attempts:3}
  },{},NOW);
  const round=E.generateRound(bank,curation,settings,{},()=>.6,expressions,missions,cards,NOW);
  assert.equal(round.length,2);
  assert.deepEqual(new Set(round.map(q=>q.id)),new Set(['sv-0044','ut-0001']));
  assert.equal(new Set(round.map(q=>q.id)).size,round.length);
  assert.equal(J.makePlan('comeback',settings,{},bank,curation,expressions,E,cards,NOW).available>0,true);
  assert.equal(J.makePlan('comeback',settings,{},bank,curation,expressions,E,{
    'sv-0044':{streak:1,dueAt:NOW+1,lastVariant:'reverse',attempts:1}
  },NOW),null);
});
