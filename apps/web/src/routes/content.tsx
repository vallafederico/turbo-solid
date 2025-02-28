import { SLICE_LIST } from "~/components/slices";
import { SanityPage, PageSlices, getDocumentByType } from "@local/sanity";
import { createAsync } from "@solidjs/router";

export default function Content() {
  const fetcher = createAsync(() => getDocumentByType("home"));

  return (
    <SanityPage fetcher={fetcher}>
      {(data) => {
        console.log(data);
        return <PageSlices slices={data.slices} sliceList={SLICE_LIST} />;
      }}
    </SanityPage>
  );
}
