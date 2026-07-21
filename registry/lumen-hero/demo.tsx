"use client";

import { LumenHero } from "./lumen-hero";

export default function LumenHeroDemo() {
  return (
    <div className="w-full max-w-5xl">
      <LumenHero
        eyebrow="Aetheris UI"
        title="Light that moves like water."
        tagline="A full-bleed shader hero in the pearl family — a domain-warped light field that reads premium at a glance and installs in one command."
        cta={{ label: "Get the module", href: "/docs/lumen-hero" }}
      />
    </div>
  );
}
