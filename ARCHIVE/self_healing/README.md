# SELF-HEALING REPOSITORY

## What This Is
An automated detection and repair layer that keeps the codebase healthy between sprints. It finds issues, fixes trivial ones, and escalates complex ones through the existing task system.

## What This Is NOT
This system does NOT make gameplay decisions, override task priorities, or modify any authoritative file.

## Authority Order
```
1️⃣  Repository instructions    ← authoritative
2️⃣  .codex/<GAME>/ memory      ← authoritative
3️⃣  STUDIO_KERNEL/ guidance    ← advisory
4️⃣  auto_tasks/ suggestions    ← suggestions only
5️⃣  self_healing/ automation   ← lowest priority, trivial fixes only
```

## Healing Tiers

### Tier 1 — AUTO FIX (system acts immediately)
Trivial code hygiene issues that can be repaired without review:
- Stray console.log statements in production code
- Unused imports
- Formatting inconsistencies
- Dead variables
- Duplicate semicolons
- Trailing whitespace

All auto-fixes are logged in `self_healing/AUTO_FIX_LOG.md`.

### Tier 2 — ASSISTED FIX (suggestion only, no code changes)
Medium-complexity issues that need agent review:
- Dependency updates
- Test coverage gaps
- Missing type definitions
- Small refactor opportunities

These generate reviewed suggestions in `auto_tasks/REVIEWED/`.

### Tier 3 — DISCOVERY TASK (escalate to task system)
Complex issues requiring Architect approval:
- Modules exceeding size thresholds
- Architecture drift
- Gameplay system gaps
- Performance bottlenecks

These generate tasks in `auto_tasks/DISCOVERED/`.

## Protected Files (NEVER modified by self-healing)
- `NEXT_TASK.md`
- `BACKLOG.md`
- `STUDIO_KERNEL/*`
- `.codex/*`
- `AGENTS.md`
- `HANDOFF.md`
- `CURRENT_PASS.md`

## Where Self-Healing May Write
- `self_healing/AUTO_FIX_LOG.md` — repair log
- `auto_tasks/DISCOVERED/` — new discovery tasks
- `auto_tasks/REVIEWED/` — assisted fix suggestions
- `index.html` — Tier 1 trivial fixes ONLY (whitespace, dead vars, stray console.log)
