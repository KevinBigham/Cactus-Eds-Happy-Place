# CURRENT PASS

## Name
Process Cleanup + Cold-Start Optimization (Claude Cowork Opus 4.6 — 2026-03-15)

## Goal
Transform the repository into an AI-friendly operating system with the cleanest possible cold-start experience for new AI agents. No gameplay changes.

## What Changed This Pass
1. Moved 10 reference docs from ALL/ root to `overflow/reference-docs/`
2. Created `NEXT_TASK.md` — task beacon system
3. Created `SPRINT_LOG.md` — chronological sprint history
4. Rewrote `AGENTS.md` — exact model versions, tiered boot sequence, workflow diagram, game dev tracks
5. Rewrote `HANDOFF.md` — per-agent sections with literal next prompts
6. Updated `CURRENT_PASS.md` — this file
7. Updated `.codex/CEHP/` durable memory
8. Updated `CEHP - 000 - FOREVER INSTRUCTIONS - START HERE.md` — boot sequence matches new layout

## Root Surface Before (17 md files)
AGENTS, BACKLOG, CERTIFICATION_EVIDENCE, CLAUDE, CURRENT_PASS, DECISIONS, DOCS, FIRST_SESSION_REGRESSION_CHECKLIST, HANDOFF, IMPLEMENT, KNOWN_ISSUES, PLAN, README, RELEASE_CHECKLIST, REPO_MAP, REQUESTED_INPUTS, SPEC, VERIFY

## Root Surface After (9 md files + SPRINT_LOG)
AGENTS, BACKLOG, CLAUDE, CURRENT_PASS, HANDOFF, KNOWN_ISSUES, NEXT_TASK, README, REQUESTED_INPUTS, SPRINT_LOG

## What Did NOT Change
- `index.html` — no gameplay or runtime changes
- `BACKLOG.md`, `KNOWN_ISSUES.md`, `REQUESTED_INPUTS.md` — already current
- No files deleted — reference docs moved to overflow/reference-docs/

## Current Truth
- `index.html` is runtime truth (not edited this pass)
- Local workspace contains W2/W3 patches from Sprint 005 that have NOT been pushed to GitHub
- Public URL still serves the pre-patch version

## Human Retest Checklist (still pending from Sprint 005)
After pushing `index.html` from the real git clone:
1. `?certAid=w2` — trigger quiz at x~760, press 1. Quiz should close immediately.
2. `?certAid=w2` — walk left then right in garden zone, verify camera smoothly leads.
3. `?certAid=w2` — verify certAid panel labels are legible.
4. `?certAid=w3` — enter recovery zone (x>1920), verify "CLEAR BOTH LAMPS" readout is legible.
5. `?certAid=w3` — strike both lamps, verify gate message is legible at physician threshold.
6. `?certAid=w3` — walk left then right, verify camera smoothly leads.
