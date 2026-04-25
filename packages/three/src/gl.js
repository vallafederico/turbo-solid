import { WebGLRenderer, PerspectiveCamera } from "three";
import { useMouseSpeed } from "./utils/mouseSpeed";
import { Scroll, Resizer, gsap, lerp, Gui } from "@local/gl-context";
import { Scene } from "./scene";
import { Post } from "./_/post/post";
import { ScreenEffect } from "./_/screenEffect";

const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

const createMouseState = () => ({
  x: 1,
  y: 1,
  hx: 1,
  hy: 1,
  ex: 0,
  ey: 0,
  speed: 0,
  espeed: 0,
});

export const params = {
  clearColor: [1, 0, 0, 1],
};

class _Gl {
  subscribers = [];
  paused = false;
  time = 0;
  mouse = createMouseState();
  _runId = 0;

  start(el) {
    if (!isBrowser() || !el) return;
    if (this.renderer) this.destroy();

    const runId = ++this._runId;
    this.resetRunState();

    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.vp = {
      container: el,
      w: window.innerWidth,
      h: window.innerHeight,
      aspect: () => {
        return this.vp.w / this.vp.h;
      },
      dpr: () => {
        return Math.min(window.devicePixelRatio, 2);
      },
    };

    this.renderer.setPixelRatio(this.vp.dpr());
    this.renderer.setSize(this.vp.w, this.vp.h);
    this.renderer.setClearColor(params.clearColor, 1);
    this.vp.container.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(
      70, // fov
      this.vp.aspect(), // aspect
      0.1, // near
      100, // far
    );

    this.camera.position.set(0, 0, 2);
    import("three/examples/jsm/controls/OrbitControls").then(
      ({ OrbitControls }) => {
        if (this._runId !== runId || !this.camera || !this.renderer) return;
        this.controls = new OrbitControls(this.camera, document.body);
        this.controls.enabled = false;
      },
    );

    // Persist bound handlers so add/remove pair to the same function
    // (gsap.ticker.remove was a no-op before because each `.bind(this)` returns a new fn).
    this._renderBound = this.render.bind(this);
    this._mouseBound = this.onMouseMove.bind(this);
    this._scrollBound = this.onScroll.bind(this);
    this._resizeBound = this.resize.bind(this);

    this.init(runId);
    this.resize();

    if (Scroll) Scroll.setGlPixelRatio(this.vp.px);

    this.evt = this._evt();
  }

  _evt() {
    return [
      handleMouseMove(document.body, this._mouseBound),
      Scroll ? Scroll.add(this._scrollBound) : () => {},
      manager(this),
      Resizer ? Resizer.add(this._resizeBound) : () => {},
    ];
  }

  resetRunState() {
    this.subscribers = [];
    this.paused = false;
    this.time = 0;
    this.mouse = createMouseState();
    this.controls = null;
    this.post = null;
    this.screen = null;
    this.scene = null;
    this.evt = undefined;
  }

  async init(runId) {
    this.scene = new Scene({
      isActive: () => this._runId === runId && !!this.renderer,
    });

    this.screen = new ScreenEffect();
    this.post = new Post();

    if (gsap) gsap.ticker.add(this._renderBound);
  }

  render() {
    if (this.paused) return;
    if (!lerp) return;
    if (!this.renderer || !this.scene || !this.post) return;

    this.time += 0.05;

    this.mouse.ex = lerp(this.mouse.ex, this.mouse.x, 0.1);
    this.mouse.ey = lerp(this.mouse.ey, this.mouse.y, 0.1);
    this.mouse.espeed = lerp(this.mouse.espeed, this.mouse.speed, 0.1);

    this.controls?.update();
    this.screen?.render(this.time);
    this.scene?.render(this.time);

    this.subscribers.forEach((sub) => sub.cb(this.time));

    if (this.screen?.debug) {
      this.renderer.render(this.screen, this.screen.camera);
    } else {
      this.post.renderPost(this.time);
    }
  }

  resize(
    { width, height } = {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  ) {
    if (!this.vp || !this.renderer || !this.camera) return;

    this.vp.w = width;
    this.vp.h = height;
    this.vp.viewSize = this.viewSize;
    this.vp.px = this.pixel;

    this.renderer.setSize(this.vp.w, this.vp.h);
    this.camera.aspect = this.vp.aspect();
    this.camera.updateProjectionMatrix();

    if (Scroll) Scroll.setGlPixelRatio(this.vp.px);

    this.scene?.resize();
  }

  onMouseMove({ clientX, clientY }, speed) {
    if (!this.vp) return;
    if (Resizer?.isMobile) return;
    this.mouse.x = (clientX / this.vp.w) * 2 - 1;
    this.mouse.y = -(clientY / this.vp.h) * 2 + 1;
    this.mouse.hx = clientX - this.vp.w / 2;
    this.mouse.hy = clientY - this.vp.h / 2;
    this.mouse.speed = speed * 0.75;
  }

  onScroll({ velocity, scroll, direction, progress }) {
    this.scene?.onScroll({ velocity, scroll, direction, progress });
  }

  destroy() {
    this._runId += 1;
    if (gsap && this._renderBound) gsap.ticker.remove(this._renderBound);

    this.evt?.forEach((e) => e());
    this.evt = undefined;

    const canvas = this.renderer?.domElement;
    if (this.vp?.container && canvas) {
      if (canvas.parentNode === this.vp.container) {
        this.vp.container.removeChild(canvas);
      }
      canvas.remove();
    }

    // Order matters: dispose passes that hold render targets / shaders before
    // the scenes whose materials they reference, then the renderer last.
    this.controls?.dispose?.();
    this.post?.dispose?.();
    this.screen?.dispose?.();
    this.scene?.dispose?.();
    this.renderer?.dispose?.();

    try {
      this.renderer?.forceContextLoss?.();
    } catch (e) {
      console.warn("renderer.forceContextLoss failed", e);
    }

    this.subscribers = [];

    this.controls = null;
    this.post = null;
    this.screen = null;
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.vp = null;
    this._renderBound = null;
    this._mouseBound = null;
    this._scrollBound = null;
    this._resizeBound = null;
  }

  get viewSize() {
    const fovInRad = (this.camera.fov * Math.PI) / 180;
    const height = Math.abs(
      this.camera.position.z * Math.tan(fovInRad / 2) * 2,
    );
    return { w: height * (this.vp.w / this.vp.h), h: height };
  }

  get pixel() {
    const px = this.viewSize.w / this.vp.w;
    const py = this.viewSize.h / this.vp.h;

    return (px + py) / 2;
  }

  subscribe(cb, priority = 0) {
    const id = Symbol();
    this.subscribers.push({ cb, id, priority });
    this.subscribers.sort((a, b) => a.priority - b.priority);

    return () => this.unsubscribe(id);
  }

  unsubscribe(id) {
    this.subscribers = this.subscribers.filter((sub) => sub.id !== id);
  }
}

/** -- Utils */

function manager(ctrl) {
  function handler(e) {
    if (e.key === " ") {
      ctrl.paused = !ctrl.paused;
    } else if (e.key === "o") {
      if (ctrl.controls) ctrl.controls.enabled = !ctrl.controls.enabled;
    } else if (e.key === "g" && Gui) {
      Gui.show();
    } else if (e.key === "p") {
      Gl.paused = !Gl.paused;
    }
  }

  document.addEventListener("keydown", handler);

  return () => {
    document.removeEventListener("keydown", handler);
  };
}

const { calculateMouseSpeed } = useMouseSpeed();
export function handleMouseMove(_target, cb) {
  // The wrapped `handler` is what we add and what we must remove (using `cb` was a no-op).
  const handler = (e) => cb(e, calculateMouseSpeed(e));
  document.addEventListener("mousemove", handler);

  return () => {
    document.removeEventListener("mousemove", handler);
  };
}

export const Gl = new _Gl();
