# README — Instructions on What To Do

> **Last updated**: 2026-04-28
> **Updated by**: Codex GPT-5.5 — codebase audit protocol documented

---

# Project Overview

**Cactus Ed's Happiest Place (CEHP)** is currently being rebuilt as a single-file browser platformer shipped from `ACTIVE/game/index.html`, authored as ES5 `src/*.js` modules concatenated by `ACTIVE/game/build.js`. The current local runtime is **44 modules** -> **1 HTML file** (`ACTIVE/game/index.html`, 11,453 lines / 355,187 bytes).

**Current rebuild shape**: Phaser 3 via CDN, ES5 only, deterministic seeded runtime, save v2 with archaeological v1 preserved under `legacy`, Boot / Play / Overlay / Receipt scenes, a plain-HTML `?docket=1` archive surface, shared receipt-card rendering, and Discord-side receipt PNG rendering under `ACTIVE/discord/`.

**Active world slices**: Week 2 World 1 — **Orientation Bureau** remains the default boot and now includes deterministic applicant silhouette variation; Week 3 World 2 — **Benefits Enrollment Atrium** is playable via `?world=benefits`; and Week 4 World 3 — **Rasta Corp Logistics Hub** is now playable via `?world=rasta` with six authored rooms, deterministic Synchronicity platforms, a live REST HERE contradiction gate, polite sorting machines, and divergent ambient/impatient receipts on the same seed.

**Play now**: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/ (legacy public fallback; `counterfeit-educational.org` is not resolving yet as of 2026-04-21)
**Repo**: https://github.com/KevinBigham/Cactus-Eds-Happy-Place

---

# Current State

## What exists and works
- **Codebase audit protocol is now documented and first audit is complete** (2026-04-28): `ACTIVE/docs/CODEBASE_AUDIT.md` maps entry points, build/test/deploy commands, canonical/generated/archive lanes, runtime dependency graph, duplicate groups, large files, complex functions, TODO markers, runtime exclusions, and cleanup risk labels. No files were deleted or moved. Baseline verification is green: `node build.js`, save schema, process manifest `45/45`, rebuild logic `78/78`, process test `1/1`, and `bash scripts/verify-cehp.sh` all pass. Important blocker for future cleanup: this local folder is not currently a Git worktree, so cleanup must wait for a real snapshot or restored Git checkout.
- **Process guard imported from Toprank audit is green locally** (2026-04-28): `ACTIVE/game/process_manifest.json` now acts as an executable process contract, `ACTIVE/game/scripts/check_process_manifest.mjs` validates required files/scripts/modules, ship-artifact byte cap, save keys, ES5 runtime source, seeded-RNG discipline, and protected tuning writes, and `ACTIVE/game/scripts/verify-w10-full.sh` provides a full W10 gate wrapper around standard verification plus orientation/benefits/rasta autoplay. `verify-cehp.sh` now rebuilds first and includes process, art, and process-test checks. Verification: process test RED first then GREEN, process guard `45/45`, standard verify PASS, W10 wrapper PASS with `CEHP_SKIP_AUTOPLAY=1`. Full autoplay was not run in this process-hardening pass.
- **W8 sprint is fully staged, activates on Kevin's W7 close-out** (2026-04-21 late): Kevin approved `.claude/plans/mossy-stargazing-sloth.md` via ExitPlanMode — the canonical 5-phase W8 plan (R03 receipt tone bias → R04 Rayman camera → R01 enemy telegraph → R02 Encounter Director → R05 curiosity-pays-rent). Phase 0 byte-path resolved to **option (a) — minification approved** under Kevin's full-permission delegation (frees ~1,500–2,000B; retro-minifies existing AirKit/EdKit; W9 will queue a readability restoration pass). Actual on-disk `index.html` byte count corrected to **`299,934` bytes** (headroom vs. 300KB ceiling = 66B — Phase 0 required). New human-readable sprint doc at `ACTIVE/docs/W8_LENS_OF_RESEARCH_SPRINT.md`. `ACTIVE/docs/PROPOSED_NEXT_TASK.md` rewritten as the W8 beacon (`CEHP-REBUILD-W8-LENS-OF-RESEARCH`, owner Codex 5.4, STATUS PROPOSED, reviewer-suggested deadline 2026-05-05). `NEXT_TASK.md` still on W7 — Kevin promotes after W7 close-out. No code changed in this pass.
- **W8 research synthesis remains the doctrine source** (2026-04-21): `ACTIVE/docs/W8_RESEARCH_SYNTHESIS.md` distills the 7 legacy research/guidance docs (Cactus Ed GOAT guide, Contra, Mega Man X, Rayman, game design research synthesis, Community Chaos humor addendum, Perchtold 2019 PLOS ONE humor paper) against the current 37-module runtime into six ranked candidates (`W8-R01` through `W8-R06`) with byte estimates, seams, and a sacred-constraint audit. The plan consumes this doc as spec input.
- **W7 Phase 5 EdKit is reviewer-GREEN** (2026-04-22): Phase 6 AirKit is already shipped as `ACTIVE/game/src/8A_air.js` (paper-drift motes, dust motes confined to light cones, camera micro-sway when Ed idle >3s, global flicker beat every 7–14s — all LCG-seeded). Pending Kevin's byte-budget call (current build `296,057` bytes; `3,943` bytes headroom vs. 300KB soft ceiling): (a) minify AirKit, (b) raise soft ceiling to ~310KB, or (c) budget-optimize EdKit. Reviewer recommends (a).
- **W7 Phase 4 FeelKit is green locally and pending reviewer** (2026-04-22): `ACTIVE/game/src/88_feel.js` now ships pickup pause/shake/fleck/flash/clack feedback, a scene-local `ShakeBudget`, camera deadzone + lookahead, landing settle hooks, and run-scoped gravity helpers. `ACTIVE/game/src/21_movement.js` preserves the coyote/buffer state machine while adding `gravityMultiplier`-driven early release, `ACTIVE/game/src/75_world_benefits_runtime.js` now emits direct FeelKit pickup calls from the premium collect seam, and `ACTIVE/game/src/91_scenes.js` adds `setDeadzone(48, 32)` plus `ns.Feel.updateCamera(...)` without replacing the existing `startFollow(...)`. Current byte count: `291425` from build output / `291487` on disk (`+13941` bytes from the Phase 3 baseline, inside the `+14 KB` stop line). Full local verify is green at logic `17/17`, bot hardening `5/5`, thermal PNG `116994` bytes, pickup probe `pause false->true->false / shakeCalls=1`, sign-read guard probe `shakeCalls=0`, jump apex delta `12.1083px` (80ms tap vs 500ms hold), 60s uncapped W1 FPS `avg 848.44 / min 722.86 / max 903.82`, and 10s pickup-stress FPS `avg 1022.08 / min 876.12 / max 1077.68`.
- **W7 Phase 3 PropKit is green locally** (2026-04-22): `ACTIVE/game/src/87_props.js` now generates the five requested palette-locked `cehp:prop:*` paper-prop families, primes before runtime create, wraps `ns.WorldBenefits.create`, and decorates all 14 live benefits premiums as deterministic receipt-slip props with seeded wobble/flutter. `ACTIVE/game/src/75_world_benefits_runtime.js` keeps the old premium square + `$` label invisible so the colored-square collectible no longer leaks through the live build. Current byte count at the Phase 3 boundary was `277484` from build output / `277546` on disk (`+9998` bytes from the Phase 2 baseline). Phase 4 preserved that seam and left the prop families intact.
- **W7 Phase 2 LightKit is green locally** (2026-04-21): `ACTIVE/game/src/86_light.js` now adds one off-screen ADD-blend ambient radial per world plus deterministic sign emissive flicker in `PlayScene` only, `ns.PALETTE` now includes `COOL_KIOSK` and `WARM_EXIT`, and `91_scenes.js` primes/attaches/updates LightKit without touching Overlay/Receipt. Current byte count: `267492` from build output / `267554` on disk. Full local verify + bot hardening + thermal Discord render are green, and the new LightKit logic count is `11/11`.
- **W7 Phase 1 LensKit is green locally** (2026-04-21): `ACTIVE/game/src/85_lens.js` now adds a deterministic dither/scanline/vignette stack in PlayScene only, `ns.PALETTE` is locked in `01_const.js`, boot now enforces `roundPixels:true` + `antialias:false`, and the rebuilt runtime passes save/schema, full `verify-cehp.sh`, bot hardening, and thermal Discord render. Current byte count: `255425` from build output / `255487` on disk.
- **W6 kickoff execution is green locally** (2026-04-21): `cd ACTIVE/game && node build.js` still produces `248475` bytes, the Discord thermal render rewrites `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png` at `116994` bytes, and the new `ACTIVE/game/scripts/verify_live_domain.mjs` smoke helper passes root/orientation/benefits/rasta/docket/settings against the local surface.
- **Trailer final packaging is staged**: `bash ACTIVE/game/scripts/package_launch_trailer.sh` now writes `ACTIVE/delivery/w6_launch/cehp_launch_trailer_final.mp4` (`28.00s`, `1920x1080`, `24fps`, `597883` bytes), `cehp_launch_trailer_poster.png`, and `TRAILER_UPLOAD_DESCRIPTOR.md`.
- **CR outreach is staged for Kevin review**: `ACTIVE/marketing/cr_pitch_v1/SEND_READY_PACKET.md` now lists the recommended attachment set and a draft note starter tied to the current W6 assets.
- **Launch execution docs are now in place**: `ACTIVE/docs/LAUNCH_RUNBOOK_W6.md`, `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md`, and `ACTIVE/docs/ROLLBACK_REHEARSAL_W6.md` cover the pre-flight, the post-flip smoke path, the incident log, and the pre-flip rollback drill.
- **Week 5 Builder pass is implemented and green locally** (2026-04-20): shared receipt-card rendering now powers in-game receipts, `?thermal=1`, and the Discord sidecar `--thermal` path without changing receipt text or fragment IDs.
- **Bedtime sprint follow-through is green locally** (2026-04-20): the appeals seam is now documented in `ACTIVE/docs/APPEALS_MECHANIC.md`, launch-week briefs/checklists are written, perf results are captured in `ACTIVE/docs/PERF_AUDIT_W5.md`, and the proposed W6 beacon lives in `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.
- **Accessibility escape hatch is now live end-to-end**: all 5 `?settings=1` toggles persist and affect runtime behavior, with keyboard-only coverage in `ACTIVE/game/tests/cehp_accessibility_settings.mjs`.
- **Discord bot hardening is now covered**: `ACTIVE/discord/tests/bot_hardening.test.mjs` exercises missing-argument handling, bad-seed rejection, canvas fallback, output-path validation, and disk-write error wrapping.
- **THE DOCKET is live locally**: `ACTIVE/game/src/81_docket.js` now derives one deterministic weekly seed from `(isoWeek, year)`, stores archived local receipts under `cactusEd_docket_week_v1`, and renders a read-only archive page at `?docket=1`.
- **Domain cutover prep is in place**: `ACTIVE/game/CNAME` contains `counterfeit-educational.org`, the existing Pages workflow already serves `ACTIVE/game` at the root, and `ACTIVE/docs/DNS_CUTOVER.md` is ready for registrar handoff. DNS is still not flipped.
- **Trailer/marketing assets are generated locally**: `ACTIVE/game/scripts/capture_trailer.mjs` writes deterministic frame sequences for W1/W2/W3 under `ACTIVE/delivery/w5_demo/trailer_frames/`, and `ACTIVE/game/scripts/generate_w5_assets.mjs` produces `ACTIVE/marketing/cr_pitch_v1/` plus the delivery bundle.
- **Rebuild runtime is green locally**: `cd ACTIVE/game && node build.js` -> 32 modules -> `ACTIVE/game/index.html` (248,475-byte build output; 248,537 bytes on disk), and `bash scripts/verify-cehp.sh` passes end-to-end.
- **Rebuild runtime is still green after the bedtime sprint**: `cd ACTIVE/game && node build.js` now produces a 32-module / 248,475-byte build and `bash scripts/verify-cehp.sh` passes with the new accessibility test included.
- **Discord sidecar is green locally**: `cd ACTIVE/discord && node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` writes `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png`.
- The full rebuild runs from `ACTIVE/game/index.html` in any browser
- Current rebuild surfaces are Boot / Play / Overlay / Receipt plus the plain-HTML `?docket=1` archive surface
- The Week 1 throwaway `92_testroom.js` remains in-tree as a reference pattern and optional `?room=test` surface, but it is no longer the default boot target
- Legacy runtime remains archived at `ARCHIVE/legacy_runtime_v1/index.html` and is reference-only
- **All 10 GOAT rounds are implemented** (Rounds 01-03 were pre-existing; Rounds 04-10 built 2026-03-20)
- **Visual upgrade shipped** (2026-03-21): WebGL PostFX (vignette, bloom, barrel distortion), smooth scene transitions, enhanced glow effects, dual-pass particles, VHS grain, RGB channel offset tears
- **Text readability pass** (2026-03-21): All font sizes bumped (minimum 8px), stroke thickness ≥3, dim colors brightened
- **"The Corrupted Broadcast" visual evolution shipped** (2026-03-21): 10-round visual overhaul adding interconnected systems that make the game react to player behavior in real-time
- **Builder stability audit patch applied locally** (2026-03-21): boot-time `IS_WEBGL` null dereference fixed, title cold open now skips save-bearing returns and only auto-runs for first-time/no-save visits, title gamepad input is edge-triggered again and cold open accepts gamepad input
- **Renderer**: WebGL via `Phaser.AUTO` with Canvas fallback (`IS_WEBGL` flag guards all PostFX code)
- Save contract (`cactusEd_save_v1`) fully preserved across all changes
- Zero ES6 syntax — pure ES5 JavaScript throughout
- Verification now passing locally: `node scripts/check_save_schema.js`, syntax parse, and `node tests/cehp_boot_smoke.mjs`
- **Rediscovery audit completed** (2026-04-20): full authored local inventory mapped (216 files), compared against GitHub `main` (219 tracked files), and summarized in `ACTIVE/docs/PROJECT_REDISCOVERY_AUDIT.md`
- **Verified local/public divergence** (2026-04-20): local `./scripts/verify-cehp.sh` passes, but the live GitHub Pages build still reproduces the old plain-`/index.html` `renderer.type` null crash, so public deploy is not fully in sync with the local workspace
- **Rebuild verification delivered** (2026-04-20): `node scripts/check_save_schema.js`, `./scripts/verify-cehp.sh`, and `cd ../discord && node bot.js --render CASE-20260427-001-COMPLIANCE-R2 --world benefits` all pass locally in the rebuild workspace

## Historical note
- The long GOAT / visual-evolution sections below describe the archived pre-rebuild runtime and prior design doctrine. They are useful reference, but the active gameplay surface is the rebuild under `ACTIVE/game/src/*.js`, not the legacy 19,835-line runtime.

## GOAT Plan Rounds — Feature Summary

### Rounds 01-03 (Pre-existing)
- **R01 JUICE & FEEL**: Procedural SFX, hit-stop, screenshake, squash-stretch, combo text
- **R02 DEATH & ONBOARDING**: Fast respawn, institutional signage tutorial, cold open, camera lookahead
- **R03 RECEIPT 2.0**: Procedural receipt templates (20 templates x 6 axes x 16 word banks), near-miss callouts, receipt stamp animation

### Round 04 — THE REPLAY ENGINE
- Behavioral grade (F through S) on receipt + completion screen
- Corrective Action Items (1-3 institutional improvement mandates)
- RE-ENROLL (30% behavior carryover) / APPEAL (100%) / PROCEED TO WORLD 2 buttons
- Hold-Z instant restart during death animation (1-second hold)
- Streak-specific receipt lines at runs 3, 5, 10

### Round 05 — SHAREABLE RECEIPT CARD
- Canvas receipt card renderer (1080x1080 square + 1080x1920 story format)
- Six-axis radar chart (compliance/intuition/curiosity/chaos/grace/efficiency)
- Download PNG / Copy clipboard text / Share API (mobile)
- Behavioral emoji bar for Wordle-style text sharing
- "PRINT RECEIPT" button after stamp animation (P key)

### Round 06 — ABILITY LICENSING
- 8 licensable moves with institutional form numbers (FORM 12-A, FORM 8-C, etc.)
- Unlicensed moves still work — but violations are logged + flash notifications
- Auditor enemy (floating clipboard, non-lethal, 5s lifespan) spawns on repeated violations
- Certification acts (zone-based skill challenges grant licenses permanently)
- Employee Handbook replaces controls on pause menu (shows license status + hints)

### Round 07 — TRAIT FORECLOSURE
- Policy Flag system: institution applies 2-3 policies to next world based on dominant behavior
- Institutional Memo at world start (cream overlay listing active policies)
- World modifications: narrowed platforms (grace), censored signs (curiosity), response teams (chaos), extended safe paths (compliance)
- Policy Effectiveness Review on completion screen
- Fake-Left Branch memory (4+ visits with escalating institutional gags)

### Round 08 — RETENTION SYSTEMS
- Daily Enrollment Challenge (15 modifiers, deterministic from date seed)
- Receipt Cabinet (localStorage collection, 100 max, archetype/S-rank tracking)
- Department Assignment (6 departments after 5+ runs, cumulative behavioral tracking)
- Waiver Punchcard (8 slots, 2 courtesy, world completion/high grades earn punches)
- Behavioral Drift Tracking (longitudinal analysis with trend narratives after 5+ runs)

### Round 09 — SURPRISE & DELIGHT
- Fourth Wall Receipt lines at runs 5/10/15/20/25/30/50
- Greeter NPC near W1 start (talk/kill/ignore — tracked for endgame payoff)
- Blank Receipt for 95%+ compliance ("PERFECT RECORD. NO FURTHER ASSESSMENT REQUIRED.")
- Clerical Error Jackpot (~5% chance — one-zone celebration with bouncing enemies)

### Round 10 — CONTENT EXPANSION
- Case Seed system (deterministic run ID: CASE-DATE-RUN-AXIS)
- Mood Rotations (7 institutional moods: Budget Cuts, Wellness Week, Casual Friday, etc.)
- Behavioral Remix Labels (DISCIPLINARY/EXPRESS/RESEARCH/STANDARD/PRECISION/CLASSIFIED editions)
- Case number + mood displayed on pause screen
- Daily challenge + department + punchcard on title screen

## "The Corrupted Broadcast" — Visual Evolution (10 Rounds)

### VE Round 01 — MOOD LIGHTING
- `MOOD_VISUALS` system: 7 institutional moods now drive PostFX parameters (bloom strength, vignette radius, grain multiplier)
- Mood tint overlay (depth 91) — colored full-screen rect per mood
- Emergency Drill alarm pulse: pulsing red border when mood = alarm
- Mood applied to all 3 gameplay scenes (DemoScene, World2Scene, World3Scene)

### VE Round 02 — THE FILING CABINET (Animated UI)
- `ANIM_UI` utility: `typewriter()`, `slideIn()`, `stampIn()`, `slideOut()` — reusable animation primitives
- Pause screen: text elements stamp in with staggered delays, background fades in, dismissal animates out
- Lesson cards: panel fades in, title/body stamp in with delays
- Institutional memos: stamp-in animation on World2 policy memo
- Flash messages: scale overshoot on appearance (1.3x → 1.0x)
- All animations respect `reduceFlash` accessibility toggle

### VE Round 03 — THE BEHAVIOR METER
- `BEHAVIOR_FX` system: maps dominant behavior axis to real-time visual modifiers
- `getBehaviorIntensity()` helper: returns dominant axis, intensity 0-1, and secondary
- Chaos: extra grain, tinted vignette, scanline wobble, faster screen tears
- Compliance: reduced grain, white sterile tint
- Grace: golden shimmer particles via SMOKE_POOL
- Effects only activate when intensity > 0.3, scaled by `(intensity - 0.3) / 0.7`
- Stacks multiplicatively with mood grain multiplier

### VE Round 04 — INSTITUTIONAL TRANSITIONS
- `TRANSITIONS` system: state machine with 5 themed transition types
- `glitch` (800ms): tear bars multiply → white flash → dissipate. Used for deaths.
- `vhs_track` (1500ms): tracking bars scroll → static + noise → clears top-to-bottom. Used for world transitions (W1→W2, Title→saved world).
- `stamp` (900ms): screen dims → stamp rectangle slams in → fades. Used for Title→Demo.
- `standby` (1300ms): TV test card with color bars → fade out. Used for End→Title.
- All `camera.fadeOut()` + `camerafadeoutcomplete` patterns replaced with `TRANSITIONS.start()`

### VE Round 05 — AMBIENT PULSE (Dynamic Lighting)
- `AMBIENT_LIGHT` system: register light sources, per-frame pulsing render, one-shot flares
- Light types: `ambient` (slow pulse, wide), `pickup` (medium), `entity` (fast, small)
- Concentric fillCircle rendering (outer 1.5x/0.3α, inner 1x/0.6α, core 0.4x/fullα) with `Math.sin` oscillation
- All aloe pickups registered as light sources at scene creation
- Event flares: green on aloe pickup, gold on enemy kill, red on death
- Graphics layer at depth 76, max 20 sources, PERF quality scaling

### VE Round 06 — ENVIRONMENTAL STORYTELLING
- `ENV_FX` system: zone-specific ambient visual effects
- Dream/Garden/Recovery zones: fog wisps (drifting white rects at ground level)
- Lesson/Testing zones: paper flutter (gold rects drifting diagonally down)
- Rupture/Maze/Pharmacy zones: heat shimmer (wobbling horizontal lines at ground level)
- Afterglow/Lawn zones: data rain (ascending teal dots)
- Viewport culling for performance, zone transition blending
- Graphics layer at depth 77, guarded by `reduceParticles`

### VE Round 07 — THE BROADCAST IDENTITY
- Zone-accent enemy halos: every alive enemy gets a pulsing glow halo matching zone color
- Dream = green, Lesson = gold, Rupture = red, Afterglow = teal
- Alpha pulses via `Math.sin(time * 0.005 + enemyIndex)` for organic feel
- Guarded by `reduceFlash` accessibility toggle

### VE Round 08 — COLOR GRADING
- `COLOR_GRADE` system: per-zone color overlay with smooth lerp transitions
- Each zone mapped to overlay color + alpha + saturation shift
- Smooth alpha lerp during zone transitions (~500ms)
- Graphics layer at depth 90, stacks correctly under mood overlay (91) and vignette (92)

### VE Round 09 — THE PRINTING CEREMONY
- CRT power-on animation: white dot → horizontal line → vertical expand → flicker
- Archetype text stamp-in with camera micro-shake on reveal
- All receipt ceremony animations guarded by `reduceFlash` and `reduceShake`

### VE Round 10 — THE COMPLETE BROADCAST
- `BROADCAST_STATE` global: signal integrity (0.1-1.0) computed from behavior + mood
- Signal formula: `1.0 - (chaosIntensity * 0.6) - (moodAlarm * 0.15) + (complianceIntensity * 0.4)`
- Signal drives all previous systems: grain multiplied by `(2.0 - signal)`, tear interval multiplied by `signal`
- Low signal: warm amber color push via additional overlay
- Channel identification card: "CEHP BROADCAST NETWORK" + case number + mood, shown every 120 seconds
- Signal persists across scenes via `window._cactusEdBroadcastSignal`
- Signal is ephemeral (NOT saved to localStorage) — save contract untouched

---

# Current Important Files

**Start here — read these first:**

| File | Location | Why it matters |
|---|---|---|
| This file | Root | Project overview and task guidance |
| PROJECT_REDISCOVERY_AUDIT.md | `ACTIVE/docs/` | Full repo + GitHub rediscovery map for CEHP redo work |
| CLAUDE.md | Root | Durable instructions for Claude agents |
| NEXT_TASK.md | `ACTIVE/docs/` | The ONE active task — always exactly one |
| index.html | `ACTIVE/game/` | THE GAME — the entire runtime |
| status.md | `.codex/CEHP/` | Current objective and state (most authoritative) |
| handoff.md | `.codex/CEHP/` | What just happened + what to do next |
| AGENTS.md | `ACTIVE/docs/` | Agent roles, rules, boot sequence |
| KNOWN_ISSUES.md | `ACTIVE/docs/` | Known bugs and defects |
| BACKLOG.md | `ACTIVE/docs/` | Queue of future tasks |

**Secondary reference:**

| File | Location | Why it matters |
|---|---|---|
| HANDOFF.md | `ACTIVE/docs/` | Per-agent handoff context (partially stale) |
| SPRINT_LOG.md | `ACTIVE/docs/` | Chronological sprint history |
| changelog.md | `.codex/CEHP/` | Detailed change history |
| ARCHITECT_PACKET.md | `ACTIVE/docs/` | Paste-ready briefing for ChatGPT Architect |
| PROPOSED_NEXT_TASK.md | `ACTIVE/docs/` | Proposal lane for non-active agents |

---

# Current / Next Tasks

## Current task: CEHP-REBUILD-W7-LENS-AND-FEEL — Lens / light / props / feel / Ed / air (Phase 5 GREEN, Phase 6 pending taste + close-out)
- Phase 5 EdKit is **reviewer-GREEN** (2026-04-22). 24×32 three-value Ed actor with 2-frame idle breathe and seeded eye-blink replaces the yellow rectangle. FeelKit `onLanding` land-squash preserved. Build at `296,057` bytes from the Phase 5 baseline.
- Phase 6 AirKit is **shipped as `ACTIVE/game/src/8A_air.js`** (paper-drift motes, dust motes in light cones, camera micro-sway after 3s idle, global flicker beat every 7–14s — all LCG-seeded) but **not yet reviewer-closed** and **not yet taste-passed by Kevin**.
- **Current on-disk byte count: `299,934` bytes** (66 bytes headroom vs. 300KB soft ceiling). W8 Phase 0 approved option (a) minification to create runway; W7 close-out can proceed independent of that.
- Full local verify is green: logic **19/19** (two new EdKit tests), bot hardening **5/5**, thermal PNG `116,994` bytes, deterministic replays stable.
- Kevin-gated items remain held: push to `main`, domain purchase/DNS, trailer publish, CR send, public announce.
- Next non-Kevin actions: Phase 6 AirKit reviewer close-out + W7 DoD report.

## Next likely tasks (in order)
1. **Kevin**: W7 Phase 5 EdKit visual taste pass (`?world=benefits` — 3-frame Ed read, breathe + blink timing).
2. **Reviewer**: Phase 6 AirKit close-out pass (sacred-constraint sweep, determinism probe, byte check, DoD).
3. **Kevin**: W7 Phase 6 AirKit taste pass (paper motes + dust motes in light cones + camera micro-sway + flicker beat).
4. **Kevin**: W7 close-out signoff (single line in `status.md`).
5. **Kevin**: promote `ACTIVE/docs/PROPOSED_NEXT_TASK.md` → `ACTIVE/docs/NEXT_TASK.md` (single overwrite — the W8 beacon is already written and waiting).
6. **Codex 5.4**: begin W8 Phase 1 — R03 receipt benign-reframe tone bias (~150B, `80_receipts.js` only) per `.claude/plans/mossy-stargazing-sloth.md` + `ACTIVE/docs/W8_LENS_OF_RESEARCH_SPRINT.md`.
7. **Reviewer / Kevin**: per-phase sacred-constraint sweep + determinism probe + byte check + taste gate. Next phase unlocks only on Kevin GREEN.

---

# Working Rules / Guidance

## Multi-agent workflow
The project uses a 4-agent workflow: Architect (ChatGPT 5.4 Pro) → Builder (Codex 5.4) → Reviewer (Claude Code Sonnet 4.6) → Operations (Claude Cowork Opus 4.6). Only the agent whose role matches `TASK_OWNER_ROLE` in `NEXT_TASK.md` should act on the current task. All others should propose only, via `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.

## Task beacon system
`ACTIVE/docs/NEXT_TASK.md` always contains exactly ONE active task. When a task completes, the completing agent pulls the next task from `ACTIVE/docs/BACKLOG.md`.

## Durable memory
`.codex/CEHP/` contains 8 files of cross-session memory that should be updated after every meaningful change: agent.md, status.md, plan.md, decisions.md, changelog.md, open_questions.md, runbook.md, handoff.md.

## Save contract
The save schema key `cactusEd_save_v1` must be preserved across ALL changes. Run `node ACTIVE/game/scripts/check_save_schema.js` to verify.

## Code truth
`ACTIVE/game/index.html` is runtime truth. If docs and code disagree, code wins.

## Naming conventions
- Active doc files: UPPERCASE_SNAKE.md
- Organizational dirs: UPPERCASE (ACTIVE, ARCHIVE)
- Reference/utility dirs: lowercase (overflow, scripts, legacy)

---

# Warnings / Watchouts

## All changes pushed (2026-03-21)
All local changes including GOAT rounds 04-10, visual upgrade, text readability pass, TitleScene crash fix, and "The Corrupted Broadcast" visual evolution have been pushed to GitHub. The live URL serves the latest version.

## Verified deploy mismatch (2026-04-20)
- The statement above is no longer safe to trust as written.
- Local `ACTIVE/game/index.html` passes `./scripts/verify-cehp.sh` on `2026-04-20`.
- Live GitHub Pages still fails plain `/index.html` boot with `Cannot read properties of null (reading 'type')`, which matches the old pre-stability-audit `IS_WEBGL` initialization bug.
- Public GitHub `main` and live Pages should be treated as behind the local workspace until a new push/deploy pass proves otherwise.

## Key visual systems added (2026-03-21)
The visual evolution added 10 new global systems: `MOOD_VISUALS`, `ANIM_UI`, `BEHAVIOR_FX`, `TRANSITIONS`, `AMBIENT_LIGHT`, `ENV_FX`, `COLOR_GRADE`, `BROADCAST_STATE`, plus `getBehaviorIntensity()` and `getMoodVisuals()` helpers. These are all defined near the top of the script block (after `PERF` and before `RECEIPT 2.0`). They use depth layers 76-91 and stack with existing grain (94), tear (93), CRT (95), and vignette (92) layers.

## Stale docs
- `ACTIVE/docs/CURRENT_PASS.md` still describes Sprint 006 (project is past Sprint 012). Needs updating or removal.
- `ACTIVE/docs/HANDOFF.md` per-agent literal prompts reference CEHP-007 which is outdated.
- `ACTIVE/docs/ARCHITECT_PACKET.md` references Sprint 012 / CEHP-007 — outdated. Needs refresh before next Architect briefing.

## Uncertain files
- `ARCHIVE/src/world1/` — 5 JS files that appear to be abandoned modularization attempts. The game runs entirely from index.html. Ask Kevin before activating.
- `ARCHIVE/legacy/quarantine/combat/` — a full combat engine (30+ JS files). Historical only — do not activate.

## GitHub Pages deployment
The GitHub Pages workflow (`.github/workflows/static.yml`) deploys from `ACTIVE/game/` so index.html is served at the root URL. Push to `main` triggers automatic deployment.

## Process vs. product ratio
This project has extensive governance documentation relative to its actual codebase (1 HTML file). The governance is useful but can be overwhelming. Focus on the game file and NEXT_TASK.md first.

---

# Reorganization Notes (2026-03-20)

## What was done
The entire project was reorganized from a flat `ALL/` directory with confusing pointer-only `ACTIVE/` subdirs into a clean structure:

### Moved to ACTIVE/game/
- `index.html` (the game), `package.json`, `package-lock.json`, `scripts/`, `tests/`, `node_modules/`, `art/`, `audio/`, `content/`, `ui/` (empty scaffolds for future assets)

### Moved to ACTIVE/docs/
- All active documentation: NEXT_TASK.md, AGENTS.md, HANDOFF.md, BACKLOG.md, KNOWN_ISSUES.md, REQUESTED_INPUTS.md, SPRINT_LOG.md, STUDIO_DASHBOARD.md, PLAYTEST_LOG.md, CURRENT_PASS.md, HEALTH_TREND.md, scan-results.md, ARCHITECT_PACKET.md, PROPOSED_NEXT_TASK.md, CLAUDE.md (old adapter), PUBLIC_README.md

### Moved to ACTIVE/knowledge/
- STUDIO_KERNEL/ (advisory knowledge), overflow/ (reference docs + doctrine), docs_skills/

### Moved to ARCHIVE/
- Old root files: 00_START_HERE.md, 000 - AI PORTFOLIO START HERE.md, CEHP - 000 - FOREVER INSTRUCTIONS - START HERE.md, CEHP_Studio_Systems_Report.docx
- Protocol artifacts: PROTOCOL_AUDIT.md, PROTOCOL_TEST_ARTIFACT.md, STUDIO_WIDE_VERDICT.md
- Never-used systems: self_healing/, auto_tasks/, telemetry/, tools/
- Legacy code: legacy/quarantine/ (combat engine, racing, runtime backups, old docs, old scripts)
- Stale files: NEXT_TASK.md.backup-proto001, src/ (abandoned modularization)

### Removed
- Pointer-only READMEs in old ACTIVE/MEMORY/, ACTIVE/AUTOMATION/, ACTIVE/REPO/ (zero information value)
- Old `ALL/` directory (dissolved — contents redistributed)

---

# Handoff Notes

## For Claude / Claude Code / Claude Cowork / Codex
1. Always read this file and `CLAUDE.md` first
2. Check `.codex/CEHP/status.md` for the most current state
3. Check `ACTIVE/docs/NEXT_TASK.md` for the one active task
4. The game is at `ACTIVE/game/index.html` — do not move or rename it
5. After making meaningful changes, update this file's "Current State" section and `.codex/CEHP/` memory files
6. Keep root minimal — only the 5 essential items belong here
7. When in doubt, archive rather than delete
