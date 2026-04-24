import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div class="flex-center h-screen">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />

      <div class="flex flex-col gap-2">
        <h1>Page not found</h1>

        <A href="/">Back to website</A>
      </div>
    </div>
  );
}
