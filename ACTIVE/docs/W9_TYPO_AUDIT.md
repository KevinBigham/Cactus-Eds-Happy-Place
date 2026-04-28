# W9 TYPO AUDIT — REVIEWER PRE-SCAN

> **Purpose**: Hand Codex a head-start on W9 Phase 2. Reviewer (Opus 4.7) visually scanned every text-bearing canonical PNG on 2026-04-23 and flagged misspellings, garbled text, items to PRESERVE, and items that need Codex visual re-check.
>
> **Doctrine (Kevin 2026-04-23)**: ONLY `COUNTEREEIT` (on the seal + any intentional callback) is a canonical typo. Every other misspelling or garble is a bug.
>
> **Scope**: 32 canonical PNGs at `ACTIVE/game/art/`. This doc is input to Phase 2 only. Codex should re-verify at full resolution before regenerating.

---

## CONFIRMED TYPOS — REGENERATE WITH CORRECTED TEXT

### 1. `ui_clipboard.png` — HEADER TYPO

**Current header text**: `SHIFT PAUSE— CASTUS ED'S HAPPIEST PLACE`

**Correct**: `SHIFT PAUSE— CACTUS ED'S HAPPIEST PLACE`

**Bug**: "CASTUS" is missing the second "C" — should be "CACTUS". Project name must match everywhere.

**Regen directive**: preserve clipboard illustration composition (wooden board, metal clip, lined paper, circular coffee-ring stain bottom-left, slight dog-eared corner). Correct the header text only. Run `sips -Z 512` before save.

---

### 2. `ui_locker.png` — GARBLED STICKER TEXT

**Current sticker text** (top-right of locker): reads as `BDARG OF ED OL PEE MRATIN` / `SEPT 1087` or similar garbled placeholder string.

**Bug**: illegible placeholder garble. Previously annotated as "garbled sticker CANONICAL" in `verify_art_assets.mjs`, but **Kevin's 2026-04-23 ruling de-canonicalizes every typo except COUNTEREEIT.** Also `SEPT 1087` is an implausible date (1087 AD?) — should be recent/plausible.

**Regen directive**: preserve locker composition (gray-green metal locker door, ventilation slits top + bottom, combination dial, `CACTUS ED` nameplate, slight wear + rust streak). Replace the top-right sticker with a small, legible bureaucratic sticker. Suggested options:
- `BOARD OF ED. / CERTIFIED / SEPT 2007`
- `FACILITY INSPECTED / AUG 2023`
- `PROPERTY OF / C.E.H.P.`

Keep nameplate `CACTUS ED` intact. Run `sips -Z 512`.

---

## SUSPECTED ISSUES — CODEX VERIFIES AT FULL RES BEFORE REGEN

### 3. `crest_orientation_bureau.png` — SUSPECTED TYPO ON TOP ARC

**Current curved text** (top arc): reads at reviewer's resolution as `ORIENTATION BURRAU` OR `ORIENTATION BUREAU` — letter ambiguity at the fifth-sixth position. World 1 is canonical `Orientation Bureau` per `env_w1_orientation_bureau.png` (which correctly spells it).

**Action**: Codex opens the PNG at full resolution, verifies spelling character-by-character, and regenerates only if `BURRAU` is confirmed.

**Regen directive (if needed)**: preserve seal composition (circular badge, clipboard with three checkmarks center, laurel wreaths flanking, two five-point stars, `EST. 1987` center-below, bottom arc `FIRST-SESSION COMPLIANCE`). Correct top arc to `ORIENTATION BUREAU`. Run `sips -Z 512`.

---

### 4. `ui_training_poster.png` — FOOTER STRING POSSIBLY GARBLED

**Current footer text** (bottom-right): reads as `RUNT/DE. 1999` — possibly intended as `RUN TIME/DATE 1999`, `PRINT/ED. 1999`, or a bureaucratic run-code abbreviation.

**Action**: Codex visual re-check. If genuinely garbled (no plausible abbreviation fit), regen to a clean reference code:
- `RUN/ED. 1999-A`
- `FORM CE-1999`
- `PRINT. 1999 REV. 3`

If it's readable-enough as a deliberate bureaucratic artifact, mark audit-clean.

**Regen directive (if needed)**: preserve poster composition exactly (tan paper, red title bar `EMPLOYEE TRAINING POSTER — CACTUS ED'S HAPPIEST PLACE`, heading `KNOW YOUR MOVEMENTS`, subheading `A Reference for First-Session Compliance`, faint running-figure ghost silhouettes, coffee ring, push-pins top-left + bottom-right, footer-left `COUNTERFEIT EDUCATIONAL.ORG`).

**Important**: `COUNTERFEIT EDUCATIONAL.ORG` in the footer IS correctly spelled (two T's). This is the actual domain rendered without the seal typo. **Do NOT "fix" this to COUNTEREEIT.** The `COUNTEREEIT` typo lives ONLY on the seal.

---

### 5. `paper_expired_id.png` — COUNTEREEIT CALLBACK NOT VISIBLY PRESENT

**Observation**: `verify_art_assets.mjs` describes this asset as "diegetic ID with COUNTEREEIT callback" — but the visible text reads cleanly as `CACTUS ED'S HAPPIEST PLACE / CACTUS ED / EMPLOYEE NUMBER 00000 / 03/15/2022  03/15/2024 / EXPIRED`. A small vertical sticker on the right edge is hard to read but is not a visually dominant COUNTEREEIT reference.

**Action**: Codex decides one of:
- **(a) Accept as-is** and update `verify_art_assets.mjs` role to remove "COUNTEREEIT callback" language (replace with `diegetic expired employee ID`).
- **(b) Regen** with a visible COUNTEREEIT reference. Suggestions: a small `ISSUED BY: COUNTEREEIT EDUCATIONAL · ORG` line below the dates, or a corner stamp with the typo.

Reviewer recommends **(b)** because the thesis benefits from seeing the canonical typo in a second diegetic surface. But this is a Kevin taste-call if Codex wants to flag it up.

**If regen**: preserve ID composition (worn plastic laminate, mug-shot of tired human employee, green company color scheme, cactus silhouette header, `EXPIRED` stamp angled across the front). Add a small `COUNTEREEIT EDUCATIONAL · ORG` line or stamp.

---

## CANONICAL INTENTIONAL — DO NOT "FIX" THESE

### A. `seal_counterfeit_educational_org.png`

- **`COUNTEREEIT`** on top arc — Kevin-canonical typo. **PRESERVE.**
- **`DOCVMENTVM VBIQVE`** on central ribbon — classical Latin U→V substitution (reads as "DOCUMENTUM UBIQUE", meaning "document everywhere"). Period-correct institutional stylization, NOT a typo. **PRESERVE.**
- `ACCREDITATION PENDING`, `SEE REVERSE FOR TERMS`, `EDUCATIONAL · ORG` — spelled correctly and should stay.

### B. `ui_training_poster.png` footer

- `COUNTERFEIT EDUCATIONAL.ORG` — spelled correctly with two T's. Actual domain rendered without the seal typo. **PRESERVE.**

---

## CLEAN — NO TYPO ACTION NEEDED

Confirmed via reviewer visual scan on 2026-04-23:

| PNG | Text scanned | Status |
|---|---|---|
| `stamps_sheet.png` | `APPROVED` / `DENIED` / `REJECTED` / `FILED` | ✓ clean |
| `paper_safety_poster.png` | "IN CASE OF EXISTENTIAL DREAD, REMAIN AT YOUR STATION." / "SAFETY IS COMPLIANCE. COMPLIANCE IS SURVIVAL." | ✓ clean |
| `paper_hr_memo.png` | Header `HUMAN RESOURCES` + body memo text | ✓ clean (Kevin verified 2026-04-23; outgoing "Hunan Resources" flag was wrong) |
| `screen_end_of_shift.png` | (no legible text — cubicle interior only) | ✓ clean |
| `title_cold_open.png` | "CACTUS ED'S HAPPIEST PLACE" / "AN ORIENTATION EXPERIENCE" / "00:00:47" | ✓ clean |
| `crest_benefits_enrollment.png` | "BENEFITS ENROLLMENT ATRIUM" / "PROVISIONAL COVERAGE SINCE 1987" / "SUBJECT TO REVIEW" | ✓ clean |
| `logo_rasta_corp.png` | "RASTA CORP" / "LOGISTICS HUB" | ✓ clean |
| `env_w1_orientation_bureau.png` | `ORIENTATION` arrow + `W1 / ORIENTATION BUREAU` + welcome poster | ✓ clean (confirms `BUREAU` spelling — cross-check for #3) |
| `env_w2_benefits_enrollment.png` | `W2 / BENEFITS ENROLLMENT` + motivational posters | ✓ clean |
| `env_w3_rasta_corp.png` | (no legible text — retro decor only) | ✓ clean |
| `supervisor_silhouette.png` | `SUPERVISOR` nameplate | ✓ clean |
| `cactus_ed_brand_mascot.png` | `CACTUS ED` name tag | ✓ clean (*see cigarette note below*) |
| `coworker_mascot_variants.png` | (no text) | ✓ clean (Kevin approved 2026-04-23) |
| `prop_coffee_cup.png` | "WORLD'S OKAYEST EMPLOYEE" | ✓ clean (intentional stock-humor misspelling is period-correct mug iconography — NOT a typo) |
| `cactus_ed_portraits_masked.png` | (no text — 6-face sprite grid) | ✓ clean |

### Not scanned by reviewer (no text content likely; Codex should confirm during Phase 2)

- `cactus_ed_in_game_sprite.png` (HELD for Kevin taste-gate; pixel-art sprite)
- `cactus_ed_portraits_unmasked.png` (6-face grid)
- `carpet_tile_seamless.png` (texture tile)
- `enemy_deadline_wraith.png`
- `enemy_compliance_auditor.png`
- `enemy_telegraph_windup.png` (3-frame sprite sheet)
- `fluorescent_light_fixture.png`
- `prop_stamp_pad.png`
- `prop_filing_cabinet.png`
- `prop_archive_box.png`

### `screen_unmasked_reveal.png` — out of scope for this audit

Being regenerated in Phase 1 with a fresh prompt. Post-Phase-1 image should be spot-checked in Phase 2 as a safety pass before the audit closes.

---

## SPECIAL NOTE: `prop_coffee_cup.png` "OKAYEST"

The mug reads "WORLD'S OKAYEST EMPLOYEE". This is a period-correct piece of **stock ironic mug iconography** (like "WORLD'S BEST DAD", etc.) — the intentional non-word "OKAYEST" is the joke. **PRESERVE.** Do not "fix" to "OKAY" or "BEST."

---

## BRAND-VS-GAME TENSION (INFORMATIONAL, NOT A TYPO)

`cactus_ed_brand_mascot.png` depicts Ed with what appears to be a **lit cigarette** (visible smoke curl). Sacred constraint #7: "Cigarette stays unlit in all W3 paths." Reviewer reading: this is a *marketing/title* asset (brand register), not an in-game W3 path, so the constraint doesn't strictly apply — and the brand-vs-worker thesis actually benefits from surface polish that clashes with in-game wear (the cheerful brand Ed smokes; the tired in-game Ed probably shouldn't). Flag for Kevin only — **not an audit action for Codex**.

---

## EXPECTED OUTCOME OF PHASE 2

**Confirmed regens (2)**:
- `ui_clipboard.png` — `CASTUS` → `CACTUS`
- `ui_locker.png` — garbled sticker → clean bureaucratic sticker

**Probable regens (2, pending Codex full-res check)**:
- `crest_orientation_bureau.png` — if `BURRAU` confirmed
- `ui_training_poster.png` — if `RUNT/DE. 1999` has no valid reading

**Kevin taste-gate (1)**:
- `paper_expired_id.png` — regen with visible `COUNTEREEIT` callback, or accept as-is with role notes updated

**Role annotation updates in `scripts/verify_art_assets.mjs`**:
- Remove `"garbled sticker CANONICAL"` on `ui_locker.png`
- Replace `"HELD — Kevin taste-gate: keep Hunan Resources typo?"` on `paper_hr_memo.png` with `"diegetic HR memo (Kevin verified 2026-04-23 — Human Resources spelled correctly)"`
- Update `paper_expired_id.png` role to match whatever Codex lands

**Reviewer post-Phase-2 sign-off required before Phase 3 un-minify begins.**

---

## WHITELIST (SINGLE SOURCE OF TRUTH)

**The only canonical typos in the 32-PNG set are:**

1. `COUNTEREEIT` on `seal_counterfeit_educational_org.png` (top arc)
2. `COUNTEREEIT` callback on `paper_expired_id.png` (if added in Phase 2 via option (b))

**Everything else that looks like a typo IS a typo.** Fix it.

Classical Latin stylization (`DOCVMENTVM VBIQVE` on the seal) and stock humor ("OKAYEST" on the mug) are **not** typos — they're deliberate period/genre choices. Preserve.
