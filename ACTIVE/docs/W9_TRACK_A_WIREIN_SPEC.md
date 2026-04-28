# W9 TRACK A — ART WIRE-IN SPEC

> **Purpose**: Reviewer design spec for Codex's Phase 4. Maps each unwired new PNG to a recommended surface, an insertion module, a depth/alpha hint, and a procedural-fallback rule. Codex may refine but must NOT invent new scenes, enemies, scoring, or save fields.
>
> **Sacred constraints reminder**: every wire-in preserves procedural fallback, ships in ES5 only, respects the 300KB build ceiling, uses seeded LCG only, touches no save shape, mutates no `JUMP_VELOCITY` / `GRAVITY`.
>
> **Budget**: ~730 B total for Phase 4 (post-Phase 3 projected runway ~4,001 B).

---

## GLOBAL WIRE-IN PATTERN

Every wire-in follows the same shape used by the W7 art pipeline:

```js
// pseudocode (ES5, real code uses var + function())
function attachAssetOrFallback(scene, slot, textureKey, proceduralBuilder) {
  var tex = ns._game && ns._game.textures;
  if (tex && tex.exists(textureKey)) {
    slot.setTexture(textureKey);
    return 'texture';
  }
  proceduralBuilder(scene, slot);
  return 'procedural';
}
```

**Rule**: If the texture is missing (failed preload, headless runtime, Discord sidecar), the procedural fallback renders. Never throw, never blank-fail. Every new wire-in goes through this pattern.

---

## TIER 1 — HIGH-LEVERAGE (WIRE FIRST)

### `supervisor_silhouette.png` — unseen-authority horror anchor

- **Surface**: ShiftEnd scene, as a **mid-sequence third beat** before Receipt. Sequence becomes: `screen_unmasked_reveal` (1500 ms) → `supervisor_silhouette` (900 ms, brief flash) → `screen_end_of_shift` (1500 ms) → Receipt.
- **Why here**: the silhouette anchors "someone is watching." The current 2-beat ShiftEnd doesn't have an authority beat. Adding a 900 ms flash extends the sequence by 900 ms total (within acceptable attention budget per `W7_LENS_AND_FEEL_SPRINT.md`).
- **Insertion**: `ACTIVE/game/src/91_scenes.js`, in the ShiftEnd scene create + transition logic. Extend `nextRunCompleteScene(runState)` routing.
- **Depth / alpha / blend**: full-screen centered sprite, alpha 1.0, no blend. Cuts to black for 150 ms before appearing (punctuation hit).
- **Skip lock**: the 500 ms skip deadline continues to apply globally to the 3-beat sequence — add a recheck at each beat boundary so skip fires on the CURRENT beat, not the whole sequence.
- **Fallback**: procedural dark rectangle with centered `ns.PALETTE.OFF_WHITE` text `SUPERVISOR` in pixel font, 150 ms linger.
- **Risk**: if the beat overstays or reads celebratory, drop the duration to 600 ms. Kevin taste-gate after first wire.
- **Budget**: ~150 B (preload + routing branch + fallback).

---

### `cactus_ed_portraits_masked.png` — receipt author portrait (malicious tone)

- **Surface**: Receipt scene (`ACTIVE/game/src/80_receipts.js` + `83_receipt_render.js`), as an **optional left-column portrait** paired with the 3-line verdict. Show `portraits_masked` when receipt aggregate tone is malicious; show `portraits_unmasked` when benign.
- **Why here**: the 6-face grids exist as two thesis poles (mascot-polished vs tired-human). The receipt's tonal verdict is the natural decision point for which face to show.
- **Insertion**: `80_receipts.js` — after tone scoring, pick an index 0-5 deterministically via `ns.makeRNG(caseSeed + '|portrait')`.
- **Depth / alpha**: left of verdict text, 64×64 preview cell from the 6-face grid, alpha 0.65, slight dither overlay from `ns.LensKit` if available.
- **Determinism**: same `caseSeed` → same face index. **Do not** introduce a new save field for this; it's derived at render time.
- **Fallback**: procedural `ns.PALETTE.COPIER_GRAY` rectangle, no text.
- **Tone caveat**: if the receipt is neutral, show **neither** portrait — absence of a face is a third register and worth the silence.
- **Budget**: ~180 B (grid-slice coords + tone branch + fallback).

---

### `carpet_tile_seamless.png` — all-rooms floor texture

- **Surface**: all PlayScene rooms in all worlds (W1 / W2 / W3), as a `TileSprite` at the bottom of the scene, behind players and enemies.
- **Why here**: the current scene backgrounds are flat navy — the handoff's 8-AI critique explicitly named "flat navy void" as a W7 gap. A seamless institutional-carpet tile lands ambient bureaucratic setting without touching lens discipline.
- **Insertion**: `ACTIVE/game/src/91_scenes.js` PlayScene `create()`, after the background fill.
- **Depth / alpha / blend**: depth 0 (below player at 10 and enemies at 20), alpha 0.28 (respects LensKit's multiply vignette — the carpet should read as background texture, not hero surface). Multiply blend on top of the navy fill.
- **Scale**: 256px tile × repeat across room bounds. Do not scale — institutional carpet reads at 1:1.
- **Seed**: none (the tile itself is already seamless). No per-room RNG call.
- **Fallback**: procedural diagonal-stripe pattern using `ns.PALETTE.COPIER_GRAY` on `ns.PALETTE.BRUISE_NAVY`.
- **Budget**: ~90 B (one preload, one TileSprite call per scene, one fallback).

---

### `enemy_deadline_wraith.png` — deductible-weight enemy skin

- **Surface**: replace the current procedural placeholder rectangle for the deductible enemy in `ACTIVE/game/src/60_enemies.js` → `spawnDeductible`.
- **Why**: "deadline_wraith" is thematic match for the jump-velocity-shrink deductible — temporal-dread iconography vs bureaucratic weight.
- **Insertion**: `60_enemies.js` — replace placeholder with `scene.add.image(x, y, 'enemy_deadline_wraith')`, physics body dimensions unchanged.
- **Depth / alpha**: depth 20, alpha 1.0, no blend. Same behavior as the placeholder — R01 windup/active/recovery phases unchanged.
- **R01 telegraph integration**: windup phase's existing `alpha = 0.95 - 0.5*sin(t*π)` and `scaleX = 1 + 0.12*sin(t*π)` ramp apply to the new sprite verbatim. The telegraph is pose-agnostic.
- **Fallback**: existing procedural placeholder (no new fallback code needed — the old path is the fallback).
- **Budget**: ~40 B (one preload, one texture key swap).

---

### `enemy_compliance_auditor.png` — actuarial-scantron enemy skin

- **Surface**: replace the procedural placeholder for the scantron enemy in `60_enemies.js` → `spawnScantron`.
- **Why**: "compliance_auditor" matches the scantron's teleport-to-block behavior (an auditor showing up unannounced).
- **Insertion**: `60_enemies.js` — same pattern as deadline_wraith.
- **Depth / alpha**: depth 20, alpha 1.0. Scantron's reactive windup telegraph ramp applies unchanged.
- **Fallback**: existing procedural placeholder.
- **Budget**: ~40 B.

---

### `enemy_telegraph_windup.png` — 3-frame R01 telegraph sprite sheet

- **Surface**: overlay the 3-frame sheet on top of any enemy in windup phase — a **shared visual tell** that reads across all three archetypes (Scantron, Pizza, Deductible).
- **Why**: R01 already has deterministic phase timings per archetype. A consistent visual tell on top of per-enemy telegraph makes the "attack is coming" signal legible without changing timing.
- **Insertion**: `60_enemies.js` → `stepPhase()`. When `phase === 'windup'`, show the sheet as an additive overlay at enemy position; drive the frame index by `floor(3 * t)` where `t = 1 - windupMs/wBase`.
- **Depth / alpha / blend**: depth enemy+1 (just above enemy sprite), alpha 0.7, ADD blend.
- **Sheet slicing**: 3 frames horizontal, frame size divides the sheet width by 3. No animation config — direct frame pick by `t`.
- **Fallback**: the existing alpha+scale pulse on the enemy body (no overlay).
- **Risk**: if the overlay feels "juicy" (bright, celebratory), drop blend to normal and alpha to 0.4. Kevin taste-gate after first wire.
- **Budget**: ~120 B.

---

## TIER 2 — DECORATIVE (WIRE SECOND)

### `paper_safety_poster.png` — W1 authored room sign backdrop

- **Surface**: behind one authored sign in a W1 Orientation Bureau room. Specifically the `orientation-bureau` or `reception-foyer` room — whichever has existing decorative depth space.
- **Insertion**: `ACTIVE/game/src/74_world_orientation_runtime.js` room builder.
- **Depth / alpha**: depth 2, alpha 0.48 (respects LensKit multiply). Sized to ~24×32 tile equivalent (small background prop, not hero art).
- **Fallback**: procedural tan rectangle.
- **Budget**: ~35 B.

---

### `fluorescent_light_fixture.png` — W2 ceiling overlay

- **Surface**: ceiling of all W2 Benefits Atrium rooms. One sprite per room at top-center.
- **Insertion**: `ACTIVE/game/src/75_world_benefits_runtime.js` → room builder.
- **Depth / alpha / blend**: depth -1 (behind carpet but above background fill), alpha 0.6, ADD blend. Pairs with LightKit's warm radial leak.
- **Fallback**: procedural `ns.PALETTE.FLUORESCENT_TAN` rectangle at alpha 0.2.
- **Budget**: ~55 B.

---

### `prop_filing_cabinet.png` — W1 back-wall prop

- **Surface**: one authored W1 room (suggest `reception-foyer` or the room before the boss transition), back-wall decoration.
- **Insertion**: `74_world_orientation_runtime.js`. One sprite per room designated, position fixed in room coords.
- **Depth / alpha**: depth 1, alpha 0.55, no blend. No physics body — decorative only.
- **Fallback**: procedural `ns.PALETTE.COPIER_GRAY` rectangle with two horizontal lines (drawer hints).
- **Budget**: ~30 B.

---

### `prop_archive_box.png` — W1 floor prop

- **Surface**: one authored W1 room (suggest same as filing cabinet for thematic pairing), foreground decoration.
- **Insertion**: `74_world_orientation_runtime.js`.
- **Depth / alpha**: depth 1.5, alpha 0.6, no blend. No physics body.
- **Fallback**: procedural `ns.PALETTE.PAPER_TAN` rectangle.
- **Budget**: ~30 B.

---

### `prop_coffee_cup.png` — W2 desk prop

- **Surface**: one authored W2 room desk (suggest `premium-pathways` or `network-validation`).
- **Insertion**: `75_world_benefits_runtime.js`. One sprite per room designated, position tied to an authored desk or surface.
- **Depth / alpha**: depth 1.5, alpha 0.75, no blend.
- **Fallback**: procedural `ns.PALETTE.OFF_WHITE` rectangle with a small dark oval (coffee surface).
- **Budget**: ~30 B.

---

### `prop_stamp_pad.png` — Receipt scene backdrop

- **Surface**: Receipt scene, behind the 3-line verdict, paired with `stamps_sheet.png`.
- **Insertion**: `ACTIVE/game/src/83_receipt_render.js` (after un-minify in Phase 3).
- **Depth / alpha / blend**: depth -1 (behind verdict text), alpha 0.4, multiply blend.
- **Fallback**: procedural `ns.PALETTE.SANCTION_RED` rectangle.
- **Budget**: ~35 B.

---

## TIER 3 — OPTIONAL (WIRE IF BUDGET ALLOWS)

### `paper_expired_id.png` — W2 contradiction-gate area prop

- **Surface**: dropped on the floor near a W2 contradiction gate (one gate only — suggest room 4 `deductible-adjustment` or room 6 `final-processing`).
- **Why here**: the ID's COUNTEREEIT callback (if Phase 2 adds it) thematically anchors the contradiction. Dropped, not held — implies a departed applicant.
- **Insertion**: `75_world_benefits_runtime.js` → room builder.
- **Depth / alpha**: depth 1, alpha 0.8, slight rotation (±12° seeded per room).
- **No pickup**. No collision. No interaction seam. Decorative only.
- **Fallback**: procedural green rectangle with "EXPIRED" text.
- **Budget**: ~40 B.

---

## OUT OF WIRE-IN SCOPE (Kevin-gated or already-held)

- `cactus_ed_in_game_sprite.png` — Kevin taste-gate HOLD. Do not wire in W9.
- `cactus_ed_portraits_unmasked.png` — already implicitly wired as the "benign tone" half of the receipt portrait pair (pairs with `portraits_masked` per Tier-1 spec above).
- `screen_unmasked_reveal.png` — regenerated in Phase 1; wiring already exists in ShiftEnd scene from Codex v2 ship.

---

## PHASE 4 DELIVERABLES

1. All 12 asset wire-ins landed with procedural fallback preserved on every slot.
2. Autoplay 3/3 worlds GREEN (deterministic, same-seed ±1 tolerance).
3. All 40 (or 40+regen) logic tests GREEN.
4. Build bytes under 300,000 (projected post-Phase-3 runway ~4,001 B; Phase 4 projected cost ~730 B; final runway ~3,271 B).
5. Before/after screenshot pair per world archived to `ACTIVE/delivery/w9_readability_and_art/`.
6. `verify_art_assets.mjs` role annotations refreshed for every asset whose wire-in status changed (from "unwired" to "wired — surface X").

---

## TONE AND DISCIPLINE CHECKS (Codex self-audit before handing back)

- [ ] No new tween that adds "juice" — every wire-in is static or respects W7 FeelKit discipline.
- [ ] Every texture load has a procedural fallback. No blank-fail anywhere.
- [ ] No new RNG seeds. Any new seeded choices use `ns.makeRNG` off existing seed components (caseSeed, worldId, roomId).
- [ ] No new save shape. No new `ns.Axes` entries. No new scoring.
- [ ] No HUD exposure — nothing surfaces an axis or metric to the player.
- [ ] LensKit multiply + vignette still reads over new art — if the art is too bright or saturated, drop alpha.
- [ ] LightKit warm-radial + sign-emissive flicker still reads — if the new carpet washes out flicker, drop carpet alpha.

---

## REVIEWER HAND-OFF

Codex consumes this doc at Phase 4 start. Reviewer expects a per-asset wire-in confirmation in the Phase 4 report (screenshot + module:line-number + byte delta) before sprint close.
