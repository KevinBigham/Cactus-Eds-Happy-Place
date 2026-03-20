# CLAUDE.md — Durable Project Instructions

> **Last updated**: 2026-03-20
> **Purpose**: Permanent guidance file for Claude-family agents working in this repo

---

# Project Identity

**Name**: Cactus Ed's Happiest Place (CEHP)

**Description**: A single-file browser platformer game built with Phaser (CDN), ES5 JavaScript, no build tools, no framework. The entire game is one HTML file. Four playable scenes (Title, Demo, World2, World3) with a certification-driven development process using multi-agent AI collaboration.

**Vision**: Complete first-session certification for W2/W3, then expand content. Protect save compatibility, authored readability, and zero-build-step simplicity at all costs.

---

# Tech / Structure Summary

## Core stack
- Phaser 3 (loaded via CDN in the HTML file)
- ES5 JavaScript (no modules, no imports, no transpilation)
- Single HTML file runtime (`ACTIVE/game/index.html`, ~16K lines)
- GitHub Pages for deployment
- Playwright for automated verification scripts

## Project structure
```
Root/
├── 00_HANDOFF_FROM_CLAUDE_CODE.md    # Audit from 2026-03-20 reorg
├── README_Instructions on What To Do.md  # Living project guide
├── CLAUDE.md                          # This file
├── ACTIVE/
│   ├── game/                          # THE GAME + build/test tooling
│   │   ├── index.html                 # Entire game runtime (~16K lines)
│   │   ├── package.json               # Node deps (Playwright)
│   │   ├── scripts/                   # Verification scripts
│   │   ├── tests/                     # Smoke tests
│   │   └── art/, audio/, content/, ui/  # Empty scaffolds for future assets
│   ├── docs/                          # All active project documentation
│   │   ├── NEXT_TASK.md               # THE task beacon (always exactly 1 task)
│   │   ├── AGENTS.md                  # Agent roles + workflow rules
│   │   ├── BACKLOG.md                 # Future task queue
│   │   ├── KNOWN_ISSUES.md            # Bug tracker
│   │   └── ... (other active docs)
│   └── knowledge/                     # Reference material + doctrine
│       ├── STUDIO_KERNEL/             # Advisory knowledge (8 files)
│       └── overflow/                  # Reference docs + supporting doctrine
├── ARCHIVE/                           # Everything no longer current
├── .codex/CEHP/                       # Durable cross-session AI memory (8 files)
├── .claude/                           # Claude Code local settings
├── .github/                           # GitHub Actions (Pages deploy)
└── .gitignore
```

## Where active work lives
- Game code: `ACTIVE/game/index.html`
- Current task: `ACTIVE/docs/NEXT_TASK.md`
- AI memory: `.codex/CEHP/` (status.md, handoff.md, changelog.md are most current)

---

# Collaboration Rules

## Read before acting
1. Read this file (`CLAUDE.md`) first
2. Read `README_Instructions on What To Do.md` for current state and tasks
3. Read `.codex/CEHP/status.md` for the most authoritative current state
4. Read `ACTIVE/docs/NEXT_TASK.md` to know the one active task
5. Only act if your role matches `TASK_OWNER_ROLE` in NEXT_TASK.md

## Preserve root simplicity
Root should only contain: `00_HANDOFF_FROM_CLAUDE_CODE.md`, `README_Instructions on What To Do.md`, `CLAUDE.md`, `ACTIVE/`, `ARCHIVE/`, and config dirs (`.codex/`, `.claude/`, `.github/`, `.gitignore`). Do not add files to root.

## Keep ACTIVE current
`ACTIVE/` contains only files that are part of the current working project. If something becomes stale, move it to `ARCHIVE/`.

## Move stale materials to ARCHIVE
When a doc, file, or system is no longer part of active work, move it to `ARCHIVE/` with a descriptive subfolder if needed. Do not delete — archive.

## Update docs after meaningful changes
After every meaningful change:
- Update `README_Instructions on What To Do.md` — especially the "Current State" section
- Update `.codex/CEHP/status.md`, `handoff.md`, and `changelog.md`
- Update `ACTIVE/docs/NEXT_TASK.md` if the task status changed

## Update CLAUDE.md when durable instructions change
If the tech stack, project structure, folder layout, or collaboration rules change, update this file.

---

# Editing Rules

## Code changes
- Prefer minimal, precise changes to `index.html`
- Always run `node ACTIVE/game/scripts/check_save_schema.js` after code changes
- Never break the save contract (`cactusEd_save_v1`)
- If docs and code disagree, code wins
- Scope changes tightly — the NEXT_TASK.md specifies what you may and may not touch

## File hygiene
- No duplicate files (check before creating)
- No scattered plans (use NEXT_TASK.md + BACKLOG.md)
- No "final_final_v2" naming — use clean, consistent names
- UPPERCASE_SNAKE.md for active docs, lowercase for utility/reference dirs
- When in doubt, archive rather than delete

---

# Handoff Discipline

## Leave clear notes
After every session, future agents should be able to find:
- What the current task is → `ACTIVE/docs/NEXT_TASK.md`
- What just happened → `.codex/CEHP/handoff.md`
- What the current state is → `.codex/CEHP/status.md`
- What changed → `.codex/CEHP/changelog.md`

## New essential docs
Place any new essential docs in `ACTIVE/docs/`. Place reference-only material in `ACTIVE/knowledge/`.

---

# Project-Specific Notes

## Multi-agent protocol
This project uses 4 AI agents with defined roles: Architect (ChatGPT 5.4 Pro), Builder (Codex 5.4), Reviewer (Claude Code Sonnet 4.6), Operations (Claude Cowork Opus 4.6). The `TASK_OWNER_ROLE` field in NEXT_TASK.md is the sole activation key. If your role doesn't match, propose only.

## GitHub Pages deployment
The `.github/workflows/static.yml` deploys the entire repo to GitHub Pages on push to `main`. The game is accessed at `ACTIVE/game/index.html` relative to the Pages URL. The workflow may need its `path` updated to `ACTIVE/game` if the game should be served at the root URL.

## Unpushed state (as of 2026-03-20)
Local workspace has changes since 2026-03-14 that have not been pushed to GitHub. The live site is serving a pre-patch version. Pushing is the most critical operational task after CEHP-010 review.

## Certification context
The project is mid-certification for W2/W3 first-session trust paths. CEHP-010 (W2 quiz fix) is built and awaiting review. After review + push + human retest, certification can close out.

## Save schema verification
Always run: `node ACTIVE/game/scripts/check_save_schema.js`
This verifies the `cactusEd_save_v1` save contract is intact.
