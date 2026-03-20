# 000 - AI PORTFOLIO START HERE

This portfolio assumes **chat is temporary** and **the filesystem is the only reliable handoff**.
If you are a new AI session working on one of these games, do not trust prior chat memory. Rebuild context from files.

## The three games

- **CEHP** = *Cactus Ed's Happiest Place*
- **MBD** = *Mr. Baseball Dynasty*
- **MFD** = *Mr. Football Dynasty*

## Non-negotiable rule for all three games

Use the relevant `.codex/[GAME_CODE]/` folder as the durable memory surface.
At minimum, these files should exist and stay current:

- `agent.md`
- `status.md`
- `plan.md`
- `decisions.md`
- `changelog.md`
- `open_questions.md`
- `runbook.md`
- `handoff.md`

If any are missing, create them before meaningful work.

## Global operating procedure

1. **Identify which game you are in.**
2. **Read that game's `000 - FOREVER INSTRUCTIONS - START HERE.md` first.**
3. **Read every file in `.codex/[GAME_CODE]/` before doing work.**
4. Treat `.codex` as canonical memory. If chat and files disagree, **files win until you explicitly document the conflict and resolve it**.
5. Update `status.md` before work. Update `plan.md` if priorities changed.
6. During work, persist important findings immediately:
   - stable project understanding -> `agent.md`
   - design/implementation choices -> `decisions.md`
   - unresolved ambiguity -> `open_questions.md`
   - useful commands, traps, setup notes -> `runbook.md`
7. After work:
   - append `changelog.md`
   - refresh `status.md`
   - rewrite `handoff.md`
8. Before replying to a human, make sure durable files are already updated.

## Recommended reply format for any AI session

Start status replies with:

```text
Synced:
- [list of .codex files updated]
```

Then state:
- what you did
- what changed
- what is next
- blockers / assumptions

## Current portfolio-level warnings

- **Do not assume all repos are equally authoritative.** Two of these projects have donor / legacy folders that must not be treated as the active app root.
- **Do not use two competing roots for the same game.** Pick the documented active root and ignore stale docs elsewhere.
- **Do not rely on this file alone.** It is only the router. The real project state lives in `.codex` and the active repo docs.

## Open the game-specific file next

- CEHP -> `CEHP - 000 - FOREVER INSTRUCTIONS - START HERE.md`
- MBD -> `MBD - 000 - FOREVER INSTRUCTIONS - START HERE.md`
- MFD -> `MFD - 000 - FOREVER INSTRUCTIONS - START HERE.md`
