# Note to ChatGPT 5.4 (Game Architect)

## Mission
ChatGPT 5.4, Claude Code, and Codex are now operating as a three-AI strike team to continue building **Cactus Ed’s Happy Place** into the greatest multi-genre game of all time.

We want you (ChatGPT 5.4) to produce an explicit operating plan for how the three of us should collaborate in weekly cycles.

## Current Product Context (for planning)
- The project is a large single-file Phaser game centered in `index.html` with an expanding combat subsystem and live combat lab workflows.
- Recent emphasis has shifted from speculative feature sprawl toward disciplined **playtest-driven tuning**.
- Priority right now is increasing match comprehension, fairness, and rematch appeal (especially Ed vs Daikon), while protecting stability.

## Your Deliverable
Please return a practical collaboration plan titled:

**"Tri-AI Development Operating System: ChatGPT 5.4 + Claude Code + Codex"**

and structure it with the sections below.

### 1) Roles & Responsibilities (RACI-style)
Define who does what across the three AIs:
- **ChatGPT 5.4 (Game Architect):** systems design, playtest synthesis, balancing hypotheses, milestone architecture.
- **Claude Code (Integrator/Verifier):** implementation sequencing, repo-safe edits, regression checks, release notes, handoff quality.
- **Codex (Implementer):** constrained code execution, tactical feature/tuning passes, targeted refactors under explicit rules.

For each workflow area (combat tuning, narrative systems, content production, QA), assign:
- Responsible
- Accountable
- Consulted
- Informed

### 2) Development Cadence (1-week sprint loop)
Design a repeatable loop with explicit inputs/outputs for each stage:
1. **Playtest Intake**
2. **Architect Synthesis**
3. **Implementation Brief Generation**
4. **Codex Execution**
5. **Claude Verification & Integration**
6. **Release Decision**

Include artifacts required at each stage (notes template, brief template, verification checklist, go/no-go rubric).

### 3) Prompt Contracts Between AIs
Provide compact “contract prompts” that reduce drift:
- ChatGPT -> Codex implementation brief format
- Codex -> Claude completion report format
- Claude -> ChatGPT post-implementation feedback format

Each contract should require:
- file scope
- hard constraints
- exact success criteria
- regression risk declaration
- test evidence

### 4) Decision Framework: Build vs Tune vs Freeze
Define objective gates for:
- when to add new content/features
- when to tune existing systems only
- when to freeze and collect outside playtest data

Use measurable triggers (e.g., recurring complaint counts, audit deltas, unresolved red flags across scenarios 1/3/5/6/7, etc.).

### 5) Quality Bar & Regression Policy
Specify a minimal quality standard for any merged change:
- Syntax/pass criteria
- Required scenario checks
- Audit/parity expectations
- Rollback policy
- “No architecture churn without evidence” rule

### 6) 30-Day Roadmap
Produce a pragmatic 4-week roadmap with:
- Week objective
- Expected deliverables
- Owner AI
- Exit criteria

Constrain scope to what can actually be delivered without destabilizing the codebase.

### 7) Communication Protocol
Define a lightweight but strict comms rhythm:
- daily async update format (3 bullets max)
- weekly architecture review agenda
- incident format for regressions

## Critical Constraints
Your plan must enforce the following:
- Keep changes evidence-driven and playtest-led.
- Prefer small, reversible increments over large rewrites.
- Avoid speculative system overhauls without data.
- Preserve current working toolchain and repo structure unless a change is explicitly approved.
- Every major recommendation must map to a measurable player outcome.

## Output Style
- Clear, tactical, and implementation-ready.
- Minimal fluff.
- Use tables/checklists where useful.
- Assume this will be used immediately as the operating model for the next development cycle.

---

## Closing
We’re building something wild, funny, and mechanically real. Help us operationalize the collaboration so each AI amplifies the others.

**LFG.**
