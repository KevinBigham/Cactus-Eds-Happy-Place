# ART4 Prompt Sidecar

Asset key: `cehp_art:characters:cactus_ed:victory:01`
Manifest path: `assets/art/characters/cactus_ed_victory_01.png`
Target dimensions: `1024x1024`
Transparent background: `yes`
Manifest order: `06/37`

## Image Generation Prompt

Create one production PNG for Cactus Ed's Happiest Place at exactly 1024x1024. Use DKC-inspired pre-rendered chunkiness applied to CEHP bureaucratic horror: toy-like silhouettes, hard overhead fluorescent lighting, heavy ambient-occlusion reads, manila paper surfaces, cold cyan spill, bureau navy shadows, and blood-orange warning accents.

Cactus Ed, the small cactus employee hero, shown in the victory gameplay pose with readable silhouette and no extra characters.
World anchor: Orientation bureau, navy shadows, manila paperwork, fluorescent institutional light.

Keep the image aligned to the existing manifest contract. Preserve the exact canvas size, aspect ratio, transparent-background requirement, and filename target. Do not add watermarks, signatures, captions, speech bubbles, UI labels, or new readable copy. Leave enough clean negative space for the Phaser runtime crop and scaling behavior already wired in ART2 and ART3.

When exporting, overwrite only `ACTIVE/game/assets/art/characters/cactus_ed_victory_01.png` and then run `node ACTIVE/game/scripts/validate_art_manifest.mjs`.
