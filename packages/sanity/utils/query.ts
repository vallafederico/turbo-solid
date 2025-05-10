import { createResource } from 'solid-js'
import type { SanityDocumentGetterOptions } from '../types'
import sanityClient from '../client'
import resolveLinks from './resolver'
import { createAsync, query } from '@solidjs/router'




export const getDocumentByType= async (
	documentType: string,
	options?: SanityDocumentGetterOptions,
) => {
	const { filter = '', extraQuery = '{...}', params = {} } = options || {}
	const q = `*[_type == "${documentType}" ${filter || ''}][0]${extraQuery || '{...}'}`

	const getter = async () => {
		const data = await sanityClient.fetch(q, params)
		await resolveLinks(data)
		return data
	}

	return getter()
}


export const getDocumentBySlug = (
	documentType: string,
	slug: string,
	options?: SanityDocumentGetterOptions,
) => {


	const { filter = '', extraQuery = '[0]{...}', params = {} } = options || {}
	const q = `*[_type == "${documentType}" && slug.current == "${slug}" ${filter || ''}]${extraQuery}`


	const getter = async () => {
		const data = await sanityClient.fetch(q, params)
		await resolveLinks(data)

		return data
	}

	return getter()
}
