#!/usr/bin/env node

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const gameDir = '/Users/tkevinbigham/Projects/CEHP/ACTIVE/game';
const baseUrl = process.argv[2] || process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';
const seeds = {
  orientation: 'CASE-20260429-001-BOOT-R1',
  benefits: 'CASE-20260506-001-BEN-R1',
  rasta: 'CASE-20260504-001-GRACE-R2'
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isIgnorableConsoleError(message) {
  const text = message.text();
  return /favicon\.ico/i.test(text) || /Failed to load resource/i.test(text);
}

function collect(page) {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !isIgnorableConsoleError(message)) {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return { consoleErrors, pageErrors };
}

function basePageUrl() {
  const url = new URL(baseUrl);
  if (!url.pathname || url.pathname === '') {
    url.pathname = '/';
  }
  return url;
}

function buildUrl(searchParams) {
  const url = basePageUrl();
  url.search = searchParams || '';
  return url.toString();
}

function localBase(url) {
  return url.hostname === '127.0.0.1' || url.hostname === 'localhost';
}

async function ensureServer() {
  const target = basePageUrl();
  if (!localBase(target)) return null;

  try {
    const response = await fetch(buildUrl(''));
    if (response.ok) return null;
  } catch (error) {}

  const child = spawn('python3', ['-m', 'http.server', target.port || '4175', '--bind', target.hostname], {
    cwd: gameDir,
    stdio: 'ignore'
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return child;
}

async function checkGameRoute(browser, label, search, expectedWorldId) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();
  const signals = collect(page);
  let summary;

  await page.goto(buildUrl(search), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    return !!(
      window.CEHP &&
      window.CEHP._game &&
      window.CEHP._game.scene &&
      window.CEHP._game.scene.getScene &&
      window.CEHP._game.scene.getScene('Play') &&
      window.CEHP._game.scene.getScene('Play').scene.isActive()
    );
  }, { timeout: 10000 });

  summary = await page.evaluate(() => {
    const play = window.CEHP._game.scene.getScene('Play');
    return {
      title: document.title,
      worldId: window.CEHP.RunState && window.CEHP.RunState.worldId,
      roomId: window.CEHP.RunState && window.CEHP.RunState.roomId,
      caseSeed: window.CEHP.RunState && window.CEHP.RunState.caseSeed,
      hasCanvas: !!document.querySelector('canvas'),
      activeScenes: window.CEHP._game.scene.scenes
        .filter((scene) => scene.scene.isActive())
        .map((scene) => scene.scene.key),
      playerExists: !!(play && play.player)
    };
  });

  await context.close();

  assert(signals.pageErrors.length === 0, `${label}: page errors: ${signals.pageErrors.join(' | ')}`);
  assert(signals.consoleErrors.length === 0, `${label}: console errors: ${signals.consoleErrors.join(' | ')}`);
  assert(summary.hasCanvas, `${label}: Phaser canvas missing`);
  assert(summary.playerExists, `${label}: Play scene player missing`);
  assert(summary.worldId === expectedWorldId, `${label}: expected world ${expectedWorldId}, got ${summary.worldId}`);

  console.log(`${label}: ok`);
  console.log(`- world: ${summary.worldId}`);
  console.log(`- room: ${summary.roomId}`);
  console.log(`- active scenes: ${summary.activeScenes.join(', ')}`);
  if (summary.caseSeed) {
    console.log(`- case seed: ${summary.caseSeed}`);
  }
}

async function checkSettings(browser) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();
  const signals = collect(page);
  let summary;

  await page.goto(buildUrl('?settings=1'), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const root = document.getElementById('cehp-settings');
    return !!(root && root.classList.contains('on'));
  }, { timeout: 10000 });

  summary = await page.evaluate(() => {
    return {
      heading: document.querySelector('#cehp-settings h2') ? document.querySelector('#cehp-settings h2').textContent : '',
      toggles: Array.from(document.querySelectorAll('#cehp-settings input[type="checkbox"]')).map((input) => input.name)
    };
  });

  await context.close();

  assert(signals.pageErrors.length === 0, `settings: page errors: ${signals.pageErrors.join(' | ')}`);
  assert(signals.consoleErrors.length === 0, `settings: console errors: ${signals.consoleErrors.join(' | ')}`);
  assert(/SETTINGS/i.test(summary.heading), `settings: unexpected heading "${summary.heading}"`);
  assert(summary.toggles.length === 5, `settings: expected 5 toggles, got ${summary.toggles.length}`);

  console.log('settings: ok');
  console.log(`- toggles: ${summary.toggles.join(', ')}`);
}

async function checkDocket(browser) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();
  const signals = collect(page);
  let summary;

  await page.goto(buildUrl('?docket=1&thermal=1'), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const root = document.getElementById('cehp-docket');
    return !!(root && root.classList.contains('on'));
  }, { timeout: 10000 });

  summary = await page.evaluate(() => {
    const root = document.getElementById('cehp-docket');
    return {
      heading: root.querySelector('h2') ? root.querySelector('h2').textContent : '',
      hasCanvas: !!root.querySelector('canvas'),
      hasSeedLink: !!root.querySelector('a[href*="?case="]'),
      text: root.textContent || ''
    };
  });

  await context.close();

  assert(signals.pageErrors.length === 0, `docket: page errors: ${signals.pageErrors.join(' | ')}`);
  assert(signals.consoleErrors.length === 0, `docket: console errors: ${signals.consoleErrors.join(' | ')}`);
  assert(/THE DOCKET/i.test(summary.heading), `docket: unexpected heading "${summary.heading}"`);
  assert(summary.hasCanvas, 'docket: receipt canvas missing');
  assert(summary.hasSeedLink, 'docket: play link missing');

  console.log('docket: ok');
  console.log(`- heading: ${summary.heading}`);
}

let browser;
let server;

try {
  server = await ensureServer();
  browser = await chromium.launch({ headless: true });

  await checkGameRoute(browser, 'root route', '', 'orientation');
  await checkGameRoute(browser, 'orientation route', `?case=${encodeURIComponent(seeds.orientation)}`, 'orientation');
  await checkGameRoute(browser, 'benefits route', `?world=benefits&case=${encodeURIComponent(seeds.benefits)}`, 'benefits');
  await checkGameRoute(browser, 'rasta route', `?world=rasta&case=${encodeURIComponent(seeds.rasta)}`, 'rasta');
  await checkDocket(browser);
  await checkSettings(browser);

  console.log('CEHP live-domain smoke passed.');
  console.log(`- base URL: ${baseUrl}`);
} finally {
  if (browser) await browser.close();
  if (server) server.kill('SIGTERM');
}
