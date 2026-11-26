'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Theatre=require('../public/js/camp-theatre');
const Camp=require('../public/js/adventure-camp');
const Playful=require('../public/js/playful');
const items=Camp.STARTER.concat([{id:'mark-forest-0',name:'Stiglövet',emoji:'🍃'}]);
const start=(scene='glade',slots=['mark-forest-0','free-book','free-tent'])=>Theatre.start({scene,slots},items,'owl');
test('the theatre starts with all three heroes and the current companion first',()=>{
  const state=start();
  assert.deepEqual(Theatre.choices(state).map(x=>x.id),['owl','fox','dragon']);
  assert.equal(Theatre.model(state).step,1);
  assert.equal(Theatre.model(state).canBack,false);
});
test('placed owned items are offered first, with free pieces for an empty camp',()=>{
  const state=Theatre.choose(start(),'fox');
  assert.deepEqual(Theatre.choices(state).map(x=>x.id),['mark-forest-0','free-book','free-tent']);
  const empty=Theatre.choose(start('coast',['mark-space-0','mark-space-0']),'dragon');
  assert.deepEqual(Theatre.choices(empty).map(x=>x.id),['free-book','free-tent','free-lantern']);
  assert.equal(Theatre.choose(empty,'mark-space-0'),empty);
});
test('all 4 scenes, 3 heroes, 3 props and 3 plots compose 108 complete illustrated stories',()=>{
  let count=0;
  for(const scene of Object.keys(Camp.SCENES)){
    const initial=start(scene),original=JSON.stringify(initial),seen=new Set();
    for(const hero of Theatre.choices(initial)){
      const withHero=Theatre.choose(initial,hero.id);
      for(const prop of Theatre.choices(withHero)){
        const withProp=Theatre.choose(withHero,prop.id);
        for(const plot of Theatre.choices(withProp)){
          const done=Theatre.choose(withProp,plot.id),model=Theatre.model(done);
          assert.equal(done.stage,'ending');assert.equal(model.panels.length,3);
          assert.equal(model.choices.length,0);assert.equal(model.selected.length,3);
          assert.ok(model.panels[0].text.includes(hero.label)&&model.panels[0].text.includes(prop.label));
          assert.ok(model.panels.every(p=>p.emoji&&p.title&&p.text));
          assert.ok(model.title);seen.add(JSON.stringify(model.panels));count++;
        }
      }
    }
    assert.equal(seen.size,27);assert.equal(JSON.stringify(initial),original);
  }
  assert.equal(count,108);
});
test('back clears only the choices downstream of the edited step',()=>{
  const first=Theatre.choose(start(),'owl'),second=Theatre.choose(first,'mark-forest-0');
  const done=Theatre.choose(second,'show');
  assert.deepEqual(Theatre.back(done),second);
  assert.deepEqual(Theatre.back(second),first);
  assert.deepEqual(Theatre.back(first),start());
  assert.equal(Theatre.back(start()).stage,'hero');
});
test('invalid or out-of-order choices cannot advance the story',()=>{
  const state=start();
  assert.equal(Theatre.choose(state,'show'),state);
  assert.equal(Theatre.choose(state,'__proto__'),state);
  assert.equal(Theatre.choose(null,'owl'),null);
  assert.equal(Theatre.model(null),null);
  const done=Theatre.choose(Theatre.choose(Theatre.choose(state,'owl'),'free-book'),'show');
  assert.equal(Theatre.choose(done,'mystery'),done);
});
test('story choices do not mutate the camp, inventory or companion definitions',()=>{
  const layout={scene:'garden',slots:['mark-forest-0']};
  const snapshot=JSON.stringify({layout,items,companions:Playful.COMPANIONS});
  const initial=Theatre.start(layout,items,'dragon');
  Theatre.choose(Theatre.choose(Theatre.choose(initial,'dragon'),'mark-forest-0'),'friend');
  assert.equal(JSON.stringify({layout,items,companions:Playful.COMPANIONS}),snapshot);
});
