import Section from "@/components/Section";

export const metadata = {
  title: "Data Loading Synchronous",
};

async function wait(time = 1): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000 * time);
  });
}

export default async function DataSynchronous() {
  await Promise.all([wait(1.5), wait(0.5)]);

  return (
    <div className="min-h-[100vh] pt-navh">
      <Section className="h-[50vh] px-gx">
        <div>The next bit is data</div>
        <div>world</div>
      </Section>
    </div>
  );
}
