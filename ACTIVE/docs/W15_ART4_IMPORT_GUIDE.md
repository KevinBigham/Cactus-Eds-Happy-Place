# W15M-ART4 Real-Art Swap-In Import Guide

This workflow lets Kevin or an image-generation agent replace a placeholder PNG with final art while keeping the ART2 runtime wiring unchanged.

## Rules

- Do not edit `ACTIVE/game/assets/art/art_manifest.json`.
- Do not rename art files or create alternate runtime paths.
- Overwrite only the target PNG named by the manifest.
- Keep the exact target dimensions in the prompt sidecar.
- Run the validator before the full launch gate.

## Swap-In Workflow

1. Pick the asset to regenerate from `ACTIVE/game/assets/art/art_manifest.json`.
2. Open the sibling prompt sidecar beside that PNG.
3. Paste the full sidecar prompt into ChatGPT, Midjourney, Stable Diffusion, or the selected generator.
4. Export a PNG at the exact sidecar dimensions.
5. Overwrite the existing PNG at the manifest path, using the same filename.
6. Run:

```sh
node ACTIVE/game/scripts/validate_art_manifest.mjs
```

The validator must report:

```text
ART MANIFEST VALIDATE: OK
37/37 assets passed
```

7. Run:

```sh
bash ACTIVE/game/scripts/verify-launch.sh
```

The launch gate must report:

```text
CEHP LAUNCH VERIFY: PASS
```

8. Commit the swap with this format:

```text
W15M-ART-SWAP: <asset_key>
```

## Worked Example: Cactus Ed Idle

Asset key:

```text
cehp_art:characters:cactus_ed:idle:01
```

PNG to overwrite:

```text
ACTIVE/game/assets/art/characters/cactus_ed_idle_01.png
```

Prompt sidecar:

```text
ACTIVE/game/assets/art/characters/cactus_ed_idle_01.prompt.md
```

Target dimensions:

```text
1024x1024
```

Flow:

1. Open `ACTIVE/game/assets/art/characters/cactus_ed_idle_01.prompt.md`.
2. Paste the full sidecar into the image generator.
3. Export a transparent 1024x1024 PNG.
4. Save it over `ACTIVE/game/assets/art/characters/cactus_ed_idle_01.png`.
5. Run:

```sh
node ACTIVE/game/scripts/validate_art_manifest.mjs
bash ACTIVE/game/scripts/verify-launch.sh
```

6. Commit:

```text
W15M-ART-SWAP: cehp_art:characters:cactus_ed:idle:01
```

## Batch Prompt Generation

To print every prompt sidecar in one paste-ready block:

```sh
node ACTIVE/game/scripts/print_art_prompts.mjs
```

Use the batch output when regenerating the full 37-asset set. For a single-asset replacement, use the per-asset sidecar instead.

## Troubleshooting

- `PNG magic bytes mismatch`: the exported file is not a PNG, or the file was truncated.
- `PNG dimensions ... != manifest ...`: export again at the exact sidecar dimensions.
- `dimension contract ... != PNG ...`: the image does not match the locked ART4 size contract.
- `prompt sidecar missing`: restore the sibling `.prompt.md` file before validating.
- `CEHP LAUNCH VERIFY: FAIL (component: art_manifest_validate)`: run the validator directly and fix the per-asset diagnostic before retrying the gate.
