export const metadata = {
  title: "Data Loading Dynamic",
};

async function wait(time = 1): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000 * time);
  });
}

async function getContent() {
  await Promise.all([wait(1.2), wait(0.5)]);
  return { hello: "world", title: "Data Loading Dynamic", more: { data: "here" } };
}

export default async function Data() {
  const data = await getContent();

  return (
    <div className="min-h-[100vh] pt-navh">
      <div className="flex flex-col gap-[2rem] px-gx">
        {["Show", "Suspense"].map((title) => (
          <div className="flex h-[120svh] flex-col justify-center" key={title}>
            <h2>{title}</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <div>{data.more.data}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
