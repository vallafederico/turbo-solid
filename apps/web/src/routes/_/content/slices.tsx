import { SLICE_LIST } from "~/components/slices";
import { getDocumentByType, SanityComponents, SanityPage } from "@local/sanity";
import { createAsync } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";

export default function Slices() {
  const fetcher = createAsync(() => getDocumentByType("home"));

  return (
    <SanityPage fetcher={fetcher}>
      {(data) => {
        return (
          <div use:animateAlpha>
            <SanityComponents
              components={data.slices}
              componentList={SLICE_LIST}
            />
          </div>
        );
      }}
    </SanityPage>
  );
}
