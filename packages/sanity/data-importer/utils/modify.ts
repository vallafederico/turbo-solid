import {SanityClient} from 'sanity'

type ClearOldDataFunction = {
  documentType: string
  clearPastUpload: boolean
  client: SanityClient
}

export async function clearOldData({documentType, clearPastUpload, client}: ClearOldDataFunction) {
  if (!clearPastUpload) return Promise.resolve()

  return client.delete({query: `*[_type == "${documentType}"]`}).then((res) => {
    console.log(`🗑️ Deleted ${res?.results?.length} old documents:`)
  })
}
