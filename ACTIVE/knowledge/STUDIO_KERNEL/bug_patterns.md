# BUG PATTERNS

Reusable bug patterns discovered across studio projects. When debugging, check this list before deep-diving into code.

---

## Canvas Focus Loss (Browser Games)
- **Symptom**: keyboard input stops working despite correct key handlers
- **Root cause**: HTML canvas lost focus (modal, overlay, DOM manipulation)
- **Fix pattern**: call `canvas.focus()` before any input-critical moment
- **First seen**: CEHP Sprint 005 (W2 pop-quiz)

## Text Overlap On Shared Surfaces
- **Symptom**: important teaching/confirmation text disappears or gets overwritten
- **Root cause**: multiple systems (NPC chatter, PA lines, receipts, confirmations) write to the same text zone without coordination
- **Fix pattern**: use a protected readable-path function that prevents overwrites during teaching windows. Audit all writers when any teaching beat changes.
- **First seen**: CEHP Sprint 002

## Camera Snap On Direction Change
- **Symptom**: camera jerks when player reverses direction
- **Root cause**: camera target uses raw `facing * lookAhead` with no smoothing
- **Fix pattern**: lerp the look-ahead value (e.g., `_camLookAhead += (target - _camLookAhead) * 0.05`)
- **First seen**: CEHP Sprint 005 (W2/W3)

## Stale Progress Across Scene Restart
- **Symptom**: restarting a scene preserves progress that should have been reset
- **Root cause**: checkpoint/progress state not cleared on scene restart
- **Fix pattern**: explicitly reset all progress flags in the scene's create() function
- **First seen**: CEHP Sprint 002

## Query-Param Bleed Into Normal Flow
- **Symptom**: dev-only features affect normal gameplay when the query param is absent
- **Root cause**: feature flag not properly gated or initialization side effects persist
- **Fix pattern**: wrap ALL feature logic in explicit param checks. Test the default (no-param) path as part of every cert pass.
- **First seen**: CEHP Sprint 002
