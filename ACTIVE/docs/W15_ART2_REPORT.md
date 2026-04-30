# W15 ART2 Report

Date: 2026-04-30
Branch: `post-launch/w15-art`
Status: ART2 Phaser asset wiring complete locally. Do not push until Kevin authorizes.

## Scope

W15M-ART2 wires the 37 immutable ART1 manifest entries into the Phaser runtime and swaps visual primitives to manifest-driven sprites. The PNG files and `ACTIVE/game/assets/art/art_manifest.json` were not edited; the manifest remains the only source of texture keys and paths.

Gameplay state is unchanged. Hitboxes, movement, boss logic, enemy state, setpiece flags, receipt scoring, save schema, replay fixtures, process cap, and launch verification scripts were left intact.

## Phase Commits

- `W15M-ART2-P1`: Asset loader module + namespace contract.
- `W15M-ART2-P2`: Hero sprite render swap.
- `W15M-ART2-P3`: Boss sprite render swap (Supervisor + Enrollment + Logistics).
- `W15M-ART2-P4`: Enemy sprite render swap.
- `W15M-ART2-P5`: Setpiece backdrop render swap.
- `W15M-ART2-P6`: Parallax plate layering for all three worlds.
- `W15M-ART2-P7`: Receipt UI frame overlay.
- `W15M-ART2-P8`: Title and game-over splash screens.
- `W15M-ART2-P9`: ART2 verify gate and final report.

## Runtime Wiring

- `ACTIVE/game/src/1A_asset_loader.js` registers `CEHP.Art`, preloads `art_manifest.json`, queues every manifest image with `scene.load.image(key, path)`, and exposes `getKey`, `getPath`, `getAsset`, `allAssets`, `preloadAll`, and `withPreloadHook`.
- `ACTIVE/game/src/89_ed_perform.js` uses manifest hero sprites for idle, walk, jump, fall, land, and hurt presentation while preserving the physics actor.
- `ACTIVE/game/src/66A_post_boss_art.js` maps Supervisor, Enrollment Officer, and Logistics Foreman runtime boss states to the 9 boss plates.
- `ACTIVE/game/src/67_post_enemy_locust_art.js` maps the four enemy visuals, including Reply-All Locust, to manifest sprites while leaving collision rectangles live.
- `ACTIVE/game/src/6B_post_setpiece_art.js` adds manifest backdrops for Trust Fall, Open Concept, and Supply Chain setpieces.
- `ACTIVE/game/src/42_parallax.js` now exposes `CEHP.Parallax.loadWorldPlates(worldId)` and layers the 9 world plates over the existing deterministic parallax system.
- `ACTIVE/game/src/83_receipt_render.js` wraps receipt canvases with normal/thermal frame art, fragment band decoration, and case-seed chip art without moving text or changing scoring.
- `ACTIVE/game/src/91_scenes_splash_art.js` adds title and game-over splash art. Cold boot waits for player input; `?splash=0`, `?thermal=1`, and `?case=` automation/deep links bypass the title gate.

## Test Coverage

- `ACTIVE/game/tests/post_asset_loader.test.mjs`
- `ACTIVE/game/tests/post_hero_sprite.test.mjs`
- `ACTIVE/game/tests/post_boss_art.test.mjs`
- `ACTIVE/game/tests/post_enemy_art.test.mjs`
- `ACTIVE/game/tests/post_setpiece_art.test.mjs`
- `ACTIVE/game/tests/post_parallax_assets.test.mjs`
- `ACTIVE/game/tests/post_receipt_frame.test.mjs`
- `ACTIVE/game/tests/post_splash_art.test.mjs`
- `ACTIVE/game/tests/post_art_runtime_smoke.test.mjs`
- `ACTIVE/game/tests/index.js` keeps the packet-required `node --test ACTIVE/game/tests/` entrypoint wired to the launch gate.

## Final Byte Report

- ART1 head bundle: `445184 / 491520`
- ART2 final bundle: `474656 / 491520`
- Runtime delta from ART1 head: `+29472`
- Runtime modules: `65`
- Save schema impact: none.

## Verification

Observed final ART2 gate:

```bash
bash ACTIVE/game/scripts/verify-launch.sh
node --test ACTIVE/game/tests/
node ACTIVE/game/build.js && wc -c < ACTIVE/game/index.html
node ACTIVE/game/scripts/audit_fragments.mjs
```

Observed final signals:

- `CEHP LAUNCH VERIFY: PASS`
- Post-launch oracle: `136/136`
- Replay corpus: `SUMMARY PASS 30/30`
- Directory test entrypoint: PASS (`node --test ACTIVE/game/tests/`)
- Bundle bytes: `474656 / 491520`
- Fragment audit: `418 fragments`, `0 voice violations`, `0 duplicate IDs`
- Runtime asset smoke: cold boot loaded all `37` manifest textures into Phaser with no failed `/assets/art/` responses and no missing-asset console warnings.

## Handoff

- Do not push from this marathon; Kevin specified local commits only.
- Kevin can overwrite any placeholder PNG under `ACTIVE/game/assets/art/` without code changes as long as `art_manifest.json` remains stable.
- Reviewer should run the four-command final ART2 gate above from a clean shell.
- Known risk: ART2 validates wiring and load success, not final art direction. Kevin's paintover/style pass remains separate.
