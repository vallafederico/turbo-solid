import { onMount } from 'solid-js'
import { queryStore } from '../stores/queryStore'
import { setIsPreviewing } from '../stores/previewStore'
import client from '../../client'

export default function SanityLiveMode() {
	onMount(() => {
		// Set up the server client
		queryStore.setServerClient(client)

		// Check if we're in preview mode
		if (document.cookie.includes('preview=true')) {
			setIsPreviewing(true)
		}
	})

	return null
}
