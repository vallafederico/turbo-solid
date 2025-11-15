import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { isServer } from "solid-js/web";

export interface AnimationDefaults {
	duration: number;
	ease: string;
}

export interface PageAnimationConfig {
	in: AnimationDefaults;
	out: AnimationDefaults;
}

const def: AnimationDefaults = {
	duration: 1.2,
	ease: "expo.out",
};

if (!isServer) {
	gsap.defaults(def);
	gsap.registerPlugin(SplitText);
}

// Animation constants
const A: { page: PageAnimationConfig } = {
	page: {
		in: {
			duration: 1.2,
			ease: "expo.out",
		},
		out: {
			duration: 0.6,
			ease: "expo.out",
		},
	},
};

export { SplitText, def, gsap, A };
