# DEVELOPMENT PLAYBOOK

## Before Any Implementation Pass

1. Read `NEXT_TASK.md` — confirm the task is assigned to you
2. Read the repo's `overflow/reference-docs/IMPLEMENT.md` if it exists
3. Make a backup of any file you're about to edit
4. Update `.codex/<GAME>/status.md` with your objective

## During Implementation

- Write the smallest change that solves the problem
- Test after every meaningful edit, not just at the end
- If you discover a new bug, log it — don't fix it in this pass
- Keep runtime behavior stable: save compatibility, boot paths, persistence

## After Implementation

- Run the repo's canonical verify command (e.g., `./scripts/verify-cehp.sh`)
- Update `.codex/<GAME>/changelog.md` with what changed
- Rewrite `.codex/<GAME>/handoff.md` for the next agent
- Update `HANDOFF.md` with per-agent sections

## Single-File Runtime Pattern

CEHP uses a single-file runtime (`index.html`). Rules for this pattern:
- Never have two agents editing the same file simultaneously
- Always make a timestamped backup before risky edits
- Prefer surgical line-level patches over section rewrites
- Verify that save keys, boot paths, and query-param gating still work after changes

## Browser-First Validation

- Real browser testing beats static analysis
- One world per browser instance for certification
- Focus the canvas before testing input
- Don't claim certification from automation alone — human play is the final authority
