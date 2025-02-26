export class Subscribable {
  static subscribers = [];

  static subscribe(sub, id) {
    if (!this.subscribers.find(({ id: _id }) => _id === id))
      this.subscribers.push({ sub, id });
  }

  static unsubscribe(id) {
    this.subscribers = this.subscribers.filter(({ id: _id }) => _id !== id);
  }

  static notify(data) {
    this.subscribers.forEach(({ sub }) => sub(data));
  }
}
