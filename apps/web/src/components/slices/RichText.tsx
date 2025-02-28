import { PortableText } from "@local/sanity";

export default function RichText({ body }: { body: any }) {
  const components = {
    marks: {
      link: ({ value }: { value: any }) => {
        const isExternal = ["mailto", "tel", "https", "http"].some((protocol) =>
          value.url.startsWith(protocol),
        );
        const target = isExternal ? "_blank" : "_self";
        return (
          <a
            href={value.url}
            target={target}
            rel={value.noFollow ? "nofollow" : ""}
          >
            {value.url}
          </a>
        );
      },
    },
  };
  // if (body) {
  //   return <PortableText value={body} />;
  // }

  return <div>RichText</div>;
}
