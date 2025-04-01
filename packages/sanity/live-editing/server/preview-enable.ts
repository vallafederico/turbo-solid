import type { RequestHandler } from 'solid-start'

export const handlePreview: RequestHandler = async ({ request }) => {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug')

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  if (!slug) {
    return new Response('No slug in the request', { status: 401 })
  }

  const response = new Response(null, {
    status: 307,
    headers: {
      Location: `/${slug}`,
      'Set-Cookie': 'preview=true; Path=/; HttpOnly; SameSite=Lax'
    }
  })

  return response
}
