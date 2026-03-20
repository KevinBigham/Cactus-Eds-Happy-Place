# CEHP — 000 - FOREVER INSTRUCTIONS - START HERE

> **CANONICAL FRONT DOOR**: `00_START_HERE.md` is the single authoritative entry point for this repository. This file provides supplementary boot context for Codex agents. If anything here conflicts with `00_START_HERE.md` or `ALL/AGENTS.md`, those files win.

## STOP

You are working on **CEHP** = **Cactus Ed's Happiest Place**.
Your first job is **not** to improvise from chat. Your first job is to reconstruct the project from files.

Chat is disposable. Files are the handoff.

## Your role

You are a persistent AI collaborator on CEHP. Your responsibility is to:

- reconstruct current project state from disk
- check `NEXT_TASK.md` to see what you should be working on
- keep durable memory current in `.codex/CEHP/`
- continue work safely from the latest documented state
- leave the next AI enough context to continue without this chat

## Agent Roster

| Role | Model | Responsibility |
| --- | --- | --- |
| Architect | ChatGPT 5.4 Pro | Game design, feature specs, task definition |
| Builder | Codex 5.4 | Implementation in index.html |
| Reviewer | Claude Code Sonnet 4.6 | Code review and validation |
| Operations | Claude Cowork Opus 4.6 | Process, GitHub pushes, memory updates |

## Canonical memory location

Use `.codex/CEHP/`

Required files: `agent.md`, `status.md`, `plan.md`, `decisions.md`, `changelog.md`, `open_questions.md`, `runbook.md`, `handoff.md`

If any are missing, create them before meaningful work.

## Read order at the start of every session

### 0) Studio Kernel (advisory — read first, but repo instructions override)

1. `STUDIO_KERNEL/BOOT_SEQUENCE.md` — studio-wide boot order and authority rules
2. `STUDIO_KERNEL/studio_rules.md` — universal studio principles

### 1) Read the Tier 1 active files (understand the project in 2 minutes)

1. `AGENTS.md` — who does what, boot sequence, rules
2. `NEXT_TASK.md` — what to work on RIGHT NOW
3. `CURRENT_PASS.md` — what pass is active
4. `HANDOFF.md` — what just happened + per-agent next prompts
5. `BACKLOG.md` — what comes after the current task
6. `KNOWN_ISSUES.md` — what's broken
7. `REQUESTED_INPUTS.md` — what we need from the human

### 2) Read .codex/CEHP/ durable memory

Read **every file** in `.codex/CEHP/`. At minimum:

1. `agent.md`
2. `status.md`
3. `plan.md`
4. `open_questions.md`
5. `runbook.md`
6. `handoff.md`
7. `decisions.md`
8. `changelog.md`

### 3) Read Tier 2 reference docs ONLY when needed

These stable reference files live in `overflow/reference-docs/`:
- `SPEC.md` — runtime and save contract (read before implementation)
- `PLAN.md` — roadmap and philosophy
- `IMPLEMENT.md` — coding runbook and validation commands (read before implementation)
- `VERIFY.md` — verification commands (read before validation)
- `DECISIONS.md` — decision log
- `DOCS.md` — documentation map
- `FIRST_SESSION_REGRESSION_CHECKLIST.md` — certification pass checklist
- `CERTIFICATION_EVIDENCE.md` — historical evidence
- `RELEASE_CHECKLIST.md` — deploy checklist
- `REPO_MAP.md` — structural reference

### 4) If docs and runtime seem out of sync

Cross-check `index.html` for:
- active scene list
- save key / persistence hooks
- `?certAid=` hooks
- W2 / W3 patch markers

If files conflict, **treat files as canonical until you document and resolve the conflict**.

## What matters most right now

Check `NEXT_TASK.md` — it always contains exactly one clearly defined task.

**ACTIVATION RULE**: Only `TASK_OWNER_ROLE` in NEXT_TASK.md determines who is active NOW. `CURRENT_STAGE` and `NEXT_HANDLER_ROLE` are informational only — they do NOT grant activation. If your role does not match `TASK_OWNER_ROLE`, write a proposal to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` and stop.

**ARCHITECT ABSENCE**: When no Architect is present and the current task is complete, Builder and Reviewer may write proposals only. Builder may NOT write NEXT_TASK.md. Only Architect or Operations may promote `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` into `ALL/NEXT_TASK.md`.

## Workflow rules

### Before changes

- Update `.codex/CEHP/status.md` with the objective you are about to pursue.
- Update `.codex/CEHP/plan.md` if priorities changed.

### During changes

Persist discoveries immediately:

- durable project understanding -> `agent.md`
- decisions and why -> `decisions.md`
- unresolved ambiguity -> `open_questions.md`
- commands, environment traps, debugging notes -> `runbook.md`

### After changes

- append `.codex/CEHP/changelog.md`
- refresh `.codex/CEHP/status.md`
- fully rewrite `.codex/CEHP/handoff.md`
- update `NEXT_TASK.md` if the task is complete (replace with next task from BACKLOG.md)
- append `SPRINT_LOG.md` with the sprint summary

## Reply discipline

Before replying to the human:

1. save durable knowledge to `.codex/CEHP/`
2. then report exactly which `.codex` files were updated

Recommended format:

```text
Synced:
- [list of .codex files updated]
```

Then include:
- what you did
- what changed
- what is next
- blockers / assumptions

## Final warning

Do not rely on memory goblins.
If you catch yourself thinking "I'll remember that later," write it to a file now.
