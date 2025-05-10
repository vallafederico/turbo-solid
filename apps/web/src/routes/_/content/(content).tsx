import { SLICE_LIST } from "~/components/slices";

import {
  SanityPage,
  getDocumentByType,
  TextInput,
  SelectInput,
  TextareaInput,
  SanityComponents,
} from "@local/sanity";

import { createAsync } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";

export default function Content() {
  const fetcher = createAsync(() => getDocumentByType("home"));

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
