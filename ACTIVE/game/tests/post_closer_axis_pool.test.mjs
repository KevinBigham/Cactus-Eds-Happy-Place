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
  '8F_post_closer_axis_pool.js'
];

const CHAOS_IDS = [
  'W15_CLOSER_AXIS_CHAOS_01',
  'W15_CLOSER_AXIS_CHAOS_02',
  'W15_CLOSER_AXIS_CHAOS_03',
  'W15_CLOSER_AXIS_CHAOS_04'
];

const CURIOSITY_IDS = [
  'W15_CLOSER_AXIS_CURIOSITY_01',
  'W15_CLOSER_AXIS_CURIOSITY_02',
  'W15_CLOSER_AXIS_CURIOSITY_03',
  'W15_CLOSER_AXIS_CURIOSITY_04'
];

const EFFICIENCY_IDS = [
  'W15_CLOSER_AXIS_EFFICIENCY_01',
  'W15_CLOSER_AXIS_EFFICIENCY_02',
  'W15_CLOSER_AXIS_EFFICIENCY_03',
  'W15_CLOSER_AXIS_EFFICIENCY_04'
];

const ALL_IDS = CHAOS_IDS.concat(CURIOSITY_IDS).concat(EFFICIENCY_IDS);

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
  const closers = CEHP.Receipts.POOLS.CLOSERS;
  for (let i = 0; i < closers.length; i++) {
    if (closers[i].id === id) return closers[i];
  }
  return null;
}

test('Axis-pool closer module is bundled into the shipped artifact', () => {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  assert.equal(indexHtml.includes('/* MODULE: 8F_POST_CLOSER_AXIS_POOL.JS */'), true,
    '8F_post_closer_axis_pool.js is bundled');
});

test('Axis-pool registers twelve new closer fragments', () => {
  const CEHP = loadModules(POOL_MODULES);
  assert.equal(typeof CEHP.Closers.registerAxisPool, 'function');
  assert.equal(typeof CEHP.Closers.axisPoolFragments, 'function');

  const fragments = CEHP.Closers.axisPoolFragments();
  assert.equal(fragments.length, 12, 'expected 12 axis-pool fragments');

  for (let i = 0; i < ALL_IDS.length; i++) {
    const id = ALL_IDS[i];
    const fragment = findFragment(CEHP, id);
    assert.ok(fragment, `fragment ${id} should be registered in CLOSERS pool`);
  }
});

test('Every axis-pool fragment honors the W15 voice rule', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Closers.axisPoolFragments();
  const seen = {};
  for (let i = 0; i < fragments.length; i++) {
    const f = fragments[i];
    assert.equal(seen[f.id], undefined, `${f.id} duplicated within axis pool`);
    seen[f.id] = true;
    assert.equal(f.text, f.text.toUpperCase(), `${f.id} must be ALL CAPS`);
    assert.equal(f.text.endsWith('.'), true, `${f.id} must end with .`);
    assert.equal(f.text.includes('!'), false, `${f.id} must not contain !`);
    assert.ok(words(f.text).length <= 8,
      `${f.id} must be <= 8 words, got ${words(f.text).length}`);
  }
});

test('Axis-pool registration is idempotent across repeated calls', () => {
  const CEHP = loadModules(POOL_MODULES);
  const before = CEHP.Receipts.POOLS.CLOSERS.length;
  const result = CEHP.Closers.registerAxisPool();
  const after = CEHP.Receipts.POOLS.CLOSERS.length;
  assert.equal(result, false, 'second registerAxisPool() returns false');
  assert.equal(after, before, 'CLOSERS pool length unchanged on repeat call');
});

test('Axis-pool fragments share the W15 prefix discipline', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Closers.axisPoolFragments();
  for (let i = 0; i < fragments.length; i++) {
    assert.match(fragments[i].id, /^W15_CLOSER_AXIS_/,
      `${fragments[i].id} must use W15_CLOSER_AXIS_ prefix`);
    assert.match(fragments[i].id, /_(CHAOS|CURIOSITY|EFFICIENCY)_\d{2}$/,
      `${fragments[i].id} must end with axis_NN`);
  }
});

test('Axis-pool fragments carry no world-weight key', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Closers.axisPoolFragments();
  for (let i = 0; i < fragments.length; i++) {
    assert.equal(fragments[i].opts.worlds, undefined,
      `${fragments[i].id} must not carry a worlds map (axis-only by design)`);
  }
});

test('Axis-pool source enumerates the three axis groups', () => {
  const source = fs.readFileSync(path.join(srcDir, '8F_post_closer_axis_pool.js'), 'utf8');
  assert.match(source, /CHAOS_FRAGMENTS/);
  assert.match(source, /CURIOSITY_FRAGMENTS/);
  assert.match(source, /EFFICIENCY_FRAGMENTS/);
  assert.match(source, /chaos:\s*0\.[5-9]/, 'chaos fragments lean chaos: 0.5-0.9');
  assert.match(source, /curiosity:\s*0\.[5-9]/, 'curiosity fragments lean curiosity: 0.5-0.9');
  assert.match(source, /efficiency:\s*0\.[5-9]/, 'efficiency fragments lean efficiency: 0.5-0.9');
});
