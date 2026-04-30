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
  '22_collision.js',
  '80_receipts.js',
  '68_post_setpiece_trust_fall.js',
  '69_post_setpiece_open_concept.js',
  '6A_post_setpiece_supply_chain.js',
  '8B_post_closer_pool_setpieces.js'
];

const TRUST_FALL_ACCEPT_IDS = [
  'W15_TRUST_FALL_CLOSER_02',
  'W15_TRUST_FALL_CLOSER_03',
  'W15_TRUST_FALL_CLOSER_04',
  'W15_TRUST_FALL_CLOSER_05'
];

const TRUST_FALL_DECLINE_IDS = [
  'W15_TRUST_FALL_DECLINED_01',
  'W15_TRUST_FALL_DECLINED_02',
  'W15_TRUST_FALL_DECLINED_03',
  'W15_TRUST_FALL_DECLINED_04'
];

const OPEN_CONCEPT_IDS = [
  'W15_OPEN_CONCEPT_CLOSER_02',
  'W15_OPEN_CONCEPT_CLOSER_03',
  'W15_OPEN_CONCEPT_CLOSER_04',
  'W15_OPEN_CONCEPT_CLOSER_05'
];

const SUPPLY_CHAIN_IDS = [
  'W15_SUPPLY_CHAIN_CLOSER_02',
  'W15_SUPPLY_CHAIN_CLOSER_03',
  'W15_SUPPLY_CHAIN_CLOSER_04',
  'W15_SUPPLY_CHAIN_CLOSER_05'
];

const ALL_NEW_IDS = TRUST_FALL_ACCEPT_IDS
  .concat(TRUST_FALL_DECLINE_IDS)
  .concat(OPEN_CONCEPT_IDS)
  .concat(SUPPLY_CHAIN_IDS);

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

test('Setpiece closer pool registers sixteen new fragments into CLOSERS', () => {
  const CEHP = loadModules(POOL_MODULES);
  assert.equal(typeof CEHP.Closers.registerSetpiecePool, 'function');
  assert.equal(typeof CEHP.Closers.setpiecePoolFragments, 'function');

  const fragments = CEHP.Closers.setpiecePoolFragments();
  assert.equal(fragments.length, 16, 'expected 16 setpiece-pool fragments');

  for (let i = 0; i < ALL_NEW_IDS.length; i++) {
    const id = ALL_NEW_IDS[i];
    const fragment = findFragment(CEHP, id);
    assert.ok(fragment, `fragment ${id} should be registered in CLOSERS pool`);
  }
});

test('Every setpiece-pool fragment honors the W15 voice rule', () => {
  const CEHP = loadModules(POOL_MODULES);
  const fragments = CEHP.Closers.setpiecePoolFragments();
  for (let i = 0; i < fragments.length; i++) {
    const f = fragments[i];
    assert.equal(f.text, f.text.toUpperCase(), `${f.id} must be ALL CAPS`);
    assert.equal(f.text.endsWith('.'), true, `${f.id} must end with .`);
    assert.equal(f.text.includes('!'), false, `${f.id} must not contain !`);
    assert.ok(words(f.text).length <= 8, `${f.id} must be <= 8 words, got ${words(f.text).length}`);
  }
});

test('Setpiece-pool registration is idempotent across repeated calls', () => {
  const CEHP = loadModules(POOL_MODULES);
  const before = CEHP.Receipts.POOLS.CLOSERS.length;
  const result = CEHP.Closers.registerSetpiecePool();
  const after = CEHP.Receipts.POOLS.CLOSERS.length;
  assert.equal(result, false, 'second registerSetpiecePool() returns false');
  assert.equal(after, before, 'CLOSERS pool length unchanged on repeat call');
});

test('Trust Fall accept receipt selects from the trust-fall accept pool', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P12-TRUSTFALL-ACCEPT',
    worldId: 'orientation',
    axes: { primary: { compliance: 1, intuition: 1, grace: 1 }, micro: { modulesPassed: 12 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: { trustFallAccepted: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(
    closerId === 'W15_TRUST_FALL_CLOSER_01' || TRUST_FALL_ACCEPT_IDS.indexOf(closerId) >= 0,
    `expected trust-fall accept closer, got ${closerId}`
  );
});

test('Trust Fall decline receipt selects from the trust-fall decline pool', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P12-TRUSTFALL-DECLINE',
    worldId: 'orientation',
    axes: { primary: { compliance: 1, intuition: 1, grace: 0.5 }, micro: { modulesPassed: 8 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: { trustFallDeclined: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(
    TRUST_FALL_DECLINE_IDS.indexOf(closerId) >= 0,
    `expected trust-fall decline closer, got ${closerId}`
  );
});

test('Open Concept navigated receipt selects from the open-concept pool', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P12-OPEN-CONCEPT',
    worldId: 'benefits',
    axes: { primary: { compliance: 1, intuition: 1, curiosity: 0.6 }, micro: { modulesPassed: 12 } },
    tensions: { obedience: 0.8, style: 0.4, auditRisk: 0.1 },
    flags: { openConceptNavigated: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(
    closerId === 'W15_OPEN_CONCEPT_CLOSER_01' || OPEN_CONCEPT_IDS.indexOf(closerId) >= 0,
    `expected open-concept closer, got ${closerId}`
  );
});

test('Supply Chain routed receipt selects from the supply-chain pool', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P12-SUPPLY-CHAIN',
    worldId: 'rasta',
    axes: { primary: { compliance: 1, intuition: 1, grace: 0.6 }, micro: { modulesPassed: 12 } },
    tensions: { obedience: 0.8, style: 0.4, auditRisk: 0 },
    flags: { supplyChainRouted: true },
    cigaretteLit: false
  });

  const closerId = receipt.fragmentIds[2];
  assert.ok(
    closerId === 'W15_SUPPLY_CHAIN_CLOSER_01' || SUPPLY_CHAIN_IDS.indexOf(closerId) >= 0,
    `expected supply-chain closer, got ${closerId}`
  );
});

test('Setpiece-pool fragments do not leak into receipts when no setpiece flag is set', () => {
  const CEHP = loadModules(POOL_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W15-P12-NO-SETPIECE',
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
    `setpiece-pool fragment ${closerId} leaked into a no-setpiece receipt`
  );
});

test('Setpiece-pool source enforces canonical IDs and tone', () => {
  const source = fs.readFileSync(path.join(srcDir, '8B_post_closer_pool_setpieces.js'), 'utf8');
  assert.match(source, /W15_TRUST_FALL_CLOSER_05/);
  assert.match(source, /W15_TRUST_FALL_DECLINED_01/);
  assert.match(source, /W15_OPEN_CONCEPT_CLOSER_05/);
  assert.match(source, /W15_SUPPLY_CHAIN_CLOSER_05/);
  assert.match(source, /trustFallAccepted/);
  assert.match(source, /trustFallDeclined/);
  assert.match(source, /openConceptNavigated/);
  assert.match(source, /supplyChainRouted/);
  assert.match(source, /tone:\s*'benign'/);
});
