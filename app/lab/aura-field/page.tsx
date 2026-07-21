"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * LAB EXPERIMENT — aura-field
 *
 * The aura-card glow pushed to viewport scale: a full-bleed reactive dot field
 * where a light-catching aura and a bright accent grid track the cursor. Rough
 * on purpose — no props, no fallback polish beyond reduced-motion, not
 * installable. Ideas get stress-tested here before graduating into a module.
 */
export default function AuraFieldLab() {
  const reduce = useReducedMotion();
  const interactive = !reduce;
  const ref = React.useRef<HTMLElement>(null);

  // Normalized pointer position (0..1); springs smooth the follow, and
  // useTransform maps to percentages entirely off the React render path.
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.4);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.5 });
  const xPct = useTransform(sx, (v) => v * 100);
  const yPct = useTransform(sy, (v) => v * 100);

  // Reveal mask for the accent dot layer — only dots near the cursor light up.
  const mask = useMotionTemplate`radial-gradient(220px circle at ${xPct}% ${yPct}%, black 0%, transparent 72%)`;
  // Soft aura that trails the pointer.
  const aura = useMotionTemplate`radial-gradient(420px circle at ${xPct}% ${yPct}%, color-mix(in oklab, var(--aui-accent) 26%, transparent), transparent 70%)`;

  function handleMove(event: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <main>
      <section
        ref={ref}
        onPointerMove={interactive ? handleMove : undefined}
        className="relative isolate flex min-h-[82vh] items-center justify-center overflow-hidden"
        style={{ background: "var(--aui-bg)" }}
      >
        {/* Base dot grid — faint, always present. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in oklab, var(--aui-fg) 12%, transparent) 1px, transparent 1.4px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Accent dot grid — revealed only where the cursor is. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(var(--aui-accent) 1.4px, transparent 1.8px)",
            backgroundSize: "24px 24px",
            maskImage: interactive ? mask : undefined,
            WebkitMaskImage: interactive ? mask : undefined,
          }}
        />

        {/* Aura — the light-catching glow that trails the pointer. */}
        {interactive ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: aura }}
          />
        ) : (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(420px circle at 50% 40%, color-mix(in oklab, var(--aui-accent) 22%, transparent), transparent 70%)",
            }}
          />
        )}

        {/* Caption overlay — the only non-decorative content. */}
        <div className="relative z-10 max-w-lg px-6 text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              background:
                "color-mix(in oklab, var(--aui-surface) 70%, transparent)",
              color: "var(--aui-muted)",
            }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--aui-accent)" }}
            />
            Lab · aura-field
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Move your cursor.
          </h1>
          <p
            className="mx-auto mt-4 max-w-md text-base leading-relaxed"
            style={{ color: "var(--aui-muted)" }}
          >
            The aura-card glow, unbounded — a full-field dot grid that lights up
            around the pointer.{" "}
            {reduce
              ? "Motion is off, so the aura sits still."
              : "Reduced-motion pins it static."}
          </p>
          <Link
            href="/lab"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: "var(--aui-accent-strong)" }}
          >
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
            >
              <path d="M13 8H3M7 4L3 8l4 4" />
            </svg>
            Back to the lab
          </Link>
        </div>
      </section>
    </main>
  );
}
