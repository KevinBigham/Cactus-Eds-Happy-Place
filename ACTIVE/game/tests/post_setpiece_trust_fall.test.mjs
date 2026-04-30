import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const replayDir = path.join(gameDir, '_canon/replays/cehp');
const CLOSER_ID = 'W15_TRUST_FALL_CLOSER_01';
const CLOSER_TEXT = 'THE FLOOR REMEMBERED YOUR COMMITMENT.';

const TRUST_FALL_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '22_collision.js',
  '10_axes.js',
  '80_receipts.js',
  '68_post_setpiece_trust_fall.js'
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
    assert.equal(fs.existsSync(filePath), true, `${file} should exist`);
    return fs.readFileSync(filePath, 'utf8');
  }).join('\n');

  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

function makeNode(x, y, width, height, color, alpha) {
  const node = {
    x,
    y,
    width,
    height,
    fillColor: color || 0,
    alpha: alpha == null ? 1 : alpha,
    depth: 0,
    visible: true,
    destroyed: false,
    body: null,
    text: '',
    setDepth(value) { this.depth = value; return this; },
    setOrigin() { return this; },
    setAlpha(value) { this.alpha = value; return this; },
    setVisible(value) { this.visible = value; return this; },
    setText(value) { this.text = value; return this; },
    setStrokeStyle() { return this; },
    destroy() { this.destroyed = true; }
  };

  node.body = {
    x: x - width / 2,
    y: y - height / 2,
    width,
    height,
    allowGravity: false,
    moves: false,
    velocity: { x: 0, y: 0 },
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
  const nodes = [];
  const handlers = {};
  return {
    nodes,
    time: { now: 0 },
    add: {
      rectangle(x, y, width, height, color, alpha) {
        const node = makeNode(x, y, width, height, color, alpha);
        nodes.push(node);
        return node;
      },
      zone(x, y, width, height) {
        const node = makeNode(x, y, width, height, 0, 0);
        nodes.push(node);
        return node;
      },
      text(x, y, text) {
        const node = makeNode(x, y, 92, 16, 0, 1);
        node.text = text;
        nodes.push(node);
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
    events: {
      on(name, fn) { handlers[name] = fn; },
      off(name, fn) { if (handlers[name] === fn) delete handlers[name]; },
      emit(name, time, dt) { if (handlers[name]) handlers[name](time, dt); },
      has(name) { return Boolean(handlers[name]); }
    }
  };
}

function makeWorld() {
  const scene = makeScene();
  const room = { id: 'aerial-exception', startX: 5280, endX: 6600, platforms: [] };
  const player = makeNode(room.startX + 520, 420, 24, 48);
  return {
    id: 'orientation-world',
    worldId: 'orientation',
    scene,
    runState: {
      caseSeed: 'CASE-TRUST-FALL-UNIT',
      worldId: 'orientation',
      receiptFlags: {}
    },
    horizon: 516,
    rooms: [room],
    platforms: [],
    player,
    receiptFlags: {}
  };
}

function words(text) {
  return text.replace(/\.$/, '').split(/\s+/).filter(Boolean);
}

test('Trust Fall setpiece spawns a gated sensor, overlay, and hidden corridor', () => {
  const CEHP = loadModules(TRUST_FALL_MODULES);
  const world = makeWorld();
  const setpiece = CEHP.Setpieces.attachTrustFall(world.scene, world, { room: world.rooms[0] });

  assert.equal(CEHP.flags.W1_TRUST_FALL, true);
  assert.equal(typeof CEHP.Setpieces.attachTrustFall, 'function');
  assert.equal(setpiece.id, 'trust-fall');
  assert.equal(setpiece.overlay.text, 'TRUST FALL?');
  assert.equal(setpiece.overlay.visible, false);
  assert.equal(world.platforms.includes(setpiece.corridor.floor), true);
  assert.equal(world.rooms[0].platforms.includes(setpiece.corridor.floor), true);
  assert.ok(setpiece.sensor.x > world.rooms[0].startX);
  assert.ok(setpiece.sensor.x < world.rooms[0].endX);
});

test('Trust Fall accept path requires six hundred ms of Down and emits closer flag', () => {
  const CEHP = loadModules(TRUST_FALL_MODULES);
  const world = makeWorld();
  const setpiece = CEHP.Setpieces.attachTrustFall(world.scene, world, { room: world.rooms[0] });

  CEHP.Input.down = function(action) { return action === 'down'; };
  setpiece.update(300);
  assert.equal(world.receiptFlags.trustFallAccepted, undefined);
  setpiece.update(300);

  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-TRUST-FALL-RECEIPT',
    worldId: 'orientation',
    axes: { primary: { compliance: 1, intuition: 1, grace: 1 }, micro: { modulesPassed: 12 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: world.receiptFlags,
    cigaretteLit: true
  });

  assert.equal(world.receiptFlags.trustFallAccepted, true);
  assert.equal(world.runState.receiptFlags.trustFallAccepted, true);
  assert.equal(world.receiptFlags.trustFallDeclined, undefined);
  assert.equal(setpiece.state, 'accepted');
  assert.equal(receipt.fragmentIds.includes(CLOSER_ID), true, receipt.fragmentIds.join(', '));
  assert.equal(receipt.lines.includes(CLOSER_TEXT), true);
});

test('Trust Fall decline path is silent and does not select the closer', () => {
  const CEHP = loadModules(TRUST_FALL_MODULES);
  const world = makeWorld();
  const setpiece = CEHP.Setpieces.attachTrustFall(world.scene, world, { room: world.rooms[0] });

  CEHP.Input.down = function() { return false; };
  world.player.x = setpiece.sensor.x + (setpiece.sensor.width / 2) + 80;
  world.player.body.updateFromGameObject();
  setpiece.update(16);

  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-TRUST-FALL-DECLINE',
    worldId: 'orientation',
    axes: { primary: { compliance: 1, intuition: 1, grace: 1 }, micro: { modulesPassed: 12 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: world.receiptFlags,
    cigaretteLit: true
  });

  assert.equal(world.receiptFlags.trustFallDeclined, true);
  assert.equal(world.runState.receiptFlags.trustFallDeclined, true);
  assert.equal(world.receiptFlags.trustFallAccepted, undefined);
  assert.equal(setpiece.state, 'declined');
  assert.equal(receipt.fragmentIds.includes(CLOSER_ID), false, receipt.fragmentIds.join(', '));
});

test('Trust Fall voice and replay wiring stay within W15 rules', () => {
  const source = fs.readFileSync(path.join(srcDir, '68_post_setpiece_trust_fall.js'), 'utf8');
  const runtime = fs.readFileSync(path.join(srcDir, '74_world_orientation_runtime.js'), 'utf8');
  const fixturePath = path.join(replayDir, 'w1_orientation_trust_fall.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  assert.equal(CLOSER_TEXT, CLOSER_TEXT.toUpperCase());
  assert.equal(CLOSER_TEXT.endsWith('.'), true);
  assert.equal(CLOSER_TEXT.includes('!'), false);
  assert.ok(words(CLOSER_TEXT).length <= 8);
  assert.match(source, /TRUST FALL\?/);
  assert.match(source, /W15_TRUST_FALL_CLOSER_01/);
  assert.match(source, /W1_TRUST_FALL/);
  assert.match(runtime, /W1_TRUST_FALL/);
  assert.equal(fixture.debug_style, 'trust-fall-accepted');
  assert.equal(fixture.expected_debug.receipt_flags.trustFallAccepted, true);
  // W15M-P12: closer pool expanded; the fixture closer must come from the
  // Trust Fall accept pool rather than match a single canonical id.
  const fixtureCloser = fixture.expected_debug.receipt_fragment_ids[2];
  assert.ok(/^W15_TRUST_FALL_CLOSER_/.test(fixtureCloser),
    `expected Trust Fall accept closer in fixture, got ${fixtureCloser}`);
});
