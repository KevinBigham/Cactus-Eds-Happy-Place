#!/usr/bin/env node
'use strict';

/* check_save_schema.js — CEHP rebuild save contract.
   Loads core src modules in a vm sandbox and asserts:
     1. SAVE module exposes the documented API.
     2. Sacred legacy key constant still reads 'cactusEd_save_v1'.
     3. Empty boot produces a fresh v2 with legacy=null.
     4. Save/load round-trips.
     5. v1 blob migrates into v2.legacy verbatim (archaeological layer).
     6. v1 key is retained after migration (never silently deleted).
     7. Malformed v2 loads as null but exists() stays true.
     8. clear() wipes v2 only; legacy v1 blob stays intact.
     9. Case Seed format matches doctrine.
    10. RNG is deterministic (same seed -> same sequence).
    11. Thermal receipt helpers do not change receipt content.
    12. Docket archive storage uses its own key, not save v2. */

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var assert = require('assert');

var srcDir = path.join(__dirname, '..', 'src');
var needed = [
  '00_index.js', '01_const.js', '02_rng.js',
  '03_events.js', '04_save.js', '05_caseseed.js',
  '80_receipts.js', '81_docket.js'
];

var src = needed.map(function(f){
  var p = path.join(srcDir, f);
  if (!fs.existsSync(p)) {
    console.error('Missing required src module: ' + f);
    process.exit(1);
  }
  return fs.readFileSync(p, 'utf8');
}).join('\n');

var store = {};
var localStorage = {
  getItem:    function(k){ return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
  setItem:    function(k, v){ store[k] = String(v); },
  removeItem: function(k){ delete store[k]; }
};

var sandbox = { console: console, Math: Math, Date: Date, JSON: JSON, localStorage: localStorage };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

var CEHP = sandbox.CEHP;

function reset(){ for (var k in store) delete store[k]; }

try {
  /* 1. API surface */
  assert.ok(CEHP, 'CEHP namespace exists');
  assert.strictEqual(CEHP.RULESET, 'R2', 'ruleset is R2');
  assert.ok(CEHP.SAVE, 'SAVE module exists');
  ['boot','save','load','clear','exists','hasLegacy','_migrate','_emptyV2'].forEach(function(m){
    assert.strictEqual(typeof CEHP.SAVE[m], 'function', 'SAVE.' + m + ' is a function');
  });

  /* 2. Sacred legacy key */
  assert.strictEqual(CEHP.SAVE._keyV1, 'cactusEd_save_v1', 'SACRED: v1 key preserved');
  assert.strictEqual(CEHP.SAVE._key,   'cactusEd_save_v2', 'live key in rebuild is v2');
  assert.strictEqual(CEHP.SAVE._version, 2, 'version constant is 2');

  /* 3. Empty boot */
  reset();
  var fresh = CEHP.SAVE.boot();
  assert.strictEqual(fresh.version, 2, 'fresh boot is v2');
  assert.strictEqual(fresh.legacy, null, 'fresh boot has no archaeological layer');
  /* NB: sandbox Array.prototype !== outer Array.prototype, so deepStrictEqual
     on cross-realm arrays fails even when values match. Compare as JSON. */
  assert.strictEqual(
    JSON.stringify(Object.keys(fresh.axes).sort()),
    JSON.stringify(CEHP.AXIS_NAMES.slice().sort()),
    'axes keys match AXIS_NAMES'
  );

  /* 4. Round-trip */
  reset();
  var payload = CEHP.SAVE._emptyV2();
  payload.world = 3;
  payload.aloe  = 321;
  payload.axes.compliance = 0.5;
  payload.axes.chaos      = 0.2;
  payload.cases = ['CASE-20260420-001-CURIOSITY-R2'];
  assert.strictEqual(CEHP.SAVE.save(payload), true, 'save succeeds');
  var loaded = CEHP.SAVE.load();
  assert.ok(loaded, 'load returns object');
  assert.strictEqual(loaded.world, 3, 'world round-trips');
  assert.strictEqual(loaded.aloe,  321, 'aloe round-trips');
  assert.strictEqual(loaded.axes.compliance, 0.5, 'axes.compliance round-trips');
  assert.strictEqual(loaded.cases[0], 'CASE-20260420-001-CURIOSITY-R2', 'cases round-trip');

  /* 5. Archaeological migration */
  reset();
  var v1Blob = {
    world: 2, health: 2, aloe: 77,
    behavior: { curiosity: 0.7, compliance: 0.2 },
    deaths: 12, runs: 3, bestTime: 42000, totalKills: 5,
    assistMode: {
      biggerCoyote: true,  slowerBosses: false, easyCopter: true,
      infiniteHealth: false, slowerGame: true
    },
    timestamp: 1700000000000
  };
  localStorage.setItem('cactusEd_save_v1', JSON.stringify(v1Blob));
  var migrated = CEHP.SAVE.boot();
  assert.strictEqual(migrated.version, 2, 'migration produces v2');
  assert.strictEqual(migrated.world, 2, 'world migrated from v1');
  assert.strictEqual(migrated.aloe, 77, 'aloe migrated from v1');
  assert.strictEqual(migrated.axes.curiosity, 0.7, 'curiosity migrated from behavior');
  assert.strictEqual(migrated.axes.compliance, 0.2, 'compliance migrated from behavior');
  assert.ok(migrated.legacy, 'archaeological legacy populated');
  assert.strictEqual(migrated.legacy.world, 2, 'legacy.world verbatim');
  assert.strictEqual(migrated.legacy.timestamp, 1700000000000, 'legacy.timestamp verbatim');
  assert.strictEqual(
    JSON.stringify(migrated.legacy.assistMode),
    JSON.stringify(v1Blob.assistMode),
    'legacy.assistMode verbatim'
  );
  assert.strictEqual(CEHP.SAVE.hasLegacy(), true, 'hasLegacy true after migration');

  /* 6. v1 key retention */
  assert.ok(localStorage.getItem('cactusEd_save_v1'),
    'v1 key retained after migration (never silently deleted)');

  /* 7. Malformed storage */
  reset();
  localStorage.setItem('cactusEd_save_v2', '{not valid json');
  assert.strictEqual(CEHP.SAVE.load(), null, 'malformed v2 loads as null');
  assert.strictEqual(CEHP.SAVE.exists(), true, 'malformed v2 still exists');

  /* 8. Clear semantics */
  reset();
  CEHP.SAVE.save(CEHP.SAVE._emptyV2());
  localStorage.setItem('cactusEd_save_v1', JSON.stringify(v1Blob));
  assert.strictEqual(CEHP.SAVE.exists(), true, 'v2 exists before clear');
  CEHP.SAVE.clear();
  assert.strictEqual(CEHP.SAVE.exists(), false, 'clear wipes v2');
  assert.ok(localStorage.getItem('cactusEd_save_v1'), 'clear leaves v1 archaeology intact');

  /* 9. Case seed format */
  var seed = CEHP.CaseSeed.make({
    date: new Date(Date.UTC(2026, 3, 20)), counter: 7, axis: 'CURIOSITY'
  });
  assert.strictEqual(seed, 'CASE-20260420-007-CURIOSITY-R2', 'case seed format matches doctrine');
  var parsed = CEHP.CaseSeed.parse(seed);
  assert.strictEqual(parsed.axis, 'CURIOSITY', 'case seed parses axis');
  assert.strictEqual(parsed.counter, 7, 'case seed parses counter');
  assert.strictEqual(parsed.ruleset, 'R2', 'case seed parses ruleset');

  /* 10. RNG determinism */
  var a = CEHP.makeRNG(seed);
  var b = CEHP.makeRNG(seed);
  for (var i = 0; i < 64; i++) {
    assert.strictEqual(a.next(), b.next(), 'same seed produces same sequence');
  }

  /* 11. Thermal presentation parity */
  var thermalBase = CEHP.Receipts.generate({
    seed: seed,
    worldId: 'orientation',
    axes: {
      primary: {
        compliance: 0.8,
        intuition: 0.2,
        curiosity: 0.3,
        grace: 0.4,
        chaos: 0.1,
        efficiency: 0.7
      },
      micro: { contradictionFollow: 2, modulesPassed: 5 }
    },
    tensions: { obedience: 0.7, style: 1.1, auditRisk: 0.1 }
  });
  var normalCard = CEHP.Receipts.cardModel(thermalBase, { worldId: 'orientation', thermal: false });
  var thermalCard = CEHP.Receipts.cardModel(thermalBase, { worldId: 'orientation', thermal: true });
  assert.strictEqual(JSON.stringify(normalCard.lines), JSON.stringify(thermalCard.lines), 'thermal mode preserves receipt lines');
  assert.strictEqual(JSON.stringify(normalCard.fragmentIds), JSON.stringify(thermalCard.fragmentIds), 'thermal mode preserves fragment ids');
  assert.strictEqual(normalCard.theme.mode, 'normal', 'normal card model reports normal mode');
  assert.strictEqual(thermalCard.theme.mode, 'thermal', 'thermal card model reports thermal mode');

  /* 12. Docket archive isolation */
  reset();
  var docketWeek = CEHP.Docket.weekInfo(new Date(Date.UTC(2026, 3, 20)));
  var docketSeed = CEHP.Docket.seedForWeek(docketWeek.year, docketWeek.isoWeek).seed;
  CEHP.Docket.recordReceipt({
    year: docketWeek.year,
    isoWeek: docketWeek.isoWeek,
    seed: docketSeed,
    worldId: 'orientation',
    lines: ['THIS WEEK WAS FILED.', 'THE CASE IS PUBLIC.', 'LOCAL RECEIPTS REST BELOW.'],
    fragmentIds: ['DOCKET_WEEK', 'PUBLIC_CASE', 'LOCAL_ARCHIVE'],
    flags: { thermal: true },
    ts: 1700000000000
  });
  assert.strictEqual(CEHP.SAVE.exists(), false, 'docket recording does not create save v2');
  assert.ok(localStorage.getItem(CEHP.K.DOCKET_WEEK), 'docket archive uses reserved key');
  assert.strictEqual(localStorage.getItem(CEHP.SAVE._key), null, 'docket archive does not write save key');
} catch (err) {
  console.error('REBUILD SAVE SCHEMA CHECK FAILED: ' + err.message);
  process.exit(1);
}

console.log('Rebuild save schema (v2 + archaeological v1) checks passed.');
