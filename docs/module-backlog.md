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
- **marquee-velocity** — scroll-velocity-reactive marquee (skew/speed follows
  scroll speed). Cheap, high-drama, everywhere in the genre.
- **beam-border** — animated gradient border/beam for CTAs and cards (Motion,
  tokens-driven).
- Lab-first: cursor-field page effect (aura-card glow generalized full-page —
  seeded in v1 /lab).

Rule of thumb for picking next: one module per animation chassis we already
own before adding a new chassis.
