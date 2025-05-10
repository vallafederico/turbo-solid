import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {media} from 'sanity-plugin-media'
import {structure} from './desk/structure'
import Logo from './components/Logo'
import {noteField} from 'sanity-plugin-note-field'
import {userGuidePlugin} from '@q42/sanity-plugin-user-guide'
import {vercelDeployTool} from 'sanity-plugin-vercel-deploy'
import {userGuideStructure} from './guides/userGuideStructure'

import {SANITY} from '../../config'
import {presentationTool} from 'sanity/presentation'

const sharedConfig = [
  structureTool({
    name: 'studio',
    title: 'Studio',
    structure,
  }),
  media(),
  noteField(),
  userGuidePlugin({userGuideStructure}),
  vercelDeployTool(),
  presentationTool({
    previewUrl: {
      origin: 'https://localhost:3000',
      previewMode: {
        enable: '/api/preview-enable',
        disable: '/api/draft-mode/disable',
      },
    },
  }),
]

const devConfig = [visionTool()]

export default defineConfig({
  ...SANITY,
  scheduledPublishing: {enabled: false}, // enable if client pays for this feature
  icon: Logo,
  plugins: [...sharedConfig, ...devConfig],
  schema: {
    types: schemaTypes,
  },
})
