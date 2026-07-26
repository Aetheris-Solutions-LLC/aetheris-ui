"use client";

import { Reveal, RevealGroup } from "./reveal";

const rows = [
  { k: "01", t: "Enters on its own", d: "Fires when the element reaches 30% visible, once by default." },
  { k: "02", t: "Lifts and sharpens", d: "A 14px lift with 6px of blur burning off — a settle, not a slide." },
  { k: "03", t: "Staggers a group", d: "RevealGroup spaces its children 70ms apart without index math." },
];

export default function RevealDemo() {
  return (
    <div className="w-full max-w-xl">
      <Reveal>
        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{
            color: "var(--aui-muted, #78716c)",
            fontFamily: "var(--font-mono-brand, ui-monospace, monospace)",
          }}
        >
          Scroll this panel
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          Arrivals worth waiting for.
        </h3>
      </Reveal>

      <RevealGroup className="mt-8 flex flex-col gap-3" stagger={0.08}>
        {rows.map((row) => (
          <div
            key={row.k}
            className="flex gap-4 rounded-[var(--aui-radius,1rem)] border p-4"
            style={{ background: "var(--aui-surface, #ffffff)" }}
          >
            <span
              className="text-[11px] font-bold tracking-[0.22em]"
              style={{
                color: "var(--aui-accent-strong, #b01030)",
                fontFamily: "var(--font-mono-brand, ui-monospace, monospace)",
              }}
            >
              {row.k}
            </span>
            <div>
              <p className="text-sm font-semibold">{row.t}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--aui-muted, #78716c)" }}>
                {row.d}
              </p>
            </div>
          </div>
        ))}
      </RevealGroup>
    </div>
  );
}
