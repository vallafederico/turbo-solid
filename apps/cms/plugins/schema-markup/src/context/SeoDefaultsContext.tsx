import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import { useClient } from "sanity";

const SeoDefaultsContext = createContext(null);

export const SeoDefaultsProvider = ({ children }) => {
	const client = useClient({ apiVersion: "2024-10-01" });
	const [defaults, setDefaults] = useState(null);

	const cleanup = useCallback(() => {
		// return function for useEffect cleanup
		if (cleanup.sub) {
			cleanup.sub.unsubscribe();
		}
	}, []);

	useEffect(() => {
		const sub = client
			.listen(`*[_type == "seoDefaults"][0]`)
			.subscribe((update) => {
				if (update.result) setDefaults(update.result);
			});
		cleanup.sub = sub;

		client.fetch(`*[_type == "seoDefaults"][0]`).then(setDefaults);

		return cleanup;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [client]); // cleaner will always be memoized since callback ref

	return (
		<SeoDefaultsContext.Provider value={defaults}>
			{children}
		</SeoDefaultsContext.Provider>
	);
};

export const useSeoDefaults = () => useContext(SeoDefaultsContext);
