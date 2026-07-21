# Aetheris UI — premium module registry + lab (design)

Date: 2026-07-20 · Status: approved by Mike (conversation) · Author: Claude + Mike

## What this is

A public sandbox-turned-product for premium, immersive UI work: one Next.js
app that is simultaneously (1) the **lab** where we experiment with UI
strategies, (2) the **docs/demo site** that shows finished modules, and
(3) a **shadcn-registry server** so any Next.js app — ours or a customer's —
installs a module with `npx shadcn add @aetheris-ui/<name>`.

The business model is the Magic UI / Aceternity playbook: free installable
modules build audience and market the agency; a paid tier (gated registry
items) becomes the product once there's critical mass. Decisions locked with
Mike: **component-registry product shape**, **public from day 1**, name
**Aetheris UI**.

Dual purpose from day one: every module must be usable in Aetheris client
sites immediately, and every module doubles as social content (reel/tweet in
the jerrythewebdev style) for the Aetheris X account.

## Stack

- Next.js (App Router) + TypeScript strict + Tailwind v4 + shadcn/ui conventions
- **Motion** (Framer Motion) — UI-level micro-interaction modules
- **GSAP + ScrollTrigger + Lenis** — scroll-choreography modules
- **React Three Fiber + drei** — 3D/shader modules
- Vercel hosting; pnpm

Light-first theming per Mike's direction (premium/bold/immersive but LIGHT);
per-module CSS-variable brand tokens so modules restyle to any client brand.

## Module anatomy

One folder per module under `registry/<name>/`:

```
registry/liquid-hero/
  liquid-hero.tsx      # the module (self-contained; deps declared)
  demo.tsx             # canonical demo used by the docs page
  doc.mdx              # what it is, props table, usage, install command
```

`registry.json` at repo root indexes every module (shadcn registry protocol:
name, type, files, dependencies, registryDependencies). The docs site reads
the same index — one source of truth.

**Maturity levels:** `lab` (anything goes; renders only on /lab pages) and
`registry` (installable; meets the quality bar). Graduation = moving the
folder + adding the registry entry. That is the entire governance model.

**Quality bar for `registry` modules:**
- Works in a fresh `create-next-app` + Tailwind v4 install with only the
  declared deps
- `prefers-reduced-motion` fallback (no motion-sickness hostage-taking)
- WCAG AA contrast in default theme; keyboard focus visible where interactive
- Brand-tokenized colors (CSS variables, no hardcoded brand hex)
- 60fps on an M-series laptop AND no jank on a mid-tier phone (R3F modules:
  pixel-ratio capped, degrades gracefully — same discipline as the
  AetherisSite pearl perf batch)

## Site surfaces

- `/` — marketing + module gallery (the storefront)
- `/docs/<module>` — live demo, props, install command (generated from the
  registry index + doc.mdx)
- `/lab` — public playground; rough experiments, clearly labeled

## v1 scope (first build)

1. App shell + registry wiring (registry.json served per shadcn protocol,
   verified by installing a module into a scratch app)
2. Three modules spanning the three animation stacks:
   - **R3F hero scene** — shader-driven, in the visual family of the
     AetherisSite pearl
   - **Scroll-choreography section** — pinned + scrubbed narrative section
     (GSAP/ScrollTrigger + Lenis)
   - **Cursor-aware premium card** (Motion) — extraction/evolution of the PCI
     cursor-spotlight hover already built
3. /lab with at least one rough experiment beyond the three modules

## Non-goals (v1)

- No npm packages / monorepo — copy-in registry only
- No payments, licensing, or pro gating — free modules only until catalog
  justifies a paid tier
- No full site templates
- No CMS; doc.mdx in-repo is the docs system

## Infra & repo

- New public repo `Aetheris-Solutions-LLC/aetheris-ui` (creation + first push
  requires Mike's explicit go — nothing published until then)
- Local home: `~/clawd/projects/aetheris-ui/`
- Vercel project on the Aetheris team; domain decision deferred (likely
  ui.aetherissolutions.com to start)
- MIT license for free modules
- Seeds the marketing versions ledger on first prod deploy

## Success criteria

- `npx shadcn add` of each v1 module into a clean Next.js app compiles and
  renders with zero manual fixes
- All three v1 modules pass the quality bar checklist
- Site live with gallery + 3 docs pages + lab
- At least one module shipped into a real Aetheris client surface
- Three module-drop posts published from the build
