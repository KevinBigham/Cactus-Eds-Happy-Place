# W10 Phase 2 Kevin Checkpoint

**Phase**: 2 of 7 — Ed state machine (18 states)
**Produced**: 2026-04-23
**Status**: AWAITING KEVIN DECISION

## What to look at (in order)

1. **Visual parity check** — open `w1_orientation_30s.webm` in any browser or VLC.
   The 30-second clip shows Ed running right and jumping every 1.4s in the W1 orientation opener
   under the new state machine. Watch for: does it feel like the same game it was last week?
2. **Keyframe stills** — `w1_keyframe_00.png` … `w1_keyframe_05.png` are the same run sampled
   at 0s / 6s / 12s / 18s / 24s / 30s if you want to skim without scrubbing video.
3. **Build + test matrix** — `handoff.json` summarizes bundle bytes, test counts, autoplay
   determinism across all 3 worlds, and the sacred-constraint sweep.

## TL;DR verify results

- Bundle: 308,216 bytes (50,184 runway under the 358,400 cap)
- Tests: 52/52 pass, +4 new Phase 2 invariants
- Save schema: PASS (v1 frozen, no v3)
- Art assets: 32/32
- Autoplay determinism: MATCH on W1/W2/W3
- Sacred sweep: 0 ES5 violations, 0 Math.random, 0 JUMP_VELOCITY/GRAVITY mutations
- Untouched-files claim: verified via mtimes

## Two reviewer flags (non-blocking)

1. **Byte trajectory** — Phase 2 used ~12.7 KB of the ~17–21 KB W10 estimate. Worth a
   recheck before Phase 6 (60 px sprite sheet) to avoid a runway crunch.
2. **Scope variance** — Builder self-wired from `07_ed_state.js` instead of editing
   `50_forms.js` and `89_ed_perform.js` as originally planned. Smaller blast radius;
   logged so Phase 3 knows self-wiring is the established pattern.

## Decision request

Does the W1 capture preserve the pre-Phase-2 feel?

- **APPROVE** → Phase 3 greenlights, Codex proceeds with the verb set
- **REJECT** → say what looks off, reviewer triages to builder
- **HOLD** → request a different world, seed, or headed playback

## Regen command

    cd ACTIVE/game
    node scripts/capture_checkpoint.mjs --phase 2 --world orientation --seconds 30
