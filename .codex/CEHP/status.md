# CEHP Status

- current objective: **CEHP REBUILD WEEK 6 — LAUNCH WEEK**. Kevin signed off Week 5 on 2026-04-21 ("get Codex to party with us") after the W5 Builder slice + bedtime sprint closed green locally. `PROPOSED_NEXT_TASK.md` was promoted to `NEXT_TASK.md` as `CEHP-REBUILD-W6-LAUNCH` with `TASK_OWNER_ROLE: Builder (Codex 5.4)`. Launch-week work is now active — cutover, trailer final, CR outreach packet, monitoring runbook, rollback rehearsal. All Kevin-gated actions (DNS flip, CR send, trailer publish, announce threads, push to main) remain held.
- what is done:
  - Legacy runtime (19,835 lines) is archived at `ARCHIVE/legacy_runtime_v1/index.html` as reference only.
  - 25-ruling rebuild doctrine is locked in `ACTIVE/docs/FINAL_GAMEPLAN.md`.
  - **Kevin signed off Week 3 on 2026-04-20**; all 5 taste notes ratified; Week 4 activated.
  - **Kevin signed off Week 4 on 2026-04-20** ("GREEN LIGHT! APPROVED! SALUTE! LFG!"); all 5 Week 4 taste notes ratified; Week 5 activated.
  - **Week 5 runtime is green locally:** 32 `src/*.js` modules build into one shipped `index.html` (248,475-byte build output / 7,198 lines; 248,537 bytes on disk).
  - **Playable World 1 delivered + still green:** Boot → Play/Orientation Bureau → Overlay → Receipt with six authored rooms. Week 1/2 regression paths (`?room=test`, `?world=orientation`) both still work.
  - **Playable World 2 delivered behind `?world=benefits`:** six authored Benefits Enrollment Atrium rooms (`enrollment-intake`, `premium-pathways`, `network-validation`, `deductible-adjustment`, `wellness-incentive`, `final-processing`) with room-local premium targets `[2,2,3,2,3,2]`, safer upper branches, and uninsured lower lanes.
  - **Playable World 3 delivered behind `?world=rasta`:** six authored Rasta rooms (`receiving-dock`, `sync-belt`, `rest-landing`, `sorting-floor`, `humming-mezzanine`, `warm-exit`) with deterministic Synchronicity platforms, a live `REST HERE.` contradiction gate, and polite sorting machines that redirect only.
  - **Week 3 enemies are real:** `60_enemies.js` implements deterministic Actuarial Scantrons (teleport-to-block, seeded RNG), Pizza Party slices (heal + vision occlusion), and Deductible weights (jump-velocity shrink). Zero `Math.random()`.
  - **Deductible jump mutation live + hard-capped:** `+16` steps per hit, cap `+48`, effective jump floor `-292`. `ns.TUNING.JUMP_VELOCITY` global never mutated — run-scoped `ed.jumpVelocity` seam only.
  - **Receipt engine expanded with Rasta-specific weighting + generic route flags:** 20 new Rasta-tagged fragments across `VERDICT_RASTA_*`, `TENSION_RASTA_*`, and `CLOSER_RASTA_*`, plus the pre-existing `cigaretteLit:false` flag seam. Same-seed ambient vs impatient runs now diverge 3/3 on receipt text.
  - **Thermal receipt seam is live:** the shared card model/renderer now powers in-game receipts, docket thumbnails, and the Discord sidecar `--thermal` path while preserving receipt lines and fragment IDs.
  - **THE DOCKET is live locally:** `ACTIVE/game/src/81_docket.js` now derives a deterministic weekly seed from `(isoWeek, year)`, stores archived local receipts under `cactusEd_docket_week_v1`, and renders a plain-HTML archive surface at `?docket=1`.
  - **Week 5 launch-prep artifacts exist locally:** `ACTIVE/game/CNAME`, `ACTIVE/docs/DNS_CUTOVER.md`, `ACTIVE/game/scripts/capture_trailer.mjs`, `ACTIVE/game/scripts/generate_w5_assets.mjs`, `ACTIVE/marketing/cr_pitch_v1/`, and `ACTIVE/delivery/w5_demo/`. `.github/workflows/static.yml` was verified to already deploy `ACTIVE/game` as the Pages root, so no workflow edit was required.
  - **Appeals seam is now documented:** `ACTIVE/docs/APPEALS_MECHANIC.md` explains the compare payload, receipt-scene hook-up, and why public-facing completion is deferred to Kevin's W6 taste call.
  - **Launch-week briefs now exist:** `ACTIVE/marketing/cr_pitch_v1/DESIGN_BRIEF.md`, `ACTIVE/delivery/w5_demo/TRAILER_EDIT_BRIEF.md`, `ACTIVE/docs/LAUNCH_GO_NOGO.md`, `ACTIVE/docs/PERF_AUDIT_W5.md`, `ACTIVE/docs/A11Y_STATUS.md`, `ACTIVE/docs/PROPOSED_NEXT_TASK.md`, and `ACTIVE/docs/MORNING_BRIEF.md`.
  - **Accessibility escape hatch is no longer cosmetic:** all 5 `?settings=1` toggles now persist into runtime assist tuning and are covered by `ACTIVE/game/tests/cehp_accessibility_settings.mjs`.
  - **Discord sidecar hardened:** `ACTIVE/discord/bot.js` now rejects missing flag values and bad seeds, validates output paths, preserves the canvas fallback, and wraps disk-write failures with a clearer message. Coverage lives in `ACTIVE/discord/tests/bot_hardening.test.mjs`.
  - **W1 silhouette pass shipped:** Orientation Bureau now includes deterministic applicant silhouette variation with three decorative shapes and zero gameplay/save impact.
  - **Rebuild verification green:** save schema, vm logic tests (7/7), browser smoke, accessibility settings smoke, deterministic benefits + rasta + docket case-runs, full `verify-cehp.sh`, bot hardening tests, and local Discord thermal PNG render all pass.
  - **Discord sidecar verified locally:** `ACTIVE/discord/bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` writes a real PNG to `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png`.
  - **W6 kickoff artifact pass is green locally:** `cd ACTIVE/game && node build.js` still outputs `248475` bytes; the local thermal receipt render rewrote `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png` at `116994` bytes.
  - **Repeatable live-domain smoke helper exists:** `ACTIVE/game/scripts/verify_live_domain.mjs` now covers root route, orientation, benefits, rasta, docket, and settings against a supplied base URL. It passed locally against `http://127.0.0.1:4175`.
  - **Trailer final packaging is staged:** `ACTIVE/game/scripts/package_launch_trailer.sh` now writes `ACTIVE/delivery/w6_launch/cehp_launch_trailer_final.mp4` (`28.00s`, `1920x1080`, `24fps`, `597883` bytes), `cehp_launch_trailer_poster.png`, and `ACTIVE/delivery/w6_launch/TRAILER_UPLOAD_DESCRIPTOR.md`.
  - **Launch runbook + rollback docs are staged:** `ACTIVE/docs/LAUNCH_RUNBOOK_W6.md`, `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md`, and `ACTIVE/docs/ROLLBACK_REHEARSAL_W6.md` now exist and are aligned to the live beacon.
  - **CR packet is staged for Kevin review:** `ACTIVE/marketing/cr_pitch_v1/SEND_READY_PACKET.md` now defines the send-ready attachment set and a cover-note starter without sending anything.
  - **Claude Opus 4.7 Week 3 reviewer pass complete (2026-04-20): GREEN.** DoD scorecard 8/8 objective items pass for the Benefits slice. Sacred-constraint regression across 30 modules remained intact (ES5-only, seeded RNG only, save contract preserved, single-file ship, invisible axes). 3 Codex taste notes + 2 reviewer-added taste notes were later queued for Kevin's Week 3 ratification.
- what is done (Week 5 signoff):
  - **Kevin signed off Week 5 on 2026-04-21** ("get Codex to party with us") — blanket authorization to promote W6 and unblock Codex.
  - 4 W5 taste notes recorded and carried forward as acknowledged context, not blockers:
    1. Steam assets (capsule, header, poster, screenshots) ship as procedural placeholders; final art is W6 Kevin's call.
    2. Trailer ships as frame sequences only in W5; final MP4 + music cut is a W6 deliverable.
    3. Appeals mechanic silently shipped (compare seam + ghost frames + `?appeal=` URL); public-facing UI remains a Kevin-only taste call.
    4. Thermal palette is 2-color — Kevin eyeball is carried into W6 in parallel with launch execution, not a blocker.
- what is in progress:
  - **Week 6 (launch week) execution** — Codex active as Builder on `CEHP-REBUILD-W6-LAUNCH`.
  - Launch-week prep Codex may advance autonomously (respecting Kevin-gated list): trailer final packaging, CR outreach polish, launch-day monitoring runbook, rollback rehearsal, live-domain verification scripts.
  - Kevin-gated items held: DNS flip, CR pitch send, trailer publish, public announce threads, push to main.
- blockers:
  - No gameplay blockers.
  - `canvas` source build fails on local Node 25 due missing `pkg-config` / pixman toolchain, so the Discord sidecar prefers `canvas` but falls back to `@napi-rs/canvas` for local verification. Carried from Week 2; not a Week 3/Week 4 regression.
  - `counterfeit-educational.org` and `www.counterfeit-educational.org` do not resolve yet; live-domain checks remain blocked until Kevin flips DNS.
  - This CEHP workspace has no `.git` directory, so a scratch-branch Pages rollback rehearsal could not be performed here. DNS revert and legacy-URL fallback were documented instead.
- next recommended action:
  - Kevin flips DNS tonight after copying the current registrar values into a rollback note.
  - Codex immediately runs `cd ACTIVE/game && CEHP_BASE_URL=https://counterfeit-educational.org node scripts/verify_live_domain.mjs`.
  - Codex immediately reruns `cd ACTIVE/discord && node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` and confirms the play URL resolves on the live domain.
  - Kevin then decides whether to send the CR pitch, publish the trailer, and post the public announce thread.
- target launch: **2026-05-29** (Kane Pixels × A24 *Backrooms* window). Fallback 2026-06-12. Hard stop 8 weeks.
- live URL (legacy, pre-rebuild): https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
- repo: https://github.com/KevinBigham/Cactus-Eds-Happy-Place
- build output: `ACTIVE/game/index.html` = 7,198 lines / 248,537 bytes after `node build.js` (32 modules, bedtime sprint state). Legacy 19,835-line version lives at `ARCHIVE/legacy_runtime_v1/index.html`.
- last-updated: 2026-04-21

## Locked Rebuild Doctrine (Summary of 25 Rulings)

**Architecture**: Dev-time concat `src/00_core.js`–`src/90_ui.js` → one shipped HTML. 6 visible axes + ~30 micro-signals + 3 pairwise tensions (Obedience/Style/Audit Risk). All 11 actions permanent from Minute 1. Full-diegetic UI with `?settings=1` accessibility hatch. Save v2 migration preserving v1 archaeological layer.

**Receipt + Social**: 3 lines + seed format. 1080×1350 PNG + thermal mode (`?thermal=1`). `counterfeit-educational.org` as canonical home. Appeals mechanic ships in rebuild scope. THE DOCKET (weekly permanent seed).

**Launch**: Target 2026-05-29. Critical Reflex pitch Priority #1. Steam later as "The HR Expansion" ($14.99). Analog-horror audience wedge primary. Discord bot is discovery channel #1.

**Worlds**: 3 worlds × 5 min vertical slice. World 1 Orientation Bureau, World 2 Benefits Enrollment Atrium, World 3 Rasta Corp Logistics Hub. Rasta Corp is structural (the contrast engine). Contradiction gates + forms-as-objects are core mechanics in every world.

**Audio/Death/Cig**: *Papers, Please* × public-access dub engineer — 4-layer adaptive Web Audio. Cigarette = visual feedback only (no mechanics). Death = <1s stamp with escalating language.

**Production**: 1 week per world. 6 weeks total. All sacred constraints preserved. Moderate autonomy with seed-milestone check-ins.
