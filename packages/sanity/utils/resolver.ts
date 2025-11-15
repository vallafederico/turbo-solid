import { deepCopy, WalkBuilder } from "walkjs";
import sanityClient from "../client";

const leadingSlash = (str: string) => {
	if (!str || typeof str !== "string") return str;
	return str?.startsWith("/") ? str : `/${str}`;
};

const resolveLinks = async (inputData: any, maxDepth = 5) => {
	const store = new Map();

	const replaceNode = (node: any, id: string) => {
		const doc = store.get(id);
		// accounts for objects named "link" AND the custom linkType selector that has the page object in it
		if (["link"].includes(node.key) || ["page"].includes(node.key)) {
			const isExternal = node.parent?.val?.linkType === "external";
			const isHomepage = doc._type === "home" || doc._type === "homepage";
			const values = {
				// ...node.val,
				label: node.parent?.val?.label,
				linkType: node.parent?.val?.linkType,
			};

			if (isExternal) {
				values.url = node.parent?.val?.url;
			} else {
				values.slug = {
					current: leadingSlash(isHomepage ? "/" : doc.slug?.current),
					fullUrl: leadingSlash(isHomepage ? "/" : doc.slug?.fullUrl),
					docType: doc._type,
					// ...doc, // adding this resolves ALL content for the referenced page, responses are too large
				};
			}

			const _key = node.val._key || node.parent.val._key || doc._key;
			if (_key) {
				values._key = _key;
			}
			Object.keys(node.parent.val).forEach(
				(key) => delete node.parent.val[key],
			);
			Object.keys(values).forEach((key) => {
				node.parent.val[key] = values[key];
			});
		} else {
			Object.keys(node.val).forEach((key) => delete node.val[key]);
			Object.keys(doc).forEach((key) => {
				const value = doc[key];
				node.val[key] = typeof value === "object" ? deepCopy(value) : value;
			});
		}
	};

	const iterate = async (nodes: any) => {
		const ids = new Map();

		new WalkBuilder()
			.withGlobalFilter((a) => a.val && a.val._type === "reference")
			.withSimpleCallback((node) => {
				const refId = node.val._ref;
				if (typeof refId !== "string") {
					throw new TypeError("node.val is not set");
				}

				// if (!refId.startsWith("image-")) {
				if (!store.has(refId)) {
					// unresolved, add it to the list
					ids.set(refId, node);
				} else {
					// already resolved, can be replaced immediately
					replaceNode(node, refId);
				}
				// }
			})
			.walk(nodes);

		if (ids.size) {
			// fetch all references at once
			const documents = await sanityClient.fetch(
				`*[_id in [${[...ids.keys()].map((id) => `'${id}'`).join(",")}]]{...}`,
			);
			documents.forEach((element) => {
				store.set(element._id, element);
			});

			// replace them
			ids.forEach((node, id) => {
				replaceNode(node, id);
			});

			if (!--maxDepth) {
				console.error("Sanity autoresolver max depth reached");
				return;
			}

			// iterate threw newly fetched nodes
			await iterate(nodes);
		}
	};

	await iterate(inputData);
};

export default resolveLinks;
