import { defineType, defineField } from "sanity";

export const schemaMarkupEventFields = defineType({
	name: "schemaMarkupEventFields",
	title: "Event Fields",
	type: "object",
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({ name: "description", type: "text" }),
		defineField({
			name: "startDate",
			type: "datetime",
			validation: (r) => r.required(),
		}),
		defineField({ name: "endDate", type: "datetime" }),
		// defineField({
		// 	name: "eventStatus",
		// 	type: "string",
		// 	options: {
		// 		list: [
		// 			{ title: "Scheduled", value: "EventScheduled" },
		// 			{ title: "Cancelled", value: "EventCancelled" },
		// 			{ title: "Postponed", value: "EventPostponed" },
		// 			{ title: "Rescheduled", value: "EventRescheduled" },
		// 			{ title: "Moved Online", value: "EventMovedOnline" },
		// 		],
		// 	},
		// }),
		defineField({
			name: "eventAttendanceMode",
			type: "string",
			options: {
				list: [
					{ title: "Offline", value: "OfflineEventAttendanceMode" },
					{ title: "Online", value: "OnlineEventAttendanceMode" },
					{ title: "Mixed", value: "MixedEventAttendanceMode" },
				],
			},
		}),
		defineField({
			name: "location",
			title: "Location",
			type: "object",
			fields: [
				defineField({ name: "name", type: "string" }),
				defineField({ name: "url", type: "url" }),
				defineField({ name: "address", type: "schemaMarkupAddress" }),
				defineField({ name: "geo", type: "schemaMarkupGeo" }),
			],
		}),
		// defineField({
		// 	name: "image",
		// 	type: "jsonldImageObject",
		// }),
		// defineField({
		// 	name: "offers",
		// 	title: "Offers / Tickets",
		// 	type: "array",
		// 	of: [{ type: "jsonldOffer" }],
		// }),
		defineField({
			name: "organizer",
			title: "Organizer",
			type: "array",
			of: [
				{ type: "schemaMarkupOrganization" },
				{ type: "schemaMarkupPerson" },
			],
		}),
		defineField({
			name: "performer",
			title: "Performer(s)",
			type: "array",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
		}),
	],
	preview: {
		select: { title: "name", subtitle: "startDate" },
		prepare: ({ title, subtitle }) => ({ title: title || "Event", subtitle }),
	},
});
