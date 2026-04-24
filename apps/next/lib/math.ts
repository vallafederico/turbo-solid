export function lerp(v0: number, v1: number, t: number): number {
  return v0 * (1 - t) + v1 * t;
}

export function map(
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number,
): number {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

export function clamp(min: number, max: number, num: number): number {
  return Math.min(Math.max(num, min), max);
}

export function mod(value: number, x: number): number {
  return ((value % x) + x) % x;
}

export function symmetricMod(value: number, x: number): number {
  const modded = mod(value, 2 * x);
  return modded >= x ? modded - 2 * x : modded;
}

export function radToDeg(r: number): number {
  return (r * 180) / Math.PI;
}

export function degToRad(d: number): number {
  return (d * Math.PI) / 180;
}
