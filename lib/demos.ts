import type { ComponentType } from "react";
import dynamic from "next/dynamic";

// Populated per-module: each registry module task registers its demo here.
export const demos: Record<string, ComponentType> = {
  "aura-card": dynamic(() => import("@/registry/aura-card/demo")),
  "sequence-scroll": dynamic(() => import("@/registry/sequence-scroll/demo")),
  "lumen-hero": dynamic(() => import("@/registry/lumen-hero/demo")),
  "polaroid-parallax": dynamic(() => import("@/registry/polaroid-parallax/demo")),
  "magnetic-elements": dynamic(() => import("@/registry/magnetic-elements/demo")),
  "reveal": dynamic(() => import("@/registry/reveal/demo")),
  "tally-tiles": dynamic(() => import("@/registry/tally-tiles/demo")),
  "drift-marquee": dynamic(() => import("@/registry/drift-marquee/demo")),
  "beam-border": dynamic(() => import("@/registry/beam-border/demo")),
};
