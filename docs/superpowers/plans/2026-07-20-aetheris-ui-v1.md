# Aetheris UI v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Aetheris UI registry site — lab + docs + shadcn-registry server — with three installable premium modules.

**Architecture:** One Next.js App Router app. Module source lives in `registry/<name>/`; a root `registry.json` indexes it (shadcn registry protocol) and `npx shadcn build` emits installable JSON to `public/r/`. The docs site and the registry read the same index — one source of truth. Experiments live under `/lab` and graduate into the registry.

**Tech Stack:** Next.js (App Router) · TypeScript strict · Tailwind v4 · Motion (framer-motion successor pkg `motion`) · GSAP + ScrollTrigger + Lenis · React Three Fiber + drei · pnpm · Vercel.

## Global Constraints

- Light-first theme; brand colors only via CSS variables prefixed `--aui-` (no hardcoded brand hex in module source)
- Every registry module: `prefers-reduced-motion` fallback, WCAG AA default contrast, visible keyboard focus on interactive elements
- R3F modules: `dpr` capped at `[1, 2]`, must degrade gracefully (no WebGL → static fallback)
- Module folders are self-contained: `registry/<name>/{<name>.tsx, demo.tsx, doc.mdx}`
- Node runtime (not Edge) for all routes; TypeScript strict; pnpm only
- Local commits only — repo creation/push to `Aetheris-Solutions-LLC/aetheris-ui` requires Mike's explicit go
- Verification of anything visual = rendered in a real browser, not inferred from a green build

---

### Task 1: App scaffold

**Files:**
- Create: entire Next.js app at repo root (`app/`, `package.json`, `tsconfig.json`, `postcss.config.mjs`, `app/globals.css`)
- Create: `.gitignore` (Next defaults), `LICENSE` (MIT)

**Interfaces:**
- Produces: running Next app; `app/globals.css` exporting the `--aui-*` token set consumed by every later task.

- [ ] **Step 1: Scaffold** (run inside `~/clawd/projects/aetheris-ui/`, which already contains `CLAUDE.md` + `docs/` — scaffold into a temp dir and merge, keeping existing files)

```bash
cd ~/clawd/projects/aetheris-ui
pnpm dlx create-next-app@latest .aui-tmp --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-pnpm
rsync -a --ignore-existing .aui-tmp/ ./ && rm -rf .aui-tmp
```

- [ ] **Step 2: Define brand tokens** — replace the `:root` block in `app/globals.css` with:

```css
:root {
  --aui-bg: oklch(0.985 0.002 90);
  --aui-fg: oklch(0.205 0.02 270);
  --aui-muted: oklch(0.55 0.015 270);
  --aui-accent: oklch(0.62 0.19 265);   /* electric indigo — placeholder brand */
  --aui-accent-2: oklch(0.75 0.14 210); /* sky — secondary */
  --aui-surface: oklch(1 0 0);
  --aui-radius: 1rem;
}
```

- [ ] **Step 3: Verify dev server** — `pnpm dev`, open http://localhost:3000 in a browser, confirm the default page renders with no console errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: scaffold Next.js app with aui token set"
```

### Task 2: Registry infrastructure

**Files:**
- Create: `registry.json` (root), `registry/` (empty keep), `lib/registry.ts`
- Modify: `package.json` (add `registry:build` script)

**Interfaces:**
- Produces: `getRegistryIndex(): RegistryItem[]` from `lib/registry.ts` where `RegistryItem = { name: string; title: string; description: string; type: "registry:component"; files: {path: string; type: string}[]; dependencies?: string[] }` — consumed by Tasks 3, 4.
- Produces: `public/r/<name>.json` build artifacts — the installable units.

- [ ] **Step 1: Write `registry.json`** (shadcn registry schema; starts empty, items added per module task):

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "aetheris-ui",
  "homepage": "https://ui.aetherissolutions.com",
  "items": []
}
```

- [ ] **Step 2: Write `lib/registry.ts`**

```ts
import registry from "@/registry.json";

export type RegistryItem = {
  name: string;
  title: string;
  description: string;
  type: "registry:component";
  files: { path: string; type: string }[];
  dependencies?: string[];
};

export function getRegistryIndex(): RegistryItem[] {
  return registry.items as RegistryItem[];
}
```

- [ ] **Step 3: Add build script** to `package.json` scripts: `"registry:build": "shadcn build"` — emits `public/r/<name>.json` from `registry.json`.

- [ ] **Step 4: Verify** — `pnpm registry:build` exits 0 (zero items → zero artifacts, no error). `pnpm typecheck` (add `"typecheck": "tsc --noEmit"` if absent) passes.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: shadcn registry wiring + index reader"`

### Task 3: Site shell + gallery

**Files:**
- Create: `app/(site)/layout.tsx` (nav: wordmark, Modules, Lab, GitHub), `components/site/module-card.tsx`
- Modify: `app/page.tsx` → hero line + gallery grid of `getRegistryIndex()` items linking to `/docs/<name>`

**Interfaces:**
- Consumes: `getRegistryIndex()` from Task 2.
- Produces: `<ModuleCard item={RegistryItem} />`.

- [ ] **Step 1: Implement layout + gallery.** Home page:

```tsx
import { getRegistryIndex } from "@/lib/registry";
import { ModuleCard } from "@/components/site/module-card";

export default function Home() {
  const items = getRegistryIndex();
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-6xl font-semibold tracking-tight">
        Premium modules for sites that sell.
      </h1>
      <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--aui-muted)" }}>
        Immersive UI, installable in one command. Built in public by Aetheris.
      </p>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => <ModuleCard key={i.name} item={i} />)}
      </div>
    </main>
  );
}
```

`ModuleCard`: surface panel using `--aui-surface`/`--aui-radius`, title, description, `→ /docs/${item.name}`. Empty registry renders headline + empty grid (fine).

- [ ] **Step 2: Verify in browser** — home renders, AA contrast on muted text (spot-check with devtools), keyboard-tab shows focus rings.

- [ ] **Step 3: Commit** — `git commit -am "feat: site shell + module gallery"`

### Task 4: Docs route

**Files:**
- Create: `app/docs/[module]/page.tsx`, `components/site/install-command.tsx`, `lib/demos.ts`

**Interfaces:**
- Consumes: `getRegistryIndex()`.
- Produces: `lib/demos.ts` exporting `demos: Record<string, React.ComponentType>` — each module task registers its demo here.
- Produces: docs page contract: live demo on top, install command (`npx shadcn add https://ui.aetherissolutions.com/r/<name>.json`, copy button), description below.

- [ ] **Step 1: Implement.** `lib/demos.ts` starts as `export const demos: Record<string, React.ComponentType> = {};` — with `next/dynamic` imports added per module. Docs page: `generateStaticParams` from registry index; unknown module → `notFound()`. `InstallCommand` is a client component: monospace pill, Copy button using `navigator.clipboard.writeText`, "Copied" state for 1.5s.

- [ ] **Step 2: Verify** — `/docs/does-not-exist` 404s; build passes with zero modules.

- [ ] **Step 3: Commit** — `git commit -am "feat: docs route + install command"`

### Task 5: Module 1 — cursor-aware premium card (`aura-card`)

Establishes the full module convention end-to-end on the simplest surface.

**Files:**
- Create: `registry/aura-card/aura-card.tsx`, `registry/aura-card/demo.tsx`, `registry/aura-card/doc.mdx`
- Modify: `registry.json` (add item), `lib/demos.ts` (register demo)

**Interfaces:**
- Produces: `<AuraCard title description>` — a light-surface card whose border/glow follows the cursor (Motion `useMotionValue` + radial-gradient), tilts ≤4°, static under `prefers-reduced-motion`.
- Dependencies declared in registry item: `["motion"]`.

- [ ] **Step 1: Implement `aura-card.tsx`** — client component; `useMotionValue` mx/my updated in `onPointerMove`; glow = absolutely-positioned radial gradient at `${mx}px ${my}px` using `var(--aui-accent)`; tilt via `useTransform` clamped to 4deg; wrap all motion in a `useReducedMotion()` check that renders the static card. Colors only via `--aui-*`.

- [ ] **Step 2: Demo + doc + registry entry.** `demo.tsx` renders three AuraCards in a grid. Registry item:

```json
{
  "name": "aura-card",
  "type": "registry:component",
  "title": "Aura Card",
  "description": "Cursor-aware card with a light-catching glow. Calm by default, alive on hover.",
  "dependencies": ["motion"],
  "files": [{ "path": "registry/aura-card/aura-card.tsx", "type": "registry:component" }]
}
```

- [ ] **Step 3: Verify the full loop** — `pnpm registry:build` emits `public/r/aura-card.json`; browser: `/docs/aura-card` shows live demo + install command; OS reduced-motion on → card is static. **Scratch-app install test:** `pnpm dlx create-next-app@latest /tmp/aui-scratch --typescript --tailwind --app`, then with the dev server running `npx shadcn add http://localhost:3000/r/aura-card.json` inside it; imported card compiles and renders.

- [ ] **Step 4: Commit** — `git commit -am "feat(registry): aura-card module"`

### Task 6: Module 2 — scroll narrative section (`sequence-scroll`)

**Files:**
- Create: `registry/sequence-scroll/sequence-scroll.tsx`, `demo.tsx`, `doc.mdx`
- Modify: `registry.json`, `lib/demos.ts`

**Interfaces:**
- Produces: `<SequenceScroll steps={{kicker,title,body}[]}>` — section pins while steps scrub in/out, driven by GSAP ScrollTrigger; Lenis instantiated by the demo (documented as app-level concern, not the module's).
- Dependencies: `["gsap", "lenis"]`.

- [ ] **Step 1: Implement** — client component; `useLayoutEffect` + `gsap.context` scoped to a ref (cleanup on unmount); ScrollTrigger pins the section for `steps.length * 100vh`, timeline scrubs each step's opacity/translate; progress rail on the left. `prefers-reduced-motion`: no pin, steps render stacked statically. SSR-safe (all gsap access inside effect).

- [ ] **Step 2: Demo (with Lenis) + doc + registry entry** (same shape as Task 5, name `sequence-scroll`).

- [ ] **Step 3: Verify in browser** — scroll pins and scrubs at 60fps (devtools performance spot-check), unpin releases cleanly, no scroll-jack under reduced motion, route-away unmount leaves no ScrollTrigger leaks (navigate away/back twice, no console warnings). Scratch-app install test as in Task 5.

- [ ] **Step 4: Commit** — `git commit -am "feat(registry): sequence-scroll module"`

### Task 7: Module 3 — shader hero (`lumen-hero`)

**Files:**
- Create: `registry/lumen-hero/lumen-hero.tsx`, `lumen-material.ts` (shader), `demo.tsx`, `doc.mdx`
- Modify: `registry.json` (files array includes both source files), `lib/demos.ts`

**Interfaces:**
- Produces: `<LumenHero title tagline>` — full-bleed light-field hero: R3F `Canvas` (`dpr={[1,2]}`, `frameloop` demand-driven when idle), a plane with a custom shader (flowing iridescent gradient in the pearl's family — light background, `--aui-accent`-seeded uniforms), headline overlaid in DOM (not in-canvas) for a11y/SEO.
- No-WebGL and reduced-motion fallback: static CSS gradient hero, same DOM headline.
- Dependencies: `["three", "@react-three/fiber", "@react-three/drei"]`.

- [ ] **Step 1: Implement shader + component** — `lumen-material.ts` via drei `shaderMaterial` (uniforms: `uTime`, `uColorA`, `uColorB`); fragment shader: domain-warped fbm noise mixing the two colors over near-white; vertex passthrough. Component reads accent tokens from CSS at mount to seed uniforms; `useFrame` advances `uTime`; visibility-pause via `document.visibilitychange`.

- [ ] **Step 2: Craft pass in the browser** — iterate the noise scale/speed/palette against the acceptance bar: reads as premium at first glance, no banding on a non-retina display, idle CPU < 15% on M-series, phone-width viewport stays smooth (devtools CPU 4x throttle acceptable proxy pre-device).

- [ ] **Step 3: Fallbacks + registry entry + docs; verify install** — WebGL context-creation failure renders CSS-gradient fallback (test by forcing `webgl` disabled in devtools); reduced-motion renders static frame. Scratch-app install test as in Task 5.

- [ ] **Step 4: Commit** — `git commit -am "feat(registry): lumen-hero module"`

### Task 8: /lab + QA sweep

**Files:**
- Create: `app/lab/page.tsx` (index of experiments, "rough edges on purpose" framing), `app/lab/*/page.tsx` (≥1 experiment beyond the three modules — e.g. the aura-card glow pushed into a full-page cursor field)
- Modify: none

**Interfaces:** none (lab pages are self-contained).

- [ ] **Step 1: Build lab index + one experiment.**
- [ ] **Step 2: Full QA sweep** — run the spec's quality-bar checklist against all three modules (reduced-motion, AA contrast, focus, tokens-only colors via `grep -rn "#[0-9a-fA-F]\{3,6\}" registry/` → zero brand hex, scratch-install all three); `pnpm build && pnpm typecheck && pnpm lint` clean.
- [ ] **Step 3: Commit** — `git commit -am "feat: lab pages + v1 QA sweep"`
- [ ] **Step 4: STOP — hand back to Mike** for: repo creation + push go-ahead, Vercel project + domain, and the three module-drop posts.

## Self-review

Spec coverage: registry wiring (T2), gallery/docs/lab surfaces (T3/T4/T8), three modules spanning Motion/GSAP/R3F (T5–T7), quality bar enforced (each module task + T8), install-verification success criterion (T5–T7 scratch tests), publish-gate respected (Global Constraints + T8 stop). Client-site adoption + social posts are post-build actions owned by Mike — flagged in T8. Types consistent (`RegistryItem` defined once, consumed by name). No placeholders remain; craft iteration in T7 Step 2 is bounded by explicit acceptance criteria rather than code, deliberately — art direction is verified in-browser, not pre-written.
