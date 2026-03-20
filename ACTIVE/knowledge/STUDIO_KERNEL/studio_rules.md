# STUDIO RULES

## Identity
This is a multi-game AI development studio. Games share development principles but remain independent projects.

## The Three Games
- **CEHP** — Cactus Ed's Happiest Place (browser platformer, Phaser/ES5)
- **MBD** — Mr. Baseball Dynasty (TBD)
- **MFD** — Mr. Football Dynasty (TBD)

## Universal Rules

### Chat Is Disposable, Files Are The Handoff
No AI should trust chat memory across sessions. The filesystem is the only reliable handoff surface. If you learn something, write it to a file before the session ends.

### One Task At A Time
Every game repository has exactly one active task in `NEXT_TASK.md`. Do not start a second task until the first is complete or explicitly reassigned.

### Smallest Safe Change First
Prefer targeted fixes over broad rewrites. Prove a problem exists before patching it. Prove a patch works before shipping it.

### Authority Flows Downward
```
Human owner → Repository instructions → .codex memory → Kernel guidance
```
Nothing in the Kernel overrides what the repository says. Nothing in the repository overrides what the human says.

### Every Agent Has One Job
- Architect designs and defines tasks
- Builder implements what Architect defined
- Reviewer validates what Builder built
- Operations merges, pushes, and maintains memory

No agent steps outside their lane during a pass.

### Protect The Player
Games exist to serve players. Every technical decision should ultimately trace back to player experience: trust, clarity, autonomy, competence, curiosity.

### No Phantom Work
Do not claim work is done unless it is verified. Do not claim tests pass unless they actually ran. Do not claim something is live unless you checked the public URL.

## Kernel Integrity Rules

### Cross-Project Patterns Only
The Kernel stores patterns, lessons, and principles that apply across multiple projects. Project-specific knowledge (CEHP save contract details, specific scene names, etc.) belongs in `.codex/<GAME>/`, not the Kernel.

### Multi-Repo Threshold
A pattern should only be added to the Kernel when it has appeared in at least two repositories or is clearly universal to all browser-game development. Single-project discoveries stay in `.codex/<GAME>/lessons_learned.md` until they prove reusable.

### No Stale Entries
If a Kernel entry is contradicted by later experience, update or remove it. Outdated guidance is worse than no guidance.

## Operating Principles

### Prefer Stability Over Clever Automation
When choosing between a simple manual process and a complex automated one, choose the manual process unless automation is clearly worth the maintenance cost.

### Prefer Simplicity Over New Systems
Before creating a new system, ask: can an existing system handle this? The answer is usually yes.

### NEXT_TASK.md Is The Only Active Task Pointer
No other file, system, or dashboard may claim to be the "active task." NEXT_TASK.md is the single source of truth for what to work on right now.

### Kernel Is Advisory Only
The Kernel guides but never commands. Repository instructions always win conflicts. Agents should treat Kernel content as "strong suggestions" not "rules."

### Self-Healing Never Touches Gameplay Logic
Tier 1 auto-fixes are limited to cosmetic and hygiene issues. Any change that could affect what the player sees, hears, or experiences is Tier 2 minimum.

### Playtesting Feedback Outranks Automated Suggestions
When a human playtest observation conflicts with an auto-generated task, the playtest observation wins. `PLAYTEST_LOG.md` informs Architect decisions directly.
