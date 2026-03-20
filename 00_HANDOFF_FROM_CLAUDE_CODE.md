# 00_HANDOFF_FROM_CLAUDE_CODE.md

> **Last updated**: 2026-03-20
> **Author**: Claude Cowork Opus 4.6 (alignment + synchronization agent)
> **Purpose**: Executive handoff for the next AI agent

---

# 1. Executive Summary

## What This Project Is
**Cactus Ed's Happiest Place (CEHP)** — a single-file Phaser browser platformer game. Built with Phaser via CDN, ES5 JavaScript, no build step. Four active scenes: Title, Demo, World2, World3. Deployed via GitHub Pages.

## Current State (2026-03-20)
- **CEHP-010** (W2 pop-quiz auto-dismiss fix) is **BUILT and awaiting Reviewer validation**
- The fix is applied in `ACTIVE/game/index.html` lines 13076-13084
- Local workspace has been **reorganized** from flat `ALL/` structure into clean `ACTIVE/` layout
- **All active work is committed and pushed to GitHub**

## What Changed Most Recently
1. 2026-03-20: Full project reorganization — files moved from `ALL/` to `ACTIVE/{game,docs,knowledge}/`
2. 2026-03-20: Git repository initialized and all active work pushed to GitHub
3. 2026-03-17: CEHP-010 quiz fix built (7 lines in W2 quiz input handling)

## What the Next AI Should Read First
1. **Root `CLAUDE.md`** — durable project instructions
2. **Root `README_Instructions on What To Do.md`** — current state and tasks
3. **`ACTIVE/docs/NEXT_TASK.md`** — the ONE active task (CEHP-010)
4. **`.codex/CEHP/status.md`** — most authoritative current state

---

# 2. Project Structure

```
CEHP/
├── 00_HANDOFF_FROM_CLAUDE_CODE.md    # THIS FILE — executive handoff
├── README_Instructions on What To Do.md  # Living project guide
├── CLAUDE.md                          # Durable instructions for Claude agents
├── ACTIVE/
│   ├── game/                          # THE GAME + tooling
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

---

# 3. Current Task

**CEHP-010: Fix W2 pop-quiz auto-dismiss timing on first trigger**
- Status: **BUILT — AWAITING REVIEW**
- Owner: Reviewer (Claude Code Sonnet 4.6)
- Fix location: `ACTIVE/game/index.html` lines 13076-13084
- Root cause: During 250ms quiz input lockout, held gameplay keys (Z/X/C/UP) were misread as new quiz answers when lockout expired
- After review: Operations pushes changes → Kevin retests on live URL

## Next Likely Tasks (in order)
1. Reviewer validates CEHP-010
2. Kevin retests deployed fix (CEHP-008)
3. If W2 quiz + W3 certAid pass → certification closeout
4. Architect defines next feature priority

---

# 4. Key Risks / Warnings

1. **Save contract**: `cactusEd_save_v1` must be preserved. Verify with `node ACTIVE/game/scripts/check_save_schema.js`
2. **TASK_OWNER_ROLE is the sole activation key** — only the agent whose role matches should act on the task
3. **Stale docs exist**: `ACTIVE/docs/CURRENT_PASS.md` still describes Sprint 006; `ACTIVE/docs/HANDOFF.md` per-agent prompts reference outdated tasks. These need refreshing.
4. **Changelog entries before 2026-03-20 reference `ALL/` paths** — these are historical and correct for when they were written
5. **GitHub Pages deploys from `ACTIVE/game/`** — do not move `index.html` out of that directory

---

# 5. Multi-Agent Protocol

| Role | Agent | Responsibilities |
|---|---|---|
| Architect | ChatGPT 5.4 Pro | Design decisions, task definition |
| Builder | Codex 5.4 | Code implementation |
| Reviewer | Claude Code Sonnet 4.6 | Code review, validation |
| Operations | Claude Cowork Opus 4.6 | Git ops, process, coordination |

Only the agent matching `TASK_OWNER_ROLE` in `ACTIVE/docs/NEXT_TASK.md` should act. Others propose via `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.

---

# 6. Recommended Next Steps

1. **Reviewer**: Validate CEHP-010 quiz fix in `ACTIVE/game/index.html`
2. **Kevin**: Retest W2 quiz and W3 certAid on deployed live URL
3. **Operations**: After retest, close certification or define remaining fixes
4. **Architect**: After certification, define next feature priority from backlog
