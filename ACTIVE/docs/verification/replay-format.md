# Replay Format

**Schema version:** 1  
**Owner:** CEHP replay corpus verification  
**Runtime seam:** `Play.update` scene fixed-step `onStep`

## Purpose

Replay fixtures freeze deterministic inputs and expected outputs at the fixed-step frame boundary. Future sim changes must either reproduce the corpus exactly or report the first divergent frame and field.

This format extends the existing Appeals recorder without changing the legacy Appeals path format. `Recorder.dump()` still returns only `[tMs, x, y, facing]` samples at the 120 ms Appeals cadence. Replay input frames are exposed separately through `Recorder.dumpReplay()`.

## Fixture shape

```json
{
  "schema_version": 1,
  "level_id": "test-room",
  "engine_version": "0.2.0-rebuild",
  "ruleset": "R2",
  "seed": "CASE-20260420-001-CURIOSITY-R2",
  "initial_state": {
    "x": 72,
    "y": 396,
    "facing": 1
  },
  "frames": [
    {
      "frame": 1,
      "input": {
        "left": false,
        "right": true,
        "up": false,
        "down": false,
        "jump": false,
        "punch": false,
        "kick": false,
        "spinDash": false,
        "cigCopter": false,
        "groundSlam": false,
        "glide": false,
        "pause": false,
        "confirm": false,
        "back": false
      },
      "edges": []
    }
  ],
  "expected_checkpoints": [
    {
      "frame": 60,
      "x": 128,
      "y": 396,
      "facing": 1,
      "signature": "00000000"
    }
  ],
  "expected_final": {
    "frame": 300,
    "recorder_signature": "00000000",
    "axes_snapshot": { "primary": {} },
    "receipt_lines": []
  }
}
```

## Input vocabulary

The replay ring records these actions every fixed sim frame:

`left`, `right`, `up`, `down`, `jump`, `punch`, `kick`, `spinDash`, `cigCopter`, `groundSlam`, `glide`, `pause`, `confirm`, `back`.

Each frame stores current boolean input state plus `justPressed:*` edge labels such as `justPressed:jump`.

## API

- `new CEHP.Appeals.Recorder()` keeps the legacy `frames[]` path and the new replay input ring in parallel.
- `recorder.sample(tMs, x, y, facing)` keeps writing legacy Appeals samples only.
- `recorder.sampleInput(frame, CEHP.Input)` writes one input frame for the replay ring.
- `recorder.dump()` returns the legacy Appeals path unchanged.
- `recorder.dumpReplay()` returns cloned per-frame replay input entries.
- `CEHP.Replay.record(scene)` builds a schema v1 record from the active scene.
- `CEHP.Replay.serialize(record)` and `CEHP.Replay.deserialize(json)` round-trip schema v1 records.
- `CEHP.Replay.runReplay(fixture, scene)` compares expected checkpoint/final sections against an actual scene record and returns `{ passed, divergent_frame, expected, actual, field }`.

## Runner

From `ACTIVE/game`:

```sh
npm run test:replay
```

The runner loads every JSON fixture in `_canon/replays/cehp/`, runs each in headless Chromium, prints one `PASS` or `FAIL` line per fixture, and exits non-zero on any divergence. Failures include `frame`, `field`, `expected`, and `actual`.

## Baseline updates

Golden replay files must not be regenerated blindly. To update a baseline:

1. Run the existing corpus first.
2. If output changed, produce a human-readable diff with field, old value, new value, and scenario id.
3. Classify the change as intended, unintended, or unclear.
4. Update expected outputs only when the change is intended and documented.
5. Store metadata: corpus version, engine/schema version, seed or fixture id, and generation command.
