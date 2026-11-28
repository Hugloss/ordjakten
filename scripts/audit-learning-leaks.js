/* CI guard against newly publishing private banks, code or credentials.
 * This does NOT make existing public Ordjakten data secret.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const SOURCE_EXTENSIONS=new Set(['.js','.json','.html','.css','.svg','.txt','.md','.yaml','.yml','.xml']);
const PRIVATE_PATH=/(^|\/)(?:private|private-banks|private-bank|learning-policies|private-policies|secure-bank|protected-bank)(\/|\.|$)/i;
const PRIVATE_IMPORT=/\b(?:learning-policies|private-banks|private-policies|privateBankSource)\b/i;
const MARKERS=[
 ['private-key',/-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/],
 ['github-pat',/\b(?:github_pat_|ghp_)[A-Za-z0-9_]{20,}\b/],
 ['api-token',/\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/],
 ['private-bank-marker',/\b(?:PRIVATE_BANK_DO_NOT_PUBLISH|PRIVATE_QUESTION_BANK_DATA|PRIVATE_POLICY_SOURCE_DO_NOT_PUBLISH)\b/]
];
function scan(root,{requireInventory=false}={}){
 const pub=path.resolve(root,'public'),violations=[];
 if(!fs.existsSync(pub))return [{path:'public',reason:'missing-public-root'}];
 function traverse(directory){
  for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
   const file=path.join(directory,entry.name);
   const relative=path.relative(pub,file).split(path.sep).join('/');
   if(entry.isSymbolicLink()){
    violations.push({path:relative,reason:'symlink-in-public-build'});
    continue;
   }
   if(entry.isDirectory()){
    if(PRIVATE_PATH.test(relative))
     violations.push({path:relative,reason:'private-directory-exposed'});
    traverse(file);
    continue;
   }
   if(!entry.isFile())continue;
   if(PRIVATE_PATH.test(relative))
    violations.push({path:relative,reason:'private-file-exposed'});
   if(/(?:^|\/)\.env(?:\.|$)|\.(?:pem|p12|pfx|key)$/i.test(relative))
    violations.push({path:relative,reason:'credential-file-exposed'});
   const extension=path.extname(entry.name).toLowerCase();
   if(!SOURCE_EXTENSIONS.has(extension))continue;
   const stat=fs.statSync(file);
   if(stat.size>20*1024*1024){
    violations.push({path:relative,reason:'unexpected-oversized-public-file'});
    continue;
   }
   const content=fs.readFileSync(file,'utf8');
   for(const [name,pattern] of MARKERS){
    if(pattern.test(content))violations.push({path:relative,reason:name});
   }
   if((relative==='index.html'||relative==='sw.js')&&
     PRIVATE_IMPORT.test(content))
    violations.push({path:relative,reason:'private-module-imported'});
  }
 }
 traverse(pub);
 const inventoryFile=path.resolve(root,'content','public-bank-allowlist.json');
 if(!fs.existsSync(inventoryFile)){
  if(requireInventory)violations.push({path:'content/public-bank-allowlist.json',
    reason:'missing-public-inventory'});
 }else{
  let inventory;
  try{inventory=JSON.parse(fs.readFileSync(inventoryFile,'utf8'))}
  catch(_){violations.push({path:'content/public-bank-allowlist.json',
    reason:'invalid-public-inventory'});return violations}
  const groups=[
   ['publicDataFiles','data'],
   ['publicBankAdapterFiles','js/banks'],
   ['publicAppScriptFiles','js']
  ];
  if(inventory.schemaVersion!==1)
   violations.push({path:'content/public-bank-allowlist.json',
     reason:'invalid-public-inventory'});
  for(const [key,relative] of groups){
   const expected=inventory[key];
   if(!Array.isArray(expected)||expected.length===0||
     expected.some(n=>typeof n!=='string'||!/^[-.a-zA-Z0-9_]+$/.test(n))||
     new Set(expected).size!==expected.length){
    violations.push({path:'content/public-bank-allowlist.json',
      reason:'invalid-public-inventory'});
    continue;
   }
   const folder=path.join(pub,relative);
   if(!fs.existsSync(folder)){
    violations.push({path:relative,reason:'missing-public-bank-directory'});
    continue;
   }
   const current=fs.readdirSync(folder,{withFileTypes:true})
     .filter(entry=>entry.isFile()).map(entry=>entry.name);
   for(const name of current)if(!expected.includes(name))
    violations.push({path:relative+'/'+name,reason:'unapproved-public-bank-file'});
   for(const name of expected)if(!current.includes(name))
    violations.push({path:relative+'/'+name,reason:'public-bank-inventory-drift'});
  }
 }
 return violations;
}
function main(){
 const root=path.resolve(__dirname,'..'),issues=scan(root,{requireInventory:true});
 if(issues.length){
  for(const issue of issues)console.error('PUBLIC_LEAK '+issue.path+' '+issue.reason);
  process.exitCode=1;
 }else{
  console.log('No new private-path, token or private-code exposure markers in public build.');
  // The existing public banks remain downloadable by design/history.
  console.log('NOTE: Existing Ordjakten authored question files are already public; this guard does not hide them.');
 }
}
if(require.main===module)main();
module.exports={scan};
