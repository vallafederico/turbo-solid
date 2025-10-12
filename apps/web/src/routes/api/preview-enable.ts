import type { APIEvent } from "@solidjs/start/server";

// Enable preview: /api/preview?secret=YOUR_SECRET&redirect=/some/path
export async function GET({ params, request }: APIEvent) {
	const url = new URL(request.url);

	const secret = url.searchParams.get("sanity-preview-secret");
	console.log("secret", secret);
	const redirect = url.searchParams.get("sanity-preview-pathname");
	console.log("redirect", redirect);

	// 1) Verify your secret (match the one you configured in Studio Presentation)
	// if (secret !== process.env.SANITY_PREVIEW_SECRET) {
	// 	return new Response("Invalid secret", { status: 401 });
	// }

	// 2) (Optional) mint a short-lived read token (or fetch from KV/DB)
	const token = await getPreviewToken();

	const location = redirect.startsWith("http")
		? redirect
		: `${url.protocol}//${url.host}${redirect}`;

	console.log("location", location);

	const cookieBase = [
		"Path=/",
		"HttpOnly",
		url.protocol === "https:" ? "Secure; SameSite=None" : "SameSite=Lax",
	].join("; ");

	const headers = new Headers();
	headers.append(
		"Set-Cookie",
		`sanityPreview=true; ${cookieBase}; Max-Age=${60 * 60}`,
	);
	if (token) {
		headers.append(
			"Set-Cookie",
			`sanityPreviewToken=${encodeURIComponent(token)}; ${cookieBase}; Max-Age=${15 * 60}`,
		);
	}

	console.log("headers", headers);

	// 4) Redirect back to the app page the editor asked for
	headers.set("Location", location);
	// return new Response(null, { status: 303, headers });

	return Response.redirect(location, 303);
}

// Stub: replace with your token minting logic, or return undefined to skip
async function getPreviewToken(): Promise<string | undefined> {
	return process.env.SANITY_API_TOKEN; // or issue a short-lived token from your backend
}
