import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');

function buildSandbox(search = '') {
  const sandbox = {
    console,
    Math,
    JSON,
    location: { search },
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

function runModule(sandbox, file) {
  const filePath = path.join(srcDir, file);
  assert.equal(fs.existsSync(filePath), true, file + ' should exist');
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox);
}

function loadSplashHarness(search = '') {
  const sandbox = buildSandbox(search);
  runModule(sandbox, '00_index.js');
  runModule(sandbox, '1A_asset_loader.js');

  function BootScene() {}
  function PlayScene() {}

  BootScene.prototype.sceneKey = 'Boot';
  BootScene.prototype.create = function() {
    this.originalCreateCalled = true;
  };
  PlayScene.prototype.sceneKey = 'Play';
  PlayScene.prototype.queueDeath = function(source) {
    this.pendingDeath = { source };
  };
  PlayScene.prototype.update = function() {
    this.pendingDeath = null;
  };

  sandbox.CEHP.Scenes = {
    list() {
      return [BootScene, PlayScene];
    }
  };

  runModule(sandbox, '91_scenes_splash_art.js');
  sandbox.CEHP.Art.registerManifest(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
  return { CEHP: sandbox.CEHP, BootScene, PlayScene };
}

function makeNode(kind, key) {
  return {
    kind,
    key,
    visible: true,
    setDepth(value) {
      this.depth = value;
      return this;
    },
    setOrigin() {
      return this;
    },
    setScale(value) {
      this.scale = value;
      return this;
    },
    setScrollFactor(value) {
      this.scrollFactor = value;
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
  const scene = {
    images: [],
    text: [],
    rectangles: [],
    tweensMade: [],
    starts: [],
    cameras: {
      main: {
        setBackgroundColor(value) {
          scene.background = value;
        }
      }
    },
    textures: {
      exists(key) {
        return keys.has(key);
      },
      get() {
        return {
          getSourceImage() {
            return { width: 1920, height: 1080 };
          }
        };
      }
    },
    add: {
      image(x, y, key) {
        const node = makeNode('image', key);
        node.x = x;
        node.y = y;
        scene.images.push(node);
        return node;
      },
      text(x, y, value) {
        const node = makeNode('text', '');
        node.x = x;
        node.y = y;
        node.value = value;
        scene.text.push(node);
        return node;
      },
      rectangle(x, y, w, h, color, alpha) {
        const node = makeNode('rectangle', '');
        node.x = x;
        node.y = y;
        node.width = w;
        node.height = h;
        node.color = color;
        node.alpha = alpha;
        scene.rectangles.push(node);
        return node;
      }
    },
    input: {
      keyboard: {
        once(name, fn) {
          scene.keyboardOnce = { name, fn };
        },
        off() {}
      },
      once(name, fn) {
        scene.pointerOnce = { name, fn };
      },
      off() {}
    },
    events: {
      once() {}
    },
    tweens: {
      add(config) {
        scene.tweensMade.push(config);
        return config;
      }
    },
    scene: {
      start(key) {
        scene.starts.push(key);
      }
    }
  };
  return scene;
}

test('ART2 title splash uses manifest art and waits for input on cold boot', () => {
  const { CEHP, BootScene } = loadSplashHarness('');
  const scene = makeScene(CEHP);

  BootScene.prototype.create.call(scene);

  assert.equal(scene.starts.length, 0);
  assert.equal(scene.images[0].key, CEHP.Art.getKey('splash', 'cehp_title_background.title_background'));
  assert.equal(scene.images[1].key, CEHP.Art.getKey('splash', 'cehp_title_logo.wordmark'));
  assert.equal(scene.text.some((node) => node.value === 'PRESS ANY KEY.'), true);
  assert.equal(scene.tweensMade.filter((tween) => tween.duration === 400 && tween.alpha === 1).length >= 2, true);
  assert.equal(scene.tweensMade.some((tween) => tween.targets === scene.images[1] && tween.angle === 2 && tween.duration === 3000 && tween.yoyo === true && tween.repeat === -1), true);

  scene.keyboardOnce.fn();
  assert.deepEqual(scene.starts, ['Play']);
});

test('ART2 title splash preserves splash bypass for automation', () => {
  const { CEHP, BootScene } = loadSplashHarness('?splash=0');
  const scene = makeScene(CEHP);

  BootScene.prototype.create.call(scene);

  assert.deepEqual(scene.starts, ['Play']);
  assert.equal(scene.images.length, 0);
});

test('ART2 title splash bypasses direct case deep links', () => {
  const { CEHP, BootScene } = loadSplashHarness('?case=CASE-20260420-001-CURIOSITY-R2');
  const scene = makeScene(CEHP);

  BootScene.prototype.create.call(scene);

  assert.deepEqual(scene.starts, ['Play']);
  assert.equal(scene.images.length, 0);
});

test('ART2 game-over splash appears on death and clears after respawn update', () => {
  const { CEHP, PlayScene } = loadSplashHarness('?splash=0');
  const scene = makeScene(CEHP);

  PlayScene.prototype.queueDeath.call(scene, 'pit');

  assert.equal(scene.pendingDeath.source, 'pit');
  assert.equal(scene.images.some((node) => node.key === CEHP.Art.getKey('splash', 'cehp_title_logo.wordmark')), true);
  assert.equal(scene.text.some((node) => node.value === 'RUN ENDED.'), true);
  assert.equal(scene.tweensMade.some((tween) => tween.duration === 250 && tween.alpha === 0.34), true);
  assert.equal(scene.tweensMade.some((tween) => tween.duration === 250 && tween.alpha === 1), true);

  PlayScene.prototype.update.call(scene, 0, 16);

  assert.equal(scene.pendingDeath, null);
  assert.equal(scene.images.every((node) => node.destroyed), true);
});

test('ART3 splash polish honors reduceFlash and reduceShake assist flags', () => {
  const { CEHP } = loadSplashHarness('');
  const scene = makeScene(CEHP);
  scene._assistMode = { reduceFlash: true, reduceShake: true };

  CEHP.Splash.showTitle(scene);

  assert.equal(scene.tweensMade.some((tween) => tween.alpha != null), false);
  assert.equal(scene.tweensMade.some((tween) => tween.angle === 0.6 && tween.duration === 3000), true);
});
