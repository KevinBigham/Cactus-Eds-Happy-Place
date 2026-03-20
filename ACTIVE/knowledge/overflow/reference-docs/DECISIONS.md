# DECISIONS

## 2026-03-13
- `index.html` remains runtime truth.
- Repo-local markdown files are the durable planning and communication layer.
- `docs/ACTIVE_WORKING_SET.md` is the only canonical active-working-set file.
- Human certification is primary for W2/W3 continuity; disposable automation is secondary.
- The dev-only manual certification aid is enabled only by query param:
  - `?certAid=w2`
  - `?certAid=w3`
- The certification aid must not alter normal player flow when disabled.
- The live save contract is validated by `scripts/check_save_schema.js`.
- `scripts/verify-cehp.sh` is the canonical repo-level verify wrapper.
- Public browser play uses the GitHub Pages build from the current Pages repo, not the newer non-Pages repo.
- Superseded prompt and architect-analysis docs belong under `legacy/quarantine/docs-archive/`, not in the active `docs/` surface.
- The historical transfer pack belongs under `legacy/quarantine/docs-archive/TRANSFER/`, not at repo root.
- Root `index.pre-*.html` backups belong under `legacy/quarantine/runtime-backups/`, not on the active surface.
- Retired one-off validators belong under `legacy/quarantine/scripts-archive/`; only `scripts/check_save_schema.js` and `scripts/verify-cehp.sh` remain active.
- `CLAUDE.md` is a thin adapter only; it must not become a second competing ruleset.
- ChatGPT is architect/director only, Codex is builder only, and Claude Code is reviewer only.
- `overflow/`, `legacy/quarantine/`, and any archive/history lane are ignored by default unless the task explicitly targets them.
- Supporting doctrine files live under `overflow/supporting-doctrine/` so the root and `docs/` active surface stay minimal.
- `HANDOFF.md` must carry both `FOR CLAUDE REVIEW` and `FOR COWORK OPS` sections so reviewer and ops coordination can continue from files alone.

## Standing Tradeoff
- We prefer a missing patch over an unproven patch.
- We keep route-driver churn capped and ask for literal human notes once automation stops proving new truth.
