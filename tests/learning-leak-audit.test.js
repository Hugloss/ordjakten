'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {scan}=require('../scripts/audit-learning-leaks');
function fixture(handler){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'learning-leak-test-'));
 try{
  fs.mkdirSync(path.join(root,'public'),{recursive:true});
  const write=(name,content)=>{
   const file=path.join(root,'public',name);
   fs.mkdirSync(path.dirname(file),{recursive:true});
   fs.writeFileSync(file,content);
  };
  return handler({root,write});
 }finally{fs.rmSync(root,{recursive:true,force:true})}
}
test('ordinary public questions remain known-public, not falsely labelled private',()=>{
 fixture(({root,write})=>{
  write('data/ordbank.json',JSON.stringify({questions:[{prompt:'public?',answer:'known'}]}));
  assert.deepEqual(scan(root),[]);
 });
});
test('private questions or private policy source are forbidden in public build',()=>{
 fixture(({root,write})=>{
  write('private-banks/medicine.json','{}');
  write('private-policies/selection.js','module.exports={}');
  const paths=scan(root).map(x=>x.reason);
  assert.ok(paths.includes('private-directory-exposed'));
  assert.ok(paths.includes('private-file-exposed'));
 });
});
test('private key and private marker block deployment even in ordinary filenames',()=>{
 fixture(({root,write})=>{
  write('data/new-bank.json','{"marker":"PRIVATE_BANK_DO_NOT_PUBLISH"}');
  write('assets/config.js','-----BEGIN PRIVATE KEY-----');
  assert.ok(scan(root).some(x=>x.reason==='private-bank-marker'));
  assert.ok(scan(root).some(x=>x.reason==='private-key'));
 });
});
test('browser entrypoint cannot import proprietary policy modules',()=>{
 fixture(({root,write})=>{
  write('index.html','<script src="./learning-policies/adaptive.js"></script>');
  assert.ok(scan(root).some(x=>x.reason==='private-module-imported'));
 });
});
test('public assets must not contain symlinks or credential-named files',()=>{
 fixture(({root,write})=>{
  write('assets/.env.production','SECRET=hidden');
  fs.symlinkSync('assets/.env.production',path.join(root,'public','link.txt'));
  assert.ok(scan(root).some(x=>x.reason==='credential-file-exposed'));
  assert.ok(scan(root).some(x=>x.reason==='symlink-in-public-build'));
 });
});

test('public bank inventory rejects new unsanctioned question-bank files',()=>{
 fixture(({root,write})=>{
  write('data/ordbank.json','{"public":true}');
  write('data/new-medical-bank.json','{"questions":["not authorized for public"]}');
  write('js/banks/svenska.js','module.exports={}');
  write('js/banks/private-lessons.js','module.exports={}');
  const dir=path.join(root,'content');
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'public-bank-allowlist.json'),JSON.stringify({
   schemaVersion:1,publicDataFiles:['ordbank.json'],
   publicBankAdapterFiles:['svenska.js']
  }));
  const reasons=scan(root,{requireInventory:true}).map(row=>row.reason);
  assert.equal(reasons.filter(x=>x==='unapproved-public-bank-file').length,2);
 });
});
test('CI requires a committed public bank publication inventory',()=>{
 fixture(({root,write})=>{
  write('data/ordbank.json','{}');
  assert.ok(scan(root,{requireInventory:true}).some(row=>
    row.reason==='missing-public-inventory'));
 });
});
test('inventory drift is reported instead of silently approving a removed file',()=>{
 fixture(({root,write})=>{
  write('data/ordbank.json','{}');
  write('js/banks/svenska.js','{}');
  fs.mkdirSync(path.join(root,'content'),{recursive:true});
  fs.writeFileSync(path.join(root,'content','public-bank-allowlist.json'),
   JSON.stringify({schemaVersion:1,
    publicDataFiles:['ordbank.json','expressions.json'],
    publicBankAdapterFiles:['svenska.js']}));
  assert.ok(scan(root,{requireInventory:true}).some(x=>
   x.reason==='public-bank-inventory-drift'));
 });
});

test('a new public application JS file needs explicit publication approval',()=>{
 fixture(({root,write})=>{
  write('data/ordbank.json','{}');
  write('js/banks/svenska.js','module.exports={}');
  write('js/app.js','void 0');
  write('js/medical-question-data.js','// accidentally contains content');
  fs.mkdirSync(path.join(root,'content'),{recursive:true});
  fs.writeFileSync(path.join(root,'content','public-bank-allowlist.json'),
    JSON.stringify({
      schemaVersion:1,publicDataFiles:['ordbank.json'],
      publicBankAdapterFiles:['svenska.js'],
      publicAppScriptFiles:['app.js']
    }));
  const issues=scan(root,{requireInventory:true});
  assert.ok(issues.some(x=>x.path==='js/medical-question-data.js'&&
    x.reason==='unapproved-public-bank-file'));
 });
});
