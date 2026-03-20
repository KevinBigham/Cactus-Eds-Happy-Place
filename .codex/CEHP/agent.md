# CEHP Agent Memory

## Project Identity
- Code: `CEHP`
- Name: `Cactus Ed's Happiest Place`
- Runtime truth: `index.html`
- Stack: single-file browser game, Phaser from CDN, ES5 JavaScript, no build step
- Current live scene set: `Title`, `Demo`, `World2`, `World3`
- Public URL: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
- Public repo: https://github.com/KevinBigham/Cactus-Eds-Happy-Place

## Agent Roster (updated 2026-03-15)
- ChatGPT 5.4 Pro = Architect / Game Director
- Codex 5.4 = Primary Builder
- Claude Code Sonnet 4.6 = Code Reviewer
- Claude Cowork Opus 4.6 = Operations / Process Overseer / GitHub Pusher

## Product Vision
- Protect first-session trust, continuity, and authored readability before polish.
- Keep gameplay/browser behavior stable and browser-runnable without introducing a build pipeline.
- Prefer surgical fixes to real defects over speculative rewrites.

## Repo Structure (updated 2026-03-15 — Sprint 006)
- Runtime: `index.html`
- Tier 1 active docs (root): `AGENTS.md`, `NEXT_TASK.md`, `CURRENT_PASS.md`, `HANDOFF.md`, `BACKLOG.md`, `KNOWN_ISSUES.md`, `REQUESTED_INPUTS.md`, `CLAUDE.md`, `README.md`, `SPRINT_LOG.md`
- Tier 2 reference docs: `overflow/reference-docs/` (SPEC, PLAN, IMPLEMENT, DOCS, VERIFY, DECISIONS, CERTIFICATION_EVIDENCE, FIRST_SESSION_REGRESSION_CHECKLIST, RELEASE_CHECKLIST, REPO_MAP)
- Supporting doctrine: `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`, `overflow/supporting-doctrine/DO_NOT_BREAK.md`
- Canonical active working set: `docs/ACTIVE_WORKING_SET.md`
- Validation scripts: `scripts/check_save_schema.js`, `scripts/verify-cehp.sh`
- Historical/archive: `legacy/quarantine/**`
- Placeholder scaffold dirs: `src/world1/`, `art/`, `audio/`, `content/`, `telemetry/`, `tests/`, `tools/`, `ui/`

## Architecture Notes
- The game is not modularized at runtime; most gameplay, save logic, scenes, cert aid, and teaching text live in `index.html`.
- Save contract: `SAVE` object with key `cactusEd_save_v1`.
- Direct boot and continue routing must remain intact for `Demo`, `World2`, and `World3`.
- Dev-only certification aid is query-param gated: `?certAid=w2`, `?certAid=w3`.
- Protected readable-path logic is a fragile shared surface.

## Coding Conventions
- Smallest safe fix first.
- Preserve save compatibility, assist persistence, direct boot, and normal title/menu flow.
- Browser-first verification beats static-analysis confidence.
- Report exact commands run and distinguish targeted probes from full certification.

## Current Runtime State (as of 2026-03-15)
- Local index.html contains W2/W3 patches from Sprint 005 (2026-03-14):
  - W2/W3 camera look-ahead lerp
  - W2 quiz canvas.focus() recovery
  - W2/W3 certAid readability increases
  - W3 lesson/gate text size increases
- These patches have NOT been pushed to GitHub yet (CEHP-007 pending)
- Sprint 006 (2026-03-15) was process/doc only — no runtime changes

## Glossary
- `certAid`: dev-only checkpoint boot and overlay for manual certification
- `first-session`: early trust/continuity path across Demo/W2/W3
- `protected readable path`: text-display path preventing important text from being overwritten
- `W2`: World2, Sunlush Learning Preserve
- `W3`: World3, Wellspring Medical Pavilion
- `save contract`: persisted payload shape under `SAVE._key`
- `NEXT_TASK.md`: task beacon — always contains exactly one active task
- `SPRINT_LOG.md`: chronological sprint history that survives chat resets
