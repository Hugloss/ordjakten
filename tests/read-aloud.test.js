'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const B=require('../public/js/reading-check');
const root=path.resolve(__dirname,'../public');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/reading-flow.css'),'utf8');

function appSection(start,end){
  const from=app.indexOf(start),to=app.indexOf(end,from);
  assert.ok(from>=0&&to>from,'app section is present');
  return app.slice(from,to);
}
function speechHarness({supported=true}={}){
  const nodes=new Map(),spoken=[],events={},documentEvents={};
  const calls={cancel:0};
  function node(){
    return {textContent:'',hidden:true,open:false,dataset:{},attributes:{},listeners:{},children:[],
      setAttribute(name,value){this.attributes[name]=value;},
      addEventListener(name,callback){this.listeners[name]=callback;},
      querySelectorAll(){return this.children;},
      querySelector(selector){return this.children[Number(selector.match(/"(\d+)"/)?.[1])];},
      focus(){},scrollIntoView(){}};
  }
  const $=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
  const window={addEventListener(name,callback){events[name]=callback;}};
  if(supported){
    window.SpeechSynthesisUtterance=function(text){this.text=text;};
    window.speechSynthesis={cancel(){calls.cancel++;},getVoices(){return [{lang:'sv-SE'}];},speak(utterance){spoken.push(utterance);}};
  }
  const scope={window,document:{hidden:false,addEventListener(name,callback){documentEvents[name]=callback;}},$,
    screen:'play',game:{feedback:true,index:0,settings:{mode:'train'},questions:[{id:'sample'}],answers:{},
      readingMetrics:{attempted:0,firstTry:0,completed:0,guided:0}},
    readingCheck:{prompt:'Vilket exempel passar?',source:'context',attempts:0,why:'FACITFÖRKLARING',
      options:[{label:'Det första exemplet',correct:false},{label:'Det andra exemplet',correct:true},{label:'Det tredje exemplet',correct:false}]},
    guidedActive:false,guidedParts:[],guidedIndex:0,B,
    resetQuestionDrag(){},saveAhaOutcome(){},showBurst(){},renderMysteryDiscovery(){},
    renderReadingOptions(check){$('reading-options').children=check.options.map(()=>node());}};
  $('reading-check').hidden=false;
  $('reading-check').dataset.complete='false';
  $('feedback-area').dataset.readingStage='quiz';
  scope.renderReadingOptions(scope.readingCheck);
  const context=vm.createContext(scope);
  vm.runInContext(appSection('  const canReadAloud =','  // An optional, unscored aid:'),context);
  vm.runInContext(appSection('  function revealReadingCheck()','  function recordAhaWithFeedback('),context);
  vm.runInContext(appSection('  function answerReadingCheck(','  function submit('),context);
  vm.runInContext(appSection("  $('reading-start').addEventListener", "  $('guided-start').addEventListener"),context);
  return {scope,$,spoken,calls,events,documentEvents,click(id){$(id).listeners.click();}};
}

test('read-aloud controls are optional, accessible, and hidden by default',()=>{
  for (const id of ['listen-story','listen-explanation','listen-reading-check']) {
    const tag=html.match(new RegExp('<button[^>]*id="'+id+'"[^>]*>'))?.[0];
    assert.ok(tag,id+' missing');
    assert.match(tag,/aria-pressed="false"/);
    assert.match(tag,/hidden/);
  }
  assert.match(app,/canReadAloud/);
  assert.match(app,/\.hidden=!canReadAloud/);
});
test('read-aloud never autoplays and is cancelled on navigation or quiz',()=>{
  assert.match(app,/utterance\.lang='sv-SE'/);
  assert.match(app,/window\.speechSynthesis\.speak\(utterance\)/);
  assert.match(app,/window\.speechSynthesis\.cancel\(\)/);
  assert.match(app,/function renderQuestion\(\) \{[\s\S]*?stopReadAloud\(\)/);
  assert.match(app,/function revealReadingCheck\(\) \{[\s\S]*?stopReadAloud\(\)/);
  assert.match(appSection('  function answerReadingCheck(','  function submit('),/stopReadAloud\(\)/);
  assert.match(appSection("  $('reading-reread').addEventListener", "  $('listen-story').hidden"),/stopReadAloud\(\)/);
  assert.match(appSection('  function show(name)','  function setPressed('),/if\(name!=='play'\) stopReadAloud\(\)/);
  assert.match(appSection('  function finishRound(','  function leaveGame('),/stopReadAloud\(\)/);
  assert.match(css,/#feedback-area\[data-reading-stage='quiz'\] #listen-explanation/);
});

test('Aha speech reads the visible prompt and A/B/C labels without hidden school text or answer evidence',()=>{
  const {scope}=speechHarness();
  scope.readingCheck={prompt:'”Jämför de två bollarna.” Vilket svar passar?',why:'HEMLIG FÖRKLARING',correct:'FACIT',
    options:[
      {label:'DOLD SKOLTEXT – Båda är runda',displayLabel:'Båda är runda',correct:true,why:'HEMLIG LEDTRÅD'},
      {label:'DOLD SKOLTEXT – Jag vill leka',displayLabel:'Jag vill leka',correct:false},
      {label:'Jag lägger bollarna i lådan',correct:false}
    ]};
  assert.equal(scope.readingCheckReadAloudText(),'”Jämför de två bollarna.” Vilket svar passar? Alternativ A: Båda är runda. Alternativ B: Jag vill leka. Alternativ C: Jag lägger bollarna i lådan');
  const spoken=scope.readingCheckReadAloudText();
  scope.readingCheck.options.forEach(option=>option.correct=!option.correct);
  scope.readingCheck.why='EN ANNAN FÖRKLARING';
  assert.equal(scope.readingCheckReadAloudText(),spoken,'answer metadata never affects speech');
});

test('Aha speech follows the current option order after a retry',()=>{
  const {scope}=speechHarness();
  scope.readingCheck.options.push(scope.readingCheck.options.shift());
  assert.equal(scope.readingCheckReadAloudText(),'Vilket exempel passar? Alternativ A: Det andra exemplet. Alternativ B: Det tredje exemplet. Alternativ C: Det första exemplet');
  scope.readingCheck.options[0].displayLabel='Den ändrade synliga texten';
  assert.match(scope.readingCheckReadAloudText(),/Alternativ A: Den ändrade synliga texten/);
});

test('Aha speech is empty outside the active question or when no question is available',()=>{
  const cases=[
    ({scope})=>{scope.game=null;},
    ({scope})=>{scope.game.feedback=false;},
    ({scope})=>{scope.screen='home';},
    ({scope})=>{scope.readingCheck=null;},
    ({scope})=>{scope.readingCheck.prompt='';},
    ({scope})=>{scope.readingCheck.options=[];},
    ({$})=>{$('reading-check').hidden=true;},
    ({$})=>{$('reading-check').dataset.complete='true';},
    ({$})=>{$('feedback-area').dataset.readingStage='reread';},
    ({$})=>{$('feedback-area').dataset.readingStage='done';}
  ];
  for(const arrange of cases){
    const harness=speechHarness();arrange(harness);
    assert.equal(harness.scope.readingCheckReadAloudText(),'');
    harness.click('listen-reading-check');
    assert.equal(harness.spoken.length,0);
  }
});

test('explanation speech follows visible examples and open word or school details',()=>{
  const {scope,$}=speechHarness();
  $('explanation-word').textContent='Försiktig';
  $('explanation-definition').textContent='Tänker på vad som kan gå fel';
  $('explanation-example').textContent='Ett annat exempel';
  $('context-aha').hidden=false;$('context-reason').textContent='Den aktuella situationen';
  $('quest-action-solution').hidden=false;$('quest-action-solution-text').textContent='Så fungerar handlingen';
  const outer={open:false},inner={open:true};
  const textNode=(textContent,ancestors=[])=>({textContent,closest(selector){
    assert.equal(selector,'details:not([open])');
    return ancestors.find(details=>!details.open)||null;
  }});
  $('word-teaching').hidden=false;
  $('word-teaching').children=[textNode('Synlig ordförklaring'),textNode('Mer om ordet',[inner,outer])];
  $('school-feedback').hidden=false;
  for(const [id,text] of Object.entries({correction:'Titta på uppgiften igen',explanation:'Därför hör stegen ihop',connection:'Extra vardagskoppling',rule:'Extra skolregel',answer:'Extra exempelsvar'}))$('school-feedback-'+id).textContent=text;
  let text=scope.explanationReadAloudText();
  assert.match(text,/Synlig ordförklaring/);assert.match(text,/Därför hör stegen ihop/);
  assert.match(text,/Den aktuella situationen/);assert.match(text,/Så fungerar handlingen/);
  assert.doesNotMatch(text,/Ett annat exempel|Mer om ordet|Extra /);
  outer.open=true;$('school-feedback-more').open=true;$('explanation-example').hidden=false;
  text=scope.explanationReadAloudText();
  assert.match(text,/Ett annat exempel/);assert.match(text,/Mer om ordet/);
  assert.match(text,/Extra vardagskoppling/);assert.match(text,/Extra skolregel/);assert.match(text,/Extra exempelsvar/);
  inner.open=false;
  assert.doesNotMatch(scope.explanationReadAloudText(),/Mer om ordet/,'a closed nested disclosure is not spoken');
});

test('Aha listening is user initiated, toggles stop, and resets when speech ends',()=>{
  const {scope,$,spoken,calls,click}=speechHarness();
  assert.equal(spoken.length,0);
  click('listen-reading-check');
  assert.equal(spoken.length,1);
  assert.equal(spoken[0].text,scope.readingCheckReadAloudText());
  assert.equal(spoken[0].lang,'sv-SE');
  assert.equal($('listen-reading-check').attributes['aria-pressed'],'true');
  const before=calls.cancel;
  click('listen-reading-check');
  assert.equal(spoken.length,1);assert.ok(calls.cancel>before);
  assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
  click('listen-reading-check');spoken[1].onend();
  assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
  assert.equal($('listen-reading-check').textContent,'🔊 Lyssna på frågan och svaren');
});

test('answering or rereading stops Aha speech, including guided and retry outcomes',()=>{
  for(const [attempts,index] of [[0,1],[0,0],[1,0]]){
    const {scope,$,calls,click}=speechHarness();
    scope.readingCheck.attempts=attempts;
    click('listen-reading-check');const before=calls.cancel;
    scope.answerReadingCheck(index);
    assert.ok(calls.cancel>before);
    assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
    assert.equal($('listen-reading-check').hidden,true);
    assert.equal(scope.readingCheckReadAloudText(),'');
  }
  const {scope,$,calls,click}=speechHarness();
  click('listen-reading-check');const before=calls.cancel;
  click('reading-reread');
  assert.ok(calls.cancel>before);assert.equal(scope.readingCheckReadAloudText(),'');
  assert.equal($('listen-reading-check').hidden,true);
  click('reading-start');
  assert.equal($('listen-reading-check').hidden,false);
});

test('leaving or hiding the page cancels speech and missing browser speech support remains harmless',()=>{
  for(const event of ['pagehide','visibilitychange']){
    const {scope,$,calls,click,events,documentEvents}=speechHarness();
    click('listen-reading-check');const before=calls.cancel;
    if(event==='pagehide')events.pagehide();
    else{scope.document.hidden=true;documentEvents.visibilitychange();}
    assert.ok(calls.cancel>before);
    assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
  }
  const {scope,$,spoken,click}=speechHarness({supported:false});
  assert.equal($('listen-reading-check').hidden,true);
  click('reading-start');assert.equal($('listen-reading-check').hidden,true);
  assert.doesNotThrow(()=>click('listen-reading-check'));
  assert.doesNotThrow(()=>scope.stopReadAloud());
  assert.equal(spoken.length,0);
});

test('new controls do not introduce external assets or break JavaScript parsing',()=>{
  assert.doesNotThrow(()=>new vm.Script(app));
});
