"use client";

import * as React from "react";
import { gsap } from "gsap";

export type MagneticElementsProps = {
  children: React.ReactNode;
  /**
   * Which descendants magnetize. Defaults to anything marked `data-magnetic`,
   * so you opt elements in rather than surprising every button in the subtree.
   */
  selector?: string;
  /** Max px an element travels toward the pointer. */
  strength?: number;
  /** Pointer distance (px) at which the pull starts. */
  radius?: number;
  className?: string;
};

type Setter = (value: number) => void;

/**
 * Wraps a region and pulls opted-in children toward the pointer — the small
 * physical tell that separates a considered interface from a static one.
 *
 * Pointer work is coalesced into one rAF per frame and animated with gsap's
 * quickTo setters, so a dense grid of targets stays cheap. Under
 * `prefers-reduced-motion` no listeners are attached at all.
 */
export function MagneticElements({
  children,
  selector = "[data-magnetic]",
  strength = 12,
  radius = 120,
  className,
}: MagneticElementsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // quickTo setters are created per element and reused every frame — the
    // documented fast path for high-frequency tweens.
    const setters = new Map<Element, { x: Setter; y: Setter }>();
    const setterFor = (el: Element) => {
      let s = setters.get(el);
      if (!s) {
        s = {
          x: gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" }),
        };
        setters.set(el, s);
      }
      return s;
    };

    let targets: Element[] = [];
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      const p = pointer;
      if (!p) return;
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        const dx = p.x - (r.left + r.width / 2);
        const dy = p.y - (r.top + r.height / 2);
        const distance = Math.hypot(dx, dy);
        const set = setterFor(el);
        if (distance > radius) {
          set.x(0);
          set.y(0);
          continue;
        }
        // Falls off linearly with distance: full pull at the center, nothing at
        // the rim, so elements never snap when the pointer crosses the boundary.
        const pull = 1 - distance / radius;
        set.x((dx / radius) * strength * pull * 2);
        set.y((dy / radius) * strength * pull * 2);
      }
    };

    const onEnter = () => {
      // Re-query on entry rather than on mount so targets rendered later (async
      // data, conditional children) still magnetize, without a per-frame query.
      targets = Array.from(container.querySelectorAll(selector));
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      pointer = null;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      for (const el of targets) {
        const set = setterFor(el);
        set.x(0);
        set.y(0);
      }
    };

    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerleave", onLeave);

    return () => {
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      // Kill in-flight tweens and clear the transforms we set, so a remount
      // (or a route change) never leaves an element parked off-center.
      for (const el of setters.keys()) {
        gsap.killTweensOf(el);
        gsap.set(el, { x: 0, y: 0 });
      }
      setters.clear();
    };
  }, [selector, strength, radius]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

export default MagneticElements;
