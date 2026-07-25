"use client";

import { MagneticElements } from "./magnetic-elements";

const T = {
  fg: "var(--aui-fg, oklch(0.205 0.02 270))",
  muted: "var(--aui-muted, oklch(0.55 0.015 270))",
  accent: "var(--aui-accent, oklch(0.62 0.19 265))",
  surface: "var(--aui-surface, oklch(1 0 0))",
  border: "var(--aui-border, oklch(0.92 0.004 270))",
};

const chips = ["Pricing", "Case studies", "Careers", "Changelog", "Contact"];

export default function MagneticElementsDemo() {
  return (
    <MagneticElements className="w-full max-w-2xl py-6" radius={140} strength={14}>
      <div className="flex flex-col items-center gap-10">
        <button
          data-magnetic
          type="button"
          className="rounded-full px-7 py-3 text-sm font-semibold text-white outline-offset-4 focus-visible:outline-2"
          style={{ background: T.accent, outlineColor: T.accent }}
        >
          Start a project
        </button>

        <div className="flex flex-wrap justify-center gap-3">
          {chips.map((chip) => (
            <a
              key={chip}
              data-magnetic
              href="#"
              className="rounded-full border px-4 py-2 text-sm font-medium outline-offset-4 focus-visible:outline-2"
              style={{
                background: T.surface,
                borderColor: T.border,
                color: T.fg,
                outlineColor: T.accent,
              }}
            >
              {chip}
            </a>
          ))}
        </div>

        <p className="max-w-sm text-center text-sm leading-relaxed" style={{ color: T.muted }}>
          Only elements marked <code>data-magnetic</code> respond — this sentence
          stays exactly where it is.
        </p>
      </div>
    </MagneticElements>
  );
}
