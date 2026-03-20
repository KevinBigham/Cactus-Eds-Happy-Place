# AUTO TASKS — Autonomous Task Generator

## What This Is
This directory stores **machine-generated development opportunities** discovered by scanning code, build health, architecture, and gameplay signals.

## What This Is NOT
These are **suggestions only**. They are NOT active tasks. They do NOT override any existing system.

## Authority Order
```
1️⃣  Repository instructions     ← authoritative
2️⃣  .codex/<GAME>/ memory       ← authoritative
3️⃣  STUDIO_KERNEL/ guidance     ← advisory
4️⃣  auto_tasks/ suggestions     ← suggestions only
5️⃣  self_healing/ automation    ← lowest priority
```

## Directory Structure
```
auto_tasks/
├── README.md               ← you are here
├── AUTO_TASK_TEMPLATE.md   ← copy for new tasks
├── DISCOVERED/             ← newly found, unreviewed (max 10)
├── REVIEWED/               ← Operations reviewed, pending Architect decision
├── PROMOTED/               ← moved to BACKLOG.md or NEXT_TASK.md (archival)
└── REJECTED/               ← not worth pursuing (archival)
```

## Rules

### The generator may NEVER write to:
- `NEXT_TASK.md`
- `BACKLOG.md`
- `STUDIO_KERNEL/`
- `.codex/`

### The generator may ONLY write to:
- `auto_tasks/DISCOVERED/`
- `auto_tasks/REVIEWED/`

### Task Limits
- Maximum **10 tasks** in `DISCOVERED/` at any time. If the limit is reached, compare impact and keep the top 10. Displaced tasks go to `REJECTED/` with reason noted.
- Maximum **20 tasks** in `REVIEWED/` at any time. If the limit is reached, the oldest reviewed tasks must be archived to `REJECTED/` with reason "exceeded reviewed capacity."
- Tasks exceeding either limit must be archived — never silently dropped.

### Promotion Workflow
```
Generator discovers → DISCOVERED/
          ↓
Operations (Cowork) reviews → REVIEWED/
          ↓
Architect approves → PROMOTED/ + written to BACKLOG.md or NEXT_TASK.md
          ↓
(or) Architect rejects → REJECTED/
```

### Self-Healing Integration
- Tier 2 assisted fixes from `self_healing/` land in `REVIEWED/`
- Tier 3 discovery tasks from `self_healing/` land in `DISCOVERED/`
- See `self_healing/README.md` for tier definitions

## Discovery Signals

### Code Health
TODO/FIXME comments, files >4K lines, duplicated code, unused functions, dead code

### Build Health
Failing tests, missing coverage, lint warnings, dependency drift

### Architecture Drift
Circular deps, state mutation risks, inconsistent data patterns

### Gameplay Opportunities
Unspecced backlog items, missing engagement systems, performance gaps

## File Format
One task per file. Named: `AT-NNN-short-description.md`. Use `AUTO_TASK_TEMPLATE.md`.
