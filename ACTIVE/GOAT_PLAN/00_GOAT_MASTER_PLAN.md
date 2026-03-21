# GOAT GAME DEVELOPMENT PLAN — 10 Rounds

> **Project**: Cactus Ed's Happiest Place
> **Date**: 2026-03-20
> **Source**: Synthesized from 4 AI brainstorm reports (Mistral, Meta/Llama, DeepSeek, ChatGPT Deep Research)
> **Purpose**: Transform CEHP from impressive prototype into one of the greatest indie browser games ever made

---

## Philosophy

Every round builds on the previous one. The order is designed so that:
1. **Foundation first** — juice, feel, and feedback make the existing game feel 10x better before adding systems
2. **Core loop second** — death, replay, and receipts create the "one more run" engine
3. **Systems third** — progression, adaptation, and sharing create depth and virality
4. **Content last** — expansion systems multiply everything that came before

Each round is a self-contained prompt designed to be handed to a Builder agent (Codex). Each round should result in a testable, improved version of the game.

---

## The 10 Rounds

| Round | Name | Theme | Est. Effort | Key Deliverables |
|---|---|---|---|---|
| **01** | JUICE & FEEL | Make every action feel incredible | 3-4 days | Procedural SFX, hit-stop, screenshake, squash-stretch, landing particles |
| **02** | DEATH & ONBOARDING | Fix the two worst moments | 2-3 days | Death reframing, institutional signage tutorials, cold open, camera lookahead |
| **03** | RECEIPT 2.0 | Make the core reward infinite | 3-4 days | Template engine, archetype titles, near-miss callouts, counterfactuals, receipt stamp |
| **04** | THE REPLAY ENGINE | Create "one more run" energy | 2-3 days | RE-ENROLL/APPEAL buttons, Corrective Action Items, Behavioral Score (F-S), instant restart |
| **05** | SHAREABLE RECEIPT CARD | Turn every player into a marketer | 2-3 days | Canvas receipt card, radar chart, share/download, copy-to-clipboard text version |
| **06** | ABILITY LICENSING | Gate complexity, deepen satire | 3-4 days | Licensed/unlicensed moves, certification acts, auditor spawns for violations |
| **07** | TRAIT FORECLOSURE | The institution reacts to you | 4-5 days | Policy Drift Engine, 2-3 flags per world, institutional memos, world mutations |
| **08** | RETENTION SYSTEMS | Bring players back tomorrow | 3-4 days | Daily Enrollment Challenge, Receipt Cabinet, Department Assignment, Waiver Punchcard |
| **09** | SURPRISE & DELIGHT | Create moments players never forget | 3-4 days | Bureaucratic Softlock, Fourth Wall Receipt, Greeter NPC, Cigarette Goes Out, Compliance Paradox |
| **10** | CONTENT EXPANSION | Multiply everything | 5-7 days | Modular zone templates, behavioral remixes, Case Seed system, The Back Office (World 4) |

---

## Round Dependencies

```
R01 (Juice) ──→ R02 (Death/Onboard) ──→ R03 (Receipt 2.0) ──→ R04 (Replay Engine)
                                                                       │
                                              R05 (Share Card) ←───────┘
                                                     │
                                              R06 (Licensing) ──→ R07 (Trait Foreclosure)
                                                                       │
                                              R08 (Retention) ←────────┘
                                                     │
                                              R09 (Surprise) ──→ R10 (Content Expansion)
```

R01-R04 are strictly sequential (each builds on the last).
R05-R06 can run in parallel after R04.
R07 depends on R06.
R08-R09 can run in parallel after R07.
R10 depends on everything.

---

## Success Metrics Per Round

| Round | How You Know It Worked |
|---|---|
| 01 | Game feels alive. Every action has audio + visual feedback. Movement feels Celeste-quality. |
| 02 | New player can learn all basic controls in 30 seconds without reading anything. Death is funny, not frustrating. |
| 03 | No two receipts are the same. Players laugh at their receipt every time. |
| 04 | 80%+ of players hit "RE-ENROLL" at least once. Average session length doubles. |
| 05 | Receipt cards are being shared. Each card is a self-contained advertisement for the game. |
| 06 | New players aren't overwhelmed. Veteran players feel progression. "Unlicensed" moves create tension. |
| 07 | Players say "the game changed because of how I played." Run #3 feels meaningfully different from run #1. |
| 08 | Players return the next day. Daily challenge creates shared experience. Department identity creates long-term investment. |
| 09 | At least 3 moments per playthrough that make players say "wait, WHAT?" |
| 10 | 30+ minutes of unique content per session. Infinite replayability via seeds + behavioral remixes. |

---

## Sacred Constraints (Never Violate)

These apply to ALL rounds:
- Single HTML file (no build step, no external dependencies beyond Phaser CDN)
- ES5 JavaScript only
- The cigarette is central to Ed's identity and mechanics
- Save compatibility must be preserved (`cactusEd_save_v1`)
- The institutional satire tone must remain consistent
- The behavioral tracking must stay silent (no visible meters)
- Browser-playable (no install, no app store)

---

## File Structure

```
ACTIVE/GOAT_PLAN/
├── 00_GOAT_MASTER_PLAN.md       # This file — the master plan
├── SYNTHESIS.md                  # Cross-AI convergence analysis
├── ROUND_01_JUICE_AND_FEEL.md   # Detailed prompt for Round 1
├── ROUND_02_DEATH_AND_ONBOARDING.md
├── ROUND_03_RECEIPT_2_POINT_0.md
├── ROUND_04_REPLAY_ENGINE.md
├── ROUND_05_SHAREABLE_RECEIPT.md
├── ROUND_06_ABILITY_LICENSING.md
├── ROUND_07_TRAIT_FORECLOSURE.md
├── ROUND_08_RETENTION_SYSTEMS.md
├── ROUND_09_SURPRISE_AND_DELIGHT.md
└── ROUND_10_CONTENT_EXPANSION.md
```

---

## The Vision

After all 10 rounds, Cactus Ed's Happiest Place will be:
- **A game that feels incredible** — every jump, hit, and death is satisfying (R01-R02)
- **A game that's impossible to play once** — the replay loop pulls you back (R03-R04)
- **A game that markets itself** — every receipt is a shareable personality test (R05)
- **A game that teaches without teaching** — institutional signs are funnier than tutorials (R02, R06)
- **A game that watches you** — the world adapts to your behavior in ways that feel alive (R07)
- **A game you come back to daily** — daily challenges create habit loops (R08)
- **A game with moments you remember** — surprise beats that become the stories players tell (R09)
- **A game with infinite content** — modular systems that multiply everything (R10)

The institution doesn't just profile you. It responds. It adapts. It remembers. It judges.

And then it prints your receipt.
