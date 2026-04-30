import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');

const ENEMY_ART_MODULES = [
  '00_index.js',
  '02_rng.js',
  '1A_asset_loader.js',
  '67_post_enemy_locust_art.js'
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

function makeSprite(key) {
  return {
    textureKey: key || '',
    displayWidth: 40,
    displayHeight: 48,
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
    setTexture(value) {
      this.textureKey = value;
      return this;
    },
    setDisplaySize(w, h) {
      this.displayWidth = w;
      this.displayHeight = h;
      return this;
    },
    setScale(x, y) {
      this.scaleX = x;
      this.scaleY = y == null ? x : y;
      return this;
    },
    setAlpha(value) {
      this.alpha = value;
      return this;
    },
    setOrigin() {
      return this;
    },
    setDepth(value) {
      this.depth = value;
      return this;
    }
  };
}

function makeScene(CEHP, assistMode = {}) {
  const keys = new Set(CEHP.Art.allAssets().map(function(asset) {
    return asset.key;
  }));
  const scene = {
    images: [],
    _assistMode: assistMode,
    time: { now: 0 },
    textures: {
      exists(key) {
        return keys.has(key);
      }
    },
    add: {
      image(x, y, key) {
        const sprite = makeSprite(key);
        sprite.x = x;
        sprite.y = y;
        scene.images.push(sprite);
        return sprite;
      }
    }
  };
  return scene;
}

test('ART2 enemy art maps runtime enemy types to manifest sprite keys', () => {
  const CEHP = loadModules(ENEMY_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());

  assert.equal(CEHP.Enemies.artKeyFor('scantron'), CEHP.Art.getKey('enemies', 'orientation_clipboard_imp.idle'));
  assert.equal(CEHP.Enemies.artKeyFor('pizzaParty'), CEHP.Art.getKey('enemies', 'benefits_premium_pigeon.idle'));
  assert.equal(CEHP.Enemies.artKeyFor('deductibleWeight'), CEHP.Art.getKey('enemies', 'benefits_premium_pigeon.idle'));
  assert.equal(CEHP.Enemies.artKeyFor('replyAllLocust', 'single'), CEHP.Art.getKey('enemies', 'reply_all_locust.single'));
  assert.equal(CEHP.Enemies.artKeyFor('replyAllLocust', 'swarm'), CEHP.Art.getKey('enemies', 'reply_all_locust.swarm'));
});

test('ART2 enemy art retargets existing enemy art without changing enemy state', () => {
  const CEHP = loadModules(ENEMY_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());
  const scene = makeScene(CEHP);
  const enemy = {
    kind: 'scantron',
    phase: 'active',
    rect: { x: 42, y: 88, alpha: 0.72, scaleX: 1.25, scaleY: 1 },
    art: makeSprite('enemy_compliance_auditor'),
    scene
  };

  assert.equal(CEHP.Enemies.applyArtSprite(scene, enemy, 'scantron'), true);
  assert.equal(enemy.art.textureKey, CEHP.Art.getKey('enemies', 'orientation_clipboard_imp.idle'));
  assert.equal(enemy.art.displayWidth, 40);
  assert.equal(enemy.art.displayHeight, 48);
  assert.equal(enemy.phase, 'active');
});

test('ART2 enemy art creates locust sprites while leaving collision rects intact', () => {
  const CEHP = loadModules(ENEMY_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());
  const scene = makeScene(CEHP);
  const locust = {
    rect: { x: 128, y: 64, alpha: 0.84, scaleX: 1, scaleY: 1 }
  };

  assert.equal(CEHP.Enemies.applyLocustArt(scene, locust, 0.5), true);
  assert.equal(locust.art.textureKey, CEHP.Art.getKey('enemies', 'reply_all_locust.single'));
  assert.equal(locust.art.x, 128);
  assert.equal(locust.art.y, 64);
  assert.equal(locust.rect.x, 128);
  assert.equal(locust.rect.y, 64);
});

test('ART3 locust flutter is seeded and reduceParticles skips wing motion', () => {
  const CEHP = loadModules(ENEMY_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());
  const scene = makeScene(CEHP);
  const locustA = {
    rect: { x: 128, y: 64, alpha: 0.84, scaleX: 1, scaleY: 1 }
  };
  const locustB = {
    rect: { x: 128, y: 64, alpha: 0.84, scaleX: 1, scaleY: 1 }
  };
  const stillScene = makeScene(CEHP, { reduceParticles: true });
  const stillLocust = {
    rect: { x: 128, y: 64, alpha: 0.84, scaleX: 1, scaleY: 1 }
  };

  scene.time.now = 31;
  assert.equal(CEHP.Enemies.applyLocustArt(scene, locustA, 1), true);
  assert.equal(CEHP.Enemies.applyLocustArt(scene, locustB, 1), true);

  assert.equal(Number(locustA.art.scaleX.toFixed(4)), Number(locustB.art.scaleX.toFixed(4)));
  assert.ok(locustA.art.scaleX < 1);
  assert.ok(locustA.art.scaleX >= 0.85);

  stillScene.time.now = 31;
  assert.equal(CEHP.Enemies.applyLocustArt(stillScene, stillLocust, 1), true);
  assert.equal(stillLocust.art.scaleX, 1);
});
