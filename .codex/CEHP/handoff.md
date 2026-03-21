# CEHP Handoff

## What Was Just Done (2026-03-21 — Visual Upgrade + Bug Fix Session)

### Bug Fix: TitleScene Cold-Open Crash
- The cold open "any key" check referenced `keys.left`, `keys.right`, `keys.x`, `keys.c`, `keys.esc` which were never registered in TitleScene's key map (only z, up, down). This TypeError killed the game loop on the first update frame, showing a blank screen.
- Fixed by using inline `addKey()` calls for the missing key references.

### Text Readability Upgrade
- All font sizes bumped: 3-4px→8px, 5px→9px, 6-7px→10px, 8px→11px, 9px→12px, 20px→24px
- Minimum stroke thickness raised to 3 across the board
- Dim text colors brightened (#333→#777, #444→#888, #555→#999, plus muted greens/blues)

### Major Visual Upgrade — WebGL PostFX
- **Renderer**: Switched from `Phaser.CANVAS` to `Phaser.AUTO` (WebGL with Canvas fallback)
- **IS_WEBGL flag**: Global detection variable guards all PostFX code
- **Camera PostFX on all 4 scenes**:
  - GPU-rendered vignette (replaces crude rectangle overlay in DemoScene)
  - Subtle bloom (makes lights and pickups pop)
  - Barrel distortion on TitleScene (CRT monitor curvature)
- **Scene transitions**: All `scene.start()` calls now fade out/in (Title→gameplay, W1→W2, W2→W3, end→Title)
- **Enhanced glow effects**: Aloe pickups (dual-halo), floating items (outer halos), Ed's cigarette ember (warm glow rings), subliminal text (PostFX red glow)
- **Dual-pass particles**: All particles render with soft outer halo at 2.2x radius
- **VHS grain**: Upgraded to tracking-style bars with occasional scan lines
- **Screen tear**: RGB channel offset (red/blue/green split lines)

### Previous Session (2026-03-20 — GOAT Rounds 04-10)
- All 10 GOAT plan rounds fully implemented in a single marathon session
- See README for full feature list

## What To Do Next
1. Check `ACTIVE/docs/NEXT_TASK.md` — currently OPEN (no active task)
2. Kevin should playtest all features on the live URL
3. Based on playtest: define next priority (new content, polish, marketing, etc.)
4. Next agent should read `CLAUDE.md` and this file first

## Exact Files To Inspect
- Task beacon: `ACTIVE/docs/NEXT_TASK.md`
- Runtime: `ACTIVE/game/index.html` (~18,800 lines)
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

## Warnings / Risks / Traps
- The game is ONE GIANT HTML file (~18,800 lines). Do not split it.
- Save contract (`cactusEd_save_v1`) must NEVER break. Always run the schema check.
- Movement constants in `ED_MOVE` must not change without approval.
- The cigarette is central to Ed's identity — never remove it.
- Behavioral tracking stays silent (no visible meters).
