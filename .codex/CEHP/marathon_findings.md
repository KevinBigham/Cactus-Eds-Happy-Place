# CEHP W11.5 Marathon Findings

## M3 - Voice / ES5 / RNG / Time Sweep

- kind: voice
  location: ACTIVE/docs/BACKLOG.md:20
  snippet: `Reviewer GREEN + Kevin signed off 2026-04-20 ("GREEN LIGHT! APPROVED! SALUTE! LFG!").`
  severity: low
  note: Active-doc quote hit only; no receipt or sign text affected.
- kind: voice
  location: ACTIVE/docs/BACKLOG.md:25
  snippet: `Kevin image taste-gate PASSED ("LOOKS SO DAMN GOOD! THE IMAGES ARE PERFECT!").`
  severity: low
  note: Active-doc quote hit only; no receipt or sign text affected.
- kind: voice
  location: ACTIVE/docs/CEHP_LAUNCH_ARC.md:7
  snippet: `Kevin greenlit all 5 W10 taste-gates 2026-04-23 ("READY!!!! CREATE THE SUPER-LONG-RUN-SPRINT FOR YOU AND CODEX TO BUILD THIS GAME FROM THE GROUND UP")`
  severity: low
  note: Active-doc quote hit only; no receipt or sign text affected.
- kind: voice
  location: ACTIVE/docs/CEHP_LAUNCH_ARC.md:27
  snippet: `Kevin's "READY!!!!" = silence-approves-defaults`
  severity: low
  note: Active-doc quote hit only; no receipt or sign text affected.
- kind: voice
  location: ACTIVE/docs/PLAYTEST_LOG.md:65
  snippet: `"This game is getting there! Just needs a hard upgrade on the graphics."`
  severity: low
  note: Active-doc quote hit only; no receipt or sign text affected.
- kind: time
  location: ACTIVE/game/src/04_save.js:83
  snippet: `v2.ts         = (v1 && v1.timestamp) || Date.now();`
  severity: medium
  note: Protected save module; left unchanged.
- kind: time
  location: ACTIVE/game/src/04_save.js:122
  snippet: `payload.ts = Date.now();`
  severity: medium
  note: Protected save module; left unchanged.
- kind: time
  location: ACTIVE/game/src/81_docket.js:157
  snippet: `existing.ts = entry.ts || existing.ts || Date.now();`
  severity: medium
  note: Docket archival timestamp; left unchanged pending policy call.
- kind: time
  location: ACTIVE/game/src/81_docket.js:168
  snippet: `ts: entry.ts || Date.now()`
  severity: medium
  note: Docket archival timestamp; left unchanged pending policy call.
- kind: time
  location: ACTIVE/game/src/91_scenes.js:2
  snippet: `Date.now() occurs in completeRun docket timestamp and ShiftEnd skip timing on minified scene source line.`
  severity: medium
  note: Scene wall-clock timing; left unchanged to avoid behavior drift.

## M4 - Asset Usage Audit

Inventory summary: 33 PNG assets on disk; 25 referenced `art/*.png` paths in `src/`; 8 orphan candidates; 0 missing referenced assets.

- kind: asset_orphan
  key: unknown
  path: art/cactus_ed_in_game_sprite.png
  severity: low
  note: Asset exists on disk but no `src/` art path reference was found; do not delete without later review.
- kind: asset_orphan
  key: unknown
  path: art/cactus_ed_portraits_masked.png
  severity: low
  note: Asset exists on disk but no `src/` art path reference was found; do not delete without later review.
- kind: asset_orphan
  key: unknown
  path: art/cactus_ed_portraits_unmasked.png
  severity: low
  note: Asset exists on disk but no `src/` art path reference was found; do not delete without later review.
- kind: asset_orphan
  key: unknown
  path: art/paper_hr_memo.png
  severity: low
  note: Asset exists on disk but no `src/` art path reference was found; do not delete without later review.
- kind: asset_orphan
  key: unknown
  path: art/stamps_sheet.png
  severity: low
  note: Asset exists on disk but no `src/` art path reference was found; do not delete without later review.
- kind: asset_orphan
  key: unknown
  path: art/ui_clipboard.png
  severity: low
  note: Asset exists on disk but no `src/` art path reference was found; do not delete without later review.
- kind: asset_orphan
  key: unknown
  path: art/ui_locker.png
  severity: low
  note: Asset exists on disk but no `src/` art path reference was found; do not delete without later review.
- kind: asset_orphan
  key: unknown
  path: art/ui_training_poster.png
  severity: low
  note: Asset exists on disk but no `src/` art path reference was found; do not delete without later review.
- kind: asset_oversize
  key: paper_safety_poster
  path: art/paper_safety_poster.png
  size_bytes: 472149
  severity: low
- kind: asset_oversize
  key: prop_stamp_pad
  path: art/prop_stamp_pad.png
  size_bytes: 445255
  severity: low
- kind: asset_oversize
  key: receipt_crest_benefits
  path: art/crest_benefits_enrollment.png
  size_bytes: 429858
  severity: low
- kind: asset_oversize
  key: receipt_crest_orientation
  path: art/crest_orientation_bureau.png
  size_bytes: 423617
  severity: low
- kind: asset_oversize
  key: supervisor_silhouette
  path: art/supervisor_silhouette.png
  size_bytes: 413468
  severity: low
- kind: asset_oversize
  key: prop_coffee_cup
  path: art/prop_coffee_cup.png
  size_bytes: 408005
  severity: low
- kind: asset_oversize
  key: unknown
  path: art/paper_hr_memo.png
  size_bytes: 396359
  severity: low
- kind: asset_oversize
  key: enemy_compliance_auditor
  path: art/enemy_compliance_auditor.png
  size_bytes: 361326
  severity: low
- kind: asset_oversize
  key: unknown
  path: art/ui_locker.png
  size_bytes: 338955
  severity: low
- kind: asset_oversize
  key: paper_expired_id
  path: art/paper_expired_id.png
  size_bytes: 275093
  severity: low
- kind: asset_oversize
  key: receipt_seal
  path: art/seal_counterfeit_educational_org.png
  size_bytes: 262137
  severity: low
- kind: asset_oversize
  key: shift_end_reveal
  path: art/screen_unmasked_reveal.png
  size_bytes: 229349
  severity: low
- kind: asset_oversize
  key: coworker_mascot_variants
  path: art/coworker_mascot_variants.png
  size_bytes: 226704
  severity: low
- kind: asset_oversize
  key: splash_world_benefits
  path: art/env_w2_benefits_enrollment.png
  size_bytes: 215176
  severity: low
- kind: asset_oversize
  key: unknown
  path: art/ui_training_poster.png
  size_bytes: 205976
  severity: low
- kind: asset_oversize
  key: unknown
  path: art/cactus_ed_portraits_unmasked.png
  size_bytes: 205103
  severity: low
- kind: asset_oversize
  key: enemy_deadline_wraith
  path: art/enemy_deadline_wraith.png
  size_bytes: 189746
  severity: low
- kind: asset_oversize
  key: unknown
  path: art/cactus_ed_portraits_masked.png
  size_bytes: 189501
  severity: low
- kind: asset_oversize
  key: splash_world_rasta
  path: art/env_w3_rasta_corp.png
  size_bytes: 185897
  severity: low
- kind: asset_oversize
  key: splash_title
  path: art/title_cold_open.png
  size_bytes: 184996
  severity: low
- kind: asset_oversize
  key: splash_world_orientation
  path: art/env_w1_orientation_bureau.png
  size_bytes: 184320
  severity: low
- kind: asset_oversize
  key: prop_filing_cabinet
  path: art/prop_filing_cabinet.png
  size_bytes: 181794
  severity: low
- kind: asset_oversize
  key: shift_end_after
  path: art/screen_end_of_shift.png
  size_bytes: 178269
  severity: low
- kind: asset_oversize
  key: prop_archive_box
  path: art/prop_archive_box.png
  size_bytes: 175562
  severity: low
- kind: asset_oversize
  key: unknown
  path: art/stamps_sheet.png
  size_bytes: 171930
  severity: low
- kind: asset_oversize
  key: enemy_telegraph_windup
  path: art/enemy_telegraph_windup.png
  size_bytes: 167483
  severity: low
- kind: asset_oversize
  key: receipt_brand_mascot
  path: art/cactus_ed_brand_mascot.png
  size_bytes: 132792
  severity: low
- kind: asset_oversize
  key: carpet_tile_seamless
  path: art/carpet_tile_seamless.png
  size_bytes: 123457
  severity: low
- kind: asset_oversize
  key: unknown
  path: art/ui_clipboard.png
  size_bytes: 120250
  severity: low
- kind: asset_oversize
  key: fluorescent_light_fixture
  path: art/fluorescent_light_fixture.png
  size_bytes: 111167
  severity: low

## M6 - Replay Corpus Expansion Gold Hashes

Existing fixture md5s remained unchanged. New fixture md5s:

- file: ACTIVE/game/_canon/replays/cehp/w1_orientation_obedient.json
  md5: 959e9ea8165a6e07ba7f88086c87e363
  note: Orientation full traversal, obedient debug profile.
- file: ACTIVE/game/_canon/replays/cehp/w2_benefits_atrium_partial.json
  md5: 83350e61d274787443ea882bccf1eb19
  note: Benefits atrium follow path pins `premiumSecured=true` and W11 auth/plan fragment ids.
- file: ACTIVE/game/_canon/replays/cehp/w3_rasta_rushed.json
  md5: a412c8427605feef317987764b0a018b
  note: Rasta rushed rest path pins `rushedRest=true` and W11 rushed-path fragment ids.

## M7 - TODO/FIXME Triage + Stale Doc Audit

- kind: todo_triage
  location: ACTIVE/game/src/73_world_rasta.js:68
  category: stale
  action: removed
  note: Runtime implementation already exists in `76_world_rasta_runtime.js` for sync platforms and sorting redirects.
- kind: todo_triage
  location: ACTIVE/docs/CODEBASE_AUDIT.md:284
  category: stale
  action: updated
  note: Audit now records the closed runtime TODO and points to `scan-results.md` as a historical snapshot.
- kind: todo_triage
  location: ACTIVE/docs/scan-results.md:9
  category: stale
  action: marked_stale
  note: Generated 2026-03-15 report still contains TODO count language; header now warns not to use it as current health.
- kind: todo_triage
  location: ACTIVE/docs/STUDIO_DASHBOARD.md:46
  category: stale
  action: report_only
  note: Historical dashboard row, not current runtime source.
- kind: todo_triage
  location: ACTIVE/docs/PROJECT_REDISCOVERY_AUDIT.md:329
  category: stale
  action: report_only
  note: Historical reference to an older ordered TODO plan.
- kind: todo_triage
  location: ACTIVE/game/scripts/studio-scan.sh:66
  category: actionable_later
  action: keep
  note: Scan implementation owns TODO/FIXME counting; hits at lines 66-68 and 191-193 are expected script internals.
- kind: stale_doc
  location: ACTIVE/docs/W7_LENS_AND_FEEL_SPRINT.md:3
  category: stale
  action: closure_stamp
  note: Marked closed under 19a1b10.
- kind: stale_doc
  location: ACTIVE/docs/W8_LENS_OF_RESEARCH_SPRINT.md:3
  category: stale
  action: closure_stamp
  note: Marked closed under 19a1b10.
- kind: stale_doc
  location: ACTIVE/docs/W9_SPRINT_DOC.md:3
  category: stale
  action: closure_stamp
  note: Marked closed under 19a1b10.
- kind: stale_doc
  location: ACTIVE/docs/W10_REDESIGN_SPRINT.md:5
  category: stale
  action: closure_stamp
  note: Marked closed under 19a1b10.
- kind: stale_doc
  location: ACTIVE/docs/PROPOSED_NEXT_TASK.md:5
  category: stale
  action: closure_stamp
  note: Marked superseded under 19a1b10.
- kind: stale_doc
  location: ACTIVE/docs/CEHP_LAUNCH_ARC.md:7
  category: stale
  action: closure_stamp
  note: Launch arc status now points to W10 close, W11 close, and W12 prep.
