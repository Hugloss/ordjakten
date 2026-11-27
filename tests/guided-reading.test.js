'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {partsFor}=require('../public/js/guided-reading');
const contexts=require('../public/data/word-contexts.json');
const expressions=require('../public/data/expressions.json');
const root=path.resolve(__dirname,'../public');

test('preserves an idiom as one unit when the story begins with it',()=>{
  const entry=expressions.expressions.find(x=>x.phrase==='För en gångs skull');
  assert.deepEqual(partsFor(entry.scene,{protectedPhrase:entry.phrase}),[
    'För en gångs skull','kunde min pappa skjutsa barnen till hockeyn.'
  ]);
});
test('splits at natural sentence boundaries instead of cutting through a phrase',()=>{
  const phrase='I går kunde pappa inte följa med. Men i dag kunde han skjutsa till hockeyn!';
  assert.deepEqual(partsFor(phrase),['I går kunde pappa inte följa med.','Men i dag kunde han skjutsa till hockeyn!']);
  const clause='Efter ovädret var sjön så grumlig att barnen inte kunde se stenarna på botten, fast solen sken.';
  assert.deepEqual(partsFor(clause),['Efter ovädret var sjön så grumlig','att barnen inte kunde se stenarna på botten, fast solen sken.']);
});
test('keeps short single-clause stories together instead of cutting off their meaning',()=>{
  const story='När Alex drar handen över klippan fastnar fingrarna mot den ojämna ytan.';
  assert.deepEqual(partsFor(story),[story]);
});
test('all existing word scenes and expressions retain their full original text',()=>{
  const records=[
    ...contexts.wordContexts.flatMap(entry=>entry.scenes.map(scene=>({text:scene.text,phrase:''}))),
    ...expressions.expressions.map(entry=>({text:entry.scene,phrase:entry.phrase}))
  ];
  let multi=0;
  for(const record of records){
    const pieces=partsFor(record.text,{protectedPhrase:record.phrase});
    assert.ok(pieces.length>=1 && pieces.length<=4,record.text);
    assert.equal(pieces.join(' '),record.text.trim().replace(/\s+/g,' '),record.text);
    assert.ok(pieces.every(part=>part.length>=10),record.text);
    if(record.phrase && record.text.toLocaleLowerCase('sv-SE').includes(record.phrase.toLocaleLowerCase('sv-SE'))){
      assert.ok(pieces.some(part=>part.toLocaleLowerCase('sv-SE').includes(record.phrase.toLocaleLowerCase('sv-SE'))),record.phrase);
    }
    if(pieces.length>1)multi++;
  }
  assert.ok(multi>=35,'Expected meaningful pauses in the existing stories');
});
test('handles invalid input, whitespace and long stories safely',()=>{
  assert.deepEqual(partsFor(null),[]);
  assert.deepEqual(partsFor('  '),[]);
  assert.deepEqual(partsFor('En kort mening.'),['En kort mening.']);
  const w='Efter regnet\n var marken   våt och vägen blev svår att gå på.';
  assert.equal(partsFor(w).join(' '),'Efter regnet var marken våt och vägen blev svår att gå på.');
  const long=Array.from({length:35},(_,i)=>'Berättelse nummer '+i+' är lång.').join(' ');
  assert.ok(partsFor(long).length<=4);
  assert.equal(partsFor(long).join(' '),long);
});
test('guided mode hides the original story while the child reads one step',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
  const css=fs.readFileSync(path.join(root,'css/guided-reading.css'),'utf8');
  for(const id of ['guided-reading','guided-start','guided-count','guided-part',
    'guided-previous','guided-next','guided-full']){
    assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
  }
  assert.match(html, /\.\/js\/guided-reading\.js/);
  assert.match(app, /OrdjaktenGuidedReading/);
  assert.match(app, /game\.settings\.mode==='train'/);
  assert.match(app, /protectedPhrase/);
  assert.match(app, /if\(guidedActive && index!==null\)return/);
  assert.match(app, /dataset\.guidedReading='true'/);
  assert.match(css, /data-guided-reading='true'/);
});
