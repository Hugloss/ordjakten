'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../public');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/reading-flow.css'),'utf8');

test('read-aloud controls are optional, accessible, and hidden by default',()=>{
  for (const id of ['listen-story','listen-explanation']) {
    const tag=html.match(new RegExp('<button[^>]*id="'+id+'"[^>]*>'))?.[0];
    assert.ok(tag,id+' missing');
    assert.match(tag,/aria-pressed="false"/);
    assert.match(tag,/hidden/);
  }
  assert.match(app,/canReadAloud/);
  assert.match(app,/\.hidden=!canReadAloud/);
});
test('read-aloud never autoplays and is cancelled on navigation or quiz',()=>{
  assert.match(app,/utterance\.lang='sv-SE'/);
  assert.match(app,/window\.speechSynthesis\.speak\(utterance\)/);
  assert.match(app,/window\.speechSynthesis\.cancel\(\)/);
  assert.match(app,/function renderQuestion\(\) \{[\s\S]*?stopReadAloud\(\)/);
  assert.match(app,/function revealReadingCheck\(\) \{[\s\S]*?stopReadAloud\(\)/);
  assert.match(css,/#feedback-area\[data-reading-stage='quiz'\] #listen-explanation/);
});
test('new controls do not introduce external assets or break JavaScript parsing',()=>{
  assert.doesNotThrow(()=>new (require('node:vm').Script)(app));
});
