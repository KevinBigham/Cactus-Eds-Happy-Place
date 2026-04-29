# CEHP LAUNCH ARC — W10 → W14 (2026-04-24 → 2026-05-29)

> **Written**: 2026-04-23 (Kevin greenlight session)
> **Author**: Reviewer (Claude Code Sonnet 4.6) — director-authorized 5-week plan
> **Launch lock**: **2026-05-29** (Kane Pixels × A24 Backrooms alignment; non-negotiable)
> **Kevin mode**: Teacher by day, director by text/evening. Maximum-autonomy school-hours window.
> **Status**: ACTIVE — W10 closed in 19a1b10; W11 content drop closed in a276f2d; W12 polish prep is the next launch-arc queue.

---

## Top-line

Five weeks. One launch. No more re-scopes.

- **W10** (2026-04-24 → 2026-05-03) — **FEEL PASS.** Rebuild the verbs, state machine, forgiveness windows, camera, squash/stretch, 60px Ed. No new content. Spec locked in [W10_REDESIGN_SPRINT.md](ACTIVE/docs/W10_REDESIGN_SPRINT.md).
- **W11** (2026-05-04 → 2026-05-10) — **CONTENT PASS.** Per-world signature enemy, per-world signature setpiece, 2-layer parallax, per-world mini-boss. The suit finally has teeth.
- **W12** (2026-05-11 → 2026-05-17) — **POLISH + LAUNCH PREP.** Audio decision, telegraph tightening, density audit, cross-browser 60fps, byte audit vs 400KB cap, autoplay harness extension, receipt gen update.
- **W13** (2026-05-18 → 2026-05-24) — **LAUNCH RUNWAY.** Trailer re-cut, CR pitch polish, DNS pre-provision, launch runbook dry-run, KNOWN_ISSUES + A11Y_STATUS refresh, final Kevin taste-gate.
- **W14** (2026-05-25 → 2026-05-29) — **LAUNCH WEEK.** Push to main, DNS flip, CR send, announce thread, trailer publish, monitoring. Ship.

Every week has: scope / deliverables / acceptance / Kevin checkpoints / risk / rollback.

---

## The five gates Kevin greenlit (2026-04-23)

Kevin's "READY!!!!" = silence-approves-defaults per [W10_REDESIGN_SPRINT.md](ACTIVE/docs/W10_REDESIGN_SPRINT.md) gate override protocol. All defaults **LOCKED**:

1. **Ed scale 32 → 60 px visible** — APPROVED (16.6% viewport target)
2. **Run cap 180 px/s (start; bump to 220 if sluggish post-Phase-4 playtest)** — APPROVED
3. **CRT rim-light on Ed (subtle cyan/magenta 1px pulse)** — APPROVED
4. **Byte ceiling raise 300 → 350 KB** — APPROVED (358,400 B hard cap)
5. **Defer hub / RPS / new enemies / rideables / setpieces to W11+** — APPROVED DEFER

Kevin retains override at any checkpoint. Defaults hold unless he types `GATE N <override>`.

---

## Calendar

| Week | Dates | Theme | Builder load | Reviewer load | Kevin load |
|---|---|---|---|---|---|
| W10 | Mon 2026-04-24 → Fri 2026-05-03 | Feel Pass | Heavy (7 phases) | Medium (verify matrix per phase) | **3 checkpoints** (Phase 2 / 4 / 6) |
| W11 | Mon 2026-05-04 → Sun 2026-05-10 | Content Pass | Heavy (per-world × 3) | Medium (tone + density audits) | **2 checkpoints** (mid-week / end) |
| W12 | Mon 2026-05-11 → Sun 2026-05-17 | Polish + Launch Prep | Medium-heavy | Heavy (runbook rehearsal) | **2 checkpoints** (audio call / density call) |
| W13 | Mon 2026-05-18 → Sun 2026-05-24 | Launch Runway | Medium | Heavy (trailer + CR + runbook) | **1 final taste-gate** (Fri) |
| W14 | Mon 2026-05-25 → **Fri 2026-05-29** | Launch Week | Light (monitor only) | Light (monitor only) | **Full ownership** (push / DNS / CR / announce) |

School-hours window (Kevin at Blue Springs HS): M-F 0700-1500. Maximum autonomy in this window across W10-W13.

---

## W10 — FEEL PASS (2026-04-24 → 2026-05-03)

**Full spec**: [ACTIVE/docs/W10_REDESIGN_SPRINT.md](ACTIVE/docs/W10_REDESIGN_SPRINT.md)

### Scope summary
Seven phases, ~7-10 working days, Codex-paced.

1. **Phase 1** — Architecture spine (fixed-timestep accumulator, frame-count input buffer, data-driven cancel matrix). `src/04_fixed_step.js`, `src/05_input_buffer.js`, `src/06_cancel_matrix.js`. ~2 KB.
2. **Phase 2** — Ed 18-state machine with priority stack. `src/07_ed_state.js`. Autoplay must MATCH after. ~1.5 KB. **Kevin checkpoint 1.**
3. **Phase 3** — Verb set: ground dash 260 px/s, double jump 82%, wall-slide + wall-jump, slide/roll with jump-cancel, diagonal aim ±35°. NO air dash. ~2 KB.
4. **Phase 4** — Forgiveness + hit-stop: coyote 100ms, jump buffer 100ms, variable jump cut 0.60 in 180ms, corner forgive 6px, ledge snap 8×10px, apex gravity × 0.90 / fall × 1.12, hit-stop 67/50/17ms, 900ms i-frames. ~1.5 KB. **Kevin checkpoint 2.**
5. **Phase 5** — Camera lead + settle + dip + squash/stretch + seeded shake. ~1 KB.
6. **Phase 6** — Ed 32 → 60px sprite sheet (48×64 canvas, 22×46 collider, ~30 frames across 18 states + CRT rim-light). ~10 KB. **Kevin checkpoint 3.**
7. **Phase 7** — Verify + byte audit + 8-10 new tests. ~1 KB.

### Acceptance
- [ ] All 7 phases GREEN per W10 DoD
- [ ] `node build.js` ≤ 358,400 B
- [ ] `node scripts/check_save_schema.js` pass
- [ ] `node --test tests/rebuild_logic.test.mjs` — ≥53 tests GREEN
- [ ] Autoplay orientation / benefits / rasta all `determinism: MATCH`
- [ ] Sacred-constraint sweep clean
- [ ] 3 Kevin checkpoints passed
- [ ] `ACTIVE/docs/W10_RETROSPECTIVE.md` authored

### Risk + rollback
- **Risk 1**: State machine breaks autoplay MATCH in Phase 2. **Rollback**: revert `src/07_ed_state.js`, re-land the `04/05/06` spine only, reschedule state machine to Phase 2b after spine soaks 24h.
- **Risk 2**: 60px sprite pushes over 358,400 B in Phase 6. **Rollback**: skip rim-light first, then compact state machine headers (~500B reclaim), then minify 89_ed_perform.js (cost: W15 readability-restore task).
- **Risk 3**: Phase 4 forgiveness reads "gummy" to Kevin. **Rollback**: dial coyote 100 → 80ms, jump buffer 100 → 80ms, cut-ratio 0.60 → 0.55. Taste-gate, not a code revert.

### Kevin checkpoints (W10)
- **After Phase 2** (state machine lands): bytes + autoplay reports + 30s W1 capture for visual parity.
- **After Phase 4** (forgiveness + hit-stop): browser playtest — "does the suit feel worn?"
- **After Phase 6** (60px Ed): visual taste-gate on new Ed sprite per world.

---

## W11 — CONTENT PASS (2026-05-04 → 2026-05-10)

**Theme**: Give each world one signature threat + one signature setpiece + a mini-boss. Cap per-world scope tight so we don't slip.

### Scope — per-world deliverables

| World | New enemy | Signature setpiece | Mini-boss | Parallax |
|---|---|---|---|---|
| W1 Orientation | **Compliance Auditor** (shielded blocker; shield drops on stamp-interaction telegraph) | **Trust Fall** (vertical drop sequence; coyote-window-dependent; wall-slide recovery) | Supervisor Silhouette (3-phase: filing paperwork → calling HR → stamp attack) | 2 layers (far cubicles + near fluorescent bands) |
| W2 Benefits | **Deadline Wraith** (charger; telegraph windup; avoided by slide-dodge) | **Open Concept** (maze chase with line-of-sight enemy pursuit) | Enrollment Officer (3-phase: clipboard → rubber-stamp barrage → signature demand) | 2 layers (far enrollment kiosks + near deductible-weights) |
| W3 Rasta | **Reply-All Locust** (swarm; 3-5 entities; destroyed by crowd-control dash) | **Supply Chain** (conveyor-over-incinerator; timing + wall-jump dependent) | Logistics Foreman (3-phase: pallet-jack → conveyor-reverse → incinerator-cone) | 2 layers (far warehouse ceiling + near box towers) |

### Phase plan (W11)

- **Phase 1** (Mon 2026-05-04) — New enemy archetype bus in `60_enemies.js`: shielded-blocker + charger + swarm types added. ~1.5 KB.
- **Phase 2** (Tue 2026-05-05) — W1 Compliance Auditor art + wire-in + Trust Fall room authored via existing room-authoring pattern. ~2 KB.
- **Phase 3** (Wed 2026-05-06) — W2 Deadline Wraith + Open Concept chase room. ~2 KB.
- **Phase 4** (Thu 2026-05-07) — W3 Reply-All Locust + Supply Chain setpiece. ~2 KB.
- **Phase 5** (Fri 2026-05-08) — 3 mini-bosses (3 phases each; RPS weakness pattern deferred — these are telegraph-based, no meta-systems). ~3 KB.
- **Phase 6** (Sat 2026-05-09) — 2-layer parallax wire-in + verify matrix + `W11_RETROSPECTIVE.md`. ~1 KB.
- **Phase 7** (Sun 2026-05-10) — **Buffer day** for overrun. If all green: Kevin full W1→W2→W3 playthrough + ratification.

### Byte budget (W11)
Starting from W10 projected 305-309 KB. W11 adds ~11.5 KB → **projected 316-320 KB on 358,400 B cap** (~38-42 KB runway). Reviewer holds minify lever in reserve.

### Acceptance
- [ ] Each world has 1 new enemy + 1 new setpiece + 1 mini-boss
- [ ] Each mini-boss has 3 telegraph-based phases; no RPS/weakness-cycling (deferred)
- [ ] Parallax 2-layer per world; no performance regression in 60fps audit
- [ ] Autoplay determinism MATCH on all 3 worlds
- [ ] New enemy/boss tests in `rebuild_logic.test.mjs` (≥8 new tests)
- [ ] `W11_RETROSPECTIVE.md` authored

### Risk + rollback
- **Risk 1**: Mini-boss scope blows up Codex budget. **Rollback**: ship 2 bosses instead of 3; W3 ships telegraph-heavy mini-encounter instead. Kevin-gated.
- **Risk 2**: Parallax 60fps regression on low-end browsers. **Rollback**: parallax becomes single-layer; save 2 layers for W12 polish.
- **Risk 3**: New enemy types destabilize density. **Rollback**: Encounter Director caps tightened (enemy 15 → 12, angles 2 → 1); no enemy removals.

### Kevin checkpoints (W11)
- **Mid-week (Wed after Phase 3)**: W1+W2 bosses + enemies — do the threats read "corporate horror" or "action game"?
- **End-week (Sun)**: full tour — what's the *one* thing that feels off?

---

## W12 — POLISH + LAUNCH PREP (2026-05-11 → 2026-05-17)

**Theme**: Everything that's not new code, but must land before W13 runway.

### Scope

1. **Audio decision (Kevin taste-gate, Monday)** — chip-tune (CEHP legacy) vs analog drone (corporate-horror fidelity). Kevin decides by listening to two 30s mixes. Codex implements winning track.
2. **Telegraph tightening** — ChatGPT DR enemies-and-threats audit; tune windup windows for cleanliness (if any are too short → feels unfair; if too long → feels sluggish).
3. **Density audit** — cap ≤5 decision-grade threats per screen. Reviewer runs 15-minute playthrough with a pencil; flags any screen that over-crowds.
4. **Cross-browser 60fps** — Chrome / Firefox / Safari / Edge on MBA baseline. Any regressions get PR'd.
5. **Byte audit vs 400KB** — rebase cap to 400 KB for W12 (one-time bump; Kevin-gated if needed). Current projection 316-320 KB → plenty of runway. If audio MP3 blows it, we need to re-decide.
6. **Autoplay harness extension** — W11 new bosses + setpieces need deterministic probe coverage. New probe fixtures for mini-bosses.
7. **Receipt gen update** — W10/W11 new verbs (dash, wall-jump, slide-cancel, mini-boss defeated) generate new receipt fragments. Tone bias (R03) still applies; ensure ≥55% benign / ≤10% malicious holds across expanded fragment set.
8. **Accessibility refresh** — `ACTIVE/docs/A11Y_STATUS.md` updated for new verbs (dash + wall-jump + slide remappable).
9. **Known-issues sweep** — `ACTIVE/docs/KNOWN_ISSUES.md` closed against W10/W11 retrospectives.

### Phase plan (W12)

- **Mon** — Audio decision + Kevin taste-gate. Codex implements by EOD Tue.
- **Tue-Wed** — Telegraph tightening + density audit + cross-browser.
- **Thu** — Byte audit + 400KB cap Kevin-gate + autoplay harness extension.
- **Fri** — Receipt gen update + A11y refresh.
- **Sat** — Known-issues sweep + `W12_RETROSPECTIVE.md`.
- **Sun** — Buffer day + Kevin end-week gate: "are we one build-break away from a launch?"

### Byte budget (W12)
Audio asset is the wildcard. Chip-tune ~50-80KB. Analog drone procedural (Web Audio) = 0 KB. Kevin's call. **If audio pushes over 400 KB, we cut to procedural audio. Non-negotiable.**

### Acceptance
- [ ] Audio decision + track shipped
- [ ] Density ≤5 decision-grade threats per screen (reviewer pencil pass clean)
- [ ] 60fps sustained Chrome / Firefox / Safari / Edge on MBA
- [ ] Byte count ≤ 409,600 B (400 KB) — **not the 358,400 B cap**; Kevin re-authorized
- [ ] Autoplay coverage extended to all W11 bosses/setpieces
- [ ] Receipt tone bias holds (≥55% benign / ≤10% malicious)
- [ ] `A11Y_STATUS.md` + `KNOWN_ISSUES.md` current
- [ ] `W12_RETROSPECTIVE.md` authored

### Risk + rollback
- **Risk 1**: Audio blows byte budget + performance. **Rollback**: procedural Web Audio only (zero asset cost). Locked as fallback from Monday Kevin gate.
- **Risk 2**: Cross-browser reveals Firefox regression. **Rollback**: document in `KNOWN_ISSUES.md`; ship Chrome-primary with Firefox-degraded. Non-blocker for launch.
- **Risk 3**: Density pass requires cutting authored rooms. **Rollback**: no room cuts; instead reduce Encounter Director caps.

### Kevin checkpoints (W12)
- **Monday**: audio track A vs B, 2-minute listen.
- **Sunday**: "are we one build-break from launch?" — yes = proceed to W13; no = identify blocker, escalate.

---

## W13 — LAUNCH RUNWAY (2026-05-18 → 2026-05-24)

**Theme**: Everything off-game that must be ready by Friday 2026-05-22 (1 week pre-launch).

### Scope

1. **Trailer re-cut** — current trailer at `ACTIVE/delivery/w6_launch/cehp_launch_trailer_final.mp4` is pre-W10 gameplay. Re-cut using new verbs + 60px Ed + new enemies + new setpieces. Target 28-45s; 1920×1080; 24fps.
2. **CR pitch polish** — `ACTIVE/marketing/cr_pitch_v1/SEND_READY_PACKET.md` refresh: new screenshots, updated cover note reflecting post-rebuild game state.
3. **DNS pre-provision (Kevin-gated)** — Kevin purchases domain (counterfeit-educational.org or successor) by Tue. DNS records staged (not flipped).
4. **Launch runbook dry-run** — reviewer walks `ACTIVE/docs/LAUNCH_RUNBOOK_W6.md` end-to-end against staging clone; updates for W10-W12 state.
5. **`KNOWN_ISSUES.md` + `A11Y_STATUS.md` final** — refreshed for launch-day snapshot.
6. **Final Kevin taste-gate (Fri 2026-05-22)** — full playthrough W1 → W2 → W3 + Docket + receipt card. If any blocker: enter W14 in emergency-polish mode, not launch mode. If green: W14 is ship-week.

### Phase plan (W13)

- **Mon** — Trailer capture run (new gameplay). Kevin picks take.
- **Tue** — DNS purchase gate (Kevin) + trailer edit Phase 1 draft.
- **Wed** — CR pitch polish + trailer edit Phase 2 (music/text overlays).
- **Thu** — Launch runbook rehearsal + trailer Phase 3 (final).
- **Fri** — **Final Kevin taste-gate.** GREEN = W14 proceed. Not-green = escalate.
- **Sat** — Contingency day.
- **Sun** — Monitoring systems warmup (incident log, rollback rehearsal, verify_live_domain.mjs against staging).

### Acceptance
- [ ] Trailer re-cut published to `ACTIVE/delivery/w14_launch/cehp_launch_trailer_v2.mp4`
- [ ] CR pitch packet v2 ready
- [ ] Domain purchased; DNS records staged (not live)
- [ ] Launch runbook current against W10-W12 state
- [ ] `KNOWN_ISSUES.md` + `A11Y_STATUS.md` current
- [ ] Kevin final taste-gate GREEN

### Risk + rollback
- **Risk 1**: Kevin final taste-gate flags blocker (Friday 2026-05-22). **Rollback**: W14 becomes polish-week; launch slips to 2026-06-05 (hard ceiling — 1 week slip max before we miss Kane Pixels × A24 window entirely).
- **Risk 2**: Domain purchase delayed. **Rollback**: ship on default `kevinbigham.github.io/Cactus-Eds-Happy-Place/` URL (already live). Domain flip becomes post-launch item.
- **Risk 3**: CR pitch response delays. **Non-blocker** — CR pitch is mailed Monday W14; response not required for public launch.

### Kevin checkpoints (W13)
- **Tue**: domain purchase decision.
- **Fri**: **Final launch taste-gate.** 15-minute playthrough. Ship / hold call.

---

## W14 — LAUNCH WEEK (2026-05-25 → Fri 2026-05-29)

**Theme**: Monitoring mode. No new code. Kevin owns the trigger.

### Scope (day-by-day)

- **Mon 2026-05-25 (Memorial Day)** — CR pitch sent. Kevin at BSHS (no school — teacher workday). Light monitoring. Trailer teaser posted to personal channels (optional, Kevin-gated).
- **Tue 2026-05-26** — Final cross-browser smoke run. Reviewer updates `LAUNCH_INCIDENT_LOG.md`.
- **Wed 2026-05-27** — DNS pre-flight: TTL lowered to 300s on existing records; new records verified against staging.
- **Thu 2026-05-28 (T-1)** — **Push-to-main rehearsal** against staging clone. Runbook walkthrough. Kevin review of announce thread drafts.
- **Fri 2026-05-29 (T-0) — LAUNCH DAY** — Kevin's hand on the trigger. Time-of-day Kevin's call (target: 5pm CT after school).
  - Push to main (Kevin-only)
  - DNS flip
  - CR send (if not already sent Monday)
  - Announce thread (Discord + Twitter/X + Bluesky + Reddit sequence — Kevin's order)
  - Trailer publish (YouTube)
  - Incident log: T-0 + T+1h + T+4h + T+24h check-ins
  - Reviewer + Codex on standby for emergency rollback only

### Acceptance
- [ ] Live at chosen domain OR `kevinbigham.github.io/Cactus-Eds-Happy-Place/`
- [ ] Trailer published
- [ ] CR pitch sent
- [ ] Announce thread posted
- [ ] T-0 + T+1h + T+4h + T+24h monitoring clean
- [ ] `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md` closed out

### Risk + rollback
- **Risk 1**: Launch-day bug in production. **Rollback**: `ROLLBACK_REHEARSAL_W6.md` procedure — revert to prior commit, redeploy, incident log entry.
- **Risk 2**: DNS propagation fails. **Rollback**: ship on github.io URL as primary; domain flip becomes T+24h task.
- **Risk 3**: Monitoring reveals performance regression under load. **Note**: static site on GitHub Pages — load is not really a risk. Primary concerns: broken link, missing asset, save-corruption bug. Each has a documented rollback path.

### Kevin-only gates
All W14 actions are Kevin-owned. Reviewer and Codex on standby for verification/emergency-rollback only.

---

## School-hours autonomy protocol (W10-W13)

### The window
M-F 0700-1500 Central. Kevin unavailable except at designated checkpoints.

### Codex rules (builder)
- **Run phases continuously** during school hours. Do NOT stop at end-of-phase for Kevin ACK unless phase is a **Kevin-checkpoint phase** (Phase 2, 4, 6 of W10; mid-week + end-week of W11; audio-decision Monday of W12; Friday of W13).
- **Verify after every phase**: `build.js` + `check_save_schema.js` + `rebuild_logic.test.mjs` + autoplay on all 3 worlds. If GREEN, proceed to next phase. If RED, stop and post handoff JSON.
- **Update `.codex/CEHP/status.md`, `handoff.md`, `changelog.md`** after each phase GREEN. Use prepend pattern (newest entry on top).
- **Byte ceiling**: 358,400 B (350 KB) through W11. 409,600 B (400 KB) from W12 onward.
- **Sacred constraints frozen**: ES5, seeded RNG, save schema v2, single-file ship, Phaser CDN, no push to main.
- **No scope creep**: stay inside the phase's scope. Out-of-scope items go to `ACTIVE/docs/BACKLOG.md` as proposals; never self-land.

### Reviewer rules (parallel lane)
- **File-lane discipline**: reviewer owns `docs/**`, `scripts/**`, `.codex/CEHP/**`. Codex owns `src/**`, `art/**`, `index.html`, `tests/**`. No overlap.
- **After every Codex phase GREEN**: re-run verify matrix independently + sacred-constraint sweep on touched files. Sign off with GREEN/YELLOW/RED in `.codex/CEHP/status.md`.
- **Docs kept current**: update W{N}_RETROSPECTIVE.md at phase close. Maintain `KNOWN_ISSUES.md`.
- **Escalate to Kevin only on RED**: everything else ships quietly. Kevin reads the status.md at end-of-day.

### Kevin rules (director)
- **Read end-of-day status.md** (≤ 5 min). Either silence (defaults hold) or a short override.
- **Checkpoint responses**: "ship", "hold", "GATE N override", "revert". One sentence max.
- **Hard escalation window**: 5pm CT. If RED, Kevin decides before 9pm whether to hold / revert / overnight.

### Escalation triggers (Codex → Kevin immediate)
- Save schema would need a v3 bump (never autonomous)
- Byte ceiling exceeded after one minify attempt
- Autoplay determinism breaks and cannot be restored in 30 min
- Sacred-constraint violation detected
- Kevin-gated action requested (push, deploy, domain, DNS, CR, announce, trailer)

### Escalation triggers (Reviewer → Kevin immediate)
- Codex lands code that touches reviewer's file lane (`docs/**`, `scripts/**`, `.codex/CEHP/**`) without handoff
- Sacred constraint violated and Codex missed it
- Byte budget projection goes negative on cap

---

## Post-launch (W15+, for reference only — not this sprint)

Parked in `ACTIVE/docs/BACKLOG.md` under "Later":

- **V2 content roadmap**: hub-and-spoke elevator macro, RPS boss weakness pattern, 6 secret paths (2 per world), 5 remaining corporate-horror enemies (Sycophant, Time-Thief, Severance, CC'd, PIP), 3 rideable contraptions (Pneumatic Tube, Floor Buffer, Document Shredder), Performance Reviews → DOCKET meta-loop, Corporate Assets temporary verbs.
- **HR Expansion** (Steam $14.99): Exit Interview Theater + Claims Adjustatory worlds.
- **Hand-pixeled Ed sprite**: if procedural 60px isn't enough post-launch.
- **Audio mix expansion**: if procedural Web Audio was the W12 call.
- **W15 readability restoration**: un-minify any module that got minified in W10-W12 byte crunches.

These are post-launch content. None touch the 2026-05-29 launch.

---

## Appendix A — checkpoint summary (at-a-glance)

| Checkpoint | Date | What Kevin does | Time |
|---|---|---|---|
| W10 Phase 2 | ~2026-04-28 | Read status.md; check autoplay MATCH | 5 min |
| W10 Phase 4 | ~2026-05-01 | Browser playtest forgiveness | 5 min |
| W10 Phase 6 | ~2026-05-03 | Visual gate on 60px Ed across 3 worlds | 10 min |
| W11 mid-week | 2026-05-06 | W1+W2 bosses/enemies tone check | 10 min |
| W11 end | 2026-05-10 | Full tour | 15 min |
| W12 audio | 2026-05-11 | Two 30s track listens | 5 min |
| W12 end | 2026-05-17 | "Ship-ready?" call | 10 min |
| W13 DNS | 2026-05-19 | Domain purchase decision | 5 min |
| W13 final | **2026-05-22 Fri** | **Final launch taste-gate** | 15 min |
| W14 T-0 | **2026-05-29 Fri** | **Launch** | Hours |

**Total Kevin load across 5 weeks**: ~90 minutes of checkpoint time + one launch day. Plus daily 5-min status.md reads.

---

## Appendix B — file lane reference

### Codex owns
- `ACTIVE/game/src/**` — all 40+ source modules
- `ACTIVE/game/art/**` — PNG assets (regen via image-gen allowed; originals backed up to `_originals/`)
- `ACTIVE/game/index.html` — concat output (never hand-edit)
- `ACTIVE/game/tests/**` — test suite
- `ACTIVE/game/build.js`, `ACTIVE/game/package.json`

### Reviewer owns
- `ACTIVE/docs/**` — all active docs including retrospectives, sprint plans, taste-gate logs
- `ACTIVE/game/scripts/**` — verify-cehp.sh, autoplay.mjs, verify_art_assets.mjs, etc.
- `.codex/CEHP/**` — status.md, handoff.md, changelog.md
- `README_Instructions on What To Do.md`

### Kevin-only (no agent writes without explicit request)
- Root-level config files (`.github/`, `.gitignore`, `CNAME`)
- Push to `main`
- Domain purchase / DNS
- Trailer publish / CR send / announce thread
- Save schema changes (no v3 without Kevin sign-off)
- Launch window shifts

---

## Appendix C — the one thing every week

Every week has one question Kevin answers with one word.

- **W10**: "Does the suit feel worn?" (Phase 4 checkpoint)
- **W11**: "Do the threats read corporate-horror or action-game?" (mid-week)
- **W12**: "Are we one build-break from launch?" (end-week)
- **W13**: "Ship?" (Friday final taste-gate)
- **W14**: "Launch?" (Friday, in Kevin's hands)

Five yes-or-no calls across five weeks. Everything else is Codex + Reviewer executing defaults.

---

## Appendix D — signal: stay-on / slip / emergency

**Stay-on signal** (default): every checkpoint GREEN, no Kevin override. Proceed to next phase/week.

**Slip signal** (recoverable): one RED checkpoint. Kevin decides: fix-and-continue, or slip 1 week. Slip budget: max 1 week before launch calendar breaks.

**Emergency signal** (launch-threatening): multiple RED checkpoints or sacred-constraint violation. Full stop. Kevin + reviewer + Codex sync. Launch slips to 2026-06-05 hardmax or launches in reduced scope.

Launch window is locked 2026-05-29. If we slip past 2026-06-05, we miss Kane Pixels × A24 alignment entirely and re-plan.

---

**End of arc. The game ships 2026-05-29. Eight teacher-weekdays and one launch Friday from now.**
