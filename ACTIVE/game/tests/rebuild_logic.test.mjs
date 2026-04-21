import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

function buildSandbox() {
  const store = {};
  const localStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    }
  };

  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    localStorage,
    location: { search: '' },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };
  sandbox.window = sandbox;
  sandbox.document = {
    readyState: 'loading',
    getElementById() {
      return null;
    }
  };

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

const LOGIC_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '04_save.js',
  '05_caseseed.js',
  '10_axes.js',
  '11_metrics.js',
  '70_worlds.js',
  '71_world_orientation.js',
  '72_world_benefits.js',
  '73_world_rasta.js',
  '51_contradiction.js',
  '80_receipts.js',
  '81_docket.js',
  '82_appeals.js'
];

test('receipts expose stable fragment ids and diverge by behavior profile', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const seed = 'CASE-20260420-001-CURIOSITY-R2';
  const compliantAxes = {
    primary: {
      compliance: 0.9,
      intuition: 0.2,
      curiosity: 0.2,
      grace: 0.3,
      chaos: 0.1,
      efficiency: 0.8
    },
    micro: { contradictionFollow: 2, contradictionDefy: 0, signPeeks: 1 }
  };
  const defiantAxes = {
    primary: {
      compliance: 0.1,
      intuition: 0.4,
      curiosity: 0.9,
      grace: 0.4,
      chaos: 0.8,
      efficiency: 0.2
    },
    micro: { contradictionFollow: 0, contradictionDefy: 2, signPeeks: 4 }
  };

  const receiptA = CEHP.Receipts.generate({ seed, axes: compliantAxes, tensions: { obedience: 0.8, style: 1.1, auditRisk: 0.0 } });
  const receiptB = CEHP.Receipts.generate({ seed, axes: defiantAxes, tensions: { obedience: -0.7, style: 0.6, auditRisk: 0.5 } });

  assert.equal(Array.isArray(receiptA.fragmentIds), true);
  assert.equal(receiptA.fragmentIds.length, 3);
  assert.equal(Array.isArray(receiptB.fragmentIds), true);
  assert.equal(receiptB.fragmentIds.length, 3);
  assert.notDeepEqual(receiptA.fragmentIds, receiptB.fragmentIds);
});

test('receipts score generic world flags for benefits routes', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const seed = 'CASE-20260427-001-COMPLIANCE-R2';
  const axes = {
    primary: {
      compliance: 0.6,
      intuition: 0.3,
      curiosity: 0.4,
      grace: 0.3,
      chaos: 0.2,
      efficiency: 0.5
    },
    micro: {
      contradictionFollow: 2,
      modulesPassed: 5,
      modulesSkipped: 0
    }
  };
  const tensions = { obedience: 0.4, style: 0.8, auditRisk: 0.1 };

  const insured = CEHP.Receipts.generate({
    seed,
    axes,
    tensions,
    worldId: 'benefits',
    flags: { premiumSecured: true, uninsuredVeteran: false }
  });
  const uninsured = CEHP.Receipts.generate({
    seed,
    axes,
    tensions,
    worldId: 'benefits',
    flags: { premiumSecured: false, uninsuredVeteran: true }
  });

  assert.equal(Array.isArray(insured.fragmentIds), true);
  assert.equal(Array.isArray(uninsured.fragmentIds), true);
  assert.notDeepEqual(insured.fragmentIds, uninsured.fragmentIds);
});

test('receipt card helpers keep receipt content stable across thermal presentation', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-20260427-001-COMPLIANCE-R2',
    worldId: 'benefits',
    axes: {
      primary: {
        compliance: 0.6,
        intuition: 0.3,
        curiosity: 0.4,
        grace: 0.3,
        chaos: 0.2,
        efficiency: 0.5
      },
      micro: {
        modulesPassed: 5,
        contradictionFollow: 2
      }
    },
    tensions: { obedience: 0.4, style: 0.8, auditRisk: 0.1 },
    flags: { premiumSecured: true, uninsuredVeteran: false }
  });

  const normalCard = CEHP.Receipts.cardModel(receipt, {
    worldId: 'benefits',
    playUrl: 'https://counterfeit-educational.org/?case=' + encodeURIComponent(receipt.seed),
    thermal: false
  });
  const thermalCard = CEHP.Receipts.cardModel(receipt, {
    worldId: 'benefits',
    playUrl: 'https://counterfeit-educational.org/?case=' + encodeURIComponent(receipt.seed),
    thermal: true
  });

  assert.deepEqual(normalCard.lines, thermalCard.lines);
  assert.deepEqual(normalCard.fragmentIds, thermalCard.fragmentIds);
  assert.equal(normalCard.theme.mode, 'normal');
  assert.equal(thermalCard.theme.mode, 'thermal');
  assert.notEqual(normalCard.theme.paper, thermalCard.theme.paper);
});

test('docket seeds are deterministic by ISO week and archive dedupes receipt entries', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const info = CEHP.Docket.weekInfo(new Date(Date.UTC(2026, 3, 20)));
  const docketA = CEHP.Docket.seedForWeek(info.year, info.isoWeek);
  const docketB = CEHP.Docket.seedForWeek(info.year, info.isoWeek);

  assert.equal(info.isoWeek, 17);
  assert.equal(info.year, 2026);
  assert.equal(info.mondayDate, '2026-04-20');
  assert.equal(docketA.seed, docketB.seed);
  assert.equal(CEHP.CaseSeed.parse(docketA.seed).date, '20260420');
  assert.equal(CEHP.CaseSeed.parse(docketA.seed).counter, 17);

  CEHP.Docket.recordReceipt({
    year: info.year,
    isoWeek: info.isoWeek,
    seed: docketA.seed,
    worldId: 'orientation',
    lines: ['LINE 1', 'LINE 2', 'LINE 3'],
    fragmentIds: ['VERDICT_X', 'TENSION_Y', 'CLOSER_Z'],
    flags: { thermal: false },
    ts: 101
  });
  CEHP.Docket.recordReceipt({
    year: info.year,
    isoWeek: info.isoWeek,
    seed: docketA.seed,
    worldId: 'orientation',
    lines: ['LINE 1', 'LINE 2', 'LINE 3'],
    fragmentIds: ['VERDICT_X', 'TENSION_Y', 'CLOSER_Z'],
    flags: { thermal: false },
    ts: 101
  });

  const archive = CEHP.Docket.loadArchive();

  assert.equal(Array.isArray(archive.weeks), true);
  assert.equal(archive.weeks.length, 1);
  assert.equal(archive.weeks[0].seed, docketA.seed);
  assert.equal(archive.weeks[0].receipts.length, 1);
});

test('appeals compare returns diffs, bounds, and encoded payload helpers', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const recA = {
    seed: 'CASE-20260420-001-CURIOSITY-R2',
    lines: ['ROUTINE COMPLIANCE OBSERVED.', 'OBEDIENCE HIGH. STYLE UNDECLARED.', 'RETURN TO ASSIGNED HALLWAY.'],
    axes: { primary: { compliance: 0.8, intuition: 0.1, curiosity: 0.2, grace: 0.4, chaos: 0.1, efficiency: 0.7 }, micro: {} }
  };
  const recB = {
    seed: 'CASE-20260420-001-CURIOSITY-R2',
    lines: ['INCIDENT PRE-APPROVED.', 'AUDIT RISK EXCEEDS PERMITTED RANGE.', 'CASE HELD OPEN FOR REVIEW.'],
    axes: { primary: { compliance: 0.2, intuition: 0.2, curiosity: 0.8, grace: 0.3, chaos: 0.7, efficiency: 0.2 }, micro: {} }
  };
  const pathA = [[0, 10, 20, 1], [120, 32, 18, 1], [240, 60, 12, 1]];
  const pathB = [[0, 10, 20, 1], [120, 16, 36, -1], [240, 12, 64, -1]];

  const encoded = CEHP.Appeals.encode({ receipt: recA, frames: pathA });
  const decoded = CEHP.Appeals.decode(encoded);
  const diff = CEHP.Appeals.compare(
    { receipt: recA, frames: pathA },
    { receipt: recB, frames: pathB }
  );

  assert.equal(typeof encoded, 'string');
  assert.deepEqual(decoded.frames, pathA);
  assert.deepEqual(decoded.receipt.lines, recA.lines);
  assert.equal(Array.isArray(diff.lineDiff), true);
  assert.equal(typeof diff.axisDelta.compliance, 'number');
  assert.deepEqual(diff.pathA, pathA);
  assert.deepEqual(diff.pathB, pathB);
  assert.equal(
    JSON.stringify(diff.bounds),
    JSON.stringify({ minX: 10, minY: 12, maxX: 60, maxY: 64 })
  );
});

test('axes and metrics respond to deterministic event traffic', () => {
  const CEHP = loadModules(LOGIC_MODULES);

  CEHP.Axes.reset();
  CEHP.Metrics.reset();

  CEHP.Events.emit('sign:read', { words: 4 });
  CEHP.Events.emit('movement:jump', { height: 1 });
  CEHP.Events.emit('movement:kick', {});
  CEHP.Events.emit('movement:backtrack', { distance: 24 });
  CEHP.Events.emit('contradiction:defy', { gateId: 'gate-1' });
  CEHP.Metrics.tick(600, { moving: false, x: 10, y: 20, facing: 1 });
  CEHP.Metrics.tick(600, { moving: false, x: 10, y: 20, facing: 1 });

  const snapshot = CEHP.Axes.snapshot();

  assert.ok(snapshot.primary.curiosity > 0);
  assert.ok(snapshot.primary.chaos > 0);
  assert.ok(snapshot.micro.signsRead > 0);
  assert.ok(snapshot.micro.jumpCount > 0);
  assert.ok(snapshot.micro.kickCount > 0);
  assert.ok(snapshot.micro.backtracks > 0);
  assert.ok(snapshot.micro.idleMs > 0);
});

test('contradiction gates resolve follow and defy exactly once', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  let followCount = 0;
  let defyCount = 0;

  const gate = CEHP.Contradiction.gate({
    sign: { id: 'do-not-jump' },
    expectedBehavior: 'wait',
    windowMs: 800,
    onFollow: function() { followCount += 1; return 'upper'; },
    onDefy: function() { defyCount += 1; return 'lower'; }
  });

  assert.equal(gate.evaluate({ action: 'jump', elapsedMs: 120 }), 'defy');
  assert.equal(gate.resolved, true);
  assert.equal(gate.evaluate({ action: 'wait', elapsedMs: 600 }), 'defy');
  assert.equal(followCount, 0);
  assert.equal(defyCount, 1);
});
