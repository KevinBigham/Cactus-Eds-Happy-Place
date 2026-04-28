# BACKLOG

> Rebuild sprint backlog. See `NEXT_TASK.md` for the single active task, `ACTIVE/docs/CEHP_LAUNCH_ARC.md` for the 5-week launch plan through 2026-05-29, and `PROPOSED_NEXT_TASK.md` for any off-arc proposal.
> Pre-rebuild certification items archived 2026-04-20 when FINAL_GAMEPLAN locked.

## Now
1. **CEHP-REBUILD-W10-FEEL-PASS** (active) → DKC × MMX × Contra feel pass. 7 phases: architecture spine / 18-state machine / verb set / forgiveness + hit-stop / camera + squash-stretch / 60px Ed / verify + byte audit. Kevin greenlit all 5 taste-gates 2026-04-23. Builder: Codex 5.4. Target end 2026-05-03. Master: `ACTIVE/docs/W10_REDESIGN_SPRINT.md`. Arc: `ACTIVE/docs/CEHP_LAUNCH_ARC.md`.

## Next (sprint queue — launch arc)

1. **CEHP-REBUILD-W11-CONTENT-PASS** (2026-05-04 → 2026-05-10) — Per-world signature enemy + signature setpiece + mini-boss + 2-layer parallax. W1 Compliance Auditor + Trust Fall + Supervisor mini-boss. W2 Deadline Wraith + Open Concept maze + Enrollment Officer. W3 Reply-All Locust + Supply Chain conveyor + Logistics Foreman. ~11.5 KB budget. See `CEHP_LAUNCH_ARC.md` W11.
2. **CEHP-REBUILD-W12-POLISH-PREP** (2026-05-11 → 2026-05-17) — Audio decision (chip-tune vs analog drone Kevin-gated Monday) + telegraph tightening + density audit ≤5 decision-grade threats/screen + cross-browser 60fps + byte re-cap to 400KB + autoplay extension + receipt gen update + A11y/known-issues refresh. See `CEHP_LAUNCH_ARC.md` W12.
3. **CEHP-REBUILD-W13-LAUNCH-RUNWAY** (2026-05-18 → 2026-05-24) — Trailer re-cut + CR pitch polish + DNS pre-provision (Kevin-gated Tue) + runbook dry-run + KNOWN_ISSUES + A11Y_STATUS refresh + **final Kevin launch taste-gate Fri 2026-05-22**. See `CEHP_LAUNCH_ARC.md` W13.
4. **CEHP-REBUILD-W14-LAUNCH** (2026-05-25 → **Fri 2026-05-29**) — Push to main (Kevin-only) + DNS flip + CR send + announce thread + trailer publish + incident log monitoring. Kevin owns the trigger. See `CEHP_LAUNCH_ARC.md` W14.

## Done
- **CEHP-REBUILD-W1** — Core-first slice. Reviewer GREEN 2026-04-20. Kevin signoff.
- **CEHP-REBUILD-W2** — World 1 Orientation Bureau. Reviewer GREEN + Kevin signed off 2026-04-20 ("HELL YEAH FOLLOW THAT RECOMMENDATION").
- **CEHP-REBUILD-W3** — World 2 Benefits Enrollment Atrium. Reviewer GREEN + Kevin signed off 2026-04-20 ("LFG"). 5 taste notes ratified.
- **CEHP-REBUILD-W4** — World 3 Rasta Corp Logistics Hub. Reviewer GREEN + Kevin signed off 2026-04-20 ("GREEN LIGHT! APPROVED! SALUTE! LFG!"). 5 taste notes ratified.
- **CEHP-REBUILD-W5** — Polish / thermal mode / docket / CNAME prep / trailer frames / CR pitch assets / W1 silhouette. Kevin signed off 2026-04-21 ("get Codex to party with us"). 4 taste notes carried forward.
- **CEHP-REBUILD-W6-LAUNCH** — Closed via soft-launch pivot 2026-04-21. Trailer packaged, launch runbook staged, rollback rehearsal documented, CR packet staged, Discord sidecar verified, live-domain smoke helper written. Commit aec0a6c pushed to `main`; GitHub Actions deploy succeeded; soft-launch live at `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/`. Kevin-gated items (domain purchase, DNS flip, trailer publish, CR send, announce thread) absorbed into W14.
- **CEHP-REBUILD-W7-LENS-AND-FEEL** — Visual contract sprint. Phases 1-3 shipped: LensKit (`85_lens.js` Bayer dither + scanlines + vignette), LightKit (`86_light.js` ambient radial leak + ADD-blend sign emissives + deterministic flicker), PropKit (`87_props.js` 5 `cehp:prop:*` paper-prop families wrapping benefits premiums with seeded wobble). 60fps preserved across Chrome/Firefox/Safari. Sacred-constraint sweep clean. Kevin-gated transition to W8 via research synthesis.
- **CEHP-REBUILD-W8-LENS-OF-RESEARCH** — 5-phase research sprint (R03/R04/R01/R02/R05). R03 receipt tone bias (BENIGN_BIAS=0.35, 63.7% benign / 4.7% malicious). R04 Rayman camera (velocity lead + fall anticipation + apex bias). R01 MMX enemy telegraph (windup/active/recovery/cooldown phases). R02 Encounter Director (`62_director.js` caps 15 enemies / 8 projectiles / 2 angles per 600ms). R05 Curiosity-pays-rent (`52_curiosity.js` sign:peek/sign:read subscription + 3-5000ms reward arm). 36/36 tests GREEN. 698B runway restored under 300KB ceiling.
- **CEHP-REBUILD-W9-READABILITY-AND-ART** — Combined readability restoration + art integration sprint. Phase 1 reveal regen (`screen_unmasked_reveal.png` Kevin-approved). Phase 2 typo audit (4 PNGs corrected: ui_locker, crest_orientation_bureau, crest_benefits_enrollment, env_w2_benefits_enrollment; COUNTEREEIT preserved only on seal + expired-ID). Phase 3 authored-readability restoration on `89_ed_perform.js` + `8A_air.js` + `52_curiosity.js` + `83_receipt_render.js` via `build.js` bundle-only banner/header/indent normalization. Phase 4 Track A wire-in: 12 PNGs with procedural fallback via `scene.textures.exists(...)`. Reviewer pass GREEN 2026-04-23. Kevin image taste-gate PASSED ("LOOKS SO DAMN GOOD! THE IMAGES ARE PERFECT!"). Build 287,826 B / 12,162 B runway. `cactus_ed_in_game_sprite.png` stays Kevin-gated HOLD.

## Later (post-launch V2 roadmap)

Parked until after 2026-05-29 launch. Do not touch during W10-W14 arc.

### Content expansion (W15+)
1. **Hub-and-spoke elevator macro** — ChatGPT DR + Gemini DR structural redesign: persistent hub floor with elevator portals to W1/W2/W3; shared save breadcrumbs; sets up HR Expansion later.
2. **RPS boss weakness pattern** — ChatGPT DR meta-loop: each boss has a rock/paper/scissors weakness telegraphed by room decor (posters, HR memos, elevator panel). Not in W11 mini-bosses (those are telegraph-based only).
3. **6 secret paths** (2 per world) — Meta Muse phenomenology: hidden routes that reward curiosity-pays-rent subscribers. Receipt fragments flagged `secretPath:true`.
4. **5 remaining corporate-horror enemies** — ChatGPT DR Sycophant (flatters Ed until he reads as doing bad work), Time-Thief (steals action-history), Severance (cuts trailing save fragments), CC'd (broadcast attack), PIP (Performance Improvement Plan — enters room with 3-strike countdown).
5. **3 rideable contraptions** — ChatGPT DR Pneumatic Tube (vertical fast-travel), Floor Buffer (horizontal sweeper + temporary shield), Document Shredder (destructible platform + timing hazard).
6. **Performance Reviews → DOCKET meta-loop** — weekly review aggregates runs; affects hub elevator panel; feeds into Corporate Assets temporary verbs economy.
7. **Corporate Assets temporary verbs** — single-run power-ups (Coffee Mug +dash range, Stapler +attack, Laminator +iframe) earned from Performance Review passes.
8. **3 per-world signature setpieces (full-throated)** — post-launch expansion of W11 mini-setpieces: Trust Fall (vertical gauntlet), Open Concept (maze-of-mirrors chase), Supply Chain (conveyor-over-incinerator sequence).
9. **5-layer parallax expansion** — Gemini Pro aesthetic spec: far cubicles / mid fluorescents / mid props / near dust / near foreground. W11 ships 2-layer only.
10. **Encounter Director caps revision** — enemies 15 → 20 / projectiles 8 → 12 / angles 2 → 3 spike once new enemy types land.

### Polish / content continuity
1. **Hand-pixeled final Ed sprite** — if procedural 60px (W10 Phase 6) isn't enough post-launch.
2. **1-2 hazard prop variants per world** — texture density.
3. **Audio mix expansion** — if W12 shipped procedural-only, add additive layers post-launch.
4. **Tighten remaining scene layouts** once lens has soaked.

### Long-range
1. **HR Expansion** (Steam $14.99) — Exit Interview Theater + Claims Adjustatory worlds. Held for post-`PUBLIC_LAUNCH` close-out.
2. **W15 readability restoration** — un-minify any module that got minified in W10-W12 byte crunches.
3. **Rayman-style verb-gated exploration** (ability-return-to-earlier-area across worlds) — touches save schema across worlds.

## Deferred (explicitly)
- `60_enemies.js` — *content* expansion beyond W11 new-enemy trio only if a world requires them post-launch.
- Walk-cycle animation for Ed — deferred indefinitely; deadpan stiffness is the joke.
- Music layer — if W12 shipped procedural-only, music stays deferred; silence is the asset.
- Public Appeals UI — compare seam ships invisible unless Kevin explicitly asks for the surface post-launch.

## Archaeology
- Legacy certification arc (CEHP-001 through CEHP-010, pre-rebuild) is retired. The 19,835-line runtime lives at `ARCHIVE/legacy_runtime_v1/index.html` as reference library. Save v1 blobs are preserved verbatim under `v2.legacy` via the archaeological migration.
- **PUBLIC_LAUNCH merged into W14**: domain purchase, DNS flip, trailer publish, CR send, announce thread, rollback rehearsal — all now executed in `CEHP-REBUILD-W14-LAUNCH` week 2026-05-25 → 2026-05-29.
