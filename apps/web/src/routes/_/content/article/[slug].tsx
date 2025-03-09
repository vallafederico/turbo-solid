import {
  getDocumentBySlug,
  getDocumentByType,
  PortableText,
  SanityPage,
} from "@local/sanity";
import { animateAlpha } from "~/animation/alpha";
import { createAsync } from "@solidjs/router";

export default function Article({ params }: { params: { slug: string } }) {
  const fetcher = createAsync(() => getDocumentBySlug("article", params.slug));

  return (
    <div>
      stuff
      <SanityPage fetcher={fetcher}>
        {(data) => {
          return (
            <div class="w-grids-6 mx-auto mt-[20vh]" use:animateAlpha>
              <h1 class="mb-3r text-3xl font-bold">{data.title}</h1>
              <PortableText value={data.body} />
            </div>
          );
        }}
      </SanityPage>
    </div>
  );
}
