import {uuid} from '@sanity/uuid'
import {BlockContentFeatures, htmlToBlocks} from '@sanity/block-tools'
import {slugify} from './string'
import {JSDOM} from 'jsdom'
import {FieldsetDefinition, SanityClient} from 'sanity'
import {existsSync, readFileSync, lstatSync} from 'fs'
import {Schema} from '@sanity/schema'
import {handleShortcodes} from './wordpress'

type ConnectedReferenceCreator = {
  docType: string
  fieldName: string
  fieldValue: string | string[]
  client: SanityClient
}

export type ShortcodeHandler = {
  [key: string]: RegExp
}

type BlockRulesCallback = {
  [key: string]: (el: any, next: any, block: BlockContentFeatures) => any
}

type BlockRulesWithCondition = {
  condition: (el: any, next: any, block: any) => boolean
  callback: BlockRulesCallback
}

type CleanupRule = {[key: string]: RegExp}

type RichTextFromHtmlFunction = {
  content: string
  fieldName: string
  shortcodes?: ShortcodeHandler
  docType: string
  blockFields?: FieldsetDefinition[]
  blockRules?: BlockRulesCallback | BlockRulesWithCondition
  cleanupRules?: CleanupRule
}

type AssetCreatorFunction = (path: string, schema: any, fieldName?: string) => {}

// takes string or string array and turns it into paragrpahs of rich text
export const stringToPortableText = (text: string | string[]) => {
  const isArray = Array.isArray(text)

  if (isArray) {
    return text.map((t) => {
      return {
        _type: 'block',
        _key: uuid(),
        children: [
          {
            _type: 'span',
            marks: [],
            text: t,
          },
        ],
        markDefs: [],
        style: 'normal',
      }
    })
  } else {
    return [
      {
        _type: 'block',
        _key: uuid(),
        children: [
          {
            _type: 'span',
            marks: [],
            text,
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ]
  }
}

// create array from data, adds _key field that Sanity needs
export const createArray = (data: any[]) => {
  return data.map((item) => {
    return {
      _key: uuid(),
      ...item,
    }
  })
}

export const getExisitingDocumentId = (docType: string, fieldName: string, fieldValue: string) => {
  if (!docType || !fieldName || !fieldValue) {
    console.log(`⚠️ Invalid doc type, field name, or field value provided, skipping field`)
    return null
  }

  return {
    FIELD_NAME: fieldName,
    RESOLVE: 'documentID',
    FIELD_VALUE: fieldValue,
    DOC_TYPE: docType,
  }
}

// Takes a UUID and returns a reference object
export const createSimpleReference = (ref: string | string[]) => {
  if (!ref || ref === '') {
    console.log(`Invalid ref ${ref} provided, skipping field`)
    return null
  }

  const isArray = Array.isArray(ref)

  return isArray
    ? ref
        .filter((r) => r)
        .map((r) => {
          return {
            _type: 'reference',
            _ref: r,
            _key: uuid(),
          }
        })
    : {
        _type: 'reference',
        _ref: ref,
      }
}

type LiveReferenceCreator = {
  docType: string
  fieldName: string
  fieldValue: string | string[]
  weak?: boolean
  outputArray?: boolean
  maintainOrder?: boolean
}

export const createReference = ({
  fieldName,
  docType,
  fieldValue,
  weak,
  outputArray = false,
  maintainOrder = false,
}: LiveReferenceCreator) => {
  if (!fieldName) {
    console.log(`⚠️ Invalid field name: ${fieldName} provided, skipping field`)
    return null
  } else if (!docType) {
    console.log(`⚠️ Invalid doc type: ${docType} provided, skipping field`)
    return null
  } else if (!fieldValue) {
    console.log(`⚠️ Invalid value: ${fieldValue} provided, skipping field`)
    return null
  }

  return {
    RESOLVE: 'reference',
    DOC_TYPE: docType,
    FIELD_NAME: fieldName,
    FIELD_VALUE: fieldValue,
    IS_WEAK: weak,
    MAINTAIN_ORDER: maintainOrder,
    OUTPUT_ARRAY: outputArray,
  }
}

export const createDate = (date: string) => {
  if (!new Date(date)) {
    console.log(`Invalid date ${date} provided, skipping field`)
  }
  return new Date(date).toISOString()
}

export const createSlug = (slug: string) => {
  if (typeof slug !== 'string') {
    console.log(`Invalid slug ${slug} provided, skipping field`)
  }
  return {current: slugify(slug)}
}

const applyCleanupRules = (content: string, cleanupRules: CleanupRule = {}) => {
  if (typeof cleanupRules === 'object' || Object.keys(cleanupRules)?.length > 0) {
    const totalRules = Object.keys(cleanupRules).length

    Object.entries(cleanupRules).map(([name, matcher]) => {
      if (!matcher.toString().endsWith('g') && !matcher.toString().endsWith('gm')) {
        console.log(
          `ℹ️ Shortcode "${name}" is missing the global flag. Please add g or gm to the end of the regex. This is required for .replaceAll() to work.`,
        )
      }

      content = content.replaceAll(matcher, '')
    })
  }

  return content
}

export const createConnectedReference = async ({
  docType,
  fieldName,
  fieldValue,
  client,
}: ConnectedReferenceCreator) => {
  if (!fieldValue) {
    console.log(`Invalid value ${fieldValue} provided, skipping field`)
    return null
  }

  const getReferencedDocuments = async () => {
    const documents = await client.fetch(`*[_type == "${docType}"]{${fieldName},_id}`)
  }

  //
}

export const createPortableTextFromHtml = ({
  content,
  docType,
  fieldName,
  shortcodes,
  blockFields,
  blockRules = {},
  cleanupRules,
}: RichTextFromHtmlFunction) => {
  content = applyCleanupRules(content, cleanupRules)

  if (!blockFields) {
    console.log(`⚠️ No block fields provided, skipping field`)
    return null
  }

  const hasBlockRules = blockRules && Object.entries(blockRules)?.length > 0

  if (typeof shortcodes === 'object' && Object.keys(shortcodes)?.length > 0) {
    content = handleShortcodes(shortcodes, content)
  }

  // Faux schema to compile the block fields
  const schema = Schema.compile({
    name: docType,
    types: [
      {
        name: fieldName,
        type: 'object',
        fields: [
          {
            name: fieldName,
            type: 'array',
            of: blockFields,
          },
        ],
      },
    ],
  })

  const blockContentType = schema
    .get(fieldName)
    .fields.find((field: any) => field.name === fieldName).type

  // Content that has been converted to HTML and used the provided rules

  const transformedContent = htmlToBlocks(content, blockContentType, {
    parseHtml: (html) => new JSDOM(html).window.document,
    rules: hasBlockRules
      ? [
          {
            deserialize(el, next, block) {
              // console.log(el.tagName)
              if (hasBlockRules) {
                // console.log('🌐 CONTENT TEXT ------------------------')

                // if (el.textContent?.includes('youtube.com')) {
                //   console.log(el.tagName)
                // }
                // if (isBlockRulesFunction) {
                // return blockRules(el, next, block) as BlockRulesCallback
                // } else {
                // Is an object of functions
                for (const [htmlTag, transformer] of Object.entries(blockRules)) {
                  if (typeof transformer === 'function') {
                    if (el?.tagName === htmlTag.toUpperCase()) {
                      const v = transformer(el, next, block)
                      // Used in rich text image resolvers
                      if (v?.SCHEMA) {
                        const b = block({
                          _key: uuid(),
                          PATH: v.PATH,
                          ...v.SCHEMA,
                        })
                        return b
                      } else if (v) {
                        return v
                      }
                    }
                  } else if (transformer?.callback) {
                    const {condition, callback} = transformer as BlockRulesWithCondition
                    if (transformer.condition(el, next, block)) {
                      typeof condition === 'function'
                        ? condition(el, next, block) && callback(el, next, block)
                        : callback(el, next, block)
                    }
                  } else {
                    console.warn(
                      `⚠️ Invalid block rule provided for tag: ${htmlTag}. A rule must be a function that returns a block or an object with a condition and callback function.`,
                    )
                  }
                }
                // }
              }
            },
          },
        ]
      : [],
  })

  return transformedContent
}

export const createUrl = (path: string) => {
  // wordpress does these a bunch
  if (path?.startsWith('//')) {
    path = `https:${path}`
  } else {
    return path
  }

  return path
}

export const createAsset = (
  path: string,
  schema: any,
  fieldName?: string,
): AssetCreatorFunction => {
  let d = {}

  // Checks if it exists, AND if it's a file, if a path has some random fucking slash in the wrong spot it will try to hit a directory, and thats not supported for obvious reasons.
  if (existsSync(path) && lstatSync(path).isFile()) {
    d = {
      PATH: path,
      SCHEMA: schema,
      FIELD_NAME: fieldName,
    }
  } else {
    console.log(`📁😥 File doesn't exist:`, path)
    console.log(path)
  }

  return d as any
}

export const getContentFromFile = (path: string) => {
  if (existsSync(path)) {
    // read file
    const data = readFileSync(path, 'utf-8')
    return data
  } else {
    console.log(`📁😥 File doesn't exist:`, path)
  }
}
