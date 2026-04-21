import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const baseUrl = process.env.CEHP_BASE_URL || 'http://127.0.0.1:4175';
const benefitsSeed = 'CASE-20260427-001-COMPLIANCE-R2';
const rastaSeed = 'CASE-20260504-001-GRACE-R2';
const docketDate = new Date(Date.UTC(2026, 3, 20));

const gameDir = '/Users/tkevinbigham/Projects/CEHP/ACTIVE/game';
const srcDir = path.join(gameDir, 'src');

function buildSandbox() {
  const store = {};
  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    location: { search: '' },
    localStorage: {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
      },
      setItem(key, value) {
        store[key] = String(value);
      },
      removeItem(key) {
        delete store[key];
      }
    }
  };
  sandbox.window = sandbox;
  sandbox.document = {
    readyState: 'loading',
    getElementById() {
      return null;
    }
  };
  vm.createContext(sandbox);
  return sandbox;
}

function loadCEHPLogic() {
  const files = [
    '00_index.js',
    '01_const.js',
    '02_rng.js',
    '03_events.js',
    '04_save.js',
    '05_caseseed.js',
    '10_axes.js',
    '11_metrics.js',
    '70_worlds.js',
    '71_world_orientation.js',
    '72_world_benefits.js',
    '73_world_rasta.js',
    '80_receipts.js',
    '81_docket.js'
  ];
  const sandbox = buildSandbox();
  const source = files.map((file) => fs.readFileSync(path.join(srcDir, file), 'utf8')).join('\n');
  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

const docketLogic = loadCEHPLogic();
const docketInfo = docketLogic.Docket.weekInfo(docketDate);
const docketSeed = docketLogic.Docket.seedForWeek(docketInfo.year, docketInfo.isoWeek).seed;

function countWorldLines(fragmentIds, worldKey) {
  return fragmentIds.filter((id) => new RegExp(worldKey, 'i').test(id)).length;
}

function stableWorldStats(stats) {
  return {
    premiumsCollected: stats && stats.premiumsCollected,
    premiumRoomsCleared: stats && stats.premiumRoomsCleared,
    deductibleHits: stats && stats.deductibleHits,
    jumpPenalty: stats && stats.jumpPenalty
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function stableRastaWorldStats(stats) {
  return {
    syncMoments: stats && stats.syncMoments,
    restOpens: stats && stats.restOpens,
    rushRebounds: stats && stats.rushRebounds,
    sortingRedirects: stats && stats.sortingRedirects
  };
}

async function ensureServer() {
  const target = new URL(baseUrl);
  const origin = `${target.protocol}//${target.hostname}:${target.port}`;

  try {
    const response = await fetch(`${origin}/index.html`);
    if (response.ok) return null;
  } catch (error) {}

  const child = spawn('python3', ['-m', 'http.server', target.port || '4175', '--bind', target.hostname], {
    cwd: '/Users/tkevinbigham/Projects/CEHP/ACTIVE/game',
    stdio: 'ignore'
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return child;
}

async function runStyle(browser, world, seed, style, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const params = [
    `world=${encodeURIComponent(world)}`,
    `case=${encodeURIComponent(seed)}`
  ];
  if (options.thermal) params.push('thermal=1');
  await page.goto(`${baseUrl.replace(/\/$/, '')}/index.html?${params.join('&')}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    return !!(
      window.CEHP &&
      window.CEHP.Debug &&
      typeof window.CEHP.Debug.runStyle === 'function'
    );
  }, { timeout: 10000 });
  if (options.docketDate) {
    await page.evaluate((isoString) => {
      window.CEHP.Docket._now = function() {
        return new Date(isoString);
      };
    }, options.docketDate.toISOString());
  }
  const summary = await page.evaluate((payload) => {
    var result = window.CEHP.Debug.runStyle(payload.style);
    if (payload.includeArchive) {
      result.docketArchive = window.CEHP.Docket.loadArchive();
    }
    return result;
  }, { style, includeArchive: !!options.includeArchive });
  await context.close();
  return summary;
}

let browser;
let server;

try {
  server = await ensureServer();
  browser = await chromium.launch({ headless: true });
  const insuredA = await runStyle(browser, 'benefits', benefitsSeed, 'insured');
  const insuredB = await runStyle(browser, 'benefits', benefitsSeed, 'insured');
  const insuredThermal = await runStyle(browser, 'benefits', benefitsSeed, 'insured', { thermal: true });
  const uninsured = await runStyle(browser, 'benefits', benefitsSeed, 'uninsured');
  const docketRun = await runStyle(browser, 'orientation', docketSeed, 'obedient', {
    docketDate,
    includeArchive: true
  });
  const ambientA = await runStyle(browser, 'rasta', rastaSeed, 'ambient');
  const ambientB = await runStyle(browser, 'rasta', rastaSeed, 'ambient');
  const impatient = await runStyle(browser, 'rasta', rastaSeed, 'impatient');

  assert(JSON.stringify(insuredA.receipt.lines) === JSON.stringify(insuredB.receipt.lines), 'same seed/style should produce identical receipt lines');
  assert(JSON.stringify(insuredA.receipt.fragmentIds) === JSON.stringify(insuredB.receipt.fragmentIds), 'same seed/style should produce identical fragment ids');
  assert(JSON.stringify(insuredA.frames) === JSON.stringify(insuredB.frames), 'same seed/style should produce identical ghost frames');
  assert(JSON.stringify(insuredA.axes.primary) === JSON.stringify(insuredB.axes.primary), 'same seed/style should produce identical axis snapshot');
  assert(JSON.stringify(insuredA.roomOrder) === JSON.stringify(insuredB.roomOrder), 'same seed/style should produce identical room order');
  assert(JSON.stringify(stableWorldStats(insuredA.worldStats)) === JSON.stringify(stableWorldStats(insuredB.worldStats)), 'same seed/style should produce identical world stats');
  assert(JSON.stringify(insuredA.receipt.lines) === JSON.stringify(insuredThermal.receipt.lines), 'thermal mode should not change receipt lines');
  assert(JSON.stringify(insuredA.receipt.fragmentIds) === JSON.stringify(insuredThermal.receipt.fragmentIds), 'thermal mode should not change fragment ids');

  assert(JSON.stringify(insuredA.receipt.fragmentIds) !== JSON.stringify(uninsured.receipt.fragmentIds), 'different playstyles should change fragment ids');
  assert(insuredA.worldId === 'benefits', `expected insured world benefits, got ${insuredA.worldId}`);
  assert(uninsured.worldId === 'benefits', `expected uninsured world benefits, got ${uninsured.worldId}`);
  assert(JSON.stringify(insuredA.roomOrder) === JSON.stringify([
    'enrollment-intake',
    'premium-pathways',
    'network-validation',
    'deductible-adjustment',
    'wellness-incentive',
    'final-processing'
  ]), `unexpected insured room order: ${JSON.stringify(insuredA.roomOrder)}`);
  assert(JSON.stringify(uninsured.roomOrder) === JSON.stringify([
    'enrollment-intake',
    'premium-pathways',
    'network-validation',
    'deductible-adjustment',
    'wellness-incentive',
    'final-processing'
  ]), `unexpected uninsured room order: ${JSON.stringify(uninsured.roomOrder)}`);
  assert(insuredA.receiptFlags && insuredA.receiptFlags.premiumSecured === true, `expected insured premiumSecured true, got ${JSON.stringify(insuredA.receiptFlags)}`);
  assert(insuredA.receiptFlags && insuredA.receiptFlags.uninsuredVeteran === false, `expected insured uninsuredVeteran false, got ${JSON.stringify(insuredA.receiptFlags)}`);
  assert(uninsured.receiptFlags && uninsured.receiptFlags.uninsuredVeteran === true, `expected uninsured uninsuredVeteran true, got ${JSON.stringify(uninsured.receiptFlags)}`);
  assert((insuredA.worldStats && insuredA.worldStats.jumpPenalty) <= 48, `insured jump penalty exceeded cap: ${JSON.stringify(insuredA.worldStats)}`);
  assert((uninsured.worldStats && uninsured.worldStats.jumpPenalty) <= 48, `uninsured jump penalty exceeded cap: ${JSON.stringify(uninsured.worldStats)}`);
  assert(countWorldLines(insuredA.receipt.fragmentIds, 'BENEFITS') >= 2, `expected insured receipt to lean World 2, got ${insuredA.receipt.fragmentIds.join(', ')}`);
  assert(countWorldLines(uninsured.receipt.fragmentIds, 'BENEFITS') >= 2, `expected uninsured receipt to lean World 2, got ${uninsured.receipt.fragmentIds.join(', ')}`);

  assert(docketRun.worldId === 'orientation', `expected docket world orientation, got ${docketRun.worldId}`);
  assert(docketRun.receipt && docketRun.receipt.seed === docketSeed, `expected docket seed ${docketSeed}, got ${JSON.stringify(docketRun.receipt)}`);
  assert(docketRun.docketArchive && Array.isArray(docketRun.docketArchive.weeks), `expected docket archive payload, got ${JSON.stringify(docketRun.docketArchive)}`);
  assert(docketRun.docketArchive.weeks.length >= 1, `expected docket week entry, got ${JSON.stringify(docketRun.docketArchive)}`);
  assert(docketRun.docketArchive.weeks[0].seed === docketSeed, `expected docket archive seed ${docketSeed}, got ${JSON.stringify(docketRun.docketArchive.weeks[0])}`);
  assert(docketRun.docketArchive.weeks[0].receipts.length >= 1, `expected docket receipt archive entry, got ${JSON.stringify(docketRun.docketArchive.weeks[0])}`);

  assert(JSON.stringify(ambientA.receipt.lines) === JSON.stringify(ambientB.receipt.lines), 'same rasta seed/style should produce identical receipt lines');
  assert(JSON.stringify(ambientA.receipt.fragmentIds) === JSON.stringify(ambientB.receipt.fragmentIds), 'same rasta seed/style should produce identical fragment ids');
  assert(JSON.stringify(ambientA.frames) === JSON.stringify(ambientB.frames), 'same rasta seed/style should produce identical ghost frames');
  assert(JSON.stringify(ambientA.axes.primary) === JSON.stringify(ambientB.axes.primary), 'same rasta seed/style should produce identical axis snapshot');
  assert(JSON.stringify(ambientA.roomOrder) === JSON.stringify(ambientB.roomOrder), 'same rasta seed/style should produce identical room order');
  assert(JSON.stringify(stableRastaWorldStats(ambientA.worldStats)) === JSON.stringify(stableRastaWorldStats(ambientB.worldStats)), 'same rasta seed/style should produce identical world stats');

  assert(JSON.stringify(ambientA.receipt.fragmentIds) !== JSON.stringify(impatient.receipt.fragmentIds), 'different rasta playstyles should change fragment ids');
  assert(ambientA.worldId === 'rasta', `expected ambient world rasta, got ${ambientA.worldId}`);
  assert(impatient.worldId === 'rasta', `expected impatient world rasta, got ${impatient.worldId}`);
  assert(JSON.stringify(ambientA.roomOrder) === JSON.stringify([
    'receiving-dock',
    'sync-belt',
    'rest-landing',
    'sorting-floor',
    'humming-mezzanine',
    'warm-exit'
  ]), `unexpected ambient room order: ${JSON.stringify(ambientA.roomOrder)}`);
  assert(JSON.stringify(impatient.roomOrder) === JSON.stringify([
    'receiving-dock',
    'sync-belt',
    'rest-landing',
    'sorting-floor',
    'humming-mezzanine',
    'warm-exit'
  ]), `unexpected impatient room order: ${JSON.stringify(impatient.roomOrder)}`);
  assert(ambientA.receipt && ambientA.receipt.cigaretteLit === false, `expected ambient cigaretteLit false, got ${JSON.stringify(ambientA.receipt)}`);
  assert(impatient.receipt && impatient.receipt.cigaretteLit === false, `expected impatient cigaretteLit false, got ${JSON.stringify(impatient.receipt)}`);
  assert(ambientA.receiptFlags && ambientA.receiptFlags.restOpened === true, `expected ambient restOpened true, got ${JSON.stringify(ambientA.receiptFlags)}`);
  assert(ambientA.receiptFlags && ambientA.receiptFlags.rushedRest === false, `expected ambient rushedRest false, got ${JSON.stringify(ambientA.receiptFlags)}`);
  assert(impatient.receiptFlags && impatient.receiptFlags.rushedRest === true, `expected impatient rushedRest true, got ${JSON.stringify(impatient.receiptFlags)}`);
  assert((ambientA.worldStats && ambientA.worldStats.restOpens) >= 1, `expected ambient rest opens, got ${JSON.stringify(ambientA.worldStats)}`);
  assert((ambientA.worldStats && ambientA.worldStats.syncMoments) >= 3, `expected ambient sync moments, got ${JSON.stringify(ambientA.worldStats)}`);
  assert((impatient.worldStats && impatient.worldStats.rushRebounds) >= 1, `expected impatient rush rebound, got ${JSON.stringify(impatient.worldStats)}`);
  assert((impatient.worldStats && impatient.worldStats.sortingRedirects) >= 2, `expected impatient sorting redirects, got ${JSON.stringify(impatient.worldStats)}`);
  assert(countWorldLines(ambientA.receipt.fragmentIds, 'RASTA') >= 2, `expected ambient receipt to lean World 3, got ${ambientA.receipt.fragmentIds.join(', ')}`);
  assert(countWorldLines(impatient.receipt.fragmentIds, 'RASTA') >= 2, `expected impatient receipt to lean World 3, got ${impatient.receipt.fragmentIds.join(', ')}`);

  console.log('CEHP rebuild case-run tests passed.');
  console.log(`- insured receipt: ${insuredA.receipt.lines.join(' | ')}`);
  console.log(`- uninsured receipt: ${uninsured.receipt.lines.join(' | ')}`);
  console.log(`- ambient receipt: ${ambientA.receipt.lines.join(' | ')}`);
  console.log(`- impatient receipt: ${impatient.receipt.lines.join(' | ')}`);
} finally {
  if (browser) await browser.close();
  if (server) server.kill('SIGTERM');
}
