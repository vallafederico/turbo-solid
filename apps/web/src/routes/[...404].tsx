import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import Aa from "~/components/Aa";

export default function NotFound() {
  return (
    <main class="flex-center h-screen">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />

      <div class="flex flex-col gap-2">
        <h1>Page not found</h1>

        <Aa to="/">Back to website</Aa>
      </div>
    </main>
  );
}
