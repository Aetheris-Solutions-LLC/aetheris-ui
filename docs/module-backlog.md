# Module backlog — candidates beyond v1

Reference reels Mike flagged (the taste target):

1. **jerrythewebdev — "How are 3D websites built?"** (instagram.com/reel/Da-cyj3RLKj)
   Premium 3D one-pagers; four-phase build process; $30k+ positioning. → v1's
   lumen-hero / sequence-scroll territory.
2. **raman_studios_bc — pool-builder scroll site** (instagram.com/reel/DaHIsoBxxEo)
   "Scroll to build your backyard — every great pool starts as a patch of
   grass." Pinned image-sequence scrub: scroll progress draws pre-rendered
   frames (grass → finished pool) to a canvas, copy fades through stages.
   They sell the animation code itself. 9.9K likes.

## Candidates (post-v1)

- **build-scroll** — image-sequence scrubber on the sequence-scroll chassis:
  pinned canvas, `frames: string[]` prop (preloaded, drawn by scroll progress),
  staged copy overlays, reduced-motion → final frame + stacked copy.
  Killer demo: before/after transformation for local-business sites
  (pool, kitchen reno, storefront). Frame sources: Blender turntable renders
  or AI-generated interpolation — pipeline note needed.
- ~~**marquee-velocity**~~ folded into `drift-marquee` as an opt-in `velocity` prop, off by default (velocity coupling reads as gimmick more often than craft).
- ~~**beam-border**~~ SHIPPED 2026-07-26 — pure CSS, zero deps, `onHoverOnly` for grids.
- Lab-first: cursor-field page effect (aura-card glow generalized full-page —
  seeded in v1 /lab).

Rule of thumb for picking next: one module per animation chassis we already
own before adding a new chassis.

---

## Harvest from existing client work (surveyed 2026-07-22)

⚠️ **IP gate before any of the dripFC extractions:** that code was written under
a client engagement. Extraction here means re-authoring generic (new props,
`--aui-*` tokens, zero client assets/copy), which is where the real value is
anyway — but MIT-publishing work funded by a client SOW is Mike's call, and
worth a nod from Isaiah. AetherisSite-sourced items are Aetheris-owned = clean.

### Tier 1 — extract next (premium, low coupling, wide demand)

- ~~**polaroid-parallax**~~ SHIPPED 2026-07-25 ← dripfc `components/home/hero-polaroids.tsx` (154 ln,
  Motion). Scattered photo prints drifting on pointer via spring physics,
  per-item `drift` multipliers, deliberate edge-bleed past the frame. Already
  reduced-motion aware. Work: hardcoded `POLAROIDS` → `items` prop; drip tokens
  → `--aui-*`. **~1–2h.** Portfolios, photographers, events, agencies.
- ~~**merch-marquee**~~ SHIPPED 2026-07-26 as `drift-marquee` (authored fresh, zero deps, velocity opt-in) ← dripfc `components/home/hero-marquee.tsx` (268 ln, Motion).
  Dual-row opposing-direction product river; hover reveals a title+price pill;
  edge-fade masks so tiles never hard-crop. Its `HeroMarqueeProduct` type is
  already generic. Work: strip brand rain overlay, declare/lose lucide. Fold in
  the **marquee-velocity** idea above as a `velocity` option → one module.
  **~2–3h.** Highest e-commerce pull of the set.
- ~~**liquid-stat-tiles**~~ SHIPPED 2026-07-26 as `tally-tiles` (authored fresh) ← dripfc `components/engage/scoreboard-strip.tsx`
  (330 ln, Motion + `useInView`). Glass stat tiles: count-up on enter, gradient
  numerals, drip tail, "live" pulse, featured plate. Work: four fixed number
  props → `tiles: {label, value, unit?, live?, featured?}[]`. **~2h.** Stat rows
  are among the most-requested marketing sections.
- ~~**magnetic-elements**~~ SHIPPED 2026-07-25 ← AetherisSite `components/ui/MagneticElements.tsx`
  (156 ln, GSAP). Wrapper that makes any child button/link lean toward the
  cursor; already throttled + hydration-safe. Work: swap internal `@/lib/gsap`
  and `@/utils/animations` imports for local equivalents. **~1–2h.** Fills a
  gap — a *utility wrapper*, complements aura-card. Aetheris-owned, no IP gate.

### Tier 2 — strongest product, real work

- **image-vote-grid** ← dripfc `poll-interactive.tsx` (473 ln) +
  `poll-image-grid` + `poll-image-results` + `poll-lightbox`. Tap-a-photo
  voting with optimistic tally, animated result bars, lightbox. Nothing like it
  in any competing registry — candidate headliner for a paid tier. Coupled to a
  server action (`voteAction`), the `Poll` repo type, and fingerprint gating;
  extraction = make it presentational with `onVote(id) => Promise<Tally>` +
  `results` prop so the consumer owns persistence. **~1 day.**
- ~~**reveal**~~ SHIPPED 2026-07-26 (authored fresh) ← dripfc `components/admin/ui/fade-up.tsx` (109 ln + motion
  tokens). Reduced-motion-aware scroll reveal with stagger. Unflashy, highest
  *utility* on the list — makes the registry read as a system, not three toys.
  **~1h.**
- **ambient-field** ← dripfc `components/home/droplet-bg.tsx` (167 ln, pure SVG,
  zero deps). Animated blob/gradient ambient layer. Cheap, but it *is* dripFC's
  droplet motif — must be re-authored with configurable shapes so we aren't
  shipping a client's signature. **~2h.**
- **tilt-card variants** ← `submit-category-card.tsx` (239) / `drop-grid.tsx`
  (257). Tilt+lift hover with big numeral overlays. Overlaps aura-card — ship as
  an aura-card variant, not a new module.

### Deliberately not published

- **AetherSculpture** (AetherisSite, 487 ln WebGL homepage pearl) — the Aetheris
  visual signature. Publishing it gives away what makes the site recognizable;
  lumen-hero already sells the genre without it.
- Device mockups (`IPhoneMockup`, `AppsShowcase`) — commoditized, no edge.
- Anything carrying client assets or copy verbatim (drip photography, Flite
  product data, brand tokens).

---

## Registry status — 9 modules (2026-07-26)

aura-card · sequence-scroll · lumen-hero · polaroid-parallax · magnetic-elements ·
reveal · tally-tiles · drift-marquee · beam-border

Four of the nine need **no animation library** (drift-marquee, beam-border) or
only Motion, which most Next apps already carry. That is worth saying out loud in
the marketing: the catalog does not force a dependency on anyone.

**Next big rock:** `image-vote-grid` (the dripFC poll — tap a photo to vote,
optimistic tally, animated results, lightbox). Still the most product-like thing
on the list and the natural paid-tier headliner; ~1 day, and it needs the
`onVote(id) => Promise<Tally>` boundary designed before any code.
