# CEHP Decisions

## 2026-03-15 — Sprint 006 Process Decisions
- Adopted NEXT_TASK.md as the single task beacon — exactly one task defined at all times.
- Decided against full tasks/ kanban directory — project is sequential and single-file, BACKLOG.md serves as the queue.
- Moved 10 reference docs to overflow/reference-docs/ to reduce cold-start token waste.
- Adopted tiered boot sequence: Tier 1 (must read), Tier 2 (read when needed), Tier 3 (durable memory), Tier 4 (doctrine).
- Created SPRINT_LOG.md for chronological history that survives chat resets.
- HANDOFF.md now requires per-agent sections with literal next prompts (FOR CHATGPT ARCHITECT, FOR CODEX BUILDER, FOR CLAUDE CODE REVIEWER, FOR COWORK OPERATIONS, FOR PUBLIC DEPLOY).
- Updated agent roster to exact model versions: ChatGPT 5.4 Pro, Codex 5.4, Claude Code Sonnet 4.6, Claude Cowork Opus 4.6.

## 2026-03-15 — Standing Decisions Carried Forward
- `index.html` remains runtime truth.
- Repo-local markdown files are the durable planning layer.
- Human certification is primary for W2/W3 continuity.
- Prefer a missing patch over an unproven patch.
- `overflow/`, `legacy/quarantine/`, and any archive/history lane are ignored by default.
