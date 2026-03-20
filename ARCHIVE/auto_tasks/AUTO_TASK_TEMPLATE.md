# AUTO TASK TEMPLATE

Copy this template for each new auto-generated task.
Save as: `AT-NNN-short-description.md`

---

```
AUTO_TASK_ID: AT-NNN
TITLE: [short descriptive title]
DISCOVERY_SOURCE: [code scan / build scan / architecture scan / gameplay scan]
DESCRIPTION: [1-3 sentences explaining what was found]
RECOMMENDED_ACTION: [1-3 sentences explaining what to do about it]
FILES_INVOLVED: [list of files]
ESTIMATED_COMPLEXITY: [low / medium / high]
STATUS: DISCOVERED
```

## Status Values
- `DISCOVERED` — generator found this, no one has reviewed it
- `REVIEWED` — Operations looked at it, pending Architect decision
- `APPROVED` — Architect approved, ready to promote to BACKLOG.md or NEXT_TASK.md
- `REJECTED` — not worth pursuing, keep for historical reference
- `PROMOTED` — moved to BACKLOG.md or NEXT_TASK.md, this file is now archival
