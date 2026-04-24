export interface Subscriber<T> {
  callback: (data: T) => void;
  priority: number;
  id: symbol | string;
}

export class Subscribable<T> {
  private subscribers: Subscriber<T>[] = [];

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

  clear(): void {
    this.subscribers = [];
  }
}
