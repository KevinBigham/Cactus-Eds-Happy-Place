# First-Session Regression Checklist

Use this checklist for first-session trust and certification passes. Every item below comes from a real fragile surface observed in recent browser validation.

## Smoke And Persistence
- [ ] Direct boot `Demo` completes with no new console/page errors.
- [ ] Direct boot `World2` completes with no new console/page errors.
- [ ] Direct boot `World3` completes with no new console/page errors.
- [ ] `node scripts/check_save_schema.js` passes as the live save-contract validator.
- [ ] Save/continue behavior is unchanged from the live build.
- [ ] Browser save/continue sanity probe shows a `CONTINUE — WORLD X` menu for a representative save and routes into the correct world.
- [ ] Assist persistence is unchanged from the live build.

## World 1
- [ ] World 2 preview overlay closes on one normal `Z` press after the prompt becomes active.
- [ ] Closing the World 2 preview destroys the preview text nodes; no orphan preview text remains on screen.
- [ ] Counselor confirmation is visibly `FORM 22-B REVIEW: MARKING OBSERVED.` after correct safe play.
- [ ] Older generic acknowledgment text does not overwrite the counselor confirmation.

## World 2
- [ ] Podium rehearsal still shows `POSTED PODIUMS BEFORE CUTTING: POSITION APPROVED.` on correct safe play.
- [ ] Testing-route notice survives long enough to be read: `PROCTOR NOTICE: THE POSTED ROUTE CLIMBS IN ORDER.`
- [ ] Nearby Carl or lawn chatter does not overwrite the podium teaching or confirmation window.
- [ ] World 2 pop-quiz answers accept the displayed keys, and the quiz/checkpoint instructional text remains legible at normal public-play scale.

## World 3
- [ ] Waiting-room stillness visibly confirms with `SIDE FILE REVIEW: STILLNESS ACCEPTED.` and then `SIDE FILE WINDOW: RELEASED.`
- [ ] Diagnostic zone receipt does not enter the scan teaching pocket.
- [ ] Scan completion visibly confirms with `SCAN WINDOW ACCEPTED.`
- [ ] Pre-auth lamp drill visibly confirms `SIGNATURE 1 / 2 FILED.` and `SIGNATURE 2 / 2 FILED.`
- [ ] Lamp completion remains reliable under focused `KeyX` / `KeyC` input.
- [ ] Physician threshold cannot be entered before pre-auth is complete; the route holds and repeats the posted signature requirement instead.

## Summary And Metrics
- [ ] `dumpFirstSessionSummary` still logs for World 1, World 2, and World 3 when debug is enabled.
- [ ] `metric.overlapPrevented` remains available in summary output.
- [ ] Watch these `overlapPrevented` buckets because they have mattered in real passes:
  - `w2_carl`
  - `w3_npc`
  - `w3_receptionist`
  - `w3_zone_receipt`

## Certification Honesty
- [ ] The report distinguishes full continuity certification from targeted probes.
- [ ] The report lists exact commands actually run.
- [ ] Any missing continuity segment is named explicitly instead of implied complete.

## Manual Certification Aid
- [ ] `?certAid=w2` and `?certAid=w3` boot the intended checkpoint and the dev-only overlay reflects ordered runtime-truth progress for the active segment.
