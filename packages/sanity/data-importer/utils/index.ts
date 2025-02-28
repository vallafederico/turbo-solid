import {uuid} from '@sanity/uuid'
import {JSDOM} from 'jsdom'
import {htmlToBlocks} from '@sanity/block-tools'

import {createDefaultSchema} from './schema'


export const getArrayFromList = (list: string, seperator = '|') => {
  return list.split(seperator).map((item) => item.trim())
}


export const getFile = (file) => {
  return {
    asset: {
      _ref: file,
      _type: 'reference',
    },
  }
}

export const getRichContent = (content, schemaName = 'cruisePage', fieldName = 'content') => {
  var altArray
  // typeof alts === 'string' && alts.length > 0 ? (altArray = alts.split('||')) : altArray === null
  // const nestedSchema = Schema.compile(listType)
  // console.log('creating default schema...')
  // const defaultSchema = Schema.compile(CRUISE_SCHEMA_TYPE)
  // console.log('compiled default scahema:', defaultSchema)
  // const blockContentType = defaultSchema
  //   .get('body')
  //   .fields.find((field) => field.name === 'blockContent').type

  const {blockContentType, schema} = createDefaultSchema(schemaName, fieldName)

  // console.log({blockContentType, schema})

  var imageIndex = -1 // Use this index to grab from alt array

  const transformedContent = htmlToBlocks(content, blockContentType, {
    parseHtml: (html) => new JSDOM(html).window.document,
    rules: [
      {
        deserialize(el, next, block) {
          // if (el.tagName === 'IMG') {
          //   imageIndex + 1
          //   const fileSeek = el.src
          //     .replace('https://schmidtocean.org/wp-content/uploads/', '')
          //   const image = generateImage(fileSeek, altArray, imageIndex)
          //   return block({
          //     image: image,
          //     _key: uuid(),
          //     caption: '',
          //     _type: 'imageCaption',
          //   })
          // }
          // if (el.tagName === 'BLOCKQUOTE') {
          //   return block({
          //     _key: uuid(),
          //     credit: '',
          //     _type: 'quote',
          //     body: el.textContent,
          //   })
          // }
        },
      },
    ],
  })
  return transformedContent
}
