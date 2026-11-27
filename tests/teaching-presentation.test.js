'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const app=fs.readFileSync(path.join(__dirname,'../public/js/app.js'),'utf8');
const source=app.slice(app.indexOf('  function renderWordTeaching('),app.indexOf('  function renderWordList('));
class Node {
  constructor(tag){this.tagName=tag;this.children=[];this.open=false;this.hidden=false;this.textContent='';}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=[...children];}
}
const scope={document:{createElement:tag=>new Node(tag)}};
vm.runInNewContext(source,scope);
const lesson={correction:'Du valde blank. Här står att vätskan döljer bottnen.',
  explanation:'Grumlig vätska är svår att se igenom.',
  familiar:'När lera rörs upp i en vattenpöl kan vattnet bli grumligt.',
  nonExample:'Klart vatten som du ser igenom är inte grumligt.',
  ownPrompt:'Hur skulle du beskriva vattnet i en vattenpöl?'};
const allText=node=>[node.textContent,...node.children.map(allText)].filter(Boolean).join(' ');
const visibleText=node=>node.hidden?'':node.tagName==='details'&&!node.open
  ? allText(node.children[0]):[node.textContent,...node.children.map(visibleText)].filter(Boolean).join(' ');

test('word feedback keeps the correction and core meaning visible, with all optional teaching still reachable',()=>{
  const host=new Node('section');scope.renderWordTeaching(host,lesson);
  const more=host.children.find(node=>node.tagName==='details');
  assert.ok(more);assert.equal(more.open,false);
  assert.ok(visibleText(host).includes(lesson.correction));
  assert.ok(visibleText(host).includes(lesson.explanation));
  for(const key of ['familiar','nonExample','ownPrompt']){
    assert.ok(!visibleText(host).includes(lesson[key]));
    assert.ok(allText(host).includes(lesson[key]));
  }
  more.open=true;
  for(const text of Object.values(lesson))assert.ok(visibleText(host).includes(text));
});

test('a specific story explanation can take priority while the general lesson remains available',()=>{
  const host=new Node('section');scope.renderWordTeaching(host,lesson,{contextExplanation:true});
  assert.ok(visibleText(host).includes(lesson.correction));
  assert.ok(!visibleText(host).includes(lesson.explanation));
  assert.ok(allText(host).includes(lesson.explanation));
  host.children.find(node=>node.tagName==='details').open=true;
  assert.ok(visibleText(host).includes(lesson.explanation));
});

test('each new lesson starts closed; facit and word collection can show the complete lesson',()=>{
  const host=new Node('section');scope.renderWordTeaching(host,lesson);
  host.children.find(node=>node.tagName==='details').open=true;
  scope.renderWordTeaching(host,{...lesson,correction:''});
  assert.equal(host.children.find(node=>node.tagName==='details').open,false);
  assert.ok(!allText(host).includes(lesson.correction));
  scope.renderWordTeaching(host,lesson,{expanded:true});
  assert.ok(!host.children.some(node=>node.tagName==='details'));
  for(const text of Object.values(lesson))assert.ok(visibleText(host).includes(text));
  scope.renderWordTeaching(host,null);
  assert.equal(host.hidden,true);assert.equal(host.children.length,0);
});
