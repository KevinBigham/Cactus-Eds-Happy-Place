import test from 'node:test';
import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const manifestPath = path.join(gameDir, 'process_manifest.json');
const packagePath = path.join(gameDir, 'package.json');
const checkerPath = path.join(gameDir, 'scripts/check_process_manifest.mjs');
const fullVerifyPath = path.join(gameDir, 'scripts/verify-w10-full.sh');

test('process manifest is executable and wired into package scripts', () => {
  assert.equal(fs.existsSync(manifestPath), true, 'process_manifest.json exists');
  assert.equal(fs.existsSync(checkerPath), true, 'check_process_manifest.mjs exists');
  assert.equal(fs.existsSync(fullVerifyPath), true, 'verify-w10-full.sh exists');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  assert.equal(manifest.schemaVersion, 1, 'manifest schema version is pinned');
  assert.equal(pkg.scripts['verify:process'], 'node scripts/check_process_manifest.mjs');
  assert.equal(pkg.scripts['verify:w10'], 'bash scripts/verify-w10-full.sh');

  childProcess.execFileSync(process.execPath, ['scripts/check_process_manifest.mjs'], {
    cwd: gameDir,
    stdio: 'pipe'
  });
});
