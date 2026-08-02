# fleekelon personal site

Static personal site generated from the repository content catalog.

## Live URL

After GitHub Pages is enabled (Settings → Pages → Deploy from branch `gh-pages` / root, **or** Source = GitHub Actions):

**https://fleekelon.github.io/fleekelon/**

Until Pages is enabled, CDN mirror of this branch:

**https://cdn.jsdelivr.net/gh/fleekelon/fleekelon@gh-pages/index.html**

## Local preview

```bash
# from repo root
npm run site:build
cd sites/fleekelon
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Source of truth

- Content lives in `content/`
- Templates / CSS / JS generation live in `src/site/`
- Rebuild with `npm run site:build` (or `npm run fleekelon -- site build`)
- CI workflow `.github/workflows/pages.yml` rebuilds and deploys on push to `main`

Do not hand-edit generated `*.html` files for long; change the catalog or templates and rebuild.
