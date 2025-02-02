// import f

import {FunctionComponent} from 'react'
import {TbSection} from 'react-icons/tb'
import {CardTone} from '@sanity/ui'

export const createField = (name: string, type?: string, title?: string, extra?: any) => {
  return {
    name,
    type,
    title,
    ...extra,
  }
}

type TaxoCreatorFunction = {
  name: string
  title: string
  fields: Array<object>
  extra?: {[key: string]: any}
}

export const createTaxo = ({name, title, fields, icon, ...extra}: TaxoCreatorFunction) => {
  return {
    name,
    title,
    type: 'document',
    fields: [...fields],
    icon,
    ...extra,
  }
}

type SliceSetCreatorFunction = {
  name: string
  title: string
  slices: Array<object> | Set<object>
  description?: string
  options?: object
  isLocked?: boolean
  components?: {
    input?: FunctionComponent
    preview?: FunctionComponent
    item?: FunctionComponent
  }
}

const sortAlpha = (a: any, b: any) => {
  if (!a.name || !b.name) return false
  return a.name.localeCompare(b.name)
}

const dedupe = (slices: any[]) => {
  return [...new Set(slices)]
}

const organizeSlices = (slices: any[]) => {
  const sortedAlpha = slices
    .sort((a, b) => sortAlpha(a, b))
    .map((slice) => ({
      type: slice.name,
      icon: slice.icon || TbSection, // Default the icon to this if there isnt one
      // components: {
      //   item: SliceItem,
      // },
    }))

  return dedupe(sortedAlpha) as any[]
}

export const createSliceSet = ({
  name,
  title = 'Page Slices',
  slices = [],
  description = 'Each section of the page can be edited here',
  isLocked,
  ...rest
}: SliceSetCreatorFunction) => {
  return {
    name,
    title,
    // components: {
    //   input: isLocked && LockedArrayInput,
    // },
    description,
    type: 'array',
    of: slices?.length > 0 ? [...organizeSlices(slices)] : [],
    ...rest,
    options: {
      insertMenu: {
        views: [
          {
            name: 'grid',
            // also takes a {groups} array of strings
            previewImageUrl: (schemaTypeName: string) =>
              `/static/slice-images/${schemaTypeName}.png`,
          },
        ],
      },
    },
  }
}

type NoteCreateorFunction = {
  title?: string
  description: string
  icon?: FunctionComponent
  tone?: CardTone
  rest?: any
}

export const createNote = ({
  title,
  description,
  icon,
  tone = 'primary',
  ...rest
}: NoteCreateorFunction) => {
  return {
    name: 'note',
    title,
    type: 'note',
    description,
    options: {
      icon,
      tone,
    },
    ...rest,
  }
}
