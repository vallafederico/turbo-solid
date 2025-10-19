import gsap, { A } from "../lib/gsap";
import { onIntersect, onPageLeave } from "~/animation/";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      webgl: [() => any, (v: any) => any];
      animateAlpha: boolean;
    }
  }
}

export const animateAlpha = (self: HTMLElement) => {
  let viewAnimation: GSAPAnimation;

  gsap.set(self, {
    autoAlpha: 0,
  });

  onIntersect(self, {
    onEnter: () => {
      viewAnimation = gsap.to(self, {
        autoAlpha: 1,
        duration: A.page.in.duration * 0.6,
        ease: "linear",
        delay: 0.1,
      });
    },
    onLeave: () => {
      if (viewAnimation) viewAnimation.kill();
      gsap.set(self, { autoAlpha: 0 });
    },
  });

  onPageLeave(self, async () => {
    await gsap.to(self, {
      autoAlpha: 0,
      duration: A.page.out.duration,
      ease: A.page.out.ease,
    });
  });
};
