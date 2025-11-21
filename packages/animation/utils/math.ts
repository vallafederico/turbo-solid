import { isServer } from "solid-js/web";

// lerp
export function lerp(v0: number, v1: number, t: number): number {
  return v0 * (1 - t) + v1 * t;
}

// map
export function map(
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
): number {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

// clamp
export function clamp(min: number, max: number, num: number): number {
  return Math.min(Math.max(num, min), max);
}

// mod
export function mod(value: number, x: number): number {
  return ((value % x) + x) % x;
}

export function symmetricMod(value: number, x: number): number {
  let modded = mod(value, 2 * x);
  return modded >= x ? (modded -= 2 * x) : modded;
}

/** ------------ Angles **/
export function radToDeg(r: number): number {
  return (r * 180) / Math.PI;
}

export function degToRad(d: number): number {
  return (d * Math.PI) / 180;
}

/** ------------ Bitwise **/
export const isPowerOfTwo = (n: number): boolean => !!n && (n & (n - 1)) === 0;

/** ------------ Damping **/
// Frame-independent lerp (damp function)
export function damp(
  current: number,
  target: number,
  lambda: number,
  deltaTime: number
): number {
  return lerp(current, target, 1 - Math.exp(-lambda * deltaTime));
}

// DampedValue class that automatically tracks deltaTime from RAF
// Usage: const dampedX = new DampedValue(0, 10); dampedX.setTarget(5); const current = dampedX.get();
export class DampedValue {
  private value: number;
  private target: number;
  private lastTime: number | null = null;
  private rafUnsubscribe?: () => void;
  private lambda: number;

  constructor(initialValue: number = 0, lambda: number = 10) {
    this.value = initialValue;
    this.target = initialValue;
    this.lambda = lambda;

    // Only subscribe to RAF on client-side
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init(): void {
    // Import RAF - no circular dependency since RAF doesn't import math
    if (!isServer) {
      import("../subscribers/raf").then(({ Raf }) => {
        this.rafUnsubscribe = Raf.add((time: number) => this.update(time));
      });
    }
  }

  private update(time: number): void {
    if (this.lastTime === null) {
      this.lastTime = time;
      return;
    }

    const deltaTime = (time - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = time;

    // Update value using damp function
    this.value = damp(this.value, this.target, this.lambda, deltaTime);
  }

  // Set the target value to damp towards
  setTarget(target: number): void {
    this.target = target;
  }

  // Get the current damped value
  get(): number {
    return this.value;
  }

  // Update target and get current value in one call (for convenience)
  updateTarget(target: number): number {
    this.target = target;
    return this.value;
  }

  // Dispose of RAF subscription
  dispose(): void {
    this.rafUnsubscribe?.();
  }
}
