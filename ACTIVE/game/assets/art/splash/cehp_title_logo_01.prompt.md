# ART4 Prompt Sidecar

Asset key: `cehp_art:splash:cehp_title_logo:wordmark:01`
Manifest path: `assets/art/splash/cehp_title_logo_01.png`
Target dimensions: `1024x512`
Transparent background: `yes`
Manifest order: `36/37`

## Image Generation Prompt

Create one production PNG for Cactus Ed's Happiest Place at exactly 1024x512. Use DKC-inspired pre-rendered chunkiness applied to CEHP bureaucratic horror: toy-like silhouettes, hard overhead fluorescent lighting, heavy ambient-occlusion reads, manila paper surfaces, cold cyan spill, bureau navy shadows, and blood-orange warning accents.

Title splash plate for cehp title logo in the wordmark role, bold and readable on first boot.
World anchor: Counterfeit Educational corporate bureaucracy, cheerful surface with procedural dread underneath.

Keep the image aligned to the existing manifest contract. Preserve the exact canvas size, aspect ratio, transparent-background requirement, and filename target. Do not add watermarks, signatures, captions, speech bubbles, UI labels, or new readable copy. Leave enough clean negative space for the Phaser runtime crop and scaling behavior already wired in ART2 and ART3.

When exporting, overwrite only `ACTIVE/game/assets/art/splash/cehp_title_logo_01.png` and then run `node ACTIVE/game/scripts/validate_art_manifest.mjs`.
