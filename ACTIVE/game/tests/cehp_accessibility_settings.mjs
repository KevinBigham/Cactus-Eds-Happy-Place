import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

var baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';
var seed = 'CASE-20260420-001-CURIOSITY-R2';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function ensureServer() {
  var target = new URL(baseUrl);
  var origin = target.protocol + '//' + target.hostname + ':' + target.port;

  try {
    var response = await fetch(origin + '/index.html');
    if (response.ok) return null;
  } catch (error) {}

  var child = spawn('python3', ['-m', 'http.server', target.port || '4175', '--bind', target.hostname], {
    cwd: '/Users/tkevinbigham/Projects/CEHP/ACTIVE/game',
    stdio: 'ignore'
  });
  await new Promise(function(resolve) { setTimeout(resolve, 1000); });
  return child;
}

function isIgnorableConsoleError(message) {
  var text = message.text();
  return /favicon\\.ico/i.test(text) || /Failed to load resource/i.test(text);
}

function collect(page) {
  var consoleErrors = [];
  var pageErrors = [];
  page.on('console', function(message) {
    if (message.type() === 'error' && !isIgnorableConsoleError(message)) {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', function(error) {
    pageErrors.push(error.message);
  });
  return { consoleErrors, pageErrors };
}

var browser;
var server;

try {
  server = await ensureServer();
  browser = await chromium.launch({ headless: true });

  var context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  var settingsPage = await context.newPage();
  var settingsSignals = collect(settingsPage);

  await settingsPage.goto(baseUrl.replace(/\/$/, '') + '/index.html?settings=1', { waitUntil: 'domcontentloaded' });
  await settingsPage.waitForFunction(function() {
    var root = document.getElementById('cehp-settings');
    return !!(root && root.classList.contains('on'));
  }, { timeout: 10000 });

  var focusOrder = [];
  for (var i = 0; i < 6; i++) {
    await settingsPage.keyboard.press('Tab');
    var active = await settingsPage.evaluate(function() {
      var el = document.activeElement;
      return el ? (el.name || el.textContent || el.tagName) : '';
    });
    focusOrder.push(active.trim());
    if (i < 5) {
      await settingsPage.keyboard.press('Space');
    } else {
      await settingsPage.keyboard.press('Enter');
    }
  }

  var savedAssist = await settingsPage.evaluate(function() {
    return JSON.parse(localStorage.getItem('cactusEd_save_v2'));
  });

  assert(settingsSignals.pageErrors.length === 0, 'settings page errors: ' + settingsSignals.pageErrors.join(' | '));
  assert(settingsSignals.consoleErrors.length === 0, 'settings console errors: ' + settingsSignals.consoleErrors.join(' | '));
  assert(JSON.stringify(focusOrder) === JSON.stringify([
    'reduceFlash',
    'reduceShake',
    'reduceParticles',
    'biggerCoyote',
    'slowerGame',
    'Save'
  ]), 'unexpected keyboard focus order: ' + JSON.stringify(focusOrder));
  assert(savedAssist && savedAssist.assistMode, 'settings form did not persist assistMode');

  var gamePage = await context.newPage();
  var gameSignals = collect(gamePage);
  await gamePage.goto(baseUrl.replace(/\/$/, '') + '/index.html?case=' + encodeURIComponent(seed), { waitUntil: 'domcontentloaded' });
  await gamePage.waitForFunction(function() {
    return !!(
      window.CEHP &&
      window.CEHP._game &&
      window.CEHP._game.scene &&
      window.CEHP._game.scene.getScene &&
      window.CEHP._game.scene.getScene('Play') &&
      window.CEHP._game.scene.getScene('Play').scene.isActive()
    );
  }, { timeout: 10000 });

  var summary = await gamePage.evaluate(function() {
    var play = window.CEHP._game.scene.getScene('Play');
    window.CEHP.FX.noteDeath(play, play.time.now);
    window.CEHP.FX.update(play, window.CEHP.RunState, 16);
    return {
      assistMode: window.CEHP.RunState && window.CEHP.RunState.assistMode,
      assistTuning: window.CEHP.RunState && window.CEHP.RunState.assistTuning,
      baseCoyoteMs: window.CEHP.TUNING && window.CEHP.TUNING.COYOTE_MS,
      coyoteWindowMs: play.player && play.player.coyoteWindowMs,
      timeScale: play.time && play.time.timeScale,
      physicsTimeScale: play.physics && play.physics.world && play.physics.world.timeScale,
      cameraLerpX: play.cameras && play.cameras.main && play.cameras.main.lerp ? play.cameras.main.lerp.x : null,
      stampAlpha: play._cehpFx && play._cehpFx.stamp ? play._cehpFx.stamp.alpha : null,
      cigarette: window.CEHP.RunState && window.CEHP.RunState.cigarette
    };
  });

  await context.close();

  assert(gameSignals.pageErrors.length === 0, 'game page errors: ' + gameSignals.pageErrors.join(' | '));
  assert(gameSignals.consoleErrors.length === 0, 'game console errors: ' + gameSignals.consoleErrors.join(' | '));
  assert(summary.assistMode && summary.assistMode.reduceFlash === true, 'reduceFlash did not load into runtime');
  assert(summary.assistMode && summary.assistMode.reduceShake === true, 'reduceShake did not load into runtime');
  assert(summary.assistMode && summary.assistMode.reduceParticles === true, 'reduceParticles did not load into runtime');
  assert(summary.assistMode && summary.assistMode.biggerCoyote === true, 'biggerCoyote did not load into runtime');
  assert(summary.assistMode && summary.assistMode.slowerGame === true, 'slowerGame did not load into runtime');
  assert(summary.assistTuning && summary.assistTuning.coyoteMs > summary.baseCoyoteMs, 'biggerCoyote did not change coyote window');
  assert(summary.coyoteWindowMs === summary.assistTuning.coyoteMs, 'player coyote window did not adopt assist tuning');
  assert(summary.timeScale < 1, 'slowerGame did not reduce scene time scale');
  assert(summary.physicsTimeScale < 1, 'slowerGame did not reduce physics time scale');
  assert(summary.cameraLerpX < 0.12, 'reduceShake did not change camera follow smoothing');
  assert(summary.stampAlpha < 1, 'reduceFlash did not reduce death stamp intensity');
  assert(summary.cigarette && summary.cigarette.particleAlpha === 0, 'reduceParticles did not reduce particle-like FX');

  console.log('CEHP accessibility settings test passed.');
  console.log('- keyboard focus order: ' + focusOrder.join(' -> '));
} finally {
  if (browser) await browser.close();
  if (server) server.kill('SIGTERM');
}
