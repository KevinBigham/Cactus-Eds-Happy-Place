# ROUND 08 — RETENTION SYSTEMS

> **Goal**: Give players reasons to come back tomorrow, next week, and next month
> **Prerequisite**: Round 04 (replay engine), Round 07 (policy/behavioral systems)
> **Est. Effort**: 3-4 days

---

## Context for Builder

The game now feels great (R01), teaches well (R02), has infinite receipts (R03), replays smoothly (R04), shares virally (R05), has progression (R06), and adapts to the player (R07). What it still lacks: reasons to return AFTER a session ends. This round adds daily hooks, collection systems, and long-term identity investment.

---

## Deliverables

### 1. Daily Enrollment Challenge

Once per calendar day, the institution issues a "Daily Memo" that modifies gameplay for all players globally.

**Implementation:**
- Generate a daily seed from the date: `var dailySeed = new Date().toISOString().slice(0,10);`
- Use the seed to deterministically select one modifier from a pool

**Modifier pool (30+ for a month of variety):**

| Modifier | Name | Effect |
|---|---|---|
| Low gravity | "GRAVITATIONAL AUDIT" | Jump height +20%, fall speed -15% |
| Speed day | "EFFICIENCY MANDATE" | Ed runs 15% faster, enemies patrol 15% faster |
| Fragile day | "BUDGET CUTS" | Ed takes double damage, but stamps worth double |
| Pacifist day | "WELLNESS WEEK" | No enemies spawn — pure platforming |
| No copter | "SMOKING BAN" | Cig copter disabled — find alternatives |
| Combo day | "INITIATIVE BONUS" | Kill combo multiplier starts at x2 instead of x1 |
| Mirror day | "ORIENTATION REVERSAL" | Level is horizontally flipped |
| Quiz blitz | "STANDARDIZED TESTING DAY" | Double the number of pop quizzes in W2 |
| Speed run | "EXPEDITED PROCESSING" | Par time displayed, bonus receipt line if beaten |
| Big Ed | "PERSONNEL ENLARGEMENT" | Ed is 1.3x size — can reach more, fits through less |

**UI:**
- On the title screen / cold open, show: "TODAY'S MEMO: [modifier name]"
- Brief description: "All gravitational parameters are under review today."
- Daily challenge has its own receipt that includes: "DAILY ENROLLMENT #[date] — [modifier name]"
- Daily receipts are shareable via R05's receipt card system

**Tracking:**
- Store in localStorage: last daily date completed, streak counter
- Receipt shows: "DAILY ENROLLMENT STREAK: [count] CONSECUTIVE DAYS"

### 2. Receipt Cabinet (File Cabinet Collection)

Add a "FILE CABINET" screen accessible from the pause menu or title screen.

**Display:**
- Each past receipt is stored as a collapsible card
- Cards show: date, world, archetype title, behavioral score, one key quote
- Cards have stamps: "FILED" (normal), "CONTESTED" (if player used APPEAL), "CORRECTED" (if Corrective Action was completed)
- Rare receipt variants (1-in-50 chance) have a special "CLERICAL ERROR" stamp

**Collection incentives:**
- Track unique archetype titles collected: "CLASSIFICATIONS RECORDED: 8/36"
- Track unique behavioral scores per axis: "S-RANKS ACHIEVED: 2/6"
- Display completion percentage: "FILE COMPLETENESS: 34%"

**Implementation:**
- Store receipt summaries in localStorage (compact format — archetype, score, dominant axis, date, world, one quote)
- Cap at last 100 receipts to avoid storage bloat
- Render as a scrollable list with institutional filing aesthetic

### 3. Department Assignment (Long-Term Identity Track)

After 5+ runs, the institution "assigns" the player to a Department based on their cumulative behavioral profile (not just one run).

**Departments:**

| Department | Triggered By | Perk | Receipt Stationery |
|---|---|---|---|
| **Operations** | Consistent Efficiency | Par times displayed on all worlds | Clean, minimal receipt design |
| **Research** | Consistent Curiosity | Hints for secret locations appear faintly | Receipt has footnotes |
| **Compliance** | Consistent Compliance | Extra checkpoint saves | Receipt has gold border |
| **Wellness** | Consistent Grace | Slightly more coyote time (+20ms) | Receipt has soft pastel tones |
| **Incident Response** | Consistent Chaos | Kill combo counter starts at x2 | Receipt has red stamps |
| **Expedite** | Consistent Intuition | Secret paths glow faintly for 1s on entry | Receipt has redacted sections |

**Reassignment:**
- Playing differently for 3+ consecutive worlds triggers "REASSIGNMENT REVIEW"
- Receipt: "Your recent conduct suggests a departmental transfer may be warranted."
- After 3 worlds of consistently different behavior: "REASSIGNMENT COMPLETE — Welcome to [NEW DEPT]"

**Display:**
- Department shown on pause screen: "DEPARTMENT: INCIDENT RESPONSE"
- Department shown on receipt card (R05)
- Department affects receipt visual style (stationery variant)

**Save integration:** Store cumulative behavioral averages and current department in save data.

### 4. Waiver Punchcard

A visible "Waiver Punchcard" that tracks incremental progress toward a one-run benefit.

**Mechanic:**
- Punchcard has 8 slots
- Starts with 2 punches already filled ("Onboarding Courtesy" — endowed progress effect)
- Earn punches by: completing worlds (1 punch), completing Corrective Actions (1 punch), achieving A or S rank (1 punch), completing daily challenge (1 punch)
- When full (8/8): next run gets a powerful one-run benefit:
  - Extra cig copter fuel (+2s)
  - One free denial gate override
  - "INSTITUTIONAL AMNESTY: All licensing violations forgiven this run"
- After use, punchcard resets but always starts with 2 courtesy punches again

**Display:**
- Small punchcard icon on pause screen showing progress
- When benefit is ready: "WAIVER AVAILABLE — BENEFITS APPLY NEXT ENROLLMENT"
- On receipt when used: "WAIVER REDEEMED — Status: SATISFIED"

### 5. Behavioral Drift Tracking (Longitudinal Analysis)

After 5+ playthroughs, a new section appears on receipts: "LONGITUDINAL BEHAVIORAL ANALYSIS"

**Tracks how the player's behavioral profile has shifted over time:**
```
LONGITUDINAL BEHAVIORAL ANALYSIS
─────────────────────────────────
Enrollment #1: COMPLIANCE 78%, CHAOS 12%
Enrollment #7: COMPLIANCE 23%, CHAOS 67%

INSTITUTIONAL NOTE: RADICALIZATION
TRAJECTORY DETECTED. MONITORING
INCREASED.
```

**Implementation:**
- Store axis values from each run (last 20 runs max) in save data
- Calculate trend direction for each axis
- Generate narrative based on biggest shift:
  - Rising Chaos: "RADICALIZATION TRAJECTORY DETECTED"
  - Rising Compliance: "BEHAVIORAL NORMALIZATION IN PROGRESS"
  - Rising Curiosity: "UNAUTHORIZED INTEREST ESCALATION"
  - Stable profile: "BEHAVIORAL CONSISTENCY CONFIRMED — PREDICTION MODELS UPDATED"
  - Erratic shifts: "PROFILE INSTABILITY — CLASSIFICATION SUSPENDED"

---

## Testing Checklist

- [ ] Daily challenge modifier is deterministic (same for all players on same date)
- [ ] Daily challenge has its own receipt with modifier name
- [ ] Streak counter tracks consecutive daily completions
- [ ] File Cabinet shows past receipts as collapsible cards
- [ ] Receipts show stamps (FILED, CONTESTED, CORRECTED)
- [ ] Collection progress displayed (classifications, S-ranks, completeness)
- [ ] Department assignment triggers after 5+ runs
- [ ] Department provides correct perk
- [ ] Department affects receipt stationery style
- [ ] Reassignment triggers after 3+ worlds of different behavior
- [ ] Waiver Punchcard starts with 2/8 punches
- [ ] Punchcard fills from correct actions
- [ ] Full punchcard grants one-run benefit
- [ ] Longitudinal analysis appears after 5+ playthroughs
- [ ] Drift narrative matches actual behavioral shift
- [ ] localStorage usage stays reasonable (< 100KB total)
- [ ] Save contract preserved

---

## What This Unlocks

After this round, the game has short-term (punchcard), mid-term (department), and long-term (drift tracking, collection) retention hooks. Players return daily for the challenge, weekly to fill their cabinet, and monthly to see their behavioral evolution narrated back to them. The game becomes a daily ritual, not a one-time experience.
