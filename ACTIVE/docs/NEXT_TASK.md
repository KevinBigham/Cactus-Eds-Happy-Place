# NEXT TASK

This file is the **task beacon**. There is always exactly ONE active task here.
When this task is complete, the completing agent updates this file with the next task from BACKLOG.md.

> **ONLY `TASK_OWNER_ROLE` GRANTS ACTIVATION.** If your role does not match `TASK_OWNER_ROLE`, stop and propose only.
> `CURRENT_STAGE` and `NEXT_HANDLER_ROLE` are informational — they do NOT grant activation.
> Write proposals to `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.
>
> **EDIT IN PLACE**: When updating this file, edit the metadata fields below directly. Never duplicate or append a second metadata block.

---

## TASK_ID: CEHP-REBUILD-W6-LAUNCH
## TITLE: Rebuild Week 6 — Launch Week / Cutover / Trailer Final / Outreach / Monitoring
## TASK_OWNER_ROLE: Builder (Codex 5.4)
## CURRENT_STAGE: 2026-04-21 local kickoff green — build/render/live-smoke passed; trailer package, CR packet, runbook, and rollback rehearsal staged; awaiting Kevin's DNS flip tonight
## NEXT_HANDLER_ROLE: Kevin (at each Kevin-gated gate) → Claude Opus 4.7 (post-launch reviewer pass)
## STATUS: ACTIVE
## DEADLINE: 2026-05-29 (Kane Pixels × A24 *Backrooms* launch window; fallback 2026-06-12; hard stop 8 weeks)

## CONTEXT

Weeks 1–5 are green. Three playable worlds (Orientation, Benefits, Rasta) ship in one HTML build (32 modules, 248,475-byte build output / 7,198 lines). Thermal receipts, THE DOCKET, domain prep (CNAME for `counterfeit-educational.org`), trailer frame captures, CR pitch assets, accessibility assist wiring, Discord bot hardening, and the `ACTIVE/delivery/w5_demo/` bundle all exist locally. Kevin signed off W5 on 2026-04-21 with authorization to proceed.

Week 6 is **launch week** — execution, not features. Cut over safely, publish the launch-facing materials Kevin already owns, rehearse rollback, and keep monitoring paths explicit. The public site, Discord bot, and CR outreach all need to move in a controlled sequence. Every step that touches the outside world is Kevin-gated.

## SCOPE (WEEK 6 ONLY)

**IN SCOPE:**

1. **DNS cutover verification** — once Kevin flips DNS at the registrar, verify `counterfeit-educational.org` serves the current build end-to-end (root route + `?docket=1` + receipt renders). Use `ACTIVE/docs/DNS_CUTOVER.md` as the playbook.
2. **Launch-day smoke pass** — full run of `bash ACTIVE/game/scripts/verify-cehp.sh` + an in-browser smoke on the live domain covering Title, each world, the docket archive, and `?settings=1`.
3. **Discord bot live-domain verification** — one real live-domain PNG render via `node ACTIVE/discord/bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal`, confirming output file is non-zero bytes and the image reads correctly.
4. **Trailer final packaging + upload support** — assemble the approved final edit from `ACTIVE/delivery/w5_demo/trailer_frames/` per `TRAILER_EDIT_BRIEF.md`, produce the final deliverable (MP4), and prepare a YouTube/Vimeo upload descriptor Kevin can publish. Kevin owns the publish button.
5. **Critical Reflex outreach package finalization** — polish `ACTIVE/marketing/cr_pitch_v1/` against `DESIGN_BRIEF.md`, assemble a single send-ready packet (cover note draft for Kevin's voice + attachments list), and stage it for Kevin. Kevin owns the send.
6. **Launch-day monitoring ticket / checklist / incident log prep** — create `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md` (empty at start) + a launch-day runbook referencing `LAUNCH_GO_NOGO.md`'s 4-phase checklist. Include per-phase acceptance criteria and rollback triggers.
7. **Dry-run rollback rehearsal** — before any public announce, rehearse the 3 rollback paths (DNS revert, Pages revert, Discord bot disable) against a staging fixture or a scratch branch. Document what rehearsal revealed.

**OUT OF SCOPE (W6):**

- Changing `cactusEd_save_v1` schema or v2 migration
- New worlds, new enemies, new mechanics
- Any receipt-weight rebalance without an explicit Kevin taste note
- DNS registrar changes (Kevin-gated)
- Sending public posts / the CR pitch / announce threads (Kevin-gated)
- Steam packaging beyond launch-facing asset prep (post-launch HR Expansion work)
- Adding a public-facing Appeals menu (the compare seam ships invisible per W5 signoff; surface is a W6-or-later taste call)
- Monetization, analytics beacons, telemetry, notifications, streak mechanics

## SACRED CONSTRAINTS (DO NOT BREAK)

- Single-file shipped `index.html` artifact. Source stays modular under `ACTIVE/game/src/`.
- ES5 only. No `let`/`const`/arrow/template literals/spread/destructuring. 5 straight weeks of zero violations across 32 modules — do not break the streak in launch week.
- Phaser 3 via CDN — no bundler, no npm install for the game. Build stays `node build.js`.
- `cactusEd_save_v1` contract preserved via v2 migration + archaeological layer. Launch-week freeze: no schema changes.
- Seeded LCG RNG only — never `Math.random()`.
- Ed's voice rules hold (deadpan, ≤8 words per line, no exclamation marks).
- Cigarette stays unlit in all W3 paths.
- `ns.TUNING.JUMP_VELOCITY` global stays un-mutated — run-scoped jump changes go through the existing `ed.jumpVelocity` seam only.
- No predatory retention. No daily-login hooks. No streak mechanics. The docket is a public archive, not a FOMO device.

## TONE REQUIREMENTS

- **Launch is quiet.** No fanfare embedded in the product. The receipt does the work.
- **CR outreach voice = Kevin's voice.** Codex supplies assets and drafts; Kevin rewrites every word that reaches a human at Critical Reflex.
- **Trailer trusts the game.** Seed stamp → frames → receipt print → cut. SFX only (keyboard clack, printer whir, silence). No music swell. No wipes. No logo sting.
- **Incident response is calm.** If something breaks during launch, rollback first, document second, broadcast last.

## DEFINITION OF DONE (WEEK 6)

- [ ] DNS cutover verified on the live domain (`counterfeit-educational.org` serves current build, `?docket=1` works, receipts render)
- [ ] Launch-day smoke pass green on live domain
- [ ] Live-domain Discord render works end-to-end (real PNG, non-zero bytes, correct image)
- [x] Trailer final packaged + upload descriptor ready for Kevin
- [x] CR pitch packet finalized + cover-note draft ready for Kevin's voice pass
- [x] Launch-day monitoring runbook + incident log in place
- [x] Rollback paths rehearsed (DNS / Pages / Discord bot) with documented findings
- [ ] Kevin sends CR pitch (Kevin-gated)
- [ ] Kevin publishes trailer (Kevin-gated)
- [ ] Kevin posts announce thread (Kevin-gated)
- [ ] Post-launch Claude Opus 4.7 reviewer pass — GREEN

## CHECK-IN CADENCE

**Moderate autonomy with seed-milestone check-ins.** Codex drives non-gated execution. Kevin receives:

- After each Kevin-gated prep step completes: a single-line "ready for your signoff on X" ping.
- After DNS cutover verification: live-domain smoke screenshot + bot render output.
- After rollback rehearsal: a short findings report.
- After launch: a go/no-go call on the Day-1 monitoring window.

**Escalation triggers** (stop + ask Kevin):

- Any sacred-constraint risk.
- Any live-domain regression after cutover.
- Any request to publish, post, or send on Kevin's behalf.
- Any rollback rehearsal finding that blocks a DoD item.
- Any schedule slip putting the 2026-05-29 window at risk.

## KEVIN-GATED ACTIONS (NEVER AUTONOMOUS)

- DNS registrar changes at the current provider for `counterfeit-educational.org`
- Sending the Critical Reflex pitch email
- Posting any public announcement thread (Discord, Twitter/X, Bluesky, Reddit, etc.)
- Publishing the trailer to YouTube / Vimeo / any public host
- Pushing to `main` / deploying to Pages
- Any save-schema v3 or save-shape change
- Adding new worlds, enemies, or scoring mechanics
- Adding a public Appeals UI (the compare seam stays invisible unless Kevin explicitly asks for the surface)

## ARTIFACTS TO CONSUME

- `ACTIVE/docs/LAUNCH_GO_NOGO.md` — 4-phase launch checklist (T-24h, T-0, T+1h, T+24h)
- `ACTIVE/docs/DNS_CUTOVER.md` — registrar playbook + DNS target values
- `ACTIVE/docs/PERF_AUDIT_W5.md` — baseline numbers to watch against post-cutover
- `ACTIVE/docs/A11Y_STATUS.md` — toggle-to-runtime map (5 `?settings=1` toggles)
- `ACTIVE/docs/APPEALS_MECHANIC.md` — shipped seam; why public UI is deferred
- `ACTIVE/docs/LAUNCH_RUNBOOK_W6.md` — exact execution steps, acceptance criteria, and rollback triggers
- `ACTIVE/docs/LAUNCH_INCIDENT_LOG.md` — empty incident log template for cutover + T+1h
- `ACTIVE/docs/ROLLBACK_REHEARSAL_W6.md` — pre-flip rehearsal findings and limitations
- `ACTIVE/marketing/cr_pitch_v1/DESIGN_BRIEF.md` — CR outreach content direction
- `ACTIVE/marketing/cr_pitch_v1/SEND_READY_PACKET.md` — Kevin review copy for the CR send set + draft note
- `ACTIVE/delivery/w5_demo/TRAILER_EDIT_BRIEF.md` — trailer cut direction
- `ACTIVE/delivery/w6_launch/TRAILER_UPLOAD_DESCRIPTOR.md` — upload metadata for the packaged MP4
- `ACTIVE/game/scripts/capture_trailer.mjs` — seeded frame capture (use as-is)
- `ACTIVE/game/scripts/verify_live_domain.mjs` — repeatable smoke pass for root/world/docket/settings on a given base URL
- `ACTIVE/game/scripts/package_launch_trailer.sh` — temp-runtime wrapper that builds the W6 launch trailer MP4
- `ACTIVE/discord/bot.js` — sidecar render path
- `.github/workflows/static.yml` — Pages deploy config (already serves `ACTIVE/game` as Pages root)
- `.codex/CEHP/handoff.md` — **top section only; STOP at the `## Previous Major Work (2026-03-21 — Corrupted Broadcast)` heading.** Everything below is pre-rebuild legacy (`ARCHIVE/legacy_runtime_v1/`) and MUST NOT be re-referenced.
- `.codex/CEHP/status.md` — authoritative current state

## REVIEWER FOCUS (POST-LAUNCH)

- Live-domain parity with local build (no cutover drift)
- Discord sidecar works on live domain
- Trailer renders match the deterministic frame captures
- CR outreach packet sent without mechanical error
- Incident log captures anything Day-1 surfaced
- Sacred-constraint sweep across 32 modules (zero `Math.random`, ES5, no save shape change, no new enemies)
- Rollback rehearsal findings reviewed and filed

## NEXT STEPS (POST-LAUNCH)

- Post-launch vigilance window (48h) — monitor, triage, hold the product still.
- HR Expansion Steam release ($14.99) — Exit Interview Theater + Claims Adjustatory worlds.
- Any post-launch feature work enters the normal `BACKLOG.md` queue.
