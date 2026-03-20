# 00 — START HERE

> **This is the single front door for the CEHP repository.**
> Read this file FIRST. Read it again LAST before ending your session.

---

## MANDATORY STOP RULES

**READ THESE BEFORE DOING ANYTHING ELSE.**

**NO-TASK RULE**: If `ALL/NEXT_TASK.md` does not assign work to your role (check `TASK_OWNER_ROLE`), **do not act**. Write a proposal to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` and stop.

**NO-SELF-ASSIGN RULE**: Do not self-assign work. Do not improvise tasks. Do not widen scope. If you are not the `TASK_OWNER_ROLE` in NEXT_TASK.md, you have no active assignment.

**NO-LANE-CROSSING RULE**: Do not modify gameplay code (`ALL/index.html`) unless you are the Builder AND explicitly assigned. Reviewer must not implement. Builder must not review. Operations must not design.

**ACTIVATION RULE**: Only `TASK_OWNER_ROLE` determines who is active NOW. `CURRENT_STAGE` describes what kind of work is happening. `NEXT_HANDLER_ROLE` indicates who goes next. Neither `CURRENT_STAGE` nor `NEXT_HANDLER_ROLE` grants activation.

**PROPOSAL LANE**: If you see work that needs doing but it is not assigned to you, write it to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md`. Only Architect or Operations may promote proposals into `ALL/NEXT_TASK.md`.

---

## Project Identity

- **Game**: Cactus Ed's Happiest Place (CEHP)
- **Runtime truth**: `ALL/index.html` (single-file Phaser browser platformer)
- **Stack**: Phaser from CDN, ES5 JavaScript, no build step
- **Public URL**: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
- **Public repo**: https://github.com/KevinBigham/Cactus-Eds-Happy-Place

---

## Where Things Live

| What | Location |
| --- | --- |
| **Gameplay code** | `ALL/index.html` |
| **Active control docs** | `ACTIVE/CONTROL/` → pointers to `ALL/` |
| **Durable memory** | `.codex/CEHP/` (canonical) |
| **Advisory knowledge** | `ALL/STUDIO_KERNEL/` |
| **Auto-task suggestions** | `ALL/auto_tasks/` |
| **Self-healing automation** | `ALL/self_healing/` |
| **Validation scripts** | `ALL/scripts/` |
| **Reference docs** | `ALL/overflow/reference-docs/` |
| **Archived/stale docs** | `ARCHIVE/` |
| **Dashboard (read-only)** | `ALL/STUDIO_DASHBOARD.md` |

---

## Authority Hierarchy (immutable)

```
1️⃣  Repository instructions (this file + AGENTS.md)  ← ALWAYS wins
2️⃣  .codex/CEHP/ shared durable memory               ← project truth
3️⃣  STUDIO_KERNEL/ advisory guidance                  ← advisory only
4️⃣  auto_tasks/ suggestions                           ← suggestions only
5️⃣  self_healing/ automation                          ← trivial fixes only
6️⃣  STUDIO_DASHBOARD.md summary                       ← read-only view
```

---

## Agent Roster

| Role | Model | Responsibility |
| --- | --- | --- |
| **Architect** | ChatGPT 5.4 Pro | Game design, feature specs, task definition. Writes NEXT_TASK.md. |
| **Builder** | Codex 5.4 | Implementation. Writes code in index.html. Only touches files listed in NEXT_TASK.md. |
| **Reviewer** | Claude Code Sonnet 4.6 | Code review, validation, regression checks. Does NOT write gameplay code unless explicitly reassigned. |
| **Operations** | Claude Cowork Opus 4.6 | Process oversight, GitHub pushes, memory updates. |

---

## Boot Sequence (read in this order)

### Phase 0 — Studio Context (advisory)
1. `ALL/STUDIO_KERNEL/BOOT_SEQUENCE.md`
2. `ALL/STUDIO_KERNEL/studio_rules.md`

### Phase 1 — Repository Authority
3. **This file** (`00_START_HERE.md`) ← you are here
4. `ALL/AGENTS.md`
5. `.codex/CEHP/status.md`
6. `.codex/CEHP/plan.md`

### Phase 2 — Active Work
7. `ALL/NEXT_TASK.md` — the ONE active task
8. `ALL/CURRENT_PASS.md`
9. `ALL/HANDOFF.md`

### Phase 3 — Begin Assigned Task
Only if `NEXT_TASK.md` assigns work to YOUR role.

---

## The No-Task Rule (mandatory — repeated for emphasis)

**If `NEXT_TASK.md` does not assign work to your role, do not act. Propose only.**

How to check: open `ALL/NEXT_TASK.md` and read `TASK_OWNER_ROLE`. If it does not name your role, you have NO active assignment.

What to do instead:
- Write your proposal to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md`.
- Optionally note it in `.codex/CEHP/open_questions.md`.
- Then stop. Do not implement, review, or modify anything.

---

## Role Checklists

### Builder Checklist
- [ ] Read `00_START_HERE.md` (you are here)
- [ ] Open `ALL/NEXT_TASK.md` — does `TASK_OWNER_ROLE` say "Builder"?
- [ ] **If NO** → write proposal to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` and STOP
- [ ] **If YES** → implement ONLY the assigned task, no scope widening
- [ ] **BEFORE YOU CLOSE**:
  - [ ] Update `.codex/CEHP/status.md` and `changelog.md`
  - [ ] Update `ALL/HANDOFF.md` (Builder section at minimum)
  - [ ] **Rotate `NEXT_TASK.md` metadata in place:** set `TASK_OWNER_ROLE` → Reviewer, `CURRENT_STAGE` → Review, `NEXT_HANDLER_ROLE` → Operations, update `STATUS`
  - [ ] Update NEXT_TASK.md STATUS field in place if task state changed

### Reviewer Checklist
- [ ] Read `00_START_HERE.md` (you are here)
- [ ] Open `ALL/NEXT_TASK.md` — does `TASK_OWNER_ROLE` say "Reviewer"?
- [ ] **If NO** → write proposal to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` and STOP
- [ ] **If YES** → review BEFORE implementing anything
- [ ] Reviewer must NOT implement features unless explicitly reassigned by Architect or Kevin
- [ ] **BEFORE YOU CLOSE**:
  - [ ] Update NEXT_TASK.md STATUS field in place (e.g., APPROVED / CHANGES_REQUESTED)
  - [ ] Update `.codex/CEHP/status.md` if project state changed
  - [ ] **Rotate `NEXT_TASK.md` metadata in place:** set `TASK_OWNER_ROLE` → Operations, `CURRENT_STAGE` → Operations, `NEXT_HANDLER_ROLE` → Architect, update `STATUS`
  - [ ] Update `ALL/HANDOFF.md` (Reviewer section at minimum)

### Operations Checklist
- [ ] Read `00_START_HERE.md`
- [ ] Verify role assignment in `NEXT_TASK.md`
- [ ] Execute process/push/memory tasks only
- [ ] **BEFORE YOU CLOSE**:
  - [ ] Update `.codex/CEHP/` durable memory (status.md, changelog.md, handoff.md)
  - [ ] Update `ALL/HANDOFF.md`
  - [ ] Update `ALL/STUDIO_DASHBOARD.md` if systems changed

### Architect Checklist
- [ ] Read `00_START_HERE.md`
- [ ] Read `ACTIVE/CONTROL/ARCHITECT_PACKET.md` for briefing
- [ ] Define tasks in `NEXT_TASK.md` — one task at a time
- [ ] Update `ALL/BACKLOG.md` with future priorities

---

## Architect Absence Protocol

When the Architect is absent and the current task is complete:

- Builder and Reviewer may write proposals to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` only.
- Builder may NOT write `ALL/NEXT_TASK.md`.
- Only Architect or Operations may promote `PROPOSED_NEXT_TASK.md` into `ALL/NEXT_TASK.md`.
- No agent may self-assign, improvise, or widen scope while waiting for Architect input.

---

## Protected Files and Boundaries

These files must NOT be modified by automation, self-healing, or auto-task systems:

- `NEXT_TASK.md`, `BACKLOG.md`, `AGENTS.md`, `HANDOFF.md`, `CURRENT_PASS.md`
- `.codex/CEHP/*`
- `STUDIO_KERNEL/*` (except `lessons_learned.md` and `bug_patterns.md` which are append-only)

Gameplay code (`index.html`) must only be modified by the Builder when assigned via `NEXT_TASK.md`.

---

## Shared Memory Policy

- **Canonical memory surface**: `.codex/CEHP/` — this is the ONLY authoritative cross-session memory.
- Required files: `agent.md`, `status.md`, `plan.md`, `decisions.md`, `changelog.md`, `open_questions.md`, `runbook.md`, `handoff.md`
- Agent-private memory systems are supplementary only and NEVER authoritative.
- If chat memory and `.codex/CEHP/` disagree, `.codex/CEHP/` wins until the conflict is explicitly resolved.

---

## Architect Packet Rule

When the Architect (ChatGPT 5.4 Pro) needs briefing, use `ACTIVE/CONTROL/ARCHITECT_PACKET.md` as the ONLY briefing artifact. This file must be paste-ready for a blank ChatGPT 5.4 Pro chat. Do not create a second Architect prompt system.

---

## ARCHIVE/ Policy

`ARCHIVE/` contains stale, legacy, or superseded documents. Read ARCHIVE/ only when a task explicitly requires historical context. It is not part of the active workspace.

---

## Exit Checklist (complete before ending every session)

- [ ] Did I only work on my role-assigned task?
- [ ] Did I update `.codex/CEHP/status.md` and `changelog.md`?
- [ ] Did I update `ALL/HANDOFF.md`?
- [ ] Did I preserve the authority hierarchy?
- [ ] Did I avoid editing protected files without assignment?
- [ ] If no active task existed for my role, did I stop and propose instead of acting?
- [ ] Re-read this file to confirm compliance.
