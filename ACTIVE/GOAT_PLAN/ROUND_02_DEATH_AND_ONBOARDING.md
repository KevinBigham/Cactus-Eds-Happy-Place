# ROUND 02 — DEATH & ONBOARDING

> **Goal**: Fix the game's two worst moments — dying and starting
> **Prerequisite**: Round 01 (SFX system, particles, screenshake)
> **Est. Effort**: 2-3 days

---

## Context for Builder

Death is currently a silent counter increment — the game's weakest moment. New players are dumped with 13+ controls as a wall of text — the game's worst UX. This round fixes both by reframing death as institutional satire and replacing the control dump with in-world institutional signage.

---

## Deliverables

### 1. Death as Institutional Processing

Replace the current silent death with a 0.4-second sequence:

**Frame-by-frame spec:**
1. **Frame 0-3**: Ed bursts into cactus particle explosion (8-12 green particles + 2-3 cigarette ember particles). Use R01's particle system.
2. **Frame 4-8**: Screen freezes. "PROCESSING..." appears in institutional serif at kill location. Use R01's hit-stop system.
3. **Frame 9-15**: Quick fade text: randomly selected institutional processing message:
   - "YOUR PATIENCE IS APPRECIATED"
   - "RECALIBRATION IN PROGRESS"
   - "INCIDENT LOGGED. PLEASE STAND BY"
   - "RE-ENROLLMENT AUTHORIZED"
   - "PROCESSING EVENT #[count]. COST: $[count * 600]"
   - "YOUR COOPERATION DURING THIS TRANSITION IS NOTED"
4. **Frame 16+**: Ed materializes at checkpoint with a brief "assembly" animation (particles converge inward). Play a quick ascending tone (reverse of death SFX).

**Receipt integration**: Death counter on receipt now reads:
```
INSTITUTIONAL INCIDENTS: [count]
ASSOCIATED RE-MATERIALIZATION COST: $[count * 600]
```

**Important**: Total death sequence must be under 0.5 seconds. Fast respawn is critical — never punish the player with downtime.

### 2. Institutional Signage Tutorial System

Replace the wall-of-text controls dump with institutional signs placed throughout World 1. Each sign teaches ONE action at the exact moment it becomes relevant.

**Sign placement and text:**

| Location | Sign Text | Action Taught |
|---|---|---|
| Very start of W1 | "ALL SUBJECTS MUST DEMONSTRATE BASIC LOCOMOTION — ARROW KEYS" | Movement |
| Before first gap | "VERTICAL DISPLACEMENT AUTHORIZED — PRESS SPACE" | Jump |
| Before first tall gap | "EXTENDED VERTICAL DISPLACEMENT: PRESS SPACE AGAIN (FORM 12-A REQUIRED)" | Double Jump |
| Before first wall | "WALL CONTACT PROTOCOL: HOLD DIRECTION + SPACE" | Wall Jump |
| Before first enemy | "CONFLICT RESOLUTION: Z (PUNCH) OR X (KICK)" | Combat |
| Before narrow passage | "UNAUTHORIZED SPINNING: HOLD DOWN, CHARGE, RELEASE (DISCIPLINARY ACTION MAY FOLLOW)" | Spin Dash |
| After earning double jump | "ROTARY LOCOMOTION: TAP JUMP TWICE MORE IN MIDAIR (NOT OSHA APPROVED)" | Cig Copter |
| Before first tall drop | "CONTROLLED DESCENT: PRESS DOWN + SPACE IN MIDAIR" | Ground Slam |

**Sign rendering**:
- Small rectangular signs attached to walls/posts
- Institutional serif font (use existing game font)
- Cream/off-white background with dark text
- Signs only appear on first playthrough (check save data)
- Reading a sign (standing near it for 1.5s+ or pressing UP) feeds the **Curiosity** behavioral axis
- Running past a sign without reading feeds the **Efficiency** axis

**Important**: Signs are behavioral tests too. Every interaction with them is tracked.

### 3. The 3-Second Cold Open

Replace the current title screen flow with an immediate institutional enrollment:

1. Game loads → display only: **"CACTUS ED'S HAPPIEST PLACE"** in institutional serif
2. Below it: **"YOU HAVE BEEN PRE-ENROLLED."**
3. Countdown: gameplay begins automatically in 3 seconds
4. Press any key to start immediately
5. All settings (sound, controls) accessible via pause menu during play

**Rationale**: Every second between clicking a link and playing is a dropout point. Browser games compete with literally everything on the internet. The cold open eliminates menu friction and sets the institutional tone immediately — you didn't CHOOSE to enroll. You were PRE-enrolled.

**Note**: Preserve the existing title screen as accessible from the pause menu for players who want it. This is about the FIRST impression.

### 4. Camera Lookahead

At 512x448 resolution, screen real estate is limited. Without lookahead, players can see only ~250 pixels ahead when running right — less than 0.3 seconds of reaction time at full sprint.

**Spec:**
- Offset camera 50 pixels in the direction Ed is facing/moving
- When Ed stops, lerp camera back to center over 0.3 seconds (use `lerpFactor = 0.08` per frame)
- When Ed holds UP (without moving), pan camera up 80 pixels over 0.5 seconds
- When Ed holds DOWN (without moving), pan camera down 80 pixels over 0.5 seconds
- Camera offset uses smooth lerp, never snaps

**Implementation**: Add offset to the camera follow target, not the camera position directly. The existing camera follow logic should handle the smoothing.

### 5. Cigarette Health Indicator Enhancement

Ed's cigarette already exists as a visual element. Enhance it to communicate health state:

- **Full health**: Full-length cigarette, steady smoke trail (3-4 particles rising)
- **75% health**: Cigarette slightly shorter, normal smoke
- **50% health**: Cigarette noticeably shorter, smoke thins
- **25% health**: Cigarette is a stub, smoke sputters intermittently
- **Critical**: Tiny butt, ember flickers rapidly, occasional ash particle falls

This is diegetic UI — health information integrated into the game world with no HUD element needed.

---

## Testing Checklist

- [ ] Death produces particle burst + institutional text + quick respawn
- [ ] Death sequence completes in under 0.5 seconds
- [ ] Death counter on receipt shows "INSTITUTIONAL INCIDENTS" with cost
- [ ] Random death messages rotate (at least 6 variants)
- [ ] Tutorial signs appear in correct locations in W1
- [ ] Signs only appear on first playthrough
- [ ] Reading signs tracks to Curiosity axis
- [ ] Skipping signs tracks to Efficiency axis
- [ ] Cold open starts gameplay within 3 seconds of page load
- [ ] Any key press during cold open starts immediately
- [ ] Pause menu provides access to all settings
- [ ] Camera leads Ed by ~50px in movement direction
- [ ] Camera pans up/down when holding direction while stationary
- [ ] Cigarette visually shortens as health decreases
- [ ] Save contract preserved

---

## What This Unlocks

After this round, the game's two weakest moments become strengths. Death is funny (not frustrating). New players learn naturally (not from a wall of text). The cold open eliminates friction. The game now has a professional-quality first impression.
