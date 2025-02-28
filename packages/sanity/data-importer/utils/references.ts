import {uuid} from '@sanity/uuid'
import {SanityClient} from 'sanity'
import {AsyncWalkBuilder} from 'walkjs'
import {escapeDoubleQuotes} from './string'

const maintainOrder = (originalArray: string[], newArray: any[], orderField: string) => {
  const orderedArray = [] as any[]

  originalArray.forEach((item) => {
    const thing = newArray.find((newItem) => newItem[orderField] === item)
    orderedArray.push(thing)

    // console.log('item in maintainOrder:', item)
    // console.log('newItem in maintainOrder:', thing)
  })
  // console.log('ordering by filed:', orderField)

  return orderedArray?.filter((item) => item?._ref)
}

type ReferenceResolver = {
  client: SanityClient
  data: any
}

export const resolveReferences = async ({client, data}: ReferenceResolver) => {
  let resolveCount = {}
  await new AsyncWalkBuilder()
    .withGlobalFilter(
      (node) => node?.val?.RESOLVE === 'reference' || node.val?.RESOLVE === 'documentID',
    )
    .withGraphMode('graph')
    .withSimpleCallback(async (node) => {
      let query
      let newFieldValue
      const _key = node.key
      const {DOC_TYPE, MAINTAIN_ORDER, FIELD_VALUE, FIELD_NAME, IS_WEAK, OUTPUT_ARRAY, RESOLVE} =
        node.val
      const isReferenceArray = Array.isArray(FIELD_VALUE)

      const excludeDrafts = ` !(_id in path("drafts.**"))`

      if (RESOLVE === 'documentID') {
        try {
          const query = `*[_type == "${DOC_TYPE}" && ${FIELD_NAME} == "${FIELD_VALUE}"]{_id}`

          await client.fetch(query).then((doc) => {
            doc = Array.isArray(doc) ? doc[0] : doc

            // Leave empty if not resolved
            if (doc?._id) {
              node.parent.val._id = doc?._id
            }
          })
        } catch (e) {
          console.error(`🚨 Error resolving reference to '${DOC_TYPE}':`, e)
        }

        return
      } else {
        // Queries rely on double quotes, so any quotes in references need to be escaped
        if (isReferenceArray) {
          const va = FIELD_VALUE.filter((v) => v?.length > 0)
            .map((v) => `"${escapeDoubleQuotes(v)}"`)
            .join(', ')

          query = `*[_type == '${DOC_TYPE}' && ${FIELD_NAME} in [${va}] && ${excludeDrafts}]{_id,${MAINTAIN_ORDER ? FIELD_NAME : ''}}`
        } else {
          query = `*[_type == '${DOC_TYPE}' && ${FIELD_NAME} == "${escapeDoubleQuotes(FIELD_VALUE)}" && ${excludeDrafts}]{_id}`
        }

        try {
          const referencedDocs = await client.fetch(query).then((d) => {
            return d
          })

          switch (referencedDocs?.length) {
            case 0:
              delete node.parent.val[_key]
              return

            case 1:
              if (!referencedDocs[0]?._id) {
                break
              } else {
                newFieldValue = {
                  _type: 'reference',
                  _ref: referencedDocs[0]?._id,
                  _key: uuid(),
                  _weak: IS_WEAK,
                }
              }
              break
            default:
              const d = referencedDocs
                ?.filter((d: {_id: any}) => d?._id)
                .map((doc: any) => {
                  const d = {
                    _type: 'reference',
                    _ref: doc._id,
                    _key: uuid(),
                    _weak: Boolean(IS_WEAK),
                  }

                  if (doc[FIELD_NAME] && MAINTAIN_ORDER) {
                    d[FIELD_NAME] = doc[FIELD_NAME]
                  }

                  return d
                })

              // uses the order of the original array to maintain order and removes the FIELD_NAME used for keying afterwards
              newFieldValue = MAINTAIN_ORDER
                ? maintainOrder(FIELD_VALUE, d, FIELD_NAME).map((m) => {
                    if (m?.[FIELD_NAME]) {
                      delete m[FIELD_NAME]
                    }
                    return m
                  })
                : d

              break
          }

          if (!Array.isArray(newFieldValue) && OUTPUT_ARRAY === true) {
            newFieldValue = [newFieldValue]
          }

          if (!resolveCount[DOC_TYPE]) {
            resolveCount[DOC_TYPE] = 0
          } else {
            resolveCount[DOC_TYPE] = referencedDocs.length
          }

          if (node.parent?.val?.[_key]) {
            node.parent.val[_key] = newFieldValue
          }
        } catch (e) {
          console.log('query:', query)
          console.error(`🚨 Error resolving reference to '${DOC_TYPE}':`, e)
        }
      }
    })
    .walk(data)

  // if (Object.keys(resolveCount).length > 0) {
  //   Object.entries(resolveCount).forEach(([docType, count]) => {
  //     console.log(`🔄 Resolved ${count} references to type: ${docType}`)
  //   })
  // }

  return data
}
