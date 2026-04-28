import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const gameDir = '/Users/tkevinbigham/Projects/CEHP/ACTIVE/game';
const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';
const fixturePath = path.join(gameDir, '_canon/replays/cehp/test_room_obedient.json');

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
  const params = [
    'splash=0',
    `case=${encodeURIComponent(fixture.seed || 'REPLAY')}`
  ];
  if (fixture.level_id === 'test-room') params.push('room=test');
  else params.push(`world=${encodeURIComponent(fixture.level_id || 'orientation')}`);
  return `${baseUrl.replace(/\/$/, '')}/index.html?${params.join('&')}`;
}

async function runFixture(browser, fixture) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  await page.goto(replayUrl(fixture), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    var play = window.CEHP && window.CEHP._game && window.CEHP._game.scene &&
      window.CEHP._game.scene.getScene && window.CEHP._game.scene.getScene('Play');
    return !!(play && play.room && play.player && play._fixedStep && window.CEHP.Replay);
  }, { timeout: 10000 });

  await page.evaluate((fixturePayload) => {
    var CEHP = window.CEHP;
    var play = CEHP._game.scene.getScene('Play');
    var actions = CEHP.Replay.ACTIONS;
    var byFrame = {};
    var current = {};
    var previous = {};
    var checkpoints = {};
    var maxFrame = fixturePayload.expected_final.frame;
    var i;

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
      var input = byFrame[Math.min(play._fixedStep.frame, maxFrame)] || {};
      for (var j = 0; j < actions.length; j++) {
        previous[actions[j]] = !!current[actions[j]];
        current[actions[j]] = !!input[actions[j]];
      }
    };
    CEHP.Input.down = function(action) { return !!current[action]; };
    CEHP.Input.justPressed = function(action) { return !!current[action] && !previous[action]; };
    CEHP.Input.justReleased = function(action) { return !current[action] && !!previous[action]; };
    CEHP.Input.axisX = function() { return current.left ? -1 : (current.right ? 1 : 0); };
    CEHP.Input.axisY = function() { return current.up ? -1 : (current.down ? 1 : 0); };

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
    var originalSampleInput = play.recorder.sampleInput.bind(play.recorder);
    play.recorder.sampleInput = function(frame, input) {
      var point;
      originalSampleInput(frame, input);
      if (checkpoints[frame]) {
        point = {
          frame: frame,
          x: Math.floor(play.player.x / 16) * 16,
          y: Math.floor(play.player.y / 16) * 16,
          facing: play.player.facing || 1
        };
        point.signature = CEHP.Replay.signature(point);
        window.__cehpReplayCheckpoints.push(point);
      }
    };
  }, fixture);

  await page.waitForFunction((frame) => {
    var play = window.CEHP._game.scene.getScene('Play');
    return play._fixedStep.frame >= frame;
  }, fixture.expected_final.frame, { timeout: 15000 });

  const result = await page.evaluate((fixturePayload) => {
    var CEHP = window.CEHP;
    var play = CEHP._game.scene.getScene('Play');
    var maxFrame = fixturePayload.expected_final.frame;
    var replayFrames = play.recorder.dumpReplay().filter(function(frame) { return frame.frame <= maxFrame; });
    var actual = {
      expected_checkpoints: window.__cehpReplayCheckpoints || [],
      expected_final: {
        frame: fixturePayload.expected_final.frame,
        recorder_signature: CEHP.Replay.signature({ replay: replayFrames }),
        axes_snapshot: {},
        receipt_lines: CEHP.RunState.receipt && CEHP.RunState.receipt.lines ? CEHP.RunState.receipt.lines.slice() : []
      }
    };
    play._replayActual = actual;
    return CEHP.Replay.runReplay(fixturePayload, play);
  }, fixture);

  await context.close();
  return { result, pageErrors };
}

test('test room replay fixture is deterministic across three headless runs', async () => {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const signatures = [];
  const server = await ensureServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (let i = 0; i < 3; i++) {
      const run = await runFixture(browser, fixture);
      assert.deepEqual(run.pageErrors, []);
      assert.equal(run.result.passed, true, JSON.stringify(run.result));
      assert.equal(run.result.divergent_frame, null);
      signatures.push(fixture.expected_final.recorder_signature);
    }
  } finally {
    await browser.close();
    if (server) server.kill('SIGTERM');
  }
  assert.equal(new Set(signatures).size, 1);
});
