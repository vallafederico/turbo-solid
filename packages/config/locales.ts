export const LOCALES = [
	{
		prefix: "en",
		flag: "🇬🇧",
		label: "English",
		default: true,
		lang: "en-GB",
	},
];

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = LOCALES.find((locale) => locale.default);
