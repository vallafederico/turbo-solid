import { SLICE_LIST } from "~/components/slices";
import {
  SanityPage,
  PageSlices,
  getDocumentByType,
  SanityFormFields,
  TextInput,
  SelectInput,
} from "@local/sanity";
import { createAsync } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";

export default function Content() {
  const fetcher = createAsync(() => getDocumentByType("home"));

  const fieldList = {
    textInput: TextInput,
    selectInput: SelectInput,
  };

  return (
    <SanityPage fetcher={fetcher}>
      {(data) => {
        return (
          <div use:animateAlpha>
            <PageSlices slices={data.slices} sliceList={SLICE_LIST} />
            <SanityFormFields fields={data.form} fieldList={fieldList} />
          </div>
        );
      }}
    </SanityPage>
  );
}
