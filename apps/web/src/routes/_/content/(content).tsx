import { animateAlpha } from "~/animation/alpha";
import Aa from "~/components/Aa";
import { Title } from "@solidjs/meta";

export default function Content() {
  return (
    <SanityPage fetcher={fetcher}>
      {(data) => {
        return (
          <>
            <div use:animateAlpha>
              <SanityComponents
                components={data.slices}
                componentList={SLICE_LIST}
              />
            </div>
            <div class="h-[300svh] border-b"></div>
          </>
        );
      }}
    </SanityPage>
  );
}
