# CLAUDE ADAPTER

This file is a thin adapter, not a second ruleset. **Start with `CLAUDE.md` at the project root — that is the durable instruction file.**

Read in this order:
1. Root `CLAUDE.md` ← **durable project instructions, read first**
2. Root `README_Instructions on What To Do.md` ← **current state and tasks**
3. `ACTIVE/docs/NEXT_TASK.md` ← **the ONE active task**
4. `ACTIVE/docs/AGENTS.md` ← **agent roles and rules**
5. `.codex/CEHP/status.md` ← **most authoritative current state**

Collaboration truth:
- ChatGPT 5.4 Pro = architect/director only
- Codex 5.4 = builder only
- Claude Code Sonnet 4.6 = reviewer only
- Claude Cowork Opus 4.6 = ops/producer coordinator only

Shared memory policy:
- **Canonical memory surface**: `.codex/CEHP/` — the ONLY authoritative cross-session memory.
- Agent-private memory systems are supplementary only and NEVER authoritative.
- If chat and `.codex/CEHP/` disagree, `.codex/CEHP/` wins.

Runtime truth:
- `ACTIVE/game/index.html`

Save schema verification:
- `node ACTIVE/game/scripts/check_save_schema.js`

Reference docs (read when needed, not on cold-start):
- `ACTIVE/knowledge/overflow/reference-docs/` — SPEC, PLAN, IMPLEMENT, VERIFY, DECISIONS, etc.

Ignore by default unless the task explicitly targets them:
- `ARCHIVE/**`
- `ACTIVE/knowledge/overflow/` if present
