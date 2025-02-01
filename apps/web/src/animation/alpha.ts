import gsap, { A } from "~/app/gsap";
import { onIntersect, onPageLeave } from "~/animation/";

export const animateAlpha = (self: HTMLElement) => {
  let viewAnimation: GSAPAnimation;

  onIntersect(self, {
    onEnter: () => {
      viewAnimation = gsap.to(self, {
        autoAlpha: 1,
        duration: A.page.in.duration * 0.6,
        ease: "linear",
        delay: 0.3,
      });
    },
    onLeave: () => {
      if (viewAnimation) viewAnimation.kill();
      gsap.set(self, { autoAlpha: 0 });
    },
  });

  onPageLeave(self, async () => {
    gsap.to(self, {
      autoAlpha: 0,
      duration: A.page.out.duration,
      ease: A.page.out.ease,
    });
  });
};
