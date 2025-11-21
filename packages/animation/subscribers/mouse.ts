import { isServer } from "solid-js/web";
import { Subscribable } from "./subscribable";
import { Raf } from "./raf";
import { damp } from "../utils/math";

export interface MouseData {
  x: number;
  y: number;
  sx: number;
  sy: number;
  ex: number;
  ey: number;
}

class _Mouse extends Subscribable<MouseData> {
  // Normalized values (-1 to 1)
  x = 0;
  y = 0;

  // Screen-based values (clientX, clientY)
  sx = 0;
  sy = 0;

  // Damped/eased values
  ex = 0;
  ey = 0;

  private boundOnMouseMove: (event: MouseEvent) => void;
  private rafUnsubscribe?: () => void;
  private lastTime: number | null = null;
  private lambda = 10; // Damping factor (higher = faster)

  constructor() {
    super();

    this.boundOnMouseMove = this.onMouseMove.bind(this);

    if (!isServer) {
      this.init();
    }
  }

  init(): void {
    window.addEventListener("mousemove", this.boundOnMouseMove);
    this.rafUnsubscribe = Raf.add((time: number) => this.update(time));
  }

  onMouseMove(event: MouseEvent): void {
    this.sx = event.clientX;
    this.sy = event.clientY;

    // Normalize to -1 to 1
    this.x = (this.sx / window.innerWidth) * 2 - 1;
    this.y = (this.sy / window.innerHeight) * 2 - 1;

    this.notify(this.getMouseData());
  }

  update(time: number): void {
    if (this.lastTime === null) {
      this.lastTime = time;
      return;
    }

    const deltaTime = (time - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = time;

    // Update damped values using frame-independent lerp
    this.ex = damp(this.ex, this.x, this.lambda, deltaTime);
    this.ey = damp(this.ey, this.y, this.lambda, deltaTime);

    // Notify subscribers of the updated damped values
    this.notify(this.getMouseData());
  }

  getMouseData(): MouseData {
    return {
      x: this.x,
      y: this.y,
      sx: this.sx,
      sy: this.sy,
      ex: this.ex,
      ey: this.ey,
    };
  }

  get position(): MouseData {
    return this.getMouseData();
  }

  dispose(): void {
    if (!isServer) {
      window.removeEventListener("mousemove", this.boundOnMouseMove);
      this.rafUnsubscribe?.();
    }
  }
}

export const Mouse = new _Mouse();
