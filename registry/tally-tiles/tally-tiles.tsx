"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export type Tally = {
  label: string;
  value: number;
  /** Rendered tight against the number — "%", "k", "+", "ms". */
  unit?: string;
  /** Small line under the label. */
  hint?: string;
  /** Adds a pulsing dot: this number is still moving in the real world. */
  live?: boolean;
  /** One tile per row can carry the accent plate. Use it on the number that matters. */
  featured?: boolean;
  /** Decimal places. Defaults to what the value has. */
  precision?: number;
};

export type TallyTilesProps = {
  tiles: Tally[];
  /** Seconds the count-up takes once the row scrolls into view. */
  duration?: number;
  className?: string;
};

const T = {
  fg: "var(--aui-fg, #1c1917)",
  muted: "var(--aui-muted, #78716c)",
  accent: "var(--aui-accent, #dc143c)",
  accentStrong: "var(--aui-accent-strong, #b01030)",
  surface: "var(--aui-surface, #ffffff)",
  border: "var(--aui-border, #e7e5e4)",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function decimalsOf(value: number): number {
  const text = String(value);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

/**
 * A row of figures that count up as they scroll into view. The number carries
 * the weight — oversized, tight, gradient-filled — and everything else stays
 * quiet, which is what keeps a stat row from reading like a dashboard.
 *
 * Under `prefers-reduced-motion` the final values render immediately and the
 * live dot holds steady instead of pulsing.
 */
export function TallyTiles({ tiles, duration = 1.4, className }: TallyTilesProps) {
  return (
    <dl
      className={cx(
        "grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {tiles.map((tile) => (
        <Tile key={tile.label} tile={tile} duration={duration} />
      ))}
    </dl>
  );
}

function Tile({ tile, duration }: { tile: Tally; duration: number }) {
  const { label, value, unit, hint, live, featured, precision } = tile;
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const numberRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const places = precision ?? decimalsOf(value);

  React.useEffect(() => {
    const node = numberRef.current;
    if (!node) return;

    // The count is written straight to the DOM node rather than through state:
    // one text mutation per frame, no React render in the animation loop.
    if (reduce || !inView) {
      node.textContent = value.toFixed(places);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = v.toFixed(places);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, places, duration]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[var(--aui-radius,1rem)] border p-5"
      style={{
        background: featured
          ? `linear-gradient(160deg, color-mix(in oklab, ${T.accent} 10%, ${T.surface}), ${T.surface})`
          : T.surface,
        borderColor: featured ? `color-mix(in oklab, ${T.accent} 26%, transparent)` : T.border,
      }}
    >
      {featured ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
          }}
        />
      ) : null}

      <dt className="flex items-center gap-2">
        {live ? (
          <span
            aria-hidden
            className={cx("h-1.5 w-1.5 rounded-full", !reduce && "animate-pulse")}
            style={{ background: T.accent }}
          />
        ) : null}
        <span
          className="text-[11px] font-bold uppercase leading-none tracking-[0.22em]"
          style={{
            color: T.muted,
            fontFamily: "var(--font-mono-brand, ui-monospace, monospace)",
          }}
        >
          {label}
        </span>
      </dt>

      <dd
        className="mt-4 flex items-baseline gap-1 text-[2.6rem] font-semibold leading-none tracking-[-0.03em]"
        style={{
          // The gradient rides the numeral itself — the one place in a stat row
          // where brand colour earns its keep.
          backgroundImage: `linear-gradient(160deg, ${T.fg}, color-mix(in oklab, ${T.accentStrong} 55%, ${T.fg}))`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {/* The pre-animation text is the final value, so a crawler, a print, or
            a reader with JS off all see the real figure. */}
        <span ref={numberRef}>{value.toFixed(places)}</span>
        {unit ? <span className="text-[1.4rem]">{unit}</span> : null}
      </dd>

      {hint ? (
        <p className="mt-2 text-[13px] leading-snug" style={{ color: T.muted }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default TallyTiles;
