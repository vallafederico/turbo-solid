import { Link, Meta, Title } from '@solidjs/meta'
import { createAsync } from '@solidjs/router'
import { getDocumentByType } from '../utils/query'
import { Show } from 'solid-js'

interface SanityMetatagsProps {
	siteTitle?: string
	title: string
	description?: string
}

export default function SanityMetatags({
	siteTitle = '',
	title = '',
	description = '',
}: SanityMetatagsProps) {

	const globalMeta = createAsync(() => getDocumentByType('seo', {
		extraQuery: '[0]{siteTitle, description, siteUrl}',
	}))


	return (
		<>
			<Show when={globalMeta()}>
				{(data) => {
					console.log(data())

					const metaDescription = description || data().description
					const metaTitle = `${data().siteTitle} | ${title}`

					return (
						<>
							<Title>{metaTitle}</Title>
							<Meta name="description" content={metaDescription} />
							{/* Open Graph */}
							<Meta property="og:title" content={metaTitle} />
							<Meta property="og:description" content={metaDescription} />
							{/* <Meta property="og:image" content={image} /> */}
							{/* Twitter */}
							<Meta property="twitter:card" content="summary_large_image" />
							<Meta property="twitter:title" content={title} />
							<Meta property="twitter:description" content={metaDescription} />

							<Link rel="icon" href="/favicon.ico" />
						</>
				)
			}}
			</Show>
		</>
	)
}
