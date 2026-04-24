import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";

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

const globalGsap = globalThis as typeof globalThis & {
  __nextGsapInitialized?: boolean;
};

if (typeof window !== "undefined" && !globalGsap.__nextGsapInitialized) {
  gsap.defaults(def);
  gsap.registerPlugin(SplitText);
  globalGsap.__nextGsapInitialized = true;
}

export default gsap;
export { SplitText, def };

export const A: { page: PageAnimationConfig } = {
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
