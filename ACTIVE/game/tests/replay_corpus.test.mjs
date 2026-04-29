import test from 'node:test';
import assert from 'node:assert/strict';
import childProcess from 'node:child_process';

test('replay corpus runner passes every committed fixture', () => {
  const result = childProcess.spawnSync('node', ['scripts/run_replays.mjs'], {
    cwd: '/Users/tkevinbigham/Projects/CEHP/ACTIVE/game',
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /PASS test_room_obedient.json/);
  assert.match(result.stdout, /PASS w2_benefits_insured.json/);
  assert.match(result.stdout, /PASS w2_benefits_uninsured.json/);
  assert.match(result.stdout, /PASS w3_rasta_short.json/);
  assert.match(result.stdout, /SUMMARY PASS 4\/4/);
});
