import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';

var require = createRequire(import.meta.url);
var botPath = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/discord/bot.js');
var bot = require(botPath);

test('parseArgs rejects missing values for valued flags', function() {
  assert.throws(function() {
    bot.parseArgs(['node', 'bot.js', '--render']);
  }, /Missing value for --render/);
});

test('loadCanvas falls back to @napi-rs/canvas when canvas is unavailable', function() {
  var calls = [];
  var fakeCanvas = { createCanvas: function() {} };
  var loaded = bot.loadCanvas(function(name) {
    calls.push(name);
    if (name === 'canvas') {
      throw new Error('missing canvas');
    }
    if (name === '@napi-rs/canvas') {
      return fakeCanvas;
    }
    throw new Error('unexpected module ' + name);
  });

  assert.equal(loaded, fakeCanvas);
  assert.deepEqual(calls, ['canvas', '@napi-rs/canvas']);
});

test('renderReceipt rejects invalid CASE seeds', function() {
  assert.throws(function() {
    bot.renderReceipt('NOT-A-SEED', '/Users/tkevinbigham/Projects/CEHP/ACTIVE/discord/output/bad.png', 'orientation', false, {
      Canvas: { createCanvas: function() { return {}; } },
      CEHP: {
        CaseSeed: { parse: function() { return null; } },
        Receipts: { generate: function() { throw new Error('should not render'); } }
      },
      fs: {
        mkdirSync: function() {},
        writeFileSync: function() {}
      }
    });
  }, /Invalid CASE seed/);
});

test('renderReceipt rejects output paths outside the repo root', function() {
  assert.throws(function() {
    bot.renderReceipt('CASE-20260420-001-CURIOSITY-R2', '/tmp/outside.png', 'orientation', false, {
      Canvas: { createCanvas: function() { return {}; } },
      CEHP: {
        CaseSeed: { parse: function(seed) { return { raw: seed, axis: 'CURIOSITY' }; } },
        Receipts: { generate: function() { return { seed: 'CASE-20260420-001-CURIOSITY-R2', lines: [], fragmentIds: [] }; }, playUrlForSeed: function() { return 'https://counterfeit-educational.org/?case=CASE-20260420-001-CURIOSITY-R2'; } },
        ReceiptRender: { render: function() { return { toBuffer: function() { return Buffer.from('png'); } }; } }
      },
      fs: {
        mkdirSync: function() {},
        writeFileSync: function() {}
      }
    });
  }, /Output path must stay within/);
});

test('renderReceipt wraps disk write failures with the target path', function() {
  assert.throws(function() {
    bot.renderReceipt('CASE-20260420-001-CURIOSITY-R2', '/Users/tkevinbigham/Projects/CEHP/ACTIVE/discord/output/fail.png', 'orientation', false, {
      Canvas: { createCanvas: function() { return {}; } },
      CEHP: {
        CaseSeed: { parse: function(seed) { return { raw: seed, axis: 'CURIOSITY' }; } },
        Receipts: {
          generate: function() { return { seed: 'CASE-20260420-001-CURIOSITY-R2', lines: ['A', 'B', 'C'], fragmentIds: [] }; },
          playUrlForSeed: function() { return 'https://counterfeit-educational.org/?case=CASE-20260420-001-CURIOSITY-R2'; }
        },
        ReceiptRender: {
          render: function() {
            return { toBuffer: function() { return Buffer.from('png'); } };
          }
        }
      },
      fs: {
        mkdirSync: function() {},
        writeFileSync: function() {
          throw new Error('disk full');
        }
      }
    });
  }, /Unable to write receipt PNG to .*fail\.png: disk full/);
});
