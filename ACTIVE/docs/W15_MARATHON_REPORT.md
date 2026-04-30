# W15 Marathon Report

Date: 2026-04-30
Branch: `post-launch/w15-buildup`
Status: Builder complete through P21 (V3 marathon); review still required before any merge.

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
- `W15M-P21`: V3 integration smoke (`tests/post_marathon_v3_integration.test.mjs`) + marathon report V3 (cross-module register hooks, 42-fragment count assertion, V3 narrative section, P16-P21 phase enumeration).

## Receipt Revelation Depth Layer (V3, P16-P20)

The V3 sub-marathon doubled down on receipt variety. The previous
sub-marathon (P11-P14) added 40 closers; V3 added 42 net-new
fragments across all three receipt pools and one pre-launch
guardrail layer:

- **8D_post_verdict_pool.js** — 15 verdict pool depth fragments,
  five axis-keyed variants per world (orientation, benefits, rasta).
  World weights match the canonical VERDICT_<WORLD> family so new
  fragments augment rather than dominate the existing 100 base
  verdicts.
- **8E_post_tension_pool.js** — 15 tension pool depth fragments,
  five axis-keyed variants per world. Tension dimensions
  (obedience/auditRisk/style) plus axis weights (chaos/curiosity/
  efficiency/grace/intuition) give context-sensitive selection.
- **8F_post_closer_axis_pool.js** — 12 axis-only closer overflow
  fragments (4 chaos-dominant + 4 curiosity-dominant + 4
  efficiency-dominant). No world weighting by design: these only
  win in axis-dominant unflagged contexts; world-weighted and
  flag-gated closers continue to dominate their own contexts.
- **scripts/audit_fragments.mjs** — standalone fragment census +
  voice rule sweep tool. Run on demand:
  `node ACTIVE/game/scripts/audit_fragments.mjs`
- **tests/post_fragment_audit.test.mjs** — five contracts catching
  any future drift: voice rule, ID uniqueness across pools, pool
  population minimums, W15 family count exactness, V3 fragments
  carry at least one scoring key.

Voice rule honored across all 42 V3 fragments: ≤8 words, ALL CAPS,
ends with ".", no "!". Receipt-system scoring is deterministic-LCG
only; no Math.random in any new module. Replay corpus expanded
26 → 30 with four axis-edge fixtures armoring the new pools.

Total fragment census after V3: **418 fragments** (120 verdicts +
130 tensions + 168 closers).

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

- Bundle bytes: 486867 / 491520
- Runtime modules: 67
- Replay corpus: 30/30
- Side-branch cap source: `ACTIVE/game/scripts/verify-launch.sh` and `ACTIVE/game/process_manifest.json`
- Main-branch cap remains launch-frozen and must not be changed there.

## Verification

Latest full gate after P21 (V3 marathon final):

```bash
bash ACTIVE/game/scripts/verify-launch.sh
```

Expected signal:

- Save schema: PASS
- Process manifest: PASS
- Behavior oracle: PASS
- Post-launch oracle: PASS after V3 modules + audit guardrail land
- Case runs: PASS
- Replay corpus: 30/30 after P19 axis-edge armor lands
- Bundle byte check: 486867 / 491520
- Fragment audit: 418 fragments, 0 voice violations, 0 duplicate IDs
- Overall: `CEHP LAUNCH VERIFY: PASS`

## Handoff

- Do not push from any phase mid-stream; Kevin specified marathon push happens only at the very end after all commits land.
- Reviewer should trust but verify with a fresh `bash ACTIVE/game/scripts/verify-launch.sh`.
- Earliest merge remains 2026-05-30 and only after the launch verdict/soak contract clears.
- Rebase against the post-launch `main` head before merge; this side branch intentionally diverged during launch freeze.
