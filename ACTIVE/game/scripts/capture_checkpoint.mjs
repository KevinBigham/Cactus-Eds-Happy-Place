#!/usr/bin/env node
/*
 * capture_checkpoint.mjs — 30-second Playwright recording for Kevin checkpoints.
 *
 * What it does:
 *   1. Boots the shipped index.html headlessly.
 *   2. Records live gameplay at 1024x768 for N seconds (default 30).
 *   3. Drives the same input pattern autoplay.mjs uses (hold RIGHT, tap SPACE every 1400ms).
 *   4. Saves a .webm video + a 6-cell keyframe grid PNG into the output dir.
 *
 * Why this exists:
 *   Phase checkpoints require Kevin to eyeball visual parity against prior phases.
 *   Autoplay reports prove determinism; this proves it still looks right.
 *
 * Usage:
 *   node scripts/capture_checkpoint.mjs --phase 2 --world orientation
 *   node scripts/capture_checkpoint.mjs --phase 4 --world benefits --seconds 45
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const gameDir = path.resolve(path.dirname(__filename), '..');
const repoRoot = path.resolve(gameDir, '..', '..');
const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';

const WORLD_SEEDS = {
  orientation: 'CASE-20260429-001-BOOT-R1',
  benefits: 'CASE-20260506-001-BEN-R1',
  rasta: 'CASE-20260504-001-GRACE-R2'
};

const args = process.argv.slice(2);
function argValue(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}

const phaseLabel = argValue('--phase', '2');
const world = argValue('--world', 'orientation');
const seconds = Math.max(5, Math.min(120, Number(argValue('--seconds', '30')) || 30));
const seed = argValue('--seed', WORLD_SEEDS[world] || 'CASE-CHECKPOINT-R1');
const outputDir = argValue('--out', path.join(repoRoot, 'ACTIVE', 'delivery', 'w10_phase' + phaseLabel + '_checkpoint'));

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

async function ensureServer() {
  const target = new URL(baseUrl);
  const origin = target.protocol + '//' + target.hostname + ':' + target.port;
  try {
    const response = await fetch(origin + '/index.html');
    if (response.ok) return null;
  } catch (e) {}
  const child = spawn('python3', ['-m', 'http.server', target.port || '4175', '--bind', target.hostname], {
    cwd: gameDir,
    stdio: 'ignore'
  });
  await wait(1000);
  return child;
}

async function captureKeyframeGrid(page, cellCount, intervalMs, outputPath) {
  const shots = [];
  const canvas = page.locator('canvas').first();
  for (let i = 0; i < cellCount; i++) {
    const buf = await canvas.screenshot({ type: 'png' });
    shots.push(buf);
    if (i < cellCount - 1) await wait(intervalMs);
  }
  return shots;
}

async function composeGrid(shotBuffers, cols, rows, width, height, outputPath) {
  const sharp = await import('sharp').catch(function() { return null; });
  if (!sharp || !sharp.default) return null;
  const cellW = Math.floor(width / cols);
  const cellH = Math.floor(height / rows);
  const composites = [];
  for (let i = 0; i < shotBuffers.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const resized = await sharp.default(shotBuffers[i]).resize(cellW, cellH).toBuffer();
    composites.push({ input: resized, top: row * cellH, left: col * cellW });
  }
  await sharp.default({
    create: { width: cellW * cols, height: cellH * rows, channels: 3, background: { r: 0, g: 0, b: 0 } }
  }).composite(composites).png().toFile(outputPath);
  return outputPath;
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const server = await ensureServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: { dir: outputDir, size: { width: 1024, height: 768 } },
    viewport: { width: 1024, height: 768 }
  });

  const videoStamp = new Date().toISOString().replace(/[:.]/g, '-');
  const videoFinalName = 'w' + (world === 'orientation' ? '1' : (world === 'benefits' ? '2' : '3')) + '_' + world + '_' + seconds + 's.webm';
  const gridFinalName = 'w' + (world === 'orientation' ? '1' : (world === 'benefits' ? '2' : '3')) + '_' + world + '_keyframes.png';

  const shotBuffers = [];
  let jumpCount = 0;

  try {
    const page = await context.newPage();
    const url = baseUrl.replace(/\/$/, '') + '/index.html?world=' + encodeURIComponent(world) + '&case=' + encodeURIComponent(seed) + '&splash=0';
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForFunction(function() {
      var play = window.CEHP && window.CEHP._game && window.CEHP._game.scene &&
        window.CEHP._game.scene.getScene && window.CEHP._game.scene.getScene('Play');
      return !!(play && play.room && play.room.player);
    }, { timeout: 15000 });

    await page.locator('canvas').first().focus();
    await wait(250);

    const canvas = page.locator('canvas').first();
    const keyframeStampsMs = [];
    const gridCellCount = 6;
    for (let i = 0; i < gridCellCount; i++) {
      keyframeStampsMs.push(Math.floor((seconds * 1000 / (gridCellCount - 1)) * i));
    }

    await page.keyboard.down('ArrowRight');
    const startedAt = Date.now();
    const durationMs = seconds * 1000;
    const JUMP_INTERVAL_MS = 1400;
    const TICK_MS = 50;
    let nextJumpAt = JUMP_INTERVAL_MS;
    let nextKeyframeIdx = 0;

    while (Date.now() - startedAt < durationMs) {
      const elapsed = Date.now() - startedAt;

      if (nextKeyframeIdx < keyframeStampsMs.length && elapsed >= keyframeStampsMs[nextKeyframeIdx]) {
        const buf = await canvas.screenshot({ type: 'png' });
        shotBuffers.push(buf);
        nextKeyframeIdx++;
      }

      if (elapsed >= nextJumpAt) {
        await page.keyboard.press('Space', { delay: 60 });
        jumpCount++;
        nextJumpAt += JUMP_INTERVAL_MS;
      }

      await wait(TICK_MS);
    }

    // Top up any missed keyframes (edge case if timing slipped)
    while (shotBuffers.length < 6) {
      const buf = await canvas.screenshot({ type: 'png' });
      shotBuffers.push(buf);
    }

    await page.keyboard.up('ArrowRight');
    await wait(200);
    await page.close();
  } finally {
    await context.close(); // finalizes the .webm file
    await browser.close();
    if (server) server.kill('SIGTERM');
  }

  // Pick the newest .webm and rename it
  const webms = fs.readdirSync(outputDir).filter(function(f) { return f.endsWith('.webm'); });
  if (webms.length > 0) {
    const latest = webms.map(function(f) {
      return { f: f, mtime: fs.statSync(path.join(outputDir, f)).mtimeMs };
    }).sort(function(a, b) { return b.mtime - a.mtime; })[0];
    const finalVideoPath = path.join(outputDir, videoFinalName);
    if (latest.f !== videoFinalName) {
      if (fs.existsSync(finalVideoPath)) fs.unlinkSync(finalVideoPath);
      fs.renameSync(path.join(outputDir, latest.f), finalVideoPath);
    }
    console.log('[capture] video -> ' + finalVideoPath);
  } else {
    console.log('[capture] WARN: no .webm produced');
  }

  // Write an ES5-compatible fallback grid: individual PNGs + an index.json in case sharp missing
  const gridPath = path.join(outputDir, gridFinalName);
  const composed = await composeGrid(shotBuffers, 3, 2, 1200, 800, gridPath);
  if (composed) {
    console.log('[capture] keyframe grid -> ' + composed);
  } else {
    // Fallback: write each keyframe as its own PNG
    for (let i = 0; i < shotBuffers.length; i++) {
      const name = 'w' + (world === 'orientation' ? '1' : (world === 'benefits' ? '2' : '3')) + '_keyframe_' + String(i).padStart(2, '0') + '.png';
      fs.writeFileSync(path.join(outputDir, name), shotBuffers[i]);
    }
    console.log('[capture] sharp missing; wrote ' + shotBuffers.length + ' individual keyframe PNGs');
  }

  console.log('[capture] world=' + world + ' seed=' + seed + ' seconds=' + seconds + ' jumps=' + jumpCount);
  console.log('[capture] OK');
}

main().catch(function(error) {
  console.error(error.stack || error.message);
  process.exit(1);
});
