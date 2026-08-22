import { createModules, createScroll, createTaxi } from "@local/modules";
import type { ModuleManager, ScrollHandle } from "@local/modules";
import gsap, { A } from "./gsap";
import { pageModules, persistentModules } from "./modules";

class App {
  scroll: ScrollHandle;
  #persistent: ModuleManager;
  #page: ModuleManager | null = null;
  #taxiDestroy: () => void;

  constructor() {
    history.scrollRestoration = "manual";

    this.scroll = createScroll();
    gsap.ticker.add((time) => this.scroll.raf(time * 1000));

    this.#persistent = createModules(document, persistentModules, this);
    this.#page = createModules(this.#viewRoot(), pageModules, this);

    const taxi = createTaxi({
      onLeave: (from) => this.#leave(from as HTMLElement),
      onEnter: (to) => this.#enter(to as HTMLElement),
    });
    this.#taxiDestroy = taxi.destroy;

    new ResizeObserver(() => {
      this.scroll.resize();
      this.#persistent.resize();
      this.#page?.resize();
    }).observe(document.body);

    window.app = this;
  }

  #viewRoot() {
    return document.querySelector("[data-taxi-view]") ?? document.body;
  }

  async #leave(page?: HTMLElement) {
    this.#page?.destroy();
    this.#page = null;

    if (page) {
      await gsap.to(page, {
        opacity: 0,
        duration: A.page.out.duration,
        ease: A.page.out.ease,
      });
    }
  }

  async #enter(page?: HTMLElement) {
    this.scroll.to(0, { immediate: true });
    this.scroll.resize();
    this.#persistent.update();

    if (page) {
      gsap.set(page, { opacity: 0 });
      this.#page = createModules(page, pageModules, this);
      await gsap.to(page, {
        opacity: 1,
        duration: A.page.in.duration,
        ease: A.page.in.ease,
      });
      return;
    }

    this.#page = createModules(this.#viewRoot(), pageModules, this);
  }

  destroy() {
    this.#taxiDestroy();
    this.#page?.destroy();
    this.#persistent.destroy();
    this.scroll.destroy();
  }
}

declare global {
  interface Window {
    app?: App;
  }
}

window.app = new App();
