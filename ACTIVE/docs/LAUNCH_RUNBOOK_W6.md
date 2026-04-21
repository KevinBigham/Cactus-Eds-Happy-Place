# W6 Launch Runbook

Operational runbook for the 2026-05-29 launch window. This file translates `LAUNCH_GO_NOGO.md` into exact execution steps, acceptance criteria, and rollback triggers.

## Scope

- Covers the local pre-flight, the live-domain verification pass after Kevin flips DNS, the bot verification, and the first monitoring hour.
- Stops at Kevin-gated boundaries: registrar edits, trailer publish, CR send, public posts, push/deploy, save-shape changes, new gameplay content, public Appeals UI.

## Pre-Flight (before DNS flip)

### 1. Rebuild the shipped artifact

Command:
`cd ACTIVE/game && node build.js`

Acceptance:
- Output remains `Built 32 modules -> index.html (248475 bytes)`.
- `ACTIVE/game/index.html` stays the single shipped runtime.

Rollback trigger:
- Byte count changes unexpectedly or build fails.

Rollback action:
- Stop launch prep, inspect the diff in `ACTIVE/game/index.html`, and do not proceed to DNS.

### 2. Confirm the green local baseline

Already green this pass:
- `node ACTIVE/game/scripts/check_save_schema.js`
- `bash ACTIVE/game/scripts/verify-cehp.sh`
- `node --test ACTIVE/discord/tests/bot_hardening.test.mjs`
- `node ACTIVE/discord/bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal`

Acceptance:
- Save contract intact.
- Full suite green.
- Local Discord thermal receipt writes a non-zero PNG.

Rollback trigger:
- Any red check in the four-command baseline.

Rollback action:
- Fix locally first. DNS stays untouched.

### 3. Package the trailer master

Command:
`bash ACTIVE/game/scripts/package_launch_trailer.sh`

Outputs:
- `ACTIVE/delivery/w6_launch/cehp_launch_trailer_final.mp4`
- `ACTIVE/delivery/w6_launch/cehp_launch_trailer_poster.png`

Acceptance:
- MP4 exists and is non-zero bytes.
- Poster frame exists and is non-zero bytes.
- Runtime is `28s` at `24fps` with the quiet structure from `TRAILER_EDIT_BRIEF.md`.

Rollback trigger:
- Script fails, output is empty, or the sequence breaks the brief.

Rollback action:
- Hold publish prep. Use the W5 frame bundle as the fallback evidence pack.

### 4. Rehearse rollback

Reference:
`ACTIVE/docs/ROLLBACK_REHEARSAL_W6.md`

Acceptance:
- DNS revert path documented.
- Pages fallback path documented.
- Bot disable path documented.

Rollback trigger:
- Any path depends on a missing credential, missing host, or unverified fallback URL.

Rollback action:
- Flag the gap before the DNS flip. No public launch until the rollback path is explicit.

## DNS Flip Window (Kevin-gated)

### 1. Kevin flips the registrar records

Reference:
`ACTIVE/docs/DNS_CUTOVER.md`

Acceptance:
- Apex points to the four GitHub Pages A records.
- `www` CNAME points to `kevinbigham.github.io`.
- Previous registrar values are copied into a rollback note before save.

Rollback trigger:
- Kevin does not have the prior values copied out.

Rollback action:
- Do not save the new DNS values yet.

### 2. Verify the live domain immediately after the flip

Command:
`cd ACTIVE/game && CEHP_BASE_URL=https://counterfeit-educational.org node scripts/verify_live_domain.mjs`

Acceptance:
- Root route loads.
- `?world=benefits` loads.
- `?world=rasta` loads.
- `?docket=1&thermal=1` loads with a receipt canvas and play link.
- `?settings=1` loads with all five toggles visible.

Rollback trigger:
- Any route throws page errors, console errors, or fails to render the expected surface.

Rollback action:
- Revert DNS to the pre-launch records immediately.
- Point all human communication back to `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/`.

### 3. Run one real Discord thermal render

Command:
`cd ACTIVE/discord && node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal`

Acceptance:
- `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png` is re-written.
- File size is non-zero.
- The embedded play URL resolves on the live domain.

Rollback trigger:
- Render fails, file write fails, or the URL still points somewhere broken.

Rollback action:
- Stop the bot and launch site-only.

## Monitoring (T+1h)

### 1. Watch for routing errors

Checks:
- Root route stays warm.
- No `404` or redirect loop on the custom domain.
- No stale-cache path serving the legacy build.

Acceptance:
- Root, docket, and seeded play routes still load after one manual refresh.

Rollback trigger:
- Mixed-domain links, stale build, or repeated route failures.

Rollback action:
- Revert DNS if the issue survives a cache clear and one clean retry.

### 2. Watch the bot

Checks:
- One follow-up render still works.
- No repeated error spam in the terminal.

Acceptance:
- The bot only emits one success line per render.

Rollback trigger:
- Bad-seed loops, write failures, or repeated stack traces.

Rollback action:
- Kill the bot process and keep the site live without bot amplification.

### 3. Write incidents down immediately

Reference:
`ACTIVE/docs/LAUNCH_INCIDENT_LOG.md`

Acceptance:
- Every incident gets a timestamp, symptom, action, owner, and status.

Rollback trigger:
- More than one unresolved launch issue at once.

Rollback action:
- Freeze all non-essential work until the log is current and the user-facing risk is understood.
