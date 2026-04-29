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

function primitive(value) {
  return value === null || typeof value !== 'object';
}

function firstDiff(expected, actual, field) {
  let keys;
  let seen;
  let diff;
  if (JSON.stringify(expected) === JSON.stringify(actual)) return null;
  if (primitive(expected) || primitive(actual)) {
    return { passed: false, divergent_frame: null, field, expected, actual };
  }
  if (Array.isArray(expected) || Array.isArray(actual)) {
    for (let i = 0; i < Math.max((expected || []).length, (actual || []).length); i++) {
      diff = firstDiff(expected ? expected[i] : undefined, actual ? actual[i] : undefined, `${field}[${i}]`);
      if (diff) return diff;
    }
    return null;
  }
  seen = {};
  keys = Object.keys(expected || {}).sort();
  for (let i = 0; i < keys.length; i++) {
    seen[keys[i]] = true;
    diff = firstDiff(expected[keys[i]], actual ? actual[keys[i]] : undefined, `${field}.${keys[i]}`);
    if (diff) return diff;
  }
  keys = Object.keys(actual || {}).sort();
  for (let i = 0; i < keys.length; i++) {
    if (seen[keys[i]]) continue;
    diff = firstDiff(undefined, actual[keys[i]], `${field}.${keys[i]}`);
    if (diff) return diff;
  }
  return null;
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

  if (fixture.debug_plan || fixture.debug_style) {
    const result = await page.evaluate((fixturePayload) => {
      const CEHP = window.CEHP;
      const play = CEHP._game.scene.getScene('Play');

      function clone(value) {
        return value == null ? value : JSON.parse(JSON.stringify(value));
      }

      function readSign(sign) {
        if (!sign || !sign.text) return;
        if (sign.peek) sign.peek({ signId: sign.id, words: sign.text.split(/\s+/).length });
        if (sign.read) sign.read({ signId: sign.id, words: sign.text.split(/\s+/).length });
      }

      function compactDebug(debug) {
        const receipt = (debug && debug.receipt) || (CEHP.RunState && CEHP.RunState.receipt) || {};
        return {
          world_id: (debug && debug.worldId) || (CEHP.RunState && CEHP.RunState.worldId) || '',
          room_id: (CEHP.RunState && CEHP.RunState.roomId) || '',
          room_order: clone((debug && debug.roomOrder) || (CEHP.RunState && CEHP.RunState.roomOrder) || []),
          actions_learned: clone((debug && debug.actionsLearned) || (CEHP.RunState && CEHP.RunState.actionsLearned) || []),
          receipt_flags: clone((debug && debug.receiptFlags) || (CEHP.RunState && CEHP.RunState.receiptFlags) || {}),
          world_stats: clone((debug && debug.worldStats) || (CEHP.RunState && CEHP.RunState.worldStats) || {}),
          receipt_fragment_ids: clone(receipt.fragmentIds || [])
        };
      }

      function applyAxes(snapshot) {
        let key;
        if (!snapshot || !CEHP.Axes) return;
        if (snapshot.primary && CEHP.Axes.set) {
          for (key in snapshot.primary) {
            if (Object.prototype.hasOwnProperty.call(snapshot.primary, key)) {
              CEHP.Axes.set(key, snapshot.primary[key]);
            }
          }
        }
        if (snapshot.micro && CEHP.Axes.micro) {
          for (key in snapshot.micro) {
            if (Object.prototype.hasOwnProperty.call(snapshot.micro, key) &&
                Object.prototype.hasOwnProperty.call(CEHP.Axes.micro, key)) {
              CEHP.Axes.micro[key] = snapshot.micro[key];
            }
          }
        }
      }

      function runReceiptCompletion(plan) {
        plan = plan || {};
        CEHP.Axes.reset();
        if (CEHP.Metrics && CEHP.Metrics.reset) CEHP.Metrics.reset();
        play.recorder.clear();
        play.pendingDeath = null;
        play.runComplete = false;
        CEHP.RunState.worldId = plan.world_id || CEHP.RunState.worldId;
        CEHP.RunState.roomId = plan.room_id || CEHP.RunState.worldId;
        CEHP.RunState.roomOrder = clone(plan.room_order || []);
        CEHP.RunState.actionsLearned = clone(plan.actions_learned || []);
        CEHP.RunState.receiptFlags = clone(plan.receipt_flags || {});
        CEHP.RunState.worldStats = clone(plan.world_stats || {});
        CEHP.RunState.worldFlags = clone(plan.world_flags || {});
        applyAxes(plan.axes || {});
        play.completeRun('debug:receipt-completion');
        return {
          worldId: CEHP.RunState.worldId,
          roomOrder: clone(CEHP.RunState.roomOrder),
          actionsLearned: clone(CEHP.RunState.actionsLearned),
          receiptFlags: clone(CEHP.RunState.receiptFlags),
          worldStats: clone(CEHP.RunState.worldStats),
          receipt: clone(CEHP.RunState.receipt)
        };
      }

      function runBenefitsAtriumFollow() {
        const world = play.room;
        const room = world && world.rooms ? world.rooms[0] : null;
        let i;
        if (!world || !room || !room.riskGate) throw new Error('missing benefits atrium risk gate');
        CEHP.Axes.reset();
        if (CEHP.Metrics && CEHP.Metrics.reset) CEHP.Metrics.reset();
        play.recorder.clear();
        play.pendingDeath = null;
        play.runComplete = false;
        for (i = 0; i < (room.signs || []).length; i++) readSign(room.signs[i]);
        if (room.riskGate.sign) readSign(room.riskGate.sign);
        room.riskGate.follow();
        room.safeCompleted = true;
        world.player.x = room.endX - 120;
        world.player.y = 300;
        play.completeRun('debug:benefits-atrium-follow');
        return {
          worldId: 'benefits',
          roomOrder: clone(world.roomOrder),
          actionsLearned: clone(world.runState.actionsLearned || []),
          receiptFlags: clone(world.receiptFlags),
          worldStats: clone(world.stats),
          receipt: clone(CEHP.RunState.receipt)
        };
      }

      if (fixturePayload.debug_plan === 'benefits-atrium-follow') {
        return { passed: true, actual: compactDebug(runBenefitsAtriumFollow()) };
      }
      if (fixturePayload.debug_plan === 'receipt-completion') {
        return { passed: true, actual: compactDebug(runReceiptCompletion(fixturePayload.completion)) };
      }
      if (!play.runStyle) throw new Error('missing debug runStyle');
      return { passed: true, actual: compactDebug(play.runStyle(fixturePayload.debug_style || 'obedient')) };
    }, fixture);
    await context.close();
    if (errors.length) return { passed: false, divergent_frame: null, field: 'pageerror', expected: [], actual: errors };
    if (!result.passed) return result;
    return firstDiff(fixture.expected_debug || {}, result.actual, 'expected_debug') ||
      { passed: true, divergent_frame: null, expected: null, actual: null, field: null };
  }

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
