import { isServer } from "solid-js/web";
import { Subscribable } from "./subscribable";

function isMobile() {
  if (isServer) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

//////////////////////////////////////////
export class _Resizer extends Subscribable {
  subscribers = [];
  isMobile = isMobile();

  constructor() {
    super();
    if (!isServer) {
      this.observer = new ResizeObserver((entry) => this.onResize(entry));
      this.observer.observe(document.body);
    }
  }

  onResize(entry) {
    this.isMobile = isMobile();
    this.notify(entry[0].contentRect);
  }

  dispose() {
    this.observer.disconnect();
  }
}

export const Resizer = new _Resizer();
