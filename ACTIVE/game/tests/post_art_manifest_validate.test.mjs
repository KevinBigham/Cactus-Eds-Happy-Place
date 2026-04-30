import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const validatorPath = path.join(gameDir, 'scripts/validate_art_manifest.mjs');
const dimensionsPath = path.join(gameDir, 'assets/art/art_dimensions.json');

test('ART4 manifest validator passes the committed art manifest', () => {
  const result = spawnSync(process.execPath, [validatorPath], {
    cwd: gameDir,
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /ART MANIFEST VALIDATE: OK/);
  assert.match(result.stdout, /37\/37 assets passed/);
});

test('ART4 dimension contract locks current category and per-key sizes', () => {
  assert.equal(fs.existsSync(dimensionsPath), true, 'art_dimensions.json exists');
  const contract = JSON.parse(fs.readFileSync(dimensionsPath, 'utf8'));

  assert.deepEqual(contract.categoryDimensions.characters, [1024, 1024]);
  assert.deepEqual(contract.categoryDimensions.bosses, [1024, 1024]);
  assert.deepEqual(contract.categoryDimensions.environments, [1024, 576]);
  assert.deepEqual(contract.keyDimensions['enemies.reply_all_locust.swarm.01'], [1024, 576]);
  assert.deepEqual(contract.keyDimensions['setpieces.trust_fall.hero.01'], [1024, 1024]);
  assert.deepEqual(contract.keyDimensions['splash.cehp_title_background.title_background.01'], [1920, 1080]);

  const result = spawnSync(process.execPath, [validatorPath], {
    cwd: gameDir,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Dimension contract: OK/);
});
