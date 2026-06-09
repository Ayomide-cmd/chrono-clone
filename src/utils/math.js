// ─────────────────────────────────────────────
//  CHRONO-CLONE · Math utilities
// ─────────────────────────────────────────────

/** Euclidean distance between two {x, y} points. */
export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Linear interpolation. */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Clamp a value between min and max. */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/** Map a value from one range to another. */
export function mapRange(val, inMin, inMax, outMin, outMax) {
  return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
}
