import type {QueryParams} from '@sanity/client'
import type {QueryStore, QueryStoreState} from '@sanity/core-loader'
import isEqual from 'fast-deep-equal'
import {onMount, createSignal, createEffect, createMemo} from 'solid-js'
import {createStore} from 'solid-js/store'
import {defineStudioUrlStore} from './defineStudioUrlStore'
import type {UseQuery, UseQueryOptions} from './types'
// import {useEncodeDataAttribute} from './useEncodeDataAttribute'

export function defineUseQuery({
  createFetcherStore,
  studioUrlStore,
}: Pick<QueryStore, 'createFetcherStore'> & {
  studioUrlStore: ReturnType<typeof defineStudioUrlStore>
}): UseQuery {
  const DEFAULT_PARAMS = {}
  const DEFAULT_OPTIONS = {}
  return <QueryResponseResult, QueryResponseError>(
    query:
      | string
      | {
          query: string
          params?: QueryParams
          options?: UseQueryOptions<QueryResponseResult>
        },
    params: QueryParams = DEFAULT_PARAMS,
    options: UseQueryOptions<QueryResponseResult> = DEFAULT_OPTIONS,
  ) => {
    if (typeof query === 'object') {
      params = query.params || DEFAULT_PARAMS
      options = query.options || DEFAULT_OPTIONS
      query = query.query
    }

    const initial = options.initial
      ? {
          perspective: 'published' as const,
          ...options.initial,
        }
      : undefined

    const $params = JSON.stringify(params)

    // Core loader fetcher store
    const $fetcher = createFetcherStore<QueryResponseResult, QueryResponseError>(
      query,
      JSON.parse($params),
      initial,
    )

    // Create a signal to store the fetcher value
    const [state, setState] = createStore<QueryStoreState<QueryResponseResult, QueryResponseError>>(
      $fetcher.value
    )

    // Only subscribe on the client
    onMount(() => {
      return $fetcher.subscribe((snapshot) => {
        if (state.error !== snapshot.error) {
          setState(snapshot)
        }

        if (state.loading !== snapshot.loading) {
          setState(snapshot)
        }

        if (state.perspective !== snapshot.perspective) {
          setState(snapshot)
        }

        if (!isEqual(state.data, snapshot.data)) {
          setState(snapshot)
        }
      })
    })

    // Create a memo that combines state with studioUrl
    const result = createMemo(() => ({
      ...state,
      // encodeDataAttribute: useEncodeDataAttribute(state.data, state.sourceMap, studioUrlStore),
    }))

    return result
  }
}