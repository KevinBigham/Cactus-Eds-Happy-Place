# W15 BUILDOUT MARATHON

> Branch: `post-launch/w15-buildup` (forked from `main` @ launch-freeze 2ca126e)
> Authored: 2026-04-29 (T-30 to launch)
> Earliest merge: 2026-05-30 (T+1), contingent on launch verdict
> Director: Kevin. Reviewer/ops: Claude Code. Builder: Codex.

## Why this exists

`main` is FROZEN through 2026-05-29 per `LAUNCH_FREEZE.md`. Soak-window contract: launch-blocking-bug fixes only. Building W11+ deferred work on `main` would break the freeze.

This marathon stages the deferred W11 backlog on a side branch so the 25-day soak doesn't burn build velocity. Branch does NOT merge until launch verdict is in.

## Sacred constraints (unchanged from `main`)

- ES5 only in `ACTIVE/game/src/**`
- Single HTML shipped artifact via `node ACTIVE/game/build.js`
- Phaser 3 via CDN, no npm in play path
- Save schema `cactusEd_save_v1` immutable; v2 must preserve v1 under `legacy`
- Behavioral axes invisible during play (no HUD bars/meters)
- Voice rule: deadpan, <=8 words/line, no `!` in authored runtime voice (ALL CAPS for receipt text)
- Seeded LCG RNG only in sim/state. `Date.now()` allowed only in archival timestamps (`04_save.js`, `81_docket.js`).
- No predatory retention (no FOMO/streaks/notifications)

## Branch contract

CAN:
- Add new files under `ACTIVE/game/src/` with appropriate slot prefixes
- Add new tests under `ACTIVE/game/tests/`
- Add new replay fixtures under `ACTIVE/game/_canon/replays/cehp/`
- Modify `ACTIVE/game/build.js` if recursive globbing is needed (default: keep top-level)
- Bump `verify-launch.sh` bundle cap if it becomes necessary (see Bundle budget below) -- ONLY on this branch

CAN'T:
- Modify `cactusEd_save_v1` schema
- Touch `LAUNCH_FREEZE.md`, `LAUNCH_RUNBOOK_W14.md`, or the `launch-freeze` tag
- Push or merge to `main` before 2026-05-30 unless Kevin explicitly authorizes
- Touch the 6 pre-session dirty files: `.claude/settings.local.json`, `ACTIVE/docs/CLAUDE.md`, `CLAUDE.md`, `README_Instructions on What To Do.md`, `.codex/config.toml`, `ACTIVE/game/CLAUDE.md`

## Bundle budget watch

| Checkpoint | Estimated bundle | Cap | Headroom |
|---|---|---|---|
| P1 baseline (now) | 354,011 | 409,600 | 55,589 |
| After P2 (boss framework) | ~360,000 | 409,600 | ~50,000 |
| After P3-P5 (3 mini-bosses) | ~390,000 | 409,600 | ~20,000 |
| After P6 (Reply-All Locust) | ~398,000 | 409,600 | ~12,000 |
| After P7 (parallax) | ~405,000 | 409,600 | ~5,000 |
| After P8a-c (3 setpieces) | ~430,000 | exceeds 409,600 -> cap raise needed | -- |

Cap-raise rule: if any phase pushes the bundle over 409,600, Kevin authorizes lifting the side-branch cap to **491,520 B** (480 KiB) by editing `ACTIVE/game/scripts/verify-launch.sh` ON THIS BRANCH ONLY. The `main` cap stays at 409,600 forever. The verify-launch.sh edit must be its own atomic commit with message `W15M-Bcap: raise side-branch cap to 491,520`.

## Scope inclusions (deferred W11 backlog)

1. Boss framework module (3-phase abstract state machine + telegraph + receipt hooks)
2. Mini-boss: Supervisor (W1 Orientation)
3. Mini-boss: Enrollment Officer (W2 Benefits Atrium)
4. Mini-boss: Logistics Foreman (W3 Rasta)
5. Reply-All Locust enemy (W3 swarm)
6. 2-layer parallax per world
7. Setpiece: Trust Fall (W1)
8. Setpiece: Open Concept (W2)
9. Setpiece: Supply Chain (W3)
10. Replay corpus expansion (~5-10 new fixtures)

## Scope exclusions (NOT in this marathon)

- Hand-pixeled Ed sprite (asset work, not Codex-shaped)
- V2 content roadmap (hub world, RPS bosses, secret paths) -- separate post-launch arc
- Cross-browser polish (Firefox/Safari) -- separate post-launch arc
- W11_CONTENT_BIAS ratchet-down -- separate post-launch arc
- Custom domain cutover -- Kevin/W14-gated

## Phase plan

| ID | Builder | Title | Deliverables |
|---|---|---|---|
| P1 | Claude Code | Branch + plan doc | This file. Branch created. Single commit. |
| P2 | Codex | Boss framework module | `src/63_post_boss_framework.js`, `tests/post_boss_framework.test.mjs` |
| P3 | Codex | Supervisor mini-boss (W1) | `src/64_post_boss_supervisor.js`, integration with `74_world_orientation_runtime.js`, replay fixture |
| P4 | Codex | Enrollment Officer mini-boss (W2) | `src/65_post_boss_enrollment.js`, integration with `75_world_benefits_runtime.js`, replay fixture |
| P5 | Codex | Logistics Foreman mini-boss (W3) | `src/66_post_boss_logistics.js`, integration with `76_world_rasta_runtime.js`, replay fixture |
| P6 | Codex | Reply-All Locust enemy | `src/67_post_enemy_locust.js`, replay fixture |
| P7 | Codex | 2-layer parallax | `src/68_post_parallax.js`, hooks into `70_worlds.js` |
| P8a | Codex | Setpiece: Trust Fall (W1) | bespoke level chunk + replay fixture |
| P8b | Codex | Setpiece: Open Concept (W2) | bespoke level chunk + replay fixture |
| P8c | Codex | Setpiece: Supply Chain (W3) | bespoke level chunk + replay fixture |
| P9 | Codex | Replay corpus expansion | ~5-10 new edge-case fixtures + corpus test update |
| P10 | Codex | Bundle budget verify + integration test | Final byte report, cross-system smoke test, marathon report doc |

Slot prefixes are defaults; Codex may propose alternatives in the design step of each phase if they fit better.

## Per-phase contract (shared by P2-P10)

Every Codex paste block delivered by Claude Code in chat MUST contain:

1. **JSON header** — phase ID, branch, scope, must-not-do, success gate
2. **Read-order** — files Codex must read before editing
3. **Don't-touch list** — explicit (always include the 6 pre-session dirty files + `LAUNCH_*.md` + `launch-freeze` tag)
4. **Kickoff** — literal first command, typically:
   ```bash
   git checkout post-launch/w15-buildup && bash ACTIVE/game/scripts/verify-launch.sh
   ```
   Verify must PASS before any code change. Halt if reality diverges from prior phase summary.

Every Codex commit ends with the prefix `W15M-P#:`. Example: `W15M-P3: implement Supervisor mini-boss + integration`.

## Merge plan

- **T+1 (2026-05-30)**: Earliest merge window
- **Pre-merge gate**: launch GREEN + soak clean (no W14 launch-blocking incidents); the marathon's P10 integration smoke must PASS
- **Conflict resolution**: side branch is N commits ahead of `main`; rebase onto post-launch `main` head before merge
- **Post-merge tag**: `post-launch-v0.3.0-rebuild`

If launch slips for any reason, marathon merge slips with it. Marathon does NOT influence launch decisions.

## Audit trail

- Phase commits land here on `post-launch/w15-buildup` only
- Final marathon report at `ACTIVE/docs/W15_MARATHON_REPORT.md` (authored in P10)
- Each phase's Codex output reviewed by Claude Code under the trust-but-verify protocol: `verify-launch.sh` GREEN, replay 3x cold, sacred sweep, voice rule, byte budget
