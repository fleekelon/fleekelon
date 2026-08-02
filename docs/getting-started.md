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

| Variable       | Default       | Description                             |
| -------------- | ------------- | --------------------------------------- |
| `APP_NAME`     | `fleekelon`   | CLI / app display name                  |
| `NODE_ENV`     | `development` | `development` \| `test` \| `production` |
| `CONTENT_ROOT` | `content`     | Root directory for the content catalog  |
| `LOG_LEVEL`    | `info`        | `debug` \| `info` \| `warn` \| `error`  |

Secrets stay in `.env` (gitignored). Commit only `.env.example`.

## Verify the toolkit

```bash
npm run check
npm run doctor
npm run content:list
npm run content:stats
npm run profile:render
npm run site:build
npm run build
npm start -- help
```

## CLI quick reference

```bash
npm run fleekelon -- help
npm run fleekelon -- greet Frank
npm run fleekelon -- doctor
npm run fleekelon -- content list
npm run fleekelon -- content list --kind=note --tag=investing
npm run fleekelon -- content search "capex bottleneck"
npm run fleekelon -- content tags
npm run fleekelon -- content stats
npm run fleekelon -- content digest
npm run fleekelon -- content validate
npm run fleekelon -- profile render
npm run fleekelon -- profile write
npm run fleekelon -- site build
```

## Add a new article / note

1. Create `content/articles/<id>/` or `content/notes/<id>/`.
2. Add `meta.json` with `id`, `title`, `summary`, `tags`, and `body`.
3. Add the markdown body (and optional PDF for articles).
4. Run `npm run content:validate`.
5. Optionally rebuild the site: `npm run site:build`.
6. Optionally sync the GitHub profile README: `npm run profile:write`.

## Preview the personal site

```bash
npm run site:build
cd sites/fleekelon
python3 -m http.server 4173
```
