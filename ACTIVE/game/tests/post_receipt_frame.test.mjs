import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');

const RECEIPT_FRAME_MODULES = [
  '00_index.js',
  '1A_asset_loader.js',
  '83_receipt_render.js'
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

function makeContext(calls) {
  return {
    fillStyle: '',
    strokeStyle: '',
    globalAlpha: 1,
    font: '',
    save() {},
    restore() {},
    fillRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    measureText(text) {
      return { width: String(text || '').length * 16 };
    },
    fillText(text, x, y) {
      calls.text.push({ text, x, y });
    },
    drawImage(source) {
      calls.images.push(source.key);
    }
  };
}

function makeCanvas(calls) {
  return {
    width: 1080,
    height: 1350,
    getContext() {
      return makeContext(calls);
    }
  };
}

function installTextures(CEHP) {
  const sources = {};
  CEHP.Art.allAssets().forEach(function(asset) {
    sources[asset.key] = {
      key: asset.key,
      width: asset.resolution[0],
      height: asset.resolution[1]
    };
  });
  CEHP._game = {
    textures: {
      exists(key) {
        return Boolean(sources[key]);
      },
      get(key) {
        return {
          getSourceImage() {
            return sources[key];
          }
        };
      }
    }
  };
}

function model(thermal) {
  return {
    seed: 'CASE-RECEIPT-FRAME',
    thermal,
    worldId: 'orientation',
    worldLabel: 'ORIENTATION',
    playUrl: 'https://counterfeit-educational.org/',
    lines: ['THE FRAME WATCHED QUIETLY.'],
    fragmentIds: ['TEST_FRAME'],
    tensions: { obedience: 0, style: 0, auditRisk: 0 },
    footer: 'RETURN WITH A CASE.',
    theme: {
      mode: thermal ? 'thermal' : 'normal',
      paper: '#ffffff',
      band: '#eeeeee',
      ink: '#111111',
      subInk: '#333333',
      frame: '#dddddd',
      panel: '#f8f8f8',
      shadow: '#aaaaaa',
      divider: '#999999',
      noiseAlpha: 0,
      jitter: 0
    }
  };
}

test('ART2 receipt renderer draws normal manifest frame assets around existing text', () => {
  const CEHP = loadModules(RECEIPT_FRAME_MODULES);
  CEHP.Art.registerManifest(readManifest());
  installTextures(CEHP);
  const calls = { images: [], text: [] };

  CEHP.ReceiptRender.render(model(false), {
    createCanvas() {
      return makeCanvas(calls);
    }
  });

  assert.equal(calls.images.includes(CEHP.Art.getKey('ui', 'receipt_frame.normal')), true);
  assert.equal(calls.images.includes(CEHP.Art.getKey('ui', 'fragment_band_decoration.normal')), true);
  assert.equal(calls.images.includes(CEHP.Art.getKey('ui', 'case_seed_chip.normal')), true);
  assert.equal(calls.text.some((entry) => entry.text === 'THE FRAME WATCHED QUIETLY.'), true);
});

test('ART2 receipt renderer uses the thermal frame for thermal receipts', () => {
  const CEHP = loadModules(RECEIPT_FRAME_MODULES);
  CEHP.Art.registerManifest(readManifest());
  installTextures(CEHP);
  const calls = { images: [], text: [] };

  CEHP.ReceiptRender.render(model(true), {
    createCanvas() {
      return makeCanvas(calls);
    }
  });

  assert.equal(calls.images.includes(CEHP.Art.getKey('ui', 'receipt_frame.thermal')), true);
  assert.equal(calls.images.includes(CEHP.Art.getKey('ui', 'receipt_frame.normal')), false);
});
