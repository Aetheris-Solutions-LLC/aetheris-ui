"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { SequenceScroll } from "./sequence-scroll";

const steps = [
  {
    kicker: "01 — Capture",
    title: "It starts with a single pinned frame.",
    body: "The section locks to the viewport the moment it arrives. The reader stops scrolling the page and starts scrolling the story — one idea holds the screen at a time.",
  },
  {
    kicker: "02 — Scrub",
    title: "Each beat scrubs in as you move.",
    body: "Scroll distance drives a GSAP timeline, so progress is reversible and frame-accurate. Nudge up, the story rewinds; nudge down, it advances. No autoplay, no guessing.",
  },
  {
    kicker: "03 — Guide",
    title: "A rail tracks where you are.",
    body: "The left rail fills with progress and lights each step as it becomes current, giving the reader a quiet sense of place inside the narrative.",
  },
  {
    kicker: "04 — Release",
    title: "Then it hands the page back.",
    body: "When the last beat lands, the pin releases cleanly and normal scrolling resumes. Reduced-motion readers skip the choreography entirely and get the same steps, stacked and static.",
  },
];

export default function SequenceScrollDemo() {
  React.useEffect(() => {
    // Smooth scroll is an app-level concern, not the module's. This is the
    // canonical Lenis + GSAP wiring the docs recommend. Skipped under reduced
    // motion so the module's static fallback is honored end-to-end.
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full">
      {/* Lenis recommends neutralizing native smooth-scroll while it drives the
          page. Scoped here so the module stays drop-in without global CSS. */}
      <style>{`
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
      `}</style>

      <section className="mx-auto flex min-h-[45vh] max-w-3xl flex-col justify-center px-6 py-20 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--aui-accent-strong, #b01030)" }}
        >
          Keep scrolling
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
          A section that pins and tells a story.
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed"
          style={{ color: "var(--aui-muted, #78716c)" }}
        >
          Scroll down — the panel below will lock to the screen and scrub through
          its beats before releasing you.
        </p>
      </section>

      <SequenceScroll steps={steps} label="How the sequence works" />

      <section className="mx-auto flex min-h-[45vh] max-w-3xl flex-col justify-center px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          And you are back to normal scrolling.
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed"
          style={{ color: "var(--aui-muted, #78716c)" }}
        >
          The pin released the moment the last beat finished. No trapped scroll,
          no leftover listeners.
        </p>
      </section>
    </div>
  );
}
