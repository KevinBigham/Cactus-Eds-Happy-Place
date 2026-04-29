# NEXT TASK

This file is the **task beacon**. There is always exactly ONE active task here.
When this task is complete, the completing agent updates this file with the next task from BACKLOG.md.

> **ONLY `TASK_OWNER_ROLE` GRANTS ACTIVATION.** If your role does not match `TASK_OWNER_ROLE`, stop and propose only.
> `CURRENT_STAGE` and `NEXT_HANDLER_ROLE` are informational — they do NOT grant activation.
> Write proposals to `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.
>
> **EDIT IN PLACE**: When updating this file, edit the metadata fields below directly. Never duplicate or append a second metadata block.

---

## TASK_ID: CEHP-REBUILD-W12-POLISH-PREP
## TITLE: W12 polish + launch prep specification
## TASK_OWNER_ROLE: Codex (builder)
## CURRENT_STAGE: 2026-04-29 — W12 P3 telegraph audit GREEN; bundle 351,302 / 409,600, oracle 114/114, replay 7/7
## NEXT_HANDLER_ROLE: Codex executes P4 static density analysis and launch-gate hook
## STATUS: ACTIVE
## DEADLINE: W12 polish prep window; no public deploy without Kevin approval

## CONTEXT

W11 Benefits + Rasta content wiring is GREEN locally, and the W11.5 infrastructure hardening marathon is also GREEN. Codex did not author new content.

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

## W12 PACKET NOW ACTIVE

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

Current W12 builder lanes:

1. P4 static density script and launch-gate hook.
2. P5 procedural Web Audio API and deterministic event hits.
3. P6 replay fixture expansion for under-covered actual completion paths from the P2 audit.
4. P7 asset orphan quarantine and PNG compression.

## ACCEPTANCE GATES

- `cd ACTIVE/game && node build.js && wc -c index.html` stays under the active cap; current bundle is `351,302 / 409,600`.
- `cd ACTIVE/game && node scripts/check_save_schema.js` passes.
- `cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs` passes; current oracle is `114/114`.
- `cd ACTIVE/game && npm run test:replay` passes deterministic corpus; current replay corpus is `7/7`.
- `cd ACTIVE/game && npm run verify:launch` ends with `CEHP LAUNCH VERIFY: PASS`.
- No save schema change.
- No new runtime dependency.
- No golden baseline updates without documented diff and rationale.
