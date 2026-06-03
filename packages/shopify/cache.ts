export type CachePreset = {
	mode: "short" | "long" | "none" | "custom";
	cacheControl: string;
};

export const cacheShort: CachePreset = {
	mode: "short",
	cacheControl: "public, s-maxage=60, stale-while-revalidate=300",
};

export const cacheLong: CachePreset = {
	mode: "long",
	cacheControl: "public, s-maxage=3600, stale-while-revalidate=86400",
};

export const cacheNone: CachePreset = {
	mode: "none",
	cacheControl: "no-store, no-cache, must-revalidate",
};

export function cacheCustom(maxAge: number, swr = maxAge * 5): CachePreset {
	return {
		mode: "custom",
		cacheControl: `public, s-maxage=${maxAge}, stale-while-revalidate=${swr}`,
	};
}
