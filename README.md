# Aetheris UI

**Premium, installable UI modules for Next.js** — motion, scroll, and shader
components you add in one command. Light-first, brand-tokenized, accessible,
and built in public by [Aetheris](https://www.aetherissolutions.com).

This repo is three things at once:

- **The registry** — every module in `registry/` is installable into any
  Next.js + Tailwind app via the shadcn CLI
- **The docs site** — [ui.aetherissolutions.com](https://ui.aetherissolutions.com):
  live demos, install commands
- **The lab** — [/lab](https://ui.aetherissolutions.com/lab): public
  experiments, rough edges on purpose. When one holds up, it graduates into
  the registry.

## Modules

| Module | Engine | What it does |
|---|---|---|
| **Aura Card** | [Motion](https://motion.dev) | Cursor-aware card with a light-catching glow. Calm by default, alive on hover. |
| **Sequence Scroll** | [GSAP ScrollTrigger](https://gsap.com/scrolltrigger/) | A pinned narrative section that scrubs through its steps as you scroll, then releases cleanly. |
| **Lumen Hero** | [React Three Fiber](https://r3f.docs.pmnd.rs) | Full-bleed shader hero — a flowing iridescent light field, with the headline in the DOM for a11y and SEO. |

## Install

```bash
npx shadcn add https://ui.aetherissolutions.com/r/aura-card.json
npx shadcn add https://ui.aetherissolutions.com/r/sequence-scroll.json
npx shadcn add https://ui.aetherissolutions.com/r/lumen-hero.json
```

Each module lands as source in your project — restyle it, rewrite it, own it.
Colors read from `--aui-*` CSS variables with sensible fallbacks, so a module
drops into any brand by redefining a handful of tokens (scoped globally or on
a wrapper).

## The quality bar

Every registry module ships with:

- A `prefers-reduced-motion` fallback — the design degrades to calm, not broken
- WCAG AA contrast in the default theme, visible keyboard focus
- Tokens-only colors — no hardcoded brand hex
- A clean install into a fresh `create-next-app` with only its declared deps
- For WebGL modules: capped pixel ratio, visibility-pause, and a static
  no-WebGL fallback

## Develop

```bash
pnpm install
pnpm dev             # site at localhost:3000
pnpm registry:build  # rebuild public/r/*.json from registry.json
pnpm typecheck && pnpm lint && pnpm build
```

A module is one folder: `registry/<name>/{<name>.tsx, demo.tsx, doc.mdx}`,
indexed in `registry.json` — the site gallery, docs pages, and installable
artifacts all derive from that one index.

## License

[MIT](LICENSE) — use the modules in anything, including client work.
