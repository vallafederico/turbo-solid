import { MUX_ASSET_ID, MUX_PLAYBACK_ID } from "../fixture";
import { mockSentence, mockWords } from "./text";

// Mock a Contentful-style image asset object
export const mockImage = (options?: {
	width?: number;
	height?: number;
	url?: string;
}) => ({});

export const mockMux = () => ({
	assetId: MUX_ASSET_ID,
	playbackId: MUX_PLAYBACK_ID,
	created_at: 1715000000,
	updated_at: 1715000000,
	ready: true,
});
