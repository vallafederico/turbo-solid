// lerp
export function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

// map
export function map(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

// clamp
export function clamp(min, max, num) {
  return Math.min(Math.max(num, min), max);
}

// mod
export function mod(value, x) {
  return ((value % x) + x) % x;
}

export function symmetricMod(value, x) {
  let modded = mod(value, 2 * x);
  return modded >= x ? (modded -= 2 * x) : modded;
}

/** ------------ Angles **/
export function radToDeg(r) {
  return (r * 180) / Math.PI;
}

export function degToRad(d) {
  return (d * Math.PI) / 180;
}

/** ------------ Bitwise **/
const isPowerOfTwo = (n) => !!n && (n & (n - 1)) == 0;
