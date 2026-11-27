'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Data=require('../public/js/mission-portals-data');
const Model=require('../public/js/mission-portals');
const View=require('../public/js/mission-portals-view');
const content=Model.catalog(Data);
function documentStub(){
  const doc={createElement(tag){
    const el={tag,ownerDocument:doc,className:'',textContent:'',children:[],dataset:{},attributes:{},hidden:false,
      append(...nodes){this.children.push(...nodes);},
      replaceChildren(...nodes){this.children=[...nodes];},
      setAttribute(name,value){this.attributes[name]=String(value);}};
    el.classList={add(...names){el.className+=' '+names.join(' ');}};
    return el;
  }};return doc;
}
const all=x=>[x,...x.children.flatMap(all)];
const text=x=>all(x).map(y=>y.textContent).filter(Boolean).join('\n');
const buttons=(x,key)=>all(x).filter(y=>Object.hasOwn(y.dataset,key));
const render=(state,id=null,opt={})=>{
  const host=documentStub().createElement('div');
  View.render(host,Model.model(state,id,content),opt);
  return host;
};
test('gallery shows twelve of 52 unlocked adventures initially and no challenge answer',()=>{
  const host=render({});
  assert.equal(buttons(host,'portalOpen').length,12);
  assert.match(text(host),/Upptäckarklubben/);
  assert.match(text(host),/52/);
  assert.ok(!text(host).includes(Data.STORIES[0].stages[0].why));
  for(const btn of buttons(host,'portalOpen')){
    assert.equal(btn.tag,'button');assert.equal(btn.type,'button');
    assert.ok(!btn.disabled);assert.ok(btn.dataset.portalOpen);
  }
});
test('the catalog can be filtered by theme without changing completed progress',()=>{
  const all=render({});
  const groupButtons=buttons(all,'portalFilter');
  assert.equal(groupButtons.length,5);
  assert.equal(groupButtons[0].dataset.portalFilter,'all');
  assert.equal(groupButtons[0].attributes['aria-pressed'],'true');
  for(const [category,count] of [['mystery',11],['fantasy',13],['explore',15],['creative',13]]){
    const host=render({},null,{category});
    assert.equal(buttons(host,'portalOpen').length,Math.min(12,count),category);
    assert.match(text(host),new RegExp('Visar '+Math.min(12,count)+' av '+count+' äventyr i kategorin \\(52 totalt\\)'));
    assert.equal(buttons(host,'portalFilter').find(x=>x.dataset.portalFilter===category).attributes['aria-pressed'],'true');
    assert.ok(buttons(host,'portalOpen').every(x=>content.stories[x.dataset.portalOpen].group===category));
    assert.equal(buttons(host,'portalMore').length,count>12?1:0);
    const expanded=render({},null,{category,visibleCount:24});
    assert.equal(buttons(expanded,'portalOpen').length,count);
    assert.equal(buttons(expanded,'portalMore').length,0);
  }
  assert.equal(buttons(render({},null,{category:'invalid'}),'portalOpen').length,12);
});

test('show-more pages 52 original cards without reordering stories or altering rewards',()=>{
  const original=render({},null,{visibleCount:12});
  const middle=render({},null,{visibleCount:24});
  const all=render({},null,{visibleCount:64});
  assert.equal(buttons(original,'portalOpen').length,12);
  assert.equal(buttons(middle,'portalOpen').length,24);
  assert.equal(buttons(all,'portalOpen').length,52);
  assert.equal(buttons(original,'portalMore').length,1);
  assert.equal(buttons(middle,'portalMore').length,1);
  assert.equal(buttons(all,'portalMore').length,0);
  assert.deepEqual(buttons(middle,'portalOpen').slice(0,12).map(b=>b.dataset.portalOpen),
    buttons(original,'portalOpen').map(b=>b.dataset.portalOpen));
  assert.deepEqual(buttons(all,'portalOpen').map(b=>b.dataset.portalOpen),content.ids);
  assert.equal(buttons(all,'portalOpen').at(-1).id,'portal-card-photo-club');
  assert.match(text(original),/Visar 12 av 52 äventyr/);
  assert.match(text(all),/Visar 52 av 52 äventyr/);
  const weird=render({},null,{visibleCount:-500});
  assert.equal(buttons(weird,'portalOpen').length,12);
});

test('new stage has two visible clues, three choices and a separate optional hint',()=>{
  const stage=Data.STORIES.find(x=>x.id==='detective').stages[0];
  let host=render({},'detective',{canReadAloud:true});
  assert.equal(buttons(host,'portalAnswer').length,3);
  assert.equal(buttons(host,'portalHint').length,1);
  assert.equal(buttons(host,'portalNext').length,0);
  assert.equal(buttons(host,'portalListen').length,1);
  assert.equal(all(host).filter(x=>x.className==='portal-clue').length,2);
  assert.equal(all(host).find(x=>x.id==='portal-listen-status').attributes.role,'status');
  assert.ok(!text(host).includes(stage.why));
  assert.ok(!text(host).includes(Data.STORIES[0].stages[1].scene));
  const copy=JSON.stringify(Model.model({},'detective',content));
  assert.ok(!copy.includes(Data.STORIES[0].stages[2].why));
  const wrong=stage.answer===0?1:0;
  const state=Model.choose({},'detective',wrong,content);
  host=render(state,'detective');
  assert.equal(buttons(host,'portalAnswer').find(x=>x.dataset.portalAnswer===String(wrong)).disabled,true);
  assert.match(text(host),/Läs båda spåren igen/);
  assert.equal(all(host).find(x=>x.id==='portal-feedback').attributes.role,'status');
  assert.equal(buttons(host,'portalNext').length,0);
});
test('a solved step explains both clues before its explicit continuation',()=>{
  const row=Data.STORIES[0],stage=row.stages[0];
  const state=Model.choose({},row.id,stage.answer,content);
  const host=render(state,row.id);
  assert.match(text(host),/Du hittade lösningen/);
  assert.ok(text(host).includes(stage.why));
  assert.match(text(host),/därför att/);
  assert.equal(buttons(host,'portalAnswer').length,0);
  assert.equal(buttons(host,'portalHint').length,0);
  assert.equal(buttons(host,'portalNext').length,1);
});
test('finished adventures show souvenir without awarding points or exposing the other stories',()=>{
  const row=Data.STORIES[0];
  let state={};
  for(const step of row.stages){
    state=Model.choose(state,row.id,step.answer,content);
    state=Model.next(state,row.id,content);
  }
  const host=render(state,row.id);
  assert.match(text(host),/Du klarade äventyret/);
  assert.ok(text(host).includes(row.ending));
  assert.ok(text(host).includes(row.keepsake.name));
  assert.equal(buttons(host,'portalNext').length,0);
  assert.equal(buttons(host,'portalBack').length,2);
});
