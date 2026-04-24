// Disable preview: /api/exit-preview?redirect=/some/path
export async function GET(request: Request) {
	const url = new URL(request.url);
	const redirect = url.searchParams.get("redirect") || "/";

	const cookieBase =
		"; Path=/" +
		(url.protocol === "https:" ? "; Secure; SameSite=None" : "; SameSite=Lax");

	const headers = new Headers();
	// Clear cookies
	headers.append("Set-Cookie", `sanityPreview=; Max-Age=0${cookieBase}`);
	headers.append("Set-Cookie", `sanityPreviewToken=; Max-Age=0${cookieBase}`);

	headers.set("Location", redirect);
	return new Response(null, { status: 307, headers });
}
