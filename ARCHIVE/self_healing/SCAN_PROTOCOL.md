# SCAN PROTOCOL

## When To Scan

Scans should run at these trigger points:
- **After every sprint completion** (before updating SPRINT_LOG.md)
- **Before major release builds** (before pushing to GitHub)
- **After large merges** (when multiple file changes land at once)
- **When NEXT_TASK.md changes** (new task may surface related issues)

## Scan Types

### CODE HEALTH
```
Signals:
- TODO / FIXME comments in source
- Files exceeding 4,000 lines
- Functions exceeding 100 lines
- Duplicated code blocks (>10 lines identical)
- Unused variables or functions
- console.log outside debug gates
- Trailing whitespace, duplicate semicolons
```
Tier 1 items → auto-fix. Everything else → Tier 2 or 3.

### BUILD HEALTH
```
Signals:
- scripts/verify-cehp.sh fails
- scripts/check_save_schema.js fails
- Save contract shape changes unexpectedly
- New console errors on scene boot
```
All build health issues → Tier 2 minimum. Never auto-fix build failures.

### ARCHITECTURE DRIFT
```
Signals:
- New globals added to index.html
- Scene count changes without doc update
- Save key changes without migration plan
- New query params without documentation
```
All architecture drift → Tier 3 (discovery task for Architect review).

### GAMEPLAY OPPORTUNITIES
```
Signals:
- Backlog items older than 2 sprints without progress
- Empty scaffold directories (art/, audio/, tests/, etc.)
- Known issues open for more than 3 sprints
- Engagement systems referenced but not implemented
```
All gameplay opportunities → Tier 3.

## Task Limits
- Maximum 10 tasks in `auto_tasks/DISCOVERED/` at any time
- If limit reached, compare estimated impact and keep the top 10
- Displaced tasks are moved to `auto_tasks/REJECTED/` with reason "displaced by higher priority"

## Scan Output
After each scan, append a summary to `self_healing/AUTO_FIX_LOG.md`:
```
## Scan — [date]
- trigger: [sprint complete / pre-release / merge / task change]
- code health: [N issues found, M auto-fixed]
- build health: [pass/fail]
- architecture drift: [N signals]
- gameplay opportunities: [N signals]
- tasks generated: [list of AT-NNN IDs]
```
