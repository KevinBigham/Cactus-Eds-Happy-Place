# CODEBASE AUDIT

> Date: 2026-04-28
> Author: Codex GPT-5.5
> Scope: local workspace `/Users/tkevinbigham/Projects/CEHP`, excluding `node_modules`
> Mode: documentation-only audit; no deletes, moves, runtime edits, or cleanup performed

## Executive Summary

- The current runtime is a 44-module ES5 source tree under `ACTIVE/game/src/`, concatenated by `ACTIVE/game/build.js` into the ship artifact `ACTIVE/game/index.html`.
- Standard verification is green locally after the audit baseline: build, process guard, save schema, art assets, 78 rebuild logic tests, process manifest test, browser smoke, accessibility settings, and case-run receipts all pass.
- The workspace is not currently a Git worktree from this shell (`git status --short` fails with `fatal: not a git repository`). That blocks real git age, diff, snapshot, and commit evidence. Do not run cleanup until the repo is restored as a Git checkout or an equivalent snapshot exists.
- The main cleanup opportunities are generated/mirror artifacts and root hygiene. No runtime source file is currently a safe-delete candidate.
- `ACTIVE/game/output/`, `ACTIVE/delivery/`, and `ACTIVE/discord/output/` contain 317 generated files totaling about 102 MB. `ACTIVE/game/output` alone is about 94 MB.
- Exact duplicate scan found 22 duplicate hash groups covering 68 files, mostly marketing/delivery mirrors and archived legacy runtime backups.
- No file has a filesystem mtime older than six months in this local copy. Git history is unavailable, so this does not prove source freshness.

## Inventory

### Entry Points

- Browser game: `ACTIVE/game/index.html`
  - Generated from `ACTIVE/game/index.template.html` plus `ACTIVE/game/src/*.js`.
  - Playable as a standalone static HTML artifact with Phaser loaded by CDN.
- Source entry sequence: `ACTIVE/game/build.js`
  - Priority loads `00_index.js`, `01_const.js`, `02_rng.js`, `03_events.js`, `04_fixed_step.js`, `04_save.js`, `05_caseseed.js`, `05_input_buffer.js`, `06_cancel_matrix.js`, `07_ed_state.js`, then remaining source files sorted by filename.
- Phaser boot: `ACTIVE/game/src/99_boot.js`
  - Creates the Phaser game from `CEHP.Scenes.list()`.
- Scene definitions: `ACTIVE/game/src/91_scenes.js`
  - Defines Boot, Play, ShiftEnd, Overlay, and Receipt scenes.
- Browser query surfaces:
  - default orientation
  - `?world=benefits`
  - `?world=rasta`
  - `?room=test`
  - `?docket=1`
  - `?settings=1`
  - `?thermal=1`
- Discord sidecar: `ACTIVE/discord/bot.js`
  - Renders receipt PNGs from the shared receipt modules.

### Build Commands

- `cd ACTIVE/game && node build.js`
- Package alias: `cd ACTIVE/game && npm run verify` runs the standard verification wrapper, which rebuilds first.

### Test / Verification Commands

- `cd ACTIVE/game && node scripts/check_save_schema.js`
- `cd ACTIVE/game && node scripts/check_process_manifest.mjs`
- `cd ACTIVE/game && node scripts/verify_art_assets.mjs`
- `cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs`
- `cd ACTIVE/game && node --test tests/process_manifest.test.mjs`
- `cd ACTIVE/game && bash scripts/verify-cehp.sh`
- `cd ACTIVE/game && CEHP_SKIP_AUTOPLAY=1 bash scripts/verify-w10-full.sh`
- `cd ACTIVE/game && bash scripts/verify-w10-full.sh`
- `cd ACTIVE/discord && node --test tests/bot_hardening.test.mjs`
- `cd ACTIVE/discord && node bot.js --render CASE-20260420-001-CURIOSITY-R2`

### Deploy Path

- `.github/workflows/static.yml` uploads `ACTIVE/game` through `actions/upload-pages-artifact@v3`.
- Because the workflow path is `ACTIVE/game`, the deployed Pages root should serve `ACTIVE/game/index.html` as `/index.html`.
- `ACTIVE/game/CNAME` contains the custom-domain configuration for Pages.

### Canonical Files

- Runtime source: `ACTIVE/game/src/*.js`
- Generated ship artifact: `ACTIVE/game/index.html`
- Build template: `ACTIVE/game/index.template.html`
- Build script: `ACTIVE/game/build.js`
- Process guard: `ACTIVE/game/process_manifest.json`
- Game package manifest: `ACTIVE/game/package.json`
- Canonical expected art: `ACTIVE/game/art/*.png` listed in `ACTIVE/game/scripts/verify_art_assets.mjs`
- Discord sidecar: `ACTIVE/discord/bot.js`, `ACTIVE/discord/package.json`, `ACTIVE/discord/package-lock.json`, `ACTIVE/discord/tests/bot_hardening.test.mjs`
- Deploy config: `.github/workflows/static.yml`, `ACTIVE/game/CNAME`
- Active task/doc surfaces: `ACTIVE/docs/NEXT_TASK.md`, `ACTIVE/docs/BACKLOG.md`, `ACTIVE/docs/KNOWN_ISSUES.md`, `ACTIVE/docs/PROPOSED_NEXT_TASK.md`, `ACTIVE/docs/AGENTS.md`
- Durable memory: `.codex/CEHP/status.md`, `.codex/CEHP/handoff.md`, `.codex/CEHP/changelog.md`, `.codex/CEHP/decisions.md`, `.codex/CEHP/open_questions.md`, `.codex/CEHP/plan.md`, `.codex/CEHP/runbook.md`, `.codex/CEHP/agent.md`

### Generated / Mirror / Archive Lanes

- Generated ship artifact:
  - `ACTIVE/game/index.html` is generated but must be kept because it is the deployable runtime.
- Generated evidence/output:
  - `ACTIVE/game/output/autoplay/*.json`
  - `ACTIVE/discord/output/*.png`
  - `ACTIVE/delivery/w5_demo/trailer_frames/**`
  - `ACTIVE/delivery/w10_phase2_checkpoint/**`
  - `ACTIVE/delivery/w6_launch/**`
- Asset originals:
  - `ACTIVE/game/art/_originals/**` is ignored in `.gitignore`, but present locally. It is large source material, not runtime-loaded.
- Marketing mirrors:
  - `ACTIVE/marketing/cr_pitch_v1/**`
  - `ACTIVE/delivery/w5_demo/cr_pitch_v1/**`
  - `ACTIVE/delivery/w5_demo/receipts/**`
- Archive:
  - `ARCHIVE/**` is historical/reference-only unless a task explicitly asks for archaeology.

## Evidence Map

### Build Order

```text
01 00_index.js
02 01_const.js
03 02_rng.js
04 03_events.js
05 04_fixed_step.js
06 04_save.js
07 05_caseseed.js
08 05_input_buffer.js
09 06_cancel_matrix.js
10 07_ed_state.js
11 10_axes.js
12 11_metrics.js
13 20_input.js
14 21_movement.js
15 22_collision.js
16 30_audio.js
17 40_fx.js
18 41_signs.js
19 50_forms.js
20 51_contradiction.js
21 52_curiosity.js
22 60_enemies.js
23 62_director.js
24 70_worlds.js
25 71_world_orientation.js
26 72_world_benefits.js
27 73_world_rasta.js
28 74_world_orientation_runtime.js
29 75_world_benefits_runtime.js
30 76_world_rasta_runtime.js
31 80_receipts.js
32 81_docket.js
33 82_appeals.js
34 83_receipt_render.js
35 85_lens.js
36 86_light.js
37 87_props.js
38 88_feel.js
39 89_ed_perform.js
40 8A_air.js
41 90_ui.js
42 91_scenes.js
43 92_testroom.js
44 99_boot.js
```

### Runtime Dependency Graph

This graph is based on static `CEHP.*` / namespace property references. It is approximate for minified code and dynamic/debug surfaces.

```text
00_index -> (none)
01_const -> (none)
02_rng -> (none)
03_events -> (none)
04_fixed_step -> (none)
04_save -> 00_index, 01_const
05_caseseed -> 00_index
05_input_buffer -> (none)
06_cancel_matrix -> (none)
07_ed_state -> 01_const, 03_events, 04_fixed_step, 05_input_buffer, 06_cancel_matrix, 21_movement, 88_feel
10_axes -> 03_events
11_metrics -> 03_events
20_input -> 01_const
21_movement -> 01_const, 03_events, 88_feel
22_collision -> (none)
30_audio -> 01_const, 10_axes
40_fx -> 01_const, 03_events, 04_save
41_signs -> 03_events
50_forms -> 03_events
51_contradiction -> 03_events
52_curiosity -> 03_events, 10_axes
60_enemies -> 03_events, 07_ed_state, 22_collision
62_director -> (none)
70_worlds -> (none)
71_world_orientation -> 70_worlds
72_world_benefits -> 70_worlds
73_world_rasta -> 70_worlds
74_world_orientation_runtime -> 01_const, 03_events, 10_axes, 11_metrics, 20_input, 21_movement, 22_collision, 41_signs, 50_forms, 51_contradiction, 52_curiosity, 70_worlds
75_world_benefits_runtime -> 01_const, 03_events, 10_axes, 11_metrics, 20_input, 21_movement, 22_collision, 41_signs, 52_curiosity, 60_enemies, 62_director, 70_worlds, 88_feel
76_world_rasta_runtime -> 01_const, 03_events, 10_axes, 11_metrics, 20_input, 21_movement, 22_collision, 41_signs, 52_curiosity, 70_worlds
80_receipts -> 05_caseseed, 10_axes, 70_worlds
81_docket -> 01_const, 05_caseseed, 80_receipts, 83_receipt_render
82_appeals -> (none)
83_receipt_render -> 80_receipts
85_lens -> 01_const, 03_events
86_light -> 01_const, 41_signs
87_props -> 01_const, 75_world_benefits_runtime
88_feel -> 01_const, 22_collision
89_ed_perform -> 01_const, 03_events, 21_movement, 85_lens
8A_air -> 01_const, 20_input
90_ui -> 04_save
91_scenes -> 00_index, 01_const, 03_events, 04_save, 05_caseseed, 10_axes, 11_metrics, 20_input, 21_movement, 30_audio, 40_fx, 70_worlds, 74_world_orientation_runtime, 75_world_benefits_runtime, 76_world_rasta_runtime, 80_receipts, 81_docket, 82_appeals, 83_receipt_render, 85_lens, 86_light, 87_props, 88_feel, 89_ed_perform, 8A_air, 90_ui, 92_testroom
92_testroom -> 01_const, 03_events, 10_axes, 20_input, 21_movement, 22_collision, 41_signs, 50_forms, 51_contradiction, 70_worlds
99_boot -> 01_const, 04_save, 81_docket, 91_scenes
```

### Likely Dead Exports

No dead export is safe-delete from this pass. Static evidence found only three direct-reference gaps:

| Export | Evidence | Label |
|---|---|---|
| `CEHP.BUILD_AT` | Defined in `00_index.js`; no direct runtime reference outside its defining file. | REVIEW DELETE |
| `CEHP.RNG` | Constructor itself is not referenced directly, but `CEHP.makeRNG` is heavily used and this is part of the public seeded RNG module. | KEEP |
| `CEHP.Debug` | Created in `91_scenes.js`; used by `ACTIVE/game/scripts/capture_trailer.mjs` and `ACTIVE/game/tests/cehp_rebuild_case_runs.mjs`. | KEEP |

### Exact Duplicate Files

- Exact duplicate scan: 22 hash groups, 68 files.
- Most duplicates are intentional mirrors across delivery/marketing packets or frame captures reused as screenshots.
- Examples:
  - `ACTIVE/delivery/w5_demo/cr_pitch_v1/receipts/*` duplicates `ACTIVE/delivery/w5_demo/receipts/*` and `ACTIVE/marketing/cr_pitch_v1/receipts/*`.
  - `ACTIVE/delivery/w5_demo/cr_pitch_v1/screenshots/*` duplicates selected trailer frames and `ACTIVE/marketing/cr_pitch_v1/screenshots/*`.
  - `ACTIVE/delivery/w5_demo/DNS_CUTOVER.md` duplicates `ACTIVE/docs/DNS_CUTOVER.md`.
  - Several `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-*.html` files are exact duplicates.
  - Empty `.gitkeep` files are exact duplicates by design.

### Large Files / Directories

Largest directories:

```text
 94M ACTIVE/game/output
 73M ACTIVE/game/art
 66M ACTIVE/game/art/_originals
 32M ACTIVE/marketing
 23M ARCHIVE
8.1M ACTIVE/delivery
692K ACTIVE/discord/output
```

Largest active runtime source files:

```text
43154 ACTIVE/game/src/07_ed_state.js
35235 ACTIVE/game/src/74_world_orientation_runtime.js
31499 ACTIVE/game/src/75_world_benefits_runtime.js
30285 ACTIVE/game/src/80_receipts.js
30209 ACTIVE/game/src/76_world_rasta_runtime.js
22069 ACTIVE/game/src/89_ed_perform.js
16916 ACTIVE/game/src/91_scenes.js
13213 ACTIVE/game/src/60_enemies.js
12451 ACTIVE/game/src/88_feel.js
12371 ACTIVE/game/src/85_lens.js
```

Largest root/non-runtime payloads:

```text
7381572 ACTIVE/marketing/mood_boards_w7/PROMPT2.png
6897140 ACTIVE/marketing/mood_boards_w7/PROMPT4.png
6806494 ACTIVE/marketing/mood_boards_w7/PROMPT3.png
6299418 ACTIVE/marketing/mood_boards_w7/PROMPT1.png
5665528 ACTIVE/marketing/mood_boards_w7/PROMPT5.png
3745114 ACTIVE/delivery/w10_phase2_checkpoint/w1_orientation_30s.webm
3495428 ACTIVE/game/art/_originals/carpet_tile_seamless.png
3359504 ACTIVE/game/art/_originals/ui_locker.png
3065042 ACTIVE/game/art/_originals/paper_safety_poster.png
```

### Complex Functions / Modules

Approximate score = physical lines + 3 * branch tokens. The top-level module IIFEs are large because each module is wrapped for the concat runtime. The highest-risk named functions/methods are:

```text
21_movement.js:111 apply lines=105 branches=47 score=246
10_axes.js:72 bindEvents lines=175 branches=23 score=244
07_ed_state.js:1293 install lines=71 branches=45 score=206
91_scenes.js:2 create lines=1 branches=67 score=202 (minified)
07_ed_state.js:572 readVerbIntent lines=69 branches=44 score=201
80_receipts.js:779 scoreFragment lines=70 branches=37 score=181
89_ed_perform.js:423 syncVisualState lines=68 branches=32 score=164
20_input.js:67 readAction lines=28 branches=45 score=163
40_fx.js:71 update lines=73 branches=30 score=163
07_ed_state.js:1096 chooseState lines=27 branches=43 score=156
76_world_rasta_runtime.js:275 makeRestGate lines=80 branches=23 score=149
83_receipt_render.js:210 drawReceipt lines=112 branches=12 score=148
```

### TODO / FIXME / HACK Notes

CLOSED 2026-04-29 during W11.5 hardening: the stale `src/73_world_rasta.js` TODO for synchronicity platforms and polite sorting redirects was removed after the runtime implementation existed in `76_world_rasta_runtime.js`.

Current TODO/FIXME/HACK hits are scan scripts, old planning docs, historical audit notes, or generated/stale report references. `ACTIVE/docs/scan-results.md` is a historical 2026-03-15 snapshot and not a current health source.

### Files Not Touched In 6+ Months

- Filesystem mtime scan found no files older than six months.
- This is weak evidence because the local folder appears to have been copied or restored recently.
- Git history cannot be used until this directory is a Git worktree again.

### Files Excluded From Runtime

These are not concatenated into `index.html`:

- `ACTIVE/game/scripts/**`
- `ACTIVE/game/tests/**`
- `ACTIVE/game/package.json`
- `ACTIVE/game/process_manifest.json`
- `ACTIVE/game/index.template.html`
- `ACTIVE/game/output/**`
- `ACTIVE/discord/**`
- `ACTIVE/docs/**`
- `ACTIVE/knowledge/**`
- `ACTIVE/marketing/**`
- `ACTIVE/delivery/**`
- `ARCHIVE/**`

PNG assets present in `ACTIVE/game/art/` but not referenced directly by runtime source:

```text
cactus_ed_in_game_sprite.png (HELD by art verifier)
cactus_ed_portraits_masked.png (expected asset, currently unwired)
cactus_ed_portraits_unmasked.png (expected asset, currently unwired)
paper_hr_memo.png (expected asset, currently unwired)
stamps_sheet.png (expected asset, currently unwired)
ui_clipboard.png (expected asset, currently unwired)
ui_locker.png (expected asset, currently unwired)
ui_training_poster.png (expected asset, currently unwired)
```

Do not delete these from runtime evidence alone: `verify_art_assets.mjs` treats them as expected assets, and several are intentionally held for taste gates or future UI surfaces.

## Risk Labels

### SAFE DELETE

Only after a snapshot exists:

```text
.DS_Store
ACTIVE/.DS_Store
ACTIVE/marketing/.DS_Store
```

No runtime source, save file, migration, deploy config, or expected art asset is SAFE DELETE from this audit.

### REVIEW DELETE

These are likely cleanup candidates but need human confirmation and one cleanup class per PR:

```text
ACTIVE/game/output/autoplay/*.json
ACTIVE/discord/output/*.png
ACTIVE/delivery/w5_demo/trailer_frames/**
ACTIVE/delivery/w5_demo/cr_pitch_v1/**
ACTIVE/delivery/w5_demo/receipts/**
ACTIVE/delivery/w5_demo/DNS_CUTOVER.md
ACTIVE/marketing/cr_pitch_v1/** duplicates that are already packaged elsewhere
duplicate ARCHIVE/legacy/quarantine/runtime-backups/index.pre-*.html groups
CEHP.BUILD_AT export in ACTIVE/game/src/00_index.js
```

### KEEP

```text
ACTIVE/game/src/*.js
ACTIVE/game/index.template.html
ACTIVE/game/index.html
ACTIVE/game/build.js
ACTIVE/game/process_manifest.json
ACTIVE/game/package.json
ACTIVE/game/scripts/**
ACTIVE/game/tests/**
ACTIVE/game/art/*.png listed by verify_art_assets.mjs
ACTIVE/discord/bot.js
ACTIVE/discord/package.json
ACTIVE/discord/package-lock.json
ACTIVE/discord/tests/**
.github/workflows/static.yml
ACTIVE/game/CNAME
ACTIVE/docs/NEXT_TASK.md
ACTIVE/docs/BACKLOG.md
ACTIVE/docs/KNOWN_ISSUES.md
ACTIVE/docs/PROPOSED_NEXT_TASK.md
.codex/CEHP/**
ARCHIVE/**
```

### QUARANTINE

Move to `ARCHIVE/` first, do not delete:

```text
PROJECT_COMPENDIUM.md
READ_BEFORE_CODEX_JSON.md
HANDOFF_TO_NEXT_CLAUDE.json
root CLAUDE.md, but only after reconciling root instruction expectations
ACTIVE/game/art/_originals/** if disk/deploy size becomes a problem
ACTIVE/marketing/mood_boards_w7/** if no longer active delivery material
non-runtime expected art if Kevin explicitly retires the asset role
```

Root hygiene note: `AGENTS.md` says root should only contain `00_HANDOFF_FROM_CLAUDE_CODE.md`, `README_Instructions on What To Do.md`, `AGENTS.md`, `ACTIVE/`, `ARCHIVE/`, and config dirs. Current root also contains `CLAUDE.md`, `HANDOFF_TO_NEXT_CLAUDE.json`, `PROJECT_COMPENDIUM.md`, and `READ_BEFORE_CODEX_JSON.md`. Treat this as a documentation/process conflict, not a delete instruction.

## Cleanup Rules For Follow-Up PRs

1. Restore or create a snapshot first. Preferred: real Git worktree with clean `git status`; fallback: dated filesystem copy outside the project.
2. One cleanup class per PR:
   - PR A: `.DS_Store` removal only.
   - PR B: generated autoplay/Discord output archival only.
   - PR C: duplicate marketing/delivery mirror consolidation only.
   - PR D: root hygiene quarantine only.
3. No behavior changes in cleanup PRs.
4. Run verification before and after each cleanup:
   - `cd ACTIVE/game && node build.js`
   - `cd ACTIVE/game && node scripts/check_save_schema.js`
   - `cd ACTIVE/game && node scripts/check_process_manifest.mjs`
   - `cd ACTIVE/game && bash scripts/verify-cehp.sh`
5. For any art cleanup, also run:
   - `cd ACTIVE/game && node scripts/verify_art_assets.mjs`
6. Commit messages must say exactly what was removed and why, for example:
   - `chore: remove macOS metadata files`
   - `chore: archive generated autoplay reports`
   - `chore: consolidate duplicate marketing receipt mirrors`

## Verification Evidence

Baseline commands run on 2026-04-28:

```text
cd ACTIVE/game && node build.js
Built 44 modules -> index.html (355175 bytes)

cd ACTIVE/game && node scripts/check_save_schema.js
Rebuild save schema (v2 + archaeological v1) checks passed.

cd ACTIVE/game && node scripts/check_process_manifest.mjs
[check_process_manifest] OK - 45 guard checks passed

cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs
78/78 pass

cd ACTIVE/game && node --test tests/process_manifest.test.mjs
1/1 pass

cd ACTIVE/game && bash scripts/verify-cehp.sh
PASS: build, process guard, save schema, art 33/33, logic 78/78, process 1/1, browser smoke, accessibility settings, and case-run receipts.
```
