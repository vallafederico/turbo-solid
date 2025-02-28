import { Link, Meta, Title } from '@solidjs/meta'

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
	return (
		<>
			<Title>
				{siteTitle} | {title}
			</Title>
			<Meta name="description" content={description} />
			{/* Open Graph */}
			<Meta property="og:title" content={title} />
			<Meta property="og:description" content={description} />
			{/* <Meta property="og:image" content={image} /> */}
			{/* Twitter */}
			<Meta property="twitter:card" content="summary_large_image" />
			<Meta property="twitter:title" content={title} />
			<Meta property="twitter:description" content={description} />

			<Link rel="icon" href="/favicon.ico" />
	

			{/* <Meta property="twitter:image" content={image} /> */}
		</>
	)
}
