const DEV_DOMAIN = "http://localhost:3000";
const PROD_DOMAIN =
	process.env.VERCEL_URL || "https://internetthings-starter.vercel.app";

export const DOMAIN =
	process.env.NODE_ENV === "production" ? PROD_DOMAIN : DEV_DOMAIN;
