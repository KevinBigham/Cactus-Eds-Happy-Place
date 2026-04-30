import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const manifestPath = path.join(gameDir, 'assets/art/art_manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.png') return 'image/png';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  return 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let requestUrl;
      let pathname;
      let filePath;

      try {
        requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
        pathname = decodeURIComponent(requestUrl.pathname || '/');
      } catch (error) {
        res.writeHead(400);
        res.end('bad request');
        return;
      }

      if (pathname === '/') pathname = '/index.html';
      filePath = path.normalize(path.join(gameDir, pathname));
      if (filePath.indexOf(gameDir + path.sep) !== 0) {
        res.writeHead(403);
        res.end('forbidden');
        return;
      }

      fs.stat(filePath, (statErr, stat) => {
        if (statErr || !stat.isFile()) {
          res.writeHead(404);
          res.end('not found');
          return;
        }
        res.writeHead(200, { 'content-type': contentType(filePath) });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, baseUrl: 'http://127.0.0.1:' + address.port });
    });
  });
}

function relevantConsoleMessage(message) {
  const type = message.type();
  const text = message.text();
  if (type !== 'error' && type !== 'warning') return false;
  if (/AudioContext was not allowed to start/i.test(text)) return false;
  if (/favicon\.ico/i.test(text)) return false;
  if (type === 'error') return true;
  return /asset|texture|missing|not found|404|failed to load resource/i.test(text);
}

test('ART2 cold boot loads every manifest image into Phaser textures', async (t) => {
  assert.equal(manifest.assets.length, 37, 'manifest asset count stays pinned');

  const { server, baseUrl } = await startServer();
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();
  const consoleFindings = [];
  const failedArtRequests = [];

  page.on('console', (message) => {
    if (relevantConsoleMessage(message)) {
      consoleFindings.push(message.type() + ': ' + message.text());
    }
  });
  page.on('requestfailed', (request) => {
    if (/\/assets\/art\//.test(request.url())) {
      failedArtRequests.push('failed ' + request.url());
    }
  });
  page.on('response', (response) => {
    if (/\/assets\/art\//.test(response.url()) && response.status() >= 400) {
      failedArtRequests.push(response.status() + ' ' + response.url());
    }
  });

  await page.goto(baseUrl + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    return !!(
      window.CEHP &&
      window.CEHP._game &&
      window.CEHP.Art &&
      window.CEHP.Art.allAssets &&
      window.CEHP.Art.allAssets().length === 37
    );
  }, { timeout: 10000 });
  await page.waitForFunction(() => {
    var game = window.CEHP._game;
    var assets = window.CEHP.Art.allAssets();
    var i;
    if (!game || !game.textures || !game.textures.exists) return false;
    for (i = 0; i < assets.length; i++) {
      if (!game.textures.exists(assets[i].key)) return false;
    }
    return true;
  }, { timeout: 20000 });
  await page.waitForTimeout(250);

  const result = await page.evaluate(() => {
    var game = window.CEHP._game;
    var assets = window.CEHP.Art.allAssets();
    var missing = [];
    var i;
    for (i = 0; i < assets.length; i++) {
      if (!game.textures.exists(assets[i].key)) missing.push(assets[i].key);
    }
    return {
      assetCount: assets.length,
      missing,
      hasTitleSplash: !!(game.scene.scenes[0] && game.scene.scenes[0]._cehpArt2TitleSplash),
      activeScenes: game.scene.scenes.filter(function(scene) {
        return scene.scene.isActive();
      }).map(function(scene) {
        return scene.scene.key;
      })
    };
  });

  await context.close();

  assert.equal(result.assetCount, 37, 'runtime Art namespace exposes every manifest entry');
  assert.deepEqual(result.missing, [], 'every manifest key exists in Phaser texture cache');
  assert.equal(result.hasTitleSplash, true, 'cold boot used the ART2 title-splash path');
  assert.deepEqual(failedArtRequests, [], 'no art asset requests failed');
  assert.deepEqual(consoleFindings, [], 'no missing-asset console warnings surfaced');
});
