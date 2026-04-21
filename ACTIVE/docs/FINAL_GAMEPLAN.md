# CEHP REBUILD — FINAL GAMEPLAN

> **Status**: APPROVED 2026-04-20 by Kevin (Director).
> **Target launch**: 2026-05-29 (aligned with Kane Pixels × A24 *Backrooms* release).
> **Fallback launch**: 2026-06-12. Hard stop: 8 weeks. Scope creep kills weird games.
> **Director's energy**: LEGENDARY SPRINT. Match it.

---

## ONE-SENTENCE VISION

**Cactus Ed's Happiest Place is the platformer that files a report on you.**

Ed is calm. The world is not. The institution watches how you move, then lies about what it means. Every run produces a procedural receipt that feels too specific. Every receipt is a shareable object. Every Case Seed is a replayable URL. The game is a procedural judgment machine that happens to use platforming as its evidence-gathering method.

---

## THE 25 RULINGS (THE DOCTRINE)

### 🔱 ARCHITECTURE
1. **Dev-time concat.** Author in `src/00_core.js` → `src/90_ui.js`. 20-line Node build script cats files between `<!-- BUILD START -->` / `<!-- BUILD END -->` markers. Ship one HTML. No bundler. No `npm run` to play.
2. **6 visible axes + ~30 micro-signals + 3 pairwise tensions.** Primaries: compliance, intuition, curiosity, grace, chaos, efficiency. Derived at receipt time: **Obedience** (compliance−chaos), **Style** (grace+efficiency), **Audit Risk** (curiosity−intuition). Micro-signals (recency, backtracks, idle, damage types) feed text selection, never display.
3. **All 11 actions permanent from Minute 1.** Move, jump, double/triple-jump, wall-slide/jump, punch, kick, spin-dash (3-tier charge), cig-copter, ground-slam, glide. Gating would break Case Seed replay parity. Teach them diegetically via mandatory compliance modules.
4. **Full-diegetic UI. One escape hatch.** Pause = clipboard. Saves = locker. Controls = training poster. Accessibility concession: `?settings=1` URL param opens a plain HTML form. Never shown unless requested.
5. **Save v2 migration + v1 archaeological layer. No weaponized fork.** On boot: migrate `cactusEd_save_v1` → `cactusEd_save_v2`, preserve v1 blob inside v2 under `legacy`. New receipts can reference it: *PREVIOUS INCIDENT ON FILE. DATED.* Skip Gemini's save-fork trick — violates no-predatory-retention.

### 🧾 RECEIPT + SOCIAL
6. **3 lines + seed.** Format: `[1 Primary Verdict] [1 Pairwise Tension] [1 World Closer] [CASE-SEED]`. ~180 authored fragments → millions of combos. Constraint breeds wit.
7. **1080×1350 PNG + thermal mode.** TikTok/IG/Discord/Bluesky-friendly. `?thermal=1` renders 58mm monochrome for physical printing. Lore-perfect, scope-cheap.
8. **`counterfeit-educational.org` as canonical home.** Register the domain. Site itself is World 0: The Lobby. Game runs in iframe styled as intranet portal. All memos, forms, receipts live under the same letterhead.
9. **Appeals mechanic ships in rebuild.** Seed deep-links + ghost replay + side-by-side comparison. Same seed → two players → two different receipts → public argument. This is the discourse engine. Not v2. Now.
10. **THE DOCKET (weekly global seed, archived forever).** One featured seed per week. No timer. No streak. No reward. Permanent archive. Gives streamers + press a shared object. Not FOMO — shared text.

### 🚀 LAUNCH
11. **Target 2026-05-29** (Kane Pixels × A24 *Backrooms* drop). Six weeks. If diegetic teaching needs 8, take 8. Never 12.
12. **Critical Reflex pitch = Priority #1.** They published *Mouthwashing*. They own the analog-horror/weird-institutional category. Start the deck Week 1.
13. **Steam later — not at launch.** Browser-native stays free + canonical. Electron wrapper at $14.99 ships later as **"The HR Expansion"** (3 new worlds — Exit Interview Theater, Claims Adjustatory, one TBD).
14. **Primary audience wedge: analog-horror fans.** Backrooms / Mandela Catalogue / Home Safety Hotline / Critical Reflex audience already speaks the visual language. Secondary: weird-Twitter / Are.na (they write the essays).
15. **Discovery #1: Discord bot.** `/case CASE-20260420-007-CURIOSITY` → 1080×1350 receipt render + play-seed link. Every posted receipt is an ad. Week 2 build. **#2**: TikTok 6-sec stamp cuts. **#3**: Bluesky dev memos.

### 🏛️ WORLDS + MECHANICS
16. **3 worlds × 5 min = 15–18 min vertical slice.** Prove receipt system + appeals + audio + architecture. Everything else is content.
17. **World 1**: Orientation Bureau · **World 2**: Benefits Enrollment Atrium · **World 3**: Rasta Corp Logistics Hub. Exit Interview Theater + Claims Adjustatory held for HR Expansion.
18. **Rasta Corp is structural, not flavor.** Only honest institution. The place where the cigarette will not light and Ed must platform raw. Makes every other world hurt.
19. **Contradiction gates = core mechanic in every world.** Same sign, different behavior → different route. `DO NOT JUMP` — jumping opens lower path; waiting opens upper path. Receipts: `INSUBORDINATION NOTED` / `PATIENCE REWARDED`.
20. **Forms-as-physical-objects = core verb family.** Liability waiver bridge. Rejected application blade. Stamp trampoline. Canvas rect + institutional copy = aesthetic and design in one move.

### 🎵 AUDIO / DEATH / PRODUCTION
21. **Music reference: *Papers, Please* scored by a public-access dub engineer.** Two detuned saws, one sine, one filter, one noise layer. Compliance muffles. Chaos opens. Curiosity pings. Bureaucratic menace. Web Audio oscillators only. No files.
22. **Cigarette = visual feedback only.** No burn-rate timer. No withdrawal. High chaos = fast/bright. High grace = slow/long ash. It's a mood ring the player smokes.
23. **Death = sub-1-second stamp, escalating language.** `APPLICATION DENIED` slams in 200ms → respawn. After 3 deaths in 10s → `ADDITIONAL INCIDENTS HAVE BEEN PRE-APPROVED` + extend i-frames. Never slow the loop.
24. **1 week per world. 6 weeks total. 8-week ceiling.** Schedule below.
25. **Keep all sacred constraints. Moderate autonomy.** Single HTML · ES5 · Phaser CDN · no build · invisible axes · no predatory retention · save compatibility. Breaking any of these makes CEHP a normal indie game. Director check-in cadence: after each system + after each world. Unit of progress = a seed + its receipt. No PR-level review.

---

## 6-WEEK SCHEDULE

| Week | Deliverable | Definition of Done |
|---|---|---|
| **1** | Architecture · Core systems · Receipt engine · Appeals · Discord bot | `counterfeit-educational.org` live (placeholder). Save v1→v2 migration green. One test world prints a real 3-line receipt. Bot renders PNG. Critical Reflex deck v0 drafted. |
| **2** | **World 1 — Orientation Bureau** | All 11 actions diegetically taught. Contradiction-gate prototype. Full 5-min run. Receipt specific to behavior. |
| **3** | **World 2 — Benefits Enrollment Atrium** | Checkboxes as platforms. Deductible shrinks jump height. Form-as-object hazards in play. |
| **4** | **World 3 — Rasta Corp Logistics Hub** | Sincerity zone. No enemies. Cigarette will not light. Raw platforming. Closer receipts feel *tragic*, not cynical. |
| **5** | Polish · Audio (4-layer adaptive) · Thermal mode · Domain cutover · Trailer cuts | All three worlds flow seamlessly. Music responds to axes in real-time. Trailer rough cut. |
| **6** | Trailer final · Critical Reflex pitch · Launch buffer | Public launch on 2026-05-29. CR pitch sent. Launch-day discord bot live in 3+ seed servers. |

---

## ARCHITECTURE SPEC

### File layout (authored)
```
ACTIVE/game/
├── index.html              # SHIPPED artifact — one file, no build
├── src/                    # authored modules (concatenated at build)
│   ├── 00_index.js         # global CEHP namespace declaration
│   ├── 01_const.js         # SAVE_KEYS, RULESET "R2", tuning values
│   ├── 02_rng.js           # seeded LCG — NEVER Math.random()
│   ├── 03_events.js        # pub/sub bus
│   ├── 04_save.js          # v1→v2 migration + archaeological layer
│   ├── 05_caseseed.js      # deterministic seed gen + URL parse
│   ├── 10_axes.js          # 6 axes + 30 micro-signals + pairwise tensions
│   ├── 11_metrics.js       # recency weighting, backtrack/idle tracking
│   ├── 20_input.js         # keyboard/gamepad abstraction
│   ├── 21_movement.js      # all 11 actions, Celeste mercies (coyote, bufferjump, corner correct)
│   ├── 22_collision.js
│   ├── 30_audio.js         # 4-layer Web Audio graph + axis mapping
│   ├── 40_fx.js            # CRT roll, scanlines, chromatic aberration, per-axis grading
│   ├── 41_signs.js         # canvas-drawn diegetic signage
│   ├── 50_forms.js         # forms-as-physical-objects (bridge/blade/trampoline)
│   ├── 51_contradiction.js # contradiction gates runtime
│   ├── 60_enemies.js       # base + stapler/scantron/partition/etc.
│   ├── 70_worlds.js        # world manifests (data-driven)
│   ├── 71_world_orientation.js
│   ├── 72_world_benefits.js
│   ├── 73_world_rasta.js
│   ├── 80_receipts.js      # 3-line format, ~180 fragments, priority sort
│   ├── 81_docket.js        # THE DOCKET weekly seed
│   ├── 82_appeals.js       # seed replay + ghost comparison
│   ├── 90_ui.js            # diegetic surfaces: clipboard, locker, poster
│   ├── 91_scenes.js        # Boot, Play, Overlay, Receipt
│   └── 99_boot.js          # bootstraps CEHP, registers scenes, starts
├── build.js                # 20-line Node concatenator
└── scripts/
    └── check_save_schema.js  # verifies cactusEd_save_v1 contract
```

### Build script (sketch, ES5-safe output)
```js
// build.js — Node, ~20 lines
var fs = require('fs');
var path = require('path');
var srcDir = path.join(__dirname, 'src');
var files = fs.readdirSync(srcDir).filter(function(f){ return f.match(/\.js$/); }).sort();
var bundle = files.map(function(f){
  return '/* =============== MODULE: ' + f.toUpperCase() + ' =============== */\n' +
         fs.readFileSync(path.join(srcDir, f), 'utf8');
}).join('\n\n');
var template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf8');
var out = template.replace(
  /<!-- BUILD START -->[\s\S]*<!-- BUILD END -->/,
  '<!-- BUILD START -->\n<script>\n' + bundle + '\n</script>\n<!-- BUILD END -->'
);
fs.writeFileSync(path.join(__dirname, 'index.html'), out);
console.log('Built ' + files.length + ' modules → index.html (' + out.length + ' bytes)');
```

### Namespace pattern
```js
var CEHP = CEHP || {};
(function(ns){
  'use strict';
  ns.Axes = {
    // public shape — 6 axes normalized 0..1
    primary: { compliance:0, intuition:0, curiosity:0, grace:0, chaos:0, efficiency:0 },
    // micro-signals (internal)
    micro: { backtracks:0, idleTime:0, signPeeks:0, nearMisses:0, /* ... */ },
    // derived at receipt time
    tensions: function(){
      var p = this.primary;
      return {
        obedience: p.compliance - p.chaos,
        style:     p.grace + p.efficiency,
        auditRisk: p.curiosity - p.intuition
      };
    }
  };
})(CEHP);
```

---

## WEEK 1 SYSTEMS — BUILD ORDER

1. **Core** (const, rng, events, save v1→v2 with archaeological layer)
2. **Case Seed** (`CASE-YYYYMMDD-NNN-AXIS-R2` — versioned, URL-parsed)
3. **Axes engine** (6 primary + 30 micro + 3 pairwise tensions)
4. **Receipt engine** (3-line format, ~180 fragment pool, priority+diversity sort)
5. **Appeals** (seed→replay + ghost movement recording, comparison screen)
6. **Discord bot** (Node + discord.js, renders receipt PNG via canvas, one command `/case`)
7. **Audio** (4-layer oscillator graph, axis-reactive parameter binding)
8. **Movement** (all 11 actions + Celeste mercies)
9. **Contradiction gates** (sign → behavior detector → route switch)
10. **Forms-as-objects** (bridge / blade / trampoline primitives)
11. **Diegetic UI** (clipboard pause, locker save, training poster controls, `?settings=1` escape)
12. **Death stamp** (<1s, language escalation on repeat)
13. **Cigarette visual** (axis-driven burn rate + ash length, no mechanics)
14. **THE DOCKET** (weekly seed picker, permanent archive view)
15. **Thermal mode** (`?thermal=1` → 58mm monochrome canvas)

---

## WORLD SPECS

### World 1 — Orientation Bureau
**Palette**: sterile blue, harsh fluorescent white, bureaucratic beige, red-stamp accent.
**Purpose**: Teach all 11 actions via mandatory compliance modules. Set tone. Establish the institution.
**Signage sample**:
- `ELEVATION REQUIRES LEVERAGE. KICK THE SYSTEM.`
- `MOVEMENT IS ENCOURAGED BETWEEN 9:00 AND 9:04.`
- `YOUR COOPERATION HAS BEEN PRE-INTERPRETED.`
**Key rooms**: Intake · Base Locomotion · Vertical Compliance · Corrective Handling · Aerial Exception · Final Certification.
**Contradiction gate example**: `DO NOT PUNCH THE MONITOR` — punching opens combat path; walking past tracks compliance route.
**Closer receipt fragments**: `ORIENTATION COMPLETE. FILE SEVERED.` / `YOU LEARNED ELEVEN THINGS. THE INSTITUTION LEARNED SIXTY.`

### World 2 — Benefits Enrollment Atrium
**Palette**: soft pastel pink, deductible red, sterile yellow.
**Purpose**: Pure institutional satire. Checkboxes as platforms. Deductibles shrink jump height.
**Mechanic**: Premium Pathways — collect stamped "premiums" for safer route; uninsured path is 1-hit-kill.
**Signage sample**:
- `HARM IS SIMPLY A CHOICE.`
- `SMILE. IT IS MANDATORY.`
- `YOUR LIFESPAN IS NO LONGER PROFITABLE.`
**Enemies**: Actuarial Scantrons (teleport to block landings), Pizza Party slices (heal + coma debuff), Deductible weights.
**Contradiction gate example**: `COVERAGE REQUIRES COMPLIANCE` — collect premiums = easy route; skip and take damage = `UNINSURED VETERAN` receipt.
**Closer**: `BENEFITS PROCESSED. YOU OWE NINE DOLLARS AND A YEAR.`

### World 3 — Rasta Corp Logistics Hub
**Palette**: warm greens, earthy browns, amber lamp light. **No chromatic aberration. Minimal CRT roll.**
**Purpose**: The contrast engine. Sincerity zone. **The cigarette will not light.** Ed platforms raw.
**Mechanic**: Synchronicity — platforms flow with ambient music. Grace and intuition reward themselves.
**Signage sample**:
- `TAKE WHAT HELPS. LEAVE WHAT DOESN'T.`
- `THIS DOOR OPENS WHEN ASKED.`
- `YOU DO NOT OWE THE WALL.`
**No enemies.** Automated sorting machines politely redirect rather than attack.
**Contradiction gate example**: A sign says `REST HERE`. Resting opens the exit. Trying to "beat" the world faster sends you back gently.
**Closer receipt fragments** (tonally tragic, not cynical): `YOU ARE EXACTLY WHERE YOU BELONG.` / `THE CIGARETTE DID NOT NEED TO BURN TODAY.` / `FILE CLOSED. WITH WARMTH.`

---

## AUDIO SPEC

Four continuous Web Audio layers, all oscillators (zero files):

| Layer | Source | Axis Mapping |
|---|---|---|
| **HVAC hymn** | Two detuned triangles → lowpass → master | compliance ↑ = filter cleaner; grace ↑ = softer release |
| **Bureau pulse** | Square-wave metronome @ 60 BPM base | efficiency ↑ = tempo +10; compliance ↑ = pulse louder/rigid |
| **Curiosity shimmer** | Highpassed partials with delay | curiosity ↑ = bloom near secrets; intuition ↑ = arrives *before* event |
| **Incident noise** | Filtered noise bursts + pitch wobble | chaos ↑ = more noise presence, more detune |

**Tempo baseline**: 60 BPM (one-second pulse = wall clock / dripping faucet). Efficiency + grace modulate ±5 BPM.

**World overrides**: Rasta Corp defaults 72 BPM, warmer filter, removes noise layer entirely.

---

## SOCIAL STACK

**Receipt card** (1080×1350 PNG, shareable):
```
┌────────────────────────────────┐
│  COUNTERFEIT EDUCATIONAL       │
│  CASE-20260420-007-CURIOSITY-R2│
│                                │
│  UNSCHEDULED COMPETENCE        │
│  You found the approved exit.  │
│  You declined it respectfully. │
│                                │
│  cactused.org/case/...         │
└────────────────────────────────┘
```

**Appeals flow**:
1. Player A finishes run, gets receipt + seed URL.
2. Shares link.
3. Player B opens URL → same world, same geometry, same RNG.
4. Player B plays their way → gets different receipt.
5. Receipt screen offers *"Compare with previous case"* → side-by-side.

**Discord bot** (`/case CASE-...`):
- Renders receipt PNG via canvas.
- Posts with play link + `The Institution requires more behavioral data.`
- Lives at `counterfeit-educational.org/bot`.

**THE DOCKET**:
- Curated global seed each Sunday.
- Permanently archived at `counterfeit-educational.org/docket`.
- No timer, no streak, no badge.
- Provides streamers + press a weekly hook without retention mechanics.

---

## LAUNCH STRATEGY

### Pre-launch (Weeks 1–5)
- Bluesky dev memos every 2–3 days styled as institutional notices (`MEMO 4/22: The Compliance Team has requested an audit of your jump height.`)
- Week 3: Discord bot public beta in 1 seed server (your existing community + 1 partner).
- Week 4: Short-form TikTok posts — 6-second clips ending in stamped receipt.
- Week 5: Teaser trailer cut (30s + 90s versions).

### Launch day (2026-05-29)
- Kane Pixels × A24 *Backrooms* drops same day → analog-horror timeline is LIT.
- Drop trailer on Bluesky + TikTok + X (cross-posted).
- Discord bot goes public-install.
- THE DOCKET launches with Seed #001.
- counterfeit-educational.org fully live as The Lobby.

### Post-launch
- Critical Reflex pitch follow-up Week 7.
- Steam page announced Week 8+ for **The HR Expansion** ($14.99, 3 new worlds).
- Browser version remains free and canonical forever.

---

## SACRED CONSTRAINTS — NON-NEGOTIABLE

1. Single HTML file shipped artifact. No build step to *play*.
2. ES5 JavaScript only. No transpilation.
3. Phaser 3 via CDN. No npm install.
4. `cactusEd_save_v1` contract preserved via v2 migration + archaeological layer.
5. Behavioral axes stay invisible during play. Receipt is the reveal.
6. No predatory retention: no FOMO timers, no loot boxes, no daily streaks, no push notifications.
7. Ed's voice: deadpan, max 8 words per line, NO exclamation marks.
8. Ed is calm. The world is not. That tension IS the game.

**If any system threatens these, the system loses. Not the constraint.**

---

## COLLABORATION PROTOCOL

**Autonomy level**: Moderate.
**Check-in unit**: One seed + its receipt. Every system done → send seed. Every world done → send seed.
**No PR-level review.** Director reacts, builder keeps sprinting.
**Standing agents**:
- **Claude Opus 4.7 (me)**: Reviewer / ops / producer coordination. Writes this doc. Catches regressions.
- **Codex 5.4**: Builder. Executes weekly sprints. Writes the ES5.
- **ChatGPT 5.4 Pro**: Architect. Pre-sprint packet review. World spec sharpening.
- **Kevin**: Director. Locks decisions, reacts to seeds, plays.

**Escalation triggers** (pause + ask Kevin):
- Breaking a sacred constraint.
- Slipping past 2026-06-12 fallback.
- Budget decision (Steam sunk cost, domain renewal, paid trailer edit).
- Critical Reflex response inbound.

---

## RISK LEDGER

| Risk | Probability | Mitigation |
|---|---|---|
| Kane Pixels date slips / Backrooms delays | Medium | Fallback 2026-06-12. Launch anyway — game stands alone. |
| Critical Reflex declines / silent | High (cold pitch) | Self-publish is Plan A. CR is upside. |
| Scope creep (4th world temptation) | High | 8-week hard stop. 4th world is HR Expansion, paid. |
| Audio complexity eats Week 5 | Medium | Ship minimum viable 4-layer in Week 3 tick. Polish Week 5. |
| Single-file > 30k lines becomes unreadable | Low (concat solves) | Enforce `/* === MODULE === */` headers and file-per-concern discipline. |
| Save migration bug corrupts v1 data | Low but catastrophic | `check_save_schema.js` runs on every commit. Manual test of 10 real v1 saves. |
| Discord bot rate-limits on launch day | Low | Pre-cache top 100 likely seeds. Fallback to static PNG + URL. |
| Accessibility complaints (flashing CRT) | Medium | `?settings=1` reduces flash, scanline, chromatic bleed independently. Ship Day 1. |

---

## DELIVERABLES CHECKLIST (LAUNCH-BLOCKING)

- [ ] `src/` module layout + `build.js` green
- [ ] Save v1 → v2 migration w/ archaeological layer
- [ ] 6 axes + 30 micro-signals + 3 pairwise tensions wired
- [ ] Case Seed format `CASE-YYYYMMDD-NNN-AXIS-R2` deterministic
- [ ] Receipt engine: 3-line format + ~180 fragments + priority sort
- [ ] Appeals flow: seed deep-link + ghost replay + comparison
- [ ] Discord bot live, renders 1080×1350, installs on external server
- [ ] THE DOCKET weekly seed system + archive page
- [ ] All 11 actions + Celeste mercies (coyote, buffer jump, corner correct)
- [ ] Contradiction gates working in all 3 worlds
- [ ] Forms-as-objects: bridge + blade + trampoline primitives
- [ ] Full-diegetic UI: clipboard / locker / training poster
- [ ] `?settings=1` accessibility escape hatch
- [ ] Death stamp <1s + language escalation
- [ ] Cigarette visual feedback (axis-driven burn + ash)
- [ ] 4-layer procedural audio + axis reactivity
- [ ] World 1: Orientation Bureau (5 min, teaches all 11)
- [ ] World 2: Benefits Enrollment Atrium (5 min)
- [ ] World 3: Rasta Corp Logistics Hub (5 min, sincerity zone)
- [ ] Thermal mode `?thermal=1`
- [ ] `counterfeit-educational.org` live with iframe Lobby + docket + archive
- [ ] Trailer (30s + 90s)
- [ ] Critical Reflex pitch deck

---

## NORTH STAR (READ BEFORE EVERY SESSION)

> I opened a browser game.
> I played as a calm cactus.
> The movement was weirdly good.
> The world kept trying to certify me.
> I did what I normally do in games.
> Then it printed a report that felt too specific.
> I sent it to someone.
> They played the same case.
> The game accused them of something else.
> Now we are both mad at a hallway.

**Build the machine that makes people say:**
**"Play this seed and tell me what it calls you."**

---

*Plan locked 2026-04-20. Week 1 begins immediately. Send the first seed.*
