AUTO_TASK_ID: AT-001
TITLE: index.html exceeds 16,000 lines — evaluate modularization
DISCOVERY_SOURCE: code scan
DESCRIPTION: index.html is 16,018 lines with ~60 functions, all scenes, save logic, certification aid, and teaching text in one file. This exceeds the 4,000-line signal threshold by 4x. Single-file edits are high-risk and cannot be parallelized.
RECOMMENDED_ACTION: Architect should evaluate whether scene-level extraction (e.g., world2.js, world3.js loaded via script tags) is worth the complexity. No build step should be introduced. Consider only if the single-file pattern becomes a development bottleneck.
FILES_INVOLVED: index.html
ESTIMATED_COMPLEXITY: high
STATUS: DISCOVERED
