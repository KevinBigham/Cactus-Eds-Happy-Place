# W10 Phase 2.5 — Event-Sourced State Traces

> **Phase**: 2.5 (slot between Phase 2 Kevin-approval and Phase 3 activation)
> **Owner**: Codex 5.4 (builder)
> **Est bytes**: ≤ 500 B bundled
> **Est days**: 0.5
> **Blocks**: Nothing — runs as tiny pre-3 insert once Kevin greenlights Phase 2
> **Unblocks**: Phase 4 forgiveness tuning with data, not vibes

---

## Why this exists

Phase 4 tunes coyote / jump-buffer / cut-ratio / wall-grace windows. Today we have no data about *when* those windows should fire — just spec defaults from 7 AIs with conflicting opinions. Autoplay logs event topics (`sign:peek`, `movement:jump`) but **not state-machine transitions** and **not the near-misses where a transition was queried but gated by timing**.

Bolt the state machine to the existing `CEHP.Events` bus, rerun autoplay on all 3 worlds, and Phase 4 starts from evidence:

> "Out of 847 jump queries in W1, 23 were gated by `buffer_miss` at frame-age ≤ 3. Coyote should be ≥ 100 ms (6 frames), not 83 ms."

Cost: one new arg on `enter()`, two `emit()` calls in `07_ed_state.js`, one `DETERMINISTIC_TOPICS` set extension in `autoplay.mjs`. That's it.

---

## Event schemas

**`state:transition`** — fires on every actual state change (not same-state re-entry).

```js
{
  frame:      <number>,          // ctrl.fixed.semanticFrame at commit
  from:       <string>,          // previous state name (may be '')
  to:         <string>,          // new state name
  trigger:    <string>,          // 'input' | 'physics' | 'event' | 'reset'
  stateFrame: <number>,          // frames spent in the from state
  grounded:   <boolean>,
  vx:         <number>,          // px/s
  vy:         <number>           // px/s
}
```

**`state:nearMiss`** — fires from `canTransition()` when a rule exists but the transition is gated.

```js
{
  frame:      <number>,
  state:      <string>,          // current state at query time
  action:     <string>,          // 'jump' | 'dash' | 'melee' | 'ranged'
  gated_by:   <string>,          // 'cooldown' | 'window_too_early' | 'window_too_late' | 'buffer_miss'
  stateFrame: <number>
}
```

Note: the `no_rule` branch (no cancel exists from this state for this action) is **not** emitted — it fires every tick and drowns signal. Only emit the four timing/buffer/cooldown gating reasons.

---

## Implementation — exactly three files touched

### 1. `ACTIVE/game/src/07_ed_state.js`

**Change A — add `trigger` as 3rd arg to `enter()`**, default `'physics'`:

```js
function enter(actor, nextState, trigger){
  var ctrl = ensure(actor);
  var frame = frameValue(ctrl);
  nextState = nextState || 'idle';
  if (ctrl.current === nextState) {
    ctrl.stateFrame = frame - ctrl.enteredFrame;
    if (ctrl.stateFrame < 0) ctrl.stateFrame = 0;
    return ctrl;
  }
  exit(actor, nextState);
  ctrl.previous = ctrl.current;
  ctrl.current = nextState;
  ctrl.enteredFrame = frame;
  ctrl.stateFrame = 0;
  if (ns.Events && ns.Events.emit) {
    ns.Events.emit('state:transition', {
      frame: frame,
      from: ctrl.previous,
      to: ctrl.current,
      trigger: trigger || 'physics',
      stateFrame: frame - (ctrl.enteredFrame - 0),
      grounded: grounded(actor),
      vx: velocityX(actor),
      vy: velocityY(actor)
    });
  }
  return ctrl;
}
```

**Change B — pass `trigger` at every call site in `07_ed_state.js`** (there are 5):

| Call site | New trigger |
|---|---|
| `applyTransition` — `enter(actor, result.toState)` | `'input'` |
| `tick` — `enter(actor, preview)` | `'physics'` |
| `reconcile` — `enter(actor, nextState)` | `'physics'` |
| `bindEvents` — `enter(..., 'death')` | `'event'` |
| `resetController` callers — after `ctrl.current = 'idle'` reassignment | Not an `enter()` call, skip |

**Change C — emit `state:nearMiss` in `canTransition()`** at the four gate branches (NOT the `no_rule` branch):

```js
function canTransition(actor, action){
  var ctrl = ensure(actor);
  var rules = ns.CancelMatrix && ns.CancelMatrix.rules ? ns.CancelMatrix.rules() : null;
  var stateRules = rules && rules[ctrl.current] ? rules[ctrl.current] : null;
  var rule = stateRules && stateRules[action] ? stateRules[action] : null;
  var frame = frameValue(ctrl);
  var entry;

  if (!rule) return null;                            // silent — no rule = not a miss
  if (ctrl.cooldowns[action] != null && frame < ctrl.cooldowns[action]) {
    emitNearMiss(ctrl, frame, action, 'cooldown');
    return null;
  }
  if (ctrl.stateFrame < rule.window.startFrame) {
    emitNearMiss(ctrl, frame, action, 'window_too_early');
    return null;
  }
  if (rule.window.endFrame >= 0 && ctrl.stateFrame > rule.window.endFrame) {
    emitNearMiss(ctrl, frame, action, 'window_too_late');
    return null;
  }
  entry = ns.InputBuffer && ns.InputBuffer.peek ? ns.InputBuffer.peek(ctrl.buffer, action, frame, rule.bufferFrames) : null;
  if (!entry) {
    emitNearMiss(ctrl, frame, action, 'buffer_miss');
    return null;
  }

  return { action: action, toState: rule.toState, rule: clone(rule), entry: entry };
}
```

Add a tiny helper:

```js
function emitNearMiss(ctrl, frame, action, reason){
  if (!ns.Events || !ns.Events.emit) return;
  ns.Events.emit('state:nearMiss', {
    frame: frame,
    state: ctrl.current,
    action: action,
    gated_by: reason,
    stateFrame: ctrl.stateFrame
  });
}
```

### 2. `ACTIVE/game/scripts/autoplay.mjs`

Extend `DETERMINISTIC_TOPICS` (around line 48):

```js
const DETERMINISTIC_TOPICS = new Set([
  'sign:peek',
  'sign:read',
  'curiosity:reward',
  'form:used',
  'movement:jump',
  'movement:doubleJump',
  'movement:tripleJump',
  'movement:wallJump',
  'module:passed',
  'module:skipped',
  'contradiction:defy',
  'contradiction:follow',
  'state:transition',   // NEW
  'state:nearMiss'      // NEW
]);
```

No other autoplay change. The trace hook already records every emitted event; new topics flow through automatically.

### 3. `ACTIVE/game/tests/rebuild_logic.test.mjs`

Add two tests (expected location: after the existing Phase 2 tests around line 1399+):

```js
test('phase 2.5 state transitions emit in deterministic order', function(){
  // Subscribe a collector to CEHP.Events before driving transitions.
  // Drive: enter(actor, 'run', 'input') -> enter(actor, 'jumpRise', 'input') -> enter(actor, 'jumpFall', 'physics') -> enter(actor, 'landed', 'physics') -> enter(actor, 'idle', 'physics').
  // Assert: 5 events, frame monotonic non-decreasing, from/to chain matches, triggers preserved.
});

test('phase 2.5 state near-misses report gated_by reasons', function(){
  // Install a minimal CancelMatrix rule: from 'jumpRise', action 'dash', window {startFrame: 5, endFrame: 10}, bufferFrames: 3, cooldownFrames: 60.
  // Drive canTransition() with:
  //   - stateFrame=3 and empty buffer      -> expect 'window_too_early' emitted (checked first)
  //   - stateFrame=12                       -> expect 'window_too_late'
  //   - stateFrame=7 and empty buffer       -> expect 'buffer_miss'
  //   - cooldown set to future frame        -> expect 'cooldown'
  // Assert one emitted near-miss per call, matching gated_by.
});
```

**Test count will move from 52 → 54.**

---

## Byte budget

| Item | Est bytes |
|---|---|
| `emitNearMiss` helper + 4 call sites in `canTransition` | ~280 |
| `state:transition` emit block in `enter()` | ~180 |
| `trigger` arg default + 4 call-site edits | ~40 |
| `DETERMINISTIC_TOPICS` additions | ~40 |
| **Total new** | **~540** |

Current bundle: 308,216 B. After this phase: ~308,756 B. Runway ~49,644 B (still ~14% under the 358,400 cap). Green.

---

## Sacred constraints — all preserved

- ES5 only (`var` / `function` / no `=>` / no `` ` ``). ✓
- Seeded RNG only — no `Math.random` introduced. ✓
- `cactusEd_save_v1` schema untouched — runtime-only change. ✓
- `ns.TUNING.JUMP_VELOCITY` and `ns.TUNING.GRAVITY` never touched. ✓
- Single-HTML ship via `node build.js` — no new files beyond what already exists, no new deps. ✓
- No push to `main`. ✓
- Determinism preserved: `ns.Events.emit` is synchronous, same seed → same state trajectory → same event sequence. Autoplay MATCH must still hold. ✓

---

## Don't touch

- `ACTIVE/game/src/21_movement.js`
- `ACTIVE/game/src/50_forms.js`
- `ACTIVE/game/src/89_ed_perform.js`
- `ACTIVE/game/src/04_fixed_step.js`
- `ACTIVE/game/src/05_input_buffer.js`
- `ACTIVE/game/src/06_cancel_matrix.js`
- Any file under `ACTIVE/game/art/`
- Any file under `.codex/CEHP/` (reviewer lane)
- Any file under `ACTIVE/docs/` except adding a short Phase 2.5 note to `W10_REDESIGN_SPRINT.md`'s phase table if desired (optional)
- `ns.TUNING.*` globals
- `cactusEd_save_v1` schema

---

## Kickoff verify matrix

Run in order. Each must be green before the next.

```
cd /Users/tkevinbigham/Projects/CEHP/ACTIVE/game

node build.js
# expect: "Built 44 modules -> index.html (~308700 bytes)"

node scripts/check_save_schema.js
# expect: "Rebuild save schema (v2 + archaeological v1) checks passed"

node --test tests/rebuild_logic.test.mjs
# expect: 54/54 pass (52 existing + 2 new)

node scripts/verify_art_assets.mjs
# expect: 32/32 expected assets OK

node scripts/autoplay.mjs --world orientation
# expect: determinism: MATCH, passed: true; state:transition + state:nearMiss counts match byte-exact

node scripts/autoplay.mjs --world benefits
# expect: MATCH

node scripts/autoplay.mjs --world rasta
# expect: MATCH
```

ES5 + sacred sweeps after ship:

```
rg -n '(=>|\blet\s|\bconst\s|\bclass\s|`|\.\.\.|async\s|await\s)' ACTIVE/game/src/07_ed_state.js
# expect: no matches

rg -n 'Math\.random' ACTIVE/game/src
# expect: only the 02_rng.js:1 warning-comment match

rg -n 'TUNING\.(JUMP_VELOCITY|GRAVITY)\s*=' ACTIVE/game/src
# expect: no matches
```

---

## Codex handoff (paste-ready block)

Copy everything between the fences into Codex chat.

---CODEX-HANDOFF-PHASE-2.5---

```json
{
  "task_id": "CEHP-REBUILD-W10-PHASE-2.5-STATE-TRACES",
  "title": "W10 Phase 2.5 — event-sourced state traces for Phase 4 forgiveness tuning",
  "task_owner_role": "Codex 5.4",
  "next_handler_role": "Reviewer (verify matrix) then Codex 5.4 (Phase 3 verb set)",
  "blocks_on": "Kevin APPROVE on Phase 2 checkpoint (open at ACTIVE/delivery/w10_phase2_checkpoint/README.md)",
  "deadline": "0.5 day from Phase 2 approval",
  "status": "READY",

  "read_order": [
    "ACTIVE/docs/W10_PHASE2_5_STATE_TRACES.md",
    "ACTIVE/game/src/07_ed_state.js",
    "ACTIVE/game/src/06_cancel_matrix.js",
    "ACTIVE/game/scripts/autoplay.mjs",
    "ACTIVE/game/tests/rebuild_logic.test.mjs"
  ],

  "do_not_touch": [
    "ACTIVE/game/src/21_movement.js",
    "ACTIVE/game/src/50_forms.js",
    "ACTIVE/game/src/89_ed_perform.js",
    "ACTIVE/game/src/04_fixed_step.js",
    "ACTIVE/game/src/05_input_buffer.js",
    "ACTIVE/game/src/06_cancel_matrix.js",
    "ACTIVE/game/art/**",
    ".codex/CEHP/**",
    "ns.TUNING.JUMP_VELOCITY",
    "ns.TUNING.GRAVITY",
    "cactusEd_save_v1 schema"
  ],

  "files_modified": [
    "ACTIVE/game/src/07_ed_state.js",
    "ACTIVE/game/scripts/autoplay.mjs",
    "ACTIVE/game/tests/rebuild_logic.test.mjs"
  ],

  "sacred_constraints": [
    "ES5 only: var/function, no => / let / const / backticks / class / spread / async / await",
    "No Math.random — CEHP.LCG RNG only, and no RNG needed here",
    "cactusEd_save_v1 schema frozen",
    "ns.TUNING.JUMP_VELOCITY and ns.TUNING.GRAVITY never mutated",
    "Single-HTML ship via node build.js — no new deps",
    "No push to main",
    "Determinism preserved: same seed -> same event sequence in same order"
  ],

  "byte_budget": {
    "target_new_bytes": 540,
    "current_bundle": 308216,
    "projected_bundle": 308756,
    "ceiling": 358400,
    "runway_after": 49644
  },

  "event_schemas": {
    "state:transition": {
      "fires_when": "ctrl.current != ctrl.previous after a successful enter() commit",
      "payload": {
        "frame": "number (semanticFrame)",
        "from": "string (previous state name; may be '')",
        "to": "string (new state name)",
        "trigger": "'input' | 'physics' | 'event' | 'reset'",
        "stateFrame": "number (frames in from state)",
        "grounded": "boolean",
        "vx": "number",
        "vy": "number"
      }
    },
    "state:nearMiss": {
      "fires_when": "canTransition() has a rule but gates it on cooldown/window/buffer",
      "do_not_emit_when": "no rule exists for (state, action) — too noisy",
      "payload": {
        "frame": "number",
        "state": "string (current state)",
        "action": "'jump' | 'dash' | 'melee' | 'ranged'",
        "gated_by": "'cooldown' | 'window_too_early' | 'window_too_late' | 'buffer_miss'",
        "stateFrame": "number"
      }
    }
  },

  "implementation_summary": [
    "In 07_ed_state.js enter(), add optional trigger arg (default 'physics'), emit state:transition after the state change is committed.",
    "In 07_ed_state.js, pass trigger at every enter() call site: applyTransition='input', tick='physics', reconcile='physics', bindEvents death handler='event'.",
    "In 07_ed_state.js canTransition(), add a tiny emitNearMiss helper and call it at the 4 gate branches (cooldown, window_too_early, window_too_late, buffer_miss). Skip no_rule branch — it's noise.",
    "In autoplay.mjs, extend DETERMINISTIC_TOPICS with 'state:transition' and 'state:nearMiss'.",
    "Add 2 tests to rebuild_logic.test.mjs: one for transition ordering + trigger preservation, one for near-miss gated_by reasons."
  ],

  "acceptance_criteria": [
    "node build.js bundles cleanly at ~308.7 KB, ≤ 358,400 B ceiling",
    "node --test tests/rebuild_logic.test.mjs passes 54/54 (2 new)",
    "All 3 autoplay worlds: determinism: MATCH + passed: true with the new topics included in the count-match",
    "Sacred-constraint sweeps on 07_ed_state.js and autoplay.mjs are clean",
    "ES5 check on 07_ed_state.js returns no matches"
  ],

  "verify_commands": [
    "cd ACTIVE/game && node build.js",
    "cd ACTIVE/game && node scripts/check_save_schema.js",
    "cd ACTIVE/game && node --test tests/rebuild_logic.test.mjs",
    "cd ACTIVE/game && node scripts/verify_art_assets.mjs",
    "cd ACTIVE/game && node scripts/autoplay.mjs --world orientation",
    "cd ACTIVE/game && node scripts/autoplay.mjs --world benefits",
    "cd ACTIVE/game && node scripts/autoplay.mjs --world rasta"
  ],

  "kevin_checkpoint": false,
  "handoff_artifact_on_green": ".codex/CEHP/changelog.md entry + status.md prepend + optional Phase 2.5 note in W10_REDESIGN_SPRINT.md phase table"
}
```

---CODEX-HANDOFF-PHASE-2.5---

---

## What Phase 4 does with this

When Phase 4 opens forgiveness-tuning work, grep the autoplay trace:

```
jq '[.trace[] | select(.topic=="state:nearMiss") | .payload.gated_by] | group_by(.) | map({reason: .[0], count: length})' output/autoplay/autoplay-orientation-*.json
```

Expected output shape:

```json
[
  { "reason": "buffer_miss",       "count": 47 },
  { "reason": "cooldown",          "count": 12 },
  { "reason": "window_too_early",  "count":  8 },
  { "reason": "window_too_late",   "count": 31 }
]
```

31 `window_too_late` jumps = cut-ratio 180 ms window is too short. 47 `buffer_miss` = coyote or jump-buffer frames too tight. Tune, re-autoplay, diff. Evidence > vibes.
