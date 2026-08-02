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

| Variable   | Default       | Description                             |
| ---------- | ------------- | --------------------------------------- |
| `APP_NAME` | `fleekelon`   | Display/app name used by the sample     |
| `NODE_ENV` | `development` | `development` \| `test` \| `production` |

Secrets stay in `.env` (gitignored). Commit only `.env.example`.

## Verify the scaffold

```bash
npm run check
npm run build
npm start
```

You should see a greeting printed from the sample app.

## Extend the scaffold

1. Add modules under `src/`.
2. Add corresponding tests under `tests/`.
3. Keep public entrypoints thin (`src/index.ts`).
4. Prefer pure functions for domain logic so tests stay fast.
