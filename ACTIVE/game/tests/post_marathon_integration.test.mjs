import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve('/Users/tkevinbigham/Projects/CEHP');
const gameDir = path.join(rootDir, 'ACTIVE/game');
const srcDir = path.join(gameDir, 'src');
const replayDir = path.join(gameDir, '_canon/replays/cehp');
const indexPath = path.join(gameDir, 'index.html');
const reportPath = path.join(rootDir, 'ACTIVE/docs/W15_MARATHON_REPORT.md');
const manifestPath = path.join(gameDir, 'process_manifest.json');
const verifyLaunchPath = path.join(gameDir, 'scripts/verify-launch.sh');

const W15_MODULES = [
  '63_post_boss_framework.js',
  '64_post_boss_supervisor.js',
  '65_post_boss_enrollment.js',
  '66_post_boss_logistics.js',
  '42_parallax.js',
  '67_post_enemy_locust.js',
  '68_post_setpiece_trust_fall.js',
  '69_post_setpiece_open_concept.js',
  '6A_post_setpiece_supply_chain.js',
  '74_world_orientation_runtime.js',
  '75_world_benefits_runtime.js',
  '76_world_rasta_runtime.js'
];

const W15_FIXTURES = [
  'w1_orientation_supervisor.json',
  'w1_orientation_supervisor_chaos_receipt.json',
  'w1_orientation_trust_fall.json',
  'w1_orientation_trust_declined.json',
  'w1_orientation_supervisor_trust_receipt.json',
  'w2_benefits_enrollment.json',
  'w2_benefits_open_concept.json',
  'w2_benefits_enrollment_open_concept_receipt.json',
  'w2_benefits_uninsured_open_concept_receipt.json',
  'w3_rasta_logistics.json',
  'w3_rasta_locust.json',
  'w3_rasta_supply_chain.json',
  'w3_rasta_logistics_supply_chain_receipt.json',
  'w_meta_run_complete_orientation.json',
  'w_meta_run_complete_benefits.json',
  'w_meta_run_complete_rasta.json'
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function moduleBanner(file) {
  return '/* MODULE: ' + file.toUpperCase() + ' */';
}

test('W15 marathon modules are present in source and shipped artifact', () => {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  W15_MODULES.forEach((file) => {
    assert.equal(fs.existsSync(path.join(srcDir, file)), true, `${file} exists in src`);
    assert.equal(indexHtml.includes(moduleBanner(file)), true, `${file} is bundled into index.html`);
  });
});

test('W15 replay corpus includes boss, setpiece, and combined receipt edges', () => {
  const fixtures = fs.readdirSync(replayDir).filter((file) => /\.json$/.test(file)).sort();

  assert.equal(fixtures.length, 30);
  W15_FIXTURES.forEach((file) => {
    assert.equal(fixtures.includes(file), true, `${file} is committed`);
    assert.equal(fs.existsSync(path.join(replayDir, file)), true, `${file} exists on disk`);
  });

  assert.equal(readJson(path.join(replayDir, 'w1_orientation_trust_declined.json')).expected_debug.receipt_flags.trustFallDeclined, true);
  assert.equal(readJson(path.join(replayDir, 'w2_benefits_enrollment_open_concept_receipt.json')).expected_debug.receipt_flags.openConceptNavigated, true);
  assert.equal(readJson(path.join(replayDir, 'w2_benefits_uninsured_open_concept_receipt.json')).expected_debug.receipt_flags.uninsuredVeteran, true);
  assert.equal(readJson(path.join(replayDir, 'w3_rasta_logistics_supply_chain_receipt.json')).expected_debug.receipt_flags.supplyChainRouted, true);
});

test('W15 bundle cap and marathon report match the built artifact', () => {
  const manifest = readJson(manifestPath);
  const verifyLaunch = fs.readFileSync(verifyLaunchPath, 'utf8');
  const report = fs.readFileSync(reportPath, 'utf8');
  const bytes = fs.statSync(indexPath).size;

  assert.equal(manifest.shipArtifact.maxBytes, 491520);
  assert.equal(verifyLaunch.includes('Bundle bytes: $bytes / 491520'), true);
  assert.ok(bytes <= manifest.shipArtifact.maxBytes, `${bytes} <= ${manifest.shipArtifact.maxBytes}`);
  assert.match(report, new RegExp(`Bundle bytes: ${bytes} / ${manifest.shipArtifact.maxBytes}`));
  assert.equal(report.includes('Replay corpus: 30/30'), true);
  assert.match(report, /Do not push from P10/);
});
