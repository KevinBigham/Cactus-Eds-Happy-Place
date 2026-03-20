# CEHP Open Questions

## Open

### 1. Do the 2026-03-14 W2 quiz-focus and camera/readability patches fully resolve the remaining human complaints?
- current assumption: partially unresolved until fresh `?certAid=w2` and `?certAid=w3` human notes confirm behavior
- risk if assumption is wrong: agents may leave a broken path unpatched or over-patch an issue that no longer reproduces
- owner / next step: CEHP-008 (human retest after GitHub push)

### 2. Should the project pursue engagement systems (achievements, speedrun, sound) before or after full W2/W3 certification?
- current assumption: after certification — first-session trust is the priority
- risk if assumption is wrong: deferred engagement work could delay the game's appeal
- owner / next step: Architect (ChatGPT 5.4 Pro) to decide after CEHP-008 results

### 3. Does the new tiered file structure cause problems for any agent?
- current assumption: no — the boot sequence is simpler and faster
- risk if assumption is wrong: an agent might fail to find a reference doc it expects at root
- owner / next step: Claude Code Sonnet 4.6 (Reviewer) to verify in next review pass
