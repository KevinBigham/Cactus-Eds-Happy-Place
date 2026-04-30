import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const replayDir = path.join(gameDir, '_canon/replays/cehp');
const CLOSER_ID = 'W15_OPEN_CONCEPT_CLOSER_01';
const CLOSER_TEXT = 'THE ROOM SAW EVERY PRIVATE CHOICE.';

const OPEN_CONCEPT_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '22_collision.js',
  '10_axes.js',
  '80_receipts.js',
  '69_post_setpiece_open_concept.js'
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
        const node = makeNode(x, y, 126, 16, 0, 1);
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
  const room = { id: 'benefits-claim-window', startX: 1280, endX: 2560, platforms: [] };
  const player = makeNode(room.startX + 430, 394, 24, 48);
  return {
    id: 'benefits-world',
    worldId: 'benefits',
    scene,
    runState: {
      caseSeed: 'CASE-OPEN-CONCEPT-UNIT',
      worldId: 'benefits',
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

test('Open Concept setpiece spawns transparent walls and route sensors', () => {
  const CEHP = loadModules(OPEN_CONCEPT_MODULES);
  const world = makeWorld();
  const setpiece = CEHP.Setpieces.attachOpenConcept(world.scene, world, { room: world.rooms[0] });

  assert.equal(CEHP.flags.W2_OPEN_CONCEPT, true);
  assert.equal(typeof CEHP.Setpieces.attachOpenConcept, 'function');
  assert.equal(setpiece.id, 'open-concept');
  assert.equal(setpiece.label.text, 'OPEN CONCEPT');
  assert.equal(setpiece.walls.length, 3);
  assert.equal(setpiece.sensors.length, 3);
  assert.equal(world.platforms.includes(setpiece.walls[0]), true);
  assert.equal(world.rooms[0].platforms.includes(setpiece.walls[2]), true);
  assert.ok(setpiece.exit.x > world.rooms[0].startX);
  assert.ok(setpiece.exit.x < world.rooms[0].endX);
});

test('Open Concept route requires three observed choices before completion', () => {
  const CEHP = loadModules(OPEN_CONCEPT_MODULES);
  const world = makeWorld();
  const setpiece = CEHP.Setpieces.attachOpenConcept(world.scene, world, { room: world.rooms[0] });

  setpiece.visit(0);
  setpiece.visit(1);
  assert.equal(world.receiptFlags.openConceptNavigated, undefined);
  setpiece.visit(2);

  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-OPEN-CONCEPT-RECEIPT',
    worldId: 'benefits',
    axes: { primary: { compliance: 1, intuition: 1, grace: 1 }, micro: { modulesPassed: 12 } },
    tensions: { obedience: 1, style: 0.4, auditRisk: 0.1 },
    flags: world.receiptFlags,
    cigaretteLit: true
  });

  assert.equal(world.receiptFlags.openConceptNavigated, true);
  assert.equal(world.runState.receiptFlags.openConceptNavigated, true);
  assert.equal(setpiece.state, 'completed');
  assert.equal(receipt.fragmentIds.includes(CLOSER_ID), true, receipt.fragmentIds.join(', '));
  assert.equal(receipt.lines.includes(CLOSER_TEXT), true);
});

test('Open Concept reset clears only setpiece-local progress', () => {
  const CEHP = loadModules(OPEN_CONCEPT_MODULES);
  const world = makeWorld();
  const setpiece = CEHP.Setpieces.attachOpenConcept(world.scene, world, { room: world.rooms[0] });

  setpiece.debugNavigate();
  assert.equal(world.receiptFlags.openConceptNavigated, true);
  setpiece.reset();

  assert.equal(setpiece.state, 'idle');
  assert.deepEqual(Array.from(setpiece.visited), [false, false, false]);
  assert.equal(world.receiptFlags.openConceptNavigated, undefined);
});

test('Open Concept voice and replay wiring stay within W15 rules', () => {
  const source = fs.readFileSync(path.join(srcDir, '69_post_setpiece_open_concept.js'), 'utf8');
  const runtime = fs.readFileSync(path.join(srcDir, '75_world_benefits_runtime.js'), 'utf8');
  const fixturePath = path.join(replayDir, 'w2_benefits_open_concept.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  assert.equal(CLOSER_TEXT, CLOSER_TEXT.toUpperCase());
  assert.equal(CLOSER_TEXT.endsWith('.'), true);
  assert.equal(CLOSER_TEXT.includes('!'), false);
  assert.ok(words(CLOSER_TEXT).length <= 8);
  assert.match(source, /OPEN CONCEPT/);
  assert.match(source, /W15_OPEN_CONCEPT_CLOSER_01/);
  assert.match(source, /W2_OPEN_CONCEPT/);
  assert.match(runtime, /attachOpenConcept/);
  assert.equal(fixture.debug_style, 'open-concept');
  assert.equal(fixture.expected_debug.receipt_flags.openConceptNavigated, true);
  // W15M-P12: closer pool expanded; fixture must hold an Open Concept pool closer.
  const fixtureCloser = fixture.expected_debug.receipt_fragment_ids[2];
  assert.ok(/^W15_OPEN_CONCEPT_CLOSER_/.test(fixtureCloser),
    `expected Open Concept closer in fixture, got ${fixtureCloser}`);
});
