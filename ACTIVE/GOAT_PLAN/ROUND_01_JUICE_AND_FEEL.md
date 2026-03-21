# ROUND 01 — JUICE & FEEL

> **Goal**: Make every action in the game feel incredible
> **Prerequisite**: None (this is the foundation)
> **Est. Effort**: 3-4 days
> **Priority**: HIGHEST — This is the single highest-leverage round

---

## Context for Builder

The game has exceptional movement physics (Celeste-quality constants) but is functionally silent and visually flat. Every AI brainstorm unanimously identified audio as the #1 gap. This round adds the "juice" layer that makes good games feel great.

**Sacred constraints**: All audio must be procedural via Web Audio API. No external audio files. Everything stays in the single HTML file, ES5 JavaScript.

---

## Deliverables

### 1. Procedural SFX System (Web Audio API)

Build a lightweight procedural sound engine using Web Audio API oscillators and noise generators. Every player action needs an audio signature:

| Action | Sound Design |
|---|---|
| **Jump** | Ascending square wave, 300→600Hz, 0.1s duration |
| **Double Jump** | Higher pitch variant, 400→800Hz, 0.08s, slight reverb |
| **Landing (short fall)** | Filtered white noise burst, lowpass 200Hz, 0.05s |
| **Landing (long fall)** | Louder noise burst + sine thud at 80Hz, 0.1s |
| **Wall Slide** | Filtered pink noise, constant low volume while sliding |
| **Wall Jump** | Quick ascending chirp + noise burst |
| **Punch** | Short noise burst + 150Hz sine thud, 0.06s |
| **Kick** | Similar to punch, slightly longer decay |
| **Spin Dash (charging)** | Rising sawtooth hum, 100→300Hz over charge duration |
| **Spin Dash (release)** | Burst at final charge pitch + noise |
| **Cig Copter** | Oscillating triangle wave, 200Hz, amplitude-modulated at 8Hz |
| **Ground Slam** | Descending square wave 400→60Hz + heavy noise burst |
| **Collectible (stamp)** | Pleasant ascending arpeggio, 3 quick notes |
| **Enemy Kill** | Satisfying crunch: noise burst + descending tone |
| **Death** | Descending square wave 400→100Hz, 0.3s + noise |
| **Receipt Printing** | Rapid alternating square waves at 2kHz, 2-3s, simulating thermal printer |

**Implementation notes**:
- Create a `SFX` object with methods like `SFX.play('jump')`, `SFX.play('land', {intensity: 0.8})`
- Each sound should accept an intensity parameter that scales volume and pitch range
- Respect a global mute toggle (add to pause menu)
- Keep the system under 200 lines of code

### 2. Hit-Stop with Institutional Commentary

On enemy kills, freeze the game for 3-5 frames (50-83ms at 60fps). The existing kill combo text system gets paired with genuine hit-stop:

| Combo | Freeze Frames | Text | Visual |
|---|---|---|---|
| Single kill | 3 frames | "PARTICIPATION NOTED" | Small stamp at kill location |
| x2 combo | 3 frames | "PROACTIVE ENGAGEMENT" | Slightly larger text |
| x3 combo | 4 frames | "ENTHUSIASM EXCEEDS PARAMETERS" | Screen edges pulse |
| x5 combo | 5 frames | "YOUR VIOLENCE HAS BEEN RECLASSIFIED AS INITIATIVE" | Full red pulse, large text |
| x10 combo | 8 frames | "COMMENDATION PENDING — PLEASE DO NOT STOP" | Full-screen flash |

**Implementation**:
- Add a `hitStop(frames)` function that sets a freeze counter
- In the game update loop, skip physics/movement when freeze > 0
- Decrement freeze each frame
- Combine with the existing combo text system

### 3. Screen Shake System

Add a reusable screen shake system tied to action intensity:

| Trigger | Shake Amount | Duration |
|---|---|---|
| Landing (short) | 1px | 2 frames |
| Landing (long) | 3px | 4 frames |
| Enemy kill | 2px | 3 frames |
| Ground slam | 6px, vertical emphasis | 8 frames |
| Boss hit | 4px | 5 frames |
| Spin dash into wall | 3px | 4 frames |

**Implementation**:
- `shakeCamera(intensity, duration)` function
- Apply random offset to camera position each frame during shake
- Offset decays linearly over duration
- Shake stacks (multiple simultaneous shakes add together, capped at 8px)

### 4. Squash-and-Stretch on Ed

Apply real-time squash and stretch to Ed's procedural draw calls by scaling the canvas context:

| State | scaleX | scaleY | Notes |
|---|---|---|---|
| Rising (jump) | 0.8 | 1.2 | Vertical stretch |
| Fast falling | 0.75 | 1.25 | Extreme vertical stretch |
| Landing | 1.3 | 0.7 | Horizontal squash, springs back over 4 frames |
| Spin dash | 1.4 | 0.6 | Extreme horizontal stretch |
| Cig copter | 1.0 | oscillate 0.95-1.05 | Rhythmic pulse |
| Punching | 1.2 | 0.9 | Arm extension |
| Idle | 1.0 | 1.0 | Default |

**Implementation**:
- Anchor at Ed's feet so squash pushes down, stretch pushes up
- `ctx.save()` → `ctx.scale(sx, sy)` → draw Ed → `ctx.restore()`
- Lerp between states over 3-4 frames for smoothness
- The `DRAW_ED_SNES` function (around line 475 of index.html) is where this applies

### 5. Landing Impact Particles

Scale visual feedback to fall distance:

| Fall Duration | Dust Particles | Camera Shake | Extra |
|---|---|---|---|
| < 1s | 4 small particles | 1px, 2 frames | None |
| 1-2s | 8 particles | 2px, 3 frames | Quiet thud SFX |
| > 2s | 16 particles | 4px, 5 frames | 3-frame squash hold, floor crack sprites |
| Ground slam | Screen-wide dust wave | 6px, 8 frames | 8-frame freeze, "SEISMIC EVENT DETECTED" text |

**Particle system**:
- Simple particle array (max 64 particles active)
- Each particle: x, y, vx, vy, life, color
- Particles are small rectangles (2x2 or 3x3 pixels) in earth tones
- Update: apply gravity, reduce life, remove when life <= 0
- Draw: simple `fillRect` calls

---

## Testing Checklist

- [ ] Every jump produces an audible sound
- [ ] Landing sound scales with fall height
- [ ] Spin dash charge has rising pitch
- [ ] Cig copter has continuous helicopter sound
- [ ] Enemy kills produce hit-stop freeze
- [ ] Kill combo text appears with appropriate freeze duration
- [ ] Screen shakes on ground slam, kills, and landings
- [ ] Ed visibly squashes on landing and stretches during jumps
- [ ] Landing produces dust particles that scale with fall distance
- [ ] Receipt screen has thermal printer sound with line-by-line scroll
- [ ] All SFX can be muted via pause menu
- [ ] Game still runs at 60fps with all juice effects active
- [ ] Save contract preserved (`cactusEd_save_v1`)

---

## What This Unlocks

After this round, the game goes from "impressive prototype" to "this feels polished." Every subsequent round benefits because the foundation feels professional. Players will immediately notice the difference — the movement engine that was already great now FEELS great.
