# W15 Marathon Report

Date: 2026-04-30
Branch: `post-launch/w15-buildup`
Status: Builder complete through P10; review still required before any merge.

## Scope

This side branch staged the deferred W15 buildout while `main` remains launch-frozen. It does not change the `cactusEd_save_v1` contract and is not eligible to merge before the launch verdict window described in `ACTIVE/docs/W15_BUILDOUT_PLAN.md`.

## Phase Commits

- `W15M-P2`: Boss framework module.
- `W15M-P3`: Supervisor mini-boss for W1 Orientation.
- `W15M-P4`: Enrollment Officer mini-boss for W2 Benefits.
- `W15M-P5`: Logistics Foreman mini-boss for W3 Rasta.
- `W15M-P6`: Reply-All Locust W3 ambient hazard.
- `W15M-P7`: Two-layer parallax visual system.
- `W15M-Bcap`: Side-branch bundle cap raised to 491,520 bytes.
- `W15M-P8a-prep`: Supervisor dispatch regex relaxed for W1 setpieces.
- `W15M-P8a`: Trust Fall W1 setpiece and replay.
- `W15M-Bcap-2`: Process manifest cap synced to 491,520 bytes.
- `W15M-P8b`: Open Concept W2 setpiece and replay.
- `W15M-P8c`: Supply Chain W3 setpiece and replay.
- `W15M-P9`: Replay corpus edge coverage.
- `W15M-P10`: Marathon integration test and final report.

## Final Byte Report

- Bundle bytes: 423368 / 491520
- Runtime modules: 54
- Replay corpus: 22/22
- Side-branch cap source: `ACTIVE/game/scripts/verify-launch.sh` and `ACTIVE/game/process_manifest.json`
- Main-branch cap remains launch-frozen and must not be changed there.

## Verification

Latest full gate before P10 report commit:

```bash
bash ACTIVE/game/scripts/verify-launch.sh
```

Expected signal:

- Save schema: PASS
- Process manifest: PASS
- Behavior oracle: 117/117
- Post-launch oracle: 45/45 after P10 integration test lands
- Case runs: PASS
- Replay corpus: 22/22
- Bundle byte check: 423368 / 491520
- Overall: `CEHP LAUNCH VERIFY: PASS`

## Handoff

- Do not push from P10; Kevin specified marathon push happens only at the very end after all commits land.
- Reviewer should trust but verify with a fresh `bash ACTIVE/game/scripts/verify-launch.sh`.
- Earliest merge remains 2026-05-30 and only after the launch verdict/soak contract clears.
- Rebase against the post-launch `main` head before merge; this side branch intentionally diverged during launch freeze.
