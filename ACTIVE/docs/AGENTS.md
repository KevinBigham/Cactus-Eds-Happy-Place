# Cactus Ed's Happiest Place — Agent Rules

## STOP — Read This First

You are an AI agent working on **CEHP** (Cactus Ed's Happiest Place).
Chat is disposable. Files are the handoff. Reconstruct state from files, not memory.

**Before doing anything, read `00_START_HERE.md` at the repo root.** That is the single front door.

## Agent Roster

| Role | Model | Responsibility |
| --- | --- | --- |
| **Architect** | ChatGPT 5.4 Pro | Game design, feature specs, task definition. Writes NEXT_TASK.md. |
| **Builder** | Codex 5.4 | Implementation. Writes code in index.html. Only touches files listed in NEXT_TASK.md. |
| **Reviewer** | Claude Code Sonnet 4.6 | Code review, validation, regression checks. Does not write gameplay code. |
| **Operations** | Claude Cowork Opus 4.6 | Process oversight, GitHub pushes, memory updates, idea generation. |

## Workflow

```
Architect defines task → writes NEXT_TASK.md
          ↓
Builder implements → commits to branch
          ↓
Reviewer validates → approves or requests changes
          ↓
Operations merges → pushes to main → updates memory files
          ↓
Operations updates NEXT_TASK.md with next task from BACKLOG.md
```

## Cold-Start Boot Sequence (READ IN THIS ORDER)

### Tier 1 — Must Read (understand the project in 2 minutes)
1. `AGENTS.md` ← you are here
2. `NEXT_TASK.md` — what to work on RIGHT NOW
3. `CURRENT_PASS.md` — what pass is active
4. `HANDOFF.md` — what just happened + per-agent instructions
5. `BACKLOG.md` — what comes after the current task
6. `KNOWN_ISSUES.md` — what's broken
7. `REQUESTED_INPUTS.md` — what we need from the human

### Tier 2 — Read When Needed (stable reference docs)
These live in `overflow/reference-docs/`. Read them when doing implementation, certification, or deploy work:
- `SPEC.md` — runtime and save contract details
- `PLAN.md` — roadmap and pass philosophy
- `IMPLEMENT.md` — implementation runbook and validation commands
- `VERIFY.md` — verification commands
- `DECISIONS.md` — decision log
- `DOCS.md` — documentation map
- `FIRST_SESSION_REGRESSION_CHECKLIST.md` — cert pass checklist
- `CERTIFICATION_EVIDENCE.md` — historical evidence
- `RELEASE_CHECKLIST.md` — deploy checklist
- `REPO_MAP.md` — structural reference

### Tier 3 — Durable Memory (cross-session AI memory)
- `.codex/CEHP/` — all files (agent.md, status.md, plan.md, etc.)
- Read these after Tier 1 to recover long-term context.

### Tier 4 — Supporting Doctrine (read only when task requires it)
- `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`
- `overflow/supporting-doctrine/DO_NOT_BREAK.md`
- `docs/ACTIVE_WORKING_SET.md`

## Project Identity
- Runtime truth: `index.html` (single-file HTML browser platformer)
- Stack: Phaser from CDN, ES5 JavaScript, no build step
- Active scenes: `Title`, `Demo`, `World2`, `World3`
- Public URL: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
- Public repo: https://github.com/KevinBigham/Cactus-Eds-Happy-Place
- Public status: Preview

## Truth Hierarchy
1. `index.html` — implementation truth for gameplay and runtime behavior
2. Tier 1 files — active planning and communication layer
3. Tier 2 files in `overflow/reference-docs/` — stable reference
4. `overflow/supporting-doctrine/` — creative doctrine and guardrails
5. `README.md` and `legacy/quarantine/**` — historical context only
6. If docs and live code disagree, report the disagreement and say which source appears current.

## Working Rules
- Smallest safe fix first.
- Preserve save compatibility (`cactusEd_save_v1`), assist persistence, direct boot, and normal title/menu flow.
- Do not broadly rewrite `index.html` for local problems.
- Prefer surgical runtime fixes over new systems.
- No one widens scope during a structure pass.
- Builder builds only after a task is defined in NEXT_TASK.md.
- Reviewer reviews only after Builder verification succeeds.
- Operations pushes only after Reviewer approval.
- Ignore `legacy/quarantine/**` by default unless the task explicitly targets them.
- Ignore `overflow/` by default unless the task explicitly targets reference or doctrine files.

## Gameplay-Safe Coding Rules
- The opener is a promise.
- Weirdness must pay rent.
- The institution posts its rules before it punishes.
- Ed is the straight man.
- Cigarette centrality stays.
- The ending is sacred.
- Protect competence, autonomy, curiosity, and authored trust before polish.

## Overlap And Confirmation Rules
- All delayed teaching or confirmation text must use `showProtectedReadableText(...)` or equivalent zone-safe readable-path logic.
- Do not let older generic reward or acknowledgment text bypass protected readable paths.
- Do not let the World 2 preview dismissal depend on delayed polling or leave preview text nodes alive after close.
- Do not let World 3 diagnostic zone receipts enter the scan teaching pocket.
- Do not let full-screen/modal overlays remain alive after dismissal.
- Do not let counselor hotspot telemetry arm before the counselor band is actually active.
- Do not let the physician threshold or boss activation bypass pre-auth completion.
- Do not let the dev-only certification aid alter normal title/menu flow when the query param is absent.
- Do not let checkpoint retry preserve stale progress across scene restart.
- Treat `TEXT_ZONES` as a fragile shared surface. Audit late receipts, PA lines, ads, and NPC barks whenever a teaching beat changes.

## HANDOFF.md Requirements
HANDOFF.md must always contain these sections:
- `FOR CHATGPT ARCHITECT` — design context and decisions needed
- `FOR CODEX BUILDER` — exact implementation instructions
- `FOR CLAUDE CODE REVIEWER` — what to review and verify
- `FOR COWORK OPERATIONS` — merge/push instructions and memory updates
- `FOR PUBLIC DEPLOY` — public URL status and deploy blockers

## Validation
- Canonical verify wrapper: `./scripts/verify-cehp.sh`
- Save schema check: `node scripts/check_save_schema.js`
- Manual server: `python3 -m http.server 4175 --bind 127.0.0.1`
- Dev-only cert aid: `?certAid=w2`, `?certAid=w3`
- Skill draft: `docs/skills/first-session-certification/SKILL.md` (consult manually)

## Certification Honesty
- Do not claim full certification unless a full focused continuity run actually happened.
- If only targeted probes were run, say so explicitly and name the missing continuity segments.
- Separate structural correctness from felt correctness in reports.
- Report exact commands actually run.

## Pre-Commit Hygiene
- Before any commit: run `git status`, confirm repo root, confirm branch, confirm only in-scope files are staged.
- If out-of-scope files are staged: STOP, report them, do not include them.
- Do not report a public link as live unless it was directly verified in the current pass.

## One-File Warning
- Avoid multiple live threads editing `index.html` at the same time.
- Make a fresh sibling backup of `index.html` before risky passes.

## Game Development Tracks

### ENGINE
Runtime performance, Phaser integration, save system, scene management.
Current priority: stability and certification.

### UI / PLAYER EXPERIENCE
Text readability, camera behavior, input responsiveness, certification overlay.
Current priority: W2/W3 defect patches awaiting human retest.

### ENGAGEMENT SYSTEMS (future)
Curiosity-driven exploration, player progression, emergent narratives.
Achievement system (save contract already tracks totalKills, deaths, runs, bestTime).
Speedrun timer, mobile touch controls, share/screenshot features.
Current priority: deferred until first-session certification is complete.

## AI Studio Kernel

This repository includes a shared knowledge layer at `STUDIO_KERNEL/`.

**What it is**: reusable development principles, architecture patterns, lessons learned, and bug patterns shared across all studio games (CEHP, MBD, MFD).

**What it is NOT**: it does not contain tasks, project status, or game-specific decisions. Those belong in `NEXT_TASK.md`, `BACKLOG.md`, and `.codex/<GAME>/`.

**Authority order**:
```
1️⃣  Repository instructions (this file, FOREVER INSTRUCTIONS)  ← ALWAYS wins
2️⃣  .codex/CEHP/ durable memory                                ← project truth
3️⃣  STUDIO_KERNEL/ guidance                                     ← advisory only
```

**Boot integration**: agents read `STUDIO_KERNEL/BOOT_SEQUENCE.md` first, then follow the repository's own boot sequence. If Kernel guidance conflicts with repo instructions, repo instructions win.

**Writing to the Kernel**: any agent may append to `lessons_learned.md` and `bug_patterns.md` after discovering something reusable. All other Kernel files are edited only by Operations or the Architect.

**Kernel files**:
- `STUDIO_KERNEL/BOOT_SEQUENCE.md` — boot order and authority rules
- `STUDIO_KERNEL/studio_rules.md` — universal studio principles
- `STUDIO_KERNEL/agent_protocol.md` — agent roles and communication protocol
- `STUDIO_KERNEL/dev_playbook.md` — implementation best practices
- `STUDIO_KERNEL/architecture_patterns.md` — reusable architecture patterns
- `STUDIO_KERNEL/game_design_principles.md` — shared design philosophy
- `STUDIO_KERNEL/lessons_learned.md` — cross-project discoveries (append-only)
- `STUDIO_KERNEL/bug_patterns.md` — known bug patterns and fixes (append-only)

## Autonomous Task Generator

The `auto_tasks/` directory contains machine-generated development opportunities discovered by scanning code, build health, architecture, and gameplay signals.

**These are suggestions only.** They are NOT active tasks. They never become active automatically.

**Authority order** (updated):
```
1️⃣  Repository instructions    ← authoritative
2️⃣  .codex/<GAME>/ memory      ← authoritative
3️⃣  STUDIO_KERNEL/ guidance    ← advisory
4️⃣  auto_tasks/ suggestions    ← lowest priority
```

**Promotion workflow**: Generator discovers → `DISCOVERED/` → Operations reviews → `REVIEWED/` → Architect approves → `PROMOTED/` + written to `BACKLOG.md` or `NEXT_TASK.md` (or `REJECTED/`).

**Task limit**: maximum 10 tasks in `DISCOVERED/` at any time.

**The generator may NEVER write to**: `NEXT_TASK.md`, `BACKLOG.md`, `STUDIO_KERNEL/`, `.codex/`.

See `auto_tasks/README.md` for full rules and `auto_tasks/AUTO_TASK_TEMPLATE.md` for the task format.

## Self-Healing Repository

The `self_healing/` directory provides automated detection and repair of trivial code issues.

**Healing tiers**:
- **Tier 1 — AUTO FIX**: trivial hygiene (trailing whitespace, stray console.log, dead vars, duplicate semicolons). Applied immediately, logged in `self_healing/AUTO_FIX_LOG.md`. Reverted if verification fails.
- **Tier 2 — ASSISTED FIX**: medium issues (dependency updates, test gaps, small refactors). Generates suggestions in `auto_tasks/REVIEWED/`. No code changes.
- **Tier 3 — DISCOVERY TASK**: complex issues (architecture drift, size thresholds, gameplay gaps). Generates tasks in `auto_tasks/DISCOVERED/`.

**Scan triggers**: after every sprint, before releases, after large merges, when NEXT_TASK.md changes.

**The system may NEVER modify**: `NEXT_TASK.md`, `BACKLOG.md`, `STUDIO_KERNEL/`, `.codex/`, `AGENTS.md`, `HANDOFF.md`, `CURRENT_PASS.md`.

**Authority order** (complete):
```
1️⃣  Repository instructions    ← authoritative
2️⃣  .codex/<GAME>/ memory      ← authoritative
3️⃣  STUDIO_KERNEL/ guidance    ← advisory
4️⃣  auto_tasks/ suggestions    ← suggestions only
5️⃣  self_healing/ automation   ← lowest priority, trivial fixes only
```

See `self_healing/README.md` for full rules and `self_healing/HEALING_RULES.md` for fix criteria.

## Studio Dashboard

`STUDIO_DASHBOARD.md` is a **read-only mission control view** that summarizes the entire system in one file: active task, build health, repository health score, auto-task counts, self-healing activity, kernel discoveries, and sprint status.

**It does NOT store tasks, decisions, or code.** It is the lowest-priority layer in the system:
```
1️⃣  Repository instructions    ← authoritative
2️⃣  .codex/<GAME>/ memory      ← authoritative
3️⃣  STUDIO_KERNEL/ guidance    ← advisory
4️⃣  auto_tasks/ suggestions    ← suggestions only
5️⃣  self_healing/ automation   ← trivial fixes only
6️⃣  STUDIO_DASHBOARD.md        ← read-only summary
```

**Update triggers**: sprint start/end, NEXT_TASK.md changes, auto_tasks scans, self_healing runs, kernel updates.

## System Stability (Sprint 011)

Sprint 011 hardened all systems with sustainability controls:

**Scan Automation**: `scripts/studio-scan.sh` runs read-only health scans covering code health, build health, architecture drift, and gameplay opportunities. Outputs `scan-results.md`. Never modifies code.

**Playtest Feedback**: `PLAYTEST_LOG.md` captures human playtesting observations. Append-only — AI agents must not edit existing entries. Playtest feedback outranks automated suggestions when they conflict.

**Health Trend**: `HEALTH_TREND.md` tracks repository health score across sprints. Two-sprint decline rule: if score drops for two consecutive sprints, schedule a tech-debt sprint. Target: 85% by Sprint 015.

**Task Growth Controls**: `DISCOVERED/` max 10, `REVIEWED/` max 20. Tasks exceeding limits are archived to `REJECTED/`, never silently dropped.

**Kernel Integrity**: Kernel stores cross-project patterns only. Project-specific knowledge belongs in `.codex/<GAME>/`. New entries should only be added when a pattern appears in 2+ repos.

**Self-Healing Scope**: May not modify files >1,000 lines. May not modify gameplay logic. Must verify before and after every fix.

## Role Gate (mandatory — Sprint 012+)

Every agent session must pass this gate before executing any work:

```
1. Read 00_START_HERE.md
2. Open NEXT_TASK.md
3. Read TASK_OWNER_ROLE
4. Does your role match TASK_OWNER_ROLE?
   YES → proceed with assigned task only
   NO  → write proposal to ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md → STOP
```

**ACTIVATION RULE**: Only `TASK_OWNER_ROLE` determines who is active NOW. `CURRENT_STAGE` describes what kind of work is happening. `NEXT_HANDLER_ROLE` indicates who goes next AFTER the current stage completes. Neither `CURRENT_STAGE` nor `NEXT_HANDLER_ROLE` grants activation.

**Builder** may only build when `TASK_OWNER_ROLE: Builder` in NEXT_TASK.md.
**Reviewer** may only review when `TASK_OWNER_ROLE: Reviewer` in NEXT_TASK.md.
**Reviewer** must NOT implement features unless explicitly reassigned by Architect or Kevin.
**Operations** may only execute process/push/memory tasks when assigned. Operations may NOT redefine the active task unless explicitly acting on Architect instruction or promoting a formal proposal.
**Architect** defines tasks. Other roles do not write to NEXT_TASK.md unless Operations is promoting from PROPOSED_NEXT_TASK.md.

If no active task exists for your role, **propose only and stop**. Write to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md`.

## Architect Absence Protocol

When the Architect is absent and the current task is complete:

- **Builder and Reviewer** may write proposals to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` only. They may NOT write `ALL/NEXT_TASK.md`.
- **Only Architect or Operations** may promote `PROPOSED_NEXT_TASK.md` into `ALL/NEXT_TASK.md`.
- No agent may self-assign, improvise, or widen scope while waiting for Architect input.

## The No-Task Rule (mandatory)

**If `NEXT_TASK.md` does not assign work to your role, do not act. Propose only.**

- If your role is not the OWNER in `NEXT_TASK.md`, do not self-assign work.
- Do not modify gameplay code, architect docs, or task files without explicit assignment.
- Do not widen scope during any pass.
- Instead, write a proposal into `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` and stop. Optionally note observations in `.codex/CEHP/open_questions.md`.

## Role Checklists (Sprint 012)

### Builder
- [ ] Read `00_START_HERE.md`
- [ ] Verify role assignment in `NEXT_TASK.md` — does TASK_OWNER_ROLE say "Builder"?
- [ ] If not assigned, STOP — write proposal to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md`
- [ ] Implement ONLY the assigned task, no scope widening
- [ ] **BEFORE YOU CLOSE**:
  - [ ] Update `.codex/CEHP/status.md` and `changelog.md`
  - [ ] Update `ALL/HANDOFF.md` (Builder section at minimum)
  - [ ] **Rotate `NEXT_TASK.md` metadata in place:** set `TASK_OWNER_ROLE` → Reviewer, `CURRENT_STAGE` → Review, `NEXT_HANDLER_ROLE` → Operations, update `STATUS`
  - [ ] Update NEXT_TASK.md STATUS field in place if task state changed

### Reviewer
- [ ] Read `00_START_HERE.md`
- [ ] Verify role assignment in `NEXT_TASK.md` — does `TASK_OWNER_ROLE` say "Reviewer"?
- [ ] If not assigned, STOP — write proposal to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md`
- [ ] Review BEFORE implementing anything
- [ ] Reviewer must NOT implement features unless explicitly reassigned by Architect or Kevin
- [ ] **BEFORE YOU CLOSE**:
  - [ ] Update NEXT_TASK.md STATUS field in place (e.g., APPROVED / CHANGES_REQUESTED)
  - [ ] Update `.codex/CEHP/status.md` if project state changed
  - [ ] **Rotate `NEXT_TASK.md` metadata in place:** set `TASK_OWNER_ROLE` → Operations, `CURRENT_STAGE` → Operations, `NEXT_HANDLER_ROLE` → Architect, update `STATUS`
  - [ ] Update `ALL/HANDOFF.md` (Reviewer section at minimum)

### Operations
- [ ] Read `00_START_HERE.md`
- [ ] Verify role assignment in `NEXT_TASK.md`
- [ ] Execute process/push/memory tasks only
- [ ] **BEFORE YOU CLOSE**:
  - [ ] Update `.codex/CEHP/` durable memory (status.md, changelog.md, handoff.md)
  - [ ] Update `ALL/HANDOFF.md`
  - [ ] Update `ALL/STUDIO_DASHBOARD.md` if systems changed

### Architect
- [ ] Read `00_START_HERE.md`
- [ ] Read `ACTIVE/CONTROL/ARCHITECT_PACKET.md` for briefing
- [ ] Define tasks in `NEXT_TASK.md` — one task at a time
- [ ] Update `ALL/BACKLOG.md` with future priorities

## Shared Memory Policy (Sprint 012)

- **Canonical memory surface**: `.codex/CEHP/` — the ONLY authoritative cross-session memory.
- Agent-private memory systems are supplementary only and NEVER authoritative.
- If chat and `.codex/CEHP/` disagree, `.codex/CEHP/` wins until the conflict is explicitly resolved.

## Architect Packet Rule (Sprint 012)

When the Architect needs briefing, use `ACTIVE/CONTROL/ARCHITECT_PACKET.md` as the ONLY paste-ready briefing artifact. Do not create a second Architect prompt system.

## Exit Checklist (Sprint 012)

Before ending any session:
- [ ] Did I only work on my role-assigned task?
- [ ] Did I update `.codex/CEHP/status.md` and `changelog.md`?
- [ ] Did I update `HANDOFF.md`?
- [ ] Did I preserve the authority hierarchy?
- [ ] Did I avoid editing protected files without assignment?
- [ ] If no active task existed for my role, did I stop and propose instead of acting?

## Done When
- The requested change is implemented with the smallest safe edit set.
- Save/continue, assist persistence, and direct boot still work.
- No new console or page errors appear in the validation actually run.
- The final report states what changed, what was validated, and what still needs human play.
