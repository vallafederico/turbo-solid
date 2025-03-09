import { animateAlpha } from "~/animation/alpha";
import Aa from "~/components/Aa";
import { Title } from "@solidjs/meta";

export default function Content() {
  return (
    <div class="pt-20" use:animateAlpha>
      <Title>CMS Content</Title>

      <div class="px-gx flex flex-col items-start gap-4">
        <h2>CMS Content</h2>
        <ul class="mt-6 flex flex-col items-start gap-3">
          <li>
            <Aa animate-hover="underline" to="/_/content/forms">
              Forms
            </Aa>
          </li>
          <li>
            <Aa animate-hover="underline" to="/_/content/article/test">
              Article
            </Aa>
          </li>
          <li>
            <Aa animate-hover="underline" to="/_/content/slices">
              Slices
            </Aa>
          </li>
        </ul>
      </div>
    </div>
  );
}
