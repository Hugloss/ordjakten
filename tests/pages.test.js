'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {audit,assetPath} = require('../scripts/check-pages');

test('GitHub Pages can serve the full game from /ordjakten/', () => {
  const report = audit();
  assert.ok(report.scripts >= 10);
  assert.ok(report.offlineAssets >= report.linkedAssets);
});
test('GitHub Pages asset references cannot escape the site prefix', () => {
  assert.throws(() => assetPath('/js/app.js'), /relative asset path/);
  assert.throws(() => assetPath('./../../secret.txt'), /escaped GitHub Pages prefix/);
});

test('Pages builds the artifact before a separate deploy job to avoid lookup races',()=>{
  const fs=require('node:fs');
  const workflow=fs.readFileSync(require('node:path').join(__dirname,'../.github/workflows/deploy-pages.yml'),'utf8');
  const build=workflow.indexOf('\n  build:');
  const upload=workflow.indexOf('uses: actions/upload-pages-artifact@v4');
  const deploy=workflow.indexOf('\n  deploy:');
  const publish=workflow.indexOf('uses: actions/deploy-pages@v4');
  assert.ok(build>=0&&upload>build&&deploy>upload&&publish>deploy,
    'upload completes in its own build job before deployment begins');
  assert.match(workflow.slice(deploy),/needs: build/);
  assert.match(workflow.slice(deploy),/environment:/);
  assert.match(workflow.slice(deploy),/name: github-pages/);
  assert.match(workflow,/workflow_dispatch:/);
});
