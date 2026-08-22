import gsap from "gsap";

const def = {
  duration: 1.2,
  ease: "expo.out",
};

gsap.defaults(def);

export default gsap;
export { def };

export const A = {
  page: {
    in: { duration: 0.4, ease: "expo.out" },
    out: { duration: 0.4, ease: "expo.out" },
  },
};
