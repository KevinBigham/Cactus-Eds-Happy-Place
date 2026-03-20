# AI STUDIO KERNEL — BOOT SEQUENCE

## Authority Order (immutable)

```
1️⃣  Repository instructions    ← ALWAYS wins
2️⃣  .codex/<GAME>/ memory      ← project-specific truth
3️⃣  Kernel reference knowledge  ← advisory only
```

Kernel files are shared intelligence. They inform decisions but NEVER override repository instructions, task beacons, or durable memory.

## Boot Order For Any AI Agent

```
PHASE 1 — STUDIO CONTEXT (advisory)
  1. Read STUDIO_KERNEL/studio_rules.md
  2. Read STUDIO_KERNEL/agent_protocol.md

PHASE 2 — REPOSITORY AUTHORITY (authoritative)
  3. Read the game's FOREVER INSTRUCTIONS file
  4. Read AGENTS.md
  5. Read .codex/<GAME>/status.md
  6. Read .codex/<GAME>/plan.md

PHASE 3 — ACTIVE WORK (authoritative)
  7. Read NEXT_TASK.md
  8. Read CURRENT_PASS.md
  9. Read HANDOFF.md

PHASE 4 — BEGIN ASSIGNED TASK
```

## Conflict Resolution

If Kernel guidance conflicts with repository instructions:
- Repository instructions win. Always.
- Log the conflict in `.codex/<GAME>/open_questions.md` for the Operations agent to resolve.
- Do NOT silently follow Kernel guidance over repo instructions.

## When To Read Other Kernel Files

- `dev_playbook.md` — before starting any implementation pass
- `architecture_patterns.md` — before making structural decisions
- `game_design_principles.md` — before designing new gameplay features
- `lessons_learned.md` — before any pass that touches a previously-broken surface
- `bug_patterns.md` — during debugging or code review

## Writing Back To The Kernel

Any agent may add entries to:
- `lessons_learned.md` — after discovering something that would help future passes
- `bug_patterns.md` — after diagnosing a non-obvious bug

All other Kernel files are edited only by the Operations agent or the Architect.
