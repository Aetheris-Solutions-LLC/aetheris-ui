"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

/** Named to avoid shadowing the DOM global `Element`. */
type RevealTag = "div" | "section" | "article" | "li" | "span" | "p";

export type RevealProps = {
  children: React.ReactNode;
  /** Seconds to wait after the element enters view. */
  delay?: number;
  /** Px travelled on the way in. Keep it small — this is a lift, not a slide. */
  distance?: number;
  /** Blur burned off as it settles. 0 disables the de-blur. */
  blur?: number;
  /** Fraction of the element that must be visible before it fires. */
  amount?: number;
  /** Replay every time it re-enters view instead of once. */
  repeat?: boolean;
  as?: RevealTag;
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Reveals its children as they scroll into view — a short lift with the blur
 * burning off, the entrance every site rebuilds by hand.
 *
 * Under `prefers-reduced-motion` the children render exactly where they land,
 * with no transition at all: an entrance nobody asked for is the easiest kind
 * of motion to get wrong.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 14,
  blur = 6,
  amount = 0.3,
  repeat = false,
  as = "div",
  className,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  if (reduce) {
    const Plain: React.ElementType = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: distance, filter: blur ? `blur(${blur}px)` : undefined }}
      whileInView={{ opacity: 1, y: 0, filter: blur ? "blur(0px)" : undefined }}
      viewport={{ once: !repeat, amount }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}

export type RevealGroupProps = {
  children: React.ReactNode;
  /** Seconds between each child. 0.05–0.09 reads deliberate; past 0.15 it drags. */
  stagger?: number;
  /** Delay before the first child. */
  delay?: number;
  distance?: number;
  blur?: number;
  amount?: number;
  repeat?: boolean;
  as?: RevealTag;
  className?: string;
};

/**
 * Staggers its direct children in, one after another. Wrapping each child in a
 * `<Reveal delay={i * step}>` yourself gets the same result — this exists so a
 * list or card grid does not need the index arithmetic.
 */
export function RevealGroup({
  children,
  stagger = 0.07,
  delay = 0,
  distance = 14,
  blur = 6,
  amount = 0.2,
  repeat = false,
  as = "div",
  className,
}: RevealGroupProps) {
  // The container stays a plain element: animating it as well as its children
  // double-fades everything, and the layout classes (a grid, usually) need to
  // apply to the real wrapper.
  const Container: React.ElementType = as;

  return (
    <Container className={className}>
      {React.Children.toArray(children).map((child, i) => (
        <Reveal
          key={i}
          delay={delay + i * stagger}
          distance={distance}
          blur={blur}
          amount={amount}
          repeat={repeat}
        >
          {child}
        </Reveal>
      ))}
    </Container>
  );
}

export default Reveal;
