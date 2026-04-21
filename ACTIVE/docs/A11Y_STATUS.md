# A11Y STATUS

Date: `2026-04-20`
Scope: plain-HTML `?settings=1` escape hatch plus runtime assist wiring.

## Result

All 5 exposed toggles now have real runtime effect and are covered by a dedicated keyboard-only browser test.

Verification command:

```bash
cd ACTIVE/game && node tests/cehp_accessibility_settings.mjs
```

## Toggle trace

### `reduceFlash`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/91_scenes.js` loads assist tuning, `ACTIVE/game/src/40_fx.js` reduces death-stamp / overlay / occlusion intensity

### `reduceShake`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/91_scenes.js` applies a gentler camera follow lerp

### `reduceParticles`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/40_fx.js` suppresses the cigarette ember particle-like fill and records `particleAlpha: 0`

### `biggerCoyote`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/91_scenes.js` loads assist tuning, `ACTIVE/game/src/21_movement.js` applies the larger coyote window to player creation and respawn

### `slowerGame`

- UI source: `ACTIVE/game/index.template.html`
- Save persistence: `ACTIVE/game/src/90_ui.js` -> `ACTIVE/game/src/04_save.js`
- Runtime effect: `ACTIVE/game/src/91_scenes.js` lowers scene time scale and Arcade physics time scale

## Keyboard-only verification

Covered in `ACTIVE/game/tests/cehp_accessibility_settings.mjs`.

Verified flow:

1. Open `?settings=1`
2. Tab through all 5 toggles and the submit button
3. Toggle each checkbox with keyboard only
4. Submit with Enter
5. Load the normal game route and verify assist mode is live in runtime

Observed focus order:

- `reduceFlash`
- `reduceShake`
- `reduceParticles`
- `biggerCoyote`
- `slowerGame`
- `Save`

## Notes for Kevin

- The form was already present; the overnight change was binding the saved assist state into the actual rebuild runtime.
- Three legacy assist keys still exist in save data (`slowerBosses`, `easyCopter`, `infiniteHealth`) but are not exposed in the current HTML hatch. They were not changed tonight.
