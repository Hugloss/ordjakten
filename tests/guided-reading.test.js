'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {partsFor}=require('../public/js/guided-reading');
const root=path.resolve(__dirname,'../public');

test('short and invalid inputs are not split',()=>{
  assert.deepEqual(partsFor(null),[]);
  assert.deepEqual(partsFor('  '),[]);
  assert.deepEqual(partsFor('En kort mening.'),['En kort mening.']);
});
test('reading parts preserve every word in the original order',()=>{
  const samples=[
    'När Alex drar handen över klippan fastnar fingrarna mot den ojämna ytan.',
    'För en gångs skull kunde min pappa skjutsa barnen till hockeyn.',
    'I går kunde pappa inte följa med. Men i dag kunde han skjutsa till hockeyn!',
    'Efter ovädret var sjön så grumlig att barnen inte kunde se stenarna på botten, fast solen sken.'
  ];
  for(const text of samples){
    const parts=partsFor(text);
    assert.ok(parts.length>=2 && parts.length<=4,text);
    assert.equal(parts.join(' '),text);
    assert.ok(parts.every(part=>part.length>=13));
  }
});
test('long texts are bounded to at most four parts',()=>{
  const original=Array.from({length:35},(_,i)=>'Berättelse nummer '+i+' är lång.').join(' ');
  const parts=partsFor(original);
  assert.ok(parts.length<=4);
  assert.equal(parts.join(' '),original);
});
test('newlines and repeated whitespace normalize without losing content',()=>{
  const text='Efter regnet\n var marken   våt och vägen blev svår att gå på.';
  assert.equal(partsFor(text).join(' '),
    'Efter regnet var marken våt och vägen blev svår att gå på.');
});
test('UI wires guidance only into training while keeping answers hidden',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const js=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
  for(const id of ['guided-reading','guided-start','guided-count',
    'guided-part','guided-previous','guided-next','guided-full']){
    const occurrences=html.match(new RegExp('id="'+id+'"','g'))||[];
    assert.equal(occurrences.length,1,id);
  }
  assert.match(html,/\.\/js\/guided-reading\.js/);
  assert.match(js,/OrdjaktenGuidedReading/);
  assert.match(js,/guidedParts=storyVisible && game\.settings\.mode==='train'/);
  assert.match(js,/function beginGuidedReading/);
  assert.match(js,/function endGuidedReading/);
  assert.ok(js.includes("$('story-reveal').hidden=true"));
  assert.match(js,/if\(guidedActive && index!==null\)return/);
});
