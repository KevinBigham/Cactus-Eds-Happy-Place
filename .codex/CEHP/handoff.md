# CEHP Handoff

## What Was Just Done (2026-03-20 — Project Reorganization + Alignment)
- Full file-system audit and reorganization by Claude Cowork Opus 4.6
- All files moved from flat `ALL/` directory into structured `ACTIVE/` layout:
  - `ACTIVE/game/` — index.html, package.json, scripts/, tests/, asset scaffolds
  - `ACTIVE/docs/` — all active documentation (NEXT_TASK.md, AGENTS.md, etc.)
  - `ACTIVE/knowledge/` — STUDIO_KERNEL/, overflow/, docs_skills/
- Old pointer-only `ACTIVE/` subdirs (MEMORY/, AUTOMATION/, REPO/, CONTROL/) dissolved
- Root cleaned to 4 essential files + ACTIVE/ + ARCHIVE/ + config dirs
- Root-level duplicates removed (000 - AI PORTFOLIO..., CEHP - 000 - FOREVER..., CEHP_Studio_Systems_Report.docx)
- Stale protocol artifacts moved to ARCHIVE/ (PROTOCOL_AUDIT.md, PROTOCOL_TEST_ARTIFACT.md, STUDIO_WIDE_VERDICT.md)
- Never-used systems moved to ARCHIVE/ (self_healing/, auto_tasks/, telemetry/, tools/)
- `.gitignore` updated for new paths
- `.codex/CEHP/` memory files updated with new paths
- CLAUDE.md (root) and README created/updated for new structure
- GitHub Pages workflow already points to `ACTIVE/game` — correct
- **Git repository initialized and all active work pushed to GitHub**

## What Was Previously Done (2026-03-17 — CEHP-010 BUILD)
- CEHP-010 quiz fix built: during 250ms input lockout, `_quizHeldChoice` was reset to -1 every frame → held gameplay keys misread as quiz answers. Fix: track held keys during lockout.
- Change scope: 7 lines in W2 quiz input-handling block only. No W3 code. No save schema. `check_save_schema.js` PASS.

## What To Do Next
1. Check `ACTIVE/docs/NEXT_TASK.md` — it always has exactly one task defined
2. Current task: CEHP-010 (W2 quiz fix) — STATUS: BUILT, awaiting Reviewer validation
3. After review: Operations pushes any subsequent changes to GitHub
4. After push: Kevin retests deployed fix on live URL (CEHP-008)

## Exact Files To Inspect
- Task beacon: `ACTIVE/docs/NEXT_TASK.md`
- Runtime: `ACTIVE/game/index.html`
- Agent rules: `ACTIVE/docs/AGENTS.md`
- Known issues: `ACTIVE/docs/KNOWN_ISSUES.md`
- Sprint history: `ACTIVE/docs/SPRINT_LOG.md`
- Local memory: `.codex/CEHP/status.md`
- Backlog: `ACTIVE/docs/BACKLOG.md`

## Current Branch / Working State
- Branch: `main`
- Remote: `origin` → `https://github.com/KevinBigham/Cactus-Eds-Happy-Place`
- All active work is committed and pushed

## Warnings / Risks / Traps
- Reference docs are in `ACTIVE/knowledge/overflow/reference-docs/` — SPEC, PLAN, IMPLEMENT, etc.
- Do not recreate reference docs at root level — that was the old structure
- `ACTIVE/docs/NEXT_TASK.md` is the single source of truth for "what to do next"
- `ACTIVE/docs/BACKLOG.md` is the queue of future tasks
- `ACTIVE/docs/SPRINT_LOG.md` is the chronological history
- Changelog entries before 2026-03-20 reference `ALL/` paths — those are historical and correct for when they were written

## Easy To Forget
- The GitHub Pages workflow deploys from `ACTIVE/game/` — index.html must stay there
- Save schema verification: `node ACTIVE/game/scripts/check_save_schema.js`
- TASK_OWNER_ROLE in NEXT_TASK.md is the sole activation key for agents
