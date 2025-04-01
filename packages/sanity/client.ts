import { createClient } from '@sanity/client'
import { SANITY } from '../../config'

const sanityClient = createClient({
	perspective: 'published',
	useCdn: false,
	apiVersion: '2025-01-11',
	...SANITY
})


export default sanityClient