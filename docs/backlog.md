# Backlog — unfinished draft work

This repository accumulated several draft PRs before the toolkit existed. This branch rescues the portable pieces and leaves site-specific demos for dedicated repos.

## Rescued into this branch

| Former draft PR | Status on this branch                                      |
| --------------- | ---------------------------------------------------------- |
| #2 Article      | Imported into `content/articles/ai-execution-vs-judgment/` |
| #5 Chat export  | Imported markdown into `content/chat-export/`              |
| #6 Scaffold     | Expanded into the toolkit baseline                         |

## Still separate on purpose

| Former draft PR            | Recommendation                                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| #3 Wormhole corporate site | Finish in [`wormhole-tax-website`](https://github.com/fleekelon/wormhole-tax-website), not this profile/toolkit repo |
| #4 AERA cinematic landing  | Keep as a demo in its own branch/repo; do not merge into the profile root                                            |
| #1 Empty-repo AGENTS note  | Superseded by real toolchain docs once this lands                                                                    |

## Next large follow-ups

1. Port Wormhole report-reader improvements from PR #3 into `wormhole-tax-website`.
2. Add `profile:write` to sync rendered markdown into `README.md` intentionally.
3. Optional: publish the CLI as a private executable with richer investing/note workflows.
