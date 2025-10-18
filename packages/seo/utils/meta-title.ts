export const createMetaTitle = (
	pageTitle = "",
	siteTitle = "",
	template = "{pageTitle} | {siteTitle}",
) => {
	let metaTitle = template
		.replace("{pageTitle}", pageTitle)
		.replace("{siteTitle}", siteTitle);

	// Remove leading/trailing separator if pageTitle or siteTitle is missing
	metaTitle = metaTitle.replace(/\s*\|\s*$/, "").replace(/^\s*\|\s*/, "");

	// If result is empty, fallback to site or pageTitle or "(Untitled)"
	if (!metaTitle.trim()) {
		metaTitle = siteTitle || pageTitle || "";
	}

	return metaTitle;
};
