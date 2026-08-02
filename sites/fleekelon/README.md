# fleekelon personal site

Static personal site generated from the repository content catalog.

## Preview

```bash
# from repo root
npm run site:build
cd sites/fleekelon
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Source of truth

- Content lives in `content/`
- Templates / CSS / JS generation live in `src/site/`
- Rebuild with `npm run site:build` (or `npm run fleekelon -- site build`)

Do not hand-edit generated `*.html` files for long; change the catalog or templates and rebuild.
