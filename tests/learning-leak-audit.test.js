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
