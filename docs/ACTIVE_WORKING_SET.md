# ACTIVE_WORKING_SET

## Canonical location
- This file is the only canonical active-working-set file.
- Do not create a competing root-level `ACTIVE_WORKING_SET.md`.

## Canonical runtime source
- **Canonical runtime source:** `index.html` (repo root).
- Runtime remains browser-runnable static HTML/JS with no build/transpile step in this migration pass.

## Canonical active surface
- `index.html`
- `AGENTS.md`
- `CLAUDE.md` (thin adapter only; not a second ruleset)
- `CURRENT_PASS.md`
- `HANDOFF.md`
- `SPEC.md`
- `PLAN.md`
- `IMPLEMENT.md`
- `DOCS.md`
- `FIRST_SESSION_REGRESSION_CHECKLIST.md`
- `CERTIFICATION_EVIDENCE.md`
- `RELEASE_CHECKLIST.md`
- `KNOWN_ISSUES.md`
- `REPO_MAP.md`
- `VERIFY.md`
- `DECISIONS.md`
- `BACKLOG.md`
- `REQUESTED_INPUTS.md`
- `docs/ACTIVE_WORKING_SET.md`
- `docs/skills/first-session-certification/SKILL.md`
- `scripts/check_save_schema.js`
- `scripts/verify-cehp.sh`

## Supporting doctrine
- `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md` — repo-local doctrine and priorities.
- `overflow/supporting-doctrine/DO_NOT_BREAK.md` — permanent creative guardrails.
- These are retained as clearly labeled supporting doctrine, not default first-pass reads.

## Collaboration truth
- ChatGPT = architect/director only.
- Codex = builder only.
- Claude Code = reviewer only.
- Claude Cowork = ops/producer coordinator only.
- Structure passes do not widen scope.
- Claude review happens only after Codex verification succeeds.
- `HANDOFF.md` must contain `FOR CLAUDE REVIEW`, `FOR COWORK OPS`, and `FOR PUBLIC DEPLOY` sections.

## What left the active surface
- Historical briefings, prompts, audits, migration notes, and World 1 review docs now live under `legacy/quarantine/docs-archive/`.
- The old transfer pack now lives under `legacy/quarantine/docs-archive/TRANSFER/`.
- Old runtime backups now live under `legacy/quarantine/runtime-backups/`.
- Old one-off validators now live under `legacy/quarantine/scripts-archive/`.

## Current runtime note
- The live `index.html` currently registers `Title`, `Demo`, `World2`, and `World3`.
- Older docs that describe a different scene/world count are historical context unless verified against the live runtime.

## Quarantine default
- Ignore `legacy/quarantine/**` by default.
- Ignore `overflow/` if it exists.
- That includes `overflow/supporting-doctrine/**`.
- Only read archived files when the task explicitly requires historical context.
- That includes:
  - `legacy/quarantine/docs-archive/**`
  - `legacy/quarantine/runtime-backups/**`
  - `legacy/quarantine/runtime-variants/**`
  - `legacy/quarantine/scripts-archive/**`
  - `legacy/quarantine/combat/**`
  - `legacy/quarantine/racing/**`
  - `legacy/quarantine/ai-artifacts/**`
  - `legacy/quarantine/scratch/**`
