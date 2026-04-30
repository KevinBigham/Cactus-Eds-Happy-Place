import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const artDir = path.join(gameDir, 'assets/art');
const manifestPath = path.join(artDir, 'art_manifest.json');
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const expectedAssets = [
  ['characters', 'characters/cactus_ed_idle_01.png', [1024, 1024]],
  ['characters', 'characters/cactus_ed_walk_keypose_01.png', [1024, 1024]],
  ['characters', 'characters/cactus_ed_jump_apex_01.png', [1024, 1024]],
  ['characters', 'characters/cactus_ed_kick_01.png', [1024, 1024]],
  ['characters', 'characters/cactus_ed_hit_01.png', [1024, 1024]],
  ['characters', 'characters/cactus_ed_victory_01.png', [1024, 1024]],
  ['bosses', 'bosses/supervisor_idle_01.png', [1024, 1024]],
  ['bosses', 'bosses/supervisor_telegraph_01.png', [1024, 1024]],
  ['bosses', 'bosses/supervisor_defeated_01.png', [1024, 1024]],
  ['bosses', 'bosses/enrollment_officer_idle_01.png', [1024, 1024]],
  ['bosses', 'bosses/enrollment_officer_telegraph_01.png', [1024, 1024]],
  ['bosses', 'bosses/enrollment_officer_defeated_01.png', [1024, 1024]],
  ['bosses', 'bosses/logistics_foreman_idle_01.png', [1024, 1024]],
  ['bosses', 'bosses/logistics_foreman_telegraph_01.png', [1024, 1024]],
  ['bosses', 'bosses/logistics_foreman_defeated_01.png', [1024, 1024]],
  ['enemies', 'enemies/locust_swarm_01.png', [1024, 576]],
  ['enemies', 'enemies/locust_single_01.png', [1024, 1024]],
  ['enemies', 'enemies/orientation_clipboard_imp_01.png', [1024, 1024]],
  ['enemies', 'enemies/benefits_premium_pigeon_01.png', [1024, 1024]],
  ['setpieces', 'setpieces/trust_fall_01.png', [1024, 1024]],
  ['setpieces', 'setpieces/open_concept_01.png', [1024, 576]],
  ['setpieces', 'setpieces/supply_chain_01.png', [1024, 576]],
  ['environments', 'environments/orientation_far_01.png', [1024, 576]],
  ['environments', 'environments/orientation_mid_01.png', [1024, 576]],
  ['environments', 'environments/orientation_near_01.png', [1024, 576]],
  ['environments', 'environments/benefits_far_01.png', [1024, 576]],
  ['environments', 'environments/benefits_mid_01.png', [1024, 576]],
  ['environments', 'environments/benefits_near_01.png', [1024, 576]],
  ['environments', 'environments/rasta_far_01.png', [1024, 576]],
  ['environments', 'environments/rasta_mid_01.png', [1024, 576]],
  ['environments', 'environments/rasta_near_01.png', [1024, 576]],
  ['ui', 'ui/receipt_frame_thermal_01.png', [768, 1024]],
  ['ui', 'ui/receipt_frame_normal_01.png', [768, 1024]],
  ['ui', 'ui/fragment_band_decoration_01.png', [1024, 128]],
  ['ui', 'ui/case_seed_chip_01.png', [512, 256]],
  ['splash', 'splash/cehp_title_logo_01.png', [1024, 512]],
  ['splash', 'splash/cehp_title_background_01.png', [1920, 1080]]
];

const expectedCounts = {
  characters: 6,
  bosses: 9,
  enemies: 4,
  setpieces: 3,
  environments: 9,
  ui: 4,
  splash: 2
};

function readManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function readPngHeader(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, buf.length, 0);
    return {
      magic: buf.subarray(0, 8),
      width: buf.readUInt32BE(16),
      height: buf.readUInt32BE(20)
    };
  } finally {
    fs.closeSync(fd);
  }
}

test('W15 art manifest lists every generated hero-art PNG', () => {
  assert.equal(fs.existsSync(manifestPath), true, 'art_manifest.json exists');

  const manifest = readManifest();
  assert.equal(manifest.schemaVersion, 1, 'manifest schema version is pinned');
  assert.equal(manifest.assets.length, 37, 'manifest has the exact W15M-ART1 asset count');

  const expectedFiles = new Set(expectedAssets.map((asset) => asset[1]));
  const actualFiles = new Set(manifest.assets.map((asset) => asset.file));
  assert.deepEqual(actualFiles, expectedFiles, 'manifest files match the target asset list exactly');

  const counts = {};
  manifest.assets.forEach((asset) => {
    counts[asset.category] = (counts[asset.category] || 0) + 1;
  });
  assert.deepEqual(counts, expectedCounts, 'category counts match the packet contract');
});

test('W15 art manifest entries point at real non-placeholder PNG files', () => {
  const manifest = readManifest();
  const manifestByFile = new Map(manifest.assets.map((asset) => [asset.file, asset]));

  expectedAssets.forEach(([category, file, resolution]) => {
    const manifestEntry = manifestByFile.get(file);
    assert.ok(manifestEntry, `${file} exists in manifest`);
    assert.equal(manifestEntry.category, category, `${file} category is ${category}`);
    assert.deepEqual(manifestEntry.resolution, resolution, `${file} manifest resolution matches packet`);

    const fullPath = path.join(artDir, file);
    assert.equal(fs.existsSync(fullPath), true, `${file} exists on disk`);

    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `${file} is non-empty`);
    assert.ok(stat.size >= 5000, `${file} is not a tiny placeholder (${stat.size} B)`);
    if (stat.size < 10000) {
      console.warn(`[post_art_manifest] ${file} is below 10KB (${stat.size} B)`);
    }

    const header = readPngHeader(fullPath);
    assert.equal(header.magic.compare(pngMagic), 0, `${file} has PNG magic bytes`);
    assert.equal(header.width, resolution[0], `${file} PNG width matches packet`);
    assert.equal(header.height, resolution[1], `${file} PNG height matches packet`);
  });
});
