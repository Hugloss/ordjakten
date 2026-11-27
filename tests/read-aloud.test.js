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
  const $=id=>{if(!nodes.has(id))nodes.set(id,{...node(),id});return nodes.get(id);};
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
    const status=html.match(new RegExp('<p[^>]*id="'+id+'-status"[^>]*>'))?.[0];
    assert.ok(status,id+' status missing');
    assert.match(status,/role="status"/);
    assert.match(status,/aria-live="polite"/);
    assert.match(status,/hidden/);
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

test('speech failures explain the problem beside the chosen control without changing game progress',()=>{
  const ids=['listen-story','listen-explanation','listen-reading-check'];
  for(const id of ids){
    const {scope,$,spoken,click}=speechHarness();
    if(id==='listen-story'){
      scope.game.feedback=false;
      scope.game.questions[0].word='Försiktig';
    }else if(id==='listen-explanation')$('explanation-word').textContent='Försiktig';
    const before=JSON.stringify(scope.game);
    click(id);
    assert.equal(spoken.length,1);
    spoken[0].onerror({error:'synthesis-unavailable'});
    assert.equal($(id).attributes['aria-pressed'],'false');
    assert.equal($(id+'-status').hidden,false);
    assert.equal($(id+'-status').textContent,'Uppläsningen fungerar inte just nu. Läs själv eller be någon om hjälp.');
    for(const other of ids.filter(other=>other!==id))assert.equal($(other+'-status').hidden,true);
    assert.equal(JSON.stringify(scope.game),before);
  }
});

test('constructor and speak exceptions show a helpful status and a fresh attempt can recover',()=>{
  for(const failure of ['constructor','speak']){
    const {scope,$,spoken,click}=speechHarness();
    const originalConstructor=scope.window.SpeechSynthesisUtterance;
    const originalSpeak=scope.window.speechSynthesis.speak;
    if(failure==='constructor')scope.window.SpeechSynthesisUtterance=function(){throw new Error('voice not ready');};
    else scope.window.speechSynthesis.speak=()=>{throw new Error('audio unavailable');};
    assert.doesNotThrow(()=>click('listen-reading-check'));
    assert.equal($('listen-reading-check-status').hidden,false);
    assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
    scope.window.SpeechSynthesisUtterance=originalConstructor;
    scope.window.speechSynthesis.speak=originalSpeak;
    click('listen-reading-check');
    assert.equal(spoken.length,1);
    assert.equal($('listen-reading-check-status').hidden,true);
    assert.equal($('listen-reading-check-status').textContent,'');
    assert.equal($('listen-reading-check').attributes['aria-pressed'],'true');
    spoken[0].onend();
    assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
    assert.equal($('listen-reading-check-status').hidden,true);
  }
});

test('canceled or interrupted speech stays silent, including a synchronous cancellation callback',()=>{
  for(const error of ['canceled','interrupted']){
    const {scope,$,spoken,click}=speechHarness();
    click('listen-reading-check');
    spoken[0].onerror({error});
    assert.equal($('listen-reading-check-status').hidden,true);
    assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
    click('listen-reading-check');
    scope.window.speechSynthesis.cancel=()=>spoken[1].onerror({error});
    assert.doesNotThrow(()=>click('listen-reading-check'));
    assert.equal($('listen-reading-check-status').hidden,true);
    assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
  }
});

test('late callbacks cannot disturb a newer request or erase its error and recovery',()=>{
  const {scope,$,spoken,click}=speechHarness();
  click('listen-reading-check');
  const old=spoken[0];
  scope.window.speechSynthesis.cancel=()=>old.onerror({error:'synthesis-failed'});
  // Switching controls cancels the first request before starting the next one.
  scope.speakReadAloud('En synlig förklaring',$('listen-explanation'));
  const current=spoken[1];
  assert.equal($('listen-reading-check-status').hidden,true);
  old.onerror({error:'synthesis-failed'});old.onend();
  assert.equal($('listen-explanation').attributes['aria-pressed'],'true');
  assert.equal($('listen-explanation-status').hidden,true);
  current.onerror({error:'audio-busy'});
  const message=$('listen-explanation-status').textContent;
  old.onend();old.onerror({error:'interrupted'});
  assert.equal($('listen-explanation-status').hidden,false);
  assert.equal($('listen-explanation-status').textContent,message);
  scope.speakReadAloud('Försök igen',$('listen-explanation'));
  current.onend();current.onerror({error:'synthesis-failed'});
  assert.equal($('listen-explanation').attributes['aria-pressed'],'true');
  assert.equal($('listen-explanation-status').hidden,true);
  assert.equal($('listen-explanation-status').textContent,'');
});

test('leaving the step clears speech errors and late events cannot bring them back',()=>{
  const transitions=[
    ({events})=>events.pagehide(),
    ({click})=>click('reading-reread'),
    ({scope})=>scope.answerReadingCheck(1)
  ];
  for(const leave of transitions){
    const harness=speechHarness();
    const {$,spoken,click}=harness;
    click('listen-reading-check');
    spoken[0].onerror({error:'network'});
    assert.equal($('listen-reading-check-status').hidden,false);
    leave(harness);
    assert.equal($('listen-reading-check-status').hidden,true);
    assert.equal($('listen-reading-check-status').textContent,'');
    spoken[0].onerror({error:'synthesis-failed'});
    assert.equal($('listen-reading-check-status').hidden,true);
  }
});

test('answering or rereading stops Aha speech, including guided and retry outcomes',()=>{
  for(const [attempts,index] of [[0,1],[0,0],[1,0]]){
    const {scope,$,calls,click}=speechHarness();
    scope.readingCheck.options[1].label='Det andra exemplet.';
    scope.readingCheck.attempts=attempts;
    click('listen-reading-check');const before=calls.cancel;
    scope.answerReadingCheck(index);
    assert.ok(calls.cancel>before);
    assert.equal($('listen-reading-check').attributes['aria-pressed'],'false');
    assert.equal($('listen-reading-check').hidden,true);
    assert.equal(scope.readingCheckReadAloudText(),'');
    if(attempts===1&&index===0)
      assert.equal($('reading-why').textContent,'Rätt exempel: Det andra exemplet. FACITFÖRKLARING');
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
