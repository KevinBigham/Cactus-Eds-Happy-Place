#!/usr/bin/env node
/* CEHP ART4 manifest validator. Read-only sweep for generated art plates. */
'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(scriptDir, '..');
const artDir = path.join(gameDir, 'assets/art');
const manifestPath = path.join(artDir, 'art_manifest.json');
const dimensionsPath = path.join(artDir, 'art_dimensions.json');
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function pngHeader(filePath) {
  const buf = Buffer.alloc(24);
  const fd = fs.openSync(filePath, 'r');
  let bytesRead = 0;

  try {
    bytesRead = fs.readSync(fd, buf, 0, buf.length, 0);
  } finally {
    fs.closeSync(fd);
  }

  if (bytesRead < 24) {
    return { ok: false, error: 'PNG header is shorter than 24 bytes' };
  }

  if (buf.subarray(0, 8).compare(pngMagic) !== 0) {
    return { ok: false, error: 'PNG magic bytes mismatch' };
  }

  if (buf.subarray(12, 16).toString('ascii') !== 'IHDR') {
    return { ok: false, error: 'PNG IHDR chunk missing at byte 12' };
  }

  return {
    ok: true,
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20)
  };
}

function assetKey(asset) {
  return [asset.category, asset.subject, asset.state, asset.variant].join('.');
}

function sameSize(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a[0] === b[0] && a[1] === b[1];
}

function promptSidecarPath(asset) {
  return path.join(artDir, String(asset.file || '').replace(/\.png$/, '.prompt.md'));
}

function validateAsset(asset) {
  const errors = [];
  const filePath = path.join(artDir, asset.file || '');
  let stat;
  let header;
  let expected;
  let promptPath;

  if (!asset.category) errors.push('missing category');
  if (!asset.subject) errors.push('missing subject');
  if (!asset.state) errors.push('missing state');
  if (!asset.variant) errors.push('missing variant');
  if (!asset.file) errors.push('missing file');
  if (!Array.isArray(asset.resolution) || asset.resolution.length !== 2) {
    errors.push('missing resolution [width,height]');
  }

  if (!errors.length && !fs.existsSync(filePath)) {
    errors.push('PNG path missing');
  }

  if (!errors.length) {
    stat = fs.statSync(filePath);
    if (!stat.isFile()) errors.push('PNG path is not a file');
    if (stat.size <= 0) errors.push('PNG file is empty');
  }

  if (!errors.length) {
    header = pngHeader(filePath);
    if (!header.ok) {
      errors.push(header.error);
    } else {
      expected = asset.resolution;
      if (header.width !== expected[0] || header.height !== expected[1]) {
        errors.push('PNG dimensions ' + header.width + 'x' + header.height + ' != manifest ' + expected[0] + 'x' + expected[1]);
      }
    }
  }

  if (!errors.length) {
    promptPath = promptSidecarPath(asset);
    if (!fs.existsSync(promptPath)) {
      errors.push('prompt sidecar missing');
    } else if (fs.statSync(promptPath).size <= 0) {
      errors.push('prompt sidecar is empty');
    }
  }

  return {
    key: assetKey(asset),
    asset,
    file: asset.file || '(missing file)',
    prompt: promptPath,
    stat,
    header,
    errors
  };
}

function validate() {
  const manifest = readJson(manifestPath);
  const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
  const results = assets.map(validateAsset);
  const failures = [];
  let contract = null;
  let contractOk = true;
  let promptOk = true;

  console.log('CEHP ART MANIFEST VALIDATE');
  console.log('==========================');
  console.log('Manifest: ' + path.relative(gameDir, manifestPath));
  console.log('Assets: ' + assets.length);
  console.log('');

  if (manifest.schemaVersion !== 1) {
    failures.push({ key: 'manifest', file: 'art_manifest.json', errors: ['schemaVersion must be 1'] });
  }

  if (manifest.totalAssets !== assets.length) {
    failures.push({ key: 'manifest', file: 'art_manifest.json', errors: ['totalAssets ' + manifest.totalAssets + ' != assets length ' + assets.length] });
  }

  if (!fs.existsSync(dimensionsPath)) {
    contractOk = false;
    failures.push({ key: 'dimensions', file: 'art_dimensions.json', errors: ['dimension contract missing'] });
  } else {
    contract = readJson(dimensionsPath);
    if (contract.schemaVersion !== 1) {
      contractOk = false;
      failures.push({ key: 'dimensions', file: 'art_dimensions.json', errors: ['schemaVersion must be 1'] });
    }
    results.forEach((result) => {
      const categoryDimensions = contract.categoryDimensions || {};
      const keyDimensions = contract.keyDimensions || {};
      const expected = categoryDimensions[result.asset.category] || keyDimensions[result.key];
      const actual = result.header && result.header.ok ? [result.header.width, result.header.height] : null;
      if (!expected) {
        contractOk = false;
        result.errors.push('dimension contract missing for ' + result.key);
      } else if (!sameSize(expected, result.asset.resolution)) {
        contractOk = false;
        result.errors.push('dimension contract ' + expected.join('x') + ' != manifest ' + result.asset.resolution.join('x'));
      } else if (actual && !sameSize(expected, actual)) {
        contractOk = false;
        result.errors.push('dimension contract ' + expected.join('x') + ' != PNG ' + actual.join('x'));
      }
    });
  }

  results.forEach((result) => {
    if (!result.prompt || !fs.existsSync(result.prompt)) promptOk = false;
    if (result.errors.length > 0) {
      console.log('FAIL ' + result.key + ' -> ' + result.file + ': ' + result.errors.join('; '));
    } else {
      console.log('PASS ' + result.key + ' -> ' + result.file + ' ' + result.header.width + 'x' + result.header.height + ' ' + result.stat.size + 'B');
    }
  });

  console.log('');
  console.log('Dimension contract: ' + (contractOk ? 'OK' : 'FAIL'));
  console.log('Prompt sidecars: ' + (promptOk ? 'OK' : 'FAIL'));

  const assetFailures = results.filter((result) => result.errors.length > 0);
  const allFailures = failures.concat(assetFailures);

  if (allFailures.length > 0) {
    console.log('ART MANIFEST VALIDATE: FAIL');
    console.log((assets.length - assetFailures.length) + '/' + assets.length + ' assets passed');
    process.exit(1);
  }

  console.log('ART MANIFEST VALIDATE: OK');
  console.log(assets.length + '/' + assets.length + ' assets passed');
}

validate();
