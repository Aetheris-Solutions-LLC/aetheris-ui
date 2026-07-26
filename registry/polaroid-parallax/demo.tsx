"use client";

import { PolaroidParallax, type PolaroidItem } from "./polaroid-parallax";

const items: PolaroidItem[] = [
  {
    src: "/demo/print-1.jpg",
    at: { top: "6%", left: "3%" },
    rotate: -11,
    drift: 1,
    aspect: "portrait",
    caption: "no. 01",
  },
  {
    src: "/demo/print-2.jpg",
    at: { bottom: "12%", left: "1%" },
    rotate: -4,
    drift: 0.6,
    width: "clamp(6rem, 11vw, 11rem)",
    aspect: "square",
  },
  {
    // Bleeds past the right edge — the section's overflow clip makes it feel
    // like the print is spilling out of the frame.
    src: "/demo/print-3.jpg",
    at: { top: "14%", right: "-3%" },
    rotate: 7,
    drift: 1.2,
    aspect: "portrait",
    caption: "no. 03",
  },
  {
    src: "/demo/print-4.jpg",
    at: { bottom: "6%", right: "7%" },
    rotate: 16,
    drift: 0.85,
    width: "clamp(6rem, 10vw, 10rem)",
    aspect: "square",
  },
];

export default function PolaroidParallaxDemo() {
  return (
    <PolaroidParallax items={items} className="w-full">
      <p
        className="text-[11px] font-medium uppercase tracking-[0.14em]"
        style={{ color: "var(--aui-muted, #78716c)" }}
      >
        Move your cursor
      </p>
      <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
        The prints follow you.
      </h2>
      <p
        className="mx-auto mt-4 max-w-md text-sm leading-relaxed"
        style={{ color: "var(--aui-muted, #78716c)" }}
      >
        Each print drifts at its own rate, so the scatter gains depth instead of
        sliding as one flat sheet.
      </p>
    </PolaroidParallax>
  );
}
