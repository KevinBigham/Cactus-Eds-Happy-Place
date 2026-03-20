AUTO_TASK_ID: AT-002
TITLE: Zero automated test coverage — tests/ directory is empty scaffold
DISCOVERY_SOURCE: build scan
DESCRIPTION: The tests/ directory contains only a .gitkeep placeholder. The save schema validator (scripts/check_save_schema.js) and verify wrapper (scripts/verify-cehp.sh) exist but there are no unit tests, integration tests, or automated gameplay regression tests.
RECOMMENDED_ACTION: Create a minimal test suite starting with save contract validation (SAVE._key shape, field presence) and scene boot smoke tests (Title, Demo, World2, World3 all initialize without errors). Playwright or Puppeteer could automate browser-level smoke.
FILES_INVOLVED: tests/, scripts/check_save_schema.js, scripts/verify-cehp.sh
ESTIMATED_COMPLEXITY: medium
STATUS: DISCOVERED
