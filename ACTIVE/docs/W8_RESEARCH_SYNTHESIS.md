# W8 Research Synthesis — Legacy Doctrine → Rebuild Code

> **Purpose**: Kevin asked, "Is there anything from our legacy research/guidance docs we can add to this game that will absolutely improve it?" This file is the answer: a ranked gap list between the 7 source docs and the current 37-module rebuild runtime.
>
> **Owner at write-time**: Claude Opus 4.7 (reviewer) — 2026-04-21
> **Not a task beacon.** This is a doctrine doc that feeds `BACKLOG.md` W8 items. `NEXT_TASK.md` stays on `CEHP-REBUILD-W7-LENS-AND-FEEL` until Kevin closes W7.
> **Do not start W8 work from this file.** It is a reference the Builder consumes once Kevin promotes a W8 beacon.

---

## Source docs reviewed

1. `CACTUS_ED_GOAT_GUIDE.md` — vision: Celeste-grade movement + Papers-Please voice + Hollow-Knight readability + walk-out ending
2. `game_design_research_synthesis (1).md` — 12 shared-doctrine principles (opener-is-promise, teach-by-doing, reward curiosity quickly, etc.)
3. `contra cgpt dr.md` — threat budget, angle budget, role-clarity silhouette, projectile caps, Encounter Director, HFSM boss states
4. `mega man x cgpt dr.md` — 4 enemy archetypes (Turret/Ambusher/Mobility/Pressure), Windup/Active/Recovery/Cooldown frame structure, 15-slot enemy budget, difficulty from placement
5. `ray-man chat gpt r.md` — glide-as-second-chance-then-removed, camera spec (lead/dead zone/fall anticipation/apex bias), verb-gated exploration, 10 obstacle-sequencing rules
6. `claude_humor_engine_addendum.docx` — **written for Community Chaos Live, not CEHP.** Only tension-before-punchline meta-principle transfers; already honored by the bureaucratic receipt reveal.
7. Perchtold et al. 2019 PLOS ONE — benign humor + positive-reinterpretation correlate with less depression; malicious humor + worst-case comparison correlate with more. **Most load-bearing doc for receipt-engine tone bias.**

## Source vs current code — where we already honor the doctrine

- Celeste mercies (coyote 6f, jump buffer 7f, corner nudge) → `21_movement.js` ✅
- Papers-Please deadpan voice (≤8 words, no `!`) → `41_signs.js` `sanitize()` ✅
- Idle sway + flicker + paper motes → `8A_air.js` ✅
- "Rules before punishment" contradiction gate → `51_contradiction.js` ✅
- Authored receipt pools with world bias + flag seams → `80_receipts.js` ✅
- Ed straight man, deadpan stiffness, cig as visual-only → locked in `FINAL_GAMEPLAN.md` rulings ✅

## Ranked W8 gap list (highest impact first)

Each item lists: research source → diagnosis → seam → estimated byte cost → tone check.

### W8-R01 — Enemy telegraph frames (Windup / Active / Recovery / Cooldown)
- **Source**: Mega Man X doc
- **Diagnosis**: `60_enemies.js` has zero telegraph structure. `spawnScantron` teleports onto the block with no reveal frames. `spawnPizza` bob has no active-window cue. `spawnDeductible` oscillates but gives no pre-hit warning. Research is explicit: "difficulty from placement > stats" requires players to *see the threat before it lands*. Today the threats are invisible until they connect.
- **Seam**: extend enemy factory with `{ windupMs, activeMs, recoveryMs, cooldownMs }` on each spawn. Use existing `ns.makeRNG` for any jitter. Telegraph pose = simple alpha pulse or 1px stretch — no new art.
- **Byte cost**: ~600 bytes additive in `60_enemies.js`.
- **Tone check**: PASS — bureaucratic threats should feel *announced* like an audit notice, not ambushes. Telegraph fits the voice.
- **Verification**: same-seed Playwright run must produce identical windup→active→recovery→cooldown timestamps.

### W8-R02 — Archetype taxonomy + projectile / threat budget
- **Source**: Contra doc + Mega Man X doc
- **Diagnosis**: no classification distinguishes Scantron (turret-ish), Pizza (pressure), Deductible (mobility tax). No per-owner projectile cap. No Encounter Director ticking through budget. Rooms spawn what they spawn; angle-budget and simultaneous-threat rules are not enforced. Research cap is 15 enemy slots + 8 enemy-projectile slots game-wide.
- **Seam**: add `archetype: 'turret' | 'ambusher' | 'mobility' | 'pressure'` on spawn, plus `ns.EncounterDirector` with `budget` per room and `maxAngles: 2`. Build as a single small module `ACTIVE/game/src/62_director.js`.
- **Byte cost**: ~800 bytes for a minimal director; no new art.
- **Tone check**: PASS — composed encounters read "scheduled" (compliance), not chaotic.
- **Verification**: deterministic replay must match slot occupancy counts across seeds.

### W8-R03 — Receipt tone bias toward benign reframe (positive reinterpretation)
- **Source**: Perchtold et al. 2019 PLOS ONE humor paper
- **Diagnosis**: `80_receipts.js` `scoreFragment` weighs axes / lowAxes / tensions / lowTensions / micro / worlds / flags. **It has no tone dimension.** Current fragments mix benign reframe, neutral observation, and occasional worst-case / disparagement. Research is unambiguous: benign humor + positive reinterpretation → less depression; malicious humor + worst-case → more depression. CEHP's entire vision is *bureaucratic comedy that leaves the player lighter*. This doc alignment was not in code.
- **Seam**: add optional `tone: 'benign' | 'neutral' | 'malicious'` field on `makeFragment(...)`. Add weight `BENIGN_BIAS` (e.g., +0.35) in `scoreFragment` when `tone === 'benign'` and `-0.35` when `'malicious'`. Re-tag existing fragments in place (no new lines needed). Worst-case closers either retire or keep with `'malicious'` weight so they fire *rarely*, as spice not staple.
- **Byte cost**: ~150 bytes for the scoring hook. Fragment re-tagging adds ~0 bytes (existing strings, new short field).
- **Tone check**: PASS — this IS the tone. Without it CEHP drifts toward mean comedy.
- **Verification**: same seed, same run, tone-histogram run across 200 generated receipts must favor benign by ≥55%.

### W8-R04 — Rayman camera spec (lead / dead zone / fall anticipation / apex bias)
- **Source**: Rayman doc
- **Diagnosis**: `91_scenes.js` currently does `startFollow(player, true, 0.08, 0.08)` + `setDeadzone(48, 32)` + a small lookahead from FeelKit. Missing: horizontal velocity-proportional lead, fall-anticipation shift (shift camera down 200–400ms when `velocity.y > fallThreshold`), jump-apex bias up (favor upward view near apex). Camera is ~50% of platformer feel; Phaser has the primitives (`setLerp`, `setFollowOffset`, `setDeadzone`) — no new art, no new assets.
- **Seam**: extend FeelKit camera update or add small `ns.Camera` helper. All tuning via named constants in `01_const.js` (no magic numbers).
- **Byte cost**: ~300 bytes.
- **Tone check**: PASS — a slightly leading camera reads *thoughtful*, not arcade-juicy. Keep lerp values gentle.
- **Verification**: Playwright probe — apex frame should bias camera up by ≥N pixels vs falling frame at same y.

### W8-R05 — Curiosity-pays-rent loop (reward optional exploration within N seconds)
- **Source**: game design research synthesis doc
- **Diagnosis**: `41_signs.js` emits `sign:peek` and `sign:read` events. **Nothing listens** for a reward-within-N-seconds callback. Research is explicit: "reward curiosity quickly." Today, peeking a sign costs the player a few seconds and gives them narrative-only payoff. There is no systemic nudge that says "we noticed, have a small thing."
- **Seam**: small `ns.Curiosity` module (`52_curiosity.js`) that subscribes to `sign:peek` + `sign:read` and schedules a lightweight reward inside 3–5s — examples: a bonus `cigaretteLit`-class flag seam, a tiny environmental beat (one extra paper mote from `8A_air.js`), or a `+curiosity` micro-signal into `ns.Axes`. Must NOT mutate save schema and must be deterministic under seed.
- **Byte cost**: ~400 bytes.
- **Tone check**: PASS — feedback stays sub-120ms, no "juice." The system recognizing the peek is itself the reward; no sparkle required.
- **Verification**: same seed + same peek sequence must produce identical curiosity micro-signal counts.

### W8-R06 — "Opener is a promise" W1 first-session audit *(diagnostic only, no code)*
- **Source**: GOAT guide + research synthesis doc
- **Diagnosis**: the doctrine says the first 60s of W1 must (a) teach a verb, (b) promise a second verb, (c) earn one laugh, (d) telegraph the voice. W1 Orientation Bureau has been touched repeatedly since W2/W3 shipped. It has not been re-audited against these four first-session bars since W7 started.
- **Seam**: no code — a Kevin-owned 5-minute video + reviewer scorecard pass. Feeds corrective microtasks into BACKLOG if any of the four bars fail.
- **Byte cost**: 0.
- **Tone check**: N/A — audit only.
- **Verification**: checklist scorecard stored at `ACTIVE/docs/W1_OPENING_AUDIT.md` once run.

### Explicitly deferred (research says yes, but post-launch)

- **Rayman-style verb-gated exploration** (ability-return-to-earlier-area — e.g., W3 tool opens a W1 shortcut). Big design move, multi-world save-schema implication, post-launch.
- **Hand-pixeled final Ed sprite** — already queued in `BACKLOG.md` under W8 candidates; do not duplicate.
- **Music layer** — staying deferred indefinitely per doctrine; silence is the asset.

## Byte budget reality

- Current build: `296,057` bytes (2026-04-22 Phase 5 baseline) → `3,943` bytes headroom vs. 300KB soft ceiling.
- Phase 6 AirKit (already shipped as `8A_air.js`) consumes additional bytes pending Kevin's byte-budget call (minify / raise ceiling / budget-optimize EdKit).
- W8 items 01 + 02 + 03 + 04 + 05 combined estimate: **~2,250 bytes**.
- **Gating reality**: no W8 work begins until Kevin resolves the AirKit byte-budget decision in `status.md`. If path (b) "raise soft ceiling to 310KB" is chosen, all five items fit trivially. If path (a) minify AirKit, 2,250 bytes of W8 still fits within the restored headroom. Path (c) budget-optimize EdKit is the tightest case and may force R01 + R03 + R04 only (highest-impact three), deferring R02 + R05.

## Sacred-constraint audit for all W8 items

| Constraint | R01 | R02 | R03 | R04 | R05 |
|---|---|---|---|---|---|
| ES5 only | ✅ | ✅ | ✅ | ✅ | ✅ |
| Seeded LCG only (no `Math.random`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `cactusEd_save_v1` untouched | ✅ | ✅ | ✅ | ✅ | ✅ |
| `ns.TUNING.JUMP_VELOCITY` / `GRAVITY` read-only | ✅ | ✅ | ✅ | ✅ | ✅ |
| Single-file shipped HTML | ✅ | ✅ | ✅ | ✅ | ✅ |
| No new libraries | ✅ | ✅ | ✅ | ✅ | ✅ |
| No predatory retention / monetization | ✅ | ✅ | ✅ | ✅ | ✅ |
| No Phaser Lights2D / WebGL shader | ✅ | ✅ | ✅ | ✅ | ✅ |

All five pass the sacred-constraint sweep at the design level. Builder must re-verify per implementation.

## Open questions for Kevin (propose-only — reviewer does not decide)

1. **Ordering**: the ranked list is R01 → R05 by *impact*, not necessarily by *dependency*. R03 (receipt tone bias) is independently shippable in a single session and gives the biggest tone dividend for smallest byte cost — a plausible "first W8 strike" if you want a quick win before committing to R01/R02's enemy-kit work.
2. **Scope**: is W8 a single multi-module "Lens of Research" sprint (all five items in one sprint doc), or five independent microtasks gated individually?
3. **R06 audit ownership**: Kevin plays + records video, reviewer scores? Or reviewer plays the live soft-launch and scores it alone?
4. **Deferred verb-gated exploration**: keep deferred, or slot as a W9 candidate to sketch a design doc before HR Expansion work starts?

## What this file is NOT

- It is not a sprint plan. `W7_LENS_AND_FEEL_SPRINT.md` is the sprint plan; W8 gets its own when Kevin promotes a beacon.
- It is not a task beacon. `NEXT_TASK.md` remains the sole activation surface.
- It is not a commitment. The byte costs are reviewer estimates, not Builder measurements.
- It does not supersede `FINAL_GAMEPLAN.md`. Those 25 rulings remain locked.
