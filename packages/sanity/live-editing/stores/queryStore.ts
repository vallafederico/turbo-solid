import { createSignal, createEffect } from 'solid-js'
import type { SanityClient } from '@sanity/client'
import type { QueryParams } from '@sanity/client'
import { isPreviewing } from './previewStore'

type QueryState<T = unknown, E = unknown> = {
  data: T | undefined
  error: E | undefined
  loading: boolean
}

const [serverClient, setServerClient] = createSignal<SanityClient | undefined>()
const [queryCache, setQueryCache] = createSignal<Record<string, QueryState>>({})

export const queryStore = {
  setServerClient: (client: SanityClient) => {
    setServerClient(client)
  },

  useQuery: <T, E = unknown>(
    query: string,
    params: QueryParams = {}
  ): QueryState<T, E> => {
    const key = `${query}-${JSON.stringify(params)}`
    const [state, setState] = createSignal<QueryState<T, E>>({
      data: undefined,
      error: undefined,
      loading: true
    })

    createEffect(() => {
      const client = serverClient()
      if (!client) return

      const fetchData = async () => {
        try {
          const result = await client.fetch<T>(query, params, {
            perspective: isPreviewing() ? 'previewDrafts' : 'published'
          })
          setState({ data: result, error: undefined, loading: false })
        } catch (error) {
          setState({ data: undefined, error: error as E, loading: false })
        }
      }

      fetchData()
    })

    return state()
  },

  loadQuery: async <T>(
    query: string,
    params: QueryParams = {}
  ): Promise<T> => {
    const client = serverClient()
    if (!client) throw new Error('No Sanity client configured')

    return client.fetch<T>(query, params, {
      perspective: isPreviewing() ? 'previewDrafts' : 'published'
    })
  }
} 