# W10 REDESIGN SPRINT — Unified Synthesis

Date: 2026-04-23
Source: `~/Downloads/W10 REDESIGN SPRINT DOC.md` (raw dump of 7 AI research lanes)
Status: **PROPOSED** — awaiting Kevin taste-gate on 5 tradeoffs before Codex kickoff
Owner on adoption: Codex 5.4 (builder)
Launch target on calendar: 2026-05-29 (5 weeks from today)

---

## Verdict

The 7 lanes agree on more than they disagree. A unified W10 is extractable.

But the research ambition — Hub-and-Spoke Elevator, RPS bosses, 8 new enemies, 3 rideable contraptions, 6 secret paths, full 5-layer parallax, Performance Reviews meta-loop — is an **8+ week build**, not a W10 sprint. If we try to do all of it by 2026-05-29, we ship broken.

So **W10 is the feel pass only**: the code + scale work that makes Ed stop feeling like a rectangle on a stage and start feeling like a worker inside a mascot suit. Everything structural, content-expanding, or boss-redesigning gets queued for **W11+** and re-scoped against what launch actually needs.

This doc is the synthesis + Codex handoff. It is not the backlog. Deferred items live in `BACKLOG.md` after Kevin approves.

---

## One-Line Thesis From Each Lane

| Lane | Thesis |
|---|---|
| **ChatGPT Pro** (character/verbs) | Lock Ed at 60px visible. 18-state machine. Full verb-frame-cancel table. Builder constants block. |
| **ChatGPT Deep Research** (enemies/threats) | Stop tuning pressure with HP. Tune it with concurrency, angle layering, replacement rate, and telegraph compression. Cap decision-grade threats at 5. |
| **Gemini Pro** (aesthetic) | Verbs stay heroic, nouns stay unpleasant. CRT rim-light on Ed for silhouette against muddy backgrounds. |
| **Gemini Deep Research** (structure) | Hub-and-Spoke Elevator with escalating lockout. Kishōtenketsu rhythm per 5-minute stage. RPS boss weakness. |
| **Meta Muse Spark** (phenomenology) | Debt, not tightness. Muffled agency. Industrial chunk. Dread+delight share one wallet. Guard against three false victories. |
| **Mistral** (physics/camera) | Numeric tables for run/jump/dash/camera/parallax/hit-stop/frame budget blended across DKC/MMX/Contra. |
| **DeepSeek** (architecture) | Fixed-timestep accumulator + state machine + input buffer. ~4 KB minified delta. Deterministic under replay. |

---

## Consensus (Adopt In W10)

Every lane that addressed these agreed. No tradeoff required.

### Forgiveness windows
- Coyote time: **100 ms**
- Jump buffer: **100 ms**
- Dash buffer: **83 ms**
- Attack buffer: **83 ms**
- Wall-grace after losing wall contact: **83 ms**
- Wall-stick delay before slipping: **67 ms**
- Variable jump height release window: **180 ms** (multiply upward velocity by **0.60** once)
- Corner forgiveness on head-bonk: **6 px** sideways nudge
- Step-up assist: **6 px** obstacles
- Ledge snap/mantle: **8 px** horizontal × **10 px** vertical
- Grounded grace after leaving moving platform: **83 ms**
- Jump queue on landing: **100 ms** pre-landing → fire on first grounded frame

### Verb set
- Ground dash (no air dash in MVP — ChatGPT Pro line in the sand)
- Double jump
- Wall-slide + wall-jump
- Wall-climb **only on marked climbable surfaces** (not every wall)
- Slide/roll with jump-cancel window in final 100 ms of active
- Crouch (collider drops)
- Diagonal aim (±35° up/down while firing)
- Melee + ranged attacks with cancel matrix

### Feedback
- Squash/stretch on landing (1.12, 0.88 over 83 ms), jump squat (1.08, 0.90 over 50 ms), jump launch (0.92, 1.08), hard skid (1.10, 0.92)
- Hit-stop on damage: **67 ms** player+enemy; melee hit **50 ms**; projectile hit **17 ms** target-only
- Landing dust: 1 puff soft, 2 puffs medium/hard with 17 ms + 67 ms timing
- Camera lead horizontal: `Math.min(150, Math.abs(vel.x) * 0.45)`
- Camera settle on landing: soft 0, medium 2 px dip / 33 ms, hard 4 px dip / 50 ms
- I-frames after damage: **900 ms** with 50/50 blink cadence

### Architecture
- **Fixed-timestep accumulator** at 60 Hz physics, interpolated render
- **State machine** with explicit entry/exit/tick/transition per state
- **Input buffer** aged by frame count (not wall clock) — deterministic under Playwright replay
- **Cancel matrix** declared as data, not scattered in imperative code

### Sacred (unchanged)
- `cactusEd_save_v1` schema preserved
- `ns.TUNING.JUMP_VELOCITY` + `ns.TUNING.GRAVITY` globals **not mutated**
- Seeded LCG only, zero `Math.random`
- ES5 only in shipped runtime
- Single HTML ship, no build step, Phaser 3 CDN
- Procedural fallback behind every art asset

---

## Tensions — Resolved

These are the places where the 7 lanes disagreed. I picked, and I'm telling you why.

### 1. Ed visible height: **60 px** (ChatGPT Pro) over 81 px (pure MMX)
- 60 px = 16.6% viewport height, blended from DKC chunk (45%) + Contra readability (35%) + MMX presence (20%)
- 81 px reads as "cyber-ninja," which dissolves the "burdened worker in a stupid mascot suit" identity
- Current Ed is 32 px (8.9% viewport) — doubles the visible body without touching collision math beyond a split

### 2. Run cap: **180 px/s** (ChatGPT Pro) over 280 px/s (Mistral)
- Mistral's 280 is a clean DKC/MMX/Contra blend aimed at pure action feel
- ChatGPT Pro's 180 respects Meta Muse's "muffled agency" thesis: the suit slows the human inside
- Pick 180 for first build. If it feels sluggish in playtest, bump to 220 — do not exceed 240 without re-opening the tone question

### 3. Dash speed: **260 px/s** (ChatGPT Pro) over 700 px/s (Mistral)
- Mistral's 700 is MMX Zero superhero. 260 is a desperate worker-shove.
- Same tone argument as above. Dash is meant to feel earned, not like a teleport.

### 4. Air dash: **NO for W10** (ChatGPT Pro line in the sand)
- Air dash + double jump + wall-jump is the full MMX traversal grammar — overkill and pushes level rework costs
- Ground dash + dash-jump + double jump + wall-jump is enough to carry a DKC-tier traversal arc

### 5. `JUMP_VELOCITY` + `GRAVITY`: **do not retune base values**
- Retuning the base constants cascades into every existing W1/W2/W3 room layout
- Instead: add variable jump (cut ratio 0.60 applied once in first 180 ms), apex bias (gravity × 0.9 for 80 ms at apex), fall bias (gravity × 1.12 after apex). These are deltas layered on top of the sacred globals, not replacements.

### 6. Parallax layers: **2 in W10, 5 in W11+**
- Mistral's 5 layers × 640×360 footprint = real byte cost for layer art
- W10 ships 2 layers (midground + near) on top of existing backdrops — costs ~2 KB code + whatever reused art we already have
- 5-layer pass is its own W11 art sprint

### 7. Collectibles ("Receipts" / "Performance Reviews" / DOCKET integration)
- "Receipts" as K-O-N-G equivalent is the right diegetic fit, and DOCKET already exists (`81_docket.js`)
- BUT in-level receipt collectibles are a **content design pass**, not a feel pass. Defer to W11+.
- W10 does not add collectibles.

### 8. Macro structure (Hub-and-Spoke Elevator)
- Gemini Deep Research's dynamic-lockout elevator is a beautiful redesign and likely the right long-term macro
- It's also a full 2-week sprint on its own (new scene, new router, dynamic boss weakness wiring, 3 reshuffled world states)
- **Defer to W11.** W10 keeps the existing linear W1 → W2 → W3 router. Post-launch we can re-open macro.

---

## Tradeoffs Flagged For Kevin's Taste-Gate

These 5 need a Kevin decision before Codex starts. Each has a default I'll honor if you say "ship it" without overriding.

### Gate 1 — 60px Ed scale (doubles visible body size)
- **Default: APPROVE**
- **Why it matters**: touches every room layout visually (not functionally — colliders are separate). Might make existing rooms feel smaller. Might require 1–2 rooms to be tuned for new Ed footprint.
- **Pushback path**: stay 32 px → the "brochure feel" isn't fully fixed. Intermediate: 48 px (14.3% viewport, halfway).

### Gate 2 — Run cap 180 vs 220 px/s
- **Default: START AT 180**, bump to 220 after first playtest if sluggish
- **Why it matters**: 180 preserves "muffled agency." 220 is closer to DKC chunk. Above 240 Ed starts feeling like a Mario/MMX character, not a trapped worker.
- **Pushback path**: pick a number you want locked from day one.

### Gate 3 — CRT rim-light on Ed (Gemini Pro recommendation)
- **Default: APPROVE (subtle, 1 px cyan/magenta pulse)**
- **Why it matters**: this fixes silhouette readability against muddy W9 backgrounds. Cheap to ship (~400 B). Risk: might read as "too video-game" and break the analog-horror photography.
- **Pushback path**: skip the rim-light and trust Ed's larger 60 px footprint alone to solve readability.

### Gate 4 — Byte ceiling raise: 300 KB → 350 KB
- **Default: APPROVE**
- **Why it matters**: state machine (~1.5 KB) + input buffer (~0.8 KB) + accumulator (~0.6 KB) + cancel config (~0.5 KB) + squash/stretch (~0.3 KB) + camera lead/settle (~0.5 KB) + diagonal aim (~0.4 KB) + wall game (~0.6 KB) + slide/roll (~0.4 KB) ≈ **5.5 KB code**. Ed 32→60 sprites (18 animation states at budget counts) ≈ **8–12 KB PNG**. Total W10 estimate: **301–305 KB**. Current runway is only 12 KB. No raise = cut scope.
- **Pushback path**: keep 300 KB, cut: (a) squash/stretch (ship ~2 KB lighter), or (b) skip the 60 px sprite redraw and stay at 32 px with just the code feel-pass.

### Gate 5 — Defer hub/RPS/new-enemies to W11+
- **Default: APPROVE DEFER**
- **Why it matters**: 2026-05-29 launch means 5 weeks total. Feel pass + verify + 2 buffer weeks ≈ the full budget. Adding hub restructure or 8 new enemies blows launch.
- **Pushback path**: move launch to 2026-06-26 (+4 weeks) and expand W10 scope to cover hub + enemies.

---

## W10 Execution Plan (Codex 5.4, 7 phases, ~7–10 working days)

Ordered so each phase closes green before the next opens. Kevin-paced check-ins after phases 2, 4, and 6.

### Phase 1 — Architecture spine (~2 KB)
- New `src/04_fixed_step.js` — accumulator loop, 60 Hz physics, lerp render interpolation, deterministic frame counter
- New `src/05_input_buffer.js` — ring buffer, frame-count aging, consume API
- New `src/06_cancel_matrix.js` — data-driven `{fromState: {input: {window, toState, cooldown}}}`
- Sacred-constraint sweep: zero `Math.random`, zero `=>`/`let`/`const`/backticks, `JUMP_VELOCITY` + `GRAVITY` globals untouched

### Phase 2 — Ed state machine (~1.5 KB)
- New `src/07_ed_state.js` — 18-state machine: idle, run, skid, jump rise, jump apex, jump fall, double jump, dash, wall-slide, wall-jump, wall-climb, crouch, slide, melee, ranged, hurt, death, respawn
- Entry/exit/tick/transition per state
- Priority stack matches ChatGPT Pro spec (death > hurt > mantle > slide > dash > melee > ranged > wall-jump > wall-slide > double-jump > jump rise > fall > land > crouch variants > skid > run > idle)
- **Kevin checkpoint after Phase 2**: autoplay still deterministic on all 3 worlds, Ed still completes existing rooms

### Phase 3 — Verb set (~2 KB)
- Ground dash (260 px/s, 167 ms active, 100 ms recovery, 50 ms windup)
- Double jump (82% impulse, 33 ms windup, 67 ms recovery)
- Wall-slide + wall-jump (clamp fall to 40%, away impulse 115% run cap, vertical 92% full jump)
- Wall-climb only on marked `scene.physics.world.setBoundsCollision({climb:true})` surfaces
- Slide/roll (217 ms active, jump-cancel in final 100 ms, preserve 108% run speed on cancel)
- Diagonal aim (±35° while firing, overlays not full redraws)

### Phase 4 — Forgiveness + feel (~1.5 KB)
- All consensus forgiveness windows (coyote, jump/dash/attack buffers, wall grace, corner forgive, step-up, ledge-snap)
- Variable jump height (cut ratio 0.60 on first release in 180 ms window)
- Apex bias + fall bias as deltas on `ns.TUNING.GRAVITY` during flight (do not mutate the global)
- Hit-stop on damage / melee / projectile
- **Kevin checkpoint after Phase 4**: playtest in browser, does the suit feel worn?

### Phase 5 — Camera + squash/stretch (~1 KB)
- Camera horizontal lead `Math.min(150, Math.abs(vel.x) * 0.45)`
- Vertical lead 140 px falling / 90 px apex with tween durations
- Landing settle dip (soft 0 / medium 2 px / hard 4 px)
- Runtime scale events: run-start burst, hard skid, jump squat, jump launch, double jump pop, landing squash, wall-jump push-off
- Camera shake on strong hit (6 px, 70 ms, 14 Hz) — seeded RNG only

### Phase 6 — Ed sprite scale 32→60 (art work, ~8–12 KB PNG)
- Regenerate Ed's sprite sheet at 48×64 canvas (60 px visible height)
- 18 animation states at ChatGPT Pro budget counts (3+6+2+1+1+2+0+2+3+1+2+2+1+0+1+3 = ~30 frames)
- Collider split: 22×46 standing, 22×30 crouch, 24×24 slide
- Optional: CRT rim-light shader in `src/85_lens.js` (Kevin Gate 3 decision)
- **Kevin checkpoint after Phase 6**: visual taste-gate on new Ed sprite before Phase 7 starts

### Phase 7 — Verify + byte audit (~0 KB)
- `node build.js` → target ≤ 350 KB ceiling
- `node scripts/check_save_schema.js` pass
- `node scripts/verify_art_assets.mjs` pass
- `node --test tests/rebuild_logic.test.mjs` — add 8–10 new W10 tests (state machine transitions, input buffer aging, cancel windows, forgiveness windows, hit-stop frame counts, fixed-timestep determinism)
- Playwright autoplay: all 3 worlds MATCH + OK under new state machine
- Sacred-constraint sweep: zero `Math.random`, zero `=>`/`let`/`const`/backticks, `JUMP_VELOCITY` + `GRAVITY` globals untouched

### Out of scope for W10
- No new enemies (existing scantron / deductibleWeight / telegraph-windup keep their art + timing)
- No new worlds / scenes / rooms
- No new art beyond Ed sprite sheet
- No hub elevator, no RPS boss weakness, no Performance Reviews, no Corporate Assets temporary verbs, no rideable contraptions, no secret paths
- No save-schema change
- No push to `main`

---

## Byte Budget Plan

Current: **287,826 B built / 12,162 B runway** under 300 KB ceiling.

| Line item | Estimate |
|---|---|
| Fixed-step + input buffer + cancel matrix | +2.0 KB |
| 18-state machine | +1.5 KB |
| Verb set (dash, double jump, wall game, slide) | +2.0 KB |
| Forgiveness windows + hit-stop | +1.5 KB |
| Camera lead + squash/stretch | +1.0 KB |
| Diagonal aim overlays | +0.4 KB |
| 8–10 new W10 tests | +1.0 KB |
| Ed 60 px sprite sheet (30 frames, 48×64, compressed PNG) | +8–12 KB |
| **Net W10 added** | **~17–21 KB** |
| **Projected final build** | **~305–309 KB** |
| **Ceiling raise required** | **300 → 350 KB** |

If Kevin rejects the ceiling raise, cut path in order: (a) skip 60 px sprite, stay at 32 px code-only feel pass (~−10 KB saved, but only partial "brochure" fix); (b) skip squash/stretch (~−2 KB saved); (c) skip diagonal aim overlays (~−0.4 KB saved).

---

## W11+ Backlog (Deferred — Separate Sprints)

None of these are killed. They're queued to land in `ACTIVE/docs/BACKLOG.md` as discrete tickets after Kevin approves this synthesis.

| Item | Source | Est | Launch-blocker? |
|---|---|---|---|
| Hub-and-Spoke Elevator macro + dynamic lockout | Gemini DR | 10–14 d | No |
| 8 corporate-horror enemies (Sycophant, Time-Thief, Severance, CC'd, PIP, Compliance Auditor, Deadline Wraith, Performance Review Seraph) | Gemini Pro + ChatGPT DR | 7–10 d | No |
| 3 rideable contraptions (Pneumatic Tube, Floor Buffer, Document Shredder) | Gemini Pro | 5–7 d | No |
| 6 secret paths (2 per world) | Gemini DR | 7–10 d | No |
| Full 5-layer parallax | Mistral | 3–5 d | No |
| Receipts-as-K-O-N-G in-level collectibles | Gemini DR | 3–5 d | No |
| Performance Reviews → DOCKET meta-loop | Gemini DR | 5–7 d | No |
| Corporate Assets (Staple Gun, Office Chair, Shredder) temporary verbs | Gemini DR | 5–7 d | No |
| 3 per-world signature setpieces (Trust Fall, Open Concept, Supply Chain) | Gemini Pro | 5–7 d each | No |
| RPS boss weakness arc (Floor Manager → HR Director → VP → CEO/Entity) | Gemini DR | 7–10 d | No |
| Cap revision: enemies 15 / projectiles 10–12 / angles 2→3 spike | ChatGPT DR | 2 d | No |

None of these ship in W10. All of them become candidates for W11, W12+ sprints after launch or against a later launch window.

---

## Sacred Constraints — Non-Negotiable In W10

Codex must hold all of these. Any violation is a full stop and hand-back.

1. `cactusEd_save_v1` schema untouched (v2 migration exists; no v3)
2. `ns.TUNING.JUMP_VELOCITY` and `ns.TUNING.GRAVITY` globals not mutated
3. Seeded LCG only, zero live `Math.random` calls in `src/**` (the warning comment on `02_rng.js:1` is the only acceptable string match)
4. ES5-only in shipped runtime: zero arrow functions (`=>`), zero `let`/`const`, zero template literals (backticks), zero `class` keyword
5. Single HTML ship — `index.html` must still build via `node build.js` into one concatenated file
6. Phaser 3 via CDN — no bundler, no npm runtime deps, no transpiler step
7. Procedural fallback behind every art asset (`scene.textures.exists(key)` guard before use)
8. `COUNTEREEIT` remains canonical only on the seal + `paper_expired_id` callback
9. `cactus_ed_in_game_sprite.png` stays HOLD until Kevin explicitly unholds
10. No push to `main`
11. File lane: Codex owns `src/**`, `art/**`, `index.html`, `tests/**`. Reviewer owns `docs/**`, `scripts/**`, `.codex/CEHP/**`.

---

## Codex Handoff (Paste-Ready Block)

Copy everything between the two `---CODEX-HANDOFF---` fences below into Codex chat to kick off W10.

---CODEX-HANDOFF---

```json
{
  "task_id": "CEHP-REBUILD-W10-FEEL-PASS",
  "title": "W10 feel pass — DKC×MMX×Contra verbs, forgiveness, state machine, 60px Ed",
  "task_owner_role": "Codex 5.4",
  "next_handler_role": "Kevin (checkpoint after Phase 2, Phase 4, Phase 6) then Reviewer (verify matrix)",
  "deadline": "2026-05-03 (10 working days)",
  "launch_calendar_lock": "2026-05-29",
  "status": "ACTIVE",
  "read_order": [
    "CLAUDE.md",
    "ACTIVE/docs/W10_REDESIGN_SPRINT.md",
    ".codex/CEHP/status.md (top entry only)",
    "ACTIVE/game/src/01_const.js",
    "ACTIVE/game/src/02_rng.js",
    "ACTIVE/game/src/50_forms.js (current Ed input handler)",
    "ACTIVE/game/src/89_ed_perform.js",
    "ACTIVE/game/src/91_scenes.js",
    "ACTIVE/game/build.js",
    "ACTIVE/game/tests/rebuild_logic.test.mjs"
  ],
  "do_not_touch": [
    "ACTIVE/game/art/screen_unmasked_reveal.png",
    "ACTIVE/game/art/ui_locker.png",
    "ACTIVE/game/art/crest_orientation_bureau.png",
    "ACTIVE/game/art/crest_benefits_enrollment.png",
    "ACTIVE/game/art/env_w2_benefits_enrollment.png",
    "ACTIVE/game/art/seal_counterfeit_educational_org.png",
    "ACTIVE/game/art/cactus_ed_in_game_sprite.png (HOLD)",
    "ACTIVE/docs/W9_RETROSPECTIVE.md (historical)",
    ".codex/CEHP/status.md (reviewer-lane only)",
    "ns.TUNING.JUMP_VELOCITY global",
    "ns.TUNING.GRAVITY global",
    "cactusEd_save_v1 schema"
  ],
  "sacred_constraints": [
    "ES5-only: no arrow fns, no let/const, no backticks, no class keyword",
    "Seeded LCG RNG only — zero Math.random in shipped src/**",
    "cactusEd_save_v1 contract frozen (no v3 in W10)",
    "ns.TUNING.JUMP_VELOCITY and ns.TUNING.GRAVITY globals never mutated (layer deltas on top)",
    "Single-HTML ship via node build.js — no bundler, no npm runtime deps",
    "Procedural fallback behind every art asset via scene.textures.exists(key)",
    "COUNTEREEIT canonical only on seal + expired-ID callback",
    "No push to main",
    "File lane: Codex owns src/art/index.html/tests; Reviewer owns docs/scripts/.codex"
  ],
  "kevin_pre_approved_gates": [
    "60 px Ed visible height (48x64 canvas, 22x46 standing collider)",
    "180 px/s run cap, bump-to-220 only after first playtest",
    "CRT rim-light on Ed: TBD (default APPROVE subtle, Kevin to confirm)",
    "Ceiling raise 300 -> 350 KB (required for 60 px sprite sheet)",
    "Defer hub/RPS/new-enemies to W11+ (do not in-scope)"
  ],
  "phases": [
    {
      "phase": 1,
      "name": "Architecture spine",
      "files_new": ["src/04_fixed_step.js", "src/05_input_buffer.js", "src/06_cancel_matrix.js"],
      "est_bytes": 2048,
      "est_days": 1,
      "acceptance": "Fixed-timestep accumulator runs physics at 60 Hz with lerp render. Input buffer ages by frame count. Cancel matrix is data-driven. Existing W1/W2/W3 autoplay still MATCH+OK.",
      "verify_commands": [
        "cd ACTIVE/game && node build.js",
        "cd ACTIVE/game && node scripts/check_save_schema.js",
        "cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs",
        "cd ACTIVE/game && node scripts/autoplay.mjs --world orientation",
        "cd ACTIVE/game && node scripts/autoplay.mjs --world benefits",
        "cd ACTIVE/game && node scripts/autoplay.mjs --world rasta"
      ]
    },
    {
      "phase": 2,
      "name": "Ed state machine (18 states)",
      "files_new": ["src/07_ed_state.js"],
      "files_modified": ["src/50_forms.js", "src/89_ed_perform.js"],
      "est_bytes": 1536,
      "est_days": 1.5,
      "acceptance": "18-state machine drives Ed. Priority stack matches ChatGPT Pro spec. Autoplay still deterministic MATCH+OK on all 3 worlds. Ed completes existing rooms at equivalent feel (before new verbs land).",
      "kevin_checkpoint": true,
      "checkpoint_prompt": "Build byte count, autoplay reports on all 3 worlds, one 30-second Playwright recording of W1 opener for visual parity check."
    },
    {
      "phase": 3,
      "name": "Verb set",
      "files_modified": ["src/07_ed_state.js", "src/50_forms.js", "src/89_ed_perform.js"],
      "est_bytes": 2048,
      "est_days": 1.5,
      "acceptance": "Ground dash (260 px/s, 167 ms active), double jump (82% impulse), wall-slide+wall-jump (40% fall clamp, 115% run cap away impulse), wall-climb on marked surfaces only, slide/roll with jump-cancel in final 100 ms, diagonal aim +/-35 degrees. No air dash. No physics global mutation."
    },
    {
      "phase": 4,
      "name": "Forgiveness + hit-stop",
      "files_modified": ["src/07_ed_state.js", "src/05_input_buffer.js", "src/60_enemies.js"],
      "est_bytes": 1536,
      "est_days": 1,
      "acceptance": "Coyote 100 ms, jump/dash/attack buffers 100/83/83 ms, wall grace 83 ms, wall stick 67 ms, variable jump cut-ratio 0.60 in 180 ms window, corner forgive 6 px, step-up 6 px, ledge snap 8x10 px, jump queue 100 ms, moving-platform grace 83 ms, hit-stop 67/50/17 ms by class, i-frames 900 ms with 50/50 blink.",
      "kevin_checkpoint": true,
      "checkpoint_prompt": "Playtest in browser. Does the suit feel worn? Does it feel like debt, not tightness?"
    },
    {
      "phase": 5,
      "name": "Camera + squash/stretch",
      "files_modified": ["src/85_lens.js", "src/89_ed_perform.js", "src/91_scenes.js"],
      "est_bytes": 1024,
      "est_days": 1,
      "acceptance": "Camera horizontal lead Math.min(150, |vel.x| * 0.45). Vertical lead 140 px falling / 90 px apex with tweens. Landing dip scales with fall class (0/2/4 px). Runtime scale on run-start, skid, jump squat, jump launch, double jump pop, landing squash, wall-jump push-off. Camera shake on strong hit (6 px, 70 ms, 14 Hz) uses seeded LCG."
    },
    {
      "phase": 6,
      "name": "Ed sprite scale 32 to 60 px",
      "files_new": ["art/ed_sheet_60px.png (or equivalent tiled sheet)"],
      "files_modified": ["src/89_ed_perform.js", "src/91_scenes.js", "scripts/verify_art_assets.mjs"],
      "est_bytes": 10240,
      "est_days": 2,
      "acceptance": "48x64 canvas sprite, 22x46 standing collider, 22x30 crouch, 24x24 slide. ~30 frames across 18 states (ChatGPT Pro budget counts). Collider split separate from render. All 3 worlds visually still land. Procedural fallback still works if sprite fails to load.",
      "kevin_checkpoint": true,
      "checkpoint_prompt": "Visual taste-gate on new Ed sprite before Phase 7 verify. Screenshot per world."
    },
    {
      "phase": 7,
      "name": "Verify + byte audit + new tests",
      "files_modified": ["tests/rebuild_logic.test.mjs"],
      "est_bytes": 1024,
      "est_days": 1,
      "acceptance": "node build.js <= 350 KB. All existing tests pass. 8-10 new tests covering state machine transitions, input buffer aging, cancel windows, forgiveness windows, hit-stop frames, fixed-timestep determinism. Autoplay MATCH+OK all 3 worlds. Sacred constraint sweep clean.",
      "verify_commands": [
        "cd ACTIVE/game && node build.js",
        "cd ACTIVE/game && wc -c index.html",
        "cd ACTIVE/game && node scripts/check_save_schema.js",
        "cd ACTIVE/game && node scripts/verify_art_assets.mjs",
        "cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs",
        "cd ACTIVE/game && node scripts/autoplay.mjs --world orientation",
        "cd ACTIVE/game && node scripts/autoplay.mjs --world benefits",
        "cd ACTIVE/game && node scripts/autoplay.mjs --world rasta"
      ]
    }
  ],
  "numeric_constants_block": {
    "ED_RENDER_H": 60,
    "ED_FRAME_W": 48,
    "ED_FRAME_H": 64,
    "ED_BODY_W": 22,
    "ED_BODY_H": 46,
    "ED_CROUCH_H": 30,
    "ED_SLIDE_W": 24,
    "ED_SLIDE_H": 24,
    "RUN_CAP": 180,
    "WALK_CAP": 95,
    "GROUND_ACCEL": 1800,
    "GROUND_DECEL": 1600,
    "TURN_DECEL": 2600,
    "DASH_SPEED": 260,
    "DASH_ACTIVE_MS": 167,
    "DASH_RECOVERY_MS": 100,
    "DASH_WINDUP_MS": 50,
    "DOUBLE_JUMP_IMPULSE_RATIO": 0.82,
    "CLIMB_UP_SPEED": 90,
    "CLIMB_DOWN_SPEED": 110,
    "PROJECTILE_SPEED": 420,
    "PROJECTILE_MAX": 3,
    "PROJECTILE_REFIRE_GROUND_MS": 117,
    "PROJECTILE_REFIRE_AIR_MS": 133,
    "COYOTE_MS": 100,
    "JUMP_BUFFER_MS": 100,
    "DASH_BUFFER_MS": 83,
    "ATTACK_BUFFER_MS": 83,
    "WALL_GRACE_MS": 83,
    "WALL_STICK_MS": 67,
    "JUMP_RELEASE_WINDOW_MS": 180,
    "JUMP_CUT_RATIO": 0.60,
    "APEX_GRAVITY_MULT": 0.90,
    "APEX_DURATION_MS": 80,
    "FALL_GRAVITY_MULT": 1.12,
    "AIR_ACCEL_RISE_RATIO": 0.70,
    "AIR_ACCEL_FALL_RATIO": 0.85,
    "AIR_BRAKE_RATIO": 0.45,
    "TAKEOFF_X_KEEP": 0.92,
    "DOUBLEJUMP_X_KEEP": 0.90,
    "DASHJUMP_X_KEEP_EARLY": 1.00,
    "DASHJUMP_X_KEEP_LATE": 0.95,
    "DASHJUMP_EARLY_WINDOW_MS": 83,
    "WALLSLIDE_FALL_RATIO": 0.40,
    "WALLJUMP_AWAY_RATIO": 1.15,
    "WALLJUMP_VERTICAL_RATIO": 0.92,
    "WALLJUMP_HORIZONTAL_COMMIT_MS": 100,
    "SLIDE_ACTIVE_MS": 217,
    "SLIDE_RECOVERY_MS": 100,
    "SLIDE_WINDUP_MS": 33,
    "SLIDE_JUMP_CANCEL_WINDOW_MS": 100,
    "SLIDE_JUMP_SPEED_MULT": 1.08,
    "IFRAMES_MS": 900,
    "IFRAMES_BLINK_ON_MS": 50,
    "IFRAMES_BLINK_OFF_MS": 50,
    "DAMAGE_HITSTOP_MS": 67,
    "MELEE_HITSTOP_MS": 50,
    "PROJECTILE_HITSTOP_MS": 17,
    "CONTROL_LOCK_AFTER_DAMAGE_MS": 133,
    "AIR_CONTROL_RESTORED_MS": 80,
    "LEDGE_SNAP_X": 8,
    "LEDGE_SNAP_Y": 10,
    "STEP_UP_PX": 6,
    "CORNER_FORGIVE_PX": 6,
    "CAMERA_LEAD_MAX_PX": 150,
    "CAMERA_LEAD_VEL_MULT": 0.45,
    "CAMERA_LAND_DIP_SOFT_PX": 0,
    "CAMERA_LAND_DIP_MED_PX": 2,
    "CAMERA_LAND_DIP_HARD_PX": 4,
    "CAMERA_SHAKE_AMPLITUDE_PX": 6,
    "CAMERA_SHAKE_DURATION_MS": 70,
    "CAMERA_SHAKE_FREQ_HZ": 14,
    "IDLE_FIDGET_DELAY_MS": 2800,
    "BYTE_CEILING": 358400,
    "BYTE_CEILING_NOTE": "350 KB = 358,400 B. Raise from 300 KB pre-approved by Kevin per Gate 4."
  },
  "kickoff_verify_matrix": [
    "cd ACTIVE/game && node build.js -- expect 'Built NN modules -> index.html (BYTES bytes)' where BYTES <= 358400",
    "cd ACTIVE/game && wc -c index.html -- expect <= 358400",
    "cd ACTIVE/game && node scripts/check_save_schema.js -- expect 'Rebuild save schema ... checks passed.'",
    "cd ACTIVE/game && node scripts/verify_art_assets.mjs -- expect '32/32 expected assets OK' (or 33/33 if Ed sheet wired)",
    "cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs -- expect tests all pass, count >= 53",
    "cd ACTIVE/game && node scripts/autoplay.mjs --world orientation -- expect determinism MATCH + passed true",
    "cd ACTIVE/game && node scripts/autoplay.mjs --world benefits -- expect determinism MATCH + passed true",
    "cd ACTIVE/game && node scripts/autoplay.mjs --world rasta -- expect determinism MATCH + passed true",
    "rg -n 'Math\\.random' ACTIVE/game/src/ -- expect zero matches beyond the 02_rng.js:1 warning comment",
    "rg -n '=>|\\blet\\s|\\bconst\\s|`' ACTIVE/game/src/0[4-7]_*.js -- expect zero matches (new W10 modules ES5-clean)",
    "rg -n 'TUNING\\.JUMP_VELOCITY\\s*=|TUNING\\.GRAVITY\\s*=' ACTIVE/game/src/ -- expect zero matches"
  ]
}
```

---CODEX-HANDOFF---

---

## Notes For Kevin

**What changed vs. prior W-sprints**: W10 is the first sprint to touch `ns.TUNING.GRAVITY` behavior (as runtime deltas, not mutation of the global). That's a new surface area — Reviewer will watch this closely.

**What you should feel when W10 lands**: the suit wears you. Jump releases early and your velocity gets cut, so you learn to hold for full height. Landing squashes Ed and dips the camera, so a long fall has weight. Dashes don't feel like teleports — they feel like a desperate shove. Missing a jump by 1 frame forgives you because the buffer caught it. Missing a ledge by 6 pixels forgives you because the corner snap caught it.

**What you should NOT feel**: that Ed suddenly plays like Mega Man X. If he does, we overshot — Meta Muse's "false victory 1" — and need to dial back run/dash speed toward the worker end.

**Escalation triggers**: if byte count blows 358,400 during any phase, Codex hands back for re-scope. If autoplay loses determinism at any phase, Codex hands back for immediate root-cause. If any sacred constraint gets violated, full stop.

**Kickoff gate**: 5 taste-gate decisions in the "Tradeoffs Flagged" section. Default-approve path is already encoded in the handoff JSON. Override by replying with any of: `GATE 1 REJECT`, `GATE 2 BUMP TO 220`, `GATE 3 SKIP RIM-LIGHT`, `GATE 4 HOLD CEILING`, `GATE 5 EXPAND W10 TO INCLUDE HUB`. Silence = approve defaults.

---

## Appendix — Source Attribution

Every numeric claim in this doc is cited to one of the 7 source lanes below.

- **ChatGPT Pro** — Builder lock-in constants block; all timing/impulse/ratio numbers; 60 px scale + 48×64 canvas + 22×46 collider; 18-state priority stack; squash/stretch table; micro-behavior windows.
- **ChatGPT Deep Research** — Cap revision logic (enemies 15 / projectiles 10–12 / angles 2→3 spike); telegraph/active/recovery frame budgets; density/pacing recommendations; 8 corporate-horror enemy roster (deferred to W11+).
- **Gemini Pro** — CRT rim-light readability answer; 5 new enemies + 3 rideables (deferred); 3 signature moments per world (deferred); DKC-verb-horror-skin tonal bridge (adopted as design directive).
- **Gemini Deep Research** — Hub-and-Spoke Elevator macro (deferred); Corporate Assets verb-grant (deferred); Kishōtenketsu stage rhythm (adopted as W11+ level-design target); Receipts-as-collectibles + Performance Reviews + DOCKET meta-loop (deferred); RPS boss weakness arc (deferred).
- **Meta Muse Spark** — "Muffled agency" thesis driving run/dash speed resolutions; "debt not tightness" guiding variable jump + forgiveness windows; "industrial chunk vs Nintendo chunk" guiding squash/stretch discipline; three-false-victory guardrail embedded in Gate decisions.
- **Mistral** — Camera lead formula (adopted); parallax ratios (deferred); frame budget per system; hit-stop amplitudes; physics blended tables (partially adopted — ChatGPT Pro values won where they conflicted).
- **DeepSeek** — Fixed-timestep accumulator architecture; state machine skeleton; input buffer frame-count aging; cancel rule matrix pattern; ~4 KB minified code-delta estimate.

End of synthesis.
