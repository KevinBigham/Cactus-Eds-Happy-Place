#!/usr/bin/env node
/* Print all ART4 prompt sidecars as one paste-ready batch. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(scriptDir, '..');
const artDir = path.join(gameDir, 'assets/art');
const manifestPath = path.join(artDir, 'art_manifest.json');

function assetKey(asset) {
  return 'cehp_art:' + [asset.category, asset.subject, asset.state, asset.variant].join(':');
}

function sidecarPath(asset) {
  return path.join(artDir, String(asset.file || '').replace(/\.png$/, '.prompt.md'));
}

function relativeToGame(filePath) {
  return path.relative(gameDir, filePath).split(path.sep).join('/');
}

function readManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function main() {
  const manifest = readManifest();
  const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
  let currentCategory = '';
  const lines = [];

  lines.push('# W15M-ART4 Batch Art Prompts');
  lines.push('');
  lines.push('Generated from `assets/art/art_manifest.json` and ' + assets.length + ' prompt sidecars.');
  lines.push('Paste asset sections into the image generator individually, or paste the full batch when regenerating the whole set.');

  assets.forEach((asset, index) => {
    const promptFile = sidecarPath(asset);
    let promptText = '';

    if (!fs.existsSync(promptFile)) {
      console.error('Missing prompt sidecar for ' + assetKey(asset) + ': ' + relativeToGame(promptFile));
      process.exit(1);
    }

    promptText = fs.readFileSync(promptFile, 'utf8').trim();
    if (!promptText) {
      console.error('Empty prompt sidecar for ' + assetKey(asset) + ': ' + relativeToGame(promptFile));
      process.exit(1);
    }

    if (asset.category !== currentCategory) {
      currentCategory = asset.category;
      lines.push('');
      lines.push('## ' + currentCategory);
    }

    lines.push('');
    lines.push('### ' + (index + 1) + '. ' + assetKey(asset));
    lines.push('');
    lines.push('Manifest path: `assets/art/' + asset.file + '`');
    lines.push('Target dimensions: `' + asset.resolution[0] + 'x' + asset.resolution[1] + '`');
    lines.push('Source sidecar: `' + relativeToGame(promptFile) + '`');
    lines.push('');
    lines.push('```markdown');
    lines.push(promptText);
    lines.push('```');
  });

  lines.push('');
  console.log(lines.join('\n'));
}

main();
