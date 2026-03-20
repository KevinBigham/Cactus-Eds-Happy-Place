# ACTIVE/CONTROL — Task & Process Control Pointers

All control documents live canonically in `ALL/`. This directory provides a map.

## File Map

| File | Canonical Location | Purpose |
| --- | --- | --- |
| `NEXT_TASK.md` | `ALL/NEXT_TASK.md` | The ONE active task — always start here |
| `BACKLOG.md` | `ALL/BACKLOG.md` | Future task queue |
| `HANDOFF.md` | `ALL/HANDOFF.md` | Per-agent handoff instructions |
| `CURRENT_PASS.md` | `ALL/CURRENT_PASS.md` | Current sprint/pass details |
| `SPRINT_LOG.md` | `ALL/SPRINT_LOG.md` | Chronological sprint history |
| `STUDIO_DASHBOARD.md` | `ALL/STUDIO_DASHBOARD.md` | Read-only mission control |
| `PLAYTEST_LOG.md` | `ALL/PLAYTEST_LOG.md` | Append-only human playtest feedback |
| `HEALTH_TREND.md` | `ALL/HEALTH_TREND.md` | Health score tracking across sprints |
| `KNOWN_ISSUES.md` | `ALL/KNOWN_ISSUES.md` | Known bugs and defects |
| `REQUESTED_INPUTS.md` | `ALL/REQUESTED_INPUTS.md` | Items needing human input |
| `AGENTS.md` | `ALL/AGENTS.md` | Agent roles, rules, and workflow |
| `ARCHITECT_PACKET.md` | `ACTIVE/CONTROL/ARCHITECT_PACKET.md` | Paste-ready Architect briefing (lives here) |

## Protocol Audit

To verify protocol compliance, check:
1. Does `NEXT_TASK.md` have exactly one task?
2. Does `HANDOFF.md` have per-agent sections?
3. Are `.codex/CEHP/` files up to date?
4. Is `STUDIO_DASHBOARD.md` current?
