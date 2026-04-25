import { createWebGlNode } from "./createWebGlNode";
import { runWhenAttachTargetReady } from "./runWhenAttachTargetReady";

export type WebglNodeInstance = {
  dispose?: () => void;
  inView?: boolean;
};

export type WebglNodeConstructor = new (el: HTMLElement) => WebglNodeInstance;

export function mountWebglNode({
  el,
  classToInstantiate,
  attachTo = null,
  getInView,
  onNode,
}: {
  el: HTMLElement;
  classToInstantiate: WebglNodeConstructor;
  attachTo?: object | null;
  getInView?: () => boolean;
  onNode?: (node: WebglNodeInstance | undefined) => void;
}) {
  let node: WebglNodeInstance | undefined;

  const stopWait = runWhenAttachTargetReady(attachTo, () => {
    node = createWebGlNode(el, classToInstantiate, attachTo);
    if (node && getInView) node.inView = getInView();
    onNode?.(node);
  });

  return {
    setInView(inView: boolean) {
      if (node) node.inView = inView;
    },
    dispose() {
      stopWait();
      node?.dispose?.();
      node = undefined;
      onNode?.(undefined);
    },
  };
}
