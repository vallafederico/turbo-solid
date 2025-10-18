import {
	MdArticle,
	MdBusiness,
	MdEvent,
	MdPageview,
	MdQuestionAnswer,
	MdShoppingBag,
	MdWeb,
	MdPerson,
	MdStore,
	MdCreate,
	MdPeople,
	MdEmail,
} from "react-icons/md";

export const SCHEMA_MARKUP_TYPES = {
	AboutPage: { title: "AboutPage", value: "AboutPage", icon: MdPeople },
	ContactPage: { title: "ContactPage", value: "ContactPage", icon: MdEmail },
	Article: { title: "Article", value: "Article", icon: MdArticle },
	CreativeWork: {
		title: "CreativeWork",
		value: "CreativeWork",
		icon: MdCreate,
	},
	Event: { title: "Event", value: "Event", icon: MdEvent },
	FAQPage: { title: "FAQPage", value: "FAQPage", icon: MdQuestionAnswer },
	// BreadcrumbList: { title: "BreadcrumbList", value: "BreadcrumbList" },
	LocalBusiness: {
		title: "LocalBusiness",
		value: "LocalBusiness",
		icon: MdStore,
	},
	Organization: {
		title: "Organization",
		value: "Organization",
		icon: MdBusiness,
	},
	Person: { title: "Person", value: "Person", icon: MdPerson },
	Product: { title: "Product", value: "Product", icon: MdShoppingBag },
	WebPage: { title: "WebPage", value: "WebPage", icon: MdPageview },
	WebSite: { title: "WebSite", value: "WebSite", icon: MdWeb },
};
