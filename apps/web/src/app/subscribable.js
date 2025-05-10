import { isServer } from "solid-js/web";

export class Subscribable {
  static isServer = isServer;
  static subscribers = [];

  static subscribe(cb) {
    this.subscribers.push(cb);
  }

  add(callback, priority = 0, id = Symbol()) {
    const index = this.subscribers.findIndex((sub) => sub.priority > priority);
    if (index === -1) {
      this.subscribers.push({ callback, priority, id });
    } else {
      this.subscribers.splice(index, 0, { callback, priority, id });
    }

    return () => this.remove(id);
  }

  remove(id) {
    this.subscribers = this.subscribers.filter((sub) => sub.id !== id);
  }

  notify(data) {
    this.subscribers.forEach((sub) => sub.callback(data));
  }
}
