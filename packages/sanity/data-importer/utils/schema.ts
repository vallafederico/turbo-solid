import {Schema} from '@sanity/schema'
import blockContent from '../../schemas/blocks/blockContent'
const BLOCK_CONTENT_TYPE = blockContent.of

export const createDefaultSchema = (schemaName: string, otherName: string) => {
  // console.log('Creating default schema...')
  const schema = Schema.compile({
    name: schemaName,
    types: [
      {
        type: 'object',
        name: otherName,
        fields: [
          {
            title: 'Body',
            name: 'body',
            type: 'array',
            of: BLOCK_CONTENT_TYPE,
          },
        ],
      },
    ],
  })

  // console.log('finding block content type')
  const blockContentType = schema.get(otherName).fields.find((field) => field.name === 'body').type

  // console.log('Compiled default schema:', schema)

  return {blockContentType, schema}
}
