# Backlog — repo hygiene

Draft PR cleanup completed on 2026-08-02.

## Closed / cleaned

| PR                         | Result                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| #1 Empty-repo AGENTS note  | Closed; branch deleted (superseded by toolkit docs)                                          |
| #2 Article                 | Closed; branch deleted (content on `main`)                                                   |
| #3 Wormhole corporate site | Closed; branch deleted (upgraded copy in `sites/wormhole-tax-website/`)                      |
| #4 AERA cinematic landing  | Closed; **branch kept** (`cursor/aera-cinematic-landing-a525`) until a dedicated repo exists |
| #5 Chat export             | Closed; branch deleted (markdown on `main`)                                                  |
| #6 Scaffold / toolkit      | Merged; branch deleted                                                                       |

## Still open

| PR                      | Status                                                          |
| ----------------------- | --------------------------------------------------------------- |
| #7 Wormhole site import | Open draft — temporary copy under `sites/wormhole-tax-website/` |

## Remaining branches

```text
main
cursor/wormhole-site-import-05c9   # PR #7
cursor/aera-cinematic-landing-a525 # preserved for move-out
```

## Next follow-ups

1. Decide PR #7: merge as temporary site copy, or sync directly into `wormhole-tax-website` and close.
2. Create `fleekelon/aera-landing`, push `aera-site/` from `cursor/aera-cinematic-landing-a525`, then delete that branch.
3. Optional toolkit: `profile:write` to sync rendered markdown into `README.md`.
