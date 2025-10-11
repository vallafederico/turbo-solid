// resolve.presentation.ts
import type {
	DocumentLocationResolver,
	PresentationResolve,
} from "sanity/presentation";
type Doc = {
	_id: string;
	_type: string;
	slug?: { current: string };
	lang?: string;
};

const localePrefix = (lang?: string) =>
	lang && lang !== "en" ? `/${lang}` : "";

const routes = {
	home: (lang?: string) => `${localePrefix(lang)}/`,
	post: (slug: string, lang?: string) =>
		`${localePrefix(lang)}/articles/${slug}`,
	postIndex: (lang?: string) => `${localePrefix(lang)}/articles`,
	author: (slug: string, lang?: string) =>
		`${localePrefix(lang)}/authors/${slug}`,
	category: (slug: string, lang?: string) =>
		`${localePrefix(lang)}/topics/${slug}`,
};

export const resolve: PresentationResolve = {
	/**
	 * 2a) Main document for a route (one route → one “owner” doc)
	 * Useful for pages whose primary source doc is obvious (e.g., a Post page).
	 */
	mainDocuments: [
		// Blog post page
		{
			route: "/_/content",
			filter: `_type == "home"`,
			// select: { _id: "_id", _type: "_type", slug: "slug.current" },
			// resolve: (params, select) => {
			// 	console.log(params);
			// 	return select._type === "home" ? [{ _id: select._id }] : [];
			// },
		},
		// Author page
		// {
		// 	route: "/(.*)?/authors/:slug",
		// 	select: {
		// 		_id: "_id",
		// 		_type: "_type",
		// 		slug: "slug.current",
		// 		lang: "language",
		// 	},
		// 	resolve: (params, select) =>
		// 		select._type === "author" && select.slug === params?.slug
		// 			? [{ _id: select._id }]
		// 			: [],
		// },
	],

	/**
	 * 2b) Locations: where a given document appears across routes
	 * (many links per doc: detail page, indexes, related lists, home modules, etc.)
	 */
	// locations: [
	// 	// Post document appears on:
	// 	{
	// 		type: "post",
	// 		select: { slug: "slug.current", lang: "language" },
	// 		resolve: (doc: Doc) => {
	// 			if (!doc.slug) return [];
	// 			return [
	// 				{ title: "Post page", href: routes.post(doc.slug, doc.lang) },
	// 				{ title: "Articles index", href: routes.postIndex(doc.lang) },
	// 				{ title: "Homepage (featured)", href: routes.home(doc.lang) },
	// 			];
	// 		},
	// 	},

	// 	// Author document appears on:
	// 	{
	// 		type: "author",
	// 		select: { slug: "slug.current", lang: "language" },
	// 		resolve: (doc: Doc) => {
	// 			if (!doc.slug) return [];
	// 			return [
	// 				{ title: "Author page", href: routes.author(doc.slug, doc.lang) },
	// 				{ title: "Articles index", href: routes.postIndex(doc.lang) },
	// 			];
	// 		},
	// 	},

	// 	// Category document appears on:
	// 	{
	// 		type: "category",
	// 		select: { slug: "slug.current", lang: "language" },
	// 		resolve: (doc: Doc) =>
	// 			doc.slug
	// 				? [{ title: "Topic page", href: routes.category(doc.slug, doc.lang) }]
	// 				: [],
	// 	},

	// 	// Singleton “home” document:
	// 	{
	// 		type: "home",
	// 		select: { lang: "language" },
	// 		resolve: (doc: Doc) => [
	// 			{ title: "Homepage", href: routes.home(doc.lang) },
	// 		],
	// 	},
	// ],
};
