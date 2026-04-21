# W6 Rollback Rehearsal

Date: `2026-04-21`

Purpose: rehearse the three rollback paths before Kevin flips DNS tonight.

## Rehearsal inputs

- `ACTIVE/docs/NEXT_TASK.md`
- `ACTIVE/docs/LAUNCH_GO_NOGO.md`
- `ACTIVE/docs/DNS_CUTOVER.md`
- Legacy public URL: `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/`

## Current external state observed during rehearsal

- `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/` returns `HTTP 200` from GitHub Pages.
- `counterfeit-educational.org` does not resolve yet.
- `www.counterfeit-educational.org` does not resolve yet.

## Rehearsal 1: DNS revert

Goal:
- Make the revert path explicit before Kevin edits the registrar.

Dry run:
1. Copy the current registrar values into a rollback note before touching the apex or `www` records.
2. Copy the target Pages values from `DNS_CUTOVER.md`:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   - `www -> kevinbigham.github.io`
3. Define the failure condition: custom domain does not resolve, resolves stale, or breaks root/docket.
4. Define the rollback action: restore the saved pre-launch values immediately and wait for propagation before any second edit.

Result:
- The decision tree is clear.
- The missing step is human: Kevin must copy the current registrar values out before save.

## Rehearsal 2: Pages fallback

Goal:
- Keep a working public URL even if the custom domain is unhealthy.

Dry run:
1. Confirm the legacy Pages URL responds with `HTTP 200`.
2. Treat `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/` as the public fallback in all launch messaging if the custom domain fails.
3. Hold any `push to main / deploy` action because it is Kevin-gated.

Result:
- The legacy fallback URL is live right now.
- Limitation: this workspace is not a git checkout, so a scratch-branch or git-based Pages rollback could not be rehearsed here.

Risk:
- If a deploy-level rollback is needed, it must be done from a real git checkout or the GitHub UI. That path is documented but not mechanically rehearsed in this workspace.

## Rehearsal 3: Discord bot disable

Goal:
- Shut the bot down fast if live renders go bad.

Dry run:
1. Re-render the local thermal receipt successfully before launch.
2. If the bot fails live, stop the running `node bot.js` process immediately.
3. If an automation exists later, pause or delete it before retrying.
4. Launch site-only while the bot is offline.

Result:
- Local render is green.
- The stop condition is simple and safe: terminate the process, keep the site up, retry only after one clean local render.

## Findings

- DNS is not flipped yet, so the safest order remains: copy registrar values, flip, run live smoke, then decide whether the custom domain stays up.
- The legacy GitHub Pages URL is the only verified public fallback right now.
- The only incomplete rehearsal path is a deploy rollback, because this CEHP workspace has no `.git` directory. That does not block the DNS revert plan, but it does mean Kevin should be ready to use the GitHub UI or another real checkout if the Pages target itself must change.
