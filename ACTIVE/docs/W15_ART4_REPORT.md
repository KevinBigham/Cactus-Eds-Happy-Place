# W15M-ART4 Report

Marathon: W15M-ART4 - Real-Art Swap-In Workflow
Branch: post-launch/w15-art
Base: 74bd433 (W15M-ART3-P9)
Final runtime bundle: 491348 / 491520 bytes
Delta from ART3 head: +0 bytes

## Phase Commits

- ART4-P1: 2249281 W15M-ART4-P1: Manifest validator script and guardrail test
- ART4-P2: 83a3346 W15M-ART4-P2: Per-category dimension contract
- ART4-P3: 78188b6 W15M-ART4-P3: Per-asset prompt sidecars
- ART4-P4: 39bb50a W15M-ART4-P4: Batch prompt generator script
- ART4-P5: cfb47f0 W15M-ART4-P5: Wire art manifest validator into launch gate
- ART4-P6: bd50ac7 W15M-ART4-P6: Real-art swap-in import guide
- ART4-P7: this report plus final verification evidence

## Tooling Surface

New scripts:

- ACTIVE/game/scripts/validate_art_manifest.mjs
- ACTIVE/game/scripts/print_art_prompts.mjs

New and extended tests:

- ACTIVE/game/tests/post_art_manifest_validate.test.mjs
- ACTIVE/game/tests/post_art_prompt_generator.test.mjs

New docs:

- ACTIVE/docs/W15_ART4_IMPORT_GUIDE.md
- ACTIVE/docs/W15_ART4_REPORT.md

New art contracts:

- ACTIVE/game/assets/art/art_dimensions.json
- 37 prompt sidecars under ACTIVE/game/assets/art/

Runtime source changes: none.

## Validator Contract

`validate_art_manifest.mjs` is a pure Node read-only sweep. It checks that every manifest asset has:

- an existing non-empty PNG file
- valid PNG magic bytes
- an IHDR width and height matching the manifest
- a locked ART4 dimension contract match
- a sibling `.prompt.md` sidecar

`verify-launch.sh` now runs `art_manifest_validate` after `bundle_byte_check`, so art swap failures are reported as art validation failures instead of build failures.

## Prompt Workflow

Every asset has a prompt sidecar beside the PNG. Each sidecar contains the asset key, manifest path, target dimensions, transparent-background requirement, ART1 style constants, an asset-specific subject prompt, and the exact validator command to run after export.

`print_art_prompts.mjs` prints the full 37-asset batch as one paste-ready block grouped by category.

The import guide documents the single-asset replacement path and includes a worked example for `cehp_art:characters:cactus_ed:idle:01`.

## Final Verification

Commands run on 2026-04-30:

```sh
bash ACTIVE/game/scripts/verify-launch.sh
node --test ACTIVE/game/tests/
node ACTIVE/game/scripts/validate_art_manifest.mjs
node ACTIVE/game/scripts/audit_fragments.mjs
wc -c < ACTIVE/game/index.html
```

Evidence:

```text
SUMMARY PASS 30/30
Bundle bytes: 491348 / 491520
Dimension contract: OK
Prompt sidecars: OK
ART MANIFEST VALIDATE: OK
37/37 assets passed
CEHP LAUNCH VERIFY: PASS

TOTAL: 418 fragments across all pools
Voice rule violations: 0
Duplicate IDs across pools: 0
AUDIT PASS

491348
```

## Handoff Notes

ART4 intentionally shipped no runtime source changes and no bundle growth. The branch is ready for incremental real-art swaps, one existing PNG at a time, with `validate_art_manifest.mjs` and the full launch gate as the safety checks.
