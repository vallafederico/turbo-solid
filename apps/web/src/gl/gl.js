import gsap, { lerp, Resizer, Scroll } from "@local/animation";
import { isServer } from "solid-js/web";
import { PerspectiveCamera, WebGLRenderer } from "three";
import { Gui } from "../lib/utils/gui";
import { Post } from "./_/post/post";
import { ScreenEffect } from "./_/screenEffect";
import { Scene } from "./scene";
import { useMouseSpeed } from "./utils/mouseSpeed";

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
		Gl.renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
		});

		Gl.vp = {
			container: el,
			w: window.innerWidth,
			h: window.innerHeight,
			aspect: () => {
				return Gl.vp.w / Gl.vp.h;
			},
			dpr: () => {
				return Math.min(window.devicePixelRatio, 2);
			},
		};

		Gl.renderer.setPixelRatio(Gl.vp.dpr());
		Gl.renderer.setSize(Gl.vp.w, Gl.vp.h);
		Gl.renderer.setClearColor(params.clearColor, 1);
		Gl.vp.container.appendChild(Gl.renderer.domElement);

		Gl.camera = new PerspectiveCamera(
			70, // fov
			Gl.vp.aspect(), // aspect
			0.1, // near
			100, // far
		);

		Gl.camera.position.set(0, 0, 2);
		if (!isServer) {
			import("three/examples/jsm/controls/OrbitControls").then(
				({ OrbitControls }) => {
					Gl.controls = new OrbitControls(Gl.camera, document.body);
					Gl.controls.enabled = false;
				},
			);
		}

		Gl.init();
		Gl.resize();

		// Register GL pixel ratio with Scroll utility after camera is initialized
		Scroll.setGlPixelRatio(Gl.vp.px);

		Gl.evt = Gl._evt();
	}

	static _evt() {
		return [
			handleMouseMove(document.body, Gl.onMouseMove.bind(Gl)),
			Scroll.add(Gl.onScroll.bind(Gl)),
			manager(Gl),
			Resizer.add(Gl.resize.bind(Gl)),
		];
	}

	static async init() {
		Gl.scene = new Scene();

		Gl.screen = new ScreenEffect();
		Gl.post = new Post();

		gsap.ticker.add(Gl.render.bind(Gl));
	}

	static render() {
		if (Gl.paused) return;

		Gl.time += 0.05;

		Gl.mouse.ex = lerp(Gl.mouse.ex, Gl.mouse.x, 0.1);
		Gl.mouse.ey = lerp(Gl.mouse.ey, Gl.mouse.y, 0.1);
		Gl.mouse.espeed = lerp(Gl.mouse.espeed, Gl.mouse.speed, 0.1);

		Gl.controls?.update();
		Gl.screen?.render(Gl.time);
		Gl.scene?.render(Gl.time);

		Gl.subscribers.forEach((sub) => sub.cb(Gl.time));

		if (Gl.screen?.debug) {
			Gl.renderer.render(Gl.screen, Gl.screen.camera);
		} else {
			Gl.post.renderPost(Gl.time);
		}
	}

	static resize(
		{ width, height } = {
			width: window.innerWidth,
			height: window.innerHeight,
		},
	) {
		Gl.vp.w = width;
		Gl.vp.h = height;
		Gl.vp.viewSize = Gl.viewSize;
		Gl.vp.px = Gl.pixel;

		Gl.renderer.setSize(Gl.vp.w, Gl.vp.h);
		Gl.camera.aspect = Gl.vp.aspect();
		Gl.camera.updateProjectionMatrix();

		// Update Scroll utility with new pixel ratio
		Scroll.setGlPixelRatio(Gl.vp.px);

		Gl.scene?.resize();
	}

	static onMouseMove({ clientX, clientY }, speed) {
		if (Resizer.isMobile) return;
		Gl.mouse.x = (clientX / Gl.vp.w) * 2 - 1;
		Gl.mouse.y = -(clientY / Gl.vp.h) * 2 + 1;
		Gl.mouse.hx = clientX - Gl.vp.w / 2;
		Gl.mouse.hy = clientY - Gl.vp.h / 2;
		Gl.mouse.speed = speed * 0.75;
	}

	static onScroll({ velocity, scroll, direction, progress }) {
		Gl.scene?.onScroll({ velocity, scroll, direction, progress });
	}

	static destroy() {
		console.log("-------------- gl:destroy");
		gsap.ticker.remove(Gl.render.bind(Gl));

		Gl.vp.container.removeChild(Gl.renderer.domElement);
		Gl.renderer.domElement.remove();

		Gl.scene.dispose();
		Gl.renderer.dispose();

		// if (this.post) {
		//   this.post.kill();
		//   this.post.dispose();
		//   this.post = null;
		//   delete this.post;
		// }

		try {
			Gl.renderer.forceContextLoss();
			Gl.renderer = null;
		} catch (e) {
			console.log("renderer.forceContextLoss failed", e);
		}

		Gl.evt.forEach((e) => e());
	}

	static get viewSize() {
		const fovInRad = (Gl.camera.fov * Math.PI) / 180;
		const height = Math.abs(Gl.camera.position.z * Math.tan(fovInRad / 2) * 2);
		return { w: height * (Gl.vp.w / Gl.vp.h), h: height };
	}

	static get pixel() {
		const px = Gl.viewSize.w / Gl.vp.w;
		const py = Gl.viewSize.h / Gl.vp.h;

		return (px + py) / 2;
	}

	// -- lifecycle
	static subscribe(cb, priority = 0) {
		const id = Symbol();
		Gl.subscribers.push({ cb, id });
		Gl.subscribers.sort((a, b) => a.priority - b.priority);

		return () => Gl.unsubscribe(id);
	}

	static unsubscribe(id) {
		Gl.subscribers = Gl.subscribers.filter((sub) => sub.id !== id);
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
