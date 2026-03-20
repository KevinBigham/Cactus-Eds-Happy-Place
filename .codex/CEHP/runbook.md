# CEHP Runbook

## Setup
- Repo root: `/Users/tkevinbigham/Desktop/cactus-eds-happiest-place-main`
- No build step. Serve the repo root as static files for browser checks.
- This workspace is a non-git checkout.

## Cold-Start Boot Sequence
Read these files in this order:
1. `AGENTS.md` — who does what, tiered boot sequence, rules
2. `NEXT_TASK.md` — what to work on RIGHT NOW
3. `CURRENT_PASS.md` — what pass is active
4. `HANDOFF.md` — what just happened + per-agent next prompts
5. `BACKLOG.md` — what comes after
6. `KNOWN_ISSUES.md` — what's broken
7. `REQUESTED_INPUTS.md` — what we need from the human

Reference docs live in `overflow/reference-docs/`. Read them when doing implementation or certification work.

## Commands
- Fast verify: `./scripts/verify-cehp.sh`
- Save schema check: `node scripts/check_save_schema.js`
- Manual server: `python3 -m http.server 4175 --bind 127.0.0.1`
- Manual URLs:
  - `http://127.0.0.1:4175/index.html`
  - `http://127.0.0.1:4175/index.html?certAid=w2`
  - `http://127.0.0.1:4175/index.html?certAid=w3`

## What To Check
- Normal boot still lands on `Title`.
- `?certAid=w2` and `?certAid=w3` only affect boot when the query param is present.
- Save contract still uses `SAVE._key === 'cactusEd_save_v1'`.
- Continue routing and assist persistence remain unchanged.

## Known Environment Notes
- Disposable smoke harness under `/tmp/codex-playwright-cert/` may be missing in some sessions.
- `./scripts/verify-cehp.sh` degrades gracefully when smoke harness is absent.
- Browser focus matters for input-sensitive checks.

## Debugging Tips
- Treat `TEXT_ZONES` and delayed teaching/confirmation text as fragile shared surfaces.
- Prefer a real browser repro before changing gameplay behavior.
- If docs and runtime disagree, report it and trust `index.html` for live behavior.
- Reference docs (SPEC, IMPLEMENT, VERIFY, etc.) are in `overflow/reference-docs/` — not at root.
