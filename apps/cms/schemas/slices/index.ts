import richText from './richText'
import header from './header'
import {createSliceSet} from '../../utils/create'
import richText from './richText'

const globalPageSlices = [richText, header, richText] as any[]

const slices = createSliceSet({
  name: 'pageSlices',
  title: 'Page Slices',
  slices: globalPageSlices,
})

export default [slices, ...globalPageSlices]
