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
