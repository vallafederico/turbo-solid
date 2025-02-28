import {BaseMutationOptions, SanityClient} from '@sanity/client'
import {resolveDocumentsAndAssets} from './assets'
import {splitRequests} from './size-throttling'
import {uuid} from '@sanity/uuid'
import {Timer} from './timer'
import {cleanupExtraneousNodes} from './cleanup'
import {confirm} from '@inquirer/prompts'
import boxen from 'boxen'
import {writeFileSync} from 'fs'

const timer = new Timer()

export type DocumentMode = 'create' | 'patch' | 'createOrReplace' | 'createIfNotExists'

type DocumentPrepareFunction = {
  data: Object[]
  callback: Function
}

type DocumentSubmitFunction = {
  promises: Promise<Object[]>[]
  downloadOutput?: string | null
  client: SanityClient
  mode?: DocumentMode
  documentType: string
  onComplete?: Function
  dryRun?: boolean
  unsetFields?: string[]
}

type ClearOldDataFunction = {
  documentType: string
  clearPastUpload: boolean
  client: SanityClient
}

export type DocumentCreationFunction = {
  data: Object[]
  callback: Function
  client: SanityClient
  mode?: DocumentMode
  documentType: string
  filter?: (doc: any) => boolean
  clearPastUpload?: boolean
  limit?: number | [number, number]
  onComplete?: Function
  unsetFields?: string[]
  downloadOutput?: string | null
}

type LogProgressFunction = {
  index: number
  total: number
  message: string
}

const addInternalFieldsIfMissing = (doc: any, docType: string) => {
  return {
    _type: docType,
    // _id: uuid(),
    ...doc,
  }
}

export const downloadOutputFile = (data: any, path: string) => {
  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  writeFileSync(
    `${path}/import-output-${new Date().toISOString()}.json`,
    JSON.stringify(data, null, 2),
  )

  console.log(`💾 Downloaded output to ${path}/import-output-${new Date().toISOString()}.json`)
}

export const logProgress = ({index, total, message}: LogProgressFunction) => {
  const percentage = Math.ceil(((index + 1) / total) * 100) + '%'

  console.log(`${message}`, `${index + 1}/${total} (${percentage})`)
}

export const prepareDocuments = ({data, callback}: DocumentPrepareFunction) => {
  const promises = [] as Promise<Object[]>[]

  data.map((item, index) => {
    const total = data?.length
    logProgress({index, total, message: 'Preparing documents...'})
    const doc = callback(item)
    promises.push(doc)
  })

  return promises
}

// Resolve all promises and create docs
export const submitDocuments = async ({
  promises,
  client,
  mode,
  documentType,
  onComplete,
  unsetFields = [],
  downloadOutput = null,
  dryRun = false,
}: DocumentSubmitFunction) => {
  let progress = 0
  let documentOutput = []
  const resolvedDocuments = await Promise.all(promises)

  let docsWithAssets = await (await resolveDocumentsAndAssets(resolvedDocuments)).filter((d) => d)

  // if (mode === 'patch') {
  //   console.log('✂️ Filtering only existing documents from::')
  //   docsWithAssets = docsWithAssets.filter((d) => d._id)
  // }
  console.log('🧹 Cleaning up extraneous nodes...')
  docsWithAssets.map((doc) => {
    cleanupExtraneousNodes(doc)

    if (doc.thumbnail?.asset) {
      // console.log(doc.thumbnail)
    } else {
      delete doc.thumbnail
    }

    return doc
  })

  const {requestChunks, requestCount, chunkSize, totalSize} = splitRequests(docsWithAssets)

  requestChunks.map((chunk, i) => {
    // const chunkSize = chunk.length
    // const chunkTotal = docsWithAssets.length
    // const chunkProgress = i * chunkSize

    console.log(`📦 Created Chunk ${i + 1}/${requestCount}`)
    const chunkPromises = chunk.map(async (doc, index) => {
      if (typeof doc._id !== 'string') {
        // console.log('🔍 Found existing document:', doc._id)
        delete doc._id
      }
      const d = addInternalFieldsIfMissing(doc, documentType)

      if (!d._id) {
        d._id = uuid()
      }

      if (downloadOutput) {
        documentOutput.push(d)
      }

      let func
      let transactionOptions = {
        dryRun,
      } as BaseMutationOptions

      switch (mode) {
        case 'patch':
          func = client.patch(d._id).set(d)
          if (unsetFields.length > 0) {
            func = func.unset(unsetFields)
            console.log('🔥 Unsetting fields:', unsetFields)
          }
          break
        case 'createOrReplace':
          func = client.transaction().createOrReplace(d)
          break
        case 'createIfNotExists':
          func = client.transaction().createIfNotExists(d)
          break
        default:
          func = client.transaction().create(d)
      }

      await func
        .commit(transactionOptions)
        .then((e) => {
          logProgress({
            index: progress,
            total: docsWithAssets.length,
            message: '🟢 Uploaded document:',
          })
          progress++

          if (progress === docsWithAssets.length) {
            timer.stop()
            console.log(
              `🎉 ${docsWithAssets.length} documents sucessfully uploaded in ${timer.getDelta(true)}`,
            )
          }
        })
        .catch((err: Error) => {
          console.log(
            boxen(`🚨 Error on document ${index}: ${err}`, {
              padding: 1,
              borderColor: 'red',
              borderStyle: 'double',
            }),
          )
        })
    })

    if (downloadOutput) {
      downloadOutputFile(documentOutput, downloadOutput)
    }

    return Promise.allSettled(chunkPromises).then(() => {
      if (typeof onComplete === 'function') {
        console.log('🔄 Running onComplete function...')
        onComplete()
      }
    })
  })

  return Promise.resolve(requestChunks)
}

export const createDocuments = async ({
  data,
  callback,
  mode = 'create',
  filter = () => true,
  documentType,
  clearPastUpload,
  client,
  unsetFields = [],
  limit,
  downloadOutput = false,
  onComplete,
}: DocumentCreationFunction) => {
  let shouldClear = clearPastUpload

  if (mode !== 'create') {
    shouldClear = false
  }

  if (!client) {
    throw new Error('property "client" is required')
  }

  if (!documentType) {
    throw new Error('property "documentType" is required')
  }

  if (typeof callback !== 'function') {
    throw new Error('funtion property "callback" is required')
  }

  if (!data || !data.length) {
    throw new Error(
      `property "data" should be an array with at least one item, got: ${typeof data}`,
    )
  }

  const processData = async () => {
    data = data.filter((d) => filter(d))

    console.log('🔄 Starting document creation...')
    timer.start()

    const hasLimitArray = Array.isArray(limit)

    let dataToProcess = limit
      ? data.slice(hasLimitArray ? limit[0] : 0, hasLimitArray ? limit[1] : limit)
      : data

    await clearOldData({documentType, clearPastUpload: shouldClear, client})
    const promises = prepareDocuments({data: dataToProcess, callback})

    return await submitDocuments({
      promises,
      client,
      documentType,
      mode,
      onComplete,
      unsetFields,
      downloadOutput,
    }).then(() => {
      console.log(`🪄 Successfully created ${promises.length} / ${dataToProcess.length} documents`)
      console.log('Uploading...')
    })
  }

  if (shouldClear) {
    return await confirm({
      message: `Clear old data is enabled. This will remove all existing ${documentType} documents. Do you wish to continue with this setting? (Selecting no will abort the import)`,
    }).then(async (answer) => {
      shouldClear = answer
      if (shouldClear) {
        return await processData()
      } else {
        console.log('❌ Import aborted')
        process.exit(0)
      }
    })
  } else {
    return await processData()
  }
}

export async function clearOldData({documentType, clearPastUpload, client}: ClearOldDataFunction) {
  if (clearPastUpload) {
    console.log(`⌛ Clearing old '${documentType}' documents...`)
    return client.delete({query: `*[_type == "${documentType}"]`}).then((res) => {
      console.log(`🔥 Deleted ${res?.results?.length} old ${documentType} documents`)
    })
  } else {
    return Promise.resolve()
  }
}
