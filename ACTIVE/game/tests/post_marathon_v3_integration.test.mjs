import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const rootDir = path.resolve('/Users/tkevinbigham/Projects/CEHP');
const gameDir = path.join(rootDir, 'ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const testsDir = path.join(gameDir, 'tests');
const scriptsDir = path.join(gameDir, 'scripts');
const replayDir = path.join(gameDir, '_canon/replays/cehp');
const indexPath = path.join(gameDir, 'index.html');
const reportPath = path.join(rootDir, 'ACTIVE/docs/W15_MARATHON_REPORT.md');

const V3_MODULES = [
  '8D_post_verdict_pool.js',
  '8E_post_tension_pool.js',
  '8F_post_closer_axis_pool.js'
];

const V3_FIXTURES = [
  'w_axis_chaos_orientation.json',
  'w_axis_curiosity_orientation.json',
  'w_axis_efficiency_benefits.json',
  'w_axis_grace_rasta.json'
];

const V3_TESTS = [
  'post_verdict_pool.test.mjs',
  'post_tension_pool.test.mjs',
  'post_closer_axis_pool.test.mjs',
  'post_fragment_audit.test.mjs'
];

const POOL_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '80_receipts.js',
  '8D_post_verdict_pool.js',
  '8E_post_tension_pool.js',
  '8F_post_closer_axis_pool.js'
];

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
    return fs.readFileSync(path.join(srcDir, file), 'utf8');
  }).join('\n');
  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

function moduleBanner(file) {
  return '/* MODULE: ' + file.toUpperCase() + ' */';
}

test('V3 receipt-depth modules ship in source and bundled artifact', () => {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  V3_MODULES.forEach((file) => {
    assert.equal(fs.existsSync(path.join(srcDir, file)), true, `${file} exists in src`);
    assert.equal(indexHtml.includes(moduleBanner(file)), true, `${file} is bundled in index.html`);
  });
});

test('V3 namespace contract exposes register and fragments hooks for each layer', () => {
  const CEHP = loadModules(POOL_MODULES);

  // Verdict depth (P16)
  assert.equal(typeof CEHP.Verdicts, 'object');
  assert.equal(typeof CEHP.Verdicts.registerDepthPool, 'function');
  assert.equal(typeof CEHP.Verdicts.depthPoolFragments, 'function');

  // Tension depth (P17)
  assert.equal(typeof CEHP.Tensions, 'object');
  assert.equal(typeof CEHP.Tensions.registerDepthPool, 'function');
  assert.equal(typeof CEHP.Tensions.depthPoolFragments, 'function');

  // Axis closer (P18)
  assert.equal(typeof CEHP.Closers, 'object');
  assert.equal(typeof CEHP.Closers.registerAxisPool, 'function');
  assert.equal(typeof CEHP.Closers.axisPoolFragments, 'function');
});

test('V3 marathon ships exactly 42 net-new fragments (15 + 15 + 12)', () => {
  const CEHP = loadModules(POOL_MODULES);
  const verdictDepth = CEHP.Verdicts.depthPoolFragments();
  const tensionDepth = CEHP.Tensions.depthPoolFragments();
  const axisClosers = CEHP.Closers.axisPoolFragments();

  assert.equal(verdictDepth.length, 15, 'verdict depth = 15');
  assert.equal(tensionDepth.length, 15, 'tension depth = 15');
  assert.equal(axisClosers.length, 12, 'axis closers = 12');
  assert.equal(verdictDepth.length + tensionDepth.length + axisClosers.length, 42,
    'V3 marathon total = 42 fragments');
});

test('Every V3 fragment honors the global voice rule (cross-module sweep)', () => {
  const CEHP = loadModules(POOL_MODULES);
  const all = []
    .concat(CEHP.Verdicts.depthPoolFragments())
    .concat(CEHP.Tensions.depthPoolFragments())
    .concat(CEHP.Closers.axisPoolFragments());
  const seen = {};

  function words(text) {
    return String(text || '').replace(/\.$/, '').split(/\s+/).filter(Boolean);
  }

  for (let i = 0; i < all.length; i++) {
    const f = all[i];
    assert.equal(seen[f.id], undefined, `${f.id} duplicated across V3 modules`);
    seen[f.id] = true;
    assert.equal(f.text, f.text.toUpperCase(), `${f.id} must be ALL CAPS`);
    assert.equal(f.text.endsWith('.'), true, `${f.id} must end with .`);
    assert.equal(f.text.includes('!'), false, `${f.id} must not contain !`);
    assert.ok(words(f.text).length <= 8,
      `${f.id} must be <= 8 words, got ${words(f.text).length}`);
  }
});

test('V3 replay corpus armor fixtures are committed', () => {
  V3_FIXTURES.forEach((file) => {
    assert.equal(fs.existsSync(path.join(replayDir, file)), true,
      `${file} is committed to replay corpus`);
  });
});

test('V3 phase test files are present alongside their source modules', () => {
  V3_TESTS.forEach((file) => {
    assert.equal(fs.existsSync(path.join(testsDir, file)), true,
      `${file} ships in tests directory`);
  });
});

test('V3 fragment audit script ships and is executable JS', () => {
  const auditPath = path.join(scriptsDir, 'audit_fragments.mjs');
  assert.equal(fs.existsSync(auditPath), true, 'audit_fragments.mjs is committed');
  const source = fs.readFileSync(auditPath, 'utf8');
  assert.match(source, /CEHP FRAGMENT AUDIT/);
  assert.match(source, /Population Census/);
  assert.match(source, /Voice rule violations/);
});

test('Marathon report enumerates P16 through P21 phase commits', () => {
  const report = fs.readFileSync(reportPath, 'utf8');
  assert.match(report, /W15M-P16/);
  assert.match(report, /W15M-P17/);
  assert.match(report, /W15M-P18/);
  assert.match(report, /W15M-P19/);
  assert.match(report, /W15M-P20/);
  assert.match(report, /W15M-P21/);
});

test('Marathon report carries the V3 receipt-depth narrative section', () => {
  const report = fs.readFileSync(reportPath, 'utf8');
  assert.match(report, /Receipt Revelation Depth/i);
  assert.match(report, /verdict pool depth/i);
  assert.match(report, /tension pool depth/i);
  assert.match(report, /axis-only closer/i);
});
