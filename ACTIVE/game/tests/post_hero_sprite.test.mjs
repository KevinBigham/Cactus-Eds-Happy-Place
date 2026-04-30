import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');

const HERO_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '1A_asset_loader.js',
  '89_ed_perform.js'
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
    return fs.readFileSync(path.join(srcDir, file), 'utf8');
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
    textureKey: key,
    active: true,
    visible: true,
    scaleX: 1,
    scaleY: 1,
    setOrigin() { return this; },
    setDepth(value) { this.depth = value; return this; },
    setTint(value) { this.tint = value; return this; },
    setAlpha(value) { this.alpha = value; return this; },
    setTexture(value) { this.textureKey = value; return this; },
    setFrame(value) { this.frame = value; return this; },
    destroy() { this.destroyed = true; }
  };
}

function makeScene(CEHP) {
  const artKeys = new Set(CEHP.Art.allAssets().map(function(asset) { return asset.key; }));
  const scene = {
    images: [],
    rectangles: [],
    events: {
      once() {}
    },
    textures: {
      exists(key) {
        return artKeys.has(key);
      },
      remove() {}
    },
    add: {
      graphics() {
        return {
          fillStyle() {},
          fillRect() {},
          generateTexture() {},
          destroy() {}
        };
      },
      image(x, y, key) {
        const node = makeNode('image', key);
        node.x = x;
        node.y = y;
        scene.images.push(node);
        return node;
      },
      rectangle(x, y, w, h, color, alpha) {
        const node = makeNode('rectangle', '');
        node.x = x;
        node.y = y;
        node.width = w;
        node.height = h;
        node.fillColor = color;
        node.alpha = alpha;
        scene.rectangles.push(node);
        return node;
      },
      container(x, y, children) {
        const node = makeNode('container', '');
        node.scene = scene;
        node.x = x;
        node.y = y;
        node.children = children;
        node.facing = 1;
        node.setSize = function(w, h) {
          this.width = w;
          this.height = h;
          return this;
        };
        return node;
      }
    },
    physics: {
      add: {
        existing(actor) {
          actor.body = {
            drag: { x: 0 },
            maxVelocity: { x: 400, y: 900 },
            velocity: { x: 0, y: 0 },
            blocked: { down: true },
            touching: { down: true },
            setCollideWorldBounds() {},
            setDragX(value) { this.drag.x = value; },
            setMaxVelocity(x, y) {
              this.maxVelocity.x = x;
              this.maxVelocity.y = y;
            },
            setVelocity(x, y) {
              this.velocity.x = x;
              this.velocity.y = y;
            },
            setSize(w, h) {
              this.width = w;
              this.height = h;
            }
          };
        }
      }
    },
    tweens: {
      add() {
        return {
          pause() {},
          resume() {},
          stop() {},
          remove() {}
        };
      },
      killTweensOf() {}
    }
  };
  return scene;
}

function installMovementStub(CEHP) {
  CEHP.Movement = {
    createEd(scene, x, y) {
      return {
        scene,
        x,
        y,
        active: true,
        depth: 7,
        facing: 1,
        body: {
          drag: { x: 11 },
          maxVelocity: { x: 444, y: 888 },
          velocity: { x: 12, y: 0 }
        },
        destroy() {
          this.destroyed = true;
        }
      };
    }
  };
}

test('ART2 hero sprite mapping resolves Ed states to manifest assets', () => {
  const CEHP = loadModules(HERO_MODULES);
  CEHP.Art.registerManifest(readManifest());

  assert.equal(CEHP.Ed.heroArtNameForState({ _cehpState: { current: 'idle' } }), 'cactus_ed.idle');
  assert.equal(CEHP.Ed.heroArtNameForState({ _cehpState: { current: 'run' } }), 'cactus_ed.walk_keypose');
  assert.equal(CEHP.Ed.heroArtNameForState({ _cehpState: { current: 'jumpFall' } }), 'cactus_ed.jump_apex');
  assert.equal(CEHP.Ed.heroArtNameForState({ _cehpState: { current: 'melee' } }), 'cactus_ed.kick');
  assert.equal(CEHP.Ed.heroArtNameForState({ _cehpState: { current: 'iFrameHurt' } }), 'cactus_ed.hit');
});

test('ART2 hero render uses manifest sprites without replacing the physics actor', () => {
  const CEHP = loadModules(HERO_MODULES);
  CEHP.Art.registerManifest(readManifest());
  installMovementStub(CEHP);

  const scene = makeScene(CEHP);
  CEHP.Ed.prime(scene, { seed: 'CASE-HERO-SPRITE' });
  const actor = CEHP.Movement.createEd(scene, 72, 96);

  assert.equal(actor.x, 72);
  assert.equal(actor.y, 96);
  assert.equal(actor._cehpHeroArt, true);
  assert.equal(actor._cehpBodyImage.textureKey, CEHP.Art.getKey('characters', 'cactus_ed.idle'));
  assert.equal(actor.body.maxVelocity.x, 444);
  assert.equal(actor.body.maxVelocity.y, 888);

  actor._cehpState = { current: 'run' };
  actor.body.velocity.x = 120;
  CEHP.Ed.update(scene, 16);

  assert.equal(actor._cehpBodyImage.textureKey, CEHP.Art.getKey('characters', 'cactus_ed.walk_keypose'));
});
