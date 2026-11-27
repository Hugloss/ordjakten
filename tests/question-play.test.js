'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const P=require('../public/js/question-play');
const q={kind:'word',options:[{label:'a'},{label:'b'}]};
const settings={mode:'train',difficulty:'easy',timerMode:'off',adventure:'forest'};
test('all twelve worlds have a named illustrated portal without modifying the question',()=>{
  const before=JSON.stringify(q);
  assert.equal(Object.keys(P.WORLDS).length,12);
  for(const adventure of Object.keys(P.WORLDS)){
    const model=P.plan({...settings,adventure},q);
    assert.equal(model.enabled,true);assert.equal(model.egg,true);
    assert.ok(['forest','space','ocean','castle'].includes(model.world.scene));
    assert.ok(model.world.name&&model.world.target);
  }
  assert.equal(JSON.stringify(q),before);
});
test('untimed test mode permits neutral movement but never reveals an egg hint',()=>{
  const model=P.plan({...settings,mode:'test'},q);
  assert.equal(model.enabled,true);assert.equal(model.egg,false);
  for(const mode of ['train','test']){
    for(const timerMode of ['per','total'])assert.equal(P.plan({...settings,mode,timerMode},q).enabled,false);
    assert.equal(P.plan({...settings,mode,difficulty:'exam'},q).enabled,false);
  }
  assert.equal(P.plan(settings,{...q,taskType:'order'}).enabled,false);
  assert.equal(P.plan(settings,null).enabled,false);
});
test('strategy clues do not depend on the keyed answer, definition, stem or options',()=>{
  const a={kind:'word',picture:true,options:[{label:'a',correct:true},{label:'b',correct:false}],definition:'SECRET',stem:'SECRET'};
  const b={...a,options:[{label:'b',correct:true},{label:'a',correct:false}],definition:'OTHER',stem:'OTHER'};
  assert.equal(P.plan(settings,a).hint,P.plan(settings,b).hint);
  assert.ok(!P.plan(settings,a).hint.includes('SECRET'));
  assert.notEqual(P.plan(settings,a).hint,P.plan(settings,{...q,taskType:'context'}).hint);
});
test('movement and hit-testing require a genuine drag and a nonzero visible target',()=>{
  const rect={left:100,right:200,top:100,bottom:200,width:100,height:100};
  assert.equal(P.moved(0,0,3,4),false);assert.equal(P.moved(0,0,8,0),true);
  assert.equal(P.inside(rect,100,100),true);assert.equal(P.inside(rect,201,150),false);
  assert.equal(P.inside({...rect,width:0},100,100),false);
  assert.equal(P.inside(rect,NaN,100),false);
  const token={},drag={token,index:1,moved:true};
  assert.equal(P.validDrop(drag,token,rect,150,150,2),true);
  assert.equal(P.validDrop(drag,{},rect,150,150,2),false);
  assert.equal(P.validDrop({...drag,moved:false},token,rect,150,150,2),false);
  assert.equal(P.validDrop({...drag,index:2},token,rect,150,150,2),false);
  assert.equal(P.validDrop(drag,token,rect,99,150,2),false);
});

test('every world has a distinct complete four-part mystery and no answer-dependent inputs',()=>{
  const titles=new Set();
  for(const adventure of Object.keys(P.WORLDS)){
    const cfg={...settings,adventure};
    const first=P.mystery(cfg,0,10);
    assert.equal(first.chapters.length,4);
    assert.deepEqual(first.chapters.map(c=>c.id),['map','lock','lantern','chest']);
    assert.ok(first.title&&first.intro&&first.ending);
    assert.ok(first.chapters.every(c=>c.title&&c.sceneText&&c.action&&c.reveal));
    titles.add(first.title);
    const end=P.mystery(cfg,10,10);
    assert.equal(end.completed,4);assert.equal(end.finished,true);
    assert.equal(P.discovery(cfg,10,10).text,end.ending);
  }
  assert.equal(titles.size,12);
});
test('mystery progress covers every finite round, including short repetition rounds',()=>{
  for(let total=1;total<=25;total++){
    const start=P.mystery(settings,0,total),visited=new Set();
    assert.equal(start.chapters.length,Math.min(4,total));
    assert.equal(start.chapters.at(-1).id,'chest');
    for(let done=0;done<total;done++){
      const m=P.mystery(settings,done,total),next=P.mystery(settings,done+1,total);
      visited.add(m.chapter.id);
      assert.equal(m.finished,false);
      assert.ok(m.completed<=next.completed&&next.completed-m.completed<=1);
      const found=P.discovery(settings,done+1,total);
      assert.equal(found.artifact,m.chapter.id);
      assert.equal(found.reached,next.completed>m.completed);
      assert.equal(found.finished,done+1===total);
    }
    assert.equal(visited.size,start.chapters.length);
    assert.equal(P.mystery(settings,total,total).finished,true);
    assert.equal(P.discovery(settings,0,total),null);
  }
});
test('test and training have identical narrative milestones regardless of correctness',()=>{
  for(let done=0;done<=5;done++){
    const train=P.mystery({...settings,score:0,answers:{a:'wrong'}},done,5);
    const test=P.mystery({...settings,mode:'test',score:5,answers:{a:'right'}},done,5);
    assert.deepEqual(train,test);
    assert.deepEqual(P.discovery({...settings,mode:'test'},done,5),P.discovery(settings,done,5));
  }
});
test('timed and exam rounds have no mystery overlay; invalid round sizes fail safely',()=>{
  assert.equal(P.mystery({...settings,timerMode:'total'},0,5),null);
  assert.equal(P.mystery({...settings,timerMode:'per'},0,5),null);
  assert.equal(P.mystery({...settings,difficulty:'exam'},0,5),null);
  for(const n of [0,-1,NaN,2.5,101])assert.equal(P.mystery(settings,0,n),null);
  assert.equal(P.mystery(settings,999,5).done,5);
  assert.equal(P.mystery(settings,-8,5).done,0);
});

test('each chapter advances visually and the discovery matches the next question before a chapter changes',()=>{
  for(const adventure of Object.keys(P.WORLDS))for(let total=1;total<=25;total++){
    const cfg={...settings,adventure};
    for(let done=0;done<total;done++){
      const before=P.mystery(cfg,done,total).visual;
      const found=P.discovery(cfg,done+1,total);
      const after=found.visual;
      assert.equal(after.artifact,before.artifact);
      assert.equal(after.steps,before.steps+1);
      assert.equal(after.total,before.total);
      assert.equal(after.fraction,after.steps/after.total);
      assert.equal(after.complete,found.reached);
      assert.ok(after.fraction>before.fraction&&after.fraction<=1);
      const upcoming=P.mystery(cfg,done+1,total).visual;
      if(!found.reached)assert.deepEqual(upcoming,after);
      else if(!found.finished)assert.equal(upcoming.steps,0);
      else assert.deepEqual(upcoming,after);
    }
  }
});
test('twelve world endings select authored treasure art and four optional hatchlings without answer clues',()=>{
  const eggs=new Set(),treasures=new Set();
  for(const adventure of Object.keys(P.WORLDS)){
    const cfg={...settings,adventure};
    const plan=P.plan(cfg,q);
    eggs.add(plan.hatchling.id);
    assert.ok(plan.hatchling.name);
    const end=P.mystery(cfg,5,5).visual;
    assert.equal(end.artifact,'chest');assert.equal(end.complete,true);
    assert.ok(end.treasure);treasures.add(end.treasure);
    assert.deepEqual(P.mystery({...cfg,mode:'test',score:0},5,5).visual,end);
  }
  assert.equal(eggs.size,4);assert.equal(treasures.size,10);
  assert.equal(P.plan({...settings,mode:'test'},q).egg,false);
});

test('secret picture uncovers exactly one of n pieces on each completed question',()=>{
  for(const adventure of Object.keys(P.WORLDS))for(let total=1;total<=25;total++){
    const cfg={...settings,adventure};
    let last=new Set();
    for(let done=0;done<=total;done++){
      const model=P.mystery(cfg,done,total).picture;
      assert.equal(model.cells.length,total);
      const visible=new Set(model.cells.filter(c=>c.revealed).map(c=>c.id));
      assert.equal(visible.size,done);
      assert.ok([...last].every(id=>visible.has(id)));
      assert.equal(model.finished,done===total);
      assert.ok(model.cells.every(c=>c.x>=0&&c.y>=0&&c.width>0&&c.height>0&&c.x+c.width<=300.00001&&c.y+c.height<=210.00001));
      assert.ok(Math.abs(model.cells.reduce((sum,c)=>sum+c.width*c.height,0)-63000)<.0001);
      if(done)assert.deepEqual(P.discovery(cfg,done,total).picture,model);
      last=visible;
    }
  }
});
test('picture is bounded, deterministic and independent of question scores',()=>{
  assert.equal(P.picture(settings,0,0),null);
  assert.equal(P.picture(settings,0,101),null);
  assert.equal(P.picture(settings,999,5).done,5);
  assert.equal(P.picture(settings,-2,5).done,0);
  for(let done=0;done<=25;done++){
    const a=P.picture({...settings,score:0},done,25);
    const b=P.picture({...settings,mode:'test',score:25},done,25);
    assert.deepEqual(a,b);
    assert.equal(new Set(a.cells.map(c=>c.id)).size,25);
    for(const x of a.cells)for(const y of a.cells){
      if(x.id===y.id)continue;
      const overlapX=Math.min(x.x+x.width,y.x+y.width)-Math.max(x.x,y.x);
      const overlapY=Math.min(x.y+x.height,y.y+y.height)-Math.max(x.y,y.y);
      assert.ok(overlapX<.00001||overlapY<.00001);
    }
  }
});
test('helpers and card designs vary by position, never by correctness or answer content',()=>{
  const a={...q,options:[{label:'secret',correct:true},{label:'other',correct:false}]};
  const b={...q,options:[{label:'different',correct:false},{label:'another',correct:true}]};
  const plans=Array.from({length:8},(_,i)=>P.plan(settings,a,i));
  assert.deepEqual(plans.map(p=>p.helper),['egg','crystal','egg','crystal','egg','crystal','egg','crystal']);
  assert.deepEqual(plans.slice(0,4).map(p=>p.cardStyle),P.CARD_STYLES);
  assert.equal(new Set(plans.map(p=>p.messageStyle)).size,2);
  for(let i=0;i<8;i++){
    assert.deepEqual(P.plan(settings,a,i),P.plan(settings,b,i));
    assert.equal(P.plan({...settings,mode:'test'},a,i).egg,false);
    assert.equal(P.plan({...settings,timerMode:'total'},a,i).enabled,false);
  }
});
