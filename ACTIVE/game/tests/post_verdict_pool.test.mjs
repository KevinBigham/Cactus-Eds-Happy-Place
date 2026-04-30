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
  '8D_post_verdict_pool.js'
];

const ORIENTATION_IDS = [
  'W15_VERDICT_ORIENTATION_DEPTH_01',
  'W15_VERDICT_ORIENTATION_DEPTH_02',
  'W15_VERDICT_ORIENTATION_DEPTH_03',
  'W15_VERDICT_ORIENTATION_DEPTH_04',
  'W15_VERDICT_ORIENTATION_DEPTH_05'
];

const BENEFITS_IDS = [
  'W15_VERDICT_BENEFITS_DEPTH_01',
  'W15_VERDICT_BENEFITS_DEPTH_02',
  'W15_VERDICT_BENEFITS_DEPTH_03',
  'W15_VERDICT_BENEFITS_DEPTH_04',
  'W15_VERDICT_BENEFITS_DEPTH_05'
];

const RASTA_IDS = [
  'W15_VERDICT_RASTA_DEPTH_01',
  'W15_VERDICT_RASTA_DEPTH_02',
  'W15_VERDICT_RASTA_DEPTH_03',
  'W15_VERDICT_RASTA_DEPTH_04',
  'W15_VERDICT_RASTA_DEPTH_05'
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
  const verdicts = CEHP.Receipts.POOLS.VERDICTS;
  for (let i = 0; i < verdicts.length; i++) {
    if (verdicts[i].id === id) return verdicts[i];
  }
  return null;
}

test('Verdict depth module is bundled into the shipped artifact', () => {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  assert.equal(indexHtml.includes('/* MODULE: 8D_POST_VERDICT_POOL.JS */'), true,
    '8D_post_verdict_pool.js is bundled');
});

test('Verdict depth pool registers fifteen new fragments into VERDICTS', () => {
  const CEHP = loadModules(POOL_MODULES);
  assert.equal(typeof CEHP.Verdicts, 'object');
  assert.equal(typeof CEHP.Verdicts.registerDepthPool, 'function');
  assert.equal(typeof CEHP.Verdicts.depthPoolFragments, 'function');

  const fragments = CEHP.Verdicts.depthPoolFragments();
  assert.equal(fragments.length, 15, 'expected 15 verdict-depth fragments');

  for (let i = 0; i < ALL_IDS.length; i++) {
    const id = ALL_IDS[i];
    const fragment = findFragment(CEHP, id);
    assert.ok(fragment, `fragment ${id} should be registered in VERDICTS pool`);
  }
});

test('Every verdict-depth fragment honors the W15 voice rule', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Verdicts.depthPoolFragments();
  const seen = {};
  for (let i = 0; i < fragments.length; i++) {
    const f = fragments[i];
    assert.equal(seen[f.id], undefined, `${f.id} duplicated within verdict-depth pool`);
    seen[f.id] = true;
    assert.equal(f.text, f.text.toUpperCase(), `${f.id} must be ALL CAPS`);
    assert.equal(f.text.endsWith('.'), true, `${f.id} must end with .`);
    assert.equal(f.text.includes('!'), false, `${f.id} must not contain !`);
    assert.ok(words(f.text).length <= 8,
      `${f.id} must be <= 8 words, got ${words(f.text).length}`);
  }
});

test('Verdict-depth pool registration is idempotent across repeated calls', () => {
  const CEHP = loadModules(POOL_MODULES);
  const before = CEHP.Receipts.POOLS.VERDICTS.length;
  const result = CEHP.Verdicts.registerDepthPool();
  const after = CEHP.Receipts.POOLS.VERDICTS.length;
  assert.equal(result, false, 'second registerDepthPool() returns false');
  assert.equal(after, before, 'VERDICTS pool length unchanged on repeat call');
});

test('Verdict-depth fragments share the W15 prefix discipline', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Verdicts.depthPoolFragments();
  for (let i = 0; i < fragments.length; i++) {
    assert.match(fragments[i].id, /^W15_VERDICT_/,
      `${fragments[i].id} must use W15_VERDICT_ prefix`);
    assert.match(fragments[i].id, /_DEPTH_\d{2}$/,
      `${fragments[i].id} must end with _DEPTH_NN`);
  }
});

test('Verdict-depth pool source carries world-keyed weights matching base pools', () => {
  const source = fs.readFileSync(path.join(srcDir, '8D_post_verdict_pool.js'), 'utf8');
  assert.match(source, /worlds:\s*\{\s*orientation:\s*2\.8\s*\}/,
    'orientation depth verdicts use base-pool world weight 2.8');
  assert.match(source, /worlds:\s*\{\s*benefits:\s*3\.0\s*\}/,
    'benefits depth verdicts use base-pool world weight 3.0');
  assert.match(source, /worlds:\s*\{\s*rasta:\s*3\.3\s*\}/,
    'rasta depth verdicts use base-pool world weight 3.3');
});
