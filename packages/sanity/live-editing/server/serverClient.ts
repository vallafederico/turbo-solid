'use server'

import client from "../../client"

const serverClient = client.withConfig({
	apiVersion: '2025-01-11',
	useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl: 'http://localhost:3000',
  }
})

export default serverClient
