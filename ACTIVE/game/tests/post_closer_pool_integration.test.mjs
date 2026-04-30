import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const indexPath = path.join(gameDir, 'index.html');

const ALL_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '22_collision.js',
  '80_receipts.js',
  '64_post_boss_supervisor.js',
  '65_post_boss_enrollment.js',
  '66_post_boss_logistics.js',
  '68_post_setpiece_trust_fall.js',
  '69_post_setpiece_open_concept.js',
  '6A_post_setpiece_supply_chain.js',
  '84_post_closer_pool_bosses.js',
  '8B_post_closer_pool_setpieces.js',
  '8C_post_run_complete_monologue.js'
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

function words(text) {
  return text.replace(/\.$/, '').split(/\s+/).filter(Boolean);
}

test('P11-P13 closer modules are bundled into the shipped artifact', () => {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  assert.equal(indexHtml.includes('/* MODULE: 84_POST_CLOSER_POOL_BOSSES.JS */'), true,
    '84_post_closer_pool_bosses.js bundled');
  assert.equal(indexHtml.includes('/* MODULE: 8B_POST_CLOSER_POOL_SETPIECES.JS */'), true,
    '8B_post_closer_pool_setpieces.js bundled');
  assert.equal(indexHtml.includes('/* MODULE: 8C_POST_RUN_COMPLETE_MONOLOGUE.JS */'), true,
    '8C_post_run_complete_monologue.js bundled');
});

test('Closers namespace exposes all three register hooks', () => {
  const CEHP = loadModules(ALL_MODULES);
  assert.equal(typeof CEHP.Closers, 'object');
  assert.equal(typeof CEHP.Closers.registerBossPool, 'function');
  assert.equal(typeof CEHP.Closers.registerSetpiecePool, 'function');
  assert.equal(typeof CEHP.Closers.registerRunCompletePool, 'function');
  assert.equal(typeof CEHP.Closers.bossPoolFragments, 'function');
  assert.equal(typeof CEHP.Closers.setpiecePoolFragments, 'function');
  assert.equal(typeof CEHP.Closers.runCompleteFragments, 'function');
  assert.equal(typeof CEHP.Closers.runCompleteFlags, 'function');
});

test('Combined W15M closer pool adds 40 fragments across the three modules', () => {
  const CEHP = loadModules(ALL_MODULES);
  const boss = CEHP.Closers.bossPoolFragments();
  const setpiece = CEHP.Closers.setpiecePoolFragments();
  const meta = CEHP.Closers.runCompleteFragments();
  assert.equal(boss.length, 15);
  assert.equal(setpiece.length, 16);
  assert.equal(meta.length, 9);
  assert.equal(boss.length + setpiece.length + meta.length, 40);
});

test('Every W15M closer fragment honors the global voice rule', () => {
  const CEHP = loadModules(ALL_MODULES);
  const all = []
    .concat(CEHP.Closers.bossPoolFragments())
    .concat(CEHP.Closers.setpiecePoolFragments())
    .concat(CEHP.Closers.runCompleteFragments());

  const seen = {};
  for (let i = 0; i < all.length; i++) {
    const f = all[i];
    assert.equal(seen[f.id], undefined, `${f.id} duplicated across closer pool modules`);
    seen[f.id] = true;
    assert.equal(f.text, f.text.toUpperCase(), `${f.id} must be ALL CAPS`);
    assert.equal(f.text.endsWith('.'), true, `${f.id} must end with .`);
    assert.equal(f.text.includes('!'), false, `${f.id} must not contain !`);
    assert.ok(words(f.text).length <= 8,
      `${f.id} must be <= 8 words, got ${words(f.text).length}`);
  }
});

test('Boss-pool, setpiece-pool, and monologue ids share the W15M prefix discipline', () => {
  const CEHP = loadModules(ALL_MODULES);
  const all = []
    .concat(CEHP.Closers.bossPoolFragments())
    .concat(CEHP.Closers.setpiecePoolFragments())
    .concat(CEHP.Closers.runCompleteFragments());
  for (let i = 0; i < all.length; i++) {
    assert.match(all[i].id, /^W15_/, `${all[i].id} must be a W15 fragment`);
  }
});

test('Run-complete pool requires triple defeat flags exactly', () => {
  const CEHP = loadModules(ALL_MODULES);
  const flags = CEHP.Closers.runCompleteFlags();
  assert.equal(flags.supervisorDefeated, true);
  assert.equal(flags.enrollmentDefeated, true);
  assert.equal(flags.logisticsDefeated, true);
  // No other flags carried in the gating object — keeps gating crisp.
  const keys = Object.keys(flags);
  assert.equal(keys.length, 3);
});

test('Marathon report enumerates P11-P15 phase commits', () => {
  const reportPath = path.resolve(gameDir, '..', '..', 'ACTIVE/docs/W15_MARATHON_REPORT.md');
  const report = fs.readFileSync(reportPath, 'utf8');
  assert.match(report, /W15M-P11/);
  assert.match(report, /W15M-P12/);
  assert.match(report, /W15M-P13/);
  assert.match(report, /W15M-P14/);
  assert.match(report, /W15M-P15/);
});
