# Cactus Ed's Happy Place — Repo Agent Rules

## Read Order
1. `AGENTS.md`
2. `docs/ACTIVE_WORKING_SET.md`
3. `CURRENT_PASS.md`
4. `HANDOFF.md`
5. `SPEC.md`
6. `PLAN.md`
7. `IMPLEMENT.md`
8. `DOCS.md`
9. `FIRST_SESSION_REGRESSION_CHECKLIST.md`
10. `CERTIFICATION_EVIDENCE.md`
11. `RELEASE_CHECKLIST.md`
12. `KNOWN_ISSUES.md`
13. `REPO_MAP.md`
14. `VERIFY.md`
15. `DECISIONS.md`
16. `BACKLOG.md`
17. `REQUESTED_INPUTS.md`
18. `docs/skills/first-session-certification/SKILL.md` when doing certification work

## Canonical Active Working Set
- The canonical working-set file is `docs/ACTIVE_WORKING_SET.md`.
- Do not create a competing root-level `ACTIVE_WORKING_SET.md`.

## Project Identity
- Runtime truth is `index.html`.
- The game is a single-file HTML browser platformer using Phaser from CDN and ES5 JavaScript only.
- There is no build step.
- Supporting doctrine lives in `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`.
- Supporting creative guardrails live in `overflow/supporting-doctrine/DO_NOT_BREAK.md`.
- Runtime/source-of-truth guidance lives in `docs/ACTIVE_WORKING_SET.md`.

## Truth Hierarchy
- `index.html` is implementation truth for gameplay and runtime behavior.
- `docs/ACTIVE_WORKING_SET.md`, `CURRENT_PASS.md`, `HANDOFF.md`, `SPEC.md`, `PLAN.md`, `IMPLEMENT.md`, `DOCS.md`, and this file are the active planning and communication layer.
- `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md` and `overflow/supporting-doctrine/DO_NOT_BREAK.md` are supporting doctrine, not default historical-trash, and they are no longer the default first-pass read surface.
- `README.md` and anything under `legacy/quarantine/**` are historical context unless they match the live runtime.
- If docs and live code disagree, report the disagreement explicitly and say which source appears current.

## Working Rules
- Smallest safe fix first.
- Preserve save compatibility, `SAVE._key`, payload shape, direct boot behavior, and assist persistence.
- Do not broadly rewrite `index.html` for local problems.
- Prefer surgical runtime fixes over new systems.
- This checkout is not a git repo. Do not depend on `git` commands for validation or change discovery.
- ChatGPT is architect/director only.
- Codex is builder only.
- Claude Code is reviewer only.
- Claude Cowork is ops/producer coordinator only.
- No one widens scope during a structure pass.
- Claude reviews only after Codex verification succeeds.
- Ignore `legacy/quarantine/**` by default unless the current task explicitly asks for historical context.
- That includes the archived transfer pack, old briefings, old handoffs, runtime backups, and archived validator scripts.
- Ignore `overflow/` and any other archive/history lane by default unless the task explicitly targets them.
- `HANDOFF.md` must contain a clear `FOR CLAUDE REVIEW` section, a `FOR COWORK OPS` section, and a `FOR PUBLIC DEPLOY` section.

## Gameplay-Safe Coding Rules
- The opener is a promise.
- Weirdness must pay rent.
- The institution posts its rules before it punishes.
- Ed is the straight man.
- Cigarette centrality stays.
- The ending is sacred.
- Protect competence, autonomy, curiosity, and authored trust before polish.

## Overlap And Confirmation Rules
- All delayed teaching or confirmation text must use `showProtectedReadableText(...)` or equivalent zone-safe readable-path logic.
- Do not let older generic reward or acknowledgment text bypass protected readable paths and overwrite later teaching-space confirmations.
- Do not let the World 2 preview dismissal depend on delayed polling or leave preview text nodes alive after close.
- Do not let World 3 diagnostic zone receipts enter the scan teaching pocket.
- Do not let full-screen/modal overlays remain alive after dismissal.
- Do not let counselor hotspot telemetry arm before the counselor band is actually active.
- Do not let the physician threshold or boss activation bypass pre-auth completion.
- Do not let the dev-only certification aid alter normal title/menu flow when the query param is absent.
- Do not let checkpoint retry preserve stale progress across scene restart.
- Treat `TEXT_ZONES` as a fragile shared surface. Audit late receipts, PA lines, ads, and NPC barks whenever a teaching beat changes.
- When correct play is taught, visible confirmation should survive long enough to be read.

## Validation Rules
- Real browser first, teleports second.
- Use one world per browser instance for certification. Do not trust multi-scene browser reuse as certification evidence.
- Focus the canvas before movement or attack input.
- Reliable smoke commands from repo root:
```bash
python3 -m http.server 4175 --bind 127.0.0.1
node /tmp/codex-playwright-cert/smoke.js
```
- Save validation has two layers:
```bash
node scripts/check_save_schema.js
node /tmp/codex-playwright-cert/save_continue_probe.js
```
- Quick repo wrapper:
```bash
./scripts/verify-cehp.sh
```
- The skill draft at `docs/skills/first-session-certification/SKILL.md` is repo-local memory only. Consult it manually unless it is later copied into Codex's actual skill directory.

## Certification Honesty
- Do not claim full certification unless a full focused continuity run actually happened from spawn through the named target route.
- If only targeted probes were run, say so explicitly and name the missing continuity segments.
- Separate structural correctness from felt correctness in reports.
- Report exact commands actually run.

## Pre-Commit Hygiene (applies to real git clone; this local workspace is non-git)
- Before any commit: run `git status`, confirm repo root, confirm branch/worktree, confirm only in-scope files are staged.
- If out-of-scope files are staged: STOP, report them, do not include them in the commit.
- Do not trust parent git roots blindly. Use explicit repo paths/worktrees.
- Do not assume a review-branch commit is already merged to `main`.
- Do not report a public link as live unless it was directly verified in the current pass.

## One-File Warning
- Avoid multiple live threads editing `index.html` at the same time.
- If git worktrees are unavailable in this checkout, use isolated copied workspaces plus timestamped backups for side quests.
- Make a fresh sibling backup of `index.html` before risky passes.

## Done When
- The requested change is implemented with the smallest safe edit set.
- Save/continue, assist persistence, and direct boot still work.
- No new console or page errors appear in the validation actually run.
- The final report states what changed, what was validated, and what still needs human play.
