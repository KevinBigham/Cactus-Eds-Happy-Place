# CEHP W13 Launch Dress Rehearsal

> Executed by Codex on 2026-04-29.
> This is the T-1 recipe Kevin reruns on Thursday 2026-05-28.

## Result

Status: GREEN.

Source commit for this rehearsal: `ffdfe34`.

Rehearsal clone path: `/tmp/cehp-rehearsal-1777484189`.

The full cold-clone launch path completed without a launch-blocking failure:

- Bundle: `354011 / 409600`.
- Behavior oracle: `117/117`.
- Replay corpus inside launch gate: `10/10`.
- Replay corpus cold reruns: `10/10`, `10/10`, `10/10`.
- Browser quick checks: Google Chrome stable GREEN, Chromium GREEN, WebKit GREEN, Firefox GREEN.

## T-1 Recipe

Run this from a clean terminal on 2026-05-28.

### 1. Clone

```bash
git clone <origin-or-local> /tmp/cehp-rehearsal-$(date +%s)
```

W13 rehearsal command:

```bash
/usr/bin/time -p git clone /Users/tkevinbigham/Projects/CEHP /tmp/cehp-rehearsal-1777484189
```

W13 actual:

```text
real 0.93
user 0.12
sys 0.34
```

GREEN output:

```text
Cloning into '/tmp/cehp-rehearsal-1777484189'...
done.
```

RED mode: clone fails, HEAD is not the expected freeze commit, or the target directory is not a clean standalone copy.

### 2. Install

```bash
cd /tmp/cehp-rehearsal-1777484189/ACTIVE/game
/usr/bin/time -p npm install
```

W13 actual:

```text
added 3 packages, and audited 4 packages in 538ms
found 0 vulnerabilities
real 0.90
user 0.32
sys 0.24
```

RED mode: dependency install fails, vulnerability output requires action, or Playwright is unavailable for the launch checks.

### 3. Build And Launch Gate

```bash
cd /tmp/cehp-rehearsal-1777484189/ACTIVE/game
/usr/bin/time -p sh -c 'node build.js && bash scripts/verify-launch.sh'
```

W13 actual:

```text
Built 45 modules -> index.html (354001 bytes)
CEHP LAUNCH VERIFY: PASS
real 28.94
user 10.17
sys 2.97
```

GREEN output:

```text
Bundle bytes: 354011 / 409600
CEHP LAUNCH VERIFY: PASS
```

RED mode:

- Any nonzero exit.
- Missing `CEHP LAUNCH VERIFY: PASS`.
- Bundle over `409600`.
- Behavior oracle below `117/117`.
- Replay corpus below `10/10`.
- Save schema check fails.

### 4. Cold Replay Reruns

```bash
cd /tmp/cehp-rehearsal-1777484189/ACTIVE/game
for i in 1 2 3; do
  echo "RUN $i"
  /usr/bin/time -p npm run test:replay
done
```

W13 actual:

| Run | Result | Wall-clock |
|---|---|---:|
| 1 | `SUMMARY PASS 10/10` | `9.12s` |
| 2 | `SUMMARY PASS 10/10` | `9.20s` |
| 3 | `SUMMARY PASS 10/10` | `9.12s` |

RED mode: any run below `10/10`, any first-divergent-frame report, or materially different md5 output.

### 5. Default Browser Entry Check

```bash
/usr/bin/time -p open /tmp/cehp-rehearsal-1777484189/ACTIVE/game/index.html
```

W13 actual:

```text
real 0.13
user 0.00
sys 0.00
```

The automated browser probe also served the rehearsal clone locally and confirmed:

- Procedural ambient starts after user input.
- Ed uses `ED_RENDER_H = 60`.
- Ed body texture is `ed_sheet_60px`.
- Ed base visual scale is `0.9375`.
- CRT rim-light is visible with sampled cyan alpha `0.22`.
- The first W1 obedient receipt path produced 3 fragments:
  - `VERDICT_ORIENTATION_10`
  - `TENSION_ORIENTATION_FOLLOW_05`
  - `CLOSER_ORIENTATION_FOLLOW_01`

Expected receipt lines from the automated probe:

```text
THE STAMP SAW ENOUGH TODAY.
THE WINDOW RESPECTED YOUR DELAY.
THE UPPER FILE KEPT YOUR NAME.
```

Note: the sampled body display height can read near `54px` during idle breathing. The launch check keys on `ED_RENDER_H = 60`, `ed_sheet_60px`, and the base visual scale rather than a single animation pose.

RED mode:

- Blank canvas.
- No procedural ambient after input.
- Missing `ed_sheet_60px`.
- CRT rim-light absent.
- No receipt fragment after end-of-run/debug completion.

### 6. Cross-Browser Quick Check

W13 command used a temporary local server and Playwright automation against the rehearsal clone. Google Chrome stable was checked directly; Safari-family behavior used Playwright WebKit; Firefox used Playwright Firefox because `/Applications/Firefox.app` was not installed.

| Browser Target | Result | Wall-clock | Notes |
|---|---|---:|---|
| Google Chrome stable | GREEN | `2.08s` | No warnings. |
| Playwright Chromium | GREEN | `1.32s` | No warnings. |
| Playwright WebKit (Safari-family) | GREEN | `9.52s` | No warnings. |
| Playwright Firefox | GREEN | `3.91s` | Standard AudioContext/WebGL warnings only; no visible failure. |

RED mode:

- Chrome stable fails to start or renders a blank/nonfunctional game.
- Chrome stable shows a runtime error, missing input response, missing audio response, or missing receipt path.
- Safari-family or Firefox visible regressions should be added to `ACTIVE/docs/KNOWN_ISSUES.md` as non-blockers unless Chrome stable also breaks.

## Launch Blocking Definition

Stop the launch only for:

- Game will not start.
- Save corruption.
- Security issue.
- Chrome stable broken.

Firefox/Safari-family issues without Chrome stable failure are known-issue candidates for post-launch unless Kevin rules otherwise.

## Rehearsal Notes

- `npx playwright install webkit firefox` was run in the rehearsal environment to make the browser-family checks executable from this workstation. This installed browser binaries in the user Playwright cache, not a project dependency.
- No runtime source, scripts, tests, replay fixtures, save schema, art, or marketing assets changed during P5.
- No new launch issue was added to `KNOWN_ISSUES.md`; the Firefox warnings were not visible regressions.
