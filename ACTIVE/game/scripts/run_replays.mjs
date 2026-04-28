#!/usr/bin/env node
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const gameDir = path.resolve(path.dirname(__filename), '..');
const replayDir = path.join(gameDir, '_canon/replays/cehp');
const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureServer() {
  const target = new URL(baseUrl);
  const origin = `${target.protocol}//${target.hostname}:${target.port}`;
  try {
    const response = await fetch(`${origin}/index.html`);
    if (response.ok) return null;
  } catch (_) {}
  const child = spawn('python3', ['-m', 'http.server', target.port || '4175', '--bind', target.hostname], {
    cwd: gameDir,
    stdio: 'ignore'
  });
  await wait(1000);
  return child;
}

function replayUrl(fixture) {
  const params = ['splash=0', `case=${encodeURIComponent(fixture.seed || 'REPLAY')}`];
  if (fixture.level_id === 'test-room') params.push('room=test');
  else params.push(`world=${encodeURIComponent(fixture.level_id || 'orientation')}`);
  return `${baseUrl.replace(/\/$/, '')}/index.html?${params.join('&')}`;
}

async function runFixture(browser, file, fixture) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto(replayUrl(fixture), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const play = window.CEHP && window.CEHP._game && window.CEHP._game.scene &&
      window.CEHP._game.scene.getScene && window.CEHP._game.scene.getScene('Play');
    return !!(play && play.room && play.player && play._fixedStep && window.CEHP.Replay);
  }, { timeout: 10000 });

  await page.evaluate((fixturePayload) => {
    const CEHP = window.CEHP;
    const play = CEHP._game.scene.getScene('Play');
    const actions = CEHP.Replay.ACTIONS;
    const byFrame = {};
    const current = {};
    const previous = {};
    const checkpoints = {};
    const maxFrame = fixturePayload.expected_final.frame;
    let i;

    for (i = 0; i < fixturePayload.frames.length; i++) {
      byFrame[fixturePayload.frames[i].frame] = fixturePayload.frames[i].input || {};
    }
    for (i = 0; i < fixturePayload.expected_checkpoints.length; i++) {
      checkpoints[fixturePayload.expected_checkpoints[i].frame] = true;
    }
    for (i = 0; i < actions.length; i++) {
      current[actions[i]] = false;
      previous[actions[i]] = false;
    }

    CEHP.Input.update = function() {
      const input = byFrame[Math.min(play._fixedStep.frame, maxFrame)] || {};
      for (let j = 0; j < actions.length; j++) {
        previous[actions[j]] = !!current[actions[j]];
        current[actions[j]] = !!input[actions[j]];
      }
    };
    CEHP.Input.down = (action) => !!current[action];
    CEHP.Input.justPressed = (action) => !!current[action] && !previous[action];
    CEHP.Input.justReleased = (action) => !current[action] && !!previous[action];
    CEHP.Input.axisX = () => current.left ? -1 : (current.right ? 1 : 0);
    CEHP.Input.axisY = () => current.up ? -1 : (current.down ? 1 : 0);

    play.pendingDeath = null;
    play.runComplete = false;
    play.recorder.clear();
    CEHP.Axes.reset();
    if (CEHP.Metrics && CEHP.Metrics.reset) CEHP.Metrics.reset();
    CEHP.FixedStep.reset(play._fixedStep);
    play.player.x = fixturePayload.initial_state.x;
    play.player.y = fixturePayload.initial_state.y;
    play.player.facing = fixturePayload.initial_state.facing || 1;
    if (play.player.body) {
      play.player.body.velocity.x = 0;
      play.player.body.velocity.y = 0;
      if (play.player.body.reset) play.player.body.reset(play.player.x, play.player.y);
      else if (play.player.body.updateFromGameObject) play.player.body.updateFromGameObject();
    }

    window.__cehpReplayCheckpoints = [];
    const originalSampleInput = play.recorder.sampleInput.bind(play.recorder);
    play.recorder.sampleInput = function(frame, input) {
      let point;
      originalSampleInput(frame, input);
      if (checkpoints[frame]) {
        point = {
          frame,
          x: Math.round(play.player.x / 64) * 64,
          y: 0,
          vx: play.player.body ? Math.round(play.player.body.velocity.x) : 0,
          facing: play.player.facing || 1
        };
        point.signature = CEHP.Replay.signature(point);
        window.__cehpReplayCheckpoints.push(point);
      }
    };
  }, fixture);

  await page.waitForFunction((frame) => {
    const play = window.CEHP._game.scene.getScene('Play');
    return play._fixedStep.frame >= frame;
  }, fixture.expected_final.frame, { timeout: 15000 });

  const result = await page.evaluate((fixturePayload) => {
    const CEHP = window.CEHP;
    const play = CEHP._game.scene.getScene('Play');
    const maxFrame = fixturePayload.expected_final.frame;
    const replayFrames = play.recorder.dumpReplay().filter((frame) => frame.frame <= maxFrame);
    play._replayActual = {
      expected_checkpoints: window.__cehpReplayCheckpoints || [],
      expected_final: {
        frame: maxFrame,
        recorder_signature: CEHP.Replay.signature({ replay: replayFrames }),
        axes_snapshot: {},
        receipt_lines: CEHP.RunState.receipt && CEHP.RunState.receipt.lines ? CEHP.RunState.receipt.lines.slice() : []
      }
    };
    return CEHP.Replay.runReplay(fixturePayload, play);
  }, fixture);

  await context.close();
  if (errors.length) return { passed: false, divergent_frame: null, field: 'pageerror', expected: [], actual: errors };
  return result;
}

async function main() {
  const files = fs.readdirSync(replayDir).filter((file) => /\.json$/.test(file)).sort();
  const server = await ensureServer();
  const browser = await chromium.launch({ headless: true });
  let passed = 0;
  try {
    for (const file of files) {
      const fixture = JSON.parse(fs.readFileSync(path.join(replayDir, file), 'utf8'));
      const result = await runFixture(browser, file, fixture);
      if (result.passed) {
        passed += 1;
        console.log(`PASS ${file}`);
      } else {
        console.log(`FAIL ${file} frame=${result.divergent_frame} field=${result.field} expected=${JSON.stringify(result.expected)} actual=${JSON.stringify(result.actual)}`);
      }
    }
  } finally {
    await browser.close();
    if (server) server.kill('SIGTERM');
  }
  console.log(`SUMMARY ${passed === files.length ? 'PASS' : 'FAIL'} ${passed}/${files.length}`);
  if (passed !== files.length) process.exit(1);
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
