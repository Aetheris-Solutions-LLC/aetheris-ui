"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export type PolaroidItem = {
  /** Image URL. Any src works — local, remote, or a CDN. */
  src: string;
  /** Leave empty for decorative prints; set it when the photo carries meaning. */
  alt?: string;
  /** Where the print sits, as CSS insets: `{ top: "6%", left: "3%" }`. */
  at: { top?: string; right?: string; bottom?: string; left?: string };
  /** Resting tilt in degrees. Vary it — matched angles read as a grid, not a scatter. */
  rotate?: number;
  /** Parallax multiplier. 1 is the baseline, 0 pins the print, 1.4 makes it lead. */
  drift?: number;
  /** Any CSS width. Defaults to a responsive clamp. */
  width?: string;
  aspect?: "portrait" | "square" | "landscape";
  /** Optional line on the print's bottom lip. */
  caption?: string;
};

export type PolaroidParallaxProps = {
  items: PolaroidItem[];
  /** Max px a print at drift 1 travels horizontally. Vertical is ~64% of this. */
  strength?: number;
  /** Section min-height. Defaults to a tall hero. */
  minHeight?: string;
  /** Centered content — headline, tagline, CTA. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Colors resolve from `--aui-*` brand tokens when present and fall back to the
 * Aetheris defaults, so the section renders premium in a bare app.
 */
const T = {
  bg: "var(--aui-bg, oklch(0.985 0.002 90))",
  fg: "var(--aui-fg, oklch(0.205 0.02 270))",
  muted: "var(--aui-muted, oklch(0.55 0.015 270))",
  accent: "var(--aui-accent, oklch(0.62 0.19 265))",
  accent2: "var(--aui-accent-2, oklch(0.75 0.14 210))",
  paper: "var(--aui-surface, oklch(1 0 0))",
} as const;

/** Hoisted so the spring keeps a stable config identity across renders. */
const SPRING = { stiffness: 90, damping: 22, mass: 0.6 } as const;

const ASPECT: Record<NonNullable<PolaroidItem["aspect"]>, string> = {
  portrait: "4 / 5",
  square: "1 / 1",
  landscape: "5 / 4",
};

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function PolaroidParallax({
  items,
  strength = 22,
  minHeight = "clamp(520px, 78vh, 760px)",
  children,
  className,
}: PolaroidParallaxProps) {
  const reduce = useReducedMotion();
  const interactive = !reduce;

  // Springs hold the normalized pointer offset from the section's centre,
  // -1..1 on each axis, and are set straight from the pointer handler — one
  // hop instead of a source value the spring has to track.
  const sx = useSpring(0, SPRING);
  const sy = useSpring(0, SPRING);

  function handleMove(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    sx.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    sy.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function handleLeave() {
    sx.set(0);
    sy.set(0);
  }

  return (
    <section
      onPointerMove={interactive ? handleMove : undefined}
      onPointerLeave={interactive ? handleLeave : undefined}
      style={{ background: T.bg, color: T.fg, minHeight }}
      className={cx(
        "relative isolate flex items-center justify-center overflow-hidden rounded-[var(--aui-radius,1rem)]",
        className,
      )}
    >
      {/* ambient light so the prints sit in a space rather than on a flat plane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 0%, color-mix(in oklab, ${T.accent} 12%, transparent), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 100%, color-mix(in oklab, ${T.accent2} 14%, transparent), transparent 70%)`,
        }}
      />

      {/* The prints are decorative and sit behind the content. Hidden on small
          screens: a scatter needs room, and on a phone it either crowds the
          headline or gets cropped to nonsense. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {items.map((item, i) => (
          <Print key={`${item.src}-${i}`} item={item} sx={sx} sy={sy} strength={strength} />
        ))}
      </div>

      {children ? (
        <div className="relative z-10 px-6 py-16 text-center">{children}</div>
      ) : null}
    </section>
  );
}

function Print({
  item,
  sx,
  sy,
  strength,
}: {
  item: PolaroidItem;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  strength: number;
}) {
  const {
    src,
    alt = "",
    at,
    rotate = 0,
    drift = 1,
    width = "clamp(7rem, 14vw, 15rem)",
    aspect = "portrait",
    caption,
  } = item;

  // Prints on the left half lean opposite the ones on the right, which reads as
  // depth rather than a slab of images sliding together.
  const side = at.right !== undefined ? 1 : -1;
  const x = useTransform(sx, (v) => v * drift * strength * side);
  const y = useTransform(sy, (v) => v * drift * strength * 0.64);

  return (
    <motion.div
      // x/y are always bound (inert at 0) so the server render and the first
      // client render agree — the server can't know the motion preference. Under
      // reduced motion the parent omits its pointer handlers, so these stay 0.
      style={{ ...at, rotate, x, y, width }}
      className="absolute will-change-transform"
    >
      <div
        className="border p-2 pb-7"
        style={{
          background: T.paper,
          borderColor: `color-mix(in oklab, ${T.fg} 10%, transparent)`,
          boxShadow:
            "0 30px 60px -22px oklch(0.21 0.02 270 / 0.35), 0 8px 18px -10px oklch(0.21 0.02 270 / 0.25)",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: ASPECT[aspect],
            // A tinted wash behind the photo: a slow or broken image still reads
            // as an intentional print instead of a hole in the layout.
            background: `linear-gradient(150deg, color-mix(in oklab, ${T.accent} 22%, transparent), color-mix(in oklab, ${T.accent2} 26%, transparent))`,
          }}
        >
          {/* Plain img on purpose: the module then works with any src in any app
              with zero image-host configuration. These prints are decorative,
              lazy-loaded, and hidden below md, so they are never the LCP
              element. Swap in next/image if your project already has
              remotePatterns set up. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- see above: zero-config src is the point */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        {caption ? (
          <p
            className="mt-2 truncate px-0.5 text-[11px] tracking-wide"
            style={{ color: T.muted }}
          >
            {caption}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

export default PolaroidParallax;
