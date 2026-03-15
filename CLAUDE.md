# CLAUDE ADAPTER

This file is a thin adapter, not a second ruleset.

Read in this order:
1. `AGENTS.md`
2. `docs/ACTIVE_WORKING_SET.md`
3. `CURRENT_PASS.md`
4. `HANDOFF.md`

Collaboration truth:
- ChatGPT = architect/director only
- Codex = builder only
- Claude Code = reviewer only
- Claude Cowork = ops/producer coordinator only

Runtime truth:
- `index.html`

Canonical verify wrapper:
- `scripts/verify-cehp.sh`

Ignore by default unless the task explicitly targets them:
- `legacy/quarantine/**`
- `overflow/` if present
- any archive/history lane
