import Section from "@/components/Section";

export const metadata = {
  title: "CMS Content",
};

export default function ContentPage() {
  return (
    <div className="min-h-[100vh] pt-navh">
      <Section className="grid min-h-[80svh] content-center gap-md px-gx">
        <p className="text-sm uppercase opacity-60">CMS Content</p>
        <h1 className="max-w-4xl text-xl leading-none tracking-[-0.04em]">
          Sanity content is intentionally stubbed in the Next parity app.
        </h1>
        <p className="max-w-2xl text-md opacity-70" data-selectable>
          This route matches Solid navigation, without wiring CMS content yet.
        </p>
      </Section>
    </div>
  );
}
