# CEHP Handoff

## What Was Just Done (2026-03-21 — "The Corrupted Broadcast" Visual Evolution)

### 10-Round Visual Evolution: "The Corrupted Broadcast"
Complete visual overhaul adding 10 interconnected systems (981 insertions, 32 deletions). The game is now a corrupted institutional broadcast that reacts to player behavior in real-time.

**Round 1: MOOD LIGHTING** — `MOOD_VISUALS` lookup maps 7 moods to PostFX params (bloom, vignette, grain). Emergency Drill pulses red.
**Round 2: THE FILING CABINET** — `ANIM_UI` utility (typewriter, slideIn, stampIn, slideOut). Pause screen, lesson cards, memos, and flash messages all animated.
**Round 3: THE BEHAVIOR METER** — `BEHAVIOR_FX` + `getBehaviorIntensity()`. Chaos = more glitches/grain/tears. Compliance = sterile. Grace = golden shimmer particles.
**Round 4: INSTITUTIONAL TRANSITIONS** — `TRANSITIONS` system with 5 types (glitch, vhs_track, stamp, standby, fade). All scene.start() calls converted.
**Round 5: AMBIENT PULSE** — `AMBIENT_LIGHT` system. Pulsing light sources on pickups. Flares on kills (gold), deaths (red), aloe collection (green).
**Round 6: ENVIRONMENTAL STORYTELLING** — `ENV_FX` system. Fog wisps (dream), paper flutter (lesson), heat shimmer (rupture), data rain (afterglow).
**Round 7: THE BROADCAST IDENTITY** — Zone-accent enemy halos. Alive enemies glow with zone color.
**Round 8: COLOR GRADING** — `COLOR_GRADE` system. Per-zone color overlay with smooth lerp transitions.
**Round 9: THE PRINTING CEREMONY** — CRT power-on animation (dot→line→expand). Archetype stamp-in with camera shake.
**Round 10: THE COMPLETE BROADCAST** — `BROADCAST_STATE` meta-layer. Signal degrades with chaos, drives all other systems. Channel ID card every 120s.

### Previous Sessions
- **2026-03-21**: WebGL PostFX visual upgrade, text readability pass, TitleScene crash fix
- **2026-03-20**: All 10 GOAT plan rounds (04-10) implemented

## What To Do Next
1. Check `ACTIVE/docs/NEXT_TASK.md` — currently OPEN (no active task)
2. Kevin should playtest all features on the live URL
3. Based on playtest: define next priority (new content, polish, marketing, etc.)
4. Next agent should read `CLAUDE.md` and this file first

## Exact Files To Inspect
- Task beacon: `ACTIVE/docs/NEXT_TASK.md`
- Runtime: `ACTIVE/game/index.html` (~19,750 lines)
- Agent rules: `ACTIVE/docs/AGENTS.md`
- Known issues: `ACTIVE/docs/KNOWN_ISSUES.md`
- Local memory: `.codex/CEHP/status.md`
- Backlog: `ACTIVE/docs/BACKLOG.md`

## Current Branch / Working State
- Branch: `main`
- Remote: `origin` → `https://github.com/KevinBigham/Cactus-Eds-Happy-Place`
- All active work is committed and pushed
- GitHub Pages deploys automatically on push to main

## Tech Stack Summary
- Phaser 3.70.0 via CDN (WebGL renderer with Canvas fallback)
- ES5 JavaScript only (no let/const, no arrow functions, no template literals)
- Single HTML file: `ACTIVE/game/index.html`
- Save key: `cactusEd_save_v1` (localStorage)
- Verification: `node ACTIVE/game/scripts/check_save_schema.js`

## Key Architecture Notes
- Ed, cats, and enemies are drawn via Phaser Graphics (fillRect/fillCircle), NOT sprites
- Custom particle system (SMOKE_POOL array, 67+ push sites) — NOT Phaser emitters
- Behavioral tracking: `this.behavior = { compliance, intuition, curiosity, grace, chaos, efficiency }`
- Receipt system: `generateReceiptText(behavior, runData)` returns `{text, archetype, dominant, secondary}`
- PostFX is guarded by `IS_WEBGL` global flag — all visual effects have Canvas fallback
- Game dimensions: W=512, H=448 pixels

## New Visual Systems (2026-03-21)
Global objects defined near top of script (after PERF, before RECEIPT 2.0):
- `MOOD_VISUALS` — mood effect → visual parameter lookup
- `BEHAVIOR_FX` — behavior axis → real-time visual modifiers
- `ANIM_UI` — typewriter, slideIn, stampIn, slideOut animation utilities
- `AMBIENT_LIGHT` — dynamic pulsing light source system
- `ENV_FX` — zone-specific environmental particle effects
- `COLOR_GRADE` — per-zone color overlay with lerp transitions
- `BROADCAST_STATE` — meta-layer signal integrity system
- `TRANSITIONS` — 5 themed scene transition types

Depth layer stack (bottom to top):
```
76: Ambient lights (Round 5)
77: Environmental FX (Round 6)
90: Color grade overlay (Round 8)
91: Mood overlay (Round 1)
92: Vignette + behavior vignette (Round 3)
93: Tear FX
94: Grain
95: CRT scanlines
96: Subliminal text
100-104: Receipt terminal (Round 9)
```

## Warnings / Risks / Traps
- The game is ONE GIANT HTML file (~19,750 lines). Do not split it.
- Save contract (`cactusEd_save_v1`) must NEVER break. Always run the schema check.
- Movement constants in `ED_MOVE` must not change without approval.
- The cigarette is central to Ed's identity — never remove it.
- Behavioral tracking stays silent (no visible meters).
- All visual effects have Canvas fallback and accessibility guards (reduceShake/reduceFlash/reduceParticles).
