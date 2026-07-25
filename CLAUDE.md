# aetheris-ui

> **Inherits:** `~/clawd/CLAUDE.md` (Mike's cross-project preferences), when
> checked out inside the clawd home base. Everything in that file applies
> unless this file explicitly overrides it; `~/clawd/MEMORY.md` carries the
> ecosystem context.

---

## Project overview

**Aetheris UI** — public sandbox-turned-product for premium immersive UI: one
Next.js app that is the lab (`/lab`), the docs/demo site (`/docs/<module>`),
and a shadcn-registry server (`public/r/*.json`) so modules install into any
Next.js app via `npx shadcn add <url>`. Business model = Magic UI/Aceternity
playbook (free registry → paid tier later). Modules must be usable in Aetheris
client sites immediately and double as social content.

- **Status:** active — v1 built + verified (all 8 plan tasks; Codex-reviewed), repo public 2026-07-22; Vercel deploy + domain still pending
- **Active branch:** `main`
- **Production URL:** none yet (target: ui.aetherissolutions.com — install commands and OG metadata already assume it)
- **Repo:** [`Aetheris-Solutions-LLC/aetheris-ui`](https://github.com/Aetheris-Solutions-LLC/aetheris-ui) (public, MIT)

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

**Interaction (motion) verification — read this before debugging "dead" animation.**
A backgrounded Chrome tab reports `visibilityState: "hidden"` and Chrome then
suspends `requestAnimationFrame`. Every animation library goes inert: Motion
springs never tick and never bind transforms, GSAP writes only its initial
value. Driving such a tab over CDP makes perfectly good modules look broken —
this cost a long debugging detour on 2026-07-22. Verify motion with a browser
where rAF actually runs:

```bash
pnpm start -p 4319                              # or dev
BASE=http://localhost:4319 node scripts/verify-interactions.js
```

`scripts/verify-interactions.js` drives real mouse movement via Playwright
(pointed at the system Chrome, no browser download) and asserts on measured
transforms. Extend it whenever a new interactive module lands. Screenshots
still verify layout fine — they just cannot verify motion.
