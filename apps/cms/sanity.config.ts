import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {media} from 'sanity-plugin-media'
import {structure} from './desk/structure'
import {simplerColorInput} from 'sanity-plugin-simpler-color-input'
import Logo from './components/Logo'

import {SANITY} from '../../config'

export default defineConfig({
  ...SANITY,
  icon: Logo,
  plugins: [
    structureTool({structure}),
    visionTool(),
    media({
      creditLine: {
        enabled: true,
      },
    }),
    simplerColorInput({
      enableSearch: true,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
