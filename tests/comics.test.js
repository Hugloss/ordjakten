'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const api=require('../public/js/comics.js');
const base=path.resolve(__dirname,'../public');
const comics=JSON.parse(fs.readFileSync(path.join(base,'data/comics.json'),'utf8'));
const expressions=JSON.parse(fs.readFileSync(path.join(base,'data/expressions.json'),'utf8'));

test('all 25 phrases have exactly three readable comic scenes',()=>{
  assert.equal(Object.keys(comics.stories).length,25);
  assert.deepEqual(api.validate(comics,expressions),[]);
  for(const expr of expressions.expressions){
    const story=comics.stories[expr.id];
    assert.ok(story.takeaway.length>14);
    assert.ok(expr.reveal[0].text && expr.reveal[1].text);
    for(const stage of ['before','after','aha'])assert.ok(story[stage].length>0);
  }
});

test('browser JS comic data is byte-for-byte equivalent in meaning',()=>{
  const js=fs.readFileSync(path.join(base,'data/comics.js'),'utf8');
  const vm=require('node:vm');
  const context={window:{}};
  vm.runInNewContext(js,context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.ORDJAKTEN_COMICS)),comics);
});

test('story pictures are bundled local PNGs, use only reused artwork and have license',()=>{
  const unique=Object.values(comics.iconPaths);
  assert.ok(unique.length>=30);
  assert.equal(new Set(unique).size,unique.length);
  for(const image of unique){
    assert.ok(image.startsWith('./assets/story-icons/'));
    const file=path.join(base,image.slice(2));
    const bytes=fs.readFileSync(file);
    assert.ok(bytes.length>500,image);
    assert.equal(bytes.subarray(1,4).toString(),'PNG');
  }
  const license=fs.readFileSync(path.join(base,'assets/story-icons/NOTO-EMOJI-LICENSE-AND-COPYRIGHT.txt'),'utf8');
  assert.match(license,/SIL OPEN FONT LICENSE Version 1\.1/);
  assert.match(license,/Google Inc\./);
});

test('missing images and missing stories fail validation rather than silently changing meaning',()=>{
  const clone=JSON.parse(JSON.stringify(comics));
  delete clone.iconPaths['🚗'];
  assert.ok(api.validate(clone,expressions).some(s=>s.includes('ut-0001')));
  const clone2=JSON.parse(JSON.stringify(comics));
  delete clone2.stories['ut-0001'];
  assert.ok(api.validate(clone2,expressions).some(s=>s.includes('saknas')));
});

test('hockey comic matches the actual phrase about an unusual lift',()=>{
  const story=comics.stories['ut-0001'];
  assert.ok(story.before.includes('🏒'));
  assert.ok(story.after.includes('🚗'));
  assert.match(story.takeaway,/undantag/);
  assert.match(expressions.expressions[0].scene,/skjutsa barnen till hockeyn/);
});
