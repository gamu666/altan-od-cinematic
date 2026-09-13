# Алтан Заан Анар — Cinematic 3D prototype

Desktop-first, scroll-driven product presentation for **Алтан Заан Анар** and **Алтан Од / Golden Star** Vietnamese balm.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Production check:

```bash
pnpm lint
pnpm build
pnpm start
```

## Stack

- Next.js App Router + TypeScript
- React Three Fiber / Three.js
- Drei model loading and contact shadows
- GSAP ScrollTrigger for the single continuous scroll timeline

## Experience structure

1. Dark opening and product reveal
2. Scroll-driven 3/4 rotation and camera dolly
3. Macro label close-up
4. Ingredient particle atmosphere
5. Vietnam → Mongolia light-path transition
6. Supply-scale product multiplication
7. Алтан Заан Анар company reveal
8. Final contact frame

The brochure is not shipped as a site asset and none of its imagery is used. It was referenced only for product history, ingredient names, company contact details, and address.

See [`MODEL_AUDIT.md`](./MODEL_AUDIT.md) for the GLB inspection notes and animation implications.
