'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../public/js/adventure-challenge');
const J=require('../public/js/next-adventure');
const B=require('../public/js/practice-balance');
const E=require('../public/js/engine');
const NOW=1780000000000,DAY=C.DAY,random=()=>.37;
const id=n=>'sv-'+String(n).padStart(4,'0');
const row=(mode,n,reason='extend',demand=2,extra={})=>({key:mode+':'+n,mode,reason,words:[id(n)],cost:1,
  payload:{id:id(n)},dueAt:NOW,challenge:{demand,stable:false,concrete:false,short:false},...extra});
const event=(mode,outcome,demand=2,at=NOW)=>({mode,outcome,demand,at});
const supported=[event('recall','supported')];
const direct=[event('focus','direct'),event('aha','direct'),event('concept','direct')];
const past=Array(20).fill('develop');
function plan(rows,raw,options={}){
  const continuing=!!options.used?.length;
  return J.select(rows,{random,...options,
    chooseNext:(pool,selected)=>C.pick(pool,selected,{raw,now:NOW,continuing,
      balancePick:(available,steps)=>B.pick(available,past,steps,{continuing}),category:B.kind})});
}
test('pacing uses actual completed task outcomes without treating previews or creative reflection as mastery',()=>{
  assert.equal(C.outcome('focus',{answers:['right','right']}),'direct');
  assert.equal(C.outcome('focus',{answers:['right','wrong']}),'supported');
  assert.equal(C.outcome('focus',{answers:[]}),'neutral');
  assert.equal(C.outcome('recall',{matched:true,stage:2,helped:false,previewed:false}),'direct');
  assert.equal(C.outcome('recall',{matched:true,stage:2,helped:true}),'supported');
  assert.equal(C.outcome('recall',{matched:true,stage:0,helped:true,misses:0}),'neutral');
  assert.equal(C.outcome('recall',{matched:true,stage:0,helped:true,misses:1}),'supported');
  assert.equal(C.outcome('recall',{matched:false,stage:0,helped:true}),'supported');
  assert.equal(C.outcome('recall',{matched:true,stage:2,previewed:true}),'neutral');
  assert.equal(C.outcome('detector',{word:'right',clue:'right'}),'direct');
  assert.equal(C.outcome('detector',{word:'right',clue:'supported'}),'supported');
  assert.equal(C.outcome('detector',{word:'previewed',clue:'right'}),'neutral');
  assert.equal(C.outcome('aha',{outcome:'first'}),'direct');
  assert.equal(C.outcome('aha',{outcome:'retry'}),'supported');
  assert.equal(C.outcome('concept',{outcome:'previewed'}),'neutral');
  assert.equal(C.outcome('bridge',{outcome:'supported'}),'supported');
  assert.equal(C.outcome('workshop',{outcome:'direct'}),'neutral');
});
test('bounded recent pacing expires, rejects invalid or future observations and retains no words or answers',()=>{
  const invalid={mode:'foo',outcome:'direct',demand:1,at:NOW};
  const raw=Array(20).fill({...event('focus','direct'),typed:'secret'}).concat(invalid,event('aha','supported',2,NOW+1));
  const clean=C.sanitize(raw);
  assert.equal(clean.length,7);
  assert.equal(JSON.stringify(clean).includes('secret'),false);
  assert.deepEqual(E.sanitizeHistory({adventureChallenge:raw}).adventureChallenge,clean);
  assert.deepEqual(E.sanitizeHistory(null).adventureChallenge,[]);
  assert.equal(C.recent(clean,NOW).length,6);
  assert.equal(C.recent(clean,NOW+C.FRESH+2).length,0);
  assert.equal(C.pace(clean,NOW+C.FRESH+2),'steady');
  const p=C.record([],row('focus',1),'direct',NOW);
  assert.equal(p.length,1);
  assert.equal(C.record(p,row('focus',1),'direct',NOW-1),p);
  assert.equal(C.record(p,row('focus',1),'skip',NOW),p);
  assert.equal(C.record(p,{mode:'focus'},'direct',NOW),p);
  let many=p;
  for(let i=1;i<=12;i++)many=C.record(many,row('aha',2),'supported',NOW+i);
  assert.equal(many.length,C.WINDOW);
});
test('a recent struggle or two demanding stations triggers a calmer pacing preference',()=>{
  assert.equal(C.pace([],NOW),'steady');
  assert.equal(C.pace(supported,NOW),'gentle');
  assert.equal(C.pace([...supported,event('workshop','neutral',2)],NOW),'steady');
  assert.equal(C.pace([event('recall','direct',3),event('detector','direct',3)],NOW),'gentle');
  assert.equal(C.pace([event('recall','direct',3)],NOW,[row('detector',2,'extend',3)]),'gentle');
  assert.equal(C.pace(direct,NOW),'stretch');
  assert.equal(C.pace(direct.map(x=>({...x,mode:'focus'})),NOW),'steady');
  assert.equal(C.pace([...direct,event('recall','direct',3)],NOW),'steady');
  assert.equal(C.pace([...direct,event('aha','supported')],NOW),'gentle');
});
test('demand reflects the actual exercise form; higher levels require their own evidence',()=>{
  const byId=new Map([[id(1),{id:id(1),kind:'word',difficulty:'easy'}],[id(2),{id:id(2),kind:'word',difficulty:'hard'}]]);
  const tag=(mode,payload,history={},contrastLevel=()=>1)=>C.tag(row(mode,1,'extend',2,{payload}),{byId,history,contrastLevel}).challenge;
  assert.deepEqual(tag('focus',{id:id(1),skill:'picture'}),{demand:1,concrete:true,stable:false,short:true});
  assert.equal(tag('focus',{id:id(2),skill:'meaning'}).demand,3);
  assert.equal(tag('focus',{id:id(1),skill:'contrast'}, {},()=>1).demand,2);
  assert.equal(tag('focus',{id:id(1),skill:'contrast'}, {},()=>2).stable,true);
  assert.equal(tag('focus',{id:id(1),skill:'context'}).stable,false);
  assert.equal(tag('focus',{id:id(1),skill:'context'},{readingProgress:{[id(1)]:{transfer:{memory:{step:1,outcome:'direct'}}}}}).stable,true);
  assert.equal(tag('recall',{id:id(1),stage:0}).demand,1);
  assert.equal(tag('recall',{id:id(1),stage:1,cloze:'… här'}).demand,2);
  assert.equal(tag('recall',{id:id(1),stage:2}).stable,false);
  assert.equal(tag('recall',{id:id(1),stage:2,card:{memory:{step:1,outcome:'direct'}}}).stable,true);
  assert.equal(tag('recall',{id:id(1),stage:2,card:{memory:{step:0,outcome:'direct'}}}).stable,false);
  assert.equal(tag('detector',{id:'js-01-1',pairId:'js-01',level:3}).stable,false);
  assert.equal(tag('detector',{id:'ld-01-2-01',pairId:'js-01',level:2},{detectorLevels:{'js-01':{level:2}}}).stable,true);
  assert.equal(tag('bridge',{kind:'order'}).demand,3);
  assert.equal(tag('bridge',{kind:'order'}).stable,false);
  assert.equal(tag('workshop',{}).demand,2);
});
test('a supported station makes the next feasible practice gentler without displacing the first core goal',()=>{
  const hard=row('aha',1,'need',3),gentle=row('focus',2,'extend',1),needGentle=row('focus',3,'need',1);
  assert.equal(plan([hard,gentle],supported).steps[0],hard);
  assert.equal(plan([hard,needGentle],supported).steps[0],needGentle);
  assert.equal(plan([hard,gentle],supported,{used:[row('bridge',8)],limit:1}).steps[0],gentle);
  assert.equal(plan([hard],supported,{used:[row('bridge',8)],limit:1}).steps[0],hard);
  assert.match(C.note(gentle,supported,NOW),/lugnare/);
  assert.equal(C.note(hard,supported,NOW),'');
});
test('protected pedagogical followups retain priority over gentle or stretch pacing',()=>{
  const urgent=row('recall',1,'review',3,{feedbackPriority:2});
  const optional=row('focus',2,'extend',1);
  const alternative=row('workshop',3,'need',2,{feedbackPriority:1});
  const p=plan([urgent,optional,alternative],supported);
  assert.equal(p.steps[0],urgent);
  assert.equal(p.steps[1],alternative);
});
test('several direct stations prefer a real already-unlocked challenge, never an unsupported promotion',()=>{
  const easy=row('focus',1,'review',1),advanced=row('recall',2,'review',3,{
    challenge:{demand:3,stable:true,concrete:false,short:false}});
  const unearned=row('detector',3,'review',3);
  assert.equal(plan([easy,advanced,unearned],direct).steps[0],advanced);
  assert.equal(plan([easy,unearned],direct).steps[0],easy);
  assert.equal(plan([easy,advanced],direct.slice(0,2)).steps[0],easy);
  assert.match(C.note(advanced,direct,NOW),/kluring/);
  assert.equal(C.note(unearned,direct,NOW),'');
});
test('new targets favor concrete tasks within the same available discovery category',()=>{
  const harder=row('concept',1,'discover',3,{newWord:true});
  const concrete=row('focus',2,'discover',1,{newWord:true,challenge:{demand:1,stable:false,concrete:true,short:true}});
  assert.equal(plan([harder,concrete],[]).steps[0],concrete);
  assert.equal(plan([harder],[]).steps[0],harder);
});
test('replan consumes no more than the unused station count and original budget, including skipped exposures',()=>{
  const first=row('focus',1,'need',2,{cost:3}),second=row('recall',2,'review',3),third=row('detector',3,'extend',2);
  const initial=J.start([first,second,third]);
  const after=J.advance(initial,'completed','focus');
  assert.deepEqual(J.continuation(after),{used:[first],limit:2,budget:5});
  const next=row('concept',4,'extend',1);
  const p=J.replan(after,[next,third]);
  assert.equal(p.steps[0],first);
  assert.equal(p.steps[1],next);
  assert.equal(p.index,1);
  assert.deepEqual(p.completed,['focus']);
  assert.equal(J.replan(after,[row('aha',1,'review')]),after);
  assert.equal(J.replan(after,[row('focus',9)]),after);
  assert.equal(J.replan(after,[row('aha',9,'review',2,{cost:6})]),after);
  assert.equal(J.replan(after,[null]),after);
  assert.equal(J.replan(after,[{...next,words:[id(4),id(4)]}]),after);
  assert.equal(J.replan(after,[next,third,row('workshop',5)]),after);
  const skipped=J.advance(p,'skipped','concept'),tail=J.continuation(skipped);
  assert.deepEqual(tail.used,[first,next]);
  assert.equal(tail.limit,1);
  const q=J.replan(skipped,[]);
  assert.equal(q.finished,true);
  assert.deepEqual(q.skipped,['concept']);
  assert.deepEqual(q.steps,[first,next]);
  assert.equal(initial.index,0);
});
test('actual continuation candidate generation excludes consumed targets and modes before feedback adjustment',()=>{
  const words=[1,2,3,4].map(n=>({id:id(n),kind:'word',difficulty:'easy',name:id(n),definition:'Betydelse',example:'Exempel.'}));
  const prior=row('focus',1,'need',2,{cost:3});
  const history={};
  const opts={catalog:words,history,knownIds:new Set([id(2),id(3)]),focusTypes:()=>['meaning'],pairFor:()=>null,
    recall:{ready:[{id:id(1),dueAt:NOW},{id:id(2),dueAt:NOW}]},aha:{ready:[{id:id(3),dueAt:NOW+DAY}]},
    conceptContent:{groups:[],tasks:[]},now:NOW,random,used:[prior],limit:2,budget:5,
    adjust:rows=>{assert.ok(rows.every(r=>r.mode!=='focus'&&!r.words.includes(id(1))));return rows;}};
  const p=J.build(opts);
  assert.ok(p.steps.length>0);
  assert.ok(p.steps.every(r=>r.mode!=='focus'&&!r.words.includes(id(1))&&r.mode!=='aha'));
  assert.ok(p.maxTasks<=5);
});
test('same-round replanning responds to actual support, not merely an initial fixed selection',()=>{
  const first=row('aha',1,'need',2),hard=row('recall',2,'review',3),easy=row('focus',3,'extend',1),last=row('concept',4,'extend',2);
  const initial=J.start([first,hard,last]);
  const after=J.advance(initial,'completed','aha');
  const observed=C.record([],first,'supported',NOW);
  const planned=plan([hard,easy,last],observed,J.continuation(after));
  assert.equal(planned.steps[0],easy);
  const next=J.replan(after,planned.steps);
  assert.equal(next.steps[1],easy);
  assert.equal(next.steps[0],first);
  assert.equal(next.steps.length,3);
  assert.equal(next.completed.length,1);
});
