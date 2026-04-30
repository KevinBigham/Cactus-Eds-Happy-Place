import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');

const BOSS_ART_MODULES = [
  '00_index.js',
  '1A_asset_loader.js',
  '66A_post_boss_art.js'
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

function makeSprite() {
  return {
    textureKey: '',
    displayWidth: 92,
    displayHeight: 118,
    setTexture(key) {
      this.textureKey = key;
      return this;
    },
    setDisplaySize(w, h) {
      this.displayWidth = w;
      this.displayHeight = h;
      return this;
    }
  };
}

function makeBoss(CEHP, id) {
  const keys = new Set(CEHP.Art.allAssets().map(function(asset) { return asset.key; }));
  return {
    id,
    defeated: false,
    scene: {
      textures: {
        exists(key) {
          return keys.has(key);
        }
      }
    },
    sprite: makeSprite()
  };
}

test('ART2 boss art maps each boss state to manifest sprite keys', () => {
  const CEHP = loadModules(BOSS_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());

  assert.equal(CEHP.bosses.artKeyFor('supervisor', 'idle'), CEHP.Art.getKey('bosses', 'supervisor.idle'));
  assert.equal(CEHP.bosses.artKeyFor('enrollment', 'telegraph'), CEHP.Art.getKey('bosses', 'enrollment_officer.telegraph'));
  assert.equal(CEHP.bosses.artKeyFor('logistics', 'defeated'), CEHP.Art.getKey('bosses', 'logistics_foreman.defeated'));
});

test('ART2 boss art updates an existing boss sprite without changing boss state', () => {
  const CEHP = loadModules(BOSS_ART_MODULES);
  CEHP.Art.registerManifest(readManifest());
  const boss = makeBoss(CEHP, 'supervisor');

  CEHP.bosses.applyArtSprite(boss, { state: 'idle' });
  assert.equal(boss.sprite.textureKey, CEHP.Art.getKey('bosses', 'supervisor.idle'));
  assert.equal(boss.defeated, false);

  CEHP.bosses.applyArtSprite(boss, { state: 'telegraph' });
  assert.equal(boss.sprite.textureKey, CEHP.Art.getKey('bosses', 'supervisor.telegraph'));

  boss.defeated = true;
  CEHP.bosses.applyArtSprite(boss, { state: 'strike' });
  assert.equal(boss.sprite.textureKey, CEHP.Art.getKey('bosses', 'supervisor.defeated'));
});
