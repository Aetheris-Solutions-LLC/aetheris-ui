import { shaderMaterial } from "@react-three/drei";
import { Color, Vector2 } from "three";

/**
 * Full-screen light-field shader for {@link LumenHero}.
 *
 * A domain-warped simplex fbm flows two brand-seeded colors (`uColorA`,
 * `uColorB`) plus a highlight (`uColorC`) over a near-white pearl base, so the
 * result reads as a premium light background rather than a dark saturated blob.
 * A triangular-PDF hash dither is added in the fragment stage to defeat 8-bit
 * gradient banding on non-HDR displays.
 *
 * All color math happens in display (sRGB) space and is written straight to
 * `gl_FragColor` — the plain ShaderMaterial output is not re-encoded, so the
 * on-screen result matches the CSS token colors the uniforms are seeded from.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    // ScreenQuad binds only a position attribute (no uv buffer), so
    // reconstruct UVs from the fullscreen-triangle clip-space position:
    // verts [-1,-1],[3,-1],[-1,3] map to vUv [0,1]x[0,1] over the visible area.
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;
  uniform vec2  uResolution;
  uniform float uIntensity;

  varying vec2 vUv;

  // --- Ashima simplex noise (2D) -------------------------------------------
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Five-octave fbm with a rotation between octaves to avoid axis-aligned grain.
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p = rot * p * 2.0 + 37.0;
      a *= 0.5;
    }
    return v;
  }

  // Cheap hash for per-pixel dither.
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 st = uv;
    st.x *= aspect;

    float t = uTime * 0.06;
    vec2 p = st * 2.4;

    // Two-stage domain warp for organic, slowly-drifting flow.
    vec2 q = vec2(
      fbm(p + vec2(0.0, 1.3) + t),
      fbm(p + vec2(5.2, 1.3) - t * 0.8)
    );
    vec2 r = vec2(
      fbm(p + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t),
      fbm(p + 3.0 * q + vec2(8.3, 2.8) - 0.12 * t)
    );
    float f = fbm(p + 3.0 * r);

    float n = clamp(f * 0.5 + 0.5, 0.0, 1.0);
    float warp = clamp(length(r) * 0.55, 0.0, 1.0);

    // Iridescent tint blended over a pearl base; keep it LIGHT.
    vec3 base = vec3(0.975, 0.978, 0.99);
    vec3 tint = mix(uColorA, uColorB, smoothstep(0.15, 0.85, n));
    tint = mix(tint, uColorC, warp * 0.6);

    float strength = uIntensity * (0.35 + 0.65 * smoothstep(0.2, 0.95, n));
    vec3 col = mix(base, tint, strength);

    // Dimensional lift: gentle vignette + luminous top edge.
    float vign = smoothstep(1.15, 0.2, length((uv - 0.5) * vec2(aspect, 1.0)));
    col *= mix(0.94, 1.03, vign);
    col += 0.04 * (1.0 - uv.y);

    // Triangular-PDF dither (~1/255) kills banding on 8-bit displays.
    float d = (hash12(gl_FragCoord.xy) + hash12(gl_FragCoord.xy + 17.0) - 1.0) / 255.0;
    col += d;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

export const LumenMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new Color(0.39, 0.4, 0.95),
    uColorB: new Color(0.42, 0.72, 0.93),
    uColorC: new Color(0.97, 0.91, 0.96),
    uResolution: new Vector2(1, 1),
    uIntensity: 0.55,
  },
  vertexShader,
  fragmentShader,
);

export type LumenMaterialImpl = InstanceType<typeof LumenMaterial>;
