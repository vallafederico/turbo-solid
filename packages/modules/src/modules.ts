export type ModuleInstance = {
  destroy?: () => void;
  resize?: () => void;
  start?: () => void;
  update?: () => void;
};

export type ModuleCtor = new (
  element: HTMLElement,
  app?: unknown,
) => ModuleInstance;

export type ModuleRegistry = Record<string, ModuleCtor>;

export type ModuleManager = {
  instances: ModuleInstance[];
  resize: () => void;
  update: () => void;
  destroy: () => void;
};

const ATTR = "data-module";

/**
 * Study Hall / starters pattern: instantiate a class per `[data-module="name"]`.
 * Persistent chrome (nav, grid, canvas) lives outside `[data-taxi-view]` and
 * is created once. Page modules are created/destroyed on each Taxi navigation.
 */
export function createModules(
  root: ParentNode,
  registry: ModuleRegistry,
  app?: unknown,
): ModuleManager {
  const instances: ModuleInstance[] = [];

  for (const element of root.querySelectorAll<HTMLElement>(`[${ATTR}]`)) {
    const name = element.dataset.module;
    if (!name) continue;

    const Ctor = registry[name];
    if (!Ctor) {
      console.warn(`[modules] no constructor registered for "${name}"`);
      continue;
    }

    const instance = new Ctor(element, app);
    instance.start?.();
    instances.push(instance);
  }

  return {
    instances,
    resize() {
      for (const instance of instances) instance.resize?.();
    },
    update() {
      for (const instance of instances) instance.update?.();
    },
    destroy() {
      for (const instance of instances) instance.destroy?.();
      instances.length = 0;
    },
  };
}
