# AERA — Autonomy, Engineered

Cinematic marketing landing page for **Aera Motor Co.**

Stack: Vite + React + TypeScript + Tailwind CSS + GSAP.

> Staging copy inside the personal toolkit repo. Target dedicated repository: `fleekelon/aera-landing` (Cloud Agent cannot create it: `createRepository` is blocked).

## Run

```bash
cd sites/aera-landing
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Promote to dedicated repo

A root-level export branch is already on GitHub:

**`aera-landing-export`** (site files at repo root)

On a machine with write access:

```bash
gh repo create fleekelon/aera-landing --public \
  --description "AERA Motor Co. cinematic marketing landing (Vite + React + GSAP)"

git clone https://github.com/fleekelon/aera-landing.git
cd aera-landing
git remote add source https://github.com/fleekelon/fleekelon.git
git fetch source aera-landing-export
git checkout -B main source/aera-landing-export
git push -u origin main
```

Or copy this directory:

```bash
rsync -a --delete \
  --exclude node_modules --exclude dist --exclude .git \
  sites/aera-landing/ \
  ../aera-landing/
```

Do **not** merge AERA into the fleekelon profile root.
