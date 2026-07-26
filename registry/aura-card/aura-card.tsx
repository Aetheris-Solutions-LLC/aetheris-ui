"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

export type AuraCardProps = {
  title: string;
  description: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** When set, a focusable call-to-action link is rendered. */
  href?: string;
  /** Label for the call-to-action link. Defaults to "Learn more". */
  cta?: string;
  /** Extra content rendered below the description. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Colors resolve from `--aui-*` brand tokens when present, and fall back to the
 * Aetheris defaults so the card renders premium in a bare app. Set the tokens
 * on any ancestor to reskin.
 */
const T = {
  surface: "var(--aui-surface, #ffffff)",
  fg: "var(--aui-fg, #1c1917)",
  muted: "var(--aui-muted, #78716c)",
  accent: "var(--aui-accent, #dc143c)",
  accentStrong: "var(--aui-accent-strong, #b01030)",
  border: "var(--aui-border, #e7e5e4)",
  elev:
    "var(--aui-elev, 0 1px 2px rgb(28 25 23 / 0.05), 0 18px 44px rgb(28 25 23 / 0.07))",
} as const;

const TILT_DEG = 4;

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function AuraCard({
  title,
  description,
  eyebrow,
  href,
  cta = "Learn more",
  children,
  className,
}: AuraCardProps) {
  const reduce = useReducedMotion();
  const interactive = !reduce;
  const ref = React.useRef<HTMLDivElement>(null);

  // Normalized pointer offset from center (-0.5..0.5) drives the tilt.
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  // Raw pixel position within the card drives the glow center.
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const glow = useSpring(0, { stiffness: 180, damping: 26 });

  const spring = { stiffness: 220, damping: 26, mass: 0.6 };
  const rotateX = useSpring(useTransform(ny, [-0.5, 0.5], [TILT_DEG, -TILT_DEG]), spring);
  const rotateY = useSpring(useTransform(nx, [-0.5, 0.5], [-TILT_DEG, TILT_DEG]), spring);

  const glowBackground = useMotionTemplate`radial-gradient(230px circle at ${gx}px ${gy}px, color-mix(in oklab, ${T.accent} 32%, transparent), transparent 70%)`;

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    nx.set(localX / rect.width - 0.5);
    ny.set(localY / rect.height - 0.5);
    gx.set(localX);
    gy.set(localY);
  }

  function handleEnter() {
    glow.set(1);
  }

  function handleLeave() {
    glow.set(0);
    nx.set(0);
    ny.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={interactive ? handleMove : undefined}
      onPointerEnter={interactive ? handleEnter : undefined}
      onPointerLeave={interactive ? handleLeave : undefined}
      style={{
        background: T.surface,
        borderColor: T.border,
        boxShadow: T.elev,
        color: T.fg,
        // The tilt transform is always applied (inert at rest, rotate 0) so the
        // server render and the first client render match regardless of the
        // reduced-motion preference — which the server can't know at render
        // time. Under reduced motion the pointer handlers below are omitted, so
        // the springs never leave 0 and the card stays static.
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-[var(--aui-radius,1rem)] border p-6 will-change-transform",
        className,
      )}
    >
      {/* cursor-tracking glow — inert (opacity 0) until hover, off under reduced motion */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: glowBackground, opacity: glow }}
      />

      {/* accent hairline that lights up on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        {eyebrow ? (
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: T.accent }}
            />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.14em]"
              style={{ color: T.muted }}
            >
              {eyebrow}
            </span>
          </div>
        ) : null}

        <h3 className={cx("text-xl font-semibold tracking-tight", eyebrow && "mt-4")}>
          {title}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: T.muted }}>
          {description}
        </p>

        {children ? <div className="mt-4">{children}</div> : null}

        {href ? (
          <a
            href={href}
            className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-semibold outline-offset-2 focus-visible:outline-2"
            style={{ color: T.accentStrong, outlineColor: T.accent }}
          >
            {cta}
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}

export default AuraCard;
