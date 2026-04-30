import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const replayDir = path.join(gameDir, '_canon/replays/cehp');

const LOCUST_MODULES = [
  '00_index.js',
  '02_rng.js',
  '03_events.js',
  '22_collision.js',
  '60_enemies.js',
  '67_post_enemy_locust.js'
];

const W3_FIXTURES = [
  'w3_rasta_dark_cigarette.json',
  'w3_rasta_rest_open.json',
  'w3_rasta_rushed.json',
  'w3_rasta_short.json'
];

function buildSandbox() {
  const sandbox = {
    console,
    Math,
    JSON,
    window: null,
    document: {
      readyState: 'loading',
      createElement() {
        return {
          width: 0,
          height: 0,
          getContext() {
            return { drawImage() {} };
          }
        };
      },
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
    assert.equal(fs.existsSync(filePath), true, `${file} should exist`);
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
      rectangle(x, y, width, height, color, alpha) {
        const node = makeNode(x, y, width, height);
        node.fillColor = color || 0;
        node.alpha = alpha == null ? 1 : alpha;
        return node;
      },
      text(x, y, text) {
        const node = makeNode(x, y, 108, 16);
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
          if (node && node.body && node.body.updateFromGameObject) node.body.updateFromGameObject();
        }
      }
    },
    textures: {
      exists() { return false; },
      get() { return null; }
    }
  };
}

function makeWorld() {
  const scene = makeScene();
  const room = { id: 'sorting-floor', startX: 3840, endX: 5120, platforms: [], enemies: [] };
  const player = makeNode(4210, 340, 24, 48);
  player.invulnMs = 0;
  player.hits = [];
  player.takeHit = function(kind) { this.hits.push(kind); };

  return {
    id: 'rasta-world',
    worldId: 'rasta',
    scene,
    runState: {
      caseSeed: 'CASE-LOCUST-UNIT',
      worldId: 'rasta',
      receiptFlags: {
        restOpened: true,
        rushedRest: false,
        cigaretteLit: false,
        syncedFlow: true
      }
    },
    horizon: 400,
    rooms: [room],
    platforms: [],
    enemies: [],
    player,
    currentRoom: room,
    receiptFlags: {
      restOpened: true,
      rushedRest: false,
      cigaretteLit: false,
      syncedFlow: true
    }
  };
}

function spawnActiveSwarm(CEHP, world, opts = {}) {
  const swarm = CEHP.Enemies.spawnReplyAllLocust(world.scene, world, {
    seed: opts.seed || 'CASE-LOCUST-UNIT|sorting-floor|reply-all',
    room: world.rooms[0],
    x: opts.x == null ? 4160 : opts.x,
    y: opts.y == null ? 320 : opts.y,
    edge: opts.edge || 'left',
    telegraphMs: 260,
    decayMs: opts.decayMs || 9600
  });

  swarm.update(world.player, world, 260);
  return swarm;
}

function locustPositions(swarm) {
  return swarm.locusts.map(function(locust) {
    return {
      x: Math.round(locust.rect.x),
      y: Math.round(locust.rect.y)
    };
  });
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function minimumDistance(swarm) {
  let min = Infinity;
  for (let i = 0; i < swarm.locusts.length; i += 1) {
    for (let j = i + 1; j < swarm.locusts.length; j += 1) {
      const dx = swarm.locusts[i].rect.x - swarm.locusts[j].rect.x;
      const dy = swarm.locusts[i].rect.y - swarm.locusts[j].rect.y;
      const dist = Math.sqrt((dx * dx) + (dy * dy));
      if (dist < min) min = dist;
    }
  }
  return min;
}

test('Reply-All Locust spawns deterministic count and positions for a fixed seed', () => {
  const CEHP = loadModules(LOCUST_MODULES);
  const worldA = makeWorld();
  const worldB = makeWorld();
  const swarmA = spawnActiveSwarm(CEHP, worldA);
  const swarmB = spawnActiveSwarm(CEHP, worldB);

  assert.equal(CEHP.flags.W3_REPLY_ALL_LOCUST, true);
  assert.equal(typeof CEHP.Enemies.spawnReplyAllLocust, 'function');
  assert.equal(swarmA.locusts.length, 4);
  assert.deepEqual(plain(locustPositions(swarmA)), [
    { x: 4145, y: 292 },
    { x: 4144, y: 310 },
    { x: 4144, y: 332 },
    { x: 4145, y: 352 }
  ]);
  assert.deepEqual(plain(locustPositions(swarmB)), plain(locustPositions(swarmA)));
});

test('Reply-All Locusts spread apart after settling', () => {
  const CEHP = loadModules(LOCUST_MODULES);
  const world = makeWorld();
  const swarm = spawnActiveSwarm(CEHP, world, { x: 4200, y: 320 });

  for (let i = 0; i < 24; i += 1) {
    swarm.update(world.player, world, 50);
  }

  assert.ok(minimumDistance(swarm) >= 18, String(minimumDistance(swarm)));
});

test('Reply-All Locust decay expires cleanly and destroys visuals', () => {
  const CEHP = loadModules(LOCUST_MODULES);
  const world = makeWorld();
  const swarm = spawnActiveSwarm(CEHP, world, { decayMs: 400 });

  assert.equal(world.enemies.includes(swarm), true);
  swarm.update(world.player, world, 420);

  assert.equal(swarm.dead, true);
  assert.equal(world.enemies.includes(swarm), false);
  assert.equal(world.rooms[0].enemies.includes(swarm), false);
  swarm.locusts.forEach(function(locust) {
    assert.equal(locust.rect.destroyed, true);
  });
});

test('Reply-All Locust contact damages through player.takeHit', () => {
  const CEHP = loadModules(LOCUST_MODULES);
  const world = makeWorld();
  const swarm = spawnActiveSwarm(CEHP, world, { x: world.player.x, y: world.player.y });

  swarm.locusts[0].rect.x = world.player.x;
  swarm.locusts[0].rect.y = world.player.y;
  if (swarm.locusts[0].rect.body) swarm.locusts[0].rect.body.updateFromGameObject();
  swarm.update(world.player, world, 16);

  assert.deepEqual(world.player.hits, ['locust']);
});

test('W3 Locust integration preserves existing fixtures and declares locust-only fixture', () => {
  const source = fs.readFileSync(path.join(srcDir, '76_world_rasta_runtime.js'), 'utf8');

  W3_FIXTURES.forEach(function(file) {
    const fixture = JSON.parse(fs.readFileSync(path.join(replayDir, file), 'utf8'));
    const flags = fixture.expected_debug ? fixture.expected_debug.receipt_flags : {};
    assert.notEqual(fixture.debug_style, 'locust', file);
    assert.equal(flags && flags.locustSurvived, undefined, file);
  });

  assert.match(source, /W3_REPLY_ALL_LOCUST !== false/);
  assert.match(source, /style === 'locust'/);

  const locustFixture = JSON.parse(fs.readFileSync(path.join(replayDir, 'w3_rasta_locust.json'), 'utf8'));
  assert.equal(locustFixture.debug_style, 'locust');
  assert.equal(locustFixture.expected_debug.receipt_flags.locustSurvived, true);
});
