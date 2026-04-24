import "./Embla.css";
import createEmblaCarousel from "embla-carousel-solid";
import { cx } from "classix";

export const Embla = ({
  children,
  class: classList,
  //   wrapperClass,
}: {
  children: any;
  class?: string;
  //   wrapperClass?: string;
}) => {
  const [emblaRef, emblaApi] = createEmblaCarousel(() => ({
    loop: false,
    draggable: true,
    align: "start",
    dragFree: true,
  }));

  return (
    <div class={cx("embla", classList)} ref={emblaRef}>
      <div class={cx("embla__container flex h-full")}>{children}</div>
    </div>
  );
};
