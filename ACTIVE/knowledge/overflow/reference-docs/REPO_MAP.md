# REPO MAP

## Runtime Root
- `index.html` — single-file runtime truth

## Tool Adapters
- `CLAUDE.md` — thin adapter that points Claude to the canonical active files

## Collaboration Roles
- ChatGPT — architect/director only
- Codex — builder only
- Claude Code — reviewer only
- Claude Cowork — ops/producer coordinator only

## Active Memory / Workflow
- `AGENTS.md`
- `CURRENT_PASS.md`
- `HANDOFF.md`
- `SPEC.md`
- `PLAN.md`
- `IMPLEMENT.md`
- `DOCS.md`
- `CERTIFICATION_EVIDENCE.md`
- `FIRST_SESSION_REGRESSION_CHECKLIST.md`
- `RELEASE_CHECKLIST.md`
- `KNOWN_ISSUES.md`
- `REPO_MAP.md`
- `VERIFY.md`
- `DECISIONS.md`
- `BACKLOG.md`
- `REQUESTED_INPUTS.md`

## Validation
- `scripts/check_save_schema.js`
- `scripts/verify-cehp.sh`
- optional disposable browser probes under `/tmp/codex-playwright-cert/`

## Supporting Docs
- `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`
- `docs/ACTIVE_WORKING_SET.md`
- `overflow/supporting-doctrine/DO_NOT_BREAK.md`
- `docs/skills/first-session-certification/SKILL.md`

## Historical Context
- `README.md`
- `legacy/quarantine/docs-archive/handoffs/HANDOFF_BIBLE.md`
- `legacy/quarantine/docs-archive/TRANSFER/`
- `overflow/**`
- archived briefings, prompts, reviews, migration notes, and state snapshots under `legacy/quarantine/docs-archive/`

## Quarantine / Archive
- `legacy/quarantine/**`
- `legacy/quarantine/docs-archive/**`
- `legacy/quarantine/runtime-backups/**`
- `legacy/quarantine/scripts-archive/**`
- `overflow/**`

## Empty Scaffold Dirs (not part of active runtime)
These directories contain only `.gitkeep` placeholder files. They are future scaffolding — no active code, no build step touches them.
- `src/world1/`
- `art/`
- `audio/`
- `content/`
- `telemetry/`
- `tests/`
- `tools/`
- `ui/`

## Backups
- `legacy/quarantine/runtime-backups/index.pre-*.html` are pass-by-pass backups of `index.html`
