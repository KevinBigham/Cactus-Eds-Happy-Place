# NEXT TASK

This file is the **task beacon**. There is always exactly ONE active task here.
When this task is complete, the completing agent updates this file with the next task from BACKLOG.md.

> **ONLY `TASK_OWNER_ROLE` GRANTS ACTIVATION.** If your role does not match `TASK_OWNER_ROLE`, stop and propose only.
> `CURRENT_STAGE` and `NEXT_HANDLER_ROLE` are informational — they do NOT grant activation.
> Write proposals to `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.
>
> **EDIT IN PLACE**: When updating this file, edit the metadata fields below directly. Never duplicate or append a second metadata block.

---

## TASK_ID: CEHP-REBUILD-W13-LAUNCH-RUNWAY
## TITLE: W13 launch runway specification
## TASK_OWNER_ROLE: Architect/Kevin
## CURRENT_STAGE: 2026-04-29 — W12 complete GREEN; handoff JSON saved at `.codex/CEHP/w12_handoff.json`
## NEXT_HANDLER_ROLE: Architect authors W13 launch runway packet; Codex waits for scoped builder handoff
## STATUS: QUEUED
## DEADLINE: W13 launch runway; no public deploy without Kevin approval

## CONTEXT

W12 Polish + Launch Prep is complete on branch `codex/cehp-w12-polish-launch-prep`.

Completed W11 work:

- Launch byte cap set to `372000` in `ACTIVE/game/scripts/verify-launch.sh`.
- `ACTIVE/game/process_manifest.json` ship-artifact cap set to `372000`.
- `ACTIVE/game/src/74_world_orientation_runtime.js` minified in-place as a single-line ES5 module.
- `CEHP.Receipts.registerFragment(pool, id, text, opts)` exposed through `ACTIVE/game/src/80_receipts.js`.
- Play `receiptFlags` now initializes `restOpened`, `rushedRest`, and `cigaretteLit`.
- All 12 W11 receipt fragments registered verbatim.
- Three Benefits rooms added at the front of the W2 flow: `benefits-risk-atrium`, `benefits-claim-window`, `benefits-network-narrow`.
- One Rasta room added before the W3 final room: `rasta-soft-belt`.
- Architect trigger names translated only to existing engine events.
- Rasta rest path sets `restOpened=true`, `cigaretteLit=false`, and `RunState.worldFlags.cigaretteWillNotLight=true`.
- `rasta-soft-belt` mirrors the existing Rasta rest-window duration (`800ms`).
- Replay corpus now has seven fixtures: `test_room_obedient`, `w1_orientation_obedient`, `w2_benefits_atrium_partial`, `w2_benefits_insured`, `w2_benefits_uninsured`, `w3_rasta_rushed`, `w3_rasta_short`.

Completed W11.5 hardening:

- Bundle trimmed by code-design/build-normalization work to `350,854 / 372,000` bytes.
- W11 receipt behavior pinned with 15 added oracle tests, including `W11_CONTENT_BIAS = 1.1`, all 12 W11 fragment-condition cases, and W11 room-order checks.
- Save-schema robustness backfilled with 6 tests covering empty, partial v1, extra fields, corrupt JSON, mismatched ruleset, and v2 round-trip behavior. `src/04_save.js` stayed unchanged.
- Replay corpus expanded to 7 fixtures with stable md5s recorded in `.codex/CEHP/marathon_findings.md`.
- Voice/ES5/RNG/time, asset usage, TODO/FIXME, and stale-doc findings are recorded in `.codex/CEHP/marathon_findings.md`.

Final W11.5 verification is recorded in `.codex/CEHP/handoff.md` and the Codex final response.

## W12 PACKET COMPLETE

Kevin/Architect supplied the W12 builder handoff on 2026-04-29. A copy is saved at `.codex/CEHP/w12_packet.md`.

Completed W12 work:

- P1 byte cap raise is GREEN.
- `ACTIVE/game/scripts/verify-launch.sh` now reports and enforces `409600`.
- `ACTIVE/game/process_manifest.json` `shipArtifact.maxBytes` now matches `409600`.
- `verify-launch.sh` poll-loop was not changed.
- Revision 2 is active from P2 forward; unbuilt W11 launch-arc mini-bosses, setpieces, Reply-All Locust, and 2-layer parallax verification are deferred to W15+ backlog.
- P2 receipt completion-flag audit is GREEN; actual registered flag keys are `premiumSecured`, `uninsuredVeteran`, `restOpened`, `cigaretteLit`, and `rushedRest`.
- P2 added `W12_RASTA_VERDICT_DARK_01` and `W12_RASTA_TENSION_DARK_01`, made receipt scoring reject incompatible flag-specific fragments, and documented coverage in `.codex/CEHP/w12_receipt_audit.md`.
- P3 existing-enemy telegraph audit is GREEN; `pizzaParty` windup is tuned from `140ms` to `160ms` so jittered restarts stay within `120-400ms`, and `.codex/CEHP/w12_telegraph_audit.md` documents all shipped enemy ranges.
- P4 density check is GREEN; `ACTIVE/game/scripts/check_density.mjs` is hooked into `verify-launch.sh` between `art_assets` and `behavior_oracle`, with current max density Orientation `1/5`, Benefits `4/5`, Rasta `0/5`.
- P5 procedural Web Audio is GREEN; `ACTIVE/game/src/30_audio.js` now exposes `Audio.playAmbient(worldKey)`, `Audio.stopAmbient()`, and `Audio.event(eventKey)` with legacy `start`/`stop` aliases, three deterministic ambient beds, six <=300ms event hits, and 300ms ambient ducking.
- P6 replay fixture expansion is GREEN; corpus is now 10 fixtures, with new coverage for Benefits default completion, Rasta dark-cigarette baseline, and Rasta rest-open completion. Gold md5s are pinned in `.codex/CEHP/w12_replay_hashes.md`.
- P7 asset cleanup is GREEN; 8 orphan PNGs moved to `ACTIVE/game/art/_orphans/`, all 30 oversize PNGs were compressed with `pngquant --quality=70-85`, active-plus-orphan PNG bytes dropped from `7,759,150` to `1,957,754` (74.8% reduction), and `verify_art_assets` now checks 25 active expected assets.
- End-of-sprint handoff JSON is saved at `.codex/CEHP/w12_handoff.json`.

Current W13 queue:

1. Architect/Kevin authors the W13 launch runway packet.
2. Codex executes only after a scoped W13 builder handoff arrives.
3. Kevin-gated launch actions remain locked: public deploy, DNS flip, trailer publish, Critical Reflex send, and announce thread.

## ACCEPTANCE GATES

- `cd ACTIVE/game && node build.js && wc -c index.html` stays under the active cap; current bundle is `354,011 / 409,600`.
- `cd ACTIVE/game && node scripts/check_save_schema.js` passes.
- `cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs` passes; current oracle is `117/117`.
- `cd ACTIVE/game && npm run test:replay` passes deterministic corpus; current replay corpus is `10/10`.
- `cd ACTIVE/game && npm run verify:launch` ends with `CEHP LAUNCH VERIFY: PASS`.
- No save schema change.
- No new runtime dependency.
- No golden baseline updates without documented diff and rationale.
