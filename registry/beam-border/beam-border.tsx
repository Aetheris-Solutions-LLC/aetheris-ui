"use client";

import * as React from "react";

export type BeamBorderProps = {
  children: React.ReactNode;
  /** Border thickness in px. 1–2 for cards, 2–3 for buttons. */
  width?: number;
  /** Seconds for one full lap. Slower reads more expensive. */
  duration?: number;
  /** Arc length of the lit segment, 0–1. Small is a comet; large is a halo. */
  spread?: number;
  /** Corner radius. Defaults to the --aui-radius token. */
  radius?: string;
  /** Run the beam only while the element is hovered or focused within. */
  onHoverOnly?: boolean;
  className?: string;
};

const T = {
  accent: "var(--aui-accent, #dc143c)",
  accent2: "var(--aui-accent-2, #ff0040)",
  border: "var(--aui-border, #e7e5e4)",
} as const;

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * A lit segment travelling around the border of whatever you wrap. No animation
 * library and no JavaScript in the loop: a conic gradient rotates behind the
 * content and the padding box masks it down to a ring.
 *
 * Under `prefers-reduced-motion` the beam parks as a static gradient edge, so
 * the element keeps its accent without anything moving.
 */
export function BeamBorder({
  children,
  width = 1.5,
  duration = 6,
  spread = 0.18,
  radius,
  onHoverOnly = false,
  className,
}: BeamBorderProps) {
  // Scoped to an instance so several beams on one page keep their own timing.
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const stop = Math.max(0.02, Math.min(spread, 0.9));

  const css = `
    .beam-${id} {
      position: relative;
      isolation: isolate;
      border-radius: ${radius ?? "var(--aui-radius, 1rem)"};
      padding: ${width}px;
      background: ${T.border};
      overflow: hidden;
    }
    .beam-${id}::before {
      content: "";
      position: absolute;
      /* Square and oversized so the rotating gradient always covers the corners
         of a wide element. */
      left: 50%;
      top: 50%;
      width: 180%;
      aspect-ratio: 1;
      translate: -50% -50%;
      background: conic-gradient(
        from 0turn,
        transparent 0turn,
        ${T.accent} ${stop * 0.6}turn,
        ${T.accent2} ${stop}turn,
        transparent ${stop * 1.6}turn,
        transparent 1turn
      );
      animation: beam-spin-${id} ${duration}s linear infinite;
      ${onHoverOnly ? "opacity: 0; transition: opacity 400ms var(--aui-ease, ease);" : ""}
    }
    ${
      onHoverOnly
        ? `.beam-${id}:hover::before, .beam-${id}:focus-within::before { opacity: 1; }`
        : ""
    }
    .beam-${id} > * {
      position: relative;
      z-index: 1;
      border-radius: inherit;
    }
    @keyframes beam-spin-${id} {
      to { rotate: 1turn; }
    }
    @media (prefers-reduced-motion: reduce) {
      .beam-${id}::before {
        animation: none;
        opacity: 1;
        background: linear-gradient(140deg, ${T.accent}, ${T.accent2});
      }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className={cx(`beam-${id}`, className)}>{children}</div>
    </>
  );
}

export default BeamBorder;
