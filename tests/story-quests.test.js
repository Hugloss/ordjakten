'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const S=require('../public/js/story-quests');
const A=require('../public/js/adventures');
const E=require('../public/js/engine');
const J=require('../public/js/next-adventure');
const complete={finished:true,completed:['focus'],skipped:['aha']};
const row=(mode,reason='extend',n=1,extra={})=>({key:mode+':'+n,mode,reason,cost:1,words:['sv-'+String(n).padStart(4,'0')],...extra});
test('every existing world has four authored, resolved chapters and distinct keepsakes',()=>{
  assert.deepEqual(Object.keys(S.DATA),A.WORLD_IDS);
  const all=[];
  for(const id of A.WORLD_IDS){
    const m=S.model({},id);
    assert.equal(m.chapters.length,4);
    assert.equal(m.count,0);
    assert.equal(m.chapter.index,0);
    assert.equal(m.complete,false);
    for(const chapter of m.chapters){
      assert.ok(chapter.title&&chapter.intro&&chapter.ending&&chapter.emoji&&chapter.keepsake);
      all.push(chapter.keepsake);
    }
  }
  assert.equal(all.length,48);
  assert.equal(new Set(all).size,48);
});
test('first completion advances exactly one chapter, even with help, no score or requirement of all correct',()=>{
  const before={},chapter=S.model(before,'forest').chapter;
  const result=S.finish(before,chapter,complete);
  assert.deepEqual(result.progress,{forest:1});
  assert.deepEqual(before,{});
  assert.equal(result.earned.keepsake,'Stiglövet');
  assert.equal(S.model(result.progress,'forest').chapter.index,1);
  assert.equal(S.finish(result.progress,chapter,complete).earned,null);
});
test('unfinished, all-skipped and forged future chapters never earn keepsakes',()=>{
  const raw={},chapter=S.model(raw,'forest').chapter;
  for(const journey of [null,{finished:false,completed:['focus']},{finished:true,completed:[]}]){
    assert.equal(S.finish(raw,chapter,journey).progress,raw);
  }
  assert.equal(S.finish(raw,{...chapter,index:2},complete).earned,null);
  assert.equal(S.finish(raw,{...chapter,id:'fake'},complete).earned,null);
});
test('four chapters end the story, replay is optional and no more reward is promised',()=>{
  let p={};
  for(let i=0;i<4;i++){
    const m=S.model(p,'space'),r=S.finish(p,m.chapter,complete);
    assert.equal(r.earned.index,i);
    p=r.progress;
  }
  const m=S.model(p,'space');
  assert.equal(m.complete,true);
  assert.equal(m.chapter.index,4);
  assert.equal(m.collected,4);
  assert.equal(S.finish(p,m.chapter,complete).earned,null);
  assert.equal(S.model(p,'forest').count,0);
  assert.equal(S.model(p,'forest').collected,4);
});
test('local history retains only bounded world counts and has no time expiry',()=>{
  const raw={forest:999,space:1,music:-1,pirate:1.5,unknown:7,typed:'private'};
  const clean=S.sanitize(raw);
  assert.deepEqual(clean,{forest:4,space:1});
  assert.deepEqual(E.sanitizeHistory({storyProgress:raw}).storyProgress,clean);
  assert.deepEqual(E.sanitizeHistory(null).storyProgress,{});
  assert.deepEqual(S.sanitize(null),{});
  assert.equal(S.model(clean,'unknown').id,'forest');
});
test('opening choices are genuine distinct feasible modes, not synthetic or fixed to an answer',()=>{
  const focus=row('focus','discover',1),det=row('detector','extend',2),bridge=row('bridge','extend',3);
  assert.deepEqual(S.openings([focus,det,bridge],focus),[focus,det]);
  assert.equal(S.prefer([focus,bridge,det],focus,'detector'),det);
  assert.equal(S.prefer([focus],focus,'bridge'),focus);
  assert.deepEqual(S.openings([],focus),[]);
});
test('important followups and core ready practice cannot be displaced by a story choice',()=>{
  const a=row('aha','review',1,{feedbackPriority:2}),b=row('workshop','extend',2),c=row('focus','need',3);
  assert.deepEqual(S.openings([a,b,c],a),[a]);
  assert.equal(S.prefer([a,b,c],a,'workshop'),a);
  const review=row('recall','review',4);
  assert.deepEqual(S.openings([b,c,review],c),[c,review]);
  assert.equal(S.prefer([b,c,review],c,'workshop'),c);
  assert.equal(S.prefer([b,c,review],c,'recall'),review);
});
test('actual coordinator enforces budget and nonoverlapping modes even with child preference',()=>{
  const a=row('focus','discover',1,{cost:3}),b=row('detector','extend',2),c=row('bridge','extend',2);
  const chosen=J.select([a,b,c],{random:()=>.37,chooseNext:(rows,steps)=>steps.length?rows[0]:S.prefer(rows,rows[0],'bridge')});
  assert.equal(chosen.steps[0].mode,'bridge');
  assert.ok(!chosen.steps.some(x=>x.mode==='detector'));
  assert.ok(chosen.maxTasks<=8);
  assert.equal(S.finish({},S.model({},'forest').chapter,J.start(chosen.steps)).earned,null);
});
