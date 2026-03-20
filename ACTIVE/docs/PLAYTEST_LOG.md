# PLAYTEST LOG

> Append-only record of human playtesting observations.
> AI agents must NOT edit or delete existing entries.
> Observations here inform Architect design decisions and outrank automated suggestions.

---

## How To Add An Entry

Copy this template and append it to the bottom of this file:

```
### [3.16 Kevin
- **Session length**: [approximate time played]
- **World/Scene**: [Demo / W2 / W3 / Menu / etc.]
- **Observation**: [What happened? What felt wrong or right?]
- **Possible improvement**: [Your idea, or "none — just logging"]
```

---

## Certification Retest Format

For CEHP-008 and later first-session retests, log 2-3 attempts for `?certAid=w2` and 2-3 attempts for `?certAid=w3`.
Use one entry per attempt so the next patch is based on evidence, not summary memory.

```
### [Date] — [Tester Name] — [W2 or W3] Attempt [1-3]
- **Launch URL**: [http://127.0.0.1:4175/index.html?certAid=w2 or w3]
- **Actions tried**: [literal route/actions attempted]
- **Furthest confirmed step**: [last objective definitely completed]
- **Visible confirmation text/state**: [what the game showed when it worked]
- **First failure point**: [where confidence broke or the route failed]
- **Classification**: [no issue / route clarity / execution / collision-hurtbox / text overlap / obvious bug]
- **Notes**: [camera feel, readability, quiz input, lamps, or none]
```

---

## Entries

### 2026-03-16 — Kevin — W2 (CEHP-008 retest, pre-patch build)
- **Launch URL**: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/?certAid=w2
- **Actions tried**: Played through full W2. Navigated trellis section, encountered quiz, proceeded through testing/principal/graduation.
- **Furthest confirmed step**: GRADUATION COMPLETE — GPA 3.0/4.0 (D, B, A, A). Valedictorian of the Wrong Class.
- **Visible confirmation text/state**: Final report card displayed. "Z — Proceed to World 3" prompt shown.
- **First failure point**: Two issues encountered:
  1. Movement blocked at trellis perch height — could not move forward at that elevation or higher; had to go below to find the path.
  2. First quiz appeared for ~0.2 seconds and auto-dismissed before it could be read or answered. When quiz returned later, it accepted input and responded normally.
- **Classification**: (1) route clarity at trellis, (2) obvious bug on quiz timing
- **Notes**: Pencils should be upside down — doesn't make sense to defeat them by jumping on the pointy side. Overall good experience on the level.

### 2026-03-16 — Kevin — W3 (CEHP-008 retest, pre-patch build)
- **Launch URL**: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/?certAid=w3
- **Actions tried**: Played through W3 recovery/pre-auth section. Located lamps, completed pre-auth, reached physician threshold, defeated boss.
- **Furthest confirmed step**: All 4 checkpoints completed — Lamp 1 [x], Lamp 2 [x], Pre-Auth Complete [x], Physician Threshold [x]. Boss defeated.
- **Visible confirmation text/state**: CertAid checklist showed all items checked. Boss fight completed.
- **First failure point**: CertAid text panel obscured the lamp area — "I can tell I'm supposed to be doing something with the lamps but I can't read with the big text box in front of it." Completed despite this.
- **Classification**: text overlap (certAid panel occludes gameplay in lamp zone)
- **Notes**: None on camera or quiz for W3.

### 2026-03-16 — Kevin — General observations
- **Closing screen font**: Unreadable on the final "THE FILES HAVE BEEN TABBED" screen. Needs larger/clearer font.
- **Graphics**: "This game is getting there! Just needs a hard upgrade on the graphics."
- **Pencils**: Should be flipped upside down — jumping on pointy side up feels wrong.
