# W9 SPRINT — READABILITY RESTORATION + ART INTEGRATION CONTINUATION

> **Status**: CLOSED 19a1b10 (batched W7-W10 local sync); retained as historical spec.
> **Owner**: Codex 5.4 (builder).
> **Reviewer**: Claude Opus 4.7.
> **Predecessors**: [W7_LENS_AND_FEEL_SPRINT.md](W7_LENS_AND_FEEL_SPRINT.md) · [W8_RETROSPECTIVE.md](W8_RETROSPECTIVE.md) · [W9_SCOPE_PROPOSAL.md](W9_SCOPE_PROPOSAL.md) · [KEVIN_RETURN_BRIEF.md](KEVIN_RETURN_BRIEF.md)
> **Companion docs**: [W9_TYPO_AUDIT.md](W9_TYPO_AUDIT.md) · [W9_TRACK_A_WIREIN_SPEC.md](W9_TRACK_A_WIREIN_SPEC.md)
> **Beacon**: [NEXT_TASK.md](NEXT_TASK.md) — `CEHP-REBUILD-W9-READABILITY-AND-ART`.

---

## KEVIN'S RULING (2026-04-23)

Taste-gates:

1. `screen_unmasked_reveal.png` — **REJECTED.** Composition fails thesis. Regen with new prompt (§ below).
2. `coworker_mascot_variants.png` — **APPROVED.** "LOOKS GOOD." Keep.
3. `paper_hr_memo.png` — **CORRECT AS-IS.** Kevin verified header spells "Human Resources". Outgoing Claude's "Hunan Resources" flag was wrong.

Doctrine update:

> "Let's make sure all other spellings besides 'COUNTEREEIT' are corrected."

Sprint direction:

> "Let's rock with TRACK B THEN TRACK A [all in one SPRINT]!!!!!!"

---

## WHY ONE SPRINT FOR TWO TRACKS

- Current runway after 2026-04-22 Codex v2 ship: **7,501 B**.
- Track B (un-minify) estimated cost: **~3,500 B**.
- Track A (wire 11 PNGs) estimated cost: **~730 B**.
- Phase 1 (reveal regen) + Phase 2 (typo audit) cost: **0 B** (asset regen doesn't touch the build).
- Projected runway at sprint close: **~3,271 B remaining**.
- **No 300KB ceiling raise required.** B and A fit together with margin.

---

## PHASE ORDER (STRICT)

### Phase 1 — `screen_unmasked_reveal.png` REGEN (blocking)

Back up current `ACTIVE/game/art/screen_unmasked_reveal.png` to `art/_originals/`. Regen via image-gen using the prompt below. Run `sips -Z 512` to keep under 500KB. Verify PNG magic + size bounds via `node scripts/verify_art_assets.mjs`.

**HALT after landing for Kevin taste-gate.** The new image must unambiguously read *worker IS the mascot* — costume suit on torso, neck zipper unzipped, foam head on the desk beside him, one human hand visible emerging from a green foam cactus cuff.

#### New prompt (verbatim — do not paraphrase)

> A middle-aged office worker sits at a dingy beige cubicle desk under flickering fluorescent lights. He is **STILL WEARING A CORPORATE-MANDATED SAGUARO-CACTUS MASCOT COSTUME on his torso** — the green foam costume body is clearly visible shoulder-to-waist, sweat-stained, with the **neck zipper unzipped** so his tired human face and neck emerge from within the suit. The costume's oversized foam saguaro **head sits on the desk beside him**, eyes blank, mouth frozen in its brand-mascot grin. **One human hand extends from a green foam cactus-sleeve cuff**, resting on a stack of TPS-report papers. Expression: deadpan exhaustion, not terror. Composition must read unambiguously: HE IS the mascot. The costume is a SUIT. He has been inside it all day.
>
> Style: cursed nonprofit compliance software aesthetic. Muted navy + beige + tan + desaturated green palette. Dithered analog-horror tone. Kane Pixels × A24 Backrooms lineage. Heavy film grain. Desaturated fluorescent overhead light with slight flicker ghosting. **NOT AAA-game polish** — should read like a screenshot from a 2003 HR-training VHS that was digitized badly. Limited color palette. Worker center-right, mascot head center-left, corporate-office depth blur behind. 2:1 horizontal aspect ratio.

---

### Phase 2 — TYPO AUDIT & CORRECTION

Reviewer pre-scan lives at [W9_TYPO_AUDIT.md](W9_TYPO_AUDIT.md). Codex starts Phase 2 from that doc.

Whitelist (the ONLY canonical typos in the 32-PNG set):

- `COUNTEREEIT` on `seal_counterfeit_educational_org.png` (top arc)
- `COUNTEREEIT` callback on `paper_expired_id.png` (if Phase 2 option (b) is chosen per audit doc §5)

Everything else that reads as a typo IS a typo. Regen with corrected text.

Deliverable: list of PNGs touched + before/after preview grid + `verify_art_assets.mjs` role-annotation updates.

---

### Phase 3 — TRACK B: READABILITY RESTORATION

Un-minify (behavior-neutral):

- `ACTIVE/game/src/89_ed_perform.js` (EdKit, 19-line minified form)
- `ACTIVE/game/src/8A_air.js` (AirKit, 20-line minified form)
- `ACTIVE/game/src/52_curiosity.js` (compact form from W8 Phase 5)
- `ACTIVE/game/src/83_receipt_render.js` (option-a minified in Codex v1 on 2026-04-22)

Restore in `ACTIVE/game/build.js`:

- Module header banners from `/*M:xx_name.js*/` back to `/* =============== MODULE: XX_NAME.JS =============== */` across all 40 modules.

Budget: **~3,500 B**. Verify:

- `node build.js` — bytes still < 300,000.
- `node scripts/check_save_schema.js` — pass.
- `node scripts/autoplay.mjs --world orientation|benefits|rasta` — all MATCH + OK.
- `node --test tests/rebuild_logic.test.mjs` — 40/40 (or more if Phase 2 added regression tests).

**No new feature code. No behavior change.** If any un-minify produces a test diff, that's a bug — root-cause, do not patch around it.

---

### Phase 4 — TRACK A: ART INTEGRATION CONTINUATION

Reviewer design spec lives at [W9_TRACK_A_WIREIN_SPEC.md](W9_TRACK_A_WIREIN_SPEC.md). Codex consumes that doc at Phase 4 start.

Summary of assets to wire:

| Tier | Asset | Surface |
|---|---|---|
| 1 | `supervisor_silhouette.png` | ShiftEnd beat 3 (flash before final frame) |
| 1 | `cactus_ed_portraits_masked.png` | Receipt portrait on malicious tone (paired with unmasked on benign) |
| 1 | `carpet_tile_seamless.png` | Floor texture in all PlayScene rooms (depth 0, alpha 0.28, multiply) |
| 1 | `enemy_deadline_wraith.png` | Skin for deductible enemy |
| 1 | `enemy_compliance_auditor.png` | Skin for scantron enemy |
| 1 | `enemy_telegraph_windup.png` | 3-frame shared windup overlay |
| 2 | `paper_safety_poster.png` | W1 authored-room backdrop |
| 2 | `fluorescent_light_fixture.png` | W2 ceiling overlay |
| 2 | `prop_filing_cabinet.png` | W1 back-wall prop |
| 2 | `prop_archive_box.png` | W1 floor prop |
| 2 | `prop_coffee_cup.png` | W2 desk prop |
| 2 | `prop_stamp_pad.png` | Receipt backdrop behind verdict |
| 3 | `paper_expired_id.png` | W2 contradiction-gate floor prop |

Budget: **~730 B**. Every wire-in preserves procedural fallback.

---

## SACRED CONSTRAINTS (UNCHANGED)

- Single-file shipped `index.html` artifact. Source stays modular under `src/`.
- ES5 only. No `let`/`const`/arrow/template-literal/spread/destructuring.
- Phaser 3 via CDN. No bundler. No npm runtime for the game.
- `cactusEd_save_v1` contract preserved (v2 + archaeological v1). **W9 freeze: no schema changes.**
- Seeded LCG RNG only — never `Math.random`.
- Ed's voice rules hold (deadpan, ≤8 words per line, no exclamation marks).
- `ns.TUNING.JUMP_VELOCITY` and `ns.TUNING.GRAVITY` stay un-mutated.
- No predatory retention mechanics.
- **Canonical typo whitelist (Kevin 2026-04-23)**: ONLY `COUNTEREEIT`.
- 300KB build ceiling holds.

---

## CHECK-IN CADENCE

- Phase 1 done → PNG preview sent to Kevin → Kevin taste-gate GREEN before Phase 2 starts.
- Phase 2 done → list of PNGs touched + before/after grid.
- Phase 3 done → byte delta report + runway update.
- Phase 4 done → per-PNG wire-in screenshots + byte delta.
- Sprint close → `W9_RETROSPECTIVE.md` + reviewer hand-back + Kevin final taste-gate.

---

## ESCALATION TRIGGERS (STOP + ASK KEVIN)

- Any sacred-constraint risk during any phase.
- Any phase deliverable that can't land within its time budget.
- Any ceiling overrun (bytes ≥ 300,000).
- Any un-minify that changes test output or autoplay captures.
- Any regen that touches a whitelisted canonical typo.
- Any request to push to `main`, deploy, or send on Kevin's behalf.

---

## KEVIN-GATED ACTIONS (NEVER AUTONOMOUS)

- Pushing to `main` / deploying to Pages.
- Domain purchase + DNS flip (still deferred under `PUBLIC_LAUNCH`).
- Sending the Critical Reflex pitch email.
- Publishing the trailer.
- Posting any public announcement thread.
- Save-schema v3 or any save-shape change.
- Adding new worlds, enemies, or scoring.
- Adding a public Appeals UI.
- Any image regen beyond Phase 1 + Phase 2 typo fixes.
- Any ceiling raise beyond 300KB.

---

## DEFINITION OF DONE (W9)

- [ ] `screen_unmasked_reveal.png` regenerated; Kevin taste-gated GREEN on thesis read.
- [ ] Typo audit delivered; all non-whitelisted misspellings corrected; `verify_art_assets.mjs` role annotations updated.
- [ ] 4 modules un-minified; `build.js` banners restored; 40/40 logic tests unchanged.
- [ ] 11–13 unwired PNGs wired with procedural fallback preserved; autoplay W1/W2/W3 GREEN; no save/scoring/enemy/world changes.
- [ ] Build bytes ≤ 300,000 (projected ~3,271 B runway remaining).
- [ ] `verify-cehp.sh` GREEN; `check_save_schema.js` GREEN; `verify_art_assets.mjs` GREEN.
- [ ] Before/after screenshot pair per world archived to `ACTIVE/delivery/w9_readability_and_art/`.
- [ ] Reviewer pass GREEN (sacred-constraint sweep + byte budget + determinism).
- [ ] `W9_RETROSPECTIVE.md` authored.
- [ ] Kevin final taste-gate pass (three images + one `?world=orientation` run).

---

## APPENDIX — CODEX HANDOFF JSON (verbatim)

This is the JSON Kevin pasted to Codex on 2026-04-23. Preserved here for traceability.

```json
{
  "session_id": "CEHP-W9-SPRINT-READABILITY-AND-ART-2026-04-23",
  "date_local": "2026-04-23 (Kevin PST)",
  "authoring_agent": "Claude Opus 4.7 (reviewer/ops)",
  "sprint_name": "W9 — Readability Restoration + Art Integration Continuation",
  "kevin_mandate_verbatim": "Let's rock with TRACK B THEN TRACK A [all in one SPRINT]!!!!!! Plus two doctrine adds: regen screen_unmasked_reveal.png, and hunt/correct all typos except COUNTEREEIT.",

  "doctrine_updates_from_kevin_2026-04-23": {
    "canonical_typo_whitelist": "ONLY 'COUNTEREEIT' (on seal + paper_expired_id callback). ALL OTHER misspellings or garbled text across the 32 canonical PNGs must be corrected.",
    "paper_hr_memo_status": "CORRECT AS-IS — Kevin verified header reads 'Human Resources.' Outgoing handoff's 'HUNAN' flag was wrong. No regen.",
    "coworker_mascot_variants_status": "APPROVED — 'LOOKS GOOD.' Keep.",
    "screen_unmasked_reveal_status": "REJECTED — composition fails thesis. Regen with new prompt (Phase 1). Kevin taste-gates before Phase 2."
  },

  "phases_in_strict_order": [
    "Phase 1: REGEN screen_unmasked_reveal.png using new prompt. Back up current to art/_originals/, run sips -Z 512, verify under 500KB. PING Kevin with PNG preview; HALT for taste-gate before Phase 2.",
    "Phase 2: TYPO AUDIT all 32 canonical PNGs. Whitelist: 'COUNTEREEIT' on seal + paper_expired_id callback. Regen affected PNGs with corrected text. Update verify_art_assets.mjs byte-count entries as needed. Report: list of PNGs touched + before/after preview grid.",
    "Phase 3: TRACK B — Readability Restoration. Un-minify 89_ed_perform.js, 8A_air.js, 52_curiosity.js, 83_receipt_render.js. Restore build.js module header banners. Budget: ~3,500 B.",
    "Phase 4: TRACK A — Art Integration. Wire 11+ unwired new PNGs with procedural fallback preserved. Budget: ~730 B."
  ],

  "sacred_constraints_never_violate": [
    "single_html_shipped (index.html + art/*.png soft deps + procedural fallback)",
    "es5_only (var, function(); NEVER let/const/arrow/template-literal/spread/destructuring)",
    "phaser_cdn_only (no build step, no npm runtime)",
    "seeded_lcg_only (ns.makeRNG — NEVER Math.random)",
    "save_schema_cactusEd_save_v1 (v2 + archaeological v1 migration)",
    "invisible_axes (6 axes + ~30 micro-signals — no HUD exposure)",
    "no_predatory_retention",
    "ed_voice_rules (deadpan, ≤8 words per line, NO '!')",
    "byte_ceiling_300000 (no raise — sprint fits in current 7,501B runway)",
    "JUMP_VELOCITY_and_GRAVITY_untouched",
    "canonical_typo_whitelist_2026-04-23 (ONLY COUNTEREEIT)"
  ],

  "byte_math": {
    "starting_runway": 7501,
    "phase_3_track_b_estimated_cost": 3500,
    "phase_4_track_a_estimated_cost": 730,
    "projected_final_runway": 3271,
    "conclusion": "Sprint fits in current runway. No ceiling raise required."
  }
}
```

---

## POST-W9 CANDIDATES (REVIEWER NOTES)

- **G tracks** — W8 refinements only if Kevin taste-gates return "tune this".
- **F track** — autoplay harness graduation into `verify-cehp.sh` once it's survived another sprint.
- **C track** — R06 W1 opener audit (3-min Kevin video + reviewer scorecard).
- **D track** — launch re-audit (domain, pitch, trailer) when Kevin sets a new target.
- **E track** — HR Expansion pre-plan (only if D is also live).

Reviewer reassesses W10 scope after W9 holds 48h.
