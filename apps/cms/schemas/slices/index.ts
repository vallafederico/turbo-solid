import richText from './richText'
import header from './header'
import formSlice from './formSlice'
import richText from './richText'
import formSlice from './formSlice'

import {createSliceSet} from '../../utils/create'

const globalPageSlices = [richText, header, formSlice, richText, formSlice] as any[]

const slices = createSliceSet({
  name: 'pageSlices',
  title: 'Page Slices',
  slices: globalPageSlices,
})

export default [slices, ...globalPageSlices]
