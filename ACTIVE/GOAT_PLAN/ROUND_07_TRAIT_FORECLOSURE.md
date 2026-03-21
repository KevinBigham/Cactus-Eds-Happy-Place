# ROUND 07 — TRAIT FORECLOSURE

> **Goal**: Make the institution react to the player's behavior — the game watches you and adapts
> **Prerequisite**: Round 04 (replay engine), Round 06 (behavioral tracking integration)
> **Est. Effort**: 4-5 days

---

## Context for Builder

This is the single most transformative round. Three of four AI brainstorms identified this concept as the most important change the game could make. DeepSeek called it "The One Idea." ChatGPT called it the "Policy Drift Engine." The concept: after each world, the institution identifies your dominant behavioral axis and applies 2-3 lightweight "policy" modifications to the NEXT world.

**The critical principle**: Do NOT reward a behavior with more of the same. REINTERPRET it bureaucratically. The institution thinks it is CORRECTING you. High chaos doesn't mean more enemies to kill — it means the institution bolts things down and sends response teams. High compliance doesn't mean easier paths — it means the institution makes safe paths LONGER and more boring.

---

## Deliverables

### 1. Policy Flag System

After each world's receipt is generated, determine the player's dominant axis. Apply 2-3 "policy flags" to the next world.

**Data structure:**
```javascript
var POLICY_FLAGS = {
  compliance: {
    name: "INSTITUTIONAL CONFIDENCE PROTOCOL",
    effects: [
      "safe_paths_extended",      // Main paths are 20% longer
      "surveillance_increased",   // More "camera" objects that track player
      "shortcuts_removed"         // Some unauthorized shortcuts are blocked
    ]
  },
  chaos: {
    name: "INCIDENT PREVENTION DIRECTIVE",
    effects: [
      "breakables_reinforced",    // Some destructible objects become indestructible
      "response_teams_added",     // Auditor enemies spawn faster after kills
      "emergency_routes_opened"   // But panic creates new escape routes
    ]
  },
  intuition: {
    name: "NAVIGATION STANDARDIZATION ORDER",
    effects: [
      "signage_unreliable",       // Some official signs point wrong way
      "unofficial_patterns_added", // New visual hints for hidden paths
      "main_paths_monitored"      // Auditor presence on obvious routes
    ]
  },
  curiosity: {
    name: "INFORMATION CONTAINMENT MEMO",
    effects: [
      "signs_censored",           // Some sign text is [REDACTED]
      "secret_routes_relocated",  // Secret entrances move to new positions
      "deeper_vents_added"        // But new, harder-to-find secrets appear
    ]
  },
  grace: {
    name: "SAFETY MARGIN REDUCTION NOTICE",
    effects: [
      "platforms_narrowed",       // Some platforms are slightly smaller
      "rescue_surfaces_removed",  // Fewer safety nets / catch ledges
      "precision_geometry_added"  // But "this shouldn't work" routes appear
    ]
  },
  efficiency: {
    name: "PACE REGULATION ADVISORY",
    effects: [
      "detours_removed",          // Fewer side paths
      "denial_gates_stricter",    // Timed gates have tighter windows
      "shortcut_risk_increased"   // Fast routes become more dangerous
    ]
  }
};
```

### 2. World Modification Implementation

For each policy effect, implement a lightweight modification. These should NOT be massive level redesigns — they're small tweaks that FEEL significant.

**Safe paths extended** (Compliance):
- Add 1-2 extra platform segments to the main route
- These segments are boring — flat, no enemies, just walking
- Subtle punishment for being too obedient

**Breakables reinforced** (Chaos):
- 30-50% of normally destructible objects become indestructible
- They now have a small "REINFORCED" label
- Forces the chaos player to find new approaches

**Signs censored** (Curiosity):
- Some sign text is replaced with "[REDACTED]" or "ACCESS LEVEL INSUFFICIENT"
- But the signs still track curiosity if the player stops to read them
- The institution is hiding information from the person who wants it most

**Platforms narrowed** (Grace):
- Selected platforms lose 15-20% of their width
- Creates more near-miss opportunities for the player who's good at them
- The institution is testing whether grace was skill or luck

**Signage unreliable** (Intuition):
- 1-2 directional signs now point the wrong way
- But new subtle visual cues (slightly different wall texture, faint arrow) appear on the REAL paths
- Rewards the player for trusting their own instincts over authority

**Denial gates stricter** (Efficiency):
- Timed gates have 20% shorter windows
- But the routes are more direct (fewer curves/detours)
- The institution is speed-testing the speed-runner

### 3. Institutional Memo at World Start

When a world loads with active policy flags, display a brief "Institutional Memo" before gameplay begins:

```
┌──────────────────────────────────────┐
│ INTEROFFICE MEMO                     │
│ ──────────────────────────────────── │
│ RE: SUBJECT ED — POLICY UPDATE       │
│                                      │
│ Based on your previous evaluation,   │
│ the following policies are now in    │
│ effect for this facility:            │
│                                      │
│ • INCIDENT PREVENTION DIRECTIVE      │
│ • INFORMATION CONTAINMENT MEMO       │
│                                      │
│ These measures are for your safety.  │
│ Compliance is appreciated.           │
│                                      │
│ [PRESS ANY KEY TO ACKNOWLEDGE]       │
└──────────────────────────────────────┘
```

Display for 3 seconds or until key press. The memo names the policies but does NOT explain what they do. The player must discover the effects through gameplay.

### 4. Receipt Acknowledgment

The receipt for a policy-affected world includes a new section:

```
POLICY EFFECTIVENESS REVIEW
────────────────────────────
INCIDENT PREVENTION DIRECTIVE: PARTIALLY EFFECTIVE
  Subject demonstrated continued chaotic tendencies
  despite reinforced infrastructure.

INFORMATION CONTAINMENT MEMO: INEFFECTIVE
  Subject located [REDACTED] information through
  unauthorized means. Containment protocols
  under review.
```

This creates a narrative through-line: the institution tried to correct you, and the receipt evaluates whether the correction worked.

### 5. The Fake-Left Branch That Remembers

Enhance the existing fake-left dead-end in W2 with multi-visit memory:

- **Visit 1**: Dead end. Receipt mocks you: "Subject fell for the oldest trick in the handbook."
- **Visit 2 (next run)**: A tiny vent appears in the dead end. It leads to a small bonus area.
- **Visit 3**: The institution has sealed the vent. Sign: "UNAUTHORIZED VENT USAGE DETECTED — ACCESS REVOKED." But a new, harder-to-find crack appears in the floor.
- **Visit 4+**: The dead end becomes a running gag. Each visit has a small change. The receipt tracks all visits.

Store visit count in save data.

---

## Testing Checklist

- [ ] Dominant axis from W1 receipt applies policy flags to W2
- [ ] Dominant axis from W2 receipt applies policy flags to W3
- [ ] Policy memo displays at world start with correct policy names
- [ ] Each of the 6 policy types has visible effects in the world
- [ ] Effects are subtle but noticeable (not game-breaking)
- [ ] Receipt includes "POLICY EFFECTIVENESS REVIEW" section
- [ ] Fake-left dead end changes across visits (stored in save)
- [ ] A Compliance-dominant run feels DIFFERENT from a Chaos-dominant run in the next world
- [ ] Policies enhance the game (not punish) — all paths remain completable
- [ ] No policy flag creates an impossible situation
- [ ] Save contract preserved (new policy fields within schema)

---

## What This Unlocks

After this round, the game becomes something genuinely new. The institution doesn't just judge you — it RESPONDS. Players will say "the game changed because of how I played." Run #3 feels meaningfully different from run #1. This is what transforms CEHP from "a clever platformer with a cool ending" to "a living satirical machine that watches you and adapts." This is the feature that makes people tell their friends.
