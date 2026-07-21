"use client";

import { AuraCard } from "./aura-card";

const cards = [
  {
    eyebrow: "Motion",
    title: "Cursor-aware glow",
    description:
      "A light-catching aura follows the pointer and the surface tilts a few degrees toward it — calm at rest, alive on hover.",
    href: "#",
    cta: "See the mechanics",
  },
  {
    eyebrow: "Tokenized",
    title: "Reskins in one variable",
    description:
      "Every color reads from an --aui-* token with a sensible fallback, so the same card drops into any brand without a rewrite.",
    href: "#",
    cta: "View tokens",
  },
  {
    eyebrow: "Accessible",
    title: "Respects the reader",
    description:
      "Reduced-motion preferences pin the card static, focus rings stay visible, and contrast clears WCAG AA by default.",
    href: "#",
    cta: "Read the notes",
  },
];

export default function AuraCardDemo() {
  return (
    <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <AuraCard key={card.title} {...card} />
      ))}
    </div>
  );
}
