# CEHP Launch Freeze

> Authored: 2026-04-29
> Nominal W13 freeze boundary: 2026-05-04
> Launch lock: 2026-05-29

## Freeze Status

Status: GREEN.

Frozen playable baseline commit:

```text
fb5f1b06c2dcb94b8a4f2a7533c514e48754f73d
```

Reason: this is the commit immediately after P5 GREEN. P6 adds only runway/freeze documentation and the `launch-freeze` tag; it does not change runtime source, scripts, tests, replay fixtures, art, save schema, or the shipped HTML artifact.

Annotated tag:

```text
launch-freeze
```

Tag command:

```bash
git tag -a launch-freeze -m 'W13 launch freeze 2026-05-04'
git push origin launch-freeze
```

## Artifact State

Bundle:

```text
354011 / 409600
```

Behavior oracle:

```text
117/117
```

Replay corpus:

```text
10/10 deterministic across launch gate and P5 cold reruns
```

## Replay MD5s

| Fixture | MD5 |
|---|---|
| `test_room_obedient.json` | `8ed8ad52b7cf5d9527f6ffa72acc50a2` |
| `w1_orientation_obedient.json` | `959e9ea8165a6e07ba7f88086c87e363` |
| `w2_benefits_atrium_partial.json` | `83350e61d274787443ea882bccf1eb19` |
| `w2_benefits_default_completion.json` | `37fee2643be901fa1757daa996e36d9e` |
| `w2_benefits_insured.json` | `bbacf3e1b817827f3391e01f17bd4f26` |
| `w2_benefits_uninsured.json` | `33ead17d29a3429bb07e77a7e8b852ef` |
| `w3_rasta_dark_cigarette.json` | `4bc2b923c92d76c903468c7acb081150` |
| `w3_rasta_rest_open.json` | `31cff301a90e4e1fd32ee45625d92bc0` |
| `w3_rasta_rushed.json` | `a412c8427605feef317987764b0a018b` |
| `w3_rasta_short.json` | `6812183919a381e6dc1f4e6e05febbf7` |

Source: `.codex/CEHP/w12_replay_hashes.md`, rechecked with `md5 -q ACTIVE/game/_canon/replays/cehp/*.json` during P6.

## Sacred Constraint Reaffirmation

- ES5 only in runtime source.
- Single HTML shipped artifact via `node ACTIVE/game/build.js`.
- Phaser 3 via CDN; no npm package in the play path.
- Save schema `cactusEd_save_v1` stays immutable; no schema bump in W13.
- Behavioral axes stay invisible; no HUD bars or meters.
- Voice rule stays active: deadpan, short lines, no exclamation marks in authored runtime voice, ALL CAPS receipt text.
- Seeded LCG RNG only in sim/state.
- `Date.now` remains limited to existing archival timestamps.
- Bundle cap remains `409600`.
- No predatory retention work.

## Soak Period Contract

```text
2026-05-04 -> 2026-05-29.
Beyond this point: only launch-blocking-bug fixes go to main.
```

Launch-blocking means:

- Game will not start.
- Save corruption.
- Security issue.
- Chrome stable broken.

Anything else is post-launch unless Kevin explicitly overrides.

## Frozen Non-Blockers

- `W11_CONTENT_BIAS = 1.1` remains tracked for post-launch cleanup.
- W11 launch-arc mini-bosses, setpieces, Reply-All Locust, and parallax expansion remain deferred to W15+.
- Firefox/Safari-family issues without a Chrome stable failure are known-issue candidates, not launch blockers.
- Custom-domain cutover remains Kevin/W14-gated; GitHub Pages fallback is verified.

## Final Gate

Required command:

```bash
bash ACTIVE/game/scripts/verify-launch.sh
```

Expected final line:

```text
CEHP LAUNCH VERIFY: PASS
```

Current P6 result:

```text
CEHP LAUNCH VERIFY: PASS
Bundle bytes: 354011 / 409600
Behavior oracle: 117/117
Replay corpus: 10/10
```

## Kevin-Owned Launch Actions

- Record trailer takes from `ACTIVE/docs/TRAILER_SHOT_LIST.md`.
- Replace CR pitch packet media marked `[REPLACE: ...]`.
- Purchase and configure the custom domain if going beyond GitHub Pages.
- Re-run `ACTIVE/docs/LAUNCH_DRESS_REHEARSAL.md` on Thursday 2026-05-28.
- Perform final taste-gate on 2026-05-29.
- Execute `ACTIVE/docs/LAUNCH_RUNBOOK_W14.md` on T-0.
