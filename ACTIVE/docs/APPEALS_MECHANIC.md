# APPEALS MECHANIC

> Status: partial ship in rebuild runtime; public-facing completion deferred for Kevin's W6 taste call.

## What exists now

The current appeals seam is implemented in code, but not yet documented as a player-facing feature.

- `ACTIVE/game/src/82_appeals.js`
  - Records deterministic ghost frames via `CEHP.Appeals.Recorder`
  - Encodes/decodes a baseline run payload into `?appeal=...`
  - Compares two run records with `CEHP.Appeals.compare(recordA, recordB)`
- `ACTIVE/game/src/91_scenes.js`
  - Reads the baseline payload from the query string into `ns.RunState.appealBaseline`
  - Records the just-finished run into `ns.RunState.appealPayload`
  - Compares baseline vs current receipt at run end
  - Renders a side-by-side receipt view plus ghost-path overlay on the Receipt scene when a baseline exists

## Compare function

`CEHP.Appeals.compare(recordA, recordB)` consumes two plain objects and returns a deterministic comparison bundle.

Input shape:

```js
{
  receipt: {
    seed: 'CASE-20260420-001-CURIOSITY-R2',
    lines: ['LINE 1', 'LINE 2', 'LINE 3'],
    axes: {
      primary: {
        compliance: 0.8,
        intuition: 0.1,
        curiosity: 0.2,
        grace: 0.4,
        chaos: 0.1,
        efficiency: 0.7
      },
      micro: {}
    }
  },
  frames: [
    [0, 10, 20, 1],
    [120, 32, 18, 1],
    [240, 60, 12, 1]
  ]
}
```

Frame tuple shape:

- `tMs`: elapsed milliseconds from run start
- `x`: sampled x position
- `y`: sampled y position
- `facing`: `1` or `-1`

Return shape:

```js
{
  matches: false,
  lineDiff: [
    { index: 0, a: 'OLD LINE', b: 'NEW LINE' }
  ],
  axisDelta: {
    compliance: -0.6,
    curiosity: 0.6
  },
  pathA: [[...]],
  pathB: [[...]],
  bounds: { minX: 10, minY: 12, maxX: 60, maxY: 64 }
}
```

## How it hooks into receipt divergence

The appeals seam does not alter scoring or fragment selection. It only compares outputs after the run finishes.

Flow:

1. `PlayScene.create()` reads `?appeal=` and stores the decoded payload as `ns.RunState.appealBaseline`.
2. During play, `ns.Appeals.Recorder` samples the live run path.
3. `PlayScene.completeRun()` generates the normal receipt from axes/tensions/flags.
4. That same receipt plus sampled frames become the `current` record.
5. If a baseline exists, `ns.Appeals.compare(baseline, current)` computes:
   - receipt line differences
   - per-axis delta
   - combined path bounds for the ghost overlay
6. `ReceiptScene` renders:
   - baseline receipt card
   - current receipt card
   - two ghost paths in one compare box
   - raw axis delta summary text

This means receipt divergence is already visible when two runs on the same seed produce different lines or axis balances.

## Functional vs stubbed

Functional now:

- deterministic frame recording
- encoded baseline payload in `?appeal=...`
- decode-on-boot baseline ingest
- receipt-vs-receipt line diff
- axis delta summary
- ghost-path overlay on the Receipt scene
- pure logic coverage in `ACTIVE/game/tests/rebuild_logic.test.mjs`

Still stubbed or incomplete:

- no player-facing UI that copies or builds an appeal URL
- no named `?appeal=<prior-seed>` resolver; current query param expects an encoded payload, not a seed lookup
- no standalone compare page outside the Receipt scene
- no live ghost replay inside gameplay; current ghost is a static path render on the receipt screen only
- no public archive/distribution contract for appeal links

## Tonight's decision

Deferred.

Reason:

- The obvious next step is not a hidden refactor. It is a public-facing product contract: how Kevin wants appeal links exposed, named, explained, and shared.
- The current rebuild already contains the internal comparison seam plus a receipt-scene compare view.
- Shipping a new public URL contract overnight would lock tone and UX before Kevin weighs in on how "appeals" should read at launch.

## Recommended W6 completion path

If Kevin wants the feature completed for launch week, the safe next slice is:

1. Add a deliberate "COPY APPEAL LINK" affordance on the receipt screen.
2. Keep the current encoded payload transport for launch rather than inventing seed-history lookup.
3. Add one browser smoke that boots with `?appeal=` and verifies the side-by-side receipt view renders.

That finishes the existing seam without touching save data, scoring, or world logic.
