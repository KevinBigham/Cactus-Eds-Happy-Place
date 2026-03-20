# HANDOFF

## What This Pass Did
Process Cleanup + Cold-Start Optimization (Sprint 006, 2026-03-15).
No gameplay or runtime changes. Restructured the repository so any new AI agent can understand the project and start working in under 2 minutes.

## Active Truth
- Runtime truth: `index.html` (NOT edited this pass)
- Public repo: https://github.com/KevinBigham/Cactus-Eds-Happy-Place
- Public URL: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
- Public status: Preview (local W2/W3 patches from Sprint 005 NOT yet pushed)
- Task beacon: `NEXT_TASK.md`
- Sprint history: `SPRINT_LOG.md`

## Files Changed This Pass
- `AGENTS.md` — full rewrite (model versions, tiered boot sequence, workflow, dev tracks)
- `CURRENT_PASS.md` — rewritten for Sprint 006
- `HANDOFF.md` — this file
- `NEXT_TASK.md` — new file (task beacon)
- `SPRINT_LOG.md` — new file (chronological history)
- `.codex/CEHP/*` — updated durable memory
- `CEHP - 000 - FOREVER INSTRUCTIONS - START HERE.md` — updated boot sequence

## Files Moved to overflow/reference-docs/
SPEC.md, PLAN.md, IMPLEMENT.md, DOCS.md, FIRST_SESSION_REGRESSION_CHECKLIST.md, CERTIFICATION_EVIDENCE.md, RELEASE_CHECKLIST.md, REPO_MAP.md, VERIFY.md, DECISIONS.md

These files are NOT deleted. They are stable reference material that agents should read when doing implementation, certification, or deploy work — not on cold-start.

---

## FOR CHATGPT ARCHITECT

### Current State
The repo now has a clean cold-start boot sequence. 9 active files at root instead of 17. New task beacon system (NEXT_TASK.md) means you define the next task there and every agent picks it up.

### What You Should Do Next
1. Read `NEXT_TASK.md` — current task is CEHP-007 (push patches to GitHub)
2. Read `BACKLOG.md` — review the task queue
3. After CEHP-007 completes, define the next feature/improvement task in `NEXT_TASK.md`

### Design Decisions Needed
- Should we add World 4 content or focus on completing W2/W3 certification first?
- Achievement system skeleton — worth building now or after certification?
- Sound design priorities — should we commission/generate placeholder audio?

### Your Literal Next Prompt
```
Read AGENTS.md, NEXT_TASK.md, BACKLOG.md, SPRINT_LOG.md.
The process cleanup pass (Sprint 006) is complete.
Define the next architectural priority after CEHP-007 (GitHub push) and CEHP-008 (human retest) are done.
Write the task to NEXT_TASK.md.
```

---

## FOR CODEX BUILDER

### Current State
No gameplay work this pass. The repo structure changed but index.html is untouched.
Reference docs you used to find at root (SPEC, PLAN, IMPLEMENT, VERIFY) are now in `overflow/reference-docs/`.

### What You Should Do Next
1. Read `NEXT_TASK.md` — that's always your task source
2. Current task (CEHP-007) is a GitHub push — that's Ops work, not Builder work
3. After CEHP-008 (human retest), the next Builder task will appear in `NEXT_TASK.md`

### Your Literal Next Prompt
```
Read AGENTS.md first, then NEXT_TASK.md.
If NEXT_TASK.md assigns work to Builder, read overflow/reference-docs/IMPLEMENT.md and overflow/reference-docs/SPEC.md before starting.
Build only what NEXT_TASK.md specifies. Do not widen scope.
```

---

## FOR CLAUDE CODE REVIEWER

### Current State
This was a process/doc-only pass. No runtime code to review.
The file layout changed — reference docs moved to overflow/reference-docs/ but content is preserved.

### What You Should Review
- Verify the new AGENTS.md boot sequence is clear and non-contradictory
- Verify NEXT_TASK.md format provides enough info for a cold-start agent
- Verify no active reference was lost in the overflow move

### Your Literal Next Prompt
```
Read AGENTS.md first.
Then read NEXT_TASK.md, CURRENT_PASS.md, HANDOFF.md.
Review the Sprint 006 process changes for:
1. Boot sequence clarity and completeness
2. No lost references to active validation or gameplay docs
3. NEXT_TASK.md format adequacy for cold-start agents
Do not widen scope into gameplay or runtime review.
```

---

## FOR COWORK OPERATIONS

### Current State
- Repo: local workspace (non-git checkout)
- All Sprint 006 process changes are applied locally
- Sprint 005 W2/W3 patches in index.html are STILL not pushed to GitHub
- Active task: CEHP-007 (push everything to GitHub from the real git clone)

### What You Should Do Next
1. From the real git clone at `/Users/tkevinbigham/Desktop/cactus-eds-happiest-place-main`:
   - Copy the updated files from this workspace
   - `git add` only in-scope files
   - Commit with a clear message referencing Sprint 005 + Sprint 006
   - Push to `main`
2. Verify GitHub Pages serves the updated index.html
3. Update NEXT_TASK.md to CEHP-008 (human retest)
4. Update .codex/CEHP/status.md and changelog.md

### Your Literal Next Prompt
```
Read AGENTS.md first.
Then NEXT_TASK.md, HANDOFF.md.
Mission: Push Sprint 005 patches + Sprint 006 process changes to GitHub.
Only push files listed in NEXT_TASK.md FILES_EXPECTED.
Verify public URL after push. Update NEXT_TASK.md with CEHP-008.
```

---

## FOR PUBLIC DEPLOY
- Public URL: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/
- Deploy source: public repo `main` branch
- Last verified commit: `ecc98ebb65d96ccad965cc97d5aea129fd4b273a` (pre-patch)
- Public status: Preview
- Deploy blocker: local Sprint 005 patches + Sprint 006 process changes must be pushed from the real git clone before public URL reflects any of this work
- About Me link text: Cactus Ed's Happy Place (Preview)
- About Me description: Browser-playable Phaser build on GitHub Pages with Title, Demo, World2, and World3 live now.

## Next Safe Prompt
```
Read 00_START_HERE.md first. Then AGENTS.md. Then NEXT_TASK.md.
Check TASK_OWNER_ROLE — if it matches your role, execute.
If not, write a proposal to ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md and stop.
```

---

## BEFORE YOU CLOSE (every agent, every session)

- [ ] Did I check `TASK_OWNER_ROLE` in NEXT_TASK.md before acting?
- [ ] Did I only work on my role-assigned task?
- [ ] Did I update `.codex/CEHP/status.md` and `changelog.md`?
- [ ] Did I update this HANDOFF.md file?
- [ ] Did I preserve the authority hierarchy?
- [ ] Did I avoid editing protected files without assignment?
- [ ] If no task existed for my role, did I write to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md` instead of acting?
- [ ] Re-read `00_START_HERE.md` to confirm compliance.

## IF NO TASK EXISTS FOR YOUR ROLE

**Do not self-assign. Do not improvise. Do not widen scope.**

Instead:
1. Write your proposal to `ACTIVE/CONTROL/PROPOSED_NEXT_TASK.md`
2. Optionally note observations in `.codex/CEHP/open_questions.md`
3. Stop
