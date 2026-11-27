'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const W=require('../public/js/workshop');
const L=require('../public/js/learning-map');
const R=require('../public/js/recall');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const contrasts=require('../public/data/contrasts.json');
const catalog=L.catalog(bank,expressions,{});
const grumlig=catalog.find(item=>item.name==='Grumlig');
const phrase=catalog.find(item=>item.name==='För en gångs skull');
const random=()=>.37;

test('all 194 workshop plans end in ungraded reflection and only contain original examples',()=>{
  let builds=0,repairs=0;
  for(const item of catalog){
    for(const draw of [()=>0,random,()=>.9999]){
      const plan=W.plan(item,catalog,contrasts,draw);
      assert.ok(plan,item.id);
      assert.equal(plan.steps.at(-1).type,'reflect');
      assert.equal(plan.steps.filter(step=>step.type==='reflect').length,1);
      const build=plan.steps.find(step=>step.type==='build');
      if(build){
        assert.ok(build.parts.length>=3&&build.parts.length<=5);
        assert.equal(build.original,item.example.trim().replace(/\s+/gu,' '));
        assert.equal(new Set(build.pieces.map(piece=>piece.id)).size,build.parts.length);
        assert.notEqual(build.pieces.map(piece=>piece.label).join(' '),build.original);
        assert.equal(W.built(build,build.parts.map((_,i)=>i)).same,true);
        if(item.kind==='expression')assert.ok(build.parts.some(part=>
          part.toLocaleLowerCase('sv-SE').includes(item.name.toLocaleLowerCase('sv-SE'))));
      }
      const repair=plan.steps.find(step=>step.type==='repair');
      if(repair){
        assert.equal(repair.scenes.length,2);
        assert.equal(repair.scenes.filter(scene=>scene.needsRepair).length,1);
      }
    }
    const steps=W.plan(item,catalog,contrasts,random).steps;
    if(steps.some(step=>step.type==='build'))builds++;
    if(steps.some(step=>step.type==='repair'))repairs++;
  }
  assert.equal(catalog.length,194);
  assert.ok(builds>=121);
  assert.equal(repairs,contrasts.pairs.length*2);
});
test('expression puzzle protects the complete idiom and does not invent inflected variants',()=>{
  const build=W.build(phrase,random);
  assert.ok(build.parts.some(part=>part.includes(phrase.name)));
  assert.equal(build.parts.join(' '),phrase.example);
  const inflected=catalog.find(item=>item.name==='Ha is i magen');
  assert.equal(W.build(inflected,random),null);
  assert.equal(W.plan(inflected,catalog,contrasts,random).steps.at(-1).type,'reflect');
});
test('reconstruction validates selections; other orders are not graded as incorrect meanings',()=>{
  const task=W.build(grumlig,random);
  const partial=W.built(task,[0]);
  assert.equal(partial.complete,false);
  assert.equal(partial.same,false);
  assert.equal(W.built(task,[0,0]),null);
  assert.equal(W.built(task,[999]),null);
  assert.equal(W.built(task,['0']),null);
  const original=task.parts.map((_,i)=>i);
  assert.equal(W.built(task,original).same,true);
  const other=W.built(task,original.slice().reverse());
  assert.equal(other.complete,true);
  assert.equal(other.same,false);
  assert.equal(Object.hasOwn(other,'wrong'),false);
});
test('identical piece labels are interchangeable when the reconstructed text is identical',()=>{
  const item={name:'Ord',kind:'word',example:'Vi såg vi igen.'};
  const task=W.build(item,random);
  assert.equal(W.built(task,[0,1,2,3]).same,true);
  const duplicate=W.build({name:'Ord',kind:'word',example:'vi såg vi igen.'},random);
  assert.equal(W.built(duplicate,[2,1,0,3]).same,true);
});
test('repair uses real pair scenes and exactly one mislabeled story in every pair',()=>{
  for(const pair of contrasts.pairs){
    const item=catalog.find(row=>row.id===pair.left);
    for(const draw of [()=>0,()=>.25,()=>.5,()=>.75,()=>.9999]){
      const task=W.repair(item,catalog,contrasts,draw);
      assert.equal(task.pairId,pair.id);
      assert.equal(task.scenes.filter(scene=>scene.needsRepair).length,1);
      for(const row of task.scenes){
        const scene=pair.scenes.find(scene=>scene.id===row.id);
        assert.ok(scene);
        assert.equal(row.text,scene.text);
        assert.equal(row.why,scene.why);
        assert.equal(row.difference,scene.difference);
        assert.equal(row.word,catalog.find(x=>x.id===scene.target).name);
        assert.equal(row.needsRepair,row.word!==task.given);
      }
    }
  }
  assert.equal(W.repair(phrase,catalog,contrasts,random),null);
});
test('quick launch favors observed concepts and falls back to age-appropriate starter pairs',()=>{
  const history={skillProgress:{[grumlig.id]:{skills:{meaning:{right:1}}}}};
  assert.equal(W.pick(catalog,contrasts,history,R.eligible,random).id,grumlig.id);
  const recall={recallProgress:{[phrase.id]:{assisted:1}}};
  assert.equal(W.pick(catalog,contrasts,recall,R.eligible,random).id,phrase.id);
  const first=W.pick(catalog,contrasts,{},R.eligible,()=>0);
  assert.ok(contrasts.pairs.some(pair=>pair.starter&&[pair.left,pair.right].includes(first.id)));
  assert.equal(W.pick([],contrasts,{},R.eligible,random),null);
  assert.equal(W.plan(null,catalog,contrasts,random),null);
  assert.equal(W.plan({id:'unknown',name:'X',example:'A B C.',definition:'Unknown'},catalog,contrasts,random),null);
});
test('automatic workshop keeps extension words out even when old history makes them eligible',()=>{
  const extension={...grumlig,everyday:false},ordinary={...phrase,everyday:true};
  const items=[extension,ordinary],history={recallProgress:{[extension.id]:{assisted:1}}};
  const before=JSON.stringify(history);
  for(const draw of [()=>0,()=>.5,()=>.9999]){
    assert.equal(W.pick(items,contrasts,history,()=>true,draw).id,ordinary.id);
    assert.equal(W.pick(items,contrasts,history,()=>false,draw).id,ordinary.id);
    assert.equal(W.pick([extension],contrasts,history,()=>true,draw),null);
  }
  assert.equal(W.plan(extension,items,contrasts,random).item.id,extension.id);
  assert.equal(JSON.stringify(history),before);
});
test('automatic workshop does not introduce an extension word through an ordinary contrast partner',()=>{
  const pair=contrasts.pairs[0];
  const ordinary={...catalog.find(item=>item.id===pair.left),everyday:true};
  const extension={...catalog.find(item=>item.id===pair.right),everyday:false};
  const alternative={...phrase,everyday:true};
  const items=[ordinary,extension,alternative],history={recallProgress:{[ordinary.id]:{assisted:1}}};
  const before=JSON.stringify(history);
  for(const draw of [()=>0,()=>.5,()=>.9999]){
    assert.equal(W.pick(items,contrasts,history,()=>true,draw).id,alternative.id);
    assert.equal(W.pick(items,contrasts,history,()=>false,draw).id,alternative.id);
    assert.equal(W.pick([ordinary,extension],contrasts,history,()=>true,draw),null);
  }
  assert.ok(W.plan(ordinary,items,contrasts,random).steps.some(step=>step.type==='repair'));
  assert.equal(JSON.stringify(history),before);
});
