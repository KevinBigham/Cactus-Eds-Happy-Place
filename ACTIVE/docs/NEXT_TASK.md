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
## TASK_OWNER_ROLE: Architect or Kevin (planning)
## CURRENT_STAGE: 2026-04-28 — W11 Benefits + Rasta content wire GREEN; W12 polish prep queued
## NEXT_HANDLER_ROLE: Architect/Kevin defines W12 audio, density, autoplay, receipt, and launch-prep scope; Codex waits for a builder handoff
## STATUS: QUEUED
## DEADLINE: W12 polish prep window; no public deploy without Kevin approval

## CONTEXT

W11 Benefits + Rasta content wiring is GREEN locally. Codex resumed from the prior P0/P1a/P2 prep after Kevin supplied the exact Architect spec, then completed P1b through P6.

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
- Replay corpus now has four fixtures: `test_room_obedient`, `w2_benefits_insured`, `w2_benefits_uninsured`, `w3_rasta_short`.

Final W11 verification is recorded in `.codex/CEHP/handoff.md` and the Codex final response.

## REQUIRED INPUT TO UNBLOCK W12

Architect/Kevin should define the exact W12 polish-prep packet:

- Audio decision path: chip-tune vs analog drone, including Kevin-gated listening criteria.
- Telegraph tightening scope and which enemy/setpiece reads are in bounds.
- Density audit target: keep decision-grade threats at or below 5 per screen.
- Cross-browser 60fps matrix and target browsers/devices.
- Byte recapture or cap posture for the W12 400KB lane.
- Autoplay/replay extensions needed for W11 rooms and any W12 probes.
- Receipt generation update scope for W10/W11 verbs and new W11 branches.
- Docs refresh scope for `KNOWN_ISSUES.md`, `A11Y_STATUS.md`, and launch-prep docs.

## RESUME SCOPE FOR CODEX

Codex should not implement W12 until the Architect/Kevin packet lands and `TASK_OWNER_ROLE` is flipped back to Codex.

Likely builder lanes after handoff:

1. Add W12 tests first for the chosen audio/density/autoplay/receipt changes.
2. Wire minimal W12 polish code inside existing modules only.
3. Extend replay/autoplay fixtures only with documented rationale.
4. Run save schema, behavior oracle, replay corpus, and `npm run verify:launch`.
5. Append `.codex/CEHP/status.md`, `handoff.md`, and `changelog.md`.

## ACCEPTANCE GATES

- `cd ACTIVE/game && node build.js && wc -c index.html` stays under the active cap.
- `cd ACTIVE/game && node scripts/check_save_schema.js` passes.
- `cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs` passes.
- `cd ACTIVE/game && npm run test:replay` passes deterministic corpus.
- `cd ACTIVE/game && npm run verify:launch` ends with `CEHP LAUNCH VERIFY: PASS`.
- No save schema change.
- No new runtime dependency.
- No golden baseline updates without documented diff and rationale.
