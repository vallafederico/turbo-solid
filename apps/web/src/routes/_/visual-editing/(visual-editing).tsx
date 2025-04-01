import { onMount } from 'solid-js'
import { useLiveMode } from '@local/sanity'
import sanityClient from '@local/sanity'

export default function VisualEditing() {
	onMount(() => useLiveMode({ client: sanityClient }))

	return <div class="mt-8">VisualEditing</div>
}
