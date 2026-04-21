#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const outputRoot = path.resolve(gameDir, '../delivery/w5_demo/trailer_frames');
const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';
const sourceDurationMs = 300000;
const captureIntervalMs = 10000;
const captureConfigs = [
  { world: 'orientation', style: 'obedient', seed: 'CASE-20260429-001-BOOT-R1', slug: 'w1_orientation' },
  { world: 'benefits', style: 'insured', seed: 'CASE-20260506-001-BEN-R1', slug: 'w2_benefits' },
  { world: 'rasta', style: 'ambient', seed: 'CASE-20260504-001-GRACE-R2', slug: 'w3_rasta' }
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  await wait(1000);
  return child;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function interpolateFrame(frames, actualMs) {
  let i;
  let a;
  let b;
  let ratio;
  if (!frames || !frames.length) {
    return { x: 72, y: 396, facing: 1 };
  }
  if (actualMs <= frames[0][0]) {
    return { x: frames[0][1], y: frames[0][2], facing: frames[0][3] || 1 };
  }
  for (i = 0; i < frames.length - 1; i++) {
    a = frames[i];
    b = frames[i + 1];
    if (actualMs >= a[0] && actualMs <= b[0]) {
      ratio = (actualMs - a[0]) / Math.max(1, b[0] - a[0]);
      return {
        x: Math.round(a[1] + ((b[1] - a[1]) * ratio)),
        y: Math.round(a[2] + ((b[2] - a[2]) * ratio)),
        facing: ratio >= 0.5 ? (b[3] || 1) : (a[3] || 1)
      };
    }
  }
  a = frames[frames.length - 1];
  return { x: a[1], y: a[2], facing: a[3] || 1 };
}

async function loadSummary(page, config) {
  await page.goto(`${baseUrl.replace(/\/$/, '')}/index.html?world=${encodeURIComponent(config.world)}&case=${encodeURIComponent(config.seed)}`, {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForFunction(() => {
    return !!(
      window.CEHP &&
      window.CEHP.Debug &&
      typeof window.CEHP.Debug.runStyle === 'function'
    );
  }, { timeout: 10000 });
  return page.evaluate((style) => window.CEHP.Debug.runStyle(style), config.style);
}

async function captureFrames(page, config, summary, targetDir) {
  const canvas = page.locator('canvas').first();
  const actualDuration = summary.frames && summary.frames.length ? summary.frames[summary.frames.length - 1][0] : 1;
  const frameCount = Math.floor(sourceDurationMs / captureIntervalMs) + 1;

  await page.goto(`${baseUrl.replace(/\/$/, '')}/index.html?world=${encodeURIComponent(config.world)}&case=${encodeURIComponent(config.seed)}`, {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForFunction(() => {
    return !!(
      window.CEHP &&
      window.CEHP._game &&
      window.CEHP._game.scene &&
      window.CEHP._game.scene.getScene &&
      window.CEHP._game.scene.getScene('Play') &&
      window.CEHP._game.scene.getScene('Play').player
    );
  }, { timeout: 10000 });

  for (let index = 0; index < frameCount; index++) {
    const sourceMs = index * captureIntervalMs;
    const actualMs = Math.round((sourceMs / sourceDurationMs) * actualDuration);
    const frame = interpolateFrame(summary.frames, actualMs);
    const output = path.join(targetDir, `frame_${String(index).padStart(3, '0')}_${String(sourceMs).padStart(6, '0')}.png`);

    await page.evaluate((payload) => {
      var game = window.CEHP._game;
      var play = game.scene.getScene('Play');
      var player = play.player;
      var maxScroll = Math.max(0, (play.room && play.room.width ? play.room.width : window.CEHP.GAME_W) - window.CEHP.GAME_W);
      player.x = payload.x;
      player.y = payload.y;
      player.facing = payload.facing;
      if (player.body && player.body.reset) player.body.reset(payload.x, payload.y);
      if (player.body && player.body.setVelocity) player.body.setVelocity(0, 0);
      play.cameras.main.scrollX = Math.max(0, Math.min(maxScroll, payload.x - (window.CEHP.GAME_W / 2)));
      play.cameras.main.scrollY = 0;
    }, frame);
    await wait(40);
    await canvas.screenshot({ path: output });
  }

  await page.evaluate((style) => window.CEHP.Debug.runStyle(style), config.style);
  await page.waitForFunction(() => {
    return !!(
      window.CEHP &&
      window.CEHP._game &&
      window.CEHP._game.scene &&
      window.CEHP._game.scene.getScene &&
      window.CEHP._game.scene.getScene('Receipt') &&
      window.CEHP._game.scene.getScene('Receipt').scene.isActive()
    );
  }, { timeout: 10000 });
  await wait(40);
  await canvas.screenshot({ path: path.join(targetDir, 'receipt.png') });
}

async function main() {
  fs.mkdirSync(outputRoot, { recursive: true });

  const server = await ensureServer();
  const browser = await chromium.launch({ headless: true });
  const manifest = [];

  try {
    for (const config of captureConfigs) {
      const targetDir = path.join(outputRoot, config.slug);
      const summaryPage = await browser.newPage({ viewport: { width: 1024, height: 896 } });
      const capturePage = await browser.newPage({ viewport: { width: 1024, height: 896 } });
      let summary;

      fs.mkdirSync(targetDir, { recursive: true });
      summary = await loadSummary(summaryPage, config);
      await captureFrames(capturePage, config, summary, targetDir);

      manifest.push({
        world: config.world,
        style: config.style,
        seed: config.seed,
        sourceDurationMs,
        captureIntervalMs,
        frames: summary.frames.length,
        receipt: summary.receipt
      });

      await summaryPage.close();
      await capturePage.close();
    }

    fs.writeFileSync(path.join(outputRoot, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('Captured trailer frames -> ' + outputRoot);
  } finally {
    await browser.close();
    if (server) server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
