import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');

const ASSET_LOADER_MODULES = [
  '00_index.js',
  '1A_asset_loader.js'
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

function manifestName(asset) {
  return asset.subject + '.' + asset.state;
}

function makeScene() {
  const loads = [];
  const jsonLoads = [];
  const handlers = {};
  return {
    loadCalls: loads,
    jsonCalls: jsonLoads,
    textures: {
      exists() {
        return false;
      }
    },
    load: {
      image(key, assetPath) {
        loads.push({ key, path: assetPath });
      },
      json(key, assetPath) {
        jsonLoads.push({ key, path: assetPath });
      },
      once(name, fn) {
        handlers[name] = fn;
      },
      emit(name, payload) {
        if (handlers[name]) handlers[name](payload);
      }
    }
  };
}

test('ART2 asset loader derives every Phaser key and path from the manifest', () => {
  const CEHP = loadModules(ASSET_LOADER_MODULES);
  const manifest = readManifest();

  assert.equal(typeof CEHP.Art.registerManifest, 'function');
  assert.equal(typeof CEHP.Art.getKey, 'function');
  assert.equal(typeof CEHP.Art.getPath, 'function');
  assert.equal(CEHP.Art.registerManifest(manifest), true);
  assert.equal(CEHP.Art.registerManifest(manifest), false, 'second registration is idempotent');

  manifest.assets.forEach((asset) => {
    const name = manifestName(asset);
    const key = CEHP.Art.getKey(asset.category, name);

    assert.equal(key, 'cehp_art:' + asset.category + ':' + asset.subject + ':' + asset.state + ':' + asset.variant);
    assert.equal(CEHP.Art.getPath(asset.category, name), 'assets/art/' + asset.file);
    assert.deepEqual(CEHP.Art.getAsset(asset.category, name).file, asset.file);
  });
});

test('ART2 asset loader preloads all 37 manifest images into a Phaser scene', () => {
  const CEHP = loadModules(ASSET_LOADER_MODULES);
  const manifest = readManifest();
  const scene = makeScene();

  CEHP.Art.registerManifest(manifest);
  CEHP.Art.preloadAll(scene);

  assert.equal(scene.loadCalls.length, 37);
  assert.equal(scene.loadCalls[0].key, CEHP.Art.getKey('characters', 'cactus_ed.idle'));
  assert.equal(scene.loadCalls[0].path, 'assets/art/characters/cactus_ed_idle_01.png');
  assert.equal(scene.loadCalls[36].key, CEHP.Art.getKey('splash', 'cehp_title_background.title_background'));
  assert.equal(scene.loadCalls[36].path, 'assets/art/splash/cehp_title_background_01.png');
});

test('ART2 asset loader can bootstrap from Phaser JSON preload on cold boot', () => {
  const CEHP = loadModules(ASSET_LOADER_MODULES);
  const manifest = readManifest();
  const scene = makeScene();

  CEHP.Art.preloadAll(scene);

  assert.deepEqual(scene.jsonCalls, [
    { key: 'cehp_art_manifest', path: 'assets/art/art_manifest.json' }
  ]);
  assert.equal(scene.loadCalls.length, 0);

  scene.load.emit('filecomplete-json-cehp_art_manifest', manifest);

  assert.equal(scene.loadCalls.length, 37);
  assert.equal(CEHP.Art.getPath('bosses', 'supervisor.telegraph'), 'assets/art/bosses/supervisor_telegraph_01.png');
});

test('ART2 asset loader wraps Boot preload without changing scene behavior', () => {
  const CEHP = loadModules(ASSET_LOADER_MODULES);
  const scene = makeScene();
  function BootScene() {}
  function PlayScene() {}

  BootScene.prototype.preload = function() {
    this.originalPreloadCalled = true;
  };

  assert.equal(typeof CEHP.Art.withPreloadHook, 'function');
  assert.deepEqual(CEHP.Art.withPreloadHook([BootScene, PlayScene]), [BootScene, PlayScene]);
  BootScene.prototype.preload.call(scene);

  assert.equal(scene.originalPreloadCalled, true);
  assert.deepEqual(scene.jsonCalls, [
    { key: 'cehp_art_manifest', path: 'assets/art/art_manifest.json' }
  ]);
});
