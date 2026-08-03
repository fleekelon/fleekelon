# QUACK AI

A satirical product-launch site in the genre of [oryzo.ai](https://oryzo.ai/) (a Lusion creative
project): flagship-hardware launch language applied, deadpan, to a rubber duck. All copy, the
product, and the "model" are original to this repo — nothing is taken from Lusion's site.

## Stack

- **Astro 7** — static shell, sections as `.astro` components, interactivity as islands
- **React 19 + React Three Fiber + drei** — WebGL hero (Khronos Duck glTF + clearcoat materials)
- **GSAP + ScrollTrigger** — scroll reveal / stagger / counter system, plus cinematic camera scrub
- **Tailwind CSS 4** — design tokens live in `src/styles/global.css` under `@theme`

## Architecture

```
src/
  layouts/Base.astro          html shell, fonts, global css, scroll-animation bootstrap
  pages/index.astro           section order for the one-pager
  styles/global.css           design system: palette, type scale, surfaces, motion
  scripts/scroll.ts           data-attribute driven GSAP animations
  components/
    sections/*.astro          static sections (server-rendered, zero JS)
    islands/*.tsx             interactive React islands (chat gag, temperature lab, cipher)
    three/
      DuckScene.tsx           Canvas + sticky-hero ScrollTrigger → --cine-p
      CameraRig.tsx           scrubbed camera / duck pose from scroll progress
      Duck.tsx                glTF loader + clearcoat material override
      scrollProgress.ts       camera keyframe table + lerp
public/models/duck.glb        Khronos sample Duck (see ATTRIBUTION.md)
```

## Commands

```bash
npm install
npm run dev          # dev server on :4321
npm run build        # static build to dist/ (base "/")
npm run build:pages  # build with base "/fleekelon/" for GitHub Pages
npm run preview      # serve the build
npm run check        # astro check (type-checks .astro + .tsx)
```

## Public URL

**Primary (Vercel):** https://quack-ai-nu.vercel.app/


Stable production deploy (GitHub Pages):

**https://fleekelon.github.io/fleekelon/**

The workflow (`.github/workflows/deploy-quack-ai.yml`) publishes the built site
to the `gh-pages` branch on every push that touches `quack-ai/`.

**First-time enable (one click):** repo **Settings → Pages → Build and
deployment → Source → Deploy from a branch → Branch `gh-pages` / folder `/
(root)` → Save**. After that the URL above stays live and updates on each
deploy.

## Roadmap (further polish)

- [x] glTF product mesh (Khronos Duck placeholder; swap for a custom Blender sculpt anytime)
- [x] Scroll-scrubbed cinematic camera in the sticky hero
- [x] Soft-rubber SSS shader (`SoftRubberMaterial.ts` via `onBeforeCompile`)
- [x] Loading orchestration (preload + branded boot splash + deferred scroll reveals)
- [ ] Water caustics under the duck / stronger environment lighting
- [ ] Gaussian-splat scanned hero variant (Spark / gsplat.js) like the reference site
- [ ] Rive state-machine micro-animations for 2D gags
- [ ] ktx2 texture compression, stronger mobile DPR / reduced-motion fallbacks
