# PROJECT REDISCOVERY AUDIT

> Date: 2026-04-20
> Author: Codex 5.4
> Scope: full authored local workspace inventory plus public GitHub repo comparison
> Local coverage: 216 authored files under `/Users/tkevinbigham/Projects/CEHP` excluding `.git`, `node_modules`, and `.DS_Store`
> Public coverage: 219 tracked files on `main` in `https://github.com/KevinBigham/Cactus-Eds-Happy-Place`

## Executive Summary

- CEHP already contains far more than "an old prototype." It contains a real game runtime, a large design/research corpus, a doctrine layer, a verification layer, and several abandoned side experiments.
- The single most important practical fact is that the repo has split into two truths:
  - Local runtime truth: `ACTIVE/game/index.html` in this workspace, which includes more recent local stability work.
  - Public truth: GitHub `main` plus GitHub Pages, which are behind that local stability work.
- The single most important creative fact is that CEHP's strongest reusable assets are not the exact current structure, but the combination of:
  - movement feel
  - institutional satire voice
  - behavior profiling
  - receipt systems
  - GOAT-plan expansion ideas
  - large archive of exploratory research and abandoned branches
- If CEHP is going to be fully redone, the best move is not to "keep extending the current 19.8k-line file." The best move is to mine this repo as a reference library, salvage the best systems and text banks, and deliberately decide what carries forward into CEHP v2.

## Verified Facts As Of 2026-04-20

### Local workspace

- Repo path: `/Users/tkevinbigham/Projects/CEHP`
- Authored file count: `216`
- Runtime truth: `ACTIVE/game/index.html`
- Runtime size: about `19,835` lines and about `1.4 MB`
- Local verification:
  - `./scripts/verify-cehp.sh` in `ACTIVE/game` passed on `2026-04-20`
  - Result:
    - save contract passed
    - local browser smoke passed
    - title boot = `Title`
    - `?certAid=w2` = `World2`
    - `?certAid=w3` = `World3`
    - seeded achievements path passed

### Public GitHub repo

- Repo: `https://github.com/KevinBigham/Cactus-Eds-Happy-Place`
- Default branch: `main`
- Public tracked file count: `219`
- Latest public commit inspected: `e4d440933d74075495adf8275af37ef7cd75c86e`
- Latest public commit date: `2026-03-21T18:21:06Z`
- Latest public commit subject: `fix: harden transition system - remove aggressive isActive check, add safety timeout`

### Public GitHub Pages

- Live URL tested: `https://kevinbigham.github.io/Cactus-Eds-Happy-Place`
- Live smoke check run on `2026-04-20`:
  - `CEHP_BASE_URL='https://kevinbigham.github.io/Cactus-Eds-Happy-Place' node tests/cehp_boot_smoke.mjs`
  - failed on plain `/index.html`
  - exact runtime error:
    - `Cannot read properties of null (reading 'type')`
- This matches the old boot-time `GAME_INSTANCE.renderer.type` issue that the local Builder stability patch explicitly fixed.

### Local vs public delta

- Public GitHub `main` and GitHub Pages still contain the old global boot line:
  - `var IS_WEBGL = (GAME_INSTANCE.renderer.type === Phaser.WEBGL);`
- Local workspace contains the hardened version:
  - `var IS_WEBGL = !!(GAME_INSTANCE && GAME_INSTANCE.renderer && GAME_INSTANCE.renderer.type === Phaser.WEBGL);`
  - plus per-scene refreshes of `IS_WEBGL`
  - plus `cactusEd_title_seen_v1` cold-open gating
- Conclusion:
  - the public repo and live deploy are not fully synchronized with the local workspace, despite multiple docs claiming they are

## What CEHP Already Built

## Runtime / game systems

These are implemented in the local `ACTIVE/game/index.html` and are the strongest direct code salvage targets:

- Save/load contract under `cactusEd_save_v1`
- Gamepad input manager
- Assist mode switches
- Performance scaler
- Animated UI helpers (`ANIM_UI`)
- Ambient lighting system (`AMBIENT_LIGHT`)
- Environmental overlays (`ENV_FX`)
- Color grading system (`COLOR_GRADE`)
- Broadcast signal meta-system (`BROADCAST_STATE`)
- Themed transition system (`TRANSITIONS`)
- Procedural receipt system
- Behavioral grading and corrective action logic
- Policy / trait foreclosure system
- Retention systems:
  - daily challenge
  - receipt cabinet
  - department assignment
  - waiver punchcard
  - behavioral drift tracking
- Surprise systems:
  - fourth-wall receipts
  - greeter NPC payoff
  - blank receipt for extreme compliance
  - clerical error jackpot
- Content expansion systems:
  - case seeds
  - mood rotations
  - remix labels
- Strong movement model with:
  - coyote time
  - jump buffer
  - wall slide / wall jump
  - spin dash
  - cig copter
  - glide
  - ground slam
- Large procedural drawing surface for Ed, bosses, enemies, cats, props, and effects
- Protected readable-path teaching and hint surfaces
- Certification-aid query param system

## Design / planning systems

These are not code, but they are valuable design salvage:

- The full 10-round GOAT plan in `ACTIVE/GOAT_PLAN/`
- Cross-model synthesis of ideas in `ACTIVE/GOAT_PLAN/SYNTHESIS.md`
- Bloodline / tone doctrine in `ACTIVE/knowledge/overflow/supporting-doctrine/DO_NOT_BREAK.md`
- Repo-local GOAT doctrine in `ACTIVE/knowledge/overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`
- A large archive of cross-AI research artifacts under `ARCHIVE/legacy/quarantine/ai-artifacts/` and `docs-archive/briefings/`

## Process / operating systems

These were built to coordinate multi-agent work. They are useful as reference, but probably should not be copied wholesale into a CEHP v2 unless you explicitly want that process overhead again:

- task beacon system (`NEXT_TASK.md`)
- durable memory layer in `.codex/CEHP/`
- studio kernel docs
- dashboard / self-healing / autonomous task systems
- protocol hardening and role-gating archive

## What Matters Most For A Redo

If CEHP is reimagined from scratch, preserve these in order:

1. Tone and soul
   - institutional language as the humor engine
   - Ed as calm deadpan center
   - cigarette centrality
2. Mechanical gold
   - movement feel
   - strong input forgiveness
   - readable player feedback
3. Signature system
   - behavior tracking feeding procedural receipts
4. Modular content ideas
   - GOAT-plan rounds 01-10
   - world reaction systems
   - shareable receipt framing
5. Reusable content banks
   - text banks
   - copy fragments
   - archived prompts and research

## What To Treat As Reference Only

- stale certification docs that still think the project is stuck on CEHP-010
- process-heavy docs whose main value was operational discipline, not game design
- archive branches that explore combat or racing unless CEHP v2 intentionally wants them
- claims in docs that the live site is fully up to date

## Confidence Map

### High confidence / trust first

- `ACTIVE/game/index.html`
- `ACTIVE/game/scripts/check_save_schema.js`
- `ACTIVE/game/scripts/verify-cehp.sh`
- `ACTIVE/game/tests/cehp_boot_smoke.mjs`
- `ACTIVE/GOAT_PLAN/*`
- `ACTIVE/knowledge/overflow/supporting-doctrine/DO_NOT_BREAK.md`
- `ACTIVE/knowledge/overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`
- this audit

### Medium confidence / useful but mixed

- `README_Instructions on What To Do.md`
- `.codex/CEHP/status.md`
- `.codex/CEHP/handoff.md`
- `.codex/CEHP/changelog.md`

### Low confidence / stale or historically important only

- `ACTIVE/docs/CURRENT_PASS.md`
- `ACTIVE/docs/HANDOFF.md`
- `ACTIVE/docs/BACKLOG.md`
- `ACTIVE/docs/STUDIO_DASHBOARD.md`
- most of `ARCHIVE/legacy/quarantine/docs-archive/`

## Recommended CEHP v2 Strategy

### Recommended architecture decision

Do not use the current `ACTIVE/game/index.html` as the direct development surface for a full rethink.

Instead:

1. Freeze legacy CEHP as the reference build.
2. Extract the salvageable pieces:
   - movement constants and feel rules
   - behavior and receipt concepts
   - institutional voice and text banks
   - GOAT round ideas
   - best scene-level mechanics
3. Write a clean CEHP v2 product brief before coding.
4. Decide explicitly whether CEHP v2 keeps:
   - single-file runtime
   - zero build step
   - Phaser
5. Build one new vertical slice intentionally, instead of dragging the old file forward.

### Best reuse lanes

- Best mechanics to port directly:
  - movement feel
  - hint escalation
  - save schema discipline
  - receipt framework
- Best design systems to reinterpret:
  - licensing
  - policy drift
  - daily challenge
  - shareable receipts
- Best content sources to mine:
  - GOAT plan docs
  - world1 text extraction archive
  - AI research artifacts
  - archived runtime backups for old ideas that were later cut

### Probably not worth carrying forward unchanged

- current process sprawl
- dashboard and protocol machinery
- every single legacy scene structure
- abandoned racing branch
- combat engine, unless CEHP v2 truly wants deterministic fighting-game-grade subsystems

## GitHub Comparison

### Files present locally and publicly

- Almost the entire authored repo overlaps between local and GitHub `main`.

### Local-only file

- `AGENTS.md`
  - local Codex-facing durable project instructions
  - functionally paired with root `CLAUDE.md`

### Public-only files

- `00_HANDOFF_FROM_CLAUDE_CODE.md`
  - executive handoff snapshot from 2026-03-20
- `GAME_REVIEW_AND_GOAT_PLAN.md`
  - high-level review of the game's strengths/weaknesses and leverage points
- `GOAT_GAME_BRAINSTORM_PROMPT.md`
  - the large research prompt that generated many GOAT ideas
- `ACTIVE/game/package-lock.json`
  - npm lockfile for Playwright tooling

## How To Use This Repo To Help Build The Next Version

### Use as a soul bank

Read these first if you want to preserve what makes CEHP feel like CEHP:

- `ACTIVE/knowledge/overflow/supporting-doctrine/DO_NOT_BREAK.md`
- `ACTIVE/knowledge/overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md`
- `ACTIVE/GOAT_PLAN/SYNTHESIS.md`
- `ACTIVE/GOAT_PLAN/00_GOAT_MASTER_PLAN.md`

### Use as a mechanics bank

Read these if you want to preserve feel and runtime craft:

- `ACTIVE/game/index.html`
- `ACTIVE/game/scripts/check_save_schema.js`
- `ACTIVE/game/tests/cehp_boot_smoke.mjs`

### Use as a content bank

Read these if you want reusable text, copy style, and authored world material:

- `ARCHIVE/src/world1/text/world1_broadcast_copy.js`
- `ARCHIVE/src/world1/text/world1_overlay_labels.js`
- `ARCHIVE/src/world1/text/world1_receipt_templates.js`
- `ARCHIVE/legacy/quarantine/ai-artifacts/chat gpt response research.md`
- `GAME_REVIEW_AND_GOAT_PLAN.md` on GitHub

### Use as a history bank

Read these if you want to understand why the project evolved the way it did:

- `.codex/CEHP/changelog.md`
- `ACTIVE/docs/SPRINT_LOG.md`
- `ARCHIVE/legacy/quarantine/docs-archive/HANDOFF.md`
- `ARCHIVE/protocol/PROTOCOL_AUDIT.md`

## File Inventory

This is the per-file authored inventory. `ACTIVE/game/node_modules/**` exists locally as third-party vendor code for Playwright and was intentionally excluded from the authored inventory because it is dependency output, not project-authored source.

### Root and metadata files

- `.gitignore` - local ignore rules for macOS and Playwright artifacts
- `AGENTS.md` - local Codex durable instructions
- `CLAUDE.md` - Claude durable instructions
- `README_Instructions on What To Do.md` - living project guide

### Public-only top-level files on GitHub

- `00_HANDOFF_FROM_CLAUDE_CODE.md` - executive handoff snapshot
- `GAME_REVIEW_AND_GOAT_PLAN.md` - broad game review and leverage analysis
- `GOAT_GAME_BRAINSTORM_PROMPT.md` - source brainstorm prompt for external AI ideation

### Durable memory: `.codex/CEHP`

- `.codex/CEHP/agent.md` - long-term project identity and roster memory
- `.codex/CEHP/changelog.md` - chronological durable change log
- `.codex/CEHP/decisions.md` - short decision ledger
- `.codex/CEHP/handoff.md` - what just happened and what should happen next
- `.codex/CEHP/open_questions.md` - unresolved project questions
- `.codex/CEHP/plan.md` - older ordered TODO plan
- `.codex/CEHP/runbook.md` - run/verify cheat sheet
- `.codex/CEHP/status.md` - current compact state

### GitHub / deployment

- `.github/workflows/static.yml` - GitHub Pages deploy workflow from `ACTIVE/game`

### Active GOAT plan docs

- `ACTIVE/GOAT_PLAN/00_GOAT_MASTER_PLAN.md` - master 10-round roadmap
- `ACTIVE/GOAT_PLAN/ROUND_01_JUICE_AND_FEEL.md` - procedural audio, hit-stop, shake, stretch
- `ACTIVE/GOAT_PLAN/ROUND_02_DEATH_AND_ONBOARDING.md` - death framing, signage tutorials, cold open
- `ACTIVE/GOAT_PLAN/ROUND_03_RECEIPT_2_POINT_0.md` - procedural receipts and better receipt identity
- `ACTIVE/GOAT_PLAN/ROUND_04_REPLAY_ENGINE.md` - replay loop and corrective action framing
- `ACTIVE/GOAT_PLAN/ROUND_05_SHAREABLE_RECEIPT.md` - social receipt card system
- `ACTIVE/GOAT_PLAN/ROUND_06_ABILITY_LICENSING.md` - gating moves through satire
- `ACTIVE/GOAT_PLAN/ROUND_07_TRAIT_FORECLOSURE.md` - world changes based on behavior
- `ACTIVE/GOAT_PLAN/ROUND_08_RETENTION_SYSTEMS.md` - cabinet, daily challenge, department identity
- `ACTIVE/GOAT_PLAN/ROUND_09_SURPRISE_AND_DELIGHT.md` - memorable beats and meta surprises
- `ACTIVE/GOAT_PLAN/ROUND_10_CONTENT_EXPANSION.md` - modular content scaling and World 4 ideas
- `ACTIVE/GOAT_PLAN/SYNTHESIS.md` - convergence analysis across multiple AIs

### Active docs

- `ACTIVE/docs/AGENTS.md` - active repo operating system and role discipline
- `ACTIVE/docs/ARCHITECT_PACKET.md` - older architect briefing packet
- `ACTIVE/docs/BACKLOG.md` - stale certification-era backlog
- `ACTIVE/docs/CLAUDE.md` - thin adapter for Claude agents
- `ACTIVE/docs/CURRENT_PASS.md` - stale pass snapshot
- `ACTIVE/docs/HANDOFF.md` - older per-agent handoff document
- `ACTIVE/docs/HEALTH_TREND.md` - health-score trend tracker
- `ACTIVE/docs/KNOWN_ISSUES.md` - certification and presentation issues log
- `ACTIVE/docs/NEXT_TASK.md` - current task beacon, currently open/no active task
- `ACTIVE/docs/PLAYTEST_LOG.md` - human playtest notes
- `ACTIVE/docs/PROJECT_REDISCOVERY_AUDIT.md` - this audit
- `ACTIVE/docs/PROPOSED_NEXT_TASK.md` - proposal lane for non-active agents
- `ACTIVE/docs/PUBLIC_README.md` - public-facing repo summary copy
- `ACTIVE/docs/REQUESTED_INPUTS.md` - questions needing Kevin input
- `ACTIVE/docs/SPRINT_LOG.md` - sprint history
- `ACTIVE/docs/STUDIO_DASHBOARD.md` - read-only mission-control summary
- `ACTIVE/docs/scan-results.md` - captured output of the studio scan
- `ACTIVE/docs/CLAUDE_CODE_REDO_HANDOFF.json` - structured redo handoff for the next Claude Code session
- `ACTIVE/docs/CLAUDE_CODE_REDO_PROMPT.json` - copy-paste prompt JSON for the next Claude Code session

### Active game files

- `ACTIVE/game/art/.gitkeep` - placeholder art directory
- `ACTIVE/game/audio/.gitkeep` - placeholder audio directory
- `ACTIVE/game/content/.gitkeep` - placeholder content directory
- `ACTIVE/game/index.html` - the full CEHP runtime
- `ACTIVE/game/package.json` - Playwright tooling package manifest
- `ACTIVE/game/scripts/check_save_schema.js` - save-contract validator
- `ACTIVE/game/scripts/studio-scan.sh` - read-only repository scan
- `ACTIVE/game/scripts/verify-cehp.sh` - canonical verify wrapper
- `ACTIVE/game/tests/.gitkeep` - placeholder tests directory marker
- `ACTIVE/game/tests/cehp_boot_smoke.mjs` - browser smoke test
- `ACTIVE/game/ui/.gitkeep` - placeholder UI directory

### Active knowledge: studio kernel

- `ACTIVE/knowledge/STUDIO_KERNEL/BOOT_SEQUENCE.md` - shared multi-repo boot order
- `ACTIVE/knowledge/STUDIO_KERNEL/agent_protocol.md` - cross-repo role protocol
- `ACTIVE/knowledge/STUDIO_KERNEL/architecture_patterns.md` - reusable repo patterns
- `ACTIVE/knowledge/STUDIO_KERNEL/bug_patterns.md` - bug-pattern notebook
- `ACTIVE/knowledge/STUDIO_KERNEL/dev_playbook.md` - implementation habits
- `ACTIVE/knowledge/STUDIO_KERNEL/game_design_principles.md` - player-experience doctrine
- `ACTIVE/knowledge/STUDIO_KERNEL/lessons_learned.md` - cross-project lessons
- `ACTIVE/knowledge/STUDIO_KERNEL/studio_rules.md` - universal studio rules

### Active knowledge: docs skills

- `ACTIVE/knowledge/docs_skills/ACTIVE_WORKING_SET.md` - canonical read-order map
- `ACTIVE/knowledge/docs_skills/skills/first-session-certification/SKILL.md` - repo-local certification workflow draft

### Active knowledge: reference docs

- `ACTIVE/knowledge/overflow/reference-docs/CERTIFICATION_EVIDENCE.md` - manual evidence ledger
- `ACTIVE/knowledge/overflow/reference-docs/DECISIONS.md` - older decision record
- `ACTIVE/knowledge/overflow/reference-docs/DOCS.md` - doc-truth map
- `ACTIVE/knowledge/overflow/reference-docs/FIRST_SESSION_REGRESSION_CHECKLIST.md` - certification regression checklist
- `ACTIVE/knowledge/overflow/reference-docs/IMPLEMENT.md` - implementation runbook
- `ACTIVE/knowledge/overflow/reference-docs/PLAN.md` - roadmap snapshot
- `ACTIVE/knowledge/overflow/reference-docs/RELEASE_CHECKLIST.md` - release rules
- `ACTIVE/knowledge/overflow/reference-docs/REPO_MAP.md` - structure overview
- `ACTIVE/knowledge/overflow/reference-docs/SPEC.md` - runtime/save contract summary
- `ACTIVE/knowledge/overflow/reference-docs/VERIFY.md` - verification commands and expectations

### Active knowledge: supporting doctrine

- `ACTIVE/knowledge/overflow/supporting-doctrine/CACTUS_ED_GOAT_GUIDE.md` - current doctrine summary
- `ACTIVE/knowledge/overflow/supporting-doctrine/DO_NOT_BREAK.md` - permanent bloodline protection document

### Archive: root archived docs

- `ARCHIVE/000 - AI PORTFOLIO START HERE.md` - older portfolio-level router
- `ARCHIVE/00_START_HERE.md` - older front door
- `ARCHIVE/CEHP - 000 - FOREVER INSTRUCTIONS - START HERE.md` - previous forever-instructions entry point
- `ARCHIVE/CEHP_Studio_Systems_Report.docx` - one-off Word report
- `ARCHIVE/NEXT_TASK.md.backup-proto001` - task beacon backup
- `ARCHIVE/README.md` - archive usage rules

### Archive: autonomous task system

- `ARCHIVE/auto_tasks/AUTO_TASK_TEMPLATE.md` - task template
- `ARCHIVE/auto_tasks/DISCOVERED/AT-001-index-exceeds-16k-lines.md` - modularization discovery
- `ARCHIVE/auto_tasks/DISCOVERED/AT-002-zero-test-coverage.md` - testing gap discovery
- `ARCHIVE/auto_tasks/DISCOVERED/AT-003-no-audio-assets.md` - audio gap discovery
- `ARCHIVE/auto_tasks/DISCOVERED/AT-004-achievement-system-skeleton.md` - achievement-system discovery
- `ARCHIVE/auto_tasks/DISCOVERED/AT-005-boss-no-legs-presentation.md` - boss-presentation discovery
- `ARCHIVE/auto_tasks/DISCOVERED/AT-006-mobile-touch-controls.md` - mobile-support discovery
- `ARCHIVE/auto_tasks/README.md` - autonomous task system rules

### Archive: AI artifacts

- `ARCHIVE/legacy/quarantine/ai-artifacts/Codex response.rtf` - archived Codex research output
- `ARCHIVE/legacy/quarantine/ai-artifacts/Gemini response.txt` - archived Gemini audit output
- `ARCHIVE/legacy/quarantine/ai-artifacts/Meta's Results and Convo.txt` - archived Meta/Llama ideation output
- `ARCHIVE/legacy/quarantine/ai-artifacts/Mistral's Results and Convo.txt` - archived Mistral ideation output
- `ARCHIVE/legacy/quarantine/ai-artifacts/chat gpt response research.md` - high-value deep research report

### Archive: combat experiment

- `ARCHIVE/legacy/quarantine/combat/index.js` - combat namespace bootstrap
- `ARCHIVE/legacy/quarantine/combat/api/CombatEngine.js` - combat engine API facade
- `ARCHIVE/legacy/quarantine/combat/adapters/phaser/FightShellAdapter.js` - Phaser-facing adapter
- `ARCHIVE/legacy/quarantine/combat/core/constants.js` - combat constants
- `ARCHIVE/legacy/quarantine/combat/core/consequence/helpers.js` - consequence helpers
- `ARCHIVE/legacy/quarantine/combat/core/exchange/bridge.js` - exchange resolution bridge
- `ARCHIVE/legacy/quarantine/combat/core/fighter/tick.js` - fighter tick/update logic
- `ARCHIVE/legacy/quarantine/combat/core/hitstop/bridge.js` - hitstop bridge
- `ARCHIVE/legacy/quarantine/combat/core/input/chargeParser.js` - charge input parser
- `ARCHIVE/legacy/quarantine/combat/core/input/historyBuffer.js` - input history buffer
- `ARCHIVE/legacy/quarantine/combat/core/input/motionParser.js` - motion parser
- `ARCHIVE/legacy/quarantine/combat/core/input/socd.js` - SOCD handling
- `ARCHIVE/legacy/quarantine/combat/core/move/bridge.js` - move bridge
- `ARCHIVE/legacy/quarantine/combat/core/sim/step.js` - largest combat sim step implementation
- `ARCHIVE/legacy/quarantine/combat/core/spatial/geometry.js` - geometry helpers
- `ARCHIVE/legacy/quarantine/combat/core/strike/bridge.js` - strike bridge
- `ARCHIVE/legacy/quarantine/combat/core/throw/bridge.js` - throw bridge
- `ARCHIVE/legacy/quarantine/combat/core/world/createFighter.js` - fighter factory
- `ARCHIVE/legacy/quarantine/combat/core/world/createWorld.js` - world factory
- `ARCHIVE/legacy/quarantine/combat/core/world/hash.js` - deterministic state hashing
- `ARCHIVE/legacy/quarantine/combat/core/world/lifecycle.js` - lifecycle helpers
- `ARCHIVE/legacy/quarantine/combat/core/world/resetRound.js` - round reset logic
- `ARCHIVE/legacy/quarantine/combat/core/world/snapshot.js` - snapshot/restore support
- `ARCHIVE/legacy/quarantine/combat/data/fighters/daikon.visual.js` - daikon fighter visuals
- `ARCHIVE/legacy/quarantine/combat/data/fighters/ed.visual.js` - Ed fighter visuals
- `ARCHIVE/legacy/quarantine/combat/data/stages/tournamentFlat.visual.js` - flat stage visual config
- `ARCHIVE/legacy/quarantine/combat/presentation/animPlayer.js` - animation playback
- `ARCHIVE/legacy/quarantine/combat/presentation/fighterRenderer.js` - fighter rendering
- `ARCHIVE/legacy/quarantine/combat/presentation/fighterRig.js` - fighter rig
- `ARCHIVE/legacy/quarantine/combat/presentation/fxRenderer.js` - combat FX renderer
- `ARCHIVE/legacy/quarantine/combat/presentation/poseLibrary.js` - pose library
- `ARCHIVE/legacy/quarantine/combat/presentation/stageRenderer.js` - stage renderer
- `ARCHIVE/legacy/quarantine/combat/tools/determinism/runDeterminism.js` - determinism and parity audit tool

### Archive: older docs archive

- `ARCHIVE/legacy/quarantine/docs-archive/README.md` - rules for using the old docs archive
- `ARCHIVE/legacy/quarantine/docs-archive/HANDOFF.md` - large historical handoff bible
- `ARCHIVE/legacy/quarantine/docs-archive/CODEX R2.rtf` - older Codex doc export
- `ARCHIVE/legacy/quarantine/docs-archive/GEMINI R2 - v1.rtf` - older Gemini doc export
- `ARCHIVE/legacy/quarantine/docs-archive/Gemini r2 -v2.txt` - Gemini R2 text export
- `ARCHIVE/legacy/quarantine/docs-archive/Mistral R2.rtf` - Mistral R2 export
- `ARCHIVE/legacy/quarantine/docs-archive/chat gpt r2.md` - ChatGPT R2 research report
- `ARCHIVE/legacy/quarantine/docs-archive/deepseek r2.rtf` - DeepSeek R2 export
- `ARCHIVE/legacy/quarantine/docs-archive/meta r2.rtf` - Meta R2 export
- `ARCHIVE/legacy/quarantine/docs-archive/index (1).html` - older runtime snapshot

### Archive: transfer pack

- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/00_START_HERE.md` - old transfer start doc
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/10_ARCHITECT_GUARDRAILS.md` - architect guardrails
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/11_DRIFT_WARNINGS_AND_KILL_SWITCHES.md` - drift warning pack
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/12_FIRST_10_DECISIONS_FOR_NEW_REPO.md` - first-10-decisions doc
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/13_SOURCE_OF_TRUTH_ORDER.md` - source-of-truth rules
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/14_GAPS_AND_OPEN_QUESTIONS.md` - open gaps doc
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/15_RUNTIME_CANON_DECISION.md` - runtime canon decision
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/16_COMBAT_RACING_STATUS_DECISION.md` - combat/racing status decision
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/17_ARCHITECTURAL_NORMALIZATION.md` - architecture normalization
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/bootstrap_context.json` - structured bootstrap context
- `ARCHIVE/legacy/quarantine/docs-archive/TRANSFER/migration_manifest.json` - structured migration manifest

### Archive: analysis docs

- `ARCHIVE/legacy/quarantine/docs-archive/analysis/ARCHITECT_IMPLEMENTATION_CLEARANCE.md` - architect clearance analysis
- `ARCHIVE/legacy/quarantine/docs-archive/analysis/ARCHITECT_REVIEW.md` - architect review

### Archive: model briefings

- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_CHATGPT.md` - ChatGPT briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_CHATGPT_R2.md` - ChatGPT R2 briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_CLAUDE_CODE_FIGHT_ENGINE_PRESENTATION.md` - Claude combat presentation briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_CODEX.md` - Codex briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_CODEX_R2.md` - Codex R2 briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_DEEPSEEK.md` - DeepSeek briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_GEMINI.md` - Gemini briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_GEMINI_R2.md` - Gemini R2 briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_META_AI.md` - Meta AI briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_META_R2.md` - Meta R2 briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_MISTRAL.md` - Mistral briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/BRIEFING_MISTRAL_R2.md` - Mistral R2 briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/CACTUS_ED_AI_GAMEPLAN.md` - AI game plan briefing
- `ARCHIVE/legacy/quarantine/docs-archive/briefings/NOTE_TO_CHATGPT54_COLLAB_PLAN.md` - tri-AI collaboration plan

### Archive: migration docs

- `ARCHIVE/legacy/quarantine/docs-archive/migration/GITHUB_TRANSFER_FILE_LIST.md` - transfer file list
- `ARCHIVE/legacy/quarantine/docs-archive/migration/MIGRATION_LOG.md` - migration log
- `ARCHIVE/legacy/quarantine/docs-archive/migration/NEW_REPO_STRUCTURE_MAP.md` - new structure map
- `ARCHIVE/legacy/quarantine/docs-archive/migration/UPDATE_LOG.md` - update log

### Archive: prompts

- `ARCHIVE/legacy/quarantine/docs-archive/prompts/CLAUDE_CODE_GITHUB_PUSH_PROMPT.md` - archived GitHub push prompt
- `ARCHIVE/legacy/quarantine/docs-archive/prompts/CODEX_CONTINUATION_PROMPT.md` - archived Codex continuation prompt

### Archive: reviews

- `ARCHIVE/legacy/quarantine/docs-archive/reviews/FINAL_SLICE1_MERGE_AUDIT.md` - slice-merge audit
- `ARCHIVE/legacy/quarantine/docs-archive/reviews/PR_CONFLICT_REVIEW_RESULT.md` - PR conflict review result
- `ARCHIVE/legacy/quarantine/docs-archive/reviews/WORLD1_IMPLEMENTATION_LANE.md` - world1 implementation lane
- `ARCHIVE/legacy/quarantine/docs-archive/reviews/WORLD1_SLICE1_CHANGELOG.md` - slice1 changelog
- `ARCHIVE/legacy/quarantine/docs-archive/reviews/WORLD1_SLICE1_REVIEW_CRITERIA.md` - slice1 review criteria
- `ARCHIVE/legacy/quarantine/docs-archive/reviews/WORLD1_SLICE1_REVIEW_RESULT.md` - slice1 review result
- `ARCHIVE/legacy/quarantine/docs-archive/reviews/WORLD1_SLICE2_CHANGELOG.md` - slice2 changelog
- `ARCHIVE/legacy/quarantine/docs-archive/reviews/WORLD1_SLICE2_CONTRACT.md` - slice2 contract

### Archive: old state docs

- `ARCHIVE/legacy/quarantine/docs-archive/handoffs/HANDOFF_BIBLE.md` - older handoff bible
- `ARCHIVE/legacy/quarantine/docs-archive/state/GAME_STATE.md` - old game-state snapshot

### Archive: racing branch

- `ARCHIVE/legacy/quarantine/racing/cehp_racing_goat.html` - racing-focused CEHP variant
- `ARCHIVE/legacy/quarantine/racing/cehp_racing_only.html` - larger racing-only runtime experiment

### Archive: runtime backups

- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-bureaucratic-trust-certification.2026-03-13.html` - backup before bureaucratic trust certification work
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-easy-play-publish-prep.2026-03-13.html` - backup before easy-play publish prep
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-first-session-certification.2026-03-13.html` - backup before first-session certification
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-goat-hand-feel-fairness-rule-confirmation.2026-03-13.html` - backup before feel/fairness confirmation
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-goat-trust-flow-boss-anticipation.2026-03-13.html` - backup before trust-flow/boss anticipation work
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-human-certification-readability.2026-03-13.html` - backup before readability pass
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-manual-certification-aid.2026-03-13.html` - backup before manual cert-aid work
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-repo-memory-certification-workflow.2026-03-13.html` - backup before repo-memory workflow work
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-repo-self-containment-living-memory-truth.2026-03-13.html` - backup before self-containment truth pass
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-stage-closure-manual-handoff.2026-03-13.html` - backup before manual handoff pass
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-true-first-session-continuity-certification.2026-03-13.html` - backup before continuity certification
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-true-human-continuity-certification.2026-03-13.html` - backup before human continuity certification
- `ARCHIVE/legacy/quarantine/runtime-backups/index.pre-world2-world3-continuity-completion.2026-03-13.html` - backup before W2/W3 continuity completion

### Archive: runtime variants and scratch

- `ARCHIVE/legacy/quarantine/runtime-variants/developer version.html` - developer runtime variant
- `ARCHIVE/legacy/quarantine/runtime-variants/index (2).html` - alternate runtime variant
- `ARCHIVE/legacy/quarantine/scratch/errors claude code noticed 3:4 8:11pm.ipynb` - notebook of noticed errors

### Archive: old scripts

- `ARCHIVE/legacy/quarantine/scripts-archive/check_rasta_corp_boss.js` - archived boss-check script
- `ARCHIVE/legacy/quarantine/scripts-archive/check_world1_slice1_surface.js` - archived surface-check script
- `ARCHIVE/legacy/quarantine/scripts-archive/check_world1_slice2_text_surface.js` - archived text-surface-check script

### Archive: protocol pack

- `ARCHIVE/protocol/PROTOCOL_AUDIT.md` - hardened protocol audit log
- `ARCHIVE/protocol/PROTOCOL_TEST_ARTIFACT.md` - protocol test artifact
- `ARCHIVE/protocol/README.md` - protocol pointer map
- `ARCHIVE/protocol/STUDIO_WIDE_VERDICT.md` - cross-repo protocol verdict

### Archive: self-healing pack

- `ARCHIVE/self_healing/AUTO_FIX_LOG.md` - auto-fix log
- `ARCHIVE/self_healing/HEALING_RULES.md` - self-healing rules
- `ARCHIVE/self_healing/README.md` - self-healing overview
- `ARCHIVE/self_healing/SCAN_PROTOCOL.md` - scan protocol

### Archive: world1 modularization attempt

- `ARCHIVE/src/world1/.gitkeep` - placeholder marker
- `ARCHIVE/src/world1/constants/runtime_surface.js` - extracted runtime constants/surface map
- `ARCHIVE/src/world1/text/world1_broadcast_copy.js` - extracted world1 broadcast copy
- `ARCHIVE/src/world1/text/world1_map_labels.js` - extracted world1 map labels
- `ARCHIVE/src/world1/text/world1_overlay_labels.js` - extracted world1 overlay/cat dialogue bank
- `ARCHIVE/src/world1/text/world1_receipt_templates.js` - extracted world1 receipt/ad template bank

### Archive: empty placeholders

- `ARCHIVE/telemetry/.gitkeep` - telemetry placeholder
- `ARCHIVE/tools/.gitkeep` - tools placeholder

## Bottom Line

CEHP is not a dead end. It is a crowded attic full of excellent materials.

For a redo:

- keep the soul
- keep the feel
- keep the receipt/behavior identity
- keep the best text banks and GOAT ideas
- discard stale certainty
- start the new version intentionally

