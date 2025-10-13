import { isServer } from "solid-js/web";

export interface Subscriber<T = any> {
  callback: (data: T) => void;
  priority: number;
  id: symbol | string;
}

export class Subscribable<T = any> {
  subscribers: Subscriber<T>[] = [];
  static isServer = isServer;

  add(
    callback: (data: T) => void,
    priority = 0,
    id: symbol | string = Symbol(),
  ): () => void {
    const index = this.subscribers.findIndex((sub) => sub.priority > priority);
    if (index === -1) {
      this.subscribers.push({ callback, priority, id });
    } else {
      this.subscribers.splice(index, 0, { callback, priority, id });
    }

    return () => this.remove(id);
  }

  remove(id: symbol | string): void {
    this.subscribers = this.subscribers.filter((sub) => sub.id !== id);
  }

  notify(data: T): void {
    this.subscribers.forEach((sub) => sub.callback(data));
  }

  // Static methods for backward compatibility with existing usage
  static subscribers: Subscriber[] = [];

  static subscribe(
    callback: (data: any) => void,
    id: symbol | string = Symbol(),
  ): void {
    if (!this.subscribers.find((sub) => sub.id === id)) {
      this.subscribers.push({ callback, priority: 0, id });
    }
  }

  static unsubscribe(id: symbol | string): void {
    this.subscribers = this.subscribers.filter((sub) => sub.id !== id);
  }

  static notify(data: any): void {
    this.subscribers.forEach((sub) => sub.callback(data));
  }
}
