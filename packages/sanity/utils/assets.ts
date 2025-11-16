import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../client";

export const urlFor = (url: string) => {
	return imageUrlBuilder(sanityClient).image(url);
};
