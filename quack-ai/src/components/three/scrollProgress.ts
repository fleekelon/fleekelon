/**
 * Tiny bridge between the GSAP ScrollTrigger (DOM world) and the R3F
 * render loop. CameraRig reads `progress` every frame; the sticky-hero
 * timeline writes it on scrub.
 */
export type CameraKeyframe = {
  /** 0..1 along the cinematic intro scrub. */
  p: number;
  /** Camera world position. */
  pos: [number, number, number];
  /** Look-at target. */
  look: [number, number, number];
  /** Extra Y rotation applied to the duck (radians). */
  duckY: number;
  /** Uniform scale of the duck. */
  scale: number;
};

/** Cinematic camera path for the sticky-hero intro. */
export const CAMERA_KEYS: CameraKeyframe[] = [
  { p: 0, pos: [0, 0.55, 5.0], look: [0, 0.15, 0], duckY: 0.15, scale: 1 },
  {
    p: 0.35,
    pos: [2.4, 0.9, 3.6],
    look: [0, 0.25, 0],
    duckY: 0.85,
    scale: 1.05,
  },
  {
    p: 0.7,
    pos: [-2.1, 1.8, 3.4],
    look: [0, 0.2, 0],
    duckY: -0.55,
    scale: 1.15,
  },
  { p: 1, pos: [0, 0.4, 6.8], look: [0, 0.1, 0], duckY: 0.35, scale: 0.85 },
];

export function lerpKeys(progress: number): CameraKeyframe {
  const p = Math.min(1, Math.max(0, progress));
  const keys = CAMERA_KEYS;
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].p < p) i += 1;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  if (a === b) return a;
  const t = (p - a.p) / (b.p - a.p);
  const ease = t * t * (3 - 2 * t); // smoothstep
  const mix = (x: number, y: number) => x + (y - x) * ease;
  return {
    p,
    pos: [
      mix(a.pos[0], b.pos[0]),
      mix(a.pos[1], b.pos[1]),
      mix(a.pos[2], b.pos[2]),
    ],
    look: [
      mix(a.look[0], b.look[0]),
      mix(a.look[1], b.look[1]),
      mix(a.look[2], b.look[2]),
    ],
    duckY: mix(a.duckY, b.duckY),
    scale: mix(a.scale, b.scale),
  };
}
