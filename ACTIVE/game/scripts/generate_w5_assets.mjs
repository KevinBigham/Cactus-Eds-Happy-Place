#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const repoRoot = path.resolve(gameDir, '../..');
const marketingDir = path.resolve(gameDir, '../marketing/cr_pitch_v1');
const deliveryDir = path.resolve(gameDir, '../delivery/w5_demo');
const framesDir = path.resolve(deliveryDir, 'trailer_frames');
const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';
const docketDateIso = '2026-04-20T00:00:00.000Z';
const screenshotSelections = [
  { source: ['w1_orientation', 'frame_006_060000.png'], output: 'screenshot_w1_intake.png' },
  { source: ['w1_orientation', 'frame_018_180000.png'], output: 'screenshot_w1_certification.png' },
  { source: ['w2_benefits', 'frame_010_100000.png'], output: 'screenshot_w2_atrium.png' },
  { source: ['w2_benefits', 'frame_024_240000.png'], output: 'screenshot_w2_deductible.png' },
  { source: ['w3_rasta', 'frame_012_120000.png'], output: 'screenshot_w3_sync.png' },
  { source: ['w3_rasta', 'frame_027_270000.png'], output: 'screenshot_w3_warm_exit.png' }
];

function loadCanvas() {
  try {
    return require('../../discord/node_modules/canvas');
  } catch (canvasError) {
    return require('../../discord/node_modules/@napi-rs/canvas');
  }
}

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => { stdout += String(chunk); });
    child.stderr.on('data', (chunk) => { stderr += String(chunk); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error((stderr || stdout || `${cmd} exited ${code}`).trim()));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function ensureServer() {
  const target = new URL(baseUrl);
  const origin = `${target.protocol}//${target.hostname}:${target.port}`;

  try {
    const response = await fetch(`${origin}/index.html`);
    if (response.ok) return null;
  } catch (error) {}

  const child = spawn('python3', ['-m', 'http.server', target.port || '4175', '--bind', target.hostname], {
    cwd: gameDir,
    stdio: 'ignore'
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return child;
}

function ensureDirs() {
  fs.mkdirSync(marketingDir, { recursive: true });
  fs.mkdirSync(deliveryDir, { recursive: true });
  fs.mkdirSync(path.join(marketingDir, 'receipts'), { recursive: true });
  fs.mkdirSync(path.join(marketingDir, 'screenshots'), { recursive: true });
}

function copyScreenshots() {
  for (const item of screenshotSelections) {
    const src = path.join(framesDir, item.source[0], item.source[1]);
    const dst = path.join(marketingDir, 'screenshots', item.output);
    fs.copyFileSync(src, dst);
  }
}

async function renderReceipts(manifest) {
  for (const entry of manifest) {
    const normalOut = path.join(marketingDir, 'receipts', `${entry.world}_receipt_normal.png`);
    const thermalOut = path.join(marketingDir, 'receipts', `${entry.world}_receipt_thermal.png`);
    await run('node', [
      path.resolve(repoRoot, 'ACTIVE/discord/bot.js'),
      '--render', entry.seed,
      '--world', entry.world,
      '--output', normalOut
    ], repoRoot);
    await run('node', [
      path.resolve(repoRoot, 'ACTIVE/discord/bot.js'),
      '--render', entry.seed,
      '--world', entry.world,
      '--output', thermalOut,
      '--thermal'
    ], repoRoot);
  }
}

function coverImage(sourcePath, outPath, width, height, alignY) {
  const Canvas = loadCanvas();
  const { createCanvas, loadImage } = Canvas;
  return loadImage(sourcePath).then((image) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const sourceRatio = image.width / image.height;
    const targetRatio = width / height;
    let sx = 0;
    let sy = 0;
    let sw = image.width;
    let sh = image.height;

    if (sourceRatio > targetRatio) {
      sw = Math.round(image.height * targetRatio);
      sx = Math.round((image.width - sw) / 2);
    } else {
      sh = Math.round(image.width / targetRatio);
      sy = Math.round((image.height - sh) * (alignY == null ? 0.5 : alignY));
      sy = Math.max(0, Math.min(image.height - sh, sy));
    }

    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  });
}

async function buildPromoCrops() {
  const posterSource = path.join(marketingDir, 'screenshots', 'screenshot_w3_warm_exit.png');
  await coverImage(posterSource, path.join(marketingDir, 'poster_still_1920x1080.png'), 1920, 1080, 0.42);
  await coverImage(posterSource, path.join(marketingDir, 'steam_header_616x353.png'), 616, 353, 0.4);
  await coverImage(path.join(marketingDir, 'screenshots', 'screenshot_w2_atrium.png'), path.join(marketingDir, 'steam_capsule_460x215.png'), 460, 215, 0.38);
}

async function captureDocketSnapshot(manifest) {
  const server = await ensureServer();
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
    await page.goto(`${baseUrl.replace(/\/$/, '')}/index.html?docket=1&thermal=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
      return !!(
        window.CEHP &&
        window.CEHP.Docket &&
        document.getElementById('cehp-docket')
      );
    }, { timeout: 10000 });
    await page.evaluate((payload) => {
      var root = document.getElementById('cehp-docket');
      var when = new Date(payload.isoDate);
      var info;
      localStorage.removeItem(window.CEHP.K.DOCKET_WEEK);
      window.CEHP.Docket._now = function() {
        return new Date(payload.isoDate);
      };
      info = window.CEHP.Docket.weekInfo(when);
      for (var i = 0; i < payload.entries.length; i++) {
        window.CEHP.Docket.recordReceipt({
          year: info.year,
          isoWeek: info.isoWeek,
          seed: payload.entries[i].seed,
          worldId: payload.entries[i].world,
          lines: payload.entries[i].receipt.lines,
          fragmentIds: payload.entries[i].receipt.fragmentIds,
          flags: { thermal: false },
          ts: Date.parse(payload.isoDate) + i
        });
      }
      window.CEHP.Docket.renderInto(root, '?docket=1&thermal=1');
    }, { entries: manifest, isoDate: docketDateIso });
    await page.locator('#cehp-docket').screenshot({ path: path.join(marketingDir, 'docket_archive_snapshot.png') });
  } finally {
    await browser.close();
    if (server) server.kill('SIGTERM');
  }
}

function bundleOutputs() {
  fs.copyFileSync(path.join(gameDir, 'index.html'), path.join(deliveryDir, 'index.html'));
  fs.copyFileSync(path.join(marketingDir, 'docket_archive_snapshot.png'), path.join(deliveryDir, 'docket_archive_snapshot.png'));
  fs.copyFileSync(path.resolve(gameDir, '../docs/DNS_CUTOVER.md'), path.join(deliveryDir, 'DNS_CUTOVER.md'));
  fs.cpSync(path.join(marketingDir, 'receipts'), path.join(deliveryDir, 'receipts'), { recursive: true });
  fs.cpSync(marketingDir, path.join(deliveryDir, 'cr_pitch_v1'), { recursive: true });
}

function writeReadme(manifest) {
  const receiptLines = manifest.map((entry) => {
    return `- ${entry.world}: ${entry.seed} — ${entry.receipt.lines.join(' / ')}`;
  }).join('\n');
  const readme = [
    '# CEHP Week 5 Demo Bundle',
    '',
    'This bundle contains the local Week 5 launch-prep slice for Cactus Ed\'s Happiest Place.',
    '',
    '## Included',
    '- `index.html` — current 32-module single-file build',
    '- `trailer_frames/` — deterministic frame sequences for W1, W2, and W3 source runs',
    '- `cr_pitch_v1/` — Steam crops, poster still, six gameplay screenshots, receipt PNGs, and docket snapshot',
    '- `docket_archive_snapshot.png` — current weekly docket surface',
    '',
    '## Seed references',
    receiptLines,
    '',
    '## Notes',
    '- Thermal receipts are presentation-only. Receipt text and fragment IDs match the normal renders.',
    '- DNS is not flipped. Use `ACTIVE/docs/DNS_CUTOVER.md` for registrar handoff steps.',
    '- Trailer source material is longer than the final cut target. Week 6 edit should stay under 30 seconds.'
  ].join('\n');
  fs.writeFileSync(path.join(deliveryDir, 'README.md'), readme);
}

async function main() {
  ensureDirs();
  await run('node', ['scripts/capture_trailer.mjs'], gameDir);
  const manifest = JSON.parse(fs.readFileSync(path.join(framesDir, 'manifest.json'), 'utf8'));
  copyScreenshots();
  await renderReceipts(manifest);
  await buildPromoCrops();
  await captureDocketSnapshot(manifest);
  bundleOutputs();
  writeReadme(manifest);
  console.log('Generated Week 5 marketing assets and delivery bundle.');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
