# W12 P3 Telegraph Windup Audit

Date: 2026-04-29
Owner: Codex

## Scope

Revision 2 limits this audit to enemies that actually exist in `ACTIVE/game/src/60_enemies.js`. No mini-bosses are shipped in source, so no mini-boss telegraph rows are included.

## Timing Rule

All effective telegraph windups must satisfy:

`120ms <= windup <= 400ms`

`60_enemies.js` applies seeded jitter as `wBase + rng.int(-40, 41)` at cyclic restarts and Scantron teleports, so this audit checks the jittered effective range, not only the base constant.

## Audit Table

| Source enemy | Runtime/art alias | Current before P3 | Tuned | Effective range after P3 | Reason |
| --- | --- | ---: | ---: | ---: | --- |
| `scantron` | Compliance Auditor art, Scantron label | `220ms` | `220ms` | `180-260ms` | Already inside bounds with `+/-40ms` jitter. |
| `pizzaParty` | Pizza Party ambusher | `140ms` | `160ms` | `120-200ms` | Restart jitter could produce `100ms`; base raised to keep lower bound at `120ms`. |
| `deductibleWeight` | Deadline Wraith art, Deductible label | `180ms` | `180ms` | `140-220ms` | Already inside bounds with `+/-40ms` jitter. |

## Source Notes

- `scantron` is idle until a player trigger causes teleport into windup.
- `pizzaParty` is an auto-cycle ambusher and destroys itself on active contact.
- `deductibleWeight` is an auto-cycle mobility hazard using `enemy_deadline_wraith` art.
- Source search found no W1 Supervisor, W2 Enrollment Officer, W3 Logistics Foreman, Trust Fall, Open Concept, Supply Chain, or Reply-All Locust runtime implementation.

## Oracle Coverage

`ACTIVE/game/tests/rebuild_logic.test.mjs` now asserts each shipped enemy archetype satisfies the launch telegraph bound after `+/-40ms` jitter. Existing W8-R01 tests still verify active-only damage gating, seeded transition determinism, and jitter variance.

