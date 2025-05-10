import { isServer } from "solid-js/web";

function isMobile() {
  if (isServer) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export class Resizer {
  static subscribers = [];
  static isMobile = isMobile();

  static {
    if (!isServer) {
      this.observer = new ResizeObserver((entry) => this.onResize(entry));
      this.observer.observe(document.body);
    }
  }

  static onResize(entry) {
    this.isMobile = isMobile();
    this.subscribers.forEach((sub) => sub.cb(entry[0].contentRect));

    // console.log("resized", this.isMobile);
  }

  static dispose() {
    this.observer.disconnect();
  }

  static subscribe(cb, id = Symbol()) {
    this.subscribers.push({ cb, id });
    return this.unsubscribe.bind(this, id);
  }

  static unsubscribe(id) {
    this.subscribers = this.subscribers.filter((sub) => sub.id !== id);
  }
}
