---
name: first-session-certification
description: Use when validating Cactus Ed's first-session trust, overlap safety, and early boss-approach continuity in the live single-file HTML build. Run guide-first, treat index.html as runtime truth, validate in a real browser before using teleports, and report certification honestly.
---

# First Session Certification

Use this skill for Cactus Ed passes that validate or tune first-session trust, overlap timing, confirmation visibility, and early boss-approach continuity.

## Grounding Order
1. Read `AGENTS.md` first.
2. Read `overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`.
3. Treat `index.html` as implementation truth.
4. Read `SPEC.md`, `PLAN.md`, `IMPLEMENT.md`, and `DOCS.md`.
5. Read `FIRST_SESSION_REGRESSION_CHECKLIST.md`.
5. Carry forward active `DO NOT REGRESS` bullets from the latest certification report.

## Default Search Terms
- `showProtectedReadableText`
- `dumpFirstSessionSummary`
- `_counselorPreteach`
- `_gardenerPreview`
- `_waitingDoor`
- `_scanLesson`
- `_preAuthDrill`
- `overlapPrevented`
- `w1_stamp_ack`

## Workflow
1. Make a fresh sibling backup of `index.html` before edits.
2. Confirm the live helper surface in `index.html` before changing anything.
3. Use a real browser with focused canvas input first.
4. Use one world per browser instance for certification.
5. Use teleports or state injection only after a real-input failure is observed, and only to isolate that hotspot faster.
6. Prefer the smallest safe fix. Do not broadly rewrite the live file for local overlap or timing problems.
7. Preserve save compatibility, assist persistence, and direct boot into `Demo`, `World2`, and `World3`.

## Validation Rules
- Start local server:
```bash
python3 -m http.server 4175 --bind 127.0.0.1
```
- Reliable browser smoke:
```bash
node /tmp/codex-playwright-cert/smoke.js
```
- Save contract validator:
```bash
node scripts/check_save_schema.js
```
- If the disposable browser smoke script is missing, recreate it under `/tmp` only.
- Browser save/continue probe:
```bash
node /tmp/codex-playwright-cert/save_continue_probe.js
```
- This skill file is a repo-local draft. It must be consulted manually unless later copied into Codex's real skill directory.

## Overlap And Confirmation Law
- All delayed teaching or confirmation text must use protected readable-path logic.
- Do not let older generic reward or acknowledgment text overwrite later teaching-space confirmations.
- Do not let the World 2 preview dismissal regress to delayed polling or leave preview text alive after close.
- Do not let World 3 diagnostic zone receipts enter the scan teaching pocket.
- Treat `TEXT_ZONES` as a shared fragile surface whenever modifying NPC chatter, receipts, PA lines, ads, or drill confirmations.

## Required Report Shape
1. SUMMARY OF CHANGES
2. EXACT CODE EDITS / PATCH BLOCKS
3. CHANGED STRINGS
4. VALIDATION PERFORMED
5. COMMUNICATION UPGRADE
6. REMAINING RISKS / NEXT PASS

## Certification Honesty
- Do not claim full certification unless a full focused continuity run actually happened.
- If only targeted probes were run, say so directly and name the missing route segments.
- Separate structural correctness from felt correctness.
