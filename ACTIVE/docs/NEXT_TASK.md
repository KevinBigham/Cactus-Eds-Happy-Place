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
## CURRENT_STAGE: 2026-04-29 — W12 P1 byte cap GREEN; bundle 350,854 / 409,600, oracle 111/111, replay 7/7
## NEXT_HANDLER_ROLE: Codex executes P2 receipt-gen completeness audit conservatively against existing completion seams
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

Current W12 builder lanes:

1. P2 receipt-gen completeness audit and behavior-oracle coverage for existing completion seams only.
2. P3 telegraph windup audit/tune with `120 <= windup <= 400 ms`.
3. P4 static density script and launch-gate hook.
4. P5 procedural Web Audio API and deterministic event hits.
5. P6 replay fixture expansion only if the named mini-boss completion paths exist in source.
6. P7 asset orphan quarantine and PNG compression.

## ACCEPTANCE GATES

- `cd ACTIVE/game && node build.js && wc -c index.html` stays under the active cap; current bundle is `350,854 / 409,600`.
- `cd ACTIVE/game && node scripts/check_save_schema.js` passes.
- `cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs` passes; current oracle is `111/111`.
- `cd ACTIVE/game && npm run test:replay` passes deterministic corpus; current replay corpus is `7/7`.
- `cd ACTIVE/game && npm run verify:launch` ends with `CEHP LAUNCH VERIFY: PASS`.
- No save schema change.
- No new runtime dependency.
- No golden baseline updates without documented diff and rationale.
