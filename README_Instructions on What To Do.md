# README — Instructions on What To Do

> **Last updated**: 2026-03-21
> **Updated by**: Claude Opus 4.6 (1M context) — visual upgrade + handoff prep

---

# Project Overview

**Cactus Ed's Happiest Place (CEHP)** is a single-file browser platformer game built with Phaser (loaded via CDN), written in ES5 JavaScript, with no build step. The entire game runtime lives in one HTML file (`ACTIVE/game/index.html`, ~19,000+ lines).

**Vision**: A living satirical machine that watches you and adapts. The institution doesn't just judge you — it RESPONDS. Every run feels meaningfully different. Every receipt is shareable. Every player becomes a marketer.

**Four active scenes**: Title, Demo (World 1), World2, World3.

**Play now**: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
**Repo**: https://github.com/KevinBigham/Cactus-Eds-Happy-Place

---

# Current State

## What exists and works
- The full game runs from `ACTIVE/game/index.html` in any browser
- Four scenes are playable: Title, Demo (World 1), World2, World3
- **All 10 GOAT rounds are implemented** (Rounds 01-03 were pre-existing; Rounds 04-10 built 2026-03-20)
- **Visual upgrade shipped** (2026-03-21): WebGL PostFX (vignette, bloom, barrel distortion), smooth scene transitions, enhanced glow effects, dual-pass particles, VHS grain, RGB channel offset tears
- **Text readability pass** (2026-03-21): All font sizes bumped (minimum 8px), stroke thickness ≥3, dim colors brightened
- **Renderer**: WebGL via `Phaser.AUTO` with Canvas fallback (`IS_WEBGL` flag guards all PostFX code)
- Save contract (`cactusEd_save_v1`) fully preserved across all changes
- Zero ES6 syntax — pure ES5 JavaScript throughout

## GOAT Plan Rounds — Feature Summary

### Rounds 01-03 (Pre-existing)
- **R01 JUICE & FEEL**: Procedural SFX, hit-stop, screenshake, squash-stretch, combo text
- **R02 DEATH & ONBOARDING**: Fast respawn, institutional signage tutorial, cold open, camera lookahead
- **R03 RECEIPT 2.0**: Procedural receipt templates (20 templates x 6 axes x 16 word banks), near-miss callouts, receipt stamp animation

### Round 04 — THE REPLAY ENGINE
- Behavioral grade (F through S) on receipt + completion screen
- Corrective Action Items (1-3 institutional improvement mandates)
- RE-ENROLL (30% behavior carryover) / APPEAL (100%) / PROCEED TO WORLD 2 buttons
- Hold-Z instant restart during death animation (1-second hold)
- Streak-specific receipt lines at runs 3, 5, 10

### Round 05 — SHAREABLE RECEIPT CARD
- Canvas receipt card renderer (1080x1080 square + 1080x1920 story format)
- Six-axis radar chart (compliance/intuition/curiosity/chaos/grace/efficiency)
- Download PNG / Copy clipboard text / Share API (mobile)
- Behavioral emoji bar for Wordle-style text sharing
- "PRINT RECEIPT" button after stamp animation (P key)

### Round 06 — ABILITY LICENSING
- 8 licensable moves with institutional form numbers (FORM 12-A, FORM 8-C, etc.)
- Unlicensed moves still work — but violations are logged + flash notifications
- Auditor enemy (floating clipboard, non-lethal, 5s lifespan) spawns on repeated violations
- Certification acts (zone-based skill challenges grant licenses permanently)
- Employee Handbook replaces controls on pause menu (shows license status + hints)

### Round 07 — TRAIT FORECLOSURE
- Policy Flag system: institution applies 2-3 policies to next world based on dominant behavior
- Institutional Memo at world start (cream overlay listing active policies)
- World modifications: narrowed platforms (grace), censored signs (curiosity), response teams (chaos), extended safe paths (compliance)
- Policy Effectiveness Review on completion screen
- Fake-Left Branch memory (4+ visits with escalating institutional gags)

### Round 08 — RETENTION SYSTEMS
- Daily Enrollment Challenge (15 modifiers, deterministic from date seed)
- Receipt Cabinet (localStorage collection, 100 max, archetype/S-rank tracking)
- Department Assignment (6 departments after 5+ runs, cumulative behavioral tracking)
- Waiver Punchcard (8 slots, 2 courtesy, world completion/high grades earn punches)
- Behavioral Drift Tracking (longitudinal analysis with trend narratives after 5+ runs)

### Round 09 — SURPRISE & DELIGHT
- Fourth Wall Receipt lines at runs 5/10/15/20/25/30/50
- Greeter NPC near W1 start (talk/kill/ignore — tracked for endgame payoff)
- Blank Receipt for 95%+ compliance ("PERFECT RECORD. NO FURTHER ASSESSMENT REQUIRED.")
- Clerical Error Jackpot (~5% chance — one-zone celebration with bouncing enemies)

### Round 10 — CONTENT EXPANSION
- Case Seed system (deterministic run ID: CASE-DATE-RUN-AXIS)
- Mood Rotations (7 institutional moods: Budget Cuts, Wellness Week, Casual Friday, etc.)
- Behavioral Remix Labels (DISCIPLINARY/EXPRESS/RESEARCH/STANDARD/PRECISION/CLASSIFIED editions)
- Case number + mood displayed on pause screen
- Daily challenge + department + punchcard on title screen

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

## Current task: OPEN — All GOAT rounds + visual upgrade complete
- Rounds 04-10 shipped 2026-03-20
- Visual upgrade (WebGL PostFX, text readability, scene transitions) shipped 2026-03-21
- TitleScene crash fix shipped 2026-03-21
- All features are live and pushed to GitHub

## Next likely tasks (in order)
1. Kevin playtests all features on live URL
2. Bug reports / polish pass based on playtest feedback
3. Define next priority: new worlds, marketing, asset upgrade, etc.

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

## All changes pushed (2026-03-21)
All local changes including GOAT rounds 04-10, visual upgrade, text readability pass, and TitleScene crash fix have been pushed to GitHub. The live URL serves the latest version.

## Stale docs
- `ACTIVE/docs/CURRENT_PASS.md` still describes Sprint 006 (project is past Sprint 012). Needs updating or removal.
- `ACTIVE/docs/HANDOFF.md` per-agent literal prompts reference CEHP-007 which is outdated.
- `ACTIVE/docs/ARCHITECT_PACKET.md` references Sprint 012 / CEHP-007 — outdated. Needs refresh before next Architect briefing.

## Uncertain files
- `ARCHIVE/src/world1/` — 5 JS files that appear to be abandoned modularization attempts. The game runs entirely from index.html. Ask Kevin before activating.
- `ARCHIVE/legacy/quarantine/combat/` — a full combat engine (30+ JS files). Historical only — do not activate.

## GitHub Pages deployment
The GitHub Pages workflow (`.github/workflows/static.yml`) deploys from `ACTIVE/game/` so index.html is served at the root URL. Push to `main` triggers automatic deployment.

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
