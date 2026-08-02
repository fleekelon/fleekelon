# Architecture

## Goals

- Reusable personal engineering baseline (lint, test, CI, docs)
- A small CLI that manages content and profile rendering
- Rescue unfinished notes into a validated content catalog
- Keep domain logic pure and easy to test

## Runtime shape

```text
src/index.ts                 CLI entrypoint
src/cli/                     argument parsing and command routing
src/content/                 catalog loading + validation
src/profile/                 GitHub profile README renderer
src/lib/                     result / fs / logger helpers
content/articles/            long-form writing
content/chat-export/         archived conversations
```

## Command flow

```text
argv -> parseArgs -> runCli -> command module -> stdout/stderr + exit code
```

Commands return process exit codes:

- `0` success
- `1` validation / usage / doctor failure

## Content model

Each content directory contains:

- `meta.json` — id, title, summary, tags, body, optional pdf
- markdown body file
- optional PDF companion for articles

`content validate` enforces minimum body length and reports missing tags / headings as warnings.

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
