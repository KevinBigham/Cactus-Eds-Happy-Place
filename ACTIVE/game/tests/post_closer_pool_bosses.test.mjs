import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

const POOL_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '80_receipts.js',
  '64_post_boss_supervisor.js',
  '65_post_boss_enrollment.js',
  '66_post_boss_logistics.js',
  '84_post_closer_pool_bosses.js'
];

const SUPERVISOR_IDS = [
  'W15_SUPERVISOR_CLOSER_02',
  'W15_SUPERVISOR_CLOSER_03',
  'W15_SUPERVISOR_CLOSER_04',
  'W15_SUPERVISOR_CLOSER_05',
  'W15_SUPERVISOR_CLOSER_06'
];

const ENROLLMENT_IDS = [
  'W15_ENROLLMENT_CLOSER_02',
  'W15_ENROLLMENT_CLOSER_03',
  'W15_ENROLLMENT_CLOSER_04',
  'W15_ENROLLMENT_CLOSER_05',
  'W15_ENROLLMENT_CLOSER_06'
];

const LOGISTICS_IDS = [
  'W15_LOGISTICS_CLOSER_02',
  'W15_LOGISTICS_CLOSER_03',
  'W15_LOGISTICS_CLOSER_04',
  'W15_LOGISTICS_CLOSER_05',
  'W15_LOGISTICS_CLOSER_06'
];

const ALL_NEW_IDS = SUPERVISOR_IDS.concat(ENROLLMENT_IDS).concat(LOGISTICS_IDS);

function buildSandbox() {
  const sandbox = {
    console,
    Math,
    JSON,
    window: null,
    document: {
      readyState: 'loading',
      getElementById() { return null; }
    }
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

test('Boss closer pool registers fifteen new fragments into the CLOSERS pool', () => {
  const CEHP = loadModules(POOL_MODULES);
  assert.equal(typeof CEHP.Closers.registerBossPool, 'function');
  assert.equal(typeof CEHP.Closers.bossPoolFragments, 'function');

  const fragments = CEHP.Closers.bossPoolFragments();
  assert.equal(fragments.length, 15, 'expected 15 boss-pool fragments');

  for (let i = 0; i < ALL_NEW_IDS.length; i++) {
    const id = ALL_NEW_IDS[i];
    const fragment = findFragment(CEHP, id);
    assert.ok(fragment, `fragment ${id} should be registered in CLOSERS pool`);
  }
});

test('Every boss-pool fragment honors the W15 voice rule', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Closers.bossPoolFragments();
  for (let i = 0; i < fragments.length; i++) {
    const f = fragments[i];
    assert.equal(f.text, f.text.toUpperCase(), `${f.id} must be ALL CAPS`);
    assert.equal(f.text.endsWith('.'), true, `${f.id} must end with .`);
    assert.equal(f.text.includes('!'), false, `${f.id} must not contain !`);
    assert.ok(words(f.text).length <= 8, `${f.id} must be <= 8 words, got ${words(f.text).length}`);
  }
});

test('Boss-pool registration is idempotent across repeated calls', () => {
  const CEHP = loadModules(POOL_MODULES);
  const before = CEHP.Receipts.POOLS.CLOSERS.length;
  const result = CEHP.Closers.registerBossPool();
  const after = CEHP.Receipts.POOLS.CLOSERS.length;
  assert.equal(result, false, 'second registerBossPool() returns false');
  assert.equal(after, before, 'CLOSERS pool length unchanged on repeat call');
});

test('Supervisor defeat receipt selects from the supervisor closer pool', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P11-SUPERVISOR',
    worldId: 'orientation',
    axes: { primary: { compliance: 1, intuition: 1, grace: 1, chaos: 0.4 }, micro: { modulesPassed: 12, contradictionDefy: 4 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: { supervisorDefeated: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(
    closerId === 'W15_SUPERVISOR_CLOSER_01' || SUPERVISOR_IDS.indexOf(closerId) >= 0,
    `expected supervisor closer, got ${closerId}`
  );
});

test('Enrollment defeat receipt selects from the enrollment closer pool', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P11-ENROLLMENT',
    worldId: 'benefits',
    axes: { primary: { compliance: 1, intuition: 1, grace: 0.6 }, micro: { modulesPassed: 12, contradictionFollow: 6 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: { enrollmentDefeated: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(
    closerId === 'W15_ENROLLMENT_CLOSER_01' || ENROLLMENT_IDS.indexOf(closerId) >= 0,
    `expected enrollment closer, got ${closerId}`
  );
});

test('Logistics defeat receipt selects from the logistics closer pool', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P11-LOGISTICS',
    worldId: 'rasta',
    axes: { primary: { compliance: 0.6, intuition: 1, grace: 1 }, micro: { musicSync: 8, modulesPassed: 10 } },
    tensions: { obedience: 0.5, style: 0.4, auditRisk: -0.2 },
    flags: { logisticsDefeated: true, restOpened: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(
    closerId === 'W15_LOGISTICS_CLOSER_01' || LOGISTICS_IDS.indexOf(closerId) >= 0,
    `expected logistics closer, got ${closerId}`
  );
});

test('Boss-pool fragments do not leak into receipts when the defeat flag is absent', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P11-NO-DEFEAT',
    worldId: 'orientation',
    axes: { primary: { compliance: 1, intuition: 0.5, grace: 0.5 }, micro: { modulesPassed: 8 } },
    tensions: { obedience: 1, style: 0.2, auditRisk: 0 },
    flags: {},
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.equal(
    ALL_NEW_IDS.indexOf(closerId),
    -1,
    `boss-pool fragment ${closerId} leaked into a no-defeat receipt`
  );
  assert.notEqual(closerId, 'W15_SUPERVISOR_CLOSER_01', 'baseline supervisor closer leaked into no-defeat receipt');
});

test('Boss-pool source enforces the canonical ID and tone shape', () => {
  const source = fs.readFileSync(path.join(srcDir, '84_post_closer_pool_bosses.js'), 'utf8');
  assert.match(source, /W15_SUPERVISOR_CLOSER_02/);
  assert.match(source, /W15_ENROLLMENT_CLOSER_06/);
  assert.match(source, /W15_LOGISTICS_CLOSER_06/);
  assert.match(source, /supervisorDefeated/);
  assert.match(source, /enrollmentDefeated/);
  assert.match(source, /logisticsDefeated/);
  assert.match(source, /tone:\s*'benign'/);
});
