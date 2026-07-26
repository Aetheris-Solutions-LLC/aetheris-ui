"use client";

import { BeamBorder } from "./beam-border";

export default function BeamBorderDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8">
      <BeamBorder width={2} duration={5} radius="9999px">
        <button
          type="button"
          className="rounded-full px-7 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--aui-fg, #1c1917)" }}
        >
          Ship it
        </button>
      </BeamBorder>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <BeamBorder duration={9} spread={0.3}>
          <div className="h-full p-5" style={{ background: "var(--aui-surface, #ffffff)" }}>
            <p className="text-sm font-semibold">Always lit</p>
            <p className="mt-1 text-sm" style={{ color: "var(--aui-muted, #78716c)" }}>
              A slow lap with a wide arc — closer to a halo than a comet.
            </p>
          </div>
        </BeamBorder>

        <BeamBorder duration={4} spread={0.12} onHoverOnly>
          <div className="h-full p-5" style={{ background: "var(--aui-surface, #ffffff)" }}>
            <p className="text-sm font-semibold">Hover me</p>
            <p className="mt-1 text-sm" style={{ color: "var(--aui-muted, #78716c)" }}>
              onHoverOnly keeps the card quiet until it is the one you want.
            </p>
          </div>
        </BeamBorder>
      </div>
    </div>
  );
}
