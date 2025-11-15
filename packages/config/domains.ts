const DEV_DOMAIN = "http://localhost:3000";
const STAGING_DOMAIN = "https://stuf.vercel.app";
const PROD_DOMAIN =
	process.env.VERCEL_URL ||
	"https://turbo-solid-web-git-feat-sanity-live-editing-federicoooo.vercel.app";

export const DOMAIN =
	process.env.NODE_ENV === "development"
		? DEV_DOMAIN
		: process.env.NODE_ENV === "staging"
			? STAGING_DOMAIN
			: PROD_DOMAIN;
