# Fixed-Step Accumulator — Current State

**Last updated:** 2026-04-28
**Sprint:** CEHP-Sprint-NEXT+1 wall-jump fix then scene onStep activation
**Module:** [src/04_fixed_step.js](../../game/src/04_fixed_step.js)

## Layered accumulators

Two `FixedStep` instances exist in a running session. Both use `CEHP.FixedStep`, but they own different boundaries.

### 1. EdState accumulator — per-player derived cadence

Created in [src/07_ed_state.js](../../game/src/07_ed_state.js) as `state.fixed`. It is advanced inside the EdState wrapper around `Movement.apply`.

What it does: tracks the Ed state machine frame and semantic frame for state selection, latches, and transition metadata.

What it does **not** do: drive the Play scene update count. It remains a child cadence of the scene sim tick.

### 2. Scene accumulator — Play-scene sim cadence

Created in `91_scenes.js` Play scene `create()` as `this._fixedStep`. `update(t, i)` now calls:

```js
CEHP.FixedStep.advance(this._fixedStep, i, function(frame, stepMs){ ... });
```

The callback is the canonical sim tick at `1000/60` ms. It contains:

- `Input.update()`
- pause/UI handling
- `Movement.apply(player, CEHP.Input, stepMs)`
- pending-death respawn and pit checks
- the active world runtime `update(scene, stepMs)`
- `recorder.sampleInput(frame, CEHP.Input)`
- `recorder.sample(frame * stepMs, player.x, player.y, facing)`

The recorder timestamp deliberately derives from fixed-step frame time, not `this.time.now`.

## Render-delta presentation

Presentation stays outside `onStep` and still consumes the render delta `i`:

- `Metrics.tick`
- `FX.update`
- `Feel.updateCamera`
- `Ed.update`
- `Light.update`
- `Lens.update`
- `Air.update`
- `Audio.updateFromAxes`

This keeps visual smoothing and audio cadence render-frame friendly while sim decisions move on a deterministic 60 Hz clock.

## Death timing

`queueDeath()` uses the scene sim clock (`this._simNowMs`) when called from a fixed sim step, with the old Phaser clock as a fallback. This keeps pending-death respawn timing on the same frame-derived axis as movement and world updates.

## Phaser boundary

Phaser Arcade physics is still the solver. This sprint only changes when CEHP drives inputs, velocities, world runtime updates, and recorder samples. It does not replace Phaser physics or add a third accumulator.

## Replay corpus

Replay corpus details live in [replay-format.md](replay-format.md). The current corpus fixtures are:

- `ACTIVE/game/_canon/replays/cehp/test_room_obedient.json`
- `ACTIVE/game/_canon/replays/cehp/w2_benefits_insured.json`
- `ACTIVE/game/_canon/replays/cehp/w3_rasta_short.json`

Run only the corpus with:

```sh
cd ACTIVE/game
npm run test:replay
```

Run the launch-readiness gate with:

```sh
cd ACTIVE/game
npm run verify:launch
```

## Wall-jump blocker status

The historical W10 Phase 6 `movement:wallJump` divergence no longer reproduces in current source. The state machine owns jump-family emission, and the regression coverage in `rebuild_logic.test.mjs` keeps stale legacy jump buffering from double-owning wall jumps.

## Sacred-constraint check

- Single-file artifact: `index.html` remains under the 358,400 B sprint cap after rebuild.
- ES5 runtime: `91_scenes.js` remains minified ES5.
- Phaser via CDN: no new dependency.
- Save schema: `cactusEd_save_v1` untouched.
- Seeded RNG: no new `Math.random`, `Date.now`, or `performance.now` in production sim paths.

## Verification commands

```sh
cd ACTIVE/game
node build.js && wc -c index.html
for i in 1 2 3; do node --test tests/rebuild_logic.test.mjs 2>&1 | tail -8; done
for i in 1 2 3; do node scripts/autoplay.mjs --world benefits --seed W2-benefits-A --count 2 --topics 'movement:*'; done
bash scripts/verify-cehp.sh
```
