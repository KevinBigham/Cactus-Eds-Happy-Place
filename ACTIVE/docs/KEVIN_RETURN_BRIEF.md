# KEVIN RETURN BRIEF — 2026-04-22 School-Hours Parallel Sprint

> **Status**: POPULATED (all lanes 1-7 landed)
> **Window**: Kevin at BSHS teaching seniors; two-track work — Codex on game code (two ships), Reviewer on docs/verification
> **Reader**: Kevin, cold, on return from school. Optimized to be readable in under 3 minutes.

---

## TL;DR

- **Codex shipped TWICE** (v1 + v2). v1 = receipt watermarks. v2 = **20 new PNGs + Shift-End Reveal micro-evolution + per-world splashes**.
- **Reviewer shipped four files**: W8 retrospective · art verify script · W9 scope proposal · this brief.
- **Build**: 292,499 bytes — **7,501B runway** under ceiling (improved +5,927B from v1).
- **All verify green**: save schema pass · autoplay W1/W2/W3 MATCH+OK · 40/40 logic tests (4 new regressions added by Codex).
- **SACRED CONSTRAINTS ALL INTACT** (audited line-by-line).
- **3 new Kevin taste-gates stacked**: hand-thesis cue, tumbleweed read, "Hunan Resources" typo.
- **Safe to push?**: YES, technically. But you have 3 new taste-gates + 5 carried W8 taste-gates = **taste-gate-fest recommended before push**.

---

## What Shipped While You Were Teaching

### Codex lane (TWO ships, both green)

**v1 — Receipt Watermarks** (298,426 bytes, 1,574B runway)
- W1/W2/W3 crests + always-on COUNTEREEIT seal + mascot letterhead on non-thermal receipts
- `src/83_receipt_render.js` minified (option-a) to clear ceiling
- Thermal path + headless Discord fallback preserved untouched

**v2 — 20-Image Batch + Shift-End Reveal** (292,499 bytes, 7,501B runway — +5,927B improvement)
- **20 new AI-generated PNGs** via Codex's native image-gen, across 3 tiers:
  - Tier 1 MUST (9): coworker_mascot_variants, supervisor_silhouette, env_w1/w2/w3_establishing, screen_unmasked_reveal, screen_end_of_shift, paper_hr_memo, cactus_ed_portraits_masked
  - Tier 2 SHOULD (6): carpet_tile_seamless, enemy_deadline_wraith, enemy_compliance_auditor, paper_safety_poster, prop_coffee_cup, prop_stamp_pad
  - Tier 3 COULD (5): fluorescent_light_fixture, prop_filing_cabinet, prop_archive_box, paper_expired_id, enemy_telegraph_windup
- **Shift-End Reveal sequence wired** — after every run completion (non-thermal), ShiftEnd scene shows `screen_unmasked_reveal` (1500ms) → `screen_end_of_shift` (1500ms) → routes to Receipt. Skip gated at 500ms wall-clock (so it doesn't punish on repeat). Thermal bypass preserved via `nextRunCompleteScene` helper.
- **Per-world BootScene splash routing** — orientation/benefits/rasta PNGs load per URL; `splash=0` and `thermal=1` bypass preserved
- **W1 coworker tableau** wired into orientation runtime at alpha 0.28, depth 1.5 (decorative only)
- **`8A_air.js` cleanup hardened** — idempotent + missing-camera safe (defensive bug fix)
- **4 new regression tests** added in `rebuild_logic.test.mjs`: scene routing helpers, thermal bypass, ShiftEnd skip timing, Air cleanup safety

### Reviewer lane (4 deliverables, all landed)

| # | File | Purpose |
|---|---|---|
| 1 | `ACTIVE/docs/W8_RETROSPECTIVE.md` | Per-phase ledger R03/R04/R01/R02/R05 + runway passes |
| 2 | `ACTIVE/game/scripts/verify_art_assets.mjs` | Extended to cover all 32 PNGs (batch 1 + batch 2 tiers) |
| 3 | `ACTIVE/docs/W9_SCOPE_PROPOSAL.md` | 7 candidate tracks + reviewer recommendation |
| 4 | `ACTIVE/docs/KEVIN_RETURN_BRIEF.md` | This file |

---

## Verify Matrix Results

| Command | Result | Detail |
|---|---|---|
| `node build.js` | ✅ | 40 modules → **292,499 bytes** (7,501B runway) |
| `node scripts/check_save_schema.js` | ✅ | `cactusEd_save_v1` (v2+v1 archaeological) passed |
| `node scripts/autoplay.mjs --world orientation` | ✅ | 10/10 PASS, determinism MATCH |
| `node scripts/autoplay.mjs --world benefits` | ✅ | 11/11 PASS, determinism MATCH, enemy observed |
| `node scripts/autoplay.mjs --world rasta` | ✅ | 10/10 PASS, determinism MATCH |
| `node --test tests/rebuild_logic.test.mjs` | ✅ | **40/40** (was 36, +4 Codex regressions) |
| `node scripts/verify_art_assets.mjs` | ✅ | 32/32 expected PASS, 0 unexpected |

**All green. Zero errors. Zero warnings.**

---

## Sacred-Constraint Audit (Reviewer line-by-line pass on Codex's diff)

- [x] **Zero `Math.random`** — scene helpers `a/r/o/d` are pure, Shift-End is time-gated, Air cleanup is deterministic
- [x] **Zero ES6 forms** — all `var`, all `function()`, no let/const/arrow/template literals in any touched module
- [x] **JUMP_VELOCITY / GRAVITY unchanged** — no references, no assignments anywhere in src/
- [x] **Save schema `cactusEd_save_v1` intact** — contract preserved
- [x] **Byte ceiling respected** — 292,499 < 300,000 (7,501B runway)
- [x] **Ed's voice** — ShiftEnd sequence is SILENT as directed (no text, no !)
- [x] **No predatory retention** — pure diegetic reveal, skippable after 500ms
- [x] **Happy-accident typos** — COUNTEREEIT preserved, locker garble preserved, paper_expired_id also carries COUNTEREEIT callback

---

## Taste-Gates & Decisions Needed From You

**Eight total stacked — 3 new from today + 5 carried from W8.**

### NEW (Codex v2 — from today's ship)

1. **`screen_unmasked_reveal.png` hand-thesis cue** — Codex flagged this. Does the unmasked-Ed image clearly show a human hand inside the costume cuff? That visual IS the thesis. If not, regenerate. _(see image in `ACTIVE/game/art/screen_unmasked_reveal.png`)_
2. **`coworker_mascot_variants.png` tumbleweed read** — Codex flagged. The tumbleweed worker — does it parse as a mascot suit or as actual tumbleweed tumor? _(see `ACTIVE/game/art/coworker_mascot_variants.png`)_
3. **`paper_hr_memo.png` "Hunan Resources" typo** — Image generator produced "Hunan" instead of "Human." CANONICAL happy accident, or regenerate? Your call. Reviewer recommends **KEEP** (COUNTEREEIT precedent).

### CARRIED (from earlier + W8)

4. **Title splash wire-in** — `title_cold_open.png` still on BootScene fallback. With per-world splashes live, does title card ever show in normal play? (Only if URL has no world param.) Kevin eye-check.
5. **In-game sprite HOLD** — `cactus_ed_in_game_sprite.png` still NOT wired. Taste-gate pending.
6. **Receipt watermark review** — v1 crests + COUNTEREEIT seal + mascot letterhead live on non-thermal. Does the low-alpha crest still leave the 3-line verdict as primary read? (Codex flagged this for review.)
7. **ShiftEnd sequence pacing** — 3-beat sequence (reveal 1.5s → after 1.5s → receipt). Is 500ms skip-lock right? Too short = feels punishing. Too long = feels dismissive.
8. **W8 taste-gates (×5)** — R03 tone bias (5 receipts before/after), R04 camera (30s W2 play), R01 enemy telegraph (W2 room 4), R02 Encounter Director (W2 feel), R05 Curiosity (2min W1 sign-peek)

---

## Launch Target — RECONCILED

Per `.codex/CEHP/status.md` line 70 (the authoritative surface per CLAUDE.md):

> **"target public launch: deferred, no calendar commitment. 2026-05-29 Kane Pixels × A24 window is no longer the trigger."**

Your memory file `cehp_launch_target.md` says 2026-05-29 — **this is now stale**. Recommend updating it to match. No action blocked by this either way; it just keeps our memory honest.

---

## W9 Scope Selection — Decision Needed

`ACTIVE/docs/W9_SCOPE_PROPOSAL.md` lists 7 candidate tracks. Reviewer recommendation:

- **If you raise the 300KB ceiling** → **Track B** (readability restoration — un-minify W7/W8 modules)
- **If ceiling holds** → **Track A** (art integration continuation — there are 8 unwired new PNGs ready to wire)

**Reviewer's updated recommendation after today**: Track A is now more attractive. Codex v2 shipped 20 new assets but only wired ~9. The other 11 (supervisor_silhouette, carpet, enemy_*, paper_safety_poster, props, fluorescent, expired_id) are sitting in `art/` unused. Wiring them is high-leverage with existing runway (7,501B).

Secondary: **Track D** (launch re-audit — domain, trailer, CR) is lower-urgency now that launch is deferred.

---

## Outstanding Stale State

- **`ACTIVE/docs/NEXT_TASK.md`** — still points at W7. W8 complete, W9 scope TBD by you. Promotion waits on your track selection.
- **Memory file `cehp_launch_target.md`** — says 2026-05-29, but canonical says deferred. Update recommended.
- **Push to main** — nothing has pushed since `aec0a6c` on 2026-04-21. You have: W8 sprint + autoplay harness + art pipeline + Codex v1 + Codex v2 all local.

---

## Files You Touch First on Return

In priority order (~5 min total):

1. `ACTIVE/game/art/screen_unmasked_reveal.png` — rule on taste-gate #1 (hand cue)
2. `ACTIVE/game/art/coworker_mascot_variants.png` — rule on taste-gate #2 (tumbleweed)
3. `ACTIVE/game/art/paper_hr_memo.png` — rule on taste-gate #3 (Hunan typo)
4. `ACTIVE/game/index.html` in browser — play `?world=orientation` → finish a run → watch the 3-beat Shift-End sequence → rule on pacing (#7)
5. `ACTIVE/docs/W9_SCOPE_PROPOSAL.md` — pick a W9 track

---

## What NOT To Do On Return

- **Don't push yet** until you've cleared at least taste-gates #1-3 (the three quick image calls). W8 taste-gates can clear in parallel sessions.
- **Don't touch `ACTIVE/docs/NEXT_TASK.md`** until you've picked a W9 track — it stays stale by design.
- **Don't regenerate the 12 batch-1 PNGs** — they're canonical (`verify_art_assets.mjs` guards them).
- **Don't un-minify `src/83_receipt_render.js`** without queuing Track B (that's the W9 readability restoration).

---

## Session Stats

- **Tokens into Codex prompts**: ~4KB (v1) + ~8KB (v2 with 20-image bank)
- **Codex round-trips**: 2 (both clean, zero rework)
- **Reviewer files produced**: 4 docs + 1 verify script update
- **Byte delta on runtime**: 299,912 → **292,499** (-7,413B, thanks to Codex's minification discipline)
- **Test count delta**: 36 → **40** (+4 regressions)
- **Asset count delta**: 12 → **32** PNGs (+20)
- **Zero sacred constraints violated**
- **Zero pushes** (Kevin-gated)

---

_Brief authored 2026-04-22 under the "Kevin at school, maximize autonomy" protocol. Codex v1 and v2 both landed clean within the window. All verification matrices green. Ready for your eyes._
