/* Verify every static asset needed by GitHub Pages, under /ordjakten/.
 * Zero external packages; run with npm run check:pages or npm run check. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const PUBLIC = path.resolve(__dirname, '../public');
const BASE = 'https://hugloss.github.io/ordjakten/';

function assetPath(relative, root = PUBLIC) {
  assert.equal(typeof relative, 'string');
  assert.match(relative, /^\.\/[^?#]*(?:[?#].*)?$/, `Use a relative asset path: ${relative}`);
  const url = new URL(relative, BASE);
  assert.equal(url.origin, new URL(BASE).origin);
  assert.ok(url.pathname.startsWith('/ordjakten/'), `Asset escaped GitHub Pages prefix: ${relative}`);
  const resolved = path.resolve(root, decodeURIComponent(url.pathname.slice('/ordjakten/'.length)) || 'index.html');
  assert.ok(resolved.startsWith(root + path.sep), `Asset escaped public folder: ${relative}`);
  return resolved;
}

function audit(root = PUBLIC) {
  const indexFile = path.join(root, 'index.html');
  const swFile = path.join(root, 'sw.js');
  assert.ok(fs.existsSync(indexFile), 'Missing public/index.html');
  assert.ok(fs.existsSync(swFile), 'Missing public/sw.js');
  const html = fs.readFileSync(indexFile, 'utf8');
  const worker = fs.readFileSync(swFile, 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
  const refs = [...html.matchAll(/\b(?:src|href)=["'](\.\/[^"']+)["']/g)]
    .map(match => match[1].split(/[?#]/)[0]);
  assert.ok(refs.length >= 20, 'Expected local CSS, scripts and icons in index.html');
  for (const ref of refs) {
    const file = assetPath(ref, root);
    assert.ok(fs.existsSync(file) && fs.statSync(file).isFile(), `Missing HTML asset: ${ref}`);
  }
  const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)]
    .map(match => match[1]);
  assert.ok(scripts.length > 10, 'Missing bundled JavaScript');
  scripts.forEach(ref => assert.match(ref, /^\.\//, `Script must be relative: ${ref}`));
  const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
  assert.match(app, /serviceWorker\.register\(['"]\.\/sw\.js['"]\)/,
    'Service worker must register relative to the project URL');
  const precache = new Set([...worker.matchAll(/["'](\.\/[^"']*)["']/g)]
    .map(match => match[1]));
  for (const ref of precache) {
    if (ref === './') continue;
    const file = assetPath(ref, root);
    assert.ok(fs.existsSync(file) && fs.statSync(file).isFile(), `Missing offline asset: ${ref}`);
  }
  refs.forEach(ref => assert.ok(precache.has(ref), `Not cached for offline: ${ref}`));
  for (const key of ['start_url', 'scope']) {
    assert.equal(manifest[key], './', `PWA ${key} must stay under /ordjakten/`);
  }
  for (const icon of manifest.icons || []) {
    assert.ok(fs.existsSync(assetPath(icon.src, root)), `Missing PWA icon: ${icon.src}`);
  }
  return {linkedAssets:refs.length, offlineAssets:precache.size, scripts:scripts.length};
}
if (require.main === module) {
  const report = audit();
  process.stdout.write(`Pages /ordjakten/ validated: ${report.linkedAssets} HTML assets, ${report.offlineAssets} offline paths, ${report.scripts} scripts.\n`);
}
module.exports = {audit, assetPath};
