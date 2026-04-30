import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const indexPath = path.join(gameDir, 'index.html');

const POOL_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '80_receipts.js',
  '8E_post_tension_pool.js'
];

const ORIENTATION_IDS = [
  'W15_TENSION_ORIENTATION_DEPTH_01',
  'W15_TENSION_ORIENTATION_DEPTH_02',
  'W15_TENSION_ORIENTATION_DEPTH_03',
  'W15_TENSION_ORIENTATION_DEPTH_04',
  'W15_TENSION_ORIENTATION_DEPTH_05'
];

const BENEFITS_IDS = [
  'W15_TENSION_BENEFITS_DEPTH_01',
  'W15_TENSION_BENEFITS_DEPTH_02',
  'W15_TENSION_BENEFITS_DEPTH_03',
  'W15_TENSION_BENEFITS_DEPTH_04',
  'W15_TENSION_BENEFITS_DEPTH_05'
];

const RASTA_IDS = [
  'W15_TENSION_RASTA_DEPTH_01',
  'W15_TENSION_RASTA_DEPTH_02',
  'W15_TENSION_RASTA_DEPTH_03',
  'W15_TENSION_RASTA_DEPTH_04',
  'W15_TENSION_RASTA_DEPTH_05'
];

const ALL_IDS = ORIENTATION_IDS.concat(BENEFITS_IDS).concat(RASTA_IDS);

function buildSandbox() {
  const sandbox = {
    console,
    Math,
    JSON,
    window: null,
    document: { readyState: 'loading', getElementById() { return null; } }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  return sandbox;
}

function loadModules(files) {
  const sandbox = buildSandbox();
  const source = files.map(function(file) {
    const filePath = path.join(srcDir, file);
    assert.equal(fs.existsSync(filePath), true, `${file} should exist`);
    return fs.readFileSync(filePath, 'utf8');
  }).join('\n');
  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

function words(text) {
  return text.replace(/\.$/, '').split(/\s+/).filter(Boolean);
}

function findFragment(CEHP, id) {
  const tensions = CEHP.Receipts.POOLS.TENSIONS;
  for (let i = 0; i < tensions.length; i++) {
    if (tensions[i].id === id) return tensions[i];
  }
  return null;
}

test('Tension depth module is bundled into the shipped artifact', () => {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  assert.equal(indexHtml.includes('/* MODULE: 8E_POST_TENSION_POOL.JS */'), true,
    '8E_post_tension_pool.js is bundled');
});

test('Tension depth pool registers fifteen new fragments into TENSIONS', () => {
  const CEHP = loadModules(POOL_MODULES);
  assert.equal(typeof CEHP.Tensions, 'object');
  assert.equal(typeof CEHP.Tensions.registerDepthPool, 'function');
  assert.equal(typeof CEHP.Tensions.depthPoolFragments, 'function');

  const fragments = CEHP.Tensions.depthPoolFragments();
  assert.equal(fragments.length, 15, 'expected 15 tension-depth fragments');

  for (let i = 0; i < ALL_IDS.length; i++) {
    const id = ALL_IDS[i];
    const fragment = findFragment(CEHP, id);
    assert.ok(fragment, `fragment ${id} should be registered in TENSIONS pool`);
  }
});

test('Every tension-depth fragment honors the W15 voice rule', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Tensions.depthPoolFragments();
  const seen = {};
  for (let i = 0; i < fragments.length; i++) {
    const f = fragments[i];
    assert.equal(seen[f.id], undefined, `${f.id} duplicated within tension-depth pool`);
    seen[f.id] = true;
    assert.equal(f.text, f.text.toUpperCase(), `${f.id} must be ALL CAPS`);
    assert.equal(f.text.endsWith('.'), true, `${f.id} must end with .`);
    assert.equal(f.text.includes('!'), false, `${f.id} must not contain !`);
    assert.ok(words(f.text).length <= 8,
      `${f.id} must be <= 8 words, got ${words(f.text).length}`);
  }
});

test('Tension-depth pool registration is idempotent across repeated calls', () => {
  const CEHP = loadModules(POOL_MODULES);
  const before = CEHP.Receipts.POOLS.TENSIONS.length;
  const result = CEHP.Tensions.registerDepthPool();
  const after = CEHP.Receipts.POOLS.TENSIONS.length;
  assert.equal(result, false, 'second registerDepthPool() returns false');
  assert.equal(after, before, 'TENSIONS pool length unchanged on repeat call');
});

test('Tension-depth fragments share the W15 prefix discipline', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Tensions.depthPoolFragments();
  for (let i = 0; i < fragments.length; i++) {
    assert.match(fragments[i].id, /^W15_TENSION_/,
      `${fragments[i].id} must use W15_TENSION_ prefix`);
    assert.match(fragments[i].id, /_DEPTH_\d{2}$/,
      `${fragments[i].id} must end with _DEPTH_NN`);
  }
});

test('Tension-depth pool source carries world-keyed weights matching base pools', () => {
  const source = fs.readFileSync(path.join(srcDir, '8E_post_tension_pool.js'), 'utf8');
  assert.match(source, /worlds:\s*\{\s*orientation:\s*2\.7\s*\}/,
    'orientation depth tensions use base-pool world weight 2.7');
  assert.match(source, /worlds:\s*\{\s*benefits:\s*2\.9\s*\}/,
    'benefits depth tensions use base-pool world weight 2.9');
  assert.match(source, /worlds:\s*\{\s*rasta:\s*3\.2\s*\}/,
    'rasta depth tensions use base-pool world weight 3.2');
});
