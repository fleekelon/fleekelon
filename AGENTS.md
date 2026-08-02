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
- `npm run content:validate` — validate articles / notes / chat exports
- `npm run content:search -- <query>` — search the catalog
- `npm run profile:render` — print the generated profile README
- `npm run profile:write` — sync generated README into `README.md`
- `npm run site:build` — build the personal site under `sites/fleekelon`
- `npm run fleekelon -- help` — CLI help

### Boundaries

- Keep engineering tooling and content catalog here.
- Personal site output may live under `sites/fleekelon/`.
- Do not merge unrelated marketing demos (for example AERA) into the repo root.
- Wormhole corporate website work belongs in `fleekelon/wormhole-tax-website` (a `sites/` staging copy is only a sync bridge when the dedicated repo is not writable).
