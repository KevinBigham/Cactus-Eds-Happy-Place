# IMPLEMENT

## Read Order Before Changes
1. `AGENTS.md`
2. `docs/ACTIVE_WORKING_SET.md`
3. `CURRENT_PASS.md`
4. `HANDOFF.md`
5. `SPEC.md`
6. `PLAN.md`
7. `DOCS.md`
8. `FIRST_SESSION_REGRESSION_CHECKLIST.md`
9. `CERTIFICATION_EVIDENCE.md`
10. `RELEASE_CHECKLIST.md`
11. `KNOWN_ISSUES.md`
12. `REPO_MAP.md`
13. `VERIFY.md`
14. `DECISIONS.md`
15. `BACKLOG.md`
16. `REQUESTED_INPUTS.md`
17. `docs/skills/first-session-certification/SKILL.md` when doing certification work

## Safe Working Rules
- Make a fresh sibling backup of `index.html` before risky passes.
- Prefer the smallest safe fix first.
- Keep gameplay/runtime edits inside `index.html` unless the task is explicitly about repo memory or tooling.
- Preserve direct boot, save compatibility, and assist persistence.
- Treat older docs as historical unless they match the live runtime.

## Overlap Law
- All delayed teaching and confirmation text must use protected readable-path logic.
- Audit shared `TEXT_ZONES` surfaces when changing any:
  - receipts
  - PA lines
  - ads
  - NPC chatter
  - drill confirmations

## Validation Rules
- Real browser first, teleports second.
- One world per browser instance for certification.
- Focus the canvas before movement or attack input.
- Reliable smoke path:
```bash
python3 -m http.server 4175 --bind 127.0.0.1
node /tmp/codex-playwright-cert/smoke.js
```
- Save validation path:
```bash
node scripts/check_save_schema.js
node /tmp/codex-playwright-cert/save_continue_probe.js
```
- Quick wrapper:
```bash
./scripts/verify-cehp.sh
```
- If the disposable smoke harness is missing, the wrapper still runs the live save-contract validator and tells you what browser smoke is still needed.

## Manual Certification Aid
- Dev-only checkpoint aid:
  - `index.html?certAid=w2`
  - `index.html?certAid=w3`
- Controls while active:
  - `R` retry the active checkpoint by scene restart
  - `H` hide/show the aid overlay
- Remove the query param and reload to disable the aid and return to normal flow.
- Human notes remain primary. The aid exists to speed human certification, not to replace it.

## Reporting Expectations
- State exactly what changed.
- State exactly what commands ran.
- State what was verified versus what remains unverified.
- Do not claim gameplay certification unless a real continuity run happened.
