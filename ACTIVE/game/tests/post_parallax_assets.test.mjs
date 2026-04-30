import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');

const PARALLAX_ASSET_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '1A_asset_loader.js',
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
    assert.equal(fs.existsSync(filePath), true, file + ' should exist');
    return fs.readFileSync(filePath, 'utf8');
  }).join('\n');
  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

function readManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function makeNode(kind, key) {
  return {
    kind,
    key,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    alpha: 1,
    depth: 0,
    destroyed: false,
    setDepth(value) {
      this.depth = value;
      return this;
    },
    setOrigin(x, y) {
      this.originX = x;
      this.originY = y == null ? x : y;
      return this;
    },
    setDisplaySize(w, h) {
      this.width = w;
      this.height = h;
      return this;
    },
    setAlpha(value) {
      this.alpha = value;
      return this;
    },
    destroy() {
      this.destroyed = true;
    }
  };
}

function makeScene(CEHP) {
  const keys = new Set(CEHP.Art.allAssets().map(function(asset) {
    return asset.key;
  }));
  const handlers = {};
  const scene = {
    images: [],
    rectangles: [],
    cameras: {
      main: { scrollX: 0 }
    },
    scale: {
      width: 960
    },
    textures: {
      exists(key) {
        return keys.has(key);
      }
    },
    add: {
      image(x, y, key) {
        const image = makeNode('image', key);
        image.x = x;
        image.y = y;
        scene.images.push(image);
        return image;
      },
      rectangle(x, y, width, height, color, alpha) {
        const node = makeNode('rectangle', '');
        node.x = x;
        node.y = y;
        node.width = width;
        node.height = height;
        node.fillColor = color;
        node.alpha = alpha;
        scene.rectangles.push(node);
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
      }
    }
  };
  return scene;
}

function makeWorld(worldId) {
  return {
    worldId,
    width: 3960,
    runState: {
      caseSeed: 'CASE-PARALLAX-PLATES',
      worldId
    }
  };
}

test('ART2 parallax plate loader resolves all three depth plates per world', () => {
  const CEHP = loadModules(PARALLAX_ASSET_MODULES);
  CEHP.Art.registerManifest(readManifest());

  const orientation = CEHP.Parallax.loadWorldPlates('orientation');
  const benefits = CEHP.Parallax.loadWorldPlates('benefits');
  const rasta = CEHP.Parallax.loadWorldPlates('rasta');

  assert.equal(orientation.length, 3);
  assert.equal(benefits.length, 3);
  assert.equal(rasta.length, 3);
  assert.equal(orientation[0].layerId, 'far');
  assert.equal(orientation[1].layerId, 'mid');
  assert.equal(orientation[2].layerId, 'near');
  assert.equal(orientation[0].key, CEHP.Art.getKey('environments', 'orientation.far'));
  assert.equal(benefits[1].key, CEHP.Art.getKey('environments', 'benefits.mid'));
  assert.equal(rasta[2].key, CEHP.Art.getKey('environments', 'rasta.near'));
});

test('ART2 parallax attach layers manifest plates without removing legacy layers', () => {
  const CEHP = loadModules(PARALLAX_ASSET_MODULES);
  CEHP.Art.registerManifest(readManifest());
  const scene = makeScene(CEHP);
  const handle = CEHP.Parallax.attach(scene, makeWorld('benefits'), { worldId: 'benefits' });

  assert.equal(handle.plates.length, 3);
  assert.equal(handle.layers.far.length, 6);
  assert.equal(handle.layers.mid.length, 6);
  assert.deepEqual(scene.images.map((image) => image.key), [
    CEHP.Art.getKey('environments', 'benefits.far'),
    CEHP.Art.getKey('environments', 'benefits.mid'),
    CEHP.Art.getKey('environments', 'benefits.near')
  ]);

  handle.sync(240);
  assert.equal(Math.round(handle.plates[0].node.x), Math.round(handle.plates[0].baseX + (240 * (1 - handle.plates[0].factor))));

  handle.destroy();
  assert.equal(scene.images.every((image) => image.destroyed), true);
});
