export class Emitter {
  constructor() {
    this.events = {};
  }

  emit(event, ...args) {
    let callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i](...args);
    }
  }

  on(event, cb) {
    this.events[event]?.push(cb) || (this.events[event] = [cb]);
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i);
    };
  }

  off(event, callback) {
    this.events[event] = this.events[event]?.filter((i) => callback !== i);
  }

  destroy() {
    this.events = {};
  }
}
