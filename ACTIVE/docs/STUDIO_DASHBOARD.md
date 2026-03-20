# STUDIO DASHBOARD — CEHP

> Read-only mission control view. This file summarizes repository status.
> It does NOT store tasks, decisions, or code. It does NOT replace any authoritative system.
> **Last updated**: 2026-03-16 | **Updated by**: Claude Cowork Opus 4.6 (Operations)

---

## ACTIVE TASK

| Field | Value |
| --- | --- |
| TASK_ID | CEHP-010 |
| TITLE | Fix W2 pop-quiz auto-dismiss timing on first trigger |
| OWNER | Codex 5.4 (Builder) |
| STATUS | READY |
| BLOCKER | None — awaiting Builder pickup |

Source: `NEXT_TASK.md`

---

## BUILD HEALTH

| Check | Status | Last Run |
| --- | --- | --- |
| `scripts/verify-cehp.sh` | Not run (non-git workspace) | — |
| `scripts/check_save_schema.js` | PASS | 2026-03-16 |
| `scripts/studio-scan.sh` | Installed, ready to run | 2026-03-15 |
| Console errors on boot | Unknown (needs browser test) | — |
| Save contract shape | Stable (`cactusEd_save_v1`) | 2026-03-14 |

Build health will be fully assessed after CEHP-007 pushes to GitHub.

---

## REPOSITORY HEALTH

**Health Score: 72%** | **Trend: baseline** (see `HEALTH_TREND.md`)

| Signal | Status | Impact |
| --- | --- | --- |
| index.html size | 16,018 lines (4x threshold) | -10 |
| Test coverage | 0% (empty tests/) | -8 |
| Audio assets | None (empty audio/) | -3 |
| TODO/FIXME count | 0 | +5 |
| Stray console.log | 0 | +3 |
| Save contract | Stable | +5 |
| Doc structure | Clean (tiered boot, 10 root files) | +5 |
| Durable memory | Complete (8/8 .codex files) | +5 |
| Auto-task backlog | 6 DISCOVERED, 0 overdue | -2 |
| Unpushed changes | Sprints 005-012g + CEHP-009 local only | -5 |

**Target**: 85% by Sprint 015

Scoring: starts at 100, deductions per signal severity. Recoverable by addressing auto-tasks and pushing to GitHub.

---

## AUTONOMOUS TASKS

| Status | Count | Limit |
| --- | --- | --- |
| DISCOVERED | 6 | 10 max |
| REVIEWED | 0 | 20 max |
| PROMOTED | 0 | — |
| REJECTED | 0 | — |

**Top 3 highest-severity discoveries**:

| ID | Title | Complexity |
| --- | --- | --- |
| AT-001 | index.html exceeds 16,000 lines — evaluate modularization | high |
| AT-002 | Zero automated test coverage | medium |
| AT-006 | No mobile support — Phaser supports touch natively | medium |

Source: `auto_tasks/DISCOVERED/`

---

## SELF-HEALING ACTIVITY

**Last 5 repairs**: none yet

**Last scan**: 2026-03-15 (Sprint 009 installation)
- Trigger: self-healing system installation
- Code health: 0 Tier 1 auto-fixes needed
- Build health: not run
- Architecture drift: 1 signal (tracked as AT-001)
- Gameplay opportunities: 5 signals (tracked as AT-002 through AT-006)

**Scan automation**: `scripts/studio-scan.sh` installed — run after each sprint

**Scope protections** (Sprint 011):
- May not modify files >1,000 lines
- May not modify gameplay logic
- Must verify before and after every fix

Source: `self_healing/AUTO_FIX_LOG.md`, `self_healing/HEALING_RULES.md`

---

## PLAYTEST FEEDBACK

**Entries**: 3 (Kevin — 2026-03-16, pre-patch build)

Latest observations:
- W2: Quiz auto-dismisses on first trigger (~0.2s) — **confirmed defect**
- W2: Completed graduation (3.0 GPA). Trellis route clarity minor issue.
- W3: All 4 checkpoints cleared, boss defeated. CertAid panel occludes lamp area.
- General: Closing screen font unreadable. Pencils should be upside down.

Source: `PLAYTEST_LOG.md`

---

## HEALTH TREND

| Sprint | Score | Trend |
| --- | --- | --- |
| 010 | 72% | Baseline |

**Two-sprint decline rule**: if score drops for two consecutive sprints, schedule a tech-debt sprint.

Source: `HEALTH_TREND.md`

---

## KERNEL DISCOVERIES

| Knowledge Base | Entries |
| --- | --- |
| Lessons learned | 6 |
| Bug patterns | 5 |
| Architecture patterns | 6 |

**Kernel integrity rules** (Sprint 011):
- Cross-project patterns only (project-specific knowledge → .codex/)
- Multi-repo threshold: pattern must appear in 2+ repos before Kernel entry
- No stale entries: update or remove outdated guidance

**Latest lessons**:
- Cold-start token waste kills productivity (Sprint 006)
- Agents need literal next prompts, not just context (Sprint 006)
- Canvas focus loss causes phantom input failures (Sprint 005)

**Latest bug patterns**:
- Canvas Focus Loss (browser games)
- Text Overlap On Shared Surfaces
- Camera Snap On Direction Change

Source: `STUDIO_KERNEL/lessons_learned.md`, `STUDIO_KERNEL/bug_patterns.md`

---

## SPRINT STATUS

**Current sprint**: CEHP-009 Complete → CEHP-010 Ready (Builder)

**Recent sprints**:

| Sprint | Goal | Date | Status |
| --- | --- | --- | --- |
| CEHP-009 | Classify retest results & lock certification path | 2026-03-16 | Complete |
| 012g | Final Protocol Alignment & Bolt Tightening | 2026-03-16 | Complete |
| 011 | Final System Stability Pass | 2026-03-15 | Complete |
| 010 | Studio Dashboard Installation | 2026-03-15 | Complete |
| 009 | Self-Healing Repository | 2026-03-15 | Complete |
| 008 | Autonomous Task Generator | 2026-03-15 | Complete |
| 007 | AI Studio Kernel | 2026-03-15 | Complete |
| 006 | Process Cleanup + Cold-Start Optimization | 2026-03-15 | Complete |
| 005 | W2/W3 Defect Patch Pass | 2026-03-14 | Complete (unpushed) |

**Next milestone**: CEHP-010 — Builder fixes W2 quiz auto-dismiss → Review → Push → Retest

Source: `SPRINT_LOG.md`

---

## AGENT ROSTER

| Role | Model | Status |
| --- | --- | --- |
| Architect | ChatGPT 5.4 Pro | Defined CEHP-009 (Track A). Awaiting post-CEHP-010 briefing. |
| Builder | Codex 5.4 | CEHP-010 READY — fix W2 quiz auto-dismiss |
| Reviewer | Claude Code Sonnet 4.6 | Awaiting CEHP-010 review after Builder completes |
| Operations | Claude Cowork Opus 4.6 | CEHP-009 complete. Sprint closeout audit done. |

---

## UPDATE PROTOCOL

This dashboard should be refreshed when:
- A new sprint begins or completes
- `NEXT_TASK.md` changes
- `auto_tasks/` scans complete
- `self_healing/` runs
- `STUDIO_KERNEL/` knowledge is updated
- `PLAYTEST_LOG.md` receives new entries
- `HEALTH_TREND.md` records a new score

**Who updates**: Operations agent (Claude Cowork Opus 4.6) or any agent at session end.

**How to update**: read live data from source files and rewrite this dashboard. Do NOT cache stale data.

---

## PROTECTION RULES

This dashboard must NEVER:
- Store tasks (use `NEXT_TASK.md`)
- Store architectural decisions (use `.codex/<GAME>/decisions.md`)
- Replace any authoritative file
- Modify code
- Override any system in the authority chain

```
1️⃣  Repository instructions    ← authoritative
2️⃣  .codex/<GAME>/ memory      ← authoritative
3️⃣  STUDIO_KERNEL/ guidance    ← advisory
4️⃣  auto_tasks/ suggestions    ← suggestions only
5️⃣  self_healing/ automation   ← trivial fixes only
6️⃣  STUDIO_DASHBOARD.md        ← read-only summary
```
