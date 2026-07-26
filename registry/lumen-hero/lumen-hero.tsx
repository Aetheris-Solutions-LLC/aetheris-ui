"use client";

import * as React from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
} from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import { Color } from "three";
import { LumenMaterial, type LumenMaterialImpl } from "./lumen-material";

extend({ LumenMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    lumenMaterial: ThreeElement<typeof LumenMaterial>;
  }
}

export type LumenHeroProps = {
  title: string;
  /** Supporting line under the headline. */
  tagline?: string;
  /** Small uppercase label above the headline. */
  eyebrow?: string;
  /** When set, a focusable call-to-action button is rendered. */
  cta?: { label: string; href: string };
  /** Extra content rendered below the tagline (inside the DOM overlay). */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Colors resolve from `--aui-*` brand tokens when present, and fall back to the
 * Aetheris defaults so the hero renders premium in a bare app. Set the tokens
 * on any ancestor to reskin the light field.
 */
const T = {
  fg: "var(--aui-fg, #1c1917)",
  muted: "var(--aui-muted, #78716c)",
  accent: "var(--aui-accent, #dc143c)",
  accentStrong: "var(--aui-accent-strong, #b01030)",
} as const;

/** CSS-only pearl gradient — the no-WebGL fallback, always painted underneath. */
const FALLBACK_GRADIENT =
  "radial-gradient(120% 120% at 18% 12%, color-mix(in oklab, var(--aui-accent, #dc143c) 16%, white) 0%, transparent 46%)," +
  "radial-gradient(120% 120% at 84% 22%, color-mix(in oklab, var(--aui-accent-2, var(--aui-accent, #ff0040)) 20%, white) 0%, transparent 52%)," +
  "linear-gradient(160deg, white 0%, color-mix(in oklab, var(--aui-accent, #dc143c) 6%, white) 100%)";

/** Near-white pearl clear color for the renderer (kept hex-free / brand-token-free). */
const CLEAR_COLOR = new Color(0.98, 0.978, 0.976);

type RGB = readonly [number, number, number];
type Colors = { a: RGB; b: RGB; c: RGB };

const DEFAULT_COLORS: Colors = {
  a: [0.863, 0.078, 0.235], // #dc143c crimson
  b: [1.0, 0.0, 0.251], // #ff0040 glow red
  c: [0.99, 0.975, 0.972], // warm near-white
};

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/** Resolve a CSS custom property to sRGB 0..1 by letting the browser compute it. */
function readToken(name: string, fallback: RGB, host: Element): RGB {
  // Keep the fallback inside var() so an undefined token (bare-app install)
  // resolves to the intended default rather than the inherited text color.
  // The probe mounts inside `host` so tokens scoped to a wrapper (or this
  // component's className) reach the shader, not just body/root values.
  const fb = `rgb(${Math.round(fallback[0] * 255)} ${Math.round(fallback[1] * 255)} ${Math.round(fallback[2] * 255)})`;
  const probe = document.createElement("span");
  probe.style.color = `var(${name}, ${fb})`;
  probe.style.display = "none";
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  host.removeChild(probe);
  // Normalize through a canvas 2D context: it always yields sRGB bytes,
  // regardless of the authored color space (oklch tokens serialize back as
  // "oklch(...)" from getComputedStyle, which a naive rgb()/255 parse mangles).
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.fillStyle = "black";
  ctx.fillStyle = resolved;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

function readColors(host: Element): Colors {
  return {
    a: readToken("--aui-accent", DEFAULT_COLORS.a, host),
    b: readToken("--aui-accent-2", DEFAULT_COLORS.b, host),
    c: readToken("--aui-surface", DEFAULT_COLORS.c, host),
  };
}

function Scene({ animate, colors }: { animate: boolean; colors: Colors }) {
  const ref = React.useRef<LumenMaterialImpl>(null);
  const invalidate = useThree((s) => s.invalidate);

  React.useEffect(() => {
    const m = ref.current;
    if (!m) return;
    m.uColorA.setRGB(colors.a[0], colors.a[1], colors.a[2]);
    m.uColorB.setRGB(colors.b[0], colors.b[1], colors.b[2]);
    m.uColorC.setRGB(colors.c[0], colors.c[1], colors.c[2]);
    invalidate();
  }, [colors, invalidate]);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    m.uResolution.set(state.size.width, state.size.height);
    // Clamp delta so resuming after a pause never jumps the flow.
    if (animate) m.uTime += Math.min(delta, 1 / 30);
  });

  return (
    <ScreenQuad>
      <lumenMaterial ref={ref} />
    </ScreenQuad>
  );
}

export function LumenHero({
  title,
  tagline,
  eyebrow,
  cta,
  children,
  className,
}: LumenHeroProps) {
  const reduce = usePrefersReducedMotion();
  const rootRef = React.useRef<HTMLElement>(null);
  const [webgl, setWebgl] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [colors, setColors] = React.useState<Colors>(DEFAULT_COLORS);

  React.useEffect(() => {
    // Client-only, mount-once detection that intentionally starts from the SSR
    // fallback so the server and first client render match (no hydration
    // mismatch), then swaps in the real values. These reads must live in an
    // effect, not render: detectWebGL() creates a canvas and readColors()
    // appends a probe inside the hero root to resolve oklch tokens to sRGB — both
    // are DOM side effects that would break render purity. The lint rule's
    // cascading-render concern doesn't apply to a single mount-time swap.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the rule reports once per effect; this covers both mount-once swaps below
    setWebgl(detectWebGL());
    setColors(readColors(rootRef.current ?? document.body));
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Animate only when motion is welcome and the tab is visible; otherwise the
  // Canvas renders a single static frame (frameloop="demand").
  const animate = !reduce && !hidden;

  return (
    <section
      ref={rootRef}
      className={cx(
        "relative isolate flex min-h-[600px] w-full items-center overflow-hidden rounded-[var(--aui-radius,1rem)]",
        className,
      )}
      style={{ color: T.fg }}
    >
      {/* No-WebGL fallback: a static pearl gradient, painted underneath. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: FALLBACK_GRADIENT }}
      />

      {webgl ? (
        <Canvas
          className="absolute inset-0"
          style={{ position: "absolute", inset: 0 }}
          dpr={[1, 2]}
          frameloop={animate ? "always" : "demand"}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => gl.setClearColor(CLEAR_COLOR, 1)}
          camera={{ position: [0, 0, 1] }}
        >
          <Scene animate={animate} colors={colors} />
        </Canvas>
      ) : null}

      {/* Legibility scrim: lifts text contrast to AA over the brightest ridges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, color-mix(in oklab, white 55%, transparent) 0%, transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-24 text-center sm:px-8">
        {eyebrow ? (
          <div className="mb-5 inline-flex items-center gap-2">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: T.accent }}
            />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.16em]"
              style={{ color: T.muted }}
            >
              {eyebrow}
            </span>
          </div>
        ) : null}

        <h1
          className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
          style={{ color: T.fg }}
        >
          {title}
        </h1>

        {tagline ? (
          <p
            className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed"
            style={{ color: T.muted }}
          >
            {tagline}
          </p>
        ) : null}

        {cta ? (
          <a
            href={cta.href}
            className="mt-8 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm outline-offset-2 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2"
            style={{ background: T.accentStrong, outlineColor: T.accent }}
          >
            {cta.label}
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
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export default LumenHero;
