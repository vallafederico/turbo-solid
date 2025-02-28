import {AsyncWalkBuilder, deepCopy, WalkBuilder} from 'walkjs'
import {createReadStream} from 'fs'
import {client} from './client'
import Bottleneck from 'bottleneck'
import {basename} from 'path'
import {API_LIMIT_PER_SECOND} from './config'
import {resolveReferences} from './references'
import boxen from 'boxen'

export const limiter = new Bottleneck({
  minTime: (1 / API_LIMIT_PER_SECOND) * 1000,
  maxConcurrent: API_LIMIT_PER_SECOND,
})

const getResolverMode = (fileName: string) => {
  const isImage = /\.(gif|jpe?g|png|webp|svg)$/i.test(fileName)
  return isImage ? 'image' : 'file'
} // should be changed to not use filename and instead tagged earlier in the process

const getAssetPromises = (doc: any) => { 
  const promises = []
}

export const resolveAsset = async (doc: any) => {
  // Modification only, just returns the doc post-modification after the walking is finished
  await new AsyncWalkBuilder()
    .withGraphMode('graph')
    .withGlobalFilter((node) => node?.val?.PATH)
    .withSimpleCallback(async (masterNode) => {
      const {PATH, SCHEMA, FIELD_NAME} = masterNode?.val
      const RESOLVER_MODE = getResolverMode(PATH)

      const fileName = basename(PATH)
      console.log('◌ Uploading: ', fileName)

      await client.assets
        .upload(RESOLVER_MODE, createReadStream(PATH), {
          filename: fileName,
        })
        .then((fileAsset) => {
          console.log('✔️ Uploaded:', ' ', fileName)
          const ASSET_ID = fileAsset._id

          let schemaCopy = deepCopy(SCHEMA) // If this isnt deep copied, the root SCHEMA object is mutated

          if (FIELD_NAME) {
            new WalkBuilder()
              .withGlobalFilter((node) => node?.val?._ref === '{{ASSET_REF}}')
              .withSimpleCallback((node) => {
                node.val._ref = ASSET_ID
              })
              .walk(schemaCopy)

            masterNode.parent.val[FIELD_NAME] = schemaCopy
            // console.log(masterNode.parent?.val)
          } else {
            let s = deepCopy(schemaCopy)
            // If no field name is provided, just replace the file_REF with the asset ID
            new WalkBuilder()
              .withGlobalFilter((node) => node?.val?._ref === '{{ASSET_REF}}')
              .withSimpleCallback((node) => {
                // console.log(node.val)
                node.val._ref = ASSET_ID
              })
              .walk(masterNode.val)

            new WalkBuilder()
              .withGlobalFilter((node) => node?.val?.['SCHEMA'])
              .withSimpleCallback((node) => {
                // console.log(node.val)
                // node.val._ref = ASSET_ID
                const sch = node.val?.['SCHEMA']
                if (sch && node.parent?.val) {
                  node.parent.val = {...node.parent.val, ...sch}
                }
                // delete node.val['SCHEMA']

                // console.log(node.val)
              })
              .walk(masterNode.val)

            // console.log(masterNode.val)

            // const v = {...schemaCopy}
            // masterNode.val = schemaCopy

            // console.log('master node val::')
            // console.log(masterNode.parent?.val)
            // const v = {
            //   ...node.val,
            //   ...node.val.SCHEMA,
            // }

            // if (node.val.SCHEMA) {
            //   node.val = v
            // }
            // masterNode.parent.val = s
            // masterNode.val = s
          }
        })
        .catch((err) => {
          console.log(
            boxen(`Error uploading file: ${err}`, {
              padding: 1,
              borderColor: 'yellow',
            }),
          )
        })
    })
    .walk(doc)

  return doc
}

export const resolveDocumentsAndAssets = async (documents: any[]) => {
  console.log(' ')
  console.log('🌐 Resolving documents and assets')
  console.log(' ')

  const resolvedDocuments = await Promise.allSettled(
    documents.map((doc) => limiter.schedule(() => resolveAsset(doc))),
  )

  const settledDocs = await Promise.allSettled(
    resolvedDocuments.map((doc) =>
      limiter.schedule(() => resolveReferences({client, data: doc.value})),
    ),
  )

  settledDocs.forEach((d, i) => {
    if (d.status === 'rejected') {
      console.log(`Document #${i} rejected:`, i)
      console.log(d)
    }
  })

  // Return the settled docs if there are any, otherwise return the original documents
  return settledDocs?.length > 0 ? settledDocs.map((d) => d?.value) : documents
}
