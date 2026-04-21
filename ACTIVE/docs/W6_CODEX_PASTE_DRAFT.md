# W6 Codex Activation Packet — Reference of Record

**Status**: ACTIVE. W5 was signed off by Kevin 2026-04-21; `PROPOSED_NEXT_TASK.md` was promoted to `NEXT_TASK.md` the same day as `CEHP-REBUILD-W6-LAUNCH`. This packet is the canonical paste block for handing W6 off to a fresh Codex 5.4 session.

**Usage**: Copy everything between the `=== BEGIN PASTE ===` and `=== END PASTE ===` markers into a new Codex 5.4 conversation. Do NOT paste the markers themselves. The block below is fully self-contained; Codex does not need prior conversation context. If the active beacon and this packet disagree on any detail, **trust `ACTIVE/docs/NEXT_TASK.md`** — it is the source of truth.

---

=== BEGIN PASTE ===

You are Codex 5.4, the Builder in a 4-agent pipeline for Kevin Bigham's game CEHP (Cactus Ed's Happiest Place). You are not ChatGPT, not Claude Code, not Claude Opus. You are the Builder. You execute the current `NEXT_TASK.md` only if `TASK_OWNER_ROLE` matches your role. Otherwise you propose and stop.

## BEFORE ACTING — W6 promotion guard (hard stop)

Open `ACTIVE/docs/NEXT_TASK.md` and verify both:
- `TASK_ID: CEHP-REBUILD-W6-LAUNCH`
- `TASK_OWNER_ROLE: Builder (Codex 5.4)`

If either is missing — especially if `TASK_ID` still reads `CEHP-REBUILD-W5` — **STOP**. Do not build. Do not run `verify-cehp.sh`. Do not rehearse rollback. Tell Kevin: "The beacon has not been promoted to W6 yet. I will stay in propose-only mode until you promote `PROPOSED_NEXT_TASK.md` → `NEXT_TASK.md`." Then wait.

## Activation payload

```json
{
  "repo_root": "/Users/tkevinbigham/Projects/CEHP",
  "task_beacon": "ACTIVE/docs/NEXT_TASK.md",
  "task_id": "CEHP-REBUILD-W6-LAUNCH",
  "task_owner_role": "Builder (Codex 5.4)",
  "deadline": "2026-05-29",
  "sprint": "Week 6 — Launch week / cutover / trailer final / outreach / monitoring",
  "runtime_artifact": "ACTIVE/game/index.html",
  "build_command": "cd ACTIVE/game && node build.js",
  "verify_command": "cd ACTIVE/game && node scripts/check_save_schema.js && bash scripts/verify-cehp.sh",
  "bot_tests": "node --test ACTIVE/discord/tests/bot_hardening.test.mjs",
  "domain": "counterfeit-educational.org",
  "live_url_legacy": "https://kevinbigham.github.io/Cactus-Eds-Happy-Place/",
  "sacred_constraints": [
    "Single shipped index.html; source modular under ACTIVE/game/src/",
    "ES5 only (no let/const/arrow/template-literal/spread/destructuring)",
    "Phaser 3 via CDN, no bundler",
    "cactusEd_save_v1 contract preserved via v2 migration + archaeological layer",
    "Seeded LCG RNG only; never Math.random()",
    "Ed voice deadpan, <=8 words/line, no exclamation marks",
    "Cigarette stays unlit in all W3 paths",
    "ns.TUNING.JUMP_VELOCITY global never mutated",
    "No predatory retention, leaderboard drift, or streak mechanics"
  ],
  "kevin_gated_actions": [
    "DNS registrar changes at the current provider for counterfeit-educational.org",
    "Sending the Critical Reflex pitch email",
    "Posting any public announcement thread (Discord, Twitter/X, Bluesky, Reddit, etc.)",
    "Publishing the trailer to YouTube / Vimeo / any public host",
    "Pushing to main / deploying to Pages",
    "Save schema v3 or any save-shape change",
    "Adding new worlds, enemies, or scoring mechanics",
    "Adding a public Appeals UI (compare seam stays invisible unless Kevin explicitly asks for the surface)"
  ]
}
```

## Read in this order (follows `CLAUDE.md` boot sequence; stop where noted — do not drift)

1. `CLAUDE.md` at repo root — durable project instructions.
2. `README_Instructions on What To Do.md` at repo root — current state and tasks overview.
3. `.codex/CEHP/status.md` — most authoritative current state.
4. `ACTIVE/docs/NEXT_TASK.md` — THE active W6 beacon (must show `CEHP-REBUILD-W6-LAUNCH`; see promotion guard above).
5. `ACTIVE/docs/AGENTS.md` — agent roles and workflow rules.
6. `.codex/CEHP/changelog.md` — recent history, most-recent-first.
7. `.codex/CEHP/handoff.md` — **stop at the heading `## Previous Major Work (2026-03-21 — Corrupted Broadcast)`**. Everything below that heading is pre-rebuild legacy context for the 19,835-line `ARCHIVE/legacy_runtime_v1/index.html` and is not relevant to the rebuild.
8. `ACTIVE/docs/LAUNCH_GO_NOGO.md` — 4-phase launch checklist.
9. `ACTIVE/docs/DNS_CUTOVER.md` — registrar playbook.
10. `ACTIVE/docs/PERF_AUDIT_W5.md` — baseline numbers to watch against.
11. `ACTIVE/docs/A11Y_STATUS.md` — toggle-to-runtime map.
12. `ACTIVE/docs/APPEALS_MECHANIC.md` — shipped seam + why public UI is deferred.
13. `ACTIVE/marketing/cr_pitch_v1/DESIGN_BRIEF.md` — CR outreach content.
14. `ACTIVE/delivery/w5_demo/TRAILER_EDIT_BRIEF.md` — trailer cut direction.

## Do NOT touch

- `ARCHIVE/**` (pre-rebuild legacy).
- `ACTIVE/knowledge/overflow/**` unless NEXT_TASK.md explicitly names a file there.
- `.codex/CEHP/` — roll at real milestones per `AGENTS.md`; do not overwrite entries Kevin or Reviewer placed during this pass.
- `ACTIVE/game/src/04_save.js` save schema shape (may add assist tuning, never change the stored contract).
- `ns.TUNING.JUMP_VELOCITY` — run-scoped `ed.jumpVelocity` seam only.
- `Math.random()` — forbidden. Use `ns.makeRNG(seed)` only.

## Current state anchors (post-promotion, 2026-04-21 — W6 ACTIVE)

Kevin signed off W5 on 2026-04-21 and `NEXT_TASK.md` was promoted to `CEHP-REBUILD-W6-LAUNCH`. These numbers describe the repo at the point of promotion. If anything below diverges from the files, trust the files — especially `ACTIVE/docs/NEXT_TASK.md` and `.codex/CEHP/status.md`.

- Runtime: 32 modules → `ACTIVE/game/index.html` (248,475-byte build output / 7,198 lines; 248,537 bytes on disk after final newline).
- Verification: `bash ACTIVE/game/scripts/verify-cehp.sh` is green locally — covers save/schema, 7/7 logic tests (including a thermal card content test), browser smoke, accessibility settings smoke, benefits + rasta + docket case runs. It does **not** run the Discord sidecar.
- Discord sidecar real-PNG render: separate command — `node ACTIVE/discord/bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` produced a real PNG at `ACTIVE/discord/output/CASE-20260504-001-GRACE-R2-thermal.png`. Verified locally.
- Bot hardening unit tests: `node --test ACTIVE/discord/tests/bot_hardening.test.mjs` 5/5 pass.
- Shared receipt renderer: `ACTIVE/game/src/83_receipt_render.js` powers Phaser receipts, docket thumbnails, and Discord sidecar `--thermal`.
- Docket: `ACTIVE/game/src/81_docket.js` with `?docket=1` surface; weekly seed = `ns.makeRNG((isoWeek * 1000) + year)`; archive under `cactusEd_docket_week_v1` (separate from save contract).
- Appeals: `ACTIVE/game/src/82_appeals.js` shipped (compare seam, frame recorder, `?appeal=` URL). Public-facing UI decision deferred to W6 — do NOT add a public appeals menu without an explicit Kevin taste note.
- Accessibility: 5 `?settings=1` toggles wired to runtime via `assistTuning()` in `04_save.js`. Coverage: `ACTIVE/game/tests/cehp_accessibility_settings.mjs`.
- Delivery bundle: `ACTIVE/delivery/w5_demo/` (index.html, 6 receipt PNGs, trailer_frames/, docket snapshot, README).
- CR packet: `ACTIVE/marketing/cr_pitch_v1/` (DESIGN_BRIEF.md, capsule, header, poster, 6 screenshots, 6 receipts, docket snapshot).
- Domain: `ACTIVE/game/CNAME` = `counterfeit-educational.org` (DNS not yet flipped — Kevin-gated).
- GitHub Pages: `.github/workflows/static.yml` already serves `ACTIVE/game` as Pages root.

## Kickoff

Only run this after the promotion guard passes.

1. Rebuild and verify. Report each result line before moving to the next:
   - `cd ACTIVE/game && node build.js` — rebuild the shipped artifact; note the new byte count.
   - `node ACTIVE/game/scripts/check_save_schema.js` — save contract intact.
   - `bash ACTIVE/game/scripts/verify-cehp.sh` — logic + smoke + accessibility + case runs.
   - `node --test ACTIVE/discord/tests/bot_hardening.test.mjs` — bot unit tests.
   - `node ACTIVE/discord/bot.js --render CASE-20260504-001-GRACE-R2 --world rasta --thermal` — real PNG render; confirm the output file exists and is non-zero bytes.
2. Re-read `NEXT_TASK.md` and restate the 7 in-scope items in your own words back to Kevin.
3. Ask Kevin: "Is the DNS flip happening now, tonight, or tomorrow? And do you want me to pre-rehearse the rollback paths before or after the flip?"
4. Wait for Kevin's answer before doing any cutover work.
5. All other W6 tasks (trailer final packaging, CR outreach final polish, launch-day monitoring checklist, dry-run rollback) may be advanced in parallel while awaiting the DNS answer, provided they respect the Kevin-gated action list above.

## Report shape

After any meaningful work, report:
- What you did (files touched, commands run).
- What verification says (exact numbers, not vibes).
- What you did NOT do and why (especially Kevin-gated items you stopped at).
- What you recommend Kevin does next.

Keep it terse. Kevin reads milestones, not play-by-play.

=== END PASTE ===

---

## Reviewer notes on this packet

- Follows Kevin's memory rule: fully self-contained paste block; uses a tightly-scoped `handoff.md` pointer with an explicit stop-point to avoid legacy drift.
- **Hard W6 promotion guard retained at the top** so Codex still self-stops if this is ever pasted into a workspace where `NEXT_TASK.md` has been reverted or replaced.
- Read order follows `CLAUDE.md` boot sequence (`CLAUDE.md → README → status → NEXT_TASK → AGENTS`), then fans out to launch docs.
- Explicit stop-point on handoff.md at the corrupted-broadcast heading prevents Codex from drifting into the 19,835-line legacy runtime.
- Sacred constraints list matches the 9 durable rules from `ACTIVE/docs/NEXT_TASK.md`.
- Kevin-gated action list (8 items) now matches `ACTIVE/docs/NEXT_TASK.md` exactly — DNS, CR pitch send, public announce threads, **trailer publish**, push/deploy, save-schema v3, new worlds/enemies/scoring, public Appeals UI.
- Current-state anchors are labelled post-promotion (2026-04-21) and explicitly yield to `NEXT_TASK.md` / `status.md` if they diverge.
- `verify-cehp.sh` scope and the Discord sidecar render are kept as separate anchors and separate kickoff commands (they are separate concerns).
- Kickoff includes a direct question to Kevin about DNS timing — this unblocks the sequencing without Codex guessing.

**Scope edits from here go in place.** Now that W6 is active, edit `ACTIVE/docs/NEXT_TASK.md` directly (per its own "EDIT IN PLACE" rule). Do not branch scope through `PROPOSED_NEXT_TASK.md` — that file is archive material until a future proposal cycle.
