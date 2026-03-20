# NEXT TASK

This file is the **task beacon**. There is always exactly ONE active task here.
When this task is complete, the completing agent updates this file with the next task from BACKLOG.md.

> ⚠️ **ONLY `TASK_OWNER_ROLE` GRANTS ACTIVATION.** If your role does not match `TASK_OWNER_ROLE`, stop and propose only.
> `CURRENT_STAGE` and `NEXT_HANDLER_ROLE` are informational — they do NOT grant activation.
> Write proposals to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md`.
>
> **EDIT IN PLACE**: When updating this file, edit the metadata fields below directly. Never duplicate or append a second metadata block.

---

## TASK_ID: CEHP-010
## TITLE: Fix W2 pop-quiz auto-dismiss timing on first trigger
## TASK_OWNER_ROLE: Reviewer
## CURRENT_STAGE: Review
## NEXT_HANDLER_ROLE: Operations
## OWNER: Codex 5.4 (Builder) — executed by Claude Cowork Opus 4.6 (Operations override)
## REVIEWER: Claude Code Sonnet 4.6
## STATUS: BUILT — AWAITING REVIEW

## CONTEXT
CEHP-009 classified the 4 outstanding W2/W3 certification items from Kevin's 2026-03-16 retest:
- W2 pop-quiz input → **CONFIRMED DEFECT** (quiz auto-dismisses in ~0.2s on first trigger)
- W3 physician/lamp route clarity → still unclear (certAid panel occlusion, not game design)
- W2 checkpoint chain after trellis perch → **PASSED** (Kevin completed graduation)
- W3 checkpoint chain after recovery/pre-auth approach → **PASSED** (all 4 items checked, boss defeated)

One confirmed defect survives: the W2 pop-quiz auto-dismisses on its first trigger (~0.2 seconds — too fast to read or answer). On retry, the quiz returns and accepts input normally. The existing canvas.focus() patch (from Sprint 005, not yet deployed) may help but does not explain the auto-dismiss timing.

## THE ONE THING TO FIX
Find and fix the code path that causes the W2 pop-quiz to auto-dismiss on first trigger before the player can interact. The quiz must remain visible long enough for the player to read it and press 1-4 or Z/X/C/UP.

## SCOPE
May touch only:
- `ACTIVE/game/index.html` — quiz trigger/dismiss logic only

Must not touch:
- save schema / persistence logic
- world progression / checkpoint chain logic
- any W3 code
- certAid overlay code (separate issue)
- any non-quiz gameplay mechanics

## INVESTIGATION HINTS
- Search `index.html` for quiz trigger near x=760 in W2
- Look for auto-close timers, overlapping state transitions, or input handlers that fire a dismiss before the quiz panel is fully shown
- The canvas.focus() call on quiz trigger may interact with the dismiss timing
- Test: after fix, first quiz trigger should show quiz panel and wait for player input indefinitely (or until normal timeout)

## SUCCESS_CRITERIA
- [ ] W2 quiz remains visible on FIRST trigger — does not auto-dismiss in <1s
- [ ] Quiz still accepts 1-4 or Z/X/C/UP input and closes correctly on answer
- [ ] Quiz retry behavior still works (R key)
- [ ] No W3 code changed
- [ ] No save schema changed
- [ ] `node scripts/check_save_schema.js` passes
- [ ] No unrelated gameplay changes

## VERIFICATION_COMMANDS
```bash
node ACTIVE/game/scripts/check_save_schema.js
# Manual browser test:
# 1. Load ?certAid=w2
# 2. Reach x~760 to trigger quiz
# 3. Verify quiz panel stays visible on FIRST trigger
# 4. Press 1 — verify quiz closes and checkpoint advances
# 5. Verify retry (R) still works
```

## AFTER COMPLETION
Update STATUS to COMPLETE. Reviewer validates the fix. After review, Operations pushes to GitHub (completing CEHP-007 scope) and queues human retest of the deployed fix.
