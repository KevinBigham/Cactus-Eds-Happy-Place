# W7 — LENS AND FEEL SPRINT

> **Status**: CLOSED 19a1b10 (batched W7-W10 local sync); retained as historical spec.
> **Owner role on activation**: Builder (Codex 5.4)
> **Reviewer**: Claude Opus 4.7 at every phase boundary
> **Created**: 2026-04-21 after soft-launch screenshot review revealed feel/graphics gap
> **Predecessor**: W6 launch week — completed via pivot. The build is live on `kevinbigham.github.io/Cactus-Eds-Happy-Place/` and Kevin is the only player. Domain purchase / trailer publish / CR pitch send all deferred to a later `PUBLIC_LAUNCH` task in `BACKLOG.md`.

---

## Sprint Goal

**Make the screenshot stop reading as programmer art.**

The systems shipped in W1–W5 work. The lens, the light, and the props do not. A player loading the soft-launch URL today sees a flat navy void, an unlit silhouette, two tan placards floating without architecture, and colored squares for pickups. Eight independent AI critiques converged on the same diagnosis: **no value hierarchy, no material hierarchy, no actor performance, no atmospheric depth**.

This sprint delivers the visual contract — lens, light, props, impact, camera, air — so every system already shipped suddenly *reads* as part of an authored bureaucratic-horror world instead of a tech demo with paperwork taped to it.

**Success test (brutally simple)**: Pause the game, take a still. The frame must communicate at a glance: Ed, the route, the living machine, the paperwork object, the single sign. If the still works, the style is propagatable. If not, nothing else matters yet.

---

## What Changes (priority order — do not reorder without Kevin)

| # | Module | What | Why this beats every other order |
|---|--------|------|----------------------------------|
| 1 | **LensKit.js** | Post-FX stack: dither tile + scanline + multiply vignette + roundPixels lock | The lens is load-bearing. Every other change reads stronger through the right lens. Building Ed art before the lens means redrawing Ed twice. |
| 2 | **LightKit.js** | One warm off-screen radial per scene + signs as light sources with seeded flicker | Without light hierarchy nothing has weight. Signs become emissive instead of placards-floating-in-void. |
| 3 | **PropKit.js** | Replace colored-square pickups with paper-prop sprites (clipboard, receipt slip, ticket chit, stamp pad, carbon-copy ghost) + 2-frame flutter | Colored squares actively fight the premise. Same mechanic, much stronger fiction. |
| 4 | **FeelKit.js** | Hit-pause (40-60ms) + 1-2px shake + paper-flutter particles + pitch-varied clack on pickup. Camera lerp 0.08 + 48×32 deadzone + 14-18px look-ahead. Landing squash 80ms. Coyote 6f / buffer 7f / early-release gravity ×1.45 (run-scoped, never mutate `JUMP_VELOCITY`) | Moment-to-moment read. Picking up paperwork should feel like filing, not coin-collecting. Camera lag implies the world is indifferent. |
| 5 | **EdKit.js** | Replace silhouette: 24×32 sprite, 3-value (body / spine highlight / 1px warm rim from sign light), 2-frame idle breathe (~820ms cycle), squash-on-land tween. **No walk cycle yet** — preserve the deadpan stiffness. Eye-dot blink every 5-9s seeded. | A pure-black blob cannot do deadpan comedy. Internal value gives posture and weight without breaking silent-cactus rules. |
| 6 | **AirKit.js** | Seeded fluorescent flicker (4-12s intervals, 80ms drop). Paper-drift motes (4-6 tan 2×3px sprites traversing horizontally over 20-40s, one tumbles end-over-end occasionally). Camera micro-sway ±1px on slow sine when Ed idle >3s. | Stage vs. place. Building should feel like it's existing even when Ed is still. |

---

## What Does NOT Change (sacred constraints — unchanged from W1)

- Single shipped `index.html` artifact. Source stays modular under `ACTIVE/game/src/`.
- ES5 only. No `let`/`const`/arrow/template-literal/spread/destructuring.
- Phaser 3 via CDN — whatever ships with the CDN build is the ceiling. No bundler. No npm packages in the runtime.
- Seeded LCG RNG only — never `Math.random()`. **Every flicker, every dust mote drift, every paper tumble seeded.**
- `cactusEd_save_v1` contract preserved via v2 migration + archaeological layer.
- `ns.TUNING.JUMP_VELOCITY` global never mutated (run-scoped `ed.jumpVelocity` seam only).
- Ed voice: deadpan, ≤8 words per line, no exclamation marks. **Sprite respects voice — no idle fidget, no head-tilt, no walk-cycle personality.**
- Cigarette in W3 stays unlit.
- No predatory retention, daily-login hooks, streak mechanics, monetization, music. **SFX-only audio direction holds: keyboard clack, printer whir, fluorescent buzz, silence.**

---

## What Is Out of Scope (resist the urge)

- New mechanics (no new worlds, no new enemies, no new scoring, no new save fields)
- New content (no more signs, no more sign jokes, no new placards)
- Music layer (the silence is the asset)
- Public-facing Appeals UI (the seam stays invisible)
- Custom WebGL shader pipelines (use TileSprite + BlendMode tricks only — Phaser CDN ceiling)
- Domain purchase / DNS flip / trailer publish / CR pitch send (deferred to `PUBLIC_LAUNCH` backlog item)
- Walk cycle for Ed (deadpan stiffness > expressive personality; revisit only after the lens lands)
- "Just one more system" — every hour spent on a new mechanic this week is an hour not spent fixing what's actually broken

---

## Synthesis from 8 AI Critiques (read once, then trust)

Convergence (≥6/8 agreed):

1. **Flat navy void is THE primary problem.** 8/8 flagged this first. Not "needs more art" — needs material, light, and depth.
2. **Dither + scanline + multiply vignette stack** is the highest-leverage weekend move. 7/8.
3. **Hit-pause (40-60ms) + shake (1-2px) + paper-flutter particles + clack SFX on form pickup** — every single AI proposed some version of this. 8/8.
4. **Replace colored squares with bureaucratic props** (clipboard, receipt slip, stamp pad, ticket chit). 7/8.
5. **Camera lerp + deadzone + look-ahead** (drop the 1:1 follow). 8/8.
6. **Ed needs internal value, not pure silhouette** (rim light + idle breathe, not full redraw). 7/8.
7. **Seeded fluorescent flicker on signs** (every 4-12s). 7/8.
8. **One warm off-screen light per scene** to establish hierarchy. 6/8.
9. **Lock palette + lock resolution + roundPixels** (320×180 or 384×216, pixelArt:true). 6/8.
10. **Mistakes named by ≥4/8**: don't bandage with CRT before fixing hierarchy; don't redraw whole game before fixing the lens; don't add music; don't over-juice with bouncy tweens or long shakes; don't add more signs; don't make Ed expressive (the deadpan stillness is the joke); don't use `Math.random()` for any of it.

The single highest-leverage intervention named by 5/8: **ship the LensKit + one off-screen warm light + one fluorescent flicker pass first.** Once the air reads correctly, every other change reads three times stronger.

---

## Phased Execution Plan

Phases run in order. Codex hits phase boundaries; Claude reviews + signs off + updates docs; Kevin gets a one-liner ping at each boundary.

### Phase 0 — Pre-flight (Claude, ~1h, before Codex starts)

- [ ] Promote `NEXT_TASK.md` to `CEHP-REBUILD-W7-LENS-AND-FEEL`, owner Builder (Codex 5.4)
- [ ] Move W6 deferred items (DNS flip, trailer publish, CR pitch send, public announce) into a single `PUBLIC_LAUNCH` entry in `BACKLOG.md`
- [ ] Roll `.codex/CEHP/status.md` and `.codex/CEHP/changelog.md` to record the soft-launch + W7 pivot
- [ ] Stage this sprint doc as the canonical W7 reference
- [ ] Hand Codex the activation paste block

### Phase 1 — LensKit.js (Codex, 4-6h)

**Files**: new `ACTIVE/game/src/85_lens.js`. Wire from `99_boot.js` after scene init.

**Deliverables**:
- Generate 64×64 4×4-Bayer ordered-dither tile via LCG → `CanvasTexture` at boot. Tile as `TileSprite` over camera, blendMode `MULTIPLY`, alpha 0.18.
- 1px horizontal scanline TileSprite, alpha 0.07, scroll up at 0.4 px/frame.
- Full-screen multiply vignette: radial `Graphics` (center alpha 0, edges alpha 0.55) in deep navy `#08101f`.
- Phaser config: `pixelArt: true`, `roundPixels: true`, `antialias: false`. CSS `image-rendering: pixelated`.
- Lock canonical palette constants (`ns.PALETTE`):
  - `BRUISE_NAVY = 0x0a1220`
  - `COPIER_GRAY = 0x2a2e38`
  - `PAPER_TAN = 0xd4c7a5`
  - `OFF_WHITE = 0xe8e6df`
  - `FLUORESCENT_TAN = 0xf4e2c0`
  - `EXIT_AMBER = 0xe89c3a`
  - `SANCTION_RED = 0x8c3a2f`
  - `INK_BLACK = 0x102611`

**Acceptance**:
- Screenshot before/after diff: navy void becomes a textured printed-paper field
- `verify-cehp.sh` still green
- Zero Math.random calls added (Codex grep before commit)
- New byte count reported

### Phase 2 — LightKit.js (Codex, 4-6h)

**Files**: new `ACTIVE/game/src/86_light.js`. Hooks: scene init + sign render path.

**Deliverables**:
- One off-screen warm radial sprite per scene (256px gradient, `BLEND_MODES.ADD`, depth above background, below characters):
  - World 1 INTAKE: warm tan `#f4e2c0` from screen-right top-third (institutional ceiling fluorescent leak)
  - World 2 BENEFITS: cool desaturated `#a8b8c4` overhead — "wrong on purpose"
  - World 3 RASTA: warm `#e8a868` from screen-left, long shadow direction (warm exit only)
- Sign emissive layer: behind each sign sprite, ADD-blend duplicate at 1.08× scale, tint `#f4e2c0`, alpha 0.32
- Seeded flicker per sign: every 2800–6800ms (LCG-determined per sign), tween alpha to 0.16 for 110ms then back. Once per ~30-60s, 3-stutter "bad flicker" over 300ms.
- **Do not add `Phaser.GameObjects.Light` / `Lights2D` pipeline** — fake everything with ADD/MULTIPLY sprites. (CDN-safe, ES5-safe.)

**Acceptance**:
- Each world's screenshot has a clear lighting source the eye can resolve
- Sign flicker is deterministic across replays (same seed = same flicker pattern)
- No GPU thrashing (Codex confirms FPS held >60 in 60s test)

### Phase 3 — PropKit.js (Codex, 4-6h)

**Files**: new `ACTIVE/game/src/87_props.js`. Replaces colored-square pickup sprites in `50_forms.js`.

**Deliverables**:
- Five new pickup sprite families (16×20 max, palette-locked):
  - **Receipt slip** (replaces generic form pickup) — off-white paper, two faint gray rules, 2px dark clip top
  - **Stamp pad** (replaces health/safety pickup) — square tan pad with red ink centered
  - **Carbon-copy ghost** (replaces appeal seam marker) — translucent paper layered 2px offset
  - **Ticket chit** (replaces checkpoint marker) — tan strip with serial-number dither
  - **Toner cartridge** (replaces hazard marker) — black cylinder with white "TONER" label
- Per-instance LCG-seeded rotation wobble (-1° to +1°) over 3s
- 2-frame flutter idle (no hover bob — flutter, not float)
- Procedural placeholder generation via `RenderTexture` + `Graphics` if final art assets aren't in `ACTIVE/game/art/` yet (Kevin will swap in nano-banana-aided pixel work later)

**Acceptance**:
- Zero colored-square pickups remain in any scene
- Each prop reads at 16×20 against any palette background
- Pickup grammar matches receipt/docket diegesis

### Phase 4 — FeelKit.js (Codex, 3-4h)

**Files**: new `ACTIVE/game/src/88_feel.js`. Wire to `50_forms.js` (pickup), `21_movement.js` (jump/land), `91_scenes.js` (camera).

**Deliverables**:
- **Pickup feedback**: `scene.physics.world.isPaused = true` for 50ms (single tween-driven re-enable). Camera shake 60ms × 0.002 intensity. Spawn 4 white 2×2 paper flecks with seeded velocity.y -20 to -35. Play 'clack' SFX with `rate = 0.95 + rng()*0.1`. Tint world to `#d8d8d8` for 110ms then back.
- **Camera**: `cameras.main.startFollow(player, true, 0.08, 0.08)`, `setDeadzone(48, 32)`, `setLookahead(facing * 14)` (lerped over 180ms on direction change).
- **Landing settle**: when `velocity.y > 200` on ground contact, scale Ed to `1.12, 0.88` for 80ms then ease back. `timeScale = 0` for 35ms then `camera.y += 3px` tween over 90ms QuadOut.
- **Jump feel** (run-scoped only — never mutate `ns.TUNING.JUMP_VELOCITY`):
  - Coyote: 6 frames after leaving ground
  - Buffer: 7 frames before landing
  - Early-release gravity multiplier: ×1.45 when jump key released while `velocity.y < 0`
- **ShakeBudget guard**: max one shake per 800ms, amplitude capped at 6px, no shake during sign-read trigger

**Acceptance**:
- Picking up a form feels like filing paperwork (60ms total feedback window, no celebration)
- Camera drags lazily, doesn't snap
- Coyote/buffer/early-release verifiable via test fixture
- ShakeBudget prevents shake-stacking

### Phase 5 — EdKit.js (Codex, 3-4h)

**Files**: new sprite asset(s) under `ACTIVE/game/art/ed/`, swap in via existing sprite load path. New `ACTIVE/game/src/89_ed_perform.js` for tweens/blink/breathe.

**Deliverables**:
- **Sprite redesign**: 24×32, 3-value
  - Body: `INK_BLACK` `#102611` (cactus-green-as-near-black)
  - Spine highlight: `#26362b` (subtle internal value)
  - 1px warm rim: `#3a3632` at 0.4 alpha on top-left edge (implied sign-light backlight)
- **Idle breathe**: 2 frames (frame B = shoulders drop 1px, pot compresses 1px), 820ms cycle, seeded per-run start phase
- **Eye blink**: dot disappears for 80ms every 5-9s (LCG interval per run)
- **Land squash**: scaleX 1.12 / scaleY 0.88 for 80ms then ease back (already wired in FeelKit but Ed sprite must support the squash without breaking)
- **NO walk cycle yet** — Ed slides during movement (deadpan)
- **NO mouth, no expression, no head-tilt, no fidget**

**Acceptance**:
- Ed reads as a tired employee at 24×32, not a black blob
- Posture is hunched/forward-leaning (1px lean)
- Blink is determinant under same seed
- Sprite work uses generated CanvasTexture (until Kevin hand-pixels final art)

### Phase 6 — AirKit.js (Codex, 2-3h)

**Files**: new `ACTIVE/game/src/8A_air.js`. Wired to scene-update.

**Deliverables**:
- **Paper-drift motes**: 4-6 tan 2×3px sprites, traverse screen horizontally over 20-40s (LCG-seeded per spawn). One in ~20 tumbles end-over-end. Lifespan 25-45s. Max 6 alive.
- **Dust motes confined to light cones**: 18 max alive, lifespan 6000-9000ms, alpha 0.04-0.07, blend ADD. Spawn only within 160px of a sign or warm light.
- **Camera micro-sway**: when Ed idle >3s, camera drifts ±1px on slow sine (period ~4s). Disable on input.
- **Global flicker beat**: every 7000-14000ms (LCG), drop camera alpha to 0.96 and tint background tier `#e8e0d0` for 80ms.

**Acceptance**:
- Idle scene visibly breathes
- Particle counts within budget (no FPS hit)
- Every interval LCG-driven (zero `Math.random` introduced)

### Phase 7 — Verify + screenshot (Codex, 1-2h)

- Full `verify-cehp.sh` pass
- Save schema integrity check
- Bot hardening tests
- Capture new screenshot per world via existing `capture_trailer.mjs`
- Report new byte count, new screenshots, side-by-side before/after to Kevin

---

## Claude Track (parallel to Codex)

Front-loaded so Codex never blocks.

- [x] Synthesize 8 AI critiques into this sprint doc
- [ ] Write `ACTIVE/docs/FEEL_BIBLE_W7.md` (palette lock + light grammar + prop family per world + feedback timing) — IF the inline tables in this doc prove insufficient. Claude defers writing it as a separate file unless Codex requests.
- [ ] Image-gen prompts (nano-banana / DALL-E) for: 5 mood boards (one per world + one for the lens look + one for prop family). Kevin uses these as Aseprite reference, NOT as in-game art.
- [ ] At each phase boundary: review Codex's diff, run `verify-cehp.sh` myself for second opinion, sign off in changelog
- [ ] Post-sprint: write `W7_RETROSPECTIVE.md` and update `MORNING_BRIEF.md`

## Kevin Track (parallel)

- [ ] Sit with the 8 AI critiques (this doc summarizes them — no need to re-read raw)
- [ ] Run nano-banana / ChatGPT image-gen prompts (delivered separately in chat); save outputs to `ACTIVE/marketing/mood_boards_w7/`
- [ ] After Phase 1 lands: pull the latest soft-launch URL, take a screenshot, send back. The "before/after" is the whole point.
- [ ] At each phase boundary: signoff or taste note. Default = Codex proceeds; pause = Codex holds for input.
- [ ] At sprint end: ratify the new visual contract (or call out anything that broke the deadpan)

---

## Definition of Done (W7)

- [ ] All 6 new modules (`85_lens.js`, `86_light.js`, `87_props.js`, `88_feel.js`, `89_ed_perform.js`, `8A_air.js`) shipped, ES5, no Math.random, sacred constraints intact
- [ ] Ed sprite redesigned to 24×32 with 3-value internal hierarchy (final art OR procedural placeholder Kevin can swap)
- [ ] Zero colored-square pickups remain in any world
- [ ] Pickup feedback: hit-pause + shake + flutter + clack measurable in playback
- [ ] Camera lerp + deadzone + look-ahead applied across all 3 worlds
- [ ] Coyote/buffer/early-release wired (run-scoped, JUMP_VELOCITY untouched)
- [ ] Sign emissive flicker deterministic under seeded replay
- [ ] One warm light source per world establishing hierarchy
- [ ] `verify-cehp.sh` green; bot hardening tests 5/5; thermal PNG render still works
- [ ] Live URL `kevinbigham.github.io/Cactus-Eds-Happy-Place/` shows the new lens (Kevin pulls + ratifies)
- [ ] Before/after screenshot pair per world archived to `ACTIVE/delivery/w7_lens_before_after/`
- [ ] Claude Opus 4.7 reviewer pass — GREEN

---

## Mistakes To Actively Avoid (synthesized from 8 critiques)

1. **Don't add a CRT/VHS shader as a bandage.** Do the lens stack with TileSprite + BlendModes. 90% of the read for 5% of the code.
2. **Don't redraw Ed with a full walk cycle.** Stiff is funnier than expressive. Deadpan stillness is the joke.
3. **Don't add music.** SFX-only is locked. The silence is the asset.
4. **Don't add saturated color to fix flatness.** Push value and dither, not hue. Color kills deadpan.
5. **Don't over-juice.** Keep all feedback under 120ms and under 3px. Linear or QuadOut. Never Elastic. Bureaucratic comedy dies when feedback celebrates.
6. **Don't add more signs.** Two per room is plenty. The world should issue instructions; the receipt carries the joke.
7. **Don't reach for `Math.random()` for flicker.** Every flicker phase, every dust drift, every paper tumble seeded via `ns.makeRNG`.
8. **Don't break Ed's voice with a sprite.** No mouth, no head-tilt, no fidget. The sprite respects the voice.
9. **Don't put scanlines over weak art.** Order is: lens → light → props → feel → Ed → air. Scanlines on bad hierarchy = bad hierarchy wearing sunglasses.
10. **Don't make World 3 a reggae costume party.** Warm exit, faded green/brown, unlit cigarette canon. Mandatory HR mindfulness seminar, not "Rasta level."

---

## Tone Bar

When in doubt about any single change ask:
> "Does this look like cursed nonprofit compliance software recovered from a broken browser kiosk?"

If yes, ship it. If no, cut it.

---

## Reference Stack (for any AI / artist / Kevin's eyes)

**Visual targets**:
- *Return of the Obra Dinn* — extreme constraint becoming the style (1-bit dither)
- *Anatomy* (Kitty Horrorshow) — cheap fog + VHS texture making Unity cubes feel like found footage
- *Paratopic* — PS1-era compression as artistic choice; ugly-on-purpose
- *Papers, Please* — desk-lamp lighting hierarchy; props as game grammar
- *Home Safety Hotline* — corporate-software fiction specific enough that the UI is the horror
- *Mandela Catalogue* (Vol. 1) — instructional-video dread
- *Kane Pixels Backrooms* — overbuilt institutional emptiness; hallway repetition
- *Hypnospace Outlaw* — typed-text terminal cadence
- *INSIDE* — restrained heavy movement readable at low resolution
- *Celeste* — camera leash + landing feel + jump anticipation (then strip the optimism)

**Avoid** (these would betray the tone):
- *Hollow Knight* (too elegant)
- *Night in the Woods* (too expressive)
- Any indie that uses screen shake on movement
- Any indie that adds music to "fix" silence
- Anything from the Vlambeer "more juice = more better" lineage applied to bureaucracy

---

## After W7

- **W8 candidates** (open queue): tighten remaining scenes once lens lands, hand-pixel final Ed sprite if procedural read isn't enough, add 1-2 hazard prop variants, audio mix pass on flicker buzz tones
- **PUBLIC_LAUNCH** (deferred): domain purchase, DNS flip, trailer publish, CR pitch send, public announce — gated entirely on Kevin's "we're ready" call
- **HR Expansion** (Steam $14.99): Exit Interview Theater + Claims Adjustatory worlds — separate sprint after public launch
