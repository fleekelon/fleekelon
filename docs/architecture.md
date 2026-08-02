# Architecture

## Goals

- Strict TypeScript defaults that catch mistakes early
- Fast local feedback (`typecheck`, `lint`, `test`)
- CI parity with local `npm run check`
- Clear place for docs and GitHub process templates

## Runtime shape

```text
src/config.ts      load and validate environment-backed settings
src/greeting.ts    sample domain logic
src/index.ts       process entrypoint
tests/             behavior coverage for src modules
```

The sample app is intentionally tiny. Replace domain modules without changing the tooling layer unless requirements demand it.

## Tooling boundaries

| Concern      | Tool                         |
| ------------ | ---------------------------- |
| Language     | TypeScript + Node ESM        |
| Unit tests   | Vitest                       |
| Lint         | ESLint (typescript-eslint)   |
| Format       | Prettier                     |
| Editor norms | EditorConfig + VS Code prefs |
| Git hooks    | Husky + lint-staged          |
| CI           | GitHub Actions               |

## Conventions

- Keep `package.json` scripts as the single command interface.
- Prefer adding docs over inventing one-off setup scripts.
- Fail CI on format drift and type errors, not only test failures.
