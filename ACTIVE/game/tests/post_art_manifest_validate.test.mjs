import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const artDir = path.join(gameDir, 'assets/art');
const manifestPath = path.join(artDir, 'art_manifest.json');
const validatorPath = path.join(gameDir, 'scripts/validate_art_manifest.mjs');
const dimensionsPath = path.join(gameDir, 'assets/art/art_dimensions.json');

function sidecarPath(file) {
  return path.join(artDir, file.replace(/\.png$/, '.prompt.md'));
}

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

test('ART4 prompt sidecars exist for every manifest asset', () => {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const sidecars = manifest.assets.map((asset) => sidecarPath(asset.file));

  assert.equal(sidecars.length, 37);
  sidecars.forEach((filePath, index) => {
    const asset = manifest.assets[index];
    const text = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    assert.equal(fs.existsSync(filePath), true, asset.file + ' prompt sidecar exists');
    assert.match(text, new RegExp('cehp_art:' + asset.category + ':' + asset.subject + ':' + asset.state + ':' + asset.variant));
    assert.match(text, new RegExp(asset.resolution[0] + 'x' + asset.resolution[1]));
    assert.match(text, /DKC-inspired pre-rendered chunkiness/);
  });

  const result = spawnSync(process.execPath, [validatorPath], {
    cwd: gameDir,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Prompt sidecars: OK/);
});
