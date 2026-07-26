"use client";

import { MagneticElements } from "./magnetic-elements";

const T = {
  fg: "var(--aui-fg, #1c1917)",
  muted: "var(--aui-muted, #78716c)",
  accent: "var(--aui-accent, #dc143c)",
  surface: "var(--aui-surface, #ffffff)",
  border: "var(--aui-border, #e7e5e4)",
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
