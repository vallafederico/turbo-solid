import { WebGLRenderer, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "../gsap";

import { Gui } from "~/app/gui";
import { lerp } from "~/lib/utils/math";
import { useMouseSpeed } from "./utils/mouseSpeed";
import { isServer } from "solid-js/web";

import { Scene } from "./scene";
import { Post } from "./post/post";
import { ScreenEffect } from "./screenEffect";
import { Scroll } from "~/app/scroll";
import { Resizer } from "~/app/resizer";

export const params = {
  clearColor: [1, 0, 0, 1],
};

export class Gl {
  static subscribers = [];
  static paused = false;
  static time = 0;
  static mouse = {
    x: 1,
    y: 1,
    hx: 1,
    hy: 1,
    ex: 0,
    ey: 0,
    speed: 0,
    espeed: 0,
  };

  static start(el) {
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
    if (!isServer) {
      this.controls = new OrbitControls(this.camera, document.body);
      this.controls.enabled = false;
    }

    this.init();
    this.resize();
    this.evt = this._evt();
  }

  static _evt() {
    return [
      handleMouseMove(document.body, this.onMouseMove.bind(this)),
      Scroll.add(this.onScroll.bind(this)),
      manager(this),
      Resizer.add(this.resize.bind(this)),
    ];
  }

  static async init() {
    this.scene = new Scene();

    this.screen = new ScreenEffect();
    this.post = new Post();

    gsap.ticker.add(this.render.bind(this));
  }

  static render() {
    if (this.paused) return;

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

  static resize(
    { width, height } = {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  ) {
    this.vp.w = width;
    this.vp.h = height;
    this.vp.viewSize = this.viewSize;
    this.vp.px = this.pixel;

    this.renderer.setSize(this.vp.w, this.vp.h);
    this.camera.aspect = this.vp.aspect();
    this.camera.updateProjectionMatrix();

    this.scene?.resize();
  }

  static onMouseMove({ clientX, clientY }, speed) {
    if (Resizer.isMobile) return;
    this.mouse.x = (clientX / this.vp.w) * 2 - 1;
    this.mouse.y = -(clientY / this.vp.h) * 2 + 1;
    this.mouse.hx = clientX - this.vp.w / 2;
    this.mouse.hy = clientY - this.vp.h / 2;
    this.mouse.speed = speed * 0.75;
  }

  static onScroll({ velocity, scroll, direction, progress }) {
    this.scene?.onScroll({ velocity, scroll, direction, progress });
  }

  static destroy() {
    console.log("-------------- gl:destroy");
    gsap.ticker.remove(this.render.bind(this));

    this.vp.container.removeChild(this.renderer.domElement);
    this.renderer.domElement.remove();

    this.scene.dispose();
    this.renderer.dispose();

    // if (this.post) {
    //   this.post.kill();
    //   this.post.dispose();
    //   this.post = null;
    //   delete this.post;
    // }

    try {
      this.renderer.forceContextLoss();
      this.renderer = null;
    } catch (e) {
      console.log("renderer.forceContextLoss failed", e);
    }

    this.evt.forEach((e) => e());
  }

  static get viewSize() {
    const fovInRad = (this.camera.fov * Math.PI) / 180;
    const height = Math.abs(
      this.camera.position.z * Math.tan(fovInRad / 2) * 2,
    );
    return { w: height * (this.vp.w / this.vp.h), h: height };
  }

  static get pixel() {
    const px = this.viewSize.w / this.vp.w;
    const py = this.viewSize.h / this.vp.h;

    return (px + py) / 2;
  }

  // -- lifecycle
  static subscribe(cb, priority = 0) {
    const id = Symbol();
    this.subscribers.push({ cb, id });
    this.subscribers.sort((a, b) => a.priority - b.priority);

    return () => this.unsubscribe(id);
  }

  static unsubscribe(id) {
    this.subscribers = this.subscribers.filter((sub) => sub.id !== id);
  }
}

/** -- Utils */

function manager(ctrl) {
  function handler(e) {
    if (e.key === " ") {
      ctrl.paused = !ctrl.paused;
    } else if (e.key === "o") {
      ctrl.controls.enabled = !ctrl.controls.enabled;
    } else if (e.key === "g") {
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
export function handleMouseMove(e, cb) {
  document.addEventListener("mousemove", (e) => {
    const speed = calculateMouseSpeed(e);
    cb(e, speed);
  });

  return () => {
    document.removeEventListener("mousemove", cb);
  };
}
