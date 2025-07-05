import { clientOnly } from "@solidjs/start";
import {
	PortableText as PortableTextComponent,
	type PortableTextProps,
} from "@portabletext/solid";

export default function PortableText(props: PortableTextProps) {
	// Portable text cant render on the server, need to use client only
	return clientOnly(() => {
		return Promise.resolve({
			default: PortableTextComponent,
		});
	})(props);
}
