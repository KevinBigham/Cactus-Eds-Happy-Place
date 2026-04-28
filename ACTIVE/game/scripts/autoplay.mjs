#!/usr/bin/env node
/*
 * autoplay.mjs — integration-level event-trace autoplayer (W8 spike).
 *
 * What it does:
 *   1. Boots the real game in headless Chromium against the shipped index.html.
 *   2. Monkey-patches CEHP.Events.emit to record every event fired during a run.
 *   3. Drives real keyboard input (ArrowRight + Space) through Phaser's input bus.
 *   4. Takes periodic state snapshots (player pos/vel, enemy phase counts, curiosityPays).
 *   5. Runs the same seed twice and compares deterministic event counts.
 *   6. Writes a JSON report + asserts milestones.
 *
 * Why this exists:
 *   Debug.runStyle (used by cehp_rebuild_case_runs.mjs) is a scripted teleport sim — it
 *   never runs the update loop, so it can't verify EncounterDirector admit/release,
 *   enemy phase transitions (R01), or Curiosity reward cadence (R05) under real timing.
 *   rebuild_logic.test.mjs covers those in unit-level mocks. Nothing between those two
 *   levels exercises the live update loop end-to-end. That's the gap this fills.
 *
 * Usage:
 *   node ACTIVE/game/scripts/autoplay.mjs
 *   node ACTIVE/game/scripts/autoplay.mjs --world orientation
 *   node ACTIVE/game/scripts/autoplay.mjs --world rasta --seed MY-SEED --duration 10000
 *   node ACTIVE/game/scripts/autoplay.mjs --headed       # watch it run in a browser
 *   node ACTIVE/game/scripts/autoplay.mjs --no-trace     # skip writing the JSON report
 *
 * Exits 0 on pass, 1 on fail. No new dependencies (Playwright is already devDep).
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const gameDir = path.resolve(path.dirname(__filename), '..');
const outputRoot = path.resolve(gameDir, 'output/autoplay');
const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';

const KNOWN_WORLDS = ['orientation', 'benefits', 'rasta'];
const DEFAULT_SEED = 'AUTOPLAY-W2-R1';
const DEFAULT_DURATION_MS = 12000;

// Event topics whose counts should match bit-exact across two same-seed runs.
// Other topics (movement:idle, movement:backtrack, music:sync, cig:*) vary with
// real-time frame timing and are excluded from the strict count match.
const DETERMINISTIC_TOPICS = new Set([
  'sign:peek',
  'sign:read',
  'curiosity:reward',
  'form:used',
  'movement:jump',
  'movement:doubleJump',
  'movement:tripleJump',
  'movement:wallJump',
  'module:passed',
  'module:skipped',
  'contradiction:defy',
  'contradiction:follow',
  'state:transition',
  'state:nearMiss',
  'player:death',
  'player:respawn',
  'run:complete'
]);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--world') out.world = argv[++i];
    else if (a === '--seed') out.seed = argv[++i];
    else if (a === '--duration') out.duration = Number(argv[++i]);
    else if (a === '--headed') out.headed = true;
    else if (a === '--no-trace') out.trace = false;
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function assert(cond, msg) {
  if (!cond) throw new Error('[autoplay] ' + msg);
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

function installTraceHook() {
  window.__autoplayTrace = [];
  window.__autoplaySnapshots = [];
  window.__autoplayStart = performance.now();
  var origEmit = window.CEHP.Events.emit;
  window.CEHP.Events.emit = function (topic, payload) {
    try {
      window.__autoplayTrace.push({
        t: Math.round(performance.now() - window.__autoplayStart),
        topic: topic,
        payload: payload ? JSON.parse(JSON.stringify(payload)) : null
      });
    } catch (_) {
      window.__autoplayTrace.push({
        t: Math.round(performance.now() - window.__autoplayStart),
        topic: topic,
        payload: '[unserializable]'
      });
    }
    return origEmit.call(this, topic, payload);
  };
  window.__autoplaySnapshot = function () {
    var game = window.CEHP && window.CEHP._game;
    var play = game && game.scene && game.scene.getScene ? game.scene.getScene('Play') : null;
    var world = play && play.room;
    var player = world && world.player;
    var run = window.CEHP.RunState || {};
    var enemies = (world && world.enemies) || [];
    var phaseCounts = {};
    for (var i = 0; i < enemies.length; i++) {
      var p = enemies[i] && enemies[i].phase;
      if (p) phaseCounts[p] = (phaseCounts[p] || 0) + 1;
    }
    window.__autoplaySnapshots.push({
      t: Math.round(performance.now() - window.__autoplayStart),
      x: player ? Math.round(player.x) : null,
      y: player ? Math.round(player.y) : null,
      vx: player && player.body ? Math.round(player.body.velocity.x) : null,
      vy: player && player.body ? Math.round(player.body.velocity.y) : null,
      roomId: run.roomId || null,
      enemyCount: enemies.length,
      enemyPhases: phaseCounts,
      curiosityPays: run.curiosityPays || 0
    });
  };
}

async function autoplayOne(browser, world, seed, durationMs) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error' && !/favicon|Failed to load resource/i.test(text)) {
      consoleErrors.push(text);
    }
  });

  const url = `${baseUrl.replace(/\/$/, '')}/index.html?world=${encodeURIComponent(world)}&case=${encodeURIComponent(seed)}&splash=0`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => {
    var play = window.CEHP && window.CEHP._game && window.CEHP._game.scene &&
      window.CEHP._game.scene.getScene && window.CEHP._game.scene.getScene('Play');
    return !!(play && play.room && play.room.player);
  }, { timeout: 10000 });

  await page.evaluate(installTraceHook);

  await page.locator('canvas').first().focus();
  await wait(300);

  // Drive input on a fixed schedule: hold RIGHT, tap SPACE every JUMP_INTERVAL_MS.
  await page.keyboard.down('ArrowRight');
  const SNAPSHOT_INTERVAL_MS = 500;
  const JUMP_INTERVAL_MS = 1400;
  const TICK_MS = 50;
  const startedAt = Date.now();
  let nextJumpAt = JUMP_INTERVAL_MS;
  let nextSnapshotAt = SNAPSHOT_INTERVAL_MS;

  while (Date.now() - startedAt < durationMs) {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= nextJumpAt) {
      await page.keyboard.press('Space', { delay: 60 });
      nextJumpAt += JUMP_INTERVAL_MS;
    }
    if (elapsed >= nextSnapshotAt) {
      await page.evaluate(() => window.__autoplaySnapshot());
      nextSnapshotAt += SNAPSHOT_INTERVAL_MS;
    }
    await wait(TICK_MS);
  }

  await page.keyboard.up('ArrowRight');
  await wait(200);
  await page.evaluate(() => window.__autoplaySnapshot());

  const result = await page.evaluate(() => {
    var run = window.CEHP.RunState || {};
    return {
      trace: window.__autoplayTrace || [],
      snapshots: window.__autoplaySnapshots || [],
      runState: {
        worldId: run.worldId || null,
        roomId: run.roomId || null,
        curiosityPays: run.curiosityPays || 0,
        caseSeed: run.caseSeed || null
      }
    };
  });

  await context.close();
  return { ...result, pageErrors, consoleErrors };
}

function countByTopic(trace) {
  const counts = {};
  for (const e of trace) counts[e.topic] = (counts[e.topic] || 0) + 1;
  return counts;
}

// Tolerance ±1 on count-match: real-time browser frame jitter can shift the
// player across a room boundary or sync-moment trigger by one frame between
// otherwise-identical runs. Drift of >1 indicates a real game regression.
const DETERMINISM_TOLERANCE = 1;

function deterministicCountDiffs(countsA, countsB) {
  const diffs = [];
  const topics = new Set([...Object.keys(countsA), ...Object.keys(countsB)]);
  for (const topic of topics) {
    if (!DETERMINISTIC_TOPICS.has(topic)) continue;
    const a = countsA[topic] || 0;
    const b = countsB[topic] || 0;
    if (Math.abs(a - b) > DETERMINISM_TOLERANCE) diffs.push({ topic, a, b });
  }
  return diffs;
}

function printUsage() {
  console.log([
    'Usage: node ACTIVE/game/scripts/autoplay.mjs [options]',
    '',
    'Options:',
    '  --world <world>      orientation | benefits (default) | rasta',
    '  --seed <seed>        case seed (default: AUTOPLAY-W2-R1)',
    '  --duration <ms>      run length in ms (default: 12000)',
    '  --headed             show the browser window',
    '  --no-trace           skip writing the JSON report',
    '  -h, --help           show this help',
    '',
    'Output: ACTIVE/game/output/autoplay/autoplay-<world>-<timestamp>.json'
  ].join('\n'));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return;
  }

  const world = args.world || 'benefits';
  const seed = args.seed || DEFAULT_SEED;
  const durationMs = args.duration || DEFAULT_DURATION_MS;
  const headless = args.headed !== true;
  const writeTrace = args.trace !== false;

  assert(KNOWN_WORLDS.includes(world), `unknown world: ${world} (expected one of ${KNOWN_WORLDS.join(', ')})`);

  fs.mkdirSync(outputRoot, { recursive: true });
  const server = await ensureServer();
  const browser = await chromium.launch({ headless: headless });
  const runAt = new Date().toISOString().replace(/[:.]/g, '-');
  let failure = null;
  let summary = null;

  try {
    console.log(`[autoplay] world=${world} seed=${seed} duration=${durationMs}ms`);
    console.log('[autoplay] run A...');
    const runA = await autoplayOne(browser, world, seed, durationMs);
    console.log('[autoplay] run B...');
    const runB = await autoplayOne(browser, world, seed, durationMs);

    const countsA = countByTopic(runA.trace);
    const countsB = countByTopic(runB.trace);
    const countDiffs = deterministicCountDiffs(countsA, countsB);
    const determinism = countDiffs.length === 0
      ? { status: 'MATCH', deterministicTopics: [...DETERMINISTIC_TOPICS].filter((t) => (countsA[t] || 0) > 0) }
      : { status: 'DIVERGE', diffs: countDiffs };

    const maxXA = runA.snapshots.reduce((m, s) => Math.max(m, s.x || 0), 0);
    const maxXB = runB.snapshots.reduce((m, s) => Math.max(m, s.x || 0), 0);
    const maxEnemiesA = runA.snapshots.reduce((m, s) => Math.max(m, s.enemyCount || 0), 0);

    const assertions = [];
    const expect = (name, cond) => assertions.push({ name, pass: !!cond });

    const PROGRESS_TOPICS = ['sign:peek', 'sign:read', 'form:used', 'module:passed',
      'contradiction:follow', 'contradiction:defy', 'music:sync',
      'movement:correction', 'movement:backtrack', 'movement:nearMiss'];
    const progressA = PROGRESS_TOPICS.reduce((n, t) => n + (countsA[t] || 0), 0);
    const progressB = PROGRESS_TOPICS.reduce((n, t) => n + (countsB[t] || 0), 0);

    expect('run A produced no uncaught page errors', runA.pageErrors.length === 0);
    expect('run B produced no uncaught page errors', runB.pageErrors.length === 0);
    expect('run A produced no console errors', runA.consoleErrors.length === 0);
    expect('run B produced no console errors', runB.consoleErrors.length === 0);
    expect('run A fired at least 1 progress event (sign/form/module/contradiction/sync)', progressA >= 1);
    expect('run B fired at least 1 progress event (sign/form/module/contradiction/sync)', progressB >= 1);
    expect('run A fired at least 1 movement:jump', (countsA['movement:jump'] || 0) >= 1);
    expect('run A moved the player forward (max x > 180)', maxXA > 180);
    expect('run B moved the player forward (max x > 180)', maxXB > 180);
    if (world === 'benefits') {
      expect('W2: run A observed at least 1 enemy in scene', maxEnemiesA >= 1);
    }
    expect('same-seed determinism on tracked topics', determinism.status === 'MATCH');

    const failedAssertions = assertions.filter((a) => !a.pass);

    summary = {
      runAt,
      world,
      seed,
      durationMs,
      determinism,
      runA: {
        eventCount: runA.trace.length,
        counts: countsA,
        finalRoomId: runA.runState.roomId,
        curiosityPays: runA.runState.curiosityPays,
        maxPlayerX: maxXA,
        maxEnemyCount: maxEnemiesA,
        pageErrors: runA.pageErrors,
        consoleErrors: runA.consoleErrors
      },
      runB: {
        eventCount: runB.trace.length,
        counts: countsB,
        finalRoomId: runB.runState.roomId,
        curiosityPays: runB.runState.curiosityPays,
        maxPlayerX: maxXB,
        pageErrors: runB.pageErrors,
        consoleErrors: runB.consoleErrors
      },
      assertions,
      passed: failedAssertions.length === 0
    };

    if (writeTrace) {
      const tracePath = path.join(outputRoot, `autoplay-${world}-${runAt}.json`);
      const fullReport = {
        ...summary,
        runA: { ...summary.runA, trace: runA.trace, snapshots: runA.snapshots },
        runB: { ...summary.runB, trace: runB.trace, snapshots: runB.snapshots }
      };
      fs.writeFileSync(tracePath, JSON.stringify(fullReport, null, 2));
      console.log(`[autoplay] report -> ${tracePath}`);
    }

    console.log(`[autoplay] run A: events=${runA.trace.length} finalRoom=${runA.runState.roomId} maxX=${maxXA} curiosityPays=${runA.runState.curiosityPays}`);
    console.log(`[autoplay] run B: events=${runB.trace.length} finalRoom=${runB.runState.roomId} maxX=${maxXB} curiosityPays=${runB.runState.curiosityPays}`);
    console.log(`[autoplay] determinism: ${determinism.status}`);
    if (determinism.status === 'DIVERGE') {
      for (const d of determinism.diffs) console.log(`  DIVERGE ${d.topic}: A=${d.a} B=${d.b}`);
    }
    for (const a of assertions) console.log(`  ${a.pass ? 'PASS' : 'FAIL'}  ${a.name}`);

    if (!summary.passed) failure = new Error(`${failedAssertions.length} assertion(s) failed`);
  } catch (err) {
    failure = err;
  } finally {
    await browser.close();
    if (server) server.kill('SIGTERM');
  }

  if (failure) {
    console.error(`[autoplay] FAIL: ${failure.stack || failure.message}`);
    process.exit(1);
  }
  console.log('[autoplay] OK');
}

main().catch((err) => {
  console.error('[autoplay] uncaught: ' + (err.stack || err.message));
  process.exit(1);
});
