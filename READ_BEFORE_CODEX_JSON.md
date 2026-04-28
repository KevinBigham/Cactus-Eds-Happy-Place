# READ BEFORE CREATING A JSON FOR CODEX — CEHP

> Purpose: pre-flight checklist before you write a Codex handoff JSON for Cactus Ed's Happiest Place.
> Walk top-to-bottom. Skip what's obvious; stop if you can't answer.
>
> Sources: `reference_codex_handoff_pattern.md` (8-element pattern, zero-failure across MBD/MFD long sessions) + Codex 5.5 self-interview (2026-04-24).
> Prior repo example: `ACTIVE/docs/W6_CODEX_PASTE_DRAFT.md`.

---

## 0. Delivery rule (non-negotiable)

**ALWAYS LEAVE THE JSON FOR KEVIN IN THE CHAT SO HE CAN EASILY COPY/PASTE IT TO CODEX.**

- Paste as a single fenced ```json block. One copy, one paste into Codex.
- Do NOT save it to a file Kevin has to open. Do NOT split across blocks. Do NOT ask first.

---

## 1. Should you even delegate?

CEHP is a single HTML file (~16K lines). That shapes delegation more than MFD/MBD. Codex 5.5 confirmed: **line-range scope discipline is weaker in a giant file** — be extra anchored.

**Delegate to Codex GPT-5.5 when:** task spans multiple scenes (Title / Demo / World2 / World3), root cause unclear across `ACTIVE/game/index.html`, new scene/mechanic + Playwright verification, save-compat fix that spans load + migration paths, multi-hour autonomy is the point, Kevin can't babysit.

**Solve directly in Claude Code when:** one-line or localized edit inside a single scene, explanation only, needs live back-and-forth, overhead > task. If <15 min with one focused Edit, skip the JSON.

---

## 2. Before you write anything — gather inputs

```
cd /Users/tkevinbigham/Projects/CEHP
git status --short && git rev-parse HEAD && git branch --show-current
cd ACTIVE/game && ls scripts/ tests/
```

Read / confirm: `ACTIVE/docs/NEXT_TASK.md`, `ACTIVE/docs/AGENTS.md`, `ACTIVE/docs/KNOWN_ISSUES.md`, `.codex/CEHP/status.md`, `.codex/CEHP/handoff.md`, `ACTIVE/docs/W6_CODEX_PASTE_DRAFT.md` (prior-wave shape). Confirm the FUNCTION NAMES + line ranges in `index.html` where the change lands.

---

## 3. The 8 elements — every handoff has ALL of them

Codex 5.5 confirmed: 1-6 are high-impact; 7-8 are only as useful as they are specific. Do not cut any for 2-3hr sessions.

1. **Preflight** — `git` check + starting commit SHA + clean-tree confirm. For large waves: back up `index.html` before edits.
2. **Single save-compat bump** — If save shape changes, do exactly one version bump for the whole handoff, one migration in the load path, one backwards-compat note. If no bump is needed, say so explicitly and why.
3. **Slice-by-slice breakdown** — 4-6 reviewable slices (by scene or by feature) with commit messages. **Per-slice checkpoint rule:** complete slice N, run its tests, inspect diff, then proceed. Do not start slice N+1 with failing slice-N tests unless failure is unrelated and documented.
4. **Explicit section/anchor targets** *(CEHP-critical per Codex)* — for each slice name the **FUNCTION NAMES**, nearby comments, AND line ranges in `index.html` + the Playwright script(s) to touch. Function-name anchors beat line numbers alone because line numbers drift mid-session.
5. **Test plan per slice** — specific Playwright assertions or smoke checks + expected pass/fail signal, not "add tests".
6. **Verification gate** — full command sequence after EVERY slice. Pre/post `rg` for touched function names is required. Include a **failure policy**: if unrelated tests fail, stop after capturing the failure summary; continue only if the slice can still be verified independently.
   ```
   cd /Users/tkevinbigham/Projects/CEHP/ACTIVE/game
   rg -n "function <touchedFnName>" index.html   # pre-edit anchor
   node scripts/<relevant-verify-script>.js
   npx playwright test tests/<relevant-smoke>.spec.js
   rg -n "function <touchedFnName>" index.html   # post-edit collateral check
   ```
7. **Durable memory updates** — `.codex/CEHP/status.md`, `changelog.md`, `handoff.md` (+ `decisions.md` / `open_questions.md` if applicable). Name EXACT facts to preserve.
8. **Assumptions / non-goals** — what NOT to do; data gaps flagged honestly.

---

## 4. Prompt contract — fields every slice needs

Each slice in the JSON states:

- **Task** — one sentence, exact verb
- **Current evidence** — failing script / error text / observed behavior / screenshot description
- **Section targets** — function names + nearby comments + line ranges in `index.html`
- **Edit radius** *(NEW)* — `Do not edit outside named functions + declared line ranges unless needed to fix compile/runtime failures caused by this task; document any exception.`
- **Pre-edit contract readout** *(NEW — highest-leverage per Codex)* — `Before patching, rg the target function names, read them, and summarize in 5 bullets: existing behavior, invariants, globals touched, scene lifecycle hooks used, and the Playwright oracle you'll verify against.`
- **Constraints** — CEHP invariants (§5)
- **Forbidden changes** — concrete scenes/sections NOT to touch
- **Verification commands** — exact shell with pre/post rg + expected pass/fail signal
- **Failure policy** *(NEW)* — stop/fix/report rule for unrelated test failures
- **Deliverable format** — patch + passing scripts + progress ledger + "risks + what didn't land"
- **Risk areas** — save compatibility, single-file line drift, Phaser scene lifecycle, ES5 syntax regression

---

## 5. CEHP invariants — must appear in constraints

- **Single HTML file** — everything lives in `ACTIVE/game/index.html`. No new files in `ACTIVE/game/` unless asset (art/audio/content).
- **ES5 only** — match surrounding style exactly. No arrow functions where ES5 is consistent, no template literals, no `const`/`let` outside existing usage, no modules/imports, no transpilation.
- **No module conversion, no syntax modernization, no broad formatting** — authored style is load-bearing.
- **Phaser via CDN** — no npm Phaser, no bundling, no build step.
- **Zero build tools** — must still deploy by pushing the HTML file to GitHub Pages.
- **Save compatibility is sacred** — existing local saves must load. If shape changes, add a migration in the load path.
- **Scene lifecycle integrity** — Phaser scenes (`Title`, `Demo`, `World2`, `World3`) preserve `preload`/`create`/`update` ordering. No cross-scene state leaks.
- **Patch only named functions/sections** — confirmed via pre/post `rg`.
- **No emoji in game UI** — authored visual art.
- **Authored readability** — don't auto-format the whole file. Scoped edits only.
- **Playwright smoke tests are the verification surface** — `ACTIVE/game/tests/` and `ACTIVE/game/scripts/`.
- **Never `git add -A`** — stage files explicitly.
- **No opportunistic refactoring** across the 16K-line file. Lane discipline is critical.

---

## 6. Anti-patterns — Codex 5.5 flagged these as drift/hallucination vectors

Never write into a handoff:
- "Fix everything" / "Clean up the repo" / "Refactor index.html"
- "Modernize the code to ES6+" (intentional ES5)
- "Split into modules" (single-file is a hard constraint)
- "Auto-format the file" (authored style is load-bearing)
- "While you're there" / "Update related scenes as needed"
- "Best implementation" without saying what must stay stable
- "Handle edge cases" without naming them
- Multiple save-compat bumps per session
- Broad cross-scene edits in one slice (break per scene)
- Motivational framing / role preamble past the first mention

---

## 7. Prompting rules (bake into objective / context)

- Ask for working code + passing Playwright runs, not a plan
- Exact verification commands with script filenames
- Name what NOT to change (function names, scenes, line ranges — not "surrounding stuff")
- Prefer the smallest safe patch
- Debugging: Codex must REPRODUCE via Playwright before fixing
- Review: findings ordered by severity with line-number evidence
- If a change needs a fresh Playwright script, name it and its assertions

---

## 8. Model + effort routing

- **Model:** `gpt-5.5` default. Fall back to `gpt-5.4` only if Codex rejects 5.5 — note the fallback.
- **Default effort when unset:** GPT-5.5 defaults to `medium`. For CEHP save-compat or cross-scene work, override to `high` explicitly.
- **Effort tiers:**
  - `medium` — single-scene tweaks, bug fixes, Playwright script additions
  - `high` — DEFAULT for cross-scene features, save-compat work, ambiguous bugs, scene-lifecycle changes
  - `xhigh` — only for "could corrupt saves" or new world-scale features
- **Fast mode:** OFF by default. ON wins for: mechanical renames, fixture updates, copy edits, small art swaps, obvious syntax-error fixes. Keep OFF for: save-compat, scene lifecycle, cross-scene state, pre-ship review. If ON, compensate with stricter verification + mandatory diff review.

---

## 9. After Codex returns (post-verification)

### Claude Code's checks

1. Read the Codex result in full
2. `git status --short` + `git diff --stat` + review the actual diff
3. Confirm scope — no drift outside target line ranges/functions, no new files outside asset dirs, no stray reformatting
4. Run the verification gate yourself:
   ```
   cd /Users/tkevinbigham/Projects/CEHP/ACTIVE/game
   node scripts/<verify-scripts>
   npx playwright test
   rg -n "function <touchedFnName>" index.html
   ```
5. Check Codex's self-critique section (5 questions below)
6. Risky changes (save-compat, scene lifecycle, cross-scene state): manually load an existing save and confirm it still plays

### Self-critique gate — require this in Codex's deliverable

Before final response Codex must inspect `git diff` and answer:
- **Save-compat bump?** (expected vs actual, justification if deviated)
- **ES5 preserved?** (any stray arrow functions, template literals, `const`/`let` inconsistency)
- **Scene lifecycle intact?** (no preload/create/update reordering, no cross-scene state leaks)
- **Tests run?** (exact commands + pass/fail per command)
- **Files outside scope?** (list, with justification — especially edits outside named functions)

### Remote monitoring — how to tell Codex is stuck

Codex won't always say "I'm stuck". Watch for:
- Many `rg` searches, no contract readout or patch
- Edits outside declared function names without written justification
- Repeated Playwright failures with different speculative fixes, no narrowed hypothesis
- Phrases without code evidence: "probably", "seems like", "I'll just", "quick workaround"

Build stop conditions INTO the handoff.

---

## 10. Final output checklist (before you paste the JSON)

- [ ] All 8 elements present
- [ ] Prompt contract fields per slice include **edit radius**, **pre-edit contract readout**, **failure policy**
- [ ] At most one save-compat bump (or explicit "no bump" with reason)
- [ ] CEHP invariants (§5) in constraints — especially single-file + ES5 + no modernization
- [ ] Forbidden changes concrete (function names / scenes / line ranges — not "related stuff")
- [ ] Verification commands exact with pre/post rg + expected pass/fail signal
- [ ] Per-slice checkpoint rule stated
- [ ] Self-critique gate (5 questions) in deliverable format
- [ ] Remote stop conditions in the prompt
- [ ] Memory-update requirements name EXACT facts
- [ ] Starting commit SHA + branch in preflight
- [ ] Function names + line ranges + nearby-comment anchors per slice
- [ ] Progress ledger required in final output (slice status, commands run, failures, files touched)
- [ ] JSON is in the chat as a single ```json block
- [ ] Kevin can copy/paste with one click

---

*v2 — 2026-04-24. Incorporates Codex GPT-5.5 self-interview confirmations. Keep under ~220 lines — checklist, not manual.*
