'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../public/js/recall');
const L=require('../public/js/learning-map');
const E=require('../public/js/engine');
const D=require('../public/js/adaptive');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');
const contexts=require('../public/data/word-contexts.json');
const catalog=L.catalog(bank,expressions,contexts);
const NOW=1780000000000,DAY=R.DAY;
const word=catalog.find(x=>x.name==='Skrovlig');
const phrase=catalog.find(x=>x.kind==='expression');
const fresh=(item,stage=1)=>({stage,matched:true,helped:false});
const observation=(p,item,outcome,now=NOW)=>R.record(p,catalog,item.id,outcome,now);
const known=item=>({skillProgress:D.record({},{
  id:item.id,kind:item.kind,taskType:'meaning'},'right',NOW-1)});
test('all 162 targets have prompts with no exposed complete answer; exact authored examples only',()=>{
  let clozes=0;
  for(const item of catalog){
    const question=R.task(item);
    assert.ok(question,item.id);
    assert.equal(question.answer,item.name);
    assert.equal(R.mask(question.definition,question.answer).count,0);
    assert.equal(R.mask(question.cloze,question.answer).count,0);
    if(question.cloze){
      clozes++;
      assert.equal(R.mask(item.example,item.name).count,1);
      assert.equal(question.cloze,R.mask(item.example,item.name).text);
    }
    assert.ok(R.match(question,item.name.toLocaleLowerCase('sv-SE')));
    assert.ok(R.letters(question));
    assert.equal(R.prompt(question,2).cloze,'');
    assert.equal(R.prompt(question,1).letters,'');
    assert.ok(R.prompt(question,0).letters);
  }
  assert.equal(catalog.length,162);
  assert.ok(clozes>0&&clozes<catalog.length);
  const inflected=catalog.find(item=>item.name==='Genomskinlig');
  assert.equal(R.task(inflected).cloze,'','Never rewrite the inflected example');
  const leak=catalog.find(item=>item.name==='Surrande');
  assert.equal(R.task(leak).definitionMasked,true);
});
test('typed answers normalize case, Unicode composition, whitespace and sentence punctuation only',()=>{
  assert.ok(R.match(R.task(phrase),'  FÖR  EN GÅNGS SKULL. '));
  assert.ok(R.match(R.task(phrase),'fo\u0308r en ga\u030angs skull'));
  assert.equal(R.match(R.task(phrase),'for en gangs skull'),false);
  assert.equal(R.match(R.task(word),'skrovligt'),false);
  assert.equal(R.match(R.task(word),'ojämn'),false);
  assert.equal(R.match(R.task(word),'skrovlig '+ ' '.repeat(200)+'other'),false);
  assert.equal(R.match(R.task(word),'   '),false);
});
test('automatic rounds require previous evidence or voluntary recall; pictures alone do not qualify',()=>{
  assert.equal(R.plan(catalog,{},NOW).round.length,0);
  assert.equal(R.plan(catalog,known(word),NOW).round[0].id,word.id);
  const img={id:word.id,kind:'word',picture:true};
  const pictureOnly={skillProgress:D.record({},img,'right',NOW)};
  assert.equal(R.plan(catalog,pictureOnly,NOW).round.length,0);
  const mission={missionProgress:{[phrase.id]:['sentence']}};
  assert.equal(R.plan(catalog,mission,NOW).round[0].id,phrase.id);
  const recallProgress=observation({},word,{...fresh(word),previewed:true});
  assert.equal(R.plan(catalog,{recallProgress},NOW+DAY).round[0].id,word.id);
});
test('short rounds respect waiting, do not pad, and prefer assisted over direct repeats',()=>{
  const one=known(word);
  assert.equal(R.plan(catalog,one,NOW).round.length,1);
  let skillProgress={};
  const candidates=catalog.slice(0,8);
  for(const item of candidates)skillProgress=D.record(skillProgress,{
    id:item.id,kind:item.kind,taskType:'meaning'},'right',NOW-1);
  let recallProgress=observation({},candidates[0],fresh(candidates[0]));
  recallProgress=observation(recallProgress,candidates[1],{stage:1,matched:false,helped:true});
  const p=R.plan(catalog,{skillProgress,recallProgress},NOW+DAY-1);
  assert.equal(p.waiting.length,2);
  assert.equal(p.ready.length,6);
  assert.equal(p.round.length,3);
  assert.equal(new Set(p.round.map(row=>row.id)).size,3);
  const next=R.plan(catalog,{skillProgress,recallProgress},NOW+DAY);
  assert.equal(next.round[0].id,candidates[1].id);
  assert.equal(next.ready.at(-1).id,candidates[0].id);
});
test('direct cloze success reduces support; reveal or extra hint restores support',()=>{
  let p=observation({},word,fresh(word));
  assert.equal(p[word.id].stage,2);
  assert.equal(p[word.id].direct,1);
  assert.equal(p[word.id].assisted,0);
  const before=p;
  p=observation(p,word,{stage:2,matched:true,helped:true},NOW+DAY-1);
  assert.equal(p,before,'same-day practice cannot add another observation');
  p=observation(p,word,{stage:2,matched:true,helped:true},NOW+DAY);
  assert.equal(p[word.id].stage,0);
  assert.equal(p[word.id].direct,1);
  assert.equal(p[word.id].assisted,1);
  p=observation(p,word,{stage:0,matched:true,helped:true},NOW+2*DAY);
  assert.equal(p[word.id].stage,1);
  assert.equal(p[word.id].direct,1);
  p=observation(p,word,{stage:1,matched:false,helped:false},NOW+3*DAY);
  assert.equal(p[word.id].stage,0);
  assert.equal(p[word.id].direct,1);
  assert.equal(p[word.id].assisted,3);
});
test('a named card already exposed the answer, so success never becomes cold recall',()=>{
  let p=observation({},word,{...fresh(word),previewed:true});
  assert.equal(p[word.id].direct,0);
  assert.equal(p[word.id].stage,1);
  assert.equal(p[word.id].assisted,1);
  p=observation(p,word,fresh(word),NOW+DAY);
  assert.equal(p[word.id].stage,2);
  p=observation(p,word,{stage:2,matched:false,helped:true,previewed:true},NOW+2*DAY);
  assert.equal(p[word.id].stage,2);
  assert.equal(p[word.id].direct,1);
  assert.equal(p[word.id].assisted,2);
});
test('recall history bounds records, drops unknown concepts and never retains input or examples',()=>{
  const raw={[word.id]:{direct:123456,assisted:1,stage:99,lastAt:NOW,last:'direct',
    answer:'some private text',rawInput:'other',definition:'secret'},
    'sv-999999':{direct:1,stage:1,lastAt:NOW},'__proto__':{direct:10}};
  const safe=R.sanitize(raw,catalog);
  assert.deepEqual(Object.keys(safe),[word.id]);
  assert.equal(safe[word.id].direct,9999);
  assert.equal(safe[word.id].stage,2);
  assert.deepEqual(Object.keys(safe[word.id]).sort(),['assisted','direct','last','lastAt','stage']);
  const p=observation({},word,{...fresh(word),input:'not saved'});
  assert.equal(JSON.stringify(p).includes('not saved'),false);
  assert.deepEqual(R.sanitize(E.sanitizeHistory({recallProgress:p}).recallProgress,catalog),p);
  assert.deepEqual(Object.keys(R.sanitize(E.sanitizeHistory(null).recallProgress,catalog)),[]);
  assert.equal(observation(p,word,{stage:0,matched:true,helped:false},NOW+DAY),p);
});
test('recall neither fabricates normal skills nor affects scored question results',()=>{
  const history=known(word);
  const before=JSON.stringify(history);
  const p=observation({},word,fresh(word));
  assert.equal(JSON.stringify(history),before);
  assert.equal(E.score({[word.id]:'right'},1).right,1);
  assert.equal(R.plan(catalog,{...history,recallProgress:p},NOW).round.length,0);
  assert.equal(L.profile(word,{skillProgress:history.skillProgress,types:['meaning','reverse']}).facets
    .find(row=>row.id==='recognition').state,'new');
});
