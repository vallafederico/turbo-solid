import { generateSanityRobots, sanityClient } from "@local/sanity";

const robotsDefault = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
`;

export async function GET() {
  const dynamicRobots = await generateSanityRobots();

  return new Response(dynamicRobots || robotsDefault, {
    headers: { "Content-Type": "text/plain" },
  });
}
