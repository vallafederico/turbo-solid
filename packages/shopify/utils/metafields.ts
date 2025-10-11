import type { Metafield } from '../types'

export const metafieldByName = (
	metafields: Metafield[],
	name: string,
	// excludeUndefined = false,
) => {
	const filteredMetafields = metafields?.filter((m) => m)

	// if (excludeUndefined) {
	// 	const fields = {}
	// 	Object.values(filteredMetafields).forEach((metafield) => {
	// 		if (metafield.key === name) {
	// 			fields[metafield.key] = metafield
	// 		}
	// 	})

	// 	return fields
	// }

	return filteredMetafields?.find((m) => m.key === name)
}
