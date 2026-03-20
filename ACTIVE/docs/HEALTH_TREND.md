# HEALTH TREND — Repository Health Over Time

> Tracks health score at each sprint boundary.
> If score drops for two consecutive sprints, schedule a tech-debt sprint.
> Updated by Operations agent or `scripts/studio-scan.sh`.

---

| Sprint | Date | Score | Key Changes |
| --- | --- | --- | --- |
| 010 | 2026-03-15 | 72% | Baseline measurement. Dashboard installed. |

---

## Trend Rules

1. Score is calculated by `scripts/studio-scan.sh` (or manually using STUDIO_DASHBOARD.md scoring).
2. Append a new row after every sprint completion.
3. **Two-sprint decline trigger**: if score drops for two consecutive sprints, the Architect must schedule a tech-debt sprint before any new feature work.
4. Target: 85% by Sprint 015.
