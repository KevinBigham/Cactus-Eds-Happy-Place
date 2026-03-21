# ROUND 06 — ABILITY LICENSING

> **Goal**: Gate complexity, teach mechanics organically, deepen the institutional satire
> **Prerequisite**: Round 02 (institutional signage system), Round 04 (replay engine)
> **Est. Effort**: 3-4 days

---

## Context for Builder

The game currently dumps 13+ actions on the player from the start. This overwhelms new players and eliminates any sense of progression for veterans. Every AI brainstorm identified this as a major problem. The solution: an ability licensing system where moves exist but are "unlicensed" — you CAN still do them, but the institution RESPONDS.

This is not a hard lock. This is bureaucratic consequences for unauthorized behavior.

---

## Deliverables

### 1. Licensed vs Unlicensed Move System

On a fresh save, the player starts with these **Licensed** moves:
- Walk / Run
- Jump (single)
- Punch

All other moves are **Unlicensed**:
- Double Jump → "FORM 12-A: EXTENDED VERTICAL DISPLACEMENT"
- Wall Slide/Jump → "FORM 8-C: WALL CONTACT PROTOCOL"
- Kick → "FORM 3-D: ALTERNATIVE CONFLICT RESOLUTION"
- Spin Dash → "FORM 15-B: ROTARY LOCOMOTION AUTHORIZATION"
- Triple Jump → "FORM 12-A-EXT: EXCESSIVE VERTICAL DISPLACEMENT"
- Cig Copter → "FORM 22-F: AIRBORNE NICOTINE PROPULSION"
- Ground Slam → "FORM 9-G: CONTROLLED DESCENT INITIATIVE"
- Glide → "FORM 22-F-B: UNAUTHORIZED DRIFT"

**Critical design principle**: Unlicensed moves STILL WORK. The player can always perform any action. But using an unlicensed move has institutional consequences:

### 2. Consequences for Unlicensed Move Usage

When the player uses an unlicensed move:

**First use in a run**: A brief institutional notification flashes (0.5s):
"UNLICENSED MANEUVER DETECTED — FORM [X] REQUIRED"

**Repeated use (3+ times)**: An Auditor enemy may spawn nearby (small floating clipboard that slowly follows the player for 5 seconds, then disappears). Non-lethal but annoying — it blocks paths or pushes the player.

**On receipt**: A new section appears:
```
LICENSING VIOLATIONS
────────────────────
FORM 12-A (Double Jump): 7 unauthorized uses
FORM 15-B (Spin Dash): 12 unauthorized uses
STATUS: UNDER REVIEW
```

**Behavioral tracking**: Using unlicensed moves feeds the **Chaos** and **Intuition** axes. NOT using available unlicensed moves when they'd be useful feeds **Compliance**.

### 3. Certification Acts (Earning Licenses)

Each unlicensed move has a "Certification Act" — a small in-world training task that grants the license. These are discovered through institutional signage or by exploring.

| Move | Certification Act | Location |
|---|---|---|
| **Double Jump** | "Demonstrate Vertical Competence: Reach the elevated platform in the Orientation Hall" | W1 Zone 1 — small alcove above the main path |
| **Wall Slide/Jump** | "Complete Wall Contact Training: Ascend the Training Wall" | W1 Zone 2 — a short wall-climb section |
| **Kick** | "Attend Alternative Conflict Seminar: Kick 3 cones in the designated training area" | W1 Zone 2 — area with lined-up cones |
| **Spin Dash** | "Rotary Locomotion Exam: Charge through the Testing Corridor" | W2 Zone 1 — breakable wall at start |
| **Triple Jump** | "Advanced Vertical Assessment: Reach the hidden stamp above the maze" | W2 Zone 3 — stamp that requires triple jump |
| **Cig Copter** | "Airborne Propulsion Certification: Cross the Wellness Gap" | W3 Zone 1 — gap too wide for normal jumping |
| **Ground Slam** | "Controlled Descent Training: Break the floor panel in the Diagnostic Lab" | W3 Zone 2 — cracked floor tile |
| **Glide** | Auto-licensed after obtaining Cig Copter license | N/A |

**On certification**: Brief institutional fanfare (ascending tone + stamp SFX from R01). Text: "FORM [X] — APPROVED. [MOVE NAME] NOW LICENSED." The move name briefly flashes in the HUD area.

**Save integration**: Licensed moves are stored in the save data. Once licensed, always licensed (across runs).

### 4. The Employee Handbook (Pause Menu Addition)

Add a section to the pause menu: "EMPLOYEE HANDBOOK"

Lists all moves with their licensing status:

```
EMPLOYEE HANDBOOK — AUTHORIZED PROCEDURES
──────────────────────────────────────────
✓ BASIC LOCOMOTION ........... Licensed
✓ VERTICAL DISPLACEMENT ...... Licensed
✓ CONFLICT RESOLUTION (PUNCH)  Licensed
□ FORM 12-A: DOUBLE JUMP ..... PENDING
  "Report to Orientation Hall for assessment"
□ FORM 8-C: WALL CONTACT ..... PENDING
  "Complete Wall Contact Training"
✓ FORM 15-B: SPIN DASH ....... Licensed
  "Earned: Rotary Locomotion Exam"
```

Each unlicensed entry shows a hint about where to find the certification act. This gives players concrete goals and a reason to explore.

### 5. "Cigarette Brand" Cosmetic Variants (Stretch Goal)

If time permits, earning licenses through specific behavioral profiles (not just certification acts) unlocks cosmetic cigarette variants that appear on the receipt card:

| Behavioral Path | Brand Name | Visual Change |
|---|---|---|
| High Efficiency | "Mach 1s" | Cigarette has speed lines |
| High Grace | "FloatLites" | Cigarette has ethereal glow |
| High Chaos | "Demolition Reds" | Cigarette has ember sparks |
| High Compliance | "Standard Issue" | Plain, institutional white |
| High Curiosity | "Backdoor Slims" | Cigarette has question mark smoke |
| High Intuition | "Shadow Menthols" | Cigarette has dark purple smoke |

These are purely cosmetic and appear on the shareable receipt card (R05), giving players another reason to pursue different playstyles.

---

## Testing Checklist

- [ ] Fresh save starts with only Walk, Jump, Punch licensed
- [ ] All unlicensed moves still physically work
- [ ] First unlicensed move usage shows notification
- [ ] Repeated unlicensed usage occasionally spawns Auditor enemy
- [ ] Auditor is non-lethal and disappears after 5 seconds
- [ ] Receipt shows "LICENSING VIOLATIONS" section when applicable
- [ ] Each certification act is reachable and completable
- [ ] Completing certification act triggers approval fanfare + text
- [ ] Licensed moves persist in save data across runs
- [ ] Employee Handbook in pause menu shows all moves with status
- [ ] Unlicensed entries show hints for certification location
- [ ] Behavioral axes track licensed/unlicensed behavior correctly
- [ ] Save contract preserved (new fields added within schema)

---

## What This Unlocks

After this round, the game has real progression. New players start simple and gradually unlock complexity through discovery. Veterans have concrete goals (certify everything, try unlicensed runs). The system deepens the satire — the institution literally licenses your abilities — while solving the overwhelming-controls problem.
