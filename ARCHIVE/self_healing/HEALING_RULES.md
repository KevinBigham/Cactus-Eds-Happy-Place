# HEALING RULES

## Golden Rule
Never break a working game to fix a style issue. If in doubt, log it — don't fix it.

## Tier 1 — AUTO FIX Rules

### What qualifies for auto-fix
- Trailing whitespace on any line
- Duplicate semicolons (`;;`)
- `console.log` statements outside of debug-gated blocks
- Variables declared but never referenced
- Unused import statements
- Empty catch blocks with no comment

### What does NOT qualify
- Any logic change, however small
- Any variable rename
- Any function signature change
- Any change to save contract, boot paths, or query-param gating
- Any change to text content shown to the player
- Any change inside a `certAid` block

### Auto-fix process
1. Identify the issue with line number
2. Verify the fix is purely cosmetic (no behavior change)
3. Apply the fix
4. Log the fix in `AUTO_FIX_LOG.md` with date, file, line, before, after
5. Run `./scripts/verify-cehp.sh` if available
6. If verify fails, revert immediately and escalate to Tier 2

## Tier 2 — ASSISTED FIX Rules

### Process
1. Identify the issue
2. Write a suggestion file in `auto_tasks/REVIEWED/` using the auto-task template
3. Set STATUS to `REVIEWED`
4. Do NOT modify any code
5. Wait for Operations review and Architect approval

## Tier 3 — DISCOVERY TASK Rules

### Process
1. Identify the issue
2. Write a task file in `auto_tasks/DISCOVERED/` using the auto-task template
3. Set STATUS to `DISCOVERED`
4. Do NOT modify any code
5. Follow normal promotion workflow: Operations → Architect → NEXT_TASK.md

## Scope Protections

### File Size Limit
Self-healing may NOT modify files larger than 1,000 lines. Files above this threshold are too complex for automated fixes and require human review. Escalate to Tier 2 or 3 instead.

### Gameplay Logic Exclusion
Self-healing may NOT modify any code that affects gameplay logic. This includes: scene transitions, player input handling, enemy behavior, scoring, save/load, physics, camera movement, HUD/UI text content, and audio triggers. If a fix touches any of these systems, it is Tier 2 minimum.

### Verification Requirement
Before and after every Tier 1 fix, run `scripts/verify-cehp.sh` (if available). If verification fails after the fix, revert immediately — no exceptions.

### Scan Script Integration
Use `scripts/studio-scan.sh` for consistent scanning. The scan script is read-only and never modifies code. Scan results feed into `self_healing/AUTO_FIX_LOG.md`.

## Revert Protocol
If any auto-fix causes a verification failure:
1. Revert the change immediately
2. Log the failed fix in `AUTO_FIX_LOG.md` with status `REVERTED`
3. Escalate to Tier 2 (create an assisted-fix suggestion)
4. Do NOT retry the same fix
