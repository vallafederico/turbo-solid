import sanityClient from "../client";

export const generateSanityRobots = async () => {

  const client = sanityClient
  const document = await client.fetch('*[_type == "seo"][0]{robots}');

  if (document.robots?.length > 0) {
    return document.robots.map((agent) => {
      return `User-agent: ${agent.userAgent}\nAllow: ${agent.allow}\nDisallow: ${agent.disallow}`;
    });
  }

  return null
};
