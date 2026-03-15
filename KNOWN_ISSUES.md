# KNOWN ISSUES

## Open Issues Needing Retest

- `World 2 pop-quiz input not registering`
  - Status: partial patch landed 2026-03-14 (canvas.focus() called on quiz trigger)
  - Why still open: static analysis shows quiz input logic is correct; the fix addresses canvas focus loss. Human retest needed to confirm.
  - Retest: load with `?certAid=w2`, trigger a quiz (reach x=760), press 1-4 or Z/X/C/UP. The quiz should close immediately. If it still times out, the issue is deeper than canvas focus.

- `World 3 route/objective unclear at physician threshold/lamp section`
  - Status: readability improved 2026-03-14 (lessonReadoutTxt 8px→10px, block notice 8px→10px)
  - Why still open: the route clarity itself (knowing to strike lamps) depends on font visibility; human retest needed to confirm the improved text is sufficient.
  - Retest: load with `?certAid=w3`, enter recovery zone, verify "CLEAR BOTH LAMPS" readout is legible and the foreshadow notice fires on approach.

## Open Issues Not Yet Safe To Patch

- `World 2 unresolved checkpoint chain after the trellis perch`
  - Status: waiting on human retest after camera-snap fix and quiz-input patch
- `World 3 unresolved checkpoint chain after the recovery/pre-auth approach`
  - Status: waiting on human retest after readability and camera-snap fix

## No-Patch / Presentation Notes

- `World 2 boss appears to have no legs`
  - Status: no patch in certification flow
  - Reason: presentation note, not yet a confirmed gameplay/trust blocker

## Recently Fixed

- `W2/W3 camera direction-change snap`
  - Fixed: `2026-03-14`
  - What changed: W2 and W3 update now apply `_camLookAhead` lerp (factor 0.05) instead of directly using `es.facing * zone.lookAhead`. W3 create initializes `_camLookAhead = 0`.
- `CertAid goals text too hard to read (W2 and W3)`
  - Fixed: `2026-03-14`
  - What changed: certAid hint text 7px→9px, step texts 8px→9px with brighter color (#999→#bbb), controls 7px→8px, panel height 156→175, step spacing 14→16px.
- `W3 lesson readout and pre-auth gate notice too small`
  - Fixed: `2026-03-14`
  - What changed: `_lessonReadoutTxt` fontSize 8px→10px; pre-auth block notice fontSize 8px→10px.
- `World 2 pop-quiz canvas focus (partial)`
  - Fixed: `2026-03-14`
  - What changed: `canvas.focus()` called on quiz trigger to re-claim keyboard focus.
- `W2/W3 checkpoint/readout text was too hard to read after the lo-fi pass`
  - Fixed: `2026-03-13`

## Workflow Issue

- Disposable smoke harness under `/tmp/codex-playwright-cert/` may not exist in every session.
  - Use `./scripts/verify-cehp.sh` plus direct browser checks when it is missing.
