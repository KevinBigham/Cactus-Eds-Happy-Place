# CERTIFICATION EVIDENCE

## Source Of Human Evidence
- `2026-03-13` public/manual checkpoint notes supplied in chat after the dev-only certification aid went live.
- Evidence source is human play, not disposable automation.

## Classified Evidence

| Area | Human Observation | Classification | Status |
| --- | --- | --- | --- |
| World 2 | Pop-quiz responses did not seem to receive input. | Confirmed gameplay defect in earlier runtime; not reproducible now. | The current `index.html` already contains the repair path that accepts displayed `1-4` keys plus `Z/X/C/UP` with a short post-open arming delay. A targeted browser repro on `2026-03-13` confirmed the quiz closes on held `1` and held `Z`, so no new patch landed in this pass. |
| World 2 | The top-left checkpoint goals/readout were hard to read after the lo-fi visual pass. | Confirmed gameplay defect. | Fixed in `index.html` on `2026-03-13` by enlarging the certification overlay and key route signage. |
| World 3 | The checkpoint/readout text was hard to read and the procedure was unclear. | Confirmed gameplay defect. | Fixed in `index.html` on `2026-03-13` by enlarging the certification overlay, lesson readout, and key W3 signs/readouts. |
| World 2 | Turning left makes the camera jump. | Needs one targeted repro. | No patch yet. This could be a real camera bug or a one-off motion edge case. |
| World 3 | Route/objective still felt unclear from the recovery/pre-auth checkpoint. | Needs fresh human follow-up. | No patch in this pass. The note references a second screenshot that was not provided here, and this pass was intentionally limited to W2 quiz-input verification. |
| World 2 | The boss does not have legs. | No patch in certification flow. | Treat as presentation/polish unless later human evidence says it blocks readability or trust. |

## Current Evidence Gap
- No repeat post-fix human notes yet exist for:
  - `?certAid=w2` for the remaining camera/route-clarity complaints after the live quiz-input repro passed
  - `?certAid=w3` after the readability fix, with a literal description of what objective felt unclear

## What Counts As New Confirming Evidence
- 2-3 literal attempts per world
- exact actions tried
- furthest confirmed checkpoint step reached
- visible confirmation text or state seen
- first failure point
- whether the failure felt like route clarity, execution, collision/hitbox, text overlap, or obvious bug

## Current Safe Conclusion
- The current runtime does not reproduce the reported W2 quiz-input failure.
- No new gameplay/runtime patch was justified in this pass.
- The next safe work is fresh human checkpoint evidence for the still-open W2 camera note and W3 route-clarity complaint.
