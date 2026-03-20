AUTO_TASK_ID: AT-004
TITLE: Save contract already tracks stats — achievement system is low-hanging fruit
DISCOVERY_SOURCE: gameplay scan
DESCRIPTION: The save contract already persists totalKills, deaths, runs, and bestTime. These fields can power a lightweight achievement system with zero save-schema changes. Examples: "Died 10 times" = "Ed's Worst Day", "Zero deaths W1" = "Untouchable", "bestTime under 120s" = "Speedrunner".
RECOMMENDED_ACTION: Architect should define 5-10 achievements using existing save fields. Builder adds a check-and-display layer in the Title scene. No save contract changes needed.
FILES_INVOLVED: index.html (SAVE object, Title scene)
ESTIMATED_COMPLEXITY: low
STATUS: DISCOVERED
