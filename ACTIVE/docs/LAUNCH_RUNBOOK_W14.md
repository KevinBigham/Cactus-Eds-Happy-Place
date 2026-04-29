# W14 Launch Runbook

Date: `2026-05-29`
Launch lock: `2026-05-29`
Primary trigger owner: Kevin
Runtime baseline: W13 `launch-freeze` tag after P6

This is the launch-day runbook for the W14 public launch. `ACTIVE/docs/LAUNCH_RUNBOOK_W6.md` is historical reference only and should not be edited for W14.

## Source Of Truth

- Game artifact: `ACTIVE/game/index.html`
- Local launch gate: `bash ACTIVE/game/scripts/verify-launch.sh`
- Replay corpus: `cd ACTIVE/game && npm run test:replay`
- Public fallback URL: `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/`
- Custom domain target: `https://counterfeit-educational.org/`
- Incident log: `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md`
- Freeze tag: `launch-freeze`

## T-1 Day Checklist

Run this on Thursday `2026-05-28`.

1. Re-run the dress rehearsal recipe.
   - Command: follow `ACTIVE/docs/LAUNCH_DRESS_REHEARSAL.md` from top to bottom.
   - GREEN output: every step is marked GREEN, with wall-clock times recorded.
   - RED mode: any failed clone, install, build, verify, replay, browser boot, or Chrome stable check stops launch prep until resolved.

2. Confirm working tree and launch tag.
   - Command:
     ```bash
     git status --short
     git rev-parse launch-freeze
     git log --oneline -1 launch-freeze
     ```
   - GREEN output: only expected local/ignored files are dirty; `launch-freeze` resolves to the freeze commit recorded in `ACTIVE/docs/LAUNCH_FREEZE.md`.
   - RED mode: missing tag, unexpected runtime dirty files, or a freeze hash mismatch.

3. Re-run the local launch gate.
   - Command:
     ```bash
     bash ACTIVE/game/scripts/verify-launch.sh
     ```
   - GREEN output: final line `CEHP LAUNCH VERIFY: PASS`; bundle remains under `409600`; oracle remains `117/117`; replay remains `10/10`.
   - RED mode: any `CEHP LAUNCH VERIFY: FAIL` line or changed bundle/oracle/replay count.

4. Confirm public fallback still responds.
   - Command:
     ```bash
     curl -I https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
     ```
   - GREEN output: HTTP `200` or another successful GitHub Pages response.
   - RED mode: 404, TLS failure, redirect loop, or a non-CEHP page.

5. Check launch assets are present.
   - Command:
     ```bash
     test -s ACTIVE/delivery/w14_launch/cehp_launch_trailer_v2.mp4
     test -s ACTIVE/marketing/cr_pitch_v1/SEND_READY_PACKET.md
     ```
   - GREEN output: both commands exit `0`.
   - RED mode: missing trailer master or missing CR packet.

## T-0 Launch Sequence

Use Central Time. Kevin owns every public trigger.

### 08:00 CT - Morning Cold-Clone Gauntlet

1. Create a fresh clone.
   - Command:
     ```bash
     REHEARSAL="/tmp/cehp-launch-$(date +%s)"
     git clone git@github.com:KevinBigham/Cactus-Eds-Happy-Place.git "$REHEARSAL"
     cd "$REHEARSAL/ACTIVE/game"
     npm install
     ```
   - GREEN output: clone completes, install exits `0`.
   - RED mode: clone/auth failure, package install failure, or missing `ACTIVE/game`.

2. Run the launch gate from the clone.
   - Command:
     ```bash
     node build.js
     bash scripts/verify-launch.sh
     npm run test:replay
     ```
   - GREEN output: `CEHP LAUNCH VERIFY: PASS`; `SUMMARY PASS 10/10`.
   - RED mode: any failing launch component or replay divergence.

### 12:00 CT - Final Taste Gate

1. Kevin plays the freeze build.
   - Command:
     ```bash
     open "$REHEARSAL/ACTIVE/game/index.html"
     ```
   - GREEN output: Kevin confirms W1 entry, W2 pressure, W3 warmth, receipt reveal, and THE DOCKET feel launch-ready.
   - RED mode: game does not start, save corruption, Chrome stable broken, or a security concern.

2. If Kevin calls hold, stop here.
   - Command:
     ```bash
     cd "$REHEARSAL"
     printf '%s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z') HOLD: Kevin taste gate" >> ACTIVE/docs/LAUNCH_INCIDENT_LOG.md
     ```
   - GREEN output: incident log captures the hold.
   - RED mode: no public push, DNS flip, CR send, announce thread, or trailer publish happens.

### 17:00 CT - Push Main

1. Confirm local `main` is on the freeze commit.
   - Command:
     ```bash
     git checkout main
     git fetch origin --tags
     git rev-parse HEAD
     git rev-parse launch-freeze
     ```
   - GREEN output: `HEAD` matches `launch-freeze`.
   - RED mode: mismatch. Do not push until HEAD matches the freeze commit.

2. Push `main`.
   - Command:
     ```bash
     git push origin main
     ```
   - GREEN output: push exits `0`; GitHub Pages deploy starts.
   - RED mode: rejected push, auth failure, or branch protection failure.

3. Watch deploy status.
   - Command:
     ```bash
     gh run list --workflow static.yml --limit 3
     ```
   - GREEN output: newest `static.yml` run succeeds.
   - RED mode: failed or stuck deploy. Do not flip DNS until Pages is healthy.

### 17:20 CT - Verify Pages Fallback

1. Check the fallback URL.
   - Command:
     ```bash
     cd ACTIVE/game
     CEHP_BASE_URL=https://kevinbigham.github.io/Cactus-Eds-Happy-Place node scripts/verify_live_domain.mjs
     ```
   - GREEN output: `CEHP live-domain smoke passed.`
   - RED mode: root, world, docket, or settings route fails.

### 17:30 CT - DNS Flip

1. Kevin flips registrar records.
   - Reference: `ACTIVE/docs/DNS_CUTOVER.md`.
   - GREEN output: apex points to GitHub Pages A records; `www` points to `kevinbigham.github.io`; previous values are copied into the incident log before save.
   - RED mode: previous DNS values are not captured or registrar changes fail.

2. Verify custom domain.
   - Command:
     ```bash
     cd ACTIVE/game
     CEHP_BASE_URL=https://counterfeit-educational.org node scripts/verify_live_domain.mjs
     ```
   - GREEN output: `CEHP live-domain smoke passed.`
   - RED mode: route failure, TLS failure, stale build, or non-CEHP page. Use the GitHub Pages fallback in public copy.

### 17:45 CT - CR Send

Skip this if Critical Reflex was already sent on Monday `2026-05-25`.

1. Open the packet.
   - Command:
     ```bash
     sed -n '1,220p' ACTIVE/marketing/cr_pitch_v1/SEND_READY_PACKET.md
     ```
   - GREEN output: cover note and replacement markers are current.
   - RED mode: stale screenshots, stale URL, or missing trailer asset.

2. Kevin sends email manually.
   - GREEN output: sent email is logged in `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md`.
   - RED mode: do not send if domain verification failed and the copy still promises the custom domain.

### 18:00 CT - Announce Thread

1. Use the verified public URL.
   - Command:
     ```bash
     printf '%s\n' "Primary URL: https://counterfeit-educational.org/"
     printf '%s\n' "Fallback URL: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/"
     ```
   - GREEN output: announce copy uses the verified URL from the 17:30 CT check.
   - RED mode: custom domain unhealthy. Announce with GitHub Pages fallback only.

2. Kevin posts in chosen order.
   - Surfaces: Discord, Twitter/X, Bluesky, Reddit, or Kevin's chosen stack.
   - GREEN output: posts published and links manually opened once.
   - RED mode: broken public link, wrong trailer link, or stale screenshot.

### 18:15 CT - Trailer Publish

1. Confirm final file exists.
   - Command:
     ```bash
     test -s ACTIVE/delivery/w14_launch/cehp_launch_trailer_v2.mp4
     ```
   - GREEN output: command exits `0`.
   - RED mode: missing or zero-byte trailer file.

2. Kevin uploads and publishes manually.
   - GREEN output: published trailer URL is added to `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md`.
   - RED mode: upload fails or wrong video file selected.

## Rollback Procedures

### Scenario 1: Broken Public Link

Symptoms: 404, TLS failure, redirect loop, wrong page, or custom domain stale build.

Commands:

```bash
curl -I https://counterfeit-educational.org/
curl -I https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
cd ACTIVE/game
CEHP_BASE_URL=https://kevinbigham.github.io/Cactus-Eds-Happy-Place node scripts/verify_live_domain.mjs
```

Rollback:

1. If GitHub Pages fallback is green, switch all public copy to the fallback URL.
2. If custom DNS caused the issue, Kevin restores registrar records copied during the DNS flip.
3. Log the rollback:
   ```bash
   cd "$(git rev-parse --show-toplevel)"
   printf '%s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z') ROLLBACK: custom domain returned to prior records" >> ACTIVE/docs/LAUNCH_INCIDENT_LOG.md
   ```

### Scenario 2: Missing Asset

Symptoms: broken splash, missing Ed sheet, missing receipt crest, missing trailer, or browser console asset failure.

Commands:

```bash
cd ACTIVE/game
node scripts/verify_art_assets.mjs
bash scripts/verify-launch.sh
```

Rollback:

```bash
cd "$(git rev-parse --show-toplevel)"
git checkout main
git log --oneline -5
git revert --no-edit <bad_asset_commit>
bash ACTIVE/game/scripts/verify-launch.sh
git push origin main
```

Use `launch-freeze` as the comparison point:

```bash
git diff --name-only launch-freeze..HEAD
```

### Scenario 3: Save Corruption

Symptoms: old save fails to boot, save data is erased unexpectedly, settings no longer persist, or schema check fails.

Commands:

```bash
node ACTIVE/game/scripts/check_save_schema.js
bash ACTIVE/game/scripts/verify-launch.sh
```

Rollback:

```bash
cd "$(git rev-parse --show-toplevel)"
git checkout main
git log --oneline launch-freeze..HEAD
git revert --no-edit <bad_save_commit>
node ACTIVE/game/scripts/check_save_schema.js
bash ACTIVE/game/scripts/verify-launch.sh
git push origin main
```

If the bad save commit is not obvious, stop public changes and keep the GitHub Pages fallback pointed at the last verified freeze state.

## Monitoring

Use `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md` for every check-in.

### T-0

- Check root URL.
- Check one seeded W1 play URL.
- Check THE DOCKET.
- Check `?settings=1`.
- Log status.

### T+1h

- Repeat root, seeded play, docket, settings.
- Check one announce link from each posted surface.
- Log status.

### T+4h

- Repeat public link checks.
- Check comments or replies for broken-link reports.
- Log status.

### T+24h

- Repeat public link checks.
- Decide whether DNS fallback notes can be removed from launch copy.
- Log status.

## Launch-Blocking Definition

Launch-blocking means one of:

- Game will not start.
- Save corruption.
- Security issue.
- Chrome stable broken.

Anything else is post-launch unless Kevin overrides.
