import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

const PRIORITY = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '04_fixed_step.js',
  '04_save.js',
  '05_caseseed.js',
  '05_input_buffer.js',
  '06_cancel_matrix.js',
  '07_ed_state.js'
];

function priorityIndex(file) {
  const idx = PRIORITY.indexOf(file);
  return idx >= 0 ? idx : -1;
}

function compareFiles(a, b) {
  const aP = priorityIndex(a);
  const bP = priorityIndex(b);
  if (aP >= 0 || bP >= 0) {
    if (aP < 0) return 1;
    if (bP < 0) return -1;
    return aP - bP;
  }
  return a < b ? -1 : a > b ? 1 : 0;
}

function buildSandbox() {
  const sandbox = {
    console,
    Math,
    JSON,
    window: null,
    document: { readyState: 'loading', getElementById() { return null; } },
    addEventListener() {},
    removeEventListener() {},
    setTimeout: () => 0,
    clearTimeout() {}
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  return sandbox;
}

function loadAllModules() {
  const sandbox = buildSandbox();
  const files = fs.readdirSync(srcDir)
    .filter((f) => /\.js$/.test(f))
    .sort(compareFiles);
  const source = files.map((f) => fs.readFileSync(path.join(srcDir, f), 'utf8')).join('\n');
  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

function words(text) {
  return String(text || '').replace(/\.$/, '').split(/\s+/).filter(Boolean);
}

function classifyFamily(id) {
  if (/^W15_VERDICT_/.test(id) || /^W15_TENSION_/.test(id)) return 'W15_DEPTH';
  if (/^W15_(SUPERVISOR|ENROLLMENT|LOGISTICS)_CLOSER_/.test(id)) return 'W15_BOSS';
  if (/^W15_(TRUST_FALL|OPEN_CONCEPT|SUPPLY_CHAIN)_/.test(id)) return 'W15_SETPIECE';
  if (/^W15_RUN_COMPLETE_/.test(id)) return 'W15_META';
  if (/^W15_CLOSER_AXIS_/.test(id)) return 'W15_AXIS';
  if (/^W11_/.test(id)) return 'W11';
  if (/^W12_/.test(id)) return 'W12';
  return 'BASE';
}

test('Every registered fragment honors the global voice rule', () => {
  const CEHP = loadAllModules();
  const pools = CEHP.Receipts.POOLS;
  const violators = [];

  ['VERDICTS', 'TENSIONS', 'CLOSERS'].forEach((poolName) => {
    const pool = pools[poolName] || [];
    pool.forEach((fragment) => {
      const text = String(fragment.text || '');
      const issues = [];
      if (text.length === 0) issues.push('empty text');
      if (text !== text.toUpperCase()) issues.push('not ALL CAPS');
      if (!text.endsWith('.')) issues.push('does not end with .');
      if (text.includes('!')) issues.push('contains !');
      if (words(text).length > 8) issues.push(`>8 words (got ${words(text).length})`);
      if (!fragment.id || typeof fragment.id !== 'string') issues.push('missing id');
      if (issues.length > 0) {
        violators.push({ pool: poolName, id: fragment.id, issues });
      }
    });
  });

  assert.equal(violators.length, 0,
    `voice rule violations: ${JSON.stringify(violators, null, 2)}`);
});

test('No fragment ID is duplicated across any pool', () => {
  const CEHP = loadAllModules();
  const pools = CEHP.Receipts.POOLS;
  const idMap = {};
  ['VERDICTS', 'TENSIONS', 'CLOSERS'].forEach((poolName) => {
    const pool = pools[poolName] || [];
    pool.forEach((fragment) => {
      if (idMap[fragment.id]) {
        idMap[fragment.id].push(poolName);
      } else {
        idMap[fragment.id] = [poolName];
      }
    });
  });
  const duplicates = Object.keys(idMap).filter((id) => idMap[id].length > 1);
  assert.equal(duplicates.length, 0,
    `duplicate IDs: ${duplicates.map((id) => `${id} in ${idMap[id].join(',')}`).join('; ')}`);
});

test('Pool population census meets V3 marathon expectations', () => {
  const CEHP = loadAllModules();
  const pools = CEHP.Receipts.POOLS;

  // Pool minimums after V3 marathon:
  //   VERDICTS: base ~100 + W15_DEPTH 15 + W11/W12 ≈ 5 → ≥ 115
  //   TENSIONS: base ~110 + W15_DEPTH 15 + W11/W12 ≈ 5 → ≥ 125
  //   CLOSERS:  base ~112 + W15_AXIS 12 + W15_BOSS 15 + W15_SETPIECE 16
  //             + W15_META 9 + W11 4 → ≥ 165
  assert.ok(pools.VERDICTS.length >= 115,
    `VERDICTS pool too small: ${pools.VERDICTS.length}`);
  assert.ok(pools.TENSIONS.length >= 125,
    `TENSIONS pool too small: ${pools.TENSIONS.length}`);
  assert.ok(pools.CLOSERS.length >= 165,
    `CLOSERS pool too small: ${pools.CLOSERS.length}`);
});

test('Every W15 pool family is represented at expected count', () => {
  const CEHP = loadAllModules();
  const pools = CEHP.Receipts.POOLS;
  const counts = {};

  ['VERDICTS', 'TENSIONS', 'CLOSERS'].forEach((poolName) => {
    const pool = pools[poolName] || [];
    pool.forEach((fragment) => {
      const fam = classifyFamily(fragment.id || '');
      counts[fam] = (counts[fam] || 0) + 1;
    });
  });

  // V3-marathon family counts (additive, never decreasing):
  assert.equal(counts.W15_DEPTH, 30,
    `expected 30 W15_DEPTH (15 verdict + 15 tension), got ${counts.W15_DEPTH}`);
  assert.equal(counts.W15_BOSS, 15,
    `expected 15 W15_BOSS closers (5 supervisor + 5 enrollment + 5 logistics), got ${counts.W15_BOSS}`);
  assert.equal(counts.W15_SETPIECE, 16,
    `expected 16 W15_SETPIECE closers, got ${counts.W15_SETPIECE}`);
  assert.equal(counts.W15_META, 9,
    `expected 9 W15_META run-complete monologue closers, got ${counts.W15_META}`);
  assert.equal(counts.W15_AXIS, 12,
    `expected 12 W15_AXIS closer overflow (4 chaos + 4 curiosity + 4 efficiency), got ${counts.W15_AXIS}`);
});

test('Every W15 fragment carries an axes, tensions, micro, or worlds key', () => {
  const CEHP = loadAllModules();
  const pools = CEHP.Receipts.POOLS;

  ['VERDICTS', 'TENSIONS', 'CLOSERS'].forEach((poolName) => {
    const pool = pools[poolName] || [];
    pool.forEach((fragment) => {
      if (!/^W15_/.test(fragment.id || '')) return;
      const hasShape = !!(
        fragment.axes ||
        fragment.tensions ||
        fragment.micro ||
        fragment.worlds ||
        fragment.flags
      );
      assert.ok(hasShape,
        `${fragment.id} (W15) must carry at least one of axes/tensions/micro/worlds/flags`);
    });
  });
});
