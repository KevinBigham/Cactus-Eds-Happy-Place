import { chromium } from 'playwright';

const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';
const routes = [
  {
    name: 'title boot',
    path: '/index.html',
    allowedActiveKeys: ['Title', 'Demo'],
    expectedScenes: ['Title', 'Demo', 'World2', 'World3'],
    expectedCertAid: { enabled: false, sceneKey: '', segment: '' },
    expectTitleMenu: true,
    requiresManualFollowup: true
  },
  {
    name: 'world2 cert aid',
    path: '/index.html?certAid=w2',
    allowedActiveKeys: ['World2'],
    expectedScenes: ['Title', 'Demo', 'World2', 'World3'],
    expectedCertAid: { enabled: true, sceneKey: 'World2', segment: 'w2' },
    expectTitleMenu: false
  },
  {
    name: 'world3 cert aid',
    path: '/index.html?certAid=w3',
    allowedActiveKeys: ['World3'],
    expectedScenes: ['Title', 'Demo', 'World2', 'World3'],
    expectedCertAid: { enabled: true, sceneKey: 'World3', segment: 'w3' },
    expectTitleMenu: false
  }
];

const softWarnings = [];

function buildUrl(path) {
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

function isIgnorableConsoleError(message) {
  const location = message.location ? message.location() : { url: '' };
  const text = message.text();
  return /favicon\.ico/i.test(location.url || '') || /Failed to load resource/i.test(text);
}

function formatConsoleMessage(message) {
  const location = message.location ? message.location() : { url: '', lineNumber: 0 };
  const suffix = location.url ? ` @ ${location.url}:${location.lineNumber || 0}` : '';
  return `${message.type()}: ${message.text()}${suffix}`;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function createPageCollectors(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const consoleWarnings = [];

  page.on('console', (message) => {
    const type = message.type();
    if (type === 'error' && !isIgnorableConsoleError(message)) {
      consoleErrors.push(formatConsoleMessage(message));
    } else if (type === 'warning') {
      consoleWarnings.push(formatConsoleMessage(message));
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  return { consoleErrors, pageErrors, consoleWarnings };
}

async function inspectRoute(browser, route) {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 }
  });
  const page = await context.newPage();
  const { consoleErrors, pageErrors, consoleWarnings } = createPageCollectors(page);

  await page.goto(buildUrl(route.path), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    return !!(
      window.GAME_INSTANCE &&
      window.GAME_INSTANCE.scene &&
      window.GAME_INSTANCE.scene.scenes &&
      window.GAME_INSTANCE.scene.scenes.length
    );
  }, { timeout: 10000 });
  await page.waitForTimeout(1500);

  const result = await page.evaluate(() => {
    const game = window.GAME_INSTANCE;
    const sceneStates = game.scene.scenes.map((scene) => ({
      key: scene.scene.key,
      active: scene.scene.isActive(),
      visible: scene.scene.isVisible()
    }));
    const titleScene = game.scene.scenes.find((scene) => scene.scene.key === 'Title');

    return {
      documentTitle: document.title,
      hasCanvas: !!document.querySelector('canvas'),
      activeKeys: sceneStates.filter((scene) => scene.active).map((scene) => scene.key),
      registeredSceneKeys: sceneStates.map((scene) => scene.key),
      certAid: window.CACTUS_ED_CERT_AID || { enabled: false, sceneKey: '', segment: '' },
      titleMenuLabels: titleScene && titleScene._menuItems ? titleScene._menuItems.map((item) => item.label) : []
    };
  });

  await context.close();

  assert(result.documentTitle === "Cactus Ed's Happy Place", `${route.name}: unexpected document title "${result.documentTitle}"`);
  assert(result.hasCanvas, `${route.name}: Phaser canvas did not render`);
  assert(pageErrors.length === 0, `${route.name}: uncaught runtime error(s): ${pageErrors.join(' | ')}`);
  assert(consoleErrors.length === 0, `${route.name}: console error(s): ${consoleErrors.join(' | ')}`);
  assert(result.activeKeys.length > 0, `${route.name}: no active scene detected`);

  for (const sceneKey of route.expectedScenes) {
    assert(
      result.registeredSceneKeys.includes(sceneKey),
      `${route.name}: expected registered scene "${sceneKey}" was missing`
    );
  }

  assert(
    route.allowedActiveKeys.includes(result.activeKeys[0]),
    `${route.name}: active scene "${result.activeKeys[0]}" did not match expected set ${route.allowedActiveKeys.join(', ')}`
  );

  assert(
    result.certAid.enabled === route.expectedCertAid.enabled &&
      result.certAid.sceneKey === route.expectedCertAid.sceneKey &&
      result.certAid.segment === route.expectedCertAid.segment,
    `${route.name}: certification aid state was ${JSON.stringify(result.certAid)}`
  );

  if (route.expectTitleMenu) {
    assert(result.titleMenuLabels.includes('ACHIEVEMENTS'), `${route.name}: achievements menu item was missing`);
  }

  if (route.requiresManualFollowup && result.activeKeys[0] !== 'Title') {
    softWarnings.push(
      `${route.name}: active scene was "${result.activeKeys[0]}"; run a human check on plain /index.html before using the title surface for new features`
    );
  }

  if (consoleWarnings.length > 0) {
    const uniqueWarnings = [...new Set(consoleWarnings)];
    for (const warning of uniqueWarnings) {
      if (!/AudioContext was not allowed to start/i.test(warning)) {
        softWarnings.push(`${route.name}: ${warning}`);
      }
    }
  }

  return result;
}

async function inspectSeededAchievements(browser) {
  const seededSave = {
    world: 3,
    health: 4,
    aloe: 200,
    behavior: { curiosity: 2, compliance: 1 },
    deaths: 12,
    runs: 3,
    bestTime: 175000,
    totalKills: 25,
    assistMode: {}
  };
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 }
  });

  await context.addInitScript((payload) => {
    window.localStorage.clear();
    window.localStorage.setItem('cactusEd_save_v1', JSON.stringify(payload));
  }, seededSave);

  const page = await context.newPage();
  const { consoleErrors, pageErrors } = createPageCollectors(page);

  await page.goto(buildUrl('/index.html'), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    var titleScene = window.GAME_INSTANCE &&
      window.GAME_INSTANCE.scene &&
      window.GAME_INSTANCE.scene.scenes &&
      window.GAME_INSTANCE.scene.scenes.find(function(scene) { return scene.scene.key === 'Title'; });
    return !!(titleScene && titleScene._phase === 1 && titleScene._t > 2200);
  }, { timeout: 10000 });

  const result = await page.evaluate(() => {
    var titleScene = window.GAME_INSTANCE.scene.scenes.find(function(scene) { return scene.scene.key === 'Title'; });
    titleScene._showAchievements = true;
    titleScene._controlsG.clear();
    titleScene._controlsG.fillStyle(0x000000, 0.92);
    titleScene._controlsG.fillRect(0, 0, W, H);
    titleScene._controlsG.setAlpha(1);
    titleScene._achievementTxt.setText(buildTitleAchievementsText(SAVE.load())).setAlpha(1);
    return {
      menuLabels: titleScene._menuItems.map(function(item) { return item.label; }),
      showAchievements: !!titleScene._showAchievements,
      achievementText: titleScene._achievementTxt ? titleScene._achievementTxt.text : ''
    };
  });

  await context.close();

  assert(pageErrors.length === 0, `seeded achievements: uncaught runtime error(s): ${pageErrors.join(' | ')}`);
  assert(consoleErrors.length === 0, `seeded achievements: console error(s): ${consoleErrors.join(' | ')}`);
  assert(result.menuLabels.includes('ACHIEVEMENTS'), 'seeded achievements: achievements menu item missing');
  assert(result.showAchievements, 'seeded achievements: achievements overlay did not open');
  assert(result.achievementText.includes('[FILED] ED\'S WORST DAY'), 'seeded achievements: deaths achievement did not render as unlocked');
  assert(result.achievementText.includes('[FILED] RETURN VISITOR'), 'seeded achievements: runs achievement did not render as unlocked');
  assert(result.achievementText.includes('[FILED] FAST TRACK'), 'seeded achievements: best-time achievement did not render as unlocked');
  assert(result.achievementText.includes('[FILED] SWORN ENEMY'), 'seeded achievements: kill achievement did not render as unlocked');
  assert(result.achievementText.includes('BEST TIME:    02:55'), 'seeded achievements: best time did not format correctly');

  return result;
}

let browser;

try {
  browser = await chromium.launch({ headless: true });
} catch (error) {
  console.error('Unable to launch Chromium for CEHP smoke checks.');
  console.error('Run `npx playwright install chromium` and retry.');
  console.error(error.message);
  process.exit(1);
}

try {
  const summaries = [];
  for (const route of routes) {
    const result = await inspectRoute(browser, route);
    summaries.push(`${route.name}: active=${result.activeKeys[0]} scenes=${result.registeredSceneKeys.join(',')}`);
  }
  const achievementResult = await inspectSeededAchievements(browser);
  summaries.push(`seeded achievements: menu=${achievementResult.menuLabels.join(',')}`);

  console.log('CEHP browser smoke passed.');
  for (const summary of summaries) {
    console.log(`- ${summary}`);
  }
  if (softWarnings.length > 0) {
    console.log('Warnings:');
    for (const warning of softWarnings) {
      console.log(`- ${warning}`);
    }
  }
} finally {
  await browser.close();
}
