#!/usr/bin/env node
//
// verify_art_assets.mjs
//
// Verifies the canonical PNG assets at ACTIVE/game/art/ are present,
// valid PNGs (magic bytes), and sized within sane bounds. Warns on unexpected
// PNGs (likely new Codex image generations) without failing.
//
// Does NOT run the game or check runtime fallback — autoplay.mjs covers that.
// This is a cheap pre-flight for CI / reviewer passes.
//
// Usage:   node ACTIVE/game/scripts/verify_art_assets.mjs
// Exit 0 = all expected assets pass; Exit 1 = any expected asset fails.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var ART_DIR = path.resolve(__dirname, '..', 'art');

// Expected assets — roles drive documentation, NOT wire-in logic.
// Size bounds are deliberately wide (20 KB - 600 KB) to tolerate re-optimization
// passes. If an asset is re-regenerated and its size drifts out of range, that
// likely means canonical typography was lost. Only COUNTEREEIT survives as a
// typo whitelist item, and only on the seal / expired-ID callback.
var MIN_BYTES = 20000;
var MAX_BYTES = 600000;

var EXPECTED_ASSETS = [
  // --- BATCH 1: Original 12 (2026-04-22 art pipeline milestone) ---
  { file: 'cactus_ed_brand_mascot.png',             role: 'brand_mascot (cheerful, marketing/title)' },
  { file: 'ed_sheet_60px.png',                      role: 'W10 Phase 6 Ed runtime sheet (48x64x30 frames)', minBytes: 1, maxBytes: 12288 },
  { file: 'crest_benefits_enrollment.png',          role: 'W2 receipt watermark (wired 2026-04-22)' },
  { file: 'crest_orientation_bureau.png',           role: 'W1 receipt watermark (wired 2026-04-22)' },
  { file: 'logo_rasta_corp.png',                    role: 'W3 receipt watermark (wired 2026-04-22)' },
  { file: 'seal_counterfeit_educational_org.png',   role: 'always-on receipt seal (COUNTEREEIT typo CANONICAL, wired 2026-04-22)' },
  { file: 'title_cold_open.png',                    role: 'BootScene splash fallback (wired 2026-04-22)' },
  // --- BATCH 2 TIER 1 MUST (2026-04-22 Codex v2 — high-leverage thesis/environment) ---
  { file: 'coworker_mascot_variants.png',           role: 'W1 tableau decorative NPCs (wired — Kevin approved variants)' },
  { file: 'env_w1_orientation_bureau.png',          role: 'W1 BootScene per-world splash (wired 2026-04-22)' },
  { file: 'env_w2_benefits_enrollment.png',         role: 'W2 BootScene per-world splash (wired 2026-04-22)' },
  { file: 'env_w3_rasta_corp.png',                  role: 'W3 BootScene per-world splash (wired 2026-04-22)' },
  { file: 'screen_end_of_shift.png',                role: 'ShiftEnd beat 2 frame (wired 2026-04-22)' },
  { file: 'screen_unmasked_reveal.png',             role: 'ShiftEnd beat 1 reveal (regenerated + approved 2026-04-23)' },
  { file: 'supervisor_silhouette.png',              role: 'W1 final-certification background plate (wired 2026-04-23)' },
  // --- BATCH 2 TIER 2 SHOULD (2026-04-22 Codex v2 — atmospheric/encounter) ---
  { file: 'carpet_tile_seamless.png',               role: 'W1/W2 floor tile dressing (wired 2026-04-23)' },
  { file: 'enemy_compliance_auditor.png',           role: 'benefits scantron enemy skin (wired 2026-04-23)' },
  { file: 'enemy_deadline_wraith.png',              role: 'benefits deductible enemy skin (wired 2026-04-23)' },
  { file: 'paper_safety_poster.png',                role: 'W1/W2 office backdrop prop (wired 2026-04-23)' },
  { file: 'prop_coffee_cup.png',                    role: 'W1/W2 office backdrop prop (wired 2026-04-23)' },
  { file: 'prop_stamp_pad.png',                     role: 'trampoline art overlay (wired 2026-04-23)' },
  // --- BATCH 2 TIER 3 COULD (2026-04-22 Codex v2 — stretch assets) ---
  { file: 'enemy_telegraph_windup.png',             role: 'enemy windup overlay strip (wired 2026-04-23)' },
  { file: 'fluorescent_light_fixture.png',          role: 'W1/W2 ceiling fixture dressing (wired 2026-04-23)' },
  { file: 'paper_expired_id.png',                   role: 'W1/W2 office backdrop prop with COUNTEREEIT callback (wired 2026-04-23)' },
  { file: 'prop_archive_box.png',                   role: 'W3 logistics dressing (wired 2026-04-23)' },
  { file: 'prop_filing_cabinet.png',                role: 'W1/W2 office backdrop prop (wired 2026-04-23)' }
];

// PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
var PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

function checkAsset(asset) {
  var fullPath = path.join(ART_DIR, asset.file);
  var minBytes = asset.minBytes == null ? MIN_BYTES : asset.minBytes;
  var maxBytes = asset.maxBytes == null ? MAX_BYTES : asset.maxBytes;
  var result = {
    file: asset.file,
    role: asset.role,
    minBytes: minBytes,
    maxBytes: maxBytes,
    exists: false,
    size: 0,
    sizeOk: false,
    pngMagic: false,
    pass: false,
    err: null
  };

  try {
    var stats = fs.statSync(fullPath);
    result.exists = true;
    result.size = stats.size;
    result.sizeOk = stats.size >= minBytes && stats.size <= maxBytes;

    var buf = Buffer.alloc(8);
    var fd = fs.openSync(fullPath, 'r');
    fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);
    result.pngMagic = buf.equals(PNG_MAGIC);

    result.pass = result.exists && result.sizeOk && result.pngMagic;
  } catch (err) {
    result.err = err.message;
  }

  return result;
}

function findUnexpectedPngs() {
  try {
    var entries = fs.readdirSync(ART_DIR);
    var pngs = entries.filter(function (f) {
      return f.endsWith('.png') && !f.startsWith('_') && !f.startsWith('.');
    });
    var expectedSet = new Set(EXPECTED_ASSETS.map(function (a) { return a.file; }));
    return pngs.filter(function (f) { return !expectedSet.has(f); });
  } catch (err) {
    return [];
  }
}

function formatKb(bytes) {
  if (!bytes) return '    -    ';
  return (bytes / 1024).toFixed(1).padStart(6) + ' KB';
}

function main() {
  console.log('[verify_art_assets] scanning ' + ART_DIR);
  console.log('');

  var results = EXPECTED_ASSETS.map(checkAsset);
  var passed = results.filter(function (r) { return r.pass; });
  var failed = results.filter(function (r) { return !r.pass; });

  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    var status = r.pass ? 'PASS' : 'FAIL';
    console.log('  ' + status + '  ' + r.file.padEnd(42) + '  ' + formatKb(r.size) + '    ' + r.role);
    if (!r.pass) {
      if (!r.exists) {
        console.log('        reason: missing file' + (r.err ? ' (' + r.err + ')' : ''));
      } else if (!r.pngMagic) {
        console.log('        reason: not a valid PNG (magic bytes mismatch)');
      } else if (!r.sizeOk) {
        console.log('        reason: size ' + r.size + ' B out of range [' + r.minBytes + '..' + r.maxBytes + ']');
      }
    }
  }

  var unexpected = findUnexpectedPngs();
  if (unexpected.length > 0) {
    console.log('');
    console.log('[verify_art_assets] unexpected PNGs (NOT in expected set — likely new Codex generations):');
    for (var j = 0; j < unexpected.length; j++) {
      var filePath = path.join(ART_DIR, unexpected[j]);
      var size = 0;
      try { size = fs.statSync(filePath).size; } catch (_) {}
      console.log('  ?     ' + unexpected[j].padEnd(42) + '  ' + formatKb(size) + '    (new — update EXPECTED_ASSETS if intentional)');
    }
  }

  console.log('');
  console.log('[verify_art_assets] ' + passed.length + '/' + EXPECTED_ASSETS.length + ' expected assets OK');
  if (failed.length > 0) {
    console.log('[verify_art_assets] FAIL — ' + failed.length + ' asset(s) failed verification');
    process.exit(1);
  }
  console.log('[verify_art_assets] OK');
}

main();
