# NEXT TASK (PROPOSED)

This file is the proposal lane for the post-W9 hand-back.

> **Status**: CLOSED/SUPERSEDED 19a1b10; retained as historical post-W9 proposal.

---

## TASK_ID: CEHP-POST-W9-KEVIN-TASTEGATE-AND-POLISH
## TITLE: Kevin visual pass on W9 art/readability sprint + focused polish follow-up
## TASK_OWNER_ROLE: Kevin (taste gate) → Builder (Codex 5.4) for any approved follow-up polish
## CURRENT_STAGE: Proposed 2026-04-23 after W9 closed locally green. Awaiting Kevin review of the shipped W9 work.
## NEXT_HANDLER_ROLE: Kevin
## STATUS: PROPOSED
## DEADLINE: TBD — Kevin sets after the W9 visual pass.

## CONTEXT

W9 is complete locally:
- `screen_unmasked_reveal.png` regenerated and approved by Kevin.
- Canonical typo audit completed; only 4 PNGs regenerated.
- Track B readability restore shipped for the 4 scoped modules.
- Track A wired the remaining 12 art assets with procedural fallback preserved.
- Full verification matrix green:
  - `node build.js` → `287826` reported bytes / `287838` on disk
  - `node scripts/check_save_schema.js` pass
  - `node scripts/verify_art_assets.mjs` → `32/32`
  - `node --test tests/rebuild_logic.test.mjs` → `45/45`
  - autoplay `orientation` / `benefits` / `rasta` all MATCH + OK

The only thing missing is Kevin's human eye on the in-world art placements and a decision on whether a small W10 polish pass is needed.

## IN SCOPE

1. Kevin runs three short visual checks:
   - `ACTIVE/game/index.html?world=orientation`
   - `ACTIVE/game/index.html?world=benefits`
   - `ACTIVE/game/index.html?world=rasta`
2. Kevin focuses on these W9 additions:
   - W1 final-room `supervisor_silhouette`
   - W1/W2 carpet tiles + fluorescent fixtures + office prop density
   - benefits enemy skins + windup overlay readability
   - W3 archive-box dressing
   - corrected typo PNGs (`ui_locker`, `crest_orientation_bureau`, `crest_benefits_enrollment`, `env_w2_benefits_enrollment`)
3. Kevin records one of three outcomes:
   - `ACCEPT AS-IS`
   - `SMALL POLISH PASS`
   - `REJECT ONE OR MORE PLACEMENTS`
4. If Kevin requests `SMALL POLISH PASS`, Builder executes only the requested placement/alpha/scale tweaks and re-runs the full verify matrix.

## OUT OF SCOPE

1. New worlds, new enemies, new mechanics, or new save fields.
2. Reopening W9 readability scope beyond the four restored modules plus `build.js`.
3. Swapping in `cactus_ed_in_game_sprite.png` as the live gameplay sprite.
4. Launch/push/deploy actions.
5. Any new image generation unless Kevin explicitly rejects a specific asset and asks for a new render.

## SACRED CONSTRAINTS

- Keep `cactusEd_save_v1` intact.
- Keep `ns.TUNING.JUMP_VELOCITY` and `ns.TUNING.GRAVITY` untouched.
- ES5 only in shipped runtime code.
- Seeded RNG only; no `Math.random`.
- Procedural fallback must remain for every wired asset.
- `COUNTEREEIT` stays canonical only on the seal + expired-ID callback.
- No push to `main` without Kevin.

## DEFINITION OF DONE

- Kevin has rendered a verdict on the W9 art placements.
- If no notes: W9 is accepted and the next content/launch task can be selected.
- If notes exist: they are converted into a tightly-scoped polish task with exact assets/rooms listed.
- No code begins until Kevin chooses whether there is a follow-up polish pass.

## RECOMMENDED NEXT STEP

Kevin should do the visual pass first. If the rooms feel right as-is, retire W9 and choose the next real task. If anything feels too loud, too muddy, or too "pasted on," request a short W10 polish pass against those exact placements instead of reopening the whole sprint.
