# W9 Retrospective

Date: 2026-04-23
Session: `CEHP-W9-SPRINT-READABILITY-AND-ART-2026-04-23`

## Verdict

W9 closed locally green.

The sprint hit all four requested phases in order:
- Phase 1: regenerate `screen_unmasked_reveal.png`
- Phase 2: audit and correct PNG typos
- Phase 3: restore authored readability
- Phase 4: wire the remaining art assets with fallback preserved

Full verify matrix passed at sprint close:
- `node build.js` → `Built 40 modules -> index.html (287826 bytes)`
- `wc -c ACTIVE/game/index.html` → `287838`
- `node scripts/check_save_schema.js` → pass
- `node scripts/verify_art_assets.mjs` → `32/32 expected assets OK`
- `node --test tests/rebuild_logic.test.mjs` → `45/45`
- autoplay `orientation` / `benefits` / `rasta` → all `determinism: MATCH` + `OK`

## Phase Ledger

### Phase 1 — Reveal regen

- Backed up the rejected reveal to `ACTIVE/game/art/_originals/screen_unmasked_reveal.pre-w9-2026-04-23.png`.
- Regenerated `ACTIVE/game/art/screen_unmasked_reveal.png` from Kevin's revised prompt.
- Resized to `512x256`.
- Final size: `224.0 KB`.
- Kevin approved the replacement before the sprint continued.

### Phase 2 — Typo audit

Doctrine applied:
- `COUNTEREEIT` remains canonical only on the seal and the `paper_expired_id` callback.
- `paper_hr_memo.png` remains correct as-is per Kevin.

Regenerated typo-bearing PNGs:
- `ui_locker.png`
- `crest_orientation_bureau.png`
- `crest_benefits_enrollment.png`
- `env_w2_benefits_enrollment.png`

Representative fixes:
- `BURRAU` → `BUREAU`
- `ENROLMENT` → `ENROLLMENT`
- locker sticker restored from garble to readable English

All originals were backed up into `ACTIVE/game/art/_originals/`.

### Phase 3 — Readability restoration

Restored authored source in:
- `ACTIVE/game/src/52_curiosity.js`
- `ACTIVE/game/src/83_receipt_render.js`
- `ACTIVE/game/src/89_ed_perform.js`
- `ACTIVE/game/src/8A_air.js`

Build readability restored in:
- `ACTIVE/game/build.js`

What changed in the build:
- long-form module banners are back in `index.html`
- duplicate source header comments are stripped from the bundle
- bundle-only indentation is normalized so shipped bytes stay low while `src/` stays readable

Regression lock added:
- `build.js restores long-form bundle module banners in index.html`

### Phase 4 — Art integration

Wired assets and surfaces:
- `supervisor_silhouette.png` → W1 final-certification background plate
- `carpet_tile_seamless.png` → W1/W2 floor dressing
- `fluorescent_light_fixture.png` → W1/W2 ceiling fixtures
- `paper_safety_poster.png` → W1/W2 office wall prop
- `paper_expired_id.png` → W1/W2 office wall prop
- `prop_filing_cabinet.png` → W1/W2 office backdrop prop
- `prop_coffee_cup.png` → W1/W2 office backdrop prop
- `prop_archive_box.png` → W3 receiving/logistics dressing
- `prop_stamp_pad.png` → trampoline overlay
- `enemy_compliance_auditor.png` → `scantron` skin
- `enemy_deadline_wraith.png` → `deductibleWeight` skin
- `enemy_telegraph_windup.png` → generic windup overlay, runtime-sliced from 512x233 into 171/170/171 px frames

Fallback contract:
- every new runtime art use is guarded by texture existence checks
- no new art is required for the game to remain playable
- procedural rectangles, labels, and collision surfaces stay intact underneath the art overlays

## Test Additions

New W9 tests in `ACTIVE/game/tests/rebuild_logic.test.mjs`:
- optional Track A preload is non-thermal only
- trampoline keeps procedural fallback when `prop_stamp_pad` is absent
- enemy art attachment does not change telegraph timing state
- `enemy_telegraph_windup` slices exact thirds from a 512x233 source at runtime

## Byte Math

Pre-W9 baseline from prior build:
- `292499` reported bytes

Observed during W9:
- post-Phase-3 build: `290106`
- first post-Phase-4 build: `301030` (over ceiling)
- final post-Phase-4 build after bundle-only whitespace normalization: `287826`

Final runway:
- `300000 - 287826 = 12174` bytes

Sprint estimate said W9 would end with roughly `3271` bytes of runway.
Actual result was much better because the build-only banner/header/indent normalization reclaimed far more than the raw source growth consumed.

## Files Touched

PNG assets regenerated:
- `ACTIVE/game/art/screen_unmasked_reveal.png`
- `ACTIVE/game/art/ui_locker.png`
- `ACTIVE/game/art/crest_orientation_bureau.png`
- `ACTIVE/game/art/crest_benefits_enrollment.png`
- `ACTIVE/game/art/env_w2_benefits_enrollment.png`

Runtime / tests / tooling:
- `ACTIVE/game/build.js`
- `ACTIVE/game/scripts/verify_art_assets.mjs`
- `ACTIVE/game/src/50_forms.js`
- `ACTIVE/game/src/52_curiosity.js`
- `ACTIVE/game/src/60_enemies.js`
- `ACTIVE/game/src/74_world_orientation_runtime.js`
- `ACTIVE/game/src/75_world_benefits_runtime.js`
- `ACTIVE/game/src/76_world_rasta_runtime.js`
- `ACTIVE/game/src/83_receipt_render.js`
- `ACTIVE/game/src/89_ed_perform.js`
- `ACTIVE/game/src/8A_air.js`
- `ACTIVE/game/src/91_scenes.js`
- `ACTIVE/game/tests/rebuild_logic.test.mjs`

Docs / memory:
- `.codex/CEHP/status.md`
- `.codex/CEHP/handoff.md`
- `.codex/CEHP/changelog.md`
- `ACTIVE/docs/PROPOSED_NEXT_TASK.md`

## Open Human Gates

- Kevin visual pass on the in-world art placements
- Kevin confirmation that the corrected typo set is final canon
- Kevin decision on whether there is a small W10 polish pass or W9 is accepted as-is

## Non-Changes

- No save-schema changes
- No `JUMP_VELOCITY` / `GRAVITY` mutation
- No new scenes
- No push to `main`
- `cactus_ed_in_game_sprite.png` remains on HOLD

---

## Reviewer Sign-Off (Claude Code Sonnet 4.6, 2026-04-23)

**Verdict: GREEN.** Reviewer-independent verification re-ran the full matrix and swept sacred constraints across every touched file.

### Independent verify matrix (fresh run)

- `node build.js` → `Built 40 modules -> index.html (287826 bytes)` — byte-exact with retrospective claim.
- `wc -c index.html` → `287838` — 12 byte UTF-16→UTF-8 delta as documented; **12,162 B runway** under the 300 KB ceiling.
- `node scripts/check_save_schema.js` → `Rebuild save schema (v2 + archaeological v1) checks passed.`
- `node scripts/verify_art_assets.mjs` → `32/32 expected assets OK`.
- `node --test tests/rebuild_logic.test.mjs` → `tests 45 · pass 45 · fail 0`.

### Autoplay determinism (reading `output/autoplay/*2026-04-23T12-28-17*.json`)

| World | `determinism.status` | `passed` | Deterministic topics |
|---|---|---|---|
| orientation | `MATCH` | `true` | sign:peek, curiosity:reward, movement:jump, module:passed, contradiction:defy |
| benefits | `MATCH` | `true` | sign:peek, curiosity:reward, form:used, movement:jump, module:passed, player:death, player:respawn |
| rasta | `MATCH` | `true` | movement:jump |

All three worlds deterministic under the shared `AUTOPLAY-W2-R1` seed. (The rasta topic set is thinner than W1/W2 — this is a property of the harness at current authored density, not a W9 regression.)

### Sacred-constraint sweep (ripgrep across `src/`)

- `Math.random` across `src/**` → only `02_rng.js:1` comment warning "NEVER Math.random()" — zero live uses.
- `=>` / `\blet\s` / `\bconst\s` / template literals across the four un-minified modules (`52_curiosity.js`, `83_receipt_render.js`, `89_ed_perform.js`, `8A_air.js`) → **zero matches in all four**. Track B restored authored readability without breaking ES5 discipline.
- `JUMP_VELOCITY\s*=` and `TUNING\.GRAVITY\s*=` across `src/**` → zero matches anywhere. Run-scoped `ed.jumpVelocity` mutation seam still the only jump-tuning path.
- Doctrine scrub on `verify_art_assets.mjs` → the only remaining `CANONICAL` annotation is on `seal_counterfeit_educational_org.png` for the whitelisted `COUNTEREEIT`; the prior "garbled locker sticker CANONICAL" language is gone.

### Readability spot-check on the un-minified sources

Reviewer read the first ~40 lines of `52_curiosity.js`, `89_ed_perform.js`, and `8A_air.js` — all three now carry `'use strict'`, full identifier names, structural comments, and per-field indentation. The W7-era 19/20-line dense forms are fully gone from these modules. This is exactly the authored-readability contract Track B set out to restore.

### Tone discipline check on the art wire-in

Every Phase 4 wire-in is gated by `scene.textures.exists(...)` with procedural rectangles/labels/collision surfaces intact underneath — confirmed against retrospective checklist and against the new test coverage for optional preload / trampoline fallback / enemy-art timing parity / telegraph strip slicing. No "juicy" tween layer introduced on the overlay path; ADD/multiply blends stay consistent with W7 LensKit + LightKit discipline.

### Byte-budget judgment

Sprint estimate called for ~3,271 B runway at close. Actual runway is **12,162 B** — ~8.9 KB better than projected. The delta traces to `build.js` bundle-only whitespace normalization + stripped per-file header duplication recouping more than raw source expansion consumed. This is the healthiest pre-W10 state the build has ever sat in under the 300 KB ceiling. **No ceiling raise needed; no further optimization requested.**

### Remaining human gates (same as retrospective lists)

1. Kevin visual pass on the in-world art placements (W1 supervisor silhouette, W1/W2 carpet + fluorescents + office props, W3 archive-box + stamp-pad trampoline, benefits enemy skins + telegraph windup).
2. Kevin confirmation that the corrected typo set is final canon (`ui_locker`, `crest_orientation_bureau`, `crest_benefits_enrollment`, `env_w2_benefits_enrollment`).
3. Kevin decision: `ACCEPT AS-IS`, `SMALL POLISH PASS`, or `REJECT ONE OR MORE PLACEMENTS`.

Reviewer recommends `ACCEPT AS-IS` absent a specific placement note — all numeric gates clear, sacred constraints hold, determinism matches, and the authored-readability contract is fully restored.
