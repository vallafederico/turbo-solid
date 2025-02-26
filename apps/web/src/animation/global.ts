import gsap from "~/app/gsap";

export const globalOut = () =>
  gsap.to(document.querySelector("main").children[0], {
    autoAlpha: 0,
    ease: "expo.out",
    duration: 0.4,
    delay: 0.3,
    // delay: 0.8,
  });
