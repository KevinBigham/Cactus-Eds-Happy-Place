# W9 — SCOPE PROPOSAL

> **Status**: Proposal (NOT plan of record). Kevin picks the track(s).
> **Authored**: 2026-04-22 during school-hours parallel sprint (Claude Opus 4.7, reviewer/ops).
> **Predecessor**: [W8_RETROSPECTIVE.md](W8_RETROSPECTIVE.md) — R03 / R04 / R01 / R02 / R05 all GREEN; 5 Kevin taste-gates stacked.
> **Scope rule**: ONE primary track per sprint. Secondary tracks are parallelizable doc/design work.

---

## State at Proposal Time

- Build: 40 modules → 299,912 bytes (88 B runway as of 2026-04-22 mid-day; may shift today based on Codex receipt-watermark session).
- Tests: 36/36 logic, 3/3 autoplay worlds GREEN, thermal PNG 116,994 B, save schema v2 + archaeological v1 pass.
- Launch target: **DEFERRED** (2026-05-29 Kane Pixels × A24 window released 2026-04-21 late; Kevin to set a new target after W7 visual contract + W8 refinement hold for 48 h).
- W8 taste-gates: 5 stacked (R03 receipts / R04 camera / R01 telegraph / R02 density / R05 curiosity).
- Art pipeline: 12 AI-rendered PNGs at `ACTIVE/game/art/`; title splash wired; receipt watermark in-flight (Codex parallel session 2026-04-22); autoplay harness shipped same-day.
- Outstanding Kevin-gated items: push to `main`, domain purchase, DNS flip, trailer publish, CR send, announce thread, save-schema v3, public Appeals UI — all in [BACKLOG.md](BACKLOG.md) under `PUBLIC_LAUNCH`.

---

## Candidate Tracks (7 total — 5 primary, 2 conditional)

### Track A · Art Integration Continuation

**Goal**: Finish wiring the 12 AI-rendered assets into live surfaces beyond the title splash + receipt watermark.

**Phases**:
1. **A1 — Stamp overprints** (~200 B + verdict-to-stamp mapping): slice `stamps_sheet.png` (or use Codex-generated individual stamp PNGs from the image bank) and apply APPROVED/DENIED/REJECTED/FILED by receipt verdict.
2. **A2 — Brand mascot letterhead** (~80 B): top-left corner composite on receipt card. (MAY ALREADY SHIP 2026-04-22 as stretch 1 in Codex parallel session — confirm on post-session intake.)
3. **A3 — Diegetic UI backgrounds** (~300 B + Overlay refactor): `ui_clipboard.png` behind pause menu, `ui_locker.png` behind save menu, `ui_training_poster.png` behind controls screen. Requires `OverlayScene` modification.
4. **A4 — Unmasked portraits on receipts** (~150 B + design call): surface the 6-face grid as receipt author portrait when tone is benign-personal or when a contradiction gate triggers.

**Total estimated bytes**: ~730 B
**Sacred-constraint risk**: LOW (all additive layers, procedural fallback required everywhere).
**Dependency**: A3 touches OverlayScene — may conflict with any Overlay work scheduled in parallel. A4 needs Kevin design call before wire-in.
**Conditional trigger**: if 2026-04-22 Codex session ships primary + stretch 1, A2 drops from scope.

---

### Track B · Readability Restoration Pass

**Goal**: Un-minify the modules that were compacted during W7 (EdKit/AirKit), W8 (52_curiosity, Phase 4/5 header compaction waves), and the 2026-04-22 art-pipeline BootScene compaction. Return authored clarity without behavioral change.

**Phases**:
1. **B1 — `build.js` module header restoration**: restore the `/* =============== MODULE: XX_NAME.JS =============== */` banner. Cost: ~2,353 B (the amount reclaimed across Phase 0 and Phase 0.5 of W8).
2. **B2 — Compacted source modules**: un-minify `89_ed_perform.js` (19 lines), `8A_air.js` (20 lines), `52_curiosity.js` (compact form), and the compacted header blocks in the 23 modules touched by Phase 4/5 + BootScene of the art pipeline. Cost: ~1-2 KB.

**Total estimated cost**: ~3-4 KB.

**Blocks on**: structural byte reduction elsewhere OR ceiling raise to 310 KB.

**Why this matters**: sacred constraint #2 is "ES5 only" — authored clarity is a soft constraint the project holds itself to. Minification is an acceptable TEMPORARY trade; ongoing minification is architectural debt. The research-synthesis doc explicitly names this: *"Readable modules return in W9 once byte pressure relaxes."*

**Sacred-constraint risk**: NEAR-ZERO (pure-mechanical identifier renaming + whitespace restoration; every change is byte-neutral on disk after expansion).

**Secondary benefit**: makes future reviewer passes faster and makes external contributors (Codex on cold-start, or a new agent) more productive.

---

### Track C · R06 "Promise of the Opener" W1 Audit

**Goal**: Diagnostic-only. Answer the question: *does W1 Orientation Bureau's opening sequence set the promise that the rest of the game delivers on?*

**Method**:
1. Kevin records a 3-minute video of himself playing W1 from cold boot, thinking aloud.
2. Reviewer writes a scorecard against the 25 locked rulings in `FINAL_GAMEPLAN.md`, checking for:
   - Tone: does the opener read as bureaucratic-horror-compliance-software or as a retro platformer demo?
   - Verbs: do all 11 permanent actions get telegraphed or exercised in the first 90 seconds?
   - Axes: are all 6 visible axes and 3 pairwise tensions "brushed" in the opener, even silently?
   - Receipt: does the first receipt deliver a tone that matches what the play felt like?
   - Contradiction: is the first contradiction gate memorable? (Research-synthesis doc flags this as a high-leverage moment.)
3. Reviewer delivers an audit PDF + priority-ordered list of 3-5 surgical fixes.

**Estimated cost**: 0 bytes (diagnostic). Follow-on fixes would be a separate phase.

**Why this matters**: the research-synthesis doc positioned R06 as the "diagnostic W1 opener audit" and explicitly noted it did not need to ship in W8. Now that W7 visual contract + W8 mechanical doctrine are both in place, W1 is the natural testbed for how the whole system reads to a first-session player.

**Dependency**: Kevin must record the video.

---

### Track D · Launch Re-Audit

**Goal**: Position CEHP for a public launch target, whenever Kevin chooses to set one.

**Phases**:
1. **D1 — Domain readiness**: check `counterfeit-educational.org` availability, price, registrar options. Document in `ACTIVE/docs/DNS_CUTOVER.md` (already staged; refresh against current reality).
2. **D2 — CR pitch freshness**: re-read `ACTIVE/marketing/cr_pitch_v1/SEND_READY_PACKET.md` against the current build (post-W7 + W8 + art pipeline). Does the pitch still describe the game accurately? Which screenshots need replacement?
3. **D3 — Trailer re-cut**: the W5-era `cehp_launch_trailer_final.mp4` (28 s, 1920×1080) predates W7 lens + W8 mechanics + art pipeline. Re-cut against the current live build.
4. **D4 — Go/no-go scorecard**: update `ACTIVE/docs/LAUNCH_GO_NOGO.md` with a fresh pass on every go-gate.

**Estimated cost**: 0 code bytes. 4-6 hours of doc/video work + Kevin decisions.

**Why this matters**: launch target is deferred but not cancelled. Having the launch-ready bundle refreshed means Kevin can pull the trigger on a new window with a single decision rather than a week of prep.

---

### Track E · HR Expansion Pre-Plan

**Goal**: Design doc only — sketch the Steam $14.99 "HR Expansion" tier called out in the rebuild doctrine.

**Questions to answer**:
1. Does HR Expansion add a 4th world, expand existing worlds, or layer vertical content?
2. Save-shape forward-compatibility: does it need schema v3?
3. Art pipeline: which of the 15 image-bank prompts (see [`ACTIVE/docs/_CODEX_SESSION_2026-04-22_RECEIPT_WATERMARK.md`](.) when it lands) apply to HR content?
4. Fragment budget: tone distribution for HR receipts — does "HR jargon" get its own `tone` field value?
5. Pricing: $14.99 is locked; is it base + expansion or bundled from launch?

**Estimated cost**: 0 code bytes. Design doc of ~15 pages.

**Why this matters**: the rebuild doctrine ruled "Steam later as 'The HR Expansion' ($14.99)." Having a pre-plan ready means when Kevin greenlights post-launch expansion work, the team (Codex + reviewer) can execute without a design-deadlock week.

**Risk**: premature planning — if the public launch never happens, this is wasted ink. Recommend doing this only if launch track (D) is also active.

---

### Conditional Track F · Autoplay Harness Graduation

**Goal**: Wire `autoplay.mjs` into the canonical `verify-cehp.sh` pipeline.

**Phases**:
1. **F1 — Wire into `verify-cehp.sh`**: add a `--full` flag that includes the three autoplay worlds. ~10 min of bash.
2. **F2 — Per-world timing budgets**: the current autoplay caps duration at 12,000 ms. Add world-specific budgets (e.g. W1 12 s, W2 15 s, W3 10 s). ~30 min.
3. **F3 — Visual regression**: capture a screenshot at the end of each autoplay run; compare against a baseline; fail on threshold delta. ~2 hours.

**Estimated cost**: 0 shipped bytes (tooling-only).

**Conditional**: only worth doing if the autoplay harness survives a second week of dogfooding. It's a post-W8 spike still proving itself.

---

### Conditional Track G · R03 / R04 / R01 Refinements

**Goal**: Surgical tuning if Kevin's W8 taste-gates return "flat" or "too strong."

**Phases**:
- **G-R03**: bump benign distribution from 63.7 % → 70 % if receipts read too flat.
- **G-R04**: tune `CAM_FALL_DY` from 28 → 22 if the fall feels over-anticipated.
- **G-R01**: tune Scantron `windupMs` from 220 → 260 if windup reads too short.
- **G-R05**: bump pulse from 600 ms → 800 ms if the curiosity reward isn't noticed.

**Estimated cost**: <100 B each; only triggers on specific Kevin signals.

**Conditional**: ONLY fires if taste-gate feedback explicitly requests a tune. Default = ship the sprint as-is.

---

## Reviewer's Recommendation

**Primary track**: **B (Readability restoration)** if ceiling is raised to 310 KB. Otherwise **A (Art integration continuation)**.

**Rationale**: the project is in a mature mid-stage where both more content and less debt are viable moves. Art continuation (A) is higher immediate visual payoff; readability (B) protects against the creeping minification debt that will otherwise compound every sprint. Kevin's "ugly on purpose" aesthetic means visual surface gets diminishing returns once thesis registers; unreadable minified modules get *increasing* costs as the project grows.

**Secondary track**: **D (Launch re-audit)** as background doc work regardless of primary pick. Zero byte cost, high strategic payoff — keeps launch optionality alive.

**Skip for now**: E (HR Expansion) unless launch track is also lit up. C (R06 W1 audit) has zero byte cost but eats Kevin video time — worth doing but not urgent.

**Conditional**: F (autoplay graduation) if the harness proves itself over another week; G (W8 refinement) only on specific Kevin taste-gate signal.

---

## Scope Guardrails

- **One primary track per sprint.** Everything else is secondary.
- **Each track single-theme.** Don't mix art continuation with readability restoration — they touch different classes of files and confuse byte accounting.
- **Byte budget discipline**: runway as of proposal time is 698 B (may shift post-Codex session 2026-04-22). If ceiling stays at 300 KB, most tracks require a companion minification or compaction move.
- **Kevin-gated items stay Kevin-gated.** Track D sketches the launch re-audit; it does not execute the launch.
- **Sacred constraints unchanged.** Every track preserves single-HTML, ES5, seeded RNG, invisible axes, save contract, Ed's voice, and no predatory retention.

---

## What W9 Sprint Proposal Needs from Kevin

1. **Pick a primary track** — A, B, C, D, or E.
2. **Pick a secondary track if desired** — D, C, or E (compatible with any primary).
3. **Byte-ceiling decision for Track B** — raise to 310 KB or stay at 300 KB? (B is viable only if raised.)
4. **Video-recording slot for Track C** — ~3 min of W1 play with think-aloud.
5. **Launch target for Track D** — new window pick, or explicit "no calendar commitment" confirmation.

---

**Proposal author**: Claude Opus 4.7 (reviewer/ops), 2026-04-22 mid-day, during school-hours parallel sprint with Codex.
