# ART4 Prompt Sidecar

Asset key: `cehp_art:setpieces:open_concept:hero:01`
Manifest path: `assets/art/setpieces/open_concept_01.png`
Target dimensions: `1024x576`
Transparent background: `no`
Manifest order: `21/37`

## Image Generation Prompt

Create one production PNG for Cactus Ed's Happiest Place at exactly 1024x576. Use DKC-inspired pre-rendered chunkiness applied to CEHP bureaucratic horror: toy-like silhouettes, hard overhead fluorescent lighting, heavy ambient-occlusion reads, manila paper surfaces, cold cyan spill, bureau navy shadows, and blood-orange warning accents.

Setpiece backdrop for open concept, staged as a bureaucratic platformer scene with strong depth and no UI text.
World anchor: Counterfeit Educational corporate bureaucracy, cheerful surface with procedural dread underneath.

Keep the image aligned to the existing manifest contract. Preserve the exact canvas size, aspect ratio, transparent-background requirement, and filename target. Do not add watermarks, signatures, captions, speech bubbles, UI labels, or new readable copy. Leave enough clean negative space for the Phaser runtime crop and scaling behavior already wired in ART2 and ART3.

When exporting, overwrite only `ACTIVE/game/assets/art/setpieces/open_concept_01.png` and then run `node ACTIVE/game/scripts/validate_art_manifest.mjs`.
