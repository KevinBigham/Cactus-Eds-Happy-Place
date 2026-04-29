# W12 P2 Receipt Completion-Flag Audit

Date: 2026-04-29
Owner: Codex

## Scope

Revision 2 changes P2 from unbuilt mini-boss/setpiece events to shipped flag-state completion paths. Source search found no runtime systems for Supervisor, Enrollment Officer, Logistics Foreman, Trust Fall, Open Concept, Supply Chain, or Reply-All Locust. The shipped completion model is receipt flags plus world id.

## Flag Keys

Flag keys registered in `ACTIVE/game/src/80_receipts.js` receipt fragments:

- `premiumSecured`
- `uninsuredVeteran`
- `restOpened`
- `cigaretteLit`
- `rushedRest`

## Meaningful Completion Paths

| World | Flag state | Verdict coverage | Tension coverage | Closer coverage | P2 action |
| --- | --- | --- | --- | --- | --- |
| Orientation | `{}` | `VERDICT_ORIENTATION_*` | `TENSION_ORIENTATION_*` | `CLOSER_ORIENTATION_*` | Covered |
| Benefits | `{}` | `VERDICT_BENEFITS_*`, `W11_BENEFITS_VERDICT_ATRIUM_01`, `W11_BENEFITS_VERDICT_NETWORK_01` | `TENSION_BENEFITS_*`, `W11_BENEFITS_TENSION_BRANCH_01`, `W11_BENEFITS_TENSION_SLOW_01` | `CLOSER_BENEFITS_*`, `W11_BENEFITS_CLOSER_BILLING_01` | Covered |
| Benefits | `{ premiumSecured:true }` | `VERDICT_BENEFITS_SECURED_*`, `W11_BENEFITS_VERDICT_AUTH_01` | `TENSION_BENEFITS_SECURED_*` | `CLOSER_BENEFITS_SECURED_*`, `W11_BENEFITS_CLOSER_PLAN_01` | Covered |
| Benefits | `{ uninsuredVeteran:true }` | `VERDICT_BENEFITS_UNINSURED_*` | `TENSION_BENEFITS_UNINSURED_*`, `W11_BENEFITS_TENSION_EXPOSED_01` | `CLOSER_BENEFITS_UNINSURED_*` | Covered |
| Rasta | `{ cigaretteLit:false }` | Missing before P2 | Missing before P2 | `CLOSER_WARMTH_*` | Added `W12_RASTA_VERDICT_DARK_01` and `W12_RASTA_TENSION_DARK_01` |
| Rasta | `{ restOpened:true, cigaretteLit:false }` | `VERDICT_RASTA_REST_*`, `W11_RASTA_VERDICT_BELT_01` | `TENSION_RASTA_REST_*` | `CLOSER_RASTA_REST_*`, `W11_RASTA_CLOSER_FLOOR_01` | Covered |
| Rasta | `{ rushedRest:true }` | `VERDICT_RASTA_RUSH_*` | `TENSION_RASTA_RUSH_*`, `W11_RASTA_TENSION_DOOR_01` | `CLOSER_RASTA_RUSH_*`, `W11_RASTA_CLOSER_NAME_01` | Covered |

## Selector Finding

Before P2, `scoreFragment` gave flag bonuses but did not reject incompatible flagged fragments. That allowed flag-specific fragments to win for unflagged paths, such as a Benefits default run receiving a secured closer. P2 now gates scored fragments through the existing `allFlagsMatch` helper before scoring, preserving generic fallback fragments while preventing incompatible flag bleed.

## Parallax Check

Revision 2 also asks to verify 2-layer parallax before deferring it. Search on 2026-04-29 found no world parallax system or authored two-layer background implementation. Current `setScrollFactor` and `tileSprite` usage is limited to fixed overlays, light/air props, carpet tiling, and presentation helpers. The W11 launch-arc 2-layer parallax target remains deferred in `ACTIVE/docs/BACKLOG.md`.

## Oracle Coverage

`ACTIVE/game/tests/rebuild_logic.test.mjs` now covers:

- Registration coverage for every meaningful completion path, requiring at least one `VERDICTS`, `TENSIONS`, and `CLOSERS` fragment for the exact world/flag combination.
- End-to-end receipt generation for Benefits default, Benefits premium-secured, Benefits uninsured, Rasta dark-cigarette, Rasta rest-open, and Rasta rushed paths.

