'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Stars=require('../public/js/star-collection');
const View=require('../public/js/star-collection-view');

function documentStub(){
  const doc={createElement(tag){
    return {tag,ownerDocument:doc,className:'',textContent:'',children:[],attributes:{},dataset:{},hidden:false,
      append(...children){this.children.push(...children);},
      replaceChildren(...children){this.children=children;},
      setAttribute(name,value){this.attributes[name]=String(value);}};
  }};
  return doc;
}
const descendants=node=>[node,...node.children.flatMap(descendants)];
const text=node=>descendants(node).map(item=>item.textContent).filter(Boolean).join('\n');
const byClass=(node,name)=>descendants(node).filter(item=>item.className.split(' ').includes(name));
const buttons=node=>descendants(node).filter(item=>item.tag==='button');
const questions=Array.from({length:5},(_,i)=>({id:'sv-'+String(i+1).padStart(4,'0')}));

test('an empty star collection offers a calm start and shows a reachable first goal',()=>{
  const host=documentStub().createElement('section');
  View.render(host,Stars.view(Stars.sanitize()));
  assert.match(text(host),/0 stjärnor samlade/);
  assert.match(text(host),/5 stjärnor kvar till Första gnistan/);
  assert.equal(byClass(host,'star-collection-item').length,6);
  assert.equal(byClass(host,'star-collection-earned').length,0);
  const progress=descendants(host).find(node=>node.tag==='progress');
  assert.equal(progress.attributes.max,'5');
  assert.equal(progress.attributes.value,'0');
  assert.match(progress.attributes['aria-label'],/Första gnistan/);
  assert.ok(Object.hasOwn(buttons(host)[0].dataset,'starStart'));
  assert.equal(buttons(host)[0].type,'button');
  assert.equal(buttons(host)[0].textContent,'⭐ Börja en ny stjärnrad · 5 ord →');
  assert.match(text(host),/Ta den tid du behöver/);
});

test('a partial round offers only its missing stars and distinguishes first answers from practice',()=>{
  const host=documentStub().createElement('section');
  let {collection,roundId}=Stars.begin(Stars.sanitize(),questions);
  View.render(host,Stars.view(collection),{round:Stars.summarize(collection,roundId)});
  assert.equal(buttons(host)[0].textContent,'Fortsätt med 5 frågor →');
  assert.ok(!text(host).includes('första försöket'));
  assert.ok(!text(host).includes('ny chans'));
  for(const id of ['sv-0001','sv-0002'])collection=Stars.award(collection,roundId,id,'answer').collection;
  collection=Stars.finish(collection,roundId).collection;
  collection=Stars.award(collection,roundId,'sv-0003','practice').collection;
  View.render(host,Stars.view(collection),{round:Stars.summarize(collection,roundId)});
  assert.match(text(host),/3 av 5 stjärnor samlade/);
  assert.match(text(host),/2 i första rundan · 1 i fortsatt träning/);
  assert.equal(buttons(host).length,1);
  assert.equal(buttons(host)[0].dataset.starRecovery,String(roundId));
  assert.match(buttons(host)[0].textContent,/sista 2 stjärnorna/);
  const slots=byClass(host,'star-slot');
  assert.equal(slots.length,5);
  assert.equal(slots.filter(slot=>slot.attributes['aria-label'].endsWith('samlad')).length,3);
  assert.equal(slots.filter(slot=>slot.attributes['aria-label'].endsWith('kvar att samla')).length,2);
});

test('completing a round after practice celebrates all stars without presenting a perfect first attempt',()=>{
  const host=documentStub().createElement('div');
  let {collection,roundId}=Stars.begin(Stars.sanitize(),questions);
  collection=Stars.award(collection,roundId,'sv-0001','answer').collection;
  collection=Stars.finish(collection,roundId).collection;
  for(const q of questions.slice(1))collection=Stars.award(collection,roundId,q.id,'practice').collection;
  View.render(host,Stars.view(collection),{round:Stars.summarize(collection,roundId),compact:true});
  assert.match(text(host),/Alla stjärnor i din rad samlade/);
  assert.match(text(host),/1 i första rundan · 4 i fortsatt träning/);
  assert.equal(byClass(host,'star-collection-earned').length,1);
  assert.ok(descendants(host).some(node=>node.tag==='details'));
  assert.match(text(host),/Mina samlingsmärken · 1 av 6/);
  assert.ok(Object.hasOwn(buttons(host)[0].dataset,'starStart'));
  assert.ok(!Object.hasOwn(buttons(host)[0].dataset,'starRecovery'));
});

test('live round progress remains an accessible display with no retry or new-round controls',()=>{
  const host=documentStub().createElement('div');
  const many=Array.from({length:25},(_,i)=>({id:'sv-'+String(i+1).padStart(4,'0')}));
  let {collection,roundId}=Stars.begin(Stars.sanitize(),many);
  collection=Stars.award(collection,roundId,'sv-0001','answer').collection;
  View.renderRound(host,Stars.summarize(collection,roundId));
  assert.equal(host.hidden,false);
  assert.equal(byClass(host,'star-slot').length,25);
  assert.equal(buttons(host).length,0);
  const status=byClass(host,'star-round-count')[0];
  assert.equal(status.attributes.role,'status');
  assert.equal(status.textContent,'1 av 25 stjärnor samlade');
  View.renderRound(host,null);
  assert.equal(host.hidden,true);
  assert.equal(host.children.length,0);
});

test('a finished collection keeps its saved total and allows more play without inventing another threshold',()=>{
  const host=documentStub().createElement('section');
  View.render(host,Stars.view({version:1,total:105,serial:0,active:null}));
  assert.match(text(host),/105 stjärnor samlade/);
  assert.match(text(host),/Alla samlingsmärken är dina/);
  assert.equal(byClass(host,'star-collection-earned').length,6);
  assert.equal(descendants(host).filter(node=>node.tag==='progress').length,0);
  View.render(host,Stars.view(Stars.sanitize()));
  assert.equal(buttons(host).length,1);
  assert.equal(byClass(host,'star-collection-item').length,6);
  assert.ok(!text(host).includes('105 stjärnor'));
  View.render(host,null);
  assert.equal(host.hidden,true);
  assert.equal(host.children.length,0);
});
