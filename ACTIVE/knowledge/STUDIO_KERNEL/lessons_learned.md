# LESSONS LEARNED

Any agent may append entries here after discovering something that would help future passes across any studio project. Newest entries at top.

---

## 2026-03-15 — Cold-start token waste kills productivity
- **Context**: CEHP repo had 17 md files at root. New AI agents spent 60% of context reading stable reference docs before finding the active task.
- **Lesson**: Tier documentation aggressively. Cold-start surface should be 7 files or fewer. Move reference docs to overflow/.
- **Applied**: Sprint 006 (CEHP)

## 2026-03-15 — Agents need literal next prompts, not just context
- **Context**: HANDOFF.md provided good context but agents still had to synthesize what to actually do.
- **Lesson**: Every HANDOFF.md section should end with a literal copy-paste prompt the next agent can use.
- **Applied**: Sprint 006 (CEHP)

## 2026-03-14 — Canvas focus loss causes phantom input failures
- **Context**: W2 pop-quiz input appeared broken. Root cause was the HTML canvas losing keyboard focus.
- **Lesson**: Any browser game with keyboard input should call `canvas.focus()` before input-critical moments. Always check focus state before assuming an input bug.
- **Applied**: Sprint 005 (CEHP)

## 2026-03-13 — Automation cannot replace human play for certification
- **Context**: Disposable Playwright drivers could not complete W2 trellis or W3 lamp sequences from spawn.
- **Lesson**: Some gameplay requires human hand-play for honest certification. Stop escalating automation when the blocker is driver weakness, not a game bug.
- **Applied**: Sprint 001-002 (CEHP)

## 2026-03-13 — Shared text surfaces are fragile
- **Context**: Teaching confirmation text was being overwritten by NPC chatter, PA lines, and zone receipts.
- **Lesson**: Any shared text display surface needs explicit overlap prevention. Audit all writers to a shared surface when any teaching beat changes.
- **Applied**: Sprint 002 (CEHP)

## 2026-03-13 — Dev-only features must be invisible when disabled
- **Context**: Certification aid (`?certAid=`) needed to not alter normal player flow.
- **Lesson**: Any dev/debug feature gated by query param or flag must be verified to have zero effect on the default path. Test with AND without the param.
- **Applied**: Sprint 002 (CEHP)
