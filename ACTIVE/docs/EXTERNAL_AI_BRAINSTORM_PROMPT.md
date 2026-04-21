# CEHP Rebuild — Prompt for External AI Consultation

> Paste this into ChatGPT Pro, Gemini Pro, Meta Muse/Spark, Mistral, DeepSeek, etc.
> Written 2026-04-20 for the CEHP rebuild phase.

---

# Cactus Ed's Happiest Place — AI Strategy Consultation

You're being consulted as a creative and strategic partner on rebuilding a weird, ambitious indie platformer. Read the context, then give your sharpest ideas on how to evolve this game into something unignorable.

## The Game in 60 Seconds

**Cactus Ed's Happiest Place (CEHP)** — a 2D browser platformer where you play Ed, a cigarette-smoking cactus navigating surreal institutional worlds (orientation bureau, school, medical pavilion). Wonder Showzen meets Celeste meets a corrupted PBS broadcast. Bureaucratic-absurdist satire.

**Seven-word version**: *Ed is calm. The world is not.*

**Status**: Fully playable. 4 scenes. 3–5 minutes of content. Shipped through 10 iterative "GOAT rounds." We're about to REBUILD with cleaner architecture while honoring what works. Not because the game failed — because it's ready to become what it was always meant to be.

## The Moat (Genuinely Original Mechanics)

1. **Silent 6-axis behavioral tracking.** We invisibly track playstyle across: compliance, intuition, curiosity, grace, chaos, efficiency. No meters visible during play.

2. **Procedural receipts.** At the end of each run, the institution generates a personalized summary of how it "interpreted" your behavior. Mad-libs from ~60 flavor texts. Real examples:
   - *DISRUPTION REPORT: You solved a problem by breaking it. The problem has been archived as resolved.*
   - *UNSCHEDULED INQUIRY: You looked behind the sign. The sign has been coached to feel betrayed.*
   - *NEAR-MISS COMMENDATION: You avoided harm at the last moment. Harm felt ignored.*

3. **Case Seeds.** Every run gets a deterministic shareable ID (e.g. `CASE-20260420-007-CURIOSITY`). Replayable. Postable. Comparable.

4. **Corrupted broadcast aesthetic.** Scanlines, CRT roll, chromatic aberration, per-axis color grading (compliance = sterile blue, chaos = magenta bleed, grace = warm amber). Programmer-art canvas calls that read as *intentional lo-fi broadcast*, not prototype.

5. **Celeste-tier movement.** 11 actions: move, jump, double-jump, triple-jump, wall-slide/jump, punch, kick, spin-dash (3-tier charge), cig-copter (helicopter with lit cigarette), ground-slam, glide.

6. **Procedural everything.** All art is canvas draw calls — no sprite sheets. All audio is Web Audio oscillators — no audio files. Deterministic via Case Seed.

## Creative Bloodline (Do Not Break)

- **Ed's voice**: Deadpan. Max 8 words per line. NEVER uses exclamation marks. Ed is calm. The world is not. That tension is the entire game.
- **Universe**: Counterfeit Educational Universe — authentic-looking institutional broadcast, but slightly off. Signs contradict themselves. Lanyards are suspicious.
- **Cats**: philosophers, not cute — they speak in paradoxes.
- **Rasta Corp**: sincere, not the joke — the only honest institution.
- **Enemies**: safety cones, hall monitors, scantrons, pencils, pills, insurance adjusters — sincere in their corruption.
- **Wonder Showzen texts**: CONSUME / ARE YOU REAL? / BIRTH SCHOOL WORK DEATH
- **The cigarette is central** to Ed's identity — weapon, helicopter, health indicator.
- **NO predatory retention** — no FOMO timers, no loot boxes, no daily streaks.

## Sacred Constraints (Non-Negotiable)

- Single HTML file. No build step. No bundler. No `npm run` to play. Open URL, play.
- ES5 JavaScript only.
- Phaser 3 via CDN. HTML5 Canvas. Web Audio API. localStorage.
- Save compatibility (`cactusEd_save_v1`) must never break silently — migrate or version-bump.
- Behavioral axes stay invisible during play. The receipt is the reveal.

## Open for Reinvention

- Internal code architecture (still single-file, but IIFE modules, section headers, dev-time concat are fair game — current state is 19,835 lines in one file)
- World length (currently 60–90s per world; target 3–5 min each)
- How Ed learns his 11 actions (currently a wall-of-text controls screen → we want diegetic in-world teaching, the institution "training" him)
- Audio depth (currently minimal → we want procedural ambient music responding to behavioral state)
- Death presentation (currently standard respawn → we want a tiny institutional form getting stamped)
- Save schema v2 if warranted
- Number of worlds, themes, new abilities, new mechanics
- Launch / marketing / discovery strategy

## What We Want From You

Give your sharpest thinking on any or all of these, in whatever order matters most:

1. **Breakout strategy.** How do we make this unignorable? Where does virality live — the receipts? Case Seeds? Aesthetic? Something we haven't considered?

2. **Single-file architecture.** Given ES5 / single-HTML / no-build, what's the cleanest way to organize 20k+ lines of game code? IIFE modules, namespace objects, sectioned monolith with clear markers, dev-time concat of multiple files into one?

3. **Diegetic ability teaching.** How does the institution "train" Ed into all 11 actions without breaking character or resorting to tutorial popups?

4. **Behavioral tracking expansion.** 6 axes and 60 flavor texts today. What would 12 axes or 200 texts unlock? When does it get too noisy? Should axes be weighted, pairwise-compared, tiered?

5. **World design.** Worlds 1–3 exist (Ed Wakes Up, Cat Rave, After Dark, Hippie Bus Highway, Mochi HQ). Pitch Worlds 4–6 (or beyond) that expand the institutional satire without repeating beats. Name them, sketch their mechanics, write three lines of Ed-voice signage.

6. **Procedural music.** What does Web-Audio-oscillator ambient music that responds to behavioral state actually *sound* like? Give a reference track, a frequency/filter sketch, or pseudocode.

7. **Audience + discovery.** Who is this game FOR, specifically? Where do they live online? What do they share? How do we reach them without begging for attention?

8. **Content templates.** How do we make authoring a new world take one focused sprint instead of months? What's the minimum authored surface (palette, 6 signs, 3 enemies, 1 mechanic) that still feels unique?

9. **Wildcards.** Anything we haven't asked about that you think is the most important move.

## How to Respond

- Be direct. Be ambitious. Preserve the weirdness that actually matters.
- No generic "you should have a Steam page" advice. We've heard it.
- Concrete beats abstract — example flavor texts, level beats, code structure sketches, specific references all welcome.
- If you think we're wrong about something sacred, say so and make the case.
- Length: whatever it takes. 4000 words of real thinking beats 400 words of hedges.

**Director's energy**: LEGENDARY SPRINT. Match it.
