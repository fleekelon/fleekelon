# Agent notes

## Cursor Cloud specific instructions

This repository is a personal GitHub profile + TypeScript toolkit.

### Bootstrap

```bash
cp .env.example .env
npm install
npm run check
```

### Useful commands

- `npm run doctor` — verify Node version and required paths
- `npm run content:validate` — validate articles / chat exports
- `npm run profile:render` — print the generated profile README
- `npm run fleekelon -- help` — CLI help

### Boundaries

- Keep engineering tooling and content catalog here.
- Do not merge unrelated marketing demos (for example AERA) into the repo root.
- Wormhole corporate website source-of-truth copy lives in `sites/wormhole-tax-website/`.
  Sync it to `fleekelon/wormhole-tax-website` when that repo is writable.
