import { AiOutlineFileSearch } from "react-icons/ai";
import { IoShareSocial } from "react-icons/io5";
import {
	MdArticle,
	MdBusiness,
	MdFolder,
	MdHome,
	MdPages,
	MdPerson,
	MdPerson2,
	MdSearch,
	MdSettings,
	MdSettingsSuggest,
} from "react-icons/md";
import {
	RiLayoutBottom2Line,
	RiLayoutMasonryFill,
	RiLayoutTop2Line,
} from "react-icons/ri";
import type {
	StructureBuilder,
	StructureResolver,
	StructureResolverContext,
} from "sanity/structure";
import { setupPages } from "../utils/structure-utils";

export const structure: StructureResolver = (
	S: StructureBuilder,
	context: StructureResolverContext,
) => {
	const { singlePage, pageList, folder, div } = setupPages(S);

	return S.list()
		.title("Studio")
		.items([
			singlePage("Home", "home", MdHome),
			div(),
			singlePage("About", "about", MdPerson2),
			pageList("Articles", "article", MdArticle),
			div(),
			pageList("Pages", "page", MdPages),
			pageList("Socials", "socials", IoShareSocial),
			div(),
			folder("Global Layout", RiLayoutMasonryFill, [
				singlePage("Header", "settings.header", RiLayoutTop2Line),
				singlePage("Footer", "settings.footer", RiLayoutBottom2Line),
			]),
			pageList("Social Networks", "socialNetworks", IoShareSocial),
			div(),
			singlePage("Global SEO", "seoDefaults", AiOutlineFileSearch),
			folder("Schema Markup", MdFolder, [
				singlePage(
					"Schema Markup Defaults",
					"schemaMarkupDefaults",
					MdSettingsSuggest,
				),
				div(),
				pageList("People", "schemaMarkupPerson", MdPerson),
				pageList("Organizations", "schemaMarkupOrganization", MdBusiness),
			]),
			div(),
			folder("Settings", MdSettings, []),
		]);
};
