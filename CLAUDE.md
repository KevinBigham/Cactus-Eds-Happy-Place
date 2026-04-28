# CEHP — Cactus Ed's Happiest Place

Single-file browser platformer built with Phaser (CDN), ES5 JavaScript, no build tools. Entire game runtime in one HTML file. Multi-agent AI build (4 agents — see `ACTIVE/docs/AGENTS.md`). Deployed to GitHub Pages.

---

## Read First

1. `README_Instructions on What To Do.md` — current state and tasks.
2. `.codex/CEHP/status.md` — most authoritative current state (auto-echoed at SessionStart).
3. `ACTIVE/docs/NEXT_TASK.md` — the ONE active task.
4. `ACTIVE/docs/AGENTS.md` — agent roles and rules.

Only act if your role matches `TASK_OWNER_ROLE` in `NEXT_TASK.md`.

---

## Architecture

```
ACTIVE/
├── game/
│   ├── index.html              # Entire game runtime (~16K lines)
│   ├── scripts/                # Verification scripts
│   └── tests/                  # Smoke tests
├── docs/                       # NEXT_TASK, AGENTS, BACKLOG, KNOWN_ISSUES
└── knowledge/                  # Reference material (STUDIO_KERNEL doctrine, overflow)
.codex/CEHP/                    # Durable cross-session AI memory
ARCHIVE/                        # Everything no longer current
```

Authority: `.codex/CEHP/` is the canonical cross-session memory surface. If chat and `.codex/CEHP/` disagree, `.codex/CEHP/` wins.

---

## Hard Constraints (additive to global rules)

- **Save contract is `cactusEd_save_v1`** — never break it. Run `node ACTIVE/game/scripts/check_save_schema.js` after any code change.
- **Single HTML file runtime** — `ACTIVE/game/index.html`. ES5, no modules, no build step. Don't add build tooling without an explicit decision.
- **Scope changes tightly.** `NEXT_TASK.md` specifies what you may and may not touch.
- **If docs and code disagree, code wins.**

---

## Collaboration Rules

1. Check `TASK_OWNER_ROLE` in `NEXT_TASK.md`. If your role doesn't match, propose only.
2. Keep `ACTIVE/` current; move stale materials to `ARCHIVE/` (never delete).
3. Update `.codex/CEHP/` (status.md, handoff.md, changelog.md) and `NEXT_TASK.md` after meaningful changes.
4. New essential docs go in `ACTIVE/docs/`. Reference-only material in `ACTIVE/knowledge/`.
5. Preserve root simplicity — root holds only handoff/instruction docs + `ACTIVE/` + `ARCHIVE/` + config dirs.
6. Update CLAUDE.md when durable instructions change.

---

## File hygiene

- No duplicate files. UPPERCASE_SNAKE.md for active docs, lowercase for utility/reference dirs.
- No "final_final_v2" naming. When in doubt, archive rather than delete.

---

## GitHub Pages deployment

`.github/workflows/static.yml` deploys repo to GitHub Pages on push to `main`. Game served at `<pages>/ACTIVE/game/index.html` (or update workflow `path` to `ACTIVE/game` to serve at root).
