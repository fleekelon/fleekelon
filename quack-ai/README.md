# QUACK AI

A satirical product-launch site in the genre of [oryzo.ai](https://oryzo.ai/) (a Lusion creative
project): flagship-hardware launch language applied, deadpan, to a rubber duck. All copy, the
product, and the "model" are original to this repo — nothing is taken from Lusion's site.

## Stack

- **Astro 7** — static shell, sections as `.astro` components, interactivity as islands
- **React 19 + React Three Fiber + drei** — WebGL hero scene (procedural duck, pointer parallax)
- **GSAP + ScrollTrigger** — scroll reveal / stagger / counter system (`src/scripts/scroll.ts`)
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
    three/*.tsx               R3F scene + procedural duck mesh
```

## Commands

```bash
npm install
npm run dev       # dev server on :4321
npm run build     # static build to dist/
npm run preview   # serve the build
npm run check     # astro check (type-checks .astro + .tsx)
```

## Roadmap (the "打磨" phase)

- Replace the primitive-based duck with a sculpted glTF model (Blender), draco-compressed
- Custom shaders: soft-rubber subsurface look, water caustics under the duck
- Gaussian-splat scanned hero variant (Spark / gsplat.js) like the reference site
- Rive state-machine micro-animations for 2D gags
- Scroll-scrubbed camera moves per section (ScrollTrigger timeline driving the R3F camera)
- Loading orchestration, ktx2 texture compression, reduced-motion & mobile fallbacks
