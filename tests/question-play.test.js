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
