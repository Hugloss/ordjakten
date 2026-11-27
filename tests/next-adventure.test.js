'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const J=require('../public/js/next-adventure');
const NOW=1780000000000,DAY=J.DAY,random=()=>.37;
const a='sv-0001',b='sv-0002',c='sv-0003',d='sv-0004',e='sv-0005';
const row=(mode,key,words,reason='need',cost=1,dueAt=NOW)=>({mode,key,words,reason,cost,dueAt,payload:{id:key}});
const item=(id,difficulty='medium')=>({id,kind:'word',name:id,definition:'Betydelse',example:'Exempel.',difficulty});
const base={catalog:[item(a),item(b,'easy'),item(c)],history:{},knownIds:new Set(),now:NOW,random,
  focusTypes:()=>['meaning','reverse'],pairFor:()=>null,conceptContent:{groups:[],tasks:[]}};
const weak={right:0,wrong:1,streak:0,attempts:1,lastAt:NOW-DAY};
test('fresh history starts with an available easy word and never invents hard content',()=>{
  const plan=J.build(base);
  assert.equal(plan.steps.length,1);
  assert.equal(plan.steps[0].mode,'focus');
  assert.equal(plan.steps[0].payload.id,b);
  assert.equal(plan.steps[0].reason,'discover');
  assert.equal(J.build({...base,catalog:[item(a,'expert')]}).steps.length,0);
});
test('support precedes exploration; no repeated methods, overlapping planned concepts or budget overflow',()=>{
  const rows=[row('focus','new',[d],'discover',3),row('recall','assist',[a],'need',1,NOW-DAY),
    row('aha','same',[a]),row('bridge','due',[b,c],'review'),row('bridge','second',[e]),
    row('concept','overlap',[e,b],'extend'),row('workshop','optional',[d],'extend',3)];
  assert.deepEqual(J.select(rows,{random}).steps.map(s=>s.key),['assist','second','optional']);
  assert.equal(J.select([row('focus','one',[a],'need',4),row('workshop','two',[b],'review',3),
    row('bridge','three',[c],'extend',2)],{random}).maxTasks,7);
  assert.equal(J.select([row('focus','f',[a],'need',4),row('aha','a',[a]),row('recall','r',[a])],{random}).steps.length,1);
  assert.equal(J.select(rows,{random,limit:0}).steps.length,0);
});
test('ordinary review cards and pair retention respect their waiting periods',()=>{
  const opts={...base,catalog:[item(a)],history:{skillProgress:{[a]:{skills:{meaning:weak}}},
    reviewProgress:{[a]:{streak:1,dueAt:NOW+1,lastVariant:'meaning'}}}};
  assert.equal(J.build(opts).steps.length,0);
  assert.equal(J.build({...opts,now:NOW+1}).steps[0].payload.skill,'meaning');
  const pair={id:'js-01',left:a,right:b};
  const contrast={...base,catalog:[item(a),item(b)],focusTypes:()=>['contrast'],pairFor:()=>pair,
    history:{skillProgress:{[a]:{skills:{contrast:weak}}},retentionProgress:{[pair.id]:{stage:1,dueAt:NOW+1}}}};
  assert.equal(J.build(contrast).steps.length,0);
  const revisit=J.build({...contrast,now:NOW+1});
  assert.equal(revisit.steps[0].payload.skill,'contrast');
  assert.deepEqual(revisit.steps[0].words,[a,b]);
  assert.equal(revisit.steps[0].cost,4);
});
test('meaning Aha support can lead to meaning practice after rest, not fabricated transfer evidence',()=>{
  const opts={...base,catalog:[item(a)],history:{readingProgress:{[a]:{recognition:{supported:1,streak:0,lastAt:NOW-DAY}}}}};
  assert.equal(J.build({...opts,now:NOW-1}).steps.length,0);
  assert.equal(J.build(opts).steps[0].payload.skill,'meaning');
  assert.equal(J.build(opts).steps[0].reason,'need');
});
test('only ready Aha and recall rows are selected; future and waiting rows cannot substitute',()=>{
  const opts={...base,focusTypes:()=>[],aha:{ready:[{id:a,dueAt:NOW-DAY}],waiting:[{id:c,dueAt:NOW+1}]},
    recall:{ready:[{id:b,dueAt:NOW,card:{last:'assisted'}}],waiting:[{id:c,dueAt:NOW+1}]}};
  assert.deepEqual(J.build(opts).steps.map(s=>s.mode),['aha','recall']);
  assert.equal(J.build({...opts,aha:{ready:[{id:a,dueAt:NOW+1}]},recall:{ready:[]}}).steps.length,0);
});
test('creative workshop is optional, not manufactured remediation; rotation cannot outrank need',()=>{
  const opts={...base,catalog:[item(a)],focusTypes:()=>[],knownIds:new Set([a])};
  assert.equal(J.build(opts).steps[0].mode,'workshop');
  assert.equal(J.build(opts).steps[0].reason,'extend');
  assert.equal(J.build({...opts,workshopSeen:new Set([a])}).steps.length,0);
  const rows=[row('focus','a',[a]),row('recall','b',[b]),row('bridge','c',[c],'extend')];
  assert.equal(J.select(rows,{usage:{focus:NOW},random}).steps[0].mode,'recall');
  assert.equal(J.select(rows,{usage:{focus:NOW,recall:NOW+1},random}).steps[0].mode,'focus');
});
test('detector proof and relation tasks preserve distinct authored participant sets',()=>{
  const det={id:'ld-1',pairId:'js-01',level:2,target:b,context:'hem',words:[{id:a},{id:b}]};
  const prior={id:'ld-0',pairId:'js-01',level:2,target:a,context:'skola',stamp:'proof'};
  const group={id:'bk-01',words:[{id:c},{id:d}]};
  const concept={id:'bk-01-1',groupId:group.id,options:[{id:c},{id:d},{id:e}]};
  const bridge={id:'ob-01',groupId:group.id,participants:[c,d],cards:[c,d]};
  const opts={...base,catalog:[a,b,c,d,e].map(id=>item(id)),focusTypes:()=>[],
    detector:{available:[det],catalog:[det,prior]},concept:{available:[concept]},bridge:{available:[bridge]},
    conceptContent:{groups:[group],tasks:[concept]},
    history:{detectorLevels:{'js-01':{proof:{id:prior.id,stamp:prior.stamp,at:NOW-DAY}}}}};
  const plan=J.build(opts);
  assert.equal(plan.steps[0].mode,'detector');
  assert.equal(plan.steps[0].reason,'review');
  assert.deepEqual(plan.steps[0].words,[a,b]);
  assert.equal(plan.steps.length,2);
  assert.deepEqual(J.build({...opts,detector:null,bridge:null}).steps[0].words,[c,d,e]);
  assert.deepEqual(J.build({...opts,detector:null,concept:null}).steps[0].words,[c,d]);
});
test('state is immutable; skips and stale done events never become completions',()=>{
  const steps=[row('focus','a',[a]),row('recall','b',[b]),row('bridge','c',[c])];
  const initial=J.start(steps);
  assert.equal(initial.index,0);
  assert.equal(J.advance(initial,'completed','recall'),initial);
  const next=J.advance(initial,'completed','focus');
  assert.deepEqual(next.completed,['focus']);
  assert.equal(initial.completed.length,0);
  assert.equal(J.advance(next,'completed','focus'),next);
  const third=J.advance(next,'skipped','recall');
  assert.deepEqual(third.skipped,['recall']);
  const end=J.advance(third,'completed','bridge');
  assert.equal(end.finished,true);
  assert.deepEqual(end.completed,['focus','bridge']);
  assert.equal(J.advance(end,'completed','bridge'),end);
  assert.equal(J.start([]),null);
  assert.equal(J.start(steps.concat(steps)),null);
});
