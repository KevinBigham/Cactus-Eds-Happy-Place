# KNOWN ISSUES

## Open Issues — Confirmed Defects

- `World 2 pop-quiz auto-dismisses on first trigger (~0.2s)`
  - Status: CONFIRMED GAMEPLAY DEFECT (2026-03-16 human retest)
  - Evidence: Kevin reports first quiz appears for ~0.2 seconds and auto-dismisses before it can be read or answered. On retry, quiz returns and accepts input normally.
  - Prior patch: canvas.focus() added 2026-03-14 but NOT deployed (CEHP-007 push pending). This timing bug is likely a separate issue from focus loss.
  - Next action: CEHP-010 — Builder investigates quiz auto-dismiss timing on first trigger. Smallest safe fix only.

## Open Issues — Still Unclear

- `World 3 certAid panel occludes lamp area`
  - Status: STILL UNCLEAR (2026-03-16 human retest)
  - Evidence: Kevin understood the lamp objective ("I can tell I'm supposed to be doing something with the lamps") and completed all 4 checkpoints. Complaint was that the certAid text panel blocked visibility in the lamp zone, not that the route itself was unclear.
  - Assessment: This may be a certAid overlay positioning issue, not a game design problem. Route clarity is adequate — player completed the section. Needs a second retest after CEHP-007 push (which includes readability patches) to confirm.

## Closed Issues — Passed Retest

- `World 2 checkpoint chain after the trellis perch`
  - Status: PASSED (2026-03-16 human retest)
  - Evidence: Kevin hit momentary route confusion at trellis height (couldn't move forward at that elevation, found path below) but completed W2 graduation with full grades (D, B, A, A — GPA 3.0/4.0). Checkpoint chain is functional.

- `World 3 checkpoint chain after the recovery/pre-auth approach`
  - Status: PASSED (2026-03-16 human retest)
  - Evidence: All 4 items checked (Lamp 1, Lamp 2, Pre-Auth Complete, Physician Threshold). Boss defeated. No chain issues.

## No-Patch / Presentation Notes

- `World 2 boss appears to have no legs`
  - Status: no patch in certification flow
  - Reason: presentation note, not yet a confirmed gameplay/trust blocker

- `World 2 pencils should be upside down`
  - Status: presentation note (2026-03-16 human feedback)
  - Reason: Kevin notes it doesn't make sense to defeat pencils by jumping on their pointy side up

- `Closing screen font unreadable`
  - Status: presentation note (2026-03-16 human feedback)
  - Reason: "THE FILES HAVE BEEN TABBED" end screen text is too small/unclear to read

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
