# W8 — LENS OF RESEARCH SPRINT

> **Status**: Sprint doc staged. Awaits Kevin's W7 close-out + promotion of `NEXT_TASK.md` to `CEHP-REBUILD-W8-LENS-OF-RESEARCH`.
> **Owner role on activation**: Builder (Codex 5.4)
> **Reviewer**: Claude Opus 4.7 at every phase boundary
> **Created**: 2026-04-21 late — after the reviewer-side research synthesis surfaced 6 ranked W8 candidates from the legacy research/guidance docs
> **Predecessor**: W7 Lens-and-Feel Sprint — visual contract (LensKit → LightKit → PropKit → FeelKit → EdKit → AirKit). **W8 converts Kevin's legacy research docs into gameplay doctrine.**
> **Plan of record**: `.claude/plans/mossy-stargazing-sloth.md` (Kevin-approved)
> **Doctrine source**: `ACTIVE/docs/W8_RESEARCH_SYNTHESIS.md`

---

## Sprint Goal

**Make the game read like Mega Man X enemy design, Contra threat budgeting, Rayman camera feel, and Perchtold-2019 benign-humor receipt tone.**

The systems and the visual contract both shipped. The screenshot reads right; the underlying gameplay *loop* still has research-doctrine gaps:

- Enemies don't announce themselves → MMX says they must.
- Encounters are authored room-by-room without a composing layer → Contra says they should be.
- Receipts are neutral across tone → PLOS ONE 2019 says benign reframe heals, worst-case disparagement harms.
- Camera is serviceable but not anticipatory → Rayman says anticipation is the whole game.
- Sign peek/read is narrative-only → synthesis doc says optional exploration must pay rent.

W8 closes all five gaps as a single phased sprint, each phase single-file or single-new-module, each under 1KB of shipped bytes.

**Success test (brutally simple)**: at the end of W8 Kevin should say *"that room felt composed, and the receipt felt like a compliment"*. If both halves true, ship. If either half flat, re-tune.

---

## What Changes (priority order — DO NOT reorder without Kevin)

| # | Item | File(s) | Byte target | Research source | Why this order beats every other |
|---|------|---------|-------------|------------------|----------------------------------|
| 1 | **R03 — Receipt benign-reframe tone bias** | `80_receipts.js` (+ named consts in `01_const.js`) | ~150B | Perchtold et al. 2019 PLOS ONE | Smallest phase. Pure-function determinism risk. Ship alone so deepEqual regressions have exactly one cause. Biggest tone dividend per byte. |
| 2 | **R04 — Rayman camera spec** | `88_feel.js` (+ 7 named consts in `01_const.js`) | ~300B | Rayman doc | Must ship before R01. Apex-bias camera frames airborne telegraph poses — R01 tunes against the camera that exists. |
| 3 | **R01 — Enemy telegraph frames** | `60_enemies.js` | ~600B | Mega Man X doc | Hardest architectural change. Windup/Active/Recovery/Cooldown on all three enemies. Damage gated by active window. Blocking for R02. |
| 4 | **R02 — Archetype taxonomy + Encounter Director** | `60_enemies.js` (archetype field) + new `62_director.js` + `75_world_benefits_runtime.js` (spawn wrap) | ~800B | Contra + MMX doc | Depends on R01 telegraph windows to budget "simultaneous angles." Guardrail at current density (10 enemies); becomes active only if density grows. |
| 5 | **R05 — Curiosity-pays-rent loop** | new `52_curiosity.js` + `8A_air.js` (nudge helper) + `86_light.js` (pulse helper) + `80_receipts.js` (flag read) | ~400B | Game design research synthesis doc | Ships last so its audio/visual reward signature can be tuned explicitly NOT to collide with R01 telegraph pulses in the same 120ms perceptual window. |

**Total ~2,250 bytes.** Phase 0 byte-path decision (see below) gates fit.

---

## Phase 0 — Byte-path Decision (DONE)

**Decision (2026-04-21 late, Kevin-authorized)**: **option (a)** — W8 phases may minify-per-necessity in the style of EdKit (19 lines) and AirKit (20 lines). The W9 "readability restoration" pass is queued to un-minify once a structural byte reduction lands.

**Why this path**: matches the EdKit precedent, respects the 300KB soft ceiling, avoids a multi-session AirKit refactor, and preserves sacred constraints by choice not accident. Readable modules return in W9 once byte pressure relaxes.

---

## What Does NOT Change (sacred constraints — unchanged since W1)

- Single shipped `index.html` artifact. Source stays modular under `ACTIVE/game/src/`.
- ES5 only. No `let`/`const`/arrow/template-literal/spread/destructuring.
- Phaser 3 via CDN. No bundler. No npm packages in the runtime.
- Seeded LCG RNG only — never `Math.random()`. Every telegraph jitter, every director seed, every curiosity scheduler seeded via `ns.makeRNG`.
- `cactusEd_save_v1` contract preserved via v2 migration + archaeological layer. **W8 freeze: no schema changes.**
- `ns.TUNING.JUMP_VELOCITY` and `ns.TUNING.GRAVITY` globals stay un-mutated — run-scoped seams only.
- Ed voice rules hold. Receipt re-tagging does NOT add new strings; only adds a `tone` metadata field.
- Cigarette stays unlit in all W3 paths.
- No predatory retention, daily-login hooks, streak mechanics, monetization, notifications, telemetry.
- No new libraries, no Phaser Lights2D, no WebGL shader pipelines.
- No new disk assets — procedural textures and alpha/scale pose changes only.

---

## What Is Out of Scope (resist the urge)

- New worlds / new enemies / new scoring / new save fields
- New pickup mechanics or new sign copy
- Public Appeals UI (compare seam stays invisible)
- Custom shader pipelines
- Verb-gated cross-world exploration (Rayman's ability-return-to-earlier-area) — deferred to post-launch
- Hand-pixeled final Ed sprite (W8 candidate, but separate from the research-driven five)
- HR Expansion prep (stays post-`PUBLIC_LAUNCH`)
- Domain / DNS / trailer publish / CR pitch send / announce — all remain in `PUBLIC_LAUNCH` backlog item
- Music layer — silence stays the asset

---

## Phase Specs (summary; full detail in the plan file)

### Phase 1 — R03 Receipt benign-reframe tone bias (~150B)
- Edit `80_receipts.js`. Add optional `tone: 'benign'|'neutral'|'malicious'` on `makeFragment`.
- Add `BENIGN_BIAS = 0.35`, `MALICIOUS_BIAS = -0.35` named constants.
- `scoreFragment` additive weight on tone.
- Re-tag existing fragments to ≥55% benign, ≤10% malicious.
- Tests: 3 new (determinism, score delta, optional-field regression guard).
- Kevin taste gate: read 5 receipts before + after; does the after set feel *lighter*?

### Phase 2 — R04 Rayman camera spec (~300B)
- Extend `ns.Feel.updateCamera(scene, delta, ed)` in `88_feel.js`.
- Add: velocity-proportional horizontal lead (clamped ±32px), fall anticipation (drop 28px over 280ms when `velocity.y > 240 && !blocked.down`), jump-apex upward bias (16px over 180ms near apex window).
- Precedence: `onLanding`'s 90ms settle tween wins over fall anticipation via `_cehpFeel.settleActive` flag.
- 7 named constants in `01_const.js`.
- Tests: 3 new (fall anticipation, precedence contract, apex bias).
- Kevin taste gate: 30s play in W2 Benefits; does the jump feel *anticipated*?

### Phase 3 — R01 Enemy telegraph frames (~600B)
- Edit `60_enemies.js` all three factories: Scantron / Pizza / Deductible.
- Unify `spawnPizza.update(player, world, dtMs)` signature (currently missing dtMs).
- Add per-enemy `windupMs / activeMs / recoveryMs / cooldownMs` with archetype defaults.
- Telegraph pose during windup: alpha pulse (0.95→0.45→0.95) + 1px scaleX stretch.
- Damage `intersects()` gated to `activeMs > 0` frames only.
- Seeded jitter `world.enemyRng.int(-40, 41)` ms on windup.
- Tests: 3 new (damage gate, determinism, jitter range).
- Kevin taste gate: W2 wellness-incentive room; do Scantrons feel *announced*?

### Phase 4 — R02 Archetype + Encounter Director (~800B)
- New `ACTIVE/game/src/62_director.js`. Register as `ns.EncounterDirector`.
- Add `opts.archetype` on each spawn factory (Scantron='turret', Pizza='ambusher', Deductible='mobility', 'pressure' reserved).
- Director seams: `prime(scene, worldId, roomId)` / `admit(req)` / `release(enemy)` / `tick(scene, dtMs)`.
- Caps: 15 enemy slots, 8 projectile slots, ≤2 simultaneous telegraphs per 600ms window, per-room budget ≤ authored count.
- Wrap every `ns.Enemies.spawn(...)` at call sites in `75_world_benefits_runtime.js`.
- Tests: 3 new (slot cap, angle cap, determinism).
- Kevin taste gate: negative test — does anything feel *different*? Should not.

### Phase 5 — R05 Curiosity-pays-rent loop (~400B)
- New `ACTIVE/game/src/52_curiosity.js`. Register as `ns.Curiosity`.
- Subscribe to `ns.Events` `sign:peek` + `sign:read`.
- Reward types rotate: environmental (extra paper mote), luminous (sign emissive pulse), receipt (`runState.curiosityPays` flag read by `scoreFragment`).
- **Non-duplication contract**: MUST NOT bump `ns.Axes.curiosity` — `10_axes.js:76` already handles that.
- Scheduler fires reward `now + rng.int(3000, 5000)` ms after subscription event.
- New thin helpers: `ns.Air.nudgePaperMote(scene)` + `ns.Light.pulseNearestSign(scene, signId, ms)`.
- Tests: 3 new (reward timing, non-duplication, determinism).
- Kevin taste gate: W1 Orientation for 2min with deliberate sign peeks; does the game *quietly acknowledge*?

---

## Risk Table (cross-cutting)

| Risk | Phase | Mitigation |
|------|-------|------------|
| Byte ceiling exceeded | Phase 0 | Option (a) minification approved 2026-04-21 late |
| `spawnPizza.update` missing `dtMs` breaks R01 timing | Phase 3 | Unify signature in Phase 3 commit; verify all call sites |
| R04 fall-anticipation fights `onLanding` settle tween | Phase 2 | `_cehpFeel.settleActive` flag precedence contract |
| R05 double-counts `curiosity` axis | Phase 5 | Explicit non-duplication contract + regression test |
| Director rejects admit() unexpectedly at current density | Phase 4 | 10 enemies / 0 projectiles / ≤2 windups — admit always true today |
| Receipt tone re-tagging miscalibrates | Phase 1 | ≥55% benign distribution target + Kevin taste gate |
| Phase N determinism breaks Phase N-1 tests | Every phase | Full `rebuild_logic.test.mjs` every phase; deepEqual guards |
| ES5 regression | Every phase | `rg -n 'Math\.random\|=>\|\\blet\\b\|\\bconst\\b'` per new/edited file |
| Save shape bleed | Every phase | `node scripts/check_save_schema.js` per phase |

---

## Verification Matrix (run after every phase; before Kevin taste gate)

1. `cd ACTIVE/game && node build.js` — build succeeds; module count matches expectation.
2. `node scripts/check_save_schema.js` — pass.
3. `bash scripts/verify-cehp.sh` — logic test count increases by the phase's new-test count.
4. `cd ACTIVE/discord && node --test tests/bot_hardening.test.mjs` — 5/5 pass.
5. `node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` — PNG renders at `116994` bytes (unchanged by phases 2/4/5; phase 1 tone field is metadata, must NOT change receipt text).
6. Sacred-constraint grep sweep for the phase's new/edited files.
7. Phase-specific Playwright determinism probe.
8. Build byte count within phase target.

---

## Check-in Cadence (mirrors W7)

**Per phase**:
1. Codex implements phase only. No cross-phase work.
2. Codex runs full local verification matrix.
3. Codex updates `.codex/CEHP/handoff.md` + `changelog.md`.
4. Reviewer (Claude Opus 4.7) runs sacred-constraint sweep + determinism probe + byte check. Issues GREEN or returns with notes.
5. Kevin takes phase-specific taste gate.
6. On Kevin GREEN → next phase. On red → iterate.

**Escalation triggers (stop + ask Kevin)**:
- Any sacred-constraint violation risk.
- Byte overshoot vs phase target by >20%.
- Any determinism test breakage not immediately root-caused.
- Any deviation from phase order (R01→R02→R05 are strictly ordered; R03/R04 swappable on Kevin's taste).

---

## Kevin-Gated Actions (NEVER autonomous)

- Pushing to `main` / deploying to Pages
- Domain purchase + DNS flip (stays deferred)
- Sending the Critical Reflex pitch email
- Publishing the trailer
- Posting any public announcement thread
- Save-schema v3 or any save-shape change
- Adding new worlds, new enemies, or new scoring mechanics
- Public Appeals UI

---

## Artifacts to Consume

- `.claude/plans/mossy-stargazing-sloth.md` — plan of record (Kevin-approved)
- `ACTIVE/docs/W8_RESEARCH_SYNTHESIS.md` — doctrine source (6 ranked candidates, sacred-constraint audit)
- `ACTIVE/docs/FINAL_GAMEPLAN.md` — 25 locked rulings from 2026-04-20
- `ACTIVE/docs/NEXT_TASK.md` — task beacon (source of truth at activation)
- `ACTIVE/game/src/` — existing modules (do not break ES5 discipline)
- `ACTIVE/game/scripts/verify-cehp.sh` — full green suite
- `ACTIVE/game/scripts/check_save_schema.js` — save contract guard
- `.codex/CEHP/status.md` — authoritative current state
- `.codex/CEHP/handoff.md` — top section only

---

## Reviewer Focus (each phase)

- Sacred-constraint sweep (ES5, zero `Math.random`, save shape untouched, `JUMP_VELOCITY/GRAVITY` untouched, no new libs)
- Determinism check: same seed → same telegraph/director/curiosity trajectory
- Tone check: does the still / the reel / the receipt read bureaucratic, not juicy?
- Byte diff inside phase target
- Test additions land green; prior tests stay green
- Non-duplication contracts held (R05 must not bump axes; R04 must not mutate JUMP_VELOCITY)

---

## Post-Sprint Deliverables (W8 GREEN)

- All five modules shipped; one new file each for R02 + R05; edits on R01/R03/R04.
- `ACTIVE/docs/W8_RETROSPECTIVE.md` — five-phase retro + byte delta + benign-tone distribution snapshot + per-phase before/after GIFs.
- Before/after screenshot pairs archived to `ACTIVE/delivery/w8_research/`.
- `NEXT_TASK.md` promoted to W9. Candidate scopes (Kevin picks):
  - W9-Readability: un-minify EdKit/AirKit/W8 modules now that structural byte reduction has happened
  - W9-Opener: execute R06 W1 "opener is a promise" audit with Kevin video + reviewer scorecard
  - W9-HandArt: hand-pixeled final Ed sprite (procedural placeholder retires)
  - W9-Exploration: Rayman-style verb-gated cross-world exploration sketch
- `.codex/CEHP/status.md` + `changelog.md` + `handoff.md` updated per phase.

---

## Scope Guardrails (restated)

W8 is narrow on purpose. Five research gaps, five files, ~2,250 bytes, one sprint. Every hour spent widening the scope is an hour not spent getting Kevin closer to GOAT-level.

If during W8 any tempting adjacency surfaces (new sign copy, Steam screenshots, "one more enemy type"), it goes to `BACKLOG.md`, not the sprint.
