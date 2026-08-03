// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site lives at https://fleekelon.github.io/fleekelon/
// Set ASTRO_BASE=/fleekelon/ in CI. Local/dev and root hosts keep "/".
const base = process.env.ASTRO_BASE || "/";

export default defineConfig({
  site: "https://fleekelon.github.io",
  base,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
