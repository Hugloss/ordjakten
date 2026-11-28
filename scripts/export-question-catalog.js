/* Search and export independently owned authored question banks.
 * The source files remain canonical; no duplicated question catalog is checked in.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const fromPublic=file=>require(path.join(root,'public',file));
function curation(){
  const sandbox={window:{}};
  const file=fs.readFileSync(path.join(root,'public/data/curation.js'),'utf8');
  vm.runInNewContext(file,sandbox,{filename:'curation.js'});
  return sandbox.window.ORDJAKTEN_CURATION;
}
function open(bankId){
  const Registry=fromPublic('js/question-platform');
  const registry=Registry.createRegistry();
  let provider;
  if(bankId==='svenska'){
    const Catalog=fromPublic('js/banks/svenska-catalog');
    provider=Catalog.fromSources({
      expressions:fromPublic('data/expressions.json'),
      missions:fromPublic('data/missions.json'),
      words:fromPublic('data/ordbank.json'),
      contexts:fromPublic('data/word-contexts.json'),
      curation:curation(),
      contrasts:fromPublic('data/contrasts.json'),
      clues:fromPublic('data/clue-ladder.json'),
      surprises:fromPublic('data/surprises.json'),
      portals:fromPublic('js/mission-portals-data'),
      treasure:fromPublic('js/treasure-hunt-data'),
      worldMissions:fromPublic('js/world-missions'),
      actionWords:fromPublic('js/action-words')
    });
  }else if(bankId==='vardagskunskap'){
    provider=fromPublic('js/banks/vardagskunskap').fromAuthored(
      fromPublic('data/vardagskunskap.js'));
  }else throw new Error('Unknown subject bank: '+bankId);
  registry.register(provider);
  const questions=provider.listQuestionIds().map(id=>{
    const question=provider.getQuestion(id);
    registry.resolve(question.ref);
    return question;
  });
  return {bank:provider.describe(),counts:provider.counts?.()||{total:questions.length},questions};
}
function cli(argv=process.argv.slice(2)){
  const get=flag=>{
    const i=argv.indexOf(flag);
    return i<0?null:argv[i+1];
  };
  const bankId=get('--bank')||'svenska';
  const result=open(bankId);
  if(argv.includes('--dump')){
    process.stdout.write(JSON.stringify(result)+'\n');
    return;
  }
  const term=(get('--search')||'').trim().toLocaleLowerCase('sv-SE');
  const id=get('--id');
  const items=result.questions.filter(q=>{
    if(id)return q.ref.id===id;
    if(!term)return false;
    return [q.ref.id,q.prompt,q.stimulus,q.provenance?.source,
      ...(q.skillIds||[])].some(v=>typeof v==='string'&&
      v.toLocaleLowerCase('sv-SE').includes(term));
  }).slice(0,30).map(q=>({
    id:q.ref.id,revision:q.ref.revision,
    skillIds:q.skillIds,source:q.provenance?.source||null,
    prompt:q.prompt.slice(0,150)
  }));
  process.stdout.write(JSON.stringify({
    bankId,questions:result.questions.length,counts:result.counts,
    ...(id||term?{matches:items}:{}),
    note:'Questions live only in the bank-owned authored sources; this output is derived.'
  },null,2)+'\n');
}
if(require.main===module)try{cli()}catch(error){
  process.stderr.write(String(error?.message||error)+'\n');process.exitCode=1;
}
module.exports={open,cli};
