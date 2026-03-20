# VERIFY

## Fast Safe Verify
Run from repo root:

```bash
./scripts/verify-cehp.sh
```

`./scripts/verify-cehp.sh` is the canonical repo-level verify wrapper.

## Manual Browser Verify
If you need direct browser checks:

```bash
python3 -m http.server 4175 --bind 127.0.0.1
```

Then open:
- `http://127.0.0.1:4175/index.html`
- `http://127.0.0.1:4175/index.html?certAid=w2`
- `http://127.0.0.1:4175/index.html?certAid=w3`

## What To Confirm
- Normal boot lands on `Title` when no query param is present.
- `?certAid=w2` starts on the W2 upper trellis shelf checkpoint.
- `?certAid=w3` starts on the W3 recovery/pre-auth checkpoint.
- `R` retries the active checkpoint.
- `H` hides/shows the dev-only certification overlay.
- Save validator still passes.

## Notes
- If `/tmp/codex-playwright-cert/smoke.js` exists, `./scripts/verify-cehp.sh` will run it.
- If it does not exist, the wrapper will say so and still run the live save-contract validator.
- Human certification remains the final authority for the unresolved W2/W3 segments.
