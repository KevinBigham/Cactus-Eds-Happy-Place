import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const artDir = path.join(gameDir, 'assets/art');
const manifestPath = path.join(artDir, 'art_manifest.json');
const generatorPath = path.join(gameDir, 'scripts/print_art_prompts.mjs');

function assetKey(asset) {
  return 'cehp_art:' + [asset.category, asset.subject, asset.state, asset.variant].join(':');
}

test('ART4 batch prompt generator prints all sidecar prompts grouped by category', () => {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const result = spawnSync(process.execPath, [generatorPath], {
    cwd: gameDir,
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /# W15M-ART4 Batch Art Prompts/);
  assert.match(result.stdout, /Generated from `assets\/art\/art_manifest\.json` and 37 prompt sidecars\./);

  const numberedPrompts = result.stdout.match(/^### [0-9]+\. /gm) || [];
  assert.equal(numberedPrompts.length, manifest.assets.length);

  const categories = new Set(manifest.assets.map((asset) => asset.category));
  categories.forEach((category) => {
    assert.match(result.stdout, new RegExp('## ' + category));
  });

  manifest.assets.forEach((asset) => {
    assert.match(result.stdout, new RegExp(assetKey(asset)));
    assert.match(result.stdout, new RegExp(asset.resolution[0] + 'x' + asset.resolution[1]));
  });
});
