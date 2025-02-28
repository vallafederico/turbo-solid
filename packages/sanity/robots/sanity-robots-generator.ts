import sanityClient from "../client";

export const generateSanityRobots = async () => {
  const document = await sanityClient.fetch('*[_type == "seo"][0]{robots}');

  if (document.robots?.length > 0) {
    return document.robots.map((agent: any) => {
      return `User-agent: ${agent.userAgent}\nAllow: ${agent.allow}\nDisallow: ${agent.disallow}`;
    });
  }

  return null
};
