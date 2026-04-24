import TransitionLink from "@/components/TransitionLink";

export interface PageListItem {
  href: string;
  label: string;
  description?: string;
}

export default function PageList({ items }: { items: PageListItem[] }) {
  return (
    <ul className="mt-md flex flex-col items-start gap-3">
      {items.map((item) => (
        <li className="max-w-2xl" key={item.href}>
          <TransitionLink animate-hover="underline" href={item.href}>
            {item.label}
          </TransitionLink>
          {item.description ? (
            <p className="mt-1 text-sm opacity-60">{item.description}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
