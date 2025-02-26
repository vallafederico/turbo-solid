import pullquote from './pullquote'
import richText from './richText'

import {createSliceSet} from '../../utils/create'

const globalPageSlices = [pullquote, richText] as any[]

const slices = createSliceSet({
  name: 'pageSlices',
  title: 'Page Slices',
  slices: globalPageSlices,
})

export default [slices, ...globalPageSlices]
