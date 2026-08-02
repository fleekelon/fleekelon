# fleekelon

Personal engineering scaffold for Node.js + TypeScript projects.

This repo is meant to be reused as a starting point: lint/format, tests, CI, env config, and documentation templates are already wired so new work can focus on product code instead of setup.

## What's included

- TypeScript (strict) with ESM (`NodeNext`)
- ESLint + Prettier + EditorConfig
- Vitest + coverage
- Husky + lint-staged pre-commit checks
- GitHub Actions CI (`typecheck` / `lint` / `format` / `test` / `build`)
- `.env.example` for local configuration
- Issue / PR templates and contributor docs

## Quick start

```bash
cp .env.example .env
npm install
npm run check
npm run dev
```

## Common scripts

| Script              | Purpose                                |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Run `src/index.ts` with watch mode     |
| `npm run build`     | Compile to `dist/`                     |
| `npm start`         | Run the compiled app                   |
| `npm run typecheck` | TypeScript no-emit check               |
| `npm run lint`      | ESLint                                 |
| `npm run format`    | Prettier write                         |
| `npm test`          | Vitest once                            |
| `npm run check`     | typecheck + lint + format check + test |

## Project layout

```text
src/                 application source
tests/               unit tests
docs/                project documentation
.github/             CI, PR, and issue templates
```

## Using this as a template

1. Clone or use **Use this template** on GitHub.
2. Rename the package in `package.json`.
3. Update `APP_NAME` in `.env.example`.
4. Replace the sample `src/` modules with your domain code.
5. Keep `npm run check` green before opening a PR.

More detail: [docs/getting-started.md](docs/getting-started.md).
