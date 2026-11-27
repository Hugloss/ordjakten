'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const View=require('../public/js/treasure-hunt-view');
const Adventures=require('../public/js/adventures');

function documentStub(){
  const doc={createElement(tag){
    return {tag,ownerDocument:doc,className:'',textContent:'',children:[],attributes:{},dataset:{},hidden:false,
      append(...children){this.children.push(...children);},replaceChildren(...children){this.children=children;},
      setAttribute(name,value){this.attributes[name]=String(value);}};
  },createElementNS(ns,tag){return this.createElement(tag);}};
  return doc;
}
const descendants=node=>[node,...node.children.flatMap(descendants)];
const text=node=>descendants(node).map(item=>item.textContent).filter(Boolean).join('\n');
const byData=(host,key)=>descendants(host).filter(node=>Object.hasOwn(node.dataset,key));
const byId=(host,id)=>descendants(host).find(node=>node.id===id);
const clone=value=>JSON.parse(JSON.stringify(value));
function map(){
  const names=['Skogsbrynet','Svampstigen','Uggleträdet','Hemliga gläntan'];
  const task={key:'forest:2',target:'sv-0024',word:'Ihålig',definition:'Med ett tomt utrymme inuti.',
    prompt:'Boken finns i en ihålig träbit. Var letar vi?',why:'En ihålig träbit har ett tomrum där en bok får plats.',
    options:[{id:'0',label:'I en träbit med ett tomt utrymme inuti',correct:true},{id:'1',label:'På en träskiva utan hålrum',correct:false},{id:'2',label:'Mellan två släta stenar',correct:false}]};
  return {id:'forest',title:'Mystiska skogen',emoji:'🌲',phase:'map',count:0,total:4,complete:false,finderTotal:0,
    worlds:[{id:'forest',title:'Mystiska skogen',emoji:'🌲',count:0,total:4},{id:'pirate',title:'Piratjakten',emoji:'🏴‍☠️',count:0,total:4}],
    clue:{index:2,text:'Leta där en fågel vaktar böcker inne i ett stort träd.',hint:'Titta efter bokhyllor i ett träd.',lookFor:['ett stort träd','en fågel med böcker'],why:'SECRET DESTINATION EXPLANATION',hintShown:false},
    places:names.map((name,index)=>({index,key:'forest:'+index,name,emoji:['🌿','🍄','🦉','🏕️'][index],description:'Här finns ledtrådar vid '+name+'.',
      clue:'SECRET FUTURE CLUE '+index,hint:'SECRET FUTURE HINT '+index,why:'SECRET FUTURE WHY '+index,treasure:{emoji:'🪶',name:'SECRET FUTURE PRIZE '+index},task,visited:false,found:false,smallFound:false})),
    collection:[],smallFinds:[],visit:null};
}
function visit(phase='question',matched=true){
  const model=map();model.phase=phase;
  model.visit={serial:7,index:matched?2:0,name:matched?'Uggleträdet':'Skogsbrynet',emoji:matched?'🦉':'🌿',matched,task:model.places[2].task,
    options:[...model.places[2].task.options].reverse(),stage:phase,attempts:0,outcome:null,reward:null,activityKey:'treasure:forest:2'};
  return model;
}
function render(model,options={}){const host=documentStub().createElement('section');View.render(host,model,options);return host;}

test('the first map exposes four native place choices and their evidence without revealing the correct destination',()=>{
  const model=map(),before=clone(model),host=render(model,{wordStars:[],canReadAloud:true});
  assert.equal(byId(host,'treasure-stage-title').textContent,'Skattkartan');
  assert.equal(byId(host,'treasure-stage-title').tabIndex,-1);
  const choices=byData(host,'treasurePlace');
  assert.equal(choices.length,4);
  assert.deepEqual(choices.map(button=>button.dataset.treasurePlace),['0','1','2','3']);
  for(const [index,button] of choices.entries()){
    assert.equal(button.tag,'button');assert.equal(button.type,'button');assert.notEqual(button.disabled,true);
    assert.match(text(button),new RegExp(model.places[index].name));
    assert.ok(text(button).includes(model.places[index].description));
    assert.deepEqual(Object.keys(button.dataset),['treasurePlace']);
    assert.ok(!/correct|current|next|target/.test(button.className));
  }
  assert.ok(!text(host).includes('SECRET'));
  assert.equal(byId(host,'treasure-hint').hidden,true);
  assert.equal(byId(host,'treasure-hint').textContent,'');
  assert.ok(!text(host).includes('Leta efter båda:'),'the extra help is not inserted before it is requested');
  assert.equal(byId(host,'treasure-listen-clue').dataset.treasureListen,'clue');
  assert.equal(byId(host,'treasure-listen-clue-status').attributes.role,'status');
  assert.match(text(host),/0 av 4 ledtrådar/);assert.match(text(host),/0 av 4 stjärnor/);
  assert.deepEqual(model,before,'rendering does not alter progress or hidden source content');
});

test('requesting another clue separates its two features without identifying the destination',()=>{
  const model=map();model.clue.hintShown=true;
  const host=render(model);
  assert.equal(byId(host,'treasure-hint').hidden,false);
  assert.ok(text(byId(host,'treasure-hint')).includes(model.clue.hint));
  assert.match(text(byId(host,'treasure-hint')),/Leta efter båda:/);
  assert.deepEqual(descendants(byId(host,'treasure-hint')).filter(node=>node.tag==='li').map(node=>node.textContent),model.clue.lookFor);
  assert.equal(byData(host,'treasureHint')[0].attributes['aria-expanded'],'true');
  assert.equal(byData(host,'treasurePlace').length,4);
  assert.ok(!text(host).includes(model.clue.why));
  assert.ok(!text(byId(host,'treasure-hint')).includes(model.places[2].name));
});

test('a wrong destination still opens its question and serial-bound controls without a navigation reward',()=>{
  const model=visit('question',false),host=render(model,{canReadAloud:true});
  assert.match(text(host),/En liten avstickare/);
  assert.ok(text(host).includes(model.visit.task.prompt));
  assert.ok(text(host).includes(model.clue.text),'the child can compare the original clue with this place');
  assert.ok(text(host).includes(model.places[model.visit.index].description));
  for(const part of model.clue.lookFor)assert.ok(text(host).includes(part));
  assert.equal(byId(host,'treasure-listen-arrival').textContent,'🔊 Lyssna på ledtråden och platsen');
  assert.equal(byId(host,'treasure-listen-arrival').dataset.treasureSerial,'7');
  assert.equal(byId(host,'treasure-listen-arrival-status').attributes.role,'status');
  assert.ok(!text(host).includes(model.places[2].name),'the comparison does not supply the correct place name');
  const answers=byData(host,'treasureAnswer');assert.equal(answers.length,3);
  assert.deepEqual(answers.map(button=>button.dataset.treasureAnswer),['2','1','0']);
  for(const button of [...answers,...byData(host,'treasureExplain'),...byData(host,'treasureBack'),...byData(host,'treasureListen')]){
    assert.equal(button.tag,'button');assert.equal(button.type,'button');assert.equal(button.dataset.treasureSerial,'7');
    assert.ok(!Object.hasOwn(button.dataset,'correct'));
  }
  assert.equal(byData(host,'treasureWorld').length,0,'an active visit cannot silently change worlds');
  assert.equal(byData(host,'treasurePlace').length,0,'the map does not obscure the task after choosing');
  assert.ok(!text(host).includes('+1 sakletarpoäng'));
  assert.ok(!text(host).includes(model.clue.why));
  assert.ok(!text(host).includes(model.visit.task.definition));
});

test('one wrong word answer displays the definition while retaining three usable choices',()=>{
  const model=visit();model.visit.attempts=1;
  const host=render(model);
  assert.match(text(byId(host,'treasure-hint')),/Läs hjälpen och prova igen/);
  assert.ok(text(byId(host,'treasure-hint')).includes(model.visit.task.definition));
  assert.equal(byId(host,'treasure-hint').attributes.role,'status');
  assert.equal(byData(host,'treasureAnswer').length,3);
  assert.ok(!text(host).includes('Vi väljer:'));
});

test('guided explanation stays distinct from an independently earned word star',()=>{
  const model=visit('explanation');model.visit.outcome='guided';
  const guided=render(model,{canReadAloud:true,wordStars:[],starReward:null});
  assert.match(text(guided),/Vi löser det tillsammans/);
  assert.match(text(guided),/Vi tittade på svaret tillsammans/);
  assert.ok(text(guided).includes(model.visit.task.why));
  assert.ok(!text(guided).includes('En ordstjärna till'));
  assert.equal(byData(guided,'treasureFinish')[0].dataset.treasureSerial,'7');
  assert.equal(byData(guided,'treasureBack').length,0,'a completed answer proceeds to its promised find instead of discarding the visit');
  assert.equal(byId(guided,'treasure-listen-arrival'),undefined,'arrival comparison speech is only present on a wrong destination');
  assert.equal(byId(guided,'treasure-listen-explanation').dataset.treasureSerial,'7');
  model.visit.outcome='supported';
  const own=render(model,{wordStars:[2],totalStars:15,starReward:{added:1,milestones:[{icon:'🌼',title:'Stjärnblomman'}]}});
  assert.match(text(own),/En ordstjärna till din samling/);assert.match(text(own),/15 stjärnor i hela samlingen/);
  assert.match(text(own),/Du samlade Stjärnblomman/);
  assert.ok(!text(own).includes('Vi tittade på svaret tillsammans'));
});

test('a small wrong-place find and a special clue treasure have truthful separate reward copy',()=>{
  const model=visit('reward',false);model.visit.outcome='direct';
  model.visit.reward={kind:'small',emoji:'🍃',name:'Ett litet löv',newItem:true,finderAdded:0};
  const small=render(model,{wordStars:[0]});
  assert.match(text(small),/Ditt nya fynd: Ett litet löv/);
  assert.match(text(small),/ger ingen sakletarpoäng/);
  assert.ok(!text(small).includes('+1 sakletarpoäng'));
  assert.equal(byData(small,'treasureBack')[0].textContent,'Till kartan – leta vidare');
  model.visit.matched=true;model.count=1;
  model.visit.reward={kind:'treasure',emoji:'🪶',name:'Ugglans bokmärke',newItem:true,finderAdded:1};
  model.collection=[{index:2,emoji:'🪶',name:'Ugglans bokmärke',place:'Uggleträdet'}];
  const treasure=render(model,{wordStars:[0]});
  assert.match(text(treasure),/\+1 sakletarpoäng/);assert.match(text(treasure),/Ugglans bokmärke/);
  assert.equal(byData(treasure,'treasureBack')[0].textContent,'Till kartan och nästa ledtråd');
  assert.equal(byData(treasure,'treasureBack')[0].dataset.treasureSerial,'7');
});

test('a completed map celebrates all clues, permits word-star practice and promises no new finder reward',()=>{
  const model=map();model.count=4;model.complete=true;model.clue=null;
  for(const place of model.places){place.found=true;place.visited=true;}
  const host=render(model,{wordStars:[0,0,1,2,99,-1]});
  assert.match(text(host),/Alla skatter på kartan hittade/);
  assert.match(text(host),/4 av 4 ledtrådar/);assert.match(text(host),/3 av 4 stjärnor/);
  assert.equal(byData(host,'treasurePlace').length,5,'four map places and one direct practice choice');
  const practice=byData(host,'treasurePlace').find(button=>button.textContent.startsWith('Öva ordfrågan vid '));
  assert.equal(practice.dataset.treasurePlace,'3','practice chooses a place whose star is still missing');
  assert.equal(practice.textContent,'Öva ordfrågan vid Hemliga gläntan');
  assert.match(text(host),/Det finns 1 ordstjärna kvar på kartan/);
  assert.match(text(host),/Kartmärke samlat/);
  assert.match(text(host),/1 av 2 kartmärken samlade/);
  assert.equal(byData(host,'treasureWorldChoice').find(button=>button.textContent.startsWith('Utforska ')).dataset.treasureWorldChoice,'pirate');
  assert.equal(byData(host,'treasureHint').length,0);
  assert.equal(byId(host,'treasure-listen-clue'),undefined);
  assert.ok(!text(host).includes('+1 sakletarpoäng'));
});

test('the map book distinguishes a collected badge from remaining word stars and keeps every world selectable',()=>{
  const model=map();model.count=2;
  const worlds=[{...model.worlds[0],count:2,starCount:1},{...model.worlds[1],count:4,starCount:2},
    {id:'space',title:'Rymdäventyret',emoji:'🚀',count:0,total:4,starCount:0}];
  const host=render(model,{wordStars:[0],worlds});
  const book=descendants(host).find(node=>node.className==='treasure-map-book');
  assert.equal(book.tag,'details');assert.notEqual(book.open,true);
  assert.match(text(book),/Min skattbok · 1 av 3 kartmärken/);
  const choices=byData(book,'treasureWorldChoice');assert.equal(choices.length,3);
  for(const button of choices){assert.equal(button.tag,'button');assert.equal(button.type,'button');assert.notEqual(button.disabled,true);}
  const forest=choices.find(button=>button.dataset.treasureWorldChoice==='forest');
  assert.equal(forest.attributes['aria-current'],'true');assert.match(text(forest),/2 av 4 skatter/);assert.match(text(forest),/1 av 4 ordstjärnor/);
  assert.ok(!text(forest).includes('Kartmärke samlat'));
  const pirate=choices.find(button=>button.dataset.treasureWorldChoice==='pirate');
  assert.match(text(pirate),/✓ Kartmärke samlat/);assert.match(text(pirate),/2 av 4 ordstjärnor/);
  const space=choices.find(button=>button.dataset.treasureWorldChoice==='space');
  assert.match(text(space),/Börja leta/);assert.ok(!text(space).includes('Kartmärke samlat'));
  const picker=byId(host,'treasure-world');
  assert.equal(picker.children.find(option=>option.value==='pirate').textContent,'🏴‍☠️ Piratjakten · 4 av 4 skatter');
  assert.ok(!text(book).includes('SECRET'),'the overview contains progress, not future clues or task solutions');
});

test('a fully collected map offers another unfinished world without inventing a missing word star',()=>{
  const model=map();model.count=4;model.complete=true;model.clue=null;
  const host=render(model,{wordStars:[0,1,2,3]});
  assert.match(text(host),/alla fyra ordstjärnorna på kartan/);
  assert.equal(byData(host,'treasurePlace').length,4,'no extra practice target is offered when no star is missing');
  assert.ok(!text(host).includes('ordstjärna kvar'));
  const next=byData(host,'treasureWorldChoice').find(button=>button.textContent.startsWith('Utforska '));
  assert.equal(next.dataset.treasureWorldChoice,'pirate');
});

test('collecting all twelve map badges celebrates the actual finish and keeps remaining word practice honest',()=>{
  const model=map();model.count=4;model.complete=true;model.clue=null;
  const worlds=Adventures.WORLD_IDS.map(id=>({id,...Adventures.world(id),count:4,total:4,starCount:id==='pirate'?2:4}));
  const host=render(model,{wordStars:[0,1,2,3],worlds});
  assert.match(text(host),/12 av 12 kartmärken samlade/);assert.match(text(host),/Alla kartmärken är samlade!/);
  assert.match(text(host),/I skattboken ser du vilka kartor som har ordstjärnor kvar/);
  assert.equal(byData(host,'treasureWorldChoice').filter(button=>button.textContent.startsWith('Utforska ')).length,0);
  assert.equal(byData(host,'treasureWorldChoice').length,12,'every world remains available for a return visit');
  assert.ok(!text(host).includes('+1 sakletarpoäng'));
  assert.ok(!text(host).includes('SECRET'));
});
