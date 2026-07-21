"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type SequenceStep = {
  /** Small uppercase label above the title. */
  kicker: string;
  title: string;
  body: string;
};

export type SequenceScrollProps = {
  /** Ordered narrative steps. Each pins into view, then scrubs out to the next. */
  steps: SequenceStep[];
  /** Accessible label for the pinned section. */
  label?: string;
  className?: string;
};

/**
 * Colors resolve from `--aui-*` brand tokens when present, and fall back to the
 * Aetheris defaults so the section renders premium in a bare app. Set the tokens
 * on any ancestor to reskin.
 */
const T = {
  bg: "var(--aui-bg, oklch(0.985 0.002 90))",
  fg: "var(--aui-fg, oklch(0.205 0.02 270))",
  muted: "var(--aui-muted, oklch(0.55 0.015 270))",
  accent: "var(--aui-accent, oklch(0.62 0.19 265))",
  accentStrong: "var(--aui-accent-strong, oklch(0.55 0.19 265))",
  border: "var(--aui-border, oklch(0.92 0.004 270))",
} as const;

// useLayoutEffect on the client, useEffect on the server — avoids the SSR
// warning while still running before paint so the layout swap never flashes.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function SequenceScroll({
  steps,
  label = "Scroll narrative",
  className,
}: SequenceScrollProps) {
  const rootRef = React.useRef<HTMLElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const fillRef = React.useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const stage = stageRef.current;
    // Nothing to scrub between with fewer than two steps — leave the static
    // flow layout in place.
    if (!root || !frame || !stage || steps.length < 2) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Motion path runs ONLY when the reader has not asked to reduce motion.
      // Under reduced motion the callback never fires, so the steps keep their
      // static, stacked flow layout and the rail stays fully lit.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const stepEls = gsap.utils.toArray<HTMLElement>("[data-step]", stage);
        const segEls = gsap.utils.toArray<HTMLElement>("[data-seg]", root);
        const n = stepEls.length;
        if (n < 2) return;

        // Convert the static flow layout into a pinned crossfade stack. Applied
        // inside useLayoutEffect (before paint) so there is no visible reflow.
        gsap.set(frame, { height: "100vh" });
        gsap.set(stage, { position: "relative", height: "100vh" });
        gsap.set(stepEls, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          willChange: "transform, opacity",
        });
        gsap.set(stepEls, { opacity: 0, yPercent: 12 });
        gsap.set(stepEls[0], { opacity: 1, yPercent: 0 });

        const setActive = (active: number) => {
          for (let i = 0; i < segEls.length; i++) {
            const on = i <= active;
            segEls[i].style.background = on ? T.accent : T.border;
            segEls[i].style.opacity = on ? "1" : "0.55";
          }
        };
        setActive(0);
        if (fillRef.current) fillRef.current.style.transform = "scaleY(0)";

        const tl = gsap.timeline({ defaults: { ease: "none" } });
        for (let i = 0; i < n - 1; i++) {
          tl.to(stepEls[i], { opacity: 0, yPercent: -12 }, i);
          tl.to(stepEls[i + 1], { opacity: 1, yPercent: 0 }, i);
        }

        const st = ScrollTrigger.create({
          trigger: frame,
          start: "top top",
          end: () => "+=" + window.innerHeight * n,
          pin: frame,
          scrub: 1,
          anticipatePin: 1,
          animation: tl,
          onUpdate: (self) => {
            const p = self.progress;
            if (fillRef.current) {
              fillRef.current.style.transform = `scaleY(${p})`;
            }
            setActive(Math.round(p * (n - 1)));
          },
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    }, root);

    // Reverts every animation, ScrollTrigger, pin-spacer, and inline style set
    // inside the context — no leaks across route changes / unmounts.
    return () => ctx.revert();
  }, [steps]);

  return (
    <section
      ref={rootRef}
      aria-label={label}
      data-sequence-scroll
      className={cx("relative w-full", className)}
      style={{ background: T.bg, color: T.fg }}
    >
      <div
        ref={frameRef}
        className="mx-auto flex w-full max-w-5xl gap-6 px-6 sm:gap-10 sm:px-8"
      >
        {/* progress rail — decorative; stretches the full height of the frame */}
        <div
          aria-hidden
          className="relative hidden w-4 shrink-0 flex-col items-center justify-between py-24 sm:flex"
        >
          <span
            className="absolute inset-y-24 left-1/2 w-px -translate-x-1/2 rounded-full"
            style={{ background: T.border }}
          />
          <span
            ref={fillRef}
            className="absolute inset-y-24 left-1/2 w-px -translate-x-1/2 origin-top rounded-full"
            style={{ background: T.accent, transform: "scaleY(0)" }}
          />
          {steps.map((_, i) => (
            <span
              key={i}
              data-seg
              className="relative z-10 h-2.5 w-2.5 rounded-full"
              style={{ background: T.accent, boxShadow: `0 0 0 4px ${T.bg}` }}
            />
          ))}
        </div>

        {/* stage — steps flow vertically by default, become a pinned stack in motion mode */}
        <div ref={stageRef} className="min-w-0 flex-1">
          {steps.map((step, i) => (
            <article
              key={i}
              data-step
              className="flex min-h-screen flex-col justify-center py-24"
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ color: T.accentStrong }}
              >
                {step.kicker}
              </p>
              <h3
                className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl"
                style={{ color: T.fg }}
              >
                {step.title}
              </h3>
              <p
                className="mt-5 max-w-xl text-lg leading-relaxed"
                style={{ color: T.muted }}
              >
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SequenceScroll;
