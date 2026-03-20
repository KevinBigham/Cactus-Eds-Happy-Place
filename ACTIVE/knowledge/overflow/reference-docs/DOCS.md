# DOCS

## Active Truth
- `index.html` — live gameplay/runtime truth
- `AGENTS.md` — repo defaults and rules
- `CLAUDE.md` — thin adapter that points Claude to the real active files
- `SPEC.md` — current runtime and compatibility truth
- `PLAN.md` — current roadmap and pass structure
- `IMPLEMENT.md` — implementation runbook
- `DOCS.md` — documentation map
- `docs/ACTIVE_WORKING_SET.md` — active file surface

## Supporting Doctrine
- `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md` — repo-local doctrine and priorities kept outside the default active surface
- `overflow/supporting-doctrine/DO_NOT_BREAK.md` — supporting guardrails retained on purpose

## Collaboration Defaults
- ChatGPT is architect/director only.
- Codex is builder only.
- Claude Code is reviewer only.
- Claude Cowork is ops/producer coordinator only.
- During structure passes, no one widens scope.
- Claude review starts only after Codex verification succeeds.
- `HANDOFF.md` must include clear `FOR CLAUDE REVIEW`, `FOR COWORK OPS`, and `FOR PUBLIC DEPLOY` sections.

## Active Workflow
- `FIRST_SESSION_REGRESSION_CHECKLIST.md`
- `docs/skills/first-session-certification/SKILL.md`
- `scripts/check_save_schema.js`
- `scripts/verify-cehp.sh`

## Historical Context
These files can still be useful, but they are not active runtime truth when they disagree with `index.html`:
- `README.md`
- anything under `legacy/quarantine/docs-archive/`
- archived transfer docs under `legacy/quarantine/docs-archive/TRANSFER/`

## Quarantine / Archive
- `legacy/quarantine/**`
- `overflow/` if it exists
- `overflow/supporting-doctrine/**`
- archived docs, prompts, briefings, reviews, migration notes, and handoffs
- archived runtime backups under `legacy/quarantine/runtime-backups/`
- archived validator/scripts under `legacy/quarantine/scripts-archive/`
- archived/historical runtime variants
- historical AI artifact dumps

## Skill Usage
- `docs/skills/first-session-certification/SKILL.md` is a repo-local skill draft.
- It is not auto-loaded by Codex in this environment.
- Consult it manually during first-session certification or copy it into Codex's real skills directory later if desired.

## Active Working Set Location
- The canonical active-working-set file lives at `docs/ACTIVE_WORKING_SET.md`.
- Do not create a competing root-level `ACTIVE_WORKING_SET.md`.
- Ignore `legacy/quarantine/**` by default unless the task explicitly asks for historical context.
- Ignore `overflow/` and any archive/history lane by default unless the task explicitly asks for it.

## Truth Note
- If a historical doc says the game has more scenes/worlds than the live `index.html` currently registers, the live runtime wins.

## Certification Audit
- `2026-03-13 True First-Session Continuity Certification`: World 1 spawn continuity still died in rupture before counselor. The run was also falsely logging `hotspotFails.counselor` before the counselor band was ever reached; counselor hotspot logging is now gated to active counselor-band damage only.
- `2026-03-13 True First-Session Continuity Certification`: World 2 spawn continuity reached the lawn/gardener preview and earned podium confirmation, but the authored trellis -> testing -> fake branch chain remains uncertified under browser-driven continuity.
- `2026-03-13 True First-Session Continuity Certification`: World 3 spawn continuity cleanly completed waiting and scan, but the physician threshold was reachable without clearing pre-auth; recovery now blocks forward progress at the physician threshold until pre-auth is complete and repeats the posted signature requirement through the protected readable path.
- `2026-03-13 True First-Session Continuity Certification`: Remaining uncertified segments are World 1 rupture -> counselor -> boss approach, World 2 trellis -> testing -> fake branch continuity, and World 3 pre-auth completion -> physician threshold in a single spawn continuity run.
- `2026-03-13 World 2 and World 3 Continuity Completion`: World 2 spawn continuity was rerun with a stronger disposable driver and proved no new runtime regression in garden, testing, fake-branch, or lawn systems, but the trellis confirmation chain still could not be completed honestly from spawn by automation. No gameplay fix was applied because the blocker remained route-driver weakness rather than a reproduced live gameplay fault.
- `2026-03-13 World 2 and World 3 Continuity Completion`: World 3 spawn continuity was rerun with stronger pharmacy and recovery routing. The run honestly completed waiting, scan, and recovery-gate approach from spawn, and the physician threshold still refused entry before pre-auth. No new gameplay fix was applied because the remaining failure was the disposable driver's inability to clear both lamps from spawn, not a reproduced gate, receipt, or lamp regression.
- `2026-03-13 World 2 and World 3 Continuity Completion`: Still uncertified after this pass: World 2 trellis confirmation into testing-route continuity, and World 3 integrated recovery climb -> lamp clear -> physician threshold from spawn. These segments still need a stronger disposable route driver or literal human hand-play.
- `2026-03-13 Stage Closure + Manual Handoff`: World 2 stage closure was attempted from the honest upper trellis shelf / pre-confirmation perch with one final targeted disposable-driver refinement. The run still stalled at `x=430, y=270` without `confirmationSeen.trellis`, so the stage verdict is `AUTOMATION-LIMITED; REQUIRES HUMAN HAND-PLAY`. No gameplay fix was applied because no live runtime defect reproduced from that checkpoint.
- `2026-03-13 Stage Closure + Manual Handoff`: World 3 stage closure was attempted from the honest recovery/pre-auth approach with one final targeted disposable-driver refinement. The run again completed waiting and scan, reached recovery, and kept the physician threshold blocked before pre-auth, but it did not clear lamp 1 or lamp 2 in integrated continuity. The stage verdict is `AUTOMATION-LIMITED; REQUIRES HUMAN HAND-PLAY`. No gameplay fix was applied because no live runtime defect reproduced from that checkpoint.
- `2026-03-13 Stage Closure + Manual Handoff`: Manual handoff now covers World 2 `upper trellis shelf -> trellis confirmation -> testing -> fake branch -> lawn -> gardener threshold` and World 3 `recovery approach -> lamp 1 -> lamp 2 -> pre-auth complete -> physician threshold`. Further disposable route-driver escalation should stop unless a later checkpointed run proves a real gameplay defect.
- `2026-03-13 Manual Certification Aid`: Added a dev-only query-param certification aid in `index.html` for `?certAid=w2` and `?certAid=w3`. It boots directly to the unresolved World 2 trellis perch and World 3 recovery/pre-auth approach, shows ordered runtime-truth success states in a fixed overlay, supports `R` retry and `H` hide, and exists to replace further disposable route-driver churn for those segments.
- `2026-03-13 Human Certification Readability`: Human checkpoint play confirmed two real blockers worth patching: World 2 pop-quiz answers were not reliably registering from the displayed controls, and the low-fi pass made critical W2/W3 checkpoint text too small to read quickly. The quiz now accepts the displayed numeric keys as well as `Z/X/C/UP` with a short post-open arming delay, and the certification overlay plus key W2/W3 instructional signs/readouts were enlarged for clearer human certification. Reports about the World 2 camera snap and the boss lacking legs were left unpatched in this pass because they were not the confirmed certification blocker.
- `2026-03-13 Repo Memory And Evidence Consolidation`: Audited the active repo memory stack, confirmed `index.html` still matches the active docs, and created the missing living-memory files (`CURRENT_PASS.md`, `HANDOFF.md`, `CERTIFICATION_EVIDENCE.md`, `RELEASE_CHECKLIST.md`, `KNOWN_ISSUES.md`, `REPO_MAP.md`, `VERIFY.md`, `DECISIONS.md`, `BACKLOG.md`, `REQUESTED_INPUTS.md`). No new gameplay/runtime patch landed in this pass because the only currently confirmed human-reported defect in the unresolved W2/W3 segments was already the readability/quiz-input issue fixed in the live runtime. Remaining forward progress now depends on repeat human checkpoint notes after that fix, not speculative new patches.
- `2026-03-13 Setup Normalization And Archive Cleanup`: Kept `docs/ACTIVE_WORKING_SET.md` as the single canonical working-set file, moved superseded prompt and architect-analysis docs into `legacy/quarantine/docs-archive/`, added redirect-note stubs at their former `docs/` paths, and set `scripts/verify-cehp.sh` as the canonical repo-level verify wrapper. No gameplay/runtime change landed in this pass.
- `2026-03-13 W2 Pop Quiz Input Repair Verification`: Re-read the fresh human W2/W3 notes, inspected the live World 2 quiz input path, and ran a narrow browser repro against `?certAid=w2`. The current runtime already accepts held `1` and held `Z` input after the quiz opens, so the reported quiz-input failure is not reproducible now and no new gameplay patch landed. The World 2 camera note, the boss-leg presentation note, and the World 3 route-clarity complaint were recorded but left unpatched in this pass.
- `2026-03-13 File-Structure Certification / Active-Surface Minimization`: Quarantined the remaining stale docs from `docs/`, archived the old root `TRANSFER/` pack and `HANDOFF_BIBLE.md`, moved root `index.pre-*.html` backups into `legacy/quarantine/runtime-backups/`, moved retired one-off validators into `legacy/quarantine/scripts-archive/`, and deleted the trivial redirect stubs once the active-file reference audit proved they were no longer needed. No gameplay/runtime change landed in this pass.
- `2026-03-13 Sustainability / Team-Readiness / File-Surface`: Added a thin root `CLAUDE.md` adapter, encoded the ChatGPT/Codex/Claude collaboration roles and structure-pass scope discipline in the active docs, and confirmed that no further root clutter needed an `overflow/` move. Supporting doctrine stayed in place because it is still referenced and safer to retain than relocate.
- `2026-03-13 Second-Pass Review / Team-Readiness Confirmation`: Claude Code reviewer confirmed: one unambiguous reading order, `docs/ACTIVE_WORKING_SET.md` is the only canonical working-set file, `CLAUDE.md` is thin and non-competing, `legacy/quarantine/**` is consistently ignored by default, no stale competing docs exist, both verification scripts pass, no files needed `overflow/` or archive moves. `CURRENT_PASS.md` updated to reflect this review pass. CLAUDE REVIEW section appended to `HANDOFF.md`.
- `2026-03-14 Final Sustainability / Baton-Pass / Cowork-Readiness`: Rewrote `README.md` into a short truthful landing page, moved supporting doctrine into `overflow/supporting-doctrine/`, standardized the active docs around the ChatGPT/Codex/Claude Code/Claude Cowork role split, and added the canonical `FOR COWORK OPS` handoff block. No gameplay/runtime change landed in this pass.
- `2026-03-14 Cowork-Readiness Review (Claude Code)`: Confirmed read order, CLAUDE.md thin adapter, supporting doctrine correctly in overflow/supporting-doctrine/, HANDOFF.md has both FOR CLAUDE REVIEW and FOR COWORK OPS. Fixed README.md Project Structure section (removed stale root TRANSFER/, corrected empty scaffold dirs label). Added FOR COWORK OPS to HANDOFF.md. Documented empty scaffold dirs in REPO_MAP.md. Both verification scripts pass. No gameplay change.
