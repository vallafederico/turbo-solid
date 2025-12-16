import { MUX_ASSET_ID, MUX_PLAYBACK_ID } from "../fixture";

// // Mock a Contentful-style image asset object
// export const mockImage = (options?: {
// 	width?: number;
// 	height?: number;
// 	url?: string;
// }) => ({
// 	title: mockWords(),
// 	description: mockSentence(),
// 	file: {
// 		url: options?.url || CONTENTFUL_IMAGE_URL,
// 		details: {
// 			size: 102400,
// 			image: {
// 				width: options?.width ?? 1200,
// 				height: options?.height ?? 800,
// 			},
// 		},
// 		fileName: "mock-image.jpg",
// 		contentType: "image/jpeg",
// 	},
// });

// export const mockIcon = () => mockImage({ url: CONTENTFUL_ICON_URL });

export const mockMux = () => ({
	assetId: MUX_ASSET_ID,
	playbackId: MUX_PLAYBACK_ID,
	created_at: 1715000000,
	updated_at: 1715000000,
	ready: true,
});
