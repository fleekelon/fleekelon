# Getting started

## Prerequisites

- Node.js 22+
- npm 10+

## First-time setup

```bash
cp .env.example .env
npm install
```

`npm install` installs dependencies and enables Husky git hooks.

## Environment variables

| Variable       | Default       | Description                                 |
| -------------- | ------------- | ------------------------------------------- |
| `APP_NAME`     | `fleekelon`   | CLI / app display name                      |
| `NODE_ENV`     | `development` | `development` \| `test` \| `production`     |
| `CONTENT_ROOT` | `content`     | Root directory for articles and chat export |
| `LOG_LEVEL`    | `info`        | `debug` \| `info` \| `warn` \| `error`      |

Secrets stay in `.env` (gitignored). Commit only `.env.example`.

## Verify the toolkit

```bash
npm run check
npm run doctor
npm run content:list
npm run profile:render
npm run build
npm start -- help
```

## CLI quick reference

```bash
npm run fleekelon -- help
npm run fleekelon -- greet Frank
npm run fleekelon -- doctor
npm run fleekelon -- content list
npm run fleekelon -- content validate
npm run fleekelon -- profile render
```

## Add a new article

1. Create `content/articles/<id>/`.
2. Add `meta.json` with `id`, `title`, `summary`, `tags`, and `body`.
3. Add the markdown body (and optional PDF).
4. Run `npm run content:validate`.
