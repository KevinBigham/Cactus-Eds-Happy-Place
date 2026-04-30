import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

const PARALLAX_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '42_parallax.js'
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
  return {
    x,
    y,
    width,
    height,
    fillColor: color || 0,
    alpha: alpha == null ? 1 : alpha,
    depth: 0,
    originX: 0.5,
    originY: 0.5,
    destroyed: false,
    setDepth(value) { this.depth = value; return this; },
    setOrigin(xOrigin, yOrigin) {
      this.originX = xOrigin;
      this.originY = yOrigin == null ? xOrigin : yOrigin;
      return this;
    },
    setAlpha(value) { this.alpha = value; return this; },
    destroy() { this.destroyed = true; }
  };
}

function makeScene() {
  const rectangles = [];
  const handlers = {};
  return {
    rectangles,
    cameras: {
      main: { scrollX: 0 }
    },
    add: {
      rectangle(x, y, width, height, color, alpha) {
        const node = makeNode(x, y, width, height, color, alpha);
        rectangles.push(node);
        return node;
      }
    },
    events: {
      on(name, fn) {
        handlers[name] = fn;
      },
      off(name, fn) {
        if (handlers[name] === fn) delete handlers[name];
      },
      emit(name) {
        if (handlers[name]) handlers[name]();
      },
      has(name) {
        return Boolean(handlers[name]);
      }
    }
  };
}

function makeWorld(worldId, seed) {
  return {
    worldId,
    id: worldId + '-world',
    width: 3960,
    runState: {
      caseSeed: seed || 'CASE-PARALLAX-UNIT',
      worldId
    }
  };
}

function plainLayers(handle) {
  return {
    far: handle.layers.far.map(function(item) {
      return {
        baseX: item.baseX,
        baseY: item.baseY,
        width: item.node.width,
        height: item.node.height,
        color: item.node.fillColor,
        alpha: item.node.alpha,
        depth: item.node.depth
      };
    }),
    mid: handle.layers.mid.map(function(item) {
      return {
        baseX: item.baseX,
        baseY: item.baseY,
        width: item.node.width,
        height: item.node.height,
        color: item.node.fillColor,
        alpha: item.node.alpha,
        depth: item.node.depth
      };
    })
  };
}

test('Parallax attach builds two deterministic budgeted layers per world seed', () => {
  const CEHP = loadModules(PARALLAX_MODULES);
  const first = CEHP.Parallax.attach(makeScene(), makeWorld('benefits', 'CASE-PARALLAX-A'));
  const second = CEHP.Parallax.attach(makeScene(), makeWorld('benefits', 'CASE-PARALLAX-A'));
  const third = CEHP.Parallax.attach(makeScene(), makeWorld('benefits', 'CASE-PARALLAX-B'));

  assert.equal(typeof CEHP.Parallax.attach, 'function');
  assert.equal(first.factors.far, 0.3);
  assert.equal(first.factors.mid, 0.6);
  assert.ok(first.layers.far.length > 0);
  assert.ok(first.layers.mid.length > 0);
  assert.ok(first.layers.far.length <= 8);
  assert.ok(first.layers.mid.length <= 8);
  assert.equal(first.layers.far[0].node.fillColor, 0x2a1d24);
  assert.equal(first.layers.mid[0].node.fillColor, 0x4a3142);
  assert.deepEqual(plainLayers(first), plainLayers(second));
  assert.notDeepEqual(plainLayers(first), plainLayers(third));
});

test('Parallax sync scrolls far and mid layers at their independent factors', () => {
  const CEHP = loadModules(PARALLAX_MODULES);
  const scene = makeScene();
  const handle = CEHP.Parallax.attach(scene, makeWorld('rasta', 'CASE-PARALLAX-SYNC'));
  const far = handle.layers.far[0];
  const mid = handle.layers.mid[0];

  handle.sync(200);

  assert.equal(Math.round(far.node.x), Math.round(far.baseX + (200 * (1 - 0.3))));
  assert.equal(Math.round(mid.node.x), Math.round(mid.baseX + (200 * (1 - 0.6))));
});

test('Parallax update hook syncs once per frame and destroy removes visuals', () => {
  const CEHP = loadModules(PARALLAX_MODULES);
  const scene = makeScene();
  const handle = CEHP.Parallax.attach(scene, makeWorld('orientation', 'CASE-PARALLAX-HOOK'));
  const far = handle.layers.far[0];

  scene.cameras.main.scrollX = 320;
  scene.events.emit('update');

  assert.equal(scene.events.has('update'), true);
  assert.equal(Math.round(far.node.x), Math.round(far.baseX + (320 * (1 - 0.3))));

  handle.destroy();

  assert.equal(scene.events.has('update'), false);
  assert.equal(scene.rectangles.every(function(node) { return node.destroyed; }), true);
});
