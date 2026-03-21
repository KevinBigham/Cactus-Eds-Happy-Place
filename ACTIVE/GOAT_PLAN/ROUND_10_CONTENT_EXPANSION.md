# ROUND 10 — CONTENT EXPANSION

> **Goal**: Multiply all existing content into infinite replayable configurations
> **Prerequisite**: All previous rounds (this builds on everything)
> **Est. Effort**: 5-7 days

---

## Context for Builder

The game now feels incredible, replays smoothly, adapts to behavior, retains daily, and has surprise moments. But it's still only 3-5 minutes of authored content. This round adds systems that MULTIPLY content — modular zones, behavioral remixes, case seeds, and the endgame meta-world. After this round, no two sessions are the same.

**Design principle**: Don't create more content from scratch. Create SYSTEMS that recombine existing content in behavior-driven ways.

---

## Deliverables

### 1. Modular Zone Template System

Convert existing world zones into modular "rooms" with standardized entry/exit anchors.

**Room specification:**
```javascript
var ROOM_TEMPLATE = {
  id: "w2_maze_branch_01",
  world: 2,
  zone: 3, // maze
  width: 512,          // one screen width
  entryPoints: {left: {x: 0, y: 320}, top: {x: 256, y: 0}},
  exitPoints: {right: {x: 512, y: 320}, bottom: {x: 256, y: 448}},
  difficulty: 3,       // 1-5 scale
  requiredAbilities: ["double_jump"],
  behavioralEmphasis: "intuition",  // which axis this room tests
  enemies: [...],      // enemy spawn definitions
  platforms: [...],    // platform definitions
  hazards: [...]       // hazard definitions
};
```

**For each existing world**, decompose into 6-10 rooms:
- W1: ~8 rooms (orientation, platforming, combat, exploration variants)
- W2: ~10 rooms (testing, maze, quiz, branching variants)
- W3: ~8 rooms (medical, denial fork, pharmacy, recovery variants)

**Room assembly**: Each world playthrough assembles rooms using a critical-path-first algorithm:
1. Generate a solvable path through a 3-4 room sequence (entry → exit)
2. Optionally attach 1-2 side rooms (for secrets/exploration)
3. Room selection weighted by behavioral emphasis (Trait Foreclosure policies from R07 influence which rooms appear)

**Key constraint**: Rooms are hand-crafted, not procedurally generated. The ASSEMBLY is procedural; the rooms themselves are authored. This is the Spelunky/Dead Cells approach — handcrafted feel with procedural variety.

### 2. Behavioral-Seeded Level Remixes

Use the player's behavioral profile as a seed for remixing existing rooms:

| Dominant Profile | Remix Effect |
|---|---|
| **Chaos** | More enemies, more destructible objects, more combo opportunities. Label: "DISCIPLINARY EDITION" |
| **Efficiency** | Tighter paths, fewer enemies but stricter timing, par-time challenge. Label: "EXPRESS EDITION" |
| **Curiosity** | More branching routes, hidden rooms become visible but locked behind puzzles. Label: "RESEARCH EDITION" |
| **Compliance** | Cleaner layout, more surveillance, deviating triggers VIOLATION alerts. Label: "STANDARD EDITION" |
| **Grace** | More narrow platforms, fewer safety nets, more near-miss geometry. Label: "PRECISION EDITION" |
| **Intuition** | Official paths are less reliable, unofficial shortcuts are more visible. Label: "CLASSIFIED EDITION" |

**Implementation**: When assembling rooms, apply the behavioral remix as a modifier:
- Swap enemy types/counts based on profile
- Adjust platform sizes based on profile
- Enable/disable destructible objects based on profile
- Show/hide secret entrances based on profile

The remix label appears at world start: "WORLD 2: SUNLUSH LEARNING PRESERVE — DISCIPLINARY EDITION"

### 3. Case Seed System

Every run generates a "Case Number" that determines all random elements:

**Seed composition**: `CASE-[date]-[run_count]-[behavioral_hash]`
- Displayed on pause screen and receipt
- Determines: room assembly order, enemy patrol offsets, quiz question selection, sign text variants, policy effects

**Seed sharing**:
- Case Number displayed prominently on receipt and receipt card (R05)
- On title screen, add "ENTER CASE #" option
- Players can type in a Case Number to replay exact conditions
- Shared via URL fragment: `game.html#CASE-20260320-14-CH`

**This enables**:
- "Play my run" challenges between friends
- Consistent speedrun conditions
- Daily challenge uses a date-based case number (same for everyone)
- Streamers can share Case Numbers for viewers to attempt

### 4. Mood Rotations

Each world can load into one of several "institutional moods" that affect aesthetics and one rule:

| Mood | Visual Change | Rule Change |
|---|---|---|
| **Budget Cuts** | Dimmer palette, some lights flicker | 25% fewer collectibles |
| **Wellness Week** | Softer colors, flowers on signs | Enemies move 15% slower |
| **Standardization Drive** | Sterile white, uniform objects | All platforms same size |
| **Emergency Drill** | Red tinting, alarm effects | Timed evacuation challenge (complete zone in par time) |
| **Inspection Day** | Extra-clean, everything aligned | Extra auditors patrol |
| **Casual Friday** | Slightly brighter, relaxed | Ed moves 5% faster, enemies are less aggressive |

**Selection**: Mood is determined by Case Seed. Daily challenges always specify a mood.

**Receipt**: "INSTITUTIONAL MOOD: BUDGET CUTS — Staffing levels were regrettably reduced during your evaluation."

### 5. The Back Office — World 4 (Endgame Meta-World)

**Unlock condition**: Complete all 3 worlds with Clearance 3+ (meaning 3+ full completions with different dominant axes).

**Concept**: Instead of platforming through institutional spaces AS a subject, Ed infiltrates the institution's ADMINISTRATIVE infrastructure.

**Content:**
- Filing cabinets contain past receipts (the player's actual saved receipts from R08's Cabinet)
- Screens display behavioral graphs (radar charts from the player's history)
- Memos on the wall reference "Subject Ed" and cite YOUR specific playstyle data
- Environmental text: "Subject demonstrates 73% lateral approach bias. Recommend corridor adjustment."

**Boss: The Performance Review**
- Final boss that adapts attacks to the player's behavioral profile
- Compliance-dominant players face attack patterns that require DISOBEDIENCE to dodge
- Chaos-dominant players face attacks requiring PRECISION and RESTRAINT
- The boss literally uses the player's own data against them

**Receipt**: The Back Office receipt is different from all others — it's written FROM the institution's perspective, not about the player:
```
INTERNAL AUDIT — EYES ONLY
───────────────────────────
Subject has breached the administrative layer.
All previous behavioral data compromised.
Recommend: full record expungement.

STATUS: [REDACTED]
```

**Implementation**: The Back Office can reuse existing room templates with a new "office" aesthetic (desks, filing cabinets, monitors instead of themed obstacles). The boss requires a new enemy type but can use existing combat mechanics.

---

## Testing Checklist

- [ ] Existing worlds decompose into 6-10 rooms each
- [ ] Room assembly produces solvable paths every time
- [ ] Different case seeds produce visibly different room arrangements
- [ ] Behavioral remix labels appear correctly
- [ ] Remix effects match the dominant profile
- [ ] Case Number appears on pause screen and receipt
- [ ] Entering a Case Number on title screen replays that exact configuration
- [ ] URL fragment sharing works (#CASE-...)
- [ ] Mood rotations change visuals and one rule per world
- [ ] Mood name appears on receipt
- [ ] Back Office unlocks after meeting clearance requirement
- [ ] Back Office displays actual player data (receipts, charts, behavioral quotes)
- [ ] Performance Review boss adapts to player's behavioral profile
- [ ] Back Office receipt uses internal audit format
- [ ] All content still playable within single HTML file constraint
- [ ] Save contract preserved

---

## What This Unlocks

After this round, the game has:
- **30+ minutes of unique content per session** (modular assembly)
- **Infinite replayability** (case seeds + behavioral remixes)
- **Daily variety** (mood rotations)
- **An endgame** (The Back Office) that uses the player's own data as content
- **Social play** (shared case numbers for challenges)

The game is no longer a 5-minute prototype. It's an endlessly replayable, behavior-driven, institutionally satirical platformer with a meta-narrative endgame. The GOAT plan is complete.
