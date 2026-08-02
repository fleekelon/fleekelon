# Backlog — unfinished draft work

This repository accumulated several draft PRs before the toolkit existed. Portable pieces were rescued into the content catalog; site-specific demos stay separate.

## Rescued into the toolkit

| Former draft / source | Status                                                     |
| --------------------- | ---------------------------------------------------------- |
| #2 Article            | `content/articles/ai-execution-vs-judgment/`               |
| #5 Chat export        | `content/chat-export/`                                     |
| #6 Scaffold           | Expanded into the toolkit baseline                         |
| US-tech chat distill  | Articles: investing framework, personal system; Apple note |
| Wormhole report       | Article: `cross-border-tax-playbook`                       |
| Judgment follow-ups   | Article: `influence-verification-practice`; taxonomy note  |

## Still separate on purpose

| Former draft PR            | Recommendation                                                                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| #3 Wormhole corporate site | Finish in [`wormhole-tax-website`](https://github.com/fleekelon/wormhole-tax-website); draft staging may live under `sites/` only as a sync bridge |
| #4 AERA cinematic landing  | Keep as a demo in its own branch/repo; do not merge into the profile root                                                                          |
| #1 Empty-repo AGENTS note  | Superseded by real toolchain docs                                                                                                                  |

## Done in the personal OS pass

1. Extended content kinds: articles / notes / theses / chat exports
2. `content search|tags|stats|digest`
3. `profile write` syncs rendered markdown into `README.md`
4. `site build` generates `sites/fleekelon` from the catalog

## Next follow-ups

1. Port Wormhole report-reader improvements into `wormhole-tax-website` when write access is available.
2. Re-fetch blocked cloud transcripts (taste/feeling, emotion/platform, taxonomy source chats) and archive under `content/chat-export/<id>/`.
3. Optional: publish the CLI as a private executable with richer investing workflows (decision log templates, prediction ledger).
4. Optional: create dedicated `aera-landing` repo from `cursor/aera-cinematic-landing-a525`.
