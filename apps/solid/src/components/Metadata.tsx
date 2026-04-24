import { Title, Meta } from "@solidjs/meta";

const DEFAULTS = {
  title: "Title",
  description: "Description",
  image: { src: "", alt: "" },
};

export default function Metadata({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  image = DEFAULTS.image,
}: {
  title: string;
  description: string;
  image: { src: string; alt: string };
}) {
  return (
    <>
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:image" content={image.src} />
      <Meta property="og:image:alt" content={image.alt} />
    </>
  );
}
