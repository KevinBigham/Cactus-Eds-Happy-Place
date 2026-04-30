import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

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

function makeModel() {
  return {
    seed: 'CASE-RECEIPT-REVEAL',
    thermal: false,
    worldId: 'orientation',
    worldLabel: 'ORIENTATION',
    playUrl: 'https://counterfeit-educational.org/',
    lines: ['VERDICT LINE.', 'TENSION LINE.', 'CLOSER LINE.'],
    fragmentIds: ['A', 'B', 'C'],
    tensions: { obedience: 0, style: 0, auditRisk: 0 },
    footer: 'RETURN WITH A CASE.',
    theme: {
      mode: 'normal',
      paper: '#ffffff',
      band: '#eeeeee',
      ink: '#111111',
      subInk: '#333333',
      frame: '#dddddd',
      panel: '#f8f4e8',
      shadow: '#aaaaaa',
      divider: '#999999',
      noiseAlpha: 0,
      jitter: 0
    }
  };
}

function makeScene(assist) {
  const rectangles = [];
  const tweens = [];
  return {
    _assistMode: assist || {},
    rectangles,
    tweensMade: tweens,
    add: {
      rectangle(x, y, width, height, color, alpha) {
        const rect = {
          x,
          y,
          width,
          height,
          color,
          alpha,
          destroyed: false,
          setDepth(value) {
            this.depth = value;
            return this;
          },
          setScrollFactor(value) {
            this.scrollFactor = value;
            return this;
          },
          destroy() {
            this.destroyed = true;
          }
        };
        rectangles.push(rect);
        return rect;
      }
    },
    tweens: {
      add(config) {
        tweens.push(config);
        return config;
      }
    }
  };
}

test('ART3 receipt reveal staggers verdict tension and closer covers', () => {
  const CEHP = loadModules(['00_index.js', '83_receipt_render.js']);
  const scene = makeScene({});
  const image = { x: 240, y: 210, displayWidth: 286, displayHeight: 358, depth: 10 };

  CEHP.ReceiptRender.reveal(scene, image, makeModel(), { width: 286, height: 358 });

  assert.equal(scene.rectangles.length, 3);
  assert.deepEqual(scene.tweensMade.map((tween) => tween.delay), [0, 60, 120]);
  assert.equal(scene.tweensMade.every((tween) => tween.duration === 140), true);
  assert.equal(scene.rectangles[0].y < scene.rectangles[1].y, true);
  assert.equal(scene.rectangles[1].y < scene.rectangles[2].y, true);

  scene.tweensMade.forEach((tween) => tween.onComplete(null, [tween.targets]));
  assert.equal(scene.rectangles.every((rect) => rect.destroyed), true);
});

test('ART3 receipt reveal skips staggered covers when reduceFlash is active', () => {
  const CEHP = loadModules(['00_index.js', '83_receipt_render.js']);
  const scene = makeScene({ reduceFlash: true });
  const image = { x: 240, y: 210, displayWidth: 286, displayHeight: 358, depth: 10 };

  CEHP.ReceiptRender.reveal(scene, image, makeModel(), { width: 286, height: 358 });

  assert.equal(scene.rectangles.length, 0);
  assert.equal(scene.tweensMade.length, 0);
});

test('ART3 receipt render stores reveal metadata without changing final text', () => {
  const CEHP = loadModules(['00_index.js', '83_receipt_render.js']);
  const calls = { text: [] };
  const canvas = {
    width: 1080,
    height: 1350,
    getContext() {
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
        fillText(text) {
          calls.text.push(text);
        },
        drawImage() {}
      };
    }
  };

  const rendered = CEHP.ReceiptRender.render(makeModel(), {
    createCanvas() {
      return canvas;
    }
  });

  assert.equal(rendered._cehpReceiptReveal.receipt.lines.length, 3);
  assert.equal(calls.text.includes('VERDICT LINE.'), true);
  assert.equal(calls.text.includes('TENSION LINE.'), true);
  assert.equal(calls.text.includes('CLOSER LINE.'), true);
});
