import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { groqStore, type GroqStore } from "@sanity/groq-store";
import { SANITY } from "../../../config";
import SanityEventSource from "@sanity/eventsource";

type MaybeAccessor<T> = T | (() => T);
function get<T>(v: MaybeAccessor<T>): T {
	return typeof v === "function" ? (v as () => T)() : v;
}

type LiveOpts<T> = {
	initial?: MaybeAccessor<T | null>;
	params?: MaybeAccessor<Record<string, unknown>>;
	transform?: (v: T) => Promise<T> | T;
	onError?: (e: unknown) => void;
};

declare global {
	interface Window {
		__SANITY_PREVIEW_TOKEN__?: string;
	}
}

let _store: GroqStore | null = null;
function getStore() {
	if (_store) return _store;

	const token =
		"skt5KY1LA2BbW1KNvuFZuSfIpJdertZhUTMGjnIBomnNFsxxl9NuIKXE090jUHcRH6ergamfx89RxXEUPN6T3samP8f4tLc7tntSGwgxejciCu2S8pTm2oSSKUWu3xKGPscCSAcc5sLqy5KZcJZpUXp6qUN5OcSTqAW20R1fXJlp47dyBIQM";

	// We use a minimal ES class just to inject the Authorization header
	class ESWithToken extends (SanityEventSource as {
		new (
			url: string,
			init?: EventSourceInit & { headers?: Record<string, string> },
		): EventSource;
	}) {
		constructor(
			url: string,
			init?: EventSourceInit & { headers?: Record<string, string> },
		) {
			super(url, {
				...init,
				headers: { ...(init?.headers || {}), Authorization: `Bearer ${token}` },
			});
		}
	}
	// note: groqStore only uses .prototype.CLOSED/OPEN/CONNECTING if necessary, usually for browser compatibility

	_store = groqStore({
		...SANITY,
		token,
		listen: true,
		EventSource: ESWithToken,
		overlayDrafts: true,
		documentLimit: 10000,
	});
	return _store;
}

export function useLiveQuery<T = unknown>(
	query: MaybeAccessor<string | undefined>,
	opts: LiveOpts<T> = {},
) {
	const [data, setData] = createSignal<T | null>(
		(get(opts.initial) ?? null) as T | null,
	);
	const [loading, setLoading] = createSignal<boolean>(false);

	const q = createMemo<string | undefined>(() => {
		const v = get(query);
		return typeof v === "string" && v.trim() ? v : undefined;
	});
	const p = createMemo<Record<string, unknown>>(() => get(opts.params) ?? {});

	createEffect(() => {
		if (!q()) return;
		setLoading(true);

		const store = getStore();
		const tx = async (v: T) => (opts.transform ? await opts.transform(v) : v);

		let unsub: (() => void) | undefined;

		// Initial fetch to fill from the store cache
		store.query<T>(q() as string, p()).then(
			async (result) => {
				const transformed = await tx(result);
				setData(() => transformed);
				setLoading(false);
			},
			(err) => {
				opts.onError?.(err);
				setLoading(false);
			},
		);

		console.log({
			q: q(),
			p: p(),
		});

		// Live subscription
		const sub = store.subscribe<T>(
			`*[_type == "home"][0]`,
			{},
			(err, result) => {
				console.log("result", result);
				console.log("err", err);
				setData(() => result);
				// opts.onError?.(err);
			},
		);
		unsub = () => sub.unsubscribe();

		onCleanup(() => {
			unsub?.();
		});
	});

	return { data, loading };
}
