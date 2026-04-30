import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const replayDir = path.join(gameDir, '_canon/replays/cehp');

const SUPERVISOR_MODULES = [
  '00_index.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '11_metrics.js',
  '22_collision.js',
  '63_post_boss_framework.js',
  '64_post_boss_supervisor.js',
  '70_worlds.js',
  '71_world_orientation.js',
  '80_receipts.js'
];

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
        const node = makeNode(x, y, 80, 16);
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
  const finalRoom = { id: 'final-certification', platforms: [] };
  const player = makeNode(7340, 360, 24, 48);
  player.invulnMs = 0;
  player.takeHit = function(kind) { this.lastHit = kind; };

  return {
    id: 'orientation-world',
    worldId: 'orientation',
    scene,
    runState: {
      caseSeed: 'CASE-SUPERVISOR-UNIT',
      worldId: 'orientation',
      receiptFlags: {}
    },
    horizon: 400,
    rooms: [finalRoom],
    platforms: [],
    player,
    goal: makeNode(7720, 312, 140, 180)
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Supervisor boss spawns through the concrete W1 factory', () => {
  const CEHP = loadModules(SUPERVISOR_MODULES);
  const world = makeWorld();
  const boss = CEHP.bosses.spawnSupervisor(world.scene, world, { seed: 'CASE-SPAWN' });

  assert.equal(CEHP.flags.W1_SUPERVISOR_BOSS, true);
  assert.equal(typeof CEHP.bosses.spawnSupervisor, 'function');
  assert.equal(boss.id, 'supervisor');
  assert.equal(boss.framework.phases.length, 3);
  assert.deepEqual(plain(boss.framework.phases.map(function(phase) { return phase.id; })), ['intake', 'review', 'stamp']);
  assert.equal(world.platforms.includes(boss.blocker), true);
  assert.equal(world.rooms[0].platforms.includes(boss.blocker), true);
  assert.ok(boss.rect);
  assert.ok(boss.hazard);
});

test('Supervisor boss reaches intake, review, and stamp phases deterministically', () => {
  const CEHP = loadModules(SUPERVISOR_MODULES);
  const world = makeWorld();
  const reached = { intake: true };
  const telegraphs = [];
  const boss = CEHP.bosses.spawnSupervisor(world.scene, world, { seed: 'CASE-PHASES' });

  CEHP.Events.on('boss:phase', function(payload) {
    if (payload && payload.bossId === 'supervisor') reached[payload.phaseId] = true;
  });
  CEHP.Events.on('boss:telegraph', function(payload) {
    if (payload && payload.bossId === 'supervisor') telegraphs.push(payload.durationMs);
  });

  for (let i = 0; i < 60; i += 1) {
    boss.update(50);
  }

  assert.deepEqual(reached, { intake: true, review: true, stamp: true });
  assert.equal(boss.snapshot().phaseId, 'stamp');
  assert.ok(telegraphs.length >= 3);
  telegraphs.forEach(function(ms) {
    assert.ok(ms >= 120, String(ms));
    assert.ok(ms <= 400, String(ms));
  });
});

test('Supervisor defeat fires tags and selects the W1 receipt fragment', () => {
  const CEHP = loadModules(SUPERVISOR_MODULES);
  const world = makeWorld();
  const boss = CEHP.bosses.spawnSupervisor(world.scene, world, { seed: 'CASE-DEFEAT' });
  const defeated = [];

  CEHP.Axes.reset();
  CEHP.Metrics.reset();
  CEHP.Events.on('boss:defeated', function(payload) {
    if (payload && payload.bossId === 'supervisor') defeated.push(payload);
  });

  const snapshot = boss.debugDefeat();
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-SUPERVISOR-RECEIPT',
    worldId: 'orientation',
    axes: CEHP.Axes.snapshot(),
    tensions: CEHP.Axes.tensions(),
    flags: world.runState.receiptFlags,
    cigaretteLit: true
  });

  assert.equal(snapshot.defeated, true);
  assert.equal(world.runState.receiptFlags.supervisorDefeated, true);
  assert.equal(world.supervisorDefeated, true);
  assert.equal(defeated.length, 1);
  assert.equal(defeated[0].phaseId, 'stamp');
  assert.equal(CEHP.Axes.snapshot().micro.modulesPassed, 1);
  assert.equal(CEHP.Metrics.snapshot().totals.modulePassed, 1);
  assert.equal(receipt.fragmentIds.includes('W15_SUPERVISOR_CLOSER_01'), true, receipt.fragmentIds.join(', '));
  assert.equal(receipt.lines.includes('THE SUPERVISOR ACCEPTED YOUR PAPERWORK.'), true);
});

test('Supervisor fragment stays gated off for the existing W1 obedient fixture', () => {
  const CEHP = loadModules(SUPERVISOR_MODULES);
  const fixture = JSON.parse(fs.readFileSync(path.join(replayDir, 'w1_orientation_obedient.json'), 'utf8'));
  const receipt = CEHP.Receipts.generate({
    seed: fixture.seed,
    worldId: 'orientation',
    axes: {
      primary: { compliance: 1, intuition: 0.8, efficiency: 0.8, grace: 0.4 },
      micro: { modulesPassed: 11, contradictionFollow: 6, signsRead: 18 }
    },
    tensions: { obedience: 1, style: 0.3, auditRisk: 0.1 },
    flags: fixture.expected_debug.receipt_flags,
    cigaretteLit: true
  });

  assert.equal(fixture.expected_debug.receipt_flags.supervisorDefeated, undefined);
  assert.equal(receipt.fragmentIds.includes('W15_SUPERVISOR_CLOSER_01'), false, plain(receipt.fragmentIds).join(', '));
});

test('W1 runtime gates Supervisor integration without changing obedient debug style', () => {
  const source = fs.readFileSync(path.join(srcDir, '74_world_orientation_runtime.js'), 'utf8');

  assert.match(
    source,
    /W1_SUPERVISOR_BOSS!==!1\)\)a\.supervisorBoss=e\.bosses\.spawnSupervisor\(o,a\)/
  );
  // NOTE: regex relaxed in W15M-P8a-prep to allow additional debug styles to map to obedient
  assert.match(
    source,
    /var\s+s\s*=\s*\(?[^?]*t==="supervisor"[^?]*\)?\?"obedient":t/
  );
  assert.match(
    source,
    /if\(t==="supervisor"&&o\.supervisorBoss&&o\.supervisorBoss\.debugDefeat\)/
  );
  assert.match(
    source,
    /a\.finalDoorUnlocked&&\(!a\.supervisorBoss\|\|a\.supervisorBoss\.defeated\)/
  );
});
