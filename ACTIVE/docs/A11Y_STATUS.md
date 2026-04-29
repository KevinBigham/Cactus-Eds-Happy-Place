# A11Y STATUS

Date: `2026-04-29`
Scope: launch-current browser build, plain-HTML `?settings=1` escape hatch, input/readability assists, current W10-W12 verb set.

## Current Result

All 5 exposed assist toggles have real runtime effect and remain covered by the keyboard-only browser test.

Verification command:

```bash
cd ACTIVE/game && node tests/cehp_accessibility_settings.mjs
```

The full W13 phase gate is:

```bash
bash ACTIVE/game/scripts/verify-launch.sh
```

## Current Movement Verbs

- Ground dash: `260px/s`, with 50ms windup, 167ms active, and 100ms recovery.
- Double jump: 82% of primary jump impulse.
- Wall-slide and wall-jump: fall clamp at 40% max fall, away impulse at 115% run cap, vertical impulse at 92% primary jump.
- Slide / roll: jump-cancel window is 100ms.
- Diagonal aim: +/-35 degrees.
- No air dash in v1.

## Forgiveness Windows

- Coyote window: 100ms.
- Jump buffer: 100ms in the W10 state machine.
- Variable jump cut: upward velocity cuts to 60% inside the first 180ms.
- Corner forgiveness: 6px.
- Ledge snap: 8px horizontal by 10px vertical.
- Hit-stop and i-frames: damage uses classed hit-stop and 900ms i-frames.

## Assist Toggles

### `reduceFlash`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/91_scenes.js` loads assist tuning; `ACTIVE/game/src/40_fx.js` reduces death-stamp, overlay, and occlusion intensity.

### `reduceShake`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/91_scenes.js` applies gentler camera follow lerp.

### `reduceParticles`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/40_fx.js` suppresses the cigarette ember particle-like fill and records `particleAlpha: 0`.

### `biggerCoyote`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/91_scenes.js` loads assist tuning; `ACTIVE/game/src/21_movement.js` applies the larger coyote window to player creation and respawn.

### `slowerGame`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/91_scenes.js` lowers scene time scale and Arcade physics time scale.

## Keyboard And Input

- Keyboard movement: arrows or WASD.
- Jump: Space or Z.
- Punch / kick / spinDash: J / K / L or Shift for spinDash.
- Cig-copter / ground slam / glide: C / V / B.
- Pause: Esc or P.
- Gamepad reads left stick / d-pad and face or shoulder buttons through `ACTIVE/game/src/20_input.js`.
- No remappable controls UI ships in v1. This is deferred to post-launch unless Kevin explicitly pulls it forward.

## Audio Status

W12 shipped procedural Web Audio only. There are no audio files in the play path and no music score. Current audio is a low ambient drone per world plus short diegetic event hits such as doors, stamps, paper, receipt print, and boss telegraph. Browser autoplay rules still mean ambient starts after player input.

## Keyboard-Only Verification

Covered in `ACTIVE/game/tests/cehp_accessibility_settings.mjs`.

Verified flow:

1. Open `?settings=1`.
2. Tab through all 5 toggles and the submit button.
3. Toggle each checkbox with keyboard only.
4. Submit with Enter.
5. Load the normal game route and verify assist mode is live in runtime.

Observed focus order:

- `reduceFlash`
- `reduceShake`
- `reduceParticles`
- `biggerCoyote`
- `slowerGame`
- `Save`

## Launch Notes

- Behavioral axes stay invisible during play. Receipts reveal the interpretation after a run.
- `?settings=1` is the accessible plain-HTML escape hatch.
- Three legacy assist keys still exist in save data (`slowerBosses`, `easyCopter`, `infiniteHealth`) but are not exposed in the current HTML hatch.
