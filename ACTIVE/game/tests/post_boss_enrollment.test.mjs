import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const replayDir = path.join(gameDir, '_canon/replays/cehp');

const ENROLLMENT_MODULES = [
  '00_index.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '11_metrics.js',
  '22_collision.js',
  '63_post_boss_framework.js',
  '65_post_boss_enrollment.js',
  '70_worlds.js',
  '72_world_benefits.js',
  '80_receipts.js'
];

const ENROLLMENT_CLOSER_ID = 'W15_ENROLLMENT_CLOSER_01';
const ENROLLMENT_CLOSER_TEXT = 'ENROLLMENT ACCEPTED YOU WITHOUT EXAMINATION.';

function buildSandbox() {
  const sandbox = {
    console,
    Math,
    JSON,
    window: null,
    document: {
      readyState: 'loading',
      getElementById() {
        return null;
      }
    }
  };

  sandbox.window = sandbox;
  vm.createContext(sandbox);
  return sandbox;
}

function loadModules(files) {
  const sandbox = buildSandbox();
  const source = files.map(function(file) {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
  }).join('\n');

  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

function makeNode(x, y, width, height) {
  const node = {
    x,
    y,
    width,
    height,
    alpha: 1,
    visible: true,
    destroyed: false,
    fillColor: 0,
    scaleX: 1,
    scaleY: 1,
    body: null,
    setDepth() { return this; },
    setOrigin() { return this; },
    setAlpha(value) { this.alpha = value; return this; },
    setVisible(value) { this.visible = value; return this; },
    setDisplaySize(w, h) { this.width = w; this.height = h; return this; },
    setScale(xScale, yScale) {
      this.scaleX = xScale;
      this.scaleY = yScale == null ? xScale : yScale;
      return this;
    },
    setTexture(key) { this.textureKey = key; return this; },
    destroy() { this.destroyed = true; }
  };

  node.body = {
    x: x - width / 2,
    y: y - height / 2,
    width,
    height,
    velocity: { x: 0, y: 0 },
    allowGravity: false,
    moves: false,
    updateFromGameObject() {
      this.x = node.x - node.width / 2;
      this.y = node.y - node.height / 2;
      this.width = node.width;
      this.height = node.height;
    }
  };

  return node;
}

function makeScene() {
  return {
    time: { now: 0 },
    add: {
      rectangle(x, y, width, height) {
        return makeNode(x, y, width, height);
      },
      text(x, y, text) {
        const node = makeNode(x, y, 96, 16);
        node.text = text;
        return node;
      },
      image(x, y, key) {
        const node = makeNode(x, y, 64, 64);
        node.textureKey = key;
        return node;
      }
    },
    physics: {
      add: {
        existing(node) {
          if (node && node.body && node.body.updateFromGameObject) {
            node.body.updateFromGameObject();
          }
        },
        collider() {}
      }
    },
    textures: {
      exists() { return false; }
    }
  };
}

function makeWorld() {
  const scene = makeScene();
  const finalRoom = { id: 'final-processing', startX: 10240, endX: 11520, platforms: [] };
  const player = makeNode(11248, 360, 24, 48);
  player.invulnMs = 0;
  player.takeHit = function(kind) { this.lastHit = kind; };

  return {
    id: 'benefits-world',
    worldId: 'benefits',
    scene,
    runState: {
      caseSeed: 'CASE-ENROLLMENT-UNIT',
      worldId: 'benefits',
      receiptFlags: {}
    },
    horizon: 400,
    rooms: [finalRoom],
    platforms: [],
    player,
    goal: makeNode(11408, 280, 160, 220)
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Enrollment boss spawns through the concrete W2 factory', () => {
  const CEHP = loadModules(ENROLLMENT_MODULES);
  const world = makeWorld();
  const boss = CEHP.bosses.spawnEnrollment(world.scene, world, { seed: 'CASE-SPAWN' });

  assert.equal(CEHP.flags.W2_ENROLLMENT_BOSS, true);
  assert.equal(typeof CEHP.bosses.spawnEnrollment, 'function');
  assert.equal(boss.id, 'enrollment');
  assert.equal(boss.framework.phases.length, 3);
  assert.deepEqual(plain(boss.framework.phases.map(function(phase) { return phase.id; })), ['intake', 'eligibility', 'denial']);
  assert.equal(world.platforms.includes(boss.blocker), true);
  assert.equal(world.rooms[0].platforms.includes(boss.blocker), true);
  assert.ok(boss.rect);
  assert.ok(boss.hazard);
});

test('Enrollment boss reaches intake, eligibility, and denial phases deterministically', () => {
  const CEHP = loadModules(ENROLLMENT_MODULES);
  const world = makeWorld();
  const reached = { intake: true };
  const telegraphs = [];
  const boss = CEHP.bosses.spawnEnrollment(world.scene, world, { seed: 'CASE-PHASES' });

  CEHP.Events.on('boss:phase', function(payload) {
    if (payload && payload.bossId === 'enrollment') reached[payload.phaseId] = true;
  });
  CEHP.Events.on('boss:telegraph', function(payload) {
    if (payload && payload.bossId === 'enrollment') telegraphs.push(payload.durationMs);
  });

  for (let i = 0; i < 60; i += 1) {
    boss.update(50);
  }

  assert.deepEqual(reached, { intake: true, eligibility: true, denial: true });
  assert.equal(boss.snapshot().phaseId, 'denial');
  assert.ok(telegraphs.length >= 3);
  telegraphs.forEach(function(ms) {
    assert.ok(ms >= 120, String(ms));
    assert.ok(ms <= 400, String(ms));
  });
});

test('Enrollment defeat fires tags and selects the W2 receipt fragment', () => {
  const CEHP = loadModules(ENROLLMENT_MODULES);
  const world = makeWorld();
  const boss = CEHP.bosses.spawnEnrollment(world.scene, world, { seed: 'CASE-DEFEAT' });
  const defeated = [];
  const receiptTags = [];

  CEHP.Axes.reset();
  CEHP.Metrics.reset();
  CEHP.Events.on('boss:defeated', function(payload) {
    if (payload && payload.bossId === 'enrollment') defeated.push(payload);
  });
  CEHP.Events.on('boss:receiptTag', function(payload) {
    if (payload && payload.bossId === 'enrollment') receiptTags.push(payload);
  });

  const snapshot = boss.debugDefeat();
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-ENROLLMENT-RECEIPT',
    worldId: 'benefits',
    axes: CEHP.Axes.snapshot(),
    tensions: CEHP.Axes.tensions(),
    flags: world.runState.receiptFlags,
    cigaretteLit: true
  });

  assert.equal(snapshot.defeated, true);
  assert.equal(world.runState.receiptFlags.enrollmentDefeated, true);
  assert.equal(world.enrollmentDefeated, true);
  assert.equal(defeated.length, 1);
  assert.equal(defeated[0].phaseId, 'denial');
  assert.equal(receiptTags.length, 1);
  assert.equal(receiptTags[0].receiptFlag, 'enrollmentDefeated');
  assert.equal(CEHP.Axes.snapshot().micro.modulesPassed, 1);
  assert.equal(CEHP.Metrics.snapshot().totals.modulePassed, 1);
  assert.equal(receipt.fragmentIds.includes(ENROLLMENT_CLOSER_ID), true, receipt.fragmentIds.join(', '));
  assert.equal(receipt.lines.includes(ENROLLMENT_CLOSER_TEXT), true);
});

test('Enrollment fragment stays gated off for existing W2 debug fixtures', () => {
  const fixtureNames = [
    'w2_benefits_atrium_partial.json',
    'w2_benefits_default_completion.json'
  ];

  fixtureNames.forEach(function(file) {
    const fixture = JSON.parse(fs.readFileSync(path.join(replayDir, file), 'utf8'));
    assert.equal(fixture.expected_debug.receipt_flags.enrollmentDefeated, undefined, file);
    assert.equal(fixture.expected_debug.receipt_fragment_ids.includes(ENROLLMENT_CLOSER_ID), false, file);
  });
});

test('W2 runtime gates Enrollment integration and preserves non-boss debug style', () => {
  const source = fs.readFileSync(path.join(srcDir, '75_world_benefits_runtime.js'), 'utf8');

  assert.match(
    source,
    /W2_ENROLLMENT_BOSS !== false\)\) \{\s+world\.enrollmentBoss = ns\.bosses\.spawnEnrollment\(scene, world\);/
  );
  assert.match(
    source,
    /var run = style === 'enrollment' \? 'insured' : style;/
  );
  assert.match(
    source,
    /if \(style === 'enrollment' && world\.enrollmentBoss && world\.enrollmentBoss\.debugDefeat\)/
  );
});

test('Enrollment replay fixture declares the boss-on debug path', () => {
  const fixture = JSON.parse(fs.readFileSync(path.join(replayDir, 'w2_benefits_enrollment.json'), 'utf8'));

  assert.equal(fixture.debug_style, 'enrollment');
  assert.equal(fixture.expected_debug.receipt_flags.enrollmentDefeated, true);
  assert.equal(fixture.expected_debug.receipt_fragment_ids.includes(ENROLLMENT_CLOSER_ID), true);
});
