# README — Instructions on What To Do

> **Last updated**: 2026-03-20
> **Updated by**: Claude Cowork Opus 4.6 (project reorganization)

---

# Project Overview

**Cactus Ed's Happiest Place (CEHP)** is a single-file browser platformer game built with Phaser (loaded via CDN), written in ES5 JavaScript, with no build step. The entire game runtime lives in one HTML file (`ACTIVE/game/index.html`, ~16,113 lines).

**Vision**: Complete first-session certification (World 2 / World 3 trust and continuity paths) before adding new content or engagement systems. Protect authored readability, save compatibility, and browser-runnable simplicity.

**Four active scenes**: Title, Demo, World2, World3.

**Live URL**: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
**Repo**: https://github.com/KevinBigham/Cactus-Eds-Happy-Place

---

# Current State

## What exists and works
- The full game runs from `ACTIVE/game/index.html` in any browser
- Four scenes are playable: Title, Demo, World2, World3
- W2 and W3 gameplay patches (from Sprint 005) are applied locally but NOT YET PUSHED to GitHub
- CEHP-010 quiz fix is built and applied locally (2026-03-17)

## What is unfinished
- **CEHP-010** (W2 pop-quiz auto-dismiss fix) is BUILT but awaiting Reviewer validation
- **CEHP-007** (push all local changes to GitHub) is blocked until CEHP-010 review completes
- **CEHP-008** (human retest of W2/W3 patches on live URL) is blocked until push happens
- First-session certification closeout is pending W2 quiz fix + W3 certAid retest

## What changed most recently (2026-03-17)
- CEHP-010 build: fixed W2 quiz auto-dismiss bug (root cause: held gameplay keys misread as quiz answers during lockout-to-ready transition)
- Change scope: 7 lines in W2 quiz input-handling block only, no W3 code, no save schema changes

## What changed today (2026-03-20)
- Full project reorganization by Claude Cowork. All files moved from flat `ALL/` directory into structured `ACTIVE/` and `ARCHIVE/` folders. Old pointer-only directories dissolved. Root cleaned to essentials only. See "Reorganization Notes" section below.

---

# Current Important Files

**Start here — read these first:**

| File | Location | Why it matters |
|---|---|---|
| This file | Root | Project overview and task guidance |
| CLAUDE.md | Root | Durable instructions for Claude agents |
| NEXT_TASK.md | `ACTIVE/docs/` | The ONE active task — always exactly one |
| index.html | `ACTIVE/game/` | THE GAME — the entire runtime |
| status.md | `.codex/CEHP/` | Current objective and state (most authoritative) |
| handoff.md | `.codex/CEHP/` | What just happened + what to do next |
| AGENTS.md | `ACTIVE/docs/` | Agent roles, rules, boot sequence |
| KNOWN_ISSUES.md | `ACTIVE/docs/` | Known bugs and defects |
| BACKLOG.md | `ACTIVE/docs/` | Queue of future tasks |

**Secondary reference:**

| File | Location | Why it matters |
|---|---|---|
| HANDOFF.md | `ACTIVE/docs/` | Per-agent handoff context (partially stale) |
| SPRINT_LOG.md | `ACTIVE/docs/` | Chronological sprint history |
| changelog.md | `.codex/CEHP/` | Detailed change history |
| ARCHITECT_PACKET.md | `ACTIVE/docs/` | Paste-ready briefing for ChatGPT Architect |
| PROPOSED_NEXT_TASK.md | `ACTIVE/docs/` | Proposal lane for non-active agents |

---

# Current / Next Tasks

## Current task: CEHP-010
**Fix W2 pop-quiz auto-dismiss timing on first trigger**
- Status: BUILT — awaiting Reviewer validation
- Owner: Reviewer (Claude Code Sonnet 4.6)
- The fix is applied in `ACTIVE/game/index.html` lines 13076-13084
- After review: Operations pushes to GitHub

## Next likely tasks (in order)
1. Reviewer validates CEHP-010 quiz fix
2. Operations pushes ALL local changes to GitHub (completing CEHP-007)
3. Kevin retests deployed fix on live URL (CEHP-008)
4. If W2 quiz fix + W3 certAid retest pass → certification closeout
5. After certification → Architect defines next feature priority

---

# Working Rules / Guidance

## Multi-agent workflow
The project uses a 4-agent workflow: Architect (ChatGPT 5.4 Pro) → Builder (Codex 5.4) → Reviewer (Claude Code Sonnet 4.6) → Operations (Claude Cowork Opus 4.6). Only the agent whose role matches `TASK_OWNER_ROLE` in `NEXT_TASK.md` should act on the current task. All others should propose only, via `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.

## Task beacon system
`ACTIVE/docs/NEXT_TASK.md` always contains exactly ONE active task. When a task completes, the completing agent pulls the next task from `ACTIVE/docs/BACKLOG.md`.

## Durable memory
`.codex/CEHP/` contains 8 files of cross-session memory that should be updated after every meaningful change: agent.md, status.md, plan.md, decisions.md, changelog.md, open_questions.md, runbook.md, handoff.md.

## Save contract
The save schema key `cactusEd_save_v1` must be preserved across ALL changes. Run `node ACTIVE/game/scripts/check_save_schema.js` to verify.

## Code truth
`ACTIVE/game/index.html` is runtime truth. If docs and code disagree, code wins.

## Naming conventions
- Active doc files: UPPERCASE_SNAKE.md
- Organizational dirs: UPPERCASE (ACTIVE, ARCHIVE)
- Reference/utility dirs: lowercase (overflow, scripts, legacy)

---

# Warnings / Watchouts

## Unpushed changes (CRITICAL)
Local workspace has had unpushed changes since 2026-03-14. Nothing since Sprint 005 gameplay patches has reached GitHub. The live URL is still serving the pre-patch version. Human retest cannot happen until changes are pushed.

## Stale docs
- `ACTIVE/docs/CURRENT_PASS.md` still describes Sprint 006 (project is past Sprint 012). Needs updating or removal.
- `ACTIVE/docs/HANDOFF.md` per-agent literal prompts reference CEHP-007 which is outdated.
- `ACTIVE/docs/ARCHITECT_PACKET.md` references Sprint 012 / CEHP-007 — outdated. Needs refresh before next Architect briefing.

## Uncertain files
- `ARCHIVE/src/world1/` — 5 JS files that appear to be abandoned modularization attempts. The game runs entirely from index.html. Ask Kevin before activating.
- `ARCHIVE/legacy/quarantine/combat/` — a full combat engine (30+ JS files). Historical only — do not activate.

## GitHub Pages deployment
The GitHub Pages workflow (`.github/workflows/static.yml`) deploys the entire repo. The game is now at `ACTIVE/game/index.html`. The workflow `path` setting may need updating to `ACTIVE/game` if you want the game served at the root URL. Currently it deploys everything from `.`.

## Process vs. product ratio
This project has extensive governance documentation relative to its actual codebase (1 HTML file). The governance is useful but can be overwhelming. Focus on the game file and NEXT_TASK.md first.

---

# Reorganization Notes (2026-03-20)

## What was done
The entire project was reorganized from a flat `ALL/` directory with confusing pointer-only `ACTIVE/` subdirs into a clean structure:

### Moved to ACTIVE/game/
- `index.html` (the game), `package.json`, `package-lock.json`, `scripts/`, `tests/`, `node_modules/`, `art/`, `audio/`, `content/`, `ui/` (empty scaffolds for future assets)

### Moved to ACTIVE/docs/
- All active documentation: NEXT_TASK.md, AGENTS.md, HANDOFF.md, BACKLOG.md, KNOWN_ISSUES.md, REQUESTED_INPUTS.md, SPRINT_LOG.md, STUDIO_DASHBOARD.md, PLAYTEST_LOG.md, CURRENT_PASS.md, HEALTH_TREND.md, scan-results.md, ARCHITECT_PACKET.md, PROPOSED_NEXT_TASK.md, CLAUDE.md (old adapter), PUBLIC_README.md

### Moved to ACTIVE/knowledge/
- STUDIO_KERNEL/ (advisory knowledge), overflow/ (reference docs + doctrine), docs_skills/

### Moved to ARCHIVE/
- Old root files: 00_START_HERE.md, 000 - AI PORTFOLIO START HERE.md, CEHP - 000 - FOREVER INSTRUCTIONS - START HERE.md, CEHP_Studio_Systems_Report.docx
- Protocol artifacts: PROTOCOL_AUDIT.md, PROTOCOL_TEST_ARTIFACT.md, STUDIO_WIDE_VERDICT.md
- Never-used systems: self_healing/, auto_tasks/, telemetry/, tools/
- Legacy code: legacy/quarantine/ (combat engine, racing, runtime backups, old docs, old scripts)
- Stale files: NEXT_TASK.md.backup-proto001, src/ (abandoned modularization)

### Removed
- Pointer-only READMEs in old ACTIVE/MEMORY/, ACTIVE/AUTOMATION/, ACTIVE/REPO/ (zero information value)
- Old `ALL/` directory (dissolved — contents redistributed)

---

# Handoff Notes

## For Claude / Claude Code / Claude Cowork / Codex
1. Always read this file and `CLAUDE.md` first
2. Check `.codex/CEHP/status.md` for the most current state
3. Check `ACTIVE/docs/NEXT_TASK.md` for the one active task
4. The game is at `ACTIVE/game/index.html` — do not move or rename it
5. After making meaningful changes, update this file's "Current State" section and `.codex/CEHP/` memory files
6. Keep root minimal — only the 5 essential items belong here
7. When in doubt, archive rather than delete
