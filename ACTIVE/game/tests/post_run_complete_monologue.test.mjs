import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

const MONO_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '80_receipts.js',
  '64_post_boss_supervisor.js',
  '65_post_boss_enrollment.js',
  '66_post_boss_logistics.js',
  '84_post_closer_pool_bosses.js',
  '8B_post_closer_pool_setpieces.js',
  '8C_post_run_complete_monologue.js'
];

const MONOLOGUE_IDS = [
  'W15_RUN_COMPLETE_MONOLOGUE_01',
  'W15_RUN_COMPLETE_MONOLOGUE_02',
  'W15_RUN_COMPLETE_MONOLOGUE_03',
  'W15_RUN_COMPLETE_MONOLOGUE_04',
  'W15_RUN_COMPLETE_MONOLOGUE_05',
  'W15_RUN_COMPLETE_MONOLOGUE_06',
  'W15_RUN_COMPLETE_MONOLOGUE_07',
  'W15_RUN_COMPLETE_MONOLOGUE_08',
  'W15_RUN_COMPLETE_MONOLOGUE_09'
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

test('Run-complete monologue registers nine meta fragments into CLOSERS', () => {
  const CEHP = loadModules(MONO_MODULES);
  assert.equal(typeof CEHP.Closers.registerRunCompletePool, 'function');
  assert.equal(typeof CEHP.Closers.runCompleteFragments, 'function');

  const fragments = CEHP.Closers.runCompleteFragments();
  assert.equal(fragments.length, 9, 'expected 9 monologue fragments');

  for (let i = 0; i < MONOLOGUE_IDS.length; i++) {
    const id = MONOLOGUE_IDS[i];
    const fragment = findFragment(CEHP, id);
    assert.ok(fragment, `fragment ${id} should be registered in CLOSERS pool`);
  }
});

test('Every monologue fragment honors the W15 voice rule', () => {
  const CEHP = loadModules(MONO_MODULES);
  const fragments = CEHP.Closers.runCompleteFragments();
  for (let i = 0; i < fragments.length; i++) {
    const f = fragments[i];
    assert.equal(f.text, f.text.toUpperCase(), `${f.id} must be ALL CAPS`);
    assert.equal(f.text.endsWith('.'), true, `${f.id} must end with .`);
    assert.equal(f.text.includes('!'), false, `${f.id} must not contain !`);
    assert.ok(words(f.text).length <= 8, `${f.id} must be <= 8 words, got ${words(f.text).length}`);
  }
});

test('Run-complete registration is idempotent across repeated calls', () => {
  const CEHP = loadModules(MONO_MODULES);
  const before = CEHP.Receipts.POOLS.CLOSERS.length;
  const result = CEHP.Closers.registerRunCompletePool();
  const after = CEHP.Receipts.POOLS.CLOSERS.length;
  assert.equal(result, false, 'second registerRunCompletePool() returns false');
  assert.equal(after, before, 'CLOSERS pool length unchanged on repeat call');
});

test('Triple-defeat receipt selects from the run-complete monologue pool in W3 context', () => {
  const CEHP = loadModules(MONO_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P13-RUN-COMPLETE-RASTA',
    worldId: 'rasta',
    axes: { primary: { compliance: 1, intuition: 1, grace: 1, curiosity: 0.6 }, micro: { modulesPassed: 12, musicSync: 6 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0 },
    flags: CEHP.Closers.runCompleteFlags(),
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(MONOLOGUE_IDS.indexOf(closerId) >= 0,
    `expected monologue closer in W3, got ${closerId}`);
});

test('Triple-defeat receipt selects from the monologue pool in W1 context too', () => {
  const CEHP = loadModules(MONO_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P13-RUN-COMPLETE-ORIENT',
    worldId: 'orientation',
    axes: { primary: { compliance: 1, intuition: 1, grace: 1 }, micro: { modulesPassed: 12 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: CEHP.Closers.runCompleteFlags(),
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(MONOLOGUE_IDS.indexOf(closerId) >= 0,
    `expected monologue closer in W1, got ${closerId}`);
});

test('Triple-defeat receipt selects from the monologue pool in W2 context too', () => {
  const CEHP = loadModules(MONO_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P13-RUN-COMPLETE-BENEFITS',
    worldId: 'benefits',
    axes: { primary: { compliance: 1, intuition: 1, grace: 0.6 }, micro: { modulesPassed: 12 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: CEHP.Closers.runCompleteFlags(),
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(MONOLOGUE_IDS.indexOf(closerId) >= 0,
    `expected monologue closer in W2, got ${closerId}`);
});

test('Single-boss-defeat receipts do not select from the monologue pool', () => {
  const CEHP = loadModules(MONO_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P13-PARTIAL',
    worldId: 'orientation',
    axes: { primary: { compliance: 1, intuition: 0.5, grace: 0.5 }, micro: { modulesPassed: 8 } },
    tensions: { obedience: 1, style: 0.2, auditRisk: 0 },
    flags: { supervisorDefeated: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.equal(MONOLOGUE_IDS.indexOf(closerId), -1,
    `monologue fragment ${closerId} leaked into a single-defeat receipt`);
});

test('Two-boss-defeat receipts also do not select from the monologue pool', () => {
  const CEHP = loadModules(MONO_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P13-TWO-BOSSES',
    worldId: 'benefits',
    axes: { primary: { compliance: 1, intuition: 1 }, micro: { modulesPassed: 10 } },
    tensions: { obedience: 1, style: 0.3, auditRisk: 0 },
    flags: { supervisorDefeated: true, enrollmentDefeated: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.equal(MONOLOGUE_IDS.indexOf(closerId), -1,
    `monologue fragment ${closerId} leaked into a two-defeat receipt`);
});

test('Run-complete pool source enforces canonical ID and tone', () => {
  const source = fs.readFileSync(path.join(srcDir, '8C_post_run_complete_monologue.js'), 'utf8');
  for (let i = 0; i < MONOLOGUE_IDS.length; i++) {
    assert.match(source, new RegExp(MONOLOGUE_IDS[i]));
  }
  assert.match(source, /supervisorDefeated/);
  assert.match(source, /enrollmentDefeated/);
  assert.match(source, /logisticsDefeated/);
  assert.match(source, /tone:\s*'benign'/);
});
