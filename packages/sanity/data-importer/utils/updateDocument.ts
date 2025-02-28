import {SanityClient} from 'sanity'
import {limiter} from './assets'

type DocumentUpdateFunction = {
  client: SanityClient
  docType: string
  callback: (doc: any, index: number) => Object
  fields?: string
}

const getDocuments = async ({client, docType, fields = '...'}: DocumentUpdateFunction) => {
  const query = `*[_type == "${docType}"]{_id,${fields}}`

  return await client.fetch(query)
}

const submit = async ({client, document}) => {
  console.log('submitting', document)
  return await client
    .createOrReplace(document._id)
    .set(document)
    .commit()
    .then((updatedDoc) => {
      console.log('Update successful! New document:')
      console.log(updatedDoc)
    })
    .catch((err) => {
      console.error('Update failed: ', err.message)
    })
}

// export const updateDocuments = async ({
//   client,
//   docType,
//   fields,
//   callback,
// }: DocumentUpdateFunction) => {
//   const documents = await getDocuments({client, docType, fields})

//   const updatedPartials = documents
//     .map((doc: any, index: number) => {
//       return {_id: doc._id, ...callback(doc, index)}
//     })
//     .filter((partial: any) => Object.keys(partial).length > 1)

//   // await submitUpdatedDocuments({client, documents: updatedPartials})
//   // console.log('partials', updatedPartials)

//   const documentsToUpdate = updatedPartials.map((partial) =>
//     limiter.schedule(() => submit({client, document: partial})),
//   )

//   const x = await Promise.allSettled(documentsToUpdate)
// }
