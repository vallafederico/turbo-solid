import {SanityClient} from 'sanity'

export const getDocumentById = async (client: SanityClient, id: string) => {
  return client.getDocument(id)
}

export const getDocuments = async (client: SanityClient, query: string) => {
  return client.fetch(query)
}
