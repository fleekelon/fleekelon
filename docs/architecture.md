# Architecture

## Goals

- Reusable personal engineering baseline (lint, test, CI, docs)
- A CLI that manages content, profile rendering, and site generation
- Rescue unfinished notes into a validated content catalog
- Keep domain logic pure and easy to test

## Runtime shape

```text
src/index.ts                 CLI entrypoint
src/cli/                     argument parsing and command routing
src/content/                 catalog, validation, search, stats, digest
src/profile/                 GitHub profile README renderer
src/site/                    personal site builder + markdown renderer
src/invest/                  thesis / decision / prediction scaffolds
src/lib/                     result / fs / logger helpers
content/articles/            long-form writing
content/notes/               shorter field notes (+ decision/prediction memos)
content/theses/              investment / strategy theses
content/chat-export/         archived conversations
sites/fleekelon/             generated personal site
sites/aera-landing/          AERA marketing demo (staging only)
```

## Command flow

```text
argv -> parseArgs -> runCli -> command module -> stdout/stderr + exit code
```

Commands return process exit codes:

- `0` success
- `1` validation / usage / doctor failure

## Content model

Supported kinds:

| Kind          | Directory             | Default body    |
| ------------- | --------------------- | --------------- |
| `article`     | `content/articles/*`  | `article.md`    |
| `note`        | `content/notes/*`     | `note.md`       |
| `thesis`      | `content/theses/*`    | `thesis.md`     |
| `chat-export` | `content/chat-export` | `transcript.md` |

Each item directory contains:

- `meta.json` — id, title, summary, tags, body, optional pdf
- markdown body file
- optional PDF companion (articles)

Legacy layout still supported: a single `meta.json` directly under `content/chat-export/`.

`content validate` enforces minimum body length and reports missing tags / headings as warnings.
`content search` ranks id/title/summary/tags/body matches.
`content digest` renders a markdown snapshot of the catalog.

## Profile + site

- `profile render` prints README markdown derived from catalog + defaults
- `profile write` syncs that markdown into `README.md`
- `site build` regenerates `sites/fleekelon` HTML/CSS/JS from the catalog

## Tooling boundaries

| Concern    | Tool                       |
| ---------- | -------------------------- |
| Language   | TypeScript + Node ESM      |
| Unit tests | Vitest                     |
| Lint       | ESLint (typescript-eslint) |
| Format     | Prettier                   |
| Git hooks  | Husky + lint-staged        |
| CI         | GitHub Actions             |

## Conventions

- Keep `package.json` scripts as the single command interface.
- Prefer adding docs over inventing one-off setup scripts.
- Fail CI on format drift, type errors, test failures, and content validation errors.
- Keep marketing demos (AERA) and the Wormhole corporate site out of the profile root; stage publishable site copies under `sites/` only when intentional.
