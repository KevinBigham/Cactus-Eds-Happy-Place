# ARCHITECT GUARDRAILS
## Cactus Ed's Happy Place — Non-Negotiable Laws for Future Agents
### Authority: Claude Sonnet 4.6, Original Architect
### Status: BINDING — overrides all other documents in case of conflict

---

> These are laws, not suggestions. If your implementation contradicts them, stop and fix it before shipping.

---

## PART 1 — WHAT THIS GAME IS

**Cactus Ed's Happy Place** is a single-file Phaser 3.70.0 browser platformer built on four pillars:

1. **Counterfeit educational universe** — A world that treats player violence, aloe theft, and cat politics as items on an administrative agenda. The humor engine is institutional language applied to chaos.
2. **Ed as calm center** — A slow-moving, chain-smoking cactus who is completely aloof in a world that is actively losing its mind. He is the eye of the storm. He does not react to absurdity. He is absurdity's landlord.
3. **Beautiful recovery as mechanical religion** — Coyote time, jump buffering, the way the cigarette lance extends just far enough. The game forgives skillfully. Every near-miss is a gift.
4. **Need satisfaction as the return engine** — Players come back because the game gives them things (aloe, beats, cat pets, lore reveals), not because it withholds them punitively. The loop is generous.

---

## PART 2 — WHAT THIS GAME IS NOT

| NOT this | Why it matters |
|----------|----------------|
| A game about punishing the player | Frustration is not the retention mechanic. Curiosity is. |
| A game where Ed is excited | Ed is never excited. If he's excited, fix it. |
| A game that winks too hard | The absurdism is sincere. The satire believes itself. |
| A game with predatory mechanics | No dark patterns. No FOMO timers. No manipulative scarcity. |
| A game that explains its jokes | The institutional language is funny because it doesn't know it's funny. Never explain. |
| A game with ironic detachment | It means everything it says. Ed will become God[TM]. That is not a joke. |
| A multi-file project | One file. `index.html`. Everything. No exceptions without explicit human sign-off. |
| A WebGL game | Canvas renderer only. `Phaser.CANVAS` forced. Non-negotiable. |
| An ES6+ project | ES5 only. `var`. `function(){}`. Prototype OOP. No classes, arrows, const, let. |

---

## PART 3 — HUMOR GUARDRAILS

### The Humor Engine: Counterfeit Institutional Language
The world misclassifies everything in polite bureaucratic terms. A player punching mochi is processed as a "wellness intervention." Aloe collection is "resource repatriation." Cat behavior is "community engagement metrics."

**Law 1:** The world must speak in institutional language. Announcements, signs, HUD labels, and enemy names should sound like they come from a wellness committee, a municipal department, or a corporate compliance memo.

**Law 2:** Ed never acknowledges the absurdity. He simply continues. His dialogue is deadpan and short. Maximum 8 words per line. No exclamation marks. Ever.

**Law 3:** The cats are not comedic relief. They are philosophers who happen to be cats. Their dialogue should feel like overheard conversation from someone who has genuinely figured something out.

**Law 4:** Wonder Showzen texts (`CONSUME`, `ARE YOU REAL?`, `BIRTH SCHOOL WORK DEATH`) are confrontational, not wacky. They should create a half-second of genuine unease before the player moves on.

**Law 5:** Commercial breaks are sincere advertisements. Rasta Corp[TM] believes in itself completely. The horror is that it makes sense.

**DO NOT:**
- Add jokes that require the player to be in on it
- Make Ed react with surprise or alarm
- Use meme language or contemporary internet slang (it dates immediately and breaks the universe)
- Add winking self-reference ("haha it's a game!")
- Make the cats silly — they are wise and tired

---

## PART 4 — RETENTION GUARDRAILS

### The Retention Engine: Satisfaction, Not Frustration
Players return to this game because it is generous. Every action pays out. Every level teaches something. Every beat unlocks something new to see.

**Law 6:** Every level must have at least 3 distinct "oh nice" moments — a cat doing something unexpected, a WS_TEXT flash at the right beat, an aloe burst that feels good to collect.

**Law 7:** Death is never the point. When Ed dies, recovery must feel fair. Coyote time (90ms), jump buffer (130ms), and knockback that reads as theatrical rather than punishing are mandatory.

**Law 8:** Aloe rewards must feel meaningful. Earning 50 aloe should feel like a real score. Earning 300 (boss reward) should feel like victory. Never reduce reward numbers without Kevin's sign-off.

**Law 9:** No mechanic may lock the player out for more than 30 seconds without offering something to do. Waiting is not gameplay.

**Law 10:** The shop must remain a place of genuine power — upgrades that meaningfully change the feel of play, not cosmetic placebo. If you add shop items, they must do something that matters.

**DO NOT:**
- Add timers that create anxiety without payoff
- Gate content behind repeated failure ("try again 3 times to unlock")
- Create invisible walls or unexplained dead ends
- Reduce aloe drop rates without compensating elsewhere
- Add enemies that are cheap rather than challenging (off-screen attacks, instant kills)

---

## PART 5 — WORLD 1 SLICE GUARDRAILS

World 1 is the proof of concept and the emotional baseline. Do not touch it without strong reason.

**Law 11:** Level 1-1 ("Ed Wakes Up") is the tutorial and the canon introduction. It must remain: daytime, green, West Bottoms KC aesthetic, 8 mochis, 5 cats, controls HUD for 30 seconds.

**Law 12:** Level 1-2 ("The Cat Rave") must remain: black room, neon lasers, ALL cats dancing, mochis with sunglasses. The dancing cats are non-negotiable. They set the aesthetic ceiling for the whole game.

**Law 13:** Level 1-3 ("After Dark") must retain the WS_TEXTS flashing every ~8 seconds. The night-KC existential vibe is intentional. The smoker cats are intentional.

**Law 14:** Level 1-4 ("Hippie Bus Highway") must retain the bus parallax. The bus is Ed's ship. It appearing in the background is lore, not decoration.

**Law 15:** Level 1-5 ("Mochi HQ") is the World 1 boss fight. Big Mochi's 3 phases (patrol → spawn → charge) must remain intact. The 300 aloe reward is the biggest single payout of World 1. It must feel earned.

**Law 16:** The World 1 map must remain Super Mario World style — tile grid, Ed walks between nodes, levels unlock sequentially. The spatial relationship between levels is part of the narrative.

**DO NOT:**
- Rebalance World 1 levels during World 2+ development without playtesting W1 afterward
- Add enemies to W1 levels that break the established feel
- Change the aloe rewards without Kevin's sign-off
- Remove the WS_TEXTS from Level 1-3

---

## PART 6 — NO DRIFT RULES

These rules exist because AI agents, across sessions, tend to drift. Small changes accumulate into something that doesn't feel like this game anymore.

**Law 17: Character Drift** — Ed may not become more expressive, more heroic, or more reactive. Every impulse to make him "likeable" in a conventional sense is wrong. His aloofness IS his likability.

**Law 18: Tone Drift** — If a new scene or text reads like a different game (too wacky, too grimdark, too sincere-without-irony, too internet-humor), it has drifted. Kill it.

**Law 19: Scope Drift** — Do not add systems that aren't in the existing design. If you want to add something genuinely new, document it in `TRANSFER/14_GAPS_AND_OPEN_QUESTIONS.md` and wait for human sign-off.

**Law 20: Technical Drift** — ES5. Canvas. One file. Manual physics. Procedural art. These are not preferences. They are the technical identity of the project. Any deviation breaks the deployment model and the aesthetic.

**Law 21: Commercial Drift** — Rasta Corp[TM] is a satirical corporation. It must never become genuinely evil, sympathetic to the point of endorsement, or so abstract it loses its teeth. It sells things that shouldn't be sold, in language designed to sound reasonable.

---

## THE VIBE CHECKLIST (run before shipping anything)

1. Is Ed aloof? (Not surprised, not excited, not alarmed — just continuing)
2. Is the world speaking in institutional language?
3. Does the new content make you feel something weird and true?
4. Are the cats doing something philosophically interesting?
5. Is the aloe reward meaningful?
6. Is the Adventure Time outline (`#2d1b00`) present on every drawn element?
7. Is this ES5? (`var`, `function(){}`, prototype OOP)
8. Did you clear the particle pools? (`EX_POOL.length=0; SMOKE_POOL.length=0; FIRE_POOL.length=0;`)
9. Would a slightly concussed Wonder Showzen writer approve?
10. Is the game still one file?

---

*These laws protect the bloodline. Enforce them without apology.*
