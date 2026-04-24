interface Subscriber<T> {
  callback: (data: T) => void;
  priority: number;
}

export class Subscribable<T> {
  private subscribers: Subscriber<T>[] = [];

  add(callback: (data: T) => void, priority = 0): () => void {
    const subscriber: Subscriber<T> = { callback, priority };
    const index = this.subscribers.findIndex((sub) => sub.priority > priority);

    if (index === -1) this.subscribers.push(subscriber);
    else this.subscribers.splice(index, 0, subscriber);

    return () => {
      const i = this.subscribers.indexOf(subscriber);
      if (i !== -1) this.subscribers.splice(i, 1);
    };
  }

  notify(data: T): void {
    for (const sub of this.subscribers) sub.callback(data);
  }

  clear(): void {
    this.subscribers = [];
  }
}
