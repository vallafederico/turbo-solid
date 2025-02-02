// append
import pullquote from './pullquote'

import {createSliceSet} from '../../utils/create'
import richText from './richText'

const globalPageSlices = [pullquote, richText] as any[]

const slices = createSliceSet({
  name: 'pageSlices',
  title: 'Page Slices',
  slices: globalPageSlices,
})

export default [slices, ...globalPageSlices]
