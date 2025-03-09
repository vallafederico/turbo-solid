import { Dynamic, For } from "solid-js/web";

export default function SplitChars({
  tag,
  children,
}: {
  tag: string;
  children: any;
}) {
  const splitText = children.split("");

  return (
    <Dynamic component={tag}>
      <For each={splitText}>
        {(char) => <span class="inline-block">{char}</span>}
      </For>
    </Dynamic>
  );
}
