import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

const BOSS_MODULES = [
  '00_index.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '11_metrics.js',
  '63_post_boss_framework.js'
];

function buildSandbox() {
  const sandbox = {
    console,
    Math,
    JSON,
    window: null,
    document: {
      readyState: 'loading',
      getElementById() {
        return null;
      }
    }
  };

  sandbox.window = sandbox;
  vm.createContext(sandbox);
  return sandbox;
}

function loadSandboxModules(files) {
  const sandbox = buildSandbox();
  const source = files.map(function(file) {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
  }).join('\n');

  vm.runInContext(source, sandbox);
  return sandbox;
}

function loadModules(files) {
  const sandbox = loadSandboxModules(files);
  return sandbox.CEHP;
}

function makeBoss(CEHP, seed) {
  return CEHP.bossFramework.create({
    id: 'test-boss',
    seed,
    phases: [
      { id: 'intake', telegraphWindowMs: { min: 140, max: 220 }, strikeMs: 40, cooldownMs: 60 },
      { id: 'review', telegraphWindowMs: { min: 180, max: 260 }, strikeMs: 50, cooldownMs: 70 },
      { id: 'stamp', telegraphWindowMs: { min: 220, max: 300 }, strikeMs: 60, cooldownMs: 80 }
    ]
  });
}

function traceBoss(boss, ticks, dtMs) {
  const out = [];
  let i;

  for (i = 0; i < ticks; i += 1) {
    out.push(boss.update(dtMs, { tick: i }));
  }

  return out;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('boss framework exposes the requested factory', () => {
  const sandbox = loadSandboxModules(BOSS_MODULES);
  const CEHP = sandbox.CEHP;

  assert.equal(typeof CEHP.bossFramework, 'object');
  assert.equal(CEHP.bossFramework, sandbox.window.CEHP.bossFramework);
  assert.equal(typeof CEHP.bossFramework.create, 'function');
});

test('boss framework is deterministic for the same seed over 100 ticks', () => {
  const CEHP = loadModules(BOSS_MODULES);
  const first = traceBoss(makeBoss(CEHP, 'CASE-BOSS-DETERMINISM'), 100, 33);
  const second = traceBoss(makeBoss(CEHP, 'CASE-BOSS-DETERMINISM'), 100, 33);

  assert.deepEqual(first, second);
  assert.equal(first[first.length - 1].rngState, second[second.length - 1].rngState);
});

test('boss framework clamps telegraph windows to 120-400ms', () => {
  const CEHP = loadModules(BOSS_MODULES);
  const boss = CEHP.bossFramework.create({
    id: 'clamped-boss',
    seed: 'CASE-BOSS-CLAMP',
    phases: [
      { id: 'too-low', telegraphMs: 80, strikeMs: 20, cooldownMs: 20 },
      { id: 'wide', telegraphWindowMs: { min: 90, max: 470 }, strikeMs: 20, cooldownMs: 20 },
      { id: 'too-high', telegraphMs: 500, strikeMs: 20, cooldownMs: 20 }
    ]
  });

  assert.equal(boss.phases.length, 3);
  assert.deepEqual(plain(boss.phases.map(function(phase) {
    return [phase.telegraphMinMs, phase.telegraphMaxMs];
  })), [[120, 120], [120, 400], [400, 400]]);

  const trace = traceBoss(boss, 90, 25);
  const telegraphs = trace
    .filter(function(snapshot) { return snapshot.state === 'telegraph'; })
    .map(function(snapshot) { return snapshot.telegraphMs; });

  assert.ok(telegraphs.length >= 3);
  telegraphs.forEach(function(ms) {
    assert.ok(ms >= 120, String(ms));
    assert.ok(ms <= 400, String(ms));
  });
});

test('boss framework reaches all three phases sequentially', () => {
  const CEHP = loadModules(BOSS_MODULES);
  const boss = makeBoss(CEHP, 'CASE-BOSS-PHASES');
  const trace = traceBoss(boss, 80, 50);
  const reached = {};

  trace.forEach(function(snapshot) {
    reached[snapshot.phaseIndex] = snapshot.phaseId;
  });

  assert.deepEqual(reached, {
    0: 'intake',
    1: 'review',
    2: 'stamp'
  });
  assert.equal(trace[trace.length - 1].phaseIndex, 2);
});

test('boss framework defeat fires receipt-driving behavioral tags', () => {
  const CEHP = loadModules(BOSS_MODULES);
  const boss = makeBoss(CEHP, 'CASE-BOSS-DEFEAT');
  const damage = [];
  const passed = [];
  const defeated = [];

  CEHP.Axes.reset();
  CEHP.Metrics.reset();
  CEHP.Events.on('combat:damageDealt', function(payload) { damage.push(payload); });
  CEHP.Events.on('module:passed', function(payload) { passed.push(payload); });
  CEHP.Events.on('boss:defeated', function(payload) { defeated.push(payload); });

  const snapshot = boss.defeat({ reason: 'unit-test' });
  const axes = CEHP.Axes.snapshot();
  const metrics = CEHP.Metrics.snapshot();

  assert.equal(snapshot.state, 'defeat');
  assert.equal(snapshot.defeated, true);
  assert.deepEqual(plain(damage), [{ kind: 'boss', bossId: 'test-boss', phaseId: 'intake', amount: 1 }]);
  assert.deepEqual(plain(passed), [{ kind: 'boss', bossId: 'test-boss', phaseId: 'intake' }]);
  assert.deepEqual(plain(defeated), [{ bossId: 'test-boss', phaseId: 'intake', phaseIndex: 0, reason: 'unit-test' }]);
  assert.equal(axes.micro.damageDealt, 1);
  assert.equal(axes.micro.modulesPassed, 1);
  assert.equal(metrics.totals.damageDealt, 1);
  assert.equal(metrics.totals.modulePassed, 1);

  boss.defeat({ reason: 'again' });
  assert.equal(damage.length, 1);
  assert.equal(passed.length, 1);
  assert.equal(defeated.length, 1);
});
