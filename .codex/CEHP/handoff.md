# CEHP Handoff

## What Was Just Done (2026-04-21 — W6 Kickoff Prep · Green Before DNS Flip)

Codex executed the non-gated W6 kickoff slice in-place. No Kevin-gated action was taken. DNS was not changed, the trailer was not published, the CR pitch was not sent, no public post went out, and nothing was pushed to `main`.

### What is green right now
1. `cd ACTIVE/game && node build.js` — still builds **32 modules** into the shipped single-file `index.html` (`248475` bytes from build output; `248537` bytes on disk).
2. `cd ACTIVE/game && node scripts/check_save_schema.js` — still passes with save contract intact.
3. `cd ACTIVE/game && bash scripts/verify-cehp.sh` — still passes end-to-end.
4. `cd ACTIVE/discord && node --test tests/bot_hardening.test.mjs` — still **5/5 pass**.
5. `cd ACTIVE/discord && node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` — rewrites `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png` at `116994` bytes.
6. `cd ACTIVE/game && node scripts/verify_live_domain.mjs` — local smoke passes for root route, orientation, benefits, rasta, docket, and settings.
7. `cd ACTIVE/game && bash scripts/package_launch_trailer.sh` — writes:
   - `ACTIVE/delivery/w6_launch/cehp_launch_trailer_final.mp4` (`28.00s`, `1920x1080`, `24fps`, `597883` bytes)
   - `ACTIVE/delivery/w6_launch/cehp_launch_trailer_poster.png` (`1920x1080`, `182743` bytes)

### What Codex actually changed
- Added `ACTIVE/game/scripts/verify_live_domain.mjs` so the post-flip smoke check is one command instead of a manual click tour.
- Added `ACTIVE/game/scripts/package_launch_trailer.py` plus `package_launch_trailer.sh` so the W6 trailer can be rebuilt without tracking helper video dependencies in the repo.
- Wrote the W6 launch docs:
  - `ACTIVE/docs/LAUNCH_RUNBOOK_W6.md`
  - `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md`
  - `ACTIVE/docs/ROLLBACK_REHEARSAL_W6.md`
- Wrote the outward-facing prep docs:
  - `ACTIVE/marketing/cr_pitch_v1/SEND_READY_PACKET.md`
  - `ACTIVE/delivery/w6_launch/TRAILER_UPLOAD_DESCRIPTOR.md`
  - `ACTIVE/delivery/w6_launch/README.md`
- Updated the active beacon + project memory so W6 now records the four completed non-gated DoD items:
  - trailer packaged
  - CR packet staged
  - runbook + incident log in place
  - rollback rehearsal documented

### External state observed during rehearsal
- `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/` returns `HTTP 200` and remains the verified public fallback URL.
- `counterfeit-educational.org` does not resolve yet.
- `www.counterfeit-educational.org` does not resolve yet.
- This CEHP workspace has no `.git` directory, so a scratch-branch Pages rollback drill could not be performed here. DNS revert and legacy-URL fallback were rehearsed and documented instead.

### What happens next
1. Kevin flips DNS tonight after copying the current registrar values into a rollback note.
2. Codex immediately runs:
   - `cd ACTIVE/game && CEHP_BASE_URL=https://counterfeit-educational.org node scripts/verify_live_domain.mjs`
   - `cd ACTIVE/discord && node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal`
3. If both are green, Kevin can decide when to:
   - send the CR pitch
   - publish the trailer
   - post the public announce thread

## What Was Just Done (2026-04-20 — Bedtime Sprint W5 -> W6 Prep · Green)

Codex used the overnight window to advance safe launch-week prep only. No Kevin-gated action was taken. No save-schema change, new world, new enemy, fragment-weight tweak, or DNS/public-post action was introduced.

### What is green right now
1. `cd ACTIVE/game && node build.js` — builds **32 modules** into the shipped single-file `index.html` (`248475` bytes from build output; `248537` bytes on disk).
2. `cd ACTIVE/game && node scripts/check_save_schema.js` — passes with save contract intact.
3. `cd ACTIVE/game && bash scripts/verify-cehp.sh` — passes, now including the keyboard-only accessibility settings test.
4. `cd ACTIVE/discord && node --test tests/bot_hardening.test.mjs` — **5/5 pass**.
5. `cd ACTIVE/discord && node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` — writes `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png`.

### What Codex actually changed
- Wrote `ACTIVE/docs/APPEALS_MECHANIC.md` to document the already-shipped appeals seam:
  - recorder payload shape
  - `compare()` output
  - receipt-scene hook-up
  - clear functional-vs-stubbed split
  - explicit deferral of the public-facing completion call to W6 / Kevin taste
- Wrote launch-facing docs Kevin can use in the morning:
  - `ACTIVE/marketing/cr_pitch_v1/DESIGN_BRIEF.md`
  - `ACTIVE/delivery/w5_demo/TRAILER_EDIT_BRIEF.md`
  - `ACTIVE/docs/LAUNCH_GO_NOGO.md`
  - `ACTIVE/docs/PERF_AUDIT_W5.md`
  - `ACTIVE/docs/A11Y_STATUS.md`
  - `ACTIVE/docs/MORNING_BRIEF.md`
- Replaced `ACTIVE/docs/PROPOSED_NEXT_TASK.md` with a W6 launch-week beacon draft (`CEHP-REBUILD-W6-LAUNCH`) for Kevin to promote after signoff.
- Fixed the plain-HTML `?settings=1` escape hatch so all 5 visible toggles now affect runtime behavior:
  - `biggerCoyote` -> larger coyote window
  - `slowerGame` -> reduced scene/physics time scale
  - `reduceShake` -> gentler camera follow
  - `reduceFlash` -> reduced death-stamp / overlay intensity
  - `reduceParticles` -> suppressed ember particle-like fill
- Added `ACTIVE/game/tests/cehp_accessibility_settings.mjs` and folded it into `ACTIVE/game/scripts/verify-cehp.sh`.
- Hardened `ACTIVE/discord/bot.js` without changing its public command surface:
  - missing-argument rejection
  - bad-seed rejection
  - output-path validation (must stay inside repo root)
  - import-safe module guard for testing
  - clearer disk-write failure errors
  - thermal CLI default output now includes `-thermal.png`
- Added `ACTIVE/discord/tests/bot_hardening.test.mjs` with one test per hardening point.

### Perf audit result
- Cold boot average: DOMContentLoaded `140.53ms`, first Phaser frame `158.83ms`
- First receipt render average: `12.67ms`
- 120-second W1 FPS sample: average `77.42`, min `60.00`, max `85.10`
- Obvious W6 perf win if Kevin wants one: skip/lazy-load Phaser on `?settings=1` and `?docket=1` so the HTML-only routes do not pay the game bootstrap cost.

### Reviewer / Kevin morning focus
1. Read `ACTIVE/docs/MORNING_BRIEF.md` first.
2. Check `ACTIVE/docs/APPEALS_MECHANIC.md` and decide whether the public-facing appeals contract should stay deferred until W6.
3. Review:
   - `ACTIVE/marketing/cr_pitch_v1/DESIGN_BRIEF.md`
   - `ACTIVE/delivery/w5_demo/TRAILER_EDIT_BRIEF.md`
   - `ACTIVE/docs/LAUNCH_GO_NOGO.md`
   - `ACTIVE/docs/PERF_AUDIT_W5.md`
   - `ACTIVE/docs/A11Y_STATUS.md`
4. If the overnight docs look right, promote `ACTIVE/docs/PROPOSED_NEXT_TASK.md` into `ACTIVE/docs/NEXT_TASK.md` for W6.

### No blocker
- No bedtime sprint blocker was hit.

## What Was Just Done (2026-04-20 — Week 5 Builder Pass Implemented · Review Ready)

Codex completed the Week 5 Builder slice locally. Thermal receipts, THE DOCKET, launch-prep artifacts, trailer capture tooling, CR deck assets, W1 silhouette variation, and the end-of-week delivery bundle are in place without changing gameplay scoring, fragment weights, or the save contract.

### What is green right now
1. `cd ACTIVE/game && node build.js` — builds **32 modules** into the shipped single-file `index.html` (`245962` bytes from build output; `7141` lines / `246024` bytes on disk).
2. `cd ACTIVE/game && node scripts/check_save_schema.js` — passes, including thermal parity and docket-storage coverage without mutating `cactusEd_save_v1` or `cactusEd_save_v2`.
3. `cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs` — **7/7 pass**.
4. `cd ACTIVE/game && node tests/cehp_rebuild_smoke.mjs` — passes, including `?docket=1&thermal=1`.
5. `cd ACTIVE/game && node tests/cehp_rebuild_case_runs.mjs` — passes, including thermal parity and docket-ingest coverage.
6. `cd ACTIVE/game && bash scripts/verify-cehp.sh` — full end-to-end suite passes.
7. `cd ACTIVE/discord && node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` — writes `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png`.

### What Codex actually changed
- `ACTIVE/game/src/80_receipts.js` now exposes receipt-card model/theme helpers so thermal presentation stays separate from fragment selection and scoring.
- `ACTIVE/game/src/83_receipt_render.js` is the new shared canvas renderer used by Phaser receipts, docket thumbnails, and Discord PNG output.
- `ACTIVE/game/src/81_docket.js` is now live: UTC ISO-week math, deterministic weekly seed via `ns.makeRNG((isoWeek * 1000) + year)`, local archive persistence under `cactusEd_docket_week_v1`, and a read-only HTML archive surface at `?docket=1`.
- `ACTIVE/game/src/91_scenes.js` now routes receipt rendering through the shared canvas path, respects `?thermal=1`, and records docket receipts only when the run seed matches the current docket seed.
- `ACTIVE/game/src/99_boot.js` and `ACTIVE/game/index.template.html` now mount the docket surface before Phaser boot, parallel to the existing settings hatch.
- `ACTIVE/discord/bot.js` now supports `--thermal` and uses the shared receipt renderer rather than a duplicated draw path.
- `ACTIVE/game/src/74_world_orientation_runtime.js` now ships three deterministic decorative silhouette variants in World 1 without changing save/gameplay behavior.
- `ACTIVE/game/scripts/capture_trailer.mjs` captures deterministic frame sequences for:
  - `CASE-20260429-001-BOOT-R1` / `orientation`
  - `CASE-20260506-001-BEN-R1` / `benefits`
  - `CASE-20260504-001-GRACE-R2` / `rasta`
- `ACTIVE/game/scripts/generate_w5_assets.mjs` produces `ACTIVE/marketing/cr_pitch_v1/` plus the `ACTIVE/delivery/w5_demo/` bundle.
- `ACTIVE/game/CNAME` and `ACTIVE/docs/DNS_CUTOVER.md` cover domain cutover prep. `.github/workflows/static.yml` was verified to already serve `ACTIVE/game` as the Pages root, so it was intentionally left unchanged.

### Artifact locations to hand Kevin / reviewer
- Thermal Discord proof:
  - `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png`
- CR pitch assets:
  - `ACTIVE/marketing/cr_pitch_v1/`
- Delivery bundle:
  - `ACTIVE/delivery/w5_demo/`
- Key bundle files:
  - `ACTIVE/delivery/w5_demo/README.md`
  - `ACTIVE/delivery/w5_demo/DNS_CUTOVER.md`
  - `ACTIVE/delivery/w5_demo/docket_archive_snapshot.png`
  - `ACTIVE/delivery/w5_demo/receipts/*.png`
  - `ACTIVE/delivery/w5_demo/trailer_frames/manifest.json`
  - `ACTIVE/delivery/w5_demo/index.html`

### Reviewer focus
1. Thermal determinism: normal vs thermal must preserve identical receipt lines and fragment IDs.
2. Docket determinism: UTC ISO week/year math, `ns.makeRNG((isoWeek * 1000) + year)`, read-only archive tone, and zero gameplay mutation.
3. Bundle completeness: `ACTIVE/delivery/w5_demo/` should be sufficient for a press-contact handoff without further local assembly.
4. W1 silhouette pass: decorative only, no save-schema or routing regressions.
5. Sacred constraints: ES5 in runtime modules, zero `Math.random()`, no save contract drift, no new enemies/mechanics.

### What should happen next
1. Claude Opus 4.7 reviews the Week 5 slice with focus on thermal, docket, capture scripts, and delivery artifacts.
2. Kevin eyeballs the thermal receipt trio + docket snapshot in `ACTIVE/delivery/w5_demo/`.
3. If both are green, flip the task beacon to Week 6 launch prep (final trailer edit, DNS flip, CR outreach).

## What Was Just Done (2026-04-20 — Kevin Signoff on Week 4 + Week 5 Activation)

Kevin signed off Week 4 on 2026-04-20 — *"IT ALL LOOKS AND SOUNDS SO GOOD! GREEN LIGHT! APPROVED! SALUTE! LFG!"* — ratifying all 5 Week 4 taste notes from the Claude Opus 4.7 reviewer pass. Task beacon flipped to `CEHP-REBUILD-W5` (Polish / Thermal / Docket / Domain / Trailer / CR Deck v1). Codex owns Week 5 with `TASK_OWNER_ROLE = Builder (Codex 5.4)`, deadline 2026-05-25 (4 days before 2026-05-29 launch).

### Ratified 2026-04-20 (Week 4 taste notes)
1. **Moving-platform soft carry** is intentional — Synchronicity platforms stay gentle; no retune.
2. **W3 quiet density** is intentional — rooms stay sparser than W1/W2; no accent-fragment additions.
3. **Debug-vs-live impatient divergence** accepted — live impatient player cannot reach goal without resting; debug case-run simulates impatient completion for receipt-divergence coverage. This is now canon.
4. **Goal-gating thematic elegance** canon — impatient players physically learn the gate's lesson mid-run. Ratified as a signature W3 design choice.
5. **Rest/rush flag precedence via weighted scoring** accepted — live player who rushes then rests gets the reconciled-path receipt (REST bucket weights 3.4/3.4 beat RUSH bucket 3.3/3.1). No explicit precedence rule added.

### Docs moved
- `ACTIVE/docs/NEXT_TASK.md` → `CEHP-REBUILD-W5` (full rewrite)
- `ACTIVE/docs/BACKLOG.md` → W5 in Now, W6 in Next, W4 moved to Done
- `.codex/CEHP/status.md` → current objective = Week 5 polish/thermal/docket/domain/trailer/CR
- `.codex/CEHP/changelog.md` → W4 Kevin signoff + W5 activation entries prepended

### Codex Week 5 activation packet
Delivered to Kevin in fresh-paste format (per `memory/feedback_codex_handoff_format.md`). Reference copy below.

```json
{
  "task_id": "CEHP-REBUILD-W5",
  "title": "Rebuild Week 5 — Polish, Thermal Mode, THE DOCKET, Domain Cutover Prep, Trailer Rough, CR Deck v1",
  "role": "Builder (Codex 5.4)",
  "deadline": "2026-05-25",
  "authoritative_docs": [
    "ACTIVE/docs/NEXT_TASK.md",
    "ACTIVE/docs/FINAL_GAMEPLAN.md (25 rulings — receipt/docket/launch sections)",
    ".codex/CEHP/handoff.md (STOP at '## Previous Major Work (2026-03-21 — Corrupted Broadcast)' heading; everything below is pre-rebuild 19,835-line legacy runtime at ARCHIVE/legacy_runtime_v1/index.html and MUST NOT be re-implemented)",
    ".codex/CEHP/status.md"
  ],
  "in_scope": [
    "Thermal mode (?thermal=1) rendering in 80_receipts.js + discord bot.js --thermal",
    "81_docket.js NEW module: deterministic weekly seed via ns.makeRNG((isoWeek*1000)+year); ?docket=1 archive page",
    "Domain cutover prep: CNAME + .github/workflows/static.yml path + DNS_CUTOVER.md checklist (NO DNS FLIP)",
    "Trailer capture: ACTIVE/game/scripts/capture_trailer.mjs for 3 seeded 5-min runs",
    "CR pitch deck v1 assets: Steam capsule 460x215 + header 616x353 + poster 1920x1080 + 6 screenshots + 3 receipt PNGs (normal+thermal)",
    "W1 silhouette variation (>=3 distinct applicant silhouettes)",
    "Save schema launch freeze with thermal+docket round-trip coverage"
  ],
  "out_of_scope": [
    "Final trailer edit w/ music (Kevin + editor own in W6)",
    "Registrar DNS flip (Kevin owns)",
    "CR pitch email send (Kevin owns)",
    "Any new world/enemy/mechanic",
    "Any change to 6 visible axes / 30 micro / 3 tension weights",
    "Steam build packaging (post-launch)",
    "Monetization, analytics, telemetry"
  ],
  "sacred_constraints": [
    "Single-file shipped index.html (source stays modular)",
    "ES5 only — 4 weeks zero violations across 31 modules",
    "Phaser 3 via CDN — no bundler",
    "cactusEd_save_v1 contract preserved via v2 migration + archaeological layer",
    "Seeded LCG RNG only (ns.makeRNG) — never Math.random",
    "Ed voice: deadpan, <=8 words, no exclamation marks",
    "Cigarette stays unlit in all W3 paths (40_fx.js:70 flag sacred)",
    "ns.TUNING.JUMP_VELOCITY global never mutated (use run-scoped ed.jumpVelocity seam)",
    "No predatory retention; docket is archive not leaderboard"
  ],
  "do_not_touch": [
    "ARCHIVE/legacy_runtime_v1/** (entire 19,835-line pre-rebuild runtime)",
    "Anything below '## Previous Major Work (2026-03-21 — Corrupted Broadcast)' heading in .codex/CEHP/handoff.md (IS_WEBGL, SMOKE_POOL, MOOD_VISUALS, BEHAVIOR_FX, ED_MOVE, Corrupted Broadcast)",
    "Fragment weights on W1/W2/W3 receipts without explicit taste note",
    "60_enemies.js imports outside W2/W3 runtimes",
    "ns.TUNING.JUMP_VELOCITY global",
    "6 visible axes / ~30 micro-signals / 3 tension weights"
  ],
  "current_state_anchors": {
    "build_output": "ACTIVE/game/index.html = 6,424 lines / 222,037 bytes (31 modules, 221,979-byte build)",
    "verify_command": "cd ACTIVE/game && bash scripts/verify-cehp.sh",
    "schema_command": "cd ACTIVE/game && node scripts/check_save_schema.js",
    "discord_render": "cd ACTIVE/discord && node bot.js --render <CASE-SEED> --world <orientation|benefits|rasta>",
    "last_reference_seed": "CASE-20260504-001-GRACE-R2 (W3 ambient/impatient ratified)",
    "module_count_target_after_w5": 32
  },
  "kickoff": "Start with the thermal-mode seam in 80_receipts.js; once Kevin eyeballs a thermal PNG for 2-color feel, move to 81_docket.js, then domain prep, then trailer capture, then CR deck assets, then W1 silhouettes, then save-schema launch freeze."
}
```

## What Was Just Done (2026-04-20 — Week 4 Rasta Corp Logistics Hub Slice Implemented · Review Ready)

Codex completed the Week 4 Builder pass locally. World 3 is now playable behind `?world=rasta`, the cigarette remains unlit, sorting machines stay helper-only, and same-seed ambient/impatient scripts now diverge on tragic World-3-flavored receipts.

### What is green right now
1. `cd ACTIVE/game && node build.js` — builds **31 modules** into the shipped single-file `index.html` (`221979` bytes from build output; `6424` lines / `222037` bytes on disk).
2. `cd ACTIVE/game && bash scripts/verify-cehp.sh` — save contract, logic tests, browser smoke, and benefits + rasta case-runs all pass.
3. `cd ACTIVE/discord && node bot.js --render CASE-20260504-001-GRACE-R2 --world rasta` — writes `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2.png`.

### What Codex actually changed
- Added `ACTIVE/game/src/76_world_rasta_runtime.js` as the Week 4 runtime module: six authored rooms, deterministic Synchronicity platforms, a live `REST HERE.` contradiction gate, polite sorting-machine redirects, and deterministic `ambient` / `impatient` debug routes.
- Extended `ACTIVE/game/src/73_world_rasta.js` with six room manifests while preserving the original World 3 palette, world flags, three signs, and three authored closer fragments.
- Expanded `ACTIVE/game/src/80_receipts.js` with 20 Rasta-specific fragments (`VERDICT_RASTA_*`, `TENSION_RASTA_*`, `CLOSER_RASTA_*`) keyed off `restOpened`, `rushedRest`, and `cigaretteLit:false`.
- Updated `ACTIVE/game/src/91_scenes.js` so query precedence is now `?room=test` first, then `?world=rasta`, then `?world=benefits`, then Orientation/default; existing fallbacks remain intact.
- Extended `ACTIVE/game/tests/cehp_rebuild_case_runs.mjs` so Week 4 now proves:
  - same-seed ambient parity
  - same-seed ambient vs impatient receipt divergence
  - stable Rasta room order
  - unlit-cigarette receipt context
  - `restOpened` / `rushedRest` flags
  - sorting redirects and rush rebounds

### Week 4 seed artifact to show Kevin
- seed: `CASE-20260504-001-GRACE-R2`
- ambient receipt:
  - `THE FILE UNDERSTOOD.`
  - `PATIENCE MADE SPACE FOR YOU.`
  - `YOU WERE MET WITHOUT FIRE.`
- impatient receipt:
  - `THE ROOM PUSHED SOFTLY BACK.`
  - `URGENCY CAME HOME UNHELD.`
  - `YOU WERE TURNED, NOT JUDGED.`
- PNG:
  - `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2.png`

### Reviewer focus
1. Synchronicity determinism: phase derivation is `ns.makeRNG(caseSeed + '|rasta|sync')` only. No `Math.random()`.
2. Tone: tragic not cynical. New signage and receipt pools should read warm and quiet, not clever.
3. `REST HERE.` gate: live play should satisfy rest=exit and rush=rebound; debug harness should keep ambient/impatient deterministic.
4. Sorting machines: redirect-only, no damage, no `hit` events, no import from `60_enemies.js`.
5. Cigarette: remains unlit everywhere in World 3 and receipt generation sees `cigaretteLit:false`.

### What should happen next
1. Claude Opus 4.7 reviews Week 4 using `76_world_rasta_runtime.js`, `73_world_rasta.js`, `80_receipts.js`, `91_scenes.js`, and `tests/cehp_rebuild_case_runs.mjs`.
2. Kevin reviews the Week 4 seed + PNG for tragic-not-cynical tone and does the Rasta audio ear-check.
3. If both are green, move to Week 5 polish/domain/trailer work.

## What Was Just Done (2026-04-20 — Week 3 Kevin Signoff + Week 4 Activation)

Kevin signed off Week 3 on 2026-04-20 — *"This is Kevin - I sign-off, green light, LFG"* — ratifying all 5 taste notes from the reviewer pass. Task beacon flipped to `CEHP-REBUILD-W4` (World 3 Rasta Corp Logistics Hub). Codex owns Week 4 with `TASK_OWNER_ROLE = Builder (Codex 5.4)`, deadline 2026-05-18.

### Ratified 2026-04-20
1. Enemy punishment is readable-moderate (Scantron + uninsured lane + deductible) — no tightening required for launch
2. Deductible cap stays at `+48` (jump floor `-292` vs base `-340`)
3. Pizza Party keeps vision occlusion (input-lag alternative rejected)
4. Jump mutation affects base + wall-jump only; double/triple jumps stay on `ns.TUNING` constants
5. Benefits audio palette override (thinner/brighter HVAC, 60 BPM) lands correctly

### Docs moved
- `ACTIVE/docs/NEXT_TASK.md` → `CEHP-REBUILD-W4` (full rewrite)
- `ACTIVE/docs/BACKLOG.md` → W4 in Now, W5 in Next, W1/W2/W3 moved to Done
- `.codex/CEHP/status.md` → current objective = Week 4 Rasta Corp
- `.codex/CEHP/changelog.md` → Week 3 signoff + Week 4 activation entries prepended

### Codex Week 4 activation packet
Delivered to Kevin in fresh-paste format (per `memory/feedback_codex_handoff_format.md`). Reference copy below.

```json
{
  "task_id": "CEHP-REBUILD-W4",
  "title": "Rebuild Week 4 — World 3 Rasta Corp Logistics Hub (5-minute sincerity-zone vertical slice)",
  "role": "Builder (Codex 5.4)",
  "deadline": "2026-05-18",
  "authoritative_docs": [
    "ACTIVE/docs/NEXT_TASK.md",
    "ACTIVE/docs/FINAL_GAMEPLAN.md (lines 199-209 = World 3 spec)",
    ".codex/CEHP/handoff.md (stop at the '## Previous Major Work (2026-03-21 — Corrupted Broadcast)' heading)",
    ".codex/CEHP/status.md"
  ],
  "starting_state": {
    "build": "30 modules -> ACTIVE/game/index.html (188784 bytes / 5524 lines)",
    "default_boot": "World 1 Orientation Bureau; ?world=benefits reaches Week 3 slice; ?room=test still reaches Week 1 reference room",
    "schema": "save v2 + archaeological v1 passing",
    "verification": "verify-cehp.sh 5/5 logic + smoke + insured/uninsured case-runs all green",
    "rasta_manifest_stub": "ACTIVE/game/src/73_world_rasta.js declares palette, tempoBpm:72, cigaretteWillNotLight:true, disableChromaticAberration:true, minimalCRTRoll:true, removeNoiseLayer:true, 3 signs, 3 closer fragments — extend, don't replace",
    "rasta_audio_branch": "ACTIVE/game/src/30_audio.js lines 170/180/186 already handle worldId='rasta' (filter 420Hz, noise gain 0, 72 BPM) — no new audio module code required",
    "cigarette_wiring": "ACTIVE/game/src/40_fx.js:70 already respects runState.worldFlags.cigaretteWillNotLight; cigarette renders unlit in rasta automatically",
    "rasta_receipt_seed": "ACTIVE/game/src/80_receipts.js:447 has one closer group tagged worlds:{rasta:3.0} with flags:{cigaretteLit:false}; extend pool with verdict+tension+more closer Rasta fragments",
    "receipt_flag_scoring": "ACTIVE/game/src/80_receipts.js:641-650 generic flag scorer; cigaretteLit special-cased +1.5 at line 645"
  },
  "scope": {
    "runtime_module": "Create ACTIVE/game/src/76_world_rasta_runtime.js following the 75_world_benefits_runtime.js pattern (752 lines, 6 rooms, primitives, debug runStyle). 5-6 authored rooms.",
    "synchronicity": "Platforms with positions derived from scene.time + seeded phase offset. Pure deterministic sine/cosine/triangle. NO Math.random. Grace and intuition micro-signals accrue passively when Ed flows on-beat.",
    "rest_here_gate": "Signature contradiction gate: a sign says REST HERE. Resting (no input ~800ms on a designated sensor zone) opens the exit. Rushing past sends Ed gently backward. Both branches tagged for receipt divergence.",
    "polite_sorting_machines": "Props in the runtime module, NOT enemies. Contact redirects Ed's velocity (gentle nudge, no damage, no hit emit). Do NOT import from 60_enemies.js.",
    "receipts": "Add >=15 Rasta-tagged fragments to 80_receipts.js across VERDICT_RASTA, TENSION_RASTA, CLOSER_RASTA with worlds:{rasta:2.7-3.4}. Use flags:{cigaretteLit:false} for +1.5 scoring bonus on sincerity-leaning fragments. Retain the 3 authored manifest closers. Tone: tragic not cynical. Max 8 words. No exclamation marks.",
    "routing": "Extend 91_scenes.js requestedWorld (line 52-58) + runtimeFor (line 60-64) to accept ?world=rasta and dispatch to ns.WorldRasta. Preserve all existing fallbacks. Default boot stays Orientation.",
    "tests": "Extend tests/cehp_rebuild_case_runs.mjs with two same-seed rasta runs: (1) ambient (flows, rests, arrives warmly) (2) impatient (rushes, ignores REST, bounces off sorting machines). Both must produce different tragic-flavored receipts on the same seed.",
    "discord_artifact": "Render one Week 4 seed PNG. Suggested seed: CASE-20260504-001-GRACE-R2."
  },
  "out_of_scope": [
    "thermal mode, docket, trailer, domain cutover (Week 5)",
    "Critical Reflex deck (Week 6)",
    "Any retroactive W1/W2 polish — silhouette variation, punishment re-tuning (Week 5 polish)",
    "Music layer authoring beyond what 30_audio.js already exposes for rasta",
    "Any change to 60_enemies.js — World 3 has no enemies"
  ],
  "sacred_constraints": [
    "Single HTML file shipped artifact (built from src/*.js by build.js)",
    "ES5 only — no let/const/arrow/template-literal. Weeks 1-3 held zero violations; keep it.",
    "Phaser 3 via CDN (no npm install, no bundler for the game)",
    "Save v2 + archaeological v1 layer preserved",
    "Behavioral axes invisible during play — receipts are the sole reveal",
    "Seeded LCG RNG only — including Synchronicity phase offsets (derive from runState.caseSeed)",
    "Ed voice: deadpan, max 8 words per line, NO exclamation marks. World 3 must read TRAGIC, not CYNICAL.",
    "No predatory retention — doubly relevant in the sincerity zone",
    "The cigarette will not light here — 40_fx.js flag is sacred, do not re-ignite in any W4 path"
  ],
  "tone_requirements": [
    "Tragic not cynical. W3 is the contrast to W1-W2's satire.",
    "No satire of sincerity itself. Rasta Corp genuinely cares.",
    "Warmth over wit. If a receipt line makes you smile, rewrite it until it makes you quiet.",
    "Sorting-machine signage is polite: 'PLEASE REST IF YOU NEED TO.' not 'RESTING IS NOT AUTHORIZED.'",
    "Receipt exemplar: 'THE FILE UNDERSTOOD.' (tragic) vs 'THE FILE ACCEPTED YOU.' (cynical)"
  ],
  "definition_of_done": [
    "World 3 reaches a 5-minute run end-to-end via ?world=rasta",
    "Synchronicity mechanic implemented with deterministic phase derivation (seeded, no Math.random)",
    "REST HERE contradiction gate reachable; rest=exit and rush=rebound both fire",
    "Polite sorting machines present in >=2 rooms; redirect-only, no damage, no hit emit",
    "Zero imports from 60_enemies.js in 76_world_rasta_runtime.js",
    "Cigarette remains unlit throughout World 3; rasta receipts get flags.cigaretteLit:false scoring bonus",
    "Same seed + ambient vs impatient behavior = visibly different tragic receipts",
    "At least 2 of 3 receipt lines are World-3-flavored on most seeds",
    "Audio switches to Rasta palette automatically (already wired)",
    "verify-cehp.sh passes end-to-end",
    "Discord sidecar renders a Week 4 seed PNG",
    "One seed + Discord PNG delivered to Kevin as milestone artifact"
  ],
  "check_in_cadence": {
    "autonomy": "moderate",
    "first_seed": "once first Synchronicity room + REST HERE gate are playable",
    "mid_week": "all 5-6 rooms traversable with sorting machines present",
    "end_of_week": "full 5-min slice + Discord PNG + end-of-week review by Claude Opus 4.7",
    "escalation_triggers": [
      "any sacred constraint under threat",
      "tone drift toward irony/snark — stop and ping Kevin",
      "any proposal to add enemies to World 3 — hard no",
      "more than 1 day behind Week-4 DoD",
      "Critical Reflex response inbound"
    ]
  },
  "reviewer_handoff": {
    "reviewer": "Claude Opus 4.7",
    "focus": [
      "Synchronicity determinism (seeded RNG + scene time, no Math.random)",
      "Tone audit — tragic not cynical; receipts warm not snarky",
      "REST HERE gate behavior (rest=exit, rush=rebound)",
      "Sorting machines redirect only",
      "Cigarette stays unlit everywhere in World 3",
      "Rasta receipt fragment count and flavor; cigaretteLit:false scoring",
      "Sacred-constraint regression across 31+ modules"
    ]
  }
}
```

---

## What Was Just Done (2026-04-20 — Week 3 Reviewer Pass · Claude Opus 4.7)

Claude Opus 4.7 completed the end-of-Week-3 review against Codex's Benefits Enrollment Atrium slice. No blockers. Codex's 3 self-flagged taste notes stand + 2 reviewer-surfaced notes added for Kevin.

### Review verdict: GREEN for Week 3 DoD

- **Build**: `node build.js` → 30 modules, 188,784-byte / 5,524-line single-file `index.html`. Clean (+42,502 bytes vs Week 2).
- **Schema**: `check_save_schema.js` passes — v2 + archaeological v1 still intact; no fields touched by benefits work.
- **Verification suite** (`verify-cehp.sh`): logic (5/5, up from 4/4 — new `receipts score generic world flags` test added) + browser smoke + insured/uninsured case-runs all pass.
- **Discord sidecar**: Week 3 seed render on disk at `ACTIVE/discord/output/CASE-20260427-001-COMPLIANCE-R2.png` (122,713 bytes).
- **Shipped-HTML integration**: 13 World-2 marker hits in `index.html` (ns.WorldBenefits, 75_WORLD_BENEFITS_RUNTIME, 6 room ids, BENEFITS PROCESSED closer).

### Week 3 DoD scorecard

| DoD item | Status | Evidence |
|---|---|---|
| World 2 has boot path + reaches 5-min run | ✓ | `91_scenes.js:52-64` routing → `WorldBenefits.create`; 6 rooms built (1280px each × 6 = 7680px atrium) |
| All 3 enemy types implemented + behaviorally distinct | ✓ | `60_enemies.js`: Scantron (teleport-to-block), Pizza (heal + vision occlusion), Deductible (jump-velocity shrink) |
| Premium Pathways gates branching outcomes per room | ✓ | `75_world_benefits_runtime.js:229-293` — pathwayGate with unlock/commitLower/markSafe; UNINSURED VETERAN closer pool present (`CLOSER_BENEFITS_UNINSURED`, 5 fragments) |
| Deductible mutation observable + hard-capped | ✓ | `setJumpPenalty` clamps `[0, 48]`; `player.jumpVelocity` clamped `[-340, -292]`; test asserts ≤48 on both branches |
| Same seed + different behavior = different receipts | ✓ | insured: `THE UPPER PLAN NOTICED YOUR PAYMENTS. \| THE SAFER HALLWAY CHARGED IN ADVANCE. \| PAYMENT PURCHASED A SOFTER FLOOR.` vs uninsured: `THE ATRIUM SAVED MONEY ON YOUR FALL. \| YOUR RISK PROFILE NEEDED LESS PROTECTION. \| YOUR FILE REQUIRED CHEAPER ASSUMPTIONS.` |
| ≥2/3 receipt lines World-2-flavored | ✓ exceeds | 3/3 benefits-tagged on BOTH test runs |
| verify-cehp.sh passes | ✓ | 5/5 logic + smoke + case-runs green |
| Discord sidecar renders Week 3 seed | ✓ | 122KB PNG on disk |
| Kevin receives seed + PNG | pending | awaiting Kevin taste + audio ear-check |
| Claude Opus 4.7 reviewer pass | ✓ | this section |

### Benefits-receipt coupling audit

- **60 benefits-tagged fragments** across 9 groups (spec asked for ≥10, Codex delivered 6×):
  - `VERDICT_BENEFITS` (10 × 3.0), `VERDICT_BENEFITS_SECURED` (5 × 3.4 + flag), `VERDICT_BENEFITS_UNINSURED` (5 × 3.4 + flag)
  - `TENSION_BENEFITS` (10 × 2.9), `TENSION_BENEFITS_SECURED` (5 × 3.3 + flag), `TENSION_BENEFITS_UNINSURED` (5 × 3.3 + flag)
  - `CLOSER_BENEFITS` (10 × 2.5), `CLOSER_BENEFITS_SECURED` (5 × 3.4 + flag), `CLOSER_BENEFITS_UNINSURED` (5 × 3.4 + flag)
- Authored closer "BENEFITS PROCESSED. YOU OWE NINE DOLLARS AND A YEAR." flows into the pool via `worldClosers('benefits')` pulling `manifest.closerFragments`.
- **New generic flag-scoring seam** (`80_receipts.js:641-650`): any `fragment.flags[key]` matched against `context.flags[key]` adds +1.8; `cigaretteLit` special-cased to +1.5. This is a clean declarative extension — same shape as the axes/tensions/micro/worlds scoring. World 3 cigarette scoring already hooked in for free.

### Runtime module review (`75_world_benefits_runtime.js`, 752 lines)

- 6 room builders (`buildEnrollment/Pathways/Network/Deductible/Wellness/Final`) share a clean primitive set (`makeRoom`, `addPlatform`, `addBackdrop`, `makePremium`, `makeHazard`, `addEnemy`, `pathwayGate`) — same architectural shape as `74_world_orientation_runtime.js`, not a copy-paste.
- **Gate mechanics**: `pathwayGate` composes a destroyable upper door + two sensor zones (lower = commit uninsured, upper-clear = mark safe). `updateGate` runs three transitions per tick: unlock-by-premium-count, commit-lower, mark-safe. All three fire `ns.Events.emit(...)` → axes system stays declarative.
- **Deductible mutation**: `setJumpPenalty` updates `world.stats.jumpPenalty` AND `player.jumpVelocity` in one place; `21_movement.js` reads `ed.jumpVelocity` via the new `baseJumpVelocity(ed)` seam — `ns.TUNING.JUMP_VELOCITY` global is never mutated.
- **Seeded enemy RNG**: `world.enemyRng = ns.makeRNG(runState.caseSeed + '|benefits|enemies')` passed into Scantron via `opts.rng`. Scantron uses `rng.int(0, points.length)` only. Zero `Math.random()` in enemies or runtime.
- **Debug harness (`runStyle`)**: cached short-circuit (lines 588-599) matches the Week 2 pattern; `resetDebug` properly re-seeds `world.enemyRng`, resets all gates/premiums, and calls `setJumpPenalty(world, 0)`. Deep-cloned returns, no live state leaks.
- **Lifecycle**: `destroy(world)` tears down enemies/premiums/hazards on scene shutdown. Handled in `91_scenes.js` via `runtimeFor(worldId).destroy(room)` on shutdown listener.

### Enemy AI review (`60_enemies.js`)

| Type | Behavior | Determinism | Non-stacking contract |
|---|---|---|---|
| Actuarial Scantron | Teleports to next point when player falling + overhead + within 170px lateral | `rng.int` from seeded RNG; prevents same-point teleport via `(next + 1) % length` when points.length > 1 | 720ms cooldown |
| Pizza Party slice | Collision consumes slice; applies heal (-16 jumpPenalty) + 2800ms vision occlusion | Position is `Math.sin((time * 0.004) + phase)` — pure deterministic sine | Single-pickup via `enemy.destroy()` |
| Deductible weight | Sine-wave patrol (`time * speed + phase`); contact adds +16 jumpPenalty + invuln 420ms + hit emit | Pure deterministic sine; 650ms contact cooldown | Jump shrink stops at cap 48 |

All three enemies share `sharedEnemy` factory with idempotent `destroy()` (`if (this.dead) return`). Label + rect cleanup in one call.

### Routing + boot-safety audit (`91_scenes.js:52-64`, `99-142`)

Query precedence (`requestedWorld`): `?room=test` wins first → `?world=benefits` second → default Orientation. Both regression paths still reach their scenes:
- `?room=test` → `ns.TestRoom.create` (Week 1 reference room preserved)
- `?world=orientation` → `ns.WorldOrientation.create` (Week 2 slice preserved, still the default boot)
- `?world=benefits` → `ns.WorldBenefits.create` (Week 3 new target)

`runtimeFor(worldId)` null-returns on unknown worlds, which falls through to `ns.TestRoom.create` (line 140-142). Safe.

### `build.js` $-hardening verification

The premium stamp label uses a literal `$` glyph (`75_world_benefits_runtime.js:166`). Before the fix, passing the bundle as a string to `.replace(regex, string)` would have triggered `$'`, `$&`, `$N` substitutions in the replacement text and corrupted the shipped HTML. Codex switched to a function replacer (`function(){ return block; }`) which returns the string verbatim. Verified by inspection: `build.js:22`. Clean fix, minimum surface area.

### Sacred-constraint regression (30 modules)

- **ES5-only**: `src/*.js` grep for `(let|const)\s+\w+\s*=` + `=>` + `` `...${ `` returns zero matches across all 30 modules.
- **Seeded RNG only**: `Math.random` grep returns one hit — the "NEVER Math.random()" warning comment in `02_rng.js:3`. No actual uses.
- **Save contract**: `04_save.js` untouched; v2 + archaeological v1 still passes (`check_save_schema.js`).
- **Single-file ship**: one `index.html`, 188,784 bytes, Phaser from CDN only.
- **Invisible axes**: no HUD additions to `40_fx.js` or `90_ui.js` — occlusion overlay is an FX effect, not an axis exposure.
- **Voice audit on the 21 new sign strings + 60 new receipt fragments**:
  - Max words per sentence observed: 8 (e.g. "THE UPPER PLAN NOTICED YOUR PAYMENTS." = 7; "THE ATRIUM CHARGED EXTRA FOR MOMENTUM." = 6).
  - Zero exclamation marks across benefits manifest and benefits receipt pools.
  - Authored closer "BENEFITS PROCESSED. YOU OWE NINE DOLLARS AND A YEAR." is 2 sentences (2 words + 7 words) — Kevin-specified, on-spec.
  - Deadpan-institutional tone holds: "BILLING REACHED THE SAME CONCLUSION.", "THE NETWORK PREFERRED YOUR SILENCE.", "THE LOWER HALL BILLED YOUR BRAVERY." No cartoonish satire detected.

### Taste notes for Kevin's signoff

Codex flagged 3, I'm adding 2. All are Kevin's taste call; none are blockers.

1. **Codex #1 — Enemy punishment is intentionally readable-moderate.** Kevin should sanity-check: does Scantron denial feel threatening enough? Does the uninsured lane feel lethal enough? The slice ships survivable; Kevin has taste authority on whether to tighten.
2. **Codex #2 — Deductible cap is `+48`** (effective jump floor `-292` vs base `-340`). Rooms 4-6 still clear at max penalty during the scripted run. Kevin should confirm the max-penalty late-game feel is acceptable.
3. **Codex #3 — Pizza Party chose vision occlusion over input lag.** Reviewer agrees this is the right pick: input lag degrades the platformer feel; vision occlusion stays readable while still making the "heal" feel suspicious. Kevin's taste call to ratify.
4. **Reviewer-added — Jump mutation applies to base jump + wall-jump only.** Double/triple jumps still use `ns.TUNING.DOUBLE_JUMP` / `TRIPLE_JUMP` constants and are unaffected by the deductible penalty. Reviewer read: this is the right architectural choice — if all three tiers shrunk, late rooms become un-clearable at max penalty. Kevin should ratify.
5. **Reviewer-added — Benefits audio override direction is correct, ear-check still required.** Filter frequencies, shimmer delay, and noise gains all trend thinner/brighter for benefits vs orientation while keeping 60 BPM. Kevin's ear remains the only arbiter of whether the palette actually reads pastel-pink-institutional.

### What still needs human confirmation

1. **Audio ear-check** — still outstanding from Week 1; now includes the benefits override too.
2. **Kevin's seed taste review** — the insured/uninsured pair + the Discord PNG should match the Benefits Enrollment Atrium voice Kevin has in his head.

### Recommendation

**Sign off Week 3 as-is.** All 8 objective DoD items pass. The 5 taste notes are tuning calls for post-signoff, not rework. Route Codex to **Week 4 — World 3 Rasta Corp Logistics Hub (sincerity zone, cigarette will not light, no enemies)** as soon as Kevin greenlights. Defer punishment-tuning disputes to Week 5 polish unless Kevin wants them mid-Week-4.

---

## What Was Just Done (2026-04-20 — Week 3 Benefits Enrollment Atrium Slice Implemented, Verified, and Rendered)

Codex completed the Week 3 Builder pass locally. World 2 is now playable behind `?world=benefits`, the new enemy set is deterministic off the seeded RNG only, insured/uninsured runs on the same seed diverge in receipt text, and the Week 3 Discord PNG artifact exists on disk.

### What is green right now
1. `cd ACTIVE/game && node build.js` — builds **30 modules** into the shipped single-file `index.html` (`188784` bytes / `5524` lines).
2. `cd ACTIVE/game && bash scripts/verify-cehp.sh` — save contract, logic tests, browser smoke, and Week 3 insured/uninsured case-runs all pass.
3. `cd ACTIVE/discord && node bot.js --render CASE-20260427-001-COMPLIANCE-R2 --world benefits` — writes `ACTIVE/discord/output/CASE-20260427-001-COMPLIANCE-R2.png` (`122KB`).

### What Codex actually changed
- Added `ACTIVE/game/src/75_world_benefits_runtime.js` as the Week 3 runtime module: six authored rooms, premium-gated safer branches, uninsured lower branches, room-local premium targets, deductible jump mutation, pizza vision-occlusion debuff, seeded enemy RNG, and deterministic `insured` / `uninsured` debug routes.
- Replaced the `ACTIVE/game/src/60_enemies.js` stub with three concrete deterministic enemy types:
  - **Actuarial Scantron** — teleporting landing blocker using `ns.makeRNG(caseSeed + '|benefits|enemies')`
  - **Pizza Party slice** — one-shot pickup that removes one deductible step and applies temporary vision occlusion
  - **Deductible weight** — contact hazard that emits damage, increments deductible hits, and shrinks grounded/wall jump height up to the cap
- Extended `ACTIVE/game/src/72_world_benefits.js` with six room manifests and per-room `premiumTarget` values `[2,2,3,2,3,2]`.
- Updated `ACTIVE/game/src/21_movement.js` so grounded and wall jumps respect `ed.jumpVelocity` for run-scoped jump mutation without touching global tuning.
- Updated `ACTIVE/game/src/30_audio.js`, `40_fx.js`, and `80_receipts.js` for the benefits palette/audio, Pizza Party occlusion overlay, and benefits-specific insured/uninsured receipt weighting.
- Updated `ACTIVE/game/src/91_scenes.js` so query precedence is now `?room=test` first, then `?world=benefits`, then Orientation/default; default boot remains Orientation.
- Hardened `ACTIVE/game/build.js` so literal `$` characters survive the string replacement into the single shipped HTML artifact. This was required because the premium stamp label exposed a pre-existing `$'` replacement bug in the build step.

### Week 3 seed artifact to show Kevin
- seed: `CASE-20260427-001-COMPLIANCE-R2`
- insured receipt:
  - `THE UPPER PLAN NOTICED YOUR PAYMENTS.`
  - `THE SAFER HALLWAY CHARGED IN ADVANCE.`
  - `PAYMENT PURCHASED A SOFTER FLOOR.`
- uninsured receipt:
  - `THE ATRIUM SAVED MONEY ON YOUR FALL.`
  - `YOUR RISK PROFILE NEEDED LESS PROTECTION.`
  - `YOUR FILE REQUIRED CHEAPER ASSUMPTIONS.`
- PNG:
  - `ACTIVE/discord/output/CASE-20260427-001-COMPLIANCE-R2.png`

### Reviewer focus / taste notes
1. **Enemy punishment is intentionally readable-moderate.** Lower branches are dangerous and can kill, but the slice is not tuned for maximum cruelty yet. Kevin should sanity-check whether Scantrons or uninsured lane punish harder.
2. **Deductible cap is `+48`** (effective grounded/wall jump floor `-292`). That cap preserves late-room platformability; if Kevin wants more punishment, review whether rooms 4-6 still clear comfortably.
3. **Pizza Party chose vision occlusion, not input lag.** This keeps the platformer readable while still making the "heal" feel suspicious. Kevin should confirm that this lands tonally.

### Recommendation

Move the task beacon into reviewer ownership and run Claude Opus 4.7 against `75_world_benefits_runtime.js`, `60_enemies.js`, `80_receipts.js`, `91_scenes.js`, and `tests/cehp_rebuild_case_runs.mjs`. If review is green and Kevin likes the punishment/voice, roll directly into Week 4 Rasta Corp.

## Codex activation packet — CEHP-REBUILD-W3 (ACTIVE, Kevin signed off W2)

Kevin signed off Week 2 on 2026-04-20 ("HELL YEAH FOLLOW THAT RECOMMENDATION"). NEXT_TASK.md now points at `CEHP-REBUILD-W3`. The fresh-paste Codex activation packet Kevin delivered lives in this chat; a reference copy follows.

```json
{
  "task_id": "CEHP-REBUILD-W3",
  "title": "Rebuild Week 3 — World 2 Benefits Enrollment Atrium (5-min vertical slice)",
  "role": "Builder (Codex 5.4)",
  "deadline": "2026-05-11",
  "authoritative_docs": [
    "ACTIVE/docs/NEXT_TASK.md",
    "ACTIVE/docs/FINAL_GAMEPLAN.md (lines 187-197 = World 2 spec)",
    ".codex/CEHP/handoff.md (top three sections: this packet + Week 2 reviewer pass + Week 2 Builder notes)",
    ".codex/CEHP/status.md"
  ],
  "starting_state": {
    "build": "29 modules -> ACTIVE/game/index.html (146282 bytes)",
    "default_boot": "World 1 Orientation Bureau; ?room=test still reaches Week 1 reference room",
    "schema": "save v2 + archaeological v1 passing",
    "verification": "verify-cehp.sh green end-to-end",
    "benefits_stub": "ACTIVE/game/src/72_world_benefits.js has manifest (palette, 3 signs, 1 closer) — extend, don't replace",
    "enemies_stub": "ACTIVE/game/src/60_enemies.js is empty except for ns.Enemies.spawn no-op — build it out"
  },
  "scope": {
    "runtime_module": "Create ACTIVE/game/src/75_world_benefits_runtime.js following the 74_world_orientation_runtime.js pattern (879 lines, 6 rooms, primitives for makeRoom/makeActionGate/makeContradictionFork)",
    "enemies": {
      "Actuarial Scantron": "teleports to block landings — seeded RNG for teleport target selection",
      "Pizza Party slice": "heals + inflicts a coma debuff (pick ONE: temporary input lag OR vision occlusion — do not stack)",
      "Deductible weight": "contact shrinks Ed jump velocity; also feeds the deductible jump mutation"
    },
    "premium_pathways": "Collectibles along a safer lane; picking up N premiums before a gate unlocks the safe branch; skipping and taking damage tags the run for an UNINSURED VETERAN closer",
    "deductible_mutation": "Run-scoped variable reducing TUNING.JUMP_VELOCITY each time Ed takes deductible damage; hard-capped so late-game platforming stays possible",
    "palette": { "primary": "#f2c6d1", "accent": "#c23b3b", "paper": "#fff9e0", "ink": "#221" },
    "audio": "Extend 30_audio.js with a benefits world-override: thinner, brighter HVAC-hymn timbre; keep 60 BPM baseline",
    "receipts": "Add >=10 World-2-tagged fragments to 80_receipts.js (worlds: { benefits: 2.7-3.4 }), plus the authored closer BENEFITS PROCESSED. YOU OWE NINE DOLLARS AND A YEAR.",
    "routing": "Add ?world=benefits boot support in 91_scenes.js; preserve ?world=orientation and ?room=test fallbacks; do NOT swap the default yet — Kevin decides when benefits becomes the new default"
  },
  "out_of_scope": [
    "World 3 Rasta Corp (Week 4)",
    "thermal mode, docket, trailer, domain cutover (Week 5)",
    "Critical Reflex deck (Week 6)",
    "Retroactive World 1 fork-silhouette variation (deferred to Week 5 polish per Kevin)"
  ],
  "sacred_constraints": [
    "Single HTML file shipped artifact (built from src/*.js by build.js)",
    "ES5 only — no let/const/arrow/template-literal. Weeks 1 and 2 held zero violations; keep it.",
    "Phaser 3 via CDN (no npm install, no bundler for the game)",
    "Save v2 + archaeological v1 layer preserved",
    "Behavioral axes invisible during play — receipts are the sole reveal",
    "Seeded LCG RNG only — including enemy AI (Scantron teleport especially)",
    "Ed voice: deadpan, max 8 words per line, NO exclamation marks. World 2 must stay deadpan institutional, not cartoonish satire.",
    "No predatory retention"
  ],
  "definition_of_done": [
    "World 2 reaches a 5-minute run end-to-end via ?world=benefits",
    "All 3 enemy types implemented and behaviorally distinct",
    "Premium Pathways gates branching outcomes per room; UNINSURED VETERAN closer reachable",
    "Deductible jump mutation is observable and hard-capped",
    "Same seed + different behavior (collect-all vs uninsured) = visibly different receipts",
    "At least 2 of 3 receipt lines are World-2-flavored on most seeds",
    "verify-cehp.sh passes end-to-end",
    "Discord sidecar renders a Week 3 seed PNG",
    "One seed + Discord PNG delivered to Kevin as milestone artifact"
  ],
  "check_in_cadence": {
    "autonomy": "moderate",
    "first_seed": "once Intake + first two benefits rooms are playable with at least one enemy type live",
    "mid_week": "all 6 rooms traversable with all 3 enemy types live",
    "end_of_week": "full 5-min slice + Discord PNG + end-of-week review by Claude Opus 4.7",
    "escalation_triggers": [
      "any sacred constraint under threat",
      "more than 1 day behind Week-3 DoD",
      "enemy tuning disputes (Kevin has taste authority on punishment level)",
      "tone drift toward cartoonish satire",
      "Critical Reflex response inbound"
    ]
  },
  "reviewer_handoff": {
    "reviewer": "Claude Opus 4.7",
    "expects": [
      "updated ACTIVE/game/tests/cehp_rebuild_case_runs.mjs exercising World 2 with collect-all vs uninsured divergence",
      "updated .codex/CEHP/changelog.md + handoff.md + status.md",
      "notes on any decisions Codex made that Kevin should sanity-check on taste (enemy punishment levels, deductible cap value, premium count thresholds)"
    ]
  }
}
```

---

## What Was Just Done (2026-04-20 — Week 2 Reviewer Pass · Claude Opus 4.7)

Claude Opus 4.7 completed the end-of-Week-2 review against Codex's Orientation Bureau slice. No blockers surfaced; two taste notes queued for Kevin.

### Review verdict: GREEN for Week 2 DoD

- **Build**: `node build.js` → 29 modules, 146,282-byte single-file `index.html`. Clean (+16,851 bytes vs Week 1).
- **Schema**: `check_save_schema.js` — all 10 v2 + archaeological assertions still pass.
- **Verification suite** (`verify-cehp.sh`): logic (4/4) + browser smoke + deterministic case-runs all pass. Same seed + two scripted styles produce divergent receipts.
- **Discord sidecar**: Week 2 seed render on disk at `ACTIVE/discord/output/CASE-20260420-001-CURIOSITY-R2.png`.

### Week 2 DoD scorecard

| DoD item | Status | Evidence |
|---|---|---|
| World 1 boots by default | ✓ | `91_scenes.js:115` — `WorldOrientation.create` unless `?room=test` |
| All 11 actions diegetic across 6 rooms | ✓ | Intake (move, jump) → Base (kick, spinDash) → Vertical (doubleJump, tripleJump, wallSlideJump) → Corrective (punch, groundSlam) → Aerial (glide, cigCopter) → Final (integration) |
| 5-min Intake→Final reachable | ✓ | `WorldOrientation.runStyle` scripts a full traversal; final door unlocks only after all 11 actions learned (`74_world_orientation_runtime.js:316-322`) |
| Same seed + different behavior = different receipts | ✓ | obedient/defiant receipts diverge on lines 2 and 3 (line 1 shared — see taste notes) |
| ≥2/3 receipt lines World-1 flavored | ✓ exceeds | Both scripted runs produce 3/3 World-1 lines (STAMP, WINDOW, UPPER FILE vs STAMP, BADGE, LOWER HALL) |
| verify-cehp.sh passes | ✓ | logic + smoke + case-runs all green |
| Discord sidecar renders Week 2 seed | ✓ | 121KB PNG on disk |
| Milestone artifact to Kevin | pending | Kevin's seed taste review + audio ear-check |

### World-1 receipt coupling audit

- `80_receipts.js` now has 9 distinct World-1-tagged fragment groups (`worlds: { orientation: 2.7-3.4 }` — heavy pulls) plus 2 holdover groups at `0.2` baseline weight.
- Fragment-scoring algorithm pulls Bureau-flavored lines to the top when `worldId === 'orientation'` without hardcoded branches. The declarative architecture held — exactly what the Week 1 coupling review predicted.

### Runtime module review (`74_world_orientation_runtime.js`, 879 lines)

- 6 room builders (`buildIntake/Base/Vertical/Corrective/Aerial/Final`) share a clean set of primitives (`makeRoom`, `makeActionGate`, `makeContradictionFork`, `addPlatform`, `addBackdrop`).
- Action-queue consumer pattern is sound: player must fire the canonical action event inside the gate's sensor zone within a 320ms window. Prevents cheese where you emit-then-walk.
- Final door gated behind `actionsLearned.length === ACTIONS.length` — the pedagogy is load-bearing; you literally cannot finish World 1 without touching all 11 actions.
- `runStyle` extension of the Week 1 debug harness is clean: iterates rooms, fires scripted events + recorder marks per room, calls `completeRun('debug:<style>')`. Deep-cloned returns, no live state leaks.
- Event-bus cleanup is intentional: `bindActionQueue` returns off-fns stashed on `world.offFns`, `destroy()` tears them down on scene shutdown. No listener leaks across run cycles.

### Sign copy review (18 new signs)

All 18 pass:
- Max 8 words per line: max observed is 4 words ("MOVE TO WINDOW THREE")
- No exclamation marks: every sign ends in `.`
- Voice: deadpan-bureaucratic matches Ed. Favorites: "YOUR COOPERATION HAS BEEN PRE-INTERPRETED." / "WAIT FOR BADGE." / "SECOND ATTEMPT REQUIRED."

### Sacred-constraint audit (Week 2 regression check)

- ES5 only: still zero `let`/`const`/arrow/template-literal across `src/*.js` (29 modules)
- Seeded RNG only: still zero `Math.random()` (sole mention remains the "NEVER" warning in `02_rng.js`)
- Save contract: v1 blob still preserved verbatim under `v2.legacy`
- Single-file ship: one 146KB `index.html`
- Invisible axes: no HUD added; receipts remain the sole reveal

### Taste notes for Kevin's signoff

Two items Codex flagged + one I noticed — none are blockers, all are Kevin's taste call.

1. **Contradiction-fork silhouette repetition** (Codex flagged). All 6 rooms use identical fork geometry (same staircase cadence, same upper/lower door positions). Narratively defensible as "institutional repetition" but the silhouettes read same-y. If you want room-specific forks (turnstile for Intake, elevator shaft for Vertical Compliance, podium for Final Certification), that's a Week-2-polish or early-Week-3 task, not a blocker.
2. **Both debug runs share receipt line 1** ("THE STAMP SAW ENOUGH TODAY"). The scripted obedient/defiant paths traverse similar geometry, so the dominant verdict axis doesn't fully invert. Live players varying jump counts, sign-peeks, near-misses, etc. will see stronger line-1 divergence. Not a blocker; flagging because a casual read of the test output might suggest the axes are stuck.
3. **Action ordering** (my note). Intake teaches `move` + `jump`; Base teaches `kick` + `spinDash` before any air-control. Kevin may want to cement jump mastery before adding ground-offense verbs — or he may like the brisk pacing. Taste call.

### What still needs human confirmation

1. **Audio ear-check** — still outstanding from Week 1; the graph is wired but the "audible filter/tempo/detune shift" sign-off requires your ears. Now exercised against World 1 too.
2. **Kevin's seed taste review** — the new obedient/defiant pair + Discord PNG should match your feel for the Orientation Bureau's voice.

### Recommendation

Sign off on Week 2 as-is. Route Codex to Week 3 (World 2 Benefits Enrollment Atrium) on Monday 2026-04-27. If the fork-silhouette note bothers you, bundle it with Week 5 polish rather than bouncing Codex back into World 1 now — maintaining forward momentum matters more than silhouette variety at this stage.

---

## What Was Just Done (2026-04-20 — Week 2 Orientation Bureau Slice Implemented, Verified, and Rendered)

Codex built the Week 2 World 1 slice on top of the green Week 1 core. The rebuild runtime now boots into Orientation Bureau by default, the deterministic case-run harness exercises the six-room world instead of the throwaway test room, and the Discord sidecar renders a World 1-flavored receipt PNG from the same case seed.

### What is green right now
1. `cd ACTIVE/game && node build.js` — builds **29 modules** into the shipped single-file `index.html` (`146282` bytes / `4422` lines).
2. `cd ACTIVE/game && bash scripts/verify-cehp.sh` — save contract, logic tests, browser smoke, and World 1 case-run divergence all pass.
3. `cd ACTIVE/discord && node bot.js --render CASE-20260420-001-CURIOSITY-R2` — writes `ACTIVE/discord/output/CASE-20260420-001-CURIOSITY-R2.png` (`118KB`).

### What Codex actually changed
- Added `ACTIVE/game/src/74_world_orientation_runtime.js` as the Week 2 runtime module: six authored rooms, one contradiction fork per room, action-teaching gates, room-order tracking, and deterministic debug-route support.
- Extended `ACTIVE/game/src/71_world_orientation.js` with room metadata so the manifest now describes the World 1 slice instead of only palette/sign/closer stubs.
- Switched `ACTIVE/game/src/91_scenes.js` so Play boots Orientation Bureau by default, with `?room=test` preserving the Week 1 reference room as an escape hatch.
- Expanded `ACTIVE/game/src/80_receipts.js` with World 1-tagged verdict/tension/closer pools, including follow/defy-specific Bureau text so different behavior on the same seed no longer collapses to the same top fragments.
- Wired `module:passed` / `module:skipped` into `10_axes.js` and `11_metrics.js` so compliance modules leave a real receipt-visible trace.
- Updated `ACTIVE/game/tests/cehp_rebuild_smoke.mjs` and `ACTIVE/game/tests/cehp_rebuild_case_runs.mjs` so the automated harness now asserts default World 1 boot, six-room route order, all 11 taught actions, and obedient/defiant receipt divergence.

### Seed artifact to show Kevin
- seed: `CASE-20260420-001-CURIOSITY-R2`
- obedient receipt:
  - `THE STAMP SAW ENOUGH TODAY.`
  - `THE WINDOW RESPECTED YOUR DELAY.`
  - `THE UPPER FILE KEPT YOUR NAME.`
- defiant receipt:
  - `THE STAMP SAW ENOUGH TODAY.`
  - `THE BADGE MISSED YOUR BETTER IDEA.`
  - `THE LOWER HALL TOOK YOUR SIDE.`
- PNG:
  - `ACTIVE/discord/output/CASE-20260420-001-CURIOSITY-R2.png`

### Risks / reviewer focus
- **Taste, not plumbing, is the main review surface now.** The likely debate is sign copy + pedagogy order, not determinism or save safety.
- The contradiction-fork helper in `74_world_orientation_runtime.js` intentionally reuses a common geometry pattern across all six rooms for speed and consistency. Kevin may want stronger room-specific silhouettes before Week 2 closes.
- The debug harness is still a scripted route, not a full human-input replay. That is deliberate for deterministic browser testing; review it as test infrastructure, not as player-facing content.

### What should happen next
1. Claude Opus 4.7 reviews the Week 2 slice, centered on `74_world_orientation_runtime.js`, `80_receipts.js`, `91_scenes.js`, and `tests/cehp_rebuild_case_runs.mjs`.
2. Kevin sanity-checks sign tone, action ordering, and whether the World 1 receipt voice feels sufficiently Bureau-specific.
3. If green, roll directly into Week 3 Benefits Enrollment Atrium and keep docket / thermal deferred to Week 5.

## Historical activation packet — CEHP-REBUILD-W2 (consumed on 2026-04-20)

This is the packet Codex used to start the Week 2 implementation above. Keep it for reference; the live task state now lives in `ACTIVE/docs/NEXT_TASK.md` and the section above.

```json
{
  "task_id": "CEHP-REBUILD-W2",
  "title": "Rebuild Week 2 — World 1 Orientation Bureau (5-min vertical slice)",
  "role": "Builder (Codex 5.4)",
  "deadline": "2026-05-04",
  "authoritative_docs": [
    "ACTIVE/docs/NEXT_TASK.md",
    "ACTIVE/docs/FINAL_GAMEPLAN.md (lines 174-210 = World 1 spec)",
    ".codex/CEHP/handoff.md (Week 1 reviewer notes + coupling architecture)",
    ".codex/CEHP/status.md"
  ],
  "starting_state": {
    "build": "28 modules -> ACTIVE/game/index.html (109431 bytes)",
    "schema": "save v2 + archaeological v1 passing 10/10 assertions",
    "verification": "verify-cehp.sh green end-to-end",
    "world_stub": "ACTIVE/game/src/71_world_orientation.js has manifest (palette, signs, 2 closer fragments) — extend, don't replace",
    "test_room": "ACTIVE/game/src/92_testroom.js is the reference pattern for room construction; retire from default boot once World 1 is reachable"
  },
  "scope": {
    "rooms": [
      "Intake",
      "Base Locomotion",
      "Vertical Compliance",
      "Corrective Handling",
      "Aerial Exception",
      "Final Certification"
    ],
    "pedagogy": "Every one of the 11 movement actions is introduced diegetically in a compliance module with its own sign + gate + receipt-visible micro-signal",
    "contradiction_gates": "At least one per room. Both follow AND defy routes valid; receipts diverge audibly/visually.",
    "palette": { "primary": "#3a5ca8", "accent": "#e04a3a", "paper": "#e8e3d1", "ink": "#111" },
    "audio": "HVAC hymn + Bureau pulse layers bound to 60 BPM baseline",
    "receipts": "Add >=10 world-1-tagged closer fragments to src/80_receipts.js (with `worlds: { orientation: 0.2 }` or higher) on top of the 2 authored stubs in 71_world_orientation.js"
  },
  "out_of_scope": [
    "World 2, World 3",
    "60_enemies.js unless World 1 specifically requires an institutional NPC",
    "thermal mode",
    "docket archive page",
    "trailer cuts",
    "counterfeit-educational.org domain cutover"
  ],
  "sacred_constraints": [
    "Single HTML file shipped artifact",
    "ES5 only (no let/const/arrow/template-literal — Week 1 verified zero violations, keep it)",
    "Phaser 3 via CDN (no npm install, no bundler)",
    "Save v2 + archaeological v1 layer preserved verbatim",
    "Behavioral axes invisible during play — receipts are the sole reveal",
    "Seeded LCG RNG only — never Math.random()",
    "Ed voice: deadpan, max 8 words per line, NO exclamation marks",
    "No predatory retention patterns"
  ],
  "definition_of_done": [
    "World 1 boots by default from index.html (not the test room)",
    "All 11 actions introduced diegetically across 6 rooms",
    "5-minute run from Intake through Final Certification reachable",
    "Same seed + different behavior = visibly different receipts",
    "At least 2 of 3 receipt lines are World-1-flavored on most seeds",
    "verify-cehp.sh passes against the new world",
    "Discord sidecar renders a Week 2 seed PNG",
    "One seed + Discord PNG delivered to Kevin as milestone artifact"
  ],
  "check_in_cadence": {
    "autonomy": "moderate",
    "first_seed": "once Intake + Base Locomotion are playable",
    "mid_week": "all 6 rooms traversable in draft form",
    "end_of_week": "full 5-min slice + Discord PNG + end-of-week review by Claude Opus 4.7",
    "escalation_triggers": [
      "any sacred constraint under threat",
      "more than 1 day behind Week-2 DoD",
      "pedagogy dispute (which action teaches which room) — Kevin has taste authority here",
      "Critical Reflex response inbound"
    ]
  },
  "reviewer_handoff": {
    "reviewer": "Claude Opus 4.7",
    "expects": [
      "updated cehp_rebuild_case_runs.mjs exercising the new world with divergent receipts",
      "updated changelog.md + handoff.md + status.md",
      "notes on any decisions Codex made that Kevin should sanity-check on taste (sign copy, pedagogy ordering)"
    ]
  }
}
```

### Why this split

Week 2 is the first "real world" — every decision Codex makes here (sign copy tone, how actions sequence, how contradiction gates feel) becomes the pattern for Worlds 2 and 3. So the handoff emphasizes pedagogy and receipt flavor over raw module count. The infrastructure is all green from Week 1; this week is taste and craft against that scaffolding.

---

## What Was Just Done (2026-04-20 — Week 1 Reviewer Pass · Claude Opus 4.7)

Claude Opus 4.7 completed the end-of-Week-1 review against Codex's core-first slice. No blockers surfaced; sign-off pending only Kevin's seed review + human audio ear-check.

### Review verdict: GREEN for Week 1 DoD

- **Build**: `node build.js` → 28 modules, 109,431-byte single-file `index.html`. Clean.
- **Schema**: `check_save_schema.js` — all 10 v2 + archaeological assertions pass. `legacy` blob preserved verbatim.
- **Verification suite** (`verify-cehp.sh`): logic (4/4) + browser smoke + deterministic case-runs all pass.
- **Discord sidecar**: `bot.js --render` output on disk at `ACTIVE/discord/output/CASE-20260420-001-CURIOSITY-R2.png` (121KB).

### Coupling review (flagged by Codex as Week 1 proof point)

Contradiction gate → receipt engine chain is declarative and verified:
1. `51_contradiction.js` emits `contradiction:follow` / `contradiction:defy` events via the bus.
2. `10_axes.js` binds those events: follow bumps compliance (+0.05) + efficiency (+0.02); defy bumps chaos (+0.06) + curiosity (+0.03).
3. `80_receipts.js` scores 180 fragments against the axes/tensions/micro-signals snapshot. Different snapshot → different priority winners → different 3-line verdicts.

No hardcoded branches in the receipt engine. This is the right architecture. Adding a world only requires adding fragments with appropriate metadata — no coupling rewrites.

### Debug hook review (`CEHP.Debug.runStyle`)

`91_scenes.js:143-148,190-255`. Verdict: deliberate, narrow, safe.
- Installed only inside `PlayScene.create` (not at boot time).
- Scripted `obedient`/`defiant` profiles fire axis-relevant events + recorder marks, then call `completeRun('debug:<style>')`.
- Returns deep-cloned receipt/axes/frames — no live state leaks out.
- Used only by `cehp_rebuild_case_runs.mjs` for deterministic verification. Not a gameplay surface.

### Sacred-constraint audit

- ES5 only: zero occurrences of `let`/`const`/arrow/template-literal across `src/*.js`.
- Seeded RNG only: zero `Math.random()` calls; sole mention is the "NEVER" warning in `02_rng.js`.
- Save contract: v1 blob preserved verbatim under `v2.legacy` via JSON round-trip.
- Single-file ship: `build.js` emits one `index.html`. No bundler. No `npm run` required to play.
- Invisible axes during play: receipt engine is the sole reveal surface; no axis HUD in scene code.

### What still needs human confirmation

1. **Audio ear-check** — the 4-layer oscillator graph initializes and `updateFromAxes` runs on every tick, but "audible filter/tempo/detune shift" requires Kevin's ears, not code review.
2. **Kevin's seed review** — the obedient/defiant pair + PNG should match his taste for Ed's voice.

### Recommendation for remaining Week 1 time

Given the core slice is green and the Week 2 world (Orientation Bureau) needs all of this infrastructure anyway, spending remainder on `81_docket.js` or thermal mode buys less than starting World 1 early. Suggest: **ship docket/thermal to Week 5 alongside the trailer push**, and use the saved days to begin Week 2 on Monday 2026-04-21.

Kevin's call.

---

## What Was Just Done (2026-04-20 — Week 1 Core-First Slice Implemented, Verified, and Seeded)

Codex executed the approved Week 1 core-first plan against the rebuild scaffold. The browser runtime is now playable locally and the Discord-side receipt renderer is producing real PNGs.

### What is green right now
1. `cd ACTIVE/game && node build.js` — builds 28 modules into the shipped single-file `index.html` (`109431` bytes).
2. `cd ACTIVE/game && node scripts/check_save_schema.js` — save v2 + archaeological v1 contract still passes.
3. `cd ACTIVE/game && ./scripts/verify-cehp.sh` — rebuild logic tests, browser smoke, and deterministic case-run tests all pass.
4. `cd ACTIVE/discord && node bot.js --render CASE-20260420-001-CURIOSITY-R2` — writes a real 1080×1350 PNG to `ACTIVE/discord/output/CASE-20260420-001-CURIOSITY-R2.png`.

### What Codex actually built
- `10_axes.js` + `11_metrics.js` now consume deterministic gameplay/event traffic and produce non-zero axes + micro-signals over a run.
- `20_input.js`, `21_movement.js`, and `22_collision.js` now provide the Week 1 actor loop: all 11 actions, coyote time, jump buffer, corner nudge, respawn helper, keyboard/gamepad edges.
- `41_signs.js`, `50_forms.js`, and `51_contradiction.js` now support diegetic signs, bridge/blade/trampoline forms, and one-shot follow/defy route switching.
- `80_receipts.js` now contains 180 authored fragments with deterministic fragment IDs and metadata scoring.
- `82_appeals.js` now supports sampled recorder output, encoded baseline payloads, compare deltas, and path bounds.
- `90_ui.js`, `91_scenes.js`, and new `92_testroom.js` now provide Boot → Play/TestRoom → Overlay → Receipt plus `?case=` and `?appeal=` handling.
- `30_audio.js` and `40_fx.js` now provide a live audio graph, death stamp escalation, and cigarette render. Audio still needs a human ear check for final signoff.
- `ACTIVE/discord/bot.js` + `ACTIVE/discord/package.json` provide a local render path and a token-ready `/case` interaction scaffold.

### Seed artifacts worth showing Kevin
- obedient script receipt:
  - `INSTRUCTIONS WERE TAKEN SERIOUSLY.`
  - `YOUR METHOD KEPT NO MANNERS.`
  - `PATIENCE REWARDED THE UPPER PATH.`
- defiant script receipt:
  - `HAZARD FORM BECAME A PLAN.`
  - `YOUR METHOD KEPT NO MANNERS.`
  - `THE FLOOR REVISED ITS OPINION.`
- Discord render output:
  - `ACTIVE/discord/output/CASE-20260420-001-CURIOSITY-R2.png`

### Risks / review focus
- The rebuild runtime now uses a narrow `CEHP.Debug.runStyle(...)` helper for deterministic browser verification. It is test-facing and should be reviewed as a deliberate harness surface, not an accidental player feature.
- The audio graph is implemented and initialized lazily, but “audible shift” still needs human confirmation rather than automated proof.
- `canvas` does not build from source under local Node 25 on this machine (missing `pkg-config` / pixman toolchain). The sidecar keeps `canvas` as the preferred path but falls back to `@napi-rs/canvas` for local verification.
- `81_docket.js` and thermal mode remain intentionally deferred.

### What should happen next
1. Kevin reviews the obedient/defiant receipt pair and the Discord PNG.
2. Claude Opus 4.7 reviews the Week 1 slice.
3. If no blockers appear, either spend remaining Week 1 time on docket/thermal or move directly to Week 2 Orientation Bureau content.

## What Was Just Done (2026-04-20 — Week 1 Scaffold Dropped, Codex On Deck)

Claude Opus 4.7 executed the A3 ruling: scaffolded `src/` module layout + `build.js` concatenator + `check_save_schema.js` v2 + migration path. Codex inherits a green skeleton for Monday.

### What Codex can immediately do
1. Run `cd ACTIVE/game && node build.js` — builds 27 modules into `index.html` (34,632 bytes).
2. Run `node scripts/check_save_schema.js` — 10 assertions all pass; save contract is green.
3. Open `index.html` in a browser — Boot scene shows "COUNTERFEIT EDUCATIONAL — CASE INTAKE — STANDBY" + ruleset/version/module count.
4. Grep for `TODO(codex):` across `src/` — every scaffolded system has a marker telling Codex what to build.

### Modules already fully implemented (do not rewrite; extend only)
- `00_index.js` — CEHP namespace, version/ruleset, module registry
- `01_const.js` — save keys, TUNING object, AXIS_NAMES
- `02_rng.js` — seeded LCG (NEVER Math.random); FNV-1a string seeding
- `03_events.js` — synchronous pub/sub with error isolation
- `04_save.js` — v1→v2 migration preserving v1 blob under `legacy` field; v1 key retained
- `05_caseseed.js` — CASE-YYYYMMDD-NNN-AXIS-R2 format, URL parser
- `10_axes.js` — 6 primary + 30 micro-signals + 3 tensions (obedience/style/auditRisk)
- `70_worlds.js` / `71/72/73_world_*.js` — manifests with palette/tempo/signs/closers locked
- `80_receipts.js` — minimal working generator with seed pools (expand to 180+)
- `82_appeals.js` — Recorder skeleton
- `91_scenes.js` — Boot scene
- `99_boot.js` — Phaser bootstrap, settings-hatch detection, headless-safe

### Modules stubbed with `TODO(codex):` markers
- `11_metrics.js` — recency-weighted micro-signal tracking
- `20_input.js` — keyboard/gamepad justPressed/justReleased
- `21_movement.js` — all 11 actions enumerated in ACTIONS constant (move, jump, doubleJump, tripleJump, wallSlideJump, punch, kick, spinDash, cigCopter, groundSlam, glide)
- `22_collision.js` — one-way platforms, form triggers
- `30_audio.js` — 4-layer graph (HVAC hymn, Bureau pulse, Curiosity shimmer, Incident noise) — ctx creation scaffolded, oscillator wiring pending
- `40_fx.js` — CRT/scanlines/chromatic aberration/per-axis grading
- `41_signs.js` — canvas diegetic signage (max 8 words, no exclamations)
- `50_forms.js` — bridge/blade/trampoline primitives
- `51_contradiction.js` — declarative gate helper
- `60_enemies.js` — deferred past Week 1
- `81_docket.js` — weekly seed picker
- `90_ui.js` — clipboard / locker / training poster

### First milestone artifact
```
CASE-20260420-001-CURIOSITY-R2

ROUTINE COMPLIANCE OBSERVED.
CHAOS SIGNATURE MATCHES PRIOR CASES.
RETURN TO ASSIGNED HALLWAY.
```
Same seed run twice produces identical lines. Appeals-ready primitive is already in place.

### What NOT to touch
- Legacy archive at `ARCHIVE/legacy_runtime_v1/index.html` (19,835 lines) — frozen reference only.
- Sacred constants: `cactusEd_save_v1` key, version/ruleset flags, AXIS_NAMES list, the 11 ACTIONS list.
- Existing core modules (00–05, 10, 70–73) are load-bearing — extend, don't replace.

## What Was Just Done (2026-04-20 — FINAL GAMEPLAN Locked)

Director Kevin delivered 25 rulings resolving every major architectural, social, launch, world, and production fork. The full doctrine is codified in `ACTIVE/docs/FINAL_GAMEPLAN.md`.

### Key decisions to respect going forward:
- **Dev-time concat is permitted.** Author `src/00_core.js` through `src/90_ui.js`. A 20-line Node build script cats them into one shipped `index.html`. No bundler. No `npm run` to play.
- **Launch target is 2026-05-29** (Kane Pixels × A24 *Backrooms* release). Fallback 2026-06-12. **8-week hard stop.**
- **All 11 actions stay permanent from Minute 1.** Never gate them — it would break Case Seed replay parity.
- **6 visible axes only + pairwise tensions at receipt time** (Obedience, Style, Audit Risk). Not 12 axes.
- **Appeals mechanic ships in rebuild scope** — not v2. This is the viral loop.
- **Rasta Corp is a full structural world, not flavor.** It is the contrast engine.
- **Contradiction gates + forms-as-physical-objects = core mechanics** in every world.
- **Critical Reflex pitch is Priority #1.** Start the deck Week 1.
- **Discord bot is discovery channel #1.** Build Week 2.
- **`counterfeit-educational.org` is the canonical home.** Game runs in an iframe styled as intranet portal.
- **All sacred constraints preserved.** Single HTML · ES5 · Phaser CDN · no build · invisible axes · no predatory retention. Breaking any makes CEHP a normal indie game.

### What's active now:
- `ACTIVE/docs/NEXT_TASK.md` → **CEHP-REBUILD-W1** (Architecture + Core Systems + Receipt + Appeals + Discord bot). Week 1 of 6.
- Architect next: produce Week 1 packet from `ACTIVE/docs/FINAL_GAMEPLAN.md` § "Week 1 Systems — Build Order".
- Builder next: scaffold `src/` module layout and `build.js` concatenator as the first concrete commit.

### What to NOT touch:
- Legacy `ACTIVE/game/index.html` (19,835 lines) is a **reference library**. Do not build on it. Do not delete it. Do not push further patches to it unless a hotfix is required for the live legacy URL.

## What Was Just Done (2026-04-20 — Rediscovery Audit + Claude Redo Handoff)

### Repo / GitHub Audit
Completed a full authored-file rediscovery pass across the local workspace and public GitHub `main`.

Created:
- `ACTIVE/docs/PROJECT_REDISCOVERY_AUDIT.md`
- `ACTIVE/docs/CLAUDE_CODE_REDO_HANDOFF.json`
- `ACTIVE/docs/CLAUDE_CODE_REDO_PROMPT.json`

Key findings:
- Local authored workspace = `216` files; public GitHub `main` = `219` tracked files.
- Public-only files versus local are `00_HANDOFF_FROM_CLAUDE_CODE.md`, `GAME_REVIEW_AND_GOAT_PLAN.md`, `GOAT_GAME_BRAINSTORM_PROMPT.md`, and `ACTIVE/game/package-lock.json`.
- Local-only file versus public is root `AGENTS.md`.
- The repo is split between a newer local runtime and older/staler certification/process docs.

### Verification / Divergence
Ran both local and public-facing smoke verification on `2026-04-20`.

- Local `ACTIVE/game/./scripts/verify-cehp.sh` — passes
- Public smoke against `https://kevinbigham.github.io/Cactus-Eds-Happy-Place` — fails on plain `/index.html`

Public failure:
- `Cannot read properties of null (reading 'type')`

This matches the old boot-time `GAME_INSTANCE.renderer.type` problem. Public GitHub `main` and live GitHub Pages still show the old unsafe global `IS_WEBGL` line, while the local workspace contains the safer Builder stability patch.

### Practical Meaning
Do not assume the live site or public GitHub repo are the same as the local workspace.
If the next agent is helping plan a redesign, they should treat legacy CEHP as a reference library, not as a clean canonical product state.

## What Was Just Done (2026-03-21 — Builder Stability Audit)

### Title / Runtime Stability Fixes
Small surgical patch to `ACTIVE/game/index.html` after a full runtime audit + live browser verification pass.

**Boot-time WebGL crash fixed** — `GAME_INSTANCE.renderer.type` was being read before Phaser had guaranteed `renderer` existed, throwing on plain `/index.html`, `?certAid=w2`, and `?certAid=w3`. `IS_WEBGL` is now initialized safely and refreshed inside each scene create before PostFX guards run.
**Title cold-open gating fixed** — the "first visit" cold open was unconditional, which meant save-bearing returns skipped the title surface and broke the repo’s seeded-achievements smoke path. It now auto-runs only for first-time/no-save visits and records `cactusEd_title_seen_v1`.
**Title gamepad repeat fixed** — `TitleScene` used `GAMEPAD.justPressed(...)` without advancing `_prev`, so a held D-pad input could skip multiple menu items in a single hold. `GAMEPAD.endFrame()` is now called on all title update paths, and cold open "PRESS ANY KEY" now includes gamepad input.

### Verification
- `node ACTIVE/game/scripts/check_save_schema.js` — passes
- syntax parse of the `<script>` block via `new Function(...)` — passes
- `node ACTIVE/game/tests/cehp_boot_smoke.mjs` — passes
- targeted browser repro: held fake gamepad down input on title now advances menu once (`0 -> 1`) instead of racing to the bottom

## Previous Major Work (2026-03-21 — "The Corrupted Broadcast" Visual Evolution)

### 10-Round Visual Evolution: "The Corrupted Broadcast"
Complete visual overhaul adding 10 interconnected systems (981 insertions, 32 deletions). The game is now a corrupted institutional broadcast that reacts to player behavior in real-time.

**Round 1: MOOD LIGHTING** — `MOOD_VISUALS` lookup maps 7 moods to PostFX params (bloom, vignette, grain). Emergency Drill pulses red.
**Round 2: THE FILING CABINET** — `ANIM_UI` utility (typewriter, slideIn, stampIn, slideOut). Pause screen, lesson cards, memos, and flash messages all animated.
**Round 3: THE BEHAVIOR METER** — `BEHAVIOR_FX` + `getBehaviorIntensity()`. Chaos = more glitches/grain/tears. Compliance = sterile. Grace = golden shimmer particles.
**Round 4: INSTITUTIONAL TRANSITIONS** — `TRANSITIONS` system with 5 types (glitch, vhs_track, stamp, standby, fade). All scene.start() calls converted.
**Round 5: AMBIENT PULSE** — `AMBIENT_LIGHT` system. Pulsing light sources on pickups. Flares on kills (gold), deaths (red), aloe collection (green).
**Round 6: ENVIRONMENTAL STORYTELLING** — `ENV_FX` system. Fog wisps (dream), paper flutter (lesson), heat shimmer (rupture), data rain (afterglow).
**Round 7: THE BROADCAST IDENTITY** — Zone-accent enemy halos. Alive enemies glow with zone color.
**Round 8: COLOR GRADING** — `COLOR_GRADE` system. Per-zone color overlay with smooth lerp transitions.
**Round 9: THE PRINTING CEREMONY** — CRT power-on animation (dot→line→expand). Archetype stamp-in with camera shake.
**Round 10: THE COMPLETE BROADCAST** — `BROADCAST_STATE` meta-layer. Signal degrades with chaos, drives all other systems. Channel ID card every 120s.

### Previous Sessions
- **2026-03-21**: WebGL PostFX visual upgrade, text readability pass, TitleScene crash fix
- **2026-03-20**: All 10 GOAT plan rounds (04-10) implemented

## What To Do Next
1. Check `ACTIVE/docs/NEXT_TASK.md` — currently OPEN (no active task)
2. Read `ACTIVE/docs/PROJECT_REDISCOVERY_AUDIT.md` before trusting older project docs
3. Decide whether to push the local legacy stability patch or freeze legacy CEHP and start a clean CEHP v2 brief
4. If planning CEHP v2, use `ACTIVE/docs/CLAUDE_CODE_REDO_HANDOFF.json` and `ACTIVE/docs/CLAUDE_CODE_REDO_PROMPT.json`
5. Next agent should read `CLAUDE.md`, `AGENTS.md`, and this file first

## Exact Files To Inspect
- Task beacon: `ACTIVE/docs/NEXT_TASK.md`
- Rediscovery audit: `ACTIVE/docs/PROJECT_REDISCOVERY_AUDIT.md`
- Structured Claude handoff: `ACTIVE/docs/CLAUDE_CODE_REDO_HANDOFF.json`
- Runtime: `ACTIVE/game/index.html` (~19,750 lines)
- Agent rules: `ACTIVE/docs/AGENTS.md`
- Known issues: `ACTIVE/docs/KNOWN_ISSUES.md`
- Local memory: `.codex/CEHP/status.md`
- Backlog: `ACTIVE/docs/BACKLOG.md`

## Current Branch / Working State
- Branch: unknown in this workspace snapshot (`git` metadata was not available to the tool)
- Remote: expected `origin` → `https://github.com/KevinBigham/Cactus-Eds-Happy-Place`
- Local workspace includes newer runtime/stability work than public GitHub `main`
- GitHub Pages deploys automatically on push to main, but the currently live site is still behind the local workspace

## Tech Stack Summary
- Phaser 3.70.0 via CDN (WebGL renderer with Canvas fallback)
- ES5 JavaScript only (no let/const, no arrow functions, no template literals)
- Single HTML file: `ACTIVE/game/index.html`
- Save key: `cactusEd_save_v1` (localStorage)
- Verification: `node ACTIVE/game/scripts/check_save_schema.js`

## Key Architecture Notes
- Ed, cats, and enemies are drawn via Phaser Graphics (fillRect/fillCircle), NOT sprites
- Custom particle system (SMOKE_POOL array, 67+ push sites) — NOT Phaser emitters
- Behavioral tracking: `this.behavior = { compliance, intuition, curiosity, grace, chaos, efficiency }`
- Receipt system: `generateReceiptText(behavior, runData)` returns `{text, archetype, dominant, secondary}`
- PostFX is guarded by `IS_WEBGL` global flag — all visual effects have Canvas fallback
- Game dimensions: W=512, H=448 pixels

## New Visual Systems (2026-03-21)
Global objects defined near top of script (after PERF, before RECEIPT 2.0):
- `MOOD_VISUALS` — mood effect → visual parameter lookup
- `BEHAVIOR_FX` — behavior axis → real-time visual modifiers
- `ANIM_UI` — typewriter, slideIn, stampIn, slideOut animation utilities
- `AMBIENT_LIGHT` — dynamic pulsing light source system
- `ENV_FX` — zone-specific environmental particle effects
- `COLOR_GRADE` — per-zone color overlay with lerp transitions
- `BROADCAST_STATE` — meta-layer signal integrity system
- `TRANSITIONS` — 5 themed scene transition types

Depth layer stack (bottom to top):
```
76: Ambient lights (Round 5)
77: Environmental FX (Round 6)
90: Color grade overlay (Round 8)
91: Mood overlay (Round 1)
92: Vignette + behavior vignette (Round 3)
93: Tear FX
94: Grain
95: CRT scanlines
96: Subliminal text
100-104: Receipt terminal (Round 9)
```

## Warnings / Risks / Traps
- The game is ONE GIANT HTML file (~19,835 lines). Do not split it.
- Save contract (`cactusEd_save_v1`) must NEVER break. Always run the schema check.
- Movement constants in `ED_MOVE` must not change without approval.
- The cigarette is central to Ed's identity — never remove it.
- Behavioral tracking stays silent (no visible meters).
- All visual effects have Canvas fallback and accessibility guards (reduceShake/reduceFlash/reduceParticles).
