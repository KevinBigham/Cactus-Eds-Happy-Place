# CEHP Plan

## Goals
- Preserve durable cross-agent memory in `.codex/CEHP`
- Maintain clean cold-start boot sequence for new AI agents
- Support the task beacon system (NEXT_TASK.md) for clear work assignment

## Ordered TODO
1. Execute CEHP-007: push Sprint 005 patches + Sprint 006 process changes to GitHub from the real git clone.
2. Execute CEHP-008: human retest of W2/W3 patches using the 6-item checklist in CURRENT_PASS.md.
3. Based on retest results, classify remaining issues and define next gameplay task.
4. Keep `.codex/CEHP/status.md` current before and after every pass.
5. Mirror important repo-level changes into `.codex/CEHP/` durable memory.

## Dependencies
- CEHP-007 requires access to the real git clone (not this non-git workspace)
- CEHP-008 requires CEHP-007 to be complete (patches must be live on GitHub Pages)
- Next gameplay task requires human retest evidence from CEHP-008

## Deferred
- World 4 content
- Achievement system skeleton
- Sound/audio design
- Mobile touch controls
- Speedrun timer surface
- File splitting or build-system introduction
