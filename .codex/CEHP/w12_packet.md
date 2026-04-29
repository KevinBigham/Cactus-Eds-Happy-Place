# CEHP W12 - Polish + Launch Prep Packet

> Source: Kevin / Claude Code Architect handoff pasted 2026-04-29.
> Note: punctuation normalized to ASCII for repo hygiene; scope and acceptance
> criteria preserved.

## Sprint Header

- Sprint: W12 (Polish + Launch Prep) - pulled forward from launch-arc 2026-05-11 because W11 closed early.
- Architect: Claude Code (Architect-promoted by Kevin 2026-04-29).
- Builder: Codex.
- Sprint window: 2026-04-29 -> 2026-05-06 (7 days). Banks 4 days of buffer before original W13 start.
- Launch lock: 2026-05-29 (T-30).

## State Of World

- Bundle: 350,854 / 372,000 B (this sprint raises cap to 409,600).
- Oracle: 111/111 passing.
- Replay corpus: 7/7 deterministic across 3 cold runs.
- Worlds 1-3 content-complete; W11 mini-bosses + setpieces shipped.
- W11 receipt fragments live (12 new); W11_CONTENT_BIAS = 1.1 tracking item.
- W11.5 marathon hardening shipped (ba132cf).
- verify:launch gate hardened today with poll-loop (d422b77).
- Working tree dirty (don't-touch, pre-session): `.claude/settings.local.json`, `ACTIVE/docs/CLAUDE.md`, `CLAUDE.md`, `README_Instructions on What To Do.md`, `.codex/config.toml`, `ACTIVE/game/CLAUDE.md`.

## Sprint Thesis

Polish the senses, audit density, ship procedural audio, finish receipt-gen / replay coverage for W11 mini-bosses + setpieces, clean asset hygiene. Not a content sprint - no new rooms, no new mechanics, no fragments beyond completion-event coverage.

## Architect Decisions

- Audio = procedural Web Audio (no chip-tune, no MP3).
- Byte cap: 372,000 -> 409,600 (W12 cap raise).
- Telegraph cleanliness: 120 <= windup <= 400 ms across all enemies + mini-bosses.
- Density rule: <=5 decision-grade threats per camera viewport.
- Docket `Date.now()` stays. `04_save.js` save-payload timestamp stays.

## Sacred Constraints

- ES5 only in `src/*.js` and shipped `index.html`.
- Single HTML shipped artifact via `node ACTIVE/game/build.js`.
- Phaser 3 via CDN, no npm in play path.
- Save schema `cactusEd_save_v1` immutable.
- Behavioral axes invisible.
- Voice rule: deadpan, <=8 words/line, no `!`, ALL CAPS for receipt text.
- Seeded LCG RNG only in sim/state. `Date.now()` allowed only in archival timestamps (`04_save.js`, `81_docket.js`).
- No predatory retention.

## Phase Plan

### P1 - Byte Cap Raise

- Edit `ACTIVE/game/scripts/verify-launch.sh`: `372000` -> `409600` in the comparison and echo string.
- Verify green.
- Commit: `W12 P1: bump verify:launch byte cap to 409,600`.
- Bundle delta: 0.

### P2 - Receipt Gen Completeness

- Audit `80_receipts.js` + event sources: W11 mini-boss defeats (Supervisor / Enrollment / Logistics) and setpieces (Trust Fall / Open Concept / Supply Chain) should emit registered fragments.
- Add missing fragments only for completion-event coverage.
- Voice rule applies: <=8 words, no `!`, ALL CAPS, deadpan.
- Add behavior-oracle tests covering all 6 completion paths.
- Bundle delta: <=1 KB.
- Acceptance: every mini-boss + setpiece completion has a registered fragment; oracle covers all 6.

### P3 - Telegraph Windup Audit + Tune

- Audit enemy + mini-boss telegraph windups across `60_enemies.js` and per-world runtime files.
- Produce table: enemy/boss -> current ms -> tuned ms -> reason in `.codex/CEHP/w12_telegraph_audit.md` or commit message.
- Apply `120 <= windup <= 400 ms`; tune outliers.
- Add oracle tests asserting bounds.
- Bundle delta: <500 B.

### P4 - Density Check Static Analysis

- Create `ACTIVE/game/scripts/check_density.mjs`.
- Walk room definitions in `71/72/73_world_*.js`.
- Count decision-grade threats per camera viewport (~960x540 px).
- Assert <=5 per viewport.
- Hook into `verify-launch.sh` as component `check_density` between `art_assets` and `behavior_oracle`.
- If rooms violate, fix in phase.
- Bundle delta: 0.

### P5 - Procedural Web Audio

- Audit existing `30_audio.js`; replace if implementation exists, create if not.
- Public API: `Audio.playAmbient(worldKey)`, `Audio.stopAmbient()`, `Audio.event(eventKey)`.
- Three ambient beds via `OscillatorNode` + `BiquadFilterNode` chain:
  - W1 Orientation: 60 Hz fundamental, LP 200 Hz, slow LFO 0.05 Hz.
  - W2 Benefits: 90 Hz fundamental, LP 250 Hz, brighter/clinical.
  - W3 Rasta: 50 Hz fundamental, LP 180 Hz, warmer, longer LFO.
- Six diegetic event hits, procedural envelopes <=300 ms each: `door_open`, `door_close`, `stamp_thud`, `paper_rustle`, `receipt_print`, `boss_telegraph`.
- Ducking: ambient drops 50% under event hits for 300 ms post-trigger.
- No `Math.random` in audio params; deterministic envelopes or seeded LCG only.
- Acceptance: ambient per world, events ring on trigger, verify:launch green, replay determinism unchanged.

### P6 - Mini-boss Replay Fixtures

- Add 3 new replays via autoplay harness:
  - `w1_supervisor_defeat.json`
  - `w2_enrollment_defeat.json`
  - `w3_logistics_defeat.json`
- Each path covers the 3-phase mini-boss defeat.
- Pin gold md5s in `.codex/CEHP/w12_replay_hashes.md`.
- Verify 3 cold runs -> identical md5 each.
- Bundle delta: 0.
- Acceptance: replay corpus 7 -> 10; all stable.

### P7 - Asset Cleanup

- Move 8 orphan PNGs from M4 audit to `ACTIVE/game/art/_orphans/`.
- Compress 30 oversize PNGs in-place with `pngquant --quality=70-85`; back up originals to `art/_originals/`.
- After each batch, run `node ACTIVE/game/scripts/verify_art_assets.mjs`.
- Bundle delta: 0.
- Acceptance: zero broken refs; total `art/` size reduced >=40%; verify:launch green.

## Read Order

1. This packet.
2. `.codex/CEHP/marathon_findings.md`.
3. `ACTIVE/docs/CEHP_LAUNCH_ARC.md` W12 context.
4. `ACTIVE/game/CLAUDE.md`.
5. `ACTIVE/game/src/30_audio.js`.
6. `ACTIVE/game/src/60_enemies.js` + `62_director.js`.
7. `ACTIVE/game/src/80_receipts.js`.
8. `ACTIVE/game/_canon/replays/cehp/`.

## Do Not Touch

- `ACTIVE/game/src/04_save.js`.
- `ACTIVE/game/src/02_rng.js`.
- W11 content (12 fragments + 4 rooms shipped between a276f2d and ba132cf).
- `W11_CONTENT_BIAS = 1.1`.
- verify-launch poll-loop; only cap line changes in P1.
- Pre-session dirty files listed above.

## Per-Phase Verification Gates

After each phase:

- `node ACTIVE/game/build.js`.
- `bash ACTIVE/game/scripts/verify-launch.sh`.
- `npm run --prefix ACTIVE/game test:replay`.
- Sacred-constraint sweep on touched files (ES5 / voice / RNG / time).
- Update `.codex/CEHP/status.md` + `.codex/CEHP/changelog.md`.
- Commit: `W12 P{N}: {short summary}`.

## End-Of-Sprint Deliverable

- `plan`: this packet copy under `.codex/CEHP/w12_packet.md`.
- `phases_completed`: P1-P7 with per-phase commit hash.
- `files_changed`: full list.
- `verification`: oracle count, replay md5 list (10 fixtures), bundle bytes, gate runs (3+ green).
- `regression_summary`: oracle/replay deltas.
- `risks`: anything Kevin should know for W13 dress rehearsal.
- `handoff`: state for W13 launch runway.

## Kickoff

Read order -> P1 -> P2 -> P3 -> P4 -> P5 -> P6 -> P7. Verify after each. School-hours autonomy: do not stop for ACK between phases. Stop only on RED - oracle break, replay drift, sacred-constraint violation, or true scope ambiguity.
