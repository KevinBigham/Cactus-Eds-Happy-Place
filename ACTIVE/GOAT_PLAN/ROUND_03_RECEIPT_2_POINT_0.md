# ROUND 03 — RECEIPT 2.0

> **Goal**: Make the game's core reward system infinite and endlessly surprising
> **Prerequisite**: Round 01 (receipt printer SFX), Round 02 (death counter reframing)
> **Est. Effort**: 3-4 days

---

## Context for Builder

The receipt system is the game's most original mechanic — no other platformer silently tracks behavior across 6 psychological axes and generates a personalized institutional assessment. Currently there are ~60 static flavor texts. This round makes receipts procedurally generated, adds archetype titles, and ensures no two receipts are ever the same.

---

## Deliverables

### 1. Receipt Template Engine (Procedural Permutations)

Build a mad-libs style procedural text generator using templates with fill-in slots. This replaces/supplements the existing 60 static lines.

**Template structure:**
```javascript
var RECEIPT_TEMPLATES = {
  compliance: [
    "[OBSERVATION]: You [VERB_COMPLY] the [OBJECT]. The [OBJECT] has been [OUTCOME_COMPLY].",
    "COMMENDATION: Subject demonstrated [ADJ_COMPLY] adherence to [PROTOCOL]. [REWARD_COMPLY].",
    "Your [METRIC] of [NUMBER] was within acceptable parameters. [CONSEQUENCE_COMPLY]."
  ],
  chaos: [
    "[OBSERVATION]: You [VERB_CHAOS] the [OBJECT]. The [OBJECT] has been [OUTCOME_CHAOS].",
    "INCIDENT REPORT: Subject [VERB_CHAOS] [NUMBER] [OBJECT_PLURAL] in [LOCATION]. [CONSEQUENCE_CHAOS].",
    "Your approach to [PROTOCOL] has been reclassified as [RECLASSIFY_CHAOS]."
  ],
  // ... similar for intuition, curiosity, grace, efficiency
};
```

**Word banks (examples per slot):**

| Slot | Examples |
|---|---|
| OBSERVATION | "FIELD NOTE", "BEHAVIORAL OBSERVATION", "COMPLIANCE MEMO", "INCIDENT REVIEW", "PRELIMINARY FINDING" |
| VERB_COMPLY | "followed", "obeyed", "acknowledged", "respected", "honored" |
| VERB_CHAOS | "destroyed", "reclassified", "liberated", "decommissioned", "restructured" |
| OBJECT | "safety railing", "orientation signage", "wellness checkpoint", "queue barrier", "filing cabinet" |
| OUTCOME_COMPLY | "commended for its patience", "promoted to permanent fixture", "awarded a certificate of relevance" |
| OUTCOME_CHAOS | "archived as resolved", "reclassified as debris", "scheduled for grief counseling", "filed under 'former infrastructure'" |
| PROTOCOL | "vertical displacement", "corridor navigation", "institutional harmony", "standard procedure 7-B" |
| RECLASSIFY_CHAOS | "improvisational engineering", "aggressive compliance", "unauthorized innovation", "kinetic problem-solving" |
| LOCATION | "the testing corridor", "the wellness checkpoint", "the orientation foyer", "the recovery lounge" |

**Target**: 20+ templates per axis, 15+ words per slot = thousands of unique combinations per axis.

**Selection logic**: Use dominant behavioral axis to pick template pool. Secondary axis influences 1-2 word choices. Use a seeded random (based on run data) so the same run always generates the same receipt.

### 2. Behavioral Archetype Titles

Generate a pithy, shareable "Job Title" based on dominant behavioral profile. Displayed prominently at the top of the receipt.

| Dominant Axis | Example Titles (pick randomly from pool of 5+) |
|---|---|
| **Compliance** | "Standard Operating Procedure Enthusiast", "Model Participant", "Institutional Darling", "Policy Adherence Specialist", "The Sleepwalker" |
| **Chaos** | "Senior Deconstruction Specialist", "The Deviant", "Kinetic Restructuring Agent", "Unauthorized Initiative Director", "Infrastructure Liberation Officer" |
| **Intuition** | "Unsanctioned Infrastructure Pioneer", "Off-Grid Navigation Consultant", "The Shortcutter", "Unauthorized Route Specialist", "Shadow Corridor Analyst" |
| **Curiosity** | "Unscheduled Inquiry Agent", "The Auditor", "Supplemental Reading Enthusiast", "Sign Inspector General", "Informational Trespasser" |
| **Grace** | "Near-Miss Recovery Specialist", "Kinetic Risk Assessor", "Last-Millisecond Consultant", "The Survivor", "Edge-Case Resolution Expert" |
| **Efficiency** | "Time Compression Specialist", "Express Lane Virtuoso", "The Expediter", "Minimum Viable Participant", "Speed-to-Completion Analyst" |

**Display**: Large institutional serif text at the top of the receipt, like a job title on a name badge. Format: "CLASSIFICATION: [TITLE]"

### 3. Near-Miss Callouts

Track "grace saves" during gameplay and print one specific stat per world on the receipt:

**Track these events:**
- Recovered within 150ms of death (coyote time save)
- Landed within 8 pixels of a hazard
- Used jump buffer within 50ms of landing
- Wall-jumped within 100ms of falling past a ledge
- Survived a fall that would have killed without double jump

**Receipt line examples:**
- "You survived 3 incidents by an average of 11 pixels."
- "Your reflexes prevented 2 workplace fatalities. Reflexes have been noted in your file."
- "You landed 7 pixels from a safety cone. The cone has filed a complaint."

### 4. Counterfactual Receipt Lines

Detect "almost choices" during gameplay and print one counterfactual line:

**Track these hesitations:**
- Stood at a fork for >= 1 second then chose one path
- Approached a sign but didn't stop to read it
- Started toward a wall-jump route then bailed
- Began charging spin dash then cancelled
- Hovered near a secret area entrance then left

**Receipt line examples:**
- "You nearly became compliant. The thought was logged."
- "You considered reading the sign. The sign appreciated the glance."
- "You hesitated at the fork for 2.3 seconds. Your indecision has been scheduled for review."
- "You almost took the unauthorized route. Almost."

### 5. Receipt Stamp Animation + Sound

When the receipt finishes printing (after R01's thermal printer SFX), add a final punctuation:

1. Brief pause (0.3s)
2. Large red "PROCESSED" stamp slams down onto the receipt
3. Satisfying heavy "KA-CHUNK" SFX (use R01's SFX system: low-frequency thud + noise burst)
4. Slight screenshake on stamp impact (2px, 3 frames)
5. The stamp has a slight rotation (2-5 degrees) for authenticity

**Stamp text variants** (randomly selected):
- "PROCESSED"
- "FILED"
- "REVIEWED"
- "ARCHIVED"
- "ACKNOWLEDGED"

### 6. Receipt Preview Teaser Mid-World

Once per world, show a 1-second "receipt preview" line at the bottom of the screen:

- Appears at the midpoint of the world (after zone 2)
- Shows something like: "PRELIMINARY FINDING: init..." then cuts off
- Or: "BEHAVIORAL NOTE: Subject appears to—" (truncated)
- Fades in over 0.3s, holds 0.5s, fades out over 0.2s
- Always incomplete, always on-theme
- Creates anticipation: "what is my receipt going to say?"

---

## Testing Checklist

- [ ] Receipt text is different across multiple runs with different playstyles
- [ ] Same run seed produces same receipt (deterministic)
- [ ] Archetype title appears prominently at top of receipt
- [ ] Title matches dominant behavioral axis
- [ ] At least one near-miss callout appears per world
- [ ] At least one counterfactual line appears when hesitation is detected
- [ ] Receipt stamp animation plays after text finishes
- [ ] Stamp has satisfying KA-CHUNK sound
- [ ] Mid-world receipt preview appears and is always truncated
- [ ] Existing 60 static lines still work as fallbacks
- [ ] Receipt is still readable and well-formatted
- [ ] Save contract preserved

---

## What This Unlocks

After this round, the receipt — the game's soul — is infinite. No two receipts are the same. Players will play 100 runs and still be surprised by what the institution says about them. This is the foundation for the shareable receipt card (R05) and the viral loop.
