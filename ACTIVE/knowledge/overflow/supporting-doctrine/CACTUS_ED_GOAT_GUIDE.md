# Cactus Ed's Happy Place — Repo-Local GOAT Guide

This is the durable repo-local doctrine for active work on Cactus Ed's Happy Place. It is grounded in the current live `index.html`, not in older handoff copies.

## 1. What This Repo Is Now
- A single-file HTML browser platformer.
- Phaser 3 loaded from CDN.
- ES5 JavaScript only.
- No build step.
- Current live scenes: `Title`, `Demo`, `World2`, `World3`.
- The current live focus is first-session trust, continuity, boss rehearsal, and certification honesty across the three institutional worlds.

## 2. Current Build Snapshot
- `index.html` is the only gameplay/runtime source of truth.
- The live build currently centers on:
  - World 1: Welcome & Adjustment Bureau
  - World 2: Sunlush Learning Preserve
  - World 3: Wellspring Medical Pavilion
- Current first-session support systems already in the live file include:
  - protected readable-path text via `showProtectedReadableText(...)`
  - first-session summary logging via `dumpFirstSessionSummary(...)`
  - runtime-only first-session metrics including `overlapPrevented`
  - W1 counselor preteach
  - W2 gardener preview / podium rehearsal
  - W3 waiting-room stillness, scan lesson, and pre-auth drill
- Direct boots into `Demo`, `World2`, and `World3` are active regression surfaces and must remain green.

## 3. Core Doctrine
- The opener is a promise.
- Weirdness must pay rent.
- The institution posts its rules before it punishes.
- Ed is the straight man.
- Cigarette centrality stays.
- The ending is sacred.
- Optimize for competence, autonomy, curiosity, and authored trust before polish.

## 4. Current Priority Order
1. Trustworthy continuity and browser certification.
2. Readable overlap discipline for text, receipts, PA, and drill confirmations.
3. Honest validation and regression prevention.
4. Small safe feel fixes where a real run exposes unfairness or silence.
5. Art-first rollout only after continuity trust is stable.

## 5. Sacred Constraints
- Preserve save compatibility, `SAVE._key`, payload shape, direct boot behavior, and assist persistence.
- Keep gameplay in `index.html`.
- No build step.
- No speculative architecture churn.
- No meme drift, no tutorial walls, no off-tone writing.

## 6. Fragile Surfaces
- `TEXT_ZONES` and any delayed text routed into it.
- Late receipts, PA lines, ads, and NPC barks during teaching spaces.
- World 2 preview dismissal and cleanup.
- World 3 diagnostic receipts near the scan pocket.
- Certification honesty: targeted probes must not be reported as full continuity runs.

## 7. Active Do Not Regress
- Do not let older generic reward or acknowledgment text bypass protected readable paths and overwrite later teaching-space confirmations.
- Do not let the World 2 preview dismissal depend on delayed polling or leave preview text nodes alive after close.
- Do not let World 3 diagnostic zone receipts enter the scan teaching pocket.
- Preserve direct boot into `Demo`, `World2`, and `World3`.
- Preserve save compatibility and assist persistence.

## 8. Validation Truth
- Real browser first, teleports second.
- Use one world per browser instance for certification.
- Current reliable smoke path:
```bash
python3 -m http.server 4175 --bind 127.0.0.1
node /tmp/codex-playwright-cert/smoke.js
```
- Current save validation path:
```bash
node scripts/check_save_schema.js
node /tmp/codex-playwright-cert/save_continue_probe.js
```
- Do not claim gameplay certification from docs-only or script-only passes.

## 9. Repo Memory Stack
- `AGENTS.md` sets repo defaults.
- `SPEC.md` states current runtime truth.
- `PLAN.md` states current roadmap and named-pass planning shape.
- `IMPLEMENT.md` is the implementation runbook.
- `DOCS.md` explains which docs are active truth vs historical context.
- `FIRST_SESSION_REGRESSION_CHECKLIST.md` preserves real fragile checks.
- `docs/skills/first-session-certification/SKILL.md` is a repo-local reusable workflow draft.
