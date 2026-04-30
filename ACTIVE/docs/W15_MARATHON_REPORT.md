# W15 Marathon Report

Date: 2026-04-30
Branch: `post-launch/w15-buildup`
Status: Builder complete through P15; review still required before any merge.

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
- `W15M-P11`: Boss-defeat closer pool depth (Supervisor + Enrollment + Logistics, 15 fragments).
- `W15M-P12`: Setpiece closer pool depth (Trust Fall accept + decline, Open Concept, Supply Chain, 16 fragments).
- `W15M-P13`: Cactus Ed run-complete monologue (9 triple-flag-gated meta closers).
- `W15M-P14`: Replay corpus armor (3 meta-run-complete fixtures + supervisor chaos receipt fixture, corpus 22 → 26).
- `W15M-P15`: Closer-pool integration smoke + marathon report v2 (cross-module voice rule, namespace contract, 40-fragment count assertion).
- `W15M-P16`: Verdict pool depth (5 axis-keyed verdict variants per world × 3 worlds, 15 fragments).
- `W15M-P17`: Tension pool depth (5 axis-keyed tension variants per world × 3 worlds, 15 fragments).
- `W15M-P18`: Axis-only closer overflow pool (4 chaos + 4 curiosity + 4 efficiency variants, no world weighting, 12 fragments).
- `W15M-P19`: Replay corpus V3 armor (4 axis-edge fixtures: chaos/curiosity orientation, efficiency benefits, grace rasta; corpus 26 → 30).
- `W15M-P20`: Fragment audit guardrail (`scripts/audit_fragments.mjs` + `tests/post_fragment_audit.test.mjs`) — 418-fragment census, voice rule + duplicate ID guardrail across all three pools.

## Closer Pool Receipt Layer (P11-P14)

The W15M closer-pool sub-marathon expanded the receipt experience without
changing any sacred constraint. Forty new closer fragments distributed
across three independent modules:

- **84_post_closer_pool_bosses.js** — 15 boss-defeat closers (5 each for
  Supervisor, Enrollment, Logistics). Flag-gated to `*Defeated` flags.
- **8B_post_closer_pool_setpieces.js** — 16 setpiece closers covering
  Trust Fall accept/decline, Open Concept navigated, Supply Chain routed.
  Includes a net-new decline-path closer family (`W15_TRUST_FALL_DECLINED_*`)
  that previously fell through to a generic orientation closer.
- **8C_post_run_complete_monologue.js** — 9 Cactus Ed meta-monologue
  fragments triple-flag-gated to all three boss defeats. The +5.4
  triple-flag bonus dominates any single-defeat closer in any world,
  so the monologue replaces the per-world closer when the player
  clears the run synthesis.

Voice rule honored across all 40 fragments: ≤8 words, ALL CAPS, ends
with ".", no "!". Receipt-system scoring is deterministic-LCG only;
no Math.random in any new module.

## Final Byte Report

- Bundle bytes: 445184 / 491520
- Runtime modules: 60
- Replay corpus: 30/30
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
- Post-launch oracle: 71/71 after P13 run-complete monologue lands
- Case runs: PASS
- Replay corpus: 26/26 after P14 corpus armor lands
- Bundle byte check: 434224 / 491520
- Overall: `CEHP LAUNCH VERIFY: PASS`

## Handoff

- Do not push from P10; Kevin specified marathon push happens only at the very end after all commits land.
- Reviewer should trust but verify with a fresh `bash ACTIVE/game/scripts/verify-launch.sh`.
- Earliest merge remains 2026-05-30 and only after the launch verdict/soak contract clears.
- Rebase against the post-launch `main` head before merge; this side branch intentionally diverged during launch freeze.
