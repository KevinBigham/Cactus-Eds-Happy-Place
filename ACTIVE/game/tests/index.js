const test = require('node:test');
const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const path = require('node:path');

const gameDir = path.resolve(__dirname, '..');

test('CEHP launch verification passes from directory test entrypoint', () => {
  const result = childProcess.spawnSync('bash', ['scripts/verify-launch.sh'], {
    cwd: gameDir,
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /CEHP LAUNCH VERIFY: PASS/);
});
