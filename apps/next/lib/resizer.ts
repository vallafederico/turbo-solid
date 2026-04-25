import { Subscribable } from "@/lib/subscribable";

function isMobile(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export interface ResizeData {
  width: number;
  height: number;
  top: number;
  left: number;
}

class _Resizer extends Subscribable<ResizeData> {
  isMobile = isMobile();
  private observer?: ResizeObserver;

  constructor() {
    super();
    if (typeof document !== "undefined") {
      this.observer = new ResizeObserver((entries: ResizeObserverEntry[]) =>
        this.onResize(entries),
      );
      this.observer.observe(document.body);
    }
  }

  onResize(entries: ResizeObserverEntry[]): void {
    this.isMobile = isMobile();
    this.notify(entries[0]!.contentRect);
  }

  dispose(): void {
    this.observer?.disconnect();
  }
}

export const Resizer = new _Resizer();
