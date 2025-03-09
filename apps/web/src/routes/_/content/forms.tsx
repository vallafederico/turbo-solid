import {
  getDocumentByType,
  SanityComponents,
  SelectInput,
  TextInput,
  TextareaInput,
} from "@local/sanity";
import { animateAlpha } from "~/animation/alpha";
import { SanityPage } from "@local/sanity";
import { createAsync } from "@solidjs/router";

export default function Forms() {
  const fetcher = createAsync(() => getDocumentByType("home"));

  const fieldList = {
    textInput: TextInput,
    selectInput: SelectInput,
    textareaInput: TextareaInput,
  };

  return (
    <SanityPage fetcher={fetcher}>
      {(data) => {
        return (
          <div use:animateAlpha>
            <SanityComponents
              components={data.slices}
              componentList={fieldList}
            />
          </div>
        );
      }}
    </SanityPage>
  );
}
