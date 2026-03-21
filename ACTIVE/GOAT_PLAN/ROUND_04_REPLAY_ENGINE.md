# ROUND 04 — THE REPLAY ENGINE

> **Goal**: Create irresistible "one more run" energy
> **Prerequisite**: Round 03 (Receipt 2.0 with archetype titles and scoring data)
> **Est. Effort**: 2-3 days

---

## Context for Builder

The game currently has no pull-through from receipt screen to next run. Players see their receipt, then... nothing. This round converts the emotional peak of the receipt into instant replay motivation. Every AI brainstorm identified the replay loop as a critical missing piece.

---

## Deliverables

### 1. RE-ENROLL / APPEAL Buttons on Receipt Screen

After the receipt stamp animation (R03), two large buttons appear:

**"RE-ENROLL"** (default selected, highlighted)
- Restarts the SAME world with the same conditions
- Skip all menus — instant restart in <250ms
- Receipt footnote on next run: "RE-ENROLLMENT #[count] — Subject demonstrates persistence"

**"APPEAL"** (secondary option)
- Restarts the world with a new case seed
- Policies/minor variations shift
- Receipt footnote: "APPEAL FILED — Case reassigned to [random department name]"

**"PROCEED"** (smaller, less prominent)
- Advances to next world (existing behavior)
- Only available if there IS a next world

**Layout**: RE-ENROLL and APPEAL should be large, prominent, and fast. PROCEED is smaller. The visual hierarchy should scream "play again" not "move on."

**Key press mapping**: Z = RE-ENROLL, X = APPEAL, C = PROCEED. Any of these should work instantly (no confirmation dialogs).

### 2. Corrective Action Items

Every receipt ends with 1-2 personalized "Corrective Action Items" — optional micro-dares for the next run.

**Generation logic**: Based on the player's dominant axis, generate a dare that pushes toward a DIFFERENT axis:

| Dominant Axis | Example Corrective Actions |
|---|---|
| Chaos | "Complete the Testing Corridor with fewer than 2 unauthorized eliminations" (pushes toward Compliance) |
| Compliance | "Locate and enter 1 unauthorized route" (pushes toward Intuition) |
| Efficiency | "Read 3 institutional signs before completing the world" (pushes toward Curiosity) |
| Curiosity | "Complete the world in under [current_time - 15s] seconds" (pushes toward Efficiency) |
| Grace | "Achieve a kill combo of 3 or higher" (pushes toward Chaos) |
| Intuition | "Use only the designated main corridor for 60% of traversal" (pushes toward Compliance) |

**Display format on receipt:**
```
═══════════════════════════════════
CORRECTIVE ACTION ITEMS (VOLUNTARY)
───────────────────────────────────
□ Complete Testing with fewer than
  2 unauthorized eliminations
□ Read 2 institutional signs
───────────────────────────────────
COMPLIANCE WITH THESE ITEMS MAY
AFFECT YOUR NEXT EVALUATION.
═══════════════════════════════════
```

**Tracking**: If the player RE-ENROLLs and completes a Corrective Action Item, the next receipt includes a special stamped paragraph:

```
✓ CORRECTIVE ACTION COMPLETED
  "Fewer than 2 unauthorized eliminations"
  STATUS: BEHAVIOR MODIFIED
  The institution appreciates your cooperation.
```

Store active Corrective Action Items in localStorage (within the save contract).

### 3. Behavioral Score (F to S Rank)

Add a letter grade to the receipt based on how INTENSELY the player exhibited their dominant trait. This isn't about being "good" — it's about being COMMITTED to a playstyle.

**Scoring thresholds** (based on dominant axis percentage):

| Score | Threshold | Receipt Text |
|---|---|---|
| **S** | 85%+ dominant axis | "BEHAVIORAL PURITY: S — EXEMPLARY COMMITMENT" |
| **A** | 70-84% | "BEHAVIORAL CONSISTENCY: A — NOTABLE DEDICATION" |
| **B** | 55-69% | "BEHAVIORAL TENDENCY: B — ADEQUATE FOCUS" |
| **C** | 40-54% | "BEHAVIORAL INCLINATION: C — MODERATE EXPRESSION" |
| **D** | 25-39% | "BEHAVIORAL AMBIGUITY: D — INDETERMINATE PROFILE" |
| **F** | <25% | "BEHAVIORAL CONFUSION: F — PROFILE UNRESOLVABLE" |

**Display**: Large letter grade next to the archetype title on the receipt. Visual treatment — S rank gets a gold stamp, A gets silver, etc.

**Psychology**: This taps into the same drive as Devil May Cry's style ranks or Tony Hawk's letter grades. Players will replay to improve their grade in a specific personality category.

### 4. Instant Restart Key

Map a single key to instant restart from ANYWHERE in gameplay (not just receipt screen):

- **R key** = instant restart of current world
- Screen flashes a red "FILED" stamp for 1 frame
- Restart completes in <250ms
- Current run is counted as an INCIDENT (adds to death counter)
- Receipt note: "VOLUNTARY TERMINATION DETECTED"

**Rationale**: In skill games, restart speed is a retention multiplier. Reducing friction between "I want to try again" and actually trying again is the highest-leverage change for replay rate.

### 5. Run History Counter

Display a small, unobtrusive run counter on the pause screen:

```
ENROLLMENT HISTORY
──────────────────
Total Enrollments: 14
World 1: 6 runs
World 2: 5 runs
World 3: 3 runs
Current Streak: 3 consecutive
```

This gives players a sense of investment without being intrusive. Store in save data.

---

## Testing Checklist

- [ ] RE-ENROLL button restarts same world instantly (<250ms)
- [ ] APPEAL button restarts with different seed/variations
- [ ] PROCEED advances to next world
- [ ] Z/X/C keys map correctly to the three options
- [ ] Corrective Action Items appear on receipt (1-2 per run)
- [ ] Completing a Corrective Action Item produces acknowledgment on next receipt
- [ ] Behavioral Score (F-S) appears on receipt
- [ ] Score correlates with dominant axis intensity
- [ ] R key instant restarts from anywhere in gameplay
- [ ] Instant restart flashes "FILED" stamp
- [ ] Run history appears on pause screen
- [ ] All new data stored within save contract
- [ ] Save contract preserved

---

## What This Unlocks

After this round, the game has a complete play→reward→replay loop. The receipt is no longer an endpoint — it's a launchpad. Players will instinctively hit RE-ENROLL to beat their score, complete a dare, or try a different approach. This is the "one more run" engine.
