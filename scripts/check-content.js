'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const E=require('../public/js/engine');
const Comics=require('../public/js/comics');
const Surprises=require('../public/js/surprises');
const Missions=require('../public/js/missions');
const Contrast=require('../public/js/contrast');
const Clues=require('../public/js/clue-ladder');
const root=path.resolve(__dirname,'../public');
function readBrowserScript(name,property){
  const ctx={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(root,name),'utf8'),ctx,{filename:name});
  return ctx.window[property];
}
const bank=JSON.parse(fs.readFileSync(path.join(root,'data/ordbank.json'),'utf8'));
const browserBank=readBrowserScript('data/wordbank.js','ORDJAKTEN_WORDS');
const expressionBank=JSON.parse(fs.readFileSync(path.join(root,'data/expressions.json'),'utf8'));
const browserExpressions=readBrowserScript('data/expressions.js','ORDJAKTEN_EXPRESSIONS');
const comics=JSON.parse(fs.readFileSync(path.join(root,'data/comics.json'),'utf8'));
const browserComics=readBrowserScript('data/comics.js','ORDJAKTEN_COMICS');
const surprises=JSON.parse(fs.readFileSync(path.join(root,'data/surprises.json'),'utf8'));
const browserSurprises=readBrowserScript('data/surprises.js','ORDJAKTEN_SURPRISES');
const missions=JSON.parse(fs.readFileSync(path.join(root,'data/missions.json'),'utf8'));
const browserMissions=readBrowserScript('data/missions.js','ORDJAKTEN_MISSIONS');
const wordContexts=JSON.parse(fs.readFileSync(path.join(root,'data/word-contexts.json'),'utf8'));
const browserContexts=readBrowserScript('data/word-contexts.js','ORDJAKTEN_CONTEXTS');
const contrasts=JSON.parse(fs.readFileSync(path.join(root,'data/contrasts.json'),'utf8'));
const browserContrasts=readBrowserScript('data/contrasts.js','ORDJAKTEN_CONTRASTS');
const clueLadder=JSON.parse(fs.readFileSync(path.join(root,'data/clue-ladder.json'),'utf8'));
const browserClues=readBrowserScript('data/clue-ladder.js','ORDJAKTEN_CLUES');
const curation=readBrowserScript('data/curation.js','ORDJAKTEN_CURATION');
const issues=E.validateBank(bank).concat(E.validateExpressions(expressionBank),Comics.validate(comics,expressionBank),Surprises.validate(surprises,expressionBank),Missions.validate(missions,expressionBank));
if(JSON.stringify(surprises)!==JSON.stringify(browserSurprises))issues.push('Surprise JS/JSON diverged');
if(JSON.stringify(missions)!==JSON.stringify(browserMissions))issues.push('Missions JS/JSON diverged');
if(JSON.stringify(wordContexts)!==JSON.stringify(browserContexts))issues.push('Contexts JS/JSON diverged');
if(JSON.stringify(contrasts)!==JSON.stringify(browserContrasts))issues.push('Contrasts JS/JSON diverged');
if(JSON.stringify(clueLadder)!==JSON.stringify(browserClues))issues.push('Clues JS/JSON diverged');
issues.push(...Clues.validate(clueLadder,contrasts,bank));
issues.push(...Contrast.validate(contrasts,bank));
issues.push(...E.validateContexts(wordContexts,bank,curation));
if(wordContexts.wordContexts.length!==43||wordContexts.wordContexts.reduce((n,x)=>n+x.scenes.length,0)!==129)issues.push('Missing authored context scenes');
if(JSON.stringify(comics)!==JSON.stringify(browserComics))issues.push('Comic JS/JSON diverged');
for(const [emoji,image] of Object.entries(comics.iconPaths)) {
  const filepath=path.join(root,image.slice(2));
  if(!fs.existsSync(filepath) || !fs.readFileSync(filepath).subarray(1,4).equals(Buffer.from('PNG')))issues.push('Missing or invalid comic picture: '+emoji);
}
if(expressionBank.expressions.length!==31)issues.push('Expected 31 curated expressions');
if(JSON.stringify(expressionBank)!==JSON.stringify(browserExpressions))issues.push('Expression JS/JSON bank diverged');
function fail(msg){issues.push(msg);}
if(bank.words.length!==121)fail(`Expected 121 historical words, found ${bank.words.length}`);
if(JSON.stringify(browserBank.words)!==JSON.stringify(bank.words))fail('Browser bank and JSON export differ');
const byId=new Map(bank.words.map(x=>[x.id,x]));
for(const [id,decoys] of Object.entries(curation.easy)){
  const w=byId.get(id);
  if(!w || w.difficulty!=='easy' || !w.illustration)fail('Invalid curated easy ID '+id);
  if(decoys.length!==3)fail('Requires 3 image decoys '+id);
  if(new Set([w.illustration.value,...decoys.map(x=>x[0])]).size!==4)fail('Duplicated emoji in '+id);
  for(const pair of decoys)if(!Array.isArray(pair)||pair.length!==2||!pair[0]||!pair[1])fail('Malformed image decoy in '+id);
}
if(curation.easy['sv-0044'] || curation.easy['sv-0001'] || curation.easy['sv-0041'])fail('Ambiguous illustration made it into easy mode');
for(const [level,min] of [['easy',25],['medium',25],['hard',25],['exam',10]]){
  const pool=E.getPool(bank,curation,level);
  if(pool.length<min)fail('Too few questions for '+level+': '+pool.length);
  for(const q of pool){
    try{
      const question=E.makeQuestion(q,bank,curation,level,()=>0.427);
      const count=level==='exam'?5:4;
      if(question.options.length!==count || question.options.filter(x=>x.correct).length!==1)fail('Invalid answers for '+q.word);
      if(new Set(question.options.map(x=>x.label)).size!==count)fail('Duplicate label for '+q.word);
    }catch(error){fail(q.id+': '+error.message);}
  }
}
for(const level of ['easy','medium','hard','exam']){
 for(const topic of ['expressions','mixed']){
  try{const round=E.generateRound(bank,curation,{difficulty:level,topic,count:25},{},()=>0.427,expressionBank);
   if(round.length!==25 || new Set(round.map(q=>q.id)).size!==25 || round.some(q=>q.options.filter(o=>o.correct).length!==1))
     fail('Invalid round for '+topic+' / '+level);
  }catch(error){fail(topic+' / '+level+': '+error.message);}
 }
}
if(issues.length){process.stderr.write(issues.map(x=>'✗ '+x).join('\n')+'\n');process.exitCode=1;}
else process.stdout.write('✓ 121 words + 31 expressions + 129 everyday scenes + 96 comparisons + 64 inference scenes across four pairs + 31 comics and 93 task variations validated.\n');
