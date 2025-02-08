import {defineUserGuide, page} from '@q42/sanity-plugin-user-guide'
import {FaCode} from 'react-icons/fa'
import {MdHelp} from 'react-icons/md'
import Base from './Base'

export const userGuideStructure = defineUserGuide([
  page().title('Sanity Guide').documentType('sanity-general-guide').component(Base).icon(FaCode),

  page().title('Using Sanity').component(Base).icon(MdHelp),
])
