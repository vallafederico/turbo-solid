import richText from './richText'
import header from './header'
import {createSliceSet} from '../../utils/create'
import formSlice from './formSlice'


const globalPageSlices = [richText, header, formSlice, richText, formSlice] as any[]

const slices = createSliceSet({
  name: 'pageSlices',
  title: 'Page Slices',
  slices: globalPageSlices,
})

export default [slices, ...globalPageSlices]
