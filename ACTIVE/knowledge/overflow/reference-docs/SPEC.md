# SPEC

## Runtime Truth
- `index.html` is implementation truth.
- Runtime stack: single-file HTML, Phaser CDN, ES5 JavaScript, no build step.
- Current live scenes are `Title`, `Demo`, `World2`, and `World3`.

## Current Game Shape
- World 1: Welcome & Adjustment Bureau
- World 2: Sunlush Learning Preserve
- World 3: Wellspring Medical Pavilion
- The live build is oriented around first-session trust, continuity, and boss-approach rehearsal rather than broad late-game expansion.

## Save Contract
- Save surface is the `SAVE` object in `index.html`.
- Current key: `cactusEd_save_v1`
- Persisted fields currently written by `SAVE.save(...)`:
  - `world`
  - `health`
  - `aloe`
  - `behavior`
  - `deaths`
  - `runs`
  - `bestTime`
  - `totalKills`
  - `assistMode`
  - `timestamp`
- Save/continue from the title screen routes into `Demo`, `World2`, or `World3` based on saved state.

## Assist Persistence
- Assist state lives in `assistMode` inside the save payload.
- Current live assist flags:
  - `biggerCoyote`
  - `slowerBosses`
  - `easyCopter`
  - `infiniteHealth`
  - `slowerGame`

## First-Session Helper Surfaces
- `showProtectedReadableText(...)`
- `dumpFirstSessionSummary(...)`
- `_counselorPreteach`
- `_gardenerPreview`
- `_waitingDoor`
- `_scanLesson`
- `_preAuthDrill`
- `overlapPrevented`

## Compatibility Law
- Preserve direct boots into `Demo`, `World2`, and `World3`.
- Preserve save compatibility and assist persistence unless a human explicitly approves a change.
