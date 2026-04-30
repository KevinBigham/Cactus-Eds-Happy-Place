import test from 'node:test';
import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const gameDir = '/Users/tkevinbigham/Projects/CEHP/ACTIVE/game';
const replayDir = path.join(gameDir, '_canon/replays/cehp');

test('replay corpus runner passes every committed fixture', () => {
  const fixtureCount = fs.readdirSync(replayDir).filter((file) => /\.json$/.test(file)).length;
  const result = childProcess.spawnSync('node', ['scripts/run_replays.mjs'], {
    cwd: gameDir,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /PASS test_room_obedient.json/);
  assert.match(result.stdout, /PASS w1_orientation_trust_declined.json/);
  assert.match(result.stdout, /PASS w2_benefits_enrollment_open_concept_receipt.json/);
  assert.match(result.stdout, /PASS w2_benefits_uninsured_open_concept_receipt.json/);
  assert.match(result.stdout, /PASS w3_rasta_logistics_supply_chain_receipt.json/);
  assert.match(result.stdout, new RegExp(`SUMMARY PASS ${fixtureCount}/${fixtureCount}`));
});
