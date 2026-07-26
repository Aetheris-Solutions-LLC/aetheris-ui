"use client";

import * as React from "react";

export type MarqueeItem = {
  id: string;
  /** Image URL. Omit it and the tile renders as a type-only card. */
  image?: string;
  title: string;
  /** Second line inside the hover pill — a price, a date, a category. */
  meta?: string;
  href?: string;
};

export type DriftMarqueeProps = {
  items: MarqueeItem[];
  /** Rows to lay out. Row 2 drifts the other way, row 3 with row 1, and so on. */
  rows?: number;
  /** Seconds for one full pass. Higher is slower. */
  duration?: number;
  /** Tile aspect per row. */
  aspect?: "portrait" | "square" | "landscape";
  /**
   * Couple drift speed to scroll velocity. Off by default on purpose: it is a
   * strong effect that reads as gimmick more often than as craft.
   */
  velocity?: boolean;
  className?: string;
};

const T = {
  bg: "var(--aui-bg, #fafaf9)",
  fg: "var(--aui-fg, #1c1917)",
  muted: "var(--aui-muted, #78716c)",
  accent: "var(--aui-accent, #dc143c)",
  accent2: "var(--aui-accent-2, #ff0040)",
  surface: "var(--aui-surface, #ffffff)",
} as const;

const ASPECT = {
  portrait: "4 / 5",
  square: "1 / 1",
  landscape: "5 / 4",
} as const;

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Rows of tiles drifting in opposite directions — the "river" pattern, for
 * product, press, or portfolio. No animation library: the drift is a CSS
 * keyframe on a duplicated track, so it runs on the compositor and costs
 * nothing at rest.
 *
 * Under `prefers-reduced-motion` the CSS animation is disabled and the rows sit
 * still as ordinary scrollable strips.
 */
export function DriftMarquee({
  items,
  rows = 2,
  duration = 42,
  aspect = "portrait",
  velocity = false,
  className,
}: DriftMarqueeProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Split into rows round-robin so each row gets a mix rather than a block.
  const lanes = React.useMemo(() => {
    const out: MarqueeItem[][] = Array.from({ length: rows }, () => []);
    items.forEach((item, i) => out[i % rows].push(item));
    return out.filter((lane) => lane.length > 0);
  }, [items, rows]);

  React.useEffect(() => {
    if (!velocity) return;
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = window.scrollY;
    let frame = 0;
    let idle = 0;

    const tick = () => {
      frame = 0;
      const delta = Math.abs(window.scrollY - last);
      last = window.scrollY;
      // Fast scrolling shortens the pass (up to 3x); it eases back when the
      // page settles, so the row never stays jittery.
      const boost = Math.min(delta / 14, 2);
      root.style.setProperty("--aui-marquee-boost", String(1 + boost));
      if (boost > 0.02) {
        idle = 0;
      } else if (++idle > 12) {
        root.style.setProperty("--aui-marquee-boost", "1");
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty("--aui-marquee-boost");
    };
  }, [velocity]);

  return (
    <div
      ref={rootRef}
      className={cx("relative w-full overflow-hidden", className)}
      style={{ ["--aui-marquee-boost" as string]: "1" }}
    >
      {/* Edge masks so tiles dissolve instead of being guillotined by the frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
        style={{ background: `linear-gradient(90deg, ${T.bg}, transparent)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
        style={{ background: `linear-gradient(270deg, ${T.bg}, transparent)` }}
      />

      <style>{KEYFRAMES}</style>

      <div className="flex flex-col gap-4">
        {lanes.map((lane, laneIndex) => (
          <Lane
            key={laneIndex}
            items={lane}
            reverse={laneIndex % 2 === 1}
            duration={duration + laneIndex * 6}
            aspect={aspect}
          />
        ))}
      </div>
    </div>
  );
}

const KEYFRAMES = `
@keyframes aui-drift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .aui-drift-track { animation: none !important; }
}
`;

function Lane({
  items,
  reverse,
  duration,
  aspect,
}: {
  items: MarqueeItem[];
  reverse: boolean;
  duration: number;
  aspect: keyof typeof ASPECT;
}) {
  // The track holds the row twice; translating it exactly -50% lands the copy
  // where the original started, so the loop has no seam.
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        className="aui-drift-track flex w-max gap-4"
        style={{
          animationName: "aui-drift",
          animationDuration: `calc(${duration}s / var(--aui-marquee-boost, 1))`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((item, i) => (
          <Tile
            key={`${item.id}-${i}`}
            item={item}
            aspect={aspect}
            // Only the first copy is real content; the clone is decoration and
            // must stay out of the accessibility tree and the tab order.
            clone={i >= items.length}
          />
        ))}
      </div>
    </div>
  );
}

function Tile({
  item,
  aspect,
  clone,
}: {
  item: MarqueeItem;
  aspect: keyof typeof ASPECT;
  clone: boolean;
}) {
  const Wrapper = item.href && !clone ? "a" : "div";

  return (
    <Wrapper
      {...(item.href && !clone ? { href: item.href } : {})}
      {...(clone ? { "aria-hidden": true, tabIndex: -1 } : {})}
      className="group relative block w-[clamp(9rem,17vw,15rem)] shrink-0 overflow-hidden rounded-[var(--aui-radius,1rem)] border"
      style={{ background: T.surface, borderColor: "var(--aui-border, #e7e5e4)" }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: ASPECT[aspect],
          background: `linear-gradient(150deg, color-mix(in oklab, ${T.accent} 18%, transparent), color-mix(in oklab, ${T.accent2} 22%, transparent))`,
        }}
      >
        {item.image ? (
          // Plain img so any src works with zero image-host config; these tiles
          // are lazy and off-screen most of the time.
          // eslint-disable-next-line @next/next/no-img-element -- zero-config src is the point
          <img
            src={item.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ transitionTimingFunction: "var(--aui-ease, cubic-bezier(0.16,1,0.3,1))" }}
          />
        ) : null}

        {/* Title pill: hidden until hover on pointer devices, always shown where
            hover does not exist. */}
        <div
          className="absolute inset-x-2 bottom-2 rounded-full px-3 py-1.5 opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
          style={{
            background: `color-mix(in oklab, ${T.surface} 88%, transparent)`,
            backdropFilter: "blur(8px)",
          }}
        >
          <p className="truncate text-[13px] font-semibold" style={{ color: T.fg }}>
            {item.title}
          </p>
          {item.meta ? (
            <p className="truncate text-[11px]" style={{ color: T.muted }}>
              {item.meta}
            </p>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
}

export default DriftMarquee;
