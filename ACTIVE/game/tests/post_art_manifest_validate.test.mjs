import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const validatorPath = path.join(gameDir, 'scripts/validate_art_manifest.mjs');

test('ART4 manifest validator passes the committed art manifest', () => {
  const result = spawnSync(process.execPath, [validatorPath], {
    cwd: gameDir,
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /ART MANIFEST VALIDATE: OK/);
  assert.match(result.stdout, /37\/37 assets passed/);
});
