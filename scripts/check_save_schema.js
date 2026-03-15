#!/usr/bin/env node
'use strict';

// Legacy filename retained for compatibility. This script now validates the
// current live SAVE contract implemented in index.html.

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var assert = require('assert');

var htmlPath = path.join(__dirname, '..', 'index.html');
var src = fs.readFileSync(htmlPath, 'utf8');
var start = src.indexOf('// ── SAVE SYSTEM');
var end = src.indexOf('// ── GAMEPAD MANAGER');

if (start < 0 || end < 0 || end <= start) {
  console.error('Could not find live save-system section boundaries in index.html');
  process.exit(1);
}

var saveJs = src.slice(start, end);
var store = {};
var localStorage = {
  getItem: function(k) {
    return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
  },
  setItem: function(k, v) {
    store[k] = String(v);
  },
  removeItem: function(k) {
    delete store[k];
  }
};

var sandbox = {
  console: console,
  Math: Math,
  Date: Date,
  JSON: JSON,
  localStorage: localStorage
};

vm.createContext(sandbox);
vm.runInContext(saveJs, sandbox);

try {
  assert.ok(sandbox.SAVE && typeof sandbox.SAVE === 'object', 'SAVE should exist');
  assert.strictEqual(sandbox.SAVE._key, 'cactusEd_save_v1', 'SAVE._key should match live key');
  assert.strictEqual(typeof sandbox.SAVE.save, 'function', 'SAVE.save should exist');
  assert.strictEqual(typeof sandbox.SAVE.load, 'function', 'SAVE.load should exist');
  assert.strictEqual(typeof sandbox.SAVE.clear, 'function', 'SAVE.clear should exist');
  assert.strictEqual(typeof sandbox.SAVE.exists, 'function', 'SAVE.exists should exist');

  assert.strictEqual(sandbox.SAVE.exists(), false, 'SAVE.exists should be false when storage is empty');
  assert.strictEqual(sandbox.SAVE.load(), null, 'SAVE.load should return null when storage is empty');

  var payload = {
    world: 3,
    health: 3,
    aloe: 321,
    behavior: { curiosity: 2, compliance: 1 },
    deaths: 4,
    runs: 2,
    bestTime: 12345,
    totalKills: 9,
    assistMode: {
      biggerCoyote: true,
      slowerBosses: false,
      easyCopter: true,
      infiniteHealth: false,
      slowerGame: true
    }
  };

  assert.strictEqual(sandbox.SAVE.save(payload), true, 'SAVE.save should succeed');
  assert.strictEqual(sandbox.SAVE.exists(), true, 'SAVE.exists should be true after save');

  var loaded = sandbox.SAVE.load();
  assert.ok(loaded, 'SAVE.load should return an object after save');
  assert.strictEqual(loaded.world, payload.world, 'world should round-trip');
  assert.strictEqual(loaded.health, payload.health, 'health should round-trip');
  assert.strictEqual(loaded.aloe, payload.aloe, 'aloe should round-trip');
  assert.deepStrictEqual(loaded.behavior, payload.behavior, 'behavior should round-trip');
  assert.strictEqual(loaded.deaths, payload.deaths, 'deaths should round-trip');
  assert.strictEqual(loaded.runs, payload.runs, 'runs should round-trip');
  assert.strictEqual(loaded.bestTime, payload.bestTime, 'bestTime should round-trip');
  assert.strictEqual(loaded.totalKills, payload.totalKills, 'totalKills should round-trip');
  assert.deepStrictEqual(loaded.assistMode, payload.assistMode, 'assistMode should round-trip');
  assert.strictEqual(typeof loaded.timestamp, 'number', 'timestamp should be written');

  var raw = JSON.parse(store[sandbox.SAVE._key]);
  assert.strictEqual(raw.world, payload.world, 'stored JSON should match saved world');

  store[sandbox.SAVE._key] = '{not valid json';
  assert.strictEqual(sandbox.SAVE.load(), null, 'malformed save payload should load as null');
  assert.strictEqual(sandbox.SAVE.exists(), true, 'malformed save payload still exists in storage');

  sandbox.SAVE.clear();
  assert.strictEqual(sandbox.SAVE.exists(), false, 'SAVE.exists should be false after clear');
  assert.strictEqual(sandbox.SAVE.load(), null, 'SAVE.load should return null after clear');
} catch (err) {
  console.error('Live save contract checks failed: ' + err.message);
  process.exit(1);
}

console.log('Live save contract checks passed.');
