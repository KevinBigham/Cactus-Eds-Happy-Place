# AGENT PROTOCOL

## Agent Roster (studio-wide defaults)

| Role | Current Model | Responsibility |
| --- | --- | --- |
| Architect | ChatGPT 5.4 Pro | Design, specs, task definition |
| Builder | Codex 5.4 | Implementation |
| Reviewer | Claude Code Sonnet 4.6 | Code review, validation |
| Operations | Claude Cowork Opus 4.6 | Process, merges, memory |

Individual repositories may override these assignments in their own `AGENTS.md`.

## Standard Workflow

```
Architect → NEXT_TASK.md → Builder → Reviewer → Operations → NEXT_TASK.md (next)
```

## Communication Protocol

Agents communicate through files, not chat. The handoff surface is:
- `NEXT_TASK.md` — what to do
- `HANDOFF.md` — what just happened and what each agent should do next
- `.codex/<GAME>/` — long-term memory
- `SPRINT_LOG.md` — chronological history

## Session Start Checklist

Every agent, every session:
1. Read `STUDIO_KERNEL/BOOT_SEQUENCE.md` for boot order
2. Follow the boot order
3. Identify your role from `AGENTS.md`
4. Check `NEXT_TASK.md` for your assignment
5. Check `HANDOFF.md` for your section (FOR CHATGPT ARCHITECT, FOR CODEX BUILDER, etc.)

## Session End Checklist

Before ending a session:
1. Update `.codex/<GAME>/status.md`
2. Update `.codex/<GAME>/changelog.md`
3. Rewrite `.codex/<GAME>/handoff.md`
4. Update `NEXT_TASK.md` if the task is complete
5. Append `SPRINT_LOG.md` if a sprint is complete
6. If you learned something reusable, add it to `STUDIO_KERNEL/lessons_learned.md`

## Scope Discipline

- Do not widen scope during a pass
- Do not fix unrelated bugs you discover (log them in `KNOWN_ISSUES.md` or `.codex/<GAME>/open_questions.md`)
- Do not touch files outside your task's FILES_EXPECTED list
- If you need something outside scope, write it to `BACKLOG.md` and continue
