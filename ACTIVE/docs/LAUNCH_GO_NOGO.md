# LAUNCH GO / NO-GO

Printable launch-day checklist for Kevin.

## Pre-Flight (T-24h)

- [ ] Verify DNS propagation plan is ready.
  - Rollback: do not flip registrar records until the current target values are copied into a rollback note.
- [ ] Run `cd ACTIVE/game && bash scripts/verify-cehp.sh` and confirm full green.
  - Rollback: if red, stop launch and continue serving the current public target.
- [ ] Cold-start the Discord bot in staging/local and confirm one receipt render succeeds.
  - Rollback: keep bot offline; launch the site without bot amplification.
- [ ] Draft the Critical Reflex pitch email and confirm assets/links are attached but unsent.
  - Rollback: if anything is missing, do not send on launch day.

## Launch Moment (T-0)

- [ ] Flip DNS at the registrar to the approved Pages target.
  - Rollback: restore the previous DNS records immediately if the live domain fails health checks.
- [ ] Verify `https://counterfeit-educational.org/` loads the rebuild.
  - Rollback: revert DNS to the prior host if the root route fails or serves stale content.
- [ ] Verify `https://counterfeit-educational.org/?docket=1` loads and renders a docket receipt.
  - Rollback: revert DNS if root works but docket is broken in a way that undermines launch framing.
- [ ] Render one live-domain Discord PNG against the live play URL.
  - Rollback: pause the bot and fall back to site-only launch if render or write paths fail.
- [ ] Send the Critical Reflex pitch.
  - Rollback: if live-domain checks are not green, do not send yet.

## Monitoring (T+1h)

- [ ] Check for `404`, redirect loops, stale-cache behavior, and mixed-domain links.
  - Rollback: revert DNS if routing remains unstable after cache clear + one manual retry.
- [ ] Confirm the bot still renders and does not spam error output.
  - Rollback: stop the bot process and remove any scheduled automation until fixed.
- [ ] Capture one note on what broke, what held, and what felt risky.
  - Rollback: if incident load is non-trivial, freeze all non-essential changes for the day.

## Retrospective (T+24h)

- [ ] Write the first-wave retrospective: traffic quality, bot behavior, press replies, failure points.
  - Rollback: if launch-day rollback happened, write the rollback postmortem first.

## Explicit rollback plan

### DNS cutover fails

- Keep a copy of the pre-launch registrar records before touching anything.
- If `counterfeit-educational.org` does not resolve cleanly or serves the wrong site, restore the previous records immediately.
- Re-check after propagation begins; do not stack additional DNS edits unless the first rollback is complete.

### Pages build fails

- Treat `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/` as the legacy fallback URL.
- If the custom-domain Pages target fails but the GitHub Pages URL still serves, point communications back to the legacy URL until the rebuild deploy is corrected.
- Do not keep the custom domain pointed at a broken Pages build just because the registrar change already happened.

### Discord bot errors

- Stop the running bot process immediately.
- Do not keep retrying live in public if it is emitting bad-seed or file-write failures.
- Resume only after one local/staging receipt render passes again.
