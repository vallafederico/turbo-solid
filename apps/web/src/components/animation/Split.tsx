import "./Split.css";
import { A, gsap, onIntersect, onPageLeave, SplitText } from "@local/animation";
import cx from "classix";
import { onCleanup, onMount } from "solid-js";

export default function Split({
	children,
	class: className,
	type = "chars",
}: {
	children: any;
	type?: "words" | "chars" | "lines";
	class?: string;
}) {
	let item!: HTMLElement;
	let splitText!: SplitText;

	onMount(() => {
		if (!item) return;
		splitText = new SplitText(item, {
			type: "words," + type,
			wordsClass: "split-w",
		});
		let animateIn: GSAPAnimation;

		gsap.set(item, {
			autoAlpha: 1,
		});

		gsap.set(splitText.chars, {
			yPercent: 100,
		});

		onPageLeave(item, async () => {
			await gsap.to(splitText.chars, {
				yPercent: 100,
				ease: "expo.out",
				duration: 0.4,
				// delay: 2,
			});
		});

		onIntersect(item, {
			onEnter: () => {
				animateIn = gsap.to(splitText.chars, {
					yPercent: 0,
					ease: A.page.in.ease,
					duration: A.page.in.duration,
					stagger: {
						each: 0.02,
						from: "start",
					},
				});
			},
			onLeave: () => {
				if (animateIn) animateIn.kill();
				gsap.set(splitText.chars, {
					yPercent: 100,
				});
			},
		});
	});

	onCleanup(() => {
		if (splitText) splitText.revert();
		if (splitText && splitText.chars) gsap.killTweensOf(splitText.chars);
		if (item) gsap.killTweensOf(item);
	});

	return (
		<div data-split class={cx("invisible", className)} ref={item}>
			{children}
		</div>
	);
}

/*

// DOES NOT WORK UNSURE WHY
    const animate = (self: HTMLElement) => {
      const splitText = new SplitText(self, { type: type });
      console.log(self);
      console.log(splitText.chars);

    gsap.set(self, {
      autoAlpha: 1,
    });

    gsap.set(splitText.chars, {
      yPercent: 100,
    });

    onPageLeave(self, async () => {
      await gsap.to(splitText.chars, {
        yPercent: 100,
        ease: "expo.out",
        duration: 1.2,
      });
    });

    onIntersect(self, {
      onEnter: () => {
        gsap.to(splitText.chars, {
          yPercent: 0,
          ease: "expo.out",
          duration: 1.2,
          stagger: {
            each: 0.02,
            from: "start",
          },
        });
      },
      onLeave: () => {
        gsap.to(splitText.chars, {
          yPercent: 100,
          ease: "expo.out",
          duration: 1.2,
        });
      },
    });

    onCleanup(() => {
      splitText.revert();
      gsap.killTweensOf(splitText.chars);
      gsap.killTweensOf(self);
    });
    };
*/
