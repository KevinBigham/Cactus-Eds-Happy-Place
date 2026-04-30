import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const replayDir = path.join(gameDir, '_canon/replays/cehp');

const LOGISTICS_MODULES = [
  '00_index.js',
  '02_rng.js',
  '03_events.js',
  '10_axes.js',
  '11_metrics.js',
  '22_collision.js',
  '63_post_boss_framework.js',
  '66_post_boss_logistics.js',
  '70_worlds.js',
  '73_world_rasta.js',
  '80_receipts.js'
];

const LOGISTICS_CLOSER_ID = 'W15_LOGISTICS_CLOSER_01';
const LOGISTICS_CLOSER_TEXT = 'THE LEDGER NOTICED YOUR SOFT EXIT.';

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
    setSize(w, h) { this.width = w; this.height = h; return this; },
    setScale(xScale, yScale) {
      this.scaleX = xScale;
      this.scaleY = yScale == null ? xScale : yScale;
      return this;
    },
    setStrokeStyle() { return this; },
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
        const node = makeNode(x, y, 104, 16);
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
  const finalRoom = { id: 'warm-exit', startX: 7680, endX: 8960, platforms: [] };
  const player = makeNode(8560, 360, 24, 48);
  player.invulnMs = 0;
  player.takeHit = function(kind) { this.lastHit = kind; };

  return {
    id: 'rasta-world',
    worldId: 'rasta',
    scene,
    runState: {
      caseSeed: 'CASE-LOGISTICS-UNIT',
      worldId: 'rasta',
      receiptFlags: {
        restOpened: true,
        rushedRest: false,
        cigaretteLit: false,
        syncedFlow: true
      }
    },
    horizon: 400,
    rooms: [finalRoom],
    platforms: [],
    player,
    goal: makeNode(8860, 280, 160, 220)
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Logistics boss spawns through the concrete W3 factory', () => {
  const CEHP = loadModules(LOGISTICS_MODULES);
  const world = makeWorld();
  const boss = CEHP.bosses.spawnLogistics(world.scene, world, { seed: 'CASE-SPAWN' });

  assert.equal(CEHP.flags.W3_LOGISTICS_BOSS, true);
  assert.equal(typeof CEHP.bosses.spawnLogistics, 'function');
  assert.equal(boss.id, 'logistics');
  assert.equal(boss.framework.phases.length, 3);
  assert.deepEqual(plain(boss.framework.phases.map(function(phase) { return phase.id; })), ['inspection', 'manifest', 'ledger']);
  assert.equal(world.platforms.includes(boss.blocker), true);
  assert.equal(world.rooms[0].platforms.includes(boss.blocker), true);
  assert.ok(boss.rect);
  assert.ok(boss.hazard);
});

test('Logistics boss reaches inspection, manifest, and ledger phases deterministically', () => {
  const CEHP = loadModules(LOGISTICS_MODULES);
  const world = makeWorld();
  const reached = { inspection: true };
  const telegraphs = [];
  const boss = CEHP.bosses.spawnLogistics(world.scene, world, { seed: 'CASE-PHASES' });

  CEHP.Events.on('boss:phase', function(payload) {
    if (payload && payload.bossId === 'logistics') reached[payload.phaseId] = true;
  });
  CEHP.Events.on('boss:telegraph', function(payload) {
    if (payload && payload.bossId === 'logistics') telegraphs.push(payload.durationMs);
  });

  for (let i = 0; i < 70; i += 1) {
    boss.update(50);
  }

  assert.deepEqual(reached, { inspection: true, manifest: true, ledger: true });
  assert.equal(boss.snapshot().phaseId, 'ledger');
  assert.ok(telegraphs.length >= 3);
  telegraphs.forEach(function(ms) {
    assert.ok(ms >= 120, String(ms));
    assert.ok(ms <= 400, String(ms));
  });
});

test('Logistics defeat fires tags and selects the W3 receipt fragment', () => {
  const CEHP = loadModules(LOGISTICS_MODULES);
  const world = makeWorld();
  const boss = CEHP.bosses.spawnLogistics(world.scene, world, { seed: 'CASE-DEFEAT' });
  const defeated = [];
  const receiptTags = [];

  CEHP.Axes.reset();
  CEHP.Metrics.reset();
  CEHP.Events.on('boss:defeated', function(payload) {
    if (payload && payload.bossId === 'logistics') defeated.push(payload);
  });
  CEHP.Events.on('boss:receiptTag', function(payload) {
    if (payload && payload.bossId === 'logistics') receiptTags.push(payload);
  });

  const snapshot = boss.debugDefeat();
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-LOGISTICS-RECEIPT',
    worldId: 'rasta',
    axes: CEHP.Axes.snapshot(),
    tensions: CEHP.Axes.tensions(),
    flags: world.runState.receiptFlags,
    cigaretteLit: false
  });

  assert.equal(snapshot.defeated, true);
  assert.equal(world.runState.receiptFlags.logisticsDefeated, true);
  assert.equal(world.logisticsDefeated, true);
  assert.equal(defeated.length, 1);
  assert.equal(defeated[0].phaseId, 'ledger');
  assert.equal(receiptTags.length, 1);
  assert.equal(receiptTags[0].receiptFlag, 'logisticsDefeated');
  assert.equal(CEHP.Axes.snapshot().micro.modulesPassed, 1);
  assert.equal(CEHP.Metrics.snapshot().totals.modulePassed, 1);
  assert.equal(receipt.fragmentIds.includes(LOGISTICS_CLOSER_ID), true, receipt.fragmentIds.join(', '));
  assert.equal(receipt.lines.includes(LOGISTICS_CLOSER_TEXT), true);
});

test('Logistics fragment stays gated off for existing W3 debug fixtures', () => {
  const fixtureNames = [
    'w3_rasta_dark_cigarette.json',
    'w3_rasta_rest_open.json',
    'w3_rasta_rushed.json'
  ];

  fixtureNames.forEach(function(file) {
    const fixture = JSON.parse(fs.readFileSync(path.join(replayDir, file), 'utf8'));
    assert.equal(fixture.expected_debug.receipt_flags.logisticsDefeated, undefined, file);
    assert.equal(fixture.expected_debug.receipt_fragment_ids.includes(LOGISTICS_CLOSER_ID), false, file);
  });
});

test('W3 runtime gates Logistics integration and preserves non-boss debug style', () => {
  const source = fs.readFileSync(path.join(srcDir, '76_world_rasta_runtime.js'), 'utf8');

  assert.match(
    source,
    /W3_LOGISTICS_BOSS !== false\)\) \{\s+world\.logisticsBoss = ns\.bosses\.spawnLogistics\(scene, world\);/
  );
  assert.match(
    source,
    /var run = style === 'logistics' \? 'ambient' : style;/
  );
  assert.match(
    source,
    /if \(style === 'logistics' && world\.logisticsBoss && world\.logisticsBoss\.debugDefeat\)/
  );
  assert.match(
    source,
    /world\.restGate && world\.restGate\.opened && \(!world\.logisticsBoss \|\| world\.logisticsBoss\.defeated\)/
  );
});

test('Logistics replay fixture declares the boss-on debug path', () => {
  const fixture = JSON.parse(fs.readFileSync(path.join(replayDir, 'w3_rasta_logistics.json'), 'utf8'));

  assert.equal(fixture.debug_style, 'logistics');
  assert.equal(fixture.expected_debug.receipt_flags.logisticsDefeated, true);
  assert.equal(fixture.expected_debug.receipt_fragment_ids.includes(LOGISTICS_CLOSER_ID), true);
});
