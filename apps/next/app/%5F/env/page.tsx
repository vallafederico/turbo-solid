import Section from "@/components/Section";

export const metadata = {
  title: "Env",
};

export default function Env() {
  return (
    <div className="min-h-[100vh] pt-navh">
      <Section className="h-[50vh] px-gx">
        <h1>Env</h1>
        <p>SERVER ENV: {process.env.SERVER_ENV ?? ""}</p>
        <p>CLIENT ENV: {process.env.NEXT_PUBLIC_CLIENT_ENV ?? ""}</p>
      </Section>
    </div>
  );
}
