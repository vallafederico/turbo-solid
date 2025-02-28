```jsx
/* routes/whatever.tsx  */
import { SLICE_LIST } from "~/components/slices"; // import slice list

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

const getContent = async () => {
  "use server";
  const data = await getDocumentByType("home");
  return data;
};

export default function Content() {
  const fetcher = createAsync(() => getContent());

  //   const fieldList = {
  //     textInput: TextInput,
  //     selectInput: SelectInput,
  //     textareaInput: TextareaInput,
  //   };

  return (
    <SanityPage fetcher={fetcher}>
      {(data) => {
        return (
          <div use:animateAlpha>
            <SanityComponents
              components={data.slices}
              componentList={SLICE_LIST}
            />
            <form class="flex flex-col gap-4 [&>input]:w-full [&>label]:flex [&>label]:flex-col [&>label]:gap-1">
              <SanityComponents
                components={data.form}
                componentList={fieldList}
              />
            </form>
          </div>
        );
      }}
    </SanityPage>
  );
}
```
