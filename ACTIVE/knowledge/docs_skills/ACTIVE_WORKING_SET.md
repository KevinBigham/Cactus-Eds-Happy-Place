# ACTIVE_WORKING_SET

## Canonical location
- This file is the only canonical active-working-set file.
- Do not create a competing root-level `ACTIVE_WORKING_SET.md`.

## Canonical runtime source
- **Canonical runtime source:** `index.html` (repo root).
- Runtime remains browser-runnable static HTML/JS with no build/transpile step.

## Tier 1 — Active Surface (root)
These files are read on cold-start:
- `index.html`
- `AGENTS.md`
- `NEXT_TASK.md`
- `CURRENT_PASS.md`
- `HANDOFF.md`
- `BACKLOG.md`
- `KNOWN_ISSUES.md`
- `REQUESTED_INPUTS.md`
- `CLAUDE.md` (thin adapter only)
- `README.md`
- `SPRINT_LOG.md`

## Tier 2 — Reference Docs (overflow/reference-docs/)
Read when doing implementation, certification, or deploy work:
- `overflow/reference-docs/SPEC.md`
- `overflow/reference-docs/PLAN.md`
- `overflow/reference-docs/IMPLEMENT.md`
- `overflow/reference-docs/VERIFY.md`
- `overflow/reference-docs/DECISIONS.md`
- `overflow/reference-docs/DOCS.md`
- `overflow/reference-docs/FIRST_SESSION_REGRESSION_CHECKLIST.md`
- `overflow/reference-docs/CERTIFICATION_EVIDENCE.md`
- `overflow/reference-docs/RELEASE_CHECKLIST.md`
- `overflow/reference-docs/REPO_MAP.md`

## Tier 3 — Durable Memory
- `.codex/CEHP/` — all files

## Tier 4 — Supporting Doctrine
- `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`
- `overflow/supporting-doctrine/DO_NOT_BREAK.md`
- `docs/skills/first-session-certification/SKILL.md`

## Validation
- `scripts/check_save_schema.js`
- `scripts/verify-cehp.sh`

## Collaboration truth
- ChatGPT 5.4 Pro = architect/director only
- Codex 5.4 = builder only
- Claude Code Sonnet 4.6 = reviewer only
- Claude Cowork Opus 4.6 = ops/producer coordinator only
- HANDOFF.md must contain per-agent sections (FOR CHATGPT ARCHITECT, FOR CODEX BUILDER, FOR CLAUDE CODE REVIEWER, FOR COWORK OPERATIONS, FOR PUBLIC DEPLOY)

## What left the active surface
- Reference docs moved to `overflow/reference-docs/` in Sprint 006 (2026-03-15)
- Historical briefings, prompts, audits, migration notes under `legacy/quarantine/docs-archive/`
- Old transfer pack under `legacy/quarantine/docs-archive/TRANSFER/`
- Old runtime backups under `legacy/quarantine/runtime-backups/`
- Old one-off validators under `legacy/quarantine/scripts-archive/`

## Current runtime note
- The live `index.html` registers `Title`, `Demo`, `World2`, and `World3`.
- Older docs describing different scene/world counts are historical context.

## Quarantine default
- Ignore `legacy/quarantine/**` by default.
- Ignore `overflow/` by default unless reading reference docs for implementation work.
- Only read archived files when the task explicitly requires historical context.
