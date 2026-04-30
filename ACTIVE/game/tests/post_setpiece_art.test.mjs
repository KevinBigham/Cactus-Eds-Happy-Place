import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');

const SETPIECE_ART_MODULES = [
  '00_index.js',
  '1A_asset_loader.js',
  '6B_post_setpiece_art.js'
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

function makeScene(CEHP) {
  const keys = new Set(CEHP.Art.allAssets().map(function(asset) {
    return asset.key;
  }));
  const scene = {
    images: [],
    textures: {
      exists(key) {
        return keys.has(key);
      }
    },
    add: {
      image(x, y, key) {
        const image = {
          x,
          y,
          key,
          displayWidth: 0,
          displayHeight: 0,
          alpha: 1,
          setOrigin() {
            return this;
          },
          setDepth(value) {
            this.depth = value;
            return this;
          },
          setDisplaySize(w, h) {
            this.displayWidth = w;
            this.displayHeight = h;
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
        scene.images.push(image);
        return image;
      }
    }
  };
  return scene;
}

test('ART2 setpiece art maps each setpiece backdrop to manifest keys', () => {
  const CEHP = loadModules(SETPIECE_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());

  assert.equal(CEHP.Setpieces.artKeyFor('trust-fall'), CEHP.Art.getKey('setpieces', 'trust_fall.hero'));
  assert.equal(CEHP.Setpieces.artKeyFor('open-concept'), CEHP.Art.getKey('setpieces', 'open_concept.hero'));
  assert.equal(CEHP.Setpieces.artKeyFor('supply-chain'), CEHP.Art.getKey('setpieces', 'supply_chain.hero'));
});

test('ART2 setpiece art attaches a backdrop without changing setpiece state', () => {
  const CEHP = loadModules(SETPIECE_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());
  const scene = makeScene(CEHP);
  const setpiece = {
    id: 'open-concept',
    scene,
    world: { horizon: 516 },
    room: { startX: 100 },
    state: 'idle',
    walls: [{ x: 200, y: 380 }, { x: 372, y: 432 }, { x: 544, y: 380 }],
    sensors: [],
    destroy() {
      this.destroyed = true;
    }
  };

  assert.equal(CEHP.Setpieces.applyBackdrop(scene, setpiece, 'open-concept'), true);
  assert.equal(setpiece.backdrop.key, CEHP.Art.getKey('setpieces', 'open_concept.hero'));
  assert.equal(setpiece.state, 'idle');
  assert.equal(scene.images.length, 1);

  setpiece.destroy();
  assert.equal(setpiece.destroyed, true);
  assert.equal(setpiece.backdrop.destroyed, true);
});

test('ART2 setpiece art wrapper preserves existing attach return contract', () => {
  const CEHP = loadModules(SETPIECE_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());
  const scene = makeScene(CEHP);
  const setpiece = {
    id: 'trust-fall',
    scene,
    world: { horizon: 516 },
    sensor: { x: 420, y: 430, width: 164, height: 132 },
    state: 'idle'
  };

  CEHP.Setpieces.attachTrustFall = function() {
    return setpiece;
  };
  CEHP.Setpieces.wrapArtAttach('attachTrustFall', 'trust-fall');

  const returned = CEHP.Setpieces.attachTrustFall(scene, {});
  assert.equal(returned, setpiece);
  assert.equal(returned.backdrop.key, CEHP.Art.getKey('setpieces', 'trust_fall.hero'));
  assert.equal(returned.state, 'idle');
});
