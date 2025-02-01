import { isClient } from "../utils/isClient";
import gsap from "gsap";
import SplitText from "gsap/dist/SplitText";

const def = {
  duration: 1.2,
  ease: "expo.out",
};

if (isClient) {
  gsap.defaults(def);
  gsap.registerPlugin(SplitText);
}

export default gsap;
export { SplitText };
export { def };

// anim
export const A = {
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
