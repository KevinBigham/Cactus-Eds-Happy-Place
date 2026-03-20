# ARCHITECTURE PATTERNS

Reusable patterns discovered across studio projects. Advisory only — repository-specific decisions in `.codex/<GAME>/decisions.md` take precedence.

## Single-File Runtime
- **When**: early-stage browser games, prototypes, jam projects
- **How**: all gameplay, save logic, and scenes in one HTML file with no build step
- **Tradeoff**: easy to deploy (static hosting), hard to parallelize edits
- **Mitigation**: timestamped backups, one editor at a time, surgical patches

## Query-Param Feature Gating
- **When**: dev-only tools that must not affect normal player flow
- **How**: `?featureName=value` in the URL, checked at boot
- **Example**: `?certAid=w2` boots directly to a certification checkpoint
- **Rule**: feature must be invisible when the param is absent

## Tiered Documentation
- **When**: repositories with many docs that cause AI context waste
- **How**: Tier 1 (must-read on cold-start), Tier 2 (reference), Tier 3 (memory), Tier 4 (doctrine)
- **Rule**: cold-start should require reading 7 or fewer files

## Task Beacon Pattern
- **When**: multi-agent workflows where agents start from zero context
- **How**: `NEXT_TASK.md` always contains exactly one task with ID, owner, success criteria, and verification commands
- **Rule**: never have two competing task systems in the same repo

## Durable Memory Surface
- **When**: AI agents need cross-session memory
- **How**: `.codex/<PROJECT>/` with standardized files (agent.md, status.md, plan.md, etc.)
- **Rule**: update memory files in the same session as the work, not after

## Sprint Log Pattern
- **When**: projects need chronological history that survives chat resets
- **How**: `SPRINT_LOG.md` with date, goal, changes, result, next_step per entry
- **Rule**: newest entries at the top
