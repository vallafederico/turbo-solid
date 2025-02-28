const robotsParams = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
`;

function processRobotsParams(params: string) {
  return params.replace(/\n/g, "\n");
}

export function GET() {
  return new Response(processRobotsParams(robotsParams), {
    headers: { "Content-Type": "text/plain" },
  });
}
