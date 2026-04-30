# ART4 Prompt Sidecar

Asset key: `cehp_art:enemies:reply_all_locust:swarm:01`
Manifest path: `assets/art/enemies/locust_swarm_01.png`
Target dimensions: `1024x576`
Transparent background: `yes`
Manifest order: `16/37`

## Image Generation Prompt

Create one production PNG for Cactus Ed's Happiest Place at exactly 1024x576. Use DKC-inspired pre-rendered chunkiness applied to CEHP bureaucratic horror: toy-like silhouettes, hard overhead fluorescent lighting, heavy ambient-occlusion reads, manila paper surfaces, cold cyan spill, bureau navy shadows, and blood-orange warning accents.

Enemy plate for reply all locust in the swarm state, readable at small in-game scale and separated from the background.
World anchor: Rasta corporate logistics, warehouse bureaucracy, green-cyan spill, blood-orange warning accents.

Keep the image aligned to the existing manifest contract. Preserve the exact canvas size, aspect ratio, transparent-background requirement, and filename target. Do not add watermarks, signatures, captions, speech bubbles, UI labels, or new readable copy. Leave enough clean negative space for the Phaser runtime crop and scaling behavior already wired in ART2 and ART3.

When exporting, overwrite only `ACTIVE/game/assets/art/enemies/locust_swarm_01.png` and then run `node ACTIVE/game/scripts/validate_art_manifest.mjs`.
