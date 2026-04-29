# W12 Replay Hashes

Date: 2026-04-29
Owner: Codex

## P6 Fixture Targets

Revision 2 redirected P6 away from unbuilt mini-bosses/setpieces and toward actual completion paths from the P2 receipt audit. The three new fixtures cover under-represented flag-state paths:

- `w2_benefits_default_completion.json` - Benefits default completion, no premium/uninsured flag.
- `w3_rasta_dark_cigarette.json` - Rasta dark-cigarette baseline, `cigaretteLit=false`.
- `w3_rasta_rest_open.json` - Rasta rest-open completion, `restOpened=true` and `cigaretteLit=false`.

## Gold MD5s

The full 10-fixture corpus produced the same md5 sequence after three replay runs on 2026-04-29.

| Fixture | MD5 |
| --- | --- |
| `test_room_obedient.json` | `8ed8ad52b7cf5d9527f6ffa72acc50a2` |
| `w1_orientation_obedient.json` | `959e9ea8165a6e07ba7f88086c87e363` |
| `w2_benefits_atrium_partial.json` | `83350e61d274787443ea882bccf1eb19` |
| `w2_benefits_default_completion.json` | `37fee2643be901fa1757daa996e36d9e` |
| `w2_benefits_insured.json` | `bbacf3e1b817827f3391e01f17bd4f26` |
| `w2_benefits_uninsured.json` | `33ead17d29a3429bb07e77a7e8b852ef` |
| `w3_rasta_dark_cigarette.json` | `4bc2b923c92d76c903468c7acb081150` |
| `w3_rasta_rest_open.json` | `31cff301a90e4e1fd32ee45625d92bc0` |
| `w3_rasta_rushed.json` | `a412c8427605feef317987764b0a018b` |
| `w3_rasta_short.json` | `6812183919a381e6dc1f4e6e05febbf7` |

## Verification

```text
for run in 1 2 3; do
  npm run --prefix ACTIVE/game test:replay
  md5 -q ACTIVE/game/_canon/replays/cehp/*.json
done
```

Each run ended `SUMMARY PASS 10/10`, and all three md5 sequences matched exactly.
