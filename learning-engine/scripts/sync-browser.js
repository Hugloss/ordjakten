'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=path.join(root,'src','assessment-v1.js');
const browser=path.resolve(root,'..','public','js','assessment-v1.js');
const HEADER='/* GENERATED from learning-engine/src/assessment-v1.js; do not edit manually. */\n';
const intended=HEADER+fs.readFileSync(source,'utf8');
if(process.argv.includes('--check')){
  if(!fs.existsSync(browser)||fs.readFileSync(browser,'utf8')!==intended){
    console.error('Browser assessment mirror is stale. Run: node learning-engine/scripts/sync-browser.js');
    process.exitCode=1;
  }else console.log('Learning Engine browser assessment mirror is current.');
}else{
  fs.writeFileSync(browser,intended);
  console.log('Updated public/js/assessment-v1.js');
}
