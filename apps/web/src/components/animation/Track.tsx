import { onScroll, onTrack, onIntersect, onPageLeave } from "~/animation/";
import gsap from "~/app/gsap";
import { createSignal } from "solid-js";

export default function Track({
  children,
  class: className,
}: {
  children: any;
  class?: string;
}) {
  let track: any;
  const [perc, setPerc] = createSignal(0);

  const animate = (self: HTMLDivElement) => {
    /** -- Router Lifecycle */
    onPageLeave(self, async () => {
      await gsap.to(self, { opacity: 0, duration: 0.5 });
    });
    /** -- Intersection Based */
    // onIntersect(self, {
    //   onEnter: () => {
    //     console.log("in");
    //   },
    //   onLeave: () => {
    //     console.log("out");
    //   },
    // });
    /** -- Scroll Based */
    // onScroll((value: any) => {
    //   console.log(value);
    // });
    /** -- Scroll Track Based */
    onTrack(
      track,
      (value: any) => {
        // console.log(value);
        setPerc(value);
        self.style.transform = `translateY(${-value * 100 + 50}%)`;
      },
      {
        top: "center",
        bottom: "center",
        // lerp: 0.1,
      },
    );
  };

  return (
    <div ref={track} class={"relative h-[100vh] border"}>
      <div use:animate class="flex-center h-full border">
        {children}
      </div>

      <p class="absolute bottom-0 left-0">{perc()}</p>
    </div>
  );
}
