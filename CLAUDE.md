# aetheris-ui

> **Inherits:** [`/Users/michaelrobinson/clawd/CLAUDE.md`](../../CLAUDE.md) (Mike's cross-project preferences).
> Everything in the home-base file applies unless this file explicitly overrides it.
> Project-level memory: [`/Users/michaelrobinson/clawd/MEMORY.md`](../../MEMORY.md) for ecosystem context.

---

## Project overview

**Aetheris UI** — public sandbox-turned-product for premium immersive UI: one
Next.js app that is the lab (`/lab`), the docs/demo site (`/docs/<module>`),
and a shadcn-registry server (`public/r/*.json`) so modules install into any
Next.js app via `npx shadcn add <url>`. Business model = Magic UI/Aceternity
playbook (free registry → paid tier later). Modules must be usable in Aetheris
client sites immediately and double as social content.

- **Status:** setup — spec + plan approved, build not started
- **Active branch:** `main`
- **Production URL:** none (target: ui.aetherissolutions.com)
- **Repo:** local-only — public repo `Aetheris-Solutions-LLC/aetheris-ui` requires Mike's explicit go before creation/push

## Stack

- **Framework:** Next.js (App Router, Server Components)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind v4 + shadcn/ui conventions
- **Animation:** Motion (UI micro) · GSAP + ScrollTrigger + Lenis (scroll) · React Three Fiber + drei (3D/shader)
- **Runtime:** Node.js
- **Database / auth / payments:** none (v1)
- **Hosting:** Vercel (not yet created)
- **Package manager:** pnpm

## Key commands (run from project root)

```bash
pnpm dev             # dev server
pnpm build           # production build
pnpm typecheck       # tsc --noEmit
pnpm lint            # eslint
pnpm registry:build  # shadcn build → public/r/<name>.json
```

## Architecture notes

- `registry.json` (root) is the single source of truth; the site gallery/docs
  AND the installable artifacts both derive from it (`lib/registry.ts`).
- Module = self-contained folder `registry/<name>/{<name>.tsx, demo.tsx, doc.mdx}`.
- Maturity: `lab` (only on /lab pages) vs `registry` (installable, meets quality bar).
- **LIGHT-first** — matches Mike's premium/bold/immersive-but-LIGHT direction; brand colors only via `--aui-*` CSS variables.

## Quality bar (every registry module)

`prefers-reduced-motion` fallback · WCAG AA default contrast · visible focus ·
tokens-only colors · works in a fresh create-next-app via scratch-install test ·
R3F: dpr capped [1,2] + no-WebGL static fallback.

## Docs

- Spec: `docs/superpowers/specs/2026-07-20-aetheris-ui-registry-design.md`
- Plan: `docs/superpowers/plans/2026-07-20-aetheris-ui-v1.md` (8 tasks)

## Verification before "done"

typecheck + lint + build + render the changed surface in a real browser +
scratch-app `shadcn add` install for any registry module touched.
