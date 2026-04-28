# NEXT TASK

This file is the **task beacon**. There is always exactly ONE active task here.
When this task is complete, the completing agent updates this file with the next task from BACKLOG.md.

> **ONLY `TASK_OWNER_ROLE` GRANTS ACTIVATION.** If your role does not match `TASK_OWNER_ROLE`, stop and propose only.
> `CURRENT_STAGE` and `NEXT_HANDLER_ROLE` are informational — they do NOT grant activation.
> Write proposals to `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.
>
> **EDIT IN PLACE**: When updating this file, edit the metadata fields below directly. Never duplicate or append a second metadata block.

---

## TASK_ID: CEHP-REBUILD-W10-FEEL-PASS
## TITLE: Rebuild Week 10 — DKC×MMX×Contra feel pass (state machine, forgiveness, 60 px Ed, no new content)
## TASK_OWNER_ROLE: Codex GPT-5.5 (builder, 5.4 fallback if 5.5 rejects) — Kevin ratified Phase 5 GREEN + approved Gate 4b ceiling raise + authorized pre-Phase-6 byte trim 2026-04-24 ("A and B")
## CURRENT_STAGE: 2026-04-24 (Phase 5 RATIFIED — Gate 4b 358,400 → 409,600 B APPROVED — Phase 6 ACTIVE with pre-trim Slice 0) — **W10 PHASE 4 FORGIVENESS + HIT-STOP VERIFY MATRIX GREEN — TWO REVIEWER FLAGS AWAITING KEVIN RATIFICATION**. Codex delivered, reviewer re-ran matrix fresh: build 340,885 reported / 340,897 on disk (17,503 B runway under 358,400 B cap), save schema PASS, art 32/32, **64/64 tests pass** (+7 new Phase 4 behavior-oracle tests for coyote+jump-buffer / variable jump cut / gravity deltas read-time / hit-stop by class / i-frames / post-damage lock / enemy scantron i-frame handoff), autoplay orientation **5/5 MATCH**, benefits **3/3 MATCH**, rasta **3/3 reviewer + 5/5 Codex = 8/8 combined MATCH**. Sacred-constraint sweep clean: ES5 (0 matches on `=>`/`let`/`const`/backticks across `src/07_ed_state.js` + `src/05_input_buffer.js` + `src/60_enemies.js`), `Math.random` only in `02_rng.js:1` warning comment, `TUNING.JUMP_VELOCITY`/`TUNING.GRAVITY` globals confirmed NEVER mutated (apex×0.90 + fall×1.12 verified as read-time deltas via `player.body.gravityY` at `src/07_ed_state.js:839`, gravity test dual-asserts `CEHP.TUNING.GRAVITY === baseGravity` before AND after). Authored-readable discipline HELD (Phase 3b lesson stuck) — 25 named Phase 4 constants at top each with doctrinal-math comment, 10+ named helpers (`tickForgiveness`, `applyJumpCut`, `applyGravityDeltas`, `resolvePostDamageLockout`, `tickIFrames`, `tickHitStop`, `startHitStop`, `acceptDamage`, `resolveSpatialForgiveness`), new public API `CEHP.EdState.damage(player, source, opts)` + `CEHP.EdState.hitStop(player, className, actor)`. **TWO REVIEWER FLAGS FOR KEVIN'S PLAYTEST CHECKPOINT**: (1) **Runtime trace suppression** at `src/07_ed_state.js:344-352` + `state.suppressRuntimeTrace` flag in `wrapMovementApply` L1313-1328 silences `state:transition` emits for `jumpRise`/`jumpApex`/`jumpFall`/`wallSlide` (physics) + `jumpRise`/`doubleJump`/`wallJump` (input) during wrapped runtime — tests bypass via direct `EdState.enter()` call so tests still work, but autoplay determinism oracle is now blind to transitions INTO the exact states Phase 4 tunes (orientation variance doubled events 1799-1813 → 1878-1968 + maxX 1416-1421 → 1484-1657 still MATCH because A and B equally blind; rasta jumped 4/5 → 5/5 likely because noise got silenced not because determinism tightened) — **not a sacred-constraint violation but a reviewer-trust-surface change**; Codex self-flagged it in return report; recommended Phase 7 audit (remove, narrow, or ratify). (2) **Byte overshoot 11×** — estimate 1,536 B, shipped 16,847 B, runway halved 34,362 → 17,503 B; remaining phases ~10-14 KB (Phase 5 ~1 KB + Phase 6 sprite 8-12 KB + Phase 7 ~1 KB) leaves 3-7 KB margin (livable but thin); Kevin options are accept + tighten Phase 6 sprite budget, or have Codex trim Phase 4 first, or pre-approve 400 KB ceiling raise. **Kevin's pre-baked Phase 4 checkpoint question: "Does the suit feel worn? Does it feel like debt, not tightness?"** Evidence rig hot for tuning review: `jq '[.runA.trace[]|select(.topic=="state:nearMiss")|.payload.gated_by]|group_by(.)|map({reason:.[0],count:length})'` → forgiveness-window histogram. **Phase 5 camera + squash/stretch (~1 KB) blocked on Kevin ratification of both flags**. Memory surfaces updated (`.codex/CEHP/status.md`, `changelog.md`). Codex 5.4 executing per `ACTIVE/docs/W10_REDESIGN_SPRINT.md` Phase 4 scope: coyote 100 ms / jump-buffer 100 ms / dash-buffer 83 ms / attack-buffer 83 ms / wall-grace 83 ms / wall-stick 67 ms / variable jump cut-ratio 0.60 in 180 ms release window / apex × 0.90 + fall × 1.12 as read-time gravity deltas (ns.TUNING.GRAVITY global untouched) / hit-stop 67/50/17 ms by damage-melee-projectile class / 900 ms i-frames with 50/50 blink / corner forgive 6 px / step-up 6 px / ledge snap 8×10 px / jump queue 100 ms / moving-platform grace 83 ms / control-lock 133 ms post-damage / air control restored 80 ms. Touch lane: `src/07_ed_state.js`, `src/05_input_buffer.js`, `src/60_enemies.js`. Budget ~1.5 KB against 34,362 B runway under 358,400 B ceiling. Authored-readable discipline locked from Phase 3b (named constants at top, named helpers, doctrinal-math comments on Kevin-taste-gated magic numbers) — no hostile minification without Kevin approval. Verify matrix unchanged: `node build.js` + `node scripts/check_save_schema.js` + `node scripts/verify_art_assets.mjs` + `node --test tests/rebuild_logic.test.mjs` (57 + new Phase 4 tests) + `node scripts/autoplay.mjs --world orientation/benefits/rasta` (rasta jitter band ≥3/5 MATCH per Phase 3b formalization). Kevin checkpoint on Phase 4 completion: playtest-in-browser, "does the suit feel worn? Does it feel like debt, not tightness?" Evidence rig hot for tuning review: `jq '[.runA.trace[]|select(.topic=="state:nearMiss")|.payload.gated_by]|group_by(.)|map({reason:.[0],count:length})'` histograms near-miss gating reasons. Previous Phase 3 + 3b GREEN entry preserved in `.codex/CEHP/status.md` and `changelog.md`. Codex shipped Phase 3 first as a minified `src/07_ed_state.js` (single 13,705-byte line with single-letter variable names — behavior correct and verify-matrix green but hostile to human/AI review). Reviewer flagged on Kevin's global "boring code over clever code" standard and the W9 authored-readability doctrine. Kevin ruled **Option C** (restore module structure, keep Phase 3 logic). Codex delivered Phase 3b re-author at 31,008 B / 975 lines matching the Phase 1 authored style (`04_fixed_step.js` / `05_input_buffer.js` / `06_cancel_matrix.js`): module banner, `STATE_PRIORITY` + `PUBLIC_STATES` + `INPUT_ACTIONS` named arrays, ~40 named tuning constants at top (including `WALLJUMP_AWAY_VEL = Math.round(RUN_CAP*1.15)` with inline comment), 18 named helper functions (readVerbIntent, resolvePhase3Verbs, tickDash, tickSlide, resolveWallClimbAndSlide, beginDash, beginSlide, applyDiagonalAim, chooseState, collectInputEdges, isClimbableWall, etc.), 10 inline doctrinal-math comments on the Kevin-taste-gated magic numbers. Reviewer independently re-ran the full verify matrix on 3b: `node build.js` → `324,038` B reported / `324,050` B on disk (34,362 B runway under 358,400 cap); `node --test tests/rebuild_logic.test.mjs` → **57/57 pass** (3 new Phase 3 tests at L1723-1858 assert ground dash vel=260, double jump vel.y=-278.8 with 0.90 x-keep and airJumpsLeft→0, wall verbs with vel.x=-207 away (=Math.round(180×1.15)) / vel.y=-312.8 vertical (0.92 of jump velocity) / 100 ms commit against reversed axis + marker-based climb opt-in, slide jump-cancel only in final 100 ms with vel.x=194.4 (=180×1.08), diagonal aim ±35° via up+punch→-35 down+kick→+35); schema pass; 32/32 art; orientation autoplay MATCH+OK (events 1813/1799 maxX 1421/1416); benefits MATCH+OK (events 1836/1824 maxX 833/820); rasta **4/5 MATCH** (run 2 DIVERGE with state:transition A=39 B=33 and A maxX=1655 stuck — same headless Playwright jitter pattern cleared in Phase 2.5 at 2/3; 4/5 strictly better than prior band baseline). Sacred-constraint sweep clean: `rg '=>|\blet\s|\bconst\s|\`' src/07_ed_state.js` → 0 matches (ES5 held through both the minification and the re-author); `Math.random` across `src/**` → only the 02_rng.js:1 warning comment; `TUNING.JUMP_VELOCITY=`/`TUNING.GRAVITY=` → 0 matches (deltas continue layered at read time — Phase 4 will follow same pattern for apex × 0.90 / fall × 1.12). Phase 3 verb set behavior complete: (a) ground dash 260 px/s / 167 ms active / 50 ms windup / 100 ms recovery; (b) double jump 82% impulse / 90% x-keep / single charge resets on ground or wall; (c) wall-slide 40% max-fall clamp + wall-jump -207 px/s (115% run cap) / 92% vertical / 100 ms horizontal commit; (d) wall-climb opt-in chain `world._cehpClimbBounds || world._cehpClimbable || body._cehpClimbable || actor._cehpClimbable` (ships latent in current worlds — level-design API for W11+); (e) slide/roll 33 ms windup / 217 ms active / 100 ms recovery with jump-cancel only in final 100 ms at 108% run cap preservation; (f) diagonal aim ±35° via rectangle overlay on `89_ed_perform.js` `_cehpAimImage` child (zero new art bytes). Byte bill: Phase 2.5 309,845 B → Phase 3 pre-hotfix 309,836 B (Codex freed 2,144 B of readability to add ~2 KB of verbs, net -9 B) → Phase 3b 324,038 B (+14,193 B vs Phase 2.5, +14,202 B vs Phase 3 minified). 34,362 B runway safely covers Phase 4 (~1.5 KB) + Phase 5 (~1 KB) + Phase 6 (8–12 KB sprite) + Phase 7 (~1 KB) with 12–20 KB margin. **Reviewer process verdict established**: `src/**` minification going forward requires Kevin approval; byte discipline should come from code design, not post-hoc compression (Codex's Phase 2.5 and Phase 3 minifications were both unnecessary under existing runway). **Phase 4 forgiveness + hit-stop is ACTIVE** — Codex cleared to execute per `ACTIVE/docs/W10_REDESIGN_SPRINT.md` Phase 4 scope (coyote 100 ms / jump-buffer 100 ms / dash-buffer 83 ms / attack-buffer 83 ms / wall-grace 83 ms / wall-stick 67 ms / variable jump cut-ratio 0.60 in 180 ms window / apex × 0.90 + fall × 1.12 as read-time deltas / hit-stop 67/50/17 ms by damage/melee/projectile class / 900 ms i-frames with 50/50 blink / corner forgive 6 px / step-up 6 px / ledge snap 8×10 px / jump queue 100 ms / moving-platform grace 83 ms / control-lock 133 ms post-damage / air control restored 80 ms) on Kevin's activation signal. **Kevin checkpoint after Phase 4** — playtest-in-browser, "does the suit feel worn?" Evidence rig hot: `jq '[.runA.trace[]|select(.topic=="state:nearMiss")|.payload.gated_by]|group_by(.)|map({reason:.[0],count:length})'` produces the forgiveness-window histogram for evidence-driven tuning. Watch flags carried into Phase 4: (1) benefits maxX stable at 820–836 vs Phase 2.5 baseline 948–951 — soft behavioral drift, terminal room still reached every run, Phase 4 near-miss histogram should surface the cause; (2) rasta jitter band formalized at ≥ 3/5 MATCH for remainder of W10; (3) build/disk 12 B mismatch unchanged from pre-W10, cosmetic, revisit Phase 7. Memory surfaces updated (`.codex/CEHP/status.md`, `changelog.md`).
## NEXT_HANDLER_ROLE: Codex GPT-5.5 (builder) — execute Phase 6 per handoff JSON (Slice 0 pre-trim 4–8 KB → Slice 1 ed_sheet_60px.png sprite generation → Slice 2 wire + collider split → Slice 3 CRT rim-light Gate 3 → Slice 4 fixture + 1–2 new tests → Slice 5 full verify matrix); Kevin (director) stands by for visual taste-gate post-Phase-6
## STATUS: ACTIVE
## DEADLINE: W10 internal 2026-05-03; launch calendar lock 2026-05-29

## CONTEXT

W9 closed with all 4 phases GREEN + reviewer pass GREEN + Kevin image taste-gate PASSED. `screen_unmasked_reveal.png` regenerated to Kevin's approval ("LOOKS SO DAMN GOOD! THE IMAGES ARE PERFECT!"). Four typo PNGs corrected (BURRAU→BUREAU, ENROLMENT→ENROLLMENT, ui_locker copy restored, benefits crest cleaned). Track B restored authored readability in 4 modules + `build.js` bundle-only banner/header/indent normalization. Track A wired all 12 previously-unwired PNGs with procedural fallback preserved. Build finished at 287,826 B / 12,162 B runway. Autoplay determinism MATCH + OK on all 3 worlds. W9 is complete.

But on Kevin's visual tour of the 3 worlds, the game read as **"a brochure, not a playable platformer"** — tiny Ed silhouette in static cubicle rooms, flat gameplay, no kinesthetic texture. Kevin's verdict: the art pass landed, but the **gameplay** needs redesigning to feel like a combo of Donkey Kong Country × Mega Man X × Contra, not a tech demo of corporate horror.

Kevin commissioned 7 research prompts across 7 AIs covering: character/verbs, enemies/threats, aesthetic synthesis, level structure, phenomenology, physics/camera math, state machines/responsiveness. All 7 returned substantive responses (dump at `~/Downloads/W10 REDESIGN SPRINT DOC.md`, ~54K tokens). Reviewer synthesized them into `ACTIVE/docs/W10_REDESIGN_SPRINT.md`.

The synthesis is clear: **W10 is the code + scale feel pass only**. Structural redesign (hub macro, new enemies, rideables, setpieces, RPS bosses, meta-loop) is a full 8+ week build and does not fit in the 2026-05-29 launch window. Those items queue for W11+ as a separate backlog.

## SCOPE (WEEK 10 — 7 phases, ~7–10 working days, Codex-paced)

Full per-phase scope, file lists, byte estimates, acceptance criteria, and verify commands are in `ACTIVE/docs/W10_REDESIGN_SPRINT.md` under "W10 Execution Plan". Summary:

1. **Phase 1 — Architecture spine** (~2 KB): `src/04_fixed_step.js`, `src/05_input_buffer.js`, `src/06_cancel_matrix.js`. Fixed-timestep accumulator, frame-count-aged input buffer, data-driven cancel matrix.
2. **Phase 2 — Ed state machine** (~1.5 KB): `src/07_ed_state.js`. 18 states with priority stack. Autoplay must still MATCH. **Kevin checkpoint.**
3. **Phase 3 — Verb set** (~2 KB): ground dash, double jump, wall-slide+wall-jump, wall-climb on marked surfaces, slide/roll with jump-cancel, diagonal aim. No air dash.
4. **Phase 4 — Forgiveness + hit-stop** (~1.5 KB): all consensus forgiveness windows + variable jump cut-ratio + apex/fall gravity deltas + hit-stop by class + 900 ms i-frames. **Kevin checkpoint.**
5. **Phase 5 — Camera + squash/stretch** (~1 KB): horizontal lead formula + vertical lead tweens + landing dip + runtime scale events + seeded camera shake.
6. **Phase 6 — Ed sprite scale 32→60 px** (~10 KB): 48×64 canvas, 22×46 standing collider, 22×30 crouch, 24×24 slide. ~30 frames across 18 states. Optional CRT rim-light. **Kevin checkpoint.**
7. **Phase 7 — Verify + byte audit + new tests** (~1 KB): 8–10 new tests covering state machine transitions / input buffer aging / cancel windows / forgiveness windows / hit-stop / fixed-timestep determinism. Full verify matrix GREEN.

### OUT OF SCOPE (W10)

- No new enemies (existing scantron / deductibleWeight / telegraph-windup keep their art + timing)
- No new worlds / scenes / rooms
- No new art beyond Ed sprite sheet
- No hub elevator, no RPS boss weakness, no Performance Reviews, no Corporate Assets temporary verbs, no rideable contraptions, no secret paths, no per-world setpieces
- No save-schema change (v2 stays frozen; no v3)
- No push to `main`
- No domain / DNS / trailer / CR send / public announce (stays under `PUBLIC_LAUNCH` in BACKLOG.md)

## SACRED CONSTRAINTS (DO NOT BREAK)

- `cactusEd_save_v1` schema untouched (v2 migration exists; no v3)
- `ns.TUNING.JUMP_VELOCITY` and `ns.TUNING.GRAVITY` globals **not mutated** (deltas layered on top per Phase 4)
- Seeded LCG only, zero live `Math.random` calls in `src/**`
- ES5-only in shipped runtime: no arrow functions, no `let`/`const`, no template literals, no `class`
- Single HTML ship via `node build.js` — no bundler, no npm runtime deps, no transpiler
- Phaser 3 via CDN
- Procedural fallback behind every art asset via `scene.textures.exists(key)`
- `COUNTEREEIT` canonical only on seal + `paper_expired_id` callback
- `cactus_ed_in_game_sprite.png` stays Kevin-gated HOLD
- No push to `main`
- File lane: Codex owns `src/**`, `art/**`, `index.html`, `tests/**`; Reviewer owns `docs/**`, `scripts/**`, `.codex/CEHP/**`

## KEVIN'S 5 TASTE-GATE DECISIONS — ALL APPROVED 2026-04-23

Kevin greenlit all 5 defaults with "READY!!!!" per the silence-approves-defaults protocol.

1. **Ed scale 32 → 60 px visible height.** **APPROVED.**
2. **Run cap 180 vs 220 px/s.** **APPROVED START AT 180**, playtest post-Phase-4, bump to 220 if sluggish.
3. **CRT rim-light on Ed (cyan/magenta 1 px pulse for silhouette).** **APPROVED subtle.**
4. **Byte ceiling raise 300 → 350 KB.** **APPROVED** (358,400 B hard cap).
   - **Gate 4b (2026-04-24)**: second raise 350 → 400 KB. **APPROVED** (409,600 B new hard cap). Rationale: Phase 4 + Phase 5 both overshot estimates (11× and 12× respectively), leaving 5,066 B runway vs Phase 6 sprite estimate 8–12 KB. Paired with authorized pre-Phase-6 trim (recover 4–8 KB from Phase 4 or 5 with zero behavior change) to give Phase 6 + Phase 7 comfortable margin.
5. **Defer hub / RPS bosses / new enemies / rideables / setpieces to W11+.** **APPROVED DEFER.**

Kevin retains mid-sprint override at any checkpoint via `GATE N <override>`.

## DEFINITION OF DONE (WEEK 10)

- [x] Kevin has ruled on all 5 taste-gates (all defaults APPROVED 2026-04-23)
- [ ] Codex has run all 7 phases GREEN
- [ ] `node build.js` ≤ 358,400 B (350 KB ceiling) — or ≤ 307,200 B (300 KB) if Gate 4 held
- [ ] `node scripts/check_save_schema.js` pass
- [ ] `node scripts/verify_art_assets.mjs` pass
- [ ] `node --test tests/rebuild_logic.test.mjs` — 8–10 new W10 tests added; full suite GREEN (≥53 tests)
- [ ] Autoplay `orientation` / `benefits` / `rasta` all `determinism: MATCH` + `passed: true` under new state machine
- [ ] Sacred-constraint sweep clean: zero `Math.random`, zero `=>`/`let`/`const`/backticks in new modules, zero `JUMP_VELOCITY`/`GRAVITY` mutations
- [ ] 3 Kevin checkpoints passed (after Phase 2, Phase 4, Phase 6)
- [ ] `ACTIVE/docs/W10_RETROSPECTIVE.md` authored
- [ ] Reviewer pass GREEN on byte budget + determinism + sacred constraints + tone discipline
- [ ] Kevin final taste-gate: the suit **wears him**

## CHECK-IN CADENCE

- After Phase 2 (state machine landed) → Kevin checkpoint: build bytes + autoplay reports + 30s W1 capture for visual parity
- After Phase 4 (forgiveness + hit-stop) → Kevin checkpoint: playtest in browser, "does the suit feel worn?"
- After Phase 6 (60 px sprite) → Kevin checkpoint: visual taste-gate on new Ed sprite per world
- Sprint close → full retrospective + reviewer hand-back

## KEVIN-GATED ACTIONS (NEVER AUTONOMOUS)

- Pushing to `main` / deploying to Pages
- Ceiling raise approval (Gate 4)
- Save-schema v3 or any save-shape change
- Adding new worlds, enemies, scoring, or save fields (all W11+)
- Any image regen beyond the Ed sprite sheet
- Moving the launch window (2026-05-29)
- Any rule in the sacred-constraint list

## ARTIFACTS TO CONSUME

- `ACTIVE/docs/CEHP_LAUNCH_ARC.md` — **5-week launch arc (W10→W14 to 2026-05-29); school-hours autonomy protocol; file lane reference**
- `ACTIVE/docs/W10_REDESIGN_SPRINT.md` — **master sprint doc (Codex handoff JSON + numeric constants block + phase detail + byte budget + gate decisions)**
- `~/Downloads/W10 REDESIGN SPRINT DOC.md` — raw 7-AI research dump (source material, not authoritative)
- `ACTIVE/docs/W9_RETROSPECTIVE.md` — prior sprint ledger (art + readability pass)
- `.codex/CEHP/status.md` — authoritative current state
- `ACTIVE/game/src/` — source tree (Codex touches `src/04–07`, `50_forms`, `60_enemies`, `85_lens`, `89_ed_perform`, `91_scenes`)
- `ACTIVE/game/build.js` — single-file concat
- `ACTIVE/game/tests/rebuild_logic.test.mjs` — test suite (8–10 new W10 tests land here)

## REVIEWER FOCUS (EACH PHASE)

- Sacred-constraint sweep on every touched file (ES5, zero `Math.random`, save shape, `JUMP_VELOCITY`+`GRAVITY` untouched, no new enemies/worlds)
- Determinism check: autoplay `determinism: MATCH` on all 3 worlds after every phase
- Tone check: does Ed feel like a worker in a suit, or did we drift into MMX-superhero territory? Meta Muse's three false victories are the guardrails.
- Byte-budget diff per phase; cumulative vs 350 KB ceiling
- State-machine correctness: every cancel obeys the matrix; no state leaks; fixed-timestep accumulator deterministic under replay

## NEXT STEPS (POST-W10)

- If W10 GREEN + Kevin "the suit wears him" GREEN → consider W11 candidates from BACKLOG.md (hub macro, new enemies, RPS boss arc, rideables, secret paths, per-world setpieces, Performance Reviews meta-loop, CRT rim-light if Gate 3 deferred)
- Launch readiness re-evaluation against 2026-05-29 calendar
- Push readiness gate (still Kevin-only)
