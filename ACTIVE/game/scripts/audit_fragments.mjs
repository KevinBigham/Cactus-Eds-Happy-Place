#!/usr/bin/env node
/* CEHP fragment audit — walks every fragment registered into the
   VERDICTS, TENSIONS, and CLOSERS receipt pools and reports voice-rule
   compliance, ID prefix discipline, duplicate detection, and a
   population census. Read-only sweep; no source mutation. */
'use strict';

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

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

function violations(fragment) {
  const issues = [];
  const text = String(fragment.text || '');
  if (text.length === 0) issues.push('empty text');
  if (text !== text.toUpperCase()) issues.push('not ALL CAPS');
  if (!text.endsWith('.')) issues.push('does not end with .');
  if (text.includes('!')) issues.push('contains !');
  if (words(text).length > 8) issues.push(`>8 words (got ${words(text).length})`);
  if (!fragment.id || typeof fragment.id !== 'string') issues.push('missing or invalid id');
  return issues;
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

function audit() {
  const CEHP = loadAllModules();
  const pools = CEHP.Receipts && CEHP.Receipts.POOLS;
  if (!pools) {
    console.error('ERROR: CEHP.Receipts.POOLS missing');
    process.exit(2);
  }

  const census = {};
  const violatorList = [];
  const idMap = {};
  let total = 0;

  ['VERDICTS', 'TENSIONS', 'CLOSERS'].forEach((poolName) => {
    const pool = pools[poolName] || [];
    const familyCounts = {};
    pool.forEach((fragment) => {
      total += 1;
      const issues = violations(fragment);
      if (issues.length > 0) {
        violatorList.push({ pool: poolName, id: fragment.id, issues });
      }
      const family = classifyFamily(fragment.id || '');
      familyCounts[family] = (familyCounts[family] || 0) + 1;
      if (idMap[fragment.id]) {
        idMap[fragment.id].push(poolName);
      } else {
        idMap[fragment.id] = [poolName];
      }
    });
    census[poolName] = { count: pool.length, families: familyCounts };
  });

  const duplicates = Object.keys(idMap).filter((id) => idMap[id].length > 1);

  console.log('CEHP FRAGMENT AUDIT');
  console.log('===================');
  console.log('');
  console.log('Population Census:');
  Object.keys(census).forEach((poolName) => {
    const c = census[poolName];
    console.log(`  ${poolName}: ${c.count} fragments`);
    Object.keys(c.families).sort().forEach((fam) => {
      console.log(`    ${fam}: ${c.families[fam]}`);
    });
  });
  console.log(`  TOTAL: ${total} fragments across all pools`);
  console.log('');
  console.log(`Voice rule violations: ${violatorList.length}`);
  if (violatorList.length > 0) {
    violatorList.forEach((v) => {
      console.log(`  ${v.pool}/${v.id}: ${v.issues.join('; ')}`);
    });
  }
  console.log('');
  console.log(`Duplicate IDs across pools: ${duplicates.length}`);
  if (duplicates.length > 0) {
    duplicates.forEach((id) => {
      console.log(`  ${id} in ${idMap[id].join(', ')}`);
    });
  }

  if (violatorList.length > 0 || duplicates.length > 0) {
    console.log('');
    console.log('AUDIT FAIL');
    process.exit(1);
  }
  console.log('');
  console.log('AUDIT PASS');
}

audit();
