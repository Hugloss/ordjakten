'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const E=require('../public/js/engine'),L=require('../public/js/learning-map'),
  A=require('../public/js/adaptive'),F=require('../public/js/focus-practice'),
  K=require('../public/js/contrast'),Reading=require('../public/js/reading-check'),
  Aha=require('../public/js/aha-plan'),Recall=require('../public/js/recall'),
  Journey=require('../public/js/next-adventure'),Concepts=require('../public/js/concepts'),
  Bridges=require('../public/js/bridges'),Detector=require('../public/js/detector'),
  Workshop=require('../public/js/workshop');
const bank=require('../public/data/ordbank.json'),expressions=require('../public/data/expressions.json'),
  contexts=require('../public/data/word-contexts.json'),missions=require('../public/data/missions.json'),
  surprises=require('../public/data/surprises.json'),contrasts=require('../public/data/contrasts.json'),
  clues=require('../public/data/clue-ladder.json');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/data/curation.js'),'utf8'),scope);
const curation=scope.window.ORDJAKTEN_CURATION;
const catalog=L.catalog(bank,expressions,contexts,curation),byId=new Map(catalog.map(item=>[item.id,item]));
const everyday=new Set(catalog.filter(item=>item.everyday).map(item=>item.id));
const extension=catalog.filter(item=>!item.everyday),known=new Set(catalog.map(item=>item.id));
const conceptContent=Concepts.catalog(catalog),bridgeContent=Bridges.catalog(catalog,conceptContent);
const detectorContent=Detector.catalog(catalog,contrasts).concat(Detector.advancedCatalog(catalog,contrasts,clues));
const NOW=1780000000000,DAY=Recall.DAY,SEEDS=[1,37,903];
const clone=value=>JSON.parse(JSON.stringify(value));
function random(seed){
  let state=seed>>>0;
  return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
}
function assertEveryday(ids,message){
  for(const id of ids)assert.ok(everyday.has(id),message+': '+id);
}
function legacyHistory(){
  const history={mistakes:{},reviewProgress:{},skillProgress:{},recallProgress:{},readingProgress:{}};
  for(const item of catalog){
    history.mistakes[item.id]=3;
    history.reviewProgress[item.id]={streak:0,dueAt:NOW-DAY,lastVariant:'meaning'};
    const question={id:item.id,kind:item.kind,taskType:'meaning'};
    history.skillProgress=A.record(history.skillProgress,question,'right',NOW-3*DAY);
    history.skillProgress=A.record(history.skillProgress,question,'wrong',NOW-2*DAY);
    history.recallProgress=Recall.record(history.recallProgress,catalog,item.id,
      {stage:1,matched:false,helped:true},NOW-2*DAY);
    history.readingProgress=Reading.recordProgress(history.readingProgress,item.id,
      item.kind==='word'?'context':'expression','guided',NOW-2*DAY,
      item.kind==='word'?'context:0':'expression:challenge');
  }
  return history;
}
const history=legacyHistory();
const ahaOptions={bank,expressions,contexts,missions,surprises,reading:Reading,curation,now:NOW};

test('the child selection covers 101 words and 59 expressions while all extension content stays addressable',()=>{
  assert.deepEqual(E.validateSelection(curation,bank,expressions,contexts),[]);
  assert.equal(catalog.length,188);
  assert.equal(catalog.filter(item=>item.kind==='word'&&item.everyday).length,101);
  assert.equal(catalog.filter(item=>item.kind==='expression'&&item.everyday).length,59);
  assert.equal(curation.extensionWords.length,20);
  assert.equal(curation.extensionExpressions.length,8);
  assert.equal(curation.hardWords.length,25);
  const ordinaryWords=new Set(['easy','medium','hard'].flatMap(level=>E.getPool(bank,curation,level).map(w=>w.id)));
  assert.equal(ordinaryWords.size,101);
  assertEveryday(ordinaryWords,'ordinary word pool');
  const school=expressions.expressions.filter(item=>item.category==='school-instruction');
  assert.equal(school.length,14);
  const schoolPool=E.getTopicPool(bank,curation,expressions,{topic:'expressions',difficulty:'medium',schoolOnly:true});
  assert.deepEqual(new Set(schoolPool.map(item=>item.entry.id)),new Set(school.map(item=>item.id)));
  const extendedPool=new Set(E.getTopicPool(bank,curation,expressions,{topic:'mixed',difficulty:'exam'}).map(item=>item.entry.id));
  for(const item of extension){
    assert.ok(extendedPool.has(item.id),item.id+' is available in the explicit extension level');
    const source=item.kind==='word'?bank.words.find(w=>w.id===item.id):expressions.expressions.find(e=>e.id===item.id);
    const question=item.kind==='word'?E.makeQuestion(source,bank,curation,'exam',random(37)):
      E.makeExpressionQuestion(source,'exam',random(37));
    assert.equal(question.options.length,5);
    assert.equal(question.options.filter(option=>option.correct).length,1);
    assert.ok(Recall.task(item),item.id+' remains available as a named recall task');
    assert.ok(Aha.option(item,{},ahaOptions),item.id+' remains available as a named Aha task');
  }
});

test('ordinary targets, meaning alternatives, reverse alternatives and authored context alternatives use the same selection',()=>{
  const definitions=new Map(bank.words.map(item=>[item.definition,item.id]));
  const names=new Map(bank.words.map(item=>[item.word,item.id]));
  for(const seed of SEEDS){
    for(const level of ['easy','medium','hard']){
      const pool=E.getPool(bank,curation,level);
      for(const entry of pool){
        assert.ok(everyday.has(entry.id));
        const question=E.makeQuestion(entry,bank,curation,level,random(seed));
        assert.equal(question.options.length,4);
        assert.equal(question.options.filter(option=>option.correct).length,1);
        if(!question.picture)assertEveryday(question.options.map(option=>definitions.get(option.label)),'meaning alternatives');
        const reversed=E.makeReverseQuestion(entry,bank,curation,level,random(seed));
        assertEveryday(reversed.options.map(option=>names.get(option.label)),'reverse alternatives');
      }
      const round=E.generateRound(bank,curation,
        {...E.DEFAULT_STATE.settings,topic:'mixed',difficulty:level,count:25,mode:'train',contextMix:true},
        history.mistakes,random(seed),expressions,missions,null,NOW,contexts);
      assert.ok(round.length>0);
      assertEveryday(round.map(question=>question.id),'mixed round');
    }
    for(const row of contexts.wordContexts.filter(row=>everyday.has(row.id))){
      assertEveryday(row.distractors,'authored distractor allowlist');
      const word=bank.words.find(item=>item.id===row.id);
      for(let scene=0;scene<3;scene++){
        const question=E.makeContextQuestion(word,bank,contexts,random(seed),scene);
        assertEveryday(question.options.map(option=>names.get(option.label)),'context alternatives');
      }
    }
  }
});

test('ambiguous emotion, temperature and motion icons move to text without losing the underlying words',()=>{
  const reviewed=['sv-0005','sv-0020','sv-0058','sv-0060','sv-0061','sv-0062','sv-0063','sv-0064','sv-0069','sv-0070'];
  const pictures=new Set(E.getPool(bank,curation,'easy').map(item=>item.id));
  const textPool=new Set(E.getPool(bank,curation,'medium').map(item=>item.id));
  for(const id of reviewed){
    assert.equal(pictures.has(id),false,id+' must not infer an unseen state from a generic icon');
    assert.ok(byId.has(id),id+' remains in the complete catalog');
    if(everyday.has(id)){
      assert.ok(textPool.has(id));
      assert.equal(E.makeQuestion(bank.words.find(item=>item.id===id),bank,curation,'medium',random(1)).picture,false);
    }
  }
});

test('editorial validation rejects missing identities, duplicate rules and extension words reintroduced through answer choices',()=>{
  const missing=clone(curation);missing.extensionWords.push('sv-9999');
  assert.ok(E.validateSelection(missing,bank,expressions,contexts).length);
  const duplicate=clone(curation);duplicate.extensionExpressions.push(duplicate.extensionExpressions[0]);
  assert.ok(E.validateSelection(duplicate,bank,expressions,contexts).length);
  const hard=clone(curation);hard.hardWords.push(hard.extensionWords[0]);
  assert.ok(E.validateSelection(hard,bank,expressions,contexts).length);
  const school=clone(curation);school.extensionExpressions.push(expressions.expressions.find(e=>e.category==='school-instruction').id);
  assert.ok(E.validateSelection(school,bank,expressions,contexts).length);
  const changed=clone(contexts),row=changed.wordContexts.find(item=>everyday.has(item.id));
  row.distractors[0]=curation.extensionWords[0];
  assert.ok(E.validateSelection(curation,bank,expressions,changed).length);
});

test('old mistakes and assisted recall do not put extension content back into automatic Aha or recall queues',()=>{
  const before=JSON.stringify(history);
  for(const seed of SEEDS){
    const recall=Recall.plan(catalog,history,NOW);
    const aha=Aha.plan(history.readingProgress,{...ahaOptions,random:random(seed)});
    assert.equal(recall.ready.length,160);
    assert.equal(aha.ready.length,160);
    assertEveryday(recall.ready.map(item=>item.id),'automatic recall');
    assertEveryday(aha.ready.map(item=>item.id),'automatic Aha');
  }
  const saved=E.sanitizeHistory(history);
  const recall=Recall.sanitize(saved.recallProgress,catalog),reading=Reading.sanitizeProgress(saved.readingProgress);
  for(const item of extension){
    assert.equal(saved.mistakes[item.id],history.mistakes[item.id]);
    assert.ok(recall[item.id],item.id+' retains its recall history');
    assert.ok(reading[item.id],item.id+' retains its Aha history');
  }
  assert.equal(JSON.stringify(history),before);
});

test('concept, bridge and detective planners exclude extension participants automatically but permit a named activity',()=>{
  const groups=new Map(conceptContent.groups.map(group=>[group.id,group]));
  const participants={
    concept:task=>[...groups.get(task.groupId).words.map(word=>word.id),...task.options.map(option=>option.id)],
    bridge:task=>[...groups.get(task.groupId).words.map(word=>word.id),...task.participants],
    detector:task=>task.words.map(word=>word.id)
  };
  for(const [kind,tasks] of [['concept',conceptContent.tasks],['bridge',bridgeContent.tasks],['detector',detectorContent]]){
    assert.ok(tasks.some(task=>!participants[kind](task).every(id=>everyday.has(id))),kind+' has a real extension case');
    for(const task of tasks){
      assert.equal(typeof task.everyday,'boolean',kind+': '+task.id);
      if(!participants[kind](task).every(id=>everyday.has(id)))
        assert.equal(task.everyday,false,kind+' must include every alternative and group member: '+task.id);
    }
  }
  let conceptProgress={},bridgeProgress={},detectorProgress={};
  for(const task of conceptContent.tasks)conceptProgress=Concepts.record(conceptProgress,conceptContent.tasks,task.id,'supported',NOW-2*DAY);
  for(const task of bridgeContent.tasks)bridgeProgress=Concepts.record(bridgeProgress,bridgeContent.tasks,task.id,'supported',NOW-2*DAY);
  for(const task of detectorContent.filter(task=>task.level===1))
    detectorProgress=Detector.record(detectorProgress,detectorContent,task.id,{word:'helped',clue:'supported'},NOW-2*DAY);
  const before=JSON.stringify({conceptProgress,bridgeProgress,detectorProgress});
  for(const seed of SEEDS){
    const plans={
      concept:Concepts.plan(conceptContent,conceptProgress,known,NOW,random(seed)),
      bridge:Bridges.plan(bridgeContent,bridgeProgress,known,NOW,random(seed)),
      detector:Detector.plan(detectorContent,detectorProgress,known,NOW,random(seed))
    };
    for(const [kind,plan] of Object.entries(plans)){
      assert.ok(plan.round.length>0,kind+' still has playable everyday tasks');
      for(const task of plan.available){
        assert.equal(task.everyday,true,kind+' respects its editorial eligibility: '+task.id);
        assertEveryday(participants[kind](task),kind+' automatic participants');
      }
    }
  }
  const concept=conceptContent.tasks.find(task=>task.everyday===false);
  assert.ok(Concepts.plan(conceptContent,conceptProgress,known,NOW,random(1),concept.groupId).available.some(task=>task.id===concept.id));
  const bridge=bridgeContent.tasks.find(task=>task.everyday===false);
  assert.ok(Bridges.plan(bridgeContent,bridgeProgress,known,NOW,random(1),{groupId:bridge.groupId}).available.some(task=>task.id===bridge.id));
  const detector=detectorContent.find(task=>task.everyday===false&&task.level===1);
  assert.ok(Detector.plan(detectorContent,detectorProgress,known,NOW,random(1),detector.target).available.some(task=>task.id===detector.id));
  assert.equal(JSON.stringify({conceptProgress,bridgeProgress,detectorProgress}),before);
});

test('workshop recommendations cannot introduce an extension word through the other half of a comparison',()=>{
  const mixedPair=contrasts.pairs.find(pair=>everyday.has(pair.left)!==everyday.has(pair.right));
  assert.ok(mixedPair,'the actual bank includes a comparison crossing the selection boundary');
  const item=byId.get(everyday.has(mixedPair.left)?mixedPair.left:mixedPair.right);
  const narrowHistory={recallProgress:{[item.id]:history.recallProgress[item.id]}};
  for(const seed of SEEDS){
    const picked=Workshop.pick(catalog,contrasts,narrowHistory,candidate=>candidate.id===item.id,random(seed));
    assert.ok(picked);
    assert.ok(everyday.has(picked.id));
    assert.notEqual(picked.id,item.id,'the everyday target must not smuggle in its extension partner');
    const pair=K.findPair(picked.id,contrasts);
    if(pair)assertEveryday([pair.left,pair.right],'workshop comparison');
  }
  assert.ok(Workshop.plan(item,catalog,contrasts,random(1)),'a named comparison remains accessible');
  assert.ok(Workshop.plan(extension[0],catalog,contrasts,random(1)),'a named extension word remains accessible');
});

test('focused practice does not recommend an extension comparison as its next skill',()=>{
  const pair=contrasts.pairs.find(candidate=>everyday.has(candidate.left)!==everyday.has(candidate.right));
  const id=everyday.has(pair.left)?pair.left:pair.right;
  const progress={[id]:{skills:{contrast:{attempts:3,wrong:3,streak:0,lastAt:NOW}}}};
  const before=JSON.stringify(progress);
  const make=skill=>F.create(id,skill,bank,curation,expressions,missions,contexts,E,progress,random(37),K,contrasts);
  for(const skill of [null,'meaning','context']){
    const plan=make(skill);
    assert.notEqual(plan.chosen,'contrast');
    assert.ok(!plan.types.includes('contrast'),'the follow-up button must not offer the extension partner');
    assertEveryday(plan.questions.map(question=>question.id),'focused questions');
  }
  const explicit=make('contrast');
  assert.equal(explicit.chosen,'contrast');
  assert.ok(explicit.questions.some(question=>!everyday.has(question.id)),'a deliberately requested comparison remains available');
  assert.equal(JSON.stringify(progress),before);
});

test('the recommended adventure stays within the everyday selection even with complete older progress',()=>{
  const before=JSON.stringify(history);
  const types=item=>F.supported(F.findItem(item.id,bank,expressions),curation,contexts,missions,K,contrasts);
  for(const seed of SEEDS){
    const rnd=random(seed),plan=Journey.build({catalog,history,knownIds:known,now:NOW,random:rnd,
      focusTypes:types,pairFor:item=>K.findPair(item.id,contrasts),conceptContent,
      aha:Aha.plan(history.readingProgress,{...ahaOptions,random:rnd}),
      recall:Recall.plan(catalog,history,NOW),
      detector:{...Detector.plan(detectorContent,{},known,NOW,rnd),catalog:detectorContent},
      concept:Concepts.plan(conceptContent,{},known,NOW,rnd),
      bridge:{...Bridges.plan(bridgeContent,{},known,NOW,rnd),catalog:bridgeContent.tasks}});
    assert.ok(plan.steps.length>0);
    for(const step of plan.steps)assertEveryday(step.words,'recommended '+step.mode);
  }
  const rare=extension[0];
  const staleAha=Aha.option(rare,history.readingProgress,ahaOptions);
  const onlyExtension=Journey.build({catalog:extension,history,knownIds:known,now:NOW,random:random(37),
    focusTypes:()=>['meaning'],pairFor:()=>null,aha:{ready:[staleAha]},
    recall:{ready:[{id:rare.id,dueAt:0,card:{last:'assisted'}}]}});
  assert.equal(onlyExtension.steps.length,0,'a stale queued extension task cannot bypass the adventure selection');
  assert.equal(JSON.stringify(history),before);
});
