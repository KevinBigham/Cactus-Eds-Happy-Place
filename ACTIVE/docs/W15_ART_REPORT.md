# W15 Art Report

Date: 2026-04-30
Branch: `post-launch/w15-art`
Status: Builder complete through ART-P8; do not push until Kevin reviews and authorizes.

## Scope

W15M-ART1 produced the first hero-art wave only. No runtime source, Phaser loader, generated `index.html`, build script, save schema, launch-freeze doc, or launch tag was modified. The new images live under `ACTIVE/game/assets/art/` and are tracked by `ACTIVE/game/assets/art/art_manifest.json`.

Generation note: local deterministic raster generation was used so the assets could be committed as real PNG files in this environment. The manifest records SHA-256 hashes for the packet-style prompts used to drive each asset brief.

## Style Anchor

The art direction is DKC-inspired pre-rendered chunkiness applied to CEHP's bureaucratic horror: toy-like silhouettes, hard overhead fluorescent lighting, heavy ambient-occlusion reads, manila paper surfaces, cold cyan spill, bureau navy shadows, and blood-orange warning accents. The assets keep the new hero-art wave separate from existing wired runtime art in `ACTIVE/game/art/`.

## Image Inventory

### ART-P1 — Cactus Ed Hero Art (6)

- `characters/cactus_ed_idle_01.png`
- `characters/cactus_ed_walk_keypose_01.png`
- `characters/cactus_ed_jump_apex_01.png`
- `characters/cactus_ed_kick_01.png`
- `characters/cactus_ed_hit_01.png`
- `characters/cactus_ed_victory_01.png`

### ART-P2 — Mini-Boss Hero Art (9)

- `bosses/supervisor_idle_01.png`
- `bosses/supervisor_telegraph_01.png`
- `bosses/supervisor_defeated_01.png`
- `bosses/enrollment_officer_idle_01.png`
- `bosses/enrollment_officer_telegraph_01.png`
- `bosses/enrollment_officer_defeated_01.png`
- `bosses/logistics_foreman_idle_01.png`
- `bosses/logistics_foreman_telegraph_01.png`
- `bosses/logistics_foreman_defeated_01.png`

### ART-P3 — Enemy Art (4)

- `enemies/locust_swarm_01.png`
- `enemies/locust_single_01.png`
- `enemies/orientation_clipboard_imp_01.png`
- `enemies/benefits_premium_pigeon_01.png`

### ART-P4 — Setpiece Backdrops (3)

- `setpieces/trust_fall_01.png`
- `setpieces/open_concept_01.png`
- `setpieces/supply_chain_01.png`

### ART-P5 — World Parallax Layers (9)

- `environments/orientation_far_01.png`
- `environments/orientation_mid_01.png`
- `environments/orientation_near_01.png`
- `environments/benefits_far_01.png`
- `environments/benefits_mid_01.png`
- `environments/benefits_near_01.png`
- `environments/rasta_far_01.png`
- `environments/rasta_mid_01.png`
- `environments/rasta_near_01.png`

### ART-P6 — UI / Receipt Visual Treatment (4)

- `ui/receipt_frame_thermal_01.png`
- `ui/receipt_frame_normal_01.png`
- `ui/fragment_band_decoration_01.png`
- `ui/case_seed_chip_01.png`

### ART-P7 — Title Splash (2)

- `splash/cehp_title_logo_01.png`
- `splash/cehp_title_background_01.png`

## Needs Revisit

None hit the regeneration cap. Before runtime integration, Kevin/Claude should art-direct the committed first-wave plates for style strength and decide whether any specific asset needs a higher-fidelity external paintover.

## Final Byte Report

- Bundle bytes before marathon: `445184 / 491520`
- Bundle bytes after ART-P8 verification: `445184 / 491520`
- Bundle impact: unchanged
- Runtime module count: unchanged
- Save schema impact: none

## Verification

Commands run:

```bash
node --test ACTIVE/game/tests/post_art_manifest.test.mjs
bash ACTIVE/game/scripts/verify-launch.sh
wc -c ACTIVE/game/index.html
find ACTIVE/game/assets/art -name "*.png" | wc -l
node -e "const m = require('./ACTIVE/game/assets/art/art_manifest.json'); if (m.assets.length !== 37) process.exit(1); console.log('manifest OK ' + m.assets.length + ' assets');"
```

Observed final signals:

- `post_art_manifest.test.mjs`: 2/2 pass
- `CEHP LAUNCH VERIFY: PASS`
- `wc -c ACTIVE/game/index.html`: `445184`
- PNG count: `37`
- Manifest validation: `manifest OK 37 assets`

## Handoff

- Do not push from this phase.
- Kevin reviews the branch and authorizes the final push.
- Future wiring marathon should consume `art_manifest.json`, not scan arbitrary folders.
- Existing wired runtime art remains under `ACTIVE/game/art/`; this branch intentionally leaves those loaders untouched.
