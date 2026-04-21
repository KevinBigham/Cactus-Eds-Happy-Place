# CEHP PROJECT COMPENDIUM

> **Last updated**: 2026-04-20
> **Author**: Claude Opus 4.7
> **Purpose**: Single source of truth for the entire CEHP project — every file, every system, every decision, every lesson. Written for a fresh-eyes rebuild while honoring the creative bloodline.

---

# TABLE OF CONTENTS

1. [Project Identity](#1-project-identity)
2. [Current State (2026-04-20)](#2-current-state-2026-04-20)
3. [Tech Stack](#3-tech-stack)
4. [File Structure — Where Everything Lives](#4-file-structure--where-everything-lives)
5. [Creative Bloodline (Sacred, Do-Not-Break)](#5-creative-bloodline-sacred-do-not-break)
6. [Sacred Constraints](#6-sacred-constraints)
7. [Multi-Agent Workflow](#7-multi-agent-workflow)
8. [The Game — Systems Inventory](#8-the-game--systems-inventory)
9. [The 10 GOAT Rounds (All Shipped)](#9-the-10-goat-rounds-all-shipped)
10. [Corrupted Broadcast — Visual Evolution](#10-corrupted-broadcast--visual-evolution)
11. [Behavioral Tracking — The Unique Mechanic](#11-behavioral-tracking--the-unique-mechanic)
12. [Known Bug Patterns & Lessons Learned](#12-known-bug-patterns--lessons-learned)
13. [The Rebuild — What to Keep, What to Rethink](#13-the-rebuild--what-to-keep-what-to-rethink)
14. [Reference Index — Everything, With Paths](#14-reference-index--everything-with-paths)

---

# 1. Project Identity

**Name**: Cactus Ed's Happiest Place (CEHP)

**Genre**: 2D browser platformer (single-file HTML, Phaser 3, ES5 JavaScript)

**Concept**: You play Ed, a cigarette-smoking cactus navigating surreal institutional worlds. Bureaucratic-absurdist satire. Enemies are safety cones, scantrons, pills, and wellness auditors. Progression is framed as "civic enrollment." The game silently tracks playstyle across six behavioral axes and generates a personalized "receipt" at the end of each world that reflects how the institution interpreted your behavior.

**The seven-word version** (from DO_NOT_BREAK.md): *"Ed is calm. The world is not."*

**Public URL**: https://kevinbigham.github.io/Cactus-Eds-Happy-Place/

**GitHub Repo**: https://github.com/KevinBigham/Cactus-Eds-Happy-Place

**Resolution**: 512×448 (SNES-authentic)

**Rendering**: Procedural canvas draw calls (fillRect / fillCircle). No sprite sheets. All art is generated in-code.

---

# 2. Current State (2026-04-20)

## What's Shipped
- **All 10 GOAT rounds** — from Juice & Feel (Round 1) through Content Expansion (Round 10). Every round has a spec in `ACTIVE/GOAT_PLAN/` and a matching implementation in `ACTIVE/game/index.html`.
- **"Corrupted Broadcast" visual evolution** — shipped 2026-03-21. A meta visual layer where the game looks like corrupted institutional TV broadcasts. Scanlines, CRT rolls, chromatic aberration, color grading tied to behavioral axes.
- **4 playable scenes**: Title, DemoScene (World 1 — Welcome & Adjustment Bureau), World2Scene (Sunlush Learning Preserve), World3Scene (Wellspring Medical Pavilion).
- **Behavioral tracking system** with 6-axis profiling and procedural receipt generation.
- **Case Seed system** (CASE-DATE-RUN-AXIS format) — deterministic per-run identifier visible in receipts and shareable.
- **Web Audio procedural SFX** — no audio files, all synthesized.

## The Runtime
- `ACTIVE/game/index.html` — **19,835 lines**, 91 functions, 351 Phaser calls, 916 canvas draw calls.
- Opens in browser directly. No build step. No `npm install` required to run (only to run Playwright verification scripts).

## The Direction
Kevin wants to **REBUILD** the game — use everything here as inspiration and baseline, but start fresh with a cleaner architecture that honors the creative bloodline and exploits the 10-round learnings. **This compendium is the foundation for that rebuild.**

## Git State
- Local workspace is reorganized under `ACTIVE/` (moved from old `ALL/` structure on 2026-03-20).
- Everything shipped has been pushed to GitHub as of last known state.

---

# 3. Tech Stack

## Runtime
- **Phaser 3** (via CDN — no local install)
- **ES5 JavaScript only** (no modules, no imports, no transpilation)
- **HTML5 Canvas** (WebGL preferred, Canvas fallback via Phaser)
- **Web Audio API** for procedural SFX
- **localStorage** for save persistence

## Tooling
- **Playwright** for smoke tests (`ACTIVE/game/tests/`)
- **Node verification scripts** (`ACTIVE/game/scripts/`) — notably `check_save_schema.js`
- **GitHub Pages** for deployment (`.github/workflows/static.yml`)

## Save Contract
- Schema key: `cactusEd_save_v1` in localStorage.
- Must be preserved across all changes (migration required otherwise).
- Verify with: `node ACTIVE/game/scripts/check_save_schema.js`

## What's NOT in the stack
- No React, no Vue, no Svelte
- No TypeScript
- No bundler (Vite, Webpack, etc.)
- No sprite sheets or image assets
- No audio files
- No external APIs

---

# 4. File Structure — Where Everything Lives

```
/Users/tkevinbigham/Projects/CEHP/
│
├── CLAUDE.md                               # Durable Claude agent instructions (root)
├── README_Instructions on What To Do.md    # Living project guide, current state
├── 00_HANDOFF_FROM_CLAUDE_CODE.md          # 2026-03-20 executive handoff
├── PROJECT_COMPENDIUM.md                   # THIS FILE — single source of truth
│
├── ACTIVE/                                 # Everything current
│   ├── game/                               # THE GAME + tooling
│   │   ├── index.html                      # ENTIRE RUNTIME (~19,835 lines)
│   │   ├── package.json                    # Playwright deps
│   │   ├── scripts/
│   │   │   └── check_save_schema.js        # Save schema verifier
│   │   ├── tests/                          # Playwright smoke tests
│   │   └── art/, audio/, content/, ui/     # Empty scaffolds (assets generated in-code)
│   │
│   ├── docs/                               # Active project docs
│   │   ├── NEXT_TASK.md                    # The ONE current task (activation key)
│   │   ├── AGENTS.md                       # Multi-agent role rules
│   │   ├── BACKLOG.md                      # Future queue
│   │   ├── KNOWN_ISSUES.md                 # Bug tracker
│   │   ├── HANDOFF.md                      # Per-agent handoffs
│   │   ├── SPRINT_LOG.md                   # Sprint history
│   │   ├── CURRENT_PASS.md                 # (Stale — still references Sprint 006)
│   │   └── CLAUDE.md                       # Adapter pointing back to root CLAUDE.md
│   │
│   ├── GOAT_PLAN/                          # The 10-round greatness plan
│   │   ├── 00_GOAT_MASTER_PLAN.md          # Overall arc
│   │   ├── SYNTHESIS.md                    # Cross-AI brainstorm convergence
│   │   ├── ROUND_01_JUICE_AND_FEEL.md
│   │   ├── ROUND_02_SOUND.md
│   │   ├── ROUND_03_PROGRESSION.md
│   │   ├── ROUND_04_REPLAYABILITY.md
│   │   ├── ROUND_05_SURPRISE_AND_DELIGHT.md
│   │   ├── ROUND_06_UX.md
│   │   ├── ROUND_07_CONTENT_ENGINE.md
│   │   ├── ROUND_08_SOCIAL_VIRAL.md
│   │   ├── ROUND_09_DIFFICULTY_CHALLENGE.md
│   │   └── ROUND_10_CONTENT_EXPANSION.md
│   │
│   └── knowledge/                          # Reference + doctrine
│       ├── STUDIO_KERNEL/                  # Advisory knowledge (8 files)
│       │   ├── game_design_principles.md   # Self-Determination Theory foundation
│       │   ├── lessons_learned.md          # 6 documented lessons
│       │   ├── bug_patterns.md             # 5 documented bug patterns
│       │   ├── architecture_patterns.md
│       │   ├── BOOT_SEQUENCE.md
│       │   ├── agent_protocol.md
│       │   ├── dev_playbook.md
│       │   └── studio_rules.md
│       │
│       └── overflow/
│           ├── reference-docs/             # SPEC, PLAN, IMPLEMENT, VERIFY, DECISIONS
│           └── supporting-doctrine/
│               ├── DO_NOT_BREAK.md         # CRITICAL creative bloodline (2026-03-09)
│               └── CACTUS_ED_GOAT_GUIDE.md # Repo-local GOAT guide
│
├── ARCHIVE/                                # Historical — do not load by default
│   └── (AI brainstorm responses from Mistral, Meta/Llama, DeepSeek, ChatGPT; old handoffs)
│
├── .codex/CEHP/                            # CANONICAL cross-session AI memory (8 files)
│   ├── status.md                           # Most authoritative current state
│   ├── handoff.md                          # Latest handoff detail
│   ├── changelog.md                        # Full sprint history
│   ├── plan.md
│   ├── decisions.md
│   ├── agent.md
│   ├── open_questions.md
│   └── runbook.md
│
├── .claude/                                # Claude Code local settings
├── .github/workflows/static.yml            # GitHub Pages deploy
└── .gitignore
```

---

# 5. Creative Bloodline (Sacred, Do-Not-Break)

**Source**: `ACTIVE/knowledge/overflow/supporting-doctrine/DO_NOT_BREAK.md` (2026-03-09)

## The Universe
**Counterfeit Educational Universe** — the game world is a forgery of an educational broadcast. Every institution is authentic-looking but slightly off. Signs contradict themselves. Lanyards are suspicious. The player is never told what's wrong but can feel it.

## Ed's Voice
- **Deadpan**. Never excited.
- **≤ 8 words per line.**
- **No exclamation marks.** Ever.
- Ed is calm. The world is not. The tension is everything.

## Enemies & Characters
- **Cats are philosophers.** Not cute. They speak in paradoxes. They know things.
- **Rasta Corp is sincere.** They are not the joke. They are the only honest institution.
- Safety cones, hall monitors, scantrons, pencils, pills, insurance adjusters — these are the institutional organism. They are sincere in their corruption.
- Wonder Showzen texts (used for institutional messaging): `CONSUME`, `ARE YOU REAL?`, `BIRTH SCHOOL WORK DEATH`.

## World 1 Canonical Levels (historical set)
1. Ed Wakes Up
2. Cat Rave
3. After Dark
4. Hippie Bus Highway
5. Mochi HQ

## Reward Economy
Aloe tiers: **5 / 15 / 8 / 50 / 80 / 300**. These numbers are canonical and carry meaning that the player discovers over time.

## The No-List
- **No predatory retention.** No FOMO timers. No loot boxes. No daily streaks that punish absence.
- **No breaking character.** The institutional voice never winks at the player.
- **No visible behavioral meters.** Tracking stays silent. The player discovers it through the receipt.
- **No tutorial pop-ups** that contradict the world's tone. If the game must teach, the institution teaches.

## The Movement Constants in DO_NOT_BREAK Are Older
**IMPORTANT**: The movement constants in `DO_NOT_BREAK.md` (walkSpeed 140, jumpVel -520) are from 2026-03-09 and have since drifted. The **current live game** uses `walkSpeed 74, runSpeed 110, jumpVel -275, coyoteMs 100, jumpBufMs 140`. This drift is intentional — later tuning made Ed more controllable. For the rebuild, treat DO_NOT_BREAK constants as **aspirational speed**, but the live-tuned values are what players have been validating.

---

# 6. Sacred Constraints

From `CACTUS_ED_GOAT_GUIDE.md` + `DO_NOT_BREAK.md` + project lore:

1. **Single HTML file** — the entire game is one `index.html`. No build step. No bundler. No `npm run` to play.
2. **ES5 JavaScript only** — no ES6 modules, no arrow function shortcuts in hot paths, no `const` outside IIFEs where it hurts Phaser 3's expectations.
3. **The cigarette is central to Ed's identity** — weapon, helicopter (cig-copter), health indicator. Do not remove.
4. **Save compatibility (`cactusEd_save_v1`)** — never break silently. Migrate or version-bump.
5. **Institutional satire tone must remain consistent** — Ed stays calm; the world stays off.
6. **Behavioral tracking stays silent** — no visible axis meters during play. The receipt is the reveal.
7. **Browser-playable (no install, no app store)** — if it can't run from a URL, it doesn't ship.

---

# 7. Multi-Agent Workflow

CEHP is built by 4 coordinated AI agents + Kevin (director):

| Role | Agent | Responsibilities |
|---|---|---|
| **Architect** | ChatGPT 5.4 Pro | Design decisions, task definition, spec writing |
| **Builder** | Codex 5.4 | Code implementation, diffs |
| **Reviewer** | Claude Code Sonnet 4.6 | Code review, validation, save-schema checks |
| **Operations** | Claude Cowork Opus 4.6 | Git ops, process, coordination, docs |
| **Director** | Kevin | Final judgment, retesting on live URL |

## The Activation Key
`TASK_OWNER_ROLE` in `ACTIVE/docs/NEXT_TASK.md` is the **sole activation key**. Only the agent matching that role should act. Others propose via `ACTIVE/docs/PROPOSED_NEXT_TASK.md`.

## Shared Memory Policy
- **Canonical memory surface**: `.codex/CEHP/` — the ONLY authoritative cross-session memory.
- Agent-private memory systems (like Claude's `~/.claude/`) are supplementary only.
- If chat and `.codex/CEHP/` disagree, `.codex/CEHP/` wins.

## Handoff JSON Pattern
Agents pass state via JSON payloads + markdown docs. Each agent reads:
1. `CLAUDE.md` (root)
2. `README_Instructions on What To Do.md`
3. `ACTIVE/docs/NEXT_TASK.md`
4. `ACTIVE/docs/AGENTS.md`
5. `.codex/CEHP/status.md`

---

# 8. The Game — Systems Inventory

## Scene Architecture (current `index.html`)

| Scene | Constructor | Create Range | Update Range |
|---|---|---|---|
| DemoScene (World 1) | line 6939 | 6980–8378 | 10320–14504 |
| World2Scene | line 15378 | 15384–16107 | 16108–17522 |
| World3Scene | line 17569 | 17574–17943 | 17944–18908 |
| TitleScene | line 19267+ | — | — |

## Movement Engine (Celeste-tier)
- **100ms coyote time** (jump after leaving ledge)
- **140ms jump buffer** (jump before landing)
- **0.45× apex gravity reduction** (hang time)
- **1.15× fall gravity boost** (snappy descent)
- **Variable jump height** via early release
- **Ground accel 1400 px/s², decel 2200 px/s²**
- **Air control 0.82** (momentum-based)
- **Wall slide with max fall cap**, wall jump with 130ms sticky-reattach prevention
- **Spin dash**: 3 charge tiers (150/300/400ms) → 120/155/185 px/s, 2s duration, 70% momentum retention on exit
- **Cig Copter**: 2-tap activation after double jump, fuel-limited (4s), hold-Z for steady lift vs tap-for-burst
- **13+ actions**: move, jump, double jump, triple jump, wall slide/jump, punch, kick, spin dash, cig copter, ground slam, glide

## Visual Systems (by name, searchable in index.html)
- `ANIM_UI` — animated UI elements
- `AMBIENT_LIGHT` — scene lighting
- `BROADCAST_STATE` — corrupted broadcast layer state
- `ENV_FX` — environmental particle effects
- `COLOR_GRADE` — per-axis color grading
- `TRANSITIONS` — scene transitions
- `RECEIPT_TEMPLATES` — procedural receipt text
- `POLICY_FLAGS` — institutional messaging flags
- `PUNCHCARD` — end-of-run summary card
- `CASE_SEED` — deterministic run identifier (CASE-DATE-RUN-AXIS)
- `MOOD_VISUALS` — axis-driven mood palette
- `BEHAVIOR_FX` — behavioral feedback FX

## Audio System
- 100% procedural via Web Audio API
- Oscillators + filters, no samples
- Tied to behavioral state (chaos mood = different timbre)

## Save System
- `cactusEd_save_v1` localStorage key
- Tracks: run history, axis profiles, case seeds, receipts collected, best times, unlocks
- Migration-ready schema

---

# 9. The 10 GOAT Rounds (All Shipped)

Each round has a spec in `ACTIVE/GOAT_PLAN/`. Summarized here:

## Round 1 — Juice & Feel
Hit-stop, screen shake, particle bursts, squash-and-stretch on landing, chromatic aberration on impact. The goal: every player action gets a satisfying physical response.

## Round 2 — Sound
Procedural Web Audio SFX for every mechanic. No audio files. Behavioral state modulates timbre (chaos = harsher, grace = softer).

## Round 3 — Progression
Unlock gating tied to behavioral profile. Run your first playthrough however you want; subsequent runs unlock new routes based on dominant axis.

## Round 4 — Replayability
Case Seed system. Every run gets a unique identifier (CASE-20260420-007-CURIOSITY). Receipts are shareable by seed. Same seed = same world.

## Round 5 — Surprise & Delight
Hidden rooms behind signs. NPCs that break script based on your axis profile. The "curiosity betrayal" — curious players get slightly sad signs.

## Round 6 — UX
Progressive ability introduction (not all 13 actions at once). Diegetic teaching — the institution "trains" Ed. No wall-of-text controls screen.

## Round 7 — Content Engine
Modular level templates. Procedural zone variations. Receipt templates that combine behavior × context × rarity.

## Round 8 — Social / Viral
Shareable receipts. Screenshot-friendly end-of-world summaries. Deep-linkable case seeds.

## Round 9 — Difficulty / Challenge
Behavioral difficulty scaling. If you play compliant, challenge rises in compliance paths. Efficient play unlocks speedrun splits.

## Round 10 — Content Expansion
Template system for future worlds. Each new world is a theme + 4 zones + enemies + boss + receipts. Modular enough to author a new world in days, not months.

**See `ACTIVE/GOAT_PLAN/00_GOAT_MASTER_PLAN.md` and `SYNTHESIS.md`** for the cross-AI convergence that drove these.

---

# 10. Corrupted Broadcast — Visual Evolution

**Shipped 2026-03-21.** This is the game's signature visual identity.

## The Aesthetic
The entire game looks like a **corrupted institutional TV broadcast from the 90s**. The canvas is rendered as if through a failing CRT. Signal bleeds between frames. Axis-driven color grading makes chaos runs feel like a different channel.

## Techniques
- **Scanlines** (horizontal bands, subtle)
- **CRT rolls** (occasional vertical sync glitch)
- **Chromatic aberration** (RGB split on high-action moments)
- **Color grading per axis** (compliance = sterile blue, chaos = magenta bleed, grace = warm amber)
- **Broadcast state indicators** — occasional "SIGNAL LOST" and "STAND BY" cards
- **Mood visuals** — subtle palette shifts based on cumulative behavior

## Why It Works
The programmer-art canvas draw calls stop reading as "prototype" and start reading as "intentional lo-fi broadcast aesthetic." This was the biggest perceptual leap in the project.

---

# 11. Behavioral Tracking — The Unique Mechanic

**This is the game's moat.** No other platformer does this.

## The 6 Axes (silent)
1. **Compliance** — following safe, institution-sanctioned paths
2. **Intuition** — taking unauthorized/hidden routes
3. **Curiosity** — reading signs, talking to NPCs, finding secrets
4. **Grace** — recovering from near-failures, avoiding harm at the last moment
5. **Chaos** — spin rampages, kill streaks, destruction
6. **Efficiency** — fast completion, minimal exploration, direct paths

## Kill Combo System
Streaks generate escalating institutional commentary:
- ×3: "PROACTIVE ENGAGEMENT"
- ×5: "ENTHUSIASM EXCEEDS PARAMETERS"
- ×8: "YOUR VIOLENCE HAS BEEN RECLASSIFIED AS INITIATIVE"

## The Receipt
At the end of each world, a personalized receipt is generated from ~60 unique flavor texts across the 6 axes. Example outputs:

- **Grace**: "NEAR-MISS COMMENDATION: You avoided harm at the last moment. Harm felt ignored."
- **Chaos**: "DISRUPTION REPORT: You solved a problem by breaking it. The problem has been archived as resolved."
- **Curiosity**: "UNSCHEDULED INQUIRY: You looked behind the sign. The sign has been coached to feel betrayed."

## Why It's The Moat
- Players don't see the axes → organic discovery
- Receipts feel personal ("how did it KNOW?")
- Shareability: screenshot a receipt, friends want to see their own
- Replay incentive: "what if I play chaotic this time?"
- Fits the institutional satire perfectly — the institution interprets you

---

# 12. Known Bug Patterns & Lessons Learned

**Source**: `ACTIVE/knowledge/STUDIO_KERNEL/bug_patterns.md` + `lessons_learned.md`

## Bug Patterns (5 documented)
1. **Canvas focus loss** — clicking outside canvas steals input, movement sticks. Fix: explicit focus-return + key release on blur.
2. **Text overlap** — multiple HUD strings rendered at same coords. Fix: z-layer discipline + coord reservations per HUD element.
3. **Camera snap** — fast scene transitions jerk the camera. Fix: smooth camera interpolation on world-switch.
4. **Stale progress** — save state written mid-frame, read before complete. Fix: atomic save writes, debounced by 250ms.
5. **Query-param bleed** — debug query params (e.g. `?start=w3`) persist across deploys. Fix: sanitize on load, strip debug params in prod.

## Lessons (6 documented)
1. Movement tuning is done by ear, not by spec — playtest constantly, don't trust numbers alone.
2. Procedural art is an aesthetic, not a compromise — commit to it fully (see: Corrupted Broadcast).
3. The behavioral tracking must stay silent or the magic dies.
4. Single HTML file is a feature, not a limitation — it means anyone can fork, inspect, and share.
5. Ed's voice rules (≤8 words, no !) are load-bearing for tone.
6. Save schema bumps are cheap if you version from day one. They're expensive if you don't.

## Design Principles
From `game_design_principles.md` — **Self-Determination Theory** foundation:
- **Autonomy** (player chooses their path)
- **Competence** (game meets player skill)
- **Relatedness** (receipt creates identification)
All three must be present for deep engagement.

---

# 13. The Rebuild — What to Keep, What to Rethink

## KEEP (these are the crown jewels)

### 1. The Creative Bloodline
Everything in `DO_NOT_BREAK.md`. Ed's voice, Counterfeit Educational Universe, cats-as-philosophers, Rasta Corp sincerity. This is the soul of the game — rewriting it loses everything.

### 2. 6-Axis Silent Behavioral Tracking
The mechanic, the silent-until-receipt reveal, the kill combo escalations.

### 3. Procedural Receipt System
The mad-libs-style receipt generator. Expand the template bank; keep the architecture.

### 4. Case Seed System
`CASE-DATE-RUN-AXIS` identifiers + deterministic seeds. Shareability + replay.

### 5. Corrupted Broadcast Aesthetic
Committing to procedural-as-broadcast is the visual identity. Don't go back to plain canvas draw calls.

### 6. Movement Engine Constants
The Celeste-tier feel is tuned. Port the current live constants (walkSpeed 74, runSpeed 110, jumpVel -275, coyoteMs 100, jumpBufMs 140) — not the drifted `DO_NOT_BREAK` ones.

### 7. Single HTML File + ES5 + Phaser CDN
Keep the zero-build-step simplicity. It's part of the project's identity.

### 8. Multi-Agent Workflow
The Architect/Builder/Reviewer/Ops pattern with `TASK_OWNER_ROLE` as activation key. Don't break this.

## RETHINK (opportunities for the rebuild)

### 1. Code Architecture
The current `index.html` is 19,835 lines in one file. ES5 + single-file is sacred, but **internal structure** can be cleaner — use IIFE modules, explicit section headers, or even multi-file concatenation at dev time. Consider a preamble/scenes/systems/constants layout.

### 2. World Length
Current worlds are 60–90 seconds each. Expand to 3–5 minutes each without breaking the receipt cadence.

### 3. Progressive Ability Introduction
Round 6 spec'd this but the rebuild can go deeper. Ed starts with 2 actions. The institution "trains" him into the other 11. Diegetic teaching throughout World 1.

### 4. Audio Depth
Round 2 shipped procedural SFX. Rebuild can add **procedural music** — Web Audio oscillator-based ambient that responds to behavioral state. Never audio files.

### 5. Content Templates (Round 10)
Double down. A new world should take 1 focused sprint to ship, not a month. Lock down the template format.

### 6. UX Polish
Wall-of-text controls screen → diegetic in-world teaching. Death/respawn feedback (currently a silent counter increment) → a tiny institutional form getting stamped.

### 7. Save Schema v2
If the rebuild introduces new fields, bump to `cactusEd_save_v2` with an explicit v1→v2 migration. Don't silently drift.

## RETIRE (dead weight)

### 1. Stale Docs
`ACTIVE/docs/CURRENT_PASS.md` references Sprint 006. `ACTIVE/docs/HANDOFF.md` per-agent prompts reference outdated tasks. Archive these on rebuild start.

### 2. Old `ALL/` References
Any changelog entries before 2026-03-20 reference `ALL/` paths. These are historical and correct for when written — don't retroactively update, but new docs should use `ACTIVE/`.

### 3. Empty Asset Scaffolds
`ACTIVE/game/art/`, `audio/`, `content/`, `ui/` are empty. If assets stay procedural (they should), delete the scaffolds on rebuild.

---

# 14. Reference Index — Everything, With Paths

## If you need to know...

| Question | Read this |
|---|---|
| What's the current task? | `ACTIVE/docs/NEXT_TASK.md` |
| What just happened? | `.codex/CEHP/handoff.md` |
| What's the authoritative current state? | `.codex/CEHP/status.md` |
| What's the full change history? | `.codex/CEHP/changelog.md` |
| What's the creative bloodline? | `ACTIVE/knowledge/overflow/supporting-doctrine/DO_NOT_BREAK.md` |
| What are the sacred constraints? | `ACTIVE/knowledge/overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md` |
| How do the 10 GOAT rounds work? | `ACTIVE/GOAT_PLAN/*.md` (all 12 files) |
| What are the multi-agent rules? | `ACTIVE/docs/AGENTS.md` |
| What's in the backlog? | `ACTIVE/docs/BACKLOG.md` |
| What bugs are known? | `ACTIVE/docs/KNOWN_ISSUES.md` + `ACTIVE/knowledge/STUDIO_KERNEL/bug_patterns.md` |
| What lessons have we learned? | `ACTIVE/knowledge/STUDIO_KERNEL/lessons_learned.md` |
| What's the game design philosophy? | `ACTIVE/knowledge/STUDIO_KERNEL/game_design_principles.md` |
| How does the code live? | `ACTIVE/game/index.html` + scene line ranges in Section 8 above |
| How do I verify saves? | `node ACTIVE/game/scripts/check_save_schema.js` |
| How does it deploy? | `.github/workflows/static.yml` → GitHub Pages |
| What's the public URL? | https://kevinbigham.github.io/Cactus-Eds-Happy-Place/ |

## External Resources (downloaded, in `/tmp/cehp_github/` if still present)
- `GAME_REVIEW_AND_GOAT_PLAN.md` — 563-line Claude Cowork review (verdict: "25-30% of the way to launch-ready")
- `GOAT_GAME_BRAINSTORM_PROMPT.md` — the prompt template used to gather brainstorms from Mistral/Meta/DeepSeek/ChatGPT
- `00_HANDOFF_FROM_CLAUDE_CODE.md` — 2026-03-20 executive handoff

## ARCHIVE contents (load only if task targets them)
- AI brainstorm responses (Mistral, Meta/Llama, DeepSeek, ChatGPT) — raw inputs for the SYNTHESIS doc
- Historical handoffs and briefings
- Old sprint plans
- Pre-reorg `ALL/` layout references

---

# APPENDIX A — The Seven-Word Version

> *"Ed is calm. The world is not."*

If you only remember one thing about this game, remember that. Every design decision should answer: does this preserve Ed's calm against the world's chaos?

---

# APPENDIX B — First Hour of the Rebuild

A suggested opening sequence for the next agent:

1. **Read this compendium start to finish** (~15 min).
2. **Read `DO_NOT_BREAK.md`** in full.
3. **Open `ACTIVE/game/index.html` in a browser** and play World 1 through the receipt.
4. **Play World 2 and World 3.** Note what feels magical, what feels tired.
5. **Read `ACTIVE/GOAT_PLAN/SYNTHESIS.md`** for the cross-AI convergence.
6. **Read `.codex/CEHP/changelog.md`** to see the arc of how the game got here.
7. **Only then** propose the rebuild architecture in a new doc at `ACTIVE/docs/REBUILD_PLAN.md`.

Do not start coding on day one. The game is a living artifact — understand it before you rebuild it.

---

**End of Compendium.** This file is the single source of truth for the rebuild. Keep it updated.
