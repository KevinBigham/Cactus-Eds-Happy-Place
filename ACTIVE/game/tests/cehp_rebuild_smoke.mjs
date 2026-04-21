import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';
const seed = 'CASE-20260420-001-CURIOSITY-R2';

function buildUrl(pathname) {
  return `${baseUrl.replace(/\/$/, '')}${pathname}`;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isIgnorableConsoleError(message) {
  const text = message.text();
  return /favicon\.ico/i.test(text) || /Failed to load resource/i.test(text);
}

function collect(page) {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !isIgnorableConsoleError(message)) {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return { consoleErrors, pageErrors };
}

let browser;
let server;

async function ensureServer() {
  const target = new URL(baseUrl);
  const origin = `${target.protocol}//${target.hostname}:${target.port}`;

  try {
    const response = await fetch(`${origin}/index.html`);
    if (response.ok) {
      return null;
    }
  } catch (error) {
    /* Fall through and start a temporary local server. */
  }

  const cwd = '/Users/tkevinbigham/Projects/CEHP/ACTIVE/game';
  const child = spawn('python3', ['-m', 'http.server', target.port || '4175', '--bind', target.hostname], {
    cwd,
    stdio: 'ignore'
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return child;
}

try {
  server = await ensureServer();
  browser = await chromium.launch({ headless: true });
} catch (error) {
  console.error('Unable to launch Chromium for rebuild smoke checks.');
  console.error('Run `npx playwright install chromium` and retry.');
  console.error(error.message);
  process.exit(1);
}

try {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 }
  });
  const page = await context.newPage();
  const { consoleErrors, pageErrors } = collect(page);

  await page.goto(buildUrl(`/index.html?case=${encodeURIComponent(seed)}`), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    return !!(
      window.CEHP &&
      window.CEHP._game &&
      window.CEHP._game.scene &&
      window.CEHP._game.scene.scenes &&
      window.CEHP._game.scene.scenes.length
    );
  }, { timeout: 10000 });
  await page.waitForTimeout(1000);

  const summary = await page.evaluate(() => {
    const game = window.CEHP._game;
    const scenes = game.scene.scenes.map((scene) => ({
      key: scene.scene.key,
      active: scene.scene.isActive(),
      visible: scene.scene.isVisible()
    }));
    const active = scenes.filter((scene) => scene.active).map((scene) => scene.key);
    return {
      title: document.title,
      hasCanvas: !!document.querySelector('canvas'),
      scenes,
      active,
      caseSeed: window.CEHP.RunState && window.CEHP.RunState.caseSeed,
      currentRoom: window.CEHP.RunState && window.CEHP.RunState.roomId,
      receiptReady: !!(window.CEHP.RunState && window.CEHP.RunState.receipt)
    };
  });

  await context.close();

  assert(summary.title === "Cactus Ed's Happiest Place", `unexpected document title: ${summary.title}`);
  assert(summary.hasCanvas, 'Phaser canvas did not render');
  assert(pageErrors.length === 0, `uncaught runtime errors: ${pageErrors.join(' | ')}`);
  assert(consoleErrors.length === 0, `console errors: ${consoleErrors.join(' | ')}`);

  const registered = summary.scenes.map((scene) => scene.key);
  ['Boot', 'Play', 'Overlay', 'Receipt'].forEach((key) => {
    assert(registered.includes(key), `missing scene: ${key}`);
  });
  assert(summary.active.includes('Play'), `expected Play to be active, got ${summary.active.join(', ')}`);
  assert(summary.caseSeed === seed, `expected case seed ${seed}, got ${summary.caseSeed}`);
  assert(summary.currentRoom === 'intake', `expected intake, got ${summary.currentRoom}`);

  console.log('CEHP rebuild smoke passed.');
  console.log(`- active scenes: ${summary.active.join(', ')}`);
  console.log(`- case seed: ${summary.caseSeed}`);

  const docketContext = await browser.newContext({
    viewport: { width: 1400, height: 1000 }
  });
  const docketPage = await docketContext.newPage();
  const docketSignals = collect(docketPage);

  await docketPage.goto(buildUrl('/index.html?docket=1&thermal=1'), { waitUntil: 'domcontentloaded' });
  await docketPage.waitForFunction(() => {
    const root = document.getElementById('cehp-docket');
    return !!(root && root.classList.contains('on'));
  }, { timeout: 10000 });

  const docketSummary = await docketPage.evaluate(() => {
    const root = document.getElementById('cehp-docket');
    return {
      hasCanvas: !!root.querySelector('canvas'),
      hasSeedLink: !!root.querySelector('a[href*="?case="]'),
      heading: root.querySelector('h2') ? root.querySelector('h2').textContent : '',
      text: root.textContent
    };
  });

  await docketContext.close();

  assert(docketSignals.pageErrors.length === 0, `docket page errors: ${docketSignals.pageErrors.join(' | ')}`);
  assert(docketSignals.consoleErrors.length === 0, `docket console errors: ${docketSignals.consoleErrors.join(' | ')}`);
  assert(docketSummary.hasCanvas, 'docket surface did not render a receipt canvas');
  assert(docketSummary.hasSeedLink, 'docket surface missing play link');
  assert(/THE DOCKET/i.test(docketSummary.heading), `unexpected docket heading: ${docketSummary.heading}`);
} finally {
  await browser.close();
  if (server) {
    server.kill('SIGTERM');
  }
}
