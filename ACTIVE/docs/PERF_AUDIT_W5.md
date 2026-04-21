# PERF AUDIT — WEEK 5

Date: `2026-04-20`
Method: Playwright/Chromium headless at `1400x1000`, local server, 3 cold boots, 3 receipt-latency runs, 120-second FPS sample on default W1 boot.

## Measurements

### Cold boot

- Run 1: DOMContentLoaded `250.60ms`, first Phaser frame `273.90ms`
- Run 2: DOMContentLoaded `87.00ms`, first Phaser frame `102.70ms`
- Run 3: DOMContentLoaded `84.00ms`, first Phaser frame `99.90ms`
- Average: DOMContentLoaded `140.53ms`, first Phaser frame `158.83ms`

Interpretation:

- First-hit boot is the outlier; warm boots settle around `~100ms` to first frame.
- The dominant cost appears to be initial HTML/script parse plus Phaser bootstrap, not gameplay runtime.

### First receipt render

- Run 1: `8.90ms`
- Run 2: `8.40ms`
- Run 3: `20.70ms`
- Average: `12.67ms`

Interpretation:

- Receipt generation plus compare/render handoff is fast enough for launch.
- No obvious hot-path concern on receipt print itself.

### Steady-state FPS

- Sample duration: `120s`
- Average FPS: `77.42`
- Min FPS: `60.00`
- Max FPS: `85.10`

Interpretation:

- W1 steady-state is comfortably above 60 FPS in the test environment.
- No evidence of sustained degradation over the 2-minute window.

## Obvious wins to consider in W6

1. Skip or lazy-load Phaser for the plain-HTML `?settings=1` and `?docket=1` surfaces so those routes do not pay the full game bootstrap cost.
2. Avoid repeated save boot reads during startup; `99_boot.js` and `91_scenes.js` both hydrate from storage on the same launch path.
3. Keep the current receipt render path as-is; it is not the bottleneck.

## Not changed

- No runtime tuning
- No module loading changes
- No rendering-path changes

This is documentation only. Kevin should decide whether any W6 perf work is worth the launch-week risk.
