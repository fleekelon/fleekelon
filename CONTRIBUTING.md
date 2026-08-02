# Contributing

## Setup

1. Use Node.js 22+ (see `.nvmrc`).
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and adjust values for local work.
4. Run `npm run check` before opening a PR.

## Workflow

1. Create a branch from `main`.
2. Make a focused change with tests when behavior changes.
3. Keep commits clear and reviewable.
4. Open a PR using the repository template.

## Quality gates

Local and CI both expect:

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm test`
- `npm run content:validate`
- `npm run build`

Pre-commit hooks run ESLint/Prettier on staged files via lint-staged.

## Content changes

- Put long-form writing under `content/articles/<id>/`.
- Put archived conversations under `content/chat-export/`.
- Always include `meta.json`.
- Run `npm run content:validate` after edits.

## Documentation

- Keep the root `README.md` useful as a GitHub profile surface.
- Put deeper engineering notes in `docs/`.
- Prefer short, concrete acceptance criteria in issues and PRs.
