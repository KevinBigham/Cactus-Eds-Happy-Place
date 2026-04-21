# NEXT TASK (PROPOSED)

This file is the proposal lane. Kevin can promote this to `ACTIVE/docs/NEXT_TASK.md` after signoff.

---

## TASK_ID: CEHP-REBUILD-W6-LAUNCH
## TITLE: Rebuild Week 6 — Launch Week / Cutover / Trailer Final / Outreach / Monitoring
## TASK_OWNER_ROLE: Builder (Codex 5.4)
## CURRENT_STAGE: Proposed overnight on 2026-04-20 for Kevin morning review
## NEXT_HANDLER_ROLE: Kevin (signoff) -> Builder (Codex 5.4)
## STATUS: PROPOSED
## DEADLINE: 2026-05-29

## CONTEXT

Week 5 is locally green and reviewer-cleared. Thermal receipts, THE DOCKET, delivery assets, launch docs, accessibility assist wiring, Discord bot hardening tests, and the Week 5 delivery bundle are in place. Launch week is now an execution week, not a feature week.

This task exists to cut over safely, publish the launch-facing materials Kevin already owns, and keep rollback paths explicit. The public site, bot, and outreach all need to move in a controlled sequence.

## IN SCOPE

1. Final live-domain verification against `counterfeit-educational.org` once Kevin flips DNS
2. Launch-day smoke pass on root route and `?docket=1`
3. Discord bot live-domain verification and one real live-domain PNG render
4. Trailer final packaging + upload support using the approved edit/export
5. Critical Reflex outreach support package finalization
6. Launch-day monitoring ticket / checklist / incident log prep
7. Dry-run rollback rehearsal before public announce

## OUT OF SCOPE

1. Changing `cactusEd_save_v1` schema or v2 migration
2. New worlds, new enemies, new mechanics
3. Any receipt-weight rebalance without an explicit taste note
4. DNS registrar changes without Kevin's direct action
5. Sending public posts without Kevin's direct approval
6. Steam packaging work beyond launch-facing asset prep

## SACRED CONSTRAINTS

- Single-file shipped `index.html` artifact. Source stays modular.
- ES5 only. No `let`, `const`, arrow functions, template literals, spread, or destructuring.
- Phaser 3 via CDN. No bundler.
- `cactusEd_save_v1` contract preserved via v2 migration + archaeological layer.
- Seeded LCG RNG only. Never `Math.random()`.
- Ed voice remains deadpan, `<=8` words per line, no exclamation marks.
- Cigarette stays unlit in all W3 paths.
- `ns.TUNING.JUMP_VELOCITY` global stays untouched.
- No predatory retention. No leaderboard drift. No streak mechanics.

## DEFINITION OF DONE

- [ ] DNS cutover verified on the live domain
- [ ] Live-domain Discord render works end-to-end
- [ ] Trailer published
- [ ] Critical Reflex pitch sent and confirmed
- [ ] Launch-day monitoring ticket is open
- [ ] Rollback plan exercised in dry-run
- [ ] Public announce thread posted

## EXECUTION RULES

- Kevin owns registrar changes, outbound pitch send, and public posting.
- Codex may prepare, verify, rehearse, and document, but must stop at Kevin-gated actions.
- Any launch regression with unclear rollback triggers an immediate stop-and-document response.

## FIRST ACTIONS IF PROMOTED

1. Re-run `cd ACTIVE/game && node build.js && node scripts/check_save_schema.js && bash scripts/verify-cehp.sh`
2. Verify the final DNS values Kevin plans to apply against `ACTIVE/docs/LAUNCH_GO_NOGO.md`
3. Perform live-domain smoke checks immediately after cutover
4. Confirm bot render, trailer link, and outreach packet before Kevin sends anything
