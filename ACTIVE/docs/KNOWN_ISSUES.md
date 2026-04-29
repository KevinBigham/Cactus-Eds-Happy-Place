# KNOWN ISSUES

Date: `2026-04-29`
Runtime baseline: W12 complete on `5ee7e99`; W13 P1 docs on `ff8343a`.

## Launch-Blocking Issues

None confirmed.

Chrome stable remains the blocking browser for launch. If P5 dress rehearsal finds a Chrome stable boot, save, asset, or receipt failure, stop W13 and treat it as launch-blocking. Firefox or Safari presentation regressions should be logged here as known limitations unless they also reproduce in Chrome stable.

## W12-Shipped Known Limitations

### `W11_CONTENT_BIAS = 1.1`

- Status: KNOWN POST-LAUNCH CLEANUP ITEM.
- Evidence: `ACTIVE/game/src/80_receipts.js` still applies the narrow `W11_CONTENT_BIAS = 1.1` boost only when W11 fragment flags match the current context.
- Launch read: acceptable. It keeps the new W11 authored fragments traceable without broad receipt-scoring churn.
- Next action: post-launch cleanup or re-tune only after launch receipts soak.

### Deferred W11 launch-arc content

- Status: INTENTIONAL DEFER.
- Deferred items: Supervisor / Enrollment Officer / Logistics Foreman mini-bosses; Trust Fall / Open Concept / Supply Chain setpieces; Reply-All Locust enemy system; 2-layer parallax verification.
- Evidence: W12 P2 audit found no shipped runtime systems for those items, and `ACTIVE/docs/BACKLOG.md` parks them under W15+ content expansion.
- Launch read: acceptable. Worlds 1-3 are narrative-complete on current flag-state completion paths, with 4 shipped W11 rooms and 12 W11 receipt fragments.

### Custom-domain launch path

- Status: KEVIN-GATED.
- Evidence: current verified public fallback is `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/`; custom domain cutover remains W14 launch work.
- Launch read: not a game blocker. If domain purchase or DNS stalls, launch on the GitHub Pages fallback and move domain flip to post-launch.

## Closed Since Launch-Arc Draft

### W10 feel-pass surface

- Status: CLOSED.
- Evidence: current runtime ships 60px Ed (`ED_RENDER_H = 60`), 48x64 sprite frames, split colliders, CRT rim-light, fixed-step sim, 18-state verb handling, camera lead, squash/stretch, and forgiveness windows. W12 launch gate remains green at `117/117` behavior oracle.

### W11 content shipment

- Status: CLOSED FOR LAUNCH SCOPE.
- Evidence: Benefits starts with `benefits-risk-atrium`, `benefits-claim-window`, and `benefits-network-narrow`; Rasta includes `rasta-soft-belt` before `warm-exit`; W11 receipt fragments are covered by oracle tests. Unbuilt launch-arc items are explicitly deferred above.

### W12 polish prep

- Status: CLOSED.
- Evidence: W12 shipped receipt-selector bleed fix, telegraph timing audit, density check, procedural Web Audio, replay expansion to 10 fixtures, and art compression. Current launch gate remains under `409600` bytes.

### Legacy March certification defects

- Status: RETIRED WITH PRE-REBUILD RUNTIME.
- Items retired: W2 pop-quiz auto-dismiss, W3 certAid panel occlusion, W2 pencil presentation, W2 boss legs, and closing-screen font note.
- Evidence: those items refer to the old certification/certAid flow and legacy surfaces. The active rebuild uses the current W1/W2/W3 runtime, receipt reveal, THE DOCKET, and `?settings=1` escape hatch.
- Archive pointer: original notes remain in `ACTIVE/docs/PLAYTEST_LOG.md` and older changelog history.

## Watch During P5 Dress Rehearsal

- Browser quick check: Chrome stable, Safari, Firefox, or whatever is installed.
- Default-browser manual check: W1 entry, procedural ambient starts on input, 60px Ed and CRT rim-light are visible, and the first receipt appears after a debug-completed run.
- Any visible non-Chrome issue: add a dated note here with browser, URL, symptom, and whether Chrome stable reproduces it.
